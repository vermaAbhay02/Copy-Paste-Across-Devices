import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
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
export const db = getFirestore(app);

export function subscribeClipboard(key, callback) {
  const docRef = doc(db, "Clipboard", key);
  return onSnapshot(docRef, (snap) => {
    if (snap.exists()) {
      callback(snap.data().text);
    } else {
      callback("");
    }
  });
}

export async function writeClipboard(key, text) {
  const docRef = doc(db, "Clipboard", key);
  await setDoc(docRef, { text });
}