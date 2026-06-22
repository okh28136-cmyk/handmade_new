import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="container header-container">
        <div className="logo">
          <h1>수작업팩토리</h1>
        </div>
        <nav className="nav-menu">
          <ul>
            <li><a href="#service">Service</a></li>
            <li><a href="#sketch">현장스케치</a></li>
            <li><a href="#faq">FAQ</a></li>
            <li><a href="#contact">견적문의</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
