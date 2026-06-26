// ═══════════════════════════════════════════
//  AgroLibrary — Main Application Logic
//  Versi: Firebase Firestore + Cloudinary
// ═══════════════════════════════════════════

//  Firebase Config
// Ambil dari: Firebase Console → Project Settings → Your Apps → SDK setup
const FirebaseConfig = {
  apiKey: "AIzaSyDiNaDyY6ekYp97g_pGlnwdmPLXQHRfe0k",
  authDomain: "agrolibrary-d35e6.firebaseapp.com",
  projectId: "agrolibrary-d35e6",
  storageBucket: "agrolibrary-d35e6.firebasestorage.app",
  messagingSenderId: "329766319260",
  appId: "1:329766319260:web:5e8005b1db4ba981562959",
  measurementId: "G-9F129CE5MR"
};

//  Cloudinary Config
// Cloud Name sudah diketahui dari screenshot kamu
const CLOUDINARY_CLOUD_NAME    = 'dbirucziq';
const CLOUDINARY_UPLOAD_PRESET = 'AgroLibrary'; // dari Settings → Upload → Upload Presets

// ╔══════════════════════════════════════════════╗
// ║  Selesai — tidak perlu ubah di bawah ini     ║
// ╚══════════════════════════════════════════════╝

// ── FIREBASE INIT ──
firebase.initializeApp(FirebaseConfig);
const db = firebase.firestore();
const PAGES_DOC = db.collection('agrolibrary').doc('pages');

const STORAGE_KEYS = {
    THEME: 'AGROLIBRARY_THEME'
};

// ── DEFAULT DATA ──
const DEFAULT_PAGES = [
    {
        slug: 'home',
        title: 'Beranda',
        category: 'Umum',
        image: '',
        description: `Selamat datang di **AgroLibrary** 🌾, pustaka digital pertanian modern Anda!

### 💡 Cara Menggunakan

1. **Jelajahi Sidebar** — Semua data dikelompokkan berdasarkan kategori (Penyakit, Hama, Tanaman, dll.)
2. **Pencarian Instan** — Ketik nama penyakit, gejala, atau penyebab di kotak pencarian
3. **Tambah Data Baru** — Klik tombol **"Tambah Item Baru"**, isi form terstruktur, lalu simpan
4. **Unggah Foto** — Setiap item mendukung unggah foto dari perangkat atau URL gambar
5. **Sinkron Otomatis** — Data tersimpan di cloud, bisa diakses dari perangkat mana saja!

> Data tersimpan di Firebase Cloud — tersinkron otomatis di semua perangkat secara real-time!

*Mulailah dengan menjelajahi contoh data di sidebar kiri.*`,
        symptoms: '',
        treatment: '',
        updatedAt: new Date().toISOString(),
        viewCount: 0,
        likesCount: 0
    },
    {
        slug: 'layu-bakteri',
        title: 'Layu Bakteri',
        category: 'Penyakit',
        image: '',
        description: `**Layu Bakteri** disebabkan oleh bakteri *Ralstonia solanacearum*, salah satu penyakit paling merusak pada tanaman hortikultura di wilayah tropis.

Bakteri ini hidup di dalam tanah dan menyerang sistem perakaran, menyumbat pembuluh xilem (pengangkut air) sehingga pasokan air ke daun dan batang terhambat.

Penyebarannya sangat cepat melalui air irigasi, alat pertanian, atau tanah yang terbawa alas kaki.`,
        symptoms: `- **Layu mendadak** — daun muda layu tiba-tiba saat cuaca panas, kadang pulih di pagi hari
- **Daun tetap hijau** saat layu (berbeda dengan Fusarium yang menguning dulu)
- **Batang berwarna cokelat** jika dipotong melintang di bagian bawah
- **Lendir bakteri (ooze)** — celupkan potongan batang ke air bersih, akan keluar lendir putih susu`,
        treatment: `1. **Cabut & musnahkan** tanaman terinfeksi segera (bakar/kubur jauh dari lahan)
2. **Gunakan varietas tahan** — pilih benih yang resisten terhadap layu bakteri
3. **Aplikasi agens hayati** — *Pseudomonas fluorescens* atau *Trichoderma harzianum*
4. **Rotasi tanaman** — ganti dengan tanaman non-inang selama 2-3 tahun
5. **Solarisasi tanah** — tutup bedengan dengan mulsa plastik sebelum tanam`,
        updatedAt: new Date().toISOString(),
        viewCount: 0,
        likesCount: 0
    },
    {
        slug: 'wereng-coklat',
        title: 'Wereng Batang Coklat',
        category: 'Hama',
        image: '',
        description: `**Wereng Batang Coklat** (WBC / *Nilaparvata lugens*) adalah hama paling berbahaya bagi pertanaman padi di Asia.

Serangga kecil penghisap cairan ini menyerang secara koloni dalam jumlah ribuan. Selain kerusakan langsung, WBC juga merupakan vektor penular virus **Kerdil Rumput** dan **Kerdil Hampa** yang menyebabkan gagal panen total (puso).`,
        symptoms: `- **Serangga kecil** (2-4 mm) berwarna cokelat kemerahan, menetap di pangkal batang dekat air
- **Hopperburn** — daun menguning lalu mengering berwarna cokelat jerami secara melingkar
- **Embun jelaga** — jelaga hitam di bawah daun akibat jamur pada honeydew wereng`,
        treatment: `1. **Jajar legowo** (2:1 atau 4:1) untuk sirkulasi udara yang baik
2. **Tanam serempak** dalam satu wilayah dan rotasi varietas tahan wereng (Inpari 30/33)
3. **Lestarikan musuh alami** — laba-laba, kumbang koksinel, kepik *Cyrtorhinus*
4. **Pengairan berselang** — keringkan lahan berkala, hindari genangan terus-menerus
5. **Insektisida selektif** jika populasi > 15 ekor/rumpun (gunakan *pymetrozine* atau *imidacloprid*)`,
        updatedAt: new Date().toISOString(),
        viewCount: 0,
        likesCount: 0
    },
    {
        slug: 'tanaman-padi',
        title: 'Padi (Oryza sativa)',
        category: 'Tanaman',
        image: '',
        description: `**Padi** (*Oryza sativa*) adalah komoditas terpenting Indonesia, menghasilkan beras sebagai makanan pokok mayoritas penduduk.

Termasuk tanaman monokotil dari keluarga *Poaceae*. Memerlukan air melimpah (padi sawah) atau hujan teratur (padi gogo). Tumbuh optimal di iklim tropis basah dengan penyinaran penuh.`,
        symptoms: `Karakteristik tanaman padi sehat:
- **Akar serabut** — lebat, berwarna putih bersih
- **Batang** — bulat berongga, beruas-ruas, diselimuti pelepah daun
- **Daun** — pita memanjang, urat sejajar, bulu halus di permukaan
- **Malai** — tangkai bulir menggantung, sekam kuning keemasan saat matang`,
        treatment: `1. **Persemaian** — benih daya tumbuh > 90%, rendam 24 jam, peram 24 jam, semai 15-21 hari
2. **Olah tanah** — bajak 2x, genangi hingga melumpur sempurna
3. **Pupuk berimbang** — organik + makro (Urea, SP-36, KCl) dalam 3 tahap
4. **Manajemen air** — irigasi berselang, genangi 3-5 cm awal tanam, keringkan lahan 10 hari sebelum panen
5. **Penyiangan** — manual/gosrok pada 20 HST dan 40 HST`,
        updatedAt: new Date().toISOString(),
        viewCount: 0,
        likesCount: 0
    }
];

