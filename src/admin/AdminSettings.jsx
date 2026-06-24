import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import AdminLayout from './AdminLayout';
import './AdminSettings.css';

const AdminSettings = () => {
  // 팝업 상태
  const [isPopupActive, setIsPopupActive] = useState(false);
  const [popupTitle, setPopupTitle] = useState('');
  const [popupContent, setPopupContent] = useState('');
  
  // 애널리틱스 상태
  const [trackingId, setTrackingId] = useState('');

  const [loading, setLoading] = useState(true);

  // Firestore 데이터 불러오기
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // 팝업 설정 불러오기
        const popupDoc = await getDoc(doc(db, 'settings', 'popup'));
        if (popupDoc.exists()) {
          const data = popupDoc.data();
          setIsPopupActive(data.isActive || false);
          setPopupTitle(data.title || '');
          setPopupContent(data.content || '');
        }

        // 애널리틱스 설정 불러오기
        const analyticsDoc = await getDoc(doc(db, 'settings', 'analytics'));
        if (analyticsDoc.exists()) {
          setTrackingId(analyticsDoc.data().trackingId || '');
        }
      } catch (err) {
        console.error('설정 로드 에러:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSavePopup = async () => {
    try {
      await setDoc(doc(db, 'settings', 'popup'), {
        isActive: isPopupActive,
        title: popupTitle,
        content: popupContent
      });
      alert('팝업 설정이 저장되었습니다.');
    } catch (err) {
      console.error('팝업 저장 에러:', err);
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  const handleSaveAnalytics = async () => {
    try {
      await setDoc(doc(db, 'settings', 'analytics'), {
        trackingId: trackingId.trim()
      });
      alert('구글 애널리틱스 설정이 저장되었습니다.');
    } catch (err) {
      console.error('애널리틱스 저장 에러:', err);
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="page-header">
          <h2>⚙️ 사이트 전체 설정</h2>
        </div>
        <p style={{ padding: '20px' }}>설정 데이터를 불러오는 중입니다...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="page-header">
        <h2>⚙️ 사이트 전체 설정</h2>
        <p>메인 홈페이지에 띄울 팝업 공지와 구글 애널리틱스(방문자 통계)를 관리합니다.</p>
      </div>

      <div className="admin-settings-container">
        
        {/* 긴급 공지 팝업 설정 패널 */}
        <div className="settings-panel">
          <h3>📢 긴급 공지 팝업 관리</h3>
          <p className="panel-desc">명절 휴무, 이벤트 등 중요한 안내사항을 홈페이지 중앙에 띄울 수 있습니다.</p>
          
          <div className="form-group toggle-group">
            <label>팝업 노출 여부 (ON/OFF)</label>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={isPopupActive} 
                onChange={(e) => setIsPopupActive(e.target.checked)} 
              />
              <span className="slider round"></span>
            </label>
            <span className="toggle-status">
              {isPopupActive ? '현재 팝업이 노출되고 있습니다.' : '팝업이 숨겨진 상태입니다.'}
            </span>
          </div>

          <div className="form-group">
            <label>팝업 제목 (Title)</label>
            <input 
              type="text" 
              value={popupTitle} 
              onChange={(e) => setPopupTitle(e.target.value)} 
              placeholder="예: 설 연휴 배송 마감 안내" 
              disabled={!isPopupActive}
            />
          </div>

          <div className="form-group">
            <label>팝업 내용 (Content)</label>
            <textarea 
              rows="5" 
              value={popupContent} 
              onChange={(e) => setPopupContent(e.target.value)} 
              placeholder="내용을 입력해주세요. 줄바꿈 시 실제 팝업에서도 줄바꿈 처리됩니다." 
              disabled={!isPopupActive}
            />
          </div>

          <button className="btn-save" onClick={handleSavePopup}>
            팝업 설정 저장하기
          </button>
        </div>

        {/* 구글 애널리틱스 설정 패널 */}
        <div className="settings-panel">
          <h3>📊 방문자 통계 연동 (GA4 / GTM)</h3>
          <p className="panel-desc">
            구글 애널리틱스(GA4)의 <strong>추적 ID(G-XXXXXXXXXX)</strong> 또는 구글 태그 관리자(GTM)의 <strong>컨테이너 ID(GTM-XXXXXXX)</strong>를 입력해 주세요.<br/>
            추적 ID를 입력하고 저장하는 즉시 실시간 통계 수집이 시작됩니다.
          </p>

          <div className="form-group">
            <label>추적 ID (G- 또는 GTM- 시작)</label>
            <input 
              type="text" 
              value={trackingId} 
              onChange={(e) => setTrackingId(e.target.value)} 
              placeholder="예: G-1A2B3C4D5E 또는 GTM-MRLMLTG2" 
            />
          </div>

          <button className="btn-save" onClick={handleSaveAnalytics}>
            통계 설정 저장하기
          </button>
        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
