// Dashboard System JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    checkUserSession();
    loadAdoptionRequests();
});

// Inicializar dashboard
function initializeDashboard() {
    setupEventListeners();
    loadDashboardData();
    updateUserInfo();
}

// Verificar sesión de usuario
function checkUserSession() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'auth.html';
        return;
    }
    
    // Verificar si el usuario tiene acceso a este dashboard
    const userType = currentUser.type;
    const currentPage = window.location.pathname;
    
    if (currentPage.includes('dashboard-adoptante') && userType !== 'adoptante') {
        redirectToDashboard(userType);
    } else if (currentPage.includes('dashboard-rescatista') && userType !== 'rescatista') {
        redirectToDashboard(userType);
    } else if (currentPage.includes('dashboard-admin') && userType !== 'administrador') {
        redirectToDashboard(userType);
    }
}

// Configurar event listeners
function setupEventListeners() {
    // Navegación del sidebar
    const menuLinks = document.querySelectorAll('.menu-link');
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const section = this.dataset.section;

            if (section === 'buscar') {
                return; // Deja que el enlace navegue a search-pets.html
            }

            e.preventDefault();
            navigateTo(section || this.getAttribute('href').replace('#', ''));
        });
    });
    
    // Botones de favorito
    const favoriteButtons = document.querySelectorAll('.btn-favorite');
    favoriteButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            toggleFavorite(this);
        });
    });
    
    // Botones de solicitud
    const requestButtons = document.querySelectorAll('.btn-primary.btn-sm');
    requestButtons.forEach(btn => {
        if (!btn.disabled) {
            btn.addEventListener('click', function() {
                handleAdoptionRequest(this);
            });
        }
    });

    // Ver detalles
    const detailButtons = document.querySelectorAll('[data-view-details]');
    detailButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const petId = this.dataset.petId || this.closest('.pet-card')?.dataset.petId;
            window.location.href = `pet-profile.html?id=${petId || 1}`;
        });
    });
}

// Cargar datos del dashboard
function loadDashboardData() {
    // Simular carga de datos
    setTimeout(() => {
        updateStats();
        loadRecentActivity();
        loadRecommendedPets();
    }, 1000);
}

// Actualizar información del usuario
function updateUserInfo() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        const userElements = document.querySelectorAll('.user-name, .user-avatar, .user-avatar-sm');
        userElements.forEach(element => {
            if (element.classList.contains('user-name')) {
                element.textContent = currentUser.nombre;
            } else if (element.classList.contains('user-avatar') || element.classList.contains('user-avatar-sm')) {
                element.textContent = currentUser.avatar || '👤';
            }
        });
    }
}

// Navegar a sección
function navigateTo(section) {
    const sidebarLinks = document.querySelectorAll('.menu-item');
    sidebarLinks.forEach(item => item.classList.remove('active'));

    const activeItem = document.querySelector(`[data-section="${section}"]`)?.closest('.menu-item');
    if (activeItem) activeItem.classList.add('active');

    if (section === 'buscar') {
        window.location.href = 'search-pets.html';
        return;
    }

    if (section === 'inicio') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }

    showSection(section);
}

