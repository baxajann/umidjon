import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useData } from '../../context/DataContext.jsx';
import { formatDate, getPriorityClass, getPriorityLabel, getStatusClass, getStatusLabel } from '../../utils/helpers.js';
import { Modal } from '../../components/UI/Modal.jsx';

export function ProjectsPage() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const { projects, createProject, users } = useData();
    const [showNew, setShowNew] = useState(false);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');

    const myProjects = projects.filter(p => p.members?.includes(currentUser?.id) || p.ownerId === currentUser?.id);
    const filtered = myProjects
        .filter(p => filter === 'all' || p.status === filter)
        .filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

    const getMemberNames = (memberIds = []) => memberIds.slice(0, 3).map(id => {
        const u = users.find(u => u.id === id);
        return u?.name?.split(' ')[0] || '?';
    }).join(', ') + (memberIds.length > 3 ? ` +${memberIds.length - 3}` : '');

    return (
        <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
                <div>
                    <h2 style={{ fontWeight: 800 }}>Проекты</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{myProjects.length} проектов</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowNew(true)}>+ Новый проект</button>
            </div>

            <div className="filter-bar" style={{ marginBottom: 20 }}>
                <div className="search-box flex-1" style={{ maxWidth: 320 }}>
                    <span className="search-icon">🔍</span>
                    <input className="form-control search-input" placeholder="Поиск проектов..."
                        value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <div className="tabs">
                    {[['all', 'Все'], ['active', 'Активные'], ['completed', 'Завершённые'], ['paused', 'Приостановленные']].map(([v, l]) => (
                        <div key={v} className={`tab ${filter === v ? 'active' : ''}`} onClick={() => setFilter(v)}>{l}</div>
                    ))}
                </div>
            </div>

            {filtered.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📁</div>
                    <div className="empty-title">Нет проектов</div>
                    <div className="empty-desc">{search ? 'Ничего не найдено по запросу' : 'Создайте первый проект'}</div>
                    {!search && <button className="btn btn-primary btn-sm" onClick={() => setShowNew(true)}>Создать проект</button>}
                </div>
            ) : (
                <div className="projects-grid">
                    {filtered.map(p => (
                        <div key={p.id} className="card project-card" onClick={() => navigate(`/projects/${p.id}`)}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                                <span className={`badge ${getPriorityClass(p.priority)}`}>{getPriorityLabel(p.priority)}</span>
                                <span className={`badge ${getStatusClass(p.status)}`}>{getStatusLabel(p.status)}</span>
                            </div>
                            <h3 style={{ marginBottom: 8, fontSize: '1rem' }}>{p.name}</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.83rem', lineHeight: 1.5, marginBottom: 14, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                {p.description || 'Без описания'}
                            </p>
                            <div className="project-progress-text">
                                <span>Прогресс</span>
                                <span style={{ color: 'var(--primary-light)', fontWeight: 700 }}>{p.progress || 0}%</span>
                            </div>
                            <div className="progress-bar" style={{ marginBottom: 14 }}>
                                <div className="progress-fill" style={{ width: `${p.progress || 0}%` }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                <span>👥 {getMemberNames(p.members)}</span>
                                <span>📅 {formatDate(p.deadline)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <NewProjectModal isOpen={showNew} onClose={() => setShowNew(false)} />
        </div>
    );
}

export function NewProjectModal({ isOpen, onClose, onCreate }) {
    const { currentUser } = useAuth();
    const { createProject, users } = useData();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', description: '', deadline: '', priority: 'medium', status: 'active' });
    const [selectedMembers, setSelectedMembers] = useState([]);

    const toggleMember = (id) => {
        setSelectedMembers(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name.trim()) return;
        const members = [...new Set([currentUser.id, ...selectedMembers])];
        const p = createProject({ ...form, ownerId: currentUser.id, members });
        onClose();
        setForm({ name: '', description: '', deadline: '', priority: 'medium', status: 'active' });
        setSelectedMembers([]);
        if (onCreate) onCreate(p);
        else navigate(`/projects/${p.id}`);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Новый проект" size="lg">
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
                        <label className="form-label">Срок выполнения</label>
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
                <div className="form-group">
                    <label className="form-label">Участники</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 160, overflowY: 'auto' }}>
                        {users.filter(u => u.id !== currentUser.id).map(u => (
                            <label key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '6px 10px', borderRadius: 'var(--radius-sm)', background: selectedMembers.includes(u.id) ? 'rgba(108,99,255,0.1)' : 'transparent', transition: 'background 0.15s' }}>
                                <input type="checkbox" checked={selectedMembers.includes(u.id)} onChange={() => toggleMember(u.id)} />
                                <div className="avatar avatar-xs">{u.name[0]}</div>
                                <span style={{ fontSize: '0.875rem' }}>{u.name}</span>
                                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>{u.email}</span>
                            </label>
                        ))}
                    </div>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>Отмена</button>
                    <button type="submit" className="btn btn-primary" disabled={!form.name.trim()}>Создать проект</button>
                </div>
            </form>
        </Modal>
    );
}
