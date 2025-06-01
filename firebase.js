// firebase.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.8.2/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/11.8.2/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/11.8.2/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyAjsxzqXwW2PcwowbFSb4jiGTHGv9rdL0w",
  authDomain: "agent-hive-project.firebaseapp.com",
  projectId: "agent-hive-project",
  storageBucket: "agent-hive-project.firebasestorage.app",
  messagingSenderId: "464476218600",
  appId: "1:464476218600:web:59aa5ba90c73468d78155d",
  measurementId: "G-YGQ85D592J"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
