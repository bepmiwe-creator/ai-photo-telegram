// app.js - Nano Banana AI Photo - Old Money Edition
// Версия 5.0: Обновление по ТЗ с экраном ожидания
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
let hasUnviewedHistory = false; // Новый флаг для непросмотренных результатов

// ========== ДАННЫЕ ==========
const categories = [
    { id: 'create', title: 'Создать свой', icon: '🆕', count: 'Ваш стиль', color: '#9C27B0' }
];

// Тестовые сгенерированные фото пользователя
const mockGeneratedPhotos = [
    { 
        id: 1, 
        src: 'https://via.placeholder.com/300x300/E0F2FE/1E3A8A?text=Фото+1', 
        title: 'Зимняя сказка',
        date: '23.01.2026',
        viewed: false
    },
    { 
        id: 2, 
        src: 'https://via.placeholder.com/300x300/F8E1E7/B76E79?text=Фото+2', 
        title: 'Розовый закат',
        date: '22.01.2026',
        viewed: true
    },
    { 
        id: 3, 
        src: 'https://via.placeholder.com/300x300/FAF3E0/374151?text=Фото+3', 
        title: 'Элегантность',
        date: '21.01.2026',
        viewed: true
    },
    { 
        id: 4, 
        src: 'https://via.placeholder.com/300x300/E0F2FE/1E3A8A?text=Фото+4', 
        title: 'Городские огни',
        date: '20.01.2026',
        viewed: true
    },
    { 
        id: 5, 
        src: 'https://via.placeholder.com/300x300/F8E1E7/B76E79?text=Фото+5', 
        title: 'Романтика',
        date: '19.01.2026',
        viewed: true
    },
    { 
        id: 6, 
        src: 'https://via.placeholder.com/300x300/FAF3E0/374151?text=Фото+6', 
        title: 'Минимализм',
        date: '18.01.2026',
        viewed: true
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
            { id: 1, name: "Снежная королева", preview: "https://via.placeholder.com/300x300/64B5F6/FFFFFF?text=❄️+1", views: 17200, rating: 4.9 },
            { id: 2, name: "Зимний лес", preview: "https://via.placeholder.com/300x300/64B5F6/FFFFFF?text=❄️+2", views: 12300, rating: 4.7 },
            { id: 3, name: "Новогоднее настроение", preview: "https://via.placeholder.com/300x300/64B5F6/FFFFFF?text=❄️+3", views: 21500, rating: 5.0 },
            { id: 4, name: "Лыжный курорт", preview: "https://via.placeholder.com/300x300/64B5F6/FFFFFF?text=❄️+4", views: 8900, rating: 4.5 },
            { id: 5, name: "Морозные узоры", preview: "https://via.placeholder.com/300x300/64B5F6/FFFFFF?text=❄️+5", views: 14200, rating: 4.8 }
        ]
    },
    { 
        id: 'wedding', 
        title: 'Свадебная', 
        icon: '💍', 
        color: '#EC407A',
        styles: [
            { id: 1, name: "Романтический закат", preview: "https://via.placeholder.com/300x300/EC407A/FFFFFF?text=💍+1", views: 24500, rating: 5.0 },
            { id: 2, name: "Церковная церемония", preview: "https://via.placeholder.com/300x300/EC407A/FFFFFF?text=💍+2", views: 18700, rating: 4.8 },
            { id: 3, name: "Праздничный банкет", preview: "https://via.placeholder.com/300x300/EC407A/FFFFFF?text=💍+3", views: 16200, rating: 4.7 }
        ]
    },
    { 
        id: 'beach', 
        title: 'Пляжный отдых', 
        icon: '🏖️', 
        color: '#FFB74D',
        styles: [
            { id: 1, name: "Закат на море", preview: "https://via.placeholder.com/300x300/FFB74D/FFFFFF?text=🏖️+1", views: 32500, rating: 4.9 },
            { id: 2, name: "Пальмовый рай", preview: "https://via.placeholder.com/300x300/FFB74D/FFFFFF?text=🏖️+2", views: 27800, rating: 4.8 }
        ]
    },
    { 
        id: 'luxury', 
        title: 'Роскошь Luxury', 
        icon: '💎', 
        color: '#FFD700',
        styles: [
            { id: 1, name: "Золотой шик", preview: "https://via.placeholder.com/300x300/FFD700/FFFFFF?text=💎+1", views: 43200, rating: 5.0 },
            { id: 2, name: "Алмазный блеск", preview: "https://via.placeholder.com/300x300/FFD700/FFFFFF?text=💎+2", views: 38900, rating: 4.9 },
            { id: 3, name: "Шикарный вечер", preview: "https://via.placeholder.com/300x300/FFD700/FFFFFF?text=💎+3", views: 41500, rating: 5.0 }
        ]
    }
];

