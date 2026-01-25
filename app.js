/**
 * Nano Banana AI Photo - Old Money Edition
 * Версия 6.0: Рефакторинг кода для улучшения читаемости и поддерживаемости
 */

// ========== КОНСТАНТЫ И КОНФИГУРАЦИЯ ==========
const CONFIG = {
    MAX_UPLOAD_FILES: 5,
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    PHOTOSESSION_MIN_FRAMES: 10,
    PHOTOSESSION_MAX_FRAMES: 20,
    PHOTOSESSION_BASE_PRICE: 159,
    PHOTOSESSION_EXTRA_FRAME_PRICE: 15,
    PHOTOSESSION_BONUS_FRAMES: 3,
    CREATE_OWN_PRICE: 10,
    MODEL_PRICES: { nano: 7, pro: 25 },
    INACTIVITY_TIMEOUT: 3000,
    GENERATION_DELAY: 3000
};

const CATEGORIES = [
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

// ========== ДАННЫЕ СТИЛЕЙ ==========
const STYLE_EXAMPLES = {
    winter: [
        { id: 1, name: "Снежная королева", icon: "👑", color: "#4FC3F7", preview: "https://via.placeholder.com/300x400/64B5F6/FFFFFF?text=❄️+Королева" },
        { id: 2, name: "Зимний лес", icon: "🌲", color: "#81C784", preview: "https://via.placeholder.com/300x400/64B5F6/FFFFFF?text=❄️+Лес" },
        { id: 3, name: "Новогоднее настроение", icon: "🎄", color: "#FF8A65", preview: "https://via.placeholder.com/300x400/64B5F6/FFFFFF?text=❄️+НГ" },
        { id: 4, name: "Лыжный курорт", icon: "⛷️", color: "#64B5F6", preview: "https://via.placeholder.com/300x400/64B5F6/FFFFFF?text=❄️+Лыжи" },
        { id: 5, name: "Морозные узоры", icon: "❄️", color: "#90CAF9", preview: "https://via.placeholder.com/300x400/64B5F6/FFFFFF?text=❄️+Узоры" },
        { id: 6, name: "Рождественский вечер", icon: "🎅", color: "#E57373", preview: "https://via.placeholder.com/300x400/64B5F6/FFFFFF?text=❄️+Рождество" }
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
        { id: 3, name: "Футуризм", icon: "🚀", color: "#4DB6AC", preview: "https://via.placeholder.com/300x400/FF5722/FFFFFF?text=🔥+Футуризм" },
        { id: 4, name: "Минимализм", icon: "⬜", color: "#90A4AE", preview: "https://via.placeholder.com/300x400/FF5722/FFFFFF?text=🔥+Мин" }
    ],
    couples: [
        { id: 1, name: "Романтический вечер", icon: "💕", color: "#F06292", preview: "https://via.placeholder.com/300x400/EC407A/FFFFFF?text=👫+Вечер" },
        { id: 2, name: "Прогулка в парке", icon: "🌳", color: "#81C784", preview: "https://via.placeholder.com/300x400/EC407A/FFFFFF?text=👫+Парк" },
        { id: 3, name: "Пляжный закат", icon: "🌅", color: "#FFB74D", preview: "https://via.placeholder.com/300x400/EC407A/FFFFFF?text=👫+Закат" }
    ],
    girls: [
        { id: 1, name: "Стиль принцессы", icon: "👸", color: "#CE93D8", preview: "https://via.placeholder.com/300x400/E91E63/FFFFFF?text=💃+Принцесса" },
        { id: 2, name: "Деловой образ", icon: "💼", color: "#80CBC4", preview: "https://via.placeholder.com/300x400/E91E63/FFFFFF?text=💃+Деловой" },
        { id: 3, name: "Спортивный шик", icon: "👟", color: "#FFAB91", preview: "https://via.placeholder.com/300x400/E91E63/FFFFFF?text=💃+Спорт" }
    ],
    men: [
        { id: 1, name: "Классический костюм", icon: "🤵", color: "#78909C", preview: "https://via.placeholder.com/300x400/42A5F5/FFFFFF?text=🕺+Костюм" },
        { id: 2, name: "Спортивный стиль", icon: "🏃", color: "#42A5F5", preview: "https://via.placeholder.com/300x400/42A5F5/FFFFFF?text=🕺+Спорт" },
        { id: 3, name: "Кэжуал образ", icon: "👕", color: "#26A69A", preview: "https://via.placeholder.com/300x400/42A5F5/FFFFFF?text=🕺+Кэжуал" }
    ],
    pets: [
        { id: 1, name: "Домашний любимец", icon: "🐶", color: "#FFD54F", preview: "https://via.placeholder.com/300x400/81C784/FFFFFF?text=🐾+Питомец" },
        { id: 2, name: "Игривый момент", icon: "🎾", color: "#AED581", preview: "https://via.placeholder.com/300x400/81C784/FFFFFF?text=🐾+Игра" },
        { id: 3, name: "Портрет питомца", icon: "📷", color: "#80DEEA", preview: "https://via.placeholder.com/300x400/81C784/FFFFFF?text=🐾+Портрет" }
    ],
    professions: [
        { id: 1, name: "Врач", icon: "👨‍⚕️", color: "#EF5350", preview: "https://via.placeholder.com/300x400/78909C/FFFFFF?text=💼+Врач" },
        { id: 2, name: "Программист", icon: "💻", color: "#42A5F5", preview: "https://via.placeholder.com/300x400/78909C/FFFFFF?text=💼+Программист" },
        { id: 3, name: "Учитель", icon: "👩‍🏫", color: "#66BB6A", preview: "https://via.placeholder.com/300x400/78909C/FFFFFF?text=💼+Учитель" },
        { id: 4, name: "Повар", icon: "👨‍🍳", color: "#FFA726", preview: "https://via.placeholder.com/300x400/78909C/FFFFFF?text=💼+Повар" }
    ],
    luxury: [
        { id: 1, name: "Золотой шик", icon: "💰", color: "#FFD700", preview: "https://via.placeholder.com/300x400/FFD700/FFFFFF?text=💎+Золото" },
        { id: 2, name: "Алмазный блеск", icon: "💎", color: "#B39DDB", preview: "https://via.placeholder.com/300x400/FFD700/FFFFFF?text=💎+Алмаз" },
        { id: 3, name: "Шикарный вечер", icon: "🍾", color: "#F8BBD0", preview: "https://via.placeholder.com/300x400/FFD700/FFFFFF?text=💎+Вечер" }
    ]
};

// ========== ДАННЫЕ ФОТОСЕССИЙ ==========
const PHOTOSESSION_CATEGORIES = [
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
            { id: 6, name: "Рождественский вечер", preview: "https://via.placeholder.com/300x400/64B5F6/FFFFFF?text=❄️+6", views: 18700, rating: 5.0 },
            { id: 7, name: "Зимний город", preview: "https://via.placeholder.com/300x400/64B5F6/FFFFFF?text=❄️+7", views: 9500, rating: 5.0 },
            { id: 8, name: "Снеговик", preview: "https://via.placeholder.com/300x400/64B5F6/FFFFFF?text=❄️+8", views: 11200, rating: 5.0 }
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

// ========== ТЕСТОВЫЕ ДАННЫЕ ==========
const MOCK_GENERATED_PHOTOS = [
    { id: 1, src: 'https://via.placeholder.com/300x400/E0F2FE/1E3A8A?text=Зима+1', title: 'Зимняя сказка', date: '23.01.2026', type: 'photo' },
    { id: 2, src: 'https://via.placeholder.com/300x400/F8E1E7/B76E79?text=ДР+2', title: 'Розовый закат', date: '22.01.2026', type: 'photo' },
    { id: 3, src: 'https://via.placeholder.com/300x400/FAF3E0/374151?text=Элегант+3', title: 'Элегантность', date: '21.01.2026', type: 'photo' },
    { id: 4, src: 'https://via.placeholder.com/300x400/E0F2FE/1E3A8A?text=Город+4', title: 'Городские огни', date: '20.01.2026', type: 'photosession' },
    { id: 5, src: 'https://via.placeholder.com/300x400/F8E1E7/B76E79?text=Роман+5', title: 'Романтика', date: '19.01.2026', type: 'photo' },
    { id: 6, src: 'https://via.placeholder.com/300x400/FAF3E0/374151?text=Мин+6', title: 'Минимализм', date: '18.01.2026', type: 'photo' },
    { id: 7, src: 'https://via.placeholder.com/300x400/E0F2FE/1E3A8A?text=Природа+7', title: 'Природа', date: '17.01.2026', type: 'photosession' },
    { id: 8, src: 'https://via.placeholder.com/300x400/F8E1E7/B76E79?text=Стиль+8', title: 'Стиль', date: '16.01.2026', type: 'photo' }
];

// ========== СОСТОЯНИЕ ПРИЛОЖЕНИЯ ==========
const AppState = {
    userBalance: 85,
    uploadedImages: [],
    currentCategory: null,
    selectedModel: 'nano',
    selectedFormat: '1:1',
    selectedStyle: null,
    uploadedExample: null,
    uploadedFace: null,
    photosessionFrames: 10,
    selectedPhotoForSession: null,
    userGeneratedPhotos: [],
    selectedCategoryForModal: null,
    currentPhotosessionCategory: null,
    currentGalleryIndex: 0,
    currentGalleryImages: [],
    inactivityTimer: null,
    currentGenerationType: null,
    currentGenerationData: null
};

// ========== УТИЛИТЫ ==========
const Utils = {
    /**
     * Склонение слова "стиль" в зависимости от числа
     */
    getStyleWord(count) {
        if (count % 10 === 1 && count % 100 !== 11) return 'стиль';
        if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return 'стиля';
        return 'стилей';
    },

    /**
     * Форматирование числа просмотров
     */
    formatViews(views) {
        return views >= 1000 ? (views / 1000).toFixed(1) + 'K' : views.toString();
    },

    /**
     * Валидация файла изображения
     */
    validateImageFile(file) {
        if (!file.type.startsWith('image/')) {
            return { valid: false, error: 'Пожалуйста, загружайте только изображения' };
        }
        if (file.size > CONFIG.MAX_FILE_SIZE) {
            return { valid: false, error: `Фото слишком большое (макс. ${CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB)` };
        }
        return { valid: true };
    },

    /**
     * Создание превью изображения из файла
     */
    createImagePreview(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve({
                preview: e.target.result,
                file: file,
                name: file.name
            });
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    },

    /**
     * Генерация случайного изображения-заглушки
     */
    generatePlaceholderImage(text = 'Результат', width = 400, height = 533) {
        const colors = ['E0F2FE', 'F8E1E7', 'FAF3E0', 'E0F7FA', 'F3E5F5'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const randomNum = Math.floor(Math.random() * 1000);
        return `https://via.placeholder.com/${width}x${height}/${randomColor}/1E3A8A?text=${encodeURIComponent(text)}+${randomNum}`;
    }
};

// ========== УПРАВЛЕНИЕ УВЕДОМЛЕНИЯМИ ==========
const NotificationManager = {
    /**
     * Показать уведомление
     */
    show(message, duration = 3000) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }
};

// ========== УПРАВЛЕНИЕ БАЛАНСОМ ==========
const BalanceManager = {
    /**
     * Обновить отображение баланса
     */
    update() {
        const headerBalance = document.getElementById('header-balance');
        const profileBalance = document.getElementById('profile-balance');
        if (headerBalance) headerBalance.textContent = AppState.userBalance;
        if (profileBalance) profileBalance.textContent = AppState.userBalance;
    },

    /**
     * Проверить достаточность баланса
     */
    check(requiredAmount) {
        return AppState.userBalance >= requiredAmount;
    },

    /**
     * Списать средства
     */
    deduct(amount) {
        if (this.check(amount)) {
            AppState.userBalance -= amount;
            this.update();
            return true;
        }
        return false;
    },

    /**
     * Показать попап о недостатке баланса
     */
    showInsufficientPopup(requiredAmount) {
        const missingAmount = requiredAmount - AppState.userBalance;
        const message = `Telegram баланс: ${AppState.userBalance}\nНе хватает: ${missingAmount} звёзд\n\nПополнить баланс в боте?`;

        if (window.Telegram?.WebApp) {
            window.Telegram.WebApp.showPopup({
                title: 'Недостаточно звёзд',
                message: message,
                buttons: [
                    { id: 'exit', type: 'default', text: 'Выход' },
                    { id: 'ok', type: 'ok', text: 'ОК' }
                ]
            }, (buttonId) => {
                if (buttonId === 'ok') {
                    window.Telegram.WebApp.openTelegramLink('https://t.me/NeuroFlashStudio_bot');
                }
            });
        } else {
            NotificationManager.show(`Недостаточно звёзд! Нужно: ${requiredAmount}, у вас: ${AppState.userBalance}`);
        }
    }
};

// ========== РАСЧЕТ ЦЕНЫ ==========
const PriceCalculator = {
    /**
     * Рассчитать цену генерации
     */
    calculate() {
        let price = CONFIG.MODEL_PRICES[AppState.selectedModel] || CONFIG.MODEL_PRICES.nano;
        if (AppState.currentCategory === 'create') price += CONFIG.CREATE_OWN_PRICE;
        if (AppState.selectedStyle?.includes('люкс') || AppState.selectedStyle?.includes('Luxury')) {
            price += 15;
        }
        return price;
    },

    /**
     * Рассчитать цену фотосессии
     */
    calculatePhotosession() {
        const extraFrames = Math.max(0, AppState.photosessionFrames - CONFIG.PHOTOSESSION_MIN_FRAMES);
        return CONFIG.PHOTOSESSION_BASE_PRICE + (extraFrames * CONFIG.PHOTOSESSION_EXTRA_FRAME_PRICE);
    }
};

// ========== УПРАВЛЕНИЕ ЭКРАНАМИ ==========
const ScreenManager = {
    /**
     * Переключить экран
     */
    switch(screenId) {
        const screens = document.querySelectorAll('.screen');
        screens.forEach(screen => screen.classList.remove('active'));

        this.hideAllModals();

        const targetScreen = document.getElementById(`screen-${screenId}`);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.updateTabButtons(screenId);
            this.loadScreenContent(screenId);
        }
    },

    /**
     * Обновить активные кнопки табов
     */
    updateTabButtons(screenId) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.screen === screenId);
        });
    },

    /**
     * Загрузить контент экрана
     */
    loadScreenContent(screenId) {
        const loaders = {
            'photo': () => {
                PhotoManager.loadCategories();
                PhotoManager.loadHorizontalCategories();
            },
            'photosession': () => {
                PhotosessionManager.loadUserPhotos();
                PhotosessionManager.loadHorizontalCategories();
            },
            'history': () => HistoryManager.load(),
            'profile': () => ProfileManager.updateStats()
        };

        if (loaders[screenId]) loaders[screenId]();
    },

    /**
     * Скрыть все модальные окна
     */
    hideAllModals() {
        ModalManager.hideAll();
    }
};

