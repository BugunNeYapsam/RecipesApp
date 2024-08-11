// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { isSupported as analyticsIsSupported, initializeAnalytics } from 'firebase/analytics'; // Import analytics utilities

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBB2O18nMewH3UsSYyYdlgVH8JClIvXmZo",
  authDomain: "bugunneyapsam-b437d.firebaseapp.com",
  projectId: "bugunneyapsam-b437d",
  storageBucket: "bugunneyapsam-b437d.appspot.com",
  messagingSenderId: "920537094481",
  appId: "1:920537094481:web:990ca3dd22bb9a6abf9b70",
  measurementId: "G-4E6V36RKV5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Initialize Firebase Analytics if supported
if (analyticsIsSupported()) {
  try {
    const analytics = initializeAnalytics(app);
    // Optionally, you can log analytics events here or set up additional configurations
  } catch (error) {
    console.warn('Error initializing Firebase Analytics:', error.message);
  }
} else {
  console.warn('Firebase Analytics is not supported in this environment.');
}


export { app, analytics, db };