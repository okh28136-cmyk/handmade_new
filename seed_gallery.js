import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAw2ZTmqjqlJoML16Hub9LbDEUP1u7qD5E",
  authDomain: "handmadefactorynew.firebaseapp.com",
  projectId: "handmadefactorynew",
  storageBucket: "handmadefactorynew.firebasestorage.app",
  messagingSenderId: "515632397449",
  appId: "1:515632397449:web:ff89646c5b051664ee5a58",
  measurementId: "G-1644YLRKK3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const images = [
    { url: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: '포장 작업 현장 1' },
    { url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: '물류 창고 현장 2' },
    { url: 'https://images.unsplash.com/photo-1622675363311-3e1904dc1885?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: '라벨링 검수 현장 3' },
    { url: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: '박스 적재 현장 4' },
    { url: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: '수작업 패키징 현장 5' },
    { url: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: '완제품 출고 현장 6' },
    { url: 'https://images.unsplash.com/photo-1553413077-190dd305871c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: '패키징 세팅 7' },
    { url: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: '검수 라인 8' },
    { url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: '창고 재고 관리 9' },
    { url: 'https://images.unsplash.com/photo-1590496793907-471a89bc700c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: '운송 준비 10' },
    { url: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: '수작업 디테일 11' },
    { url: 'https://images.unsplash.com/photo-1493934558415-9d19f0b2b4d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: '물류 센터 전경 12' },
];

async function seed() {
  const colRef = collection(db, 'gallery_images');
  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    await addDoc(colRef, {
      ...img,
      createdAt: new Date(Date.now() - i * 1000) // 순서 유지를 위해 시간차
    });
    console.log(`Added ${img.alt}`);
  }
  console.log("Seed complete!");
  process.exit(0);
}

seed();
