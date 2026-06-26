// ═══════════════════════════════════════════════════
//  AgroLibrary — Main Application Logic
//  Versi: Firebase + Cloudinary + Plant/Subcat + Dev Auth
// ═══════════════════════════════════════════════════

// ── Firebase Config ──
const firebaseConfig = {
  apiKey: "AIzaSyDiNaDyY6ekYp97g_pGlnwdmPLXQHRfe0k",
  authDomain: "agrolibrary-d35e6.firebaseapp.com",
  projectId: "agrolibrary-d35e6",
  storageBucket: "agrolibrary-d35e6.firebasestorage.app",
  messagingSenderId: "329766319260",
  appId: "1:329766319260:web:5e8005b1db4ba981562959",
  measurementId: "G-9F129CE5MR"
};

// ── Cloudinary Config ──
const CLOUDINARY_CLOUD_NAME    = 'dbirucziq';
const CLOUDINARY_UPLOAD_PRESET = 'AgroLibrary';

// ── App Constants ──
const PLANT_CATEGORIES = ['Sawit','Kopi','Padi','Jagung','Kelapa','Karet','Kakao','Teh','Tebu','Umum'];
const SUB_CATEGORIES   = ['Penyakit','Hama','Pupuk','Budidaya','Pascapanen','Umum'];
const DEV_PASSWORD     = 'agro2024';

const STORAGE_KEYS = { THEME: 'AGROLIBRARY_THEME' };

// ── Firebase Init ──
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const PAGES_DOC = db.collection('agrolibrary').doc('pages');

// ── Default Data ──
const DEFAULT_PAGES = [
    {
        slug: 'home', title: 'Beranda',
        plant: 'Umum', subcategory: 'Umum', category: 'Umum',
        image: '',
        description: `Selamat datang di **AgroLibrary** 🌾, pustaka digital pertanian modern Anda!\n\n### 💡 Cara Menggunakan\n\n1. **Pilih Tanaman** — Klik kategori tanaman di sidebar (Sawit, Kopi, Padi, dll.)\n2. **Pilih Sub-Kategori** — Filter berdasarkan Penyakit, Hama, Pupuk, dll.\n3. **Pencarian Instan** — Ketik nama item di kotak pencarian\n4. **Tambah Data** — Login sebagai Developer lalu klik "Tambah Item"\n\n> Data tersimpan di Firebase Cloud — tersinkron otomatis di semua perangkat!`,
        symptoms: '', treatment: '',
        updatedAt: new Date().toISOString(), viewCount: 0, likesCount: 0
    },
    {
        slug: 'layu-bakteri', title: 'Layu Bakteri',
        plant: 'Padi', subcategory: 'Penyakit', category: 'Penyakit',
        image: '',
        description: `**Layu Bakteri** disebabkan oleh bakteri *Ralstonia solanacearum*, salah satu penyakit paling merusak pada tanaman hortikultura di wilayah tropis.\n\nBakteri ini hidup di dalam tanah dan menyerang sistem perakaran, menyumbat pembuluh xilem sehingga pasokan air terhambat.\n\nPenyebarannya sangat cepat melalui air irigasi, alat pertanian, atau tanah.`,
        symptoms: `- **Layu mendadak** — daun muda layu tiba-tiba saat cuaca panas, kadang pulih di pagi hari\n- **Daun tetap hijau** saat layu (berbeda dengan Fusarium yang menguning dulu)\n- **Batang berwarna cokelat** jika dipotong melintang di bagian bawah\n- **Lendir bakteri (ooze)** — celupkan potongan batang ke air bersih, akan keluar lendir putih susu`,
        treatment: `1. **Cabut & musnahkan** tanaman terinfeksi segera (bakar/kubur jauh dari lahan)\n2. **Gunakan varietas tahan** — pilih benih yang resisten terhadap layu bakteri\n3. **Aplikasi agens hayati** — *Pseudomonas fluorescens* atau *Trichoderma harzianum*\n4. **Rotasi tanaman** — ganti dengan tanaman non-inang selama 2-3 tahun\n5. **Solarisasi tanah** — tutup bedengan dengan mulsa plastik sebelum tanam`,
        updatedAt: new Date().toISOString(), viewCount: 0, likesCount: 0
    },
    {
        slug: 'wereng-coklat', title: 'Wereng Batang Coklat',
        plant: 'Padi', subcategory: 'Hama', category: 'Hama',
        image: '',
        description: `**Wereng Batang Coklat** (WBC / *Nilaparvata lugens*) adalah hama paling berbahaya bagi pertanaman padi di Asia.\n\nSerangga kecil penghisap cairan ini menyerang secara koloni dalam jumlah ribuan. Selain kerusakan langsung, WBC juga vektor penular virus **Kerdil Rumput** dan **Kerdil Hampa**.`,
        symptoms: `- **Serangga kecil** (2-4 mm) berwarna cokelat kemerahan, menetap di pangkal batang\n- **Hopperburn** — daun menguning lalu mengering berwarna cokelat jerami\n- **Embun jelaga** — jelaga hitam di bawah daun akibat jamur pada honeydew wereng`,
        treatment: `1. **Jajar legowo** (2:1 atau 4:1) untuk sirkulasi udara yang baik\n2. **Tanam serempak** dalam satu wilayah dan rotasi varietas tahan wereng\n3. **Lestarikan musuh alami** — laba-laba, kumbang koksinel, kepik *Cyrtorhinus*\n4. **Pengairan berselang** — keringkan lahan berkala, hindari genangan terus-menerus\n5. **Insektisida selektif** jika populasi > 15 ekor/rumpun`,
        updatedAt: new Date().toISOString(), viewCount: 0, likesCount: 0
    },
    {
        slug: 'budidaya-padi', title: 'Budidaya Padi (Oryza sativa)',
        plant: 'Padi', subcategory: 'Budidaya', category: 'Budidaya',
        image: '',
        description: `**Padi** (*Oryza sativa*) adalah komoditas terpenting Indonesia. Termasuk tanaman monokotil dari keluarga *Poaceae*. Memerlukan air melimpah dan penyinaran penuh.`,
        symptoms: `Karakteristik tanaman padi sehat:\n- **Akar serabut** — lebat, berwarna putih bersih\n- **Batang** — bulat berongga, beruas-ruas\n- **Daun** — pita memanjang, urat sejajar\n- **Malai** — tangkai bulir menggantung, sekam kuning keemasan saat matang`,
        treatment: `1. **Persemaian** — benih daya tumbuh >90%, rendam 24 jam, peram 24 jam\n2. **Olah tanah** — bajak 2x, genangi hingga melumpur sempurna\n3. **Pupuk berimbang** — organik + Urea, SP-36, KCl dalam 3 tahap\n4. **Manajemen air** — irigasi berselang, genangi 3-5 cm awal tanam\n5. **Penyiangan** — manual/gosrok pada 20 HST dan 40 HST`,
        updatedAt: new Date().toISOString(), viewCount: 0, likesCount: 0
    }
];

// ── State ──
let pages = [];
let activePage = null;
let activePlant = null;
let activeSubcat = null;
let activeTag = null;
let searchQuery = '';
let currentImageData = '';
let lastFocusedTextarea = null;
let unsubscribeListener = null;
let isDeveloper = false;

// ── Init ──
document.addEventListener('DOMContentLoaded', async () => {
    initTheme();
    checkDevMode();
    showAppLoading(true);
    await loadPages();
    setupRealtimeSync();
    initEventListeners();
    window.addEventListener('hashchange', handleRoute);
    handleRoute();
    showAppLoading(false);
    updateDevUI();
});

