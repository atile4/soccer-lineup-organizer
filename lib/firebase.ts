// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAssrGIxecgvqntbQKlQkbqLkSt0m9yeEw",
  authDomain: "soccer-lineup-organizer-w.firebaseapp.com",
  projectId: "soccer-lineup-organizer-w",
  storageBucket: "soccer-lineup-organizer-w.firebasestorage.app",
  messagingSenderId: "859070845612",
  appId: "1:859070845612:web:a17ce5632c3e3375ebc509",
  measurementId: "G-D65ZHTZ3SL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);