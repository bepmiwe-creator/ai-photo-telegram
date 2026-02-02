// app.js - Nano Banana AI Photo - Old Money Edition
// Версия 5.0 — готово к продакшену (config.js + api.js)

// ========== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ==========
var userBalance = 85;
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
        src: 'https://via.placeholder.com/300x300/E0F2FE/1E3A8A?text=Фото+1', 
        title: 'Зимняя сказка',
        date: '23.01.2026',
        type: 'photo'
    },
    { 
        id: 2, 
        src: 'https://via.placeholder.com/300x300/F8E1E7/B76E79?text=Фото+2', 
        title: 'Розовый закат',
        date: '22.01.2026',
        type: 'photo'
    },
    { 
        id: 3, 
        src: 'https://via.placeholder.com/300x300/FAF3E0/374151?text=Фото+3', 
        title: 'Элегантность',
        date: '21.01.2026',
        type: 'photo'
    },
    { 
        id: 4, 
        src: 'https://via.placeholder.com/300x300/E0F2FE/1E3A8A?text=Фото+4', 
        title: 'Городские огни',
        date: '20.01.2026',
        type: 'photosession'
    },
    { 
        id: 5, 
        src: 'https://via.placeholder.com/300x300/F8E1E7/B76E79?text=Фото+5', 
        title: 'Романтика',
        date: '19.01.2026',
        type: 'photo'
    },
    { 
        id: 6, 
        src: 'https://via.placeholder.com/300x300/FAF3E0/374151?text=Фото+6', 
        title: 'Минимализм',
        date: '18.01.2026',
        type: 'photo'
    },
    { 
        id: 7, 
        src: 'https://via.placeholder.com/300x300/E0F2FE/1E3A8A?text=Фото+7', 
        title: 'Природа',
        date: '17.01.2026',
        type: 'photosession'
    },
    { 
        id: 8, 
        src: 'https://via.placeholder.com/300x300/F8E1E7/B76E79?text=Фото+8', 
        title: 'Стиль',
        date: '16.01.2026',
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
            { id: 1, name: "Снежная королева", preview: "https://via.placeholder.com/300x300/64B5F6/FFFFFF?text=❄️+1", views: 17200, rating: 5.0 },
            { id: 2, name: "Зимний лес", preview: "https://via.placeholder.com/300x300/64B5F6/FFFFFF?text=❄️+2", views: 12300, rating: 5.0 },
            { id: 3, name: "Новогоднее настроение", preview: "https://via.placeholder.com/300x300/64B5F6/FFFFFF?text=❄️+3", views: 21500, rating: 5.0 },
            { id: 4, name: "Лыжный курорт", preview: "https://via.placeholder.com/300x300/64B5F6/FFFFFF?text=❄️+4", views: 8900, rating: 5.0 },
            { id: 5, name: "Морозные узоры", preview: "https://via.placeholder.com/300x300/64B5F6/FFFFFF?text=❄️+5", views: 14200, rating: 5.0 },
            { id: 6, name: "Рождественский вечер", preview: "https://via.placeholder.com/300x300/64B5F6/FFFFFF?text=❄️+6", views: 18700, rating: 5.0 },
            { id: 7, name: "Зимний город", preview: "https://via.placeholder.com/300x300/64B5F6/FFFFFF?text=❄️+7", views: 9500, rating: 5.0 },
            { id: 8, name: "Снеговик", preview: "https://via.placeholder.com/300x300/64B5F6/FFFFFF?text=❄️+8", views: 11200, rating: 5.0 }
        ]
    },
    { 
        id: 'wedding', 
        title: 'Свадебная', 
        icon: '💍', 
        color: '#EC407A',
        styles: [
            { id: 1, name: "Романтический закат", preview: "https://via.placeholder.com/300x300/EC407A/FFFFFF?text=💍+1", views: 24500, rating: 5.0 },
            { id: 2, name: "Церковная церемония", preview: "https://via.placeholder.com/300x300/EC407A/FFFFFF?text=💍+2", views: 18700, rating: 5.0 },
            { id: 3, name: "Праздничный банкет", preview: "https://via.placeholder.com/300x300/EC407A/FFFFFF?text=💍+3", views: 16200, rating: 5.0 }
        ]
    },
    { 
        id: 'beach', 
        title: 'Пляжный отдых', 
        icon: '🏖️', 
        color: '#FFB74D',
        styles: [
            { id: 1, name: "Закат на море", preview: "https://via.placeholder.com/300x300/FFB74D/FFFFFF?text=🏖️+1", views: 32500, rating: 5.0 },
            { id: 2, name: "Пальмовый рай", preview: "https://via.placeholder.com/300x300/FFB74D/FFFFFF?text=🏖️+2", views: 27800, rating: 5.0 }
        ]
    },
    { 
        id: 'luxury', 
        title: 'Роскошь Luxury', 
        icon: '💎', 
        color: '#FFD700',
        styles: [
            { id: 1, name: "Золотой шик", preview: "https://via.placeholder.com/300x300/FFD700/FFFFFF?text=💎+1", views: 43200, rating: 5.0 },
            { id: 2, name: "Алмазный блеск", preview: "https://via.placeholder.com/300x300/FFD700/FFFFFF?text=💎+2", views: 38900, rating: 5.0 },
            { id: 3, name: "Шикарный вечер", preview: "https://via.placeholder.com/300x300/FFD700/FFFFFF?text=💎+3", views: 41500, rating: 5.0 }
        ]
    }
];