// ── Loading State ──
function showAppLoading(show) {
    let overlay = document.getElementById('app-loading-overlay');
    if (show) {
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'app-loading-overlay';
            overlay.style.cssText = `
                position:fixed;top:0;left:0;width:100%;height:100%;
                background:var(--bg-primary,#111);
                display:flex;flex-direction:column;align-items:center;
                justify-content:center;z-index:99999;gap:16px;
            `;
            overlay.innerHTML = `
                <div style="font-size:2.5rem">🌾</div>
                <div style="color:var(--text-primary,#fff);font-size:1rem;font-family:sans-serif">
                    Memuat AgroLibrary...
                </div>
                <div style="width:40px;height:40px;border:3px solid rgba(255,255,255,.2);
                    border-top-color:#4ade80;border-radius:50%;animation:spin .8s linear infinite"></div>
                <style>@keyframes spin{to{transform:rotate(360deg)}}</style>
            `;
            document.body.appendChild(overlay);
        }
    } else {
        if (overlay) overlay.remove();
    }
}

// ── Theme ──
function initTheme() {
    const t = localStorage.getItem(STORAGE_KEYS.THEME) || 'dark';
    document.body.className = t === 'light' ? 'light-theme' : 'dark-theme';
}
function toggleTheme() {
    const isLight = document.body.classList.contains('light-theme');
    document.body.className = isLight ? 'dark-theme' : 'light-theme';
    localStorage.setItem(STORAGE_KEYS.THEME, isLight ? 'dark' : 'light');
    showToast(isLight ? 'Mode Gelap 🌙' : 'Mode Terang ☀️');
}

// ══════════════════════════════════════════════
//  DATA — Firebase Firestore
// ══════════════════════════════════════════════

async function loadPages() {
    try {
        const doc = await PAGES_DOC.get();
        if (doc.exists && doc.data().data) {
            pages = doc.data().data;
            migratePages();
        } else {
            const raw = localStorage.getItem('AGROLIBRARY_PAGES') || localStorage.getItem('WIKIMAJOR_PAGES');
            if (raw) {
                try {
                    pages = JSON.parse(raw);
                    migratePages();
                    await savePages();
                    showToast('Data lama berhasil dipindahkan ke cloud! ☁️');
                } catch {
                    pages = [...DEFAULT_PAGES];
                    await savePages();
                }
            } else {
                pages = [...DEFAULT_PAGES];
                await savePages();
            }
        }
    } catch (err) {
        console.error('Gagal memuat dari Firebase:', err);
        const raw = localStorage.getItem('AGROLIBRARY_PAGES');
        if (raw) {
            try { pages = JSON.parse(raw); migratePages(); } catch { pages = [...DEFAULT_PAGES]; }
        } else {
            pages = [...DEFAULT_PAGES];
        }
        showToast('⚠️ Gagal terhubung ke cloud, mode offline aktif', 'error');
    }
}

async function savePages() {
    try {
        await PAGES_DOC.set({ data: pages, updatedAt: new Date().toISOString() });
    } catch (err) {
        console.error('Gagal menyimpan ke Firebase:', err);
        localStorage.setItem('AGROLIBRARY_PAGES', JSON.stringify(pages));
        showToast('⚠️ Tersimpan offline saja (cek koneksi)', 'error');
    }
}

// ── Real-Time Sync ──
function setupRealtimeSync() {
    if (unsubscribeListener) unsubscribeListener();
    unsubscribeListener = PAGES_DOC.onSnapshot(snapshot => {
        if (snapshot.exists && snapshot.data().data) {
            const newPages = snapshot.data().data;
            if (JSON.stringify(newPages) !== JSON.stringify(pages)) {
                pages = newPages;
                migratePages();
                renderSidebar();
                showToast('🔄 Data diperbarui dari perangkat lain', 'info');
            }
        }
    }, err => { console.error('Listener error:', err); });
}

function migratePages() {
    pages.forEach(p => {
        if (!p.description) p.description = p.content || '';
        // Migrate old category system → new plant/subcategory system
        if (!p.plant) p.plant = 'Umum';
        if (!p.subcategory) {
            if (p.category && SUB_CATEGORIES.includes(capitalize(p.category))) {
                p.subcategory = capitalize(p.category);
            } else {
                p.subcategory = 'Umum';
            }
        }
        if (!p.category) p.category = p.subcategory;
        if (!p.symptoms) p.symptoms = '';
        if (!p.treatment) p.treatment = '';
        if (!p.image) p.image = '';
        if (typeof p.viewCount !== 'number') p.viewCount = 0;
        if (typeof p.likesCount !== 'number') p.likesCount = 0;
    });
}

// ── Router ──
function handleRoute() {
    document.getElementById('app-sidebar').classList.remove('open');
    const hash = window.location.hash || '#/page/home';

    if (hash.startsWith('#/page/')) showViewMode(hash.replace('#/page/', ''));
    else if (hash.startsWith('#/edit/')) showEditMode(hash.replace('#/edit/', ''));
    else if (hash.startsWith('#/new')) {
        const p = new URLSearchParams(hash.substring(hash.indexOf('?')));
        showEditMode(null, p.get('title') || '');
    } else window.location.hash = '#/page/home';

    renderSidebar();
}

// ══════════════════════
//  View Mode
// ══════════════════════
function showViewMode(slug) {
    document.getElementById('edit-mode').style.display = 'none';
    document.getElementById('view-mode').style.display = 'block';

    const page = pages.find(p => p.slug === slug);
    if (slug !== 'home' && !page) {
        showToast('Item tidak ditemukan', 'error');
        window.location.hash = '#/page/home';
        return;
    }

    renderSidebar();

    const titleEl  = document.getElementById('view-page-title');
    const statsEl  = document.getElementById('view-page-stats');
    const crumbsEl = document.getElementById('page-breadcrumbs');

    if (activePlant && activeSubcat) {
        titleEl.textContent = `${activePlant} › ${activeSubcat}`;
        crumbsEl.innerHTML = `AgroLibrary &gt; ${activePlant} &gt; <span>${activeSubcat}</span>`;
    } else if (activePlant) {
        titleEl.textContent = `Tanaman: ${activePlant}`;
        crumbsEl.innerHTML = `AgroLibrary &gt; Tanaman &gt; <span>${activePlant}</span>`;
    } else if (searchQuery) {
        titleEl.textContent = `Hasil Pencarian`;
        crumbsEl.innerHTML = `AgroLibrary &gt; <span>Pencarian</span>`;
    } else {
        titleEl.textContent = `Pustaka Agro`;
        crumbsEl.innerHTML = `AgroLibrary &gt; <span>Beranda</span>`;
    }

    const itemCount = pages.filter(p => p.slug !== 'home').length;
    statsEl.textContent = `${itemCount} item terdaftar`;

    if (page && slug !== 'home') {
        activePage = page;
        showInfoPopup(page);
    } else {
        closeInfoPopup(false);
    }
}

function stripMarkdown(text) {
    if (!text) return '';
    return text
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\*([^*]+)\*/g, '$1')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/#[#\s\w]+/g, '')
        .replace(/>+/g, '')
        .replace(/[-*+\d.]+\s+/g, '')
        .trim();
}