// ── STATE ──
let pages = [];
let activePage = null;
let activeTag = null;
let searchQuery = '';
let currentImageData = '';
let lastFocusedTextarea = null;
let unsubscribeListener = null;

// ── INIT ──
document.addEventListener('DOMContentLoaded', async () => {
    initTheme();
    showAppLoading(true);
    await loadPages();
    setupRealtimeSync();
    initEventListeners();
    window.addEventListener('hashchange', handleRoute);
    handleRoute();
    showAppLoading(false);
});

// ── LOADING STATE ──
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
                justify-content:center;z-index:9999;gap:16px;
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

// ── THEME ──
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
            // Cek apakah ada data lama di localStorage untuk migrasi
            const raw = localStorage.getItem('AGROLIBRARY_PAGES') || localStorage.getItem('WIKIMAJOR_PAGES');
            if (raw) {
                try {
                    pages = JSON.parse(raw);
                    migratePages();
                    await savePages(); // Upload data lama ke Firestore
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
        // Fallback ke localStorage jika Firebase gagal
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
        // Fallback ke localStorage
        localStorage.setItem('AGROLIBRARY_PAGES', JSON.stringify(pages));
        showToast('⚠️ Tersimpan offline saja (cek koneksi)', 'error');
    }
}

// ── REAL-TIME SYNC ──
// Mendengarkan perubahan dari device lain secara otomatis
function setupRealtimeSync() {
    if (unsubscribeListener) unsubscribeListener(); // Hapus listener lama

    unsubscribeListener = PAGES_DOC.onSnapshot(snapshot => {
        if (snapshot.exists && snapshot.data().data) {
            const newPages = snapshot.data().data;
            // Hanya update jika data benar-benar berbeda
            if (JSON.stringify(newPages) !== JSON.stringify(pages)) {
                pages = newPages;
                migratePages();
                renderSidebar();
                showToast('🔄 Data diperbarui dari perangkat lain', 'info');
            }
        }
    }, err => {
        console.error('Listener error:', err);
    });
}