// Примеры стилей для категорий
const styleExamples = {
    winter: [
        { id: 1, name: "Снежная королева", icon: "👑", color: "#4FC3F7", preview: "https://via.placeholder.com/200x200/64B5F6/FFFFFF?text=❄️" },
        { id: 2, name: "Зимний лес", icon: "🌲", color: "#81C784", preview: "https://via.placeholder.com/200x200/64B5F6/FFFFFF?text=🌲" },
        { id: 3, name: "Новогоднее настроение", icon: "🎄", color: "#FF8A65", preview: "https://via.placeholder.com/200x200/64B5F6/FFFFFF?text=🎄" },
        { id: 4, name: "Лыжный курорт", icon: "⛷️", color: "#64B5F6", preview: "https://via.placeholder.com/200x200/64B5F6/FFFFFF?text=⛷️" },
        { id: 5, name: "Морозные узоры", icon: "❄️", color: "#90CAF9", preview: "https://via.placeholder.com/200x200/64B5F6/FFFFFF?text=❄️" },
        { id: 6, name: "Рождественский вечер", icon: "🎅", color: "#E57373", preview: "https://via.placeholder.com/200x200/64B5F6/FFFFFF?text=🎅" }
    ],
    birthday: [
        { id: 1, name: "Торт и свечи", icon: "🎂", color: "#FFB74D", preview: "https://via.placeholder.com/200x200/FFB74D/FFFFFF?text=🎂" },
        { id: 2, name: "Праздничный вечер", icon: "🎉", color: "#BA68C8", preview: "https://via.placeholder.com/200x200/FFB74D/FFFFFF?text=🎉" },
        { id: 3, name: "Воздушные шары", icon: "🎈", color: "#4DD0E1", preview: "https://via.placeholder.com/200x200/FFB74D/FFFFFF?text=🎈" },
        { id: 4, name: "Подарки", icon: "🎁", color: "#AED581", preview: "https://via.placeholder.com/200x200/FFB74D/FFFFFF?text=🎁" }
    ],
    trends: [
        { id: 1, name: "Неоновый стиль", icon: "💡", color: "#9575CD", preview: "https://via.placeholder.com/200x200/FF5722/FFFFFF?text=💡" },
        { id: 2, name: "Ретро волна", icon: "📻", color: "#FF8A65", preview: "https://via.placeholder.com/200x200/FF5722/FFFFFF?text=📻" },
        { id: 3, name: "Футуризм", icon: "🚀", color: "#4DB6AC", preview: "https://via.placeholder.com/200x200/FF5722/FFFFFF?text=🚀" },
        { id: 4, name: "Минимализм", icon: "⬜", color: "#90A4AE", preview: "https://via.placeholder.com/200x200/FF5722/FFFFFF?text=⬜" }
    ],
    couples: [
        { id: 1, name: "Романтический вечер", icon: "💕", color: "#F06292", preview: "https://via.placeholder.com/200x200/EC407A/FFFFFF?text=💕" },
        { id: 2, name: "Прогулка в парке", icon: "🌳", color: "#81C784", preview: "https://via.placeholder.com/200x200/EC407A/FFFFFF?text=🌳" },
        { id: 3, name: "Пляжный закат", icon: "🌅", color: "#FFB74D", preview: "https://via.placeholder.com/200x200/EC407A/FFFFFF?text=🌅" }
    ],
    girls: [
        { id: 1, name: "Стиль принцессы", icon: "👸", color: "#CE93D8", preview: "https://via.placeholder.com/200x200/E91E63/FFFFFF?text=👸" },
        { id: 2, name: "Деловой образ", icon: "💼", color: "#80CBC4", preview: "https://via.placeholder.com/200x200/E91E63/FFFFFF?text=💼" },
        { id: 3, name: "Спортивный шик", icon: "👟", color: "#FFAB91", preview: "https://via.placeholder.com/200x200/E91E63/FFFFFF?text=👟" }
    ],
    men: [
        { id: 1, name: "Классический костюм", icon: "🤵", color: "#78909C", preview: "https://via.placeholder.com/200x200/42A5F5/FFFFFF?text=🤵" },
        { id: 2, name: "Спортивный стиль", icon: "🏃", color: "#42A5F5", preview: "https://via.placeholder.com/200x200/42A5F5/FFFFFF?text=🏃" },
        { id: 3, name: "Кэжуал образ", icon: "👕", color: "#26A69A", preview: "https://via.placeholder.com/200x200/42A5F5/FFFFFF?text=👕" }
    ],
    pets: [
        { id: 1, name: "Домашний любимец", icon: "🐶", color: "#FFD54F", preview: "https://via.placeholder.com/200x200/81C784/FFFFFF?text=🐶" },
        { id: 2, name: "Игривый момент", icon: "🎾", color: "#AED581", preview: "https://via.placeholder.com/200x200/81C784/FFFFFF?text=🎾" },
        { id: 3, name: "Портрет питомца", icon: "📷", color: "#80DEEA", preview: "https://via.placeholder.com/200x200/81C784/FFFFFF?text=📷" }
    ],
    professions: [
        { id: 1, name: "Врач", icon: "👨‍⚕️", color: "#EF5350", preview: "https://via.placeholder.com/200x200/78909C/FFFFFF?text=👨‍⚕️" },
        { id: 2, name: "Программист", icon: "💻", color: "#42A5F5", preview: "https://via.placeholder.com/200x200/78909C/FFFFFF?text=💻" },
        { id: 3, name: "Учитель", icon: "👩‍🏫", color: "#66BB6A", preview: "https://via.placeholder.com/200x200/78909C/FFFFFF?text=👩‍🏫" },
        { id: 4, name: "Повар", icon: "👨‍🍳", color: "#FFA726", preview: "https://via.placeholder.com/200x200/78909C/FFFFFF?text=👨‍🍳" }
    ],
    luxury: [
        { id: 1, name: "Золотой шик", icon: "💰", color: "#FFD700", preview: "https://via.placeholder.com/200x200/FFD700/FFFFFF?text=💰" },
        { id: 2, name: "Алмазный блеск", icon: "💎", color: "#B39DDB", preview: "https://via.placeholder.com/200x200/FFD700/FFFFFF?text=💎" },
        { id: 3, name: "Шикарный вечер", icon: "🍾", color: "#F8BBD0", preview: "https://via.placeholder.com/200x200/FFD700/FFFFFF?text=🍾" }
    ]
};

// ========== ЗАПУСК ПРИЛОЖЕНИЯ ==========
document.addEventListener('DOMContentLoaded', function() {
    initTelegram();
    setupNavigation();
    loadPhotoCategories();
    loadHorizontalCategories();
    loadPhotosessionHorizontalCategories();
    setupButtons();
    setupRealUpload();
    setupHistoryAndProfile();

    if (window.API && typeof API.getBalance === 'function' && !API.isMock()) {
        API.getBalance().then(function(balance) {
            userBalance = typeof balance === 'number' ? balance : 85;
            updateBalance();
        }).catch(function() {
            updateBalance();
        });
    } else {
        updateBalance();
    }

    if (window.API && typeof API.getMyPhotos === 'function' && !API.isMock()) {
        API.getMyPhotos().then(function(photos) {
            if (Array.isArray(photos) && photos.length) userGeneratedPhotos = photos;
            else userGeneratedPhotos = [...mockGeneratedPhotos];
            loadUserPhotos();
        }).catch(function() {
            userGeneratedPhotos = [...mockGeneratedPhotos];
            loadUserPhotos();
        });
    } else {
        userGeneratedPhotos = [...mockGeneratedPhotos];
        loadUserPhotos();
    }

    setupGenerationHandlers();

    setTimeout(function() {
        document.body.classList.add('loaded');
    }, 100);
});

// ========== TELEGRAM ==========
function initTelegram() {
    if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.expand();
        
        // Отключаем вертикальные свайпы для контента
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
        
        // Обработчик кнопки закрытия
        tg.onEvent('backButtonClicked', function() {
            if (document.getElementById('loading-screen').classList.contains('active')) {
                hideLoadingScreen();
                return;
            }
            
            const activeOverlay = document.querySelector('.overlay.show');
            if (activeOverlay) {
                if (activeOverlay.id === 'category-modal') hideCategoryModal();
                else if (activeOverlay.id === 'photosession-gallery-modal') hidePhotosessionGalleryModal();
                else if (activeOverlay.id === 'photosession-series-modal') hidePhotosessionSeriesModal();
                else if (activeOverlay.id === 'fullscreen-viewer') hideFullscreenViewer();
                else if (activeOverlay.id === 'photosession-modal') hidePhotosessionModal();
                else if (activeOverlay.id === 'how-it-works-overlay') hideHowItWorks();
                else if (activeOverlay.id === 'screen-generate') hideGenerateScreen();
                else if (activeOverlay.id === 'generation-result-modal') hideGenerationResult();
                else {
                    activeOverlay.classList.remove('show');
                    setTimeout(() => {
                        activeOverlay.style.display = 'none';
                    }, 300);
                }
                return;
            }
            
            const activeScreen = document.querySelector('.screen.active');
            if (activeScreen.id === 'screen-main') {
                tg.close();
            } else if (activeScreen.id === 'screen-create-own') {
                switchScreen('photo');
            } else if (activeScreen.id === 'screen-photosession-custom') {
                switchScreen('photosession');
            } else {
                switchScreen('main');
            }
        });
        
        tg.BackButton.show();
    }
}

