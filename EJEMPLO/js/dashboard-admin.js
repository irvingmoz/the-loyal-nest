// Admin Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeAdminDashboard();
    loadSystemMetrics();
    setupEventListeners();
});

// Inicializar dashboard de administrador
function initializeAdminDashboard() {
    updatePerformanceMetrics();
    setupRealTimeUpdates();
    checkSystemHealth();
}

// Cargar métricas del sistema
function loadSystemMetrics() {
    // Simular carga de métricas del sistema
    setTimeout(() => {
        updatePerformanceMetrics();
        loadUserActivity();
    }, 1000);
}

// Configurar event listeners
function setupEventListeners() {
    // Filtro de rendimiento
    const performanceFilter = document.getElementById('performanceFilter');
    if (performanceFilter) {
        performanceFilter.addEventListener('change', function() {
            updatePerformanceMetrics(this.value);
        });
    }

    // Logout
    const logoutBtn = document.querySelector('.logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
                // Aquí iría la lógica de logout de administrador
                window.location.href = 'index.html';
            }
        });
    }
}

// Actualizar métricas de rendimiento
function updatePerformanceMetrics(timeRange = '24h') {
    const metrics = {
        '24h': { cpu: 65, memory: 42, storage: 78, response: 120 },
        '7d': { cpu: 58, memory: 45, storage: 75, response: 135 },
        '30d': { cpu: 52, memory: 48, storage: 72, response: 128 }
    };

    const data = metrics[timeRange] || metrics['24h'];

    // Actualizar barras de métricas
    document.querySelectorAll('.metric-fill').forEach(fill => {
        const value = fill.getAttribute('data-value');
        fill.style.width = value + '%';
    });

    // Actualizar valores numéricos
    document.querySelectorAll('.metric-value').forEach(element => {
        const label = element.closest('.metric-header').querySelector('.metric-label').textContent;
        if (label.includes('CPU')) element.textContent = data.cpu + '%';
        if (label.includes('Memoria')) element.textContent = data.memory + '%';
        if (label.includes('Almacenamiento')) element.textContent = data.storage + '%';
        if (label.includes('Respuesta')) element.textContent = data.response + 'ms';
    });
}

// Cargar actividad de usuarios
function loadUserActivity() {
    // En una implementación real, esto cargaría datos del servidor
    console.log('Cargando actividad de usuarios...');
}

// Configurar actualizaciones en tiempo real
function setupRealTimeUpdates() {
    // Simular actualizaciones en tiempo real cada 30 segundos
    setInterval(() => {
        updateLiveData();
    }, 30000);
}

function updateLiveData() {
    // Actualizar contadores en tiempo real
    const counters = {
        'pendingCount': Math.floor(Math.random() * 5) + 1,
        'totalCount': Math.floor(Math.random() * 10) + 40
    };

    Object.keys(counters).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = counters[id];
        }
    });
}

// Verificar salud del sistema
function checkSystemHealth() {
    // Simular verificación de salud del sistema
    setTimeout(() => {
        const systemStatus = {
            database: Math.random() > 0.1 ? 'online' : 'warning',
            email: Math.random() > 0.2 ? 'online' : 'warning',
            storage: Math.random() > 0.05 ? 'online' : 'critical'
        };

        updateSystemStatus(systemStatus);
    }, 2000);
}

function updateSystemStatus(status) {
    const indicators = document.querySelectorAll('.status-indicator');
    
    indicators.forEach(indicator => {
        const service = indicator.textContent.toLowerCase();
        if (service.includes('base') && status.database !== 'online') {
            indicator.classList.add(status.database);
            indicator.querySelector('.status-dot').style.background = getStatusColor(status.database);
        }
        if (service.includes('email') && status.email !== 'online') {
            indicator.classList.add(status.email);
            indicator.querySelector('.status-dot').style.background = getStatusColor(status.email);
        }
        if (service.includes('servicios') && status.storage !== 'online') {
            indicator.classList.add(status.storage);
            indicator.querySelector('.status-dot').style.background = getStatusColor(status.storage);
        }
    });
}

function getStatusColor(status) {
    const colors = {
        'online': 'var(--success)',
        'warning': 'var(--warning)',
        'critical': 'var(--danger)'
    };
    return colors[status] || colors.online;
}

