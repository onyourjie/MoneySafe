// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; 

// Config dari Firebase Console (punyamu sendiri)
const firebaseConfig = {
  apiKey: "AIzaSyBdekHfK5_kbLmBHDVzf1XZiP-OIof9L24",
  authDomain: "crud-money.firebaseapp.com",
  projectId: "crud-money",
  storageBucket: "crud-money.appspot.com",
  messagingSenderId: "197875263335",
  appId: "1:197875263335:web:8e8b7855d8786d344bf1c2",
  measurementId: "G-PWE4S8GJVS"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Export service supaya bisa dipakai di komponen lain
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Function untuk mendapatkan auth instance
export function getFirebaseAuth() {
  return auth;
}
