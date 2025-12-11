// js/education.js

// --- BASE DE DATOS DE ARTÍCULOS (Contenido Real) ---
const articlesDB = [
    // 1. CUIDADOS BÁSICOS
    {
        id: 1,
        category: "cuidados-basicos",
        title: "Nutrición: ¿Qué debe comer tu mascota?",
        excerpt: "Guía completa sobre alimentación balanceada, croquetas vs comida casera y alimentos prohibidos.",
        image: "https://images.unsplash.com/photo-1589924691195-41432c84c161?auto=format&fit=crop&w=500&q=60",
        content: `
            <h3>La base de una vida sana</h3>
            <p>La nutrición es el pilar de la salud de tu mascota. Tanto perros como gatos son carnívoros (los gatos estrictos, los perros facultativos), por lo que su dieta debe basarse principalmente en <strong>proteína animal</strong> de alta calidad.</p>
            
            <h3>¿Croquetas o Comida Casera?</h3>
            <ul>
                <li><strong>Croquetas (Pienso):</strong> Son prácticas y están formuladas para ser completas. Busca marcas donde el primer ingrediente sea carne (pollo, res, pescado) y no cereales (maíz, trigo).</li>
                <li><strong>Dieta BARF/Casera:</strong> Puede ser excelente si está supervisada por un veterinario nutricionista. Dar solo "sobras" no es nutritivo y puede causar obesidad.</li>
            </ul>

            <h3>⚠️ Alimentos Prohibidos</h3>
            <p>Nunca des a tu mascota: Chocolate (tóxico), Cebolla/Ajo (dañan glóbulos rojos), Uvas/Pasas (fallo renal), Huesos cocidos (se astillan) o Alcohol.</p>
        `
    },
    {
        id: 2,
        category: "cuidados-basicos",
        title: "Higiene y Baño: Mitos y Realidades",
        excerpt: "¿Cada cuánto bañar a un perro? ¿Los gatos se bañan? Todo sobre la limpieza.",
        image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=500&q=60",
        content: `
            <h3>Perros: Frecuencia de Baño</h3>
            <p>Bañar a un perro demasiado seguido puede dañar la capa de grasa natural de su piel. Lo recomendable es hacerlo <strong>una vez cada 3 o 4 semanas</strong>, o cuando esté visiblemente sucio. Usa siempre champú para perros (el pH humano es diferente).</p>
            
            <h3>Gatos: ¿Se bañan?</h3>
            <p>Generalmente, no. Los gatos son extremadamente limpios y se acicalan solos. Bañarlos les genera mucho estrés. Solo hazlo si es estrictamente necesario (por ejemplo, si se manchó con algo tóxico) o si es una raza sin pelo como el Sphynx.</p>

            <h3>Cepillado y Dientes</h3>
            <p>El cepillado diario es más importante que el baño, ya que elimina pelo muerto y suciedad. Además, intenta cepillar sus dientes 2-3 veces por semana para evitar sarro y mal aliento.</p>
        `
    },

    // 2. SALUD Y PREVENCIÓN
    {
        id: 3,
        category: "salud-prevencion",
        title: "Calendario de Vacunación Esencial",
        excerpt: "Protege a tu mejor amigo de enfermedades mortales como el Parvovirus y el Moquillo.",
        image: "https://images.unsplash.com/photo-1628009368231-760335298025?auto=format&fit=crop&w=500&q=60",
        content: `
            <h3>Cachorros (Perros)</h3>
            <ul>
                <li><strong>6 semanas:</strong> Puppy (Parvovirus/Moquillo).</li>
                <li><strong>8-10 semanas:</strong> Refuerzo Polivalente.</li>
                <li><strong>12 semanas:</strong> Refuerzo + Bordetella.</li>
                <li><strong>4-6 meses:</strong> Rabia (Obligatoria por ley).</li>
            </ul>

            <h3>Gatos</h3>
            <p>Deben recibir la <strong>Triple Felina</strong> (Rinotraqueitis, Calicivirus, Panleucopenia) y la de Rabia. Si salen a la calle, considera la vacuna contra la Leucemia Felina.</p>

            <p><em>Recuerda: Los adultos necesitan refuerzos anuales de la Polivalente y la Rabia toda su vida.</em></p>
        `
    },
    {
        id: 4,
        category: "salud-prevencion",
        title: "Esterilización: Un Acto de Amor",
        excerpt: "Desmentimos los mitos sobre la esterilización y explicamos sus beneficios médicos.",
        image: "https://images.unsplash.com/photo-1599443015574-be5fe8a05783?auto=format&fit=crop&w=500&q=60",
        content: `
            <h3>Beneficios Médicos</h3>
            <ul>
                <li><strong>Hembras:</strong> Elimina el riesgo de piometra (infección uterina mortal) y reduce drásticamente la probabilidad de tumores mamarios.</li>
                <li><strong>Machos:</strong> Previene el cáncer de testículos y reduce problemas de próstata.</li>
            </ul>

            <h3>Beneficios de Comportamiento</h3>
            <p>Reduce el marcaje con orina dentro de casa, la agresividad por competencia sexual y el instinto de escaparse para buscar pareja, lo que evita atropellamientos y peleas.</p>

            <h3>Mito Común</h3>
            <p>"Deben tener una camada primero". <strong>Falso.</strong> No hay beneficio médico ni emocional en que tengan crías antes de operar. Al contrario, esterilizar antes del primer celo ofrece la mayor protección contra el cáncer.</p>
        `
    },

    // 3. ENTRENAMIENTO
    {
        id: 5,
        category: "entrenamiento",
        title: "Entrenamiento en Positivo",
        excerpt: "Cómo educar sin castigos y lograr un vínculo de confianza inquebrantable.",
        image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=500&q=60",
        content: `
            <h3>¿Qué es el Refuerzo Positivo?</h3>
            <p>Consiste en premiar las conductas que queremos que se repitan, en lugar de castigar las que no. Si tu perro se sienta, le das un premio. Si ladra, lo ignoras (no le gritas). El cerebro aprende más rápido buscando la recompensa.</p>

            <h3>Reglas de Oro</h3>
            <ol>
                <li><strong>Timing:</strong> Premia en el instante exacto (tienes 1-2 segundos) para que asocie la acción con el premio.</li>
                <li><strong>Consistencia:</strong> Si no quieres que suba al sofá, nunca lo dejes subir. Si a veces lo dejas y a veces lo regañas, lo confundirás.</li>
                <li><strong>Paciencia:</strong> Aprender toma tiempo. Sesiones cortas de 5-10 minutos son mejores que una hora larga y frustrante.</li>
            </ol>
        `
    },

    // 4. ADOPCIÓN
    {
        id: 6,
        category: "adopcion-responsable",
        title: "La Regla del 3-3-3 en Adopción",
        excerpt: "Entiende las etapas emocionales por las que pasa un perro rescatado al llegar a casa.",
        image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=500&q=60",
        content: `
            <h3>3 Días: Descompresión</h3>
            <p>El perro puede estar asustado, no querer comer o esconderse. No es que no te quiera, está abrumado. Dale espacio y no lo obligues a interactuar.</p>

            <h3>3 Semanas: Rutina</h3>
            <p>Empieza a entender su nueva vida. Puede empezar a "probar límites" o mostrar su verdadera personalidad. Es el momento clave para establecer horarios de paseo y comida.</p>

            <h3>3 Meses: Pertenencia</h3>
            <p>Ya se siente en casa. Confía en ti y ha creado un vínculo. Es cuando verás al perro en su mejor versión, relajado y feliz.</p>
            
            <p><strong>Consejo:</strong> La paciencia es la clave. Muchos perros son devueltos en las primeras semanas porque los dueños no conocen este proceso natural de adaptación.</p>
        `
    }
];

