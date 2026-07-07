import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingKakao from '../components/FloatingKakao';
import { motion } from 'motion/react';
import './PageStyles.css';

const fadeUpVariant = {
  hidden: { opacity: 0, y: 50 },
  visible: (custom) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: custom * 0.1, ease: [0.16, 1, 0.3, 1] }
  })
};

const Location = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="page-wrapper">
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
          <span className="premium-tag">Location</span>
          <h1 className="premium-title font-playfair">OUR LOCATION</h1>
          <p className="premium-subtitle">이룸디자인(수작업팩토리) 오시는 길을 안내해 드립니다.</p>
        </motion.div>
        
        <div className="location-grid">
          <motion.div 
            className="location-info-list"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUpVariant}
            custom={1}
          >
            <div className="location-item">
              <div className="icon">🏢</div>
              <div className="location-text">
                <h3>Address</h3>
                <p>서울특별시 중구 필동로9</p>
                <span className="sub-text">이룸디자인 (필빌딩 2층)</span>
              </div>
            </div>
            
            <div className="location-item">
              <div className="icon">📞</div>
              <div className="location-text">
                <h3>Contact</h3>
                <p>02-2268-7512</p>
                <span className="sub-text">평일 09:00 - 18:00 (주말/공휴일 휴무)</span>
              </div>
            </div>
            
            <div className="location-item">
              <div className="icon">✉️</div>
              <div className="location-text">
                <h3>Email</h3>
                <p>jyy1422@iroum.co.kr</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="map-premium-wrapper"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUpVariant}
            custom={2}
          >
            {/* TODO: 카카오맵 등 삽입 시 이 영역을 교체하세요 */}
            <div className="map-placeholder">
              <div className="map-icon">📍</div>
              <p>서울특별시 중구 필동로9</p>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
      <FloatingKakao />
    </div>
  );
};

export default Location;
