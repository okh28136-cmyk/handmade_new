import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-video-bg">
        <video 
          className="native-video-bg"
          autoPlay 
          loop 
          muted 
          playsInline
          poster="/heri-3.jpeg"
        >
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay"></div>
      </div>
      
      <div className="container hero-content-container">
        <div className="hero-content">
          <div className="hero-badge">PREMIUM PACKAGING PARTNER</div>
          
          <div className="hero-title-group">
            <h1 className="hero-title">
              손이 많이 가고 복잡한 수작업<br />
              <strong>쉽고 간단하게 해결하세요.</strong>
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
