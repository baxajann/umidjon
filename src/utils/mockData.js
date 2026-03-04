// Seed demo data into localStorage if not already present
export const STORAGE_KEYS = {
    USERS: 'pm_users',
    CURRENT_USER: 'pm_current_user',
    PROJECTS: 'pm_projects',
    TASKS: 'pm_tasks',
    PRODUCTS: 'pm_products',
    NOTIFICATIONS: 'pm_notifications',
    MESSAGES: 'pm_messages',
    SEEDED: 'pm_seeded',
};

export const ROLES = {
    ADMIN: 'admin',
    SELLER: 'seller',
    PM: 'project-manager',
    USER: 'user',
};

const demoUsers = [
    {
        id: 'u1', name: 'Александр Иванов', email: 'admin@demo.com', password: 'admin123',
        role: ROLES.ADMIN, bio: 'Platform administrator', avatar: '', rating: 5.0,
        createdAt: '2025-01-01',
    },
    {
        id: 'u2', name: 'Мария Смирнова', email: 'seller@demo.com', password: 'seller123',
        role: ROLES.SELLER, bio: 'Digital products seller', avatar: '', rating: 4.7,
        createdAt: '2025-01-05',
    },
    {
        id: 'u3', name: 'Дмитрий Козлов', email: 'user@demo.com', password: 'user123',
        role: ROLES.USER, bio: 'Team member and developer', avatar: '', rating: 4.2,
        createdAt: '2025-01-10',
    },
    {
        id: 'u4', name: 'Елена Попова', email: 'pm@demo.com', password: 'pm123',
        role: ROLES.PM, bio: 'Project Manager', avatar: '', rating: 4.8,
        createdAt: '2025-01-12',
    },
];

const demoProjects = [
    {
        id: 'p1', name: 'Редизайн корпоративного сайта', description: 'Полное обновление дизайна и функциональности корпоративного веб-сайта.',
        deadline: '2026-04-30', priority: 'high', status: 'active',
        ownerId: 'u4', members: ['u1', 'u2', 'u3', 'u4'], progress: 65,
        createdAt: '2026-01-15',
    },
    {
        id: 'p2', name: 'Мобильное приложение', description: 'Разработка мобильного приложения для iOS и Android.',
        deadline: '2026-06-15', priority: 'urgent', status: 'active',
        ownerId: 'u1', members: ['u1', 'u3', 'u4'], progress: 30,
        createdAt: '2026-02-01',
    },
    {
        id: 'p3', name: 'CRM-система', description: 'Внедрение системы управления взаимоотношениями с клиентами.',
        deadline: '2026-03-01', priority: 'medium', status: 'completed',
        ownerId: 'u4', members: ['u1', 'u2'], progress: 100,
        createdAt: '2025-11-01',
    },
    {
        id: 'p4', name: 'Email-маркетинг кампания', description: 'Запуск серии email-рассылок для привлечения новых клиентов.',
        deadline: '2026-05-10', priority: 'low', status: 'active',
        ownerId: 'u2', members: ['u2', 'u3'], progress: 45,
        createdAt: '2026-02-20',
    },
];

const demoTasks = [
    { id: 't1', projectId: 'p1', title: 'Создать макеты главной страницы', description: 'Figma-макеты для десктопа и мобильного.', assigneeId: 'u3', deadline: '2026-03-15', status: 'done', priority: 'high', createdAt: '2026-01-16', comments: [{ id: 'c1', userId: 'u1', text: 'Отличная работа!', createdAt: '2026-02-01' }] },
    { id: 't2', projectId: 'p1', title: 'Верстка лендинга', description: 'HTML/CSS реализация по макетам.', assigneeId: 'u3', deadline: '2026-03-25', status: 'in-progress', priority: 'high', createdAt: '2026-01-17', comments: [] },
    { id: 't3', projectId: 'p1', title: 'Интеграция с CMS', description: 'Подключить к headless CMS.', assigneeId: 'u4', deadline: '2026-04-10', status: 'new', priority: 'medium', createdAt: '2026-01-18', comments: [] },
    { id: 't4', projectId: 'p1', title: 'SEO-оптимизация', description: 'Meta-теги, sitemap, robots.txt.', assigneeId: 'u2', deadline: '2026-04-20', status: 'review', priority: 'medium', createdAt: '2026-01-19', comments: [] },
    { id: 't5', projectId: 'p2', title: 'Проектирование архитектуры', description: 'Определить стек и архитектуру приложения.', assigneeId: 'u1', deadline: '2026-02-20', status: 'done', priority: 'urgent', createdAt: '2026-02-02', comments: [] },
    { id: 't6', projectId: 'p2', title: 'Экран авторизации', description: 'Login и Register экраны.', assigneeId: 'u3', deadline: '2026-03-05', status: 'in-progress', priority: 'high', createdAt: '2026-02-05', comments: [] },
    { id: 't7', projectId: 'p2', title: 'Push-уведомления', description: 'Настроить FCM уведомления.', assigneeId: 'u4', deadline: '2026-04-01', status: 'new', priority: 'medium', createdAt: '2026-02-10', comments: [] },
    { id: 't8', projectId: 'p4', title: 'Сбор базы контактов', description: 'Сегментировать существующую базу клиентов.', assigneeId: 'u2', deadline: '2026-03-01', status: 'done', priority: 'high', createdAt: '2026-02-21', comments: [] },
];

