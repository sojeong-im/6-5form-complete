import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBr_5Nhrg17gZCSujlBaMwRIAGzRjwZeZo",
  authDomain: "complete-e5d4f.firebaseapp.com",
  projectId: "complete-e5d4f",
  storageBucket: "complete-e5d4f.firebasestorage.app",
  messagingSenderId: "218483261185",
  appId: "1:218483261185:web:432c86e07bbb624382e500",
  measurementId: "G-5MSPDNKE0Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { app, analytics, db };