// ========== УПРАВЛЕНИЕ МОДАЛЬНЫМИ ОКНАМИ ==========
const ModalManager = {
    /**
     * Показать модальное окно
     */
    show(modalId, callback) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('show');
            if (callback) callback();
        }, 10);
    },

    /**
     * Скрыть модальное окно
     */
    hide(modalId, callback) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
            if (callback) callback();
        }, 300);
    },

    /**
     * Скрыть все модальные окна
     */
    hideAll() {
        const modals = ['category-modal', 'photosession-gallery-modal', 'photosession-series-modal',
                        'fullscreen-viewer', 'photosession-modal', 'how-it-works-overlay',
                        'screen-generate', 'generation-result-modal', 'loading-screen'];
        modals.forEach(id => this.hide(id));
    }
};

// ========== УПРАВЛЕНИЕ ФОТО ==========
const PhotoManager = {
    /**
     * Загрузить категории фото
     */
    loadCategories() {
        const container = document.getElementById('categories-container');
        if (!container) return;

        container.innerHTML = `
            <div class="horizontal-cards-container">
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
            </div>
            <div class="horizontal-categories" id="horizontal-categories-main"></div>
        `;

        this.setupCategoryButtons();
        this.loadHorizontalCategories();
    },

    /**
     * Настроить кнопки категорий
     */
    setupCategoryButtons() {
        const promptBtn = document.getElementById('prompt-generate-btn');
        if (promptBtn) {
            promptBtn.addEventListener('click', () => {
                AppState.currentCategory = 'prompt';
                AppState.selectedStyle = null;
                GenerateManager.showScreen();
            });
        }

        const createOwnCard = document.querySelector('.create-own-card');
        if (createOwnCard) {
            createOwnCard.addEventListener('click', () => {
                AppState.currentCategory = 'create';
                AppState.selectedStyle = null;
                AppState.uploadedExample = null;
                AppState.uploadedFace = null;
                CreateOwnManager.show();
            });
        }
    },

    /**
     * Загрузить горизонтальные категории
     */
    loadHorizontalCategories() {
        const container = document.getElementById('horizontal-categories-main') || 
                         document.getElementById('horizontal-categories');
        if (!container) return;

        container.innerHTML = '';
        const mainCategories = CATEGORIES.filter(cat => cat.id !== 'create');

        mainCategories.forEach(category => {
            const section = this.createCategorySection(category);
            container.appendChild(section);
        });
    },

    /**
     * Создать секцию категории
     */
    createCategorySection(category) {
        const section = document.createElement('div');
        section.className = 'horizontal-category-section';

        const stylesCount = STYLE_EXAMPLES[category.id]?.length || 0;
        const styleWord = Utils.getStyleWord(stylesCount);

        section.innerHTML = `
            <div class="horizontal-category-header">
                <h3 class="horizontal-category-title">${category.title}</h3>
                <button class="view-all-btn" data-category="${category.id}">
                    Все ${stylesCount} ${styleWord}
                    <span class="material-icons-round">arrow_forward</span>
                </button>
            </div>
            <div class="horizontal-scroll-container" id="scroll-${category.id}"></div>
        `;

        const scrollContainer = section.querySelector('.horizontal-scroll-container');
        const styles = STYLE_EXAMPLES[category.id] || [];
        const displayStyles = styles.slice(0, 5);

        displayStyles.forEach(style => {
            scrollContainer.appendChild(this.createStyleCard(style, category.id));
        });

        if (styles.length > 5) {
            scrollContainer.appendChild(this.createAllStylesCard(category.id, stylesCount, styleWord));
        }

        this.setupCategorySectionHandlers(section, category);
        return section;
    },

    /**
     * Создать карточку стиля
     */
    createStyleCard(style, categoryId) {
        const card = document.createElement('div');
        card.className = 'horizontal-style-card';
        card.dataset.category = categoryId;
        card.dataset.styleId = style.id;

        card.innerHTML = `
            <div class="horizontal-style-preview">
                <img src="${style.preview}" alt="${style.name}">
            </div>
            <div class="horizontal-style-name">${style.name}</div>
        `;

        card.addEventListener('click', () => {
            AppState.selectedStyle = style.name;
            AppState.selectedCategoryForModal = categoryId;
            CategoryModalManager.show(categoryId);
        });

        return card;
    },

    /**
     * Создать карточку "Все стили"
     */
    createAllStylesCard(categoryId, stylesCount, styleWord) {
        const card = document.createElement('div');
        card.className = 'horizontal-style-card all-styles-card';
        card.dataset.category = categoryId;

        card.innerHTML = `
            <div class="all-styles-icon">
                <span class="material-icons-round">more_horiz</span>
            </div>
            <div class="all-styles-text">
                <div>Все</div>
                <div class="all-styles-count">${stylesCount} ${styleWord}</div>
            </div>
        `;

        card.addEventListener('click', () => {
            AppState.selectedCategoryForModal = categoryId;
            CategoryModalManager.show(categoryId);
        });

        return card;
    },

    /**
     * Настроить обработчики секции категории
     */
    setupCategorySectionHandlers(section, category) {
        const titleElement = section.querySelector('.horizontal-category-title');
        const viewAllBtn = section.querySelector('.view-all-btn');

        const showModal = () => {
            AppState.selectedCategoryForModal = category.id;
            CategoryModalManager.show(category.id);
        };

        if (titleElement) titleElement.addEventListener('click', showModal);
        if (viewAllBtn) {
            viewAllBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showModal();
            });
        }
    }
};

