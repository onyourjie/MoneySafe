// src/lib/authService.js
import { auth } from "./firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";

// Register user baru
export async function registerUser(email, password) {
  return await createUserWithEmailAndPassword(auth, email, password);
}

// Login user
export async function loginUser(email, password) {
  return await signInWithEmailAndPassword(auth, email, password);
}

// Logout user
export async function logoutUser() {
  return await signOut(auth);
}

// Reset password
export async function resetPassword(email) {
  return await sendPasswordResetEmail(auth, email);
}

// Google sign in
export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  return await signInWithPopup(auth, provider);
}

// Listener: pantau status login
export function listenAuth(callback) {
  return onAuthStateChanged(auth, callback);
}
