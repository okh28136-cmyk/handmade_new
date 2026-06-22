import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <span className="hero-badge">PREMIUM PACKAGING PARTNER</span>
          <div className="hero-title-group">
            <h1 className="hero-title">
              수작업팩토리와 함께<br/>
              <strong>성공을 포장하세요.</strong>
            </h1>
            <button 
              className="hero-cta-button"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              견적 문의하기 ➔
            </button>
          </div>
        </div>
      </div>
      <div className="hero-image-wrapper">
        {/* public 폴더에 옮겨질 1920-800.jpg 사용 */}
        <img src="/hero-bg.jpg" alt="수작업팩토리 작업 현장" className="hero-image" />
        <div className="hero-overlay-text font-playfair">
          HANDMADE FACTORY
        </div>
      </div>
    </section>
  );
};

export default Hero;
