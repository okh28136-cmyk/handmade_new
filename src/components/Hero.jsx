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
        <img 
          src="/hero-bg-3.jpeg" 
          alt="Handmade Factory Background" 
          className="hero-bg-image"
        />
      </div>
      <div className="hero-text-bottom">
        HANDMADE FACTORY
      </div>
    </section>
  );
};

export default Hero;