function renderHomeRow(title, subtitle, items) {
    if (!items || items.length === 0) {
        const match = title.match(/^([^\w\s]+)\s+(.*)$/);
        const icon = match ? match[1] : '📄';
        const text = match ? match[2] : title;
        return `
            <div class="home-content-row" style="margin-bottom: 32px;">
                <div class="home-section-header">
                    <div class="home-section-title-wrap">
                        <span class="home-section-icon">${icon}</span>
                        <h3 class="home-section-title">${text}</h3>
                    </div>
                    <span class="home-section-subtitle">${subtitle}</span>
                </div>
                <div class="home-row-empty" style="padding:20px;text-align:center;color:var(--text-3);background:var(--bg-1);border:1px dashed var(--border);border-radius:var(--radius-md);">Belum ada konten tersedia</div>
            </div>
        `;
    }

    let cardsHtml = '';
    items.forEach(p => {
        const imageHtml = p.image 
            ? `<div class="row-card-img" style="background-image: url('${p.image}')"></div>`
            : `<div class="row-card-img row-card-img-placeholder">${getPlantEmoji(p.plant)}</div>`;
            
        cardsHtml += `
            <div class="home-row-card" onclick="window.location.hash='#/page/${p.slug}'">
                ${imageHtml}
                <div class="row-card-body">
                    <div class="row-card-badges" style="display:flex; gap:6px; margin-bottom: 6px;">
                        <span class="row-card-badge category-umum">${getPlantEmoji(p.plant)} ${p.plant}</span>
                        <span class="row-card-badge category-${slugify(p.subcategory)}">${getSubcatEmoji(p.subcategory)} ${p.subcategory}</span>
                    </div>
                    <h4 class="row-card-title">${p.title}</h4>
                    <p class="row-card-snippet">${stripMarkdown(p.description || '').substring(0, 60)}...</p>
                </div>
            </div>
        `;
    });

    const match = title.match(/^([^\w\s]+)\s+(.*)$/);
    const icon = match ? match[1] : '📄';
    const text = match ? match[2] : title;

    return `
        <div class="home-content-row" style="margin-bottom: 32px;">
            <div class="home-section-header">
                <div class="home-section-title-wrap">
                    <span class="home-section-icon">${icon}</span>
                    <h3 class="home-section-title">${text}</h3>
                </div>
                <span class="home-section-subtitle">${subtitle}</span>
            </div>
            <div class="home-row-scroll">
                ${cardsHtml}
            </div>
        </div>
    `;
}

// ── Cards Grid ──
function renderCardsGrid() {
    const grid = document.getElementById('cards-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const filtered = pages.filter(p => {
        if (p.slug === 'home') return false;
        const q = searchQuery.toLowerCase();
        const match = !q || p.title.toLowerCase().includes(q)
            || (p.description || '').toLowerCase().includes(q)
            || (p.symptoms || '').toLowerCase().includes(q)
            || (p.treatment || '').toLowerCase().includes(q);
        const plantMatch  = !activePlant  || (p.plant || 'Umum') === activePlant;
        const subcatMatch = !activeSubcat || (p.subcategory || 'Umum') === activeSubcat;
        return match && plantMatch && subcatMatch;
    });

    const container = document.querySelector('.cards-grid-container');
    
    // Clean up any old homepage wrappers
    const oldWrapper = container.querySelector('.home-custom-wrapper');
    if (oldWrapper) oldWrapper.remove();

    // ── Homepage: only show intro, no cards ──
    if (!activePlant && !activeSubcat && !searchQuery) {
        const allItems  = pages.filter(p => p.slug !== 'home');
        const totalItems = allItems.length;
        const plants    = [...new Set(allItems.map(p => p.plant || 'Umum'))].filter(Boolean);
        const subcats   = [...new Set(allItems.map(p => p.subcategory || 'Umum'))].filter(Boolean);

        const banner = document.createElement('div');
        banner.className = 'home-custom-wrapper home-hero-section home-intro-only';
        banner.innerHTML = `
            <div class="home-intro-container" style="max-width: 800px; margin: 0 auto; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 50vh; padding: 40px 20px;">
                <div class="home-hero-badge" style="margin-bottom: 18px; width: fit-content; background: var(--green-dim); color: var(--green); border: 1px solid rgba(52, 211, 153, .15); padding: 4px 14px; border-radius: var(--radius-full); font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">🌾 AgroLibrary</div>
                <h2 class="home-hero-headline" style="font-size: 2.5rem; line-height: 1.25; margin-bottom: 18px; font-weight: 800; font-family: var(--font-heading); color: var(--text-1);">Ensiklopedia Pertanian<br><span class="home-hero-accent" style="background: linear-gradient(135deg, var(--green), var(--teal)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Cerdas &amp; Lengkap</span></h2>
                <p class="home-intro-body" style="font-size: 0.98rem; color: var(--text-2); margin-bottom: 28px; line-height: 1.7; max-width: 640px;">
                    Platform digital untuk mengidentifikasi, mendokumentasikan, dan mengelola
                    informasi penyakit tanaman, hama, teknik budidaya, serta pengelolaan kebun.
                    Temukan solusi pertanian berbasis data dengan pencarian cepat dan sistem kategori terstruktur.
                </p>
                <div class="home-hero-stats" style="display: flex; justify-content: center; align-items: center; gap: 28px; margin-bottom: 36px; flex-wrap: wrap;">
                    <div class="home-stat-pill" style="text-align: center;">
                        <span class="home-stat-num" style="display: block; font-size: 2rem; font-weight: 800; color: var(--green); line-height: 1.1;">${totalItems}</span>
                        <span class="home-stat-label" style="font-size: 0.72rem; color: var(--text-3); font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Item Terdaftar</span>
                    </div>
                    <div class="home-stat-divider" style="width: 1px; background: var(--border); height: 32px;"></div>
                    <div class="home-stat-pill" style="text-align: center;">
                        <span class="home-stat-num" style="display: block; font-size: 2rem; font-weight: 800; color: var(--green); line-height: 1.1;">${plants.length}</span>
                        <span class="home-stat-label" style="font-size: 0.72rem; color: var(--text-3); font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Jenis Tanaman</span>
                    </div>
                    <div class="home-stat-divider" style="width: 1px; background: var(--border); height: 32px;"></div>
                    <div class="home-stat-pill" style="text-align: center;">
                        <span class="home-stat-num" style="display: block; font-size: 2rem; font-weight: 800; color: var(--green); line-height: 1.1;">${subcats.length}</span>
                        <span class="home-stat-label" style="font-size: 0.72rem; color: var(--text-3); font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Sub-Kategori</span>
                    </div>
                </div>
                <p class="home-intro-cta" style="font-size: 0.9rem; color: var(--text-3); font-weight: 500;">🌿 Pilih kategori tanaman di sidebar kiri untuk mulai menjelajahi</p>
            </div>
        `;
        container.insertBefore(banner, grid);
        return; // No cards or lists rendered on homepage
    }

    if (!filtered.length) {
        grid.innerHTML = `<div class="sidebar-empty" style="grid-column:1/-1;text-align:center;padding:40px 0;font-size:1rem;">
            Tidak ada item ditemukan untuk filter ini</div>`;
        return;
    }

    filtered.forEach((p, idx) => {
        const card = document.createElement('article');
        card.className = 'info-card';
        card.style.animationDelay = `${idx * 0.05}s`;

        const plantClass  = `plant-${slugify(p.plant || 'umum')}`;
        const subcatClass = `subcat-${slugify(p.subcategory || 'umum')}`;

        const imageHtml = p.image
            ? `<img src="${p.image}" alt="${p.title}" loading="lazy">`
            : `<div class="info-card-placeholder">${getPlantEmoji(p.plant)}</div>`;

        const descSnippet     = p.description ? parseMarkdown(p.description) : '';
        const symptomsSnippet = p.symptoms    ? parseMarkdown(p.symptoms)    : '';
        const treatmentSnippet= p.treatment   ? parseMarkdown(p.treatment)   : '';

        const devButtons = isDeveloper ? `
            <button class="btn btn-outline btn-card-edit" onclick="window.location.hash='#/edit/${p.slug}'">✏️ Edit</button>
            <button class="btn btn-danger btn-card-delete" data-slug="${p.slug}">🗑️</button>
        ` : '';

        card.innerHTML = `
            <div class="info-card-badges">
                <span class="info-card-badge category-umum">${getPlantEmoji(p.plant)} ${p.plant || 'Umum'}</span>
                <span class="info-card-badge category-${slugify(p.subcategory || 'umum')}">${getSubcatEmoji(p.subcategory)} ${p.subcategory || 'Umum'}</span>
            </div>
            <div class="info-card-image" onclick="window.location.hash='#/page/${p.slug}'">${imageHtml}</div>
            <div class="info-card-body" onclick="window.location.hash='#/page/${p.slug}'">
                <h3 class="info-card-title">${p.title}</h3>
                <div class="card-info-section card-info-desc">
                    <span class="card-info-section-title">📝 Penyebab / Deskripsi</span>
                    <div class="card-info-section-body">${descSnippet}</div>
                </div>
                ${p.symptoms && p.symptoms.trim() ? `
                <div class="card-info-section card-info-symptoms">
                    <span class="card-info-section-title">⚠️ Ciri / Gejala</span>
                    <div class="card-info-section-body">${symptomsSnippet}</div>
                </div>` : ''}
                ${p.treatment && p.treatment.trim() ? `
                <div class="card-info-section card-info-treatment">
                    <span class="card-info-section-title">✅ Penanggulangan</span>
                    <div class="card-info-section-body">${treatmentSnippet}</div>
                </div>` : ''}
            </div>
            <div class="info-card-footer">
                <button class="btn btn-outline btn-card-view" onclick="window.location.hash='#/page/${p.slug}'">👁️ Lihat</button>
                ${devButtons}
            </div>
        `;

        if (isDeveloper) {
            const delBtn = card.querySelector('.btn-card-delete');
            if (delBtn) {
                delBtn.addEventListener('click', e => {
                    e.stopPropagation();
                    const slug = e.currentTarget.dataset.slug;
                    const tp = pages.find(pg => pg.slug === slug);
                    if (tp) showModal('Hapus Item?', `Yakin ingin menghapus "${tp.title}"? Tidak dapat dibatalkan.`, () => deletePage(slug));
                });
            }
        }

        grid.appendChild(card);
    });
}