function migratePages() {
    pages.forEach(p => {
        if (!p.description) p.description = p.content || '';
        if (!p.category) p.category = (p.tags && p.tags[0]) ? capitalize(p.tags[0]) : 'Umum';
        if (!p.symptoms) p.symptoms = '';
        if (!p.treatment) p.treatment = '';
        if (!p.image) p.image = '';
        if (typeof p.viewCount !== 'number') p.viewCount = 0;
        if (typeof p.likesCount !== 'number') p.likesCount = 0;
    });
}

// ── ROUTER ──
function handleRoute() {
    document.getElementById('app-sidebar').classList.remove('open');
    const hash = window.location.hash || '#/page/home';

    if (hash.startsWith('#/page/')) showViewMode(hash.replace('#/page/', ''));
    else if (hash.startsWith('#/edit/')) showEditMode(hash.replace('#/edit/', ''));
    else if (hash.startsWith('#/new')) { const p = new URLSearchParams(hash.substring(hash.indexOf('?'))); showEditMode(null, p.get('title') || ''); }
    else window.location.hash = '#/page/home';

    renderSidebar();
}

// ══════════════════════
//  VIEW MODE
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

    const titleEl = document.getElementById('view-page-title');
    const statsEl = document.getElementById('view-page-stats');
    const breadcrumbsEl = document.getElementById('page-breadcrumbs');

    if (activeTag) {
        titleEl.textContent = `Kategori: ${activeTag}`;
        breadcrumbsEl.innerHTML = `AgroLibrary &gt; Kategori &gt; <span>${activeTag}</span>`;
    } else if (searchQuery) {
        titleEl.textContent = `Hasil Pencarian`;
        breadcrumbsEl.innerHTML = `AgroLibrary &gt; <span>Pencarian</span>`;
    } else {
        titleEl.textContent = `Pustaka Agro`;
        breadcrumbsEl.innerHTML = `AgroLibrary &gt; <span>Semua</span>`;
    }

    const visibleCount = document.querySelectorAll('.info-card').length;
    statsEl.textContent = `Menampilkan ${visibleCount} item`;

    if (page && slug !== 'home') {
        activePage = page;
        showInfoPopup(page);
    } else {
        closeInfoPopup(false);
    }
}

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
        return match && (!activeTag || p.category === activeTag);
    });

    const container = document.querySelector('.cards-grid-container');
    const oldBanner = container.querySelector('.home-hero-section');
    if (oldBanner) oldBanner.remove();

    if (!activeTag && !searchQuery) {
        const allItems = pages.filter(p => p.slug !== 'home');
        const totalItems = allItems.length;
        const categories = [...new Set(allItems.map(p => p.category))];
        const itemsWithPhoto = allItems.filter(p => p.image).length;

        const byDate = [...allItems].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        const byViews = [...allItems].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
        const diseaseItems = [...allItems]
            .filter(p => ['penyakit', 'hama'].includes((p.category || '').toLowerCase()))
            .sort((a, b) => {
                const diff = (b.likesCount || 0) - (a.likesCount || 0);
                if (diff !== 0) return diff;
                return (b.viewCount || 0) - (a.viewCount || 0);
            });

        const banner = document.createElement('div');
        banner.className = 'home-hero-section';
        banner.innerHTML = `
            <div class="home-hero-top">
                <div class="home-hero-badge">🌾 AgroLibrary</div>
                <h2 class="home-hero-headline">Ensiklopedia Pertanian<br><span class="home-hero-accent">Cerdas &amp; Lengkap</span></h2>
                <p class="home-hero-sub">Temukan, identifikasi, dan atasi masalah tanaman dengan mudah — didukung foto visual, sistem kategori, dan pencarian instan berbasis data.</p>
                <div class="home-hero-stats">
                    <div class="home-stat-pill">
                        <span class="home-stat-num">${totalItems}</span>
                        <span class="home-stat-label">Item Terdaftar</span>
                    </div>
                    <div class="home-stat-divider"></div>
                    <div class="home-stat-pill">
                        <span class="home-stat-num">${categories.length}</span>
                        <span class="home-stat-label">Kategori</span>
                    </div>
                    <div class="home-stat-divider"></div>
                    <div class="home-stat-pill">
                        <span class="home-stat-num">${itemsWithPhoto}</span>
                        <span class="home-stat-label">Ada Foto</span>
                    </div>
                </div>
            </div>

            <div class="home-section-header">
                <div class="home-section-title-wrap">
                    <span class="home-section-icon">⚡</span>
                    <h3 class="home-section-title">Fitur Unggulan</h3>
                </div>
                <p class="home-section-subtitle">Mengapa AgroLibrary menjadi pilihan tepat untuk pengelolaan informasi pertanian Anda</p>
            </div>
            <div class="home-features-desc-grid">
                <div class="feat-desc-item">
                    <div class="feat-desc-icon feat-desc-amber">🗂️</div>
                    <h4 class="feat-desc-title">Sistem Kategorisasi</h4>
                    <p class="feat-desc-body">Seluruh data diorganisir secara sistematis dalam kategori <strong>Penyakit, Hama, Tanaman,</strong> dan kategori lainnya.</p>
                </div>
                <div class="feat-desc-item">
                    <div class="feat-desc-icon feat-desc-teal">🔍</div>
                    <h4 class="feat-desc-title">Pencarian Real-Time</h4>
                    <p class="feat-desc-body">Mesin pencari internal menelusuri <strong>judul, penyebab, gejala, dan cara penanganan</strong> secara bersamaan.</p>
                </div>
                <div class="feat-desc-item">
                    <div class="feat-desc-icon feat-desc-green">📸</div>
                    <h4 class="feat-desc-title">Foto di Cloud</h4>
                    <p class="feat-desc-body">Foto disimpan di <strong>Cloudinary</strong> — tersedia di semua perangkat tanpa batas ukuran storage browser.</p>
                </div>
                <div class="feat-desc-item">
                    <div class="feat-desc-icon feat-desc-blue">🔄</div>
                    <h4 class="feat-desc-title">Sinkron Otomatis</h4>
                    <p class="feat-desc-body">Data tersimpan di <strong>Firebase Cloud</strong> dan tersinkron otomatis di semua perangkat secara real-time.</p>
                </div>
            </div>

            ${byDate.length > 0 ? `
            <div class="home-section-header">
                <div class="home-section-title-wrap">
                    <span class="home-section-icon">📅</span>
                    <h3 class="home-section-title">Konten Terbaru</h3>
                </div>
                <p class="home-section-subtitle">Item yang baru ditambahkan atau diperbarui</p>
            </div>
            <div class="home-row-scroll" id="row-terbaru">
                ${byDate.slice(0, 8).map(p => buildRowCard(p)).join('')}
            </div>` : ''}

            ${byViews.filter(p => (p.viewCount || 0) > 0).length > 0 ? `
            <div class="home-section-header">
                <div class="home-section-title-wrap">
                    <span class="home-section-icon">🔥</span>
                    <h3 class="home-section-title">Paling Banyak Dicari</h3>
                </div>
                <p class="home-section-subtitle">Item yang paling sering dibuka dan dilihat</p>
            </div>
            <div class="home-row-scroll" id="row-dicari">
                ${byViews.slice(0, 8).map(p => buildRowCard(p, 'views')).join('')}
            </div>` : ''}

            ${diseaseItems.length > 0 ? `
            <div class="home-section-header">
                <div class="home-section-title-wrap">
                    <span class="home-section-icon">🦠</span>
                    <h3 class="home-section-title">Paling Sering Terdampak</h3>
                </div>
                <p class="home-section-subtitle">Penyakit dan hama yang paling banyak menjangkiti tanaman</p>
            </div>
            <div class="home-row-scroll" id="row-terdampak">
                ${diseaseItems.slice(0, 8).map(p => buildRowCard(p, 'disease')).join('')}
            </div>` : ''}

            <div class="home-all-items-header">
                <div class="home-section-title-wrap">
                    <span class="home-section-icon">📚</span>
                    <h3 class="home-section-title">Semua Item</h3>
                </div>
                <span class="home-all-items-count">${totalItems} item terdaftar</span>
            </div>
        `;

        banner.querySelectorAll('.home-row-card').forEach(card => {
            card.addEventListener('click', () => {
                const slug = card.dataset.slug;
                if (slug) window.location.hash = `#/page/${slug}`;
            });
        });

        container.insertBefore(banner, grid);
    }

    if (!filtered.length) {
        grid.innerHTML = `<div class="sidebar-empty" style="grid-column: 1/-1; text-align: center; padding: 40px 0; font-size: 1rem;">Tidak ada kartu informasi ditemukan</div>`;
        return;
    }

    filtered.forEach((p, idx) => {
        const card = document.createElement('article');
        card.className = 'info-card';
        card.style.animationDelay = `${idx * 0.05}s`;

        const catClass = `category-${slugify(p.category || 'umum')}`;

        let imageHtml = '';
        if (p.image) {
            imageHtml = `<img src="${p.image}" alt="${p.title}" loading="lazy">`;
        } else {
            imageHtml = `<div class="info-card-placeholder">🌿</div>`;
        }

        const descSnippet = p.description ? parseMarkdown(p.description) : '';
        const symptomsSnippet = p.symptoms ? parseMarkdown(p.symptoms) : '';
        const treatmentSnippet = p.treatment ? parseMarkdown(p.treatment) : '';

        card.innerHTML = `
            <span class="info-card-badge ${catClass}">${p.category || 'Umum'}</span>
            <div class="info-card-image" onclick="window.location.hash = '#/page/${p.slug}'">
                ${imageHtml}
            </div>
            <div class="info-card-body" onclick="window.location.hash = '#/page/${p.slug}'">
                <h3 class="info-card-title">${p.title}</h3>
                <div class="card-info-section card-info-desc">
                    <span class="card-info-section-title">📝 Penyebab</span>
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
                <button class="btn btn-outline btn-card-view" onclick="window.location.hash = '#/page/${p.slug}'">👁️ Lihat</button>
                <button class="btn btn-outline btn-card-edit" onclick="window.location.hash = '#/edit/${p.slug}'">✏️ Edit</button>
                <button class="btn btn-danger btn-card-delete" data-slug="${p.slug}">🗑️</button>
            </div>
        `;

        card.querySelector('.btn-card-delete').addEventListener('click', (e) => {
            e.stopPropagation();
            const slug = e.currentTarget.dataset.slug;
            const targetPage = pages.find(page => page.slug === slug);
            if (targetPage) {
                showModal('Hapus Item?', `Yakin ingin menghapus "${targetPage.title}"? Tindakan ini tidak dapat dibatalkan.`, () => deletePage(slug));
            }
        });

        grid.appendChild(card);
    });
}

