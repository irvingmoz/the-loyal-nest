// Pet Profile Specific JavaScript
let currentPet = null;

const petsData = [
    {
        id: 1,
        name: 'Max',
        species: 'Perro',
        emoji: '🐕',
        breed: 'Labrador Mix',
        age: '2 años',
        sex: 'Macho',
        size: 'Mediano',
        weight: '18 kg',
        description: 'Perro cariñoso y juguetón, rescatado de la calle y listo para un hogar lleno de paseos y mimos.',
        status: 'Disponible',
        requests: 12,
        images: [
            'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1560743641-3914f2c45636?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&h=300&fit=crop'
        ],
        shelter: 'Refugio Esperanza'
    },
    {
        id: 2,
        name: 'Luna',
        species: 'Gato',
        emoji: '🐈',
        breed: 'Siamesa',
        age: '1 año',
        sex: 'Hembra',
        size: 'Chico',
        weight: '4 kg',
        description: 'Gatita curiosa y tranquila, ideal para departamentos. Le encanta descansar en lugares soleados.',
        status: 'Disponible',
        requests: 5,
        images: [
            'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop'
        ],
        shelter: 'Refugio Esperanza'
    },
    {
        id: 3,
        name: 'Rocky',
        species: 'Perro',
        emoji: '🐕',
        breed: 'Bulldog Francés',
        age: '3 años',
        sex: 'Macho',
        size: 'Chico',
        weight: '12 kg',
        description: 'Bulldog alegre que disfruta la compañía humana. Necesita paseos cortos y cariño constante.',
        status: 'En proceso',
        requests: 8,
        images: [
            'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop'
        ],
        shelter: 'Refugio Esperanza'
    },
    {
        id: 4,
        name: 'Simba',
        species: 'Gato',
        emoji: '🐈',
        breed: 'Naranjoso',
        age: '2 años',
        sex: 'Macho',
        size: 'Mediano',
        weight: '5.5 kg',
        description: 'Gato juguetón y sociable, perfecto para familias que buscan compañía felina.',
        status: 'Disponible',
        requests: 6,
        images: [
            'https://images.unsplash.com/photo-1595433562696-a8b1cb0b6ea1?w=400&h=300&fit=crop'
        ],
        shelter: 'Refugio Esperanza'
    }
];

document.addEventListener('DOMContentLoaded', function() {
    loadPetProfile();
    loadRelatedPets();
    setupAdoptionModal();
});

function loadPetProfile() {
    const params = new URLSearchParams(window.location.search);
    const petId = Number(params.get('id')) || 1;
    const pet = petsData.find(p => p.id === petId);

    if (!pet) {
        showPetNotFound();
        return;
    }

    currentPet = pet;
    document.title = `${pet.name} - ${pet.breed} | The Loyal Nest`;

    updateTextContent('breadcrumbName', pet.name);
    updatePetTitle(pet);
    updateBasicInfo(pet);
    updateDescription(pet);
    renderGallery(pet.images, pet);
    updateAdoptionCta(pet);
    updateModalTitle(pet);
}

function showPetNotFound() {
    const main = document.querySelector('.pet-profile');
    if (main) {
        main.innerHTML = '<div class="container"><div class="alert">Mascota no encontrada.</div></div>';
    }
}

function updateTextContent(elementId, value) {
    const el = document.getElementById(elementId);
    if (el) el.textContent = value;
}

function updatePetTitle(pet) {
    const title = document.getElementById('petTitle');
    const statusBadge = document.getElementById('petStatus');

    if (title) {
        title.innerHTML = `${pet.name} <span class="pet-badge available">${pet.status}</span>`;
    }

    if (statusBadge) {
        statusBadge.textContent = pet.status;
    }
}

function updateBasicInfo(pet) {
    updateTextContent('petSpecies', `${pet.emoji} ${pet.species}`);
    updateTextContent('petBreed', pet.breed);
    updateTextContent('petAge', pet.age);
    updateTextContent('petSex', pet.sex);
    updateTextContent('petSize', pet.size);
    updateTextContent('petWeight', pet.weight);
}

