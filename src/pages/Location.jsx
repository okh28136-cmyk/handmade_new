import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingKakao from '../components/FloatingKakao';
import './PageStyles.css';

const Location = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="page-wrapper">
      <Header />
      <div className="page-content-wrapper">
        <div className="page-header">
          <h1>찾아오시는 길</h1>
          <p>이룸디자인(수작업팩토리) 오시는 길을 안내해 드립니다.</p>
        </div>
        
        <div className="page-body location-body">
          <div className="map-container">
            {/* 카카오맵이나 구글맵 임베드 권장 (현재는 디자인 플레이스홀더) */}
            <div className="map-placeholder">
              <div className="map-marker">📍</div>
              <p>서울특별시 중구 필동로9 이룸디자인 (필빌딩 2층)</p>
            </div>
          </div>
          
          <div className="location-info-section">
            <div className="info-card">
              <div className="info-icon">🏢</div>
              <div className="info-text">
                <h3>본사 주소</h3>
                <p>04624 서울특별시 중구 필동로9 이룸디자인 (필빌딩 2층)</p>
              </div>
            </div>
            
            <div className="info-card">
              <div className="info-icon">📞</div>
              <div className="info-text">
                <h3>고객센터</h3>
                <p>02-2268-7512</p>
                <p className="sub-text">평일 09:00 - 18:00 (주말/공휴일 휴무)</p>
              </div>
            </div>
            
            <div className="info-card">
              <div className="info-icon">✉️</div>
              <div className="info-text">
                <h3>이메일 문의</h3>
                <p>jyy1422@iroum.co.kr</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <FloatingKakao />
    </div>
  );
};

export default Location;
