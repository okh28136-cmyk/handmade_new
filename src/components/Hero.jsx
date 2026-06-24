import React, { useState, useEffect } from 'react';
import './Hero.css';

const Hero = () => {
  const [currentImg, setCurrentImg] = useState(0);
  const images = ['/hero-bg-1.jpg', '/hero-bg-2.jpeg'];

  useEffect(() => {
    // 5초 간격으로 이미지 인덱스 변경
    const timer = setInterval(() => {
      setCurrentImg((prev) => (prev === 0 ? 1 : 0));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

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
        <div 
          className="hero-slider" 
          style={{ transform: `translateX(-${currentImg * 100}%)` }}
        >
          {images.map((src, index) => (
            <div 
              key={index}
              className="hero-bg-layer"
              style={{ backgroundImage: `url(${src})` }}
            />
          ))}
        </div>
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
