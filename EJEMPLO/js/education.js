// Education Module JavaScript
document.addEventListener('DOMContentLoaded', function() {
    loadFeaturedArticles();
    loadCategoryArticles();
    loadExperts();
    loadFAQ();
    loadResources();
    setupEventListeners();
});

// Datos de artículos educativos
const educationArticles = {
    featured: [
        {
            id: 1,
            title: "Guía Completa para Primerizos: Todo sobre la Tenencia Responsable",
            excerpt: "Aprende los fundamentos esenciales para ser un dueño responsable desde el primer día.",
            category: "Adopción Responsable",
            readTime: "8 min",
            author: "Dra. Martínez",
            authorInitials: "DM",
            image: "📝",
            content: `
                <h2>¿Qué es la Tenencia Responsable?</h2>
                <p>La tenencia responsable va más allá de simplemente tener una mascota. Es un compromiso de vida que incluye:</p>
                
                <h3>Compromisos Básicos</h3>
                <ul>
                    <li><strong>Cuidado de por vida:</strong> Las mascotas no son objetos temporales</li>
                    <li><strong>Atención veterinaria:</strong> Vacunas, desparasitación y chequeos regulares</li>
                    <li><strong>Alimentación adecuada:</strong> Según especie, edad y condición de salud</li>
                    <li><strong>Espacio y ambiente:</strong> Entorno seguro y enriquecido</li>
                </ul>

                <div class="article-tips">
                    <h4>💡 Tip Importante</h4>
                    <p>Antes de adoptar, evalúa tu estilo de vida, espacio disponible y recursos económicos. Una mascota es una responsabilidad de 10-15 años.</p>
                </div>

                <h2>Preparación del Hogar</h2>
                <p>Prepara tu casa antes de llevar a tu nueva mascota:</p>
                <ul>
                    <li>Área de descanso cómoda</li>
                    <li>Zona de alimentación e hidratación</li>
                    <li>Juguetes y enriquecimiento ambiental</li>
                    <li>Espacio seguro libre de peligros</li>
                </ul>

                <div class="article-warning">
                    <h4>⚠️ Advertencia</h4>
                    <p>Nunca regales mascotas como sorpresa. La decisión de adoptar debe ser consciente y consensuada por toda la familia.</p>
                </div>
            `
        },
        {
            id: 2,
            title: "Señales de Alerta: Cómo Identificar Problemas de Salud en tu Mascota",
            excerpt: "Aprende a reconocer las señales tempranas de enfermedades comunes en perros y gatos.",
            category: "Salud y Prevención",
            readTime: "6 min",
            author: "Dr. González",
            authorInitials: "DG",
            image: "🩺",
            content: "Contenido completo del artículo..."
        },
        {
            id: 3,
            title: "Entrenamiento Positivo: Guía Paso a Paso para Educar a tu Perro",
            excerpt: "Métodos efectivos y humanos para el entrenamiento basado en refuerzo positivo.",
            category: "Entrenamiento",
            readTime: "10 min",
            author: "Lic. Rodríguez",
            authorInitials: "LR",
            image: "🎓",
            content: "Contenido completo del artículo..."
        }
    ],
    cuidados: [
        {
            id: 4,
            title: "Alimentación Balanceada: ¿Qué Debe Comer tu Mascota?",
            excerpt: "Guía completa sobre nutrición canina y felina según edad y condición.",
            category: "Cuidados Básicos",
            readTime: "7 min",
            author: "Nut. Sánchez",
            authorInitials: "NS",
            image: "🍖"
        },
        {
            id: 5,
            title: "Higiene y Aseo: Mantén a tu Mascota Limpia y Saludable",
            excerpt: "Técnicas de baño, cepillado y cuidado dental para perros y gatos.",
            category: "Cuidados Básicos",
            readTime: "5 min",
            author: "Dra. López",
            authorInitials: "DL",
            image: "🛁"
        }
    ],
    salud: [
        {
            id: 6,
            title: "Calendario de Vacunación: Protege a tu Mascota de Enfermedades",
            excerpt: "Programa completo de vacunas para perros y gatos desde cachorros.",
            category: "Salud y Prevención",
            readTime: "5 min",
            author: "Dra. Martínez",
            authorInitials: "DM",
            image: "💉"
        },
        {
            id: 7,
            title: "Esterilización: Beneficios y Mitos Comunes",
            excerpt: "Todo lo que necesitas saber sobre la esterilización responsable.",
            category: "Salud y Prevención",
            readTime: "6 min",
            author: "Dr. Hernández",
            authorInitials: "DH",
            image: "💊"
        }
    ],
    entrenamiento: [
        {
            id: 8,
            title: "Socialización: Cómo Presentar tu Mascota a Otras Animales",
            excerpt: "Técnicas para una socialización segura y efectiva.",
            category: "Entrenamiento",
            readTime: "8 min",
            author: "Lic. Rodríguez",
            authorInitials: "LR",
            image: "👥"
        },
        {
            id: 9,
            title: "Solucionando Problemas de Conducta Comunes",
            excerpt: "Cómo manejar ladridos excesivos, ansiedad por separación y más.",
            category: "Entrenamiento",
            readTime: "9 min",
            author: "Lic. García",
            authorInitials: "LG",
            image: "🎯"
        }
    ],
    adopcion: [
        {
            id: 10,
            title: "Proceso de Adaptación: Los Primeros Días en Casa",
            excerpt: "Guía para facilitar la transición de tu nueva mascota a su hogar.",
            category: "Adopción Responsable",
            readTime: "7 min",
            author: "Psic. Animal",
            authorInitials: "PA",
            image: "🏠"
        },
        {
            id: 11,
            title: "Checklist Pre-Adopción: ¿Estás Listo para una Mascota?",
            excerpt: "Lista de verificación esencial antes de tomar la decisión de adoptar.",
            category: "Adopción Responsable",
            readTime: "4 min",
            author: "Equipo TLN",
            authorInitials: "ET",
            image: "✅"
        }
    ]
};

