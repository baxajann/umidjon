import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const features = [
    { icon: '📁', title: 'Управление проектами', desc: 'Создавайте проекты, назначайте участников, отслеживайте прогресс в реальном времени.', color: '#6c63ff' },
    { icon: '✅', title: 'Управление задачами', desc: 'Канбан-доска, статусы, приоритеты и комментарии для каждой задачи.', color: '#00d4aa' },
    { icon: '🛒', title: 'Маркетплейс', desc: 'Продавайте и покупайте цифровые товары и услуги внутри платформы.', color: '#ff6584' },
    { icon: '👥', title: 'Командное взаимодействие', desc: 'Совместная работа в едином пространстве с уведомлениями и комментариями.', color: '#ffd166' },
    { icon: '🔔', title: 'Умные уведомления', desc: 'Мгновенные уведомления о задачах, комментариях и изменениях статуса.', color: '#4cc9f0' },
    { icon: '🛡️', title: 'Система ролей', desc: 'Гибкое управление правами: пользователь, продавец, менеджер, администратор.', color: '#ff9a3c' },
];

const steps = [
    { num: '1', title: 'Зарегистрируйтесь', desc: 'Создайте аккаунт за 30 секунд и выберите роль.' },
    { num: '2', title: 'Создайте проект', desc: 'Добавьте участников, задачи и установите дедлайн.' },
    { num: '3', title: 'Управляйте и продавайте', desc: 'Отслеживайте прогресс и зарабатывайте через маркетплейс.' },
];

const testimonials = [
    { name: 'Анна Петрова', role: 'CEO, DigitalStart', text: 'ProManage полностью изменил наш рабочий процесс. Теперь вся команда работает слаженно, а маркетплейс приносит дополнительный доход.', rating: 5 },
    { name: 'Игорь Соколов', role: 'Фрилансер', text: 'Наконец-то инструмент, где можно и проекты вести, и продавать свои наработки. Экономлю несколько часов в неделю.', rating: 5 },
    { name: 'Светлана Новикова', role: 'Project Manager', text: 'Канбан-доска работает отлично, уведомления своевременные. Команда из 15 человек и ни один дедлайн не пропущен.', rating: 4 },
];