const demoProducts = [
    {
        id: 'pr1', sellerId: 'u2', name: 'UI Kit Premium', description: 'Коллекция из 500+ UI компонентов для Figma. Современный дизайн, тёмная и светлая темы, полная кастомизация.',
        category: 'design', price: 2990, image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=80',
        status: 'approved', rating: 4.8, reviews: 124, createdAt: '2026-01-20',
    },
    {
        id: 'pr2', sellerId: 'u2', name: 'React Dashboard Template', description: 'Готовый шаблон админ-панели на React. Адаптивный дизайн, 20+ страниц, интеграции с API.',
        category: 'development', price: 4500, image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80',
        status: 'approved', rating: 4.9, reviews: 87, createdAt: '2026-01-25',
    },
    {
        id: 'pr3', sellerId: 'u2', name: 'SEO Starter Pack', description: 'Комплект материалов для базовой SEO-оптимизации: чеклисты, шаблоны технических заданий, инструкции.',
        category: 'marketing', price: 1490, image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=400&q=80',
        status: 'approved', rating: 4.5, reviews: 203, createdAt: '2026-02-05',
    },
    {
        id: 'pr4', sellerId: 'u2', name: 'Email Marketing Toolkit', description: 'Набор email-шаблонов для различных ниш, включая onboarding, промо и транзакционные письма.',
        category: 'marketing', price: 1990, image: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=400&q=80',
        status: 'approved', rating: 4.6, reviews: 56, createdAt: '2026-02-10',
    },
    {
        id: 'pr5', sellerId: 'u2', name: 'Brand Identity Kit', description: 'Готовый брендбук с шаблонами для логотипа, визиток, презентаций и соцсетей.',
        category: 'design', price: 3500, image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&q=80',
        status: 'pending', rating: 0, reviews: 0, createdAt: '2026-03-01',
    },
    {
        id: 'pr6', sellerId: 'u2', name: 'Node.js API Boilerplate', description: 'Production-ready REST API на Node.js + Express. JWT auth, rate limiting, logging, тесты.',
        category: 'development', price: 3990, image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&q=80',
        status: 'pending', rating: 0, reviews: 0, createdAt: '2026-03-02',
    },
];

const demoNotifications = [
    { id: 'n1', userId: 'u3', type: 'task', text: 'Вам назначена задача «Верстка лендинга»', read: false, createdAt: '2026-03-03T10:00:00' },
    { id: 'n2', userId: 'u2', type: 'product', text: 'Ваш товар «UI Kit Premium» одобрен администратором', read: false, createdAt: '2026-03-02T15:30:00' },
    { id: 'n3', userId: 'u3', type: 'comment', text: 'Новый комментарий к задаче «Создать макеты»', read: true, createdAt: '2026-03-01T09:00:00' },
    { id: 'n4', userId: 'u1', type: 'task', text: 'Задача «Проектирование архитектуры» выполнена', read: false, createdAt: '2026-02-20T14:00:00' },
];

export function seedData() {
    if (localStorage.getItem(STORAGE_KEYS.SEEDED)) return;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(demoUsers));
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(demoProjects));
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(demoTasks));
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(demoProducts));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(demoNotifications));
    localStorage.setItem(STORAGE_KEYS.SEEDED, '1');
}
