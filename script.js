// --- DOM ELEMENTS ---
const body = document.body;
const contentContainer = document.getElementById("contentContainer");
const articleText = document.getElementById("articleText");
const settingsPanel = document.getElementById("settingsPanel");
const settingsToggle = document.getElementById("settingsToggle");
const closeSettings = document.getElementById("closeSettings");
const progressBar = document.getElementById("progressBar");
const fontSelect = document.getElementById("fontSelect");
const sizeLabel = document.getElementById("currentSizeLabel");

let currentSize = 18;

// --- INITIALIZATION ---
window.onload = () => {
  const savedTheme = localStorage.getItem("theme") || "light";
  // Default font now matches the first option in your list
  const savedFont =
    localStorage.getItem("font") || "'Times New Roman', Times, serif";
  const savedWidth = localStorage.getItem("width") || "max-w-4xl";
  const savedSize = parseInt(localStorage.getItem("size")) || 18;

  setTheme(savedTheme);
  setFont(savedFont);
  setWidth(savedWidth);
  currentSize = savedSize;
  applyFontSize();

  if (fontSelect) fontSelect.value = savedFont;

  initUrlTooltips();
};

// --- SETTINGS PANEL TOGGLE ---
settingsToggle.addEventListener("click", () => {
  settingsPanel.classList.remove("translate-x-[120%]");
});
closeSettings.addEventListener("click", () => {
  settingsPanel.classList.add("translate-x-[120%]");
});

document.addEventListener("click", (event) => {
  if (!settingsPanel.classList.contains("translate-x-[120%]")) {
    const isClickInsidePanel = settingsPanel.contains(event.target);
    const isClickOnToggle = settingsToggle.contains(event.target);
    if (!isClickInsidePanel && !isClickOnToggle) {
      settingsPanel.classList.add("translate-x-[120%]");
    }
  }
});

// --- THEME FUNCTIONS ---
function setTheme(themeName) {
  if (themeName === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
  body.setAttribute("data-theme", themeName);
  localStorage.setItem("theme", themeName);
}

function setFont(fontValue) {
  // Directly apply the raw font string to the article text
  articleText.style.fontFamily = fontValue;
  // Also apply to headings specifically if Tailwind prose overrides them
  const headings = articleText.querySelectorAll("h1, h2, h3, h4");
  headings.forEach((h) => (h.style.fontFamily = fontValue));

  localStorage.setItem("font", fontValue);
}

function setWidth(maxWidthClass) {
  contentContainer.classList.remove("max-w-2xl", "max-w-4xl", "max-w-6xl");
  contentContainer.classList.add(maxWidthClass);
  localStorage.setItem("width", maxWidthClass);
}

function adjustFontSize(delta) {
  currentSize += delta;
  if (currentSize < 14) currentSize = 14;
  if (currentSize > 24) currentSize = 24;
  applyFontSize();
}

function applyFontSize() {
  articleText.style.fontSize = `${currentSize}px`;
  sizeLabel.textContent = `${currentSize}px`;
  localStorage.setItem("size", currentSize);
}

// --- PROGRESS BAR ---
window.onscroll = function () {
  let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  let height =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  let scrolled = (winScroll / height) * 100;
  progressBar.style.width = scrolled + "%";
};

// --- INTERACTIVE ARTEFACTS ---

function toggleTei(mode) {
  const renderView = document.getElementById("tei-render");
  const codeView = document.getElementById("tei-code");
  const btnRender = document.getElementById("btn-render");
  const btnCode = document.getElementById("btn-code");

  const activeClass = "bg-white dark:bg-gray-700 shadow-sm text-primary";
  const inactiveClass = "text-secondary hover:bg-black/5 dark:hover:bg-white/5";

  if (mode === "render") {
    renderView.classList.remove("hidden");
    codeView.classList.add("hidden");

    btnRender.className = `px-3 py-1.5 text-xs font-medium rounded-md transition-all ${activeClass}`;
    btnCode.className = `px-3 py-1.5 text-xs font-medium rounded-md transition-all ${inactiveClass}`;
  } else {
    renderView.classList.add("hidden");
    codeView.classList.remove("hidden");

    btnRender.className = `px-3 py-1.5 text-xs font-medium rounded-md transition-all ${inactiveClass}`;
    btnCode.className = `px-3 py-1.5 text-xs font-medium rounded-md transition-all ${activeClass}`;
  }
}

// --- TOOLTIPS ---
// Only for URLs, citations are now static colored text
function initUrlTooltips() {
  const tooltip = document.getElementById("url-tooltip");
  const triggers = document.querySelectorAll(".url-tooltip-trigger");

  if (!tooltip) return;

  triggers.forEach((trigger) => {
    trigger.addEventListener("mouseenter", () => {
      tooltip.textContent = trigger.href;
      tooltip.classList.remove("hidden");

      requestAnimationFrame(() => {
        tooltip.classList.remove("opacity-0");
      });

      const linkRect = trigger.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();

      const left = linkRect.left + linkRect.width / 2 - tooltipRect.width / 2;
      const top = linkRect.top - tooltipRect.height - 8;

      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${top}px`;
    });

    trigger.addEventListener("mouseleave", () => {
      tooltip.classList.add("opacity-0");
      setTimeout(() => {
        tooltip.classList.add("hidden");
      }, 200);
    });
  });
}