// Datos de expertos
const experts = [
    {
        id: 1,
        name: "Dra. Ana Martínez",
        specialty: "Veterinaria Especialista",
        bio: "Más de 15 años de experiencia en medicina veterinaria y tenencia responsable. Directora del Centro Veterinario Animal Safe.",
        articles: 24,
        experience: "15 años",
        avatar: "👩‍⚕️"
    },
    {
        id: 2,
        name: "Lic. Carlos Rodríguez",
        specialty: "Especialista en Conducta Animal",
        bio: "Certificado en etología canina y felina. Fundador del programa 'Entrenamiento Positivo México'.",
        articles: 18,
        experience: "12 años",
        avatar: "👨‍🎓"
    },
    {
        id: 3,
        name: "Dr. Miguel González",
        specialty: "Cirujano Veterinario",
        bio: "Especialista en cirugía de tejidos blandos y ortopedia. Miembro de la Asociación Mexicana de Veterinarios.",
        articles: 32,
        experience: "20 años",
        avatar: "👨‍⚕️"
    }
];

// Preguntas frecuentes
const faqData = [
    {
        question: "¿Cuál es la edad ideal para adoptar una mascota?",
        answer: "La edad ideal depende de tu estilo de vida. Los cachorros requieren más tiempo y paciencia para entrenamiento, mientras que los adultos suelen ser más tranquilos y con personalidad definida. Considera tu disponibilidad de tiempo antes de decidir."
    },
    {
        question: "¿Cuánto cuesta mensualmente mantener una mascota?",
        answer: "El costo varía según el tamaño y especie. En promedio: Alimentación $500-$1000, veterinario $200-$500, accesorios $200-$400. Siempre considera un fondo de emergencia para imprevistos médicos."
    },
    {
        question: "¿Es mejor adoptar un perro o gato para departamento?",
        answer: "Ambas especies pueden adaptarse a departamentos. Los gatos son más independientes, mientras que perros pequeños o de baja energía pueden ser excelentes compañeros. Considera el espacio vertical para gatos y las salidas para perros."
    },
    {
        question: "¿Cómo introducir una nueva mascota a otras que ya tengo?",
        answer: "La introducción debe ser gradual: 1) Separación inicial, 2) Intercambio de olores, 3) Contacto visual controlado, 4) Encuentros supervisados. La paciencia es clave y puede tomar de días a semanas."
    },
    {
        question: "¿Qué vacunas son obligatorias para perros y gatos?",
        answer: "Para perros: Moquillo, Parvovirus, Hepatitis, Rabia. Para gatos: Panleucopenia, Calicivirus, Rinotraqueitis, Rabia. Consulta con tu veterinario para un calendario personalizado."
    }
];

