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
              손이 많이 가고 복잡한 수작업<br/>
              <strong>저희가 제일 잘 합니다.</strong>
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
        <div 
          className="hero-bg-layer"
          style={{ backgroundImage: `url(/hero-bg-2.jpeg)` }}
        />
        {/* 가독성을 높이기 위한 어두운 오버레이 */}
        <div className="hero-overlay"></div>
        <div className="hero-overlay-text font-playfair">
          HANDMADE FACTORY
        </div>
      </div>
    </section>
  );
};

export default Hero;
