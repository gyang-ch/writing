// --- DOM ELEMENTS ---
const body = document.body;
const settingsPanel = document.getElementById("settingsPanel");
const settingsToggle = document.getElementById("settingsToggle");
const closeSettings = document.getElementById("closeSettings");
const progressBar = document.getElementById("progressBar");
const fontSelect = document.getElementById("fontSelect");
const sizeLabel = document.getElementById("currentSizeLabel");

let currentSize = 18;

// --- INITIALIZATION ---
window.onload = () => {
  // 1. Load Saved Settings
  const savedTheme = localStorage.getItem("theme") || "light";
  const savedFont = localStorage.getItem("font") || "'Merriweather', serif";
  const savedSize = parseInt(localStorage.getItem("size")) || 18;
  const savedWidth = localStorage.getItem("width") || "wide";
  setTheme(savedTheme);
  setFont(savedFont);
  currentSize = savedSize;
  applyFontSize();
  setWidth(savedWidth);
  fontSelect.value = savedFont;
  // 2. Initialize Chart
  initChart();
  // 3. Initialize URL Tooltips (New function call)
  initUrlTooltips();
};

// --- SETTINGS PANEL TOGGLE ---
settingsToggle.addEventListener("click", () => {
  settingsPanel.classList.toggle("hidden");
});
closeSettings.addEventListener("click", () => {
  settingsPanel.classList.add("hidden");
});

// Close panel when clicking outside
document.addEventListener("click", (event) => {
  // If the panel is open
  if (!settingsPanel.classList.contains("hidden")) {
    const isClickInsidePanel = settingsPanel.contains(event.target);
    const isClickOnToggle = settingsToggle.contains(event.target);

    // If the click is NOT inside the panel AND NOT on the toggle button
    if (!isClickInsidePanel && !isClickOnToggle) {
      settingsPanel.classList.add("hidden");
    }
  }
});

// --- THEME FUNCTIONS ---
function setTheme(themeName) {
  body.setAttribute("data-theme", themeName);
  localStorage.setItem("theme", themeName);
  // Re-render chart if theme changes (optional, omitted for simplicity)
}

function setFont(fontName) {
  document.documentElement.style.setProperty("--font-family", fontName);
  localStorage.setItem("font", fontName);
}

function adjustFontSize(delta) {
  currentSize += delta;
  if (currentSize < 12) currentSize = 12;
  if (currentSize > 32) currentSize = 32;
  applyFontSize();
}

function applyFontSize() {
  document.documentElement.style.setProperty("--base-size", `${currentSize}px`);
  sizeLabel.textContent = `${currentSize}px`;
  localStorage.setItem("size", currentSize);
}

function setWidth(widthMode) {
  body.setAttribute("data-width", widthMode);
  localStorage.setItem("width", widthMode);
}

window.onscroll = function () {
  let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  let height =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  let scrolled = (winScroll / height) * 100;
  progressBar.style.width = scrolled + "%";
};

// --- INTERACTIVE ARTEFACTS FUNCTIONS ---

// 1. TEI Toggle Function
function toggleTei(mode) {
  const renderView = document.getElementById("tei-render");
  const codeView = document.getElementById("tei-code");
  const btnRender = document.getElementById("btn-render");
  const btnCode = document.getElementById("btn-code");

  if (mode === "render") {
    renderView.classList.remove("hidden");
    codeView.classList.add("hidden");
    btnRender.classList.add("active");
    btnCode.classList.remove("active");
  } else {
    renderView.classList.add("hidden");
    codeView.classList.remove("hidden");
    btnRender.classList.remove("active");
    btnCode.classList.add("active");
  }
}

// 2. Chart Initialization
function initChart() {
  const ctx = document.getElementById("oaChart");
  if (!ctx) return; // Guard clause: Exit if chart element doesn't exist

  // Check if current theme is dark to adjust chart colors
  const isDark =
    body.getAttribute("data-theme") === "dark" ||
    body.getAttribute("data-theme") === "grey";
  const gridColor = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)";
  const textColor = isDark ? "#d1d1d1" : "#666";

  new Chart(ctx, {
    type: "line",
    data: {
      labels: ["2014", "2016", "2018", "2020", "2022", "2024"],
      datasets: [
        {
          label: "Gold OA Articles (Millions)",
          data: [1.2, 1.9, 2.6, 4.0, 5.5, 7.1],
          borderColor: "#2c3e50",
          backgroundColor: "rgba(44, 62, 80, 0.1)",
          fill: true,
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
      },
      scales: {
        y: {
          grid: { color: gridColor },
          ticks: { color: textColor },
        },
        x: {
          grid: { display: false },
          ticks: { color: textColor },
        },
      },
    },
  });
}
// 3. URL Tooltip Logic (UPDATED)
function initUrlTooltips() {
  const tooltip = document.getElementById("url-tooltip");
  const triggers = document.querySelectorAll(".url-tooltip-trigger");

  if (!tooltip) return;

  triggers.forEach((trigger) => {
    trigger.addEventListener("mouseenter", () => {
      // 1. Set text
      tooltip.textContent = trigger.href;

      // 2. Make visible temporarily to calculate dimensions
      tooltip.classList.remove("hidden"); // Ensure it's not display:none
      tooltip.classList.add("visible"); // Trigger opacity fade-in

      // 3. Calculate Position (Static, above the link)
      const linkRect = trigger.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();

      // Calculate center horizontal position
      // (Link Left + Half Link Width) - (Half Tooltip Width)
      const left =
        linkRect.left +
        window.scrollX +
        linkRect.width / 2 -
        tooltipRect.width / 2;

      // Calculate top position (Above link)
      // (Link Top - Tooltip Height - 10px Gap)
      const top = linkRect.top + window.scrollY - tooltipRect.height - 10;

      // 4. Apply coordinates
      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${top}px`;
    });

    trigger.addEventListener("mouseleave", () => {
      tooltip.classList.remove("visible");
      // Optional: Add 'hidden' back after transition if needed,
      // but opacity: 0 usually suffices for visual hiding.
    });
  });
}

// 3. URL Tooltip Logic (UPDATED)
function initUrlTooltips() {
  const tooltip = document.getElementById("url-tooltip");
  const triggers = document.querySelectorAll(".url-tooltip-trigger");

  if (!tooltip) return;

  triggers.forEach((trigger) => {
    trigger.addEventListener("mouseenter", () => {
      // 1. Set text
      tooltip.textContent = trigger.href;

      // 2. Make visible temporarily to calculate dimensions
      tooltip.classList.remove("hidden"); // Ensure it's not display:none
      tooltip.classList.add("visible"); // Trigger opacity fade-in

      // 3. Calculate Position (Static, above the link)
      const linkRect = trigger.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();

      // Calculate center horizontal position
      // (Link Left + Half Link Width) - (Half Tooltip Width)
      const left =
        linkRect.left +
        window.scrollX +
        linkRect.width / 2 -
        tooltipRect.width / 2;

      // Calculate top position (Above link)
      // (Link Top - Tooltip Height - 10px Gap)
      const top = linkRect.top + window.scrollY - tooltipRect.height - 10;

      // 4. Apply coordinates
      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${top}px`;
    });

    trigger.addEventListener("mouseleave", () => {
      tooltip.classList.remove("visible");
      // Optional: Add 'hidden' back after transition if needed,
      // but opacity: 0 usually suffices for visual hiding.
    });
  });
}
