// /js/firebase.js

// Firebase v11 SDK (module-style import not needed in regular script setup)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";
// import { getStorage } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-storage.js"; // Optional

const firebaseConfig = {
  apiKey: "AIzaSyAcqZKghgyzk1ghfP-l8dwlHOVRNeG1TAk",
  authDomain: "edu-sync-hub-africa.firebaseapp.com",
  projectId: "edu-sync-hub-africa",
  storageBucket: "edu-sync-hub-africa.appspot.com",
  messagingSenderId: "625120725619",
  appId: "1:625120725619:web:0a373d5201cd9a87333806"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services
const auth = getAuth(app);
const db = getFirestore(app);
// const storage = getStorage(app); // Uncomment when billing is enabled

// Export
export { auth, db /*, storage */ };