// ========== МОДАЛЬНОЕ ОКНО КАТЕГОРИИ ==========
const CategoryModalManager = {
    /**
     * Показать модальное окно категории
     */
    show(categoryId) {
        const category = CATEGORIES.find(c => c.id === categoryId);
        if (!category) return;

        const titleElement = document.getElementById('category-modal-title');
        if (titleElement) titleElement.textContent = category.title;

        const container = document.getElementById('category-styles-container');
        if (container) {
            container.innerHTML = '';
            const styles = STYLE_EXAMPLES[categoryId] || [];

            styles.forEach(style => {
                container.appendChild(this.createModalStyleCard(style, categoryId));
            });
        }

        ModalManager.show('category-modal');
    },

    /**
     * Создать карточку стиля в модальном окне
     */
    createModalStyleCard(style, categoryId) {
        const card = document.createElement('div');
        card.className = 'modal-style-card';
        card.style.borderColor = style.color + '50';
        card.style.backgroundColor = style.color + '15';

        card.innerHTML = `
            <div class="modal-style-preview">
                <img src="${style.preview}" alt="${style.name}">
            </div>
            <div class="modal-style-name">${style.name}</div>
        `;

        card.addEventListener('click', () => {
            AppState.selectedStyle = style.name;
            AppState.currentCategory = categoryId;
            ModalManager.hide('category-modal', () => {
                GenerateManager.showScreen();
            });
        });

        return card;
    }
};