function updateDescription(pet) {
    updateTextContent('descriptionTitle', `📝 Sobre ${pet.name}`);
    updateTextContent('descriptionText', pet.description);
}

function renderGallery(images = [], pet) {
    const mainImage = document.getElementById('mainImage');
    const thumbsContainer = document.getElementById('galleryThumbs');

    if (mainImage && images.length) {
        mainImage.src = images[0];
        mainImage.alt = `${pet.name} - ${pet.breed}`;
    }

    if (thumbsContainer) {
        thumbsContainer.innerHTML = images.map((img, index) => `
            <div class="thumb ${index === 0 ? 'active' : ''}" data-index="${index}">
                <img src="${img.replace('w=400&h=300', 'w=100&h=75')}" alt="${pet.name} ${index + 1}">
            </div>
        `).join('');

        setupGalleryListeners();
    }
}

function setupGalleryListeners() {
    const thumbs = document.querySelectorAll('.gallery-thumbs .thumb');
    const mainImage = document.querySelector('.gallery-main .main-image');

    thumbs.forEach(thumb => {
        thumb.addEventListener('click', function() {
            thumbs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            const thumbImg = this.querySelector('img');
            if (mainImage && thumbImg) {
                mainImage.src = thumbImg.src.replace('w=100&h=75', 'w=400&h=300');
            }
        });
    });
}

function updateAdoptionCta(pet) {
    updateTextContent('adoptionPrompt', `¿Listo para darle un hogar a ${pet.name}?`);
    updateTextContent('adoptionRequestsCount', `${pet.requests} solicitudes`);
}

function updateModalTitle(pet) {
    updateTextContent('adoptionModalTitle', `📋 Solicitud de Adopción - ${pet.name}`);
}

// Cargar mascotas relacionadas
function loadRelatedPets() {
    const relatedGrid = document.getElementById('relatedPetsGrid');
    if (!relatedGrid) return;

    const related = petsData.filter(pet => !currentPet || pet.id !== currentPet.id);

    relatedGrid.innerHTML = related.map(pet => `
        <div class="pet-card" onclick="viewPet(${pet.id})">
            <div class="pet-image">
                <span>${pet.emoji}</span>
                <div class="pet-status ${pet.status.toLowerCase().includes('disponible') ? 'available' : 'pending'}">
                    ${pet.status}
                </div>
            </div>
            <div class="pet-info">
                <h3 class="pet-name">${pet.name}</h3>
                <p class="pet-breed">${pet.breed} • ${pet.age}</p>
                <div class="pet-meta">
                    <span class="pet-location">🏠 ${pet.shelter}</span>
                    <span class="pet-requests">❤️ ${pet.requests} solicitudes</span>
                </div>
                <button class="btn-primary btn-full">Ver Perfil</button>
            </div>
        </div>
    `).join('');
}

// Configurar modal de adopción
function setupAdoptionModal() {
    const adoptBtn = document.getElementById('adoptBtn');
    const adoptionModal = document.getElementById('adoptionModal');
    
    if (adoptBtn && adoptionModal) {
        adoptBtn.addEventListener('click', function() {
            handleAdoptionRequest();
            openAdoptionModal();
        });
    }
}

function handleAdoptionRequest() {
    if (!currentPet) return;

    const requests = getAdoptionRequests();
    const newRequest = {
        idSolicitud: Date.now(),
        idMascota: currentPet.id,
        nombreMascota: currentPet.name,
        fecha: new Date().toISOString(),
        estado: 'En Revisión'
    };

    requests.push(newRequest);
    localStorage.setItem('adoptionRequests', JSON.stringify(requests));

    alert('Solicitud enviada exitosamente');
}

function getAdoptionRequests() {
    try {
        return JSON.parse(localStorage.getItem('adoptionRequests')) || [];
    } catch (error) {
        console.error('Error leyendo solicitudes de adopción', error);
        return [];
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
                    <button type="button" class="btn-outline" onclick="closeModal('adoptionModal')">Cancelar</button>
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
