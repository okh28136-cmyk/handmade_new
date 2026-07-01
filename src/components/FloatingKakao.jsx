import React from 'react';
import { Link } from 'react-router-dom';
import './FloatingKakao.css';

const FloatingKakao = () => {
  return (
    <div className="floating-container">
      {/* 카카오톡 상담 버튼 */}
      <a 
        href="http://pf.kakao.com/_YYqxmn/chat" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="floating-btn kakao-btn"
        aria-label="카카오톡 채널 상담하기"
      >
        <span className="notification-dot"></span>
        <div className="kakao-icon">
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 15C25.147 15 5 31.544 5 51.948c0 13.088 8.162 24.595 20.61 31.066-1.323 4.544-2.867 10.353-3.088 11.53-.294 1.544.735 1.544 1.544 1.03 1.03-.662 12.059-8.088 16.691-11.47 2.941.441 6.029.662 9.265.662 24.853 0 45-16.544 45-36.948S74.853 15 50 15z" fill="#3C1E1E"/>
          </svg>
        </div>
        <span className="btn-text">카톡상담</span>
      </a>

      {/* 결제하기 버튼 */}
      <Link to="/payment" className="floating-btn payment-btn" aria-label="온라인 결제하기">
        <div className="payment-icon">💳</div>
        <span className="btn-text">결제하기</span>
      </Link>
    </div>
  );
};

export default FloatingKakao;
