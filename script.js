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

// Assignments Menu Elements
const assignmentsToggle = document.getElementById("assignmentsToggle");
const assignmentsPanel = document.getElementById("assignmentsPanel");

function isSettingsOpen() {
  return settingsPanel && !settingsPanel.classList.contains("translate-x-[120%]");
}

function setSettingsOpen(open) {
  if (!settingsPanel) return;
  settingsPanel.classList.toggle("translate-x-[120%]", !open);
}

function isAssignmentsOpen() {
  return assignmentsPanel && !assignmentsPanel.classList.contains("invisible");
}

function setAssignmentsMenu(open) {
  if (!assignmentsPanel) return;

  assignmentsPanel.classList.toggle("invisible", !open);
  assignmentsPanel.classList.toggle("opacity-0", !open);
  assignmentsPanel.classList.toggle("translate-y-1", !open);

  // Prevent overlap: opening one panel closes the other.
  if (open) setSettingsOpen(false);
}

let currentSize = 18;

// --- INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme") || "light";
  const savedFont = localStorage.getItem("font") || "'Times New Roman', Times, serif";
  const savedWidth = localStorage.getItem("width") || "max-w-4xl";
  const savedSize = parseInt(localStorage.getItem("size")) || 18;

  setTheme(savedTheme);
  setFont(savedFont);
  setWidth(savedWidth);
  currentSize = savedSize;
  applyFontSize();

  if (fontSelect) fontSelect.value = savedFont;

  initUrlTooltips();
  initScrollAnimations();
});

// --- SETTINGS PANEL TOGGLE ---
if (settingsToggle) {
  settingsToggle.addEventListener("click", (e) => {
    e.stopPropagation();

    setSettingsOpen(!isSettingsOpen());

    // If opening settings, ensure assignments is closed so they don't overlap
    if (isSettingsOpen()) setAssignmentsMenu(false);
  });
}

if (closeSettings) {
  closeSettings.addEventListener("click", () => {
    setSettingsOpen(false);
  });
}

// --- ASSIGNMENTS MENU TOGGLE ---
if (assignmentsToggle && assignmentsPanel) {
  assignmentsToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    setAssignmentsMenu(!isAssignmentsOpen());
  });
}

// --- GLOBAL CLICK LISTENER (CLOSE PANELS) ---
document.addEventListener("click", (event) => {
  // Close Settings Panel logic
  if (isSettingsOpen()) {
    const isClickInsidePanel = settingsPanel.contains(event.target);
    const isClickOnToggle = settingsToggle.contains(event.target);
    if (!isClickInsidePanel && !isClickOnToggle) {
      setSettingsOpen(false);
    }
  }

  // Close Assignments Menu logic
  if (isAssignmentsOpen()) {
    const isClickInsideMenu = assignmentsPanel.contains(event.target);
    const isClickOnToggle = assignmentsToggle.contains(event.target);
    if (!isClickInsideMenu && !isClickOnToggle) {
      setAssignmentsMenu(false);
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
  if (!articleText) return;
  articleText.style.fontFamily = fontValue;

  // Keep this to preserve your current behavior (your Tailwind typography sets headings to Inter)
  const headings = articleText.querySelectorAll("h1, h2, h3, h4");
  headings.forEach((h) => (h.style.fontFamily = fontValue));

  localStorage.setItem("font", fontValue);
}

function setWidth(maxWidthClass) {
  if (!contentContainer) return;
  contentContainer.classList.remove(
    "max-w-2xl",
    "max-w-3xl",
    "max-w-4xl",
    "max-w-5xl",
    "max-w-6xl",
    "max-w-7xl"
  );
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
  if (!articleText) return;
  articleText.style.fontSize = `${currentSize}px`;
  if (sizeLabel) sizeLabel.textContent = `${currentSize}px`;
  localStorage.setItem("size", currentSize);
}

// --- PROGRESS BAR ---
window.onscroll = function () {
  let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  let scrolled = (winScroll / height) * 100;
  if (progressBar) progressBar.style.width = scrolled + "%";
};

// --- INTERACTIVE ARTEFACTS ---
const TEI_ACTIVE_CLASS =
  "px-3 py-1 text-xs font-semibold rounded-full transition-all duration-300 bg-gradient-to-r from-accent to-accent-hover text-white shadow-md shadow-accent/20";
const TEI_INACTIVE_CLASS =
  "px-3 py-1 text-xs font-medium rounded-full transition-all duration-300 text-secondary hover:text-primary hover:bg-primary/5";

function toggleTei(mode) {
  const renderView = document.getElementById("tei-render");
  const codeView = document.getElementById("tei-code");
  const btnRender = document.getElementById("btn-render");
  const btnCode = document.getElementById("btn-code");

  if (!renderView || !codeView) return;

  if (mode === "render") {
    renderView.classList.remove("hidden");
    codeView.classList.add("hidden");

    btnRender.className = TEI_ACTIVE_CLASS;
    btnCode.className = TEI_INACTIVE_CLASS;
  } else {
    renderView.classList.add("hidden");
    codeView.classList.remove("hidden");

    btnRender.className = TEI_INACTIVE_CLASS;
    btnCode.className = TEI_ACTIVE_CLASS;
  }
}

// --- TOOLTIPS ---
function initUrlTooltips() {
  const tooltip = document.getElementById("url-tooltip");
  const triggers = document.querySelectorAll(".url-tooltip-trigger");

  if (!tooltip || triggers.length === 0) return;

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

function initScrollAnimations() {
  // 1. Setup Bibliography Staggering
  const bibliographySection = document.querySelector(
    "#section-bibliography ul, section:last-of-type ul"
  );

  if (bibliographySection) {
    const items = bibliographySection.querySelectorAll("li");
    items.forEach((item, index) => {
      item.classList.add("reveal-on-scroll");
      const delay = (index % 3) * 100;
      item.style.transitionDelay = `${delay}ms`;
    });
  }

  // 2. Setup Interactive Figures
  const interactiveCards = document.querySelectorAll(".not-prose");
  interactiveCards.forEach((card) => {
    card.classList.add("reveal-on-scroll");
  });

  // 3. Intersection Observer
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll(".reveal-on-scroll").forEach((el) => {
    observer.observe(el);
  });
}
