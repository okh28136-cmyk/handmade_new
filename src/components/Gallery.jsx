import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { motion } from 'motion/react';
import './Gallery.css';

const fadeUpVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: (custom) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: custom * 0.1, ease: [0.16, 1, 0.3, 1] }
  })
};

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const q = query(collection(db, 'gallery_images'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const imgList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setImages(imgList);
      } catch (error) {
        console.error('갤러리 이미지 불러오기 에러:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  return (
    <section className="gallery" id="gallery">
      <div className="container">
        <motion.div 
          className="section-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUpVariant}
          custom={0}
        >
          <h2 className="section-title">FIELD SKETCH</h2>
          <p className="section-subtitle">수작업팩토리의 생생한 작업 현장</p>
        </motion.div>
      </div>

      {/* 화면 전체 너비를 꽉 채우기 위해 container 바깥으로 분리 */}
      <div className="gallery-grid-fullbleed">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px', width: '100%', color: '#666' }}>이미지를 불러오는 중...</div>
        ) : images.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px', width: '100%', color: '#666' }}>등록된 이미지가 없습니다.</div>
        ) : (
          images.map((img, index) => (
            <motion.div 
              key={img.id} 
              className="gallery-item"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUpVariant}
              custom={(index % 6) + 1}
            >
              <img src={img.url} alt={img.alt} className="gallery-image" />
              <div className="gallery-overlay">
                <span className="overlay-text">현장 보기</span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </section>
  );
};

export default Gallery;
