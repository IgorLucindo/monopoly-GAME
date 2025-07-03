import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getFirestore, doc, collection, getDocs, getDoc, setDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";


export class Database {
  constructor() {
    this.db = this.create();
  }
  

  create() {
    const firebaseConfig = {
      apiKey: "AIzaSyA2VPF3kXVsd1q7C3dtta7ztJRFMSoZWLE",
      authDomain: "monopoly-17470.firebaseapp.com",
      projectId: "monopoly-17470",
      storageBucket: "monopoly-17470.firebasestorage.app",
      messagingSenderId: "531770858542",
      appId: "1:531770858542:web:ca0dbf2b74b8bb7fa813bf",
      measurementId: "G-4C59ZGJ8RW"
    };
    const app = initializeApp(firebaseConfig);
    return getFirestore(app);
  }


  async getDocument(collectionName, documentId) {
    if (!this.db) {
      console.error("Firestore not initialized.");
      return null;
    }
    
    const docRef = doc(this.db, collectionName, documentId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    }
    else {
      console.log(`No such document: ${documentId} in ${collectionName}`);
      return null;
    }
  }


  async getAllDocument(collectionName) {
    if (!this.db) {
      console.error("Firestore not initialized.");
      return null;
    }

    const colRef = collection(this.db, collectionName);
    const querySnapshot = await getDocs(colRef);

    const docDatas = {};
    querySnapshot.forEach((document) => {docDatas[document.id] = document.data();});
    return docDatas;
  }


  setDocument(collectionName, documentId, data) {
    if (!this.db) {
      console.error("Firestore not initialized.");
      return;
    }
    const docRef = doc(this.db, collectionName, documentId);
    setDoc(docRef, data);
  }


  deleteDocument(collectionName, documentId) {
    if (!this.db) {
      console.error("Firestore not initialized.");
      return;
    }
    const docRef = doc(this.db, collectionName, documentId);
    deleteDoc(docRef);
  }
}

window.MyGlobalDatabaseClass = Database;