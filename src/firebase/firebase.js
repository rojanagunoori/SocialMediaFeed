// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import {getAuth} from "firebase/auth"
import {getFirestore} from "firebase/firestore"
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBTumyBxH8qnAGAd1OxzwQqUgwGSGMF1vU",
  authDomain: "socialmediafeed-bb5a2.firebaseapp.com",
  projectId: "socialmediafeed-bb5a2",
  storageBucket: "socialmediafeed-bb5a2.firebasestorage.app",
  messagingSenderId: "1009730805759",
  appId: "1:1009730805759:web:d2ef0578abb926b7d7d1ca",
  measurementId: "G-M1YHWS11DS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth=getAuth(app)
export const db=getFirestore(app)
export const storage = getStorage(app);