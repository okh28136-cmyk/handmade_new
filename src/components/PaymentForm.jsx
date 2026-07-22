import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import Header from './Header';
import Footer from './Footer';
import './PaymentForm.css';
const PaymentForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 접근 권한 상태 (KCP 심사를 위해 임시로 true 처리. 심사 완료 후 false로 변경 필요)
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [passwordInput, setPasswordInput] = useState('');

  // URL에서 amount를 읽어오고, 없으면 KCP 심사용 기본값 1,000원으로 고정
  const [amount, setAmount] = useState(() => {
    const urlAmount = searchParams.get('amount');
    return urlAmount ? Number(urlAmount).toLocaleString('ko-KR') : '1,000';
  });
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // KCP 스크립트 동적 로딩 (옵션 A를 위한 표준 결제창 스크립트)
  useEffect(() => {
    if (!isAuthorized) return; // 권한이 있을 때만 KCP 스크립트 로드
    const script = document.createElement('script');
    // 실제 운영 KCP 스크립트 URL (P7547은 실결제 상점아이디이므로 운영서버 사용)
    script.src = 'https://spay.kcp.co.kr/plugin/kcp_spay_hub.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [isAuthorized]);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    // 보안을 위해 .env 환경변수에서 비밀번호를 가져옵니다. (없을 경우 대비 기본값 '1234')
    const correctPassword = import.meta.env.VITE_PAYMENT_PASSWORD || '1234';
    if (passwordInput === correctPassword) {
      setIsAuthorized(true);
    } else {
      alert('비밀번호가 올바르지 않습니다.');
      setPasswordInput('');
    }
  };

  // 권한이 없을 경우 보여줄 '비밀번호 입력 화면'
  if (!isAuthorized) {
    return (
      <div className="payment-page-wrapper">
        <Header />
        <div className="payment-content-centered">
          <div className="payment-container">
            <div className="payment-header">
              <h2>결제안내</h2>
              <p>관리자에게 전달받은 결제 비밀번호를 입력해주세요.</p>
            </div>
            <form onSubmit={handlePasswordSubmit}>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <input
                  type="password"
                  className="basic-input"
                  placeholder="비밀번호 4자리 (예: 1234)"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <button type="submit" className="pay-button">
                확인
              </button>
            </form>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAmountChange = (e) => {
    // 숫자만 입력 가능하게 하고 천 단위 콤마 추가
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value) {
      setAmount(Number(value).toLocaleString('ko-KR'));
    } else {
      setAmount('');
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    const numAmount = parseInt(amount.replace(/,/g, ''));
    
    if (!numAmount || numAmount < 100) {
      alert('결제 금액은 100원 이상이어야 합니다.');
      return;
    }
    if (!buyerName || !buyerEmail) {
      alert('주문자 정보를 모두 입력해주세요.');
      return;
    }
    if (!isAgreed) {
      alert('구매 조건 및 환불 규정에 동의해주셔야 결제가 가능합니다.');
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Firebase에 먼저 '결제대기' 상태로 문서 생성
      const docRef = await addDoc(collection(db, 'payments'), {
        amount: numAmount,
        buyerName,
        buyerEmail,
        status: '결제대기',
        createdAt: serverTimestamp(),
      });

      // 2. KCP 폼의 주문번호(ordr_idxx)를 생성된 Firebase 문서 ID로 덮어쓰기
      document.order_info.ordr_idxx.value = docRef.id;

      // 3. 접속 기기 감지 (PC vs Mobile)
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth <= 768;

      if (isMobile) {
        // [모바일 환경] 거래 사전 등록 후 KCP 모바일 결제창으로 이동
        const response = await fetch('/api/kcp-mobile-register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ordr_idxx: docRef.id,
            good_mny: numAmount,
            good_name: '수작업팩토리 맞춤 결제',
            buyr_name: buyerName,
            Ret_URL: 'https://iroum.com/api/kcp-approve'
          })
        });
        
        const data = await response.json();
        
        if (response.ok && data.PayUrl && data.approvalKey) {
          // 모바일용 필수 파라미터 세팅
          document.order_info.action = data.PayUrl;
          document.order_info.pay_method.value = 'CARD';
          
          // 승인키 숨김 폼 추가
          const approvalInput = document.createElement('input');
          approvalInput.type = 'hidden';
          approvalInput.name = 'approval_key';
          approvalInput.value = data.approvalKey;
          document.order_info.appendChild(approvalInput);
          
          // 통화 코드 숨김 폼 추가 (KCP 모바일 규격 원화는 WON)
          const currencyInput = document.createElement('input');
          currencyInput.type = 'hidden';
          currencyInput.name = 'currency';
          currencyInput.value = 'WON';
          document.order_info.appendChild(currencyInput);
          
          // 폼 전송 (KCP 모바일 결제 페이지로 브라우저 이동)
          document.order_info.submit();
        } else {
          alert('모바일 결제 준비 중 오류가 발생했습니다.');
          setIsProcessing(false);
          return;
        }

      } else {
        // [PC 환경] 기존 팝업(아이프레임) 모드
        if (window.KCP_Pay_Execute) {
           window.KCP_Pay_Execute(document.order_info);
           setIsProcessing(false);
           return; 
        } else {
           alert('결제 모듈을 불러오는 중입니다. 새로고침 후 다시 시도해주세요.');
           setIsProcessing(false);
           return;
        }
      }

    } catch (error) {
      console.error('결제 에러:', error);
      alert('결제 준비 중 문제가 발생했습니다.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="payment-page-wrapper">
      <Header />
      <div className="payment-content-centered">
        <div className="payment-container">
          <div className="payment-header">
            <h2>결제안내</h2>
            <p>결제하실 금액과 정보를 입력해주세요.</p>
          </div>


      <form onSubmit={handlePayment}>
        <div className="form-group">
          <label>결제 금액</label>
          <div className="input-wrapper">
            <span>₩</span>
            <input
              type="text"
              className="amount-input"
              value={amount}
              readOnly
              style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed', color: '#6b7280' }}
            />
          </div>
        </div>

        <div className="form-group">
          <label>주문자 정보</label>
          <div className="buyer-info-inputs">
            <input
              type="text"
              className="basic-input"
              placeholder="이름 (예: 홍길동)"
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              required
            />
            <input
              type="email"
              className="basic-input"
              placeholder="이메일 (결제 내역 수신용)"
              value={buyerEmail}
              onChange={(e) => setBuyerEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="agreement-section">
          <div className="terms-box" style={{ fontSize: '0.85rem', lineHeight: '1.6', color: '#4b5563', padding: '16px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', overflowY: 'auto', maxHeight: '180px' }}>
            <strong style={{ color: '#111827' }}>[이룸디자인(수작업팩토리) 주문제작 취소 및 환불 규정]</strong><br /><br />
            본 결제는 1:1 맞춤형 디자인 및 인쇄/제작 서비스를 위한 결제입니다. 맞춤형 상품 특성상 아래의 취소/환불 규정이 엄격히 적용되므로 반드시 확인 후 결제해 주시기 바랍니다.<br /><br />
            
            <strong style={{ color: '#111827' }}>1. 취소 및 환불 안내</strong><br />
            - <strong>시안 작업 전:</strong> 결제 후 디자인 시안 작업에 착수하기 전에는 100% 전액 환불이 가능합니다.<br />
            - <strong>시안 작업 중:</strong> 디자인 시안 작업이 시작된 이후 취소 시, 진행된 디자인 공정에 따른 비용(결제 금액의 30~50%)을 공제한 후 환불됩니다.<br />
            - <strong style={{ color: '#d90429' }}>최종 시안 확정 및 인쇄 착수 후 (환불 불가):</strong> 맞춤형 주문제작 상품의 특성상, <strong>고객님의 최종 시안 확정으로 인쇄 및 제작이 시작된 이후에는 단순 변심에 의한 취소, 환불 및 교환이 원칙적으로 절대 불가</strong>합니다. (전자상거래 등에서의 소비자보호에 관한 법률 제17조 2항 6호에 의거)<br /><br />

            <strong style={{ color: '#111827' }}>2. 불량 및 오배송 교환</strong><br />
            - 당사의 과실(인쇄 불량, 오배송, 파손 등)로 인한 하자가 발생한 경우, 상품 수령일로부터 7일 이내에 고객센터로 연락 주시면 100% 무상 재작업 및 교환 처리를 진행해 드립니다.<br /><br />
            
            <strong style={{ color: '#111827' }}>3. 개인정보 수집 및 이용 동의</strong><br />
            - 서비스 제공, 결제 내역 확인 및 배송 처리를 위해 고객님이 입력하신 정보(이름, 이메일, 연락처 등)가 수집되며, 수집된 정보는 관련 법령에 따라 보존 기간 만료 시 안전하게 파기됩니다.
          </div>
          <label className="checkbox-label">
            <input 
              type="checkbox" 
              checked={isAgreed} 
              onChange={(e) => setIsAgreed(e.target.checked)} 
            />
            <span className="checkbox-text">
              구매 조건 및 취소/환불 규정을 확인하였으며, 결제에 동의합니다. <span className="required">(필수)</span>
            </span>
          </label>
        </div>



        <button 
          type="submit" 
          className="pay-button"
          disabled={isProcessing}
        >
          {isProcessing ? '처리 중...' : 'KCP 안전 결제하기'}
          {!isProcessing && (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          )}
        </button>

        <div className="kcp-notice">
          <span>안전한 NHN KCP 결제창을 통해 결제됩니다.</span>
        </div>
      </form>

      {/* KCP 표준 결제를 위한 필수 숨김 폼 (Hidden Form) 구조 뼈대 */}
      <form name="order_info" method="post" action="/api/kcp-approve" style={{ display: 'none' }}>
        <input type="hidden" name="ordr_idxx" value={`ORDER_${Date.now()}`} />
        <input type="hidden" name="good_name" value="수작업팩토리 맞춤 결제" />
        <input type="hidden" name="good_mny" value={amount.replace(/,/g, '')} />
        <input type="hidden" name="buyr_name" value={buyerName} />
        <input type="hidden" name="buyr_mail" value={buyerEmail} />
        
        {/* KCP OpenAPI 연동 필수 파라미터 */}
        <input type="hidden" name="pay_method" value="100000000000" /> {/* 신용카드 결제 수단 코드 */}
        <input type="hidden" name="site_cd" value="P7547" />
        <input type="hidden" name="Ret_URL" value="https://iroum.com/api/kcp-approve" />
        <input type="hidden" name="req_tx" value="pay" />
        
        {/* KCP 결제결과를 담을 빈 파라미터들 (필수) */}
        <input type="hidden" name="res_cd" value="" />
        <input type="hidden" name="res_msg" value="" />
        <input type="hidden" name="enc_info" value="" />
        <input type="hidden" name="enc_data" value="" />
        <input type="hidden" name="ret_pay_method" value="" />
        <input type="hidden" name="tran_cd" value="" />
        <input type="hidden" name="use_pay_method" value="" />
      </form>
    </div>
  </div>
  <Footer />
</div>
);
};

export default PaymentForm;
