// app.js - Nano Banana AI Photo - Old Money Edition
// Версия 5.1: Исправления и реализация ТЗ

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

function getStyleWord(count) {
    if (count % 10 === 1 && count % 100 !== 11) return 'стиль';
    if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return 'стиля';
    return 'стилей';
}

const mockGeneratedPhotos = [
    { id: 1, src: 'https://via.placeholder.com/300x400/E0F2FE/1E3A8A?text=Фото+1', title: 'Зимняя сказка', date: '23.01.2026', type: 'photo' },
    { id: 2, src: 'https://via.placeholder.com/300x400/F8E1E7/B76E79?text=Фото+2', title: 'Розовый закат', date: '22.01.2026', type: 'photo' },
    { id: 3, src: 'https://via.placeholder.com/300x400/FAF3E0/374151?text=Фото+3', title: 'Элегантность', date: '21.01.2026', type: 'photo' },
    { id: 4, src: 'https://via.placeholder.com/300x400/E0F2FE/1E3A8A?text=Фото+4', title: 'Городские огни', date: '20.01.2026', type: 'photosession' },
    { id: 5, src: 'https://via.placeholder.com/300x400/F8E1E7/B76E79?text=Фото+5', title: 'Романтика', date: '19.01.2026', type: 'photo' },
    { id: 6, src: 'https://via.placeholder.com/300x400/FAF3E0/374151?text=Фото+6', title: 'Минимализм', date: '18.01.2026', type: 'photo' },
    { id: 7, src: 'https://via.placeholder.com/300x400/E0F2FE/1E3A8A?text=Фото+7', title: 'Природа', date: '17.01.2026', type: 'photosession' },
    { id: 8, src: 'https://via.placeholder.com/300x400/F8E1E7/B76E79?text=Фото+8', title: 'Стиль', date: '16.01.2026', type: 'photo' }
];

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

const styleExamples = {
    winter: [
        { id: 1, name: "Снежная королева", icon: "👑", color: "#4FC3F7", preview: "https://via.placeholder.com/300x400/64B5F6/FFFFFF?text=❄️" },
        { id: 2, name: "Зимний лес", icon: "🌲", color: "#81C784", preview: "https://via.placeholder.com/300x400/64B5F6/FFFFFF?text=🌲" },
        { id: 3, name: "Новогоднее настроение", icon: "🎄", color: "#FF8A65", preview: "https://via.placeholder.com/300x400/64B5F6/FFFFFF?text=🎄" },
        { id: 4, name: "Лыжный курорт", icon: "⛷️", color: "#64B5F6", preview: "https://via.placeholder.com/300x400/64B5F6/FFFFFF?text=⛷️" },
        { id: 5, name: "Морозные узоры", icon: "❄️", color: "#90CAF9", preview: "https://via.placeholder.com/300x400/64B5F6/FFFFFF?text=❄️" },
        { id: 6, name: "Рождественский вечер", icon: "🎅", color: "#E57373", preview: "https://via.placeholder.com/300x400/64B5F6/FFFFFF?text=🎅" }
    ],
    birthday: [
        { id: 1, name: "Торт и свечи", icon: "🎂", color: "#FFB74D", preview: "https://via.placeholder.com/300x400/FFB74D/FFFFFF?text=🎂" },
        { id: 2, name: "Праздничный вечер", icon: "🎉", color: "#BA68C8", preview: "https://via.placeholder.com/300x400/FFB74D/FFFFFF?text=🎉" },
    ],
    trends: [
        { id: 1, name: "Неоновый стиль", icon: "💡", color: "#9575CD", preview: "https://via.placeholder.com/300x400/FF5722/FFFFFF?text=💡" },
        { id: 2, name: "Ретро волна", icon: "📻", color: "#FF8A65", preview: "https://via.placeholder.com/300x400/FF5722/FFFFFF?text=📻" },
    ],
    couples: [
        { id: 1, name: "Романтический вечер", icon: "💕", color: "#F06292", preview: "https://via.placeholder.com/300x400/EC407A/FFFFFF?text=💕" },
        { id: 2, name: "Прогулка в парке", icon: "🌳", color: "#81C784", preview: "https://via.placeholder.com/300x400/EC407A/FFFFFF?text=🌳" },
    ],
    girls: [
        { id: 1, name: "Стиль принцессы", icon: "👸", color: "#CE93D8", preview: "https://via.placeholder.com/300x400/E91E63/FFFFFF?text=👸" },
        { id: 2, name: "Деловой образ", icon: "💼", color: "#80CBC4", preview: "https://via.placeholder.com/300x400/E91E63/FFFFFF?text=💼" },
    ],
    men: [
        { id: 1, name: "Классический костюм", icon: "🤵", color: "#78909C", preview: "https://via.placeholder.com/300x400/42A5F5/FFFFFF?text=🤵" },
        { id: 2, name: "Спортивный стиль", icon: "🏃", color: "#42A5F5", preview: "https://via.placeholder.com/300x400/42A5F5/FFFFFF?text=🏃" },
    ],
    pets: [
        { id: 1, name: "Домашний любимец", icon: "🐶", color: "#FFD54F", preview: "https://via.placeholder.com/300x400/81C784/FFFFFF?text=🐶" },
        { id: 2, name: "Портрет питомца", icon: "📷", color: "#80DEEA", preview: "https://via.placeholder.com/300x400/81C784/FFFFFF?text=📷" }
    ],
    professions: [
        { id: 1, name: "Врач", icon: "👨‍⚕️", color: "#EF5350", preview: "https://via.placeholder.com/300x400/78909C/FFFFFF?text=👨‍⚕️" },
        { id: 2, name: "Программист", icon: "💻", color: "#42A5F5", preview: "https://via.placeholder.com/300x400/78909C/FFFFFF?text=💻" },
    ],
    luxury: [
        { id: 1, name: "Золотой шик", icon: "💰", color: "#FFD700", preview: "https://via.placeholder.com/300x400/FFD700/FFFFFF?text=💰" },
        { id: 2, name: "Алмазный блеск", icon: "💎", color: "#B39DDB", preview: "https://via.placeholder.com/300x400/FFD700/FFFFFF?text=💎" },
    ]
};

