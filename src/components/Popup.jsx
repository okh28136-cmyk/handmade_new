import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import './Popup.css';

const Popup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [popupData, setPopupData] = useState(null);
  const [doNotShowToday, setDoNotShowToday] = useState(false);

  useEffect(() => {
    // Firestore 설정 구독
    const unsub = onSnapshot(doc(db, 'settings', 'popup'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setPopupData(data);
        
        if (data.isActive) {
          // 로컬 스토리지 확인 (오늘 하루 보지 않기)
          const hideUntil = localStorage.getItem('hidePopupUntil');
          const now = new Date().getTime();
          
          if (!hideUntil || now > parseInt(hideUntil, 10)) {
            setIsOpen(true);
          } else {
            setIsOpen(false);
          }
        } else {
          setIsOpen(false);
        }
      }
    });

    return () => unsub();
  }, []);

  const handleClose = () => {
    if (doNotShowToday) {
      // 24시간 동안 숨기기
      const hideUntil = new Date().getTime() + 24 * 60 * 60 * 1000;
      localStorage.setItem('hidePopupUntil', hideUntil.toString());
    }
    setIsOpen(false);
  };

  if (!isOpen || !popupData) return null;

  return (
    <div className="system-popup-overlay">
      <div className="system-popup-content">
        <div className="system-popup-header">
          <h2>{popupData.title}</h2>
        </div>
        <div className="system-popup-body">
          {popupData.content.split('\n').map((line, i) => (
            <React.Fragment key={i}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </div>
        <div className="system-popup-footer">
          <label className="checkbox-label">
            <input 
              type="checkbox" 
              checked={doNotShowToday} 
              onChange={(e) => setDoNotShowToday(e.target.checked)} 
            />
            오늘 하루 열지 않기
          </label>
          <button className="btn-popup-close" onClick={handleClose}>닫기</button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
