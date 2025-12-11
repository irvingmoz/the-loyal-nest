// =============================
//     BASE DE MASCOTAS (CATÁLOGO)
// (La edad se cambió a un valor numérico en años para facilitar la lógica de filtrado)
// =============================
const pets = [
    {
        id: 1,
        name: 'Bruno',
        species: 'perro',
        breed: 'Labrador',
        size: 'grande',
        age: 3, // Edad en años
        temperament: 'juguetón y sociable',
        description: 'Bruno es un labrador chocolate que ama las caminatas largas y convivir con niños.',
        image: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=800&h=600&fit=crop'
    },
    {
        id: 2,
        name: 'Maya',
        species: 'perro',
        breed: 'Corgi',
        size: 'mediano',
        age: 0.8, // 9 meses (cachorro)
        temperament: 'tierna y curiosa',
        description: 'Maya disfruta aprender trucos nuevos y siempre busca estar cerca de su familia.',
        image: 'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=800&h=600&fit=crop'
    },
    {
        id: 3,
        name: 'Luna',
        species: 'gato',
        breed: 'Mestizo',
        size: 'pequeño',
        age: 1, // 1 año (adulto joven)
        temperament: 'tranquila y observadora',
        description: 'Luna es una gatita negra de ojos grandes que adora las siestas al sol y los sillones cómodos.',
        image: 'https://images.unsplash.com/photo-1455970022149-a8f26b6902dd?w=800&h=600&fit=crop'
    },
    {
        id: 4,
        name: 'Simón',
        species: 'perro',
        breed: 'Pastor Alemán',
        size: 'grande',
        age: 4, // Edad en años
        temperament: 'leal y protector',
        description: 'Simón es muy inteligente, sabe órdenes básicas y busca un hogar con espacio para ejercitarse.',
        image: 'https://images.unsplash.com/photo-1619983081563-430f63602796?w=800&h=600&fit=crop'
    },
    {
        id: 5,
        name: 'Nala',
        species: 'gato',
        breed: 'Siamesa',
        size: 'mediano',
        age: 10, // Senior (para prueba)
        temperament: 'afectuosa y vocal',
        description: 'Nala sigue a su humano a todas partes, le encanta platicar y recibir caricias en la barbilla.',
        image: 'https://images.unsplash.com/photo-1472491235688-bdc81a63246e?w=800&h=600&fit=crop'
    },
    {
        id: 6,
        name: 'Taco',
        species: 'perro',
        breed: 'Chihuahua',
        size: 'pequeño',
        age: 2, // Edad en años
        temperament: 'alegre y valiente',
        description: 'Taco es diminuto pero con gran personalidad; disfruta los paseos cortos y acurrucarse.',
        image: 'https://images.unsplash.com/photo-1525253013412-55c1a69a5738?w=800&h=600&fit=crop'
    },
    {
        id: 7,
        name: 'Kiara',
        species: 'perro',
        breed: 'Golden Retriever',
        size: 'grande',
        age: 5, // Edad en años
        temperament: 'dulce y paciente',
        description: 'Kiara es una golden color miel que adora el agua y se lleva excelente con otros perros.',
        image: 'https://images.unsplash.com/photo-1504595403659-9088ce801e29?w=800&h=600&fit=crop'
    },
    {
        id: 8,
        name: 'Michi',
        species: 'gato',
        breed: 'Atigrado',
        size: 'mediano',
        age: 0.5, // 6 meses (cachorro)
        temperament: 'juguetón y adaptable',
        description: 'Michi es un gato atigrado que disfruta los rascadores y convivir con otros gatos.',
        image: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=800&h=600&fit=crop'
    },
    {
        id: 9,
        name: 'Rocco',
        species: 'perro',
        breed: 'Husky',
        size: 'grande',
        age: 3, // Edad en años
        temperament: 'enérgico y charlador',
        description: 'Rocco ama correr, necesita actividad diaria y mucha atención de su familia humana.',
        image: 'https://images.unsplash.com/photo-1534338580013-382cf48bd435?w=800&h=600&fit=crop'
    },
    {
        id: 10,
        name: 'Milo',
        species: 'gato',
        breed: 'Ragdoll',
        size: 'grande',
        age: 1.5, // 1 año y medio
        temperament: 'relajado y cariñoso',
        description: 'Milo es un gigante gentil que busca un hogar tranquilo y muchas caricias.',
        image: 'https://images.unsplash.com/photo-1596854407944-be1f4503724c?w=800&h=600&fit=crop'
    }
];