// ========== УПРАВЛЕНИЕ ГЕНЕРАЦИЕЙ ==========
const GenerateManager = {
    /**
     * Показать экран генерации
     */
    showScreen() {
        const generateScreen = document.getElementById('screen-generate');
        if (!generateScreen) return;

        generateScreen.style.display = 'flex';
        setTimeout(() => generateScreen.classList.add('show'), 10);

        this.updateTitle();
        this.setupFormatSelect();
        this.updateTotalPrice();
        this.setupPromptField();
        this.checkGenerateButton();
        UploadManager.updateGrid();
    },

    /**
     * Обновить заголовок экрана генерации
     */
    updateTitle() {
        const titleElement = document.getElementById('generate-title');
        const typeBadge = document.getElementById('type-badge');
        const promptSection = document.getElementById('prompt-section');

        if (AppState.currentCategory === 'prompt') {
            if (titleElement) titleElement.textContent = 'Генерация по описанию';
            if (typeBadge) typeBadge.textContent = '✨ По описанию';
            if (promptSection) promptSection.style.display = 'block';
        } else {
            const category = CATEGORIES.find(c => c.id === AppState.currentCategory);
            if (titleElement) titleElement.textContent = `Генерация: ${category?.title || 'Фото'}`;
            if (typeBadge) {
                typeBadge.textContent = AppState.selectedStyle ? 
                    `📷 ${AppState.selectedStyle}` : 
                    `📷 ${category?.title || 'Из фото'}`;
            }
            if (promptSection) promptSection.style.display = 'none';
        }
    },

    /**
     * Настроить выбор формата
     */
    setupFormatSelect() {
        const formatSelect = document.getElementById('format-select');
        if (!formatSelect) return;

        formatSelect.value = AppState.selectedFormat;
        formatSelect.addEventListener('change', function() {
            AppState.selectedFormat = this.value;
            GenerateManager.updateTotalPrice();
        });
    },

    /**
     * Настроить поле промпта
     */
    setupPromptField() {
        const promptTextarea = document.getElementById('ai-prompt');
        const charCount = document.getElementById('char-count');
        const exampleChips = document.querySelectorAll('.example-chip');

        if (!promptTextarea || !charCount) return;

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

            GenerateManager.checkGenerateButton();
        });

        exampleChips.forEach(chip => {
            chip.addEventListener('click', function() {
                const example = this.dataset.example;
                promptTextarea.value = example;
                promptTextarea.dispatchEvent(new Event('input'));
                promptTextarea.focus();
            });
        });

        if (AppState.currentCategory === 'prompt') {
            setTimeout(() => promptTextarea.focus(), 300);
        }
    },

    /**
     * Проверить состояние кнопки генерации
     */
    checkGenerateButton() {
        const generateBtn = document.getElementById('start-generate-btn');
        const btnText = document.getElementById('generate-btn-text');
        const hintText = document.getElementById('generate-hint');

        if (!generateBtn || !btnText || !hintText) return;

        const prompt = document.getElementById('ai-prompt')?.value.trim() || '';
        const hasPrompt = prompt.length > 0;
        const hasPhotos = AppState.uploadedImages.length > 0;

        let isEnabled = false;
        let text = 'Введите промпт';
        let hint = 'Заполните поле "Опишите изображение" для генерации';

        if (AppState.currentCategory === 'prompt') {
            isEnabled = hasPrompt || hasPhotos;
            text = hasPrompt ? `Сгенерировать за ${PriceCalculator.calculate()} звёзд` : 'Введите промпт';
            hint = hasPrompt ? 'Готово к генерации!' : 
                   hasPhotos ? 'Готово к генерации по фото!' : 
                   'Заполните поле "Опишите изображение" для генерации';
        } else {
            isEnabled = hasPhotos;
            text = hasPhotos ? `Сгенерировать за ${PriceCalculator.calculate()} звёзд` : 'Загрузите фото';
            hint = hasPhotos ? 'Готово к генерации!' : 'Загрузите хотя бы одно фото';
        }

        generateBtn.disabled = !isEnabled;
        btnText.textContent = text;
        hintText.textContent = hint;
        hintText.style.color = isEnabled ? '#4CAF50' : '#ff9800';

        const icon = generateBtn.querySelector('.generate-icon');
        if (icon) icon.textContent = isEnabled ? '✨' : '📝';
    },

    /**
     * Обновить общую цену
     */
    updateTotalPrice() {
        const price = PriceCalculator.calculate();
        const btnText = document.getElementById('generate-btn-text');
        if (btnText) {
            const generateBtn = document.getElementById('start-generate-btn');
            if (!generateBtn.disabled) {
                btnText.textContent = `Сгенерировать за ${price} звёзд`;
            }
        }
        this.checkGenerateButton();
    },

    /**
     * Начать генерацию
     */
    start() {
        const price = PriceCalculator.calculate();

        if (!BalanceManager.check(price)) {
            BalanceManager.showInsufficientPopup(price);
            return;
        }

        if (AppState.uploadedImages.length === 0 && AppState.currentCategory !== 'prompt') {
            NotificationManager.show('Пожалуйста, загрузите хотя бы одно фото для генерации');
            return;
        }

        LoadingManager.show('photo', {
            category: AppState.currentCategory,
            style: AppState.selectedStyle,
            model: AppState.selectedModel,
            format: AppState.selectedFormat,
            price: price,
            images: AppState.uploadedImages
        });
    },

    /**
     * Скрыть экран генерации
     */
    hide() {
        const generateScreen = document.getElementById('screen-generate');
        if (!generateScreen) return;

        generateScreen.classList.remove('show');
        setTimeout(() => {
            generateScreen.style.display = 'none';
            AppState.uploadedImages = [];
            UploadManager.updateGrid();
            this.resetModelSelection();
            this.resetFormatSelection();
            this.resetPromptField();
            AppState.selectedStyle = null;
        }, 300);
    },

    /**
     * Сбросить выбор модели
     */
    resetModelSelection() {
        document.querySelectorAll('.model-card').forEach(card => {
            card.classList.remove('selected');
        });
        const nanoModel = document.querySelector('.model-card[data-model="nano"]');
        if (nanoModel) nanoModel.classList.add('selected');
        AppState.selectedModel = 'nano';
    },

    /**
     * Сбросить выбор формата
     */
    resetFormatSelection() {
        const formatSelect = document.getElementById('format-select');
        if (formatSelect) {
            formatSelect.value = '1:1';
            AppState.selectedFormat = '1:1';
        }
    },

    /**
     * Сбросить поле промпта
     */
    resetPromptField() {
        const promptField = document.getElementById('ai-prompt');
        if (promptField) promptField.value = '';

        const charCount = document.getElementById('char-count');
        if (charCount) {
            charCount.textContent = '0';
            charCount.style.color = '#777';
        }
    }
};

// ========== УПРАВЛЕНИЕ ЗАГРУЗКОЙ ФАЙЛОВ ==========
const UploadManager = {
    fileInput: null,

    /**
     * Инициализация загрузки файлов
     */
    init() {
        this.fileInput = document.createElement('input');
        this.fileInput.type = 'file';
        this.fileInput.accept = 'image/*';
        this.fileInput.multiple = true;
        this.fileInput.style.display = 'none';
        document.body.appendChild(this.fileInput);

        this.fileInput.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            if (files.length > 0) {
                this.handleFiles(files);
            }
            this.fileInput.value = '';
        });

        const uploadBtn = document.getElementById('upload-add-btn');
        if (uploadBtn) {
            uploadBtn.addEventListener('click', () => this.fileInput.click());
        }
    },

    /**
     * Обработать загруженные файлы
     */
    async handleFiles(files) {
        const remaining = CONFIG.MAX_UPLOAD_FILES - AppState.uploadedImages.length;

        if (files.length > remaining) {
            NotificationManager.show(`Можно загрузить не более ${CONFIG.MAX_UPLOAD_FILES} фото. Осталось мест: ${remaining}`);
            return;
        }

        for (let i = 0; i < Math.min(files.length, remaining); i++) {
            const file = files[i];
            const validation = Utils.validateImageFile(file);

            if (!validation.valid) {
                NotificationManager.show(validation.error);
                continue;
            }

            try {
                const imageData = await Utils.createImagePreview(file);
                AppState.uploadedImages.push(imageData);
                this.updateGrid();
                GenerateManager.checkGenerateButton();
                NotificationManager.show(`Добавлено фото ${AppState.uploadedImages.length}/${CONFIG.MAX_UPLOAD_FILES}`);
            } catch (error) {
                NotificationManager.show('Ошибка при загрузке файла');
            }
        }
    },

    /**
     * Обновить сетку загруженных изображений
     */
    updateGrid() {
        const container = document.getElementById('upload-grid');
        if (!container) return;

        container.innerHTML = '';

        AppState.uploadedImages.forEach((img, index) => {
            const item = document.createElement('div');
            item.className = 'upload-item';
            item.innerHTML = `
                <img src="${img.preview}" alt="Фото ${index + 1}">
                <div class="upload-remove" data-index="${index}">×</div>
            `;

            const removeBtn = item.querySelector('.upload-remove');
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                AppState.uploadedImages.splice(index, 1);
                this.updateGrid();
                GenerateManager.checkGenerateButton();
                NotificationManager.show('Фото удалено');
            });

            container.appendChild(item);
        });

        if (AppState.uploadedImages.length < CONFIG.MAX_UPLOAD_FILES) {
            const addBtn = document.createElement('div');
            addBtn.className = 'upload-item upload-add';
            addBtn.id = 'upload-add-btn';
            addBtn.innerHTML = `
                <span class="material-icons-round">add</span>
                <span>Добавить фото</span>
                <div class="upload-count">${AppState.uploadedImages.length}/${CONFIG.MAX_UPLOAD_FILES}</div>
            `;
            addBtn.addEventListener('click', () => this.fileInput.click());
            container.appendChild(addBtn);
        }
    }
};

