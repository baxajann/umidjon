import React, { useState } from 'react';
import { useData } from '../../context/DataContext.jsx';
import { storage } from '../../utils/storage.js';
import { getStatusClass, getStatusLabel, getRoleLabel, getRoleBadgeClass, formatDate, timeAgo } from '../../utils/helpers.js';
import { Modal } from '../../components/UI/Modal.jsx';

export function AdminPage() {
    const { projects, tasks, products, notifications, users: ctxUsers, moderateProduct, deleteProject, deleteProduct, blockUser } = useData();
    const [users, setUsersState] = useState(() => storage.getUsers());
    const [activeTab, setActiveTab] = useState('overview');

    const refreshUsers = () => setUsersState(storage.getUsers());

    const pending = products.filter(p => p.status === 'pending');
    const approved = products.filter(p => p.status === 'approved');

    const handleBlock = (id, blocked) => {
        blockUser(id, blocked);
        refreshUsers();
    };

    const handleModerate = (id, action) => {
        moderateProduct(id, action);
    };

    return (
        <div className="fade-in">
            <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontWeight: 800, marginBottom: 4 }}>🛡️ Администратор</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Управление платформой</p>
            </div>

            {/* STATS */}
            <div className="stats-grid" style={{ marginBottom: 24 }}>
                {[
                    { icon: '👥', label: 'Пользователей', value: users.length, color: '#6c63ff' },
                    { icon: '📁', label: 'Проектов', value: projects.length, color: '#00d4aa' },
                    { icon: '✅', label: 'Задач', value: tasks.length, color: '#ffd166' },
                    { icon: '⏳', label: 'На модерации', value: pending.length, color: '#ff4d6d' },
                ].map((s, i) => (
                    <div key={i} className="card stat-card" style={{ '--stat-color': s.color }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 8 }}>{s.label}</div>
                                <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
                            </div>
                            <div style={{ fontSize: '2rem' }}>{s.icon}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* TABS */}
            <div className="tabs" style={{ marginBottom: 24, width: 'fit-content', overflowX: 'auto' }}>
                {[['overview', '📊 Обзор'], ['moderation', '⏳ Модерация'], ['users', '👥 Пользователи'], ['projects', '📁 Проекты'], ['products', '🛒 Товары']].map(([v, l]) => (
                    <div key={v} className={`tab ${activeTab === v ? 'active' : ''}`} onClick={() => setActiveTab(v)}>{l}</div>
                ))}
            </div>

            {/* OVERVIEW */}
            {activeTab === 'overview' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                    <div className="card">
                        <h4 style={{ marginBottom: 14 }}>Последние регистрации</h4>
                        {users.slice(-5).reverse().map(u => (
                            <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                                <div className="avatar avatar-xs">{u.name?.[0]}</div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{u.name}</div>
                                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{u.email}</div>
                                </div>
                                <span className={`badge ${getRoleBadgeClass(u.role)}`}>{getRoleLabel(u.role)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="card">
                        <h4 style={{ marginBottom: 14 }}>Товары на модерации</h4>
                        {pending.length === 0 ? (
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: 20 }}>Нет заявок</div>
                        ) : pending.map(p => (
                            <div key={p.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                                <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: 6 }}>{p.name}</div>
                                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 8 }}>{p.description.slice(0, 60)}...</div>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <button className="btn btn-success btn-sm" onClick={() => handleModerate(p.id, 'approve')}>✅ Одобрить</button>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleModerate(p.id, 'reject')}>❌ Отклонить</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="card">
                        <h4 style={{ marginBottom: 14 }}>Активность проектов</h4>
                        {projects.slice(0, 5).map(p => (
                            <div key={p.id} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{p.name}</span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--primary-light)' }}>{p.progress || 0}%</span>
                                </div>
                                <div className="progress-bar"><div className="progress-fill" style={{ width: `${p.progress || 0}%` }} /></div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* MODERATION */}
            {activeTab === 'moderation' && (
                <div>
                    <h3 style={{ marginBottom: 16 }}>Заявки на публикацию ({pending.length})</h3>
                    {pending.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">✅</div>
                            <div className="empty-title">Заявок нет</div>
                            <div className="empty-desc">Все товары проверены</div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            {pending.map(p => {
                                const seller = users.find(u => u.id === p.sellerId) || { name: '?' };
                                return (
                                    <div key={p.id} className="card" style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                                        {p.image && <img src={p.image} alt="" style={{ width: 100, height: 80, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} onError={e => e.target.style.display = 'none'} />}
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                                                <div>
                                                    <div style={{ fontWeight: 700, marginBottom: 4 }}>{p.name}</div>
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>Продавец: {seller.name}</div>
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--secondary)', fontWeight: 700 }}>{p.price?.toLocaleString('ru-RU')} ₽</div>
                                                </div>
                                                <div style={{ display: 'flex', gap: 8 }}>
                                                    <button className="btn btn-success btn-sm" onClick={() => handleModerate(p.id, 'approve')}>✅ Одобрить</button>
                                                    <button className="btn btn-danger btn-sm" onClick={() => handleModerate(p.id, 'reject')}>❌ Отклонить</button>
                                                </div>
                                            </div>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 8, lineHeight: 1.5 }}>{p.description}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* USERS */}
            {activeTab === 'users' && (
                <div>
                    <h3 style={{ marginBottom: 16 }}>Пользователи ({users.length})</h3>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr><th>Пользователь</th><th>Email</th><th>Роль</th><th>Дата</th><th>Статус</th><th>Действия</th></tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <div className="avatar avatar-xs">{u.name?.[0]}</div>
                                                <span style={{ fontWeight: 600 }}>{u.name}</span>
                                            </div>
                                        </td>
                                        <td style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                                        <td><span className={`badge ${getRoleBadgeClass(u.role)}`}>{getRoleLabel(u.role)}</span></td>
                                        <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{formatDate(u.createdAt)}</td>
                                        <td>
                                            {u.blocked
                                                ? <span className="badge badge-danger">Заблокирован</span>
                                                : <span className="badge badge-success">Активен</span>}
                                        </td>
                                        <td>
                                            {u.role !== 'admin' && (
                                                <button
                                                    className={`btn btn-sm ${u.blocked ? 'btn-success' : 'btn-danger'}`}
                                                    onClick={() => handleBlock(u.id, !u.blocked)}
                                                >
                                                    {u.blocked ? 'Разблокировать' : 'Заблокировать'}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* PROJECTS */}
            {activeTab === 'projects' && (
                <div>
                    <h3 style={{ marginBottom: 16 }}>Все проекты ({projects.length})</h3>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr><th>Название</th><th>Статус</th><th>Прогресс</th><th>Участников</th><th>Срок</th><th>Действия</th></tr>
                            </thead>
                            <tbody>
                                {projects.map(p => (
                                    <tr key={p.id}>
                                        <td style={{ fontWeight: 600 }}>{p.name}</td>
                                        <td><span className={`badge ${getStatusClass(p.status)}`}>{getStatusLabel(p.status)}</span></td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <div className="progress-bar" style={{ width: 80 }}><div className="progress-fill" style={{ width: `${p.progress || 0}%` }} /></div>
                                                <span style={{ fontSize: '0.8rem', color: 'var(--primary-light)' }}>{p.progress || 0}%</span>
                                            </div>
                                        </td>
                                        <td>{p.members?.length || 0}</td>
                                        <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{formatDate(p.deadline)}</td>
                                        <td>
                                            <button className="btn btn-danger btn-sm" onClick={() => { if (confirm('Удалить проект?')) deleteProject(p.id); }}>🗑️</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* PRODUCTS */}
            {activeTab === 'products' && (
                <div>
                    <h3 style={{ marginBottom: 16 }}>Все товары ({products.length})</h3>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr><th>Товар</th><th>Продавец</th><th>Цена</th><th>Статус</th><th>Рейтинг</th><th>Действия</th></tr>
                            </thead>
                            <tbody>
                                {products.map(p => {
                                    const seller = users.find(u => u.id === p.sellerId) || { name: '?' };
                                    return (
                                        <tr key={p.id}>
                                            <td style={{ fontWeight: 600 }}>{p.name}</td>
                                            <td style={{ color: 'var(--text-secondary)' }}>{seller.name}</td>
                                            <td><span style={{ color: 'var(--secondary)', fontWeight: 700 }}>{p.price?.toLocaleString('ru-RU')} ₽</span></td>
                                            <td><span className={`badge ${getStatusClass(p.status)}`}>{getStatusLabel(p.status)}</span></td>
                                            <td>{p.rating > 0 ? `⭐ ${p.rating}` : '—'}</td>
                                            <td>
                                                <div style={{ display: 'flex', gap: 6 }}>
                                                    {p.status === 'pending' && <>
                                                        <button className="btn btn-success btn-sm" onClick={() => handleModerate(p.id, 'approve')}>✅</button>
                                                        <button className="btn btn-danger btn-sm" onClick={() => handleModerate(p.id, 'reject')}>❌</button>
                                                    </>}
                                                    <button className="btn btn-danger btn-sm" onClick={() => { if (confirm('Удалить?')) deleteProduct(p.id); }}>🗑️</button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