export function LandingPage() {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div style={{ position: 'relative' }}>
            <div className="bg-mesh" />

            {/* NAV */}
            <nav className="landing-nav">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="logo-icon">⚡</div>
                    <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: '1.1rem' }}
                        className="text-gradient">ProManage</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => navigate('/login')}>Войти</button>
                    <button className="btn btn-primary btn-sm" onClick={() => navigate('/register')}>Начать бесплатно</button>
                </div>
            </nav>

            {/* HERO */}
            <section className="hero" style={{ position: 'relative', zIndex: 1 }}>
                <div className="fade-in">
                    <div className="hero-badge">🚀 Платформа нового поколения для малого бизнеса</div>
                    <h1 className="hero-title">
                        Управляйте проектами.<br />
                        <span className="text-gradient">Продавайте умнее.</span>
                    </h1>
                    <p className="hero-desc">
                        Единое пространство для управления задачами, командой и маркетплейса —
                        всё что нужно вашему бизнесу в одном инструменте.
                    </p>
                    <div className="hero-actions">
                        <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')}>
                            Начать бесплатно →
                        </button>
                        <button className="btn btn-secondary btn-lg" onClick={() => navigate('/login')}>
                            Войти в систему
                        </button>
                    </div>

                    {/* Demo card */}
                    <div className="hero-visual">
                        <div className="card card-glow hero-card-demo" style={{ maxWidth: 680, margin: '0 auto', padding: 24 }}>
                            <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
                                {[['📁', '12', 'Проектов', '#6c63ff'], ['✅', '48', 'Задач', '#00d4aa'], ['🛒', '6', 'Товаров', '#ff6584']].map(([ic, n, l, c]) => (
                                    <div key={l} className="card card-sm" style={{ flex: '1 1 120px', textAlign: 'center', borderColor: c + '33' }}>
                                        <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>{ic}</div>
                                        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: c }}>{n}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{l}</div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {[
                                    { title: 'Редизайн сайта', prog: 65, color: '#6c63ff' },
                                    { title: 'Мобильное приложение', prog: 30, color: '#00d4aa' },
                                    { title: 'Email-кампания', prog: 80, color: '#ff9a3c' },
                                ].map(p => (
                                    <div key={p.title}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: 4 }}>
                                            <span style={{ color: 'var(--text-secondary)' }}>{p.title}</span>
                                            <span style={{ color: p.color, fontWeight: 700 }}>{p.prog}%</span>
                                        </div>
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{ width: `${p.prog}%`, background: p.color }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section className="section" style={{ position: 'relative', zIndex: 1 }}>
                <div className="section-center">
                    <div className="section-label">Возможности</div>
                    <h2>Всё что нужно для успешного бизнеса</h2>
                    <p style={{ color: 'var(--text-secondary)', marginTop: 12 }}>
                        Мощный набор инструментов, разработанный специально для малого бизнеса и стартапов.
                    </p>
                </div>
                <div className="features-grid">
                    {features.map((f, i) => (
                        <div key={i} className="card feature-card slide-up" style={{ animationDelay: `${i * 0.08}s` }}>
                            <div className="feature-icon" style={{ background: f.color + '20', color: f.color }}>
                                {f.icon}
                            </div>
                            <h3 style={{ marginBottom: 10 }}>{f.title}</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="section" style={{ background: 'rgba(255,255,255,0.01)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', position: 'relative', zIndex: 1 }}>
                <div className="section-center">
                    <div className="section-label">Как это работает</div>
                    <h2>Начните за три шага</h2>
                </div>
                <div className="how-steps">
                    {steps.map((s, i) => (
                        <div key={i} style={{ textAlign: 'center' }}>
                            <div className="step-num">{s.num}</div>
                            <h3 style={{ marginBottom: 10 }}>{s.title}</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{s.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* DEMO ACCOUNTS */}
            <section className="section" style={{ position: 'relative', zIndex: 1 }}>
                <div className="section-center">
                    <div className="section-label">Демо доступ</div>
                    <h2>Попробуйте прямо сейчас</h2>
                    <p style={{ color: 'var(--text-secondary)', marginTop: 12 }}>Используйте готовые демо-аккаунты для изучения платформы</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 20, maxWidth: 900, margin: '0 auto' }}>
                    {[
                        { role: 'Администратор', email: 'admin@demo.com', pass: 'admin123', color: '#ff4d6d', icon: '🛡️' },
                        { role: 'Продавец', email: 'seller@demo.com', pass: 'seller123', color: '#06d6a0', icon: '🛒' },
                        { role: 'Пользователь', email: 'user@demo.com', pass: 'user123', color: '#6c63ff', icon: '👤' },
                        { role: 'Менеджер', email: 'pm@demo.com', pass: 'pm123', color: '#ffd166', icon: '📁' },
                    ].map(d => (
                        <div key={d.role} className="card card-sm" style={{ textAlign: 'center', borderColor: d.color + '33', cursor: 'pointer' }}
                            onClick={() => navigate('/login', { state: { email: d.email, password: d.pass } })}>
                            <div style={{ fontSize: '2rem', marginBottom: 8 }}>{d.icon}</div>
                            <div style={{ fontWeight: 700, color: d.color, marginBottom: 8 }}>{d.role}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{d.email}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{d.pass}</div>
                            <button className="btn btn-sm" style={{ marginTop: 12, background: d.color + '20', color: d.color, border: `1px solid ${d.color}33`, width: '100%' }}>
                                Войти →
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* TESTIMONIALS */}
            <section className="section" style={{ background: 'rgba(255,255,255,0.01)', borderTop: '1px solid var(--border)', position: 'relative', zIndex: 1 }}>
                <div className="section-center">
                    <div className="section-label">Отзывы</div>
                    <h2>Нам доверяют</h2>
                </div>
                <div className="testimonials-grid">
                    {testimonials.map((t, i) => (
                        <div key={i} className="card testimonial-card">
                            <div className="stars" style={{ marginBottom: 16 }}>{'⭐'.repeat(t.rating)}</div>
                            <p className="testimonial-quote">"{t.text}"</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div className="avatar avatar-sm">{t.name[0]}</div>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{t.name}</div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{t.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="section" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                <div style={{ maxWidth: 600, margin: '0 auto' }}>
                    <h2 style={{ marginBottom: 16 }}>Готовы начать?</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>
                        Присоединяйтесь к тысячам бизнесов, которые уже используют ProManage.
                    </p>
                    <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')}>
                        Создать аккаунт бесплатно →
                    </button>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="landing-footer" style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 12 }}>
                    <div className="logo-icon" style={{ width: 28, height: 28, fontSize: '0.9rem' }}>⚡</div>
                    <span style={{ fontWeight: 700 }} className="text-gradient">ProManage</span>
                </div>
                <p>© 2026 ProManage. Система управления проектами для малого бизнеса.</p>
                <p style={{ marginTop: 6 }}>contact@promanage.ru | +7 (495) 000-00-00</p>
            </footer>
        </div>
    );
}