// ========== УПРАВЛЕНИЕ СОЗДАНИЕМ СВОЕГО СТИЛЯ ==========
const CreateOwnManager = {
    /**
     * Показать экран создания своего стиля
     */
    show() {
        const createScreen = document.getElementById('screen-create-own');
        if (!createScreen) return;

        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        createScreen.classList.add('active');

        AppState.uploadedExample = null;
        AppState.uploadedFace = null;
        this.updateUploads();
        this.checkButton();

        const howItWorksBtn = document.getElementById('how-it-works-btn');
        if (howItWorksBtn) howItWorksBtn.onclick = () => ModalManager.show('how-it-works-overlay');
    },

    /**
     * Обновить отображение загруженных фото
     */
    updateUploads() {
        const exampleContainer = document.getElementById('example-container');
        const faceContainer = document.getElementById('face-container');

        if (exampleContainer) {
            exampleContainer.innerHTML = AppState.uploadedExample ? 
                `<div class="uploaded-photo">
                    <img src="${AppState.uploadedExample.preview}" alt="Пример">
                    <button class="remove-photo" onclick="CreateOwnManager.removeExample()">×</button>
                </div>` :
                `<div class="upload-placeholder" onclick="CreateOwnManager.uploadExample()">
                    <span class="material-icons-round">add_photo_alternate</span>
                    <span class="upload-label">Фото пример</span>
                    <span class="upload-subtitle">Пример из интернета</span>
                </div>`;
        }

        if (faceContainer) {
            faceContainer.innerHTML = AppState.uploadedFace ? 
                `<div class="uploaded-photo">
                    <img src="${AppState.uploadedFace.preview}" alt="Ваше фото">
                    <button class="remove-photo" onclick="CreateOwnManager.removeFace()">×</button>
                </div>` :
                `<div class="upload-placeholder" onclick="CreateOwnManager.uploadFace()">
                    <span class="material-icons-round">person_add</span>
                    <span class="upload-label">Ваше фото</span>
                    <span class="upload-subtitle">Ваше лицо</span>
                </div>`;
        }
    },

    /**
     * Загрузить пример
     */
    async uploadExample() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const validation = Utils.validateImageFile(file);
            if (!validation.valid) {
                NotificationManager.show(validation.error);
                return;
            }

            try {
                AppState.uploadedExample = await Utils.createImagePreview(file);
                this.updateUploads();
                this.checkButton();
                NotificationManager.show('Пример загружен');
            } catch (error) {
                NotificationManager.show('Ошибка при загрузке файла');
            }
        };
        input.click();
    },

    /**
     * Загрузить лицо
     */
    async uploadFace() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const validation = Utils.validateImageFile(file);
            if (!validation.valid) {
                NotificationManager.show(validation.error);
                return;
            }

            try {
                AppState.uploadedFace = await Utils.createImagePreview(file);
                this.updateUploads();
                this.checkButton();
                NotificationManager.show('Лицо загружено');
            } catch (error) {
                NotificationManager.show('Ошибка при загрузке файла');
            }
        };
        input.click();
    },

    /**
     * Удалить пример
     */
    removeExample() {
        AppState.uploadedExample = null;
        this.updateUploads();
        this.checkButton();
    },

    /**
     * Удалить лицо
     */
    removeFace() {
        AppState.uploadedFace = null;
        this.updateUploads();
        this.checkButton();
    },

    /**
     * Проверить состояние кнопки генерации
     */
    checkButton() {
        const generateBtn = document.getElementById('create-own-generate-btn');
        const btnText = document.getElementById('create-own-btn-text');

        if (!generateBtn || !btnText) return;

        const hasBothPhotos = AppState.uploadedExample && AppState.uploadedFace;

        generateBtn.disabled = !hasBothPhotos;
        btnText.textContent = hasBothPhotos ? 
            `Сгенерировать за ${CONFIG.CREATE_OWN_PRICE} звёзд` : 
            'Загрузите оба фото';

        const icon = generateBtn.querySelector('.generate-icon');
        if (icon) icon.textContent = hasBothPhotos ? '✨' : '📷';
    },

    /**
     * Начать генерацию своего стиля
     */
    start() {
        if (!AppState.uploadedExample || !AppState.uploadedFace) {
            NotificationManager.show('Загрузите оба фото для генерации');
            return;
        }

        if (!BalanceManager.check(CONFIG.CREATE_OWN_PRICE)) {
            BalanceManager.showInsufficientPopup(CONFIG.CREATE_OWN_PRICE);
            return;
        }

        LoadingManager.show('create-own', {
            title: 'Создание своего стиля',
            example: AppState.uploadedExample,
            face: AppState.uploadedFace,
            price: CONFIG.CREATE_OWN_PRICE
        });
    }
};

// ========== УПРАВЛЕНИЕ ЗАГРУЗКОЙ ==========
const LoadingManager = {
    /**
     * Показать экран загрузки
     */
    show(type, data) {
        AppState.currentGenerationType = type;
        AppState.currentGenerationData = data;

        const loadingScreen = document.getElementById('loading-screen');
        if (!loadingScreen) return;

        loadingScreen.classList.add('active');
        loadingScreen.style.display = 'flex';

        const title = document.getElementById('loading-title');
        if (title) {
            const titles = {
                'photosession': 'Идет создание фотосессии',
                'create-own': 'Идет создание своего стиля',
                'photo': 'Идет генерация фото'
            };
            title.textContent = titles[type] || 'Идет генерация';
        }

        setTimeout(() => {
            this.hide();
            ResultManager.show(type, data);
        }, CONFIG.GENERATION_DELAY);
    },

    /**
     * Скрыть экран загрузки
     */
    hide() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.remove('active');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 300);
        }
    }
};

// ========== УПРАВЛЕНИЕ РЕЗУЛЬТАТАМИ ==========
const ResultManager = {
    /**
     * Показать результат генерации
     */
    show(type, data) {
        const modal = document.getElementById('generation-result-modal');
        if (!modal) return;

        const title = document.getElementById('result-title');
        const image = document.getElementById('result-image');
        const downloadBtn = document.getElementById('result-download-btn');

        if (title) {
            const titles = {
                'photosession': 'Фотосессия создана!',
                'create-own': 'Стиль создан!',
                'photo': 'Генерация завершена!'
            };
            title.textContent = titles[type] || 'Генерация завершена!';
        }

        if (image) {
            image.src = Utils.generatePlaceholderImage('Результат');
            image.alt = 'Сгенерированное изображение';
        }

        if (downloadBtn) {
            downloadBtn.onclick = () => {
                const typeName = type === 'photosession' ? 'фотосессия' : 'изображение';
                this.download(image.src, typeName);
            };
        }

        HistoryManager.addGenerated(type, data);
        NotificationManager.show('✅ Результат готов! Доступен в истории.');
        ModalManager.show('generation-result-modal');
    },

    /**
     * Скачать результат
     */
    download(imageUrl, type) {
        NotificationManager.show(`✅ ${type.charAt(0).toUpperCase() + type.slice(1)} отправлено в чат бота!`);
        setTimeout(() => {
            ModalManager.hide('generation-result-modal');
            ScreenManager.switch('history');
        }, 1000);
    }
};

