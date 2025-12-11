// js/search.js
// Búsqueda de mascotas con filtros y paginación básica

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('searchForm');
    if (form) form.addEventListener('submit', handleSearch);
    hydrateFromQuery();
    loadSearchResults();
});

let currentPage = 1;

function hydrateFromQuery() {
    const params = new URLSearchParams(window.location.search);
    const form = document.getElementById('searchForm');
    if (!form) return;
    ['species', 'size', 'location', 'ageMin', 'ageMax'].forEach((key) => {
        if (params.has(key) && form.elements[key]) form.elements[key].value = params.get(key);
    });
    currentPage = parseInt(params.get('page') || '1', 10);
}

async function handleSearch(event) {
    event.preventDefault();
    currentPage = 1;
    updateQueryFromForm();
    await loadSearchResults();
}

function updateQueryFromForm() {
    const form = document.getElementById('searchForm');
    const params = new URLSearchParams();
    ['species', 'size', 'location', 'ageMin', 'ageMax'].forEach((key) => {
        const value = form.elements[key]?.value;
        if (value) params.set(key, value);
    });
    params.set('page', String(currentPage));
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
}

async function loadSearchResults() {
    const form = document.getElementById('searchForm');
    const params = new URLSearchParams(window.location.search);
    const query = Object.fromEntries(params.entries());
    try {
        const res = await apiFetch(`/pets/search?${params.toString()}`);
        if (!res.ok) throw new Error('No se pudieron cargar los resultados');
        const data = await res.json();
        renderSearchResults(data.items || data);
        renderPagination(data.meta || {});
    } catch (error) {
        console.error(error);
        renderSearchResults([]);
        if (form) form.querySelector('.form-status').textContent = 'No se pudo cargar la búsqueda';
    }
}

function renderSearchResults(items) {
    const container = document.getElementById('searchResults');
    if (!container) return;
    if (!items.length) {
        container.innerHTML = '<p>No hay coincidencias.</p>';
        return;
    }
    container.innerHTML = items.map((pet) => `
        <article class="card pet-card">
            <div class="pet-card__header">
                <div>
                    <h3>${pet.name}</h3>
                    <p class="muted">${pet.species} · ${pet.size || 'Tamaño n/d'} · ${pet.age || 'Edad n/d'}</p>
                </div>
                <span class="status status-${pet.status || 'disponible'}">${pet.status || 'disponible'}</span>
            </div>
            <p>${pet.description || ''}</p>
            <div class="pet-card__actions">
                <a class="btn-link" href="pet-profile.html?id=${pet.id}">Ver detalles</a>
            </div>
        </article>
    `).join('');
}

function renderPagination(meta) {
    const pagination = document.getElementById('searchPagination');
    if (!pagination) return;
    const totalPages = meta.pages || 1;
    pagination.innerHTML = '';
    for (let page = 1; page <= totalPages; page++) {
        const btn = document.createElement('button');
        btn.textContent = page;
        btn.className = page === meta.page ? 'btn-primary' : 'btn-outline';
        btn.addEventListener('click', () => {
            currentPage = page;
            const form = document.getElementById('searchForm');
            updateQueryFromForm(form);
            loadSearchResults();
        });
        pagination.appendChild(btn);
    }
}
