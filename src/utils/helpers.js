import { ROLES } from './mockData.js';

export const canAddProduct = (role) => [ROLES.SELLER, ROLES.ADMIN].includes(role);
export const canModerate = (role) => role === ROLES.ADMIN;
export const canAccessAdmin = (role) => role === ROLES.ADMIN;
export const canManageProject = (role) => [ROLES.ADMIN, ROLES.PM].includes(role);

export const getRoleBadgeClass = (role) => {
    const map = { admin: 'badge-danger', seller: 'badge-success', 'project-manager': 'badge-primary', user: 'badge-secondary' };
    return map[role] || 'badge-secondary';
};

export const getRoleLabel = (role) => {
    const map = { admin: 'Администратор', seller: 'Продавец', 'project-manager': 'Менеджер', user: 'Пользователь' };
    return map[role] || role;
};

export const getPriorityClass = (p) => {
    const map = { urgent: 'badge-danger', high: 'badge-warning', medium: 'badge-primary', low: 'badge-secondary' };
    return map[p] || 'badge-secondary';
};
export const getPriorityLabel = (p) => {
    const map = { urgent: 'Срочно', high: 'Высокий', medium: 'Средний', low: 'Низкий' };
    return map[p] || p;
};

export const getStatusClass = (s) => {
    const map = { new: 'badge-secondary', 'in-progress': 'badge-primary', review: 'badge-warning', done: 'badge-success', active: 'badge-success', completed: 'badge-info', paused: 'badge-warning', approved: 'badge-success', pending: 'badge-orange', rejected: 'badge-danger' };
    return map[s] || 'badge-secondary';
};
export const getStatusLabel = (s) => {
    const map = { new: 'Новая', 'in-progress': 'В работе', review: 'На проверке', done: 'Выполнена', active: 'Активный', completed: 'Завершён', paused: 'Приостановлен', approved: 'Одобрен', pending: 'На модерации', rejected: 'Отклонён' };
    return map[s] || s;
};

export const formatDate = (d) => {
    if (!d) return '';
    try { return new Date(d).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }); }
    catch { return d; }
};

export const timeAgo = (d) => {
    if (!d) return '';
    const diff = Date.now() - new Date(d).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'только что';
    if (m < 60) return `${m} мин. назад`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h} ч. назад`;
    const days = Math.floor(h / 24);
    if (days < 30) return `${days} дн. назад`;
    return formatDate(d);
};
