import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingKakao from '../components/FloatingKakao';
import './PageStyles.css';

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="page-wrapper">
      <Header />
      <div className="page-content-wrapper">
        <div className="page-header">
          <h1>회사소개</h1>
          <p>고객의 가치를 새롭게 디자인하는 이룸디자인</p>
        </div>
        
        <div className="page-body about-body">
          <div className="about-image">
            <img src="https://images.unsplash.com/photo-1542744094-24638ea0b56c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="이룸디자인 회사소개" />
          </div>
          
          <div className="about-text-section">
            <h2>"디자인으로 비즈니스에 날개를 달아드립니다."</h2>
            <p className="about-desc">
              안녕하십니까, <strong>이룸디자인(수작업팩토리)</strong>입니다.<br />
              저희 이룸디자인은 다년간 축적된 인쇄업 및 시각디자인 노하우를 바탕으로, 고객님의 브랜드 가치를 극대화할 수 있는 최고의 결과물을 제공합니다.
            </p>
            <p className="about-desc">
              단순한 인쇄 출력을 넘어, 트렌드를 선도하는 기획력과 창의적인 시각디자인을 결합하여 <strong>세상에 단 하나뿐인 맞춤형 주문제작</strong> 서비스를 실현하고 있습니다.<br />
              명함, 카탈로그, 포스터부터 특수 인쇄물과 패키지 디자인까지, 상상하시는 모든 것을 현실로 만들어 드립니다.
            </p>
            
            <div className="about-features">
              <div className="feature-item">
                <div className="feature-icon">✨</div>
                <h3>맞춤형 1:1 컨설팅</h3>
                <p>고객의 니즈를 정확히 파악하여 최적의 디자인 방향을 제시합니다.</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🎨</div>
                <h3>전문 시각디자인</h3>
                <p>트렌디하고 감각적인 디자인으로 브랜드의 퀄리티를 높입니다.</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🖨️</div>
                <h3>최고급 인쇄 퀄리티</h3>
                <p>최신 설비와 꼼꼼한 검수를 통해 불량 없는 완벽한 결과물을 보장합니다.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <FloatingKakao />
    </div>
  );
};

export default About;