// ========== УПРАВЛЕНИЕ ФОТОСЕССИЯМИ ==========
const PhotosessionManager = {
    /**
     * Загрузить фото пользователя
     */
    loadUserPhotos() {
        const container = document.getElementById('user-photos-container');
        if (!container) return;

        container.innerHTML = '';

        if (AppState.userGeneratedPhotos.length === 0) {
            container.innerHTML = `
                <div class="empty-photos">
                    <div class="empty-icon">📸</div>
                    <h3>У вас ещё нет сгенерированных фото</h3>
                    <p>Создайте первое фото, чтобы начать фотосессию</p>
                    <button class="btn-start" onclick="ScreenManager.switch('photo')">Создать фото</button>
                </div>
            `;
            return;
        }

        AppState.userGeneratedPhotos.forEach(photo => {
            container.appendChild(this.createPhotoCard(photo));
        });
    },

    /**
     * Создать карточку фото
     */
    createPhotoCard(photo) {
        const photoCard = document.createElement('div');
        photoCard.className = 'user-photo-card';
        photoCard.innerHTML = `
            <img src="${photo.src}" alt="${photo.title}">
            <div class="photo-overlay">
                <div class="photo-title">${photo.title}</div>
                <div class="photo-date">${photo.date}</div>
                ${photo.type === 'photosession' ? '<div class="photo-badge">📸 Фотосессия</div>' : ''}
            </div>
            ${photo.type === 'photo' ? `<button class="photosession-from-photo-btn" data-photo-id="${photo.id}"><span class="material-icons-round">camera</span> Фотосессия</button>` : ''}
        `;

        photoCard.addEventListener('click', () => {
            AppState.selectedPhotoForSession = photo;
            this.showModal();
        });

        const sessionBtn = photoCard.querySelector('.photosession-from-photo-btn');
        if (sessionBtn) {
            sessionBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                AppState.selectedPhotoForSession = photo;
                this.showModal();
            });
        }

        return photoCard;
    },

    /**
     * Показать модальное окно фотосессии
     */
    showModal() {
        if (!AppState.selectedPhotoForSession) return;

        const modal = document.getElementById('photosession-modal');
        if (!modal) return;

        const imgElement = document.getElementById('selected-photo-img');
        if (imgElement) {
            imgElement.src = AppState.selectedPhotoForSession.src;
            imgElement.alt = AppState.selectedPhotoForSession.title;
        }

        this.updateCount();
        ModalManager.show('photosession-modal');
    },

    /**
     * Обновить счетчик кадров
     */
    updateCount() {
        const countElement = document.getElementById('photosession-count');
        const totalElement = document.getElementById('photosession-total');
        const priceElement = document.getElementById('photosession-price');
        const resultCountElement = document.getElementById('result-photo-count');

        if (countElement) countElement.textContent = AppState.photosessionFrames;

        const totalPrice = PriceCalculator.calculatePhotosession();
        if (priceElement) priceElement.textContent = totalPrice;

        const totalPhotos = AppState.photosessionFrames + CONFIG.PHOTOSESSION_BONUS_FRAMES;
        if (totalElement) totalElement.textContent = totalPhotos;
        if (resultCountElement) resultCountElement.textContent = totalPhotos;
    },

    /**
     * Уменьшить количество кадров
     */
    decreaseFrames() {
        if (AppState.photosessionFrames > CONFIG.PHOTOSESSION_MIN_FRAMES) {
            AppState.photosessionFrames--;
            this.updateCount();
        }
    },

    /**
     * Увеличить количество кадров
     */
    increaseFrames() {
        if (AppState.photosessionFrames < CONFIG.PHOTOSESSION_MAX_FRAMES) {
            AppState.photosessionFrames++;
            this.updateCount();
        }
    },

    /**
     * Начать генерацию фотосессии
     */
    start(title, price, styleData) {
        if (!BalanceManager.check(price)) {
            BalanceManager.showInsufficientPopup(price);
            return;
        }

        LoadingManager.show('photosession', {
            title: title,
            style: styleData,
            frames: AppState.photosessionFrames,
            price: price
        });
    },

    /**
     * Загрузить горизонтальные категории фотосессий
     */
    loadHorizontalCategories() {
        const container = document.getElementById('photosession-horizontal-categories');
        if (!container) return;

        container.innerHTML = '';

        PHOTOSESSION_CATEGORIES.forEach(category => {
            const section = this.createCategorySection(category);
            container.appendChild(section);
        });
    },

    /**
     * Создать секцию категории фотосессии
     */
    createCategorySection(category) {
        const section = document.createElement('div');
        section.className = 'horizontal-category-section';

        const stylesCount = category.styles.length;
        const styleWord = Utils.getStyleWord(stylesCount);

        section.innerHTML = `
            <div class="horizontal-category-header">
                <h3 class="horizontal-category-title">${category.title}</h3>
                <button class="view-all-btn" data-category="${category.id}">
                    Все ${stylesCount} ${styleWord}
                    <span class="material-icons-round">arrow_forward</span>
                </button>
            </div>
            <div class="horizontal-scroll-container" id="photosession-scroll-${category.id}"></div>
        `;

        const scrollContainer = section.querySelector('.horizontal-scroll-container');
        const displayStyles = category.styles.slice(0, 5);

        displayStyles.forEach(style => {
            scrollContainer.appendChild(this.createStyleCard(style, category));
        });

        if (category.styles.length > 5) {
            scrollContainer.appendChild(this.createAllStylesCard(category, stylesCount, styleWord));
        }

        this.setupCategoryHandlers(section, category);
        return section;
    },

    /**
     * Создать карточку стиля фотосессии
     */
    createStyleCard(style, category) {
        const card = document.createElement('div');
        card.className = 'horizontal-style-card';
        card.dataset.category = category.id;
        card.dataset.styleId = style.id;

        const viewsText = Utils.formatViews(style.views);

        card.innerHTML = `
            <div class="horizontal-style-preview">
                <img src="${style.preview}" alt="${style.name}">
            </div>
            <div class="style-stats">
                <div class="stat-item">
                    <span class="stat-icon">👁️</span>
                    <span class="stat-value">${viewsText}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-icon">⭐</span>
                    <span class="stat-value">${style.rating}</span>
                </div>
            </div>
            <div class="horizontal-style-name">${style.name}</div>
        `;

        card.addEventListener('click', () => {
            AppState.currentPhotosessionCategory = category;
            PhotosessionGalleryManager.show(category.id);
        });

        return card;
    },

    /**
     * Создать карточку "Все стили"
     */
    createAllStylesCard(category, stylesCount, styleWord) {
        const card = document.createElement('div');
        card.className = 'horizontal-style-card all-styles-card';
        card.dataset.category = category.id;

        card.innerHTML = `
            <div class="all-styles-icon">
                <span class="material-icons-round">more_horiz</span>
            </div>
            <div class="all-styles-text">
                <div>Все</div>
                <div class="all-styles-count">${stylesCount} ${styleWord}</div>
            </div>
        `;

        card.addEventListener('click', () => {
            AppState.currentPhotosessionCategory = category;
            PhotosessionGalleryManager.show(category.id);
        });

        return card;
    },

    /**
     * Настроить обработчики категории
     */
    setupCategoryHandlers(section, category) {
        const titleElement = section.querySelector('.horizontal-category-title');
        const viewAllBtn = section.querySelector('.view-all-btn');

        const showGallery = () => {
            AppState.currentPhotosessionCategory = category;
            PhotosessionGalleryManager.show(category.id);
        };

        if (titleElement) titleElement.addEventListener('click', showGallery);
        if (viewAllBtn) {
            viewAllBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showGallery();
            });
        }
    }
};

// ========== ГАЛЕРЕЯ ФОТОСЕССИЙ ==========
const PhotosessionGalleryManager = {
    /**
     * Показать галерею фотосессий
     */
    show(categoryId) {
        const category = PHOTOSESSION_CATEGORIES.find(c => c.id === categoryId);
        if (!category) return;

        const titleElement = document.getElementById('photosession-gallery-title');
        if (titleElement) titleElement.textContent = category.title;

        const container = document.getElementById('photosession-gallery-container');
        if (container) {
            container.innerHTML = '';
            category.styles.forEach(style => {
                container.appendChild(this.createGalleryCard(style, category));
            });
        }

        ModalManager.show('photosession-gallery-modal');
    },

    /**
     * Создать карточку в галерее
     */
    createGalleryCard(style, category) {
        const card = document.createElement('div');
        card.className = 'photosession-gallery-card';
        card.dataset.category = category.id;
        card.dataset.styleId = style.id;

        const viewsText = Utils.formatViews(style.views);

        card.innerHTML = `
            <div class="photosession-gallery-preview">
                <img src="${style.preview}" alt="${style.name}">
            </div>
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
            <div class="photosession-gallery-name">${style.name}</div>
        `;

        card.addEventListener('click', () => {
            PhotosessionSeriesManager.show(category, style);
        });

        return card;
    }
};

