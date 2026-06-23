import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
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
              onClick={() => setFilter(val)}
            >
              {label}
              <span className="tab-count">
                {val === 'all' ? inquiries.length : inquiries.filter(i => i.status === val).length}
              </span>
            </button>
          ))}
        </div>
        <input
          type="text"
          className="search-input"
          placeholder="회사명 또는 담당자 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
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
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" className="empty-row">
                    {inquiries.length === 0 ? '아직 접수된 문의가 없습니다.' : '검색 결과가 없습니다.'}
                  </td>
                </tr>
              ) : (
                filtered.map(item => {
                  const st = STATUS_MAP[item.status] || STATUS_MAP['new'];
                  return (
                    <tr key={item.id} className="inquiry-row" onClick={() => navigate(`/admin/inquiries/${item.id}`)}>
                      <td className="td-date">{item.createdAt}</td>
                      <td className="td-company">{item.from_company || '-'}</td>
                      <td>{item.from_name}</td>
                      <td>{item.from_phone}</td>
                      <td><span className="service-tag">{item.service_type}</span></td>
                      <td>{item.amount || '-'}</td>
                      <td><span className={`status-badge ${st.cls}`}>{st.label}</span></td>
                      <td onClick={e => e.stopPropagation()}>
                        <button className="detail-btn" onClick={() => navigate(`/admin/inquiries/${item.id}`)}>
                          상세보기
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
};

export default InquiryList;