// Acciones rápidas del administrador
function quickAction(action) {
    switch(action) {
        case 'backup':
            runBackup();
            break;
        case 'audit':
            navigateTo('admin-audit.html');
            break;
        default:
            console.log('Acción no implementada:', action);
    }
}

function runBackup() {
    showSystemModal('💾 Respaldo del Sistema', `
        <div class="backup-content">
            <p>¿Estás seguro de que quieres ejecutar un respaldo completo del sistema?</p>
            <div class="backup-options">
                <label>
                    <input type="checkbox" checked> Incluir base de datos
                </label>
                <label>
                    <input type="checkbox" checked> Incluir archivos de usuarios
                </label>
                <label>
                    <input type="checkbox"> Incluir logs del sistema
                </label>
            </div>
            <div class="modal-actions">
                <button class="btn-outline" onclick="closeModal('systemModal')">Cancelar</button>
                <button class="btn-primary" onclick="executeBackup()">Ejecutar Respaldo</button>
            </div>
        </div>
    `);
}

function executeBackup() {
    showNotification('🔄 Iniciando respaldo del sistema...', 'info');
    
    // Simular proceso de respaldo
    setTimeout(() => {
        showNotification('✅ Respaldo completado exitosamente', 'success');
        closeModal('systemModal');
    }, 3000);
}

// Gestión de usuarios
function verifyUsers() {
    showSystemModal('👥 Verificación de Usuarios', `
        <div class="verification-content">
            <p>Hay <strong>12 usuarios</strong> pendientes de verificación:</p>
            <div class="user-list">
                <div class="user-item">
                    <span>Ana Martínez</span>
                    <button class="btn-success btn-small" onclick="verifySingleUser(1)">Verificar</button>
                </div>
                <div class="user-item">
                    <span>Carlos López</span>
                    <button class="btn-success btn-small" onclick="verifySingleUser(2)">Verificar</button>
                </div>
                <div class="user-item">
                    <span>María González</span>
                    <button class="btn-success btn-small" onclick="verifySingleUser(3)">Verificar</button>
                </div>
            </div>
            <div class="modal-actions">
                <button class="btn-outline" onclick="closeModal('systemModal')">Cerrar</button>
                <button class="btn-primary" onclick="verifyAllUsers()">Verificar Todos</button>
            </div>
        </div>
    `);
}

function verifySingleUser(userId) {
    showNotification(`✅ Usuario #${userId} verificado`, 'success');
    // Aquí iría la lógica real de verificación
}

function verifyAllUsers() {
    showNotification('✅ Todos los usuarios verificados', 'success');
    closeModal('systemModal');
}

// Moderación de contenido
function reviewReports() {
    navigateTo('admin-content.html');
}

function reviewReport(reportId) {
    showSystemModal('📝 Revisar Reporte', `
        <div class="report-content">
            <p><strong>Reporte #${reportId}</strong> - Comentario inapropiado</p>
            <div class="report-details">
                <p><strong>Usuario reportado:</strong> Juan Pérez</p>
                <p><strong>Motivo:</strong> Lenguaje ofensivo</p>
                <p><strong>Comentario:</strong> "Este refugio no cuida bien a los animales..."</p>
            </div>
            <div class="modal-actions">
                <button class="btn-outline" onclick="closeModal('systemModal')">Cerrar</button>
                <button class="btn-warning" onclick="warnUser(${reportId})">Advertir Usuario</button>
                <button class="btn-danger" onclick="deleteContent(${reportId})">Eliminar Contenido</button>
            </div>
        </div>
    `);
}

function warnUser(reportId) {
    showNotification(`⚠️ Usuario advertido por reporte #${reportId}`, 'warning');
    closeModal('systemModal');
}

function deleteContent(reportId) {
    if (confirm('¿Estás seguro de que quieres eliminar este contenido?')) {
        showNotification(`🗑️ Contenido eliminado (Reporte #${reportId})`, 'success');
        closeModal('systemModal');
    }
}

