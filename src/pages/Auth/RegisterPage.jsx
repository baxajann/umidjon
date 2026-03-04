import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export function RegisterPage() {
    const navigate = useNavigate();
    const { register, currentUser } = useAuth();
    const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '', role: 'user' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => { if (currentUser) navigate('/dashboard', { replace: true }); }, [currentUser]);

    const validate = () => {
        const e = {};
        if (!form.firstName.trim()) e.firstName = 'Введите имя';
        if (!form.lastName.trim()) e.lastName = 'Введите фамилию';
        if (!form.email.includes('@')) e.email = 'Введите корректный email';
        if (form.password.length < 6) e.password = 'Пароль минимум 6 символов';
        if (form.password !== form.confirm) e.confirm = 'Пароли не совпадают';
        return e;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setLoading(true);
        const res = register(form);
        setLoading(false);
        if (res.success) navigate('/dashboard');
        else setErrors({ email: res.error });
    };

    const field = (name, label, type = 'text', placeholder = '') => (
        <div className="form-group">
            <label className="form-label">{label}</label>
            <input className="form-control" type={type} placeholder={placeholder}
                value={form[name]} onChange={e => { setForm(f => ({ ...f, [name]: e.target.value })); setErrors(er => ({ ...er, [name]: '' })); }} />
            {errors[name] && <span className="form-error">{errors[name]}</span>}
        </div>
    );

    return (
        <div className="auth-page" style={{ position: 'relative' }}>
            <div className="bg-mesh" />
            <div className="auth-card card fade-in" style={{ position: 'relative', zIndex: 1 }}>
                <div className="auth-header">
                    <div className="auth-logo">
                        <div className="logo-icon">⚡</div>
                        <span className="text-gradient" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: '1.2rem' }}>ProManage</span>
                    </div>
                    <h2>Создать аккаунт</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: 6 }}>
                        Начните бесплатно уже сегодня
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div className="form-row">
                        {field('firstName', 'Имя', 'text', 'Иван')}
                        {field('lastName', 'Фамилия', 'text', 'Иванов')}
                    </div>
                    {field('email', 'Email', 'email', 'ivan@company.ru')}
                    {field('password', 'Пароль', 'password', '••••••••')}
                    {field('confirm', 'Подтверждение пароля', 'password', '••••••••')}

                    <div className="form-group">
                        <label className="form-label">Тип аккаунта</label>
                        <select className="form-control" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                            <option value="user">👤 Пользователь</option>
                            <option value="seller">🛒 Продавец</option>
                            <option value="project-manager">📁 Менеджер проекта</option>
                        </select>
                    </div>

                    <button className="btn btn-primary w-full" type="submit" disabled={loading} style={{ marginTop: 4 }}>
                        {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    Уже есть аккаунт? <Link to="/login" style={{ color: 'var(--primary-light)', fontWeight: 600 }}>Войти</Link>
                </p>
                <p style={{ textAlign: 'center', marginTop: 8, fontSize: '0.8rem' }}>
                    <Link to="/" style={{ color: 'var(--text-muted)' }}>← На главную</Link>
                </p>
            </div>
        </div>
    );
}