// ========== ЗАПУСК ПРИЛОЖЕНИЯ ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('🍌 Nano Banana Old Money Edition v5.1 запускается...');
    
    initTelegram();
    setupNavigation();
    setupButtons();
    setupRealUpload();
    setupHistoryAndProfile();
    setupGenerationHandlers();

    userGeneratedPhotos = [...mockGeneratedPhotos];
    updateBalance();
    
    switchScreen('main'); // Начинаем с главного экрана

    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// ========== TELEGRAM & НАВИГАЦИЯ ==========
function initTelegram() {
    if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.expand();
        
        if (tg.disableVerticalSwipes) {
            tg.disableVerticalSwipes();
        }
        
        const user = tg.initDataUnsafe?.user;
        if (user) {
            document.getElementById('profile-name').textContent = user.first_name || 'Пользователь';
            document.getElementById('profile-id').textContent = `ID: ${user.id}` || 'ID: ...';
        }
        
        if (tg.colorScheme === 'dark') {
            document.body.classList.add('dark-theme');
            document.getElementById('dark-mode').checked = true;
        } else {
            document.getElementById('dark-mode').checked = false;
        }
        
        tg.onEvent('backButtonClicked', handleBackButton);
        
        console.log('Telegram подключен');
    }
}

function handleBackButton() {
    const activeOverlay = document.querySelector('.overlay.show');
    if (activeOverlay) {
        // Если открыто любое оверлей-окно, просто закрываем его
        activeOverlay.classList.remove('show');
        setTimeout(() => { activeOverlay.style.display = 'none'; }, 300);
        return;
    }
    
    const activeScreen = document.querySelector('.screen.active');
    if (activeScreen && activeScreen.id !== 'screen-main') {
        // Если мы на любом экране кроме главного, возвращаемся на главный
        switchScreen('main');
    } else {
        // Если мы на главном экране, закрываем приложение
        window.Telegram.WebApp.close();
    }
}

function setupNavigation() {
    document.querySelectorAll('.tab-btn').forEach(button => {
        button.addEventListener('click', function() {
            switchScreen(this.dataset.screen);
        });
    });
    
    document.querySelectorAll('.quick-card').forEach(card => {
        card.addEventListener('click', function() {
            switchScreen(this.dataset.screen);
        });
    });
    
    window.switchScreen = switchScreen;
}