// Gestión de mascotas
function approvePets() {
    showSystemModal('🐕 Aprobar Mascotas', `
        <div class="pets-approval-content">
            <p>Hay <strong>3 mascotas</strong> pendientes de aprobación:</p>
            <div class="pet-list">
                <div class="pet-item">
                    <span>🐕 Rocky - Bulldog</span>
                    <button class="btn-success btn-small" onclick="approveSinglePet(1)">Aprobar</button>
                </div>
                <div class="pet-item">
                    <span>🐈 Bella - Mestiza</span>
                    <button class="btn-success btn-small" onclick="approveSinglePet(2)">Aprobar</button>
                </div>
                <div class="pet-item">
                    <span>🐕 Toby - Chihuahua</span>
                    <button class="btn-success btn-small" onclick="approveSinglePet(3)">Aprobar</button>
                </div>
            </div>
            <div class="modal-actions">
                <button class="btn-outline" onclick="closeModal('systemModal')">Cerrar</button>
                <button class="btn-primary" onclick="approveAllPets()">Aprobar Todas</button>
            </div>
        </div>
    `);
}

function approveSinglePet(petId) {
    showNotification(`✅ Mascota #${petId} aprobada`, 'success');
}

function approveAllPets() {
    showNotification('✅ Todas las mascotas aprobadas', 'success');
    closeModal('systemModal');
}

// Reportes del sistema
function generateReport() {
    showSystemModal('📊 Generar Reporte', `
        <div class="report-generation-content">
            <p>Selecciona el tipo de reporte a generar:</p>
            <div class="report-options">
                <label>
                    <input type="radio" name="reportType" value="adoptions" checked> 
                    Reporte de Adopciones
                </label>
                <label>
                    <input type="radio" name="reportType" value="users"> 
                    Reporte de Usuarios
                </label>
                <label>
                    <input type="radio" name="reportType" value="system"> 
                    Reporte del Sistema
                </label>
            </div>
            <div class="date-range">
                <label>Rango de fechas:</label>
                <input type="date" id="startDate">
                <span>a</span>
                <input type="date" id="endDate">
            </div>
            <div class="modal-actions">
                <button class="btn-outline" onclick="closeModal('systemModal')">Cancelar</button>
                <button class="btn-primary" onclick="executeReportGeneration()">Generar Reporte</button>
            </div>
        </div>
    `);
}

function executeReportGeneration() {
    showNotification('📊 Generando reporte...', 'info');
    
    setTimeout(() => {
        showNotification('✅ Reporte generado exitosamente', 'success');
        closeModal('systemModal');
    }, 2000);
}

// Configuración del sistema
function toggleSetting(settingName, isEnabled) {
    console.log(`Configuración ${settingName}: ${isEnabled ? 'activada' : 'desactivada'}`);
    showNotification(`⚙️ ${settingName} ${isEnabled ? 'activado' : 'desactivado'}`, 'info');
}

function toggleMaintenanceMode(isEnabled) {
    if (isEnabled) {
        if (confirm('¿Activar modo mantenimiento? Esto limitará el acceso al público.')) {
            showNotification('🚧 Modo mantenimiento activado', 'warning');
        } else {
            // Revertir el switch
            document.querySelector('input[onchange*="toggleMaintenanceMode"]').checked = false;
        }
    } else {
        showNotification('✅ Modo mantenimiento desactivado', 'success');
    }
}

// Resolver alertas
function resolveAlert(button) {
    const alertItem = button.closest('.alert-item');
    alertItem.style.opacity = '0.5';
    button.textContent = '✅ Resuelto';
    button.disabled = true;
    showNotification('Alerta resuelta exitosamente', 'success');
}

// Navegación
function navigateTo(url) {
    window.location.href = url;
}

function viewPets(refugeId) {
    navigateTo(`admin-pets.html?refuge=${refugeId}`);
}

function verifyUser(userId) {
    showNotification(`✅ Usuario #${userId} verificado`, 'success');
}

// Modal del sistema
function showSystemModal(title, content) {
    const modal = document.getElementById('systemModal');
    const modalContent = document.getElementById('systemModalContent');
    
    modalContent.innerHTML = `
        <h2>${title}</h2>
        ${content}
    `;
    
    openModal('systemModal');
}

// Utilidades
function showNotification(message, type = 'info') {
    // Reutilizar función de notificación existente o crear una básica
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
    } else {
        // Notificación básica
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? 'var(--success)' : 
                        type === 'warning' ? 'var(--warning)' : 
                        type === 'danger' ? 'var(--danger)' : 'var(--primary)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--radius);
            box-shadow: var(--shadow-lg);
            z-index: 10000;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
}