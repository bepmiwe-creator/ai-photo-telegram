// app.js - Nano Banana AI Photo - Old Money Edition
// Версия 7.0: Полный функционал с исправлениями

// ОПРЕДЕЛЕНИЕ ANDROID И ОПТИМИЗАЦИЯ
(function() {
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isTelegramWebView = window.Telegram && window.Telegram.WebApp;
    
    if (isAndroid && isTelegramWebView) {
        // Отключаем тяжелые эффекты на Android
        document.documentElement.classList.add('android-device');
        
        // Упрощаем анимации
        const style = document.createElement('style');
        style.textContent = `
            .android-device * {
                transform: translateZ(0) !important;
                -webkit-transform: translateZ(0) !important;
                backface-visibility: hidden !important;
                -webkit-backface-visibility: hidden !important;
            }
            
            .android-device .screen {
                animation: none !important;
            }
            
            .android-device .card,
            .android-device .quick-card {
                box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
            }
            
            .android-device .horizontal-scroll-container {
                overflow-x: scroll !important;
                -webkit-overflow-scrolling: auto !important;
            }
        `;
        document.head.appendChild(style);
        
        // Задержка инициализации для Android
        setTimeout(() => {
            initApp();
        }, 100);
    } else {
        // Быстрая загрузка для iOS и веб
        initApp();
    }
})();

function initApp() {
    // Перенеси сюда весь код из DOMContentLoaded
    console.log('🍌 Nano Banana запускается...');
    
    initTelegram();
    setupNavigation();
    loadPhotoCategories();
    // ... остальной код инициализации
}

// Убери или закомментируй старый DOMContentLoaded
// document.addEventListener('DOMContentLoaded', function() { ... });



// ========== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ==========
let userBalance = 85;
let uploadedImages = [];
let currentCategory = null;
let selectedModel = 'nano';
let selectedFormat = '1:1';
let selectedStyle = null;
let uploadedExample = null;
let uploadedFace = null;
let photosessionFrames = 10;
let selectedPhotoForSession = null;
let userGeneratedPhotos = [];
let selectedCategoryForModal = null;
let currentPhotosessionCategory = null;
let currentGalleryIndex = 0;
let currentGalleryImages = [];
let inactivityTimer = null;
let currentGenerationType = null;
let currentGenerationData = null;

// ========== ДАННЫЕ ==========
const categories = [
    { id: 'create', title: 'Создать свой', icon: '🆕', count: 'Ваш стиль', color: '#9C27B0' },
    { id: 'winter', title: '❄️ Зима', icon: '❄️', count: '', color: '#64B5F6' },
    { id: 'birthday', title: '🎂 День рождения', icon: '🎂', count: '', color: '#FFB74D' },
    { id: 'trends', title: '🔥 Тренды', icon: '🔥', count: '', color: '#FF5722' },
    { id: 'couples', title: '👫 Парные', icon: '👫', count: '', color: '#EC407A' },
    { id: 'girls', title: '💃 Для девушек', icon: '💃', count: '', color: '#E91E63' },
    { id: 'men', title: '🕺 Для мужчин', icon: '🕺', count: '', color: '#42A5F5' },
    { id: 'pets', title: '🐾 Питомцы', icon: '🐾', count: '', color: '#81C784' },
    { id: 'professions', title: '💼 Профессии', icon: '💼', count: '', color: '#78909C' },
    { id: 'luxury', title: '💎 Luxury', icon: '💎', count: '', color: '#FFD700' }
];

// Функция для склонения слова "стиль"
function getStyleWord(count) {
    if (count % 10 === 1 && count % 100 !== 11) return 'стиль';
    if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return 'стиля';
    return 'стилей';
}

// Тестовые сгенерированные фото пользователя
const mockGeneratedPhotos = [
    { 
        id: 1, 
        src: 'https://via.placeholder.com/300x400/E0F2FE/1E3A8A?text=Зима+1', 
        title: 'Зимняя сказка',
        date: '23.01.2026',
        type: 'photo'
    },
    { 
        id: 2, 
        src: 'https://via.placeholder.com/300x400/F8E1E7/B76E79?text=ДР+2', 
        title: 'Розовый закат',
        date: '22.01.2026',
        type: 'photo'
    },
    { 
        id: 3, 
        src: 'https://via.placeholder.com/300x400/FAF3E0/374151?text=Элегант+3', 
        title: 'Элегантность',
        date: '21.01.2026',
        type: 'photo'
    },
    { 
        id: 4, 
        src: 'https://via.placeholder.com/300x400/E0F2FE/1E3A8A?text=Город+4', 
        title: 'Городские огни',
        date: '20.01.2026',
        type: 'photosession'
    },
    { 
        id: 5, 
        src: 'https://via.placeholder.com/300x400/F8E1E7/B76E79?text=Роман+5', 
        title: 'Романтика',
        date: '19.01.2026',
        type: 'photo'
    },
    { 
        id: 6, 
        src: 'https://via.placeholder.com/300x400/FAF3E0/374151?text=Мин+6', 
        title: 'Минимализм',
        date: '18.01.2026',
        type: 'photo'
    }
];

