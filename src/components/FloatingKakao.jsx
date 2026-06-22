import React from 'react';
import './FloatingKakao.css';

const FloatingKakao = () => {
  return (
    <a 
      href="http://pf.kakao.com/_YYqxmn/chat" 
      target="_blank" 
      rel="noopener noreferrer" 
      className="floating-kakao"
      aria-label="카카오톡 채널 상담하기"
    >
      <span className="notification-dot"></span>
      <div className="kakao-icon">
        {/* 카카오톡 말풍선 아이콘 심볼 */}
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 15C25.147 15 5 31.544 5 51.948c0 13.088 8.162 24.595 20.61 31.066-1.323 4.544-2.867 10.353-3.088 11.53-.294 1.544.735 1.544 1.544 1.03 1.03-.662 12.059-8.088 16.691-11.47 2.941.441 6.029.662 9.265.662 24.853 0 45-16.544 45-36.948S74.853 15 50 15z" fill="#3C1E1E"/>
        </svg>
      </div>
      <span className="kakao-text">카톡상담</span>
    </a>
  );
};

export default FloatingKakao;