// ========== НАВИГАЦИЯ ==========
function setupNavigation() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const quickCards = document.querySelectorAll('.quick-card');
    const screens = document.querySelectorAll('.screen');
    
    function switchScreen(screenId) {
        screens.forEach(screen => {
            screen.classList.remove('active');
        });
        
        hideGenerateScreen();
        hideHowItWorks();
        hidePhotosessionModal();
        hideCategoryModal();
        hidePhotosessionGalleryModal();
        hideFullscreenViewer();
        hideLoadingScreen();
        hideGenerationResult();
        
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
            
            // Обновляем заголовок в Telegram
            updateTelegramHeader(screenId);
        }
    }
    
    function updateTelegramHeader(screenId) {
        if (window.Telegram && window.Telegram.WebApp) {
            const titles = {
                'main': 'Nano Banana AI',
                'photo': 'Фото',
                'photosession': 'Фотосессии',
                'video': 'Видео',
                'history': 'История',
                'profile': 'Профиль',
                'create-own': 'Создать стиль',
                'photosession-custom': 'Своя фотосессия'
            };
            
            if (titles[screenId]) {
                window.Telegram.WebApp.setHeaderColor('#9C27B0');
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
            showNotification(`Ваш баланс: ${userBalance} звёзд\nДля пополнения откройте приложение в Telegram боте.`);
        });
    }
    
    window.switchScreen = switchScreen;
}

// ========== РАЗДЕЛ "ФОТО" ==========
function loadPhotoCategories() {
    const container = document.getElementById('categories-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Сначала показываем горизонтальные блоки
    const horizontalContainer = document.createElement('div');
    horizontalContainer.className = 'horizontal-cards-container';
    horizontalContainer.innerHTML = `
        <div class="prompt-card" id="prompt-generate-btn">
            <div class="prompt-icon">✍️</div>
            <div class="prompt-text">
                <div class="prompt-title">Генерация по описанию</div>
                <div class="prompt-desc">Опишите картинку словами, ИИ создаст её</div>
            </div>
            <div class="prompt-arrow">
                <span class="material-icons-round">arrow_forward</span>
            </div>
        </div>
        <div class="create-own-card" data-category-id="create">
            <div class="category-icon" style="background-color: #9C27B020; color: #9C27B0;">🆕</div>
            <div class="category-title">Создать свой</div>
            <div class="category-count">Ваш стиль</div>
        </div>
    `;
    
    container.appendChild(horizontalContainer);
    
    // Потом добавляем ГОРИЗОНТАЛЬНЫЕ КАТАЛОГИ (убрали обычные категории)
    const horizontalCategories = document.createElement('div');
    horizontalCategories.className = 'horizontal-categories';
    horizontalCategories.id = 'horizontal-categories-main';
    
    container.appendChild(horizontalCategories);
    
    // Загружаем горизонтальные категории
    loadHorizontalCategories();
    
    // Настройка кнопки генерации по промпту
    const promptBtn = document.getElementById('prompt-generate-btn');
    if (promptBtn) {
        promptBtn.addEventListener('click', function() {
            currentCategory = 'prompt';
            selectedStyle = null;
            showGenerateScreen();
        });
    }
    
    // Настройка кнопки "Создать свой"
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

// ========== ГОРИЗОНТАЛЬНЫЕ КАТАЛОГИ СТИЛЕЙ (страница ФОТО) ==========
function loadHorizontalCategories() {
    const container = document.getElementById('horizontal-categories-main') || 
                     document.getElementById('horizontal-categories');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Показываем только основные категории (кроме "Создать свой")
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
        
        // Добавляем кнопку "Все стили" в конец горизонтального списка
        if (styles.length > 5) {
            const allStylesCard = document.createElement('div');
            allStylesCard.className = 'horizontal-style-card all-styles-card';
            allStylesCard.dataset.category = category.id;
            
            allStylesCard.innerHTML = `
                <div class="all-styles-icon">
                    <span class="material-icons-round">more_horiz</span>
                </div>
                <div class="all-styles-text">
                    <div>Все</div>
                    <div class="all-styles-count">${stylesCount} ${styleWord}</div>
                </div>
            `;
            
            allStylesCard.addEventListener('click', () => {
                selectedCategoryForModal = category.id;
                showCategoryModal(category.id);
            });
            
            scrollContainer.appendChild(allStylesCard);
        }
        
        section.appendChild(header);
        section.appendChild(scrollContainer);
        container.appendChild(section);
        
        // Нажатие на заголовок категории
        const titleElement = header.querySelector('.horizontal-category-title');
        titleElement.addEventListener('click', () => {
            selectedCategoryForModal = category.id;
            showCategoryModal(category.id);
        });
        
        // Нажатие на кнопку "Все стили"
        const viewAllBtn = header.querySelector('.view-all-btn');
        viewAllBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            selectedCategoryForModal = category.id;
            showCategoryModal(category.id);
        });
    });
}

// ========== ГОРИЗОНТАЛЬНЫЕ КАТАЛОГИ ФОТОСЕССИЙ ==========
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
        scrollContainer.id = `photosession-scroll-${category.id}`;
        
        const displayStyles = category.styles.slice(0, 5);
        
        displayStyles.forEach(style => {
            const styleCard = document.createElement('div');
            styleCard.className = 'horizontal-style-card';
            styleCard.dataset.category = category.id;
            styleCard.dataset.styleId = style.id;
            
            const viewsText = style.views >= 1000 ? (style.views / 1000).toFixed(1) + 'K' : style.views;
            
            styleCard.innerHTML = `
                <div class="horizontal-style-preview">
                    <img src="${style.preview}" alt="${style.name}">
                    <div class="style-stats-overlay">
                        <div class="stat-item">
                            <span class="stat-icon">👁️</span>
                            <span class="stat-value">${viewsText}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-icon">⭐</span>
                            <span class="stat-value">${style.rating}</span>
                        </div>
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
        
        // Добавляем кнопку "Все стили" в конец горизонтального списка
        if (category.styles.length > 5) {
            const allStylesCard = document.createElement('div');
            allStylesCard.className = 'horizontal-style-card all-styles-card';
            allStylesCard.dataset.category = category.id;
            
            allStylesCard.innerHTML = `
                <div class="all-styles-icon">
                    <span class="material-icons-round">more_horiz</span>
                </div>
                <div class="all-styles-text">
                    <div>Все</div>
                    <div class="all-styles-count">${stylesCount} ${styleWord}</div>
                </div>
            `;
            
            allStylesCard.addEventListener('click', () => {
                currentPhotosessionCategory = category;
                showPhotosessionGalleryModal(category.id);
            });
            
            scrollContainer.appendChild(allStylesCard);
        }
        
        section.appendChild(header);
        section.appendChild(scrollContainer);
        container.appendChild(section);
        
        // Нажатие на заголовок категории
        const titleElement = header.querySelector('.horizontal-category-title');
        titleElement.addEventListener('click', () => {
            currentPhotosessionCategory = category;
            showPhotosessionGalleryModal(category.id);
        });
        
        // Нажатие на кнопку "Все стили"
        const viewAllBtn = header.querySelector('.view-all-btn');
        viewAllBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentPhotosessionCategory = category;
            showPhotosessionGalleryModal(category.id);
        });
    });
}

// ========== МОДАЛЬНОЕ ОКНО КАТЕГОРИИ (страница ФОТО) ==========
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
            styleCard.style.borderColor = style.color + '50';
            styleCard.style.backgroundColor = style.color + '15';
            
            styleCard.innerHTML = `
                <div class="modal-style-icon" style="background-color: ${style.color}30; color: ${style.color};">${style.icon}</div>
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
            selectedCategoryForModal = null;
        }, 300);
    }
}

