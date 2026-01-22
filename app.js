// app.js - Единый код для Nano Banana App

// ========== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ==========
let userBalance = 85; // Начальный баланс
let currentScreen = 'main';
let uploadedImages = [];
let currentCategory = null;
let selectedModel = 'nano';
let selectedFormat = '1:1';

// ========== МАССИВЫ ДАННЫХ ==========
const categories = [
    { id: 'create', title: 'Создать свой', icon: '🆕', count: 'Ваш стиль' },
    { id: 'winter', title: 'Зима', icon: '❄️', count: '24 стиля' },
    { id: 'birthday', title: 'День рождения', icon: '🎂', count: '18 стилей' },
    { id: 'trends', title: 'Тренды', icon: '🔥', count: '32 стиля' },
    { id: 'couples', title: 'Парные', icon: '👫', count: '15 стилей' },
    { id: 'girls', title: 'Для девушек', icon: '💃', count: '28 стилей' },
    { id: 'men', title: 'Для мужчин', icon: '🕺', count: '16 стилей' },
    { id: 'pets', title: 'Питомцы', icon: '🐾', count: '12 стилей' },
    { id: 'professions', title: 'Профессии', icon: '💼', count: '21 стиль' },
    { id: 'luxury', title: 'Luxury', icon: '💎', count: '14 стилей' }
];

const formats = [
    { id: '1:1', name: 'Квадрат', ratio: '1:1' },
    { id: '4:5', name: 'Портрет', ratio: '4:5' },
    { id: '16:9', name: 'Широкий', ratio: '16:9' },
    { id: '9:16', name: 'Сторис', ratio: '9:16' },
    { id: '3:4', name: 'Классика', ratio: '3:4' },
    { id: '2:3', name: 'Постер', ratio: '2:3' },
    { id: '3:2', name: 'Ландшафт', ratio: '3:2' },
    { id: '5:4', name: 'Фото', ratio: '5:4' },
    { id: '7:5', name: 'Панорама', ratio: '7:5' },
    { id: '5:7', name: 'Вертикаль', ratio: '5:7' },
    { id: '4:3', name: 'Экран', ratio: '4:3' }
];

// ========== ОСНОВНАЯ ИНИЦИАЛИЗАЦИЯ ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('Nano Banana App загружается...');
    
    // 1. Инициализация Telegram Web App
    initTelegram();
    
    // 2. Настройка навигации
    initNavigation();
    
    // 3. Загрузка категорий фото
    loadCategories();
    
    // 4. Настройка кнопок генерации
    initGenerationButtons();
    
    // 5. Обновление баланса
    updateBalanceDisplay();
    
    console.log('Приложение инициализировано!');
});

// ========== ФУНКЦИИ ТЕЛЕГРАМ ==========
function initTelegram() {
    if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.expand(); // Раскрываем на весь экран
        tg.enableClosingConfirmation();
        
        // Получаем данные пользователя
        const user = tg.initDataUnsafe?.user;
        if (user) {
            const userName = user.first_name || 'Пользователь';
            document.getElementById('profile-name').textContent = userName;
            document.getElementById('profile-id').textContent = user.id || '...';
            
            // Сохраняем для будущего использования
            window.tg = tg;
            window.userData = user;
        }
        
        console.log('Telegram WebApp инициализирован');
    } else {
        console.warn('Telegram WebApp SDK не найден. Запущено в браузере.');
    }
}

// ========== НАВИГАЦИЯ ==========
function initNavigation() {
    // 1. Tab Bar кнопки
    const tabButtons = document.querySelectorAll('.tab-btn');
    const quickCards = document.querySelectorAll('.quick-card');
    
    // Функция переключения экрана
    function switchScreen(screenId) {
        // Скрываем все экраны
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Показываем выбранный экран
        const targetScreen = document.getElementById(`screen-${screenId}`);
        if (targetScreen) {
            targetScreen.classList.add('active');
            currentScreen = screenId;
            
            // Обновляем активную кнопку в Tab Bar
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.screen === screenId) {
                    btn.classList.add('active');
                }
            });
            
            // Если перешли в раздел фото - загружаем категории
            if (screenId === 'photo') {
                loadCategories();
            }
            
            console.log(`Переключились на экран: ${screenId}`);
        }
    }
    
    // Обработчики для Tab Bar
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const screenId = button.getAttribute('data-screen');
            switchScreen(screenId);
        });
    });
    
    // Обработчики для быстрых карточек на главной
    quickCards.forEach(card => {
        card.addEventListener('click', () => {
            const screenId = card.getAttribute('data-screen');
            switchScreen(screenId);
        });
    });
    
    // 2. Кнопка баланса в шапке
    const balanceBtn = document.getElementById('balance-btn');
    if (balanceBtn) {
        balanceBtn.addEventListener('click', function() {
            if (window.tg) {
                window.tg.showPopup({
                    title: 'Пополнение баланса',
                    message: `Ваш текущий баланс: ${userBalance} звёзд\n\nПополнение через Telegram бота скоро будет доступно!`,
                    buttons: [{ type: 'default', text: 'Понятно' }]
                });
            } else {
                alert(`Ваш баланс: ${userBalance} звёзд\n\nДля пополнения баланса откройте приложение в Telegram боте.`);
            }
        });
    }
}