// Данные для фотосессий
const photosessionCategories = [
    { 
        id: 'winter', 
        title: 'Зимняя сказка', 
        icon: '❄️', 
        color: '#64B5F6',
        styles: [
            { id: 1, name: "Снежная королева", preview: "https://via.placeholder.com/300x400/64B5F6/FFFFFF?text=❄️+1", views: 17200, rating: 5.0 },
            { id: 2, name: "Зимний лес", preview: "https://via.placeholder.com/300x400/64B5F6/FFFFFF?text=❄️+2", views: 12300, rating: 5.0 },
            { id: 3, name: "Новогоднее настроение", preview: "https://via.placeholder.com/300x400/64B5F6/FFFFFF?text=❄️+3", views: 21500, rating: 5.0 },
            { id: 4, name: "Лыжный курорт", preview: "https://via.placeholder.com/300x400/64B5F6/FFFFFF?text=❄️+4", views: 8900, rating: 5.0 },
            { id: 5, name: "Морозные узоры", preview: "https://via.placeholder.com/300x400/64B5F6/FFFFFF?text=❄️+5", views: 14200, rating: 5.0 },
            { id: 6, name: "Рождественский вечер", preview: "https://via.placeholder.com/300x400/64B5F6/FFFFFF?text=❄️+6", views: 18700, rating: 5.0 }
        ]
    },
    { 
        id: 'wedding', 
        title: 'Свадебная', 
        icon: '💍', 
        color: '#EC407A',
        styles: [
            { id: 1, name: "Романтический закат", preview: "https://via.placeholder.com/300x400/EC407A/FFFFFF?text=💍+1", views: 24500, rating: 5.0 },
            { id: 2, name: "Церковная церемония", preview: "https://via.placeholder.com/300x400/EC407A/FFFFFF?text=💍+2", views: 18700, rating: 5.0 },
            { id: 3, name: "Праздничный банкет", preview: "https://via.placeholder.com/300x400/EC407A/FFFFFF?text=💍+3", views: 16200, rating: 5.0 }
        ]
    },
    { 
        id: 'beach', 
        title: 'Пляжный отдых', 
        icon: '🏖️', 
        color: '#FFB74D',
        styles: [
            { id: 1, name: "Закат на море", preview: "https://via.placeholder.com/300x400/FFB74D/FFFFFF?text=🏖️+1", views: 32500, rating: 5.0 },
            { id: 2, name: "Пальмовый рай", preview: "https://via.placeholder.com/300x400/FFB74D/FFFFFF?text=🏖️+2", views: 27800, rating: 5.0 }
        ]
    },
    { 
        id: 'luxury', 
        title: 'Роскошь Luxury', 
        icon: '💎', 
        color: '#FFD700',
        styles: [
            { id: 1, name: "Золотой шик", preview: "https://via.placeholder.com/300x400/FFD700/FFFFFF?text=💎+1", views: 43200, rating: 5.0 },
            { id: 2, name: "Алмазный блеск", preview: "https://via.placeholder.com/300x400/FFD700/FFFFFF?text=💎+2", views: 38900, rating: 5.0 },
            { id: 3, name: "Шикарный вечер", preview: "https://via.placeholder.com/300x400/FFD700/FFFFFF?text=💎+3", views: 41500, rating: 5.0 }
        ]
    }
];

