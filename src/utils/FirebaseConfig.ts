// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import { collection, getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAu4GRa1grZBJRxSqNgvtYGnTjQfYpw1oU",
  authDomain: "zoomclone-257cf.firebaseapp.com",
  projectId: "zoomclone-257cf",
  storageBucket: "zoomclone-257cf.appspot.com",
  messagingSenderId: "206774794783",
  appId: "1:206774794783:web:6d4a6e716cac66065ff32a",
  measurementId: "G-EVYNCGPRG7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);
export const firebaseDB = getFirestore(app);

export const userRef = collection(firebaseDB, "users");
export const meetingRef = collection(firebaseDB , "meeting");