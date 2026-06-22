import React from 'react';
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

function App() {
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
}

export default App;
