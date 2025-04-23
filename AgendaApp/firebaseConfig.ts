import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDawowgvla5dVEP7NqTlCTOLW4wyIz8b-Y",
  authDomain: "agendaapp-c7db7.firebaseapp.com",
  projectId: "agendaapp-c7db7",
  storageBucket: "agendaapp-c7db7.firebasestorage.app",
  messagingSenderId: "920615267631",
  appId: "1:920615267631:web:62900fa48406f03f0bc5da",
  measurementId: "G-75XZJV2VYX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export de Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };