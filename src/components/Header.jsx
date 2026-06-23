import React, { useState } from 'react';
import './Header.css';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="container header-container">
        <div className="logo">
          <h1>수작업팩토리</h1>
        </div>
        
        {/* PC 내비게이션 & 모바일 드로어 메뉴 */}
        <nav className={`nav-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          <ul>
            <li><a href="#service" onClick={closeMenu}>Service</a></li>
            <li><a href="#sketch" onClick={closeMenu}>현장스케치</a></li>
            <li><a href="#faq" onClick={closeMenu}>FAQ</a></li>
            <li><a href="#contact" onClick={closeMenu}>견적문의</a></li>
          </ul>
          
          {/* 모바일에서만 보이는 연락처 정보 */}
          <div className="mobile-contact-info">
            <p>상담 및 문의</p>
            <a href="tel:02-2268-7512" className="mobile-phone-link">02-2268-7512</a>
          </div>
        </nav>

        {/* 모바일 햄버거 버튼 */}
        <button 
          className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`} 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* 모바일 메뉴 열렸을 때 배경 어둡게 */}
        <div 
          className={`mobile-overlay ${isMobileMenuOpen ? 'active' : ''}`} 
          onClick={closeMenu}
        ></div>
      </div>
    </header>
  );
};

export default Header;
