import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Hero.css';

const images = [
  "/hero-bg-3.jpeg",
  "/hero-bg-2.jpeg"
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 4000); // 4초마다 슬라이드 변경 (우측에서 좌측으로)
    return () => clearInterval(timer);
  }, [currentSlide]);

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
          className="hero-slider"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {images.map((imgSrc, index) => (
            <img 
              key={index}
              src={imgSrc} 
              alt={`Handmade Factory Background ${index + 1}`} 
              className="hero-bg-image"
            />
          ))}
        </div>
        
        {/* 화살표 버튼 추가 */}
        <button className="hero-slider-btn prev" onClick={prevSlide}>
          <ChevronLeft size={36} />
        </button>
        <button className="hero-slider-btn next" onClick={nextSlide}>
          <ChevronRight size={36} />
        </button>
      </div>
    </section>
  );
};

export default Hero;
