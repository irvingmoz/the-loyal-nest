// Gestor de sesión unificado
class SessionManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.loadUser();
        this.updateUI();
    }

    loadUser() {
        const userData = localStorage.getItem('currentUser');
        if (userData) {
            this.currentUser = JSON.parse(userData);
        }
    }

    updateUI() {
        const loginBtn = document.getElementById('loginBtn');
        const registerBtn = document.getElementById('registerBtn');
        const userMenu = document.getElementById('userMenu');
        const userDashboardLink = document.getElementById('userDashboardLink');

        if (this.currentUser) {
            // Usuario loggeado
            if (loginBtn) loginBtn.style.display = 'none';
            if (registerBtn) registerBtn.style.display = 'none';
            if (userMenu) userMenu.style.display = 'block';
            
            // Actualizar enlace del dashboard
            if (userDashboardLink) {
                const dashboardUrl = this.getDashboardUrl();
                userDashboardLink.href = dashboardUrl;
                userDashboardLink.innerHTML = `👋 ${this.currentUser.nombre}`;
            }
        }
    }

    getDashboardUrl() {
        if (!this.currentUser) return 'auth.html';
        
        const dashboards = {
            'adoptante': 'dashboard-adoptante.html',
            'rescatista': 'dashboard-rescuer.html', // ✅ Nota: tu archivo se llama rescuer, no rescatista
            'administrador': 'dashboard-admin.html'
        };
        
        return dashboards[this.currentUser.type] || 'auth.html';
    }

    logout() {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }
}

// Inicializar
const sessionManager = new SessionManager();