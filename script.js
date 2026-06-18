async function loadNavigation() {
    const navPlaceholder = document.getElementById('nav-placeholder');
    if (!navPlaceholder) return;

    // Detect folder path to fetch the matching template file
    const isEnglish = window.location.pathname.includes('/en/');
    const navFile = isEnglish ? 'nav-en.html' : 'nav-hr.html';
    
    try {
        const response = await fetch(`/_includes/${navFile}`);
        if (!response.ok) throw new Error(`Template ${navFile} not found`);
        let data = await response.text();

        navPlaceholder.innerHTML = data;
        
        // Setup highlighting and localization adjustments
        highlightActiveLink();
        setupLanguageSwitcher(isEnglish);
    } catch (err) {
        console.error("Bicpop error:", err);
    }
}

// Mobile Burger Toggle
function toggleMenu(event) {
    if (event) event.stopPropagation();
    document.getElementById('main-nav')?.classList.toggle('open');
}

// Language Selector Dropdown Toggle
function toggleLang(event) {
    if (event) event.stopPropagation();
    document.getElementById('lang-dropdown')?.classList.toggle('open');
}

// Global outside-click closing behavior
document.addEventListener('click', () => {
    document.getElementById('main-nav')?.classList.remove('open');
    document.getElementById('lang-dropdown')?.classList.remove('open');
});

// Dynamic Highlighter
function highlightActiveLink() {
    const filename = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.btn').forEach(link => {
        const href = link.getAttribute('href') || '';
        if (href.endsWith(filename)) {
            link.classList.add('active');
        }
    });
}

// Dynamically changes the switcher link text/route to align language tracks
function setupLanguageSwitcher(isEnglish) {
    const langSwitchLink = document.getElementById('lang-switch-link');
    if (!langSwitchLink) return;

    const currentFilename = window.location.pathname.split('/').pop() || 'index.html';

    const enToHr = {
        'comic.html': 'strip.html',
        'gallery.html': 'galerija.html'
    };
    const hrToEn = {
        'strip.html': 'comic.html',
        'galerija.html': 'gallery.html'
    };

    if (isEnglish) {
        const hrFilename = enToHr[currentFilename] || currentFilename;
        langSwitchLink.href = '/hr/' + hrFilename;
    } else {
        const enFilename = hrToEn[currentFilename] || currentFilename;
        langSwitchLink.href = '/en/' + enFilename;
    }
}

loadNavigation();