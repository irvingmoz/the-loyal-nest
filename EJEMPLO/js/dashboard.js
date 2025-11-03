// Dashboard JavaScript - Panel del Rescatista
document.addEventListener('DOMContentLoaded', function() {
    loadPetsList();
    setupFilters();
    setupUserMenu();
    initializeCharts();
});

// Datos de ejemplo de mascotas del rescatista
const rescuerPets = [
    {
        id: 1,
        name: "Max",
        breed: "Labrador Mix",
        age: "2 años",
        status: "available",
        requests: 12,
        emoji: "🐕",
        lastUpdate: "2024-09-20"
    },
    {
        id: 2,
        name: "Luna",
        breed: "Siamés",
        age: "1 año",
        status: "adopted",
        requests: 5,
        emoji: "🐈",
        lastUpdate: "2024-09-18"
    },
    {
        id: 3,
        name: "Rocky",
        breed: "Bulldog",
        age: "3 años",
        status: "pending",
        requests: 8,
        emoji: "🐕",
        lastUpdate: "2024-09-22"
    },
    {
        id: 4,
        name: "Bella",
        breed: "Mestiza",
        age: "4 meses",
        status: "available",
        requests: 3,
        emoji: "🐈",
        lastUpdate: "2024-09-21"
    },
    {
        id: 5,
        name: "Toby",
        breed: "Chihuahua",
        age: "1.5 años",
        status: "available",
        requests: 2,
        emoji: "🐕",
        lastUpdate: "2024-09-19"
    }
];

// Cargar lista de mascotas
function loadPetsList(filter = 'all') {
    const petsList = document.getElementById('petsList');
    if (!petsList) return;

    let filteredPets = rescuerPets;
    
    if (filter !== 'all') {
        filteredPets = rescuerPets.filter(pet => pet.status === filter);
    }

    petsList.innerHTML = filteredPets.map(pet => `
        <div class="pet-item" data-pet-id="${pet.id}">
            <div class="pet-avatar">
                ${pet.emoji}
            </div>
            <div class="pet-info">
                <div class="pet-name">${pet.name}</div>
                <div class="pet-details">
                    <span>${pet.breed}</span>
                    <span>•</span>
                    <span>${pet.age}</span>
                    <span>•</span>
                    <span>❤️ ${pet.requests} solicitudes</span>
                </div>
            </div>
            <div class="pet-status status-${pet.status}">
                ${getStatusText(pet.status)}
            </div>
            <div class="pet-actions">
                <button class="btn-outline btn-small" onclick="viewPet(${pet.id})">
                    👁️ Ver
                </button>
                <button class="btn-outline btn-small" onclick="editPet(${pet.id})">
                    ✏️ Editar
                </button>
            </div>
        </div>
    `).join('');

    updatePetsSummary(filteredPets);
}

function getStatusText(status) {
    const statusMap = {
        'available': 'Disponible',
        'pending': 'En proceso',
        'adopted': 'Adoptado'
    };
    return statusMap[status] || status;
}

function updatePetsSummary(pets) {
    const total = pets.length;
    const available = pets.filter(pet => pet.status === 'available').length;
    const pending = pets.filter(pet => pet.status === 'pending').length;

    // Actualizar resumen (si existe en el HTML)
    const summaryElements = {
        total: document.querySelector('.summary-value:not(.available):not(.pending)'),
        available: document.querySelector('.summary-value.available'),
        pending: document.querySelector('.summary-value.pending')
    };

    if (summaryElements.total) summaryElements.total.textContent = `${total} mascotas`;
    if (summaryElements.available) summaryElements.available.textContent = available;
    if (summaryElements.pending) summaryElements.pending.textContent = pending;
}

// Configurar filtros
function setupFilters() {
    const petsFilter = document.getElementById('petsFilter');
    if (petsFilter) {
        petsFilter.addEventListener('change', function() {
            loadPetsList(this.value);
        });
    }
}

// Configurar menú de usuario
function setupUserMenu() {
    const userMenu = document.querySelector('.nav-user');
    if (userMenu) {
        userMenu.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }

    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', function() {
        const menu = document.querySelector('.user-menu');
        if (menu) {
            // El menú se oculta automáticamente con CSS :hover
        }
    });

    // Logout
    const logoutBtn = document.querySelector('.logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
                // Aquí iría la lógica de logout
                window.location.href = 'index.html';
            }
        });
    }
}

// Funciones de mascotas
function viewPet(petId) {
    // Redirigir a la página del perfil de la mascota
    window.location.href = `pet-profile.html?pet=${petId}`;
}

function editPet(petId) {
    // Redirigir al formulario de edición
    window.location.href = `edit-pet.html?pet=${petId}`;
}

// Gráficos (simulación)
function initializeCharts() {
    // En una implementación real, aquí inicializarías gráficos con Chart.js o similar
    console.log('Inicializando gráficos del dashboard...');
    
    // Simular carga de datos para gráficos
    setTimeout(() => {
        updateChartData();
    }, 1000);
}

function updateChartData() {
    // Simular actualización de datos de gráficos
    console.log('Datos de gráficos actualizados');
}

// Funciones de notificaciones
function markReminderDone(button) {
    const reminderItem = button.closest('.reminder-item');
    if (reminderItem) {
        reminderItem.style.opacity = '0.5';
        button.textContent = '✅ Hecho';
        button.disabled = true;
        
        // Mostrar mensaje de confirmación
        showNotification('Recordatorio marcado como completado', 'success');
    }
}

function showNotification(message, type = 'info') {
    // Crear notificación temporal
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;
    
    // Estilos básicos para la notificación
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'var(--success)' : 'var(--primary)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--radius);
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 1rem;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Navegación rápida
function quickAction(action) {
    switch(action) {
        case 'add-pet':
            window.location.href = 'add-pet.html';
            break;
        case 'medical':
            window.location.href = 'medical-reminders.html';
            break;
        case 'requests':
            window.location.href = 'adoption-requests.html';
            break;
        case 'reports':
            window.location.href = 'reports.html';
            break;
    }
}