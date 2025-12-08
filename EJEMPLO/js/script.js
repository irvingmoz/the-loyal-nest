// Datos de ejemplo para mascotas
const featuredPets = [
    {
        id: 1,
        name: "Max",
        breed: "Labrador Mix",
        age: "2 años",
        species: "Perro",
        location: "Refugio Esperanza",
        requests: 12,
        status: "available",
        emoji: "🐕"
    },
    {
        id: 2,
        name: "Luna",
        breed: "Siamés",
        age: "1 año",
        species: "Gato",
        location: "Casa Gatuna",
        requests: 5,
        status: "available",
        emoji: "🐈"
    },
    {
        id: 3,
        name: "Rocky",
        breed: "Bulldog",
        age: "3 años",
        species: "Perro",
        location: "Refugio Esperanza",
        requests: 8,
        status: "available",
        emoji: "🐕"
    },
    {
        id: 4,
        name: "Bella",
        breed: "Mestiza",
        age: "4 meses",
        species: "Gato",
        location: "Casa Gatuna",
        requests: 3,
        status: "available",
        emoji: "🐈"
    }
];

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    loadFeaturedPets();
    setupEventListeners();
    setupModal();
});

// Cargar mascotas destacadas
function loadFeaturedPets() {
    const petsGrid = document.getElementById('petsGrid');
    
    if (!petsGrid) return;
    
    petsGrid.innerHTML = featuredPets.map(pet => `
        <div class="pet-card" onclick="viewPet(${pet.id})">
            <div class="pet-image">
                <span>${pet.emoji}</span>
                <div class="pet-status ${pet.status}">
                    ${pet.status === 'available' ? 'Disponible' : 'Adoptado'}
                </div>
            </div>
            <div class="pet-info">
                <h3 class="pet-name">${pet.name}</h3>
                <p class="pet-breed">${pet.breed} • ${pet.age}</p>
                <div class="pet-meta">
                    <span class="pet-location">🏠 ${pet.location}</span>
                    <span class="pet-requests">❤️ ${pet.requests} solicitudes</span>
                </div>
                <button class="btn-primary btn-full">Ver Perfil</button>
            </div>
        </div>
    `).join('');
}

// Configurar event listeners
function setupEventListeners() {
    // Toggle del menú móvil
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
    
    // Botones de autenticación
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', () => openModal('loginModal'));
    }
    
    if (registerBtn) {
        registerBtn.addEventListener('click', () => openModal('loginModal'));
    }
}

// Sistema de Modal
function setupModal() {
    const modal = document.getElementById('loginModal');
    const closeBtn = document.querySelector('.close');
    const switchToRegister = document.getElementById('switchToRegister');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => closeModal('loginModal'));
    }
    
    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal('loginModal');
        }
    });
    
    // Switch entre login/register
    if (switchToRegister) {
        switchToRegister.addEventListener('click', (e) => {
            e.preventDefault();
            // Aquí se cambiaría el formulario a registro
            console.log('Cambiar a formulario de registro');
        });
    }
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Funciones de navegación
function scrollToSearch() {
    const searchSection = document.getElementById('search');
    if (searchSection) {
        searchSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function viewPet(petId) {
    // En una implementación real, redirigiría a la página del perfil
    console.log(`Ver perfil de mascota ID: ${petId}`);
    alert(`Redirigiendo al perfil de ${featuredPets.find(pet => pet.id === petId)?.name}`);
}

// Smooth scroll para enlaces de navegación
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});