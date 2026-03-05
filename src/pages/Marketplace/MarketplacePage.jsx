import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useData } from '../../context/DataContext.jsx';
import { canAddProduct, getStatusClass, getStatusLabel } from '../../utils/helpers.js';
import { Modal } from '../../components/UI/Modal.jsx';

const CATEGORIES = ['all', 'design', 'development', 'marketing', 'consulting', 'other'];
const CATEGORY_LABELS = {
    all: 'Hammasi', design: '🎨 Dizayn', development: '💻 Dasturlash',
    marketing: '📣 Marketing', consulting: '💼 Konsalting', other: '📦 Boshqa'
};
const PAYMENT_METHODS = [
    { id: 'uzumbank', label: 'Uzum Bank', icon: '💜', color: '#7c3aed', desc: 'Uzum Bank kartasi' },
    { id: 'click', label: 'Click', icon: '🔵', color: '#2563eb', desc: 'Click to\'lov tizimi' },
    { id: 'payme', label: 'Payme', icon: '🟢', color: '#16a34a', desc: 'Payme to\'lov tizimi' },
    { id: 'visa', label: 'Visa / MC', icon: '💳', color: '#f59e0b', desc: 'Boshqa bank kartasi' },
];

export function MarketplacePage() {
    const { currentUser } = useAuth();
    const { products, createProduct, users, orders } = useData();
    const [category, setCategory] = useState('all');
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('newest');
    const [showAdd, setShowAdd] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [activeTab, setActiveTab] = useState('catalog');

    const approved = products.filter(p => p.status === 'approved');
    const myProducts = products.filter(p => p.sellerId === currentUser?.id);
    const myOrders = (orders || []).filter(o => o.buyerId === currentUser?.id);

    const filtered = approved
        .filter(p => category === 'all' || p.category === category)
        .filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => {
            if (sort === 'price-asc') return a.price - b.price;
            if (sort === 'price-desc') return b.price - a.price;
            if (sort === 'rating') return b.rating - a.rating;
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

    const getSeller = (id) => users.find(u => u.id === id) || { name: 'Sotuvchi' };

    const tabs = [
        { id: 'catalog', label: '🛒 Katalog' },
        { id: 'orders', label: `📦 Xaridlarim (${myOrders.length})` },
        ...(canAddProduct(currentUser?.role) ? [{ id: 'my', label: `📋 Mening tovarlarim (${myProducts.length})` }] : []),
    ];

    return (
        <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
                <div>
                    <h2 style={{ fontWeight: 800 }}>Marketplace</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{approved.length} ta tovar</p>
                </div>
                {canAddProduct(currentUser?.role) && (
                    <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ Tovar qo'shish</button>
                )}
            </div>

            {/* TABS */}
            <div className="tabs" style={{ marginBottom: 20, width: 'fit-content', flexWrap: 'wrap' }}>
                {tabs.map(t => (
                    <div key={t.id} className={`tab ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>{t.label}</div>
                ))}
            </div>

            {activeTab === 'catalog' && (
                <>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
                        <div className="filter-bar">
                            <div className="search-box" style={{ flex: 1, maxWidth: 340 }}>
                                <span className="search-icon">🔍</span>
                                <input className="form-control search-input" placeholder="Tovar qidirish..." value={search} onChange={e => setSearch(e.target.value)} />
                            </div>
                            <select className="form-control" style={{ width: 180 }} value={sort} onChange={e => setSort(e.target.value)}>
                                <option value="newest">Yangilari avval</option>
                                <option value="price-asc">Narx ↑</option>
                                <option value="price-desc">Narx ↓</option>
                                <option value="rating">Reytingga ko'ra</option>
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
                            <div className="empty-title">Tovar topilmadi</div>
                            <div className="empty-desc">Filtrlni o'zgartiring</div>
                        </div>
                    ) : (
                        <div className="products-grid">
                            {filtered.map(p => {
                                const seller = getSeller(p.sellerId);
                                const alreadyBought = myOrders.some(o => o.productId === p.id);
                                return (
                                    <div key={p.id} className="card product-card" onClick={() => setSelectedProduct(p)}>
                                        <div className="product-img">
                                            <img src={p.image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80'} alt={p.name} />
                                            {alreadyBought && (
                                                <div style={{ position: 'absolute', top: 8, right: 8, background: 'var(--success)', color: '#fff', fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: 99 }}>✓ Sotib olingan</div>
                                            )}
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
                                                <div className="product-price">{p.price.toLocaleString('uz-UZ')} so'm</div>
                                                <button
                                                    className={`btn btn-sm ${alreadyBought ? 'btn-secondary' : 'btn-primary'}`}
                                                    onClick={e => { e.stopPropagation(); setSelectedProduct(p); }}
                                                >
                                                    {alreadyBought ? '✓ Bor' : "Ko'rish"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </>
            )}

            {activeTab === 'orders' && (
                <MyOrdersTab orders={myOrders} />
            )}

            {activeTab === 'my' && canAddProduct(currentUser?.role) && (
                <MyProductsTab products={myProducts} users={users} onAdd={() => setShowAdd(true)} />
            )}

            {showAdd && <AddProductModal isOpen={showAdd} onClose={() => setShowAdd(false)} />}
            {selectedProduct && (
                <PaymentFlow
                    product={selectedProduct}
                    seller={getSeller(selectedProduct.sellerId)}
                    onClose={() => setSelectedProduct(null)}
                    alreadyBought={myOrders.some(o => o.productId === selectedProduct.id)}
                />
            )}
        </div>
    );
}

/* ===================== MY ORDERS TAB ===================== */
function MyOrdersTab({ orders }) {
    if (orders.length === 0) return (
        <div className="empty-state">
            <div className="empty-icon">🛍️</div>
            <div className="empty-title">Hozircha xarid yo'q</div>
            <div className="empty-desc">Tovarlarni ko'rib, birinchi xaridingizni qiling</div>
        </div>
    );

    const METHOD_ICONS = { uzumbank: '💜', click: '🔵', payme: '🟢', visa: '💳' };
    const METHOD_LABELS = { uzumbank: 'Uzum Bank', click: 'Click', payme: 'Payme', visa: 'Visa/MC' };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <h3 style={{ fontWeight: 700 }}>Mening xaridlarim</h3>
                <span className="badge badge-success">{orders.length} ta</span>
            </div>
            {orders.map(order => (
                <div key={order.id} className="card" style={{ display: 'flex', gap: 16, alignItems: 'center', padding: '16px 20px' }}>
                    <img
                        src={order.productImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&q=80'}
                        alt=""
                        style={{ width: 60, height: 60, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }}
                        onError={e => e.target.style.display = 'none'}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 4 }}>{order.productName}</div>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                            <span className="badge badge-secondary">{CATEGORY_LABELS[order.productCategory] || order.productCategory}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                {METHOD_ICONS[order.paymentMethod]} {METHOD_LABELS[order.paymentMethod]}
                                {order.cardLast4 && ` •••• ${order.cardLast4}`}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                {new Date(order.createdAt).toLocaleDateString('uz-UZ', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </span>
                        </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontWeight: 800, color: 'var(--secondary)', fontSize: '1rem' }}>{order.price.toLocaleString('uz-UZ')} so'm</div>
                        <span className="badge badge-success" style={{ marginTop: 4 }}>✓ Bajarildi</span>
                    </div>
                </div>
            ))}
        </div>
    );
}

/* ===================== PAYMENT FLOW ===================== */
function PaymentFlow({ product, seller, onClose, alreadyBought }) {
    const { currentUser } = useAuth();
    const { createOrder } = useData();
    const [step, setStep] = useState(1); // 1=info, 2=method, 3=card, 4=success
    const [method, setMethod] = useState(null);
    const [card, setCard] = useState({ number: '', expiry: '', cvv: '', name: '' });
    const [paying, setPaying] = useState(false);
    const [order, setOrder] = useState(null);

    const formatCardNumber = (val) => val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
    const formatExpiry = (val) => {
        const d = val.replace(/\D/g, '').slice(0, 4);
        return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
    };

    const handlePay = async () => {
        if (method === 'visa' && (!card.number || !card.expiry || !card.cvv || !card.name)) return;
        setPaying(true);
        await new Promise(r => setTimeout(r, 1800));
        const last4 = method === 'visa' ? card.number.replace(/\s/g, '').slice(-4) : null;
        const newOrder = createOrder(currentUser.id, product, method, last4);
        setOrder(newOrder);
        setStep(4);
        setPaying(false);
    };

    /* STEP 1 — Mahsulot haqida ma'lumot */
    if (step === 1) return (
        <Modal isOpen onClose={onClose} title="Tovar haqida" size="lg">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ height: 200, borderRadius: 'var(--radius-md)', overflow: 'hidden', position: 'relative' }}>
                    <img src={product.image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=700&q=80'} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    {alreadyBought && (
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(6,214,160,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ background: 'var(--success)', color: '#fff', fontWeight: 700, padding: '8px 20px', borderRadius: 99, fontSize: '0.9rem' }}>✓ Siz bu tovarni sotib olgan ekansiz</div>
                        </div>
                    )}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                    <div>
                        <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--secondary)', marginBottom: 4 }}>{product.price.toLocaleString('uz-UZ')} so'm</div>
                        {product.rating > 0 && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <span>{'⭐'.repeat(Math.round(product.rating))}</span>
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{product.rating} ({product.reviews} ta sharh)</span>
                            </div>
                        )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="avatar avatar-sm">{seller.name[0]}</div>
                        <div>
                            <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{seller.name}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Sotuvchi</div>
                        </div>
                    </div>
                </div>
                <div>
                    <div style={{ fontWeight: 700, marginBottom: 8 }}>Tavsif</div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>{product.description}</p>
                </div>
                <div style={{ background: 'rgba(108,99,255,0.07)', border: '1px solid rgba(108,99,255,0.2)', borderRadius: 12, padding: '14px 18px', display: 'flex', gap: 12, alignItems: 'center' }}>
                    <span style={{ fontSize: '1.4rem' }}>🔒</span>
                    <div>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Xavfsiz to'lov</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Ma'lumotlaringiz shifrlangan va himoyalangan</div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>Yopish</button>
                    <button className="btn btn-primary" style={{ minWidth: 180 }} onClick={() => setStep(2)}>
                        🛒 Sotib olish — {product.price.toLocaleString('uz-UZ')} so'm
                    </button>
                </div>
            </div>
        </Modal>
    );

    /* STEP 2 — To'lov usulini tanlash */
    if (step === 2) return (
        <Modal isOpen onClose={onClose} title="To'lov usulini tanlang">
            {/* Steps indicator */}
            <StepIndicator current={2} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                {PAYMENT_METHODS.map(m => (
                    <div
                        key={m.id}
                        onClick={() => setMethod(m.id)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px',
                            borderRadius: 14, border: `2px solid ${method === m.id ? m.color : 'var(--border)'}`,
                            background: method === m.id ? `${m.color}15` : 'var(--bg-glass)',
                            cursor: 'pointer', transition: 'all 0.2s'
                        }}
                    >
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: `${m.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>
                            {m.icon}
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: method === m.id ? m.color : 'var(--text-primary)' }}>{m.label}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{m.desc}</div>
                        </div>
                        <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${method === m.id ? m.color : 'var(--border)'}`, background: method === m.id ? m.color : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {method === m.id && <span style={{ color: '#fff', fontSize: '0.7rem', fontWeight: 900 }}>✓</span>}
                        </div>
                    </div>
                ))}
            </div>
            {/* Order summary */}
            <div style={{ background: 'var(--bg-glass)', borderRadius: 12, padding: '14px 18px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 2 }}>Tovar</div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{product.name}</div>
                </div>
                <div style={{ fontWeight: 800, color: 'var(--secondary)', fontSize: '1.1rem' }}>{product.price.toLocaleString('uz-UZ')} so'm</div>
            </div>
            <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setStep(1)}>← Orqaga</button>
                <button className="btn btn-primary" style={{ minWidth: 160 }} disabled={!method} onClick={() => setStep(method === 'visa' ? 3 : 3.5)}>
                    Davom etish →
                </button>
            </div>
        </Modal>
    );

    /* STEP 3 — Karta ma'lumotlari */
    if (step === 3) return (
        <Modal isOpen onClose={onClose} title="Karta ma'lumotlari">
            <StepIndicator current={3} />
            {/* Virtual card preview */}
            <div style={{
                background: `linear-gradient(135deg, ${PAYMENT_METHODS.find(m => m.id === method)?.color || '#6c63ff'}, #1a1a2e)`,
                borderRadius: 18, padding: '24px', marginBottom: 24, position: 'relative', overflow: 'hidden', minHeight: 160
            }}>
                <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
                <div style={{ position: 'absolute', bottom: -20, left: 60, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
                <div style={{ fontWeight: 600, fontSize: '0.8rem', opacity: 0.7, marginBottom: 24, textTransform: 'uppercase', letterSpacing: 2 }}>
                    {PAYMENT_METHODS.find(m => m.id === method)?.label}
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: '1.2rem', letterSpacing: 4, marginBottom: 20, fontWeight: 700 }}>
                    {card.number ? card.number.padEnd(19, ' ').replace(/ /g, ' ') : '•••• •••• •••• ••••'}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', opacity: 0.85 }}>
                    <div>
                        <div style={{ fontSize: '0.65rem', opacity: 0.7, marginBottom: 2 }}>KARTA EGASI</div>
                        <div style={{ fontWeight: 600 }}>{card.name || 'ISM FAMILIYA'}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.65rem', opacity: 0.7, marginBottom: 2 }}>MUDDATI</div>
                        <div style={{ fontWeight: 600 }}>{card.expiry || 'MM/YY'}</div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
                <div className="form-group">
                    <label className="form-label">Karta raqami</label>
                    <input
                        className="form-control"
                        placeholder="0000 0000 0000 0000"
                        value={card.number}
                        maxLength={19}
                        onChange={e => setCard(c => ({ ...c, number: formatCardNumber(e.target.value) }))}
                        style={{ fontFamily: 'monospace', letterSpacing: 2, fontSize: '1rem' }}
                    />
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Muddati</label>
                        <input
                            className="form-control"
                            placeholder="MM/YY"
                            value={card.expiry}
                            maxLength={5}
                            onChange={e => setCard(c => ({ ...c, expiry: formatExpiry(e.target.value) }))}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">CVV</label>
                        <input
                            className="form-control"
                            placeholder="•••"
                            type="password"
                            value={card.cvv}
                            maxLength={4}
                            onChange={e => setCard(c => ({ ...c, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label className="form-label">Karta egasining ismi</label>
                    <input
                        className="form-control"
                        placeholder="ISM FAMILIYA"
                        value={card.name}
                        onChange={e => setCard(c => ({ ...c, name: e.target.value.toUpperCase() }))}
                        style={{ textTransform: 'uppercase', letterSpacing: 1 }}
                    />
                </div>
            </div>

            <div style={{ background: 'var(--bg-glass)', borderRadius: 12, padding: '14px 18px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Jami to'lov:</span>
                <span style={{ fontWeight: 800, color: 'var(--secondary)', fontSize: '1.15rem' }}>{product.price.toLocaleString('uz-UZ')} so'm</span>
            </div>

            <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setStep(2)}>← Orqaga</button>
                <button
                    className="btn btn-primary"
                    style={{ minWidth: 180 }}
                    disabled={paying || !card.number || !card.expiry || !card.cvv || !card.name}
                    onClick={handlePay}
                >
                    {paying ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span> Tekshirilmoqda...
                        </span>
                    ) : `💳 ${product.price.toLocaleString('uz-UZ')} so'm to'lash`}
                </button>
            </div>
        </Modal>
    );

    /* STEP 3.5 — Raqamli to'lovlar (Click/Payme/Uzum) */
    if (step === 3.5) {
        const pm = PAYMENT_METHODS.find(m => m.id === method);
        return (
            <Modal isOpen onClose={onClose} title={`${pm?.label} orqali to'lash`}>
                <StepIndicator current={3} />
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <div style={{ width: 80, height: 80, borderRadius: '50%', background: `${pm?.color}20`, border: `3px solid ${pm?.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 20px' }}>
                        {pm?.icon}
                    </div>
                    <h3 style={{ marginBottom: 8, fontWeight: 700 }}>{pm?.label}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 24 }}>
                        {pm?.label} ilovasida to'lovni tasdiqlang yoki telefon raqamingizni kiriting
                    </p>
                    <div className="form-group" style={{ maxWidth: 280, margin: '0 auto 20px' }}>
                        <label className="form-label">Telefon raqam</label>
                        <input
                            className="form-control"
                            placeholder="+998 90 000 00 00"
                            style={{ textAlign: 'center', fontSize: '1rem', letterSpacing: 1 }}
                        />
                    </div>
                    <div style={{ background: 'var(--bg-glass)', borderRadius: 12, padding: '14px 18px', maxWidth: 280, margin: '0 auto 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>To'lov:</span>
                        <span style={{ fontWeight: 800, color: 'var(--secondary)' }}>{product.price.toLocaleString('uz-UZ')} so'm</span>
                    </div>
                </div>
                <div className="modal-footer" style={{ justifyContent: 'center' }}>
                    <button className="btn btn-secondary" onClick={() => setStep(2)}>← Orqaga</button>
                    <button
                        className="btn btn-primary"
                        style={{ minWidth: 200, background: `linear-gradient(135deg, ${pm?.color}, ${pm?.color}cc)` }}
                        disabled={paying}
                        onClick={handlePay}
                    >
                        {paying ? '⟳ Tekshirilmoqda...' : `${pm?.icon} Tasdiqlash`}
                    </button>
                </div>
            </Modal>
        );
    }

    /* STEP 4 — Muvaffaqiyat / Chek */
    if (step === 4) {
        const pm = PAYMENT_METHODS.find(m => m.id === method);
        const orderId = order?.id?.replace('ord_', '').slice(0, 8).toUpperCase();
        return (
            <Modal isOpen onClose={onClose} title="Xarid muvaffaqiyatli!">
                <div style={{ textAlign: 'center', padding: '10px 0 20px' }}>
                    {/* Success animation */}
                    <div style={{ position: 'relative', width: 90, height: 90, margin: '0 auto 20px' }}>
                        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(6,214,160,0.15)', animation: 'pulse 2s ease infinite' }} />
                        <div style={{ width: 90, height: 90, borderRadius: '50%', background: 'linear-gradient(135deg, var(--success), #04a37a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', boxShadow: '0 0 30px rgba(6,214,160,0.4)' }}>
                            ✓
                        </div>
                    </div>
                    <h2 style={{ fontWeight: 800, marginBottom: 6 }}>To'lov qabul qilindi!</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: 28, fontSize: '0.9rem' }}>Xaridingiz uchun rahmat, {pm?.label} orqali to'lov amalga oshirildi</p>

                    {/* Receipt */}
                    <div style={{ background: 'var(--bg-glass)', border: '1px solid var(--border)', borderRadius: 16, padding: 22, textAlign: 'left', marginBottom: 24, maxWidth: 360, margin: '0 auto 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, paddingBottom: 14, borderBottom: '1px dashed var(--border)' }}>
                            <img src={product.image} alt="" style={{ width: 48, height: 48, borderRadius: 10, objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
                            <div>
                                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{product.name}</div>
                                <span className="badge badge-secondary" style={{ fontSize: '0.65rem' }}>{CATEGORY_LABELS[product.category]}</span>
                            </div>
                        </div>
                        {[
                            ['To\'lov usuli', `${pm?.icon} ${pm?.label}${order?.cardLast4 ? ` •••• ${order.cardLast4}` : ''}`],
                            ['Miqdor', `${product.price.toLocaleString('uz-UZ')} so'm`],
                            ['Sana', new Date().toLocaleDateString('uz-UZ', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })],
                            ['Buyurtma ID', `#${orderId}`],
                            ['Holati', '✅ Muvaffaqiyatli'],
                        ].map(([label, value]) => (
                            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: '0.85rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                                <span style={{ fontWeight: 600, color: label === 'Holati' ? 'var(--success)' : 'var(--text-primary)' }}>{value}</span>
                            </div>
                        ))}
                        <div style={{ borderTop: '1px dashed var(--border)', paddingTop: 14, display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontWeight: 700 }}>Jami:</span>
                            <span style={{ fontWeight: 800, color: 'var(--secondary)', fontSize: '1.1rem' }}>{product.price.toLocaleString('uz-UZ')} so'm</span>
                        </div>
                    </div>

                    <button className="btn btn-primary" style={{ minWidth: 200 }} onClick={onClose}>Yopish</button>
                </div>
            </Modal>
        );
    }

    return null;
}

/* ===================== STEP INDICATOR ===================== */
function StepIndicator({ current }) {
    const steps = ['Ma\'lumot', "To'lov usuli", 'Tasdiqlash'];
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 24 }}>
            {steps.map((s, i) => {
                const num = i + 1;
                const done = current > num;
                const active = current === num;
                return (
                    <React.Fragment key={s}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                            <div style={{
                                width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: done ? 'var(--success)' : active ? 'var(--primary)' : 'var(--bg-glass)',
                                border: `2px solid ${done ? 'var(--success)' : active ? 'var(--primary)' : 'var(--border)'}`,
                                fontSize: '0.8rem', fontWeight: 700, color: (done || active) ? '#fff' : 'var(--text-muted)',
                                transition: 'all 0.3s'
                            }}>
                                {done ? '✓' : num}
                            </div>
                            <span style={{ fontSize: '0.65rem', color: active ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: active ? 700 : 400 }}>{s}</span>
                        </div>
                        {i < steps.length - 1 && (
                            <div style={{ height: 2, width: 50, background: done ? 'var(--success)' : 'var(--border)', marginBottom: 20, transition: 'all 0.3s', flexShrink: 0 }} />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
}

/* ===================== MY PRODUCTS TAB ===================== */
function MyProductsTab({ products, users, onAdd }) {
    const { deleteProduct } = useData();
    if (products.length === 0) return (
        <div className="empty-state">
            <div className="empty-icon">📦</div>
            <div className="empty-title">Tovarlar yo'q</div>
            <div className="empty-desc">Birinchi tovaringizni qo'shing</div>
            <button className="btn btn-primary btn-sm" onClick={onAdd}>Tovar qo'shish</button>
        </div>
    );
    return (
        <div className="table-container">
            <table>
                <thead>
                    <tr><th>Tovar</th><th>Kategoriya</th><th>Narx</th><th>Holat</th><th>Reyting</th><th>Amal</th></tr>
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
                            <td><span className="badge badge-secondary">{CATEGORY_LABELS[p.category] || p.category}</span></td>
                            <td><span style={{ color: 'var(--secondary)', fontWeight: 700 }}>{p.price.toLocaleString('uz-UZ')} so'm</span></td>
                            <td><span className={`badge ${getStatusClass(p.status)}`}>{getStatusLabel(p.status)}</span></td>
                            <td>{p.rating > 0 ? `⭐ ${p.rating} (${p.reviews})` : '—'}</td>
                            <td><button className="btn btn-danger btn-sm" onClick={() => { if (confirm('O\'chirilsinmi?')) deleteProduct(p.id); }}>🗑️</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

/* ===================== ADD PRODUCT MODAL ===================== */
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
        <Modal isOpen={isOpen} onClose={() => { onClose(); setSuccess(false); setForm({ name: '', description: '', category: 'design', price: '', image: '' }); }} title="Tovar yuborildi">
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: 16 }}>🎉</div>
                <h3 style={{ marginBottom: 8 }}>Tovar tekshiruvga yuborildi</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>Administrator tekshirgandan so'ng marketplace'da chiqadi.</p>
                <button className="btn btn-primary" onClick={() => { onClose(); setSuccess(false); setForm({ name: '', description: '', category: 'design', price: '', image: '' }); }}>Tushunarli</button>
            </div>
        </Modal>
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Tovar qo'shish">
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="form-group">
                    <label className="form-label">Nomi *</label>
                    <input className="form-control" placeholder="Tovar/xizmat nomi" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div className="form-group">
                    <label className="form-label">Tavsif *</label>
                    <textarea className="form-control" rows={4} placeholder="Batafsil tavsif..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Kategoriya</label>
                        <select className="form-control" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                            <option value="design">Dizayn</option>
                            <option value="development">Dasturlash</option>
                            <option value="marketing">Marketing</option>
                            <option value="consulting">Konsalting</option>
                            <option value="other">Boshqa</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Narx (so'm) *</label>
                        <input className="form-control" type="number" placeholder="150000" min="1" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
                    </div>
                </div>
                <div className="form-group">
                    <label className="form-label">Rasm (URL)</label>
                    <input className="form-control" placeholder="https://..." value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} />
                    {form.image && <img src={form.image} alt="" style={{ marginTop: 8, height: 80, borderRadius: 8, objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />}
                </div>
                <div style={{ padding: 12, background: 'rgba(255,209,102,0.08)', border: '1px solid rgba(255,209,102,0.2)', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', color: 'var(--warning)' }}>
                    ⚠️ Tovar faqat administrator tasdiqlashidan so'ng chiqadi
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>Bekor qilish</button>
                    <button type="submit" className="btn btn-primary" disabled={!form.name || !form.price}>Tekshiruvga yuborish</button>
                </div>
            </form>
        </Modal>
    );
}
