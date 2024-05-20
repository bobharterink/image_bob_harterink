document.addEventListener("DOMContentLoaded", function () {
  const loadingScreen = document.getElementById("loading-screen");
  const content = document.getElementById("content");
  const text = document.querySelector(".text");
  const outerCircle = document.querySelector(".outer-circle");
  const coverScreen = document.querySelector(".cover-screen");

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
});

document.addEventListener("DOMContentLoaded", function () {
  const colors = ["#ed1c40", "#1c88ed", "#1ced6b", "#edb71c", "#ed1cae"]; // Array of colors
  const outerCircle = document.querySelector(".outer-circle");

  // Function to get a random color from the array
  function getRandomColor() {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  }

  // Set the background color of the outer circle
  outerCircle.style.backgroundColor = getRandomColor();
});