// ========== МОДАЛЬНОЕ ОКНО ГАЛЕРЕИ ФОТОСЕССИЙ ==========
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
            styleCard.dataset.category = category.id;
            styleCard.dataset.styleId = style.id;
            
            styleCard.innerHTML = `
                <div class="photosession-gallery-preview">
                    <img src="${style.preview}" alt="${style.name}">
                    <div class="photosession-gallery-stats">
                        <div class="gallery-stat-item">
                            <span class="stat-icon">👁️</span>
                            <span class="stat-value">${viewsText}</span>
                        </div>
                        <div class="gallery-stat-item">
                            <span class="stat-icon">⭐</span>
                            <span class="stat-value">${style.rating}</span>
                        </div>
                    </div>
                </div>
                <div class="photosession-gallery-name">${style.name}</div>
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
            currentPhotosessionCategory = null;
        }, 300);
    }
}

// ========== МОДАЛЬНОЕ ОКНО СЕРИИ ФОТОСЕССИИ ==========
function showPhotosessionSeriesModal(category, style) {
    const modal = document.getElementById('photosession-series-modal');
    if (!modal) return;
    
    const titleElement = document.getElementById('photosession-series-title');
    if (titleElement) {
        titleElement.textContent = style.name;
    }
    
    const container = document.getElementById('photosession-series-container');
    if (container) {
        container.innerHTML = '';
        
        // Создаем 10 тестовых изображений для серии
        for (let i = 1; i <= 10; i++) {
            const seriesCard = document.createElement('div');
            seriesCard.className = 'photosession-series-card';
            seriesCard.dataset.index = i;
            
            seriesCard.innerHTML = `
                <div class="photosession-series-preview">
                    <img src="https://via.placeholder.com/300x300/${category.color.substring(1)}/FFFFFF?text=${category.icon}+${i}" alt="${style.name} ${i}">
                </div>
                <div class="photosession-series-number">${i}</div>
            `;
            
            seriesCard.addEventListener('click', () => {
                currentGalleryImages = [];
                for (let j = 1; j <= 10; j++) {
                    currentGalleryImages.push({
                        src: `https://via.placeholder.com/800x800/${category.color.substring(1)}/FFFFFF?text=${category.icon}+${j}`,
                        alt: `${style.name} ${j}`
                    });
                }
                currentGalleryIndex = i - 1;
                showFullscreenViewer();
            });
            
            container.appendChild(seriesCard);
        }
    }
    
    // Обновляем кнопку генерации
    const generateBtn = document.getElementById('photosession-series-generate-btn');
    const btnText = document.getElementById('photosession-series-btn-text');
    
    if (userBalance >= 159) {
        if (btnText) btnText.textContent = `Сгенерировать фотосессию за 159 звёзд`;
        if (generateBtn) generateBtn.onclick = function() {
            startPhotosessionGeneration(style.name, 159, style);
        };
    } else {
        if (btnText) btnText.textContent = `Пополнить баланс`;
        if (generateBtn) generateBtn.onclick = function() {
            showInsufficientBalancePopup(159);
        };
    }
    
    const balanceElement = document.getElementById('photosession-series-balance');
    if (balanceElement) {
        balanceElement.textContent = userBalance;
    }
    
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('show'), 10);
}

function hidePhotosessionSeriesModal() {
    const modal = document.getElementById('photosession-series-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

// ========== ПОЛНОЭКРАННЫЙ ПРОСМОТР ==========
function showFullscreenViewer() {
    const modal = document.getElementById('fullscreen-viewer');
    if (!modal) return;
    
    updateFullscreenImage();
    
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('show'), 10);
    
    // Запускаем таймер для скрытия элементов управления
    resetInactivityTimer();
}

function hideFullscreenViewer() {
    const modal = document.getElementById('fullscreen-viewer');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
            currentGalleryIndex = 0;
            currentGalleryImages = [];
            clearTimeout(inactivityTimer);
        }, 300);
    }
}

function updateFullscreenImage() {
    const imageElement = document.getElementById('fullscreen-image');
    const counterElement = document.getElementById('fullscreen-counter');
    const controls = document.getElementById('fullscreen-controls');
    
    if (imageElement && currentGalleryImages[currentGalleryIndex]) {
        imageElement.src = currentGalleryImages[currentGalleryIndex].src;
        imageElement.alt = currentGalleryImages[currentGalleryIndex].alt;
    }
    
    if (counterElement) {
        counterElement.textContent = `${currentGalleryIndex + 1}/${currentGalleryImages.length}`;
    }
    
    // Показываем элементы управления
    if (controls) {
        controls.style.opacity = '1';
        controls.style.visibility = 'visible';
    }
    
    // Сбрасываем таймер неактивности
    resetInactivityTimer();
}

function nextImage() {
    if (currentGalleryIndex < currentGalleryImages.length - 1) {
        currentGalleryIndex++;
        updateFullscreenImage();
    }
}

function prevImage() {
    if (currentGalleryIndex > 0) {
        currentGalleryIndex--;
        updateFullscreenImage();
    }
}

function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(hideFullscreenControls, 3000);
}

function hideFullscreenControls() {
    var controls = document.getElementById('fullscreen-controls');
    if (controls) {
        controls.style.opacity = '0';
        controls.style.visibility = 'hidden';
    }
}

function showFullscreenControls() {
    var controls = document.getElementById('fullscreen-controls');
    if (controls) {
        controls.style.opacity = '1';
        controls.style.visibility = 'visible';
    }
    resetInactivityTimer();
}

// ========== СОЗДАТЬ СВОЙ СТИЛЬ ==========
function showCreateOwnStyle() {
    const createScreen = document.getElementById('screen-create-own');
    if (!createScreen) return;
    
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    createScreen.classList.add('active');
    
    uploadedExample = null;
    uploadedFace = null;
    updateCreateOwnUploads();
    checkCreateOwnButton();
    
    const howItWorksBtn = document.getElementById('how-it-works-btn');
    if (howItWorksBtn) {
        howItWorksBtn.onclick = showHowItWorks;
    }
}

function updateCreateOwnUploads() {
    const exampleContainer = document.getElementById('example-container');
    const faceContainer = document.getElementById('face-container');
    
    if (exampleContainer) {
        exampleContainer.innerHTML = uploadedExample ? 
            `<div class="uploaded-photo">
                <img src="${uploadedExample.preview}" alt="Пример">
                <button class="remove-photo" onclick="removeExample()">×</button>
            </div>` :
            `<div class="upload-placeholder" onclick="uploadExample()">
                <span class="material-icons-round">add_photo_alternate</span>
                <span class="upload-label">Фото пример</span>
                <span class="upload-subtitle">Пример из интернета</span>
            </div>`;
    }
    
    if (faceContainer) {
        faceContainer.innerHTML = uploadedFace ? 
            `<div class="uploaded-photo">
                <img src="${uploadedFace.preview}" alt="Ваше фото">
                <button class="remove-photo" onclick="removeFace()">×</button>
            </div>` :
            `<div class="upload-placeholder" onclick="uploadFace()">
                <span class="material-icons-round">person_add</span>
                <span class="upload-label">Ваше фото</span>
                <span class="upload-subtitle">Ваше лицо</span>
            </div>`;
    }
}

function uploadExample() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => handleCreateOwnUpload(e, 'example');
    input.click();
}

function uploadFace() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => handleCreateOwnUpload(e, 'face');
    input.click();
}

function handleCreateOwnUpload(event, type) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        showNotification('Пожалуйста, загружайте только изображения');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
        showNotification('Фото слишком большое (макс. 5MB)');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const imageData = {
            preview: e.target.result,
            file: file,
            name: file.name
        };
        
        if (type === 'example') {
            uploadedExample = imageData;
        } else {
            uploadedFace = imageData;
        }
        
        updateCreateOwnUploads();
        checkCreateOwnButton();
        showNotification(`${type === 'example' ? 'Пример' : 'Лицо'} загружено`);
    };
    reader.readAsDataURL(file);
}

