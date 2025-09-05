// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  databaseURL: "https://pggl-ce4fd-default-rtdb.firebaseio.com/",
  apiKey: "AIzaSyBYzEDhkonoye_ia-M1H3rKWR3x8NypFFI",
  authDomain: "pggl-ce4fd.firebaseapp.com",
  projectId: "pggl-ce4fd",
  storageBucket: "pggl-ce4fd.firebasestorage.app",
  messagingSenderId: "66010190757",
  appId: "1:66010190757:web:62db6ef44cddad03a08e4c",
  measurementId: "G-5Z21YJYD0V"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const database = getDatabase(app);