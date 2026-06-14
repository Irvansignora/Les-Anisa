// ══════════════════════════════════════════════════════════════════
//  ⚠️  WAJIB DIISI SEBELUM DEPLOY
//  Ambil dari: Firebase Console → Project Settings → Your Apps → Config
// ══════════════════════════════════════════════════════════════════
export const FIREBASE_CONFIG = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID"
};

// ══════════════════════════════════════════════════════════════════
//  ⚠️  WAJIB DIISI SEBELUM DEPLOY
//  Cloudinary: Dashboard → Settings → Upload → Upload Presets
//  Buat preset "Unsigned" dengan nama: les_anisa_upload
// ══════════════════════════════════════════════════════════════════
export const CLOUDINARY_CONFIG = {
  cloudName:    "YOUR_CLOUD_NAME",
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
  signOut, onAuthStateChanged
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
  signInWithEmailAndPassword, signOut, onAuthStateChanged
};
