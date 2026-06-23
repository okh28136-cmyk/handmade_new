import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import './Gallery.css';

const Gallery = () => {
  // 추후 Firebase Firestore에서 불러올 데이터 구조를 미리 잡아둔 상태(State)
  // 지금은 UI 확인용 임시(Mock) 이미지를 배열로 넣어두었습니다.
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
        <div className="section-header">
          <h2 className="section-title">FIELD SKETCH</h2>
          <p className="section-subtitle">수작업팩토리의 생생한 작업 현장</p>
        </div>
        
        {/* 추후 관리자용 업로드 버튼이 들어갈 자리 (Firebase Auth 로그인 시에만 노출되도록 조건부 렌더링 예정) */}
        {/* 
        <div className="admin-controls">
          <button className="upload-btn">사진 업로드 (관리자 전용)</button>
        </div> 
        */}
      </div>

      {/* 화면 전체 너비를 꽉 채우기 위해 container 바깥으로 분리 */}
      <div className="gallery-grid-fullbleed">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px', width: '100%', color: '#666' }}>이미지를 불러오는 중...</div>
        ) : images.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px', width: '100%', color: '#666' }}>등록된 이미지가 없습니다.</div>
        ) : (
          images.map((img) => (
            <div key={img.id} className="gallery-item">
              <img src={img.url} alt={img.alt} className="gallery-image" />
              <div className="gallery-overlay">
                <span className="overlay-text">현장 보기</span>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default Gallery;