// Примеры стилей для категорий
const styleExamples = {
    winter: [
        { id: 1, name: "Снежная королева", icon: "👑", color: "#4FC3F7", preview: "https://via.placeholder.com/300x400/64B5F6/FFFFFF?text=❄️+Королева" },
        { id: 2, name: "Зимний лес", icon: "🌲", color: "#81C784", preview: "https://via.placeholder.com/300x400/64B5F6/FFFFFF?text=❄️+Лес" },
        { id: 3, name: "Новогоднее настроение", icon: "🎄", color: "#FF8A65", preview: "https://via.placeholder.com/300x400/64B5F6/FFFFFF?text=❄️+НГ" },
        { id: 4, name: "Лыжный курорт", icon: "⛷️", color: "#64B5F6", preview: "https://via.placeholder.com/300x400/64B5F6/FFFFFF?text=❄️+Лыжи" }
    ],
    birthday: [
        { id: 1, name: "Торт и свечи", icon: "🎂", color: "#FFB74D", preview: "https://via.placeholder.com/300x400/FFB74D/FFFFFF?text=🎂+Торт" },
        { id: 2, name: "Праздничный вечер", icon: "🎉", color: "#BA68C8", preview: "https://via.placeholder.com/300x400/FFB74D/FFFFFF?text=🎂+Вечер" },
        { id: 3, name: "Воздушные шары", icon: "🎈", color: "#4DD0E1", preview: "https://via.placeholder.com/300x400/FFB74D/FFFFFF?text=🎂+Шары" },
        { id: 4, name: "Подарки", icon: "🎁", color: "#AED581", preview: "https://via.placeholder.com/300x400/FFB74D/FFFFFF?text=🎂+Подарки" }
    ],
    trends: [
        { id: 1, name: "Неоновый стиль", icon: "💡", color: "#9575CD", preview: "https://via.placeholder.com/300x400/FF5722/FFFFFF?text=🔥+Неон" },
        { id: 2, name: "Ретро волна", icon: "📻", color: "#FF8A65", preview: "https://via.placeholder.com/300x400/FF5722/FFFFFF?text=🔥+Ретро" },
        { id: 3, name: "Футуризм", icon: "🚀", color: "#4DB6AC", preview: "https://via.placeholder.com/300x400/FF5722/FFFFFF?text=🔥+Футуризм" }
    ],
    couples: [
        { id: 1, name: "Романтический вечер", icon: "💕", color: "#F06292", preview: "https://via.placeholder.com/300x400/EC407A/FFFFFF?text=👫+Вечер" },
        { id: 2, name: "Прогулка в парке", icon: "🌳", color: "#81C784", preview: "https://via.placeholder.com/300x400/EC407A/FFFFFF?text=👫+Парк" }
    ],
    girls: [
        { id: 1, name: "Стиль принцессы", icon: "👸", color: "#CE93D8", preview: "https://via.placeholder.com/300x400/E91E63/FFFFFF?text=💃+Принцесса" },
        { id: 2, name: "Деловой образ", icon: "💼", color: "#80CBC4", preview: "https://via.placeholder.com/300x400/E91E63/FFFFFF?text=💃+Деловой" }
    ],
    men: [
        { id: 1, name: "Классический костюм", icon: "🤵", color: "#78909C", preview: "https://via.placeholder.com/300x400/42A5F5/FFFFFF?text=🕺+Костюм" },
        { id: 2, name: "Спортивный стиль", icon: "🏃", color: "#42A5F5", preview: "https://via.placeholder.com/300x400/42A5F5/FFFFFF?text=🕺+Спорт" }
    ],
    pets: [
        { id: 1, name: "Домашний любимец", icon: "🐶", color: "#FFD54F", preview: "https://via.placeholder.com/300x400/81C784/FFFFFF?text=🐾+Питомец" },
        { id: 2, name: "Игривый момент", icon: "🎾", color: "#AED581", preview: "https://via.placeholder.com/300x400/81C784/FFFFFF?text=🐾+Игра" }
    ],
    professions: [
        { id: 1, name: "Врач", icon: "👨‍⚕️", color: "#EF5350", preview: "https://via.placeholder.com/300x400/78909C/FFFFFF?text=💼+Врач" },
        { id: 2, name: "Программист", icon: "💻", color: "#42A5F5", preview: "https://via.placeholder.com/300x400/78909C/FFFFFF?text=💼+Программист" }
    ],
    luxury: [
        { id: 1, name: "Золотой шик", icon: "💰", color: "#FFD700", preview: "https://via.placeholder.com/300x400/FFD700/FFFFFF?text=💎+Золото" },
        { id: 2, name: "Алмазный блеск", icon: "💎", color: "#B39DDB", preview: "https://via.placeholder.com/300x400/FFD700/FFFFFF?text=💎+Алмаз" }
    ]
};

// ========== ЗАПУСК ПРИЛОЖЕНИЯ ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('🍌 Nano Banana Old Money Edition запускается...');
    
    initTelegram();
    setupNavigation();
    loadPhotoCategories();
    loadHorizontalCategories();
    loadPhotosessionHorizontalCategories();
    setupButtons();
    setupRealUpload();
    setupHistoryAndProfile();
    
    userGeneratedPhotos = [...mockGeneratedPhotos];
    loadUserPhotos();
    setupGenerationHandlers();
    setupModalHandlers();
    
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});
// ========== TELEGRAM ==========
function initTelegram() {
    if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.expand();
        
        if (tg.disableVerticalSwipes) {
            tg.disableVerticalSwipes();
        }
        
        const user = tg.initDataUnsafe?.user;
        if (user) {
            const userName = user.first_name || 'Пользователь';
            document.getElementById('profile-name').textContent = userName;
            document.getElementById('profile-id').textContent = user.id || '...';
        }
        
        if (tg.colorScheme === 'dark') {
            document.body.classList.add('dark-theme');
        }
        
        tg.onEvent('backButtonClicked', function() {
            const activeOverlay = document.querySelector('.overlay.show');
            if (activeOverlay) {
                activeOverlay.classList.remove('show');
                setTimeout(() => {
                    activeOverlay.style.display = 'none';
                }, 300);
                return;
            }
            
            const activeScreen = document.querySelector('.screen.active');
            if (activeScreen.id === 'screen-main') {
                tg.close();
            } else {
                switchScreen('main');
            }
        });
        
        tg.BackButton.show();
        console.log('Telegram подключен');
    }
}

