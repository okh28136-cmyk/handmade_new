import React from 'react';
import './Service.css';

const Service = () => {
  return (
    <section className="service" id="service">
      <div className="container">
        <div className="service-list">
          {/* Row 1 */}
          <div className="service-row">
            <div className="service-img-col">
              <img src="/service_kitting.png" alt="Kitting & Packaging" />
            </div>
            <div className="service-text-col">
              <h3 className="service-item-title">Kitting & Packaging</h3>
              <span className="service-item-subtitle">담기</span>
              <p className="service-item-desc">
                제품의 특성에 맞춘 꼼꼼한 개별 포장부터, 다양한 구성품을 하나의<br />
                세트로 정교하게 조합하는 키팅 작업까지 완벽하게 수행합니다.<br />
                복잡한 수작업도 빠르고 정확하게 해결해 드립니다.
              </p>
            </div>
          </div>

          {/* Row 2 */}
          <div className="service-row reverse">
            <div className="service-img-col">
              <img src="/service_label.png" alt="Labeling" />
            </div>
            <div className="service-text-col">
              <h3 className="service-item-title">Labeling</h3>
              <span className="service-item-subtitle">붙이기</span>
              <p className="service-item-desc">
                수입 화장품 한글 표시사항, 단상자 제품 설명, 바코드 등 미세한<br />
                오차도 허용되지 않는 라벨링 작업을 정교하게 진행합니다. 언제나<br />
                정확한 위치에 깔끔한 마무리를 약속드립니다.
              </p>
            </div>
          </div>

          {/* Row 3 */}
          <div className="service-row">
            <div className="service-img-col">
              <img src="/service_assembly.png" alt="Assembly & Setting" />
            </div>
            <div className="service-text-col">
              <h3 className="service-item-title">Assembly & Setting</h3>
              <span className="service-item-subtitle">만들기</span>
              <p className="service-item-desc">
                평면 상태의 종이 박스나 단상자를 입체로 성형하고 내부 패드<br />
                (칸막이)를 결합하거나, 띠지·리본 등으로 최종 외관 디테일을<br />
                완성하는 조립 공정을 섬세하게 제공합니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Service;
