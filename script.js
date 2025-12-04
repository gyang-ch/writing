// DOM Elements
const body = document.body;
const themeBtn = document.getElementById("themeBtn");
const fontBtn = document.getElementById("fontBtn");
const progressBar = document.getElementById("progressBar");

// 1. Theme Toggle (Light/Dark)
function toggleTheme() {
  const currentTheme = body.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  body.setAttribute("data-theme", newTheme);
  themeBtn.textContent = newTheme === "dark" ? "☀️" : "🌙";

  // Save preference
  localStorage.setItem("theme", newTheme);
}

// 2. Font Size Adjustment
let currentSize = 18; // Matches CSS base-size

function adjustFontSize(action) {
  if (action === "increase") {
    currentSize += 2;
  } else if (action === "decrease") {
    currentSize = Math.max(12, currentSize - 2); // Minimum 12px
  }
  document.documentElement.style.setProperty("--base-size", `${currentSize}px`);
}

// 3. Font Family Toggle
function toggleFont() {
  const root = document.documentElement;
  const currentFont = getComputedStyle(root)
    .getPropertyValue("--current-font")
    .trim();
  const serif = getComputedStyle(root).getPropertyValue("--font-serif").trim();

  if (currentFont === serif) {
    root.style.setProperty("--current-font", "var(--font-sans)");
    fontBtn.textContent = "Serif";
  } else {
    root.style.setProperty("--current-font", "var(--font-serif)");
    fontBtn.textContent = "Sans";
  }
}

// 4. Scroll Progress Bar
window.onscroll = function () {
  let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  let height =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  let scrolled = (winScroll / height) * 100;
  progressBar.style.width = scrolled + "%";
};

// Check for saved user preferences on load
window.onload = () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    body.setAttribute("data-theme", savedTheme);
    themeBtn.textContent = savedTheme === "dark" ? "☀️" : "🌙";
  }
};
