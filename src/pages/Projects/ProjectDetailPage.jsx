import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

export function ProjectDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const { projects, tasks, users, updateProject, deleteProject, createTask, updateTask, deleteTask, addComment } = useData();

    const project = projects.find(p => p.id === id);
    const projectTasks = tasks.filter(t => t.projectId === id);

    const [showNewTask, setShowNewTask] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [showEdit, setShowEdit] = useState(false);
    const [dragging, setDragging] = useState(null);
    const [dragOver, setDragOver] = useState(null);
    const [activeTab, setActiveTab] = useState('kanban');

    if (!project) return (
        <div className="empty-state">
            <div className="empty-icon">❌</div>
            <div className="empty-title">Проект не найден</div>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/projects')}>← Назад</button>
        </div>
    );

    const getMember = (uid) => users.find(u => u.id === uid) || { name: 'Неизвестен', id: uid };

    const handleDrop = (colId) => {
        if (dragging && dragging !== colId) {
            updateTask(dragging, { status: colId });
        }
        setDragging(null); setDragOver(null);
    };

    return (
        <div className="fade-in">
            {/* HEADER */}
            <div style={{ marginBottom: 24 }}>
                <button className="btn btn-ghost btn-sm" style={{ marginBottom: 12 }} onClick={() => navigate('/projects')}>
                    ← Проекты
                </button>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                            <h2 style={{ fontWeight: 800 }}>{project.name}</h2>
                            <span className={`badge ${getStatusClass(project.status)}`}>{getStatusLabel(project.status)}</span>
                            <span className={`badge ${getPriorityClass(project.priority)}`}>{getPriorityLabel(project.priority)}</span>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{project.description}</p>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => setShowEdit(true)}>✏️ Изменить</button>
                        <button className="btn btn-primary btn-sm" onClick={() => setShowNewTask(true)}>+ Задача</button>
                    </div>
                </div>
            </div>

            {/* PROJECT INFO */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 14, marginBottom: 24 }}>
                {[
                    { label: 'Прогресс', value: `${project.progress || 0}%`, icon: '📊' },
                    { label: 'Задач', value: projectTasks.length, icon: '✅' },
                    { label: 'Срок', value: formatDate(project.deadline), icon: '📅' },
                    { label: 'Участников', value: project.members?.length || 0, icon: '👥' },
                ].map(s => (
                    <div key={s.label} className="card card-sm" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: '1.4rem' }}>{s.icon}</span>
                        <div>
                            <div style={{ fontWeight: 700 }}>{s.value}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* PROGRESS BAR */}
            <div className="card" style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span style={{ fontWeight: 600 }}>Общий прогресс</span>
                    <span style={{ color: 'var(--primary-light)', fontWeight: 700 }}>{project.progress || 0}%</span>
                </div>
                <div className="progress-bar" style={{ height: 10 }}>
                    <div className="progress-fill" style={{ width: `${project.progress || 0}%` }} />
                </div>
                <div style={{ display: 'flex', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
                    {COLUMNS.map(c => {
                        const count = projectTasks.filter(t => t.status === c.id).length;
                        return (
                            <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                <span style={{ width: 8, height: 8, borderRadius: '50%', background: c.color, display: 'inline-block' }} />
                                {c.label}: <strong style={{ color: c.color }}>{count}</strong>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* TABS */}
            <div className="tabs" style={{ marginBottom: 20, width: 'fit-content' }}>
                <div className={`tab ${activeTab === 'kanban' ? 'active' : ''}`} onClick={() => setActiveTab('kanban')}>📋 Канбан</div>
                <div className={`tab ${activeTab === 'members' ? 'active' : ''}`} onClick={() => setActiveTab('members')}>👥 Участники</div>
            </div>

            {/* KANBAN BOARD */}
            {activeTab === 'kanban' && (
                <div className="kanban-board">
                    {COLUMNS.map(col => {
                        const colTasks = projectTasks.filter(t => t.status === col.id);
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
                                    {colTasks.map(t => (
                                        <div key={t.id} className={`kanban-card ${dragging === t.id ? 'dragging' : ''}`}
                                            draggable
                                            onDragStart={() => setDragging(t.id)}
                                            onDragEnd={() => { setDragging(null); setDragOver(null); }}
                                            onClick={() => setSelectedTask(t)}
                                        >
                                            <div className="kanban-card-title">{t.title}</div>
                                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                                                <span className={`badge ${getPriorityClass(t.priority)}`}>{getPriorityLabel(t.priority)}</span>
                                            </div>
                                            <div className="kanban-card-meta">
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                    <div className="avatar avatar-xs">{getMember(t.assigneeId)?.name?.[0] || '?'}</div>
                                                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                                        {getMember(t.assigneeId)?.name?.split(' ')[0] || '—'}
                                                    </span>
                                                </div>
                                                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                                    📅 {formatDate(t.deadline)}
                                                </span>
                                            </div>
                                            {t.comments?.length > 0 && (
                                                <div style={{ marginTop: 6, fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                                    💬 {t.comments.length}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    <button className="btn btn-ghost btn-sm w-full" style={{ marginTop: 6, borderStyle: 'dashed', borderColor: 'var(--border)' }}
                                        onClick={() => setShowNewTask(true)}>
                                        + Добавить задачу
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* MEMBERS TAB */}
            {activeTab === 'members' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 14 }}>
                    {project.members?.map(uid => {
                        const u = getMember(uid);
                        return (
                            <div key={uid} className="card card-sm" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                <div className="avatar avatar-md">{u.name?.[0] || '?'}</div>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{u.name || 'Неизвестен'}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.email || ''}</div>
                                    {uid === project.ownerId && <span className="badge badge-primary" style={{ marginTop: 4 }}>Владелец</span>}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* MODALS */}
            <TaskModal isOpen={showNewTask} onClose={() => setShowNewTask(false)} projectId={id} members={project.members || []} />
            {selectedTask && <TaskDetailModal task={selectedTask} onClose={() => setSelectedTask(null)} members={project.members || []} />}
            {showEdit && <EditProjectModal project={project} onClose={() => setShowEdit(false)} />}
        </div>
    );
}

function TaskModal({ isOpen, onClose, projectId, members, task }) {
    const { currentUser } = useAuth();
    const { createTask, updateTask, users } = useData();
    const isEdit = !!task;
    const [form, setForm] = useState(task ? { ...task } : {
        title: '', description: '', assigneeId: currentUser.id, deadline: '', status: 'new', priority: 'medium'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.title.trim()) return;
        if (isEdit) updateTask(task.id, form);
        else createTask({ ...form, projectId }, currentUser.id);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Редактировать задачу' : 'Новая задача'}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="form-group">
                    <label className="form-label">Название *</label>
                    <input className="form-control" placeholder="Название задачи" value={form.title}
                        onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
                </div>
                <div className="form-group">
                    <label className="form-label">Описание</label>
                    <textarea className="form-control" rows={3} placeholder="Описание задачи..."
                        value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Исполнитель</label>
                        <select className="form-control" value={form.assigneeId} onChange={e => setForm(f => ({ ...f, assigneeId: e.target.value }))}>
                            {members.map(uid => {
                                const u = users.find(u => u.id === uid);
                                return u ? <option key={uid} value={uid}>{u.name}</option> : null;
                            })}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Срок</label>
                        <input className="form-control" type="date" value={form.deadline || ''}
                            onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Статус</label>
                        <select className="form-control" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                            <option value="new">Новая</option>
                            <option value="in-progress">В работе</option>
                            <option value="review">На проверке</option>
                            <option value="done">Выполнена</option>
                        </select>
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
                    <button type="submit" className="btn btn-primary" disabled={!form.title.trim()}>
                        {isEdit ? 'Сохранить' : 'Создать задачу'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}

function TaskDetailModal({ task, onClose, members }) {
    const { currentUser } = useAuth();
    const { updateTask, deleteTask, addComment, users } = useData();
    const [comment, setComment] = useState('');
    const [showEdit, setShowEdit] = useState(false);

    const getMember = (uid) => users.find(u => u.id === uid) || { name: '?', id: uid };

    const handleComment = (e) => {
        e.preventDefault();
        if (!comment.trim()) return;
        addComment(task.id, currentUser.id, comment.trim());
        setComment('');
    };

    const updatedTask = useData().tasks.find(t => t.id === task.id) || task;

    return (
        <>
            <Modal isOpen={true} onClose={onClose} title="Детали задачи" size="lg">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <span className={`badge ${getStatusClass(updatedTask.status)}`}>{getStatusLabel(updatedTask.status)}</span>
                            <span className={`badge ${getPriorityClass(updatedTask.priority)}`}>{getPriorityLabel(updatedTask.priority)}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button className="btn btn-secondary btn-sm" onClick={() => setShowEdit(true)}>✏️</button>
                            <button className="btn btn-danger btn-sm" onClick={() => { deleteTask(task.id); onClose(); }}>🗑️</button>
                        </div>
                    </div>
                    <div>
                        <h3>{updatedTask.title}</h3>
                        {updatedTask.description && <p style={{ color: 'var(--text-secondary)', marginTop: 8, fontSize: '0.9rem', lineHeight: 1.6 }}>{updatedTask.description}</p>}
                    </div>
                    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                        <div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>ИСПОЛНИТЕЛЬ</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div className="avatar avatar-xs">{getMember(updatedTask.assigneeId)?.name?.[0] || '?'}</div>
                                <span style={{ fontSize: '0.875rem' }}>{getMember(updatedTask.assigneeId)?.name || '—'}</span>
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>СРОК</div>
                            <div style={{ fontSize: '0.875rem' }}>{formatDate(updatedTask.deadline) || 'Не указан'}</div>
                        </div>
                    </div>

                    {/* STATUS CHANGE */}
                    <div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 8 }}>ИЗМЕНИТЬ СТАТУС</div>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {[['new', 'Новая'], ['in-progress', 'В работе'], ['review', 'Проверка'], ['done', 'Выполнено']].map(([s, l]) => (
                                <button key={s} className={`btn btn-sm ${updatedTask.status === s ? 'btn-primary' : 'btn-secondary'}`}
                                    onClick={() => updateTask(task.id, { status: s })}>{l}</button>
                            ))}
                        </div>
                    </div>

                    {/* COMMENTS */}
                    <div>
                        <div style={{ fontWeight: 700, marginBottom: 12 }}>Комментарии ({updatedTask.comments?.length || 0})</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14, maxHeight: 200, overflowY: 'auto' }}>
                            {(updatedTask.comments || []).map(c => {
                                const u = getMember(c.userId);
                                return (
                                    <div key={c.id} style={{ display: 'flex', gap: 10 }}>
                                        <div className="avatar avatar-xs" style={{ flexShrink: 0, marginTop: 2 }}>{u.name?.[0] || '?'}</div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                                                <span style={{ fontWeight: 600, fontSize: '0.8rem' }}>{u.name}</span>
                                                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{timeAgo(c.createdAt)}</span>
                                            </div>
                                            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', background: 'var(--bg-glass)', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}>{c.text}</div>
                                        </div>
                                    </div>
                                );
                            })}
                            {(!updatedTask.comments || updatedTask.comments.length === 0) && (
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Нет комментариев</div>
                            )}
                        </div>
                        <form onSubmit={handleComment} style={{ display: 'flex', gap: 8 }}>
                            <input className="form-control flex-1" placeholder="Написать комментарий..."
                                value={comment} onChange={e => setComment(e.target.value)} />
                            <button type="submit" className="btn btn-primary btn-sm" disabled={!comment.trim()}>Отправить</button>
                        </form>
                    </div>
                </div>
            </Modal>
            {showEdit && <TaskModal isOpen={showEdit} onClose={() => setShowEdit(false)} projectId={task.projectId} members={members} task={updatedTask} />}
        </>
    );
}

function EditProjectModal({ project, onClose }) {
    const { updateProject, deleteProject } = useData();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: project.name, description: project.description || '', deadline: project.deadline || '', priority: project.priority, status: project.status });

    const handleSubmit = (e) => {
        e.preventDefault();
        updateProject(project.id, form);
        onClose();
    };

    const handleDelete = () => {
        if (confirm('Удалить проект и все его задачи?')) {
            deleteProject(project.id);
            navigate('/projects');
        }
    };

    return (
        <Modal isOpen={true} onClose={onClose} title="Редактировать проект">
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="form-group">
                    <label className="form-label">Название</label>
                    <input className="form-control" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div className="form-group">
                    <label className="form-label">Описание</label>
                    <textarea className="form-control" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Срок</label>
                        <input className="form-control" type="date" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Статус</label>
                        <select className="form-control" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                            <option value="active">Активный</option>
                            <option value="paused">Приостановлен</option>
                            <option value="completed">Завершён</option>
                        </select>
                    </div>
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
                <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
                    <button type="button" className="btn btn-danger btn-sm" onClick={handleDelete}>Удалить проект</button>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Отмена</button>
                        <button type="submit" className="btn btn-primary">Сохранить</button>
                    </div>
                </div>
            </form>
        </Modal>
    );
}
