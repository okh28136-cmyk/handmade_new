import React from 'react';
import './Features.css';

const Features = () => {
  return (
    <section className="features" id="features">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">
            골치 아픈 포장, 수작업<br />
            신뢰할수있는 수작업팩토리에서<br />
            완벽하게 해결해드립니다.
          </h2>
        </div>

        <div className="features-list-minimal">
          <div className="feature-minimal-item">
            <span className="feature-num">01</span>
            <div className="feature-text">
              <h3 className="feature-title">철저한 보안 시스템</h3>
              <p className="feature-desc">
                고객사의 소중한 정보와 제품이 사전에 외부로 유출되지 않도록,<br />
                필요한경우 출입 통제부터 CCTV 모니터링까지 완벽한 보안 인프라를 구축하고 있습니다.
              </p>
            </div>
          </div>
          
          <div className="feature-minimal-item">
            <span className="feature-num">02</span>
            <div className="feature-text">
              <h3 className="feature-title">신속한 긴급 대응</h3>
              <p className="feature-desc">
                갑작스러운 대량 발주나 매우 촉박한 일정 등 예상치 못한 변수 앞에서도<br />
                유연하게 대처할 수 있습니다.
              </p>
            </div>
          </div>

          <div className="feature-minimal-item">
            <span className="feature-num">03</span>
            <div className="feature-text">
              <h3 className="feature-title">완벽한 품질 관리 (QC)</h3>
              <p className="feature-desc">
                기계가 담아내지 못하는 디테일을 숙련된 작업자의 철저한 교차 검수와<br />
                체계적인 QC 프로세스를 통해 미세한 물량도 허용하지 않는 무결점 서비스를 제공합니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