// Примеры стилей для категорий (оставляем только для горизонтальных каталогов)
const styleExamples = {
    winter: [
        { id: 1, name: "Снежная королева", icon: "👑", color: "#4FC3F7", preview: "https://via.placeholder.com/200x200/64B5F6/FFFFFF?text=❄️" },
        { id: 2, name: "Зимний лес", icon: "🌲", color: "#81C784", preview: "https://via.placeholder.com/200x200/64B5F6/FFFFFF?text=🌲" },
        { id: 3, name: "Новогоднее настроение", icon: "🎄", color: "#FF8A65", preview: "https://via.placeholder.com/200x200/64B5F6/FFFFFF?text=🎄" },
        { id: 4, name: "Лыжный курорт", icon: "⛷️", color: "#64B5F6", preview: "https://via.placeholder.com/200x200/64B5F6/FFFFFF?text=⛷️" },
        { id: 5, name: "Морозные узоры", icon: "❄️", color: "#90CAF9", preview: "https://via.placeholder.com/200x200/64B5F6/FFFFFF?text=❄️" }
    ],
    birthday: [
        { id: 1, name: "Торт и свечи", icon: "🎂", color: "#FFB74D", preview: "https://via.placeholder.com/200x200/FFB74D/FFFFFF?text=🎂" },
        { id: 2, name: "Праздничный вечер", icon: "🎉", color: "#BA68C8", preview: "https://via.placeholder.com/200x200/FFB74D/FFFFFF?text=🎉" },
        { id: 3, name: "Воздушные шары", icon: "🎈", color: "#4DD0E1", preview: "https://via.placeholder.com/200x200/FFB74D/FFFFFF?text=🎈" }
    ],
    trends: [
        { id: 1, name: "Неоновый стиль", icon: "💡", color: "#9575CD", preview: "https://via.placeholder.com/200x200/FF5722/FFFFFF?text=💡" },
        { id: 2, name: "Ретро волна", icon: "📻", color: "#FF8A65", preview: "https://via.placeholder.com/200x200/FF5722/FFFFFF?text=📻" },
        { id: 3, name: "Футуризм", icon: "🚀", color: "#4DB6AC", preview: "https://via.placeholder.com/200x200/FF5722/FFFFFF?text=🚀" }
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
        { id: 3, name: "Учитель", icon: "👩‍🏫", color: "#66BB6A", preview: "https://via.placeholder.com/200x200/78909C/FFFFFF?text=👩‍🏫" }
    ],
    luxury: [
        { id: 1, name: "Золотой шик", icon: "💰", color: "#FFD700", preview: "https://via.placeholder.com/200x200/FFD700/FFFFFF?text=💰" },
        { id: 2, name: "Алмазный блеск", icon: "💎", color: "#B39DDB", preview: "https://via.placeholder.com/200x200/FFD700/FFFFFF?text=💎" },
        { id: 3, name: "Шикарный вечер", icon: "🍾", color: "#F8BBD0", preview: "https://via.placeholder.com/200x200/FFD700/FFFFFF?text=🍾" }
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
    updateHistoryBadge();
    
    setTimeout(() => {
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
        
        // Всегда показываем кнопку закрытия
        tg.BackButton.hide(); // Скрываем кнопку "Назад"
        
        const user = tg.initDataUnsafe?.user;
        if (user) {
            const userName = user.first_name || 'Пользователь';
            document.getElementById('profile-name').textContent = userName;
            document.getElementById('profile-id').textContent = user.id || '...';
        }
        
        if (tg.colorScheme === 'dark') {
            document.body.classList.add('dark-theme');
        }
        
        console.log('Telegram подключен, свайпы отключены');
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
        
        hideGenerateScreen();
        hideHowItWorks();
        hidePhotosessionModal();
        hideCategoryModal();
        hidePhotosessionGalleryModal();
        hideFullscreenViewer();
        hideLoadingScreen();
        hideResultScreen();
        
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
                // Сбрасываем флаг при просмотре истории
                hasUnviewedHistory = false;
                updateHistoryBadge();
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
            showNotification(`Ваш баланс: ${userBalance} звёзд\nДля пополнения откройте приложение в Telegram боте.`);
        });
    }
    
    window.switchScreen = switchScreen;
}

