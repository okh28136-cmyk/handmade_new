import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Header from './Header';
import './PaymentForm.css'; // 같은 스타일 시스템 공유

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');

  useEffect(() => {
    if (orderId) {
      const updatePaymentStatus = async () => {
        try {
          // Firebase에서 해당 문서의 상태를 '결제완료'로 업데이트
          const docRef = doc(db, 'payments', orderId);
          await updateDoc(docRef, { status: '결제완료' });
        } catch (error) {
          console.error('결제 상태 업데이트 오류:', error);
        }
      };
      updatePaymentStatus();
    }
  }, [orderId]);

  return (
    <div className="payment-page-wrapper">
      <Header />
      <div className="payment-content-centered">
        <div className="payment-container" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div className="success-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          
          <h1 className="success-title">결제가 완료되었습니다</h1>
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
      </div>
    </div>
  );
};

export default PaymentSuccess;
