import React from 'react';
import { motion } from 'motion/react';
import './Hero.css';

const fadeUpVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: (custom) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: custom * 0.1, ease: [0.16, 1, 0.3, 1] }
  })
};

const Hero = () => {
  return (
    <section className="hero">
      <div className="container">
        
        <motion.div 
          className="hero-video-box"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUpVariant}
          custom={0}
        >
          <video 
            className="hero-video"
            autoPlay 
            loop 
            muted 
            playsInline
            poster="/heri-3.jpeg"
          >
            <source src="/hero.mp4" type="video/mp4" />
          </video>
          <div className="hero-video-overlay"></div>
          
          <div className="hero-video-text">
            <h2>
              손이 많이 가고 복잡한 수작업<br />
              <strong>저희가 제일 잘 합니다.</strong>
            </h2>
          </div>
        </motion.div>

        <motion.div 
          className="hero-bottom-text"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.8 }}
          variants={fadeUpVariant}
          custom={2}
        >
          <h3>아직도 직접 밤새워 포장하시나요?"</h3>
          <p>
            기계가 할 수 없는 가장 정교한 포장및 수작업을<br />
            합리적인 맞춤 단가로 제공합니다.
          </p>
        </motion.div>
        
      </div>
    </section>
  );
};

export default Hero;