function switchScreen(screenId) {
    console.log('Переключаемся на экран:', screenId);
    
    // Сначала скрываем все оверлеи
    document.querySelectorAll('.overlay.show').forEach(overlay => {
        overlay.classList.remove('show');
        overlay.style.display = 'none';
    });

    // Скрываем все экраны
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    const targetScreen = document.getElementById(`screen-${screenId}`);
    if (targetScreen) {
        targetScreen.classList.add('active');
        
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.screen === screenId);
        });

        // Управляем кнопкой "Назад" в Telegram
        if (window.Telegram && window.Telegram.WebApp) {
            const tg = window.Telegram.WebApp;
            if (screenId === 'main') {
                tg.BackButton.hide();
            } else {
                tg.BackButton.show();
            }
        }
        
        // Загружаем контент для активного экрана
        switch (screenId) {
            case 'photo':
                loadPhotoCategories();
                break;
            case 'photosession':
                loadPhotosessionHorizontalCategories();
                break;
            case 'photosession-custom':
                loadUserPhotos();
                break;
            case 'history':
                loadHistory();
                break;
            case 'profile':
                updateProfileStats();
                loadRecentHistory();
                break;
        }
    }
}

// ========== РАЗДЕЛ "ФОТО" ==========
function loadPhotoCategories() {
    const container = document.getElementById('categories-container');
    if (!container) return;
    
    container.innerHTML = `
        <div class="prompt-card" id="prompt-generate-btn">
            <div class="prompt-icon">✍️</div>
            <div class="prompt-text">
                <div class="prompt-title">Генерация по описанию</div>
                <div class="prompt-desc">Опишите картинку словами</div>
            </div>
            <div class="prompt-arrow"><span class="material-icons-round">arrow_forward</span></div>
        </div>
        <div class="create-own-card" id="create-own-style-btn">
            <div class="category-icon">🆕</div>
            <div class="category-title">Создать свой</div>
            <div class="category-count">Ваш стиль</div>
        </div>
    `;
    
    document.getElementById('prompt-generate-btn').onclick = () => {
        currentCategory = 'prompt';
        selectedStyle = null;
        showGenerateScreen();
    };
    
    document.getElementById('create-own-style-btn').onclick = () => {
        switchScreen('create-own');
    };

    loadHorizontalCategories();
}

function loadHorizontalCategories() {
    const container = document.getElementById('horizontal-categories-main');
    if (!container) return;
    container.innerHTML = '';
    
    const mainCategories = categories.filter(cat => cat.id !== 'create');
    
    mainCategories.forEach(category => {
        const styles = styleExamples[category.id] || [];
        if (styles.length === 0) return;

        const section = document.createElement('div');
        section.className = 'horizontal-category-section';
        
        const header = document.createElement('div');
        header.className = 'horizontal-category-header';
        header.innerHTML = `<h3 class="horizontal-category-title">${category.title}</h3>`;
        section.appendChild(header);

        const gridContainer = document.createElement('div');
        gridContainer.className = 'styles-grid-container';

        styles.forEach(style => {
            const styleCard = document.createElement('div');
            styleCard.className = 'style-grid-card';
            styleCard.innerHTML = `
                <div class="style-grid-preview"><img src="${style.preview}" alt="${style.name}"></div>
                <div class="style-grid-name">${style.name}</div>
            `;
            styleCard.onclick = () => {
                selectedStyle = style.name;
                currentCategory = category.id;
                showGenerateScreen();
            };
            gridContainer.appendChild(styleCard);
        });
        
        section.appendChild(gridContainer);
        container.appendChild(section);
    });
}

// ========== РАЗДЕЛ "ФОТОСЕССИИ" ==========
function loadPhotosessionHorizontalCategories() {
    const container = document.getElementById('photosession-horizontal-categories');
    if (!container) return;
    container.innerHTML = '';
    
    photosessionCategories.forEach(category => {
        const section = document.createElement('div');
        section.className = 'horizontal-category-section';
        
        const header = document.createElement('div');
        header.className = 'horizontal-category-header';
        header.innerHTML = `<h3 class="horizontal-category-title">${category.title}</h3>`;
        section.appendChild(header);

        const scrollContainer = document.createElement('div');
        scrollContainer.className = 'horizontal-scroll-container';
        
        category.styles.forEach(style => {
            const styleCard = document.createElement('div');
            styleCard.className = 'horizontal-style-card';
            styleCard.innerHTML = `
                <div class="horizontal-style-preview"><img src="${style.preview}" alt="${style.name}"></div>
                <div class="horizontal-style-name">${style.name}</div>
            `;
            styleCard.onclick = () => {
                currentPhotosessionCategory = category;
                showPhotosessionGalleryModal(category.id);
            };
            scrollContainer.appendChild(styleCard);
        });
        
        section.appendChild(scrollContainer);
        container.appendChild(section);
    });
}

