import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import AdminLayout from './AdminLayout';
import './AdminFAQ.css';

const AdminFAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 폼 상태
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  // Firestore 데이터 불러오기
  useEffect(() => {
    const q = query(collection(db, 'faqs'), orderBy('order', 'asc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFaqs(data);
      setLoading(false);
    }, (err) => {
      console.error('FAQ 로드 에러:', err);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const resetForm = () => {
    setIsEditing(false);
    setEditId(null);
    setQuestion('');
    setAnswer('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) {
      alert('질문과 답변을 모두 입력해주세요.');
      return;
    }

    try {
      if (isEditing && editId) {
        // 수정
        await updateDoc(doc(db, 'faqs', editId), {
          question,
          answer
        });
        alert('수정되었습니다.');
      } else {
        // 새로 추가 (마지막 순서로 배정)
        const nextOrder = faqs.length > 0 ? Math.max(...faqs.map(f => f.order)) + 1 : 1;
        await addDoc(collection(db, 'faqs'), {
          question,
          answer,
          order: nextOrder,
          createdAt: serverTimestamp()
        });
        alert('추가되었습니다.');
      }
      resetForm();
    } catch (err) {
      console.error('저장 에러:', err);
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  const handleEditClick = (faq) => {
    setIsEditing(true);
    setEditId(faq.id);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (faq) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await deleteDoc(doc(db, 'faqs', faq.id));
      alert('삭제되었습니다.');
      // 삭제 시 폼 초기화 (수정 중이던 항목이라면)
      if (editId === faq.id) resetForm();
    } catch (err) {
      console.error('삭제 에러:', err);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  // 순서 변경 (위로 이동)
  const moveUp = async (index) => {
    if (index === 0) return;
    const currentFaq = faqs[index];
    const prevFaq = faqs[index - 1];

    try {
      await updateDoc(doc(db, 'faqs', currentFaq.id), { order: prevFaq.order });
      await updateDoc(doc(db, 'faqs', prevFaq.id), { order: currentFaq.order });
    } catch (err) {
      console.error('순서 변경 에러:', err);
      alert('순서 변경 중 오류가 발생했습니다.');
    }
  };

  // 순서 변경 (아래로 이동)
  const moveDown = async (index) => {
    if (index === faqs.length - 1) return;
    const currentFaq = faqs[index];
    const nextFaq = faqs[index + 1];

    try {
      await updateDoc(doc(db, 'faqs', currentFaq.id), { order: nextFaq.order });
      await updateDoc(doc(db, 'faqs', nextFaq.id), { order: currentFaq.order });
    } catch (err) {
      console.error('순서 변경 에러:', err);
      alert('순서 변경 중 오류가 발생했습니다.');
    }
  };

  return (
    <AdminLayout>
      <div className="page-header">
        <h2>💬 FAQ 관리</h2>
        <p>메인 홈페이지에 노출되는 자주 묻는 질문을 추가, 수정, 삭제하고 순서를 변경할 수 있습니다.</p>
      </div>

      <div className="faq-admin-container">
        {/* 등록 / 수정 폼 */}
        <div className="faq-form-panel">
          <h3>{isEditing ? 'FAQ 수정하기' : '새로운 FAQ 등록하기'}</h3>
          <form onSubmit={handleSubmit} className="faq-form">
            <div className="form-group">
              <label>질문 (Question)</label>
              <input 
                type="text" 
                value={question} 
                onChange={(e) => setQuestion(e.target.value)} 
                placeholder="예: 자재 입고와 완제품 출고는 어떻게 이루어지나요?" 
              />
            </div>
            <div className="form-group">
              <label>답변 (Answer)</label>
              <textarea 
                rows="4" 
                value={answer} 
                onChange={(e) => setAnswer(e.target.value)} 
                placeholder="답변 내용을 입력해주세요." 
              />
            </div>
            <div className="form-actions">
              {isEditing && (
                <button type="button" className="btn-cancel" onClick={resetForm}>취소</button>
              )}
              <button type="submit" className="btn-submit">
                {isEditing ? '수정 완료' : 'FAQ 등록'}
              </button>
            </div>
          </form>
        </div>

        {/* FAQ 목록 */}
        <div className="faq-list-panel">
          <h3>등록된 FAQ 목록 ({faqs.length}건)</h3>
          {loading ? (
            <p className="loading-text">데이터를 불러오는 중입니다...</p>
          ) : faqs.length === 0 ? (
            <div className="empty-state">등록된 FAQ가 없습니다.</div>
          ) : (
            <div className="faq-admin-list">
              {faqs.map((faq, index) => (
                <div key={faq.id} className="faq-admin-item">
                  <div className="faq-admin-content">
                    <div className="faq-admin-q"><span>Q.</span> {faq.question}</div>
                    <div className="faq-admin-a"><span>A.</span> {faq.answer}</div>
                  </div>
                  <div className="faq-admin-controls">
                    <div className="order-controls">
                      <button 
                        className="btn-order" 
                        onClick={() => moveUp(index)} 
                        disabled={index === 0}
                        title="위로 이동"
                      >▲</button>
                      <button 
                        className="btn-order" 
                        onClick={() => moveDown(index)} 
                        disabled={index === faqs.length - 1}
                        title="아래로 이동"
                      >▼</button>
                    </div>
                    <div className="action-controls">
                      <button className="btn-edit" onClick={() => handleEditClick(faq)}>수정</button>
                      <button className="btn-delete" onClick={() => handleDelete(faq)}>삭제</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminFAQ;
