// ── Toast ──────────────────────────────────────────────────────────────
export function toast(msg, type = 'info', duration = 3000) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const t = document.createElement('div');
  const icons = { success:'✅', error:'❌', info:'ℹ️' };
  t.className = `toast toast-${type}`;
  t.innerHTML = `<span>${icons[type]||'ℹ️'}</span><span>${msg}</span>`;
  container.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity .3s'; setTimeout(() => t.remove(), 300); }, duration);
}

// ── Loading ────────────────────────────────────────────────────────────
export function showLoading() {
  let el = document.getElementById('loading-overlay');
  if (!el) {
    el = document.createElement('div');
    el.id = 'loading-overlay';
    el.className = 'loading-overlay';
    el.innerHTML = '<div class="spinner"></div>';
    document.body.appendChild(el);
  }
  el.classList.remove('hidden');
}
export function hideLoading() {
  document.getElementById('loading-overlay')?.classList.add('hidden');
}

// ── Date ───────────────────────────────────────────────────────────────
export function formatDate(ts) {
  if (!ts) return '-';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' });
}
export function formatDateShort(ts) {
  if (!ts) return '-';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' });
}
export function todayISO() {
  return new Date().toISOString().split('T')[0];
}

// ── Avatar initial ─────────────────────────────────────────────────────
export function avatarInitial(name = '?') {
  return name.trim().charAt(0).toUpperCase();
}

// ── Score color ────────────────────────────────────────────────────────
export function scoreClass(score) {
  if (score === null || score === undefined) return 'none';
  if (score >= 80) return 'high';
  if (score >= 65) return 'mid';
  return 'low';
}
export function progressClass(score) {
  if (score >= 80) return 'progress-green';
  if (score >= 65) return 'progress-yellow';
  return 'progress-red';
}

// ── Star rating ───────────────────────────────────────────────────────
// Penilaian sekarang pakai bintang (1–5), bukan angka. Laporan lama yang
// masih menyimpan field `score` (0–100) otomatis dikonversi ke skala
// bintang supaya tetap tampil rapi tanpa perlu migrasi data manual.
export function getStars(report) {
  if (report == null) return null;
  if (report.stars != null) return report.stars;
  if (report.score != null) return Math.max(1, Math.min(5, Math.round(report.score / 100 * 5)));
  return null;
}
export function starRow(rating, opts = {}) {
  const max = opts.max || 5;
  const size = opts.size || 16;
  if (rating == null) {
    return `<span class="star-rating-empty">Belum dinilai</span>`;
  }
  const r = Math.max(0, Math.min(max, Math.round(rating)));
  let html = `<span class="star-rating" style="font-size:${size}px" aria-label="${r} dari ${max} bintang">`;
  for (let i = 1; i <= max; i++) html += `<span class="star ${i <= r ? 'filled' : 'empty'}">★</span>`;
  html += '</span>';
  return html;
}

