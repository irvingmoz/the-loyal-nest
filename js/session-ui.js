// js/session-ui.js
// UI global de sesión: oculta/mostrar botones de auth y muestra menú de usuario
// Además: "Ir a mi panel" manda a dashboard según rol (adoptante/rescatista)

(function () {
  // ---- Helpers ----
  function readJSON(key) {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  }

  function getSessionUser() {
    // Tu flujo principal (auth.js)
    const u1 = readJSON('userSession');
    if (u1) return u1;

    // Otros posibles flujos del repo
    const u2 = readJSON('tl_user');
    if (u2) return u2;

    const u3 = readJSON('currentUser');
    if (u3) return u3;

    return null;
  }

  function isLoggedIn() {
    const u = getSessionUser();
    if (u) return true;

    const sesionActiva = localStorage.getItem('sesionActiva');
    if (sesionActiva && sesionActiva !== 'false' && sesionActiva !== '0') return true;

    return false;
  }

  function getDisplayName(user) {
    return user?.nombre || user?.name || user?.username || user?.email || 'Mi cuenta';
  }

  // ✅ Normaliza rol (adoptante/rescatista)
  function getRole(user) {
    const role = String(user?.rol || user?.role || user?.tipo || user?.type || user?.userType || '').toLowerCase();

    // soporta variantes comunes
    if (role.includes('rescat')) return 'rescatista';
    if (role.includes('adopt')) return 'adoptante';

    return role; // puede venir vacío
  }

  // ✅ dashboard por rol (lo que pediste)
  function getDashboardByRole(role) {
    if (role === 'rescatista') return 'dashboard-rescatista.html';
    // por defecto adoptante
    return 'dashboard-adoptante.html';
  }

  function logout() {
    // IMPORTANTE: no borres petsDB ni solicitudesDB
    localStorage.removeItem('sesionActiva');
    localStorage.removeItem('userSession');

    localStorage.removeItem('currentUser');
    localStorage.removeItem('tl_user');
    localStorage.removeItem('tl_token');
    localStorage.removeItem('tl_token_exp');

    updateAuthUI();
    window.location.href = 'index.html';
  }

  // Si tu proyecto ya tiene cerrarSesion() en otro JS, no la pisamos
  if (!window.cerrarSesion) {
    window.cerrarSesion = logout;
  }

  // Evitar inyección rara en nombre
  function escapeHtml(str) {
    return String(str)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  // ---- UI update ----
  function updateAuthUI() {
    const logged = isLoggedIn();
    const user = getSessionUser();
    const name = getDisplayName(user);
    const role = getRole(user);
    const dash = getDashboardByRole(role);

    // Caso A: navbar tipo index (li.nav-auth + userMenu)
    const navAuthLi = document.querySelector('.nav-auth') || document.getElementById('navAuth');
    const userMenu = document.getElementById('userMenu');
    const userNameEl = document.getElementById('userName');
    const dashLink = document.getElementById('userDashboardLink');

    if (logged) {
      if (navAuthLi) navAuthLi.style.display = 'none';
      if (userMenu) userMenu.style.display = 'block';
      if (userNameEl) userNameEl.textContent = name;

      // ✅ Este es el cambio: link de "Ir a mi panel" según rol
      if (dashLink) {
        dashLink.setAttribute('href', dash);
      }
    } else {
      if (navAuthLi) navAuthLi.style.display = '';
      if (userMenu) userMenu.style.display = 'none';
    }

    // Caso B: navbar tipo páginas internas (div#nav-auth-buttons)
    const navAuthButtons = document.getElementById('nav-auth-buttons');
    if (navAuthButtons) {
      if (logged) {
        navAuthButtons.innerHTML = `
          <div style="display:flex; gap:10px; align-items:center;">
            <span style="font-weight:600; color: var(--gray-dark);">👋 ${escapeHtml(name)}</span>
            <a class="btn-outline" href="${dash}">Mi panel</a>
            <a class="btn-primary" href="#" id="logoutBtnNav">Salir</a>
          </div>
        `;
        const logoutBtn = document.getElementById('logoutBtnNav');
        logoutBtn?.addEventListener('click', (e) => {
          e.preventDefault();
          logout();
        });
      } else {
        navAuthButtons.innerHTML = `
          <div style="display:flex; gap:10px;">
            <a class="btn-outline" href="auth.html">Iniciar Sesión</a>
            <a class="btn-primary" href="register.html">Registrarse</a>
          </div>
        `;
      }
    }
  }

  // ---- Init ----
  document.addEventListener('DOMContentLoaded', updateAuthUI);
  window.addEventListener('storage', updateAuthUI);
})();