function removeExample() {
    uploadedExample = null;
    updateCreateOwnUploads();
    checkCreateOwnButton();
}

function removeFace() {
    uploadedFace = null;
    updateCreateOwnUploads();
    checkCreateOwnButton();
}

function checkCreateOwnButton() {
    const generateBtn = document.getElementById('create-own-generate-btn');
    const btnText = document.getElementById('create-own-btn-text');
    
    if (!generateBtn || !btnText) return;
    
    const hasBothPhotos = uploadedExample && uploadedFace;
    
    generateBtn.disabled = !hasBothPhotos;
    btnText.textContent = hasBothPhotos ? 'Сгенерировать за 10 звёзд' : 'Загрузите оба фото';
    
    const icon = generateBtn.querySelector('.generate-icon');
    if (icon) {
        icon.textContent = hasBothPhotos ? '✨' : '📷';
    }
}

function startCreateOwnGeneration() {
    if (!uploadedExample || !uploadedFace) {
        showNotification('Загрузите оба фото для генерации');
        return;
    }
    
    if (10 > userBalance) {
        showNotification(`Недостаточно звёзд! Нужно: 10, у вас: ${userBalance}`);
        return;
    }
    
    showLoadingScreen('create-own', {
        title: 'Создание своего стиля',
        example: uploadedExample,
        face: uploadedFace,
        price: 10
    });
}

// ========== ЭКРАН ЗАГРУЗКИ ==========
function showLoadingScreen(type, data) {
    currentGenerationType = type;
    currentGenerationData = data;

    var loadingScreen = document.getElementById('loading-screen');
    if (!loadingScreen) return;

    loadingScreen.classList.add('active');
    loadingScreen.style.display = 'flex';

    var title = document.getElementById('loading-title');
    if (title) {
        title.textContent = type === 'photosession' ? 'Идет создание фотосессии' : 
                          type === 'create-own' ? 'Идет создание своего стиля' : 
                          'Идет генерация фото';
    }

    if (window.API && typeof API.startGeneration === 'function' && !API.isMock()) {
        var payload = {
            type: type,
            price: data.price,
            category: data.category,
            style: data.style,
            model: data.model,
            format: data.format,
            frames: data.frames,
            title: data.title
        };
        if (data.images && data.images.length) payload.images = data.images.map(function(img) { return img.preview || img; });
        if (data.example && data.example.preview) payload.exampleImage = data.example.preview;
        if (data.face && data.face.preview) payload.faceImage = data.face.preview;
        if (type === 'prompt' && data.prompt) payload.prompt = data.prompt;

        API.startGeneration(type, payload).then(function(result) {
            hideLoadingScreen();
            showGenerationResult(type, Object.assign({}, data, { resultImageUrl: result.imageUrl, taskId: result.taskId }));
        }).catch(function(err) {
            hideLoadingScreen();
            showNotification(err && err.message ? err.message : 'Ошибка генерации. Попробуйте позже.');
        });
    } else {
        setTimeout(function() {
            hideLoadingScreen();
            showGenerationResult(type, data);
        }, 3000);
    }
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.classList.remove('active');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 300);
    }
}

// ========== ЭКРАН РЕЗУЛЬТАТА ГЕНЕРАЦИИ ==========
function showGenerationResult(type, data) {
    const modal = document.getElementById('generation-result-modal');
    if (!modal) return;
    
    const title = document.getElementById('result-title');
    const image = document.getElementById('result-image');
    const downloadBtn = document.getElementById('result-download-btn');
    
    if (title) {
        title.textContent = type === 'photosession' ? 'Фотосессия создана!' : 
                           type === 'create-own' ? 'Стиль создан!' : 
                           'Генерация завершена!';
    }
    
    if (image) {
        if (data.resultImageUrl) {
            image.src = data.resultImageUrl;
        } else {
            var randomNum = Math.floor(Math.random() * 1000);
            var colors = ['E0F2FE', 'F8E1E7', 'FAF3E0', 'E0F7FA', 'F3E5F5'];
            var randomColor = colors[Math.floor(Math.random() * colors.length)];
            image.src = 'https://via.placeholder.com/400x400/' + randomColor + '/1E3A8A?text=Результат+' + randomNum;
        }
        image.alt = 'Сгенерированное изображение';
    }

    if (downloadBtn) {
        downloadBtn.onclick = function() {
            downloadResultImage(image.src, type === 'photosession' ? 'фотосессия' : 'изображение', data.taskId);
        };
    }
    
    addToHistoryGenerated(type, data);
    if (window.API && typeof API.getBalance === 'function' && !API.isMock()) {
        API.getBalance().then(function(balance) {
            if (typeof balance === 'number') { userBalance = balance; updateBalance(); }
        }).catch(function() {});
    }
    showNotification('✅ Результат готов! Доступен в истории.');
    modal.style.display = 'flex';
    setTimeout(function() { modal.classList.add('show'); }, 10);
}

function hideGenerationResult() {
    const modal = document.getElementById('generation-result-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
            currentGenerationType = null;
            currentGenerationData = null;
        }, 300);
    }
}

function downloadResultImage(imageUrl, type, taskId) {
    if (window.API && typeof API.sendToChat === 'function' && !API.isMock() && taskId) {
        API.sendToChat(taskId, type).then(function() {
            showNotification('✅ ' + (type.charAt(0).toUpperCase() + type.slice(1)) + ' отправлено в чат бота!');
        }).catch(function() {
            showNotification('✅ Скачивание: файл будет в чате бота.');
        });
    } else {
        showNotification('✅ ' + (type.charAt(0).toUpperCase() + type.slice(1)) + ' отправлено в чат бота!');
    }
    setTimeout(function() {
        hideGenerationResult();
        switchScreen('history');
    }, 1000);
}

// ========== ФОТОСЕССИИ ==========
function loadUserPhotos() {
    const container = document.getElementById('user-photos-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (userGeneratedPhotos.length === 0) {
        container.innerHTML = `
            <div class="empty-photos">
                <div class="empty-icon">📸</div>
                <h3>У вас ещё нет сгенерированных фото</h3>
                <p>Создайте первое фото, чтобы начать фотосессию</p>
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
                ${photo.type === 'photosession' ? '<div class="photo-badge">📸 Фотосессия</div>' : ''}
            </div>
            ${photo.type === 'photo' ? '<button class="photosession-from-photo-btn" data-photo-id="${photo.id}"><span class="material-icons-round">camera</span> Фотосессия</button>' : ''}
        `;
        
        photoCard.addEventListener('click', () => {
            selectedPhotoForSession = photo;
            showPhotosessionModal();
        });
        
        // Кнопка "Фотосессия"
        const sessionBtn = photoCard.querySelector('.photosession-from-photo-btn');
        if (sessionBtn) {
            sessionBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                selectedPhotoForSession = photo;
                showPhotosessionModal();
            });
        }
        
        container.appendChild(photoCard);
    });
}

function showPhotosessionModal() {
    if (!selectedPhotoForSession) return;
    
    const modal = document.getElementById('photosession-modal');
    if (!modal) return;
    
    const imgElement = document.getElementById('selected-photo-img');
    if (imgElement) {
        imgElement.src = selectedPhotoForSession.src;
        imgElement.alt = selectedPhotoForSession.title;
    }
    
    updatePhotosessionCount();
    
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('show'), 10);
}