// ========== РАЗДЕЛ "ФОТО" ==========
function loadCategories() {
    const container = document.getElementById('categories-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    categories.forEach(cat => {
        const card = document.createElement('div');
        card.className = `category-card ${cat.id === 'create' ? 'create-own' : ''}`;
        card.dataset.categoryId = cat.id;
        
        card.innerHTML = `
            <div class="category-icon">${cat.icon}</div>
            <div class="category-title">${cat.title}</div>
            <div class="category-count">${cat.count}</div>
        `;
        
        card.addEventListener('click', () => onCategoryClick(cat.id));
        container.appendChild(card);
    });
    
    // Кнопка "Генерация по описанию"
    const promptBtn = document.getElementById('prompt-generate-btn');
    if (promptBtn) {
        promptBtn.addEventListener('click', function() {
            currentCategory = 'prompt';
            showGenerateScreen();
        });
    }
}

function onCategoryClick(categoryId) {
    currentCategory = categoryId;
    console.log(`Выбрана категория: ${categoryId}`);
    
    if (categoryId === 'create') {
        // Для "Создать свой" показываем экран генерации сразу
        showGenerateScreen();
    } else {
        // Для остальных категорий можно загрузить примеры стилей
        // Сейчас просто показываем экран генерации
        showGenerateScreen();
    }
}

// ========== ЭКРАН ГЕНЕРАЦИИ ==========
function showGenerateScreen() {
    // Показываем оверлей генерации
    const generateScreen = document.getElementById('screen-generate');
    if (generateScreen) {
        generateScreen.style.display = 'flex';
        
        // Загружаем форматы
        loadFormats();
        
        // Обновляем цену
        updateTotalPrice();
        
        // Устанавливаем обработчик закрытия
        const backBtn = document.getElementById('generate-back-btn');
        if (backBtn) {
            backBtn.onclick = hideGenerateScreen;
        }
    }
}

function hideGenerateScreen() {
    const generateScreen = document.getElementById('screen-generate');
    if (generateScreen) {
        generateScreen.style.display = 'none';
    }
    
    // Сбрасываем выбранные параметры
    uploadedImages = [];
    updateUploadGrid();
    
    // Убираем выделение с моделей и форматов
    document.querySelectorAll('.model-card').forEach(card => card.classList.remove('selected'));
    const nanoModel = document.querySelector('.model-card[data-model="nano"]');
    if (nanoModel) nanoModel.classList.add('selected');
    selectedModel = 'nano';
    
    document.querySelectorAll('.format-card').forEach(card => card.classList.remove('selected'));
    const firstFormat = document.querySelector('.format-card');
    if (firstFormat) firstFormat.classList.add('selected');
    selectedFormat = '1:1';
}

