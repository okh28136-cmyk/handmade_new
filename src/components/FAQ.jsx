import React, { useState } from 'react';
import './FAQ.css';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  // 추후 Firebase Firestore에서 불러올 데이터 구조를 미리 잡아둔 상태(State)
  // 관리자(Admin) 로그인 시 해당 항목들을 직접 추가, 수정, 삭제할 수 있도록 연동할 예정입니다.
  const [faqData, setFaqData] = useState([
    {
      question: '자재 입고와 완제품 출고는 어떻게 이루어지나요?',
      answer: '자재 입고 시 꼼꼼한 수량 및 상태 검수를 진행하며, 작업 완료 후 지정된 배송처 또는 물류센터로 안전하게 출고해 드립니다.'
    },
    {
      question: '인쇄물 제작부터 포장까지 한 번에 맡길 수 있나요?',
      answer: '네, 가능합니다. 협력업체를 통해 인쇄물 제작부터 최종 포장 및 발송까지 원스톱 서비스를 제공하고 있습니다.'
    },
    {
      question: '제품 검수(QC)도 꼼꼼하게 해주나요?',
      answer: '전문 검수 인력이 투입되어 불량품을 사전에 걸러내고, 고객사의 가이드라인에 맞춘 엄격한 품질 관리를 진행합니다.'
    },
    {
      question: '소량 작업이나 샘플 작업도 가능한가요?',
      answer: '최소 수량 제한 없이 소량 작업 및 테스트 샘플 작업도 정성껏 진행해 드립니다. 단, 수량에 따라 단가가 변동될 수 있습니다.'
    },
    {
      question: '세금계산서 발행이 가능한가요?',
      answer: '네, 정식 사업자로서 모든 작업 비용에 대해 100% 세금계산서 및 현금영수증 발행이 가능합니다.'
    }
  ]);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq" id="faq">
      <div className="container faq-container">
        
        {/* 상단 헤더 영역 (좌측 정렬) */}
        <div className="faq-header-left">
          <span className="faq-tag">FAQ</span>
          <h2 className="faq-title">자주 묻는 질문</h2>
          <p className="faq-subtitle">수작업팩토리에 대해 가장 많이 물어보시는 질문들을 모았습니다.</p>
        </div>

        {/* 추후 관리자용 제어 버튼이 들어갈 자리 (Firebase Auth 관리자 로그인 시에만 노출) */}
        {/* 
        <div className="admin-controls" style={{ textAlign: 'right', marginBottom: '20px' }}>
          <button style={{ padding: '10px 20px', backgroundColor: 'var(--color-primary)', color: '#fff', border: 'none', cursor: 'pointer' }}>FAQ 등록/수정 (관리자 전용)</button>
        </div> 
        */}

        {/* 아코디언 리스트 영역 */}
        <div className="faq-list">
          {faqData.map((item, index) => (
            <div 
              key={index} 
              className={`faq-item ${openIndex === index ? 'active' : ''}`}
            >
              <button 
                className="faq-question" 
                onClick={() => toggleAccordion(index)}
              >
                <span>{item.question}</span>
                <span className="faq-icon">{openIndex === index ? '-' : '+'}</span>
              </button>
              
              <div className="faq-answer-wrapper">
                <div className="faq-answer">
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 하단 페이지네이션 영역 */}
        <div className="faq-pagination">
          <span className="page-number active">1</span>
          <span className="page-number">2</span>
          <span className="page-next">&gt;</span>
        </div>

      </div>
    </section>
  );
};

export default FAQ;
