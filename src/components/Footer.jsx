import React, { useState } from 'react';
import './Footer.css';
import TermsModal from './TermsModal';
import PrivacyModal from './PrivacyModal';

const Footer = () => {
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  return (
    <>
      <footer className="footer">
        <div className="container footer-container">
          
          <div className="footer-top">
            <h2 className="footer-logo">이룸디자인</h2>
          </div>

          <div className="footer-info">
            <p>
              04624 서울특별시 중구 필동로9 이룸디자인 <span className="divider">|</span> 대표 전양숙 외
            </p>
            <p>
              통신판매신고번호 중구-1033호 <span className="divider">|</span> 사업자등록번호 201-13-17458호
            </p>
            <p>
              개인정보보호책임자 오길환 실장
            </p>
            <p className="footer-contact">
              TEL 02-2268-7512 <span className="divider">|</span> FAX 02-2268-7514 <br />
              E-MAIL jyy1422@iroum.co.kr
            </p>
          </div>

          <div className="footer-bottom">
            <p className="copyright">
              Copyright &copy; 2008 SUJAKUP FACTORY. All rights reserved.
            </p>
            <div className="footer-links">
              <button className="footer-link-btn" onClick={() => setIsTermsOpen(true)}>이용약관</button>
              <button className="footer-link-btn" onClick={() => setIsPrivacyOpen(true)}>개인정보처리방침</button>
            </div>
          </div>

        </div>
      </footer>

      <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
      <PrivacyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
    </>
  );
};

export default Footer;