// ── BUILD ROW CARD ──
function buildRowCard(p, variant = '') {
    const catClass = `category-${slugify(p.category || 'umum')}`;
    const imgHtml = p.image
        ? `<div class="row-card-img" style="background-image:url('${p.image}')"></div>`
        : `<div class="row-card-img row-card-img-placeholder"><span>${getCategoryEmoji(p.category)}</span></div>`;

    const metaHtml = variant === 'views'
        ? `<span class="row-card-meta">👁 ${p.viewCount || 0} kali dilihat</span>`
        : variant === 'disease'
            ? `<span class="row-card-meta row-card-meta-danger">👍 Terdampak: ${p.likesCount || 0}</span>`
            : `<span class="row-card-meta">🕐 ${formatDate(p.updatedAt)}</span>`;

    const snippet = (p.description || '').replace(/[#*_`\[\]]/g, '').substring(0, 80) + '...';

    return `
        <div class="home-row-card" data-slug="${p.slug}" title="${p.title}">
            ${imgHtml}
            <div class="row-card-body">
                <span class="row-card-badge ${catClass}">${p.category || 'Umum'}</span>
                <h4 class="row-card-title">${p.title}</h4>
                <p class="row-card-snippet">${snippet}</p>
                ${metaHtml}
            </div>
        </div>
    `;
}

function getCategoryEmoji(cat) {
    const map = { 'Penyakit': '🦠', 'Hama': '🐛', 'Tanaman': '🌱', 'Umum': '📋' };
    return map[cat] || '🌿';
}

function showInfoPopup(page) {
    const popup = document.getElementById('info-popup');
    if (!popup) return;

    const catEl = document.getElementById('popup-category');
    const dateEl = document.getElementById('popup-date');
    const titleEl = document.getElementById('popup-title');
    const bodyEl = document.getElementById('popup-body');

    catEl.textContent = page.category || 'Umum';
    catEl.className = `info-popup-category category-${slugify(page.category || 'umum')}`;
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
        <h3 class="article-section-title"><span class="section-icon">📝</span> Penyebab</h3>
        <div class="markdown-body">${parseMarkdown(page.description || '')}</div>
    `;
    bodyEl.appendChild(descSection);

    if (page.symptoms && page.symptoms.trim()) {
        const symptomsSection = document.createElement('div');
        symptomsSection.className = 'article-section section-symptoms';
        symptomsSection.innerHTML = `
            <h3 class="article-section-title"><span class="section-icon">⚠️</span> Ciri-Ciri / Gejala</h3>
            <div class="markdown-body">${parseMarkdown(page.symptoms)}</div>
        `;
        bodyEl.appendChild(symptomsSection);
    }

    if (page.treatment && page.treatment.trim()) {
        const treatmentSection = document.createElement('div');
        treatmentSection.className = 'article-section section-treatment';
        treatmentSection.innerHTML = `
            <h3 class="article-section-title"><span class="section-icon">✅</span> Cara Penanggulangan</h3>
            <div class="markdown-body">${parseMarkdown(page.treatment)}</div>
        `;
        bodyEl.appendChild(treatmentSection);
    }

    if (page.slug !== 'home') {
        page.viewCount = (page.viewCount || 0) + 1;
        savePages();
    }

    const likeBtn = document.getElementById('popup-like-btn');
    if (likeBtn) {
        const likedSlugs = getLikedSlugs();
        const hasLiked = likedSlugs.includes(page.slug);
        if (hasLiked) likeBtn.classList.add('btn-liked');
        else likeBtn.classList.remove('btn-liked');
        const likeCountEl = document.getElementById('popup-like-count');
        if (likeCountEl) likeCountEl.textContent = page.likesCount || 0;
    }

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
//  EDIT MODE
// ══════════════════════
function showEditMode(slug = null, prefill = '') {
    closeInfoPopup(false);
    document.getElementById('view-mode').style.display = 'none';
    document.getElementById('edit-mode').style.display = 'flex';

    const el = id => document.getElementById(id);
    el('title-error').textContent = '';
    populateCategorySuggestions();

    if (slug) {
        const page = pages.find(p => p.slug === slug);
        if (!page) { window.location.hash = '#/page/home'; return; }
        activePage = page;
        el('edit-view-title').textContent = `Sunting: ${page.title}`;
        el('edit-title').value = page.title;
        el('edit-category').value = page.category || '';
        page.image ? setImagePreview(page.image) : clearImagePreview();
        el('edit-description').value = page.description || page.content || '';
        el('edit-symptoms').value = page.symptoms || '';
        el('edit-treatment').value = page.treatment || '';
        el('edit-breadcrumbs').innerHTML = `AgroLibrary &gt; Edit &gt; <span>${page.title}</span>`;
    } else {
        activePage = null;
        el('edit-view-title').textContent = 'Tambah Item Baru';
        el('edit-title').value = prefill;
        el('edit-category').value = '';
        clearImagePreview();
        el('edit-description').value = '';
        el('edit-symptoms').value = '';
        el('edit-treatment').value = '';
        el('edit-breadcrumbs').innerHTML = `AgroLibrary &gt; <span>Tambah Item Baru</span>`;
    }
    lastFocusedTextarea = el('edit-description');
}

async function saveActivePage() {
    const el = id => document.getElementById(id);
    const title = el('edit-title').value.trim();
    let category = el('edit-category').value.trim();
    const description = el('edit-description').value;
    const symptoms = el('edit-symptoms').value;
    const treatment = el('edit-treatment').value;

    if (!category) category = 'Umum';
    else category = capitalize(category);

    if (!title) { el('title-error').textContent = 'Nama item tidak boleh kosong!'; el('edit-title').focus(); return; }

    const newSlug = slugify(title);
    const conflict = pages.find(p => p.slug === newSlug && (!activePage || activePage.slug !== p.slug));
    if (conflict) { el('title-error').textContent = 'Nama ini sudah digunakan!'; el('edit-title').focus(); return; }

    if (activePage) {
        activePage.title = title;
        activePage.slug = newSlug;
        activePage.category = category;
        activePage.image = currentImageData;
        activePage.description = description;
        activePage.content = description;
        activePage.symptoms = symptoms;
        activePage.treatment = treatment;
        activePage.updatedAt = new Date().toISOString();
        showToast('Data berhasil disimpan! 💾');
    } else {
        pages.push({
            slug: newSlug, title, category,
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
//  SIDEBAR
// ══════════════════════
function renderSidebar() {
    const homeLink = document.getElementById('sidebar-home-link');
    if (homeLink) {
        const hash = window.location.hash || '#/page/home';
        if (hash === '#/page/home') homeLink.classList.add('active');
        else homeLink.classList.remove('active');
    }

    const cats = {};
    pages.filter(p => p.slug !== 'home').forEach(p => { const c = p.category || 'Umum'; cats[c] = (cats[c] || 0) + 1; });

    const tagsDiv = document.getElementById('sidebar-tags');
    tagsDiv.innerHTML = '';

    const allBadge = document.createElement('span');
    allBadge.className = 'tag-badge' + (!activeTag ? ' active' : '');
    allBadge.textContent = `Semua (${pages.filter(p => p.slug !== 'home').length})`;
    allBadge.onclick = () => { activeTag = null; renderSidebar(); };
    tagsDiv.appendChild(allBadge);

    Object.keys(cats).sort().forEach(cat => {
        const b = document.createElement('span');
        b.className = `tag-badge tag-category-${slugify(cat)}` + (activeTag === cat ? ' active' : '');
        b.textContent = `${cat} (${cats[cat]})`;
        b.onclick = () => { activeTag = activeTag === cat ? null : cat; renderSidebar(); };
        tagsDiv.appendChild(b);
    });

    const list = document.getElementById('sidebar-page-list');
    list.innerHTML = '';

    const filtered = pages.filter(p => {
        if (p.slug === 'home') return false;
        const q = searchQuery.toLowerCase();
        const match = !q || p.title.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q)
            || (p.symptoms || '').toLowerCase().includes(q) || (p.treatment || '').toLowerCase().includes(q);
        return match && (!activeTag || p.category === activeTag);
    });

    if (!filtered.length) { list.innerHTML = `<li class="sidebar-empty">Tidak ada item ditemukan</li>`; renderCardsGrid(); return; }

    const groups = {};
    filtered.forEach(p => { const c = p.category || 'Umum'; (groups[c] = groups[c] || []).push(p); });

    Object.keys(groups).sort((a, b) => a === 'Umum' ? 1 : b === 'Umum' ? -1 : a.localeCompare(b)).forEach(cat => {
        const hdr = document.createElement('li');
        hdr.className = 'sidebar-group-header';
        hdr.innerHTML = `<span>${cat}</span><span class="group-header-count">${groups[cat].length}</span>`;
        list.appendChild(hdr);

        groups[cat].sort((a, b) => a.title.localeCompare(b.title)).forEach(p => {
            const li = document.createElement('li');
            li.className = 'page-item';
            const a = document.createElement('a');
            a.href = `#/page/${p.slug}`;
            a.className = 'page-link' + (activePage && activePage.slug === p.slug ? ' active' : '');

            const icon = cat.toLowerCase() === 'penyakit' ? '🦠' :
                cat.toLowerCase() === 'hama' ? '🐛' :
                    cat.toLowerCase() === 'tanaman' ? '🌱' :
                        cat.toLowerCase() === 'pupuk' ? '🧪' : '📄';

            a.innerHTML = `<span class="page-link-icon">${icon}</span><span class="page-link-text">${p.title}</span>`;
            li.appendChild(a);
            list.appendChild(li);
        });
    });
    renderCardsGrid();
}

