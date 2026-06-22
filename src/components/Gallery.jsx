import React, { useState } from 'react';
import './Gallery.css';

const Gallery = () => {
  // 추후 Firebase Firestore에서 불러올 데이터 구조를 미리 잡아둔 상태(State)
  // 지금은 UI 확인용 임시(Mock) 이미지를 배열로 넣어두었습니다.
  const [images, setImages] = useState([
    { id: 1, url: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: '포장 작업 현장 1' },
    { id: 2, url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: '물류 창고 현장 2' },
    { id: 3, url: 'https://images.unsplash.com/photo-1622675363311-3e1904dc1885?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: '라벨링 검수 현장 3' },
    { id: 4, url: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: '박스 적재 현장 4' },
    { id: 5, url: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: '수작업 패키징 현장 5' },
    { id: 6, url: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: '완제품 출고 현장 6' },
    { id: 7, url: 'https://images.unsplash.com/photo-1553413077-190dd305871c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: '패키징 세팅 7' },
    { id: 8, url: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: '검수 라인 8' },
    { id: 9, url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: '창고 재고 관리 9' },
    { id: 10, url: 'https://images.unsplash.com/photo-1590496793907-471a89bc700c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: '운송 준비 10' },
    { id: 11, url: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: '수작업 디테일 11' },
    { id: 12, url: 'https://images.unsplash.com/photo-1493934558415-9d19f0b2b4d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: '물류 센터 전경 12' },
  ]);

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
        {images.map((img) => (
          <div key={img.id} className="gallery-item">
            <img src={img.url} alt={img.alt} className="gallery-image" />
            <div className="gallery-overlay">
              <span className="overlay-text">현장 보기</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Gallery;