// ========== СЕРИЯ ФОТОСЕССИИ ==========
const PhotosessionSeriesManager = {
    /**
     * Показать серию фотосессии
     */
    show(category, style) {
        const modal = document.getElementById('photosession-series-modal');
        if (!modal) return;

        const titleElement = document.getElementById('photosession-series-title');
        if (titleElement) titleElement.textContent = style.name;

        const container = document.getElementById('photosession-series-container');
        if (container) {
            container.innerHTML = '';
            for (let i = 1; i <= 10; i++) {
                container.appendChild(this.createSeriesCard(i, category, style));
            }
        }

        this.updateGenerateButton(style);
        this.updateBalance();
        ModalManager.show('photosession-series-modal');
    },

    /**
     * Создать карточку серии
     */
    createSeriesCard(index, category, style) {
        const card = document.createElement('div');
        card.className = 'photosession-series-card';
        card.dataset.index = index;

        card.innerHTML = `
            <div class="photosession-series-preview">
                <img src="https://via.placeholder.com/300x400/${category.color.substring(1)}/FFFFFF?text=${category.icon}+${index}" alt="${style.name} ${index}">
            </div>
            <div class="photosession-series-number">${index}</div>
        `;

        card.addEventListener('click', () => {
            FullscreenViewerManager.showSeries(category, style);
        });

        return card;
    },

    /**
     * Обновить кнопку генерации
     */
    updateGenerateButton(style) {
        const generateBtn = document.getElementById('photosession-series-generate-btn');
        const btnText = document.getElementById('photosession-series-btn-text');
        const price = PriceCalculator.calculatePhotosession();

        if (BalanceManager.check(price)) {
            if (btnText) btnText.textContent = `Сгенерировать фотосессию за ${price} звёзд`;
            if (generateBtn) {
                generateBtn.onclick = () => {
                    PhotosessionManager.start(style.name, price, style);
                };
            }
        } else {
            if (btnText) btnText.textContent = 'Пополнить баланс';
            if (generateBtn) {
                generateBtn.onclick = () => {
                    BalanceManager.showInsufficientPopup(price);
                };
            }
        }
    },

    /**
     * Обновить баланс
     */
    updateBalance() {
        const balanceElement = document.getElementById('photosession-series-balance');
        if (balanceElement) balanceElement.textContent = AppState.userBalance;
    }
};

// ========== ПОЛНОЭКРАННЫЙ ПРОСМОТР ==========
const FullscreenViewerManager = {
    /**
     * Показать серию в полноэкранном режиме
     */
    showSeries(category, style) {
        AppState.currentGalleryImages = [];
        for (let j = 1; j <= 10; j++) {
            AppState.currentGalleryImages.push({
                src: `https://via.placeholder.com/600x800/${category.color.substring(1)}/FFFFFF?text=${category.icon}+${j}`,
                alt: `${style.name} ${j}`
            });
        }
        AppState.currentGalleryIndex = 0;
        this.show();
    },

    /**
     * Показать полноэкранный просмотр
     */
    show() {
        this.updateImage();
        ModalManager.show('fullscreen-viewer');
        this.resetInactivityTimer();
    },

    /**
     * Обновить изображение
     */
    updateImage() {
        const imageElement = document.getElementById('fullscreen-image');
        const counterElement = document.getElementById('fullscreen-counter');
        const controls = document.getElementById('fullscreen-controls');

        if (imageElement && AppState.currentGalleryImages[AppState.currentGalleryIndex]) {
            imageElement.src = AppState.currentGalleryImages[AppState.currentGalleryIndex].src;
            imageElement.alt = AppState.currentGalleryImages[AppState.currentGalleryIndex].alt;
        }

        if (counterElement) {
            counterElement.textContent = `${AppState.currentGalleryIndex + 1}/${AppState.currentGalleryImages.length}`;
        }

        if (controls) {
            controls.style.opacity = '1';
            controls.style.visibility = 'visible';
        }

        this.resetInactivityTimer();
    },

    /**
     * Следующее изображение
     */
    next() {
        if (AppState.currentGalleryIndex < AppState.currentGalleryImages.length - 1) {
            AppState.currentGalleryIndex++;
            this.updateImage();
        }
    },

    /**
     * Предыдущее изображение
     */
    prev() {
        if (AppState.currentGalleryIndex > 0) {
            AppState.currentGalleryIndex--;
            this.updateImage();
        }
    },

    /**
     * Сбросить таймер неактивности
     */
    resetInactivityTimer() {
        if (AppState.inactivityTimer) clearTimeout(AppState.inactivityTimer);
        AppState.inactivityTimer = setTimeout(() => this.hideControls(), CONFIG.INACTIVITY_TIMEOUT);
    },

    /**
     * Скрыть элементы управления
     */
    hideControls() {
        const controls = document.getElementById('fullscreen-controls');
        if (controls) {
            controls.style.opacity = '0';
            controls.style.visibility = 'hidden';
        }
    }
};

