import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useData } from '../../context/DataContext.jsx';
import { canAddProduct, getStatusClass, getStatusLabel } from '../../utils/helpers.js';
import { Modal } from '../../components/UI/Modal.jsx';

const CATEGORIES = ['all', 'design', 'development', 'marketing', 'consulting', 'other'];
const CATEGORY_LABELS = { all: 'Все', design: '🎨 Дизайн', development: '💻 Разработка', marketing: '📣 Маркетинг', consulting: '💼 Консалтинг', other: '📦 Другое' };

export function MarketplacePage() {
    const { currentUser } = useAuth();
    const { products, createProduct, users } = useData();
    const navigate = useNavigate();
    const [category, setCategory] = useState('all');
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('newest');
    const [showAdd, setShowAdd] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [activeTab, setActiveTab] = useState('catalog');

    const approved = products.filter(p => p.status === 'approved');
    const myProducts = products.filter(p => p.sellerId === currentUser?.id);

    const filtered = approved
        .filter(p => category === 'all' || p.category === category)
        .filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => {
            if (sort === 'price-asc') return a.price - b.price;
            if (sort === 'price-desc') return b.price - a.price;
            if (sort === 'rating') return b.rating - a.rating;
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

    const getSeller = (id) => users.find(u => u.id === id) || { name: 'Продавец' };

    return (
        <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
                <div>
                    <h2 style={{ fontWeight: 800 }}>Маркетплейс</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{approved.length} товаров</p>
                </div>
                {canAddProduct(currentUser?.role) && (
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ Добавить товар</button>
                    </div>
                )}
            </div>

            {/* TABS */}
            {canAddProduct(currentUser?.role) && (
                <div className="tabs" style={{ marginBottom: 20, width: 'fit-content' }}>
                    <div className={`tab ${activeTab === 'catalog' ? 'active' : ''}`} onClick={() => setActiveTab('catalog')}>🛒 Каталог</div>
                    <div className={`tab ${activeTab === 'my' ? 'active' : ''}`} onClick={() => setActiveTab('my')}>📦 Мои товары ({myProducts.length})</div>
                </div>
            )}

            {activeTab === 'catalog' && (
                <>
                    {/* FILTERS */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
                        <div className="filter-bar">
                            <div className="search-box" style={{ flex: 1, maxWidth: 340 }}>
                                <span className="search-icon">🔍</span>
                                <input className="form-control search-input" placeholder="Поиск товаров..." value={search} onChange={e => setSearch(e.target.value)} />
                            </div>
                            <select className="form-control" style={{ width: 180 }} value={sort} onChange={e => setSort(e.target.value)}>
                                <option value="newest">Новые сначала</option>
                                <option value="price-asc">Цена ↑</option>
                                <option value="price-desc">Цена ↓</option>
                                <option value="rating">По рейтингу</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {CATEGORIES.map(c => (
                                <button key={c} className={`btn btn-sm ${category === c ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setCategory(c)}>
                                    {CATEGORY_LABELS[c]}
                                </button>
                            ))}
                        </div>
                    </div>

                    {filtered.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">🛒</div>
                            <div className="empty-title">Товары не найдены</div>
                            <div className="empty-desc">Попробуйте изменить фильтры</div>
                        </div>
                    ) : (
                        <div className="products-grid">
                            {filtered.map(p => {
                                const seller = getSeller(p.sellerId);
                                return (
                                    <div key={p.id} className="card product-card" onClick={() => setSelectedProduct(p)}>
                                        <div className="product-img">
                                            <img src={p.image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80'} alt={p.name} />
                                        </div>
                                        <div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                                <span className="badge badge-secondary" style={{ fontSize: '0.68rem' }}>{CATEGORY_LABELS[p.category] || p.category}</span>
                                                {p.rating > 0 && (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                        <span style={{ color: 'var(--warning)', fontSize: '0.8rem' }}>⭐</span>
                                                        <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{p.rating} ({p.reviews})</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="product-name">{p.name}</div>
                                            <div className="product-seller" style={{ marginBottom: 10 }}>от {seller.name}</div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div className="product-price">{p.price.toLocaleString('ru-RU')} ₽</div>
                                                <button className="btn btn-primary btn-sm" onClick={e => { e.stopPropagation(); setSelectedProduct(p); }}>Купить</button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </>
            )}

            {activeTab === 'my' && (
                <MyProductsTab products={myProducts} users={users} onAdd={() => setShowAdd(true)} />
            )}

            {showAdd && <AddProductModal isOpen={showAdd} onClose={() => setShowAdd(false)} />}
            {selectedProduct && <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} seller={getSeller(selectedProduct.sellerId)} />}
        </div>
    );
}

function MyProductsTab({ products, users, onAdd }) {
    const { updateProduct, deleteProduct } = useData();

    if (products.length === 0) return (
        <div className="empty-state">
            <div className="empty-icon">📦</div>
            <div className="empty-title">Нет товаров</div>
            <div className="empty-desc">Добавьте первый товар на продажу</div>
            <button className="btn btn-primary btn-sm" onClick={onAdd}>Добавить товар</button>
        </div>
    );

    return (
        <div className="table-container">
            <table>
                <thead>
                    <tr><th>Товар</th><th>Категория</th><th>Цена</th><th>Статус</th><th>Рейтинг</th><th>Действия</th></tr>
                </thead>
                <tbody>
                    {products.map(p => (
                        <tr key={p.id}>
                            <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <img src={p.image} alt="" style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} />
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{p.name}</div>
                                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{p.description.slice(0, 50)}...</div>
                                    </div>
                                </div>
                            </td>
                            <td><span className="badge badge-secondary">{p.category}</span></td>
                            <td><span style={{ color: 'var(--secondary)', fontWeight: 700 }}>{p.price.toLocaleString('ru-RU')} ₽</span></td>
                            <td><span className={`badge ${getStatusClass(p.status)}`}>{getStatusLabel(p.status)}</span></td>
                            <td>{p.rating > 0 ? `⭐ ${p.rating} (${p.reviews})` : '—'}</td>
                            <td>
                                <button className="btn btn-danger btn-sm" onClick={() => { if (confirm('Удалить товар?')) deleteProduct(p.id); }}>🗑️</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function AddProductModal({ isOpen, onClose }) {
    const { currentUser } = useAuth();
    const { createProduct } = useData();
    const [form, setForm] = useState({ name: '', description: '', category: 'design', price: '', image: '' });
    const [success, setSuccess] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name.trim() || !form.price) return;
        createProduct({ ...form, price: Number(form.price) }, currentUser.id);
        setSuccess(true);
    };

    if (success) return (
        <Modal isOpen={isOpen} onClose={() => { onClose(); setSuccess(false); setForm({ name: '', description: '', category: 'design', price: '', image: '' }); }} title="Товар отправлен">
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: 16 }}>🎉</div>
                <h3 style={{ marginBottom: 8 }}>Товар отправлен на проверку</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>
                    Администратор проверит товар и опубликует его в маркетплейсе.
                    Вы получите уведомление о результате.
                </p>
                <button className="btn btn-primary" onClick={() => { onClose(); setSuccess(false); setForm({ name: '', description: '', category: 'design', price: '', image: '' }); }}>Понятно</button>
            </div>
        </Modal>
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Добавить товар">
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="form-group">
                    <label className="form-label">Название *</label>
                    <input className="form-control" placeholder="Название товара/услуги" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div className="form-group">
                    <label className="form-label">Описание *</label>
                    <textarea className="form-control" rows={4} placeholder="Подробное описание..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Категория</label>
                        <select className="form-control" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                            <option value="design">Дизайн</option>
                            <option value="development">Разработка</option>
                            <option value="marketing">Маркетинг</option>
                            <option value="consulting">Консалтинг</option>
                            <option value="other">Другое</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Цена (₽) *</label>
                        <input className="form-control" type="number" placeholder="1990" min="1" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
                    </div>
                </div>
                <div className="form-group">
                    <label className="form-label">Изображение (URL)</label>
                    <input className="form-control" placeholder="https://..." value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} />
                    {form.image && <img src={form.image} alt="" style={{ marginTop: 8, height: 80, borderRadius: 8, objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />}
                </div>
                <div style={{ padding: 12, background: 'rgba(255,209,102,0.08)', border: '1px solid rgba(255,209,102,0.2)', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', color: 'var(--warning)' }}>
                    ⚠️ Товар будет опубликован только после проверки администратором
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>Отмена</button>
                    <button type="submit" className="btn btn-primary" disabled={!form.name || !form.price}>Отправить на проверку</button>
                </div>
            </form>
        </Modal>
    );
}

function ProductDetailModal({ product, onClose, seller }) {
    const [bought, setBought] = useState(false);

    if (bought) return (
        <Modal isOpen={true} onClose={onClose} title="Покупка">
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: 16 }}>✅</div>
                <h3 style={{ marginBottom: 8 }}>Спасибо за покупку!</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>Товар «{product.name}» успешно приобретён.</p>
                <button className="btn btn-primary" onClick={onClose}>Закрыть</button>
            </div>
        </Modal>
    );

    return (
        <Modal isOpen={true} onClose={onClose} title={product.name} size="lg">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ height: 200, borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                    <img src={product.image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=700&q=80'} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                    <div>
                        <div className="product-price" style={{ fontSize: '1.8rem', marginBottom: 6 }}>{product.price.toLocaleString('ru-RU')} ₽</div>
                        {product.rating > 0 && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <div className="stars">{'⭐'.repeat(Math.round(product.rating))}</div>
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{product.rating} ({product.reviews} отзывов)</span>
                            </div>
                        )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div className="avatar avatar-sm">{seller.name[0]}</div>
                        <div>
                            <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{seller.name}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Продавец</div>
                        </div>
                    </div>
                </div>
                <div>
                    <div style={{ fontWeight: 700, marginBottom: 8 }}>Описание</div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>{product.description}</p>
                </div>
                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>Закрыть</button>
                    <button className="btn btn-primary" style={{ minWidth: 160 }} onClick={() => setBought(true)}>
                        🛒 Купить за {product.price.toLocaleString('ru-RU')} ₽
                    </button>
                </div>
            </div>
        </Modal>
    );
}
