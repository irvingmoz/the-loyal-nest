// ==========================================
// 1. BASE DE DATOS (CATÁLOGO)
// Nota: La edad ('age') está en AÑOS (0.5 = 6 meses)
// ==========================================
const pets = [
    {
        id: 1,
        name: 'Bruno',
        species: 'perro',
        breed: 'Labrador',
        size: 'grande',
        age: 3,
        temperament: 'juguetón y sociable',
        description: 'Bruno es un labrador chocolate ideal para familias activas.',
        image: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=800&h=600&fit=crop'
    },
    {
        id: 2,
        name: 'Maya',
        species: 'perro',
        breed: 'Corgi',
        size: 'mediano',
        age: 0.8, // Cachorro (menos de 1 año)
        temperament: 'tierna y curiosa',
        description: 'Maya es pequeña pero con mucha personalidad. Ama aprender trucos.',
        image: 'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=800&h=600&fit=crop'
    },
    {
        id: 3,
        name: 'Luna',
        species: 'gato',
        breed: 'Mestizo',
        size: 'pequeño',
        age: 1, // Adulto joven
        temperament: 'tranquila',
        description: 'Luna es una gatita negra muy elegante y tranquila.',
        image: 'https://images.unsplash.com/photo-1455970022149-a8f26b6902dd?w=800&h=600&fit=crop'
    },
    {
        id: 4,
        name: 'Simón',
        species: 'perro',
        breed: 'Pastor Alemán',
        size: 'grande',
        age: 4,
        temperament: 'leal y protector',
        description: 'Simón es un guardián noble que busca un patio grande.',
        image: 'https://images.unsplash.com/photo-1619983081563-430f63602796?w=800&h=600&fit=crop'
    },
    {
        id: 5,
        name: 'Michi',
        species: 'gato',
        breed: 'Atigrado',
        size: 'mediano',
        age: 0.5, // Cachorro (6 meses)
        temperament: 'juguetón',
        description: 'Michi es un torbellino de energía, ideal para jugar.',
        image: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=800&h=600&fit=crop'
    },
    {
        id: 6,
        name: 'Taco',
        species: 'perro',
        breed: 'Chihuahua',
        size: 'pequeño',
        age: 2,
        temperament: 'valiente',
        description: 'Taco es chiquito pero se cree un león. Muy cariñoso con su dueño.',
        image: 'https://images.unsplash.com/photo-1525253013412-55c1a69a5738?w=800&h=600&fit=crop'
    },
    {
        id: 7,
        name: 'Nala',
        species: 'gato',
        breed: 'Siamesa',
        size: 'mediano',
        age: 8, // Senior
        temperament: 'vocal y cariñosa',
        description: 'Nala es una dama mayor que busca tranquilidad y mimos.',
        image: 'https://images.unsplash.com/photo-1472491235688-bdc81a63246e?w=800&h=600&fit=crop'
    },
    {
        id: 8,
        name: 'Rocco',
        species: 'perro',
        breed: 'Husky',
        size: 'grande',
        age: 3,
        temperament: 'enérgico',
        description: 'Rocco necesita correr a diario. Solo para gente deportista.',
        image: 'https://images.unsplash.com/photo-1534338580013-382cf48bd435?w=800&h=600&fit=crop'
    },
    {
        id: 9,
        name: 'Pelusa',
        species: 'gato',
        breed: 'Persa',
        size: 'grande',
        age: 4,
        temperament: 'perezoso',
        description: 'Pelusa es puro pelo y amor. Le encanta dormir en el sofá.',
        image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&h=600&fit=crop'
    },
    {
        id: 10,
        name: 'Benji',
        species: 'perro',
        breed: 'Mestizo',
        size: 'mediano',
        age: 0.3, // Cachorro muy joven
        temperament: 'tímido',
        description: 'Benji fue rescatado hace poco y busca paciencia y amor.',
        image: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=800&h=600&fit=crop'
    }
];

// ==========================================
// 2. VARIABLES GLOBALES
// ==========================================
let activeSpecies = ''; 
let selectedPet = null;
const storageKey = 'loyalNestRequests';

// ==========================================
// 3. FUNCIONES DE FILTRADO Y RENDERIZADO
// ==========================================

// Convierte edad decimal a texto legible
function getAgeDisplay(age) {
    if (age < 1) {
        return `${Math.floor(age * 12)} meses`;
    }
    return `${age} años`;
}

function renderBreedOptions() {
    const breedSelect = document.getElementById('filterBreed');
    if (!breedSelect) return;

    const breeds = new Set();
    pets.forEach(pet => {
        if (!activeSpecies || pet.species === activeSpecies) {
            breeds.add(pet.breed);
        }
    });

    breedSelect.innerHTML = '<option value="">Todas las razas</option>' + 
        [...breeds].sort().map(b => `<option value="${b.toLowerCase()}">${b}</option>`).join('');
}

