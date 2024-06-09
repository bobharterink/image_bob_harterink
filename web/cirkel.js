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
function dotTranslate(e) {
  window.player.setValue("divide1", "b", e.value);
}
window.dotTranslate = dotTranslate;
function dotDensity(e) {
  window.player.setValue("clamp1", "v", e.value);
}
window.dotDensity = dotDensity;
function changedotSize(e) {
  window.player.setValue("getintensity5", "divider", e.value);
}
window.changedotSize = changedotSize;
function changedotShift(e) {
  window.player.setValue("shift2", "amount", e.value);
}
window.changedotShift = changedotShift;
function changedotSize2(e) {
  window.player.setValue("getintensity6", "divider", e.value);
}
window.changedotSize2 = changedotSize2;
function changedotSize3(e) {
  window.player.setValue("getintensity1", "divider", e.value);
}
window.changedotSize3 = changedotSize3;
function changedotColor(e) {
  window.player.setValue("colorize1", "stroke", e.value);
}
window.changedotColor = changedotColor;
function changedotColor2(e) {
  window.player.setValue("colorize6", "stroke", e.value);
}
window.changedotColor2 = changedotColor2;
function changedotColor3(e) {
  window.player.setValue("colorize2", "stroke", e.value);
}
window.changedotColor3 = changedotColor3;

/* function changeframeSize(isUniform) {
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
 */
document.getElementById("downloadSvg").addEventListener("click", async () => {
  // Show the loading spinner
  const loadingSpinner = document.getElementById("loadingSpinner");
  loadingSpinner.style.display = "block";

  const width = 800 / 1.5;
  const height = 595 / 1.5;
  const result = cirkel.main();

  var svg = g._toSVG(result, {
    header: true,
    x: -width / 2,
    y: -height / 2,
    width: width,
    height: height,
  });

  // Create a new XML document to manipulate the SVG
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svg, "image/svg+xml");
  const svgElement = svgDoc.documentElement;

  // Add a scaling transformation to resize the contents
  const transform = svgDoc.createElementNS("http://www.w3.org/2000/svg", "g");
  transform.setAttribute("transform", "scale(0.7)");
  while (svgElement.firstChild) {
    transform.appendChild(svgElement.firstChild);
  }
  svgElement.appendChild(transform);

  // Serialize the modified SVG document to a string
  const modifiedSvg = new XMLSerializer().serializeToString(svgDoc);

  // Upload the modified SVG
  await uploadSvg(modifiedSvg);

  // Hide the loading spinner
  loadingSpinner.style.display = "none";
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
    clickable: false,
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

document.addEventListener("DOMContentLoaded", function () {
  const links = document.querySelectorAll("a[data-transition]");
  const dropZone = document.getElementById("drop_zone");
  const cameraModal = document.getElementById("cameraModal");
  const video = document.getElementById("camera");
  const captureButton = document.getElementById("captureButton");

  // Prevent default behavior for Dropzone
  Dropzone.options.dropZone = {
    autoProcessQueue: false,
    clickable: false,
  };

  dropZone.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent the default file dialog

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(function (stream) {
          video.style.display = "block";
          video.srcObject = stream;
          cameraModal.style.display = "flex";
        })
        .catch(function (error) {
          console.error("Error accessing the camera", error);
        });
    } else {
      alert("Camera not supported");
    }
  });

  captureButton.addEventListener("click", function () {
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    context.filter = "blur(10px)";
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to a data URL
    const dataUrl = canvas.toDataURL("image/jpeg");

    // Close the modal
    cameraModal.style.display = "none";
    video.srcObject.getTracks().forEach((track) => track.stop());

    // Create a new Dropzone file from the data URL
    const dropzone = Dropzone.forElement("#drop_zone");
    const file = dataURLtoFile(dataUrl, "Camera.jpeg");
    dropzone.addFile(file);
  });

  function dataURLtoFile(dataUrl, filename) {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }
});
