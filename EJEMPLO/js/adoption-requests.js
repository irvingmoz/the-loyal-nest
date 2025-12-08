// Adoption Requests Management
document.addEventListener('DOMContentLoaded', function() {
    loadAdoptionRequests();
    setupFilters();
    setupSearch();
});

// Datos de ejemplo de solicitudes de adopción
const adoptionRequests = [
    {
        id: 1,
        applicant: {
            name: "María González",
            email: "maria.gonzalez@email.com",
            phone: "55-1234-5678",
            location: "Iztapalapa, CDMX"
        },
        pet: {
            id: 1,
            name: "Max",
            type: "Perro",
            breed: "Labrador Mix",
            emoji: "🐕"
        },
        status: "pending",
        date: "2024-09-22",
        answers: {
            experience: "Tuve un perro por 10 años que falleció el año pasado. Sé cuidar mascotas y tengo experiencia con razas grandes.",
            home: "Vivo en casa con patio grande. Trabajo desde casa así que puedo dedicar tiempo a la mascota.",
            family: "Vivo con mi esposo y dos hijos de 8 y 10 años. Todos aman los animales.",
            plans: "Lo integraré como miembro de la familia. Planeo llevarlo a entrenamiento y darle mucho ejercicio."
        }
    },
    {
        id: 2,
        applicant: {
            name: "Carlos Rodríguez",
            email: "carlos.rodriguez@email.com",
            phone: "55-2345-6789",
            location: "Coyoacán, CDMX"
        },
        pet: {
            id: 2,
            name: "Luna",
            type: "Gato",
            breed: "Siamés",
            emoji: "🐈"
        },
        status: "interview",
        date: "2024-09-20",
        interviewDate: "2024-09-25",
        answers: {
            experience: "He tenido gatos toda mi vida. Actualmente tengo un gato de 5 años que busca un compañero.",
            home: "Departamento amplio con ventanas seguras. Tengo rascadores y áreas dedicadas para gatos.",
            family: "Solo yo y mi gato actual. No hay niños en casa.",
            plans: "Introducción gradual con mi gato actual. Visitas regulares al veterinario y alimentación premium."
        }
    },
    {
        id: 3,
        applicant: {
            name: "Ana Martínez",
            email: "ana.martinez@email.com",
            phone: "55-3456-7890",
            location: "Benito Juárez, CDMX"
        },
        pet: {
            id: 3,
            name: "Rocky",
            type: "Perro",
            breed: "Bulldog",
            emoji: "🐕"
        },
        status: "approved",
        date: "2024-09-18",
        approvedDate: "2024-09-21",
        answers: {
            experience: "Primera vez adoptando, pero he cuidado mascotas de amigos y familiares.",
            home: "Casa con jardín cercado. Zona tranquila y segura para pasear.",
            family: "Pareja sin hijos. Ambos trabajamos pero con horarios flexibles.",
            plans: "Adiestramiento profesional, socialización con otros perros, y mucho amor."
        }
    },
    {
        id: 4,
        applicant: {
            name: "Roberto Sánchez",
            email: "roberto.sanchez@email.com",
            phone: "55-4567-8901",
            location: "Iztapalapa, CDMX"
        },
        pet: {
            id: 4,
            name: "Bella",
            type: "Gato",
            breed: "Mestiza",
            emoji: "🐈"
        },
        status: "completed",
        date: "2024-09-15",
        completedDate: "2024-09-18",
        answers: {
            experience: "He rescatado y adoptado gatos por más de 15 años.",
            home: "Casa con patio seguro. Tengo experiencia con gatos especiales.",
            family: "Familia con dos adolescentes que ayudan con los cuidados.",
            plans: "Cuidado integral, alimentación natural, y enriquecimiento ambiental."
        }
    }
];

