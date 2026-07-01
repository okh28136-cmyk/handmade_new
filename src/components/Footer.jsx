import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Footer.css';
import TermsModal from './TermsModal';
import PrivacyModal from './PrivacyModal';

const Footer = () => {
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <footer className="footer">
        <div className="container footer-container">
          
          <div className="footer-left">
            <h3 className="cs-title">고객센터</h3>
            <div className="cs-number">02-2268-7512</div>
            <div className="cs-email">E : jyy1422@iroum.co.kr</div>
          </div>

          <div className="footer-right">
            <div className="footer-nav">
              <button className="footer-link-btn" onClick={() => navigate('/about')}>회사소개</button>
              <button className="footer-link-btn" onClick={() => setIsTermsOpen(true)}>이용약관</button>
              <button className="footer-link-btn" onClick={() => setIsPrivacyOpen(true)}>개인정보처리방침</button>
              <button className="footer-link-btn" onClick={() => navigate('/location')}>찾아오시는 길</button>
            </div>

            <div className="footer-company-info">
              <div className="company-name">이룸디자인</div>
              <div className="info-text">
                본사 : 04624 서울특별시 중구 필동로9 이룸디자인 (필빌딩 2층) &nbsp;|&nbsp; 대표 : 전양숙 외 <br />
                사업자등록번호 : 201-13-17458 &nbsp;|&nbsp; 통신판매신고번호 : 중구-1033호 &nbsp;|&nbsp; 개인정보보호책임자 : 오길환 실장 <br />
                업태 : 제조업, 정보통신업, 소매, 서비스 &nbsp;|&nbsp; 종목 : 경 인쇄업, 기타 인쇄물 출판업, 기획물/인쇄출력, 전자상거래, 컴퓨터 프로그래밍 서비스업, 시각디자인
              </div>
              <div className="info-desc">
                본 사이트 내에서 제공되는 모든 이미지와 텍스트는 저작권법에 의거해 보호를 받고 있으며 무단 도용 및 복사를 금지하고 있음을 알려드립니다.
              </div>
            </div>

            <div className="footer-copyright">
              COPYRIGHT &copy; 2008 SUJAKUP FACTORY. All Rights Reserved.
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
