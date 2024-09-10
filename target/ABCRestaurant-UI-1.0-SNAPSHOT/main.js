// Menu Button Logic
const menuBtn = document.getElementById("menu_btn");
const navLinks = document.getElementById("nav_links");
const menuBtnIcon = document.querySelector("#menu_btn i");

menuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("open");

  const isOpen = navLinks.classList.contains("open");
  menuBtnIcon.setAttribute("class", isOpen ? "ri-close-line" : "ri-menu-line");
});

navLinks.addEventListener("click", () => {
  navLinks.classList.remove("open");
  menuBtnIcon.setAttribute("class", "ri-menu-line");
});

// Slider Logic
document.addEventListener("DOMContentLoaded", () => {
  getAllRatingsWithName();
});

function getAllRatingsWithName() {
  const url =
    "http://localhost:8080/ABCRestaurant/resources/rates/getratewithname";

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        displayRatings(data);
      }
    })
    .catch((error) => console.error("Error fetching ratings:", error));
}

function displayRatings(data) {
  const clientSlider = document.querySelector(".client_slider .client_slides");
  const clientPagination = document.querySelector(".client_pagination");

  clientSlider.innerHTML = "";
  clientPagination.innerHTML = "";

  data.forEach((rating, index) => {
    const slide = document.createElement("div");
    slide.className = "client_slide";

    if (index === 0) slide.classList.add("active");

    slide.innerHTML = `
      <div class="client_card">
        <p>${rating.rateDescription || "No comment available"}</p>
        <img src="${rating.imageUrl || "assests/user.png"}" alt="client" />
        <h4>${rating.rateTitle || "Anonymous"}</h4>
        <h5>${rating.userFirstName || "Unknown"}</h5>
      </div>
    `;

    clientSlider.appendChild(slide);

    const bullet = document.createElement("span");
    bullet.className = "client_bullet";

    if (index === 0) bullet.classList.add("active");
    bullet.dataset.slide = index;
    bullet.addEventListener("click", () => goToSlide(index));
    clientPagination.appendChild(bullet);
  });

  // Initialize the slider
  showSlide(0);
}

function goToSlide(index) {
  const slides = document.querySelectorAll(".client_slide");
  const bullets = document.querySelectorAll(".client_bullet");

  slides.forEach((slide, i) => {
    slide.classList.toggle("active", i === index);
  });
  bullets.forEach((bullet, i) => {
    bullet.classList.toggle("active", i === index);
  });

  // Update slide position
  showSlide(index);
}

function showSlide(index) {
  const slideContainer = document.querySelector(
    ".client_slider .client_slides"
  );
  slideContainer.style.transform = `translateX(-${index * 100}%)`;

  const bullets = document.querySelectorAll(".client_bullet");
  bullets.forEach((bullet) => bullet.classList.remove("active"));
  bullets[index].classList.add("active");
}

//Gallery Script
let next = document.querySelector(".gallery_next");
let prev = document.querySelector(".gallery_prev");

next.addEventListener("click", function () {
  let items = document.querySelectorAll(".gallery_item");
  document.querySelector(".gallery_slide").appendChild(items[0]);
});

prev.addEventListener("click", function () {
  let items = document.querySelectorAll(".gallery_item");
  document.querySelector(".gallery_slide").prepend(items[items.length - 1]);
});