function showPhotosessionGalleryModal(categoryId) {
    const modal = document.getElementById('photosession-gallery-modal');
    const category = photosessionCategories.find(c => c.id === categoryId);
    if (!modal || !category) return;

    modal.querySelector('.overlay-header h3').textContent = category.title;
    const container = document.getElementById('photosession-gallery-container');
    container.innerHTML = '';
    
    category.styles.forEach(style => {
        const viewsText = style.views >= 1000 ? (style.views / 1000).toFixed(1) + 'K' : style.views;
        const styleCard = document.createElement('div');
        styleCard.className = 'photosession-gallery-card';
        styleCard.innerHTML = `
            <div class="photosession-gallery-preview"><img src="${style.preview}" alt="${style.name}"></div>
            <div class="photosession-gallery-stats-bottom">
                <div class="gallery-stat-item"><span class="material-icons-round stat-icon">visibility</span><span class="stat-value">${viewsText}</span></div>
                <div class="gallery-stat-item"><span class="material-icons-round stat-icon">star</span><span class="stat-value">${style.rating.toFixed(1)}</span></div>
            </div>
        `;
        styleCard.onclick = () => showPhotosessionSeriesModal(category, style);
        container.appendChild(styleCard);
    });
    
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('show'), 10);
}

function showPhotosessionSeriesModal(category, style) {
    const modal = document.getElementById('photosession-series-modal');
    if (!modal) return;
    
    modal.querySelector('.overlay-header h3').textContent = style.name;
    const container = document.getElementById('photosession-series-container');
    container.innerHTML = '';
    
    // Создаем 10 тестовых изображений для серии
    for (let i = 1; i <= 10; i++) {
        const seriesCard = document.createElement('div');
        seriesCard.className = 'photosession-series-card';
        seriesCard.innerHTML = `<div class="photosession-series-preview"><img src="https://via.placeholder.com/300x400/${category.color.substring(1)}/FFFFFF?text=${category.icon}+${i}" alt="${style.name} ${i}"></div>`;
        
        seriesCard.onclick = () => {
            currentGalleryImages = Array.from({length: 10}, (_, j) => ({
                src: `https://via.placeholder.com/800x800/${category.color.substring(1)}/FFFFFF?text=${category.icon}+${j + 1}`,
                alt: `${style.name} ${j + 1}`
            }));
            currentGalleryIndex = i - 1;
            showFullscreenViewer();
        };
        container.appendChild(seriesCard);
    }
    
    const generateBtn = document.getElementById('photosession-series-generate-btn');
    if (userBalance >= 159) {
        generateBtn.innerHTML = `<span class="generate-icon">✨</span><span>Сгенерировать за 159 звёзд</span>`;
        generateBtn.onclick = () => startPhotosessionGeneration(style.name, 159, style);
    } else {
        generateBtn.innerHTML = `<span class="generate-icon">💰</span><span>Пополнить баланс</span>`;
        generateBtn.onclick = () => showInsufficientBalancePopup(159);
    }
    document.getElementById('photosession-series-balance').textContent = userBalance;
    
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('show'), 10);
}

// ========== СВОЯ ФОТОСЕССИЯ (ИЗ СВОИХ ФОТО) ==========
function loadUserPhotos() {
    const container = document.getElementById('user-photos-container');
    if (!container) return;
    
    container.innerHTML = '';
    document.getElementById('user-photos-count').textContent = `${userGeneratedPhotos.length} фото`;

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
        if (photo.type !== 'photosession') { // Показываем только обычные фото
            const photoCard = document.createElement('div');
            photoCard.className = 'user-photo-card';
            photoCard.innerHTML = `
                <img src="${photo.src}" alt="${photo.title}">
                <button class="photosession-from-photo-btn" data-photo-id="${photo.id}">
                    <span class="material-icons-round">camera</span> Фотосессия
                </button>
            `;
            
            photoCard.querySelector('.photosession-from-photo-btn').onclick = (e) => {
                e.stopPropagation();
                selectedPhotoForSession = photo;
                showPhotosessionModal();
            };
            container.appendChild(photoCard);
        }
    });
}

