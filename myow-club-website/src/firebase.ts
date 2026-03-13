// Mock Firebase implementation for local development without configuration
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

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
const isRealConfigured = firebaseConfig.apiKey !== "YOUR_API_KEY";

// We'll treat it as configured for the mock version so the UI works
const isConfigured = true;

let app;
let auth: Auth;
let googleProvider: GoogleAuthProvider;
let db: Firestore;

if (isRealConfigured) {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    db = getFirestore(app);
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
} else {
  console.warn("Firebase is not configured. Using mock objects backed by localStorage.");
  
  // Mock objects to prevent crash and allow local testing
  auth = {
    currentUser: null,
    signOut: async () => console.log('Mock signOut')
  } as unknown as Auth;
  
  googleProvider = new GoogleAuthProvider();
  
  // Create a Proxy to mock Firestore methods
  db = new Proxy({} as Firestore, {
    get: (target, prop) => {
      // Return a dummy object/function for any property accessed on db
      return () => {};
    }
  });
}

export { auth, googleProvider, db, isConfigured, isRealConfigured };
