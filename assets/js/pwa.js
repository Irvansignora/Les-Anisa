// ── Install-state helpers ──────────────────────────────────────────────
function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}
function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

// ── Service Worker Registration ──────────────────────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

// ── PWA Install Prompt ───────────────────────────────────────────────
let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  refreshInstallUI();
  if (!isStandalone() && !sessionStorage.getItem('pwa-dismissed')) {
    setTimeout(showInstallBanner, 3000);
  }
});

window.addEventListener('appinstalled', () => {
  deferredPrompt = null;
  hidePWABanner();
  refreshInstallUI();
});

function showInstallBanner() {
  if (isStandalone()) return;
  const banner = document.getElementById('pwa-banner');
  if (banner) banner.style.display = 'flex';
}

window.hidePWABanner = function() {
  const banner = document.getElementById('pwa-banner');
  if (banner) banner.style.display = 'none';
  sessionStorage.setItem('pwa-dismissed', '1');
};

window.triggerPWAInstall = async function() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    deferredPrompt = null;
    hidePWABanner();
    refreshInstallUI();
    return;
  }
  // Browser belum kasih native prompt (iOS, atau kriteria install belum terpenuhi) → kasih panduan manual
  showInstallHelp();
};

// ── Panduan install manual (fallback bila tidak ada native prompt) ─────
function showInstallHelp() {
  const existing = document.getElementById('pwa-help-modal');
  if (existing) { existing.classList.remove('hidden'); return; }

  const steps = isIOS()
    ? `<ol style="padding-left:20px;line-height:1.9;font-weight:600;color:var(--neutral-700);font-size:14px">
        <li>Ketuk ikon <strong>Bagikan</strong> (kotak dengan panah ke atas) di bar Safari</li>
        <li>Gulir ke bawah, pilih <strong>"Tambah ke Layar Utama"</strong></li>
        <li>Ketuk <strong>"Tambah"</strong> di pojok kanan atas</li>
      </ol>
      <p style="font-size:12px;color:var(--neutral-400);font-weight:600;margin-top:10px">📌 Catatan: di iPhone/iPad, install hanya bisa lewat Safari (bukan Chrome/lainnya).</p>`
    : `<ol style="padding-left:20px;line-height:1.9;font-weight:600;color:var(--neutral-700);font-size:14px">
        <li>Ketuk ikon menu <strong>⋮</strong> di pojok kanan atas browser</li>
        <li>Pilih <strong>"Install app"</strong> atau <strong>"Tambahkan ke Layar Utama"</strong></li>
        <li>Belum muncul opsinya? Muat ulang halaman ini, lalu coba lagi setelah beberapa saat</li>
      </ol>`;

  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.id = 'pwa-help-modal';
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-head"><span class="modal-title">📲 Cara Install App</span><button class="modal-close" id="pwa-help-close">✕</button></div>
      <div class="modal-body">
        <p style="font-size:13px;color:var(--neutral-500);font-weight:600;margin-bottom:12px">Install otomatis belum tersedia di browser ini. Coba cara manual berikut:</p>
        ${steps}
      </div>
    </div>`;
  document.body.appendChild(modal);
  modal.addEventListener('click', e => { if (e.target === modal) modal.classList.add('hidden'); });
  document.getElementById('pwa-help-close').addEventListener('click', () => modal.classList.add('hidden'));
}

// ── Tombol "Install App" di sidebar/menu (data-pwa-install) ────────────
function refreshInstallUI() {
  document.querySelectorAll('[data-pwa-install]').forEach(btn => {
    btn.style.display = isStandalone() ? 'none' : '';
  });
}
document.addEventListener('DOMContentLoaded', refreshInstallUI);

// ── Bottom nav active state ───────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;
  document.querySelectorAll('.bnav-item').forEach(item => {
    const href = item.getAttribute('href');
    if (href && path.includes(href.split('/').pop().split('.')[0])) {
      item.classList.add('active');
    }
  });
});