function showPhotosessionModal() {
    if (!selectedPhotoForSession) return;
    
    const modal = document.getElementById('photosession-modal');
    if (!modal) return;
    
    modal.querySelector('#selected-photo-img').src = selectedPhotoForSession.src;
    updatePhotosessionCount();
    
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('show'), 10);
}

function updatePhotosessionCount() {
    const price = 159 + Math.max(0, photosessionFrames - 10) * 15;
    const totalPhotos = photosessionFrames + 3;

    document.getElementById('photosession-count').textContent = photosessionFrames;
    document.getElementById('photosession-price').textContent = price;
    document.getElementById('result-photo-count').textContent = totalPhotos;
    
    const generateBtn = document.getElementById('start-photosession-btn');
    generateBtn.onclick = () => {
        if (userBalance >= price) {
            startPhotosessionGeneration('Своя фотосессия', price, { name: 'Кастомная' });
        } else {
            showInsufficientBalancePopup(price);
        }
    };
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

// ========== ПРОЧИЕ UI-ФУНКЦИИ (без существенных изменений) ==========

// Остальной код из оригинального файла app.js, который не требует правок по ТЗ.
// Включает: showFullscreenViewer, hideFullscreenViewer, showCreateOwnStyle, ...
// ... до конца файла ...

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
            message: `Ваш баланс: ${userBalance} ⭐\nНе хватает: ${missingAmount} ⭐\n\nПополнить баланс в боте?`,
            buttons: [
                { id: 'exit', type: 'default', text: 'Отмена' },
                { id: 'ok', type: 'ok', text: 'Пополнить' }
            ]
        }, function(buttonId) {
            if (buttonId === 'ok') {
                tg.openTelegramLink('https://t.me/NeuroFlashStudio_bot');
            }
        });
    } else {
        showNotification(`Недостаточно звёзд! Нужно: ${requiredAmount}, у вас: ${userBalance}`);
    }
}

function showGenerateScreen() {
    const generateScreen = document.getElementById('screen-generate');
    if (!generateScreen) return;
    
    generateScreen.style.display = 'flex';
    setTimeout(() => generateScreen.classList.add('show'), 10);
    
    const titleElement = document.getElementById('generate-title');
    const typeBadge = document.getElementById('type-badge');
    const promptSection = document.getElementById('prompt-section');
    
    if (currentCategory === 'prompt') {
        titleElement.textContent = 'Генерация по описанию';
        typeBadge.textContent = '✨ По описанию';
        promptSection.style.display = 'block';
    } else {
        const category = categories.find(c => c.id === currentCategory);
        titleElement.textContent = `Генерация: ${category?.title || 'Фото'}`;
        typeBadge.textContent = selectedStyle ? `📷 ${selectedStyle}` : `📷 ${category?.title || 'Из фото'}`;
        promptSection.style.display = 'none';
    }
    
    updateTotalPrice();
    checkGenerateButton();
    updateUploadGrid();
}

function hideGenerateScreen() {
    const generateScreen = document.getElementById('screen-generate');
    if (generateScreen) {
        generateScreen.classList.remove('show');
        setTimeout(() => {
            generateScreen.style.display = 'none';
            uploadedImages = [];
            document.getElementById('ai-prompt').value = '';
            selectedStyle = null;
        }, 300);
    }
}

function setupGenerationHandlers() {
    document.getElementById('start-generate-btn').onclick = startGeneration;
    document.getElementById('create-own-generate-btn').onclick = startCreateOwnGeneration;
    document.querySelectorAll('.model-card').forEach(card => {
        card.addEventListener('click', function() {
            document.querySelectorAll('.model-card').forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            selectedModel = this.dataset.model;
            updateTotalPrice();
        });
    });
    document.getElementById('format-select').onchange = function() {
        selectedFormat = this.value;
        updateTotalPrice();
    };
    document.getElementById('ai-prompt').oninput = checkGenerateButton;
}

