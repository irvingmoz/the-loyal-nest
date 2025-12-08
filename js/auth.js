// Authentication System JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeAuthSystem();
    setupEventListeners();
});

// Inicializar sistema de autenticación
function initializeAuthSystem() {
    // Verificar si estamos en página de registro
    if (document.querySelector('.user-type-selection')) {
        initializeRegistration();
    }
    
    // Verificar si estamos en página de login
    if (document.getElementById('loginForm')) {
        initializeLogin();
    }
}

// Configurar event listeners
function setupEventListeners() {
    // Forgot password link
    const forgotPasswordLink = document.querySelector('.forgot-password');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            openModal('forgotPasswordModal');
        });
    }

    // Password strength indicators
    setupPasswordStrength();
}

// Inicializar registro
function initializeRegistration() {
    const typeCards = document.querySelectorAll('.type-card');
    const userForms = document.querySelectorAll('.user-form');
    
    typeCards.forEach(card => {
        card.addEventListener('click', function() {
            const userType = this.getAttribute('data-type');
            selectUserType(userType);
        });
    });

    // Configurar envío de formularios
    userForms.forEach(form => {
        form.addEventListener('submit', handleRegistration);
    });
}

// Inicializar login
function initializeLogin() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', handleForgotPassword);
    }
}

// Seleccionar tipo de usuario
function selectUserType(userType) {
    // Remover selección anterior
    document.querySelectorAll('.type-card').forEach(card => {
        card.classList.remove('selected');
        card.querySelector('.select-type').textContent = 'Seleccionar';
    });

    // Agregar selección actual
    const selectedCard = document.querySelector(`[data-type="${userType}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
        selectedCard.querySelector('.select-type').textContent = '✅ Seleccionado';
    }

    // Mostrar formulario correspondiente
    document.querySelectorAll('.user-form').forEach(form => {
        form.style.display = 'none';
    });

    const targetForm = document.getElementById(`${userType}Form`);
    if (targetForm) {
        targetForm.style.display = 'block';
        
        // Scroll suave al formulario
        targetForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Manejar registro
function handleRegistration(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const userType = form.id.replace('Form', '');
    
    // Validaciones básicas
    if (!validateRegistration(form, userType)) {
        return;
    }

    // Mostrar loading
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '⏳ Procesando...';
    submitBtn.disabled = true;

    // Simular envío a servidor
    setTimeout(() => {
        // En una aplicación real, aquí iría la llamada a la API
        const userData = {
            type: userType,
            email: formData.get('email'),
            nombre: formData.get('nombre'),
            timestamp: new Date().toISOString()
        };

        // Guardar en localStorage (simulación)
        saveRegistration(userData);
        
        // Mostrar éxito
        showNotification('✅ ¡Registro exitoso! Redirigiendo...', 'success');
        
        // Redirigir según tipo de usuario
        setTimeout(() => {
            redirectAfterRegistration(userType);
        }, 2000);
        
    }, 1500);
}

// Validar registro
function validateRegistration(form, userType) {
    const formData = new FormData(form);
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    
    // Validar contraseñas
    if (password !== confirmPassword) {
        showNotification('❌ Las contraseñas no coinciden', 'error');
        return false;
    }
    
    // Validar fortaleza de contraseña
    if (!isPasswordStrong(password)) {
        showNotification('🔒 La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas y números', 'error');
        return false;
    }
    
    // Validaciones específicas por tipo de usuario
    switch(userType) {
        case 'adoptante':
            const edad = parseInt(formData.get('edad'));
            if (edad < 18) {
                showNotification('❌ Debes ser mayor de 18 años para adoptar', 'error');
                return false;
            }
            break;
            
        case 'rescatista':
            if (!formData.get('refugioNombre')) {
                showNotification('❌ El nombre del refugio es obligatorio', 'error');
                return false;
            }
            break;
            
        case 'administrador':
            if (!formData.get('razon') || formData.get('razon').length < 10) {
                showNotification('❌ Por favor explica detalladamente la razón para solicitar acceso', 'error');
                return false;
            }
            break;
    }
    
    return true;
}

// Manejar login
function handleLogin(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const email = formData.get('email');
    const password = formData.get('password');
    const remember = formData.get('remember');
    
    // Mostrar loading
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '🔐 Verificando...';
    submitBtn.disabled = true;

    // Simular autenticación
    setTimeout(() => {
        // En una aplicación real, aquí iría la llamada a la API
        const user = authenticateUser(email, password);
        
        if (user) {
            // Guardar sesión
            saveUserSession(user, remember);
            
            showNotification(`🎉 ¡Bienvenido de nuevo, ${user.nombre}!`, 'success');
            
            // Redirigir al dashboard correspondiente
            setTimeout(() => {
                redirectToDashboard(user.type);
            }, 1500);
        } else {
            showNotification('❌ Credenciales incorrectas. Por favor verifica tu email y contraseña.', 'error');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }, 2000);
}

// Manejar recuperación de contraseña
function handleForgotPassword(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const email = formData.get('email');
    
    // Validar email
    if (!isValidEmail(email)) {
        showNotification('❌ Por favor ingresa un email válido', 'error');
        return;
    }
    
    // Mostrar loading
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '📧 Enviando...';
    submitBtn.disabled = true;

    // Simular envío de email
    setTimeout(() => {
        showNotification('✅ ¡Email enviado! Revisa tu bandeja de entrada para las instrucciones.', 'success');
        closeModal('forgotPasswordModal');
        form.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

// Autenticar usuario (simulación)
function authenticateUser(email, password) {
    // Usuarios de demostración
    const demoUsers = {
        'adoptante@demo.com': {
            id: 1,
            email: 'adoptante@demo.com',
            password: 'Password123!',
            nombre: 'María González',
            type: 'adoptante',
            avatar: '👤'
        },
        'rescatista@demo.com': {
            id: 2,
            email: 'rescatista@demo.com',
            password: 'Password123!',
            nombre: 'Refugio Patitas Felices',
            type: 'rescatista',
            avatar: '🏠'
        },
        'admin@demo.com': {
            id: 3,
            email: 'admin@demo.com',
            password: 'Password123!',
            nombre: 'Administrador Sistema',
            type: 'administrador',
            avatar: '⚙️'
        }
    };
    
    const user = demoUsers[email];
    if (user && user.password === password) {
        return user;
    }
    
    // También verificar localStorage para usuarios registrados
    const storedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
    const storedUser = storedUsers[email];
    if (storedUser && storedUser.password === password) {
        return storedUser;
    }
    
    return null;
}

// Guardar registro
function saveRegistration(userData) {
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
    users[userData.email] = userData;
    localStorage.setItem('registeredUsers', JSON.stringify(users));
}

// Guardar sesión de usuario
function saveUserSession(user, remember) {
    const sessionData = {
        user: user,
        timestamp: new Date().toISOString(),
        expires: remember ? Date.now() + (30 * 24 * 60 * 60 * 1000) : Date.now() + (24 * 60 * 60 * 1000) // 30 días o 1 día
    };
    
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('userSession', JSON.stringify(sessionData));
}

// Configurar fortaleza de contraseña
function setupPasswordStrength() {
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    
    passwordInputs.forEach(input => {
        input.addEventListener('input', function() {
            const strengthIndicator = this.parentNode.querySelector('.password-strength');
            if (strengthIndicator) {
                updatePasswordStrength(this.value, strengthIndicator);
            }
            
            // Validar confirmación de contraseña
            const confirmInput = document.getElementById(this.id.replace('Password', 'ConfirmPassword'));
            if (confirmInput && confirmInput.value) {
                validatePasswordMatch(this, confirmInput);
            }
        });
    });
    
    // Validar confirmación de contraseña en tiempo real
    const confirmInputs = document.querySelectorAll('input[id*="ConfirmPassword"]');
    confirmInputs.forEach(input => {
        input.addEventListener('input', function() {
            const passwordInput = document.getElementById(this.id.replace('ConfirmPassword', 'Password'));
            if (passwordInput) {
                validatePasswordMatch(passwordInput, this);
            }
        });
    });
}

// Actualizar indicador de fortaleza de contraseña
function updatePasswordStrength(password, indicator) {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    indicator.className = 'password-strength';
    
    if (password.length === 0) {
        return;
    } else if (strength <= 2) {
        indicator.classList.add('weak');
    } else if (strength <= 4) {
        indicator.classList.add('medium');
    } else {
        indicator.classList.add('strong');
    }
}

// Validar coincidencia de contraseñas
function validatePasswordMatch(passwordInput, confirmInput) {
    if (passwordInput.value !== confirmInput.value) {
        confirmInput.style.borderColor = 'var(--danger)';
    } else {
        confirmInput.style.borderColor = 'var(--success)';
    }
}

// Verificar fortaleza de contraseña
function isPasswordStrong(password) {
    return password.length >= 8 &&
           /[a-z]/.test(password) &&
           /[A-Z]/.test(password) &&
           /[0-9]/.test(password);
}

// Validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Redirigir después del registro
function redirectAfterRegistration(userType) {
    // Usar las rutas reales de tus archivos HTML
    const routes = {
        adoptante: 'dashboard_adoptante.html',
        rescatista: 'dashboard_rescatista.html',
        // Antes: 'pending-approval.html' (que no existe)
        administrador: 'dashboard-admin.html'
    };

    const target = routes[userType] || 'index.html';
    window.location.href = target;
}

// Redirigir al dashboard (por ejemplo, después de login)
function redirectToDashboard(userType) {
    // Si no nos pasan el tipo explícito, intentamos sacar el usuario actual
    if (!userType && typeof SessionManager !== 'undefined') {
        const current = SessionManager.getCurrentUser();
        if (current) {
            userType = current.type;
        }
    }

    const routes = {
        adoptante: 'dashboard_adoptante.html',
        rescatista: 'dashboard_rescatista.html',
        administrador: 'dashboard-admin.html'
    };

    const target = routes[userType] || 'index.html';
    window.location.href = target;
}
// Llenar datos de demostración
function fillDemo(userType) {
    const demos = {
        'adoptante': {
            email: 'adoptante@demo.com',
            password: 'Password123!'
        },
        'rescatista': {
            email: 'rescatista@demo.com',
            password: 'Password123!'
        },
        'admin': {
            email: 'admin@demo.com',
            password: 'Password123!'
        }
    };
    
    const demo = demos[userType];
    if (demo) {
        document.getElementById('loginEmail').value = demo.email;
        document.getElementById('loginPassword').value = demo.password;
        showNotification(`🔐 Datos de ${userType} cargados. ¡Ahora puedes iniciar sesión!`, 'info');
    }
}

// Mostrar notificación
function showNotification(message, type = 'info') {
    // Remover notificación anterior si existe
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Estilos para la notificación
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        padding: 1rem;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        border-left: 4px solid var(--${type});
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Alternar visibilidad de contraseña
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const toggleBtn = input.parentNode.querySelector('.password-toggle');
    
    if (input.type === 'password') {
        input.type = 'text';
        toggleBtn.innerHTML = '👁️‍🗨️';
    } else {
        input.type = 'password';
        toggleBtn.innerHTML = '👁️';
    }
}

// Funciones de modal (si no están en main.js)
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Cerrar modal al hacer clic fuera
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Cerrar modal con ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
        document.body.style.overflow = 'auto';
    }
});

