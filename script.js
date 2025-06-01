// script.js
import { auth, db } from './firebase.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/11.8.2/firebase-auth.js';
import { doc, setDoc, getDoc } from 'https://www.gstatic.com/firebasejs/11.8.2/firebase-firestore.js';

// Signup function
export async function signUpUser({ name, username, email, phone, county, school, level, password, referral, adminRequest }, errorCallback) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, 'users', user.uid), {
      name,
      username,
      email,
      phone,
      county,
      school,
      level,
      role: 'student', // Default role
      adminRequest: adminRequest || false, // Queue admin request
      referral: referral || '',
      createdAt: new Date()
    });

    window.location.href = 'student-dashboard.html';
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
      window.location.href = role === 'admin' ? 'admin-dashboard.html' : 'student-dashboard.html';
    } else {
      errorCallback('No user profile found.');
    }
  } catch (error) {
    errorCallback(error.message);
  }
}
