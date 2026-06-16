// ══════════════════════════════════════════════════════════════════
export const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyCX34OInhWPCaiYuXytr8YeSxqLKpo-R9U",
  authDomain:        "les-anisa.firebaseapp.com",
  projectId:         "les-anisa",
  storageBucket:     "les-anisa.firebasestorage.app",
  messagingSenderId: "75180789966",
  appId:             "1:75180789966:web:92112765afb525c43cc09f",
  measurementId:	 "G-90PVYB2S7E"
};
// ══════════════════════════════════════════════════════════════════
//  ⚠️  WAJIB DIISI SEBELUM DEPLOY
//  Cloudinary: Dashboard → Settings → Upload → Upload Presets
//  Buat preset "Unsigned" dengan nama: les_anisa_upload
// ══════════════════════════════════════════════════════════════════
export const CLOUDINARY_CONFIG = {
  cloudName:    "dbtkhnqxj",
  uploadPreset: "les_anisa_upload"
};

// ── Init Firebase (jangan diubah di bawah ini) ────────────────────
import { initializeApp }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore, collection, doc, getDoc, getDocs,
  addDoc, updateDoc, deleteDoc, setDoc,
  query, where, orderBy, limit,
  serverTimestamp, onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  getAuth, signInWithEmailAndPassword,
  signOut, onAuthStateChanged, sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const app  = initializeApp(FIREBASE_CONFIG);
const db   = getFirestore(app);
const auth = getAuth(app);

export {
  db, auth,
  collection, doc, getDoc, getDocs,
  addDoc, updateDoc, deleteDoc, setDoc,
  query, where, orderBy, limit,
  serverTimestamp, onSnapshot,
  signInWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail
};