// ========== НАВИГАЦИЯ ==========
function setupNavigation() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const quickCards = document.querySelectorAll('.quick-card');
    const screens = document.querySelectorAll('.screen');
    
    function switchScreen(screenId) {
        console.log('Переключаемся на экран:', screenId);
        
        screens.forEach(screen => {
            screen.classList.remove('active');
        });
        
        const targetScreen = document.getElementById(`screen-${screenId}`);
        if (targetScreen) {
            targetScreen.classList.add('active');
            
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.screen === screenId) {
                    btn.classList.add('active');
                }
            });
            
            if (screenId === 'photo') {
                loadPhotoCategories();
                loadHorizontalCategories();
            } else if (screenId === 'photosession') {
                loadUserPhotos();
                loadPhotosessionHorizontalCategories();
            } else if (screenId === 'history') {
                loadHistory();
            } else if (screenId === 'profile') {
                updateProfileStats();
            }
        }
    }
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const screenId = this.getAttribute('data-screen');
            switchScreen(screenId);
        });
    });
    
    quickCards.forEach(card => {
        card.addEventListener('click', function() {
            const screenId = this.getAttribute('data-screen');
            if (screenId === 'video') {
                showNotification('Видео функция скоро будет доступна! 🎬');
                return;
            }
            switchScreen(screenId);
        });
    });
    
    const balanceBtn = document.getElementById('balance-btn');
    if (balanceBtn) {
        balanceBtn.addEventListener('click', function() {
            showPaymentOptions();
        });
    }
    
    window.switchScreen = switchScreen;
}

// ========== РАЗДЕЛ "ФОТО" ==========
function loadPhotoCategories() {
    const container = document.getElementById('categories-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Горизонтальные карточки рядом
    const horizontalContainer = document.createElement('div');
    horizontalContainer.className = 'horizontal-cards-container';
    horizontalContainer.innerHTML = `
        <div class="prompt-card" id="prompt-generate-btn">
            <div class="prompt-icon">✍️</div>
            <div class="prompt-text">
                <div class="prompt-title">Генерация по описанию</div>
                <div class="prompt-desc">Опишите картинку словами</div>
            </div>
        </div>
        <div class="create-own-card" data-category-id="create">
            <div class="category-icon">🆕</div>
            <div class="category-title">Создать свой</div>
            <div class="category-count">Ваш стиль</div>
        </div>
    `;
    
    container.appendChild(horizontalContainer);
    
    // Горизонтальные каталоги
    const horizontalCategories = document.createElement('div');
    horizontalCategories.className = 'horizontal-categories';
    horizontalCategories.id = 'horizontal-categories-main';
    
    container.appendChild(horizontalCategories);
    
    loadHorizontalCategories();
    
    const promptBtn = document.getElementById('prompt-generate-btn');
    if (promptBtn) {
        promptBtn.addEventListener('click', function() {
            currentCategory = 'prompt';
            selectedStyle = null;
            showGenerateScreen();
        });
    }
    
    const createOwnCard = horizontalContainer.querySelector('.create-own-card');
    if (createOwnCard) {
        createOwnCard.addEventListener('click', () => {
            currentCategory = 'create';
            selectedStyle = null;
            uploadedExample = null;
            uploadedFace = null;
            showCreateOwnStyle();
        });
    }
}

// ========== ГОРИЗОНТАЛЬНЫЕ КАТАЛОГИ СТИЛЕЙ ==========
function loadHorizontalCategories() {
    const container = document.getElementById('horizontal-categories-main') || 
                     document.getElementById('horizontal-categories');
    if (!container) return;
    
    container.innerHTML = '';
    
    const mainCategories = categories.filter(cat => cat.id !== 'create');
    
    mainCategories.forEach(category => {
        const section = document.createElement('div');
        section.className = 'horizontal-category-section';
        
        const header = document.createElement('div');
        header.className = 'horizontal-category-header';
        
        const stylesCount = styleExamples[category.id]?.length || 0;
        const styleWord = getStyleWord(stylesCount);
        
        header.innerHTML = `
            <h3 class="horizontal-category-title">${category.title}</h3>
            <button class="view-all-btn" data-category="${category.id}">
                Все ${stylesCount} ${styleWord}
                <span class="material-icons-round">arrow_forward</span>
            </button>
        `;
        
        const scrollContainer = document.createElement('div');
        scrollContainer.className = 'horizontal-scroll-container';
        scrollContainer.id = `scroll-${category.id}`;
        
        const styles = styleExamples[category.id] || [];
        const displayStyles = styles.slice(0, 5);
        
        displayStyles.forEach(style => {
            const styleCard = document.createElement('div');
            styleCard.className = 'horizontal-style-card';
            styleCard.dataset.category = category.id;
            styleCard.dataset.styleId = style.id;
            
            styleCard.innerHTML = `
                <div class="horizontal-style-preview">
                    <img src="${style.preview}" alt="${style.name}">
                </div>
                <div class="horizontal-style-name">${style.name}</div>
            `;
            
            styleCard.addEventListener('click', () => {
                selectedStyle = style.name;
                currentCategory = category.id;
                showGenerateScreen();
            });
            
            scrollContainer.appendChild(styleCard);
        });
        
        section.appendChild(header);
        section.appendChild(scrollContainer);
        container.appendChild(section);
        
        const titleElement = header.querySelector('.horizontal-category-title');
        titleElement.addEventListener('click', () => {
            selectedCategoryForModal = category.id;
            showCategoryModal(category.id);
        });
        
        const viewAllBtn = header.querySelector('.view-all-btn');
        viewAllBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            selectedCategoryForModal = category.id;
            showCategoryModal(category.id);
        });
    });
}

