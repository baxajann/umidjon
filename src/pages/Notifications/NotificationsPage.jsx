import React from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useData } from '../../context/DataContext.jsx';
import { timeAgo } from '../../utils/helpers.js';

const NOTIF_COLORS = { task: '#6c63ff', comment: '#4cc9f0', product: '#06d6a0', system: '#ff9a3c' };
const NOTIF_EMOJI = { task: '✅', comment: '💬', product: '🛒', system: '🔔' };

export function NotificationsPage() {
    const { currentUser } = useAuth();
    const { notifications, markAllRead, markRead } = useData();
    const myNotifs = notifications.filter(n => n.userId === currentUser?.id);
    const unread = myNotifs.filter(n => !n.read).length;

    return (
        <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <h2 style={{ fontWeight: 800, marginBottom: 4 }}>Уведомления</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{unread} непрочитанных</p>
                </div>
                {unread > 0 && (
                    <button className="btn btn-secondary btn-sm" onClick={() => markAllRead(currentUser.id)}>
                        ✓ Прочитать все
                    </button>
                )}
            </div>

            {myNotifs.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">🔔</div>
                    <div className="empty-title">Нет уведомлений</div>
                    <div className="empty-desc">Здесь будут появляться уведомления о задачах, комментариях и товарах</div>
                </div>
            ) : (
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    {myNotifs.map((n, i) => (
                        <div key={n.id}
                            className={`notif-item ${!n.read ? 'unread' : ''}`}
                            style={{ borderBottom: i < myNotifs.length - 1 ? '1px solid var(--border)' : 'none', padding: '16px 20px' }}
                            onClick={() => markRead(n.id)}
                        >
                            <div className="notif-icon" style={{ background: `${NOTIF_COLORS[n.type] || '#9da8d0'}22`, width: 44, height: 44, borderRadius: 'var(--radius-md)', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                {NOTIF_EMOJI[n.type] || '🔔'}
                            </div>
                            <div className="notif-content">
                                <div className="notif-text">{n.text}</div>
                                <div className="notif-time">{timeAgo(n.createdAt)}</div>
                            </div>
                            {!n.read && <div className="notif-dot" />}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
