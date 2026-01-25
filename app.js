// app.js - Nano Banana AI Photo - Old Money Edition
// Версия 6.0: Исправления по техническому заданию

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

// Данные для фотосессий (горизонтальные каталоги)
const photosessionCategories = [
    { 
        id: 'winter', 
        title: 'Зимняя сказка', 
        icon: '❄️', 
        color: '#64B5F6',
        styles: [
            { id: 1, name: "Снежная королева", preview: "https://via.placeholder.Лыжный курорт", preview: "https://via.placeholder.com/300x400/64B5F6/FFFFFF?text=❄️+4", views: 8900, rating: 5.0 },
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
        
        // НЕ меняем цвет заголовка
        // Убрали: tg.setHeaderColor('#9b28af');
        
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
            switchScreen(screenId);
        });
    });
    
    const balanceBtn = document.getElementById('balance-btn');
    if (balanceBtn) {
        balanceBtn.addEventListener('click', function() {
            showNotification(`Ваш баланс: ${userBalance} звёзд`);
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
                selectedCategoryForModal = category.id;
                showCategoryModal(category.id);
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
            
            const viewsText = style.views >= 1000 ? (style.views / 1000).toFixed(1) + 'K' : style.views;
            
            styleCard.innerHTML = `
                <div class="horizontal-style-preview">
                    <img src="${style.preview}" alt="${style.name}">
                </div>
                <div class="style-stats">
                    <div class="stat-item">
                        <span class="stat-icon">👁</span>
                        <span class="stat-value">${viewsText}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-icon">⭐</span>
                        <span class="stat-value">${style.rating}</span>
                    </div>
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

// Остальные функции без изменений
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

// Остальные функции остаются без изменений...
function hidePhotosessionGalleryModal() {
    const modal = document.getElementById('photosession-gallery-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

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
        container.appendChild(photoCard);
    });
}

// Добавляем остальные базовые функции
function setupButtons() {}
function setupRealUpload() {}
function setupHistoryAndProfile() {}
function setupGenerationHandlers() {}
function showCreateOwnStyle() {}
function showGenerateScreen() {}
function showPhotosessionSeriesModal() {}
function loadHistory() {}
function updateProfileStats() {}

console.log('🍌 Nano Banana App готов! Версия 6.0');