// ========== МОДАЛЬНОЕ ОКНО КАТЕГОРИИ ==========
function showCategoryModal(categoryId) {
    const modal = document.getElementById('category-modal');
    if (!modal) return;
    
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;
    
    const titleElement = document.getElementById('category-modal-title');
    if (titleElement) {
        titleElement.textContent = category.title;
    }
    
    const container = document.getElementById('category-styles-container');
    if (container) {
        container.innerHTML = '';
        
        const styles = styleExamples[categoryId] || [];
        
        styles.forEach(style => {
            const styleCard = document.createElement('div');
            styleCard.className = 'modal-style-card';
            
            styleCard.innerHTML = `
                <div class="modal-style-preview">
                    <img src="${style.preview}" alt="${style.name}">
                </div>
                <div class="modal-style-name">${style.name}</div>
            `;
            
            styleCard.addEventListener('click', () => {
                selectedStyle = style.name;
                currentCategory = categoryId;
                hideCategoryModal();
                showGenerateScreen();
            });
            
            container.appendChild(styleCard);
        });
    }
    
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('show'), 10);
}

function hideCategoryModal() {
    const modal = document.getElementById('category-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

// ========== ФОТОСЕССИИ ==========
function loadPhotosessionHorizontalCategories() {
    const container = document.getElementById('photosession-horizontal-categories');
    if (!container) return;
    
    container.innerHTML = '';
    
    photosessionCategories.forEach(category => {
        const section = document.createElement('div');
        section.className = 'horizontal-category-section';
        
        const header = document.createElement('div');
        header.className = 'horizontal-category-header';
        
        const stylesCount = category.styles.length;
        const styleWord = getStyleWord(stylesCount);
        
        header.innerHTML = `
            <h3 class="horizontal-category-title">${category.title}</h3>
            <button class="view-all-btn" data-category="${category.id}">
                Все ${stylesCount} ${styleWord}
                <span class="material-icons-round">arrow_forward</span>
            </button>
        `;
        
        const scrollContainer = document.createElement('div');
        scrollContainer.className = 'horizontal-scroll-container';
        
        const displayStyles = category.styles.slice(0, 5);
        
        displayStyles.forEach(style => {
            const styleCard = document.createElement('div');
            styleCard.className = 'horizontal-style-card';
            
            // БЕЗ статистики на странице фотосессий
            styleCard.innerHTML = `
                <div class="horizontal-style-preview">
                    <img src="${style.preview}" alt="${style.name}">
                </div>
                <div class="horizontal-style-name">${style.name}</div>
            `;
            
            styleCard.addEventListener('click', () => {
                currentPhotosessionCategory = category;
                showPhotosessionGalleryModal(category.id);
            });
            
            scrollContainer.appendChild(styleCard);
        });
        
        section.appendChild(header);
        section.appendChild(scrollContainer);
        container.appendChild(section);
        
        const titleElement = header.querySelector('.horizontal-category-title');
        titleElement.addEventListener('click', () => {
            currentPhotosessionCategory = category;
            showPhotosessionGalleryModal(category.id);
        });
        
        const viewAllBtn = header.querySelector('.view-all-btn');
        viewAllBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentPhotosessionCategory = category;
            showPhotosessionGalleryModal(category.id);
        });
    });
}

function showPhotosessionGalleryModal(categoryId) {
    const modal = document.getElementById('photosession-gallery-modal');
    if (!modal) return;
    
    const category = photosessionCategories.find(c => c.id === categoryId);
    if (!category) return;
    
    const titleElement = document.getElementById('photosession-gallery-title');
    if (titleElement) {
        titleElement.textContent = category.title;
    }
    
    const container = document.getElementById('photosession-gallery-container');
    if (container) {
        container.innerHTML = '';
        
        category.styles.forEach(style => {
            const viewsText = style.views >= 1000 ? (style.views / 1000).toFixed(1) + 'K' : style.views;
            
            const styleCard = document.createElement('div');
            styleCard.className = 'photosession-gallery-card';
            
            // Статистика ТОЛЬКО в модальном окне
            styleCard.innerHTML = `
                <div class="photosession-gallery-preview">
                    <img src="${style.preview}" alt="${style.name}">
                </div>
                <div class="photosession-gallery-stats">
                    <span class="gallery-stat-item">👁 ${viewsText}</span>
                    <span class="gallery-stat-item">⭐ ${style.rating}</span>
                </div>
            `;
            
            styleCard.addEventListener('click', () => {
                showPhotosessionSeriesModal(category, style);
            });
            
            container.appendChild(styleCard);
        });
    }
    
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('show'), 10);
}

