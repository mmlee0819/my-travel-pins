import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { getAuth } from "firebase/auth"
import { getAnalytics } from "firebase/analytics"

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "my-travel-pins.firebaseapp.com",
  projectId: "my-travel-pins",
  storageBucket: "my-travel-pins.appspot.com",
  messagingSenderId: "1012533194110",
  appId: "1:1012533194110:web:e960f6871999611e3e172f",
  measurementId: "G-Q30MCV6EJY",
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

const storage = getStorage(app)

const analytics = getAnalytics(app)

export { auth, db, storage }