function loadFormats() {
    const container = document.getElementById('format-scroll');
    if (!container) return;
    
    container.innerHTML = '';
    
    formats.forEach(format => {
        const card = document.createElement('div');
        card.className = 'format-card';
        if (format.id === selectedFormat) card.classList.add('selected');
        card.dataset.formatId = format.id;
        
        card.innerHTML = `
            <div class="format-name">${format.name}</div>
            <div class="format-ratio">${format.ratio}</div>
        `;
        
        card.addEventListener('click', () => {
            document.querySelectorAll('.format-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedFormat = format.id;
        });
        
        container.appendChild(card);
    });
}

function updateUploadGrid() {
    const container = document.getElementById('upload-grid');
    if (!container) return;
    
    // Оставляем только кнопку добавления
    container.innerHTML = `
        <div class="upload-item upload-add" id="upload-add-btn">
            <span class="material-icons-round">add</span>
            <span>Добавить фото</span>
        </div>
    `;
    
    // Добавляем превью загруженных фото
    uploadedImages.forEach((img, index) => {
        const item = document.createElement('div');
        item.className = 'upload-item';
        item.innerHTML = `<img src="${img.preview}" alt="Загруженное фото ${index + 1}">`;
        container.insertBefore(item, container.firstChild);
    });
    
    // Вешаем обработчик на кнопку добавления
    const uploadBtn = document.getElementById('upload-add-btn');
    if (uploadBtn) {
        uploadBtn.addEventListener('click', simulateUpload);
    }
}

function simulateUpload() {
    if (uploadedImages.length >= 5) {
        alert('Можно загрузить не более 5 фото');
        return;
    }
    
    // В реальном приложении здесь будет вызов нативной загрузки файлов
    alert('В реальном приложении здесь откроется выбор файлов с телефона. Для демо просто добавляем заглушку.');
    
    // Добавляем тестовое изображение
    const testImages = [
        'https://via.placeholder.com/300/FFC0CB/FFFFFF?text=Фото+1',
        'https://via.placeholder.com/300/FFB6C1/FFFFFF?text=Фото+2',
        'https://via.placeholder.com/300/FF69B4/FFFFFF?text=Фото+3'
    ];
    
    const randomImg = testImages[Math.floor(Math.random() * testImages.length)];
    uploadedImages.push({ preview: randomImg });
    updateUploadGrid();
}

function initGenerationButtons() {
    // Выбор модели
    document.querySelectorAll('.model-card').forEach(card => {
        card.addEventListener('click', function() {
            document.querySelectorAll('.model-card').forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            selectedModel = this.dataset.model;
            updateTotalPrice();
        });
    });
    
    // Кнопка генерации
    const generateBtn = document.getElementById('start-generate-btn');
    if (generateBtn) {
        generateBtn.addEventListener('click', function() {
            if (uploadedImages.length === 0 && currentCategory !== 'create' && currentCategory !== 'prompt') {
                alert('Пожалуйста, загрузите хотя бы одно фото для генерации');
                return;
            }
            
            // Проверяем баланс
            const price = calculatePrice();
            if (price > userBalance) {
                alert(`Недостаточно звёзд! Нужно: ${price}, у вас: ${userBalance}`);
                return;
            }
            
            // Показываем имитацию процесса
            this.disabled = true;
            this.innerHTML = `<span class="generate-icon">⏳</span><span>Генерация...</span>`;
            
            // Имитация запроса к ИИ (3 секунды)
            setTimeout(() => {
                alert('🎉 Генерация завершена! В реальном приложении здесь будет переход к результату.');
                
                // Списание звёзд
                userBalance -= price;
                updateBalanceDisplay();
                
                // Возвращаем кнопку в исходное состояние
                setTimeout(() => {
                    this.disabled = false;
                    this.innerHTML = `<span class="generate-icon">✨</span><span>Сгенерировать за <span id="total-price">${price}</span> звёзд</span>`;
                    
                    // Закрываем экран генерации
                    hideGenerateScreen();
                }, 500);
            }, 3000);
        });
    }
    
    // Инициализируем сетку загрузки фото
    updateUploadGrid();
}

function calculatePrice() {
    let price = selectedModel === 'nano' ? 7 : 25;
    
    // Если выбрана категория "Создать свой" - добавляем 10 звезд
    if (currentCategory === 'create') {
        price += 10;
    }
    
    return price;
}

function updateTotalPrice() {
    const price = calculatePrice();
    const priceElement = document.getElementById('total-price');
    if (priceElement) {
        priceElement.textContent = price;
    }
    
    const btn = document.getElementById('start-generate-btn');
    if (btn) {
        if (price > userBalance) {
            btn.disabled = true;
            btn.innerHTML = `<span class="generate-icon">⚠️</span><span>Недостаточно звёзд</span>`;
            btn.style.background = 'linear-gradient(90deg, #ff5252, #ff4081)';
        } else {
            btn.disabled = false;
            btn.innerHTML = `<span class="generate-icon">✨</span><span>Сгенерировать за <span id="total-price">${price}</span> звёзд</span>`;
            btn.style.background = 'linear-gradient(90deg, #ec407a, #ff4081)';
        }
    }
}

// ========== БАЛАНС ==========
function updateBalanceDisplay() {
    // В шапке
    const headerBalance = document.getElementById('header-balance');
    if (headerBalance) {
        headerBalance.textContent = userBalance;
    }
    
    // В профиле
    const profileBalance = document.getElementById('profile-balance');
    if (profileBalance) {
        profileBalance.textContent = userBalance;
    }
}

// ========== ПРОФИЛЬ ==========
// (Здесь можно добавить функции для работы с профилем)

// ========== ПЛАВНАЯ ЗАГРУЗКА ==========
window.addEventListener('load', function() {
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.5s ease';
