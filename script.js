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

let currentSize = 18;

// --- INITIALIZATION ---
window.onload = () => {
  const savedTheme = localStorage.getItem("theme") || "light";
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
  initScrollAnimations();
};

// --- SETTINGS PANEL TOGGLE ---
if (settingsToggle) {
  settingsToggle.addEventListener("click", (e) => {
    // Stop the click from bubbling up to the document (prevents immediate re-closing)
    e.stopPropagation();

    // Check if the panel is currently closed
    // (If it has the "translate-x-[120%]" class, it is closed/off-screen)
    const isClosed = settingsPanel.classList.contains("translate-x-[120%]");

    if (isClosed) {
      // If closed, OPEN it:
      settingsPanel.classList.remove("translate-x-[120%]");
      // And make sure the assignments menu is closed so they don't overlap
      closeAssignmentsMenu();
    } else {
      // If open, CLOSE it:
      settingsPanel.classList.add("translate-x-[120%]");
    }
  });
}

if (closeSettings) {
  closeSettings.addEventListener("click", () => {
    settingsPanel.classList.add("translate-x-[120%]");
  });
}

// --- ASSIGNMENTS MENU TOGGLE ---
if (assignmentsToggle && assignmentsPanel) {
  assignmentsToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    const isClosed = assignmentsPanel.classList.contains("invisible");

    if (isClosed) {
      openAssignmentsMenu();
    } else {
      closeAssignmentsMenu();
    }
  });
}

function openAssignmentsMenu() {
  if (!assignmentsPanel) return;
  assignmentsPanel.classList.remove("invisible", "opacity-0", "translate-y-1");
  // Close settings if open
  if (settingsPanel) settingsPanel.classList.add("translate-x-[120%]");
}

function closeAssignmentsMenu() {
  if (!assignmentsPanel) return;
  assignmentsPanel.classList.add("invisible", "opacity-0", "translate-y-1");
}

// --- GLOBAL CLICK LISTENER (CLOSE PANELS) ---
document.addEventListener("click", (event) => {
  // Close Settings Panel logic
  if (
    settingsPanel &&
    !settingsPanel.classList.contains("translate-x-[120%]")
  ) {
    const isClickInsidePanel = settingsPanel.contains(event.target);
    const isClickOnToggle = settingsToggle.contains(event.target);
    if (!isClickInsidePanel && !isClickOnToggle) {
      settingsPanel.classList.add("translate-x-[120%]");
    }
  }

  // Close Assignments Menu logic
  if (assignmentsPanel && !assignmentsPanel.classList.contains("invisible")) {
    const isClickInsideMenu = assignmentsPanel.contains(event.target);
    const isClickOnToggle = assignmentsToggle.contains(event.target);
    if (!isClickInsideMenu && !isClickOnToggle) {
      closeAssignmentsMenu();
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
    "max-w-7xl",
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
  let height =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  let scrolled = (winScroll / height) * 100;
  if (progressBar) progressBar.style.width = scrolled + "%";
};

// --- INTERACTIVE ARTEFACTS ---
function toggleTei(mode) {
  const renderView = document.getElementById("tei-render");
  const codeView = document.getElementById("tei-code");
  const btnRender = document.getElementById("btn-render");
  const btnCode = document.getElementById("btn-code");

  if (!renderView || !codeView) return;

  const activeClass =
    "px-3 py-1 text-xs font-semibold rounded-full transition-all duration-300 bg-gradient-to-r from-accent to-accent-hover text-white shadow-md shadow-accent/20";

  const inactiveClass =
    "px-3 py-1 text-xs font-medium rounded-full transition-all duration-300 text-secondary hover:text-primary hover:bg-primary/5";

  if (mode === "render") {
    renderView.classList.remove("hidden");
    codeView.classList.add("hidden");

    btnRender.className = activeClass;
    btnCode.className = inactiveClass;
  } else {
    renderView.classList.add("hidden");
    codeView.classList.remove("hidden");

    btnRender.className = inactiveClass;
    btnCode.className = activeClass;
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
  // Find the bibliography list (assuming it's the <ul> inside the section with "Bibliography" heading)
  const bibliographySection = document.querySelector(
    "#section-bibliography ul, section:last-of-type ul",
  );

  if (bibliographySection) {
    const items = bibliographySection.querySelectorAll("li");
    items.forEach((item, index) => {
      // Add the reveal class
      item.classList.add("reveal-on-scroll");
      // Add a staggered delay (modulus 3 keeps delays short and snappy)
      // This makes item 1 wait 0ms, item 2 wait 100ms, item 3 wait 200ms, etc.
      const delay = (index % 3) * 100;
      item.style.transitionDelay = `${delay}ms`;
    });
  }

  // 2. Setup Interactive Figures (Optional but recommended)
  // Finds your interactive cards and adds the reveal effect
  const interactiveCards = document.querySelectorAll(".not-prose");
  interactiveCards.forEach((card) => {
    card.classList.add("reveal-on-scroll");
  });

  // 3. The Intersection Observer (The Engine)
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1, // Trigger when 10% of the item is visible
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target); // Run animation only once
      }
    });
  }, observerOptions);

  // Start watching all elements with the class
  document.querySelectorAll(".reveal-on-scroll").forEach((el) => {
    observer.observe(el);
  });
}
