import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { motion } from 'motion/react';
import './FAQ.css';

const fadeUpVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: (custom) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: custom * 0.1, ease: [0.16, 1, 0.3, 1] }
  })
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [faqData, setFaqData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
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

  const totalPages = Math.max(1, Math.ceil(faqData.length / ITEMS_PER_PAGE));
  
  const currentData = faqData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE, 
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setOpenIndex(null); 
    }
  };

  return (
    <section className="faq" id="faq">
      <div className="container faq-container">
        
        <motion.div 
          className="faq-header-left"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUpVariant}
          custom={0}
        >
          <span className="faq-tag">FAQ</span>
          <h2 className="faq-title">자주 묻는 질문</h2>
          <p className="faq-subtitle">수작업팩토리에 대해 가장 많이 물어보시는 질문들을 모았습니다.</p>
        </motion.div>

        <div className="faq-list">
          {currentData.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
              등록된 자주 묻는 질문이 없습니다.
            </div>
          ) : (
            currentData.map((item, index) => (
              <motion.div 
                key={item.id} 
                className={`faq-item ${openIndex === index ? 'active' : ''}`}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeUpVariant}
                custom={index + 1}
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
                    {item.answer.split('\n').map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </motion.div>
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
