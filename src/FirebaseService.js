import { initializeApp } from "firebase/app";
import { getAuth, EmailAuthProvider, updatePassword, reauthenticateWithCredential, sendPasswordResetEmail, signOut, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCLkzo07_CrlMFma3ZUTEznOtr-nouInhE",
    authDomain: "job-finder-3ff0b.firebaseapp.com",
    projectId: "job-finder-3ff0b",
    storageBucket: "job-finder-3ff0b.appspot.com",
    messagingSenderId: "967835756388",
    appId: "1:967835756388:web:7c57cacbc7ea7b90f23c71"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { auth, sendPasswordResetEmail, updatePassword, EmailAuthProvider, signOut, reauthenticateWithCredential, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, onAuthStateChanged }
