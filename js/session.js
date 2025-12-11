// js/session.js
// Control global de sesión, inyección de usuario en navbar y guardas de ruta

const SESSION_KEYS = {
    token: 'tl_token',
    user: 'tl_user',
    expires: 'tl_token_exp'
};

function persistSession({ token, user, expiresIn }) {
    if (!token || !user) return;
    const expiry = Date.now() + (expiresIn || 60 * 60 * 1000);
    localStorage.setItem(SESSION_KEYS.token, token);
    localStorage.setItem(SESSION_KEYS.user, JSON.stringify(user));
    localStorage.setItem(SESSION_KEYS.expires, String(expiry));
    renderNavbarUser(user);
}

function getSessionUser() {
    const expiry = parseInt(localStorage.getItem(SESSION_KEYS.expires) || '0', 10);
    if (!expiry || Date.now() > expiry) {
        clearSession();
        return null;
    }
    const raw = localStorage.getItem(SESSION_KEYS.user);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch (error) {
        console.error('No se pudo leer el usuario en sesión', error);
        clearSession();
        return null;
    }
}

function getAuthToken() {
    const expiry = parseInt(localStorage.getItem(SESSION_KEYS.expires) || '0', 10);
    if (!expiry || Date.now() > expiry) {
        clearSession();
        return null;
    }
    return localStorage.getItem(SESSION_KEYS.token);
}

function clearSession() {
    Object.values(SESSION_KEYS).forEach((key) => localStorage.removeItem(key));
    renderNavbarUser(null);
}

function redirectToDashboard(role) {
    const map = {
        adoptante: 'dashboard-adoptante.html',
        rescatista: 'dashboard-rescatista.html',
        rescuer: 'dashboard-rescuer.html',
        administrador: 'dashboard-admin.html'
    };
    const target = map[role] || 'index.html';
    const current = window.location.pathname.split('/').pop();
    if (current !== target) window.location.href = target;
}

function requireAuth(roles = []) {
    const user = getSessionUser();
    if (!user) {
        window.location.href = 'auth.html';
        return null;
    }
    if (roles.length && !roles.includes(user.role)) {
        redirectToDashboard(user.role);
        return null;
    }
    return user;
}

async function apiFetch(url, options = {}) {
    const token = getAuthToken();
    const headers = { ...(options.headers || {}), 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const response = await fetch(url, { ...options, headers });
    if (response.status === 401) {
        clearSession();
        window.location.href = 'auth.html';
        throw new Error('No autorizado');
    }
    return response;
}

function renderNavbarUser(user) {
    const navUser = document.querySelector('.nav-user');
    const navAuth = document.querySelector('.nav-auth');
    const navUserName = document.querySelector('.nav-user-name');
    if (user) {
        navAuth && (navAuth.style.display = 'none');
        if (navUser) {
            navUser.style.display = 'flex';
            if (navUserName) navUserName.textContent = user.name || user.email;
        }
    } else {
        navAuth && (navAuth.style.display = 'flex');
        navUser && (navUser.style.display = 'none');
    }
}

function applyRoleVisibility(user) {
    document.querySelectorAll('[data-require-role]').forEach((el) => {
        const roles = el.getAttribute('data-require-role').split(',').map((r) => r.trim());
        const allowed = user && roles.includes(user.role);
        el.style.display = allowed ? '' : 'none';
    });
    document.querySelectorAll('[data-hide-role]').forEach((el) => {
        const roles = el.getAttribute('data-hide-role').split(',').map((r) => r.trim());
        const shouldHide = user && roles.includes(user.role);
        el.style.display = shouldHide ? 'none' : '';
    });
}

async function bootstrapSession() {
    const user = getSessionUser();
    renderNavbarUser(user);
    applyRoleVisibility(user);
    const logoutBtn = document.querySelector('[data-action="logout"]');
    if (logoutBtn) logoutBtn.addEventListener('click', () => { clearSession(); window.location.href = 'auth.html'; });
}

document.addEventListener('DOMContentLoaded', bootstrapSession);
