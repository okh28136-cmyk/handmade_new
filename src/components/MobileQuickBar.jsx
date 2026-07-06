import React, { useState, useEffect } from 'react';
import './MobileQuickBar.css';

const MobileQuickBar = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`mobile-quick-bar ${isVisible ? 'visible' : ''}`}>
      <a href="tel:02-2268-7512" className="quick-btn phone-btn">
        <span className="icon">📞</span>
        <span className="text">전화 상담</span>
      </a>
      <a href="#contact" className="quick-btn quote-btn" onClick={(e) => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          e.preventDefault();
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      }}>
        <span className="icon">✉️</span>
        <span className="text">견적 문의</span>
      </a>
    </div>
  );
};

export default MobileQuickBar;
