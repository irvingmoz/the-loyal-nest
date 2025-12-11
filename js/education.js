// js/education.js

// --- BASE DE DATOS DE ARTÍCULOS ---
const articlesDB = [
    // 1. CUIDADOS BÁSICOS
    {
        id: 1, category: "cuidados-basicos",
        title: "🥩 Nutrición: ¿Qué debe comer tu mascota?",
        excerpt: "Guía completa sobre alimentación balanceada.",
        image: "https://images.unsplash.com/photo-1589924691195-41432c84c161?auto=format&fit=crop&w=500&q=60",
        content: `
            <h3>La base de una vida sana</h3>
            <p>La nutrición es el pilar de la salud de tu mascota. Tanto perros como gatos son carnívoros, por lo que su dieta debe basarse principalmente en <strong>proteína animal</strong> de alta calidad.</p>
            <h3>¿Croquetas o Comida Casera?</h3>
            <ul>
                <li><strong>Croquetas (Pienso):</strong> Busca marcas donde el primer ingrediente sea carne (pollo, res, pescado) y no cereales.</li>
                <li><strong>Dieta BARF/Casera:</strong> Excelente si está supervisada por un veterinario nutricionista.</li>
            </ul>
            <h3>⚠️ Alimentos Prohibidos</h3>
            <p>Nunca des: Chocolate, Cebolla/Ajo, Uvas/Pasas, Huesos cocidos o Alcohol.</p>
        `
    },
    {
        id: 2, category: "cuidados-basicos",
        title: "🛁 Higiene y Baño: Mitos y Realidades",
        excerpt: "¿Cada cuánto bañar a un perro?",
        image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=500&q=60",
        content: `
            <h3>Perros: Frecuencia de Baño</h3>
            <p>Lo recomendable es hacerlo <strong>una vez cada 3 o 4 semanas</strong>. Bañarlos seguido daña su piel. Usa siempre champú para perros.</p>
            <h3>Gatos: ¿Se bañan?</h3>
            <p>Generalmente, no. Se acicalan solos y el baño les estresa. Solo hazlo si es estrictamente necesario.</p>
            <h3>🦷 Cepillado y Dientes</h3>
            <p>El cepillado diario es clave para eliminar pelo muerto. Intenta también cepillar sus dientes 2-3 veces por semana para evitar sarro.</p>
        `
    },
    // 2. SALUD
    {
        id: 3, category: "salud-prevencion",
        title: "💉 Calendario de Vacunación Esencial",
        excerpt: "Protege a tu mejor amigo de enfermedades mortales.",
        image: "https://images.unsplash.com/photo-1628009368231-760335298025?auto=format&fit=crop&w=500&q=60",
        content: `
            <h3>Perros (Cachorros)</h3>
            <ul>
                <li><strong>6 semanas:</strong> Puppy (Parvovirus/Moquillo).</li>
                <li><strong>8-16 semanas:</strong> Refuerzos de Polivalente.</li>
                <li><strong>4-6 meses:</strong> Rabia (Obligatoria).</li>
            </ul>
            <h3>Gatos</h3>
            <p>Requieren la <strong>Triple Felina</strong> y Rabia. Considera Leucemia si salen.</p>
        `
    },
    {
        id: 4, category: "salud-prevencion",
        title: "❤️ Esterilización: Un Acto de Amor",
        excerpt: "Desmentimos los mitos sobre la esterilización.",
        image: "https://images.unsplash.com/photo-1599443015574-be5fe8a05783?auto=format&fit=crop&w=500&q=60",
        content: `
            <h3>Beneficios Médicos</h3>
            <ul>
                <li><strong>Hembras:</strong> Elimina riesgo de infecciones uterinas y reduce tumores mamarios.</li>
                <li><strong>Machos:</strong> Previene cáncer testicular.</li>
            </ul>
            <h3>Mito: "Deben tener una camada"</h3>
            <p><strong>Falso.</strong> No hay beneficio médico. Esterilizar antes del primer celo es lo más saludable.</p>
        `
    },
    // 3. ENTRENAMIENTO
    {
        id: 5, category: "entrenamiento",
        title: "🎓 Entrenamiento en Positivo",
        excerpt: "Cómo educar sin castigos.",
        image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=500&q=60",
        content: `
            <h3>¿Qué es?</h3>
            <p>Premiar las conductas deseadas en lugar de castigar las malas. El cerebro aprende más rápido buscando la recompensa.</p>
            <h3>Reglas de Oro</h3>
            <ol>
                <li><strong>Timing:</strong> Premia en el instante exacto.</li>
                <li><strong>Consistencia:</strong> Las reglas deben ser siempre las mismas.</li>
                <li><strong>Paciencia:</strong> Sesiones cortas (5-10 min) son mejores.</li>
            </ol>
        `
    },
    // 4. ADOPCIÓN
    {
        id: 6, category: "adopcion-responsable",
        title: "🏠 La Regla del 3-3-3",
        excerpt: "Etapas emocionales de un perro adoptado.",
        image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=500&q=60",
        content: `
            <h3>3 Días: Descompresión</h3>
            <p>Puede estar asustado o esconderse. Dale espacio.</p>
            <h3>3 Semanas: Rutina</h3>
            <p>Empieza a entender su nueva vida y a mostrar su personalidad.</p>
            <h3>3 Meses: Pertenencia</h3>
            <p>Ya se siente en casa y confía en ti. Verás su mejor versión.</p>
        `
    }
];

// --- RENDERIZADO ---
document.addEventListener('DOMContentLoaded', () => {
    renderArticles();
    loadFeatured();
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
    if(featured) {
        articlesDB.slice(0, 3).forEach(a => featured.innerHTML += createCard(a));
    }
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

// --- MODAL LIMPIO ---
function openModalArticle(id) {
    const article = articlesDB.find(a => a.id === id);
    if (!article) return;

    const modalContent = document.getElementById('articleModalContent');
    
    // Contenido inyectado (Sin imagen gigante, solo texto limpio)
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