function checkGenerateButton() {
    const generateBtn = document.getElementById('start-generate-btn');
    const btnText = document.getElementById('generate-btn-text');
    
    const hasPrompt = (document.getElementById('ai-prompt')?.value.trim() || '').length > 0;
    const hasPhotos = uploadedImages.length > 0;
    
    let isEnabled = false;
    if (currentCategory === 'prompt') {
        isEnabled = hasPrompt || hasPhotos;
    } else {
        isEnabled = hasPhotos;
    }
    
    generateBtn.disabled = !isEnabled;
    if (isEnabled) {
        btnText.textContent = `Сгенерировать за ${calculatePrice()} звёзд`;
    } else {
        btnText.textContent = currentCategory === 'prompt' ? 'Введите промпт или фото' : 'Загрузите фото';
    }
}

function startGeneration() {
    const price = calculatePrice();
    if (price > userBalance) {
        showInsufficientBalancePopup(price);
        return;
    }
    showLoadingScreen('photo', {
        category: currentCategory,
        style: selectedStyle,
        model: selectedModel,
        format: selectedFormat,
        price: price,
        images: uploadedImages
    });
}

function calculatePrice() {
    let price = selectedModel === 'nano' ? 7 : 25;
    if (currentCategory === 'create') price += 10;
    return price;
}

function updateTotalPrice() {
    checkGenerateButton(); // This function already updates the button text with the price
}

function setupRealUpload() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.multiple = true;
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);
    
    fileInput.addEventListener('change', function(e) {
        if (e.target.files.length > 0) handleFileUpload(e.target.files);
        fileInput.value = '';
    });
    
    document.body.addEventListener('click', e => {
        if (e.target && e.target.closest('#upload-add-btn')) {
            fileInput.click();
        }
    });
}

function handleFileUpload(files) {
    const maxFiles = 5;
    const canUpload = maxFiles - uploadedImages.length;
    if (files.length > canUpload) {
        showNotification(`Можно загрузить еще ${canUpload} фото.`);
    }
    
    for (let i = 0; i < Math.min(files.length, canUpload); i++) {
        const file = files[i];
        if (!file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) {
            showNotification(`Ошибка файла: ${file.name}`);
            continue;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            uploadedImages.push({ preview: e.target.result, file: file });
            updateUploadGrid();
            checkGenerateButton();
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
        item.innerHTML = `<img src="${img.preview}" alt="Фото ${index + 1}"><div class="upload-remove" data-index="${index}">×</div>`;
        item.querySelector('.upload-remove').onclick = e => {
            e.stopPropagation();
            uploadedImages.splice(index, 1);
            updateUploadGrid();
            checkGenerateButton();
        };
        container.appendChild(item);
    });
    
    if (uploadedImages.length < 5) {
        const addBtn = document.createElement('div');
        addBtn.className = 'upload-item upload-add';
        addBtn.id = 'upload-add-btn';
        addBtn.innerHTML = `<span class="material-icons-round">add</span><span>Добавить фото</span><div class="upload-count">${uploadedImages.length}/5</div>`;
        container.appendChild(addBtn);
    }
}

function setupButtons() {
    // Кнопки-стрелки для навигации в полноэкранном режиме
    document.getElementById('fullscreen-prev-btn').onclick = prevImage;
    document.getElementById('fullscreen-next-btn').onclick = nextImage;
    
    // Кнопки "Назад" и "Закрыть" в оверлеях
    document.querySelectorAll('.back-btn, .close-btn').forEach(btn => {
        btn.onclick = handleBackButton;
    });

    document.getElementById('how-it-works-btn').onclick = () => {
        const overlay = document.getElementById('how-it-works-overlay');
        overlay.style.display = 'flex';
        setTimeout(() => overlay.classList.add('show'), 10);
    };

    document.getElementById('add-balance-profile').onclick = () => showNotification(`Для пополнения баланса откройте приложение в Telegram боте.`);
    document.getElementById('clear-history-btn').onclick = clearHistory;
}

// ... Остальной код, такой как showLoadingScreen, hideLoadingScreen, showGenerationResult, hideGenerationResult, и т.д.
// Они остаются такими же, как в оригинальном файле.
// ...
function updateBalance() {
    const balanceElements = document.querySelectorAll('#header-balance, #profile-balance');
    balanceElements.forEach(el => el.textContent = userBalance);
}

