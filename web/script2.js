document.addEventListener("DOMContentLoaded", function () {
  // Function to remove the active class from all dropdown-toggle spans
  function removeActiveClass() {
    document.querySelectorAll(".dropdown-toggle span").forEach((el) => {});
  }

  // Add click event to all dropdown-toggle links
  document.querySelectorAll(".dropdown-toggle").forEach((toggle) => {
    toggle.addEventListener("click", function (event) {
      event.preventDefault(); // Prevent the default anchor behavior
      let parentDropdown = this.closest(".dropdown");
      if (parentDropdown) {
        let dropdownMenu = parentDropdown.querySelector(".dropdown-menu");
        if (parentDropdown.classList.contains("open")) {
          // Close the dropdown
          dropdownMenu.style.maxHeight = "0";
          dropdownMenu.style.opacity = "0";
          parentDropdown.classList.remove("open");
          this.querySelector("span").classList.remove("active-link");
        } else {
          // Open the dropdown
          dropdownMenu.style.maxHeight = dropdownMenu.scrollHeight + "px";
          dropdownMenu.style.opacity = "1";
          parentDropdown.classList.add("open");
          this.querySelector("span").classList.add("active-link");
        }
      }
    });
  });

  // Smooth scrolling for internal links
  document.querySelectorAll("nav.sidebar-nav a").forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      if (targetId && targetId !== "#") {
        const targetElement = document.querySelector(targetId);
        const yOffset = -100; // Offset om iets minder ver te scrollen (hier 50 pixels)
        const y =
          targetElement.getBoundingClientRect().top +
          window.pageYOffset +
          yOffset;

        window.scrollTo({
          top: y,
          behavior: "smooth",
        });
      }
    });
  });
});
