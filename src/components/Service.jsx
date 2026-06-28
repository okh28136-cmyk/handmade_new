import React, { useState } from 'react';
import './Service.css';

const Service = () => {
  // 0: 첫번째 박스, 1: 두번째 박스, 2: 세번째 박스
  const [expandedIndex, setExpandedIndex] = useState(0);

  return (
    <section className="service" id="service">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">SERVICE</h2>
          <p className="section-subtitle">
            까다롭고 손이 많이 가는 포장 및 수작업 쉽고 간단하게 해결하세요.
          </p>
        </div>
        
        <div 
          className="service-cards" 
          // 마우스가 전체 영역을 벗어나면 다시 첫번째가 열리도록 (또는 마지막 상태 유지하려면 이 줄을 지우면 됩니다)
          onMouseLeave={() => setExpandedIndex(0)} 
        >
          {/* Card 0: 담기 */}
          <div 
            className={`service-card ${expandedIndex === 0 ? 'expanded' : 'folded'}`}
            onMouseEnter={() => setExpandedIndex(0)}
          >
            <div className="card-content-wrapper">
              <div className="card-text">
                <h3>담기</h3>
                <p className="subtitle">키팅 및 패키징 (Kitting & Packaging)</p>
                <p className="description">
                  제품의 특성에 맞춘 꼼꼼한 개별 포장부터, 다양한 구성품을 하나의 세트로 정교하게 조합하는 키팅 작업까지 완벽하게 수행합니다. 복잡한 수작업도 빠르고 정확하게 해결해 드립니다.
                </p>
              </div>
            </div>
          </div>
          
          {/* Card 1: 붙이기 */}
          <div 
            className={`service-card ${expandedIndex === 1 ? 'expanded' : 'folded'}`}
            onMouseEnter={() => setExpandedIndex(1)}
          >
            <div className="card-content-wrapper">
              <div className="card-text">
                <h3>붙이기</h3>
                <p className="subtitle">라벨링 및 바코드 부착 (Labeling)</p>
                <p className="description">
                  수입 화장품 한글 표시사항, 단상자 제품 설명, 바코드 등 미세한 오차도 허용되지 않는 라벨링 작업을 정교하게 진행합니다. 언제나 정확한 위치에 깔끔한 마무리를 약속드립니다.
                </p>
              </div>
            </div>
          </div>
          
          {/* Card 2: 만들기 */}
          <div 
            className={`service-card ${expandedIndex === 2 ? 'expanded' : 'folded'}`}
            onMouseEnter={() => setExpandedIndex(2)}
          >
            <div className="card-content-wrapper">
              <div className="card-text">
                <h3>만들기</h3>
                <p className="subtitle">상자 조립 및 세팅 (Assembly & Setting)</p>
                <p className="description">
                  평면 상태의 종이 박스나 단상자를 입체로 성형하고 내부 패드(칸막이)를 결합하거나, 띠지·리본 등으로 최종 외관 디테일을 완성하는 조립 공정을 제공합니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 서비스 영역 하단 견적문의 유도 버튼 추가 */}
        <div className="service-cta-container">
          <button 
            className="service-cta-button"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            견적 문의하기 ➔
          </button>
        </div>
      </div>
    </section>
  );
};

export default Service;