// ── Plant & Subcategory Emojis ──
function getPlantEmoji(plant) {
    const map = { 'Sawit':'🌴','Kopi':'☕','Padi':'🌾','Jagung':'🌽','Kelapa':'🥥','Karet':'🌳','Kakao':'🍫','Teh':'🍵','Tebu':'🎋','Umum':'🌿' };
    return map[plant] || '🌿';
}
function getSubcatEmoji(subcat) {
    const map = { 'Penyakit':'🦠','Hama':'🐛','Pupuk':'🧪','Budidaya':'🌱','Pascapanen':'📦','Umum':'📄' };
    return map[subcat] || '📄';
}
// legacy compat
function getCategoryEmoji(cat) { return getSubcatEmoji(cat); }

// ── Info Popup ──
function showInfoPopup(page) {
    const popup = document.getElementById('info-popup');
    if (!popup) return;

    const catEl   = document.getElementById('popup-category');
    const dateEl  = document.getElementById('popup-date');
    const titleEl = document.getElementById('popup-title');
    const bodyEl  = document.getElementById('popup-body');

    catEl.textContent = `${getPlantEmoji(page.plant || 'Umum')} ${page.plant || 'Umum'} › ${page.subcategory || 'Umum'}`;
    catEl.className   = `info-popup-category plant-${slugify(page.plant || 'umum')}`;
    dateEl.textContent = `Diperbarui: ${formatDate(page.updatedAt)}`;
    titleEl.textContent = page.title;
    bodyEl.innerHTML = '';

    if (page.image) {
        const hero = document.createElement('div');
        hero.className = 'info-popup-hero';
        hero.innerHTML = `<img src="${page.image}" alt="${page.title}">`;
        bodyEl.appendChild(hero);
    }

    const descSection = document.createElement('div');
    descSection.className = 'article-section section-description';
    descSection.innerHTML = `
        <h3 class="article-section-title"><span class="section-icon">📝</span> Penyebab / Deskripsi</h3>
        <div class="markdown-body">${parseMarkdown(page.description || '')}</div>
    `;
    bodyEl.appendChild(descSection);

    if (page.symptoms && page.symptoms.trim()) {
        const s = document.createElement('div');
        s.className = 'article-section section-symptoms';
        s.innerHTML = `
            <h3 class="article-section-title"><span class="section-icon">⚠️</span> Ciri-Ciri / Gejala</h3>
            <div class="markdown-body">${parseMarkdown(page.symptoms)}</div>
        `;
        bodyEl.appendChild(s);
    }

    if (page.treatment && page.treatment.trim()) {
        const t = document.createElement('div');
        t.className = 'article-section section-treatment';
        t.innerHTML = `
            <h3 class="article-section-title"><span class="section-icon">✅</span> Cara Penanggulangan</h3>
            <div class="markdown-body">${parseMarkdown(page.treatment)}</div>
        `;
        bodyEl.appendChild(t);
    }

    if (page.slug !== 'home') {
        page.viewCount = (page.viewCount || 0) + 1;
        savePages();
    }

    const likeBtn = document.getElementById('popup-like-btn');
    if (likeBtn) {
        const likedSlugs = getLikedSlugs();
        likeBtn.classList.toggle('btn-liked', likedSlugs.includes(page.slug));
        const countEl = document.getElementById('popup-like-count');
        if (countEl) countEl.textContent = page.likesCount || 0;
    }

    const editBtn   = document.getElementById('popup-edit-btn');
    const deleteBtn = document.getElementById('popup-delete-btn');
    if (editBtn)   editBtn.style.display   = isDeveloper ? '' : 'none';
    if (deleteBtn) deleteBtn.style.display = isDeveloper ? '' : 'none';

    popup.classList.add('show');
    popup.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeInfoPopup(updateHash = true) {
    const popup = document.getElementById('info-popup');
    if (!popup) return;
    popup.classList.remove('show');
    popup.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    activePage = null;
    if (updateHash) window.location.hash = '#/page/home';
}

// ══════════════════════
//  Edit Mode
// ══════════════════════
function showEditMode(slug = null, prefill = '') {
    if (!isDeveloper) {
        showToast('Login sebagai Developer untuk mengedit data!', 'error');
        window.location.hash = '#/page/home';
        return;
    }
    closeInfoPopup(false);
    document.getElementById('view-mode').style.display = 'none';
    document.getElementById('edit-mode').style.display = 'flex';

    const el = id => document.getElementById(id);
    el('title-error').textContent = '';
    populatePlantOptions();

    if (slug) {
        const page = pages.find(p => p.slug === slug);
        if (!page) { window.location.hash = '#/page/home'; return; }
        activePage = page;
        el('edit-view-title').textContent = `Sunting: ${page.title}`;
        el('edit-title').value      = page.title;
        el('edit-plant').value      = page.plant || 'Umum';
        el('edit-subcategory').value= page.subcategory || 'Umum';
        page.image ? setImagePreview(page.image) : clearImagePreview();
        el('edit-description').value = page.description || page.content || '';
        el('edit-symptoms').value    = page.symptoms || '';
        el('edit-treatment').value   = page.treatment || '';
        el('edit-breadcrumbs').innerHTML = `AgroLibrary &gt; Edit &gt; <span>${page.title}</span>`;
    } else {
        activePage = null;
        el('edit-view-title').textContent = 'Tambah Item Baru';
        el('edit-title').value       = prefill;
        el('edit-plant').value       = activePlant || 'Umum';
        el('edit-subcategory').value = activeSubcat || 'Umum';
        clearImagePreview();
        el('edit-description').value = '';
        el('edit-symptoms').value    = '';
        el('edit-treatment').value   = '';
        el('edit-breadcrumbs').innerHTML = `AgroLibrary &gt; <span>Tambah Item Baru</span>`;
    }
    lastFocusedTextarea = el('edit-description');
}

async function saveActivePage() {
    const el = id => document.getElementById(id);
    const title      = el('edit-title').value.trim();
    const plant      = el('edit-plant').value || 'Umum';
    const subcategory= el('edit-subcategory').value || 'Umum';
    const description= el('edit-description').value;
    const symptoms   = el('edit-symptoms').value;
    const treatment  = el('edit-treatment').value;

    if (!title) { el('title-error').textContent = 'Nama item tidak boleh kosong!'; el('edit-title').focus(); return; }

    const newSlug  = slugify(title);
    const conflict = pages.find(p => p.slug === newSlug && (!activePage || activePage.slug !== p.slug));
    if (conflict) { el('title-error').textContent = 'Nama ini sudah digunakan!'; el('edit-title').focus(); return; }

    if (activePage) {
        activePage.title       = title;
        activePage.slug        = newSlug;
        activePage.plant       = plant;
        activePage.subcategory = subcategory;
        activePage.category    = subcategory;
        activePage.image       = currentImageData;
        activePage.description = description;
        activePage.content     = description;
        activePage.symptoms    = symptoms;
        activePage.treatment   = treatment;
        activePage.updatedAt   = new Date().toISOString();
        showToast('Data berhasil disimpan! 💾');
    } else {
        pages.push({
            slug: newSlug, title,
            plant, subcategory, category: subcategory,
            image: currentImageData, description, content: description,
            symptoms, treatment, updatedAt: new Date().toISOString(),
            viewCount: 0, likesCount: 0
        });
        showToast('Item baru berhasil dibuat! 🎉');
    }
    await savePages();
    window.location.hash = `#/page/${newSlug}`;
}

async function deletePage(slug) {
    if (slug === 'home') { showToast('Beranda tidak bisa dihapus!', 'error'); return; }
    const i = pages.findIndex(p => p.slug === slug);
    if (i !== -1) {
        pages.splice(i, 1);
        await savePages();
        showToast('Item dihapus.');
        window.location.hash = '#/page/home';
    }
}

// ══════════════════════
//  Sidebar
// ══════════════════════
function renderSidebar() {
    const homeLink = document.getElementById('sidebar-home-link');
    if (homeLink) {
        homeLink.classList.toggle('active', !activePlant && !activeSubcat && !searchQuery);
    }

    const plantTagsDiv = document.getElementById('sidebar-plant-tags');
    if (!plantTagsDiv) return;
    plantTagsDiv.innerHTML = '';

    const itemPages  = pages.filter(p => p.slug !== 'home');
    const allPlants  = [...new Set(itemPages.map(p => p.plant || 'Umum'))];

    // "Semua" badge
    const allBadge = document.createElement('span');
    allBadge.className = 'tag-badge' + (!activePlant ? ' active' : '');
    allBadge.textContent = `Semua (${itemPages.length})`;
    allBadge.onclick = () => {
        activePlant = null; activeSubcat = null;
        renderSidebar(); renderFilterChips();
        window.location.hash = '#/page/home';
    };
    plantTagsDiv.appendChild(allBadge);

    PLANT_CATEGORIES.filter(pl => allPlants.includes(pl)).forEach(pl => {
        const count = itemPages.filter(p => (p.plant || 'Umum') === pl).length;
        const b = document.createElement('span');
        b.className = `tag-badge tag-plant-${slugify(pl)}` + (activePlant === pl ? ' active' : '');
        b.textContent = `${getPlantEmoji(pl)} ${pl} (${count})`;
        b.onclick = () => {
            activePlant  = (activePlant === pl) ? null : pl;
            activeSubcat = null;
            renderSidebar(); renderFilterChips();
            if (!activePlant) window.location.hash = '#/page/home';
        };
        plantTagsDiv.appendChild(b);
    });

    // Sub-category section
    const subcatSection  = document.getElementById('sidebar-subcat-section');
    const subcatTagsDiv  = document.getElementById('sidebar-subcat-tags');
    if (activePlant && subcatSection && subcatTagsDiv) {
        subcatSection.style.display = 'block';
        subcatTagsDiv.innerHTML = '';

        const plantItems     = itemPages.filter(p => (p.plant || 'Umum') === activePlant);
        const availableSubcats = [...new Set(plantItems.map(p => p.subcategory || 'Umum'))];

        const allSubBadge = document.createElement('span');
        allSubBadge.className = 'tag-badge' + (!activeSubcat ? ' active' : '');
        allSubBadge.textContent = `Semua (${plantItems.length})`;
        allSubBadge.onclick = () => { activeSubcat = null; renderSidebar(); renderFilterChips(); };
        subcatTagsDiv.appendChild(allSubBadge);

        SUB_CATEGORIES.filter(sc => availableSubcats.includes(sc)).forEach(sc => {
            const count = plantItems.filter(p => (p.subcategory || 'Umum') === sc).length;
            const b = document.createElement('span');
            b.className = `tag-badge tag-subcat-${slugify(sc)}` + (activeSubcat === sc ? ' active' : '');
            b.textContent = `${getSubcatEmoji(sc)} ${sc} (${count})`;
            b.onclick = () => { activeSubcat = (activeSubcat === sc) ? null : sc; renderSidebar(); renderFilterChips(); };
            subcatTagsDiv.appendChild(b);
        });
    } else if (subcatSection) {
        subcatSection.style.display = 'none';
    }

    // ── Page List ──
    const list = document.getElementById('sidebar-page-list');
    if (!list) { renderCardsGrid(); return; }
    list.innerHTML = '';

    const filtered = pages.filter(p => {
        if (p.slug === 'home') return false;
        const q     = searchQuery.toLowerCase();
        const match = !q || p.title.toLowerCase().includes(q)
            || (p.description || '').toLowerCase().includes(q)
            || (p.symptoms    || '').toLowerCase().includes(q)
            || (p.treatment   || '').toLowerCase().includes(q);
        const plantMatch  = !activePlant  || (p.plant || 'Umum') === activePlant;
        const subcatMatch = !activeSubcat || (p.subcategory || 'Umum') === activeSubcat;
        return match && plantMatch && subcatMatch;
    });

    if (!filtered.length) {
        list.innerHTML = `<li class="sidebar-empty">Tidak ada item ditemukan</li>`;
        renderCardsGrid();
        return;
    }

    // Group by subcategory (when plant is selected) or by plant
    const groups = {};
    filtered.forEach(p => {
        const key = activePlant ? (p.subcategory || 'Umum') : (p.plant || 'Umum');
        (groups[key] = groups[key] || []).push(p);
    });

    Object.keys(groups)
        .sort((a, b) => a === 'Umum' ? 1 : b === 'Umum' ? -1 : a.localeCompare(b))
        .forEach(groupKey => {
            const hdr = document.createElement('li');
            hdr.className = 'sidebar-group-header';
            const icon = activePlant ? getSubcatEmoji(groupKey) : getPlantEmoji(groupKey);
            hdr.innerHTML = `<span>${icon} ${groupKey}</span><span class="group-header-count">${groups[groupKey].length}</span>`;
            list.appendChild(hdr);

            groups[groupKey].sort((a, b) => a.title.localeCompare(b.title)).forEach(p => {
                const li = document.createElement('li');
                li.className = 'page-item';
                const a = document.createElement('a');
                a.href = `#/page/${p.slug}`;
                a.className = 'page-link' + (activePage && activePage.slug === p.slug ? ' active' : '');
                a.innerHTML = `<span class="page-link-icon">${getSubcatEmoji(p.subcategory)}</span><span class="page-link-text">${p.title}</span>`;
                li.appendChild(a);
                list.appendChild(li);
            });
        });

    renderCardsGrid();
}

// ── Filter Chips ──
function renderFilterChips() {
    const bar = document.getElementById('filter-chips-bar');
    if (!bar) return;

    if (!activePlant && !activeSubcat && !searchQuery) {
        bar.style.display = 'none';
        return;
    }

    bar.style.display = 'flex';
    bar.innerHTML = '';

    const mkChip = (label, onRemove, extra = '') => {
        const chip = document.createElement('span');
        chip.className = `filter-chip${extra}`;
        chip.textContent = label;
        const x = document.createElement('button');
        x.textContent = '✕'; x.className = 'filter-chip-x'; x.onclick = onRemove;
        chip.appendChild(x);
        return chip;
    };

    if (activePlant) {
        bar.appendChild(mkChip(`${getPlantEmoji(activePlant)} ${activePlant}`, () => {
            activePlant = null; activeSubcat = null;
            renderSidebar(); renderFilterChips();
            window.location.hash = '#/page/home';
        }));
    }
    if (activeSubcat) {
        bar.appendChild(mkChip(`${getSubcatEmoji(activeSubcat)} ${activeSubcat}`, () => {
            activeSubcat = null; renderSidebar(); renderFilterChips();
        }, ' filter-chip-sub'));
    }
    if (searchQuery) {
        bar.appendChild(mkChip(`🔍 "${searchQuery}"`, () => {
            searchQuery = '';
            const inp = document.getElementById('search-input');
            const clr = document.getElementById('clear-search-btn');
            if (inp) inp.value = '';
            if (clr) clr.style.display = 'none';
            renderSidebar(); renderFilterChips();
        }, ' filter-chip-search'));
    }

    const clearAll = document.createElement('button');
    clearAll.className = 'btn btn-xs filter-clear-all';
    clearAll.textContent = '✕ Hapus Semua';
    clearAll.onclick = () => {
        activePlant = null; activeSubcat = null; searchQuery = '';
        const inp = document.getElementById('search-input');
        const clr = document.getElementById('clear-search-btn');
        if (inp) inp.value = '';
        if (clr) clr.style.display = 'none';
        renderSidebar(); renderFilterChips();
        window.location.hash = '#/page/home';
    };
    bar.appendChild(clearAll);
}

// ── Image Helpers ──
function setImagePreview(src) {
    currentImageData = src;
    document.getElementById('edit-image-preview').src = src;
    document.getElementById('edit-image-preview-container').style.display = 'block';
    if (!src.startsWith('data:')) document.getElementById('edit-image-url').value = src;
}
function clearImagePreview() {
    currentImageData = '';
    document.getElementById('edit-image-file').value = '';
    document.getElementById('edit-image-url').value  = '';
    document.getElementById('edit-image-preview-container').style.display = 'none';
    document.getElementById('edit-image-preview').src = '';
}

// ── Populate Plant & Subcategory Selects ──
function populatePlantOptions() {
    const plantSel  = document.getElementById('edit-plant');
    const subcatSel = document.getElementById('edit-subcategory');
    if (!plantSel || !subcatSel) return;

    plantSel.innerHTML = '';
    PLANT_CATEGORIES.forEach(p => {
        const o = document.createElement('option');
        o.value = p; o.textContent = `${getPlantEmoji(p)} ${p}`;
        plantSel.appendChild(o);
    });

    subcatSel.innerHTML = '';
    SUB_CATEGORIES.forEach(s => {
        const o = document.createElement('option');
        o.value = s; o.textContent = `${getSubcatEmoji(s)} ${s}`;
        subcatSel.appendChild(o);
    });
}

// ── ToC ──
function generateToC(el) {
    const toc = document.getElementById('toc-list-container');
    if (!toc) return;
    toc.innerHTML = '';
    const headings = el.querySelectorAll('.markdown-body h1, .markdown-body h2, .markdown-body h3');
    if (!headings.length) { toc.innerHTML = '<li class="sidebar-empty">Daftar isi kosong</li>'; return; }
    headings.forEach((h, i) => {
        if (!h.id) h.id = slugify(h.textContent) + '-' + i;
        const li = document.createElement('li');
        li.className = `toc-item toc-indent-${h.tagName[1]}`;
        const a = document.createElement('a');
        a.href = '#'; a.className = 'toc-link'; a.textContent = h.textContent;
        a.onclick = e => { e.preventDefault(); h.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
        li.appendChild(a); toc.appendChild(li);
    });
}

// ══════════════════════
//  Markdown Parser
// ══════════════════════
function parseMarkdown(text) {
    if (!text) return '';
    let html = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const codeBlocks = [];
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
        codeBlocks.push({ lang, code: code.trim() });
        return `\n@@CB${codeBlocks.length - 1}@@\n`;
    });
    const inlineCodes = [];
    html = html.replace(/`([^`\n]+)`/g, (_, code) => {
        inlineCodes.push(code);
        return `@@IC${inlineCodes.length - 1}@@`;
    });

    const lines = html.split('\n'), out = [];
    let inList = false, listType = null;
    function closeList() { if (inList) { out.push(`</${listType}>`); inList = false; listType = null; } }

    for (const line of lines) {
        const t = line.trim();
        if (/^@@CB\d+@@$/.test(t)) {
            closeList();
            const b = codeBlocks[+t.match(/\d+/)[0]];
            out.push(`<pre><code class="language-${b.lang || 'text'}">${b.code}</code></pre>`);
            continue;
        }
        if (/^(?:-{3,}|\*{3,}|_{3,})$/.test(t)) { closeList(); out.push('<hr>'); continue; }
        const hm = line.match(/^(#{1,6})\s+(.*)$/);
        if (hm) { closeList(); const lv = hm[1].length; out.push(`<h${lv} id="${slugify(hm[2])}">${parseInline(hm[2])}</h${lv}>`); continue; }
        if (t.startsWith('&gt;') || t.startsWith('>')) { closeList(); out.push(`<blockquote>${parseInline(line.replace(/^(&gt;|>)\s?/, ''))}</blockquote>`); continue; }
        const ul = line.match(/^(\s*)[-*+]\s+(.*)$/);
        if (ul) { if (!inList || listType !== 'ul') { closeList(); out.push('<ul>'); inList = true; listType = 'ul'; } out.push(`<li>${parseInline(ul[2])}</li>`); continue; }
        const ol = line.match(/^(\s*)\d+\.\s+(.*)$/);
        if (ol) { if (!inList || listType !== 'ol') { closeList(); out.push('<ol>'); inList = true; listType = 'ol'; } out.push(`<li>${parseInline(ol[2])}</li>`); continue; }
        closeList();
        if (t === '') continue;
        out.push(`<p>${parseInline(line)}</p>`);
    }
    closeList();
    let result = out.join('\n');
    inlineCodes.forEach((c, i) => { result = result.replace(new RegExp(`@@IC${i}@@`, 'g'), `<code>${c}</code>`); });
    return result;
}

function parseInline(t) {
    t = t.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/__(.*?)__/g, '<strong>$1</strong>');
    t = t.replace(/\*(.*?)\*/g, '<em>$1</em>').replace(/_(.*?)_/g, '<em>$1</em>');
    t = t.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1">');
    t = t.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    t = t.replace(/\[\[(.*?)\]\]/g, (_, inner) => {
        let target = inner, display = inner;
        if (inner.includes('|')) { const p = inner.split('|'); target = p[0].trim(); display = p[1].trim(); }
        const s = slugify(target);
        return pages.some(p => p.slug === s)
            ? `<a href="#/page/${s}" class="wiki-link">${display}</a>`
            : `<a href="#/new?title=${encodeURIComponent(target)}" class="wiki-link wiki-link-broken">${display}</a>`;
    });
    return t;
}

// ── Utilities ──
function slugify(t) { return t.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-'); }
function formatDate(iso) {
    const d = new Date(iso);
    const m = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
    return `${d.getDate()} ${m[d.getMonth()]} ${d.getFullYear()}, ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}