// Recursos descargables
const resources = [
    {
        id: 1,
        title: "Checklist de Adopción Responsable",
        description: "Lista de verificación completa antes, durante y después de la adopción",
        type: "PDF",
        size: "2.1 MB",
        icon: "📋",
        downloadUrl: "#"
    },
    {
        id: 2,
        title: "Guía de Primeros Auxilios para Mascotas",
        description: "Procedimientos básicos de emergencia que todo dueño debe conocer",
        type: "PDF",
        size: "3.4 MB",
        icon: "🆘",
        downloadUrl: "#"
    },
    {
        id: 3,
        title: "Calendario de Vacunación 2024",
        description: "Programa completo de vacunas para perros y gatos",
        type: "Imagen",
        size: "1.5 MB",
        icon: "📅",
        downloadUrl: "#"
    },
    {
        id: 4,
        title: "Guía de Alimentación por Edades",
        description: "Recomendaciones nutricionales según etapa de vida",
        type: "PDF",
        size: "2.8 MB",
        icon: "🍽️",
        downloadUrl: "#"
    }
];

// Cargar artículos destacados
function loadFeaturedArticles() {
    const container = document.getElementById('featuredArticles');
    if (!container) return;

    container.innerHTML = educationArticles.featured.map(article => `
        <div class="article-card" onclick="openArticle(${article.id})">
            <div class="article-image">
                ${article.image}
            </div>
            <div class="article-content">
                <div class="article-meta">
                    <span class="article-category">${article.category}</span>
                    <span class="article-read-time">⏱️ ${article.readTime}</span>
                </div>
                <h3 class="article-title">${article.title}</h3>
                <p class="article-excerpt">${article.excerpt}</p>
                <div class="article-actions">
                    <div class="article-author">
                        <div class="author-avatar">${article.authorInitials}</div>
                        <span>${article.author}</span>
                    </div>
                    <button class="btn-outline btn-small">Leer más</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Cargar artículos por categoría
function loadCategoryArticles() {
    const categories = ['cuidados', 'salud', 'entrenamiento', 'adopcion'];
    
    categories.forEach(category => {
        const container = document.getElementById(`${category}Articles`);
        if (container && educationArticles[category]) {
            container.innerHTML = educationArticles[category].map(article => `
                <div class="article-card" onclick="openArticle(${article.id})">
                    <div class="article-image">
                        ${article.image}
                    </div>
                    <div class="article-content">
                        <div class="article-meta">
                            <span class="article-category">${article.category}</span>
                            <span class="article-read-time">⏱️ ${article.readTime}</span>
                        </div>
                        <h3 class="article-title">${article.title}</h3>
                        <p class="article-excerpt">${article.excerpt}</p>
                        <div class="article-actions">
                            <div class="article-author">
                                <div class="author-avatar">${article.authorInitials}</div>
                                <span>${article.author}</span>
                            </div>
                            <button class="btn-outline btn-small">Leer más</button>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    });
}

// Cargar expertos
function loadExperts() {
    const container = document.getElementById('expertsGrid');
    if (!container) return;

    container.innerHTML = experts.map(expert => `
        <div class="expert-card">
            <div class="expert-avatar">${expert.avatar}</div>
            <h3 class="expert-name">${expert.name}</h3>
            <div class="expert-specialty">${expert.specialty}</div>
            <p class="expert-bio">${expert.bio}</p>
            <div class="expert-stats">
                <div class="expert-stat">
                    <span class="expert-stat-number">${expert.articles}</span>
                    <span class="expert-stat-label">Artículos</span>
                </div>
                <div class="expert-stat">
                    <span class="expert-stat-number">${expert.experience}</span>
                    <span class="expert-stat-label">Experiencia</span>
                </div>
            </div>
            <button class="btn-outline btn-small" onclick="contactExpert(${expert.id})">
                Contactar
            </button>
        </div>
    `).join('');
}

// Cargar preguntas frecuentes
function loadFAQ() {
    const container = document.getElementById('faqList');
    if (!container) return;

    container.innerHTML = faqData.map((faq, index) => `
        <div class="faq-item" onclick="toggleFAQ(${index})">
            <div class="faq-question">
                <span>${faq.question}</span>
                <span class="faq-toggle">▼</span>
            </div>
            <div class="faq-answer">
                <p>${faq.answer}</p>
            </div>
        </div>
    `).join('');
}