// Cargar solicitudes
function loadAdoptionRequests(filterStatus = 'all', filterPet = 'all', searchTerm = '') {
    let filteredRequests = adoptionRequests;

    // Aplicar filtros
    if (filterStatus !== 'all') {
        filteredRequests = filteredRequests.filter(request => request.status === filterStatus);
    }

    if (filterPet !== 'all') {
        filteredRequests = filteredRequests.filter(request => request.pet.name.toLowerCase() === filterPet);
    }

    if (searchTerm) {
        filteredRequests = filteredRequests.filter(request => 
            request.applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.pet.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    // Actualizar contadores
    updateRequestCounts(filteredRequests);

    // Mostrar estado vacío si no hay resultados
    const emptyState = document.getElementById('emptyState');
    if (filteredRequests.length === 0) {
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
    }

    // Cargar solicitudes en columnas
    loadRequestsByStatus(filteredRequests);
}

function updateRequestCounts(requests) {
    const pendingCount = requests.filter(r => r.status === 'pending').length;
    const interviewCount = requests.filter(r => r.status === 'interview').length;
    const approvedCount = requests.filter(r => r.status === 'approved').length;
    const completedCount = requests.filter(r => r.status === 'completed').length;
    const totalCount = requests.length;

    // Actualizar contadores en header
    document.getElementById('pendingCount').textContent = pendingCount;
    document.getElementById('totalCount').textContent = totalCount;

    // Actualizar contadores en columnas
    document.getElementById('pendingColumnCount').textContent = pendingCount;
    document.getElementById('interviewColumnCount').textContent = interviewCount;
    document.getElementById('approvedColumnCount').textContent = approvedCount;
    document.getElementById('completedColumnCount').textContent = completedCount;
}

function loadRequestsByStatus(requests) {
    const statusColumns = {
        'pending': 'pendingRequests',
        'interview': 'interviewRequests',
        'approved': 'approvedRequests',
        'completed': 'completedRequests'
    };

    // Limpiar columnas
    Object.values(statusColumns).forEach(columnId => {
        const column = document.getElementById(columnId);
        if (column) column.innerHTML = '';
    });

    // Agregar solicitudes a columnas
    requests.forEach(request => {
        const columnId = statusColumns[request.status];
        if (columnId) {
            const column = document.getElementById(columnId);
            if (column) {
                column.appendChild(createRequestCard(request));
            }
        }
    });
}

function createRequestCard(request) {
    const card = document.createElement('div');
    card.className = `request-card ${request.status}`;
    card.setAttribute('data-request-id', request.id);
    
    card.innerHTML = `
        <div class="request-header">
            <div class="request-applicant">
                <div class="applicant-name">${request.applicant.name}</div>
                <div class="applicant-contact">${request.applicant.email}</div>
            </div>
            <div class="request-pet">
                <div class="pet-name">${request.pet.emoji} ${request.pet.name}</div>
                <div class="pet-type">${request.pet.breed}</div>
            </div>
        </div>
        
        <div class="request-meta">
            <div class="request-date">${formatDate(request.date)}</div>
            <div class="request-status status-${request.status}">
                ${getStatusText(request.status)}
            </div>
        </div>
        
        <div class="request-actions">
            <button class="btn-primary btn-small" onclick="reviewRequest(${request.id})">
                👁️ Revisar
            </button>
            ${request.status === 'pending' ? `
                <button class="btn-outline btn-small" onclick="scheduleInterview(${request.id})">
                    🗣️ Entrevista
                </button>
            ` : ''}
            ${request.status === 'interview' ? `
                <button class="btn-success btn-small" onclick="approveRequest(${request.id})">
                    ✅ Aprobar
                </button>
            ` : ''}
        </div>
    `;

    return card;
}

function getStatusText(status) {
    const statusMap = {
        'pending': 'Pendiente',
        'interview': 'En entrevista',
        'approved': 'Aprobada',
        'completed': 'Completada',
        'rejected': 'Rechazada'
    };
    return statusMap[status] || status;
}

function formatDate(dateString) {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
}

// Configurar filtros
function setupFilters() {
    const statusFilter = document.getElementById('statusFilter');
    const petFilter = document.getElementById('petFilter');
    const dateFilter = document.getElementById('dateFilter');

    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            loadAdoptionRequests(this.value, petFilter.value);
        });
    }

    if (petFilter) {
        petFilter.addEventListener('change', function() {
            loadAdoptionRequests(statusFilter.value, this.value);
        });
    }

    if (dateFilter) {
        dateFilter.addEventListener('change', function() {
            // Aquí se implementaría el ordenamiento
            console.log('Ordenar por:', this.value);
        });
    }
}

// Configurar búsqueda
function setupSearch() {
    const searchInput = document.getElementById('searchRequests');
    if (searchInput) {
        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                loadAdoptionRequests(
                    document.getElementById('statusFilter').value,
                    document.getElementById('petFilter').value,
                    this.value
                );
            }, 300);
        });
    }
}

