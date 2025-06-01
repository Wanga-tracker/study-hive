// firebase.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/11.8.1/firebase-storage.js';

const firebaseConfig = {
  apiKey: "AIzaSyCs6rzjsYBPYmT1vK3VWQRU36MJgQmKJq0",
  authDomain: "edu-hub-kenya.firebaseapp.com",
  projectId: "edu-hub-kenya",
  storageBucket: "edu-hub-kenya.firebasestorage.app",
  messagingSenderId: "163804145504",
  appId: "1:163804145504:web:9b989b384a2bd2643f6005",
  measurementId: "G-C8YB09R7J5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
