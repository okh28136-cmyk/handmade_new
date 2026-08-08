import React from 'react';
import { motion } from 'motion/react';
import './Service.css';

const fadeUpVariant = {
  hidden: { opacity: 0, y: 50 },
  visible: (custom) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: custom * 0.15, ease: [0.16, 1, 0.3, 1] }
  })
};

const Service = () => {
  return (
    <section className="service" id="service">
      <div className="container">
        <h2 style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }}>수작업팩토리 핵심 서비스: 포장, 라벨링, 조립</h2>
        <div className="service-list">
          {/* Row 1 */}
          <motion.article 
            className="service-row"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUpVariant}
            custom={0}
          >
            <div className="service-img-col">
              <img src="/service_kitting.png" alt="기획 세트 포장 및 조립 대행 (Kitting & Packaging)" />
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
          </motion.article>

          {/* Row 2 */}
          <motion.article 
            className="service-row reverse"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUpVariant}
            custom={1}
          >
            <div className="service-img-col">
              <img src="/service_label.png" alt="라벨링 및 바코드 부착 작업 (Labeling)" />
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
          </motion.article>

          {/* Row 3 */}
          <motion.article 
            className="service-row"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUpVariant}
            custom={2}
          >
            <div className="service-img-col">
              <img src="/service_assembly.png" alt="복합 수작업 조립 및 세팅 (Assembly & Setting)" />
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
          </motion.article>
        </div>
      </div>
    </section>
  );
};

export default Service;
