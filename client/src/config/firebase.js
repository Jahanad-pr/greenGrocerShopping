// Bismillah
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDkPzhZAxlmTOtmmVOuG4dpQvCIqmJoFzY",
    authDomain: "greengrocer-8fc33.firebaseapp.com",
    projectId: "greengrocer-8fc33",
    storageBucket: "greengrocer-8fc33.firebasestorage.app",
    messagingSenderId: "372287022867",
    appId: "1:372287022867:web:ef684f0141d0baf8ebdce6",
    measurementId: "G-NKNZ87HG01"
  };
  


const app = initializeApp(firebaseConfig);
export const firebase = app
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();