// =============================
//     VARIABLES GLOBALES
// =============================
let activeSpecies = '';
let selectedPet = null;
const storageKey = 'loyalNestAdoptionRequests';

// =============================
//     MANEJO DE SOLICITUDES
// =============================
function getSavedRequests() {
    try {
        const saved = localStorage.getItem(storageKey);
        return saved ? JSON.parse(saved) : [];
    } catch (error) {
        console.error('No se pudieron leer las solicitudes', error);
        return [];
    }
}

function saveRequests(requests) {
    try {
        localStorage.setItem(storageKey, JSON.stringify(requests));
    } catch (error) {
        console.error('No se pudieron guardar las solicitudes', error);
    }
}

// =============================
//     FILTROS Y CATÁLOGO
// =============================
function renderBreedOptions() {
    const breedSelect = document.getElementById('filterBreed');
    if (!breedSelect) return;

    const breeds = new Set();
    pets.forEach((pet) => {
        if (!activeSpecies || pet.species === activeSpecies) breeds.add(pet.breed);
    });

    breedSelect.innerHTML =
        '<option value="">Raza</option>' + // Asegura que la opción Raza siempre esté
        [...breeds].sort().map((b) => `<option value="${b.toLowerCase()}">${b}</option>`).join('');
}

function filterPets() {
    const searchTerm = document.getElementById('filterSearch').value.toLowerCase();
    const breed = document.getElementById('filterBreed').value;
    const size = document.getElementById('filterSize').value;
    const ageFilter = document.getElementById('filterAge').value; // ⬅️ NUEVO: Capturar filtro de edad

    return pets.filter((pet) => {
        const matchSpecies = activeSpecies ? pet.species === activeSpecies : true;
        const matchBreed = breed ? pet.breed.toLowerCase() === breed : true;
        const matchSize = size ? pet.size === size : true;

        // ⬅️ Lógica del filtro de edad (Cachorro/Adulto/Senior)
        let matchAge = true;
        if (ageFilter) {
            const petAge = pet.age;
            if (ageFilter === 'cachorro') {
                matchAge = petAge < 1; // Menos de 1 año
            } else if (ageFilter === 'adulto') {
                matchAge = petAge >= 1 && petAge <= 7; // Entre 1 y 7 años
            } else if (ageFilter === 'senior') {
                matchAge = petAge > 7; // Más de 7 años
            }
        }
        
        const matchTerm = searchTerm
            ? `${pet.name} ${pet.description} ${pet.temperament}`.toLowerCase().includes(searchTerm)
            : true;

        return matchSpecies && matchBreed && matchSize && matchAge && matchTerm; // ⬅️ Incluir matchAge en la condición
    });
}

function getAgeDisplay(age) {
    if (age >= 1) {
        return `${Math.floor(age)} años`;
    }
    return `${Math.round(age * 12)} meses`;
}


function renderPets() {
    const container = document.getElementById('searchResults');
    if (!container) return;

    const filtered = filterPets();
    if (!filtered.length) {
        container.innerHTML =
            '<p class="muted">No hay coincidencias con los filtros seleccionados.</p>';
        return;
    }

    container.innerHTML = filtered
        .map(
            (pet) => `
        <article class="pet-card">
            <img src="${pet.image}" alt="${pet.name}" class="pet-card__image">

            <div class="pet-card__meta">
                <div>
                    <h3>${pet.name}</h3>
                    <p class="muted">${pet.breed} · ${getAgeDisplay(pet.age)}</p>
                </div>
                <span class="pet-chip">${pet.species}</span>
            </div>

            <p>${pet.description}</p>

            <div class="pet-card__tags">
                <span>🐾 ${pet.temperament}</span>
                <span>📏 Tamaño ${pet.size}</span>
            </div>

            <div class="pet-card__actions">
                <span class="badge-status">Disponible</span>
                <button class="btn-primary" data-action="open-drawer" data-pet-id="${pet.id}">
                    Ver Perfil / Adoptar
                </button>
            </div>
        </article>
    `
        )
        .join('');
}

function updateSpeciesFilter(target) {
    if (!target.dataset.species) return;

    document
        .querySelectorAll('#speciesFilters .pill')
        .forEach((pill) => pill.classList.remove('pill--active'));

    target.classList.add('pill--active');
    activeSpecies = target.dataset.species;

    renderBreedOptions();
    renderPets();
}

