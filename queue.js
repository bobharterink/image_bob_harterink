import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBp00MZ3SNa5ezQK5tHzc5pZQqAD35gUvs",
  authDomain: "axidrawer.firebaseapp.com",
  databaseURL: "https://axidrawer.firebaseio.com",
  projectId: "axidrawer",
  storageBucket: "axidrawer.appspot.com",
  messagingSenderId: "525544006556",
  appId: "1:525544006556:web:3c1bef55090fbd3fc0de59",
  measurementId: "G-TJDT1J0GC7",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function main() {
  const querySnapshot = await getDocs(collection(db, "bobs-designs"));
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
    const design = doc.data();
    const div = document.createElement("div");
    const img = document.createElement("img");
    img.src = design.url;
    div.appendChild(img);
    const p = document.createElement("p");
    p.textContent = design.status;
    div.appendChild(p);
    document.querySelector(".grid-container").appendChild(div);
  });
}

main();
