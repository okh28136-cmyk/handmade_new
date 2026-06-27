import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, storage } from '../firebase';
import { collection, onSnapshot, orderBy, query, deleteDoc, doc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import * as XLSX from 'xlsx';
import AdminLayout from './AdminLayout';
import './InquiryList.css';

const STATUS_MAP = {
  'new':    { label: '신규',    cls: 'status-new' },
  'review': { label: '검토중',  cls: 'status-review' },
  'sent':   { label: '견적발송', cls: 'status-sent' },
  'done':   { label: '완료',    cls: 'status-done' },
  'cancel': { label: '취소',    cls: 'status-cancel' },
};

const InquiryList = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const navigate = useNavigate();

  // Firestore 실시간 구독
  useEffect(() => {
    const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Firestore Timestamp → 문자열 변환
        createdAt: doc.data().createdAt?.toDate().toLocaleString('ko-KR', { hour12: false }).slice(0, 16) || '-',
      }));
      setInquiries(data);
      setLoading(false);
    }, (err) => {
      console.error('Firestore 오류:', err);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filtered = inquiries.filter(i => {
    const matchStatus = filter === 'all' || i.status === filter;
    const q = search.toLowerCase();
    const matchSearch = !search
      || (i.from_company || '').toLowerCase().includes(q)
      || (i.from_name || '').toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const handleDelete = async (e, inquiry) => {
    e.stopPropagation(); // 행 클릭(상세보기 이동) 방지
    if (!window.confirm(`'${inquiry.from_company || inquiry.from_name}'님의 문의를 완전히 삭제하시겠습니까?`)) return;

    try {
      // 1. 첨부파일 삭제 시도
      if (inquiry.attachments && inquiry.attachments.length > 0) {
        for (const file of inquiry.attachments) {
          const fileRef = ref(storage, file.path);
          await deleteObject(fileRef).catch(err => console.warn('Storage 삭제 무시됨:', err));
        }
      }
      // 2. DB 삭제
      await deleteDoc(doc(db, 'inquiries', inquiry.id));
      alert('삭제되었습니다.');
    } catch (err) {
      console.error('삭제 오류:', err);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const handleExcelDownload = () => {
    if (filtered.length === 0) {
      alert('다운로드할 데이터가 없습니다.');
      return;
    }
    const excelData = filtered.map(item => ({
      '접수일시': item.createdAt,
      '상태': STATUS_MAP[item.status]?.label || '미분류',
      '회사명': item.from_company || '-',
      '담당자': item.from_name || '-',
      '연락처': item.from_phone || '-',
      '이메일': item.from_email || '-',
      '서비스분야': item.req_type || '-',
      '희망납기일': item.req_date || '-',
      '예상물량': item.req_amount || '-',
      '문의내용': item.req_content || '-',
      '관리자메모': item.memos && item.memos.length > 0 ? item.memos.map(m => `[${m.time}] ${m.text}`).join('\n') : '-'
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    // 열 너비 자동 맞춤 설정 (단순 구현)
    const wscols = [
      {wch: 16}, {wch: 10}, {wch: 20}, {wch: 15}, 
      {wch: 15}, {wch: 25}, {wch: 15}, {wch: 12}, 
      {wch: 15}, {wch: 50}, {wch: 40}
    ];
    worksheet['!cols'] = wscols;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '견적문의');
    XLSX.writeFile(workbook, `견적문의목록_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const currentData = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <AdminLayout>
      <div className="page-header">
        <h2>📋 견적 문의 관리</h2>
        <p>고객이 제출한 견적 문의를 확인하고 관리합니다. (실시간 자동 갱신)</p>
      </div>

      {/* 필터 & 검색 */}
      <div className="list-toolbar">
        <div className="filter-tabs">
          {[['all','전체'],['new','신규'],['review','검토중'],['sent','견적발송'],['done','완료'],['cancel','취소']].map(([val, label]) => (
            <button
              key={val}
              className={`filter-tab ${filter === val ? 'active' : ''}`}
              onClick={() => { setFilter(val); setCurrentPage(1); }}
            >
              {label}
              <span className="tab-count">
                {val === 'all' ? inquiries.length : inquiries.filter(i => i.status === val).length}
              </span>
            </button>
          ))}
        </div>
        <div className="toolbar-actions" style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            className="search-input"
            placeholder="회사명 또는 담당자 검색..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          />
          <button className="excel-btn" onClick={handleExcelDownload} style={{ padding: '0 15px', backgroundColor: '#217346', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            📊 엑셀 다운로드
          </button>
        </div>
      </div>

      {/* 목록 테이블 */}
      <div className="inquiry-table-wrap">
        {loading ? (
          <div className="loading-row">⏳ 데이터를 불러오는 중...</div>
        ) : (
          <table className="inquiry-table">
            <thead>
              <tr>
                <th>접수일시</th>
                <th>회사명</th>
                <th>담당자</th>
                <th>연락처</th>
                <th>서비스</th>
                <th>예상물량</th>
                <th>상태</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {currentData.length === 0 ? (
                <tr><td colSpan="8" className="empty-row">{search ? '검색 결과가 없습니다.' : '아직 접수된 문의가 없습니다.'}</td></tr>
              ) : (
                currentData.map(inq => {
                  const st = STATUS_MAP[inq.status] || STATUS_MAP['new'];
                  return (
                    <tr key={inq.id} className="inquiry-row" onClick={() => navigate(`/admin/inquiries/${inq.id}`)}>
                      <td className="td-date">{inq.createdAt}</td>
                      <td className="td-company">{inq.from_company || '-'}</td>
                      <td>{inq.from_name}</td>
                      <td>{inq.from_phone}</td>
                      <td><span className="service-tag">{inq.service_type}</span></td>
                      <td>{inq.amount || '-'}</td>
                      <td><span className={`status-badge ${st.cls}`}>{st.label}</span></td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                          <button className="detail-btn" onClick={() => navigate(`/admin/inquiries/${inq.id}`)}>상세보기</button>
                          <button className="detail-btn" style={{ backgroundColor: '#dc3545' }} onClick={(e) => handleDelete(e, inq)}>삭제</button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* 페이지네이션 영역 */}
      {!loading && totalPages > 1 && (
        <div className="pagination">
          <button 
            className="page-btn" 
            disabled={currentPage === 1} 
            onClick={() => setCurrentPage(p => p - 1)}
          >
            이전
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              className={`page-btn ${currentPage === page ? 'active' : ''}`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
          <button 
            className="page-btn" 
            disabled={currentPage === totalPages} 
            onClick={() => setCurrentPage(p => p + 1)}
          >
            다음
          </button>
        </div>
      )}
    </AdminLayout>
  );
};

export default InquiryList;