function hidePhotosessionModal() {
    const modal = document.getElementById('photosession-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
            selectedPhotoForSession = null;
        }, 300);
    }
}

function updatePhotosessionCount() {
    const countElement = document.getElementById('photosession-count');
    const totalElement = document.getElementById('photosession-total');
    const priceElement = document.getElementById('photosession-price');
    const resultCountElement = document.getElementById('result-photo-count');
    
    if (countElement) countElement.textContent = photosessionFrames;
    
    const basePrice = 159;
    const extraFrames = Math.max(0, photosessionFrames - 10);
    const totalPrice = basePrice + (extraFrames * 15);
    
    if (priceElement) priceElement.textContent = totalPrice;
    
    const totalPhotos = photosessionFrames + 3;
    if (totalElement) totalElement.textContent = totalPhotos;
    if (resultCountElement) resultCountElement.textContent = totalPhotos;
}

function decreasePhotosessionFrames() {
    if (photosessionFrames > 10) {
        photosessionFrames--;
        updatePhotosessionCount();
    }
}

function increasePhotosessionFrames() {
    if (photosessionFrames < 20) {
        photosessionFrames++;
        updatePhotosessionCount();
    }
}

function startPhotosessionGeneration(title, price, styleData) {
    if (price > userBalance) {
        showInsufficientBalancePopup(price);
        return;
    }
    
    showLoadingScreen('photosession', {
        title: title,
        style: styleData,
        frames: photosessionFrames,
        price: price
    });
}

function showInsufficientBalancePopup(requiredAmount) {
    const missingAmount = requiredAmount - userBalance;
    
    if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.showPopup({
            title: 'Недостаточно звёзд',
            message: `Telegram баланс: ${userBalance}\nНе хватает: ${missingAmount} звёзд\n\nПополнить баланс в боте?`,
            buttons: [
                { id: 'exit', type: 'default', text: 'Выход' },
                { id: 'ok', type: 'ok', text: 'ОК' }
            ]
        }, function(buttonId) {
            if (buttonId === 'ok') {
                var botLink = (window.API && API.getBotLink) ? API.getBotLink() : 'https://t.me/NeuroFlashStudio_bot';
                tg.openTelegramLink(botLink);
            }
        });
    } else {
        showNotification(`Недостаточно звёзд! Нужно: ${requiredAmount}, у вас: ${userBalance}`);
    }
}

// ========== КАК ЭТО РАБОТАЕТ ==========
function showHowItWorks() {
    const overlay = document.getElementById('how-it-works-overlay');
    if (overlay) {
        overlay.style.display = 'flex';
        setTimeout(() => overlay.classList.add('show'), 10);
    }
}

function hideHowItWorks() {
    const overlay = document.getElementById('how-it-works-overlay');
    if (overlay) {
        overlay.classList.remove('show');
        setTimeout(() => overlay.style.display = 'none', 300);
    }
}

// ========== ЭКРАН ГЕНЕРАЦИИ ==========
function showGenerateScreen() {
    const generateScreen = document.getElementById('screen-generate');
    if (!generateScreen) return;
    
    generateScreen.style.display = 'flex';
    setTimeout(() => generateScreen.classList.add('show'), 10);
    
    const titleElement = document.getElementById('generate-title');
    const typeBadge = document.getElementById('type-badge');
    
    if (currentCategory === 'prompt') {
        if (titleElement) titleElement.textContent = 'Генерация по описанию';
        if (typeBadge) typeBadge.textContent = '✨ По описанию';
        document.getElementById('prompt-section').style.display = 'block';
    } else {
        const category = categories.find(c => c.id === currentCategory);
        if (titleElement) titleElement.textContent = `Генерация: ${category?.title || 'Фото'}`;
        if (typeBadge) {
            typeBadge.textContent = selectedStyle ? `📷 ${selectedStyle}` : `📷 ${category?.title || 'Из фото'}`;
        }
        document.getElementById('prompt-section').style.display = 'none';
    }
    
    setupFormatSelect();
    updateTotalPrice();
    
    if (currentCategory === 'prompt') {
        setupPromptField();
    }
    
    checkGenerateButton();
    updateUploadGrid();
    
    const backBtn = document.getElementById('generate-back-btn');
    if (backBtn) {
        backBtn.onclick = hideGenerateScreen;
    }
}

function hideGenerateScreen() {
    const generateScreen = document.getElementById('screen-generate');
    if (generateScreen) {
        generateScreen.classList.remove('show');
        setTimeout(() => {
            generateScreen.style.display = 'none';
            
            uploadedImages = [];
            updateUploadGrid();
            
            document.querySelectorAll('.model-card').forEach(card => {
                card.classList.remove('selected');
            });
            const nanoModel = document.querySelector('.model-card[data-model="nano"]');
            if (nanoModel) {
                nanoModel.classList.add('selected');
            }
            selectedModel = 'nano';
            
            const formatSelect = document.getElementById('format-select');
            if (formatSelect) {
                formatSelect.value = '1:1';
                selectedFormat = '1:1';
            }
            
            const promptField = document.getElementById('ai-prompt');
            if (promptField) {
                promptField.value = '';
            }
            
            const charCount = document.getElementById('char-count');
            if (charCount) {
                charCount.textContent = '0';
                charCount.style.color = '#777';
            }
            
            selectedStyle = null;
        }, 300);
    }
}

function setupPromptField() {
    const promptTextarea = document.getElementById('ai-prompt');
    const charCount = document.getElementById('char-count');
    const exampleChips = document.querySelectorAll('.example-chip');
    
    if (promptTextarea && charCount) {
        promptTextarea.addEventListener('input', function() {
            const count = this.value.length;
            charCount.textContent = count;
            
            if (count > 1800) {
                charCount.style.color = '#ff5722';
            } else if (count > 1500) {
                charCount.style.color = '#ff9800';
            } else {
                charCount.style.color = '#777';
            }
            
            checkGenerateButton();
        });
        
        exampleChips.forEach(chip => {
            chip.addEventListener('click', function() {
                const example = this.dataset.example;
                promptTextarea.value = example;
                promptTextarea.dispatchEvent(new Event('input'));
                promptTextarea.focus();
            });
        });
        
        if (currentCategory === 'prompt') {
            setTimeout(() => {
                promptTextarea.focus();
            }, 300);
        }
    }
}

function checkGenerateButton() {
    const generateBtn = document.getElementById('start-generate-btn');
    const btnText = document.getElementById('generate-btn-text');
    const hintText = document.getElementById('generate-hint');
    
    if (!generateBtn || !btnText || !hintText) return;
    
    const prompt = document.getElementById('ai-prompt')?.value.trim() || '';
    const hasPrompt = prompt.length > 0;
    const hasPhotos = uploadedImages.length > 0;
    
    let isEnabled = false;
    let text = 'Введите промпт';
    let hint = 'Заполните поле "Опишите изображение" для генерации';
    
    if (currentCategory === 'prompt') {
        isEnabled = hasPrompt || hasPhotos;
        text = hasPrompt ? `Сгенерировать за ${calculatePrice()} звёзд` : 'Введите промпт';
        hint = hasPrompt ? 'Готово к генерации!' : 
               hasPhotos ? 'Готово к генерации по фото!' : 
               'Заполните поле "Опишите изображение" для генерации';
    } else {
        isEnabled = hasPhotos;
        text = hasPhotos ? `Сгенерировать за ${calculatePrice()} звёзд` : 'Загрузите фото';
        hint = hasPhotos ? 'Готово к генерации!' : 'Загрузите хотя бы одно фото';
    }
    
    generateBtn.disabled = !isEnabled;
    btnText.textContent = text;
    hintText.textContent = hint;
    hintText.style.color = isEnabled ? '#4CAF50' : '#ff9800';
    
    const icon = generateBtn.querySelector('.generate-icon');
    if (icon) {
        icon.textContent = isEnabled ? '✨' : '📝';
    }
}

