import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import AdminLayout from './AdminLayout';
import './AdminPayments.css';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [linkAmount, setLinkAmount] = useState('');

  const handleCopyLink = () => {
    if (!linkAmount) {
      alert('금액을 입력해주세요.');
      return;
    }
    const link = `https://www.iroum.com/payment?amount=${linkAmount}`;
    navigator.clipboard.writeText(link)
      .then(() => alert('결제 링크가 복사되었습니다!\n카카오톡에 붙여넣기(Ctrl+V) 해주세요.'))
      .catch(() => alert('복사에 실패했습니다. 직접 드래그해서 복사해주세요.'));
  };

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'payments'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const paymentData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setPayments(paymentData);
    } catch (error) {
      console.error('결제 내역 불러오기 실패:', error);
      alert('결제 내역을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPayments();
  }, []);

  const formatDate = (timestamp) => {
    if (!timestamp) return '알 수 없음';
    const date = timestamp.toDate();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  const handleRowClick = (payment) => {
    setSelectedPayment(payment);
  };

  const closePopup = () => {
    setSelectedPayment(null);
  };

  const handleUpdateStatus = async (newStatus) => {
    if (!selectedPayment) return;
    if (selectedPayment.status === newStatus) return; // 변경사항 없음

    try {
      setIsUpdating(true);
      const paymentRef = doc(db, 'payments', selectedPayment.id);
      await updateDoc(paymentRef, {
        status: newStatus
      });

      // 로컬 상태 업데이트
      setPayments(payments.map(p => 
        p.id === selectedPayment.id ? { ...p, status: newStatus } : p
      ));
      
      // 선택된 상태도 업데이트
      setSelectedPayment({ ...selectedPayment, status: newStatus });
      
      alert(`상태가 [${newStatus}]로 변경되었습니다.`);
    } catch (error) {
      console.error('상태 변경 오류:', error);
      alert('상태 변경 중 오류가 발생했습니다.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeletePayment = async (id) => {
    const isConfirm = window.confirm("정말로 이 내역을 삭제하시겠습니까?\n삭제된 데이터는 복구할 수 없습니다.");
    if (!isConfirm) return;

    try {
      setIsUpdating(true);
      await deleteDoc(doc(db, 'payments', id));
      
      // 로컬 상태 업데이트 (삭제된 내역 화면에서 제거)
      setPayments(payments.filter(p => p.id !== id));
      
      if (selectedPayment && selectedPayment.id === id) {
        closePopup();
      }
      
      alert('결제 내역이 정상적으로 삭제되었습니다.');
    } catch (error) {
      console.error('삭제 오류:', error);
      alert('결제 내역 삭제 중 오류가 발생했습니다.');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusClass = (status) => {
    if (status === '입금 완료') return 'status-badge completed';
    return 'status-badge pending';
  };

  return (
    <AdminLayout>
      <div className="admin-payments-container">
        <div className="admin-header">
          <h1>결제 및 주문 내역</h1>
          <button className="refresh-btn" onClick={fetchPayments}>
            🔄 새로고침
          </button>
        </div>

        <div className="link-generator-box">
          <div className="generator-title">🔗 개인 결제창 링크 생성기</div>
          <p className="generator-desc">고객에게 보낼 전용 결제 링크를 원클릭으로 생성하세요.</p>
          <div className="generator-controls">
            <input 
              type="number" 
              placeholder="결제 금액 입력 (예: 50000)" 
              value={linkAmount}
              onChange={(e) => setLinkAmount(e.target.value)}
              className="generator-input"
            />
            <button className="generator-copy-btn" onClick={handleCopyLink}>
              복사하기
            </button>
          </div>
          {linkAmount && (
            <div className="generator-preview">
              생성된 링크: <span>https://www.iroum.com/payment?amount={linkAmount}</span>
            </div>
          )}
        </div>

        <div className="table-wrapper">
          {loading ? (
            <div className="loading-message">내역을 불러오는 중입니다...</div>
          ) : payments.length === 0 ? (
            <div className="empty-message">등록된 결제/주문 내역이 없습니다.</div>
          ) : (
            <table className="payments-table">
              <thead>
                <tr>
                  <th>접수 일시</th>
                  <th>주문자명</th>
                  <th>이메일</th>
                  <th>결제/입금액</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(item => (
                  <tr key={item.id} onClick={() => handleRowClick(item)} className="clickable-row">
                    <td>{formatDate(item.createdAt)}</td>
                    <td className="fw-bold">{item.buyerName}</td>
                    <td>{item.buyerEmail}</td>
                    <td className="amount-col">{Number(item.amount).toLocaleString()}원</td>
                    <td>
                      <span className={getStatusClass(item.status || '입금 대기')}>
                        {item.status || '입금 대기'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* 결제 상세 모달 팝업 */}
      {selectedPayment && (
        <div className="payment-modal-overlay" onClick={closePopup}>
          <div className="payment-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>결제 상세 정보</h2>
              <button className="close-btn" onClick={closePopup}>&times;</button>
            </div>
            
            <div className="modal-body">
              <div className="info-row">
                <span className="info-label">주문자명</span>
                <span className="info-value">{selectedPayment.buyerName}</span>
              </div>
              <div className="info-row">
                <span className="info-label">이메일</span>
                <span className="info-value">{selectedPayment.buyerEmail}</span>
              </div>
              <div className="info-row">
                <span className="info-label">결제 금액</span>
                <span className="info-value highlight-amount">{Number(selectedPayment.amount).toLocaleString()}원</span>
              </div>
              <div className="info-row">
                <span className="info-label">접수 일시</span>
                <span className="info-value">{formatDate(selectedPayment.createdAt)}</span>
              </div>
              <div className="info-row">
                <span className="info-label">현재 상태</span>
                <span className={`info-value ${getStatusClass(selectedPayment.status || '입금 대기')}`}>
                  {selectedPayment.status || '입금 대기'}
                </span>
              </div>
            </div>

            <div className="modal-actions">
              <h3>상태 변경</h3>
              <div className="status-buttons">
                <button 
                  className={`status-btn pending-btn ${(selectedPayment.status || '입금 대기') === '입금 대기' ? 'active' : ''}`}
                  onClick={() => handleUpdateStatus('입금 대기')}
                  disabled={isUpdating}
                >
                  입금 대기
                </button>
                <button 
                  className={`status-btn completed-btn ${selectedPayment.status === '입금 완료' ? 'active' : ''}`}
                  onClick={() => handleUpdateStatus('입금 완료')}
                  disabled={isUpdating}
                >
                  입금 완료
                </button>
              </div>
              <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                  onClick={() => handleDeletePayment(selectedPayment.id)}
                  disabled={isUpdating}
                  style={{ 
                    backgroundColor: '#fee2e2', 
                    color: '#ef4444', 
                    border: 'none', 
                    padding: '8px 16px', 
                    borderRadius: '6px', 
                    cursor: isUpdating ? 'not-allowed' : 'pointer',
                    fontWeight: '600',
                    fontSize: '0.9rem'
                  }}
                >
                  🗑️ 내역 삭제하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminPayments;
