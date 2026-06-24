import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [lookerStudioUrl, setLookerStudioUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const docRef = doc(db, 'settings', 'analytics');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().lookerStudioUrl) {
          setLookerStudioUrl(docSnap.data().lookerStudioUrl);
        }
      } catch (err) {
        console.error('대시보드 링크 로드 실패:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="page-header">
          <h2>📊 통계 대시보드</h2>
        </div>
        <div className="dashboard-loading">데이터를 불러오는 중입니다...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="page-header" style={{ marginBottom: '20px' }}>
        <h2>📊 방문자 통계 대시보드</h2>
        <p>홈페이지 방문자들의 데이터를 시각화하여 확인합니다.</p>
      </div>

      <div className="dashboard-container">
        {lookerStudioUrl ? (
          <iframe 
            src={lookerStudioUrl} 
            className="dashboard-iframe" 
            title="Google Looker Studio"
            allowFullScreen
          />
        ) : (
          <div className="dashboard-empty-state">
            <div className="empty-icon">📈</div>
            <h3>아직 연결된 대시보드가 없습니다.</h3>
            <p>
              구글 루커 스튜디오(Looker Studio)에서 생성한 통계 보고서의 임베드 링크를 등록해 주세요.<br/>
              링크를 등록하시면 이 화면에서 홈페이지를 나가지 않고 실시간 통계를 볼 수 있습니다.
            </p>
            <Link to="/admin/settings" className="btn-go-settings">
              사이트 설정으로 이동하여 링크 등록하기
            </Link>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
