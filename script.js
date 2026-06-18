async function loadNavigation() {
    const navPlaceholder = document.getElementById('nav-placeholder');
    if (!navPlaceholder) return;

    const isEnglish = window.location.pathname.includes('/en/');
    const navFile = isEnglish ? 'nav-en.html' : 'nav-hr.html';
    
    try {
        const response = await fetch(`/_includes/${navFile}`);
        if (!response.ok) throw new Error(`Template ${navFile} not found`);
        let data = await response.text();
        navPlaceholder.innerHTML = data;
        highlightActiveLink();
        setupLanguageSwitcher(isEnglish);
    } catch (err) {
        console.error("Bicpop error:", err);
    }
}

function toggleMenu(event) {
    if (event) event.stopPropagation();
    document.getElementById('main-nav')?.classList.toggle('open');
}

function toggleLang(event) {
    if (event) event.stopPropagation();
    document.getElementById('lang-dropdown')?.classList.toggle('open');
}

document.addEventListener('click', () => {
    document.getElementById('main-nav')?.classList.remove('open');
    document.getElementById('lang-dropdown')?.classList.remove('open');
});

function highlightActiveLink() {
    const filename = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.btn').forEach(link => {
        const href = link.getAttribute('href') || '';
        if (href.endsWith(filename)) {
            link.classList.add('active');
        }
    });
}

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
        langSwitchLink.href = '/hr/' + (enToHr[currentFilename] || currentFilename);
    } else {
        langSwitchLink.href = '/en/' + (hrToEn[currentFilename] || currentFilename);
    }
}

loadNavigation();