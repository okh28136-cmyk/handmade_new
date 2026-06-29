import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Hero.css';

const images = [
  "/hero-bg-3.jpeg",
  "/hero-bg-2.jpeg"
];

// 무한 슬라이드를 위해 첫 번째 이미지를 배열 끝에 복제
const extendedImages = [...images, images[0]];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(true);

  const nextSlide = () => {
    if (currentSlide >= images.length) return; // 트랜지션 중 연타 방지
    setTransitionEnabled(true);
    setCurrentSlide((prev) => prev + 1);
  };

  const prevSlide = () => {
    if (currentSlide === 0) {
      // 첫 슬라이드에서 이전 버튼을 누르면, 트랜지션 없이 맨 끝(복제본)으로 이동 후 바로 실제 마지막 이미지로 슬라이드
      setTransitionEnabled(false);
      setCurrentSlide(images.length);
      setTimeout(() => {
        setTransitionEnabled(true);
        setCurrentSlide(images.length - 1);
      }, 50);
    } else {
      setTransitionEnabled(true);
      setCurrentSlide((prev) => prev - 1);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 4000); // 4초마다 우측에서 좌측으로 슬라이드
    return () => clearInterval(timer);
  }, [currentSlide]);

  useEffect(() => {
    // 복제본(배열의 마지막)에 도달하여 슬라이드 애니메이션이 끝난 후(0.8초 뒤)
    // 트랜지션을 끄고 몰래 실제 첫 번째 이미지(index 0)로 둔갑시킴
    if (currentSlide === images.length) {
      const resetTimer = setTimeout(() => {
        setTransitionEnabled(false);
        setCurrentSlide(0);
      }, 800); // CSS transition 시간과 동일하게 대기
      return () => clearTimeout(resetTimer);
    }
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
          style={{ 
            transform: `translateX(-${currentSlide * 100}%)`,
            transition: transitionEnabled ? 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)' : 'none'
          }}
        >
          {extendedImages.map((imgSrc, index) => (
            <img 
              key={index}
              src={imgSrc} 
              alt={`Handmade Factory Background ${index}`} 
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
