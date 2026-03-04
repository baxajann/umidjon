import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useData } from '../../context/DataContext.jsx';
import { formatDate, getPriorityClass, getPriorityLabel, getStatusClass, getStatusLabel, timeAgo } from '../../utils/helpers.js';
import { canAddProduct } from '../../utils/helpers.js';
import { Modal } from '../../components/UI/Modal.jsx';

export function DashboardPage() {
    const { currentUser } = useAuth();
    const { projects, tasks, products, notifications, createProject, users } = useData();
    const navigate = useNavigate();
    const [showNewProject, setShowNewProject] = useState(false);

    const myProjects = projects.filter(p => p.members?.includes(currentUser?.id) || p.ownerId === currentUser?.id);
    const myTasks = tasks.filter(t => t.assigneeId === currentUser?.id);
    const myNotifs = notifications.filter(n => n.userId === currentUser?.id && !n.read);
    const pendingProducts = products.filter(p => p.status === 'pending');

    const totalTasks = myTasks.length;
    const doneTasks = myTasks.filter(t => t.status === 'done').length;
    const inProgressTasks = myTasks.filter(t => t.status === 'in-progress').length;

    const greeting = () => {
        const h = new Date().getHours();
        if (h < 12) return 'Доброе утро';
        if (h < 17) return 'Добрый день';
        return 'Добрый вечер';
    };

    const getUserName = (id) => {
        const u = users.find(u => u.id === id);
        return u?.name || 'Неизвестен';
    };

    return (
        <div className="fade-in">
            {/* GREETING */}
            <div style={{ marginBottom: 28 }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>
                    {greeting()}, <span className="text-gradient">{currentUser?.name?.split(' ')[0]}</span>! 👋
                </h2>
                <p style={{ color: 'var(--text-secondary)', marginTop: 4, fontSize: '0.875rem' }}>
                    Вот что происходит в ваших проектах сегодня.
                </p>
            </div>

            {/* STATS */}
            <div className="stats-grid">
                {[
                    { icon: '📁', label: 'Активных проектов', value: myProjects.filter(p => p.status === 'active').length, color: '#6c63ff', change: '+2', up: true },
                    { icon: '✅', label: 'Моих задач', value: totalTasks, color: '#00d4aa', change: `${doneTasks} выполнено`, up: true },
                    { icon: '⏳', label: 'В работе', value: inProgressTasks, color: '#ff9a3c', change: `${myTasks.filter(t => t.status === 'review').length} на проверке`, up: true },
                    { icon: '🔔', label: 'Уведомлений', value: myNotifs.length, color: '#ff6584', change: 'непрочитанных', up: false },
                ].map((s, i) => (
                    <div key={i} className="card stat-card" style={{ '--stat-color': s.color }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 8 }}>{s.label}</div>
                                <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
                                <div className={`stat-change ${s.up ? 'up' : ''}`} style={{ color: s.color, opacity: 0.8 }}>
                                    {s.change}
                                </div>
                            </div>
                            <div style={{ fontSize: '2rem', opacity: 0.8 }}>{s.icon}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="dashboard-grid">
                {/* RECENT PROJECTS */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <h3>Мои проекты</h3>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button className="btn btn-secondary btn-sm" onClick={() => setShowNewProject(true)}>+ Новый</button>
                            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/projects')}>Все →</button>
                        </div>
                    </div>
                    {myProjects.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📁</div>
                            <div className="empty-title">Нет проектов</div>
                            <div className="empty-desc">Создайте первый проект и пригласите команду</div>
                            <button className="btn btn-primary btn-sm" onClick={() => setShowNewProject(true)}>Создать проект</button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {myProjects.slice(0, 4).map(p => (
                                <div key={p.id} className="card card-sm" style={{ cursor: 'pointer' }}
                                    onClick={() => navigate(`/projects/${p.id}`)}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                                        <div>
                                            <div style={{ fontWeight: 700, marginBottom: 3 }}>{p.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                До {formatDate(p.deadline)} · {p.members?.length || 0} участников
                                            </div>
                                        </div>
                                        <span className={`badge ${getStatusClass(p.status)}`}>{getStatusLabel(p.status)}</span>
                                    </div>
                                    <div className="project-progress-text">
                                        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Прогресс</span>
                                        <span style={{ color: 'var(--primary-light)', fontSize: '0.75rem', fontWeight: 700 }}>{p.progress || 0}%</span>
                                    </div>
                                    <div className="progress-bar"><div className="progress-fill" style={{ width: `${p.progress || 0}%` }} /></div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* SIDEBAR COLUMN */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {/* RECENT TASKS */}
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <h4>Последние задачи</h4>
                            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/tasks')}>Все →</button>
                        </div>
                        {myTasks.length === 0 ? (
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: 16 }}>Нет задач</div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {myTasks.slice(0, 5).map(t => (
                                    <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                                        <span style={{ fontSize: '1rem' }}>{t.status === 'done' ? '✅' : t.status === 'in-progress' ? '🔄' : '📋'}</span>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: '0.82rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.title}</div>
                                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>до {formatDate(t.deadline)}</div>
                                        </div>
                                        <span className={`badge ${getPriorityClass(t.priority)}`} style={{ flexShrink: 0 }}>{getPriorityLabel(t.priority)}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* NOTIFICATIONS */}
                    <div className="card">
                        <h4 style={{ marginBottom: 16 }}>Уведомления</h4>
                        {myNotifs.length === 0 ? (
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: 12 }}>Нет новых уведомлений</div>
                        ) : (
                            <div>
                                {myNotifs.slice(0, 3).map(n => (
                                    <div key={n.id} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: '0.8rem' }}>
                                        <div style={{ color: 'var(--text-primary)', marginBottom: 2 }}>{n.text}</div>
                                        <div style={{ color: 'var(--text-muted)' }}>{timeAgo(n.createdAt)}</div>
                                    </div>
                                ))}
                                {myNotifs.length > 3 && (
                                    <button className="btn btn-ghost btn-sm" style={{ marginTop: 8, width: '100%' }}
                                        onClick={() => navigate('/notifications')}>
                                        Ещё {myNotifs.length - 3} уведомлений →
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <NewProjectModal isOpen={showNewProject} onClose={() => setShowNewProject(false)} />
        </div>
    );
}

function NewProjectModal({ isOpen, onClose }) {
    const { currentUser } = useAuth();
    const { createProject } = useData();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', description: '', deadline: '', priority: 'medium', status: 'active' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name.trim()) return;
        setLoading(true);
        const p = createProject({ ...form, ownerId: currentUser.id, members: [currentUser.id] });
        setLoading(false);
        onClose();
        setForm({ name: '', description: '', deadline: '', priority: 'medium', status: 'active' });
        navigate(`/projects/${p.id}`);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Новый проект">
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="form-group">
                    <label className="form-label">Название *</label>
                    <input className="form-control" placeholder="Название проекта"
                        value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div className="form-group">
                    <label className="form-label">Описание</label>
                    <textarea className="form-control" rows={3} placeholder="Описание проекта..."
                        value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Срок</label>
                        <input className="form-control" type="date" value={form.deadline}
                            onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Приоритет</label>
                        <select className="form-control" value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
                            <option value="low">Низкий</option>
                            <option value="medium">Средний</option>
                            <option value="high">Высокий</option>
                            <option value="urgent">Срочно</option>
                        </select>
                    </div>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>Отмена</button>
                    <button type="submit" className="btn btn-primary" disabled={loading || !form.name.trim()}>
                        {loading ? '...' : 'Создать проект'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