// Cargar recursos
function loadResources() {
    const container = document.getElementById('resourcesGrid');
    if (!container) return;

    container.innerHTML = resources.map(resource => `
        <div class="resource-card">
            <div class="resource-icon">${resource.icon}</div>
            <h3 class="resource-title">${resource.title}</h3>
            <p class="resource-description">${resource.description}</p>
            <div class="resource-meta">
                <span>📄 ${resource.type}</span>
                <span>💾 ${resource.size}</span>
            </div>
            <button class="btn-primary" onclick="downloadResource(${resource.id})">
                📥 Descargar
            </button>
        </div>
    `).join('');
}

// Configurar event listeners
function setupEventListeners() {
    // Smooth scroll para navegación interna
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Abrir artículo en modal
function openArticle(articleId) {
    // Buscar artículo en todas las categorías
    let article = null;
    
    for (const category in educationArticles) {
        const found = educationArticles[category].find(a => a.id === articleId);
        if (found) {
            article = found;
            break;
        }
    }

    if (!article) return;

    const modalContent = document.getElementById('articleModalContent');
    modalContent.innerHTML = `
        <div class="article-modal-header">
            <div class="article-modal-meta">
                <span class="article-category">${article.category}</span>
                <span class="article-read-time">⏱️ ${article.readTime} de lectura</span>
                <div class="article-author">
                    <div class="author-avatar">${article.authorInitials}</div>
                    <span>${article.author}</span>
                </div>
            </div>
            <h1 class="article-modal-title">${article.title}</h1>
        </div>
        <div class="article-content">
            ${article.content || `
                <p>${article.excerpt}</p>
                <p>Este artículo está en desarrollo. Pronto tendrás acceso a contenido completo y detallado.</p>
                <div class="article-tips">
                    <h4>💡 Mientras tanto...</h4>
                    <p>Puedes consultar nuestras <a href="#faq-section">preguntas frecuentes</a> o contactar a uno de nuestros expertos para resolver tus dudas específicas.</p>
                </div>
            `}
        </div>
        <div class="article-modal-actions">
            <button class="btn-outline" onclick="shareArticle(${article.id})">
                📤 Compartir artículo
            </button>
            <button class="btn-primary" onclick="saveArticle(${article.id})">
                💾 Guardar para después
            </button>
        </div>
    `;

    openModal('articleModal');
}

// Alternar FAQ
function toggleFAQ(index) {
    const faqItems = document.querySelectorAll('.faq-item');
    const clickedItem = faqItems[index];
    
    // Cerrar otros items abiertos
    faqItems.forEach(item => {
        if (item !== clickedItem) {
            item.classList.remove('active');
        }
    });
    
    // Alternar el item clickeado
    clickedItem.classList.toggle('active');
}

// Contactar experto
function contactExpert(expertId) {
    const expert = experts.find(e => e.id === expertId);
    if (!expert) return;

    if (confirm(`¿Te gustaría contactar a ${expert.name}? Serás redirigido a nuestro formulario de contacto.`)) {
        window.location.href = `contact.html?expert=${expertId}`;
    }
}

// Descargar recurso
function downloadResource(resourceId) {
    const resource = resources.find(r => r.id === resourceId);
    if (!resource) return;

    // Simular descarga
    showNotification(`📥 Descargando "${resource.title}"...`, 'info');
    
    setTimeout(() => {
        showNotification(`✅ "${resource.title}" descargado exitosamente`, 'success');
    }, 2000);
}

// Compartir artículo
function shareArticle(articleId) {
    const article = getAllArticles().find(a => a.id === articleId);
    if (!article) return;

    if (navigator.share) {
        navigator.share({
            title: article.title,
            text: article.excerpt,
            url: window.location.href + `?article=${articleId}`
        });
    } else {
        // Fallback para navegadores que no soportan Web Share API
        navigator.clipboard.writeText(window.location.href + `?article=${articleId}`);
        showNotification('🔗 Enlace copiado al portapapeles', 'success');
    }
}

// Guardar artículo
function saveArticle(articleId) {
    // En una implementación real, esto guardaría en la base de datos del usuario
    showNotification('💾 Artículo guardado en tus favoritos', 'success');
}

// Utilidades
function getAllArticles() {
    let allArticles = [];
    for (const category in educationArticles) {
        allArticles = allArticles.concat(educationArticles[category]);
    }
    return allArticles;
}

function showNotification(message, type = 'info') {
    // Reutilizar función de notificación existente
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
    } else {
        // Notificación básica
        alert(message);
    }
}

// Navegación
function navigateTo(url) {
    window.location.href = url;
}