import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import AdminLayout from './AdminLayout';
import './AdminPayments.css';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

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

  const formatDate = (timestamp) => {
    if (!timestamp) return '알 수 없음';
    const date = timestamp.toDate();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
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
                <tr key={item.id}>
                  <td>{formatDate(item.createdAt)}</td>
                  <td className="fw-bold">{item.buyerName}</td>
                  <td>{item.buyerEmail}</td>
                  <td className="amount-col">{Number(item.amount).toLocaleString()}원</td>
                  <td>
                    <span className="status-badge">{item.status || '신청완료'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
    </AdminLayout>
  );
};

export default AdminPayments;