// ── IMAGE HELPERS ──
function setImagePreview(src) {
    currentImageData = src;
    document.getElementById('edit-image-preview').src = src;
    document.getElementById('edit-image-preview-container').style.display = 'block';
    if (!src.startsWith('data:')) document.getElementById('edit-image-url').value = src;
}
function clearImagePreview() {
    currentImageData = '';
    document.getElementById('edit-image-file').value = '';
    document.getElementById('edit-image-url').value = '';
    document.getElementById('edit-image-preview-container').style.display = 'none';
    document.getElementById('edit-image-preview').src = '';
}

function populateCategorySuggestions() {
    const list = document.getElementById('category-suggestions');
    if (!list) return;
    list.innerHTML = '';
    const cats = new Set(['Penyakit', 'Hama', 'Tanaman', 'Pupuk', 'Budidaya']);
    pages.forEach(p => { if (p.category) cats.add(p.category); });
    cats.forEach(c => { const o = document.createElement('option'); o.value = c; list.appendChild(o); });
}

// ── TOC ──
function generateToC(el) {
    const toc = document.getElementById('toc-list-container');
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
//  MARKDOWN PARSER
// ══════════════════════
function parseMarkdown(text) {
    if (!text) return '';
    let html = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const codeBlocks = [];
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => { codeBlocks.push({ lang, code: code.trim() }); return `\n@@CB${codeBlocks.length - 1}@@\n`; });
    const inlineCodes = [];
    html = html.replace(/`([^`\n]+)`/g, (_, code) => { inlineCodes.push(code); return `@@IC${inlineCodes.length - 1}@@`; });

    const lines = html.split('\n'), out = [];
    let inList = false, listType = null;

    function closeList() { if (inList) { out.push(`</${listType}>`); inList = false; listType = null; } }

    for (const line of lines) {
        const t = line.trim();
        if (/^@@CB\d+@@$/.test(t)) { closeList(); const b = codeBlocks[+t.match(/\d+/)[0]]; out.push(`<pre><code class="language-${b.lang || 'text'}">${b.code}</code></pre>`); continue; }
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

// ── UTILITIES ──
function slugify(t) { return t.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-'); }
function formatDate(iso) {
    const d = new Date(iso);
    const m = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    return `${d.getDate()} ${m[d.getMonth()]} ${d.getFullYear()}, ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}