function setupFormatSelect() {
    const formatSelect = document.getElementById('format-select');
    
    if (!formatSelect) return;
    
    formatSelect.value = selectedFormat;
    
    formatSelect.addEventListener('change', function() {
        selectedFormat = this.value;
        updateTotalPrice();
    });
}

// ========== НАСТРОЙКА ОБРАБОТЧИКОВ ГЕНЕРАЦИИ ==========
function setupGenerationHandlers() {
    // Генерация по описанию/фото
    const generateBtn = document.getElementById('start-generate-btn');
    if (generateBtn) {
        generateBtn.addEventListener('click', startGeneration);
    }
    
    // Создать свой стиль
    const createOwnBtn = document.getElementById('create-own-generate-btn');
    if (createOwnBtn) {
        createOwnBtn.addEventListener('click', startCreateOwnGeneration);
    }
    
    // Фотосессия из модального окна
    const photosessionBtn = document.getElementById('start-photosession-btn');
    if (photosessionBtn) {
        photosessionBtn.addEventListener('click', function() {
            startPhotosessionGeneration(
                selectedPhotoForSession?.title || 'Фотосессия',
                parseInt(document.getElementById('photosession-price').textContent),
                { name: 'Кастомная фотосессия' }
            );
        });
    }
}

// ========== КНОПКИ ==========
function setupButtons() {
    document.querySelectorAll('.model-card').forEach(card => {
        card.addEventListener('click', function() {
            document.querySelectorAll('.model-card').forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            selectedModel = this.dataset.model;
            updateTotalPrice();
        });
    });
    
    const createOwnBackBtn = document.getElementById('create-own-back-btn');
    if (createOwnBackBtn) {
        createOwnBackBtn.addEventListener('click', () => {
            switchScreen('photo');
        });
    }
    
    const categoryModalCloseBtn = document.getElementById('category-modal-close');
    if (categoryModalCloseBtn) {
        categoryModalCloseBtn.addEventListener('click', hideCategoryModal);
    }
    
    const photosessionBackBtn = document.getElementById('photosession-back-btn');
    if (photosessionBackBtn) {
        photosessionBackBtn.addEventListener('click', () => {
            switchScreen('photosession');
        });
    }
    
    const photosessionGalleryBackBtn = document.getElementById('photosession-gallery-back-btn');
    if (photosessionGalleryBackBtn) {
        photosessionGalleryBackBtn.onclick = hidePhotosessionGalleryModal;
    }
    
    const photosessionSeriesBackBtn = document.getElementById('photosession-series-back-btn');
    if (photosessionSeriesBackBtn) {
        photosessionSeriesBackBtn.onclick = hidePhotosessionSeriesModal;
    }
    
    const fullscreenCloseBtn = document.getElementById('fullscreen-close-btn');
    if (fullscreenCloseBtn) {
        fullscreenCloseBtn.onclick = hideFullscreenViewer;
    }
    
    const fullscreenPrevBtn = document.getElementById('fullscreen-prev-btn');
    if (fullscreenPrevBtn) {
        fullscreenPrevBtn.onclick = prevImage;
    }
    
    const fullscreenNextBtn = document.getElementById('fullscreen-next-btn');
    if (fullscreenNextBtn) {
        fullscreenNextBtn.onclick = nextImage;
    }

    var fullscreenViewer = document.getElementById('fullscreen-viewer');
    if (fullscreenViewer) {
        fullscreenViewer.addEventListener('click', function() {
            if (fullscreenViewer.style.display === 'flex') {
                showFullscreenControls();
            }
        });
    }

    const photosessionBtns = document.querySelectorAll('.photosession-btn:not([data-pack="custom"])');
    photosessionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const pack = this.dataset.pack;
            showNotification(`Выбран пакет: ${pack}. Функция скоро будет доступна!`);
        });
    });
    
    const customSessionBtn = document.querySelector('.photosession-btn[data-pack="custom"]');
    if (customSessionBtn) {
        customSessionBtn.addEventListener('click', function() {
            showCustomPhotosession();
        });
    }
    
    const videoBtns = document.querySelectorAll('.video-btn');
    videoBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const type = this.dataset.videoType;
            showNotification(`Выбран тип видео: ${type}. Функция скоро будет доступна!`);
        });
    });
    
    // Кнопка закрытия результата генерации
    const resultCloseBtn = document.getElementById('result-close-btn');
    if (resultCloseBtn) {
        resultCloseBtn.onclick = hideGenerationResult;
    }
    
    // Кнопка закрытия экрана загрузки
    const loadingCloseBtn = document.getElementById('loading-close-btn');
    if (loadingCloseBtn) {
        loadingCloseBtn.onclick = hideLoadingScreen;
    }
}

// ========== ЗАГРУЗКА ФОТО ==========
function setupRealUpload() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.multiple = true;
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);
    
    fileInput.addEventListener('change', function(e) {
        const files = e.target.files;
        if (files.length > 0) {
            handleFileUpload(files);
        }
        fileInput.value = '';
    });
    
    const uploadBtn = document.getElementById('upload-add-btn');
    if (uploadBtn) {
        uploadBtn.addEventListener('click', function() {
            fileInput.click();
        });
    }
}

function handleFileUpload(files) {
    const maxFiles = 5;
    const remaining = maxFiles - uploadedImages.length;
    
    if (files.length > remaining) {
        showNotification(`Можно загрузить не более ${maxFiles} фото. Осталось мест: ${remaining}`);
        return;
    }
    
    for (let i = 0; i < Math.min(files.length, remaining); i++) {
        const file = files[i];
        
        if (!file.type.startsWith('image/')) {
            showNotification('Пожалуйста, загружайте только изображения');
            continue;
        }
        
        if (file.size > 5 * 1024 * 1024) {
            showNotification(`Фото "${file.name}" слишком большое (макс. 5MB)`);
            continue;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            uploadedImages.push({
                preview: e.target.result,
                file: file,
                name: file.name
            });
            
            updateUploadGrid();
            checkGenerateButton();
            
            showNotification(`Добавлено фото ${uploadedImages.length}/${maxFiles}`);
        };
        reader.readAsDataURL(file);
    }
}

function updateUploadGrid() {
    const container = document.getElementById('upload-grid');
    if (!container) return;
    
    container.innerHTML = '';
    
    uploadedImages.forEach((img, index) => {
        const item = document.createElement('div');
        item.className = 'upload-item';
        item.innerHTML = `
            <img src="${img.preview}" alt="Фото ${index + 1}">
            <div class="upload-remove" data-index="${index}">×</div>
        `;
        
        const removeBtn = item.querySelector('.upload-remove');
        removeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const index = parseInt(this.dataset.index);
            uploadedImages.splice(index, 1);
            updateUploadGrid();
            checkGenerateButton();
            showNotification('Фото удалено');
        });
        
        container.appendChild(item);
    });
    
    if (uploadedImages.length < 5) {
        const addBtn = document.createElement('div');
        addBtn.className = 'upload-item upload-add';
        addBtn.id = 'upload-add-btn';
        addBtn.innerHTML = `
            <span class="material-icons-round">add</span>
            <span>Добавить фото</span>
            <div class="upload-count">${uploadedImages.length}/5</div>
        `;
        
        addBtn.addEventListener('click', function() {
            document.querySelector('input[type="file"]').click();
        });
        
        container.appendChild(addBtn);
    }
}

