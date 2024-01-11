import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getApps, getApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyASP1bOawCmCrgSlkx1SNTjhOoOvhRQSVc",
  authDomain: "firstapplication-ece15.firebaseapp.com",
  projectId: "firstapplication-ece15",
  storageBucket: "firstapplication-ece15.appspot.com",
  messagingSenderId: "622456261860",
  appId: "1:622456261860:web:b71d5a8fdcf27d49e9b0f1",
  measurementId: "G-F802X42108",
};

let firebaseApp;

if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApp(); // if already initialized, use that one
}

const db = getFirestore(firebaseApp);

export { db as firebase };
