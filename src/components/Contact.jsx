import React, { useState } from 'react';
import './Contact.css';
import Calculator from './Calculator';

const Contact = () => {
  const [calcStep, setCalcStep] = useState(1);

  return (
    <section className="contact" id="contact">
      {/* 헤더 섹션 */}
      <div className="container" style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span className="contact-tag font-playfair" style={{ margin: '0 auto 1.5rem auto' }}>EXPERT CONSULTATION</span>
        <h2 className="contact-title font-playfair" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>REQUEST A QUOTE</h2>
        <p className="contact-desc" style={{ marginBottom: 0, marginLeft: 'auto', marginRight: 'auto', maxWidth: '600px', textAlign: 'center' }}>
          작업의 난이도, 물량, 일정에 맞는 최적의 단가와 솔루션을 제안해 드립니다.
        </p>
      </div>

      {/* 자동견적기 메인 영역 (가운데 넓게) */}
      <div className="container" style={{ maxWidth: '1200px', marginBottom: '5rem' }}>
        <div className="contact-form-container" style={{ width: '100%' }}>
          <Calculator onStepChange={setCalcStep} />
        </div>
      </div>

      {/* 하단 회사 연락처 정보 */}
      <div className="container" style={{ maxWidth: '1200px' }}>
        <div className="contact-details-editorial">
          <div className="editorial-left">
            <h3 className="editorial-heading font-playfair">HEADQUARTERS</h3>
            <p className="editorial-desc">
              수작업팩토리는 완벽한 디테일을 위해<br />
              최고의 설비와 인프라를 갖추고 있습니다.
            </p>
          </div>
          <div className="editorial-right">
            <div className="editorial-group">
              <span className="editorial-label">ADDRESS</span>
              <span className="editorial-value">서울특별시 중구 필동로9</span>
            </div>
            <div className="editorial-group">
              <span className="editorial-label">DIRECT LINE</span>
              <span className="editorial-value">02-2268-7512</span>
              <span className="editorial-sub">FAX. 02-2268-7514</span>
            </div>
            <div className="editorial-group">
              <span className="editorial-label">EMAIL</span>
              <span className="editorial-value">jyy1422@iroum.co.kr</span>
            </div>
            <div className="editorial-group">
              <span className="editorial-label">BUSINESS HOURS</span>
              <span className="editorial-value">평일 09:00 - 18:00</span>
              <span className="editorial-sub">LUNCH. 12:00 - 13:00</span>
            </div>
          </div>
        </div>

        <div className="contact-notice-bottom">
          <p>* 방문 상담을 원하실 경우 사전에 전화로 일정을 예약해 주시기 바랍니다.</p>
          <p>* 대량 견적의 경우 샘플을 보내주시면 더 정확한 산출이 가능합니다.</p>
        </div>
      </div>
    </section>
  );
};

export default Contact;