// Revisar solicitud (modal)
function reviewRequest(requestId) {
    const request = adoptionRequests.find(r => r.id === requestId);
    if (!request) return;

    const modal = document.getElementById('requestModal');
    const metaContainer = document.getElementById('requestMeta');
    const detailsContainer = document.getElementById('requestDetails');
    const actionsContainer = document.getElementById('modalActions');

    // Meta información
    metaContainer.innerHTML = `
        <div class="request-meta-info">
            <div class="meta-item">
                <span class="meta-label">Solicitante:</span>
                <span class="meta-value">${request.applicant.name}</span>
            </div>
            <div class="meta-item">
                <span class="meta-label">Mascota:</span>
                <span class="meta-value">${request.pet.emoji} ${request.pet.name} - ${request.pet.breed}</span>
            </div>
            <div class="meta-item">
                <span class="meta-label">Fecha:</span>
                <span class="meta-value">${formatDate(request.date)}</span>
            </div>
            <div class="meta-item">
                <span class="meta-label">Estado:</span>
                <span class="meta-value status-${request.status}">${getStatusText(request.status)}</span>
            </div>
        </div>
    `;

    // Detalles de la solicitud
    detailsContainer.innerHTML = `
        <div class="request-details">
            <div class="detail-section">
                <h3>👤 Información del Solicitante</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <span class="info-label">Nombre completo:</span>
                        <span class="info-value">${request.applicant.name}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Email:</span>
                        <span class="info-value">${request.applicant.email}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Teléfono:</span>
                        <span class="info-value">${request.applicant.phone}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Ubicación:</span>
                        <span class="info-value">${request.applicant.location}</span>
                    </div>
                </div>
            </div>

            <div class="detail-section">
                <h3>📝 Respuestas del Formulario</h3>
                <div class="answers-list">
                    <div class="answer-item">
                        <div class="answer-question">Experiencia previa con mascotas:</div>
                        <div class="answer-text">${request.answers.experience}</div>
                    </div>
                    <div class="answer-item">
                        <div class="answer-question">Situación de vivienda:</div>
                        <div class="answer-text">${request.answers.home}</div>
                    </div>
                    <div class="answer-item">
                        <div class="answer-question">Composición familiar:</div>
                        <div class="answer-text">${request.answers.family}</div>
                    </div>
                    <div class="answer-item">
                        <div class="answer-question">Planes para la mascota:</div>
                        <div class="answer-text">${request.answers.plans}</div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Acciones del modal
    actionsContainer.innerHTML = `
        <button class="btn-outline" onclick="closeModal('requestModal')">
            Cerrar
        </button>
        ${request.status === 'pending' ? `
            <button class="btn-warning" onclick="rejectRequest(${request.id})">
                ❌ Rechazar
            </button>
            <button class="btn-primary" onclick="scheduleInterview(${request.id})">
                🗣️ Programar Entrevista
            </button>
        ` : ''}
        ${request.status === 'interview' ? `
            <button class="btn-warning" onclick="rejectRequest(${request.id})">
                ❌ Rechazar
            </button>
            <button class="btn-success" onclick="approveRequest(${request.id})">
                ✅ Aprobar Adopción
            </button>
        ` : ''}
        ${request.status === 'approved' ? `
            <button class="btn-success" onclick="completeAdoption(${request.id})">
                🏠 Completar Adopción
            </button>
        ` : ''}
    `;

    openModal('requestModal');
}

// Acciones sobre solicitudes
function scheduleInterview(requestId) {
    if (confirm('¿Programar entrevista con el solicitante?')) {
        // Aquí se actualizaría el estado en la base de datos
        updateRequestStatus(requestId, 'interview');
        showNotification('Entrevista programada exitosamente', 'success');
        closeModal('requestModal');
    }
}

function approveRequest(requestId) {
    if (confirm('¿Aprobar esta solicitud de adopción?')) {
        updateRequestStatus(requestId, 'approved');
        showNotification('Solicitud aprobada exitosamente', 'success');
        closeModal('requestModal');
    }
}

function rejectRequest(requestId) {
    if (confirm('¿Rechazar esta solicitud de adopción?')) {
        const reason = prompt('Por favor ingresa el motivo del rechazo:');
        if (reason !== null) {
            updateRequestStatus(requestId, 'rejected');
            showNotification('Solicitud rechazada', 'warning');
            closeModal('requestModal');
        }
    }
}

function completeAdoption(requestId) {
    if (confirm('¿Marcar esta adopción como completada?')) {
        updateRequestStatus(requestId, 'completed');
        showNotification('Adopción completada exitosamente 🎉', 'success');
        closeModal('requestModal');
    }
}

function updateRequestStatus(requestId, newStatus) {
    const requestIndex = adoptionRequests.findIndex(r => r.id === requestId);
    if (requestIndex !== -1) {
        adoptionRequests[requestIndex].status = newStatus;
        if (newStatus === 'approved') {
            adoptionRequests[requestIndex].approvedDate = new Date().toISOString().split('T')[0];
        } else if (newStatus === 'completed') {
            adoptionRequests[requestIndex].completedDate = new Date().toISOString().split('T')[0];
        }
        loadAdoptionRequests(); // Recargar la vista
    }
}

// Utilidades
function clearFilters() {
    document.getElementById('statusFilter').value = 'all';
    document.getElementById('petFilter').value = 'all';
    document.getElementById('searchRequests').value = '';
    loadAdoptionRequests();
}

function showNotification(message, type = 'info') {
    // Reutilizar la función de notificación del dashboard
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
    } else {
        alert(message);
    }
}