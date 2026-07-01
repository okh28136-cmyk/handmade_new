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
    // 테스트용 KCP 스크립트 URL (실제 운영시 URL 다름)
    script.src = 'https://testpay.kcp.co.kr/plugin/payplus_web.jsp';
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
              <h1>결제안내</h1>
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
      if (window.m_Completepayment) {
         // KCP 폼 세팅 및 호출 로직이 이곳에 들어갑니다.
         // 예: window.KCP_Pay_Execute(document.order_info);
      }
      
      // Firebase DB에 주문 정보 저장 (무통장/카드 결합)
      await addDoc(collection(db, 'payments'), {
        amount: numAmount,
        buyerName,
        buyerEmail,
        status: '신청완료',
        createdAt: serverTimestamp()
      });

      // 완료 안내 (1초 대기 후 페이지 이동)
      setTimeout(() => {
        setIsProcessing(false);
        navigate('/payment/success');
      }, 500);

    } catch (error) {
      console.error('결제/DB 저장 에러:', error);
      alert('접수 중 문제가 발생했습니다.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="payment-page-wrapper">
      <Header />
      <div className="payment-content-centered">
        <div className="payment-container">
          <div className="payment-header">
            <h1>결제안내</h1>
            <p>결제하실 금액과 정보를 입력해주세요.</p>
          </div>
      <div className="bank-transfer-info" style={{ marginBottom: '32px' }}>
        <div className="bank-info-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="5" width="20" height="14" rx="2"></rect>
            <line x1="2" y1="10" x2="22" y2="10"></line>
          </svg>
          무통장 입금 계좌안내
        </div>
        <div className="bank-info-details">
          <strong>신한은행</strong> 100-024-342782<br />
          예금주: 이룸디자인
        </div>
      </div>

      <div style={{ marginBottom: '20px', borderTop: '1px solid #E5E7EB', paddingTop: '20px' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--color-black)', marginBottom: '8px', textAlign: 'center' }}>카드 결제</h2>
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
      <form name="order_info" method="post" action="kcp_api" style={{ display: 'none' }}>
        <input type="hidden" name="ordr_idxx" value="TEST_ORDER_1234" />
            <input type="hidden" name="good_name" value="수작업팩토리 맞춤 결제" />
            <input type="hidden" name="good_mny" value={amount.replace(/,/g, '')} />
            <input type="hidden" name="buyr_name" value={buyerName} />
            <input type="hidden" name="buyr_mail" value={buyerEmail} />
            {/* 추가 필수 파라미터들이 여기에 들어갑니다 (site_cd, site_key 등) */}
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentForm;
