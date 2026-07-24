// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "genwebai-b9d13.firebaseapp.com",
  projectId: "genwebai-b9d13",
  storageBucket: "genwebai-b9d13.firebasestorage.app",
  messagingSenderId: "85187947423",
  appId: "1:85187947423:web:e1e48badf02c2d4f1cebaa",
  measurementId: "G-Z36G394JRL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth= getAuth(app)
const provider=new GoogleAuthProvider()

export {auth,provider}
