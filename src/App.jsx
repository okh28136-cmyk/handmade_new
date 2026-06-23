import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// 메인 사이트 컴포넌트
import Header from './components/Header';
import Hero from './components/Hero';
import Service from './components/Service';
import Features from './components/Features';
import Gallery from './components/Gallery';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';
import FloatingKakao from './components/FloatingKakao';

// 관리자 페이지 컴포넌트
import AdminLogin from './admin/AdminLogin';
import InquiryList from './admin/InquiryList';
import InquiryDetail from './admin/InquiryDetail';
import ProtectedRoute from './admin/ProtectedRoute';

import AdminGallery from './admin/AdminGallery';

// 메인 사이트 페이지
const MainSite = () => {
  React.useEffect(() => {
    // 텍스트 선택 방지 (CSS 연동)
    document.body.classList.add('no-copy');
    
    // 우클릭 및 드래그 방지
    const preventDefault = (e) => e.preventDefault();
    document.addEventListener('contextmenu', preventDefault);
    document.addEventListener('dragstart', preventDefault);
    
    return () => {
      document.body.classList.remove('no-copy');
      document.removeEventListener('contextmenu', preventDefault);
      document.removeEventListener('dragstart', preventDefault);
    };
  }, []);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Service />
        <Features />
        <Gallery />
        <Pricing />
        <Contact />
        <FAQ />
      </main>
      <Footer />
      <FloatingKakao />
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 메인 사이트 */}
        <Route path="/" element={<MainSite />} />

        {/* 관리자 로그인 */}
        <Route path="/admin" element={<AdminLogin />} />

        {/* 관리자 보호 라우트 */}
        <Route path="/admin/inquiries" element={
          <ProtectedRoute><InquiryList /></ProtectedRoute>
        } />
        <Route path="/admin/inquiries/:id" element={
          <ProtectedRoute><InquiryDetail /></ProtectedRoute>
        } />
        <Route path="/admin/gallery" element={
          <ProtectedRoute><AdminGallery /></ProtectedRoute>
        } />

        {/* 404 - 메인으로 리다이렉트 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
