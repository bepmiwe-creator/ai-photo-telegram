// app.js - Nano Banana AI Photo - Old Money Edition
// Версия 5.1: Обновление по техзаданию от 24.05

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
        src: 'https://via.placeholder.com/300x400/E0F2FE/1E3A8A?text=Фото+1', 
        title: 'Зимняя сказка',
        date: '23.01.2026',
        type: 'photo'
    },
    { 
        id: 2, 
        src: 'https://via.placeholder.com/300x400/F8E1E7/B76E79?text=Фото+2', 
        title: 'Розовый закат',
        date: '22.01.2026',
        type: 'photo'
    },
    { 
        id: 3, 
        src: 'https://via.placeholder.com/300x400/FAF3E0/374151?text=Фото+3', 
        title: 'Элегантность',
        date: '21.01.2026',
        type: 'photo'
    },
    { 
        id: 4, 
        src: 'https://via.placeholder.com/300x400/E0F2FE/1E3A8A?text=Фото+4', 
        title: 'Городские огни',
        date: '20.01.2026',
        type: 'photosession'
    },
    { 
        id: 5, 
        src: 'https://via.placeholder.com/300x400/F8E1E7/B76E79?text=Фото+5', 
        title: 'Романтика',
        date: '19.01.2026',
        type: 'photo'
    },
    { 
        id: 6, 
        src: 'https://via.placeholder.com/300x400/FAF3E0/374151?text=Фото+6', 
        title: 'Минимализм',
        date: '18.01.2026',
        type: 'photo'
    },
    { 
        id: 7, 
        src: 'https://via.placeholder.com/300x400/E0F2FE/1E3A8A?text=Фото+7', 
        title: 'Природа',
        date: '17.01.2026',
        type: 'photosession'
    },
    { 
        id: 8, 
        src: 'https://via.placeholder.com/300x400/F8E1E7/B76E79?text=Фото+8', 
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

// Примеры стилей для категорий
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
        { id: 3, name: "Воздушные шары", icon: "🎈", color: "#4DD0E1", preview: "https://via.placeholder.com/300x400/FFB74D/FFFFFF?text=🎈" },
        { id: 4, name: "Подарки", icon: "🎁", color: "#AED581", preview: "https://via.placeholder.com/300x400/FFB74D/FFFFFF?text=🎁" }
    ],
    trends: [
        { id: 1, name: "Неоновый стиль", icon: "💡", color: "#9575CD", preview: "https://via.placeholder.com/300x400/FF5722/FFFFFF?text=💡" },
        { id: 2, name: "Ретро волна", icon: "📻", color: "#FF8A65", preview: "https://via.placeholder.com/300x400/FF5722/FFFFFF?text=📻" },
        { id: 3, name: "Футуризм", icon: "🚀", color: "#4DB6AC", preview: "https://via.placeholder.com/300x400/FF5722/FFFFFF?text=🚀" },
        { id: 4, name: "Минимализм", icon: "⬜", color: "#90A4AE", preview: "https://via.placeholder.com/300x400/FF5722/FFFFFF?text=⬜" }
    ],
    couples: [
        { id: 1, name: "Романтический вечер", icon: "💕", color: "#F06292", preview: "https://via.placeholder.com/300x400/EC407A/FFFFFF?text=💕" },
        { id: 2, name: "Прогулка в парке", icon: "🌳", color: "#81C784", preview: "https://via.placeholder.com/300x400/EC407A/FFFFFF?text=🌳" },
        { id: 3, name: "Пляжный закат", icon: "🌅", color: "#FFB74D", preview: "https://via.placeholder.com/300x400/EC407A/FFFFFF?text=🌅" }
    ],
    girls: [
        { id: 1, name: "Стиль принцессы", icon: "👸", color: "#CE93D8", preview: "https://via.placeholder.com/300x400/E91E63/FFFFFF?text=👸" },
        { id: 2, name: "Деловой образ", icon: "💼", color: "#80CBC4", preview: "https://via.placeholder.com/300x400/E91E63/FFFFFF?text=💼" },
        { id: 3, name: "Спортивный шик", icon: "👟", color: "#FFAB91", preview: "https://via.placeholder.com/300x400/E91E63/FFFFFF?text=👟" }
    ],
    men: [
        { id: 1, name: "Классический костюм", icon: "🤵", color: "#78909C", preview: "https://via.placeholder.com/300x400/42A5F5/FFFFFF?text=🤵" },
        { id: 2, name: "Спортивный стиль", icon: "🏃", color: "#42A5F5", preview: "https://via.placeholder.com/300x400/42A5F5/FFFFFF?text=🏃" },
        { id: 3, name: "Кэжуал образ", icon: "👕", color: "#26A69A", preview: "https://via.placeholder.com/300x400/42A5F5/FFFFFF?text=👕" }
    ],
    pets: [
        { id: 1, name: "Домашний любимец", icon: "🐶", color: "#FFD54F", preview: "https://via.placeholder.com/300x400/81C784/FFFFFF?text=🐶" },
        { id: 2, name: "Игривый момент", icon: "🎾", color: "#AED581", preview: "https://via.placeholder.com/300x400/81C784/FFFFFF?text=🎾" },
        { id: 3, name: "Портрет питомца", icon: "📷", color: "#80DEEA", preview: "https://via.placeholder.com/300x400/81C784/FFFFFF?text=📷" }
    ],
    professions: [
        { id: 1, name: "Врач", icon: "👨‍⚕️", color: "#EF5350", preview: "https://via.placeholder.com/300x400/78909C/FFFFFF?text=👨‍⚕️" },
        { id: 2, name: "Программист", icon: "💻", color: "#42A5F5", preview: "https://via.placeholder.com/300x400/78909C/FFFFFF?text=💻" },
        { id: 3, name: "Учитель", icon: "👩‍🏫", color: "#66BB6A", preview: "https://via.placeholder.com/300x400/78909C/FFFFFF?text=👩‍🏫" },
        { id: 4, name: "Повар", icon: "👨‍🍳", color: "#FFA726", preview: "https://via.placeholder.com/300x400/78909C/FFFFFF?text=👨‍🍳" }
    ],
    luxury: [
        { id: 1, name: "Золотой шик", icon: "💰", color: "#FFD700", preview: "https://via.placeholder.com/300x400/FFD700/FFFFFF?text=💰" },
        { id: 2, name: "Алмазный блеск", icon: "💎", color: "#B39DDB", preview: "https://via.placeholder.com/300x400/FFD700/FFFFFF?text=💎" },
        { id: 3, name: "Шикарный вечер", icon: "🍾", color: "#F8BBD0", preview: "https://via.placeholder.com/300x400/FFD700/FFFFFF?text=🍾" }
    ]
};
// ========== ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ ==========
document.addEventListener('DOMContentLoaded', () => {
    const tg = window.Telegram.WebApp;
    tg.expand();
    tg.setHeaderColor('#1a1a1a'); // Постоянный цвет шапки
    tg.MainButton.hide();

    // Инициализация истории навигации
    let history = ['main-page'];
    
    // Показываем главную страницу при запуске
    showPage('main-page', false);
    updateBackButton();
    updateBalance();
    
    // Запускаем таймер неактивности
    resetInactivityTimer();
    document.addEventListener('click', resetInactivityTimer);
    document.addEventListener('scroll', resetInactivityTimer);
    document.addEventListener('keypress', resetInactivityTimer);


    // ========== ФУНКЦИИ НАВИГАЦИИ ==========
    function showPage(pageId, addToHistory = true) {
        document.querySelectorAll('.page').forEach(page => page.style.display = 'none');
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.style.display = 'block';
            if (addToHistory && history[history.length - 1] !== pageId) {
                history.push(pageId);
            }
            // Прокрутка вверх при переходе на новую страницу
            window.scrollTo(0, 0); 
        }
        updateBackButton();
        resetInactivityTimer();
    }

    function goBack() {
        if (history.length > 1) {
            history.pop();
            const prevPageId = history[history.length - 1];
            showPage(prevPageId, false);
        }
    }

    function updateBackButton() {
        if (history.length > 1) {
            tg.BackButton.show();
        } else {
            tg.BackButton.hide();
        }
    }

    tg.BackButton.onClick(goBack);

    // ========== ФУНКЦИИ-РЕНДЕРЕРЫ ==========

    // Заполнение вертикального каталога стилей на странице "Фото"
    function populateCategories() {
        const list = document.getElementById('categories-list');
        list.innerHTML = '';
        categories.forEach(cat => {
            const styles = styleExamples[cat.id] || [];
            cat.count = styles.length > 0 ? `${styles.length} ${getStyleWord(styles.length)}` : 'Ваш стиль';

            const item = document.createElement('div');
            item.className = 'category-item';
            if (cat.id === 'create') {
                item.classList.add('create-style');
            }
            item.dataset.categoryId = cat.id;

            item.innerHTML = `
                <div class="category-header" style="--cat-color: ${cat.color};">
                    <span class="category-icon">${cat.icon}</span>
                    <h3 class="category-title">${cat.title.replace(/<[^>]*>?/gm, '')}</h3>
                </div>
                <button class="category-button">${cat.id === 'create' ? 'Создать' : `Все ${cat.count}`}<i class="fas fa-arrow-right"></i></button>
            `;
            list.appendChild(item);
        });
        
        // Добавляем обработчики событий после создания элементов
        document.querySelectorAll('.category-item').forEach(item => {
            item.addEventListener('click', () => {
                const categoryId = item.dataset.categoryId;
                if (categoryId === 'create') {
                    openCreateYourOwnPage();
                } else {
                    openStylePage(categoryId);
                }
            });
        });
    }

    // Заполнение горизонтального каталога фотосессий на странице "Фотосессии"
    function populatePhotosessionCategories() {
        const container = document.getElementById('photosession-categories-container');
        container.innerHTML = '';
        photosessionCategories.forEach(cat => {
            const item = document.createElement('div');
            item.className = 'photosession-category-item';
            item.dataset.categoryId = cat.id;
            // Убрали отображение просмотров и рейтинга на главной странице фотосессий
            item.innerHTML = `
                <img src="${cat.styles[0].preview}" alt="${cat.title}">
                <div class="photosession-category-overlay">
                    <h3>${cat.icon} ${cat.title}</h3>
                </div>
            `;
            item.addEventListener('click', () => {
                openPhotosessionModal(cat.id);
            });
            container.appendChild(item);
        });
    }

    // Заполнение модального окна для фотосессий
    function openPhotosessionModal(categoryId) {
        currentPhotosessionCategory = photosessionCategories.find(cat => cat.id === categoryId);
        if (!currentPhotosessionCategory) return;

        document.getElementById('photosession-modal-title').textContent = `${currentPhotosessionCategory.icon} ${currentPhotosessionCategory.title}`;
        const grid = document.getElementById('photosession-modal-grid');
        grid.innerHTML = '';

        currentPhotosessionCategory.styles.forEach(style => {
            const item = document.createElement('div');
            item.className = 'modal-style-item';
            item.dataset.styleId = style.id;
            
            // Форматируем просмотры
            const viewsText = style.views > 1000 ? `${(style.views / 1000).toFixed(1)}k` : style.views;

            // Название стиля (style.name) не отображается, как в ТЗ
            item.innerHTML = `
                <div class="modal-image-container">
                    <img src="${style.preview}" alt="Превью стиля">
                </div>
                <div class="modal-style-info">
                    <span class="info-item"><i class="fas fa-eye"></i> ${viewsText}</span>
                    <span class="info-item"><i class="fas fa-star"></i> ${style.rating.toFixed(1)}</span>
                </div>
            `;
            grid.appendChild(item);
        });
        
        document.getElementById('photosession-modal').style.display = 'flex';
        // Добавляем обработчики кликов на стили в модальном окне
        grid.querySelectorAll('.modal-style-item').forEach(item => {
            item.addEventListener('click', () => {
                const styleId = parseInt(item.dataset.styleId, 10);
                const selectedStyleData = currentPhotosessionCategory.styles.find(s => s.id === styleId);
                console.log('Выбран стиль фотосессии:', selectedStyleData.name);
                // Здесь будет переход на страницу генерации фотосессии с этим стилем
                showGenerationPage('photosession', selectedStyleData);
            });
        });
    }

    // Заполнение страницы стилей для "Фото"
    function populateStyles(categoryId) {
        const category = categories.find(c => c.id === categoryId);
        const styles = styleExamples[categoryId];
        if (!category || !styles) return;

        currentCategory = category;
        document.getElementById('style-page-title').textContent = category.title;
        const grid = document.getElementById('style-grid');
        grid.innerHTML = '';

        styles.forEach(style => {
            const item = document.createElement('div');
            item.className = 'style-item';
            item.dataset.styleId = style.id;
            item.innerHTML = `
                <div class="style-item-image-container">
                    <img src="${style.preview}" alt="${style.name}">
                </div>
                <div class="style-item-info">
                    <span>${style.icon} ${style.name}</span>
                </div>
            `;
            grid.appendChild(item);
        });
        
        // Обработчики кликов на стили
        grid.querySelectorAll('.style-item').forEach(item => {
            item.addEventListener('click', () => {
                const styleId = parseInt(item.dataset.styleId, 10);
                selectedStyle = styleExamples[categoryId].find(s => s.id === styleId);
                showGenerationPage('photo', selectedStyle);
            });
        });
    }
    
    // Открытие страницы конкретного стиля из каталога "Фото"
    function openStylePage(categoryId) {
        populateStyles(categoryId);
        showPage('style-page');
    }

    // Заполнение страницы "Мои фото"
    function populateMyPhotos() {
        const grid = document.getElementById('my-photos-grid');
        const noPhotosMessage = document.getElementById('no-photos-message');
        grid.innerHTML = '';
        
        // Используем моковые данные
        const photos = mockGeneratedPhotos;

        if (photos.length === 0) {
            noPhotosMessage.style.display = 'block';
        } else {
            noPhotosMessage.style.display = 'none';
            photos.forEach((photo, index) => {
                const item = document.createElement('div');
                item.className = 'my-photo-item';
                item.dataset.index = index;
                item.innerHTML = `
                    <img src="${photo.src}" alt="${photo.title}">
                    <div class="my-photo-overlay">
                        ${photo.type === 'photosession' ? '<i class="fas fa-film photosession-icon"></i>' : ''}
                    </div>
                `;
                item.addEventListener('click', () => openPhotoInGallery(index, photos));
                grid.appendChild(item);
            });
        }
    }

    // Открытие фото в полноэкранной галерее
    function openPhotoInGallery(startIndex, imageArray) {
        currentGalleryImages = imageArray;
        currentGalleryIndex = startIndex;
        updateGalleryView();
        document.getElementById('gallery-view').style.display = 'flex';
        tg.BackButton.hide(); // Скрываем основную кнопку назад
    }
    // Обновление вида галереи
    function updateGalleryView() {
        const photo = currentGalleryImages[currentGalleryIndex];
        document.getElementById('gallery-image').src = photo.src;
        document.getElementById('gallery-title').textContent = photo.title;
        document.getElementById('gallery-date').textContent = photo.date;
        document.getElementById('gallery-counter').textContent = `${currentGalleryIndex + 1} / ${currentGalleryImages.length}`;

        document.getElementById('gallery-prev').style.visibility = currentGalleryIndex > 0 ? 'visible' : 'hidden';
        document.getElementById('gallery-next').style.visibility = currentGalleryIndex < currentGalleryImages.length - 1 ? 'visible' : 'hidden';
    }

    // ========== ОБРАБОТЧИКИ СОБЫТИЙ ==========

    // Навигация по нижнему меню
    document.querySelectorAll('.bottom-nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const pageId = item.dataset.page;
            // Сбрасываем историю при переходе через нижнее меню для чистоты навигации
            history = ['main-page', pageId].filter((v, i, a) => a.indexOf(v) === i);
            if (pageId === 'main-page') history = ['main-page'];

            showPage(pageId, false);

            // Специальные действия для некоторых страниц
            if (pageId === 'photo-page') populateCategories();
            if (pageId === 'photosession-page') populatePhotosessionCategories();
            if (pageId === 'my-photos-page') populateMyPhotos();
            if (pageId === 'profile-page') updateUserProfile();
        });
    });

    // Генерация по описанию
    document.getElementById('generate-by-description').addEventListener('click', () => {
        openCreateYourOwnPage('description');
    });
    
    // Создать свой стиль
    document.getElementById('create-your-own-style').addEventListener('click', () => {
        openCreateYourOwnPage('style');
    });

    // Кнопка "Создать свою фотосессию"
    document.getElementById('create-own-photosession-btn').addEventListener('click', () => {
        showGenerationPage('photosession', { name: 'Своя фотосессия' });
    });

    // Закрытие модального окна фотосессий
    document.querySelector('.close-modal-btn').addEventListener('click', () => {
        document.getElementById('photosession-modal').style.display = 'none';
    });

    // Управление галереей
    document.getElementById('close-gallery-btn').addEventListener('click', () => {
        document.getElementById('gallery-view').style.display = 'none';
        updateBackButton(); // Возвращаем кнопку назад
    });

    document.getElementById('gallery-prev').addEventListener('click', () => {
        if (currentGalleryIndex > 0) {
            currentGalleryIndex--;
            updateGalleryView();
        }
    });

    document.getElementById('gallery-next').addEventListener('click', () => {
        if (currentGalleryIndex < currentGalleryImages.length - 1) {
            currentGalleryIndex++;
            updateGalleryView();
        }
    });


    // ========== ЛОГИКА СТРАНИЦЫ ГЕНЕРАЦИИ ==========

    function openCreateYourOwnPage(type = 'style') {
        // Эта функция может настраивать страницу "Создать свой"
        // в зависимости от того, что мы создаем - стиль или по описанию.
        // Пока просто переходим на страницу
        console.log(`Открываем страницу "Создать свой" для: ${type}`);
        showPage('create-your-own-page');
    }

    function showGenerationPage(type, data) {
        currentGenerationType = type;
        currentGenerationData = data;
        const page = document.getElementById('generation-page');
        const titleEl = page.querySelector('#generation-page-title');
        
        if (type === 'photo') {
            titleEl.textContent = data.name;
        } else if (type === 'photosession') {
            titleEl.textContent = data.name;
            // Здесь можно добавить специфичные для фотосессии элементы
        }
        
        // Тут будет логика отображения уже сгенерированных фото, если они есть
        // Например, вставляем их в #generated-photos-container
        const container = document.getElementById('generated-photos-container');
        container.innerHTML = ''; // Очищаем контейнер
        
        // Для примера, сгенерируем несколько карточек
        for(let i=0; i<4; i++){
            const photoCard = document.createElement('div');
            photoCard.className = 'generated-photo-card';
            photoCard.innerHTML = `
                <div class="generated-photo-image-container">
                    <img src="https://via.placeholder.com/300x400/333/fff?text=Photo+${i+1}" alt="сгенерированное фото">
                </div>
                <button class="photosession-button">Фотосессия</button>
            `;
            container.appendChild(photoCard);
        }
        
        showPage('generation-page');
    }
    
    // ========== ПРОФИЛЬ И БАЛАНС ==========
    function updateBalance() {
        document.querySelectorAll('.user-balance').forEach(el => {
            el.textContent = `${userBalance} ₽`;
        });
    }

    function updateUserProfile() {
        updateBalance();
        // Моковые данные для статистики
        document.getElementById('photos-generated-stat').textContent = '28';
        document.getElementById('photosessions-created-stat').textContent = '3';
        document.getElementById('styles-used-stat').textContent = '12';
    }

    document.getElementById('top-up-btn').addEventListener('click', () => {
        // Здесь будет логика для пополнения через Юкасса
        tg.showPopup({
            title: 'Пополнение баланса',
            message: 'Функция пополнения через Юкасса скоро будет доступна!',
            buttons: [{ type: 'ok' }]
        });
    });


    // ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========
    function resetInactivityTimer() {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(() => {
            // При неактивности возвращаемся на главную страницу
            history = ['main-page'];
            showPage('main-page', false);
        }, 5 * 60 * 1000); // 5 минут
    }

    // Первоначальное заполнение динамических данных
    populateCategories();
    populatePhotosessionCategories();
    populateMyPhotos();
    updateUserProfile();
});
