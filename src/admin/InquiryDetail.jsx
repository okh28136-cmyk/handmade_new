import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db, storage } from '../firebase';
import {
  doc, getDoc, updateDoc, deleteDoc, arrayUnion, serverTimestamp, Timestamp
} from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import AdminLayout from './AdminLayout';
import './InquiryDetail.css';

const STATUS_MAP = {
  'new':    { label: '신규접수',    cls: 'status-new' },
  'review': { label: '검토중',  cls: 'status-review' },
  'sent':   { label: '견적발송', cls: 'status-sent' },
  'done':   { label: '완료',    cls: 'status-done' },
  'cancel': { label: '취소',    cls: 'status-cancel' },
};

const labelMap = {
  simple: '1종 (단순 합포장)', normal: '2종 (일반 키팅)', complex: '3종 이상 (다양한 구성품)',
  precision: '정밀 부착', folding: '조립형 골판지 상자', hard: '고급 싸바리 세팅',
  courier: '개별 택배 포장', outerBox: '대형 외박스 합포장', pallet: '팔레트 단위 납품'
};
const getLabel = (key) => labelMap[key] || '일반 기준';

const getMultiplierText = (type, key, val) => {
  const textMap = {
    kitting: {
      preTask: { 1: '아니요, 바로 담을 수 있게 입고됩니다.', 1.2: '네, 묶음 비닐/원물 박스 등을 뜯고 소분하는 과정이 필요합니다.' },
      mainPacking: { 1: '일반 상자류 (단상자, 싸바리박스 등 입구가 열려 있어 바로 투입 가능한 형태)', 1.3: '비닐/파우치류 (OPP 봉투, 지퍼백, 천 파우치 등 입구를 손으로 벌려서 넣어야 하는 형태)', 1.2: '종이 봉투류 (서류 봉투, 크라프트 봉투 등)' },
      direction: { 1: '일반 투입 (빈 공간에 순서대로 편하게 투입)', 1.2: '방향/위치 지정 (로고 정면 노출, 바코드 방향 일치 등)', 1.4: '밀착/압박 안착 (스펀지나 종이 틀에 꾹 눌러 타이트하게 끼워 맞춤)' }
    },
    attach: {
      attachArea: { 1: '평면 (단상자 겉면, 쇼핑백 등 반듯한 면)', 1.2: '둥근 면 - 부분 부착 (유리병, 용기 앞/뒷면 등에 포인트 부착)', 1.5: '둥근 면 - 전체 랩핑 (용기 둘레를 감싸며 시작과 끝 단차를 완벽히 맞춰야 함)', 1.4: '꺾이는 모서리 (상자의 모서리를 넘어가며 꺾어서 붙이는 봉인 씰 형태)', 1.6: '연질 및 불규칙 굴곡 (튜브형 화장품, 푹신한 파우치 등 고정하기 까다로운 표면)' },
      attachSize: { 1: '소형~중형 (길이가 약 15cm 이하인 일반 스티커)', 1.3: '대형 사이즈 (길이 15cm 초과 또는 넓은 면적 / 밀대 작업 필수)' },
      attachMaterial: { 1: '일반 종이/유포지 스티커 (다루기 쉬움)', 1.2: '투명(지문주의), 얇은 은박, 파괴 씰 등 까다로운 특수 재질' }
    },
    assemble: {
      innerPad: { 1: '종이만 접어서 끼우면 끝납니다.', 1.3: '십자 칸막이나 계단식 패드 등 내부 구조물도 별도로 접어서 결합해야 합니다.', 1.5: '양면테이프 이형지를 떼거나 글루건(도트 실리콘)을 쏴서 부착하는 공정이 있습니다.' },
      finishing: { 1: '없음 (상자를 닫고 완료)', 1.5: '띠지, 리본 묶기 등' }
    }
  };
  return textMap[type]?.[key]?.[val] || '';
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

  // 문의 전체 삭제
  const handleDeleteInquiry = async () => {
    if (!window.confirm('이 견적 문의를 완전히 삭제하시겠습니까? (삭제된 데이터는 복구할 수 없습니다)')) return;
    
    setSaving(true);
    try {
      // 1. Storage에 있는 첨부파일 모두 삭제
      if (inquiry.attachments && inquiry.attachments.length > 0) {
        for (const file of inquiry.attachments) {
          const fileRef = ref(storage, file.path);
          await deleteObject(fileRef).catch(err => console.warn('Storage 파일 삭제 무시됨:', err));
        }
      }
      // 2. Firestore 문서 삭제
      await deleteDoc(doc(db, 'inquiries', id));
      alert('문의가 삭제되었습니다.');
      navigate('/admin/inquiries');
    } catch (err) {
      console.error('문의 삭제 오류:', err);
      alert('삭제 중 오류가 발생했습니다.');
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
          <button className="delete-btn" style={{ marginLeft: '10px', backgroundColor: '#dc3545', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }} onClick={handleDeleteInquiry}>
            🗑️ 삭제
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

          {/* 자동견적 산출 내역 (있는 경우에만 렌더링) */}
          {inquiry.quote_details && inquiry.project_settings && (
            <div className="detail-card">
              <div className="card-header">
                <h3>📊 자동견적 산출 내역</h3>
                <span className="quote-total-price">
                  총 견적액: <strong>{inquiry.quote_details.totalPrice.toLocaleString()}원</strong>
                </span>
              </div>
              <div className="quote-details-container">
                <div className="quote-project-settings">
                  <div className="setting-item"><span>예상 수량</span><strong>{inquiry.project_settings.quantity} 세트</strong></div>
                  <div className="setting-item"><span>세트당 무게</span><strong>{inquiry.project_settings.weight} kg</strong></div>
                  <div className="setting-item"><span>부자재(BOM)</span><strong>{inquiry.project_settings.hasBOM === 'yes' ? '있음' : '없음'}</strong></div>
                </div>
                
                {inquiry.quote_details.enrichedCart && inquiry.quote_details.enrichedCart.length > 0 && (
                  <div className="quote-cart-list">
                    <div className="cart-list-header">선택된 공정 리스트</div>
                    {inquiry.quote_details.enrichedCart.map((item, idx) => (
                      <div key={idx} className="cart-item">
                        <div className="cart-item-info">
                          <span className="cart-item-label">{item.label}</span>
                          <span className="cart-item-base">{getLabel(item.base)}</span>
                          {item.multipliers && (
                            <div className="cart-item-multipliers">
                              {Object.entries(item.multipliers).map(([mKey, mVal]) => {
                                const text = getMultiplierText(item.type, mKey, mVal);
                                return text ? <span key={mKey}>• {text}</span> : null;
                              })}
                            </div>
                          )}
                        </div>
                        <div className="cart-item-price">
                          +{Math.round(item.calculatedPrice).toLocaleString()}원
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="quote-summary">
                  <div className="summary-row"><span>순수 수작업 단가합</span><span>{inquiry.quote_details.workCost.toLocaleString()} 원</span></div>
                  <div className="summary-row"><span>기본 세팅/준비비</span><span>{inquiry.quote_details.setupCost.toLocaleString()} 원</span></div>
                  <div className="summary-row highlight"><span>최종 세트당 단가</span><strong>{inquiry.quote_details.unitPrice.toLocaleString()} 원</strong></div>
                </div>
              </div>
            </div>
          )}

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
