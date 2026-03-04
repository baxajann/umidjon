import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const saved = storage.getCurrentUser();
        if (saved) setCurrentUser(saved);
        setLoading(false);
    }, []);

    const login = (email, password) => {
        const users = storage.getUsers();
        const user = users.find(u => u.email === email && u.password === password);
        if (!user) return { success: false, error: 'Неверный email или пароль' };
        const { password: _, ...safeUser } = user;
        storage.setCurrentUser(safeUser);
        setCurrentUser(safeUser);
        return { success: true, user: safeUser };
    };

    const register = (data) => {
        const users = storage.getUsers();
        if (users.find(u => u.email === data.email)) return { success: false, error: 'Email уже зарегистрирован' };
        const newUser = {
            id: storage.generateId('u'), name: `${data.firstName} ${data.lastName}`,
            email: data.email, password: data.password, role: data.role || 'user',
            bio: '', avatar: '', rating: 0, createdAt: new Date().toISOString(),
        };
        storage.setUsers([...users, newUser]);
        const { password: _, ...safeUser } = newUser;
        storage.setCurrentUser(safeUser);
        setCurrentUser(safeUser);
        return { success: true };
    };

    const logout = () => {
        storage.clearCurrentUser();
        setCurrentUser(null);
    };

    const updateProfile = (updates) => {
        const users = storage.getUsers();
        const idx = users.findIndex(u => u.id === currentUser.id);
        if (idx === -1) return;
        users[idx] = { ...users[idx], ...updates };
        storage.setUsers(users);
        const { password: _, ...safeUser } = users[idx];
        storage.setCurrentUser(safeUser);
        setCurrentUser(safeUser);
    };

    const changePassword = (oldPass, newPass) => {
        const users = storage.getUsers();
        const idx = users.findIndex(u => u.id === currentUser.id);
        if (idx === -1 || users[idx].password !== oldPass) return { success: false, error: 'Неверный текущий пароль' };
        users[idx].password = newPass;
        storage.setUsers(users);
        return { success: true };
    };

    return (
        <AuthContext.Provider value={{ currentUser, loading, login, register, logout, updateProfile, changePassword }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
