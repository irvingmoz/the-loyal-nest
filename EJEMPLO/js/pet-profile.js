// Pet Profile Specific JavaScript
document.addEventListener('DOMContentLoaded', function() {
    loadRelatedPets();
    setupGallery();
    setupAdoptionModal();
});

// Datos de mascotas relacionadas
const relatedPets = [
    {
        id: 5,
        name: "Rocky",
        breed: "Bulldog Francés",
        age: "3 años",
        species: "Perro",
        location: "Refugio Esperanza",
        requests: 8,
        status: "available",
        emoji: "🐕"
    },
    {
        id: 6,
        name: "Lola",
        breed: "Mestiza",
        age: "1.5 años",
        species: "Perro",
        location: "Refugio Esperanza",
        requests: 4,
        status: "available",
        emoji: "🐕"
    },
    {
        id: 7,
        name: "Simba",
        breed: "Naranjoso",
        age: "2 años",
        species: "Gato",
        location: "Refugio Esperanza",
        requests: 6,
        status: "available",
        emoji: "🐈"
    }
];

// Cargar mascotas relacionadas
function loadRelatedPets() {
    const relatedGrid = document.getElementById('relatedPetsGrid');
    
    if (!relatedGrid) return;
    
    relatedGrid.innerHTML = relatedPets.map(pet => `
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

// Configurar galería de imágenes
function setupGallery() {
    const thumbs = document.querySelectorAll('.gallery-thumbs .thumb');
    const mainImage = document.querySelector('.gallery-main .main-image');
    
    thumbs.forEach((thumb, index) => {
        thumb.addEventListener('click', function() {
            // Remover clase active de todos los thumbs
            thumbs.forEach(t => t.classList.remove('active'));
            // Agregar clase active al thumb clickeado
            this.classList.add('active');
            // Cambiar imagen principal (en una implementación real)
            if (mainImage) {
                const thumbImg = this.querySelector('img');
                mainImage.src = thumbImg.src.replace('w=100&h=75', 'w=400&h=300');
            }
        });
    });
}

// Configurar modal de adopción
function setupAdoptionModal() {
    const adoptBtn = document.getElementById('adoptBtn');
    const adoptionModal = document.getElementById('adoptionModal');
    
    if (adoptBtn && adoptionModal) {
        adoptBtn.addEventListener('click', function() {
            openAdoptionModal();
        });
    }
}

function openAdoptionModal() {
    const modal = document.getElementById('adoptionModal');
    const formContainer = modal.querySelector('.adoption-form');
    
    if (formContainer) {
        formContainer.innerHTML = `
            <div class="adoption-steps">
                <div class="step active">1. Información Personal</div>
                <div class="step">2. Situación de Vivienda</div>
                <div class="step">3. Experiencia y Compromiso</div>
            </div>
            
            <form class="auth-form">
                <h4>Información Personal</h4>
                
                <div class="form-row">
                    <input type="text" placeholder="Nombre completo" required>
                    <input type="tel" placeholder="Teléfono" required>
                </div>
                
                <input type="email" placeholder="📧 Correo electrónico" required>
                <input type="text" placeholder="📍 Dirección completa" required>
                
                <div class="form-row">
                    <input type="text" placeholder="Colonia" required>
                    <select required>
                        <option value="">Alcaldía</option>
                        <option value="iztapalapa">Iztapalapa</option>
                        <option value="coyoacan">Coyoacán</option>
                        <option value="benito-juarez">Benito Juárez</option>
                    </select>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn-outline">Cancelar</button>
                    <button type="button" class="btn-primary">Siguiente</button>
                </div>
            </form>
            
            <div class="adoption-notice">
                <p>📝 <strong>Nota:</strong> Esta solicitud será revisada por el refugio. 
                Te contactaremos en un plazo de 48 horas.</p>
            </div>
        `;
    }
    
    openModal('adoptionModal');
}

// Función para ver mascota (simulación)
function viewPet(petId) {
    // En una implementación real, redirigiría a la página de la mascota
    console.log(`Ver perfil de mascota ID: ${petId}`);
    // Simular redirección
    window.location.href = `pet-profile.html?pet=${petId}`;
}

// Mejorar la función de modal existente
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Configurar cierre del modal
        const closeBtn = modal.querySelector('.close');
        if (closeBtn) {
            closeBtn.onclick = function() {
                closeModal(modalId);
            };
        }
        
        // Cerrar al hacer clic fuera
        modal.onclick = function(event) {
            if (event.target === modal) {
                closeModal(modalId);
            }
        };
    }
}