function capitalize(s) { return s ? s[0].toUpperCase() + s.slice(1) : ''; }

// ══════════════════════
//  EVENT LISTENERS
// ══════════════════════
function initEventListeners() {
    document.getElementById('theme-toggle-btn').addEventListener('click', toggleTheme);
    document.getElementById('mobile-sidebar-toggle-btn').addEventListener('click', () => document.getElementById('app-sidebar').classList.toggle('open'));

    const homeLink = document.getElementById('sidebar-home-link');
    if (homeLink) {
        homeLink.addEventListener('click', () => {
            activeTag = null;
            searchQuery = '';
            const searchInput = document.getElementById('search-input');
            if (searchInput) searchInput.value = '';
            const clearBtn = document.getElementById('clear-search-btn');
            if (clearBtn) clearBtn.style.display = 'none';
        });
    }

    const searchInput = document.getElementById('search-input');
    const clearBtn = document.getElementById('clear-search-btn');
    searchInput.addEventListener('input', e => {
        searchQuery = e.target.value.trim();
        clearBtn.style.display = searchQuery ? 'flex' : 'none';
        renderSidebar();
    });
    clearBtn.addEventListener('click', () => { searchInput.value = ''; searchQuery = ''; clearBtn.style.display = 'none'; searchInput.focus(); renderSidebar(); });

    document.getElementById('info-popup-close-btn').addEventListener('click', () => closeInfoPopup());
    document.getElementById('popup-edit-btn').addEventListener('click', () => { if (activePage) window.location.hash = `#/edit/${activePage.slug}`; });
    document.getElementById('popup-delete-btn').addEventListener('click', () => {
        if (!activePage) return;
        if (activePage.slug === 'home') { showToast('Beranda tidak bisa dihapus!', 'error'); return; }
        showModal('Hapus Item?', `Yakin ingin menghapus "${activePage.title}"? Tindakan ini tidak dapat dibatalkan.`, () => {
            deletePage(activePage.slug);
            closeInfoPopup();
        });
    });

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

    document.getElementById('info-popup').addEventListener('click', e => {
        if (e.target.id === 'info-popup') closeInfoPopup();
    });

    document.getElementById('cancel-edit-btn').addEventListener('click', () => {
        window.location.hash = activePage ? `#/page/${activePage.slug}` : '#/page/home';
    });
    document.getElementById('save-page-btn').addEventListener('click', saveActivePage);

    ['edit-description', 'edit-symptoms', 'edit-treatment'].forEach(id => {
        const ta = document.getElementById(id);
        if (ta) ta.addEventListener('focus', () => { lastFocusedTextarea = ta; });
    });

    // ══════════════════════════════════════════
    //  📷 IMAGE UPLOAD — Cloudinary
    // ══════════════════════════════════════════
    document.getElementById('edit-image-file').addEventListener('change', async e => {
        const file = e.target.files[0];
        if (!file) return;

        // Validasi tipe file
        if (!file.type.startsWith('image/')) {
            showToast('Hanya file gambar yang diizinkan!', 'error');
            return;
        }

        // Validasi ukuran (maks 10MB)
        if (file.size > 10 * 1024 * 1024) {
            showToast('Ukuran foto maksimal 10MB!', 'error');
            return;
        }

        // Tampilkan loading state
        const label = document.querySelector('label[for="edit-image-file"]');
        const originalText = label.innerHTML;
        label.innerHTML = '⏳ Mengunggah...';
        label.style.pointerEvents = 'none';
        label.style.opacity = '0.7';

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
            formData.append('folder', 'agrolibrary');

            const res = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
                { method: 'POST', body: formData }
            );

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error?.message || 'Upload gagal');
            }

            const data = await res.json();
            setImagePreview(data.secure_url);
            showToast('Foto berhasil diunggah ke cloud! ☁️');

        } catch (err) {
            console.error('Upload error:', err);
            showToast('Gagal unggah: ' + err.message, 'error');
        } finally {
            label.innerHTML = originalText;
            label.style.pointerEvents = '';
            label.style.opacity = '';
            e.target.value = '';
        }
    });

    document.getElementById('edit-image-url').addEventListener('input', e => {
        const url = e.target.value.trim();
        if (url) setImagePreview(url);
        else if (!document.getElementById('edit-image-file').files.length) clearImagePreview();
    });
    document.getElementById('btn-remove-image').addEventListener('click', clearImagePreview);

    document.querySelectorAll('.tool-btn').forEach(btn => btn.addEventListener('click', () => handleToolbar(btn.dataset.action)));

    document.getElementById('export-btn').addEventListener('click', exportData);
    document.getElementById('import-file').addEventListener('change', importData);
    document.getElementById('modal-cancel-btn').addEventListener('click', hideModal);
}

