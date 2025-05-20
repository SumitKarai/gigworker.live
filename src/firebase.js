// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCVamxFBvihlNlBoo7XBmaglXOUU-00QTg",
  authDomain: "gigworkers-live.firebaseapp.com",
  projectId: "gigworkers-live",
  storageBucket: "gigworkers-live.firebasestorage.app",
  messagingSenderId: "199094559806",
  appId: "1:199094559806:web:fbe9a2d366da76253edd6f",
  measurementId: "G-71ZXTHSEMP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider(); 
