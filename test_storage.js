import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAw2ZTmqjqlJoML16Hub9LbDEUP1u7qD5E",
  authDomain: "handmadefactorynew.firebaseapp.com",
  projectId: "handmadefactorynew",
  storageBucket: "handmadefactorynew.firebasestorage.app",
  messagingSenderId: "515632397449",
  appId: "1:515632397449:web:ff89646c5b051664ee5a58"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

async function testUpload() {
  try {
    const fileRef = ref(storage, `test_${Date.now()}.txt`);
    console.log("Attempting to upload...");
    const snapshot = await uploadString(fileRef, 'hello world');
    console.log("Upload successful!");
    
    console.log("Attempting to get URL...");
    const url = await getDownloadURL(snapshot.ref);
    console.log("URL:", url);
    process.exit(0);
  } catch (error) {
    console.error("Upload failed!");
    console.dir(error, { depth: null });
    process.exit(1);
  }
}

testUpload();
