import React from 'react';
import './Features.css';

const Features = () => {
  return (
    <section className="features" id="features">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">WHY CHOOSE US</h2>
          <p className="section-subtitle">수작업팩토리가 특별한 3가지 이유</p>
        </div>

        <div className="features-grid">
          {/* Feature 1 */}
          <div className="feature-item">
            <div className="feature-number">01</div>
            <h3 className="feature-title">철저한 보안 시스템</h3>
            <p className="feature-desc">
              고객사의 소중한 정보와 제품이 외부로 유출되지 않도록, 
              출입 통제부터 24시간 CCTV 모니터링까지 완벽한 보안 인프라를 구축하고 있습니다.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="feature-item">
            <div className="feature-number">02</div>
            <h3 className="feature-title">완벽한 품질 관리</h3>
            <p className="feature-desc">
              숙련된 전문가들의 교차 검수와 체계적인 QC(Quality Control) 프로세스를 통해, 
              미세한 불량도 허용하지 않는 무결점 서비스를 제공합니다.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="feature-item">
            <div className="feature-number">03</div>
            <h3 className="feature-title">신속한 긴급 대응</h3>
            <p className="feature-desc">
              갑작스러운 대량 발주나 촉박한 일정에도 유연하게 대처할 수 있는 
              체계적인 인력 풀과 비상 대응 시스템을 갖추고 있습니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
