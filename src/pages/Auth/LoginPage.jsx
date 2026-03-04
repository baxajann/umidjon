import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, currentUser } = useAuth();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (currentUser) navigate('/dashboard', { replace: true });
        if (location.state?.email) {
            setForm({ email: location.state.email, password: location.state.password || '' });
        }
    }, [currentUser, location.state]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.email || !form.password) { setError('Заполните все поля'); return; }
        setLoading(true);
        const res = login(form.email, form.password);
        setLoading(false);
        if (res.success) navigate('/dashboard');
        else setError(res.error);
    };

    return (
        <div className="auth-page" style={{ position: 'relative' }}>
            <div className="bg-mesh" />
            <div className="auth-card card fade-in" style={{ position: 'relative', zIndex: 1 }}>
                <div className="auth-header">
                    <div className="auth-logo">
                        <div className="logo-icon">⚡</div>
                        <span className="text-gradient" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: '1.2rem' }}>ProManage</span>
                    </div>
                    <h2>Добро пожаловать</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: 6 }}>
                        Войдите в свой аккаунт
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input className="form-control" type="email" placeholder="your@email.com"
                            value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Пароль</label>
                        <input className="form-control" type="password" placeholder="••••••••"
                            value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
                    </div>
                    {error && <div className="form-error" style={{ textAlign: 'center' }}>{error}</div>}
                    <button className="btn btn-primary w-full" type="submit" disabled={loading}>
                        {loading ? 'Вход...' : 'Войти'}
                    </button>
                </form>

                <div className="divider" />

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Демо аккаунты:</p>
                    {[
                        { label: '🛡️ Администратор', email: 'admin@demo.com', pass: 'admin123' },
                        { label: '🛒 Продавец', email: 'seller@demo.com', pass: 'seller123' },
                        { label: '👤 Пользователь', email: 'user@demo.com', pass: 'user123' },
                    ].map(d => (
                        <button key={d.email} className="btn btn-ghost btn-sm"
                            onClick={() => { setForm({ email: d.email, password: d.pass }); setError(''); }}
                            style={{ justifyContent: 'flex-start' }}>
                            {d.label} ({d.email})
                        </button>
                    ))}
                </div>

                <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    Нет аккаунта? <Link to="/register" style={{ color: 'var(--primary-light)', fontWeight: 600 }}>Зарегистрироваться</Link>
                </p>
                <p style={{ textAlign: 'center', marginTop: 8, fontSize: '0.8rem' }}>
                    <Link to="/" style={{ color: 'var(--text-muted)' }}>← На главную</Link>
                </p>
            </div>
        </div>
    );
}