// Обновить бейдж на иконке истории
function updateHistoryBadge() {
    const historyTab = document.querySelector('.tab-btn[data-screen="history"]');
    if (!historyTab) return;
    
    const existingBadge = historyTab.querySelector('.history-badge');
    if (existingBadge) {
        existingBadge.remove();
    }
    
    if (hasUnviewedHistory) {
        const badge = document.createElement('span');
        badge.className = 'history-badge';
        badge.textContent = '●';
        historyTab.appendChild(badge);
    }
}

// ========== РАЗДЕЛ "ФОТО" ==========
function loadPhotoCategories() {
    const container = document.getElementById('categories-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Только две горизонтальные карточки вверху
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
    
    // Нет категорий в виде сетки, только горизонтальные каталоги
    const gridContainer = document.createElement('div');
    gridContainer.className = 'categories-grid';
    gridContainer.style.display = 'none'; // Скрываем старые категории
    
    container.appendChild(gridContainer);
    
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
    const container = document.getElementById('horizontal-categories');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Определяем порядок категорий для отображения
    const categoryOrder = ['winter', 'birthday', 'trends', 'couples', 'girls', 'men', 'pets', 'professions', 'luxury'];
    
    categoryOrder.forEach(categoryId => {
        const category = {
            id: categoryId,
            title: getCategoryTitle(categoryId),
            icon: getCategoryIcon(categoryId),
            color: getCategoryColor(categoryId)
        };
        
        const section = document.createElement('div');
        section.className = 'horizontal-category-section';
        
        const header = document.createElement('div');
        header.className = 'horizontal-category-header';
        
        const stylesCount = styleExamples[categoryId]?.length || 0;
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
        
        const styles = styleExamples[categoryId] || [];
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

// Вспомогательные функции для получения информации о категориях
function getCategoryTitle(categoryId) {
    const titles = {
        winter: '❄️ Зима',
        birthday: '🎂 День рождения',
        trends: '🔥 Тренды',
        couples: '👫 Парные',
        girls: '💃 Для девушек',
        men: '🕺 Для мужчин',
        pets: '🐾 Питомцы',
        professions: '💼 Профессии',
        luxury: '💎 Luxury'
    };
    return titles[categoryId] || categoryId;
}

function getCategoryIcon(categoryId) {
    const icons = {
        winter: '❄️',
        birthday: '🎂',
        trends: '🔥',
        couples: '👫',
        girls: '💃',
        men: '🕺',
        pets: '🐾',
        professions: '💼',
        luxury: '💎'
    };
    return icons[categoryId] || '📷';
}

function getCategoryColor(categoryId) {
    const colors = {
        winter: '#64B5F6',
        birthday: '#FFB74D',
        trends: '#FF5722',
        couples: '#EC407A',
        girls: '#E91E63',
        men: '#42A5F5',
        pets: '#81C784',
        professions: '#78909C',
        luxury: '#FFD700'
    };
    return colors[categoryId] || '#9C27B0';
}

// Функция для склонения слова "стиль"
function getStyleWord(count) {
    if (count % 10 === 1 && count % 100 !== 11) return 'стиль';
    if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return 'стиля';
    return 'стилей';
}

// ========== МОДАЛЬНОЕ ОКНО КАТЕГОРИИ (страница ФОТО) ==========
function showCategoryModal(categoryId) {
    const modal = document.getElementById('category-modal');
    if (!modal) return;
    
    const categoryTitle = getCategoryTitle(categoryId);
    const titleElement = document.getElementById('category-modal-title');
    if (titleElement) {
        titleElement.textContent = categoryTitle;
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

// ========== ЭКРАН ЗАГРУЗКИ/ГЕНЕРАЦИИ ==========
function showLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (!loadingScreen) return;
    
    loadingScreen.style.display = 'flex';
    setTimeout(() => loadingScreen.classList.add('show'), 10);
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.classList.remove('show');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 300);
    }
}

// ========== ЭКРАН РЕЗУЛЬТАТА ==========
function showResultScreen(imageSrc, title) {
    const resultScreen = document.getElementById('result-screen');
    if (!resultScreen) return;
    
    // Устанавливаем изображение
    const resultImage = document.getElementById('result-image');
    if (resultImage) {
        resultImage.src = imageSrc;
        resultImage.alt = title;
    }
    
    // Устанавливаем заголовок
    const resultTitle = document.getElementById('result-title');
    if (resultTitle) {
        resultTitle.textContent = title;
    }
    
    // Настраиваем кнопку скачивания
    const downloadBtn = document.getElementById('result-download-btn');
    if (downloadBtn) {
        downloadBtn.onclick = function() {
            downloadImageToTelegram(imageSrc, title);
        };
    }
    
    resultScreen.style.display = 'flex';
    setTimeout(() => resultScreen.classList.add('show'), 10);
}

function hideResultScreen() {
    const resultScreen = document.getElementById('result-screen');
    if (resultScreen) {
        resultScreen.classList.remove('show');
        setTimeout(() => {
            resultScreen.style.display = 'none';
        }, 300);
    }
}

// Функция для скачивания изображения в Telegram
function downloadImageToTelegram(imageSrc, title) {
    if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        
        // В реальном приложении здесь будет вызов API для скачивания
        showNotification('Фото отправлено в чат бота!');
        
        // Закрываем экран результата
        hideResultScreen();
        
        // Переходим на экран истории
        setTimeout(() => {
            switchScreen('history');
        }, 500);
    } else {
        // Для демо просто показываем уведомление
        showNotification('В Telegram боте фото будет отправлено в чат');
        hideResultScreen();
        setTimeout(() => {
            switchScreen('history');
        }, 500);
    }
}

// ========== ОБНОВЛЕННАЯ ФУНКЦИЯ ГЕНЕРАЦИИ ==========
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
    
    // Показываем экран загрузки
    showLoadingScreen();
    
    // Имитация процесса генерации (3-5 секунд)
    setTimeout(() => {
        userBalance -= price;
        updateBalance();
        
        const categoryName = currentCategory === 'prompt' ? 'По промпту' : 
                            selectedStyle || getCategoryTitle(currentCategory) || 'Фото';
        
        // Создаем новое фото
        const newPhoto = {
            id: Date.now(),
            src: uploadedImages[0]?.preview || 'https://via.placeholder.com/300x300/E0F2FE/1E3A8A?text=Сгенерировано',
            title: categoryName,
            date: new Date().toLocaleDateString('ru-RU'),
            viewed: false
        };
        
        // Добавляем в начало массива
        userGeneratedPhotos.unshift(newPhoto);
        
        // Обновляем историю
        loadUserPhotos();
        
        // Устанавливаем флаг о непросмотренных результатах
        hasUnviewedHistory = true;
        updateHistoryBadge();
        
        // Добавляем в localStorage историю
        if (window.addToHistory) {
            window.addToHistory('photo', 
                `Фото: ${categoryName}`,
                `Модель: ${selectedModel === 'nano' ? 'Nano Banana' : 'Nano Banana Pro'}, Формат: ${selectedFormat}`,
                price
            );
        }
        
        // Показываем push-уведомление
        showNotification('🎉 Генерация завершена! Результат доступен в истории.');
        
        // Скрываем экран загрузки и показываем результат
        hideLoadingScreen();
        showResultScreen(newPhoto.src, newPhoto.title);
        
    }, 3000 + Math.random() * 2000); // Случайное время от 3 до 5 секунд
}

// Аналогично обновляем функцию для создания своего стиля
function startCreateOwnGeneration() {
    if (!uploadedExample || !uploadedFace) {
        showNotification('Загрузите оба фото для генерации');
        return;
    }
    
    if (10 > userBalance) {
        showNotification(`Недостаточно звёзд! Нужно: 10, у вас: ${userBalance}`);
        return;
    }
    
    // Показываем экран загрузки
    showLoadingScreen();
    
    setTimeout(() => {
        userBalance -= 10;
        updateBalance();
        
        const newPhoto = {
            id: Date.now(),
            src: uploadedExample.preview,
            title: 'Свой стиль',
            date: new Date().toLocaleDateString('ru-RU'),
            viewed: false
        };
        
        userGeneratedPhotos.unshift(newPhoto);
        loadUserPhotos();
        
        hasUnviewedHistory = true;
        updateHistoryBadge();
        
        if (window.addToHistory) {
            window.addToHistory('photo', 'Создать свой стиль', 'Генерация по примеру', 10);
        }
        
        showNotification('🎉 Генерация завершена! Результат доступен в истории.');
        
        hideLoadingScreen();
        showResultScreen(newPhoto.src, newPhoto.title);
        
    }, 3000 + Math.random() * 2000);
}

// ========== ИСТОРИЯ ==========
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
                <button class="photosession-btn" onclick="selectPhotoForSession(${photo.id})">
                    <span class="photosession-btn-icon">📸</span>
                    <span>Фотосессия</span>
                </button>
            </div>
        `;
        
        photoCard.addEventListener('click', (e) => {
            // Если клик был не по кнопке фотосессии
            if (!e.target.closest('.photosession-btn')) {
                // Открываем полноэкранный просмотр
                currentGalleryImages = [{ src: photo.src, alt: photo.title }];
                currentGalleryIndex = 0;
                showFullscreenViewer();
            }
        });
        
        container.appendChild(photoCard);
    });
}

// Функция для выбора фото для фотосессии
function selectPhotoForSession(photoId) {
    const photo = userGeneratedPhotos.find(p => p.id === photoId);
    if (photo) {
        selectedPhotoForSession = photo;
        showPhotosessionModal();
    }
}

// ========== ПОЛНОЭКРАННЫЙ ПРОСМОТР ДЛЯ ИСТОРИИ ==========
function showFullscreenViewerForHistory(images, startIndex = 0) {
    currentGalleryImages = images;
    currentGalleryIndex = startIndex;
    
    // Отмечаем фото как просмотренное
    const currentPhoto = userGeneratedPhotos.find(p => p.src === images[startIndex].src);
    if (currentPhoto && !currentPhoto.viewed) {
        currentPhoto.viewed = true;
        
        // Проверяем, есть ли еще непросмотренные фото
        hasUnviewedHistory = userGeneratedPhotos.some(p => !p.viewed);
        updateHistoryBadge();
    }
    
    showFullscreenViewer();
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
        scrollContainer.id = `photosession-scroll-${category.id}`;
        
        const displayStyles = category.styles.slice(0, 5);
        
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
            date: new Date().toLocaleDateString('ru-RU'),
            timestamp: new Date().toISOString()
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
    
    // Создаем сетку 2x2
    const gridContainer = document.createElement('div');
    gridContainer.className = 'history-grid';
    
    history.forEach(item => {
        const historyCard = document.createElement('div');
        historyCard.className = 'history-card';
        
        const icon = item.type === 'video' ? '🎬' : 
                    item.type === 'photosession' ? '📸' : '📷';
        const color = item.type === 'video' ? '#9C27B0' : 
                     item.type === 'photosession' ? '#EC407A' : '#42A5F5';
        
        historyCard.innerHTML = `
            <div class="history-card-image">
                <img src="https://via.placeholder.com/300x300/${color.substring(1)}/FFFFFF?text=${icon}" alt="${item.title}">
            </div>
            <div class="history-card-date">${item.date}</div>
            <div class="history-card-overlay">
                <button class="history-card-photosession-btn" onclick="selectHistoryForSession('${item.id}')">
                    <span class="photosession-btn-icon">📸</span>
                    <span>Фотосессия</span>
                </button>
            </div>
        `;
        
        historyCard.addEventListener('click', (e) => {
            if (!e.target.closest('.history-card-photosession-btn')) {
                // Открываем полноэкранный просмотр
                const images = [{ 
                    src: `https://via.placeholder.com/800x800/${color.substring(1)}/FFFFFF?text=${icon}`, 
                    alt: item.title 
                }];
                showFullscreenViewerForHistory(images, 0);
            }
        });
        
        gridContainer.appendChild(historyCard);
    });
    
    container.appendChild(gridContainer);
}

function selectHistoryForSession(historyId) {
    const history = JSON.parse(localStorage.getItem('nanoBananaHistory') || '[]');
    const item = history.find(h => h.id.toString() === historyId);
    
    if (item) {
        showNotification(`Выбрана фотосессия для: ${item.title}`);
        // Здесь будет переход на страницу создания фотосессии
    }
}

// ========== ОСТАЛЬНЫЕ ФУНКЦИИ (без изменений) ==========
// Все остальные функции остаются без изменений из оригинального кода
// включая: setupFormatSelect, checkGenerateButton, handleFileUpload, 
// updateUploadGrid, calculatePrice, updateTotalPrice, updateBalance,
// showNotification, и другие вспомогательные функции

// Для краткости не дублирую весь код, только изменил ключевые функции
// Остальной код остается таким же как в оригинальном app.js

console.log('🍌 Nano Banana App готов! Версия 5.0 с экраном ожидания');