function filterPets() {
    const searchTerm = document.getElementById('filterSearch').value.toLowerCase();
    const breed = document.getElementById('filterBreed').value;
    const size = document.getElementById('filterSize').value;
    const ageFilter = document.getElementById('filterAge').value; // <--- FILTRO DE EDAD

    return pets.filter(pet => {
        const matchSpecies = activeSpecies ? pet.species === activeSpecies : true;
        const matchBreed = breed ? pet.breed.toLowerCase() === breed : true;
        const matchSize = size ? pet.size === size : true;
        
        // Lógica de Edad (Cachorro / Adulto / Senior)
        let matchAge = true;
        if (ageFilter === 'cachorro') matchAge = pet.age < 1;
        else if (ageFilter === 'adulto') matchAge = pet.age >= 1 && pet.age <= 7;
        else if (ageFilter === 'senior') matchAge = pet.age > 7;

        const matchTerm = searchTerm ? 
            (pet.name + pet.description + pet.temperament).toLowerCase().includes(searchTerm) : true;

        return matchSpecies && matchBreed && matchSize && matchAge && matchTerm;
    });
}

function renderPets() {
    const container = document.getElementById('searchResults');
    if (!container) return;

    const filtered = filterPets();
    
    if (filtered.length === 0) {
        container.innerHTML = '<div class="no-results">No encontramos mascotas con esos filtros 😢</div>';
        return;
    }

    container.innerHTML = filtered.map(pet => `
        <article class="pet-card">
            <img src="${pet.image}" alt="${pet.name}" class="pet-card__image">
            <div class="pet-card__content">
                <div class="pet-card__header">
                    <h3>${pet.name}</h3>
                    <span class="pet-chip ${pet.species}">${pet.species}</span>
                </div>
                <p class="pet-meta">${pet.breed} · ${getAgeDisplay(pet.age)}</p>
                <p class="pet-desc">${pet.description}</p>
                <div class="pet-tags">
                    <span>🐾 ${pet.temperament}</span>
                    <span>📏 ${pet.size}</span>
                </div>
                <button class="btn-primary full-width" onclick="openDrawer(${pet.id})">
                    Ver Perfil / Adoptar
                </button>
            </div>
        </article>
    `).join('');
}

function updateSpeciesFilter(target) {
    if (!target.dataset.species && target.dataset.species !== "") return;
    
    document.querySelectorAll('#speciesFilters .pill').forEach(p => p.classList.remove('pill--active'));
    target.classList.add('pill--active');
    
    activeSpecies = target.dataset.species;
    renderBreedOptions();
    renderPets();
}

// ==========================================
// 4. DRAWER Y SOLICITUDES
// ==========================================
function openDrawer(id) {
    const drawer = document.getElementById('adoptionDrawer');
    const pet = pets.find(p => p.id === id);
    if (!drawer || !pet) return;

    selectedPet = pet;
    document.getElementById('drawerPetName').textContent = pet.name;
    document.getElementById('drawerPetMeta').textContent = `${pet.breed} · ${getAgeDisplay(pet.age)}`;
    drawer.classList.add('is-open'); // Usamos clase CSS para abrir
}

function closeDrawer() {
    document.getElementById('adoptionDrawer').classList.remove('is-open');
    document.getElementById('adoptionForm').reset();
    selectedPet = null;
}

function submitAdoption(e) {
    e.preventDefault();
    if (!selectedPet) return;

    const formData = new FormData(e.target);
    const newRequest = {
        id: Date.now(),
        petName: selectedPet.name,
        applicant: formData.get('applicant'),
        email: formData.get('email'),
        message: formData.get('message'),
        status: 'pending'
    };

    const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
    saved.unshift(newRequest);
    localStorage.setItem(storageKey, JSON.stringify(saved));

    renderRequests();
    closeDrawer();
    document.getElementById('adminPanel').scrollIntoView({ behavior: 'smooth' });
}

function renderRequests() {
    const container = document.getElementById('requestsBody');
    const emptyMsg = document.getElementById('requestEmpty');
    const table = document.getElementById('requestsTable');
    if (!container) return;

    const requests = JSON.parse(localStorage.getItem(storageKey) || '[]');

    if (requests.length === 0) {
        table.style.display = 'none';
        emptyMsg.style.display = 'block';
        return;
    }

    table.style.display = 'block';
    emptyMsg.style.display = 'none';

    container.innerHTML = requests.map(req => `
        <div class="table-row">
            <div><strong>${req.applicant}</strong><br><small>${req.email}</small></div>
            <div>${req.petName}</div>
            <div class="status-badge ${req.status}">${req.status}</div>
            <div>
                <button class="btn-sm" onclick="alert('Aprobado')">✓</button>
                <button class="btn-sm danger" onclick="alert('Rechazado')">✕</button>
            </div>
        </div>
    `).join('');
}

// ==========================================
// 5. INICIALIZACIÓN (EVENTOS)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Renderizado inicial
    renderBreedOptions();
    renderPets();
    renderRequests();

    // Listeners de Filtros
    document.getElementById('filterSearch').addEventListener('input', renderPets);
    document.getElementById('filterBreed').addEventListener('change', renderPets);
    document.getElementById('filterSize').addEventListener('change', renderPets);
    
    // Listener de Edad (CRÍTICO PARA TU TAREA)
    const ageFilter = document.getElementById('filterAge');
    if(ageFilter) ageFilter.addEventListener('change', renderPets);

    // Listener de Especie (Botones)
    document.getElementById('speciesFilters').addEventListener('click', (e) => {
        if (e.target.classList.contains('pill')) updateSpeciesFilter(e.target);
    });

    // Drawer y Formulario
    document.getElementById('closeDrawer').addEventListener('click', closeDrawer);
    document.getElementById('cancelDrawer').addEventListener('click', closeDrawer);
    document.getElementById('adoptionForm').addEventListener('submit', submitAdoption);
});
