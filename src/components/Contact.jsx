import React from 'react';
import './Contact.css';
import Calculator from './Calculator';

const Contact = () => {
  return (
    <section className="contact" id="contact">
      <div className="container">
        <div className="contact-wrapper">
          
          {/* 좌측 안내 문구 영역 */}
          <div className="contact-info">
            <span className="contact-tag font-playfair">EXPERT CONSULTATION</span>
            <h2 className="contact-title font-playfair">REQUEST<br/>A QUOTE</h2>
            <p className="contact-desc">
              작업의 난이도, 물량, 일정에 맞는<br/>최적의 단가와 솔루션을 제안해 드립니다.
            </p>
            
            <div className="contact-details">
              <div className="detail-item">
                <span className="detail-icon">📍</span>
                <div className="detail-text-group">
                  <span className="detail-label">Address</span>
                  <span className="detail-value-small">서울특별시 중구 필동로9</span>
                </div>
              </div>
              
              <div className="detail-item">
                <span className="detail-icon">✉️</span>
                <div className="detail-text-group">
                  <span className="detail-label">EMAIL</span>
                  <span className="detail-value-small">jyy1422@iroum.co.kr</span>
                </div>
              </div>
              
              <div className="detail-item">
                <span className="detail-icon">📞</span>
                <div className="detail-text-group">
                  <span className="detail-label">Direct Line</span>
                  <span className="detail-value-bold">02-2268-7512</span>
                  <span className="detail-sub">Fax: 02-2268-7514</span>
                </div>
              </div>
              
              <div className="detail-item">
                <span className="detail-icon">🕒</span>
                <div className="detail-text-group">
                  <span className="detail-label">Business Hours</span>
                  <span className="detail-value-small">평일 09:00 - 18:00</span>
                  <span className="detail-sub">점심시간 12:00 - 13:00</span>
                </div>
              </div>
            </div>

            <div className="contact-notice">
              <p>* 방문 상담을 원하실 경우 사전에 전화로 일정을 예약해 주시기 바랍니다.</p>
              <p>* 대량 견적의 경우 샘플을 보내주시면 더 정확한 산출이 가능합니다.</p>
            </div>
          </div>

          {/* 우측 견적 문의 영역 (계산기 임베딩) */}
          <div className="contact-form-container" style={{ padding: 0, overflow: 'hidden' }}>
            <Calculator />
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default Contact;
