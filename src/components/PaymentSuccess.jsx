import { useNavigate } from 'react-router-dom';
import './PaymentForm.css'; // 같은 스타일 시스템 공유

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="payment-container" style={{ textAlign: 'center', padding: '60px 20px' }}>
      <div className="success-icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      </div>
      
      <h1 className="success-title">결제/입금 신청 완료</h1>
      <p className="success-desc">
        성공적으로 접수되었습니다.<br />
        담당자가 확인 후 빠르게 안내해 드리겠습니다.
      </p>

      <div className="success-actions">
        <button 
          onClick={() => navigate('/')} 
          className="pay-button" 
          style={{ width: 'auto', minWidth: '200px', margin: '0 auto' }}
        >
          홈으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
