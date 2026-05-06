async function loadNavigation() {
    const navPlaceholder = document.getElementById('nav-placeholder');
    if (!navPlaceholder) return;

    // Detect if we are in the English or Croatian folder
    const isEnglish = window.location.pathname.includes('/en/');
    
    // Path to your shared nav.html in the _includes folder
    // Note: Since nav.html is outside the hr/en folders, we use the root path
    try {
        const response = await fetch('/_includes/nav.html');
        if (!response.ok) throw new Error('Nav not found');
        let data = await response.text();

        // If we are on an English page, we swap the text manually 
        // OR you can create two separate nav files. 
        // For now, let's keep it simple:
        navPlaceholder.innerHTML = data;
        
        highlightActiveLink();
    } catch (err) {
        console.error("Bicpop error:", err);
    }
}

// Burger Menu Logic
function toggleMenu(event) {
    if (event) event.stopPropagation();
    document.getElementById('main-nav')?.classList.toggle('open');
}

// Lang Dropdown Logic
function toggleLang(event) {
    if (event) event.stopPropagation();
    document.getElementById('lang-dropdown')?.classList.toggle('open');
}

// Close on outside click
document.addEventListener('click', () => {
    document.getElementById('main-nav')?.classList.remove('open');
    document.getElementById('lang-dropdown')?.classList.remove('open');
});

function highlightActiveLink() {
    const path = window.location.pathname;
    document.querySelectorAll('.btn').forEach(link => {
        if (path.includes(link.getAttribute('href'))) {
            link.classList.add('active');
        }
    });
}

loadNavigation();