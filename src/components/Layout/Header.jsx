import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useData } from '../../context/DataContext.jsx';
import { timeAgo } from '../../utils/helpers.js';

const notifColors = { task: '#6c63ff', comment: '#4cc9f0', product: '#06d6a0', system: '#ff9a3c' };
const notifEmoji = { task: '✅', comment: '💬', product: '🛒', system: '🔔' };

export function Header({ onMenuToggle, pageTitle }) {
    const [showNotif, setShowNotif] = useState(false);
    const { currentUser } = useAuth();
    const { notifications, markAllRead, markRead } = useData();
    const navigate = useNavigate();
    const ref = useRef();

    const myNotifs = notifications.filter(n => n.userId === currentUser?.id);
    const unread = myNotifs.filter(n => !n.read).length;

    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setShowNotif(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleNotifClick = (n) => { markRead(n.id); setShowNotif(false); };
    const initials = currentUser?.name?.split(' ').slice(0, 2).map(x => x[0]).join('').toUpperCase() || '?';

    return (
        <header className="header">
            <div className="header-left">
                <button className="btn btn-ghost btn-icon mobile-menu-btn" onClick={onMenuToggle}>☰</button>
                <button className="btn btn-ghost btn-icon" onClick={onMenuToggle} style={{ display: 'flex' }}>
                    ☰
                </button>
                <h1 className="page-title" style={{ fontSize: '1.1rem', fontWeight: 700 }}>{pageTitle}</h1>
            </div>
            <div className="header-right">
                <div className="relative" ref={ref}>
                    <button
                        className="btn btn-ghost btn-icon"
                        style={{ position: 'relative' }}
                        onClick={() => setShowNotif(v => !v)}
                        id="notif-bell"
                    >
                        🔔
                        {unread > 0 && (
                            <span style={{
                                position: 'absolute', top: 4, right: 4,
                                background: 'var(--danger)', color: '#fff',
                                fontSize: '0.6rem', fontWeight: 700,
                                width: 16, height: 16, borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                border: '2px solid var(--bg-surface)',
                            }}>{unread > 9 ? '9+' : unread}</span>
                        )}
                    </button>
                    {showNotif && (
                        <div className="notif-dropdown">
                            <div className="notif-header">
                                <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Уведомления</h4>
                                {unread > 0 && (
                                    <button className="btn btn-ghost" style={{ fontSize: '0.75rem', padding: '2px 8px' }}
                                        onClick={() => markAllRead(currentUser.id)}>
                                        Прочитать все
                                    </button>
                                )}
                            </div>
                            <div className="notif-list">
                                {myNotifs.length === 0 && (
                                    <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                        Нет уведомлений
                                    </div>
                                )}
                                {myNotifs.slice(0, 10).map(n => (
                                    <div key={n.id} className={`notif-item ${!n.read ? 'unread' : ''}`}
                                        onClick={() => handleNotifClick(n)}>
                                        <div className="notif-icon" style={{ background: `${notifColors[n.type]}22` }}>
                                            {notifEmoji[n.type] || '🔔'}
                                        </div>
                                        <div className="notif-content">
                                            <div className="notif-text">{n.text}</div>
                                            <div className="notif-time">{timeAgo(n.createdAt)}</div>
                                        </div>
                                        {!n.read && <div className="notif-dot" />}
                                    </div>
                                ))}
                            </div>
                            {myNotifs.length > 0 && (
                                <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
                                    <button className="btn btn-ghost" style={{ fontSize: '0.8rem' }}
                                        onClick={() => { navigate('/notifications'); setShowNotif(false); }}>
                                        Все уведомления →
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <div
                    className="avatar avatar-sm"
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate('/profile')}
                    title={currentUser?.name}
                >
                    {currentUser?.avatar ? <img src={currentUser.avatar} alt="" /> : initials}
                </div>
            </div>
        </header>
    );
}
