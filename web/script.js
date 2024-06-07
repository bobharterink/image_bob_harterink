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
    {
      src: "Door_Het_Oog1.png",
      color: "#ed1c40",
      secondaryColor: "#ffe6ea",
      hoverColor: "#D01937",
      favicon: "favicon1.ico?v=3",
    },
    {
      src: "Door_Het_Oog2.png",
      color: "#1c88ed",
      secondaryColor: "#d9edff",
      hoverColor: "#1872C7",
      favicon: "favicon2.ico?v=2",
    },
    {
      src: "Door_Het_Oog3.png",
      color: "#1ced6b",
      secondaryColor: "#e6ffef",
      hoverColor: "#1BD863",
      favicon: "favicon3.ico?v=2",
    },
    {
      src: "Door_Het_Oog4.png",
      color: "#ed1cae",
      secondaryColor: "#ffe6f7",
      hoverColor: "#BB178A",
      favicon: "favicon4.ico?v=2",
    },
    {
      src: "Door_Het_Oog5.png",
      color: "#edb71c",
      secondaryColor: "#fff8e6",
      hoverColor: "#E1AB16",
      favicon: "favicon5.ico?v=2",
    },
  ];

  // Randomly select logo image and corresponding color
  const randomLogo = logoImages[Math.floor(Math.random() * logoImages.length)];
  favicon.href = randomLogo.favicon;
  document.getElementById("logo").src = randomLogo.src;
  outerCircle.style.backgroundColor = randomLogo.color;

  // Update the background color of pre elements
  const preElements = document.querySelectorAll("pre");
  preElements.forEach((pre) => {
    pre.style.backgroundColor = randomLogo.secondaryColor;
  });

  document.documentElement.style.setProperty(
    "--slider-bg-color",
    randomLogo.secondaryColor
  );

  document.documentElement.style.setProperty(
    "--thumb-bg-color",
    randomLogo.color
  );

  document.documentElement.style.setProperty(
    "--hover-bg-color",
    randomLogo.hoverColor
  );

  // Update the background color of sidebar elements
  /*   const sidebarElements = document.querySelectorAll(".controls");
  sidebarElements.forEach((sidebarpara) => {
    sidebarpara.style.backgroundColor = randomLogo.secondaryColor;
  }); */
});