function hidePhotosessionGalleryModal() {
    const modal = document.getElementById('photosession-gallery-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

function showPhotosessionSeriesModal(category, style) {
    showNotification(`Выбран стиль: ${style.name} из категории ${category.title}`);
    hidePhotosessionGalleryModal();
    // Здесь будет логика показа серии фотосессии
}

function loadUserPhotos() {
    const container = document.getElementById('user-photos-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (userGeneratedPhotos.length === 0) {
        container.innerHTML = `
            <div class="empty-photos">
                <div class="empty-icon">📸</div>
                <h3>У вас ещё нет фото</h3>
                <p>Создайте первое фото</p>
                <button class="btn-start" onclick="switchScreen('photo')">Создать фото</button>
            </div>
        `;
        return;
    }
    
    userGeneratedPhotos.forEach(photo => {
        const photoCard = document.createElement('div');
        photoCard.className = 'user-photo-card';
        photoCard.innerHTML = `
            <img src="${photo.src}" alt="${photo.title}">
            <div class="photo-overlay">
                <div class="photo-title">${photo.title}</div>
                <div class="photo-date">${photo.date}</div>
            </div>
            ${photo.type === 'photo' ? '<button class="photosession-from-photo-btn">📸 Фотосессия</button>' : ''}
        `;
        
        if (photo.type === 'photo') {
            const btn = photoCard.querySelector('.photosession-from-photo-btn');
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                selectedPhotoForSession = photo;
                showPhotosessionCreation(photo);
            });
        }
        
        container.appendChild(photoCard);
    });
    
    // Обновляем счётчик
    const countElement = document.getElementById('user-photos-count');
    if (countElement) {
        countElement.textContent = `${userGeneratedPhotos.length} фото`;
    }
}
// ========== ЭКРАН ГЕНЕРАЦИИ ==========
function showGenerateScreen() {
    const overlay = document.getElementById('generate-overlay');
    if (!overlay) {
        createGenerateOverlay();
    }
    
    const overlay2 = document.getElementById('generate-overlay');
    overlay2.style.display = 'flex';
    setTimeout(() => overlay2.classList.add('show'), 10);
    
    updateGenerateScreen();
}

function createGenerateOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.id = 'generate-overlay';
    
    overlay.innerHTML = `
        <div class="overlay-content generate-overlay">
            <div class="overlay-header">
                <button class="back-btn" onclick="hideGenerateScreen()">
                    <span class="material-icons-round">arrow_back</span>
                </button>
                <h3>Генерация изображения</h3>
                <div class="header-placeholder"></div>
            </div>
            
            <div class="overlay-body">
                <div class="generate-info-card">
                    <div class="style-info" id="selected-style-info"></div>
                </div>
                
                <div class="prompt-section" id="prompt-section">
                    <label>Описание изображения</label>
                    <textarea id="prompt-input" placeholder="Опишите что хотите увидеть..." rows="4"></textarea>
                </div>
                
                <div class="upload-section" id="upload-section">
                    <label>Загрузите ваше фото</label>
                    <div class="upload-area" id="face-upload-area">
                        <span class="material-icons-round">add_photo_alternate</span>
                        <p>Нажмите для загрузки</p>
                        <input type="file" id="face-upload-input" accept="image/*" hidden>
                    </div>
                </div>
                
                <div class="settings-section">
                    <label>Модель</label>
                    <div class="model-options">
                        <button class="model-btn active" data-model="nano">Nano 🍌</button>
                        <button class="model-btn" data-model="turbo">Turbo ⚡</button>
                        <button class="model-btn" data-model="pro">Pro 💎</button>
                    </div>
                    
                    <label>Формат</label>
                    <div class="format-options">
                        <button class="format-btn active" data-format="1:1">1:1</button>
                        <button class="format-btn" data-format="3:4">3:4</button>
                        <button class="format-btn" data-format="16:9">16:9</button>
                    </div>
                </div>
                
                <div class="generate-button-section">
                    <button class="generate-btn" onclick="startGeneration()">
                        <span class="material-icons-round">auto_awesome</span>
                        Сгенерировать (5 ⭐)
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    setupGenerateHandlers();
}

function updateGenerateScreen() {
    const styleInfo = document.getElementById('selected-style-info');
    const promptSection = document.getElementById('prompt-section');
    const uploadSection = document.getElementById('upload-section');
    
    if (currentCategory === 'prompt') {
        styleInfo.innerHTML = '<p>Генерация по текстовому описанию</p>';
        promptSection.style.display = 'block';
        uploadSection.style.display = 'block';
    } else if (selectedStyle) {
        styleInfo.innerHTML = `<p>Выбран стиль: <strong>${selectedStyle}</strong></p>`;
        promptSection.style.display = 'none';
        uploadSection.style.display = 'block';
    }
}

function hideGenerateScreen() {
    const overlay = document.getElementById('generate-overlay');
    if (overlay) {
        overlay.classList.remove('show');
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 300);
    }
}

function startGeneration() {
    if (userBalance < 5) {
        showNotification('Недостаточно звёзд для генерации');
        showPaymentOptions();
        return;
    }
    
    userBalance -= 5;
    updateBalance();
    
    showGenerationProgress();
    
    setTimeout(() => {
        const newPhoto = {
            id: userGeneratedPhotos.length + 1,
            src: `https://via.placeholder.com/300x400/E0F2FE/1E3A8A?text=New+${userGeneratedPhotos.length + 1}`,
            title: selectedStyle || 'Новое фото',
            date: new Date().toLocaleDateString('ru-RU'),
            type: 'photo'
        };
        
        userGeneratedPhotos.unshift(newPhoto);
        hideGenerationProgress();
        hideGenerateScreen();
        showNotification('Фото успешно сгенерировано! 🎉');
        
        if (document.querySelector('.screen.active').id === 'screen-photosession') {
            loadUserPhotos();
        }
    }, 3000);
}