// --- RENDERIZADO EN EL HTML ---
document.addEventListener('DOMContentLoaded', () => {
    renderArticles();
    loadFeaturedArticles(); // Cargar destacados (los primeros 3)
});

function renderArticles() {
    // Recorremos la base de datos y colocamos cada artículo en su sección
    articlesDB.forEach(article => {
        const cardHTML = createCardHTML(article);
        
        // Identificar en qué div va según su categoría
        let containerId = "";
        if (article.category === 'cuidados-basicos') containerId = 'cuidadosArticles';
        else if (article.category === 'salud-prevencion') containerId = 'saludArticles';
        else if (article.category === 'entrenamiento') containerId = 'entrenamientoArticles';
        else if (article.category === 'adopcion-responsable') containerId = 'adopcionArticles';

        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML += cardHTML;
        }
    });
}

function loadFeaturedArticles() {
    const featuredContainer = document.getElementById('featuredArticles');
    if(featuredContainer) {
        // Tomamos los primeros 3 artículos como destacados
        const featured = articlesDB.slice(0, 3);
        featured.forEach(article => {
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

// --- LÓGICA DEL MODAL ---
function openArticleModal(id) {
    const article = articlesDB.find(a => a.id === id);
    if (!article) return;

    const modalContent = document.getElementById('articleModalContent');
    modalContent.innerHTML = `
        <img src="${article.image}" style="width:100%; height:300px; object-fit:cover; border-radius:12px 12px 0 0;">
        <div style="padding: 30px;">
            <span class="tag" style="background:var(--primary); color:white; padding:5px 10px; border-radius:15px; font-size:0.8rem;">${article.category.replace('-', ' ').toUpperCase()}</span>
            <h2 style="margin: 15px 0; color:var(--dark); font-size:2rem;">${article.title}</h2>
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
    document.body.style.overflow = 'hidden'; // Bloquear scroll
}

// Función global para cerrar modales (ya debes tenerla en script.js, pero por si acaso)
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Cerrar al dar clic fuera
window.onclick = function(event) {
    const modal = document.getElementById('articleModal');
    if (event.target == modal) {
        closeModal('articleModal');
    }
}
