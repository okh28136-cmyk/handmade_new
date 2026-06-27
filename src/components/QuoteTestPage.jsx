import React, { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import Calculator from './Calculator';

const QuoteTestPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="app">
      <Header />
      <main style={{ paddingTop: '80px' }}>
        <div style={{ padding: '2rem', textAlign: 'center', background: '#fef3c7', color: '#b45309', fontWeight: 'bold' }}>
          ⚠️ 현재 이 페이지는 내부 테스트 및 단가 검수용(소비자 비공개) 페이지입니다.
        </div>
        <Calculator />
      </main>
      <Footer />
    </div>
  );
};

export default QuoteTestPage;