// ========== УПРАВЛЕНИЕ ИСТОРИЕЙ ==========
const HistoryManager = {
    /**
     * Загрузить историю
     */
    load() {
        const container = document.getElementById('history-container');
        const empty = document.getElementById('history-empty');
        const count = document.getElementById('history-count');

        if (!container || !empty || !count) return;

        const history = this.getHistory();
        count.textContent = history.length;

        if (history.length === 0) {
            empty.style.display = 'block';
            container.innerHTML = '';
            return;
        }

        empty.style.display = 'none';
        container.innerHTML = '';

        const recentHistory = history.slice(0, 20);
        recentHistory.forEach(item => {
            container.appendChild(this.createHistoryItem(item));
        });
    },

    /**
     * Получить историю из localStorage
     */
    getHistory() {
        if (typeof Storage === 'undefined') return [];
        return JSON.parse(localStorage.getItem('nanoBananaHistory') || '[]');
    },

    /**
     * Создать элемент истории
     */
    createHistoryItem(item) {
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
            <button class="history-btn download" onclick="HistoryManager.download('${item.id}')">Скачать</button>
        `;

        return historyItem;
    },

    /**
     * Добавить в историю
     */
    addGenerated(type, data) {
        if (!BalanceManager.deduct(data.price)) return;

        const newPhoto = {
            id: Date.now(),
            src: Utils.generatePlaceholderImage('Новое'),
            title: this.generateTitle(type, data),
            date: new Date().toLocaleDateString('ru-RU'),
            type: type === 'photosession' ? 'photosession' : 'photo'
        };

        AppState.userGeneratedPhotos.unshift(newPhoto);
        this.saveToLocalStorage(type, newPhoto, data);
        PhotosessionManager.loadUserPhotos();
        this.showBadge();
    },

    /**
     * Сгенерировать заголовок
     */
    generateTitle(type, data) {
        if (type === 'photosession') return `Фотосессия: ${data.title}`;
        if (type === 'create-own') return 'Свой стиль';
        const category = CATEGORIES.find(c => c.id === data.category);
        return `${category?.title || 'Фото'}${data.style ? ' - ' + data.style : ''}`;
    },

    /**
     * Сохранить в localStorage
     */
    saveToLocalStorage(type, photo, data) {
        if (typeof Storage === 'undefined') return;

        const history = this.getHistory();
        const newItem = {
            id: photo.id,
            type: type === 'photosession' ? 'photosession' : 'photo',
            title: photo.title,
            description: this.generateDescription(type, data),
            price: data.price,
            date: new Date().toISOString()
        };

        history.unshift(newItem);
        localStorage.setItem('nanoBananaHistory', JSON.stringify(history));
        ProfileManager.updateStats();
    },

    /**
     * Сгенерировать описание
     */
    generateDescription(type, data) {
        if (type === 'photosession') {
            return `${data.frames || 10} кадров + 3 в подарок`;
        }
        if (type === 'create-own') {
            return 'Создание по примеру';
        }
        return `Модель: ${data.model === 'nano' ? 'Nano Banana' : 'Nano Banana Pro'}, Формат: ${data.format}`;
    },

    /**
     * Показать бейдж на истории
     */
    showBadge() {
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
    },

    /**
     * Скачать из истории
     */
    download(itemId) {
        NotificationManager.show('Файл отправлен в чат бота!');
    }
};

// ========== УПРАВЛЕНИЕ ПРОФИЛЕМ ==========
const ProfileManager = {
    /**
     * Обновить статистику профиля
     */
    updateStats() {
        const history = HistoryManager.getHistory();

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
};

// ========== ИНИЦИАЛИЗАЦИЯ TELEGRAM ==========
const TelegramManager = {
    /**
     * Инициализировать Telegram WebApp
     */
    init() {
        if (!window.Telegram?.WebApp) return;

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

        this.setupBackButton(tg);
        tg.BackButton.show();
        console.log('Telegram подключен');
    },

    /**
     * Настроить кнопку назад
     */
    setupBackButton(tg) {
        tg.onEvent('backButtonClicked', () => {
            if (document.getElementById('loading-screen')?.classList.contains('active')) {
                LoadingManager.hide();
                return;
            }

            const activeOverlay = document.querySelector('.overlay.show');
            if (activeOverlay) {
                this.handleOverlayBack(activeOverlay);
                return;
            }

            const activeScreen = document.querySelector('.screen.active');
            if (activeScreen) {
                this.handleScreenBack(activeScreen, tg);
            }
        });
    },

    /**
     * Обработать нажатие назад на оверлее
     */
    handleOverlayBack(overlay) {
        const handlers = {
            'category-modal': () => ModalManager.hide('category-modal'),
            'photosession-gallery-modal': () => ModalManager.hide('photosession-gallery-modal'),
            'photosession-series-modal': () => ModalManager.hide('photosession-series-modal'),
            'fullscreen-viewer': () => ModalManager.hide('fullscreen-viewer'),
            'photosession-modal': () => ModalManager.hide('photosession-modal'),
            'how-it-works-overlay': () => ModalManager.hide('how-it-works-overlay'),
            'screen-generate': () => GenerateManager.hide(),
            'generation-result-modal': () => ModalManager.hide('generation-result-modal')
        };

        if (handlers[overlay.id]) {
            handlers[overlay.id]();
        } else {
            overlay.classList.remove('show');
            setTimeout(() => overlay.style.display = 'none', 300);
        }
    },

    /**
     * Обработать нажатие назад на экране
     */
    handleScreenBack(activeScreen, tg) {
        const handlers = {
            'screen-main': () => tg.close(),
            'screen-create-own': () => ScreenManager.switch('photo'),
            'screen-photosession-custom': () => ScreenManager.switch('photosession')
        };

        if (handlers[activeScreen.id]) {
            handlers[activeScreen.id]();
        } else {
            ScreenManager.switch('main');
        }
    }
};

// ========== НАСТРОЙКА КНОПОК ==========
const ButtonManager = {
    /**
     * Настроить все кнопки
     */
    setup() {
        this.setupModelCards();
        this.setupNavigationButtons();
        this.setupModalButtons();
        this.setupActionButtons();
    },

    /**
     * Настроить карточки моделей
     */
    setupModelCards() {
        document.querySelectorAll('.model-card').forEach(card => {
            card.addEventListener('click', function() {
                document.querySelectorAll('.model-card').forEach(c => c.classList.remove('selected'));
                this.classList.add('selected');
                AppState.selectedModel = this.dataset.model;
                GenerateManager.updateTotalPrice();
            });
        });
    },

    /**
     * Настроить кнопки навигации
     */
    setupNavigationButtons() {
        document.querySelectorAll('.tab-btn').forEach(button => {
            button.addEventListener('click', function() {
                ScreenManager.switch(this.dataset.screen);
            });
        });

        document.querySelectorAll('.quick-card').forEach(card => {
            card.addEventListener('click', function() {
                ScreenManager.switch(this.dataset.screen);
            });
        });

        const balanceBtn = document.getElementById('balance-btn');
        if (balanceBtn) {
            balanceBtn.addEventListener('click', () => {
                NotificationManager.show(`Ваш баланс: ${AppState.userBalance} звёзд\nДля пополнения откройте приложение в Telegram боте.`);
            });
        }
    },

    /**
     * Настроить кнопки модальных окон
     */
    setupModalButtons() {
        const closeButtons = {
            'category-modal-close': () => ModalManager.hide('category-modal'),
            'photosession-gallery-back-btn': () => ModalManager.hide('photosession-gallery-modal'),
            'photosession-series-back-btn': () => ModalManager.hide('photosession-series-modal'),
            'fullscreen-close-btn': () => ModalManager.hide('fullscreen-viewer'),
            'fullscreen-prev-btn': () => FullscreenViewerManager.prev(),
            'fullscreen-next-btn': () => FullscreenViewerManager.next(),
            'result-close-btn': () => ModalManager.hide('generation-result-modal'),
            'loading-close-btn': () => LoadingManager.hide(),
            'create-own-back-btn': () => ScreenManager.switch('photo'),
            'photosession-back-btn': () => ScreenManager.switch('photosession'),
            'generate-back-btn': () => GenerateManager.hide()
        };

        Object.entries(closeButtons).forEach(([id, handler]) => {
            const btn = document.getElementById(id);
            if (btn) btn.addEventListener('click', handler);
        });
    },

    /**
     * Настроить кнопки действий
     */
    setupActionButtons() {
        const generateBtn = document.getElementById('start-generate-btn');
        if (generateBtn) generateBtn.addEventListener('click', () => GenerateManager.start());

        const createOwnBtn = document.getElementById('create-own-generate-btn');
        if (createOwnBtn) createOwnBtn.addEventListener('click', () => CreateOwnManager.start());

        const photosessionBtn = document.getElementById('start-photosession-btn');
        if (photosessionBtn) {
            photosessionBtn.addEventListener('click', () => {
                const price = parseInt(document.getElementById('photosession-price').textContent);
                PhotosessionManager.start(
                    AppState.selectedPhotoForSession?.title || 'Фотосессия',
                    price,
                    { name: 'Кастомная фотосессия' }
                );
            });
        }

        const decreaseBtn = document.querySelector('.frame-btn.minus');
        const increaseBtn = document.querySelector('.frame-btn.plus');
        if (decreaseBtn) decreaseBtn.onclick = () => PhotosessionManager.decreaseFrames();
        if (increaseBtn) increaseBtn.onclick = () => PhotosessionManager.increaseFrames();
    }
};

// ========== ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('🍌 Nano Banana Old Money Edition запускается...');

    // Инициализация модулей
    TelegramManager.init();
    ButtonManager.setup();
    UploadManager.init();
    BalanceManager.update();

    // Загрузка начальных данных
    AppState.userGeneratedPhotos = [...MOCK_GENERATED_PHOTOS];
    PhotoManager.loadCategories();
    PhotosessionManager.loadUserPhotos();
    PhotosessionManager.loadHorizontalCategories();

    // Инициализация истории
    if (typeof Storage !== 'undefined') {
        if (!localStorage.getItem('nanoBananaHistory')) {
            localStorage.setItem('nanoBananaHistory', JSON.stringify([]));
        }
    }

    // Глобальные функции для HTML
    window.switchScreen = (screenId) => ScreenManager.switch(screenId);
    window.hidePhotosessionModal = () => {
        ModalManager.hide('photosession-modal', () => {
            AppState.selectedPhotoForSession = null;
        });
    };
    window.hideHowItWorks = () => ModalManager.hide('how-it-works-overlay');
    window.clearHistory = () => {
        if (confirm('Вы уверены, что хотите очистить всю историю?')) {
            localStorage.setItem('nanoBananaHistory', JSON.stringify([]));
            HistoryManager.load();
            ProfileManager.updateStats();
            NotificationManager.show('История очищена');
        }
    };

    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);

    console.log('🍌 Nano Banana App готов! Версия 6.0');
});

// Экспорт для использования в HTML
window.ScreenManager = ScreenManager;
window.CreateOwnManager = CreateOwnManager;
window.PhotosessionManager = PhotosessionManager;
window.FullscreenViewerManager = FullscreenViewerManager;
window.HistoryManager = HistoryManager;
