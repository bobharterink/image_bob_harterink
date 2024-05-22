import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
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

document.querySelectorAll("input[type=checkbox]").forEach((checkbox) => {
  checkbox.checked = checkbox.defaultChecked;
});

const options = {
  userId: "harterink",
  projectId: "cirkel",
  canvasId: "mycanvas",
  autoplay: true,
};

ndbx.embed(options, function (err, player) {
  window.player = player; // Make the player object global.
});

// This function is called when the size slider is dragged.
function dotDensity(e) {
  window.player.setValue("clamp1", "v", e.value);
}
window.dotDensity = dotDensity;
function changedotSize(e) {
  window.player.setValue("getintensity1", "divider", e.value);
}
window.changedotSize = changedotSize;
function changedotColor(e) {
  window.player.setValue("colorize1", "stroke", e.value);
}
window.changedotColor = changedotColor;

function changedotColor2() {
  const colorPicker = document.getElementById("colorPicker");
  const modeToggle = document.getElementById("modeToggle").checked;
  const color = colorPicker.value;

  if (modeToggle) {
    // Modify stroke, fill is transparent
    window.player.setValue("colorize2", "stroke", color);
    window.player.setValue("colorize2", "fill", "transparent");
  } else {
    // Modify fill, stroke is transparent
    window.player.setValue("colorize2", "fill", color);
    window.player.setValue("colorize2", "stroke", "transparent");
  }
}
window.changedotColor2 = changedotColor2;

document
  .getElementById("uniformScaling")
  .addEventListener("change", function () {
    if (this.checked) {
      document.getElementById("scaleControls").style.display = "block";
      document.getElementById("nonUniformScaleControls").style.display = "none";
    } else {
      document.getElementById("scaleControls").style.display = "none";
      document.getElementById("nonUniformScaleControls").style.display =
        "block";
    }
    changeframeSize(this.checked);
  });

function changeframeSize(isUniform) {
  if (isUniform) {
    const slider = document.getElementById("scaleUniform");
    const scaleValue = parseFloat(slider.value);
    window.player.setValue("scale1", "scale", { x: scaleValue, y: scaleValue });
  } else {
    const sliderX = document.getElementById("scaleX");
    const sliderY = document.getElementById("scaleY");
    const scaleX = parseFloat(sliderX.value);
    const scaleY = parseFloat(sliderY.value);
    console.log(scaleX, scaleY);
    window.player.setValue("scale1", "scale", { x: scaleX, y: scaleY });
  }
  // console.log(`Scale (${axis || 'uniform'}): ${scaleValue}`);
}
window.changeframeSize = changeframeSize;

document.getElementById("downloadSvg").addEventListener("click", async () => {
  const width = 800;
  const height = 595;
  const result = cirkel.main();
  var svg = g._toSVG(result, {
    header: true,
    x: -width / 2,
    y: -height / 2,
    width: width,
    height: height,
  });

  var fileName = "test.svg";
  var blob = new Blob([svg], { type: "image/svg+xml" });
  var url = window.URL.createObjectURL(blob);
  var a = document.createElement("a");
  document.body.appendChild(a);
  a.style.display = "none";
  a.href = url;
  a.download = fileName;
  a.target = "_blank";
  a.click();
  window.URL.revokeObjectURL(url);

  await uploadSvg(svg);

  // document.location = '/thanks'
});

async function uploadSvg(svg) {
  // Upload to AWS
  const filename = Math.random().toString(36).substring(7) + ".svg";
  const url = `https://dangerbuck.s3.eu-north-1.amazonaws.com/uploads/${filename}`;
  console.log(filename);
  const response = await fetch(url, {
    method: "PUT",
    body: svg,
    headers: {
      "Content-Type": "image/svg+xml",
    },
  });

  if (response.ok) {
    console.log("SVG data uploaded successfully.");
  } else {
    console.error("Failed to upload SVG data.");
  }

  const design = {
    url,
    status: "ready-to-print",
  };

  try {
    // Add a new document with a generated ID in 'pages' collection
    const coll = collection(db, "bobs-designs");
    const docRef = await addDoc(coll, design);
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding document: ", error);
  }
}

async function prepareDropzone() {
  const filename = Math.random().toString(36).substring(7) + ".jpeg";
  const url = `https://dangerbuck.s3.eu-north-1.amazonaws.com/uploads/${filename}`;

  let myDropzone = new Dropzone("#drop_zone", {
    url: url,
    method: "put",
    binaryBody: true,
    acceptedFiles: "image/jpeg",
    accept: function (file, done) {
      // Create an image and load the file data into it
      const image = new Image();
      const reader = new FileReader();
      reader.onload = (e) => {
        image.onload = () => {
          // Check the dimensions of the image
          if (image.width > 1920 || image.height > 1280) {
            // Reject the file if it exceeds the size limits
            done(
              "The image is too large. Please upload an image no larger than 1920x1280 pixels."
            );
          } else {
            // Accept the file
            done();
          }
        };
        image.src = e.target.result;
      };
      reader.readAsDataURL(file);
    },
  });

  var uploadedFile = null;

  myDropzone.on("complete", (file) => {
    if (file.status === Dropzone.SUCCESS) {
      loadImageWithUrl(url);
      // Check if there was a previously uploaded file
      if (uploadedFile !== null) {
        myDropzone.removeFile(uploadedFile); // Remove the previously uploaded file
      }
      uploadedFile = file; // Set the currently uploaded file as the new uploaded file
    }
  });
}

async function loadImageWithUrl(url) {
  const res = await fetch(url, {
    mode: "cors",
  });
  const blob = await res.blob();
  const blobUrl = URL.createObjectURL(blob);
  const image = new Image();
  image.onload = function () {
    ndbx.assets[url] = image;
    player.setValue("cirkelcode1", "imageName", url);
    URL.revokeObjectURL(blobUrl);
  };
  image.src = blobUrl;
}

prepareDropzone();
