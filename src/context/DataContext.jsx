import React, { createContext, useContext, useState, useCallback } from 'react';
import { storage } from '../utils/storage.js';

const DataContext = createContext(null);

export function DataProvider({ children }) {
    const [projects, setProjectsState] = useState(() => storage.getProjects());
    const [tasks, setTasksState] = useState(() => storage.getTasks());
    const [products, setProductsState] = useState(() => storage.getProducts());
    const [notifications, setNotificationsState] = useState(() => storage.getNotifications());
    const [users] = useState(() => storage.getUsers());

    const refresh = useCallback(() => {
        setProjectsState(storage.getProjects());
        setTasksState(storage.getTasks());
        setProductsState(storage.getProducts());
        setNotificationsState(storage.getNotifications());
    }, []);

    // --- PROJECTS ---
    const createProject = (data) => {
        const all = storage.getProjects();
        const np = { id: storage.generateId('p'), ...data, progress: 0, createdAt: new Date().toISOString() };
        const updated = [...all, np];
        storage.setProjects(updated); setProjectsState(updated); return np;
    };
    const updateProject = (id, updates) => {
        const all = storage.getProjects().map(p => p.id === id ? { ...p, ...updates } : p);
        storage.setProjects(all); setProjectsState(all);
    };
    const deleteProject = (id) => {
        const all = storage.getProjects().filter(p => p.id !== id);
        storage.setProjects(all); setProjectsState(all);
        const allTasks = storage.getTasks().filter(t => t.projectId !== id);
        storage.setTasks(allTasks); setTasksState(allTasks);
    };

    // --- TASKS ---
    const createTask = (data, currentUserId) => {
        const all = storage.getTasks();
        const nt = { id: storage.generateId('t'), ...data, comments: [], createdAt: new Date().toISOString() };
        const updated = [...all, nt];
        storage.setTasks(updated); setTasksState(updated);
        if (data.assigneeId && data.assigneeId !== currentUserId) {
            addNotification(data.assigneeId, 'task', `Вам назначена задача «${data.title}»`);
        }
        recalcProgress(data.projectId, updated);
        return nt;
    };
    const updateTask = (id, updates) => {
        const all = storage.getTasks().map(t => t.id === id ? { ...t, ...updates } : t);
        storage.setTasks(all); setTasksState(all);
        const task = all.find(t => t.id === id);
        if (task) recalcProgress(task.projectId, all);
    };
    const deleteTask = (id) => {
        const task = storage.getTasks().find(t => t.id === id);
        const all = storage.getTasks().filter(t => t.id !== id);
        storage.setTasks(all); setTasksState(all);
        if (task) recalcProgress(task.projectId, all);
    };
    const addComment = (taskId, userId, text) => {
        const all = storage.getTasks().map(t => {
            if (t.id !== taskId) return t;
            const comment = { id: storage.generateId('c'), userId, text, createdAt: new Date().toISOString() };
            return { ...t, comments: [...(t.comments || []), comment] };
        });
        storage.setTasks(all); setTasksState(all);
        const task = all.find(t => t.id === taskId);
        if (task && task.assigneeId && task.assigneeId !== userId) {
            addNotification(task.assigneeId, 'comment', `Новый комментарий к задаче «${task.title}»`);
        }
    };
    const recalcProgress = (projectId, allTasks) => {
        const pt = allTasks.filter(t => t.projectId === projectId);
        if (!pt.length) return;
        const done = pt.filter(t => t.status === 'done').length;
        const progress = Math.round((done / pt.length) * 100);
        const allP = storage.getProjects().map(p => p.id === projectId ? { ...p, progress } : p);
        storage.setProjects(allP); setProjectsState(allP);
    };

    // --- PRODUCTS ---
    const createProduct = (data, sellerId) => {
        const all = storage.getProducts();
        const np = { id: storage.generateId('pr'), sellerId, ...data, status: 'pending', rating: 0, reviews: 0, createdAt: new Date().toISOString() };
        const updated = [...all, np];
        storage.setProducts(updated); setProductsState(updated); return np;
    };
    const updateProduct = (id, updates) => {
        const all = storage.getProducts().map(p => p.id === id ? { ...p, ...updates } : p);
        storage.setProducts(all); setProductsState(all);
    };
    const deleteProduct = (id) => {
        const all = storage.getProducts().filter(p => p.id !== id);
        storage.setProducts(all); setProductsState(all);
    };
    const moderateProduct = (id, action) => {
        const product = storage.getProducts().find(p => p.id === id);
        const newStatus = action === 'approve' ? 'approved' : 'rejected';
        updateProduct(id, { status: newStatus });
        if (product) {
            const msg = action === 'approve'
                ? `Ваш товар «${product.name}» одобрен и опубликован в маркетплейсе`
                : `Ваш товар «${product.name}» отклонён администратором`;
            addNotification(product.sellerId, 'product', msg);
        }
    };

    // --- USERS ---
    const blockUser = (id, blocked) => {
        const all = storage.getUsers().map(u => u.id === id ? { ...u, blocked } : u);
        storage.setUsers(all);
    };

    // --- NOTIFICATIONS ---
    const addNotification = (userId, type, text) => {
        const all = storage.getNotifications();
        const nn = { id: storage.generateId('n'), userId, type, text, read: false, createdAt: new Date().toISOString() };
        const updated = [nn, ...all];
        storage.setNotifications(updated); setNotificationsState(updated);
    };
    const markAllRead = (userId) => {
        const all = storage.getNotifications().map(n => n.userId === userId ? { ...n, read: true } : n);
        storage.setNotifications(all); setNotificationsState(all);
    };
    const markRead = (id) => {
        const all = storage.getNotifications().map(n => n.id === id ? { ...n, read: true } : n);
        storage.setNotifications(all); setNotificationsState(all);
    };

    return (
        <DataContext.Provider value={{
            projects, tasks, products, notifications, users, refresh,
            createProject, updateProject, deleteProject,
            createTask, updateTask, deleteTask, addComment,
            createProduct, updateProduct, deleteProduct, moderateProduct,
            blockUser, addNotification, markAllRead, markRead,
        }}>
            {children}
        </DataContext.Provider>
    );
}

export const useData = () => useContext(DataContext);
