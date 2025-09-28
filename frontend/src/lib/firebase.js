import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:demo123456789",
}

let app
let auth

export function getFirebaseApp() {
  if (!app) {
    try {
      app = initializeApp(firebaseConfig)
    } catch (error) {
      console.warn("Firebase initialization failed:", error)
      console.warn("Please configure your Firebase environment variables in .env file")
      // Create a mock app for development
      app = null
    }
  }
  return app
}

export function getFirebaseAuth() {
  if (!auth) {
    try {
      const firebaseApp = getFirebaseApp()
      if (firebaseApp) {
        auth = getAuth(firebaseApp)
      } else {
        console.warn("Firebase not configured properly. Auth features will not work.")
        return null
      }
    } catch (error) {
      console.warn("Firebase Auth initialization failed:", error)
      return null
    }
  }
  return auth
}
