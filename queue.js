import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC7vCcbE7ywd4z9uLqGeJtQKopTX-BgstI",
  authDomain: "emrg-codestudio.firebaseapp.com",
  databaseURL: "https://emrg-codestudio.firebaseio.com",
  projectId: "emrg-codestudio",
  storageBucket: "emrg-codestudio.appspot.com",
  messagingSenderId: "715945437596",
  appId: "1:715945437596:web:f309eea784fa8c29474059",
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