// ========== ГЕНЕРАЦИЯ ФОТО ==========
function startGeneration() {
    const price = calculatePrice();
    
    if (price > userBalance) {
        showNotification(`Недостаточно звёзд!\nНужно: ${price}, у вас: ${userBalance}`);
        return;
    }
    
    if (uploadedImages.length === 0 && currentCategory !== 'prompt') {
        showNotification('Пожалуйста, загрузите хотя бы одно фото для генерации');
        return;
    }
    
    var promptEl = document.getElementById('ai-prompt');
    var promptText = promptEl ? (promptEl.value || '').trim() : '';
    showLoadingScreen('photo', {
        category: currentCategory,
        style: selectedStyle,
        model: selectedModel,
        format: selectedFormat,
        price: price,
        images: uploadedImages,
        prompt: promptText
    });
}

// ========== РАСЧЕТ ЦЕНЫ ==========
function calculatePrice() {
    let price = selectedModel === 'nano' ? 7 : 25;
    if (currentCategory === 'create') price += 10;
    if (selectedStyle && (selectedStyle.includes('люкс') || selectedStyle.includes('Luxury'))) price += 15;
    return price;
}

function updateTotalPrice() {
    const price = calculatePrice();
    
    const btnText = document.getElementById('generate-btn-text');
    if (btnText) {
        const generateBtn = document.getElementById('start-generate-btn');
        if (!generateBtn.disabled) {
            btnText.textContent = `Сгенерировать за ${price} звёзд`;
        }
    }
    
    checkGenerateButton();
}

function updateBalance() {
    document.getElementById('header-balance').textContent = userBalance;
    document.getElementById('profile-balance').textContent = userBalance;
}

// ========== ДОБАВЛЕНИЕ В ИСТОРИЮ ==========
function addToHistoryGenerated(type, data) {
    // Списываем баланс
    userBalance -= data.price;
    updateBalance();
    
    // Создаем новое фото для истории
    const newPhoto = {
        id: Date.now(),
        src: `https://via.placeholder.com/300x300/${['E0F2FE', 'F8E1E7', 'FAF3E0'][Math.floor(Math.random() * 3)]}/1E3A8A?text=Новое+${type}`,
        title: type === 'photosession' ? `Фотосессия: ${data.title}` : 
               type === 'create-own' ? 'Свой стиль' : 
               `${categories.find(c => c.id === data.category)?.title || 'Фото'}${data.style ? ' - ' + data.style : ''}`,
        date: new Date().toLocaleDateString('ru-RU'),
        type: type === 'photosession' ? 'photosession' : 'photo'
    };
    
    userGeneratedPhotos.unshift(newPhoto);
    
    // Добавляем в localStorage историю
    if (window.addToHistory) {
        window.addToHistory(
            type === 'photosession' ? 'photosession' : 'photo',
            newPhoto.title,
            type === 'photosession' ? `${data.frames || 10} кадров + 3 в подарок` : 
            type === 'create-own' ? 'Создание по примеру' : 
            `Модель: ${data.model === 'nano' ? 'Nano Banana' : 'Nano Banana Pro'}, Формат: ${data.format}`,
            data.price
        );
    }
    
    // Обновляем интерфейс
    loadUserPhotos();
    
    // Показываем бейдж на истории
    showHistoryBadge();
}

function showHistoryBadge() {
    const historyTab = document.querySelector('.tab-btn[data-screen="history"]');
    if (historyTab) {
        let badge = historyTab.querySelector('.tab-badge');
        if (!badge) {
            badge = document.createElement('span');
            badge.className = 'tab-badge';
            historyTab.appendChild(badge);
        }
        badge.style.display = 'block';
    }
}

// ========== УВЕДОМЛЕНИЯ ==========
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// ========== ДОПОЛНИТЕЛЬНЫЕ МОДУЛИ ==========
function showCustomPhotosession() {
    switchScreen('photosession-custom');
}

// ========== ИСТОРИЯ И ПРОФИЛЬ ==========
function setupHistoryAndProfile() {
    if (typeof Storage !== 'undefined') {
        if (!localStorage.getItem('nanoBananaHistory')) {
            localStorage.setItem('nanoBananaHistory', JSON.stringify([]));
        }
    }
    
    window.addToHistory = function(type, title, description, price) {
        const history = JSON.parse(localStorage.getItem('nanoBananaHistory') || '[]');
        const newItem = {
            id: Date.now(),
            type: type,
            title: title,
            description: description,
            price: price,
            date: new Date().toISOString()
        };
        
        history.unshift(newItem);
        localStorage.setItem('nanoBananaHistory', JSON.stringify(history));
        updateProfileStats();
    };
    
    window.clearHistory = function() {
        if (confirm('Вы уверены, что хотите очистить всю историю?')) {
            localStorage.setItem('nanoBananaHistory', JSON.stringify([]));
            loadHistory();
            updateProfileStats();
            showNotification('История очищена');
        }
    };
}

function loadHistory() {
    const container = document.getElementById('history-container');
    const empty = document.getElementById('history-empty');
    const count = document.getElementById('history-count');
    
    if (!container || !empty || !count) return;
    
    const history = JSON.parse(localStorage.getItem('nanoBananaHistory') || '[]');
    count.textContent = history.length;
    
    if (history.length === 0) {
        empty.style.display = 'block';
        container.innerHTML = '';
        return;
    }
    
    empty.style.display = 'none';
    container.innerHTML = '';
    
    // Показываем только последние 20 записей
    const recentHistory = history.slice(0, 20);
    
    recentHistory.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        const icon = item.type === 'video' ? '🎬' : 
                    item.type === 'photosession' ? '📸' : '📷';
        const color = item.type === 'video' ? '#9C27B0' : 
                     item.type === 'photosession' ? '#EC407A' : '#42A5F5';
        
        historyItem.innerHTML = `
            <div class="history-item-icon" style="background-color: ${color}20; color: ${color};">${icon}</div>
            <div class="history-item-content">
                <div class="history-item-title">${item.title}</div>
                <div class="history-item-desc">${item.description}</div>
                <div class="history-item-meta">
                    <span class="history-item-date">${new Date(item.date).toLocaleDateString('ru-RU')}</span>
                    <span class="history-item-price">${item.price} ⭐</span>
                </div>
            </div>
            <button class="history-btn download" onclick="downloadFromHistory('${item.id}')">Скачать</button>
        `;
        
        container.appendChild(historyItem);
    });
}

function downloadFromHistory(itemId) {
    showNotification('Файл отправлен в чат бота!');
}

function updateProfileStats() {
    const history = JSON.parse(localStorage.getItem('nanoBananaHistory') || '[]');
    
    const photoCount = history.filter(item => item.type === 'photo').length;
    const videoCount = history.filter(item => item.type === 'video').length;
    const photosessionCount = history.filter(item => item.type === 'photosession').length;
    const spentStars = history.reduce((sum, item) => sum + item.price, 0);
    const savedCount = history.length;
    
    document.getElementById('stats-photos').textContent = photoCount + photosessionCount;
    document.getElementById('stats-videos').textContent = videoCount;
    document.getElementById('stats-spent').textContent = spentStars;
    document.getElementById('stats-saved').textContent = savedCount;
    
    const totalActions = photoCount + videoCount + photosessionCount;
    let level = '👶 Новичок';
    if (totalActions > 50) level = '👑 Профессионал';
    else if (totalActions > 20) level = '⭐ Опытный';
    else if (totalActions > 5) level = '🌱 Начинающий';
    
    document.getElementById('profile-level').textContent = level;
    document.getElementById('profile-days').textContent = '1 день';
}