function showGenerationProgress() {
    const progress = document.createElement('div');
    progress.className = 'generation-progress';
    progress.id = 'generation-progress';
    progress.innerHTML = `
        <div class="progress-content">
            <div class="progress-spinner"></div>
            <h3>Генерируем ваше фото...</h3>
            <p>Это займёт несколько секунд</p>
        </div>
    `;
    document.body.appendChild(progress);
    setTimeout(() => progress.classList.add('show'), 10);
}

function hideGenerationProgress() {
    const progress = document.getElementById('generation-progress');
    if (progress) {
        progress.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(progress);
        }, 300);
    }
}

// ========== СОЗДАНИЕ СВОЕГО СТИЛЯ ==========
function showCreateOwnStyle() {
    const overlay = document.getElementById('create-style-overlay');
    if (!overlay) {
        createStyleOverlay();
    }
    
    const overlay2 = document.getElementById('create-style-overlay');
    overlay2.style.display = 'flex';
    setTimeout(() => overlay2.classList.add('show'), 10);
}

function createStyleOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.id = 'create-style-overlay';
    
    overlay.innerHTML = `
        <div class="overlay-content create-style-overlay">
            <div class="overlay-header">
                <button class="back-btn" onclick="hideCreateStyleOverlay()">
                    <span class="material-icons-round">arrow_back</span>
                </button>
                <h3>Создать свой стиль</h3>
                <div class="header-placeholder"></div>
            </div>
            
            <div class="overlay-body">
                <div class="create-style-info">
                    <p>Загрузите пример стиля и ваше фото для создания уникального изображения</p>
                </div>
                
                <div class="upload-grid">
                    <div class="upload-box">
                        <label>Пример стиля</label>
                        <div class="upload-area" id="style-example-upload">
                            <span class="material-icons-round">style</span>
                            <p>Загрузить пример</p>
                            <input type="file" id="style-example-input" accept="image/*" hidden>
                        </div>
                    </div>
                    
                    <div class="upload-box">
                        <label>Ваше фото</label>
                        <div class="upload-area" id="your-photo-upload">
                            <span class="material-icons-round">person</span>
                            <p>Загрузить фото</p>
                            <input type="file" id="your-photo-input" accept="image/*" hidden>
                        </div>
                    </div>
                </div>
                
                <div class="style-settings">
                    <label>Интенсивность стиля</label>
                    <input type="range" id="style-intensity" min="0" max="100" value="75">
                    <div class="range-labels">
                        <span>Слабо</span>
                        <span>Средне</span>
                        <span>Сильно</span>
                    </div>
                </div>
                
                <button class="generate-btn" onclick="generateCustomStyle()">
                    <span class="material-icons-round">auto_awesome</span>
                    Создать стиль (10 ⭐)
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    setupCreateStyleHandlers();
}

function hideCreateStyleOverlay() {
    const overlay = document.getElementById('create-style-overlay');
    if (overlay) {
        overlay.classList.remove('show');
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 300);
    }
}

function generateCustomStyle() {
    if (userBalance < 10) {
        showNotification('Недостаточно звёзд для создания стиля');
        showPaymentOptions();
        return;
    }
    
    if (!uploadedExample || !uploadedFace) {
        showNotification('Загрузите оба изображения');
        return;
    }
    
    userBalance -= 10;
    updateBalance();
    
    showGenerationProgress();
    
    setTimeout(() => {
        const newPhoto = {
            id: userGeneratedPhotos.length + 1,
            src: `https://via.placeholder.com/300x400/FFD700/FFFFFF?text=Custom+${userGeneratedPhotos.length + 1}`,
            title: 'Свой стиль',
            date: new Date().toLocaleDateString('ru-RU'),
            type: 'photo'
        };
        
        userGeneratedPhotos.unshift(newPhoto);
        hideGenerationProgress();
        hideCreateStyleOverlay();
        showNotification('Стиль успешно создан! 🎨');
    }, 3000);
}