function capitalize(s) { return s ? s[0].toUpperCase() + s.slice(1) : ''; }

// ════════════════════════════════
//  Developer Auth System
// ════════════════════════════════
function checkDevMode() {
    isDeveloper = sessionStorage.getItem('agro_dev') === 'true';
}

function loginDeveloper(password) {
    if (password === DEV_PASSWORD) {
        isDeveloper = true;
        sessionStorage.setItem('agro_dev', 'true');
        updateDevUI();
        showToast('Mode Developer aktif! 🔓', 'success');
        return true;
    }
    return false;
}

function logoutDeveloper() {
    isDeveloper = false;
    sessionStorage.removeItem('agro_dev');
    updateDevUI();
    showToast('Keluar dari mode Developer 🔒', 'info');
}

function updateDevUI() {
    const devLoginBtn      = document.getElementById('dev-login-btn');
    const headerActionsDiv = document.getElementById('header-actions-dev');
    const popupEditBtn     = document.getElementById('popup-edit-btn');
    const popupDeleteBtn   = document.getElementById('popup-delete-btn');

    if (isDeveloper) {
        if (devLoginBtn)      { devLoginBtn.textContent = '🔒 Keluar Dev Mode'; devLoginBtn.classList.add('btn-dev-active'); }
        if (headerActionsDiv) headerActionsDiv.style.display = 'flex';
    } else {
        if (devLoginBtn)      { devLoginBtn.textContent = '🔐 Developer Login'; devLoginBtn.classList.remove('btn-dev-active'); }
        if (headerActionsDiv) headerActionsDiv.style.display = 'none';
    }
    if (popupEditBtn)   popupEditBtn.style.display   = isDeveloper ? '' : 'none';
    if (popupDeleteBtn) popupDeleteBtn.style.display = isDeveloper ? '' : 'none';

    renderCardsGrid();
}

