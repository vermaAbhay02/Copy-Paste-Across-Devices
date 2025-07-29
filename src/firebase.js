// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { doc, getFirestore, setDoc,getDoc } from "firebase/firestore";
import { getDatabase } from "firebase/database";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBGHpg4YnqxYB7ZzezDrd1YxP3JGCCv4Uk",
  authDomain: "clipboard-35bcb.firebaseapp.com",
  projectId: "clipboard-35bcb",
  storageBucket: "clipboard-35bcb.firebasestorage.app",
  messagingSenderId: "180872107244",
  appId: "1:180872107244:web:cf4ea5a87fb0820d6d41c9",
  measurementId: "G-8Y1QVB25QV",
  db:"https://clipboard-35bcb-default-rtdb.firebaseio.com"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
let db=getFirestore()

export  async function getData(key)
{

  try {
    const docRef = doc(db, "Clipboard", key);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data().text;
    } else {
      return ""; // or null, or throw an error depending on your use case
    }
  } catch (error) {
    console.error("Error fetching document:", error);
    return ""; // or handle error appropriately
  }
}



export async function writeData(key, value) {
  try {
    
    const docRef = doc(db, "Clipboard",key);
    await setDoc(docRef, {text:value});
    console.log("Document successfully written!");
    return true;
  } catch (error) {
    console.error("Error writing document:", error);
    return false;
  }
}

