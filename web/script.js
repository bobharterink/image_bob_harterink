document.addEventListener("DOMContentLoaded", function () {
  const loadingScreen = document.getElementById("loading-screen");
  const content = document.getElementById("content");
  const text = document.querySelector(".text");
  const outerCircle = document.querySelector(".outer-circle");
  const coverScreen = document.querySelector(".cover-screen");
  const favicon = document.getElementById("favicon");

  text.addEventListener("animationend", function () {
    outerCircle.style.animation = "expandCircle 1s ease-in forwards";

    outerCircle.addEventListener("animationend", function () {
      loadingScreen.style.display = "none";
      content.style.display = "block";
      coverScreen.style.animation = "slideCoverDown 1s forwards";
      coverScreen.style.backgroundColor = "black";

      // Listen for the end of the cover screen animation
      coverScreen.addEventListener("animationend", function () {
        coverScreen.remove(); // Remove the cover screen from the DOM
      });
    });
  });

  // Mapping between logo images and colors
  const logoImages = [
    { src: "Door_Het_Oog1.png", color: "#ed1c40", favicon: "favicon1.ico?v=3" },
    { src: "Door_Het_Oog2.png", color: "#1c88ed", favicon: "favicon2.ico?v=2" },
    { src: "Door_Het_Oog3.png", color: "#1ced6b", favicon: "favicon3.ico?v=2" },
    { src: "Door_Het_Oog4.png", color: "#ed1cae", favicon: "favicon4.ico?v=2" },
    { src: "Door_Het_Oog5.png", color: "#edb71c", favicon: "favicon5.ico?v=2" },
  ];

  // Randomly select logo image and corresponding color
  const randomLogo = logoImages[Math.floor(Math.random() * logoImages.length)];
  favicon.href = randomLogo.favicon;
  document.getElementById("logo").src = randomLogo.src;
  outerCircle.style.backgroundColor = randomLogo.color;
});