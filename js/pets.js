// js/pets.js
// CRUD de mascotas y renderizado de listados

document.addEventListener('DOMContentLoaded', () => {
    const addForm = document.getElementById('addPetForm');
    const petList = document.getElementById('petList');
    const ownerInput = document.getElementById('petOwner');

    const user = getSessionUser();
    if (ownerInput && user?.organization) ownerInput.value = user.organization;

    if (addForm) addForm.addEventListener('submit', submitPetForm);
    if (petList) loadPets();
});

async function loadPets() {
    try {
        const res = await apiFetch('/pets');
        if (!res.ok) throw new Error('No se pudieron cargar las mascotas');
        const data = await res.json();
        renderPetList(data);
    } catch (error) {
        console.error(error);
        renderPetList([]);
    }
}

function renderPetList(pets) {
    const list = document.getElementById('petList');
    if (!list) return;
    if (!pets.length) {
        list.innerHTML = '<p>No hay mascotas registradas.</p>';
        return;
    }
    list.innerHTML = pets.map((pet) => `
        <article class="card pet-card" data-pet-id="${pet.id}">
            <div class="pet-card__header">
                <div>
                    <h3>${pet.name}</h3>
                    <p class="muted">${pet.species} · ${pet.size || 'Tamaño n/d'} · ${pet.age || 'Edad n/d'}</p>
                </div>
                <span class="status status-${pet.status || 'disponible'}">${pet.status || 'disponible'}</span>
            </div>
            <p>${pet.description || 'Sin descripción'}</p>
            <div class="pet-card__actions">
                <a class="btn-link" href="pet-profile.html?id=${pet.id}">Ver ficha</a>
                <button class="btn-outline" onclick="startEditPet('${pet.id}')">Editar</button>
                <button class="btn-text danger" onclick="deletePet('${pet.id}')">Eliminar</button>
            </div>
        </article>
    `).join('');
}

async function submitPetForm(event) {
    event.preventDefault();
    const form = event.target;
    const data = new FormData(form);
    const petId = form.dataset.editingId;
    try {
        form.querySelector('button[type="submit"]').disabled = true;
        const url = petId ? `/pets/${petId}` : '/pets';
        const method = petId ? 'PUT' : 'POST';
        const res = await apiFetch(url, { method, body: JSON.stringify(Object.fromEntries(data.entries())) });
        if (!res.ok) throw new Error('No se pudo guardar');
        form.reset();
        form.dataset.editingId = '';
        document.getElementById('formStatus').textContent = 'Mascota guardada correctamente';
        loadPets();
    } catch (error) {
        console.error(error);
        document.getElementById('formStatus').textContent = 'Error al guardar la mascota';
    } finally {
        form.querySelector('button[type="submit"]').disabled = false;
    }
}

async function startEditPet(id) {
    try {
        const res = await apiFetch(`/pets/${id}`);
        if (!res.ok) throw new Error('No se pudo cargar la mascota');
        const pet = await res.json();
        const form = document.getElementById('addPetForm');
        ['name', 'species', 'age', 'size', 'status', 'description', 'shelter'].forEach((field) => {
            if (form.elements[field]) form.elements[field].value = pet[field] || '';
        });
        form.dataset.editingId = id;
        document.getElementById('formStatus').textContent = 'Editando mascota existente';
    } catch (error) {
        console.error(error);
    }
}

async function deletePet(id) {
    if (!confirm('¿Eliminar esta mascota?')) return;
    try {
        const res = await apiFetch(`/pets/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('No se pudo eliminar');
        loadPets();
    } catch (error) {
        console.error(error);
        alert('No se pudo eliminar la mascota');
    }
}

async function loadPetProfile() {
    const params = new URLSearchParams(window.location.search);
    const petId = params.get('id');
    if (!petId) return;
    try {
        const res = await apiFetch(`/pets/${petId}`);
        if (!res.ok) throw new Error('No se pudo cargar la mascota');
        const pet = await res.json();
        renderPetProfile(pet);
    } catch (error) {
        console.error(error);
    }
}

function renderPetProfile(pet) {
    const card = document.getElementById('petProfileCard');
    if (!card) return;
    card.querySelector('[data-field="name"]').textContent = pet.name;
    card.querySelector('[data-field="description"]').textContent = pet.description || 'Sin descripción';
    card.querySelector('[data-field="meta"]').textContent = `${pet.species} · ${pet.size || 'Tamaño n/d'} · ${pet.age || 'Edad n/d'}`;
    const ownerBox = card.querySelector('[data-field="owner"]');
    if (ownerBox) ownerBox.textContent = pet.owner ? `${pet.owner.name} (${pet.owner.contact})` : 'Sin dueño registrado';
    const status = card.querySelector('[data-field="status"]');
    if (status) status.textContent = pet.status || 'disponible';
}

document.addEventListener('DOMContentLoaded', loadPetProfile);