function showDevLoginModal() {
    const modal = document.getElementById('dev-login-modal');
    if (!modal) return;
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    setTimeout(() => { const inp = document.getElementById('dev-password-input'); if (inp) inp.focus(); }, 100);
}

function hideDevLoginModal() {
    const modal = document.getElementById('dev-login-modal');
    if (!modal) return;
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    const inp = document.getElementById('dev-password-input');
    const err = document.getElementById('dev-password-error');
    if (inp) inp.value = '';
    if (err) err.textContent = '';
}

// ══════════════════════
//  Event Listeners
// ══════════════════════
function initEventListeners() {
    // Theme
    document.getElementById('theme-toggle-btn').addEventListener('click', toggleTheme);

    // Sidebar toggle (mobile + desktop hamburger)
    const toggleBtn = document.getElementById('mobile-sidebar-toggle-btn');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const sidebar   = document.getElementById('app-sidebar');
            const container = document.querySelector('.app-container');
            const isCollapsed = container.classList.contains('sidebar-collapsed');
            if (isCollapsed) {
                container.classList.remove('sidebar-collapsed');
                sidebar.classList.add('open');
            } else {
                container.classList.add('sidebar-collapsed');
                sidebar.classList.remove('open');
            }
        });
    }

    // Sidebar close button (✕ inside sidebar)
    const closeBtn = document.getElementById('sidebar-close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            document.getElementById('app-sidebar').classList.remove('open');
            document.querySelector('.app-container').classList.add('sidebar-collapsed');
        });
    }

    // Beranda
    const homeLink = document.getElementById('sidebar-home-link');
    if (homeLink) {
        homeLink.addEventListener('click', () => {
            activePlant = null; activeSubcat = null; activeTag = null; searchQuery = '';
            const inp = document.getElementById('search-input');
            const clr = document.getElementById('clear-search-btn');
            if (inp) inp.value = '';
            if (clr) clr.style.display = 'none';
            renderFilterChips();
            renderSidebar();
        });
    }

    // Search
    const searchInput = document.getElementById('search-input');
    const clearBtn    = document.getElementById('clear-search-btn');
    searchInput.addEventListener('input', e => {
        searchQuery = e.target.value.trim();
        clearBtn.style.display = searchQuery ? 'flex' : 'none';
        renderSidebar(); renderFilterChips();
    });
    clearBtn.addEventListener('click', () => {
        searchInput.value = ''; searchQuery = ''; clearBtn.style.display = 'none';
        searchInput.focus(); renderSidebar(); renderFilterChips();
    });

    // Popup buttons
    document.getElementById('info-popup-close-btn').addEventListener('click', () => closeInfoPopup());
    document.getElementById('popup-edit-btn').addEventListener('click', () => {
        if (activePage) window.location.hash = `#/edit/${activePage.slug}`;
    });
    document.getElementById('popup-delete-btn').addEventListener('click', () => {
        if (!activePage) return;
        if (activePage.slug === 'home') { showToast('Beranda tidak bisa dihapus!', 'error'); return; }
        showModal('Hapus Item?', `Yakin ingin menghapus "${activePage.title}"? Tindakan ini tidak dapat dibatalkan.`, () => {
            const slug = activePage.slug;
            closeInfoPopup();
            deletePage(slug);
        });
    });
    document.getElementById('popup-copy-link-btn').addEventListener('click', () => {
        if (!activePage) return;
        copyItemLink(activePage.slug);
    });

    // Like
    const likeBtn = document.getElementById('popup-like-btn');
    if (likeBtn) {
        likeBtn.addEventListener('click', () => {
            if (!activePage) return;
            const likedSlugs = getLikedSlugs();
            const idx = likedSlugs.indexOf(activePage.slug);
            if (idx === -1) {
                likedSlugs.push(activePage.slug);
                activePage.likesCount = (activePage.likesCount || 0) + 1;
                showToast('Tandai sering terdampak berhasil! 👍');
            } else {
                likedSlugs.splice(idx, 1);
                activePage.likesCount = Math.max(0, (activePage.likesCount || 0) - 1);
                showToast('Batal menandai sering terdampak.', 'info');
            }
            saveLikedSlugs(likedSlugs);
            savePages();
            likeBtn.classList.toggle('btn-liked', idx === -1);
            const countEl = document.getElementById('popup-like-count');
            if (countEl) countEl.textContent = activePage.likesCount || 0;
            renderSidebar();
        });
    }

    // Popup backdrop
    document.getElementById('info-popup').addEventListener('click', e => {
        if (e.target.id === 'info-popup') closeInfoPopup();
    });

    // Edit form
    document.getElementById('cancel-edit-btn').addEventListener('click', () => {
        window.location.hash = activePage ? `#/page/${activePage.slug}` : '#/page/home';
    });
    document.getElementById('save-page-btn').addEventListener('click', saveActivePage);

    ['edit-description','edit-symptoms','edit-treatment'].forEach(id => {
        const ta = document.getElementById(id);
        if (ta) ta.addEventListener('focus', () => { lastFocusedTextarea = ta; });
    });

    // ── Image Upload (Cloudinary) ──
    const imageFileInput = document.getElementById('edit-image-file');
    imageFileInput.addEventListener('change', async e => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) { showToast('Hanya file gambar yang diizinkan!', 'error'); return; }
        if (file.size > 10 * 1024 * 1024) { showToast('Ukuran foto maksimal 10MB!', 'error'); return; }

        const label = document.querySelector('label[for="edit-image-file"]');
        const origText = label ? label.innerHTML : '';
        if (label) { label.innerHTML = '⏳ Mengunggah...'; label.style.pointerEvents = 'none'; label.style.opacity = '0.7'; }

        try {
            const fd = new FormData();
            fd.append('file', file);
            fd.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
            fd.append('folder', 'agrolibrary');
            const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: fd });
            if (!res.ok) { const d = await res.json(); throw new Error(d.error?.message || 'Upload gagal'); }
            const data = await res.json();
            setImagePreview(data.secure_url);
            showToast('Foto berhasil diunggah ke cloud! ☁️');
        } catch (err) {
            console.error('Upload error:', err);
            showToast('Gagal unggah: ' + err.message, 'error');
        } finally {
            if (label) { label.innerHTML = origText; label.style.pointerEvents = ''; label.style.opacity = ''; }
            e.target.value = '';
        }
    });

    document.getElementById('edit-image-url').addEventListener('input', e => {
        const url = e.target.value.trim();
        if (url) setImagePreview(url);
        else if (!imageFileInput.files.length) clearImagePreview();
    });
    document.getElementById('btn-remove-image').addEventListener('click', clearImagePreview);

    // Toolbar
    document.querySelectorAll('.tool-btn').forEach(btn => btn.addEventListener('click', () => handleToolbar(btn.dataset.action)));

    // Export / Import
    document.getElementById('export-btn').addEventListener('click', exportData);
    document.getElementById('import-file').addEventListener('change', importData);

    // Confirm modal cancel
    document.getElementById('modal-cancel-btn').addEventListener('click', hideModal);

    // ── Developer Login ──
    const devLoginBtn = document.getElementById('dev-login-btn');
    if (devLoginBtn) {
        devLoginBtn.addEventListener('click', () => {
            if (isDeveloper) logoutDeveloper();
            else showDevLoginModal();
        });
    }

    const devLoginCancelBtn  = document.getElementById('dev-login-cancel-btn');
    const devLoginConfirmBtn = document.getElementById('dev-login-confirm-btn');
    const devPasswordInput   = document.getElementById('dev-password-input');

    if (devLoginCancelBtn) devLoginCancelBtn.addEventListener('click', hideDevLoginModal);
    if (devLoginConfirmBtn) {
        devLoginConfirmBtn.addEventListener('click', () => {
            const pw = devPasswordInput ? devPasswordInput.value : '';
            if (loginDeveloper(pw)) {
                hideDevLoginModal();
            } else {
                const err = document.getElementById('dev-password-error');
                if (err) err.textContent = '❌ Password salah!';
                if (devPasswordInput) devPasswordInput.value = '';
            }
        });
    }
    if (devPasswordInput) {
        devPasswordInput.addEventListener('keydown', e => {
            if (e.key === 'Enter' && devLoginConfirmBtn) devLoginConfirmBtn.click();
        });
    }
    const devLoginModal = document.getElementById('dev-login-modal');
    if (devLoginModal) {
        devLoginModal.addEventListener('click', e => { if (e.target === devLoginModal) hideDevLoginModal(); });
    }
}

