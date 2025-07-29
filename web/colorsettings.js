document.addEventListener("DOMContentLoaded", function () {
  // Mapping tussen logo-afbeeldingen en kleuren
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

  // Willekeurig logo-afbeelding en bijbehorende kleur selecteren of dezelfde kleur behouden
  const selectedLogoIndex = localStorage.getItem("selectedLogoIndex")
    ? parseInt(localStorage.getItem("selectedLogoIndex"))
    : Math.floor(Math.random() * logoImages.length);

  localStorage.setItem("selectedLogoIndex", selectedLogoIndex);
  const randomLogo = logoImages[selectedLogoIndex];

  // Favicon en logo instellen (optioneel)
  const favicon = document.getElementById("favicon");
  if (favicon) {
    favicon.href = randomLogo.favicon;
  }

  const logo = document.getElementById("logo");
  if (logo) {
    logo.src = randomLogo.src;
  }

  // CSS variabelen instellen
  document.documentElement.style.setProperty(
    "--thumb-bg-color",
    randomLogo.color
  );
  document.documentElement.style.setProperty(
    "--slider-bg-color",
    randomLogo.secondaryColor
  );
  document.documentElement.style.setProperty(
    "--hover-bg-color",
    randomLogo.hoverColor
  );

  // Update de achtergrondkleur van pre elementen (optioneel)
  const preElements = document.querySelectorAll("pre");
  preElements.forEach((pre) => {
    pre.style.backgroundColor = randomLogo.secondaryColor;
  });
});
