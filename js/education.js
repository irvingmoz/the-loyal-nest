// js/education.js
// Carga de recursos educativos y favoritos por usuario

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('educationSearch');
    if (searchInput) searchInput.addEventListener('input', filterEducation);
    loadEducation();
});

let educationItems = [];

async function loadEducation() {
    try {
        const res = await fetch('/education.json');
        educationItems = res.ok ? await res.json() : [];
        renderEducation(educationItems);
    } catch (error) {
        console.error(error);
        educationItems = [];
        renderEducation([]);
    }
}

function filterEducation(event) {
    const term = event.target.value.toLowerCase();
    const filtered = educationItems.filter((item) =>
        item.title.toLowerCase().includes(term) || item.category.toLowerCase().includes(term)
    );
    renderEducation(filtered);
}

function toggleFavorite(id) {
    const favorites = new Set(JSON.parse(localStorage.getItem('education_fav') || '[]'));
    if (favorites.has(id)) favorites.delete(id); else favorites.add(id);
    localStorage.setItem('education_fav', JSON.stringify(Array.from(favorites)));
    renderEducation(educationItems);
}

function renderEducation(items) {
    const container = document.getElementById('educationList');
    if (!container) return;
    const favorites = new Set(JSON.parse(localStorage.getItem('education_fav') || '[]'));
    if (!items.length) {
        container.innerHTML = '<p>No hay recursos disponibles.</p>';
        return;
    }
    container.innerHTML = items.map((item) => `
        <article class="card">
            <div class="card-row">
                <div>
                    <h3>${item.title}</h3>
                    <p class="muted">${item.category}</p>
                </div>
                <button class="btn-text" onclick="toggleFavorite('${item.id}')">
                    ${favorites.has(item.id) ? '★ Favorito' : '☆ Guardar'}
                </button>
            </div>
            <p>${item.body}</p>
        </article>
    `).join('');
}
