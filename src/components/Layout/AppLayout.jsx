import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar.jsx';
import { Header } from './Header.jsx';

const pageTitles = {
    '/dashboard': 'Дашборд',
    '/projects': 'Проекты',
    '/tasks': 'Задачи',
    '/marketplace': 'Маркетплейс',
    '/notifications': 'Уведомления',
    '/profile': 'Профиль',
    '/admin': 'Администратор',
};

export function AppLayout({ children }) {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();

    const getTitle = () => {
        for (const [path, title] of Object.entries(pageTitles)) {
            if (location.pathname.startsWith(path)) return title;
        }
        return 'ProManage';
    };

    return (
        <div className="app-layout">
            <div className="bg-mesh" />
            <Sidebar
                collapsed={collapsed}
                onToggle={() => { setCollapsed(v => !v); setMobileOpen(false); }}
                mobileOpen={mobileOpen}
                onMobileClose={() => setMobileOpen(false)}
            />
            <div className={`main-content ${collapsed ? 'sidebar-collapsed' : ''}`} style={{ position: 'relative', zIndex: 1 }}>
                <Header
                    onMenuToggle={() => { if (window.innerWidth <= 1024) setMobileOpen(v => !v); else setCollapsed(v => !v); }}
                    pageTitle={getTitle()}
                />
                <div className="page-content">
                    {children}
                </div>
            </div>
        </div>
    );
}
