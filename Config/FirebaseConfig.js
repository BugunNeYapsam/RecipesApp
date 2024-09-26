import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported as analyticsIsSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBB2O18nMewH3UsSYyYdlgVH8JClIvXmZo",
  authDomain: "bugunneyapsam-b437d.firebaseapp.com",
  projectId: "bugunneyapsam-b437d",
  storageBucket: "bugunneyapsam-b437d.appspot.com",
  messagingSenderId: "920537094481",
  appId: "1:920537094481:web:990ca3dd22bb9a6abf9b70",
  measurementId: "G-4E6V36RKV5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

analyticsIsSupported().then((isSupported) => {
  if (isSupported) {
    try {
      const analytics = getAnalytics(app);
      console.log('Firebase Analytics initialized successfully.');
    } catch (error) {
      console.log('Error initializing Firebase Analytics:', error.message);
    }
  } else {
    console.log('Firebase Analytics is not supported in this environment.');
  }
}).catch((error) => {
  console.error('Error checking analytics support:', error.message);
});

export { app, db };