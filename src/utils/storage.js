import { STORAGE_KEYS } from './mockData.js';

export const storage = {
    get: (key) => {
        try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
    },
    set: (key, value) => {
        localStorage.setItem(key, JSON.stringify(value));
    },
    getUsers: () => storage.get(STORAGE_KEYS.USERS) || [],
    setUsers: (u) => storage.set(STORAGE_KEYS.USERS, u),
    getProjects: () => storage.get(STORAGE_KEYS.PROJECTS) || [],
    setProjects: (p) => storage.set(STORAGE_KEYS.PROJECTS, p),
    getTasks: () => storage.get(STORAGE_KEYS.TASKS) || [],
    setTasks: (t) => storage.set(STORAGE_KEYS.TASKS, t),
    getProducts: () => storage.get(STORAGE_KEYS.PRODUCTS) || [],
    setProducts: (p) => storage.set(STORAGE_KEYS.PRODUCTS, p),
    getNotifications: () => storage.get(STORAGE_KEYS.NOTIFICATIONS) || [],
    setNotifications: (n) => storage.set(STORAGE_KEYS.NOTIFICATIONS, n),
    getOrders: () => storage.get('pm_orders') || [],
    setOrders: (o) => storage.set('pm_orders', o),
    getCurrentUser: () => storage.get(STORAGE_KEYS.CURRENT_USER),
    setCurrentUser: (u) => storage.set(STORAGE_KEYS.CURRENT_USER, u),
    clearCurrentUser: () => localStorage.removeItem(STORAGE_KEYS.CURRENT_USER),

    generateId: (prefix = 'id') => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
};
