import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyA9gd6PH8al1u2NIAuu2lWlTUU51YCHy-k",
  authDomain: "leave-management-adf7e.firebaseapp.com",
  projectId: "leave-management-adf7e",
  storageBucket: "leave-management-adf7e.appspot.com",
  messagingSenderId: "849220433826",
  appId: "1:849220433826:web:d8fd072104c7ff09eba4fb"
};

// init firebase app
initializeApp(firebaseConfig);

const db = getFirestore();
const auth = getAuth();
const storage = getStorage();

export { db, auth, storage };