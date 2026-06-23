import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAw2ZTmqjqlJoML16Hub9LbDEUP1u7qD5E",
  authDomain: "handmadefactorynew.firebaseapp.com",
  projectId: "handmadefactorynew",
  storageBucket: "handmadefactorynew.firebasestorage.app",
  messagingSenderId: "515632397449",
  appId: "1:515632397449:web:ff89646c5b051664ee5a58"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testFirebase() {
  try {
    console.log("Adding doc...");
    const docRef = await addDoc(collection(db, "inquiries"), {
      from_company: "Test Company",
      from_name: "Test User",
      status: "new",
      createdAt: new Date()
    });
    console.log("Document written with ID: ", docRef.id);

    console.log("Getting docs...");
    const querySnapshot = await getDocs(collection(db, "inquiries"));
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data().from_name}`);
    });
  } catch (e) {
    console.error("Error: ", e);
  }
}

testFirebase();
