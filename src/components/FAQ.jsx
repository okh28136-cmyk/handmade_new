import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import './FAQ.css';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [faqData, setFaqData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    // Firestore에서 faq 컬렉션을 order(순서) 오름차순으로 실시간 구독
    const q = query(collection(db, 'faqs'), orderBy('order', 'asc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFaqData(data);
    }, (err) => {
      console.error('FAQ 불러오기 오류:', err);
    });

    return () => unsub();
  }, []);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // 페이지네이션 계산
  const totalPages = Math.max(1, Math.ceil(faqData.length / ITEMS_PER_PAGE));
  
  // 현재 페이지의 데이터만 슬라이싱
  const currentData = faqData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE, 
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setOpenIndex(null); // 페이지 전환 시 열린 아코디언 닫기
    }
  };

  return (
    <section className="faq" id="faq">
      <div className="container faq-container">
        
        {/* 상단 헤더 영역 */}
        <div className="faq-header-left">
          <span className="faq-tag">FAQ</span>
          <h2 className="faq-title">자주 묻는 질문</h2>
          <p className="faq-subtitle">수작업팩토리에 대해 가장 많이 물어보시는 질문들을 모았습니다.</p>
        </div>

        {/* 아코디언 리스트 영역 */}
        <div className="faq-list">
          {currentData.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
              등록된 자주 묻는 질문이 없습니다.
            </div>
          ) : (
            currentData.map((item, index) => (
              <div 
                key={item.id} 
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
                    {/* 줄바꿈을 <br />로 렌더링하기 위해 split 처리 */}
                    {item.answer.split('\n').map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 하단 페이지네이션 영역 */}
        {totalPages > 1 && (
          <div className="faq-pagination">
            <span 
              className={`page-prev ${currentPage === 1 ? 'disabled' : ''}`}
              onClick={() => handlePageChange(currentPage - 1)}
              style={{ cursor: currentPage === 1 ? 'default' : 'pointer', padding: '0 10px' }}
            >
              &lt;
            </span>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <span 
                key={page}
                className={`page-number ${currentPage === page ? 'active' : ''}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </span>
            ))}

            <span 
              className={`page-next ${currentPage === totalPages ? 'disabled' : ''}`}
              onClick={() => handlePageChange(currentPage + 1)}
              style={{ cursor: currentPage === totalPages ? 'default' : 'pointer', padding: '0 10px' }}
            >
              &gt;
            </span>
          </div>
        )}

      </div>
    </section>
  );
};

export default FAQ;
