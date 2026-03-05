import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useData } from '../../context/DataContext.jsx';
import { canAccessAdmin } from '../../utils/helpers.js';

const navItems = [
    { icon: '📊', label: 'Дашборд', path: '/dashboard', section: 'main' },
    { icon: '📁', label: 'Проекты', path: '/projects', section: 'main' },
    { icon: '✅', label: 'Задачи', path: '/tasks', section: 'main' },
    { icon: '🛒', label: 'Маркетплейс', path: '/marketplace', section: 'main' },
    { icon: '🔔', label: 'Уведомления', path: '/notifications', section: 'other' },
    { icon: '👤', label: 'Профиль', path: '/profile', section: 'other' },
    { icon: '🛡️', label: 'Администратор', path: '/admin', section: 'admin', adminOnly: true },
];

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser, logout } = useAuth();
    const { notifications } = useData();

    const unread = notifications.filter(n => n.userId === currentUser?.id && !n.read).length;

    const handleNav = (path) => {
        navigate(path);
        if (mobileOpen) onMobileClose();
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const filtered = navItems.filter(i => (!i.adminOnly || canAccessAdmin(currentUser?.role)));
    const mainItems = filtered.filter(i => i.section === 'main');
    const otherItems = filtered.filter(i => i.section === 'other');
    const adminItems = filtered.filter(i => i.section === 'admin');

    const BRAND = {
        admin: { icon: '🛡️', name: 'AdminPanel', cls: 'brand-admin' },
        seller: { icon: '🛍️', name: 'SellerHub', cls: 'brand-seller' },
        'project-manager': { icon: '📁', name: 'ProjectHub', cls: 'brand-pm' },
        user: { icon: '💼', name: 'WorkSpace', cls: 'brand-user' },
    };
    const brand = BRAND[currentUser?.role] || { icon: '⚡', name: 'ProManage', cls: '' };

    return (
        <>
            {mobileOpen && <div className="sidebar-overlay" onClick={onMobileClose} />}
            <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'open' : ''}`}>
                <div className={`sidebar-logo ${brand.cls}`}>
                    <div className="logo-icon">{brand.icon}</div>
                    <span className="logo-text text-gradient">{brand.name}</span>
                    <button
                        className="btn btn-ghost btn-icon"
                        onClick={onToggle}
                        style={{ marginLeft: 'auto', display: 'none' }}
                    />
                </div>

                <nav className="sidebar-nav">
                    {!collapsed && <div className="nav-section-title">Главное</div>}
                    {mainItems.map(item => (
                        <div key={item.path}
                            className={`nav-item ${location.pathname.startsWith(item.path) ? 'active' : ''}`}
                            onClick={() => handleNav(item.path)}
                        >
                            <span className="nav-item-icon">{item.icon}</span>
                            <span className="nav-item-label">{item.label}</span>
                            {item.path === '/notifications' && unread > 0 && (
                                <span className="nav-item-badge">{unread}</span>
                            )}
                        </div>
                    ))}

                    {!collapsed && <div className="nav-section-title">Аккаунт</div>}
                    {otherItems.map(item => (
                        <div key={item.path}
                            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                            onClick={() => handleNav(item.path)}
                        >
                            <span className="nav-item-icon">{item.icon}</span>
                            <span className="nav-item-label">{item.label}</span>
                            {item.path === '/notifications' && unread > 0 && (
                                <span className="nav-item-badge">{unread}</span>
                            )}
                        </div>
                    ))}

                    {adminItems.length > 0 && (
                        <>
                            {!collapsed && <div className="nav-section-title">Система</div>}
                            {adminItems.map(item => (
                                <div key={item.path}
                                    className={`nav-item ${location.pathname.startsWith(item.path) ? 'active' : ''}`}
                                    onClick={() => handleNav(item.path)}
                                >
                                    <span className="nav-item-icon">{item.icon}</span>
                                    <span className="nav-item-label">{item.label}</span>
                                </div>
                            ))}
                        </>
                    )}
                </nav>

                <div className="sidebar-footer">
                    <div className="nav-item" onClick={handleLogout}>
                        <span className="nav-item-icon">🚪</span>
                        <span className="nav-item-label">Выйти</span>
                    </div>
                </div>
            </aside>
        </>
    );
}
