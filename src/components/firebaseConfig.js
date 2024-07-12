// src/firebaseConfig.js

import { initializeApp } from 'firebase/app';
import {getFirestore} from "firebase/firestore";
import {getAuth} from "firebase/auth";

import {getStorage} from "firebase/storage";




const firebaseConfig = {
  apiKey: "AIzaSyBQAfA1PiVfY9AjO1xxI8-7-L2YIrBctm0",
  authDomain: "uploadcertificate-617eb.firebaseapp.com",
  projectId: "uploadcertificate-617eb",
  storageBucket: "uploadcertificate-617eb.appspot.com",
  messagingSenderId: "613243061662",
  appId: "1:613243061662:web:defe6bc2e195aaa639828f",
  measurementId: "G-3L8HJP4V2Z"
};

const app = initializeApp(firebaseConfig);
export const auth=getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
