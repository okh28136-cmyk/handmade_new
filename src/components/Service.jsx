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
        <h2 style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }}>
          수작업팩토리 핵심 서비스: 임가공 업체, 포장 대행 업체, 수작업 포장 대행, 화장품 포장 임가공, 라벨 부착 대행, DM 발송 대행, 선물세트 포장 대행
        </h2>
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
              <img src="/service_kitting.png" alt="수작업 포장 대행 및 선물세트 포장 대행·포장 대행 업체 (Kitting & Packaging)" loading="lazy" />
            </div>
            <div className="service-text-col">
              <h3 className="service-item-title">Kitting & Packaging</h3>
              <span className="service-item-subtitle">담기</span>
              <p className="service-item-desc">
                제품 특성에 맞춘 수작업 포장 대행부터, 다양한 구성품을 조합하는<br />
                선물세트 포장 대행 및 기업 우편물·판촉물 DM 발송 대행까지 수행합니다.<br />
                든든한 포장 대행 업체로서 복잡한 수작업도 빠르게 해결해 드립니다.
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
              <img src="/service_label.png" alt="라벨 부착 대행 및 화장품 포장 임가공·바코드 스티커 부착 (Labeling)" loading="lazy" />
            </div>
            <div className="service-text-col">
              <h3 className="service-item-title">Labeling</h3>
              <span className="service-item-subtitle">붙이기</span>
              <p className="service-item-desc">
                수입품 한글 표시사항, 화장품 포장 임가공, 바코드·스티커 등 미세한<br />
                오차도 허용되지 않는 정밀 라벨 부착 대행 작업을 진행합니다. 언제나<br />
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
              <img src="/service_assembly.png" alt="임가공 업체 복합 수작업 조립 및 DM 발송 대행·단상자 세팅 (Assembly & Setting)" loading="lazy" />
            </div>
            <div className="service-text-col">
              <h3 className="service-item-title">Assembly & Setting</h3>
              <span className="service-item-subtitle">만들기</span>
              <p className="service-item-desc">
                평면 상태의 종이 박스나 단상자를 입체로 성형하고 내부 패드<br />
                (칸막이)를 결합하거나, 띠지·리본 등으로 최종 외관 디테일을<br />
                완성하는 전문 임가공 업체의 조립 공정을 섬세하게 제공합니다.
              </p>
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  );
};

export default Service;