// ========== ФОТОСЕССИЯ ==========
function showPhotosessionCreation(photo) {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.id = 'photosession-creation-overlay';
    
    overlay.innerHTML = `
        <div class="overlay-content photosession-creation">
            <div class="overlay-header">
                <button class="back-btn" onclick="hidePhotosessionCreation()">
                    <span class="material-icons-round">arrow_back</span>
                </button>
                <h3>Создание фотосессии</h3>
                <div class="header-placeholder"></div>
            </div>
            
            <div class="overlay-body">
                <div class="selected-photo-preview">
                    <img src="${photo.src}" alt="${photo.title}">
                    <p>Выбрано фото: ${photo.title}</p>
                </div>
                
                <div class="frames-selector">
                    <label>Количество кадров</label>
                    <div class="frames-options">
                        <button class="frames-btn active" data-frames="10">10 кадров (50 ⭐)</button>
                        <button class="frames-btn" data-frames="15">15 кадров (70 ⭐)</button>
                        <button class="frames-btn" data-frames="20">20 кадров (90 ⭐)</button>
                    </div>
                    <p class="frames-bonus">+3 кадра в подарок!</p>
                </div>
                
                <button class="generate-btn" onclick="generatePhotosession()">
                    <span class="material-icons-round">collections</span>
                    Создать фотосессию
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    overlay.style.display = 'flex';
    setTimeout(() => overlay.classList.add('show'), 10);
    
    // Обработчики для кнопок выбора кадров
    const framesBtns = overlay.querySelectorAll('.frames-btn');
    framesBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            framesBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            photosessionFrames = parseInt(this.dataset.frames);
        });
    });
}

function hidePhotosessionCreation() {
    const overlay = document.getElementById('photosession-creation-overlay');
    if (overlay) {
        overlay.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(overlay);
        }, 300);
    }
}

function generatePhotosession() {
    const cost = photosessionFrames === 10 ? 50 : photosessionFrames === 15 ? 70 : 90;
    
    if (userBalance < cost) {
        showNotification('Недостаточно звёзд для фотосессии');
        showPaymentOptions();
        return;
    }
    
    userBalance -= cost;
    updateBalance();
    
    showGenerationProgress();
    
    setTimeout(() => {
        hideGenerationProgress();
        hidePhotosessionCreation();
        showNotification(`Фотосессия из ${photosessionFrames + 3} кадров создана! 📸`);
    }, 5000);
}

// ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
}

function updateBalance() {
    document.getElementById('header-balance').textContent = userBalance;
    document.getElementById('profile-balance').textContent = userBalance;
}

function showPaymentOptions() {
    showNotification('Пополнение через Telegram Stars скоро будет доступно! ⭐');
}

function loadHistory() {
    const container = document.getElementById('history-container');
    if (!container) {
        const historyScreen = document.getElementById('screen-history');
        const content = historyScreen.querySelector('.screen-content');
        
        if (userGeneratedPhotos.length > 0) {
            content.innerHTML = `
                <div class="history-grid" id="history-container"></div>
            `;
            
            const grid = document.getElementById('history-container');
            userGeneratedPhotos.forEach(photo => {
                const card = document.createElement('div');
                card.className = 'history-card';
                card.innerHTML = `
                    <img src="${photo.src}" alt="${photo.title}">
                    <div class="history-info">
                        <h4>${photo.title}</h4>
                        <p>${photo.date}</p>
                    </div>
                `;
                grid.appendChild(card);
            });
        }
    }
}

function updateProfileStats() {
    document.getElementById('stats-photos').textContent = userGeneratedPhotos.filter(p => p.type === 'photo').length;
    document.getElementById('stats-videos').textContent = '0';
    document.getElementById('stats-spent').textContent = (100 - userBalance);
    document.getElementById('stats-saved').textContent = userGeneratedPhotos.length;
}

// ========== ОБРАБОТЧИКИ ==========
function setupButtons() {
    // Кнопка создания фотосессии
    const createPhotosessionBtn = document.querySelector('[data-pack="custom"]');
    if (createPhotosessionBtn) {
        createPhotosessionBtn.addEventListener('click', () => {
            switchScreen('photosession-custom');
        });
    }
    
    // Кнопка пополнения в профиле
    const addBalanceBtn = document.getElementById('add-balance-profile');
    if (addBalanceBtn) {
        addBalanceBtn.addEventListener('click', showPaymentOptions);
    }
}

function setupRealUpload() {
    // Будет реализовано при подключении реальной загрузки
}

function setupHistoryAndProfile() {
    updateProfileStats();
}

function setupGenerationHandlers() {
    // Обработчики для генерации уже встроены в функции
}

function setupModalHandlers() {
    // Закрытие модальных окон
    document.getElementById('category-modal-close')?.addEventListener('click', hideCategoryModal);
    document.getElementById('photosession-gallery-back-btn')?.addEventListener('click', hidePhotosessionGalleryModal);
}

function setupCreateStyleHandlers() {
    const styleExampleUpload = document.getElementById('style-example-upload');
    const styleExampleInput = document.getElementById('style-example-input');
    const yourPhotoUpload = document.getElementById('your-photo-upload');
    const yourPhotoInput = document.getElementById('your-photo-input');
    
    if (styleExampleUpload && styleExampleInput) {
        styleExampleUpload.addEventListener('click', () => styleExampleInput.click());
        styleExampleInput.addEventListener('change', (e) => {
            if (e.target.files[0]) {
                uploadedExample = e.target.files[0];
                styleExampleUpload.innerHTML = `
                    <span class="material-icons-round">check_circle</span>
                    <p>Пример загружен</p>
                `;
            }
        });
    }
    
    if (yourPhotoUpload && yourPhotoInput) {
        yourPhotoUpload.addEventListener('click', () => yourPhotoInput.click());
        yourPhotoInput.addEventListener('change', (e) => {
            if (e.target.files[0]) {
                uploadedFace = e.target.files[0];
                yourPhotoUpload.innerHTML = `
                    <span class="material-icons-round">check_circle</span>
                    <p>Фото загружено</p>
                `;
            }
        });
    }
}

function setupGenerateHandlers() {
    // Обработчики модели
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('model-btn')) {
            document.querySelectorAll('.model-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            selectedModel = e.target.dataset.model;
        }
        
        if (e.target.classList.contains('format-btn')) {
            document.querySelectorAll('.format-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            selectedFormat = e.target.dataset.format;
        }
    });
}

console.log('🍌 Nano Banana App готов! Версия 7.0 - Полный функционал');

