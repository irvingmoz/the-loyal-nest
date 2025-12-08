// Session Manager centralizado para The Loyal Nest
// Maneja usuario actual, expiración de sesión y redirecciones a dashboards

const SessionManager = (() => {
    const CURRENT_USER_KEY = 'currentUser';
    const USER_SESSION_KEY = 'userSession';

    // Rutas correctas según el tipo de usuario
    const USER_ROUTES = {
        adoptante: 'dashboard_adoptante.html',
        rescatista: 'dashboard_rescatista.html',
        administrador: 'dashboard-admin.html'
    };

    // Obtener usuario actual desde localStorage (si la sesión sigue válida)
    function getCurrentUser() {
        try {
            const sessionRaw = localStorage.getItem(USER_SESSION_KEY);
            const userRaw = localStorage.getItem(CURRENT_USER_KEY);

            if (!sessionRaw || !userRaw) return null;

            const session = JSON.parse(sessionRaw);
            const user = JSON.parse(userRaw);

            // Validar expiración de sesión
            if (!session.expires || Date.now() > session.expires) {
                clearSession();
                return null;
            }

            return user;
        } catch (e) {
            console.error('Error leyendo sesión:', e);
            return null;
        }
    }

    // Guardar sesión (userSession + currentUser)
    function saveSession(user, remember = false) {
        const sessionData = {
            user,
            timestamp: new Date().toISOString(),
            // 30 días si "recuérdame", 1 día si no
            expires: remember
                ? Date.now() + 30 * 24 * 60 * 60 * 1000
                : Date.now() + 24 * 60 * 60 * 1000
        };

        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
        localStorage.setItem(USER_SESSION_KEY, JSON.stringify(sessionData));
    }

    // Limpiar sesión
    function clearSession() {
        localStorage.removeItem(CURRENT_USER_KEY);
        localStorage.removeItem(USER_SESSION_KEY);
    }

    // ¿Hay sesión válida?
    function isAuthenticated() {
        return !!getCurrentUser();
    }

    // URL del dashboard correcto según el tipo de usuario
    function getDashboardUrl(userType) {
        const type = userType || (getCurrentUser() && getCurrentUser().type);
        if (!type) return 'auth.html';

        return USER_ROUTES[type] || 'auth.html';
    }

    // Redirigir al dashboard correspondiente
    function redirectToDashboard(forceType) {
        const url = getDashboardUrl(forceType);
        if (!url) return;

        // Evitar recarga si ya estamos en ese dashboard
        const currentPath = window.location.pathname.split('/').pop();
        if (currentPath !== url) {
            window.location.href = url;
        }
    }

    // Proteger páginas que requieren autenticación
    function requireAuth(allowedTypes = []) {
        const user = getCurrentUser();

        if (!user) {
            // No hay sesión → ir a login
            window.location.href = 'auth.html';
            return null;
        }

        if (allowedTypes.length && !allowedTypes.includes(user.type)) {
            // Tiene sesión pero no el rol correcto → dashboard propio
            redirectToDashboard(user.type);
            return null;
        }

        return user;
    }

    // Logout genérico
    function logout(showMessage = true) {
        clearSession();
        if (showMessage && typeof window.showNotification === 'function') {
            window.showNotification('👋 Sesión cerrada correctamente.', 'info');
        }
        window.location.href = 'index.html';
    }

    // Exponer funciones
    return {
        getCurrentUser,
        saveSession,
        clearSession,
        isAuthenticated,
        getDashboardUrl,
        redirectToDashboard,
        requireAuth,
        logout
    };
})();

// Alias global para compatibilidad con onclick="redirectToDashboard()"
function redirectToDashboard(userType) {
    SessionManager.redirectToDashboard(userType);
}
