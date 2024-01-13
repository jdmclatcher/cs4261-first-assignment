import { getFirestore } from "firebase/firestore";
import {
  initializeAuth,
  getAuth,
  getReactNativePersistence,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getApps, getApp, initializeApp } from "firebase/app";
import firebaseConfig from "./firebaseConfig";

let firebaseApp;

if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
  // initialize Firebase Auth for that app immediately
  initializeAuth(firebaseApp, {
    // use react native persistent storage to save user session
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} else {
  firebaseApp = getApp(); // if app already initialized, use that one
}

const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

export { db as firebase, auth };
