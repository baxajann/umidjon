import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useData } from '../../context/DataContext.jsx';
import { formatDate, getPriorityClass, getPriorityLabel, getStatusClass, getStatusLabel, timeAgo } from '../../utils/helpers.js';
import { Modal } from '../../components/UI/Modal.jsx';

const COLUMNS = [
    { id: 'new', label: 'Новые', color: '#9da8d0', emoji: '📋' },
    { id: 'in-progress', label: 'В работе', color: '#6c63ff', emoji: '🔄' },
    { id: 'review', label: 'На проверке', color: '#ffd166', emoji: '👁️' },
    { id: 'done', label: 'Выполнено', color: '#06d6a0', emoji: '✅' },
];

export function TasksPage() {
    const { currentUser } = useAuth();
    const { tasks, projects, users, createTask, updateTask, deleteTask, addComment } = useData();
    const [selectedTask, setSelectedTask] = useState(null);
    const [dragging, setDragging] = useState(null);
    const [dragOver, setDragOver] = useState(null);
    const [filter, setFilter] = useState('my');
    const [search, setSearch] = useState('');

    const allTasks = filter === 'my'
        ? tasks.filter(t => t.assigneeId === currentUser?.id)
        : tasks;

    const filtered = allTasks.filter(t => t.title.toLowerCase().includes(search.toLowerCase()));

    const getProject = (pid) => projects.find(p => p.id === pid);
    const getUser = (uid) => users.find(u => u.id === uid);

    const handleDrop = (colId) => {
        if (dragging && dragging !== colId) updateTask(dragging, { status: colId });
        setDragging(null); setDragOver(null);
    };

    return (
        <div className="fade-in">
            <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontWeight: 800, marginBottom: 4 }}>Задачи</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{filtered.length} задач</p>
            </div>

            <div className="filter-bar" style={{ marginBottom: 20 }}>
                <div className="search-box" style={{ flex: 1, maxWidth: 300 }}>
                    <span className="search-icon">🔍</span>
                    <input className="form-control search-input" placeholder="Поиск задач..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <div className="tabs">
                    <div className={`tab ${filter === 'my' ? 'active' : ''}`} onClick={() => setFilter('my')}>Мои задачи</div>
                    <div className={`tab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>Все задачи</div>
                </div>
            </div>

            <div className="kanban-board">
                {COLUMNS.map(col => {
                    const colTasks = filtered.filter(t => t.status === col.id);
                    return (
                        <div key={col.id} className={`kanban-column ${dragOver === col.id ? 'drag-over' : ''}`}
                            onDragOver={e => { e.preventDefault(); setDragOver(col.id); }}
                            onDrop={() => handleDrop(col.id)}
                            onDragLeave={() => setDragOver(null)}
                        >
                            <div className="kanban-column-header">
                                <div className="kanban-column-title">
                                    <span className="kanban-col-dot" style={{ background: col.color }} />
                                    {col.emoji} {col.label}
                                </div>
                                <span className="kanban-col-count">{colTasks.length}</span>
                            </div>
                            <div className="kanban-cards">
                                {colTasks.length === 0 && (
                                    <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem', border: '2px dashed var(--border)', borderRadius: 'var(--radius-md)' }}>
                                        Нет задач
                                    </div>
                                )}
                                {colTasks.map(t => {
                                    const proj = getProject(t.projectId);
                                    const assignee = getUser(t.assigneeId);
                                    return (
                                        <div key={t.id} className={`kanban-card ${dragging === t.id ? 'dragging' : ''}`}
                                            draggable
                                            onDragStart={() => setDragging(t.id)}
                                            onDragEnd={() => { setDragging(null); setDragOver(null); }}
                                            onClick={() => setSelectedTask(t)}
                                        >
                                            <div className="kanban-card-title">{t.title}</div>
                                            {proj && <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 6 }}>📁 {proj.name}</div>}
                                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                                                <span className={`badge ${getPriorityClass(t.priority)}`}>{getPriorityLabel(t.priority)}</span>
                                            </div>
                                            <div className="kanban-card-meta">
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                    <div className="avatar avatar-xs">{assignee?.name?.[0] || '?'}</div>
                                                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{assignee?.name?.split(' ')[0] || '—'}</span>
                                                </div>
                                                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>📅 {formatDate(t.deadline)}</span>
                                            </div>
                                            {t.comments?.length > 0 && <div style={{ marginTop: 6, fontSize: '0.72rem', color: 'var(--text-muted)' }}>💬 {t.comments.length}</div>}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {selectedTask && <TaskDetailModal task={selectedTask} onClose={() => setSelectedTask(null)} />}
        </div>
    );
}

function TaskDetailModal({ task, onClose }) {
    const { currentUser } = useAuth();
    const { updateTask, deleteTask, addComment, users, tasks } = useData();
    const [comment, setComment] = useState('');

    const updatedTask = tasks.find(t => t.id === task.id) || task;
    const getUser = (uid) => users.find(u => u.id === uid) || { name: '?' };

    const handleComment = (e) => {
        e.preventDefault();
        if (!comment.trim()) return;
        addComment(task.id, currentUser.id, comment.trim());
        setComment('');
    };

    return (
        <Modal isOpen={true} onClose={onClose} title="Детали задачи" size="lg">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <span className={`badge ${getStatusClass(updatedTask.status)}`}>{getStatusLabel(updatedTask.status)}</span>
                        <span className={`badge ${getPriorityClass(updatedTask.priority)}`}>{getPriorityLabel(updatedTask.priority)}</span>
                    </div>
                    <button className="btn btn-danger btn-sm" onClick={() => { deleteTask(task.id); onClose(); }}>🗑️ Удалить</button>
                </div>
                <div>
                    <h3>{updatedTask.title}</h3>
                    {updatedTask.description && <p style={{ color: 'var(--text-secondary)', marginTop: 8, fontSize: '0.9rem' }}>{updatedTask.description}</p>}
                </div>
                <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 8 }}>ИЗМЕНИТЬ СТАТУС</div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {[['new', 'Новая'], ['in-progress', 'В работе'], ['review', 'Проверка'], ['done', 'Выполнено']].map(([s, l]) => (
                            <button key={s} className={`btn btn-sm ${updatedTask.status === s ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => updateTask(task.id, { status: s })}>{l}</button>
                        ))}
                    </div>
                </div>
                <div>
                    <div style={{ fontWeight: 700, marginBottom: 10 }}>Комментарии ({updatedTask.comments?.length || 0})</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 180, overflowY: 'auto', marginBottom: 12 }}>
                        {(updatedTask.comments || []).map(c => {
                            const u = getUser(c.userId);
                            return (
                                <div key={c.id} style={{ display: 'flex', gap: 8 }}>
                                    <div className="avatar avatar-xs" style={{ flexShrink: 0, marginTop: 2 }}>{u.name?.[0] || '?'}</div>
                                    <div>
                                        <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                                            <span style={{ fontWeight: 600, fontSize: '0.8rem' }}>{u.name}</span>
                                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{timeAgo(c.createdAt)}</span>
                                        </div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', padding: '6px 10px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)', marginTop: 4 }}>{c.text}</div>
                                    </div>
                                </div>
                            );
                        })}
                        {(!updatedTask.comments || !updatedTask.comments.length) && <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Нет комментариев</div>}
                    </div>
                    <form onSubmit={handleComment} style={{ display: 'flex', gap: 8 }}>
                        <input className="form-control flex-1" placeholder="Написать комментарий..." value={comment} onChange={e => setComment(e.target.value)} />
                        <button type="submit" className="btn btn-primary btn-sm" disabled={!comment.trim()}>Отправить</button>
                    </form>
                </div>
            </div>
        </Modal>
    );
}
