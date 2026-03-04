import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useData } from '../../context/DataContext.jsx';
import { getRoleLabel, getRoleBadgeClass, formatDate, getStatusClass, getStatusLabel } from '../../utils/helpers.js';

export function ProfilePage() {
    const { currentUser, updateProfile, changePassword } = useAuth();
    const { projects, products } = useData();
    const [activeTab, setActiveTab] = useState('info');
    const [editForm, setEditForm] = useState({ name: currentUser?.name || '', bio: currentUser?.bio || '', avatar: currentUser?.avatar || '' });
    const [pwForm, setPwForm] = useState({ old: '', new: '', confirm: '' });
    const [editSuccess, setEditSuccess] = useState(false);
    const [pwError, setPwError] = useState('');
    const [pwSuccess, setPwSuccess] = useState(false);

    const myProjects = projects.filter(p => p.members?.includes(currentUser?.id) || p.ownerId === currentUser?.id);
    const myProducts = products.filter(p => p.sellerId === currentUser?.id);
    const initials = currentUser?.name?.split(' ').slice(0, 2).map(x => x[0]).join('').toUpperCase() || '?';

    const handleSave = (e) => {
        e.preventDefault();
        if (!editForm.name.trim()) return;
        updateProfile(editForm);
        setEditSuccess(true);
        setTimeout(() => setEditSuccess(false), 2000);
    };

    const handlePw = (e) => {
        e.preventDefault();
        setPwError(''); setPwSuccess(false);
        if (pwForm.new !== pwForm.confirm) { setPwError('Пароли не совпадают'); return; }
        if (pwForm.new.length < 6) { setPwError('Минимум 6 символов'); return; }
        const res = changePassword(pwForm.old, pwForm.new);
        if (res.success) { setPwSuccess(true); setPwForm({ old: '', new: '', confirm: '' }); }
        else setPwError(res.error);
    };

    return (
        <div className="fade-in">
            {/* PROFILE HEADER */}
            <div className="card" style={{ marginBottom: 24, padding: 32 }}>
                <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
                    <div className="avatar avatar-xl" style={{ flexShrink: 0 }}>
                        {currentUser?.avatar ? <img src={currentUser.avatar} alt="" /> : initials}
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 6 }}>
                            <h2 style={{ fontWeight: 800 }}>{currentUser?.name}</h2>
                            <span className={`badge ${getRoleBadgeClass(currentUser?.role)}`}>{getRoleLabel(currentUser?.role)}</span>
                        </div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 6 }}>{currentUser?.email}</div>
                        {currentUser?.bio && <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{currentUser.bio}</p>}
                        <div style={{ display: 'flex', gap: 20, marginTop: 14, flexWrap: 'wrap' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary-light)' }}>{myProjects.length}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Проектов</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--secondary)' }}>{myProducts.length}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Товаров</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--warning)' }}>{currentUser?.rating || 0}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Рейтинг</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* TABS */}
            <div className="tabs" style={{ marginBottom: 24, width: 'fit-content' }}>
                <div className={`tab ${activeTab === 'info' ? 'active' : ''}`} onClick={() => setActiveTab('info')}>👤 Профиль</div>
                <div className={`tab ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => setActiveTab('projects')}>📁 Проекты</div>
                <div className={`tab ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>🛒 Товары</div>
                <div className={`tab ${activeTab === 'security' ? 'active' : ''}`} onClick={() => setActiveTab('security')}>🔒 Безопасность</div>
            </div>

            {/* EDIT PROFILE */}
            {activeTab === 'info' && (
                <div className="card" style={{ maxWidth: 560 }}>
                    <h3 style={{ marginBottom: 20 }}>Редактировать профиль</h3>
                    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div className="form-group">
                            <label className="form-label">Отображаемое имя</label>
                            <input className="form-control" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">О себе</label>
                            <textarea className="form-control" rows={3} placeholder="Расскажите о себе..." value={editForm.bio} onChange={e => setEditForm(f => ({ ...f, bio: e.target.value }))} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Аватар (URL)</label>
                            <input className="form-control" placeholder="https://..." value={editForm.avatar} onChange={e => setEditForm(f => ({ ...f, avatar: e.target.value }))} />
                            {editForm.avatar && <img src={editForm.avatar} alt="" style={{ marginTop: 8, width: 60, height: 60, borderRadius: '50%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <button type="submit" className="btn btn-primary">Сохранить</button>
                            {editSuccess && <span style={{ color: 'var(--success)', fontSize: '0.85rem' }}>✅ Сохранено!</span>}
                        </div>
                    </form>
                </div>
            )}

            {/* MY PROJECTS */}
            {activeTab === 'projects' && (
                <div>
                    {myProjects.length === 0 ? (
                        <div className="empty-state"><div className="empty-icon">📁</div><div className="empty-title">Нет проектов</div></div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {myProjects.map(p => (
                                <div key={p.id} className="card card-sm" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                                    <div>
                                        <div style={{ fontWeight: 700 }}>{p.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>До {formatDate(p.deadline)}</div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--primary-light)', fontWeight: 700 }}>{p.progress || 0}%</div>
                                            <div className="progress-bar" style={{ width: 80 }}><div className="progress-fill" style={{ width: `${p.progress || 0}%` }} /></div>
                                        </div>
                                        <span className={`badge ${getStatusClass(p.status)}`}>{getStatusLabel(p.status)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* MY PRODUCTS */}
            {activeTab === 'products' && (
                <div>
                    {myProducts.length === 0 ? (
                        <div className="empty-state"><div className="empty-icon">🛒</div><div className="empty-title">Нет товаров</div></div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 14 }}>
                            {myProducts.map(p => (
                                <div key={p.id} className="card card-sm">
                                    {p.image && <img src={p.image} alt="" style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 'var(--radius-sm)', marginBottom: 10 }} onError={e => e.target.style.display = 'none'} />}
                                    <div style={{ fontWeight: 700, marginBottom: 4 }}>{p.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--secondary)', fontWeight: 700, marginBottom: 8 }}>{p.price?.toLocaleString('ru-RU')} ₽</div>
                                    <span className={`badge ${getStatusClass(p.status)}`}>{getStatusLabel(p.status)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* SECURITY */}
            {activeTab === 'security' && (
                <div className="card" style={{ maxWidth: 480 }}>
                    <h3 style={{ marginBottom: 20 }}>Изменить пароль</h3>
                    <form onSubmit={handlePw} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div className="form-group">
                            <label className="form-label">Текущий пароль</label>
                            <input className="form-control" type="password" placeholder="••••••••" value={pwForm.old} onChange={e => setPwForm(f => ({ ...f, old: e.target.value }))} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Новый пароль</label>
                            <input className="form-control" type="password" placeholder="••••••••" value={pwForm.new} onChange={e => setPwForm(f => ({ ...f, new: e.target.value }))} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Подтверждение</label>
                            <input className="form-control" type="password" placeholder="••••••••" value={pwForm.confirm} onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))} />
                        </div>
                        {pwError && <div className="form-error">{pwError}</div>}
                        {pwSuccess && <div style={{ color: 'var(--success)', fontSize: '0.85rem' }}>✅ Пароль изменён!</div>}
                        <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Изменить пароль</button>
                    </form>
                </div>
            )}
        </div>
    );
}
