// script.js
import { auth, db } from './firebase.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/11.8.2/firebase-auth.js';
import { doc, setDoc, getDoc } from 'https://www.gstatic.com/firebasejs/11.8.2/firebase-firestore.js';

// Admin verification password (replace with your secure password)
const ADMIN_VERIFICATION_PASSWORD = 'your-secret-admin-password';

// Signup function
export async function signUpUser({ name, username, email, phone, county, school, level, password, referral, adminRequest, adminPassword }, errorCallback) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Determine role based on admin request and verification password
    const role = (adminRequest && adminPassword === ADMIN_VERIFICATION_PASSWORD) ? 'admin' : 'student';

    await setDoc(doc(db, 'users', user.uid), {
      name,
      username,
      email,
      phone,
      county,
      school,
      level,
      role,
      referral: referral || '',
      createdAt: new Date()
    });

    // Redirect based on role
    if (role === 'admin') {
      window.location.href = 'admin-dashboard.html';
    } else {
      window.location.href = 'student-dashboard.html';
    }
  } catch (error) {
    errorCallback(error.message);
  }
}

// Login function
export async function loginUser(email, password, errorCallback) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const userDoc = await getDoc(doc(db, 'users', user.uid));

    if (userDoc.exists()) {
      const role = userDoc.data().role;
      if (role === 'admin') {
        window.location.href = 'admin-dashboard.html';
      } else {
        window.location.href = 'student-dashboard.html';
      }
    } else {
      errorCallback('No user profile found.');
    }
  } catch (error) {
    errorCallback(error.message);
  }
}