// =============================
//     DRAWER (FORMULARIO)
// =============================
function openDrawer(pId) { // Cambié petId por pId para evitar conflicto con la variable interna
    const drawer = document.getElementById('adoptionDrawer');
    const pet = pets.find((p) => p.id === Number(pId));

    if (!drawer || !pet) return;

    selectedPet = pet;

    drawer.setAttribute('aria-hidden', 'false');
    drawer.querySelector('#drawerPetName').textContent = pet.name;
    drawer.querySelector('#drawerPetMeta').textContent = `${pet.breed} · ${pet.size} · ${getAgeDisplay(pet.age)}`; // Uso de getAgeDisplay
}

function closeDrawer() {
    const drawer = document.getElementById('adoptionDrawer');
    if (!drawer) return;

    drawer.setAttribute('aria-hidden', 'true');
    selectedPet = null;

    document.getElementById('adoptionForm').reset();
}

function submitAdoption(event) {
    event.preventDefault();
    if (!selectedPet) return;

    const formData = new FormData(event.target);

    const newRequest = {
        id: Date.now(),
        petId: selectedPet.id,
        petName: selectedPet.name,
        applicant: formData.get('applicant'),
        email: formData.get('email'),
        message: formData.get('message'),
        status: 'pending',
        createdAt: new Date().toISOString(),
    };

    const requests = [newRequest, ...getSavedRequests()];
    saveRequests(requests);

    renderRequests();
    closeDrawer();

    document.getElementById('adminPanel').scrollIntoView({ behavior: 'smooth' });
}

// =============================
//     PANEL ADMIN DE SOLICITUDES
// =============================
function renderRequests() {
    const requests = getSavedRequests();

    const table = document.getElementById('requestsTable');
    const empty = document.getElementById('requestEmpty');
    const body = document.getElementById('requestsBody');

    if (!table || !empty || !body) return;

    if (!requests.length) {
        table.style.display = 'none';
        empty.style.display = 'block';
        return;
    }

    table.style.display = 'block';
    empty.style.display = 'none';

    body.innerHTML = requests
        .map(
            (req) => `
        <div class="table__row" data-request-id="${req.id}">
            <span>${req.applicant}<br><small class="muted">${req.email}</small></span>
            <span>${req.petName}</span>
            <span class="muted" style="white-space: pre-line;">${req.message}</span>
            <span><span class="status-chip ${req.status}">${req.status}</span></span>
            <span class="table__actions">
                <button class="btn-outline" data-action="approve" data-request-id="${req.id}">Aprobar</button>
                <button class="btn-outline" data-action="reject" data-request-id="${req.id}">Rechazar</button>
            </span>
        </div>
    `
        )
        .join('');
}

function updateRequestStatus(id, status) {
    const requests = getSavedRequests();

    const next = requests.map((req) => (req.id === id ? { ...req, status } : req));

    saveRequests(next);
    renderRequests();
}

// =============================
//     EVENTOS / LISTENERS
// =============================
function setupInteractions() {
    document.getElementById('filterSearch').addEventListener('input', renderPets);
    document.getElementById('filterSize').addEventListener('change', renderPets);
    document.getElementById('filterBreed').addEventListener('change', renderPets);
    document.getElementById('filterAge').addEventListener('change', renderPets); // ⬅️ NUEVO: Listener para el filtro de edad

    document.getElementById('adoptionForm').addEventListener('submit', submitAdoption);
    document.getElementById('closeDrawer').addEventListener('click', closeDrawer);
    document.getElementById('cancelDrawer').addEventListener('click', closeDrawer);

    document.getElementById('scrollToCatalog').addEventListener('click', () => {
        document.getElementById('catalogPanel').scrollIntoView({ behavior: 'smooth' });
    });

    document.getElementById('scrollToRequests').addEventListener('click', () => {
        document.getElementById('adminPanel').scrollIntoView({ behavior: 'smooth' });
    });

    document.getElementById('speciesFilters').addEventListener('click', (event) => {
        if (event.target.matches('.pill')) updateSpeciesFilter(event.target);
    });

    document.getElementById('searchResults').addEventListener('click', (event) => {
        const btn = event.target.closest('[data-action="open-drawer"]');
        if (btn) openDrawer(btn.dataset.petId);
    });

    document.getElementById('requestsBody').addEventListener('click', (event) => {
        const btn = event.target.closest('button[data-action]');
        if (!btn) return;

        const id = Number(btn.dataset.requestId);

        if (btn.dataset.action === 'approve') updateRequestStatus(id, 'approved');
        if (btn.dataset.action === 'reject') updateRequestStatus(id, 'rejected');
    });
}

// =============================
//     INICIO
// =============================
function init() {
    renderBreedOptions();
    renderPets();
    renderRequests();
    setupInteractions();
}

document.addEventListener('DOMContentLoaded', init);
