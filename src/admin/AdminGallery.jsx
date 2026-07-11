import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import AdminLayout from './AdminLayout';
import './AdminGallery.css';

const convertToWebP = (file) => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const originalName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
            const newFile = new File([blob], `${originalName}_optimized.webp`, {
              type: 'image/webp',
            });
            resolve(newFile);
          } else {
            reject(new Error("Canvas to Blob failed"));
          }
        }, 'image/webp', 0.8);
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};


const AdminGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchImages();
  }, []);

  async function fetchImages() {
    try {
      const q = query(collection(db, 'gallery_images'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const imgList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setImages(imgList);
    } catch (error) {
      console.error('이미지 불러오기 에러:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    
    try {
      let fileToUpload = selectedFile;
      try {
        fileToUpload = await convertToWebP(selectedFile);
      } catch (err) {
        console.warn('WebP 변환 실패, 원본 파일로 업로드합니다.', err);
      }

      const fileRef = ref(storage, `gallery/${Date.now()}_${fileToUpload.name}`);
      const snapshot = await uploadBytes(fileRef, fileToUpload);
      const url = await getDownloadURL(snapshot.ref);
      
      const newImg = {
        url: url,
        path: fileRef.fullPath,
        alt: selectedFile.name,
        createdAt: serverTimestamp()
      };
      
      await addDoc(collection(db, 'gallery_images'), newImg);
      
      setSelectedFile(null);
      document.getElementById('gallery-file-input').value = '';
      fetchImages();
      alert('업로드 완료!');
    } catch (error) {
      console.error('업로드 에러:', error);
      alert('업로드에 실패했습니다.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (imgId, imgPath) => {
    if (!window.confirm('이 이미지를 삭제하시겠습니까?')) return;
    
    try {
      // 1. Storage 삭제
      if (imgPath) {
        const fileRef = ref(storage, imgPath);
        await deleteObject(fileRef).catch(e => console.warn('Storage 삭제 무시:', e));
      }
      // 2. DB 삭제
      await deleteDoc(doc(db, 'gallery_images', imgId));
      fetchImages();
    } catch (error) {
      console.error('삭제 에러:', error);
      alert('삭제에 실패했습니다.');
    }
  };

  return (
    <AdminLayout>
      <div className="admin-gallery-page">
        <div className="gallery-header">
          <h2>FIELD SKETCH (갤러리) 관리</h2>
          <div className="upload-section">
            <input 
              type="file" 
              id="gallery-file-input" 
              className="admin-file-input" 
              accept="image/*"
              onChange={handleFileChange} 
            />
            <label htmlFor="gallery-file-input" className="admin-file-label">
              {selectedFile ? selectedFile.name : '이미지 파일 선택'}
            </label>
            <button 
              className="upload-btn" 
              onClick={handleUpload} 
              disabled={!selectedFile || uploading}
            >
              {uploading ? '업로드 중...' : '업로드'}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-row">⏳ 불러오는 중...</div>
        ) : (
          <div className="admin-gallery-grid">
            {images.length === 0 ? (
              <div className="empty-gallery">등록된 이미지가 없습니다.</div>
            ) : (
              images.map(img => (
                <div key={img.id} className="admin-gallery-item">
                  <img src={img.url} alt={img.alt} className="admin-gallery-img" />
                  <div className="admin-gallery-overlay">
                    <button className="delete-img-btn" onClick={() => handleDelete(img.id, img.path)}>
                      삭제
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminGallery;
