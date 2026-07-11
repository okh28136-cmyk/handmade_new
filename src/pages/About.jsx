import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingKakao from '../components/FloatingKakao';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import './PageStyles.css';

const fadeUpVariant = {
  hidden: { opacity: 0, y: 50 },
  visible: (custom) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: custom * 0.1, ease: [0.16, 1, 0.3, 1] }
  })
};

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="page-wrapper about-page">
      <Helmet>
        <title>회사소개 | 수작업팩토리</title>
        <meta name="description" content="수작업팩토리(이룸디자인)의 회사 비전, 포장 대행 철학 및 최적화된 물류 작업 환경을 소개합니다." />
      </Helmet>
      
      <Header />
      <div className="premium-container">
        <motion.div 
          className="premium-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUpVariant}
          custom={0}
        >
          <span className="premium-tag">About Us</span>
          <h2 className="premium-title font-playfair">WHO WE ARE</h2>
          <p className="premium-subtitle">고객의 가치를 새롭게 디자인하는 이룸디자인</p>
        </motion.div>
        
        <div className="about-text-centered">
          <motion.div 
            className="about-text-content"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUpVariant}
            custom={2}
          >
            <h2>"복잡하고 까다로운 수작업,<br/>저희가 가장 빠르고 정확하게 해결합니다."</h2>
            <p>
              안녕하십니까, <strong>수작업팩토리(이룸디자인)</strong>입니다.<br />
              저희 수작업팩토리는 단순 포장부터 라벨링, 복합 조립, 그리고 배송 대행까지 기계가 할 수 없는 가장 정교하고 섬세한 수작업을 전문으로 대행하고 있습니다.
            </p>
            <p>
              <strong>"고객의 골치 아픈 물류 및 포장 고민을 완벽하게 덜어드리자"</strong>는 철학 아래, 철저한 품질 관리(QC)와 신속한 긴급 대응 시스템을 갖추고 있습니다. 다년간 축적된 노하우와 숙련된 전문 인력을 바탕으로, 고객님의 제품 가치를 극대화할 수 있는 완벽한 결과물과 든든한 파트너십을 약속드립니다.
            </p>
          </motion.div>
        </div>

        <div className="about-features-grid">
          <motion.div 
            className="premium-feature-card"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUpVariant}
            custom={3}
          >
            <div className="icon">✨</div>
            <h3>맞춤형 1:1 컨설팅</h3>
            <p>고객의 제품 특성과 납기일을 정확히 파악하여 최적의 작업 단가와 방향을 제시합니다.</p>
          </motion.div>
          
          <motion.div 
            className="premium-feature-card"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUpVariant}
            custom={4}
          >
            <div className="icon">🛠️</div>
            <h3>전문 수작업 노하우</h3>
            <p>오랜 경험의 숙련된 인력들이 어떤 형태의 까다로운 패키징 작업도 완벽하게 소화합니다.</p>
          </motion.div>
          
          <motion.div 
            className="premium-feature-card"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUpVariant}
            custom={5}
          >
            <div className="icon">🔍</div>
            <h3>철저한 품질 검수 (QC)</h3>
            <p>꼼꼼한 다중 검수 시스템을 통해 불량률 제로에 도전하는 최상의 퀄리티를 보장합니다.</p>
          </motion.div>
        </div>
      </div>
      <Footer />
      <FloatingKakao />
    </div>
  );
};

export default About;
