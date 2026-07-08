import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyC6Ci4tZHcSHB77cxpjpHIMtd1V-xpD9v0",
  authDomain: "animood-7b7c3.firebaseapp.com",
  projectId: "animood-7b7c3",
  storageBucket: "animood-7b7c3.firebasestorage.app",
  messagingSenderId: "325723322171",
  appId: "1:325723322171:web:d574dedda054b08af0691e",
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
