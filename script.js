// --- DOM ELEMENTS ---
const body = document.body;
const settingsPanel = document.getElementById('settingsPanel');
const settingsToggle = document.getElementById('settingsToggle');
const closeSettings = document.getElementById('closeSettings');
const progressBar = document.getElementById('progressBar');
const fontSelect = document.getElementById('fontSelect');
const sizeLabel = document.getElementById('currentSizeLabel');

let currentSize = 18;

// --- INITIALIZATION ---
window.onload = () => {
    // Load Saved Settings
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedFont = localStorage.getItem('font') || "'Merriweather', serif";
    const savedSize = parseInt(localStorage.getItem('size')) || 18;
    const savedWidth = localStorage.getItem('width') || 'normal';

    setTheme(savedTheme);
    setFont(savedFont);
    currentSize = savedSize;
    applyFontSize();
    setWidth(savedWidth);

    // Sync Dropdown UI
    fontSelect.value = savedFont;
};

// --- SETTINGS PANEL TOGGLE ---
settingsToggle.addEventListener('click', () => {
    settingsPanel.classList.toggle('hidden');
});
closeSettings.addEventListener('click', () => {
    settingsPanel.classList.add('hidden');
});

// --- THEME FUNCTION ---
function setTheme(themeName) {
    body.setAttribute('data-theme', themeName);
    localStorage.setItem('theme', themeName);
}

// --- FONT FAMILY FUNCTION ---
function setFont(fontName) {
    document.documentElement.style.setProperty('--font-family', fontName);
    localStorage.setItem('font', fontName);
}

// --- FONT SIZE FUNCTION ---
function adjustFontSize(delta) {
    currentSize += delta;
    if (currentSize < 12) currentSize = 12;
    if (currentSize > 32) currentSize = 32;
    applyFontSize();
}

function applyFontSize() {
    document.documentElement.style.setProperty('--base-size', `${currentSize}px`);
    sizeLabel.textContent = `${currentSize}px`;
    localStorage.setItem('size', currentSize);
}

// --- PAGE WIDTH FUNCTION ---
function setWidth(widthMode) {
    body.setAttribute('data-width', widthMode);
    localStorage.setItem('width', widthMode);
}

// --- SCROLL PROGRESS ---
window.onscroll = function() {
    let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + "%";
};
