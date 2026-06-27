import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { db } from './firebase';
import { doc, onSnapshot } from 'firebase/firestore';

// 메인 사이트 컴포넌트
import Header from './components/Header';
import Hero from './components/Hero';
import Service from './components/Service';
import Features from './components/Features';
import Gallery from './components/Gallery';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import QuoteTestPage from './components/QuoteTestPage';
import Footer from './components/Footer';
import FloatingKakao from './components/FloatingKakao';
import Popup from './components/Popup';

// 관리자 페이지 컴포넌트
import AdminLogin from './admin/AdminLogin';
import InquiryList from './admin/InquiryList';
import InquiryDetail from './admin/InquiryDetail';
import ProtectedRoute from './admin/ProtectedRoute';
import { QuoteProvider } from './context/QuoteContext';

import AdminGallery from './admin/AdminGallery';
import AdminFAQ from './admin/AdminFAQ';
import AdminSettings from './admin/AdminSettings';
import AdminDashboard from './admin/AdminDashboard';

import AdminPricing from './admin/AdminPricing';

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
      <Popup />
    </>
  );
};

function App() {
  React.useEffect(() => {
    // GA4 연동 로직 (Firestore 실시간 구독)
    const unsub = onSnapshot(doc(db, 'settings', 'analytics'), (docSnap) => {
      if (docSnap.exists()) {
        const trackingId = docSnap.data().trackingId;
        if (trackingId && trackingId.trim() !== '') {
          // 기존 스크립트가 있다면 제거 (업데이트 대비)
          const existing1 = document.getElementById('ga-script-1');
          const existing2 = document.getElementById('ga-script-2');
          if (existing1) document.head.removeChild(existing1);
          if (existing2) document.head.removeChild(existing2);

          // 새로운 스크립트 생성 및 주입
          if (trackingId.toUpperCase().startsWith('GTM-')) {
            // Google Tag Manager 스크립트
            const script1 = document.createElement('script');
            script1.id = 'ga-script-1';
            script1.innerHTML = `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${trackingId}');
            `;
            document.head.appendChild(script1);
          } else {
            // 기본 Google Analytics (gtag.js) 스크립트
            const script1 = document.createElement('script');
            script1.async = true;
            script1.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
            script1.id = 'ga-script-1';

            const script2 = document.createElement('script');
            script2.id = 'ga-script-2';
            script2.innerHTML = `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${trackingId}');
            `;

            document.head.appendChild(script1);
            document.head.appendChild(script2);
          }
        }
      }
    });

    return () => unsub();
  }, []);

  return (
    <QuoteProvider>
      <BrowserRouter>
        <Routes>
        {/* 메인 사이트 */}
        <Route path="/" element={<MainSite />} />

        {/* 비공개 견적 테스트 페이지 */}
        <Route path="/quote-test" element={<QuoteTestPage />} />

        {/* 관리자 로그인 */}
        <Route path="/admin" element={<AdminLogin />} />

        {/* 관리자 보호 라우트 */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute><AdminDashboard /></ProtectedRoute>
        } />
        <Route path="/admin/inquiries" element={
          <ProtectedRoute><InquiryList /></ProtectedRoute>
        } />
        <Route path="/admin/inquiries/:id" element={
          <ProtectedRoute><InquiryDetail /></ProtectedRoute>
        } />
        <Route path="/admin/gallery" element={
          <ProtectedRoute><AdminGallery /></ProtectedRoute>
        } />
        <Route path="/admin/faq" element={
          <ProtectedRoute><AdminFAQ /></ProtectedRoute>
        } />
        <Route path="/admin/settings" element={
          <ProtectedRoute><AdminSettings /></ProtectedRoute>
        } />
        <Route path="/admin/pricing" element={
          <ProtectedRoute><AdminPricing /></ProtectedRoute>
        } />

        {/* 404 - 메인으로 리다이렉트 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </BrowserRouter>
    </QuoteProvider>
  );
}

export default App;
