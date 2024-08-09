// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDPECkyTwvtzzm6ZsrIL5C2mcQ_0VhQtGg",
  authDomain: "pantryapp-a3cad.firebaseapp.com",
  projectId: "pantryapp-a3cad",
  storageBucket: "pantryapp-a3cad.appspot.com",
  messagingSenderId: "546808676428",
  appId: "1:546808676428:web:6f154c1083e2127dfdb4e9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore =getFirestore(app);
export{ app, firestore};