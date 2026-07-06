import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="container">
        
        <div className="hero-video-box">
          <video 
            className="hero-video"
            autoPlay 
            loop 
            muted 
            playsInline
            poster="/heri-3.jpeg"
          >
            <source src="/hero-bg.mp4" type="video/mp4" />
          </video>
          <div className="hero-video-overlay"></div>
          
          <div className="hero-video-text">
            <h2>
              손이 많이 가고 복잡한 수작업<br />
              <strong>저희가 제일 잘 합니다.</strong>
            </h2>
          </div>
        </div>

        <div className="hero-bottom-text">
          <h3>아직도 직접 밤새워 포장하시나요?"</h3>
          <p>
            기계가 할 수 없는 가장 정교한 포장및 수작업을<br />
            합리적인 맞춤 단가로 제공합니다.
          </p>
        </div>
        
      </div>
    </section>
  );
};

export default Hero;
