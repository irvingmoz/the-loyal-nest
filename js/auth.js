// js/auth.js
// Registro/Login/Logout con validación, tokens y redirección por rol

function ensureSessionModule() {
    if (typeof persistSession !== 'function') {
        console.warn('session.js debe cargarse antes de auth.js');
    }
}
ensureSessionModule();

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const roleSelector = document.querySelectorAll('[data-role-select]');

    if (registerForm) registerForm.addEventListener('submit', handleRegister);
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    roleSelector.forEach((btn) => btn.addEventListener('click', () => selectRole(btn.dataset.roleSelect)));
});

function selectRole(role) {
    const roleInput = document.getElementById('role');
    if (roleInput) roleInput.value = role;
}

function setLoading(form, isLoading) {
    const submit = form.querySelector('button[type="submit"]');
    if (submit) submit.disabled = isLoading;
    form.querySelectorAll('input, select').forEach((el) => { el.disabled = isLoading; });
}

function validatePassword(password) {
    const rules = [/.{8,}/, /[A-Z]/, /[0-9]/, /[!@#$%^&*()_+\-={}\[\]:;"'`~<>,.?/]/];
    return rules.every((r) => r.test(password));
}

async function handleRegister(event) {
    event.preventDefault();
    const form = event.target;
    const data = Object.fromEntries(new FormData(form).entries());
    if (!validatePassword(data.password)) {
        showFormError(form, 'La contraseña debe tener 8 caracteres, una mayúscula, un número y un símbolo.');
        return;
    }
    try {
        setLoading(form, true);
        const res = await fetch('/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: data.name,
                email: data.email,
                password: data.password,
                role: data.role || 'adoptante'
            })
        });
        if (!res.ok) throw new Error('Registro fallido');
        const payload = await res.json();
        persistSession({ token: payload.token, user: payload.user, expiresIn: payload.expiresIn });
        redirectToDashboard(payload.user.role);
    } catch (error) {
        console.error(error);
        showFormError(form, 'No se pudo crear la cuenta.');
    } finally {
        setLoading(form, false);
    }
}

async function handleLogin(event) {
    event.preventDefault();
    const form = event.target;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
        setLoading(form, true);
        const res = await fetch('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: data.email, password: data.password })
        });
        if (!res.ok) throw new Error('Login fallido');
        const payload = await res.json();
        persistSession({ token: payload.token, user: payload.user, expiresIn: payload.expiresIn });
        redirectToDashboard(payload.user.role);
    } catch (error) {
        console.error(error);
        showFormError(form, 'Credenciales incorrectas o servidor no disponible.');
    } finally {
        setLoading(form, false);
    }
}

function logout() {
    clearSession();
    window.location.href = 'auth.html';
}

function showFormError(form, message) {
    let box = form.querySelector('.form-error');
    if (!box) {
        box = document.createElement('div');
        box.className = 'form-error';
        form.prepend(box);
    }
    box.textContent = message;
}
