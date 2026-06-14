// Injects sidebar + topbar into any admin page
// Usage: import { initAdminShell } from '../assets/js/admin-shell.js';
//        await initAdminShell('pageKey');

import { db, auth, signOut, onAuthStateChanged, doc, getDoc }
  from './firebase-config.js';
import { requireAuth, avatarInitial, toast } from './utils.js';

const NAV_ITEMS = [
  { key:'dashboard',  href:'dashboard.html',  icon:'🏠', label:'Dashboard' },
  { key:'students',   href:'students.html',   icon:'👶', label:'Data Murid' },
  { key:'progress',   href:'progress.html',   icon:'📋', label:'Laporan Belajar' },
  { key:'attendance', href:'attendance.html', icon:'📅', label:'Kehadiran' },
  { key:'enrollment', href:'enrollment.html', icon:'📝', label:'Pendaftaran' },
  { key:'divider' },
  { key:'settings',   href:'settings.html',   icon:'⚙️', label:'Pengaturan Web' },
];

export async function initAdminShell(activeKey) {
  // Auth guard
  const user = await requireAuth(auth, onAuthStateChanged, 'login.html');
  const snap  = await getDoc(doc(db, 'users', user.uid));
  if (snap.exists() && snap.data().role !== 'admin') {
    window.location.href = '../parent/dashboard.html';
  }
  const userName = snap.data()?.name || user.email?.split('@')[0] || 'Admin';

  const navHTML = NAV_ITEMS.map(item => {
    if (item.key === 'divider') return `<div class="nav-divider"></div>`;
    const active = item.key === activeKey ? 'active' : '';
    return `<a href="${item.href}" class="nav-item ${active}"><span class="nav-icon">${item.icon}</span>${item.label}</a>`;
  }).join('');

  const sidebarHTML = `
  <div class="sidebar-overlay" id="overlay" onclick="closeSidebar()"></div>
  <aside class="sidebar" id="sidebar">
    <a href="dashboard.html" class="sidebar-logo">
      <div class="sidebar-logo-icon">📚</div>
      <div><div class="sidebar-logo-text">Les Anisa</div><div class="sidebar-logo-sub">Admin Panel</div></div>
    </a>
    <div class="sidebar-user">
      <div class="avatar" id="sb-avatar">${avatarInitial(userName)}</div>
      <div class="sidebar-user-info">
        <div class="sidebar-user-name">${userName}</div>
        <div class="sidebar-user-role">Administrator</div>
      </div>
    </div>
    <nav class="sidebar-nav">${navHTML}</nav>
    <div class="sidebar-footer">
      <a href="../index.html" target="_blank" class="sidebar-view-site">🌐 Lihat Website</a>
      <button class="btn-logout" id="logout-btn">🚪 Keluar</button>
    </div>
  </aside>`;

  const topbarHTML = `
  <div class="dash-topbar" id="topbar">
    <button onclick="openSidebar()" style="background:none;border:none;font-size:22px;cursor:pointer;color:var(--sage-700)">☰</button>
    <span style="font-family:var(--font-display);font-weight:700;color:var(--sage-900)">Les Anisa</span>
    <button id="topbar-logout" style="background:none;border:none;font-size:20px;cursor:pointer">🚪</button>
  </div>`;

  // Inject before dash-main
  const wrapper = document.querySelector('.dash-wrapper');
  wrapper.insertAdjacentHTML('afterbegin', sidebarHTML);
  const main = document.querySelector('.dash-main');
  main.insertAdjacentHTML('afterbegin', topbarHTML);

  // Logout
  const logout = async () => { await signOut(auth); window.location.href = 'login.html'; };
  document.getElementById('logout-btn').addEventListener('click', logout);
  document.getElementById('topbar-logout').addEventListener('click', logout);

  // Sidebar toggle
  window.openSidebar  = () => { document.getElementById('sidebar').classList.add('open'); document.getElementById('overlay').classList.add('open'); };
  window.closeSidebar = () => { document.getElementById('sidebar').classList.remove('open'); document.getElementById('overlay').classList.remove('open'); };

  return { user, userName };
}
