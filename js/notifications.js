// js/notifications.js
// Notificaciones globales con polling simple

let notificationsInterval;

document.addEventListener('DOMContentLoaded', () => {
    const bell = document.getElementById('notificationBell');
    if (bell) startNotifications();
});

function startNotifications() {
    fetchNotifications();
    clearInterval(notificationsInterval);
    notificationsInterval = setInterval(fetchNotifications, 30000);
}

async function fetchNotifications() {
    const list = document.getElementById('notificationList');
    const counter = document.getElementById('notificationCount');
    try {
        const res = await apiFetch('/notifications');
        if (!res.ok) throw new Error('No se pudieron obtener notificaciones');
        const data = await res.json();
        counter && (counter.textContent = data.filter((n) => !n.read).length);
        renderNotifications(data);
    } catch (error) {
        console.error(error);
        if (counter) counter.textContent = '0';
    }
}

function renderNotifications(items) {
    const list = document.getElementById('notificationList');
    if (!list) return;
    if (!items.length) {
        list.innerHTML = '<li class="muted">Sin notificaciones</li>';
        return;
    }
    list.innerHTML = items.map((n) => `
        <li class="notification ${n.read ? 'read' : 'unread'}">
            <div>
                <p>${n.title || 'Notificación'}</p>
                <small>${n.date || ''}</small>
            </div>
            ${n.read ? '' : `<button class="btn-text" onclick="markNotificationRead('${n.id}')">Marcar leído</button>`}
        </li>
    `).join('');
}

async function markNotificationRead(id) {
    try {
        const res = await apiFetch(`/notifications/${id}/read`, { method: 'POST' });
        if (!res.ok) throw new Error('No se pudo marcar leído');
        fetchNotifications();
    } catch (error) {
        console.error(error);
    }
}
