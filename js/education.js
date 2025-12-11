// js/education.js

// --- 1. BASE DE DATOS DE ARTÍCULOS ---
// He puesto la MISMA imagen en todos para que no falle ninguna.
const commonImage = "https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=600&q=80";

const articlesDB = [
    {
        id: 1, category: "cuidados-basicos", title: "🥩 Nutrición: ¿Qué debe comer tu mascota?",
        excerpt: "Guía completa sobre alimentación balanceada.",
        image: commonImage, // <--- Misma imagen
        content: `<h3>La base de una vida sana</h3><p>La nutrición es el pilar de la salud. Perros y gatos necesitan principalmente <strong>proteína animal</strong>.</p><h3>⚠️ Alimentos Prohibidos</h3><p>Nunca des: Chocolate, Cebolla, Uvas, Huesos cocidos o Alcohol.</p>`
    },
    {
        id: 2, category: "cuidados-basicos", title: "🛁 Higiene y Baño",
        excerpt: "¿Cada cuánto bañar a un perro?",
        image: commonImage, // <--- Misma imagen
        content: `<h3>Perros: Frecuencia</h3><p>Báñalo <strong>una vez al mes</strong>. Hacerlo seguido daña su piel.</p><h3>Gatos</h3><p>No, ellos se limpian solos.</p>`
    },
    {
        id: 3, category: "salud-prevencion", title: "💉 Calendario de Vacunación",
        excerpt: "Protege a tu mejor amigo.",
        image: commonImage, // <--- Misma imagen
        content: `<h3>Perros</h3><ul><li>6 semanas: Puppy</li><li>6 meses: Rabia</li></ul><h3>Gatos</h3><p>Triple Felina y Rabia son esenciales.</p>`
    },
    {
        id: 4, category: "salud-prevencion", title: "❤️ Esterilización",
        excerpt: "Beneficios médicos y de comportamiento.",
        image: commonImage, // <--- Misma imagen
        content: `<h3>Beneficios</h3><p>Evita tumores, cáncer y controla la sobrepoblación.</p>`
    },
    {
        id: 5, category: "entrenamiento", title: "🎓 Entrenamiento Positivo",
        excerpt: "Educar sin castigos.",
        image: commonImage, // <--- Misma imagen
        content: `<h3>¿Cómo funciona?</h3><p>Premia lo bueno, ignora lo malo. Sé constante y ten paciencia.</p>`
    },
    {
        id: 6, category: "adopcion-responsable", title: "🏠 Regla del 3-3-3",
        excerpt: "Etapas de adaptación.",
        image: commonImage, // <--- Misma imagen
        content: `<h3>3 Días</h3><p>Descompresión.</p><h3>3 Semanas</h3><p>Rutina.</p><h3>3 Meses</h3><p>Pertenencia.</p>`
    }
];

// --- 2. RENDERIZADO INICIAL ---
document.addEventListener('DOMContentLoaded', () => {
    renderArticles();
    loadFeatured();
    // loadResources(); // Descomenta si quieres los recursos descargables
});

function renderArticles() {
    articlesDB.forEach(article => {
        let containerId = "";
        if (article.category === 'cuidados-basicos') containerId = 'cuidadosArticles';
        else if (article.category === 'salud-prevencion') containerId = 'saludArticles';
        else if (article.category === 'entrenamiento') containerId = 'entrenamientoArticles';
        else if (article.category === 'adopcion-responsable') containerId = 'adopcionArticles';

        const container = document.getElementById(containerId);
        if (container) container.innerHTML += createCard(article);
    });
}

function loadFeatured() {
    const featured = document.getElementById('featuredArticles');
    if(featured) articlesDB.slice(0, 3).forEach(a => featured.innerHTML += createCard(a));
}

function createCard(article) {
    return `
        <article class="article-card" onclick="openModalArticle(${article.id})">
            <div class="article-image" style="background-image: url('${article.image}'); background-size: cover;"></div>
            <div class="article-content">
                <h3 class="article-title">${article.title}</h3>
                <p class="article-excerpt">${article.excerpt}</p>
                <button class="btn-primary btn-full">Leer más</button>
            </div>
        </article>
    `;
}

// --- 3. MODAL DE ARTÍCULOS ---
function openModalArticle(id) {
    const article = articlesDB.find(a => a.id === id);
    if (!article) return;

    const modalContent = document.getElementById('articleModalContent');
    
    // Contenido inyectado (Modal limpio y ordenado)
    modalContent.innerHTML = `
        <div class="modal-injected-content">
            <div style="text-align: right; margin-bottom: 10px;">
                <span class="tag" style="background:var(--primary); color:white; padding:4px 10px; border-radius:12px; font-size:0.8rem;">
                    ${article.category.replace('-', ' ').toUpperCase()}
                </span>
            </div>
            
            <h2 style="font-size: 1.8rem; color: #333; margin-bottom: 20px;">${article.title}</h2>
            
            <div style="font-size: 1.1rem; line-height: 1.6; color: #444;">
                ${article.content}
            </div>

            <div style="margin-top: 30px; text-align: center; border-top: 1px solid #eee; padding-top: 20px;">
                <button onclick="closeModal('articleModal')" class="btn-outline">Cerrar</button>
            </div>
        </div>
    `;

    const modal = document.getElementById('articleModal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
    document.body.style.overflow = 'auto';
}

window.onclick = function(e) {
    const m = document.getElementById('articleModal');
    if (e.target == m) closeModal('articleModal');
}
