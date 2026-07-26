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
if (!window.location.pathname.includes('/en/')) {
    loadBlog();
}

const POSTS_PER_PAGE = 2;
let blogEntries = [];
let archivePage = 0;

async function loadBlog() {
    const latestPost = document.getElementById('latest-post');
    const archiveContainer = document.getElementById('archive-container');
    if (!latestPost || !archiveContainer) return;

    try {
        const response = await fetch('/hr/data/blog.json?t=' + Date.now());
        if (!response.ok) throw new Error('blog.json not found');
        const data = await response.json();

        blogEntries = (data.entries || []).map((entry, i) => ({ ...entry, _idx: i })).sort((a, b) => {
            const dateDiff = new Date(b.date) - new Date(a.date);
            if (dateDiff !== 0) return dateDiff;
            return b._idx - a._idx;
        });

        if (blogEntries.length === 0) {
            latestPost.innerHTML = `<h3>nema novosti</h3><p></p>`;
            return;
        }

        renderLatestPost(blogEntries[0]);
        renderArchivePage();
        setupArchiveNav();

    } catch (err) {
        console.error("Bicpop blog error:", err);
        latestPost.innerHTML = `<h3>greska pri ucitavanju</h3><p></p>`;
    }
}

function renderLatestPost(post) {
    const latestPost = document.getElementById('latest-post');
    latestPost.innerHTML = `
        <h3>${escapeHtml(post.title)}</h3>
        <p><em>${escapeHtml(post.date)}</em></p>
        <p>${escapeHtml(post.content)}</p>
    `;
}

function renderArchivePage() {
    const archiveContainer = document.getElementById('archive-container');
    const rest = blogEntries.slice(1);
    const start = archivePage * POSTS_PER_PAGE;
    const pageEntries = rest.slice(start, start + POSTS_PER_PAGE);

    archiveContainer.innerHTML = pageEntries.map(post => `
        <div class="archive-item">
            <strong>${escapeHtml(post.title)}</strong>
            <span><em>${escapeHtml(post.date)}</em></span>
            <p>${escapeHtml(post.content)}</p>
        </div>
    `).join('');

    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    if (prevBtn) prevBtn.style.opacity = archivePage === 0 ? '0.3' : '1';
    if (nextBtn) nextBtn.style.opacity = (start + POSTS_PER_PAGE >= rest.length) ? '0.3' : '1';
}

function setupArchiveNav() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    prevBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        if (archivePage > 0) {
            archivePage--;
            renderArchivePage();
        }
    });

    nextBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        const rest = blogEntries.slice(1);
        if ((archivePage + 1) * POSTS_PER_PAGE < rest.length) {
            archivePage++;
            renderArchivePage();
        }
    });
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
}