function addToHistoryGenerated(type, data) {
    userBalance -= data.price;
    updateBalance();
    
    const newPhoto = {
        id: Date.now(),
        src: `https://via.placeholder.com/300x400/${['E0F2FE', 'F8E1E7', 'FAF3E0'][Math.floor(Math.random() * 3)]}/1E3A8A?text=New`,
        title: data.title || (data.style ? `${data.category} - ${data.style}` : 'Свой стиль'),
        date: new Date().toLocaleDateString('ru-RU'),
        type: type
    };
    userGeneratedPhotos.unshift(newPhoto);
    
    if (window.addToHistory) {
        window.addToHistory(type, newPhoto.title, `Модель: ${data.model || 'N/A'}`, data.price);
    }
    
    showHistoryBadge();
}

function showHistoryBadge() {
    const badge = document.querySelector('.tab-btn[data-screen="history"] .tab-badge');
    if (badge) badge.style.display = 'block';
}

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

function setupHistoryAndProfile() {
    if (!localStorage.getItem('nanoBananaHistory')) {
        localStorage.setItem('nanoBananaHistory', JSON.stringify([]));
    }
    
    window.addToHistory = function(type, title, description, price) {
        const history = JSON.parse(localStorage.getItem('nanoBananaHistory') || '[]');
        history.unshift({ id: Date.now(), type, title, description, price, date: new Date().toISOString() });
        localStorage.setItem('nanoBananaHistory', JSON.stringify(history));
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
    const container = document.getElementById('history-photos-container');
    const empty = document.getElementById('history-empty');
    if (!container || !empty) return;
    
    const history = JSON.parse(localStorage.getItem('nanoBananaHistory') || '[]');
    document.getElementById('history-count').textContent = history.length;
    
    if (history.length === 0) {
        empty.style.display = 'block';
        container.innerHTML = '';
        return;
    }
    
    empty.style.display = 'none';
    container.innerHTML = '';
    
    history.slice(0, 20).forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'user-photo-card'; // Используем тот же стиль
        historyItem.innerHTML = `
            <img src="${item.src || 'https://via.placeholder.com/300x400'}" alt="${item.title}">
            <div class="photo-overlay">
                <div class="photo-title">${item.title}</div>
                <div class="photo-date">${new Date(item.date).toLocaleDateString('ru-RU')}</div>
            </div>
        `;
        container.appendChild(historyItem);
    });
}

function loadRecentHistory() {
    const container = document.getElementById('recent-list');
    const empty = document.getElementById('recent-empty');
    if (!container || !empty) return;

    const history = JSON.parse(localStorage.getItem('nanoBananaHistory') || '[]');
    if (history.length === 0) {
        empty.style.display = 'block';
        container.innerHTML = '';
        return;
    }
    empty.style.display = 'none';
    container.innerHTML = '';

    history.slice(0, 3).forEach(item => {
        const icon = item.type === 'video' ? '🎬' : item.type === 'photosession' ? '📸' : '📷';
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item'; // Нужен CSS для этого класса
        historyItem.innerHTML = `
            <div class="history-item-icon">${icon}</div>
            <div class="history-item-content">
                <div class="history-item-title">${item.title}</div>
                <div class="history-item-desc">${item.description}</div>
            </div>
            <div class="history-item-price">${item.price} ⭐</div>
        `;
        container.appendChild(historyItem);
    });
}


function updateProfileStats() {
    const history = JSON.parse(localStorage.getItem('nanoBananaHistory') || '[]');
    
    const photoCount = history.filter(item => item.type === 'photo' || item.type === 'create-own').length;
    const photosessionCount = history.filter(item => item.type === 'photosession').length;
    const spentStars = history.reduce((sum, item) => sum + (item.price || 0), 0);
    
    document.getElementById('stats-photos').textContent = photoCount + photosessionCount;
    document.getElementById('stats-videos').textContent = history.filter(item => item.type === 'video').length;
    document.getElementById('stats-spent').textContent = spentStars;
    document.getElementById('stats-saved').textContent = history.length;
    
    const totalActions = history.length;
    let level = '👶 Новичок';
    if (totalActions > 50) level = '👑 Профессионал';
    else if (totalActions > 20) level = '⭐ Опытный';
    else if (totalActions > 5) level = '🌱 Начинающий';
    
    document.getElementById('profile-level').textContent = level;
}
