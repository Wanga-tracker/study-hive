// js/student.js

// Firebase Setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";
import { dailyFacts } from "./facts.js";

const firebaseConfig = {
  apiKey: "AIzaSyAcqZKghgyzk1ghfP-l8dwlHOVRNeG1TAk",
  authDomain: "edu-sync-hub-africa.firebaseapp.com",
  projectId: "edu-sync-hub-africa",
  storageBucket: "edu-sync-hub-africa.appspot.com",
  messagingSenderId: "625120725619",
  appId: "1:625120725619:web:0a373d5201cd9a87333806"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Sidebar Toggle
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");
menuToggle.addEventListener("click", () => {
  sidebar.classList.toggle("active");
});

// Section Switching
const menuLinks = document.querySelectorAll(".menu-link");
const sections = document.querySelectorAll(".section");

menuLinks.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const target = link.getAttribute("href");
    sections.forEach(section => section.classList.remove("active"));
    document.querySelector(target).classList.add("active");
    sidebar.classList.remove("active");
  });
});

// Load Student Data
onAuthStateChanged(auth, async user => {
  if (!user) {
    window.location.href = "../login.html";
    return;
  }

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const data = userSnap.data();
    document.getElementById("studentName").textContent = data.name || "Student";
    document.getElementById("coins").textContent = data.coins || 0;
    document.getElementById("refCode").textContent = data.referral || "ABC123";
  }
});

// Random Fact Loader
function loadRandomFact() {
  const factBox = document.getElementById("factBox");
  const randomIndex = Math.floor(Math.random() * dailyFacts.length);
  factBox.textContent = dailyFacts[randomIndex];
}

// Daily Quote (Static for now)
function loadQuote() {
  const quote = "Success is the sum of small efforts, repeated day in and day out.";
  document.getElementById("dailyQuote").textContent = quote;
}

// Initial Load
window.addEventListener("DOMContentLoaded", () => {
  loadRandomFact();
  loadQuote();
});

// Logout
const logoutBtn = document.getElementById("logout");
logoutBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to log out?")) {
    signOut(auth).then(() => {
      window.location.href = "../login.html";
    });
  }
});