function handleToolbar(action) {
    const ta = lastFocusedTextarea || document.getElementById('edit-description');
    const s = ta.selectionStart, e = ta.selectionEnd, text = ta.value, sel = text.substring(s, e);
    let pre = '', suf = '', ph = '';
    switch (action) {
        case 'bold': pre = '**'; suf = '**'; ph = 'tebal'; break;
        case 'italic': pre = '*'; suf = '*'; ph = 'miring'; break;
        case 'h2': pre = '## '; ph = 'Heading'; break;
        case 'h3': pre = '### '; ph = 'Sub-heading'; break;
        case 'link': pre = '['; suf = '](url)'; ph = 'teks'; break;
        case 'list-ul': pre = '- '; ph = 'item'; break;
    }
    const ins = sel || ph;
    ta.value = text.substring(0, s) + pre + ins + suf + text.substring(e);
    ta.focus();
    ta.setSelectionRange(s + pre.length, s + pre.length + ins.length);
}

// ── MODAL ──
function showModal(title, body, onConfirm) {
    const m = document.getElementById('confirm-modal');
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').textContent = body;
    const btn = document.getElementById('modal-confirm-btn');
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

// ── TOAST ──
function showToast(msg, type = 'success') {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.className = 'toast-notification toast-' + type + ' show';
    setTimeout(() => t.classList.remove('show'), 3000);
}

// ── EXPORT / IMPORT ──
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
    try {
        const raw = localStorage.getItem('agro_liked_slugs');
        return raw ? JSON.parse(raw) : [];
    } catch { return []; }
}
function saveLikedSlugs(slugs) {
    localStorage.setItem('agro_liked_slugs', JSON.stringify(slugs));
}
