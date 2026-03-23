import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBGHpg4YnqxYB7ZzezDrd1YxP3JGCCv4Uk",
  authDomain: "clipboard-35bcb.firebaseapp.com",
  projectId: "clipboard-35bcb",
  storageBucket: "clipboard-35bcb.firebasestorage.app",
  messagingSenderId: "180872107244",
  appId: "1:180872107244:web:cf4ea5a87fb0820d6d41c9",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// get room
export async function getClipboardDoc(key) {
  const ref = doc(db, "Clipboard", key);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

// create room
export async function createRoom(key, password) {
  const ref = doc(db, "Clipboard", key);
  await setDoc(ref, { text: "", password });
}

// subscribe
export function subscribeClipboard(key, callback) {
  const ref = doc(db, "Clipboard", key);
  return onSnapshot(ref, (snap) => {
    if (snap.exists()) {
      callback(snap.data().text);
    }
  });
}

// write
export async function writeClipboard(key, text) {
  const ref = doc(db, "Clipboard", key);
  await setDoc(ref, { text }, { merge: true });
}