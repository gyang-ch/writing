// --- EXISTING SETTINGS LOGIC (Keep your previous logic here) ---
const body = document.body;
const settingsPanel = document.getElementById('settingsPanel');
const settingsToggle = document.getElementById('settingsToggle');
const closeSettings = document.getElementById('closeSettings');
const progressBar = document.getElementById('progressBar');
let currentSize = 18;

// Toggle Settings
settingsToggle.addEventListener('click', () => settingsPanel.classList.toggle('hidden'));
closeSettings.addEventListener('click', () => settingsPanel.classList.add('hidden'));

// Theme, Font, Size functions (Same as previous code...)
function setTheme(theme) { body.setAttribute('data-theme', theme); localStorage.setItem('theme', theme); }
function setFont(font) { document.documentElement.style.setProperty('--font-family', font); localStorage.setItem('font', font); }
function adjustFontSize(d) { 
    currentSize += d; 
    document.documentElement.style.setProperty('--base-size', `${currentSize}px`); 
    document.getElementById('currentSizeLabel').innerText = `${currentSize}px`;
}
function setWidth(w) { body.setAttribute('data-width', w); }

// --- NEW: SCROLL SPY LOGIC (The fancy part) ---

// 1. Get all sections and sidebar links
const sections = document.querySelectorAll('section, header');
const navLi = document.querySelectorAll('.toc-sidebar ul li a');

// 2. Create an observer
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            // Remove active class from all
            navLi.forEach((link) => link.classList.remove('active'));
            
            // Add active class to the visible section's link
            const id = entry.target.getAttribute('id');
            if (id) {
                document.querySelector(`.toc-sidebar ul li a[href="#${id}"]`).classList.add('active');
            }
        }
    });
}, {
    rootMargin: "-20% 0px -60% 0px" // Triggers when element is in the top part of screen
});

// 3. Tell observer to watch sections
sections.forEach((section) => observer.observe(section));

// Progress Bar logic
window.onscroll = function() {
    let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + "%";
};

// Initial Load
window.onload = () => {
    setTheme(localStorage.getItem('theme') || 'light');
    // ... apply other saved settings
};