// ── Toolbar ──
function handleToolbar(action) {
    const ta  = lastFocusedTextarea || document.getElementById('edit-description');
    const s   = ta.selectionStart, e = ta.selectionEnd, text = ta.value, sel = text.substring(s, e);
    let pre = '', suf = '', ph = '';
    switch (action) {
        case 'bold':    pre = '**'; suf = '**'; ph = 'tebal';      break;
        case 'italic':  pre = '*';  suf = '*';  ph = 'miring';     break;
        case 'h2':      pre = '## ';            ph = 'Heading';    break;
        case 'h3':      pre = '### ';           ph = 'Sub-heading';break;
        case 'link':    pre = '[';  suf = '](url)'; ph = 'teks';   break;
        case 'list-ul': pre = '- ';             ph = 'item';       break;
    }
    const ins = sel || ph;
    ta.value = text.substring(0, s) + pre + ins + suf + text.substring(e);
    ta.focus();
    ta.setSelectionRange(s + pre.length, s + pre.length + ins.length);
}

// ── Modal ──
function showModal(title, body, onConfirm) {
    const m = document.getElementById('confirm-modal');
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').textContent  = body;
    const btn   = document.getElementById('modal-confirm-btn');
    const clone = btn.cloneNode(true);
    btn.parentNode.replaceChild(clone, btn);
    clone.addEventListener('click', () => { onConfirm(); hideModal(); });
    m.classList.add('show');
    m.setAttribute('aria-hidden', 'false');
}
function hideModal() {
    const m = document.getElementById('confirm-modal');
    m.classList.remove('show');
    m.setAttribute('aria-hidden', 'true');
}

