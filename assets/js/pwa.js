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
  // Show banner after 3s if not dismissed before
  if (!sessionStorage.getItem('pwa-dismissed')) {
    setTimeout(showInstallBanner, 3000);
  }
});

function showInstallBanner() {
  if (!deferredPrompt) return;
  const banner = document.getElementById('pwa-banner');
  if (banner) banner.style.display = 'flex';
}

window.triggerPWAInstall = async function() {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  deferredPrompt = null;
  hidePWABanner();
};

window.hidePWABanner = function() {
  const banner = document.getElementById('pwa-banner');
  if (banner) banner.style.display = 'none';
  sessionStorage.setItem('pwa-dismissed', '1');
};

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