// Mostrar sección específica
function showSection(section) {
    const targetSection = document.getElementById(section);
    if (!targetSection) return;

    // Ocultar todas las secciones
    const sections = document.querySelectorAll('.dashboard-section');
    sections.forEach(sec => {
        sec.style.display = 'none';
    });

    // Mostrar sección seleccionada
    targetSection.style.display = 'block';
    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Alternar favorito
function toggleFavorite(button) {
    button.classList.toggle('active');
    
    if (button.classList.contains('active')) {
        button.style.color = 'var(--danger)';
        showNotification('❤️ Agregado a favoritos', 'success');
    } else {
        button.style.color = 'inherit';
        showNotification('💔 Removido de favoritos', 'info');
    }
    
    // Actualizar contador de favoritos
    updateFavoriteCount();
}

function loadAdoptionRequests() {
    const requests = getSavedRequests();
    const table = document.getElementById('requestsTable');
    const tbody = document.getElementById('requestsTableBody');
    const emptyState = document.getElementById('requestsEmpty');

    if (!table || !tbody || !emptyState) return;

    if (!requests.length) {
        table.style.display = 'none';
        emptyState.style.display = 'block';
        setStatNumber('Solicitudes', 0);
        return;
    }

    table.style.display = 'table';
    emptyState.style.display = 'none';
    tbody.innerHTML = requests.map(request => `
        <tr>
            <td>${request.nombreMascota}</td>
            <td>${formatDate(request.fecha)}</td>
            <td><span class="pet-status available">${request.estado}</span></td>
        </tr>
    `).join('');

    setStatNumber('Solicitudes', requests.length);
}

// Manejar solicitud de adopción
function handleAdoptionRequest(button) {
    const petCard = button.closest('.pet-card');
    const petName = petCard.querySelector('h3').textContent;
    const petId = petCard.dataset.petId || button.dataset.petId || Date.now();
    const requests = getSavedRequests();

    // Mostrar loading
    const originalText = button.innerHTML;
    button.innerHTML = '⏳ Procesando...';
    button.disabled = true;
    
    // Simular envío de solicitud
    setTimeout(() => {
        button.innerHTML = '✅ Solicitado';
        button.disabled = true;
        button.style.background = 'var(--success)';

        showNotification(`🐕 Solicitud enviada para ${petName}`, 'success');

        // Guardar solicitud en localStorage
        const newRequest = {
            idSolicitud: Date.now(),
            idMascota: Number(petId),
            nombreMascota: petName,
            fecha: new Date().toISOString(),
            estado: 'En Revisión'
        };

        requests.push(newRequest);
        localStorage.setItem('adoptionRequests', JSON.stringify(requests));

        // Refrescar tabla y estadísticas
        loadAdoptionRequests();
        updateStats();

        // Actualizar estadísticas
    }, 2000);
}

// Actualizar estadísticas
function updateStats() {
    // En una aplicación real, aquí obtendrías datos del servidor
    const stats = {
        solicitudes: getSavedRequests().length,
        favoritos: Math.floor(Math.random() * 10) + 1,
        adopciones: Math.floor(Math.random() * 3) + 1,
        vistas: Math.floor(Math.random() * 20) + 5
    };

    setStatNumber('Solicitudes', stats.solicitudes);
    setStatNumber('Favoritos', stats.favoritos);
    setStatNumber('Adopciones', stats.adopciones);
    setStatNumber('Mascotas Vistas', stats.vistas);
}

function setStatNumber(labelText, value) {
    const cards = document.querySelectorAll('.stat-card');
    cards.forEach(card => {
        const label = card.querySelector('.stat-label');
        if (label && label.textContent.includes(labelText)) {
            const number = card.querySelector('.stat-number');
            if (number) {
                number.textContent = value;
            }
        }
    });
}

// Animación de números
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.textContent = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Cargar actividad reciente
function loadRecentActivity() {
    // Simular datos de actividad
    const activities = [
        { icon: '✅', text: 'Solicitud aprobada para "Bobby"', time: 'Hace 2 días' },
        { icon: '📋', text: 'Nueva solicitud enviada para "Luna"', time: 'Hace 3 días' },
        { icon: '❤️', text: 'Agregaste "Max" a tus favoritos', time: 'Hace 1 semana' }
    ];
    
    const activityList = document.querySelector('.activity-list');
    if (activityList) {
        activityList.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">${activity.icon}</div>
                <div class="activity-content">
                    <p><strong>${activity.text}</strong></p>
                    <span class="activity-time">${activity.time}</span>
                </div>
            </div>
        `).join('');
    }
}

// Cargar mascotas recomendadas
function loadRecommendedPets() {
    // Simular datos de mascotas
    const pets = [
        {
            name: 'Max',
            image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=200&fit=crop',
            type: '🐕 Labrador • 2 años',
            location: '📍 CDMX, Benito Juárez',
            status: 'available'
        },
        {
            name: 'Luna',
            image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300&h=200&fit=crop',
            type: '🐈 Gato • 1 año',
            location: '📍 CDMX, Coyoacán',
            status: 'available'
        }
    ];
    
    const petsGrid = document.querySelector('.pets-grid');
    if (petsGrid) {
        petsGrid.innerHTML = pets.map(pet => `
            <div class="pet-card">
                <div class="pet-image">
                    <img src="${pet.image}" alt="${pet.name}">
                    <button class="btn-favorite">❤️</button>
                    <span class="pet-status ${pet.status}">Disponible</span>
                </div>
                <div class="pet-info">
                    <h3>${pet.name}</h3>
                    <div class="pet-details">
                        <span>${pet.type}</span>
                        <span>${pet.location}</span>
                    </div>
                    <div class="pet-actions">
                        <button class="btn-outline btn-sm">Ver Detalles</button>
                        <button class="btn-primary btn-sm">Solicitar</button>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Re-configurar event listeners para los nuevos botones
        setupEventListeners();
    }
}

// Actualizar contador de favoritos
function updateFavoriteCount() {
    const favoriteCount = document.querySelectorAll('.btn-favorite.active').length;
    const favoriteBadge = document.querySelector('.menu-badge');
    if (favoriteBadge) {
        favoriteBadge.textContent = favoriteCount;
    }
}

function getSavedRequests() {
    try {
        return JSON.parse(localStorage.getItem('adoptionRequests')) || [];
    } catch (error) {
        console.error('No se pudieron leer las solicitudes almacenadas', error);
        return [];
    }
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric' });
}

// Cerrar sesión
function logout() {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        // Limpiar datos de sesión
        localStorage.removeItem('currentUser');
        localStorage.removeItem('userSession');
        
        showNotification('👋 ¡Hasta pronto!', 'info');
        
        // Redirigir al login
        setTimeout(() => {
            window.location.href = 'auth.html';
        }, 1000);
    }
}

// Redirigir al dashboard correcto
function redirectToDashboard(userType) {
    const routes = {
        'adoptante': 'dashboard-adoptante.html',
        'rescatista': 'dashboard-rescatista.html',
        'administrador': 'dashboard-admin.html'
    };
    
    if (routes[userType] && !window.location.pathname.includes(routes[userType])) {
        window.location.href = routes[userType];
    }
}

// Mostrar notificación (reutilizada de auth.js)
function showNotification(message, type = 'info') {
    // Implementación igual que en auth.js
}