// ── Copy Item Link ──
function copyItemLink(slug) {
    const url = `${window.location.origin}${window.location.pathname}#/page/${slug}`;

    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(url)
            .then(() => showToast('Link disalin! Siap dibuat QR Code 📋'))
            .catch(() => fallbackCopyLink(url));
    } else {
        fallbackCopyLink(url);
    }
}

function fallbackCopyLink(url) {
    const tempInput = document.createElement('textarea');
    tempInput.value = url;
    tempInput.style.position = 'fixed';
    tempInput.style.opacity = '0';
    document.body.appendChild(tempInput);
    tempInput.select();
    tempInput.setSelectionRange(0, 99999);
    try {
        document.execCommand('copy');
        showToast('Link disalin! Siap dibuat QR Code 📋');
    } catch {
        showToast('Gagal menyalin otomatis. Link: ' + url, 'error');
    }
    document.body.removeChild(tempInput);
}

// ── Toast ──
function showToast(msg, type = 'success') {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.className = 'toast-notification toast-' + type + ' show';
    setTimeout(() => t.classList.remove('show'), 3000);
}

// ── Export / Import ──
function exportData() {
    const a = document.createElement('a');
    a.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(pages, null, 2));
    a.download = `agrolibrary-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    showToast('Data diekspor! 📥');
}
async function importData(ev) {
    const f = ev.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = async e => {
        try {
            const d = JSON.parse(e.target.result);
            if (Array.isArray(d) && d.length && d[0].slug) {
                pages = d; migratePages();
                await savePages();
                showToast('Data diimpor! 🔄');
                handleRoute();
            } else showToast('File JSON tidak valid.', 'error');
        } catch { showToast('Gagal membaca file.', 'error'); }
    };
    r.readAsText(f);
    ev.target.value = '';
}

function getLikedSlugs() {
    try { const raw = localStorage.getItem('agro_liked_slugs'); return raw ? JSON.parse(raw) : []; }
    catch { return []; }
}
function saveLikedSlugs(slugs) {
    localStorage.setItem('agro_liked_slugs', JSON.stringify(slugs));
}
