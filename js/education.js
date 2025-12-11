// js/education.js

// --- BASE DE DATOS DE ARTÍCULOS (Con Emojis en los Títulos) ---
const articlesDB = [
    // 1. CUIDADOS BÁSICOS
    {
        id: 1,
        category: "cuidados-basicos",
        title: "🥩 Nutrición: ¿Qué debe comer tu mascota?",
        excerpt: "Guía completa sobre alimentación balanceada, croquetas vs comida casera y alimentos prohibidos.",
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
        id: 2,
        category: "cuidados-basicos",
        title: "🛁 Higiene y Baño: Mitos y Realidades",
        excerpt: "¿Cada cuánto bañar a un perro? ¿Los gatos se bañan? Todo sobre la limpieza.",
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

    // 2. SALUD Y PREVENCIÓN
    {
        id: 3,
        category: "salud-prevencion",
        title: "💉 Calendario de Vacunación Esencial",
        excerpt: "Protege a tu mejor amigo de enfermedades mortales como el Parvovirus y el Moquillo.",
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
            <p><em>*Los adultos necesitan refuerzos anuales.</em></p>
        `
    },
    {
        id: 4,
        category: "salud-prevencion",
        title: "❤️ Esterilización: Un Acto de Amor",
        excerpt: "Desmentimos los mitos sobre la esterilización y explicamos sus beneficios médicos.",
        image: "https://images.unsplash.com/photo-1599443015574-be5fe8a05783?auto=format&fit=crop&w=500&q=60",
        content: `
            <h3>Beneficios Médicos</h3>
            <ul>
                <li><strong>Hembras:</strong> Elimina riesgo de infecciones uterinas y reduce tumores mamarios.</li>
                <li><strong>Machos:</strong> Previene cáncer testicular y problemas de próstata.</li>
            </ul>
            <h3>Beneficios de Comportamiento</h3>
            <p>Reduce el marcaje, la agresividad y el instinto de escapar para buscar pareja.</p>
            <h3>Mito: "Deben tener una camada"</h3>
            <p><strong>Falso.</strong> No hay beneficio médico. Esterilizar antes del primer celo es lo más saludable.</p>
        `
    },

    // 3. ENTRENAMIENTO
    {
        id: 5,
        category: "entrenamiento",
        title: "🎓 Entrenamiento en Positivo",
        excerpt: "Cómo educar sin castigos y lograr un vínculo de confianza inquebrantable.",
        image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=500&q=60",
        content: `
            <h3>¿Qué es?</h3>
            <p>Premiar las conductas deseadas en lugar de castigar las malas. El cerebro aprende más rápido buscando la recompensa.</p>
            <h3>Reglas de Oro</h3>
            <ol>
                <li><strong>Timing:</strong> Premia en el instante exacto de la acción.</li>
                <li><strong>Consistencia:</strong> Las reglas deben ser siempre las mismas.</li>
                <li><strong>Paciencia:</strong> Sesiones cortas y divertidas (5-10 min) son mejores.</li>
            </ol>
        `
    },

    // 4. ADOPCIÓN
    {
        id: 6,
        category: "adopcion-responsable",
        title: "🏠 La Regla del 3-3-3 en Adopción",
        excerpt: "Entiende las etapas emocionales por las que pasa un perro rescatado al llegar a casa.",
        image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=500&q=60",
        content: `
            <h3>3 Días: Descompresión</h3>
            <p>Puede estar asustado o esconderse. Dale espacio, no lo abrumes.</p>
            <h3>3 Semanas: Rutina</h3>
            <p>Empieza a entender su nueva vida y a mostrar su personalidad. Establece horarios claros.</p>
            <h3>3 Meses: Pertenencia</h3>
            <p>Ya se siente en casa y confía en ti. Verás su mejor versión.</p>
            <p><strong>La paciencia es clave para una adaptación exitosa.</strong></p>
        `
    }
];

// --- RENDERIZADO EN EL HTML ---
document.addEventListener('DOMContentLoaded', () => {
    renderArticles();
    loadFeaturedArticles();
});

function renderArticles() {
    articlesDB.forEach(article => {
        const cardHTML = createCardHTML(article);
        let containerId = "";
        if (article.category === 'cuidados-basicos') containerId = 'cuidadosArticles';
        else if (article.category === 'salud-prevencion') containerId = 'saludArticles';
        else if (article.category === 'entrenamiento') containerId = 'entrenamientoArticles';
        else if (article.category === 'adopcion-responsable') containerId = 'adopcionArticles';

        const container = document.getElementById(containerId);
        if (container) container.innerHTML += cardHTML;
    });
}

function loadFeaturedArticles() {
    const featuredContainer = document.getElementById('featuredArticles');
    if(featuredContainer) {
        articlesDB.slice(0, 3).forEach(article => {
            featuredContainer.innerHTML += createCardHTML(article);
        });
    }
}

function createCardHTML(article) {
    return `
        <article class="article-card">
            <div class="article-img" style="background-image: url('${article.image}');"></div>
            <div class="article-content">
                <h3 class="article-title">${article.title}</h3>
                <p class="article-excerpt">${article.excerpt}</p>
                <button class="btn-primary btn-full" onclick="openArticleModal(${article.id})">Leer Artículo</button>
            </div>
        </article>
    `;
}

// --- LÓGICA DEL MODAL (Aquí está el cambio principal) ---
function openArticleModal(id) {
    const article = articlesDB.find(a => a.id === id);
    if (!article) return;

    const modalContent = document.getElementById('articleModalContent');
    
    // AQUÍ QUITAMOS LA IMAGEN Y AJUSTAMOS EL PADDING
    modalContent.innerHTML = `
        <div style="padding: 40px 30px 30px;"> <span class="tag" style="background:var(--primary); color:white; padding:5px 10px; border-radius:15px; font-size:0.8rem;">
                ${article.category.replace('-', ' ').toUpperCase()}
            </span>
            <h2 style="margin: 15px 0; color:var(--dark); font-size:2rem;">
                ${article.title} </h2>
            <div style="line-height: 1.8; color:#444; font-size:1.1rem;">
                ${article.content}
            </div>
            <hr style="margin:30px 0; border:0; border-top:1px solid #eee;">
            <div style="text-align:center;">
                <p style="color:#666; font-style:italic;">Contenido verificado por equipo veterinario The Loyal Nest 🩺</p>
                <button onclick="closeModal('articleModal')" class="btn-outline">Cerrar lectura</button>
            </div>
        </div>
    `;

    const modal = document.getElementById('articleModal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

window.onclick = function(event) {
    const modal = document.getElementById('articleModal');
    if (event.target == modal) closeModal('articleModal');
}
// Agrega esto al final de js/education.js

// --- RECURSOS DESCARGABLES (EXTRA) ---
document.addEventListener('DOMContentLoaded', () => {
    // ... las otras funciones ...
    loadResources(); // <--- Agrega esta llamada
});

function loadResources() {
    const container = document.getElementById('resourcesGrid');
    if(!container) return;

    const resources = [
        { title: "Guía de Cachorros", size: "2.4 MB", icon: "🐶" },
        { title: "Cartilla de Vacunación", size: "1.1 MB", icon: "💉" },
        { title: "Manual de Adopción", size: "3.5 MB", icon: "🏠" },
        { title: "Lista de Alimentos Tóxicos", size: "0.5 MB", icon: "⚠️" }
    ];

    container.innerHTML = resources.map(res => `
        <div class="resource-card" onclick="alert('Descargando ${res.title}...')">
            <div style="font-size:3rem; margin-bottom:10px;">${res.icon}</div>
            <h3 style="font-size:1.1rem; margin:0;">${res.title}</h3>
            <p style="color:#666; font-size:0.9rem;">PDF • ${res.size}</p>
            <button class="btn-outline btn-small" style="margin-top:10px;">⬇ Descargar</button>
        </div>
    `).join('');
}
