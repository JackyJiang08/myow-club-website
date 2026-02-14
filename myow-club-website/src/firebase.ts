import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

// TODO: Replace with your Firebase project configuration
// See: https://firebase.google.com/docs/web/setup#config-object
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Check if config is configured
const isConfigured = firebaseConfig.apiKey !== "YOUR_API_KEY";

let app;
let auth: Auth;
let googleProvider: GoogleAuthProvider;
let db: Firestore;

if (isConfigured) {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    db = getFirestore(app);
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
} else {
  console.warn("Firebase is not configured. Using mock objects. Please update src/firebase.ts with your actual config.");
  // Mock objects to prevent crash, but they won't work for real auth
  auth = {} as Auth;
  googleProvider = new GoogleAuthProvider();
  db = {} as Firestore;
}

export { auth, googleProvider, db, isConfigured };