// ── Subject helpers ────────────────────────────────────────────────────
export const SUBJECTS = ['Membaca', 'Menulis', 'Berhitung', 'Calistung (Lengkap)'];
export const SUBJECT_ICONS = { 'Membaca':'📖', 'Menulis':'✏️', 'Berhitung':'🔢', 'Calistung (Lengkap)':'🌟' };
export const GRADES = [
  'PAUD / Playgroup','TK A (4-5 tahun)','TK B (5-6 tahun)',
  'SD Kelas 1','SD Kelas 2','SD Kelas 3',
  'SD Kelas 4','SD Kelas 5','SD Kelas 6'
];
export const AGE_GROUPS = ['3 tahun','4 tahun','5 tahun','6 tahun','7 tahun','8 tahun','9 tahun','10 tahun','11 tahun','12 tahun'];
export const ATT_STATUS = {
  hadir: { label:'Hadir',  badge:'badge-green', icon:'✓' },
  izin:  { label:'Izin',   badge:'badge-amber', icon:'I' },
  sakit: { label:'Sakit',  badge:'badge-blue',  icon:'S' },
  alpha: { label:'Alpha',  badge:'badge-red',   icon:'A' },
};
export const READING_LEVELS  = ['Belum mengenal huruf','Mengenal huruf A-Z','Mengeja suku kata','Membaca kata sederhana','Membaca kalimat pendek','Membaca paragraf','Membaca lancar'];
export const WRITING_LEVELS  = ['Belum bisa memegang pensil','Latihan motorik halus','Menulis huruf kapital','Menulis huruf kecil','Menulis kata','Menulis kalimat','Menulis rapi & mandiri'];
export const COUNTING_LEVELS = ['Mengenal angka 1-10','Mengenal angka 1-20','Mengenal angka 1-100','Penjumlahan dasar','Pengurangan dasar','Penjumlahan & pengurangan lanjut','Perkalian dasar','Pembagian dasar'];
export const LEVEL_MAP = { 'Membaca':READING_LEVELS,'Menulis':WRITING_LEVELS,'Berhitung':COUNTING_LEVELS,'Calistung (Lengkap)':[...READING_LEVELS.slice(0,3),...WRITING_LEVELS.slice(0,3),...COUNTING_LEVELS.slice(0,3)] };

// ── Cloudinary upload ──────────────────────────────────────────────────
export async function uploadToCloudinary(file, config) {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', config.uploadPreset);
  fd.append('folder', 'les-anisa');
  const res  = await fetch(`https://api.cloudinary.com/v1_1/${config.cloudName}/auto/upload`, { method:'POST', body:fd });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.secure_url;
}

// ── Chip group toggle ──────────────────────────────────────────────────
export function setupChips(containerSelector, onChange) {
  const chips = document.querySelectorAll(`${containerSelector} .chip`);
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('active');
      onChange(getActiveChips(containerSelector));
    });
  });
}
export function getActiveChips(containerSelector) {
  return [...document.querySelectorAll(`${containerSelector} .chip.active`)].map(c => c.dataset.value);
}
export function setActiveChips(containerSelector, values = []) {
  document.querySelectorAll(`${containerSelector} .chip`).forEach(c => {
    c.classList.toggle('active', values.includes(c.dataset.value));
  });
}

// ── Subject pills (dashboard) ──────────────────────────────────────────
export function setupSubjectPills(containerSelector, onChange) {
  document.querySelectorAll(`${containerSelector} .subject-pill`).forEach(pill => {
    pill.addEventListener('click', () => {
      pill.classList.toggle('active');
      const active = [...document.querySelectorAll(`${containerSelector} .subject-pill.active`)].map(p => p.dataset.value);
      onChange(active);
    });
  });
}

// ── Confirm dialog ─────────────────────────────────────────────────────
export function confirm(msg) {
  return window.confirm(msg);
}

// ── Redirect if not authed ─────────────────────────────────────────────
export function requireAuth(auth, onAuthStateChanged, redirectTo = '../index.html') {
  return new Promise((resolve) => {
    const unsub = onAuthStateChanged(auth, user => {
      unsub();
      if (!user) { window.location.href = redirectTo; return; }
      resolve(user);
    });
  });
}

// ── Modal helpers ──────────────────────────────────────────────────────
export function openModal(id) { document.getElementById(id)?.classList.remove('hidden'); }
export function closeModal(id) { document.getElementById(id)?.classList.add('hidden'); }
export function setupModalClose() {
  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', e => { if (e.target === backdrop) backdrop.classList.add('hidden'); });
  });
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => btn.closest('.modal-backdrop')?.classList.add('hidden'));
  });
}

// ── Lightbox ──────────────────────────────────────────────────────────
export function openLightbox(src) {
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = `<img src="${src}" alt="lampiran">`;
  lb.addEventListener('click', () => lb.remove());
  document.body.appendChild(lb);
}
