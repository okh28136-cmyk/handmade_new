import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db, storage } from '../firebase';
import {
  doc, getDoc, updateDoc, arrayUnion, serverTimestamp, Timestamp
} from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import AdminLayout from './AdminLayout';
import './InquiryDetail.css';

const STATUS_MAP = {
  'new':    { label: '신규',    cls: 'status-new' },
  'review': { label: '검토중',  cls: 'status-review' },
  'sent':   { label: '견적발송', cls: 'status-sent' },
  'done':   { label: '완료',    cls: 'status-done' },
  'cancel': { label: '취소',    cls: 'status-cancel' },
};

const InquiryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inquiry, setInquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newMemo, setNewMemo] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});

  // Firestore에서 문의 데이터 불러오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, 'inquiries', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const parsed = {
            id: docSnap.id,
            ...data,
            createdAt: data.createdAt?.toDate().toLocaleString('ko-KR', { hour12: false }).slice(0, 16) || '-',
          };
          setInquiry(parsed);
          setEditData(parsed);
        }
      } catch (err) {
        console.error('문서 불러오기 오류:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // 상태 변경 → Firestore 저장
  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setInquiry(prev => ({ ...prev, status: newStatus }));
    await updateDoc(doc(db, 'inquiries', id), { status: newStatus });
  };

  // 메모 추가 → Firestore arrayUnion
  const handleAddMemo = async () => {
    if (!newMemo.trim()) return;
    const memo = {
      text: newMemo.trim(),
      time: new Date().toLocaleString('ko-KR', { hour12: false }).slice(0, 16),
    };
    setSaving(true);
    await updateDoc(doc(db, 'inquiries', id), { memos: arrayUnion(memo) });
    setInquiry(prev => ({ ...prev, memos: [...(prev.memos || []), memo] }));
    setNewMemo('');
    setSaving(false);
  };

  // 메모 삭제 → 전체 memos 배열을 재저장
  const handleDeleteMemo = async (idx) => {
    const updated = inquiry.memos.filter((_, i) => i !== idx);
    await updateDoc(doc(db, 'inquiries', id), { memos: updated });
    setInquiry(prev => ({ ...prev, memos: updated }));
  };

  // 고객 정보 수정 저장 → Firestore
  const handleSaveEdit = async () => {
    setSaving(true);
    const fields = {
      from_company: editData.from_company,
      from_name: editData.from_name,
      from_phone: editData.from_phone,
      from_email: editData.from_email,
      service_type: editData.service_type,
      amount: editData.amount,
      message: editData.message,
    };
    await updateDoc(doc(db, 'inquiries', id), fields);
    setInquiry(prev => ({ ...prev, ...fields }));
    setEditMode(false);
    setSaving(false);
  };

  // 첨부파일 삭제
  const handleDeleteAttachment = async (fileIndex) => {
    if (!window.confirm('첨부파일을 완전히 삭제하시겠습니까? (이 작업은 되돌릴 수 없습니다)')) return;
    setSaving(true);
    try {
      const targetFile = inquiry.attachments[fileIndex];
      // 1. Storage에서 삭제
      const fileRef = ref(storage, targetFile.path);
      await deleteObject(fileRef).catch(err => {
        // 이미 삭제되었거나 없으면 무시
        console.warn('Storage 삭제 오류 (무시됨):', err);
      });
      
      // 2. Firestore에서 제거
      const updatedAttachments = inquiry.attachments.filter((_, idx) => idx !== fileIndex);
      await updateDoc(doc(db, 'inquiries', id), { attachments: updatedAttachments });
      setInquiry(prev => ({ ...prev, attachments: updatedAttachments }));
      alert('삭제되었습니다.');
    } catch (err) {
      console.error('첨부파일 삭제 오류:', err);
      alert('삭제 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  // 견적서 페이지 열기 (고객 정보 query string으로 전달)
  const openQuoteForm = () => {
    const params = new URLSearchParams({
      name: inquiry.from_name || '',
      company: inquiry.from_company || '',
      phone: inquiry.from_phone || '',
    });
    window.open(`/quote/index.html?${params}`, '_blank');
  };

  if (loading) return <AdminLayout><div className="loading-row">⏳ 불러오는 중...</div></AdminLayout>;
  if (!inquiry) return <AdminLayout><div className="loading-row">❌ 문의를 찾을 수 없습니다.</div></AdminLayout>;

  const st = STATUS_MAP[inquiry.status] || STATUS_MAP['new'];

  return (
    <AdminLayout>
      {/* 상단 내비 */}
      <div className="detail-topbar">
        <button className="back-btn" onClick={() => navigate('/admin/inquiries')}>
          ← 목록으로
        </button>
        <div className="topbar-actions">
          <select className="status-select" value={inquiry.status} onChange={handleStatusChange}>
            {Object.entries(STATUS_MAP).map(([val, {label}]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
          <button className="quote-btn" onClick={openQuoteForm}>
            📄 견적서 작성
          </button>
        </div>
      </div>

      <div className="detail-grid">
        {/* 좌측: 고객 정보 + 문의 내용 */}
        <div className="detail-left">
          <div className="detail-card">
            <div className="card-header">
              <h3>고객 정보</h3>
              <button className="edit-toggle-btn" onClick={() => { setEditMode(!editMode); setEditData({...inquiry}); }}>
                {editMode ? '취소' : '✏️ 수정'}
              </button>
            </div>

            {editMode ? (
              <div className="edit-form">
                {[
                  ['회사명', 'from_company'],
                  ['담당자명', 'from_name'],
                  ['연락처', 'from_phone'],
                  ['이메일', 'from_email'],
                  ['서비스 유형', 'service_type'],
                  ['예상 물량', 'amount'],
                ].map(([label, key]) => (
                  <div key={key} className="edit-row">
                    <label>{label}</label>
                    <input
                      type="text"
                      value={editData[key] || ''}
                      onChange={e => setEditData(prev => ({ ...prev, [key]: e.target.value }))}
                    />
                  </div>
                ))}
                <button className="save-edit-btn" onClick={handleSaveEdit} disabled={saving}>
                  {saving ? '저장 중...' : '✅ 저장'}
                </button>
              </div>
            ) : (
              <div className="info-grid">
                <div className="info-row"><span className="info-label">회사명</span><span className="info-val">{inquiry.from_company || '-'}</span></div>
                <div className="info-row"><span className="info-label">담당자</span><span className="info-val">{inquiry.from_name}</span></div>
                <div className="info-row"><span className="info-label">연락처</span><span className="info-val">{inquiry.from_phone}</span></div>
                <div className="info-row"><span className="info-label">이메일</span><span className="info-val">{inquiry.from_email}</span></div>
                <div className="info-row"><span className="info-label">서비스</span><span className="info-val">{inquiry.service_type}</span></div>
                <div className="info-row"><span className="info-label">예상물량</span><span className="info-val">{inquiry.amount || '-'}</span></div>
                <div className="info-row"><span className="info-label">접수일시</span><span className="info-val">{inquiry.createdAt}</span></div>
                <div className="info-row"><span className="info-label">현재상태</span><span className={`status-badge ${st.cls}`}>{st.label}</span></div>
              </div>
            )}
          </div>

          <div className="detail-card">
            <div className="card-header"><h3>상세 문의 내용</h3></div>
            {editMode ? (
              <textarea
                className="edit-textarea"
                value={editData.message || ''}
                onChange={e => setEditData(prev => ({ ...prev, message: e.target.value }))}
                rows="6"
              />
            ) : (
              <p className="message-text">{inquiry.message}</p>
            )}
          </div>

          {/* 첨부파일 영역 추가 */}
          <div className="detail-card">
            <div className="card-header"><h3>📎 첨부파일</h3></div>
            <div className="attachment-list">
              {(!inquiry.attachments || inquiry.attachments.length === 0) ? (
                <p className="attachment-empty">첨부된 파일이 없습니다.</p>
              ) : (
                inquiry.attachments.map((file, idx) => (
                  <div key={idx} className="attachment-item">
                    <a href={file.url} target="_blank" rel="noopener noreferrer" className="attachment-link">
                      📄 {file.name}
                    </a>
                    <button className="attachment-del-btn" onClick={() => handleDeleteAttachment(idx)} disabled={saving}>
                      삭제
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* 우측: 관리자 메모 */}
        <div className="detail-right">
          <div className="detail-card memo-card">
            <div className="card-header"><h3>🗒️ 관리자 메모</h3></div>

            <div className="memo-list">
              {(!inquiry.memos || inquiry.memos.length === 0) ? (
                <p className="memo-empty">작성된 메모가 없습니다.</p>
              ) : (
                inquiry.memos.map((memo, idx) => (
                  <div key={idx} className="memo-item">
                    <div className="memo-text">{memo.text}</div>
                    <div className="memo-footer">
                      <span className="memo-time">{memo.time}</span>
                      <button className="memo-del-btn" onClick={() => handleDeleteMemo(idx)}>삭제</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="memo-input-area">
              <textarea
                className="memo-input"
                placeholder="메모 내용을 입력하세요... (Ctrl+Enter로 추가)"
                value={newMemo}
                onChange={e => setNewMemo(e.target.value)}
                rows="3"
                onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) handleAddMemo(); }}
              />
              <button className="memo-add-btn" onClick={handleAddMemo} disabled={saving}>
                {saving ? '저장 중...' : '메모 추가'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default InquiryDetail;
