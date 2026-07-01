import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import Header from './Header';
import Footer from './Footer';
import './PaymentForm.css';
const PaymentForm = () => {
  const navigate = useNavigate();

  // 접근 권한 상태
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');

  const [amount, setAmount] = useState('');
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
              <h1>수작업팩토리 결제</h1>
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
        <h1>수작업팩토리 결제</h1>
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
              placeholder="0"
              value={amount}
              onChange={handleAmountChange}
              maxLength="11"
              required
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
          <div className="terms-box">
            <strong>[구매 조건 및 취소/환불 규정]</strong><br /><br />
            1. <strong>결제 및 서비스:</strong> 고객님이 입력하신 금액에 맞춰 맞춤형 서비스/상품이 제공됩니다.<br />
            2. <strong>취소 및 환불:</strong> 작업 착수 전(통상 1~2일 내)에는 100% 환불이 가능합니다. 단, 맞춤형 수작업 특성상 <strong>작업이 본격적으로 착수된 이후에는 원칙적으로 취소 및 환불이 불가</strong>하므로 신중한 결제 부탁드립니다.<br />
            3. <strong>배송/작업 기간:</strong> 사전에 안내된 개별 협의 기간이 소요됩니다.<br />
            4. <strong>개인정보 동의:</strong> 서비스 제공 및 결제 내역 확인을 위해 입력된 정보가 수집되며 목적 달성 후 폐기됩니다.
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
