// app.js - Единый рабочий код для Nano Banana

// ========== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ==========
let userBalance = 85;
let uploadedImages = [];
let currentCategory = null;
let selectedModel = 'nano';
let selectedFormat = '1:1';

// ========== ДАННЫЕ ==========
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

// ========== ЗАПУСК ПРИЛОЖЕНИЯ ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('Nano Banana запускается...');
    
    // 1. Инициализируем Telegram
    initTelegram();
    
    // 2. Настраиваем навигацию
    setupNavigation();
    
    // 3. Загружаем раздел Фото
    loadPhotoCategories();
    
    // 4. Настраиваем кнопки
    setupButtons();
    
    // 5. Плавное появление
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// ========== TELEGRAM ==========
function initTelegram() {
    if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.expand();
        
        // Получаем данные пользователя
        const user = tg.initDataUnsafe?.user;
        if (user) {
            const userName = user.first_name || 'Пользователь';
            document.getElementById('profile-name').textContent = userName;
            document.getElementById('profile-id').textContent = user.id || '...';
        }
        
        console.log('Telegram подключен');
    }
}

// ========== НАВИГАЦИЯ ==========
function setupNavigation() {
    // Все кнопки Tab Bar
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    // Все быстрые кнопки на главной
    const quickCards = document.querySelectorAll('.quick-card');
    
    // Все экраны
    const screens = document.querySelectorAll('.screen');
    const generateOverlay = document.getElementById('screen-generate');
    
    // Функция переключения экрана
    function switchScreen(screenId) {
        console.log('Переключаемся на экран:', screenId);
        
        // 1. Скрываем все обычные экраны
        screens.forEach(screen => {
            screen.classList.remove('active');
        });
        
        // 2. Скрываем оверлей генерации (если открыт)
        if (generateOverlay) {
            generateOverlay.style.display = 'none';
        }
        
        // 3. Показываем нужный экран
        const targetScreen = document.getElementById(`screen-${screenId}`);
        if (targetScreen) {
            targetScreen.classList.add('active');
            
            // 4. Обновляем активную кнопку в Tab Bar
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.screen === screenId) {
                    btn.classList.add('active');
                }
            });
            
            // 5. Если перешли в Фото - загружаем категории
            if (screenId === 'photo') {
                loadPhotoCategories();
            }
        }
    }
    
    // Клик по Tab Bar
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const screenId = this.getAttribute('data-screen');
            switchScreen(screenId);
        });
    });
    
    // Клик по быстрым кнопкам на главной
    quickCards.forEach(card => {
        card.addEventListener('click', function() {
            const screenId = this.getAttribute('data-screen');
            switchScreen(screenId);
        });
    });
    
    // Кнопка баланса
    const balanceBtn = document.getElementById('balance-btn');
    if (balanceBtn) {
        balanceBtn.addEventListener('click', function() {
            alert(`Ваш баланс: ${userBalance} звёзд\n\nДля пополнения откройте приложение в Telegram боте.`);
        });
    }
}

// ========== РАЗДЕЛ "ФОТО" ==========
function loadPhotoCategories() {
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
        
        card.addEventListener('click', () => {
            currentCategory = cat.id;
            showGenerateScreen();
        });
        
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

// ========== ЭКРАН ГЕНЕРАЦИИ ==========
function showGenerateScreen() {
    const generateScreen = document.getElementById('screen-generate');
    if (generateScreen) {
        generateScreen.style.display = 'flex';
        loadFormats();
        updateTotalPrice();
        
        // Кнопка "Назад" в генерации
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

// ========== КНОПКИ ==========
function setupButtons() {
    // Выбор модели ИИ
    document.querySelectorAll('.model-card').forEach(card => {
        card.addEventListener('click', function() {
            document.querySelectorAll('.model-card').forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            selectedModel = this.dataset.model;
            updateTotalPrice();
        });
    });
    
    // Кнопка загрузки фото
    const uploadBtn = document.getElementById('upload-add-btn');
    if (uploadBtn) {
        uploadBtn.addEventListener('click', simulateUpload);
    }
    
    // Кнопка генерации
    const generateBtn = document.getElementById('start-generate-btn');
    if (generateBtn) {
        generateBtn.addEventListener('click', function() {
            startGeneration();
        });
    }
    
    // Кнопки в Фотосессиях
    document.querySelectorAll('.photosession-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            alert('Фотосессия скоро будет доступна!');
        });
    });
    
    // Кнопки в Видео
    document.querySelectorAll('.video-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            alert('Генерация видео скоро будет доступна!');
        });
    });
}

function simulateUpload() {
    if (uploadedImages.length >= 5) {
        alert('Можно загрузить не более 5 фото');
        return;
    }
    
    // Тестовые изображения
    const testImages = [
        'https://via.placeholder.com/300/FFC0CB/FFFFFF?text=Фото+1',
        'https://via.placeholder.com/300/FFB6C1/FFFFFF?text=Фото+2',
        'https://via.placeholder.com/300/FF69B4/FFFFFF?text=Фото+3'
    ];
    
    const randomImg = testImages[Math.floor(Math.random() * testImages.length)];
    uploadedImages.push({ preview: randomImg });
    updateUploadGrid();
}

function updateUploadGrid() {
    const container = document.getElementById('upload-grid');
    if (!container) return;
    
    container.innerHTML = `
        <div class="upload-item upload-add" id="upload-add-btn">
            <span class="material-icons-round">add</span>
            <span>Добавить фото</span>
        </div>
    `;
    
    uploadedImages.forEach((img, index) => {
        const item = document.createElement('div');
        item.className = 'upload-item';
        item.innerHTML = `<img src="${img.preview}" alt="Загруженное фото ${index + 1}">`;
        container.insertBefore(item, container.firstChild);
    });
    
    // Обновляем обработчик
    document.getElementById('upload-add-btn').addEventListener('click', simulateUpload);
}

function startGeneration() {
    const price = calculatePrice();
    
    // Проверка баланса
    if (price > userBalance) {
        alert(`Недостаточно звёзд!\nНужно: ${price}, у вас: ${userBalance}`);
        return;
    }
    
    // Проверка загруженных фото (если не "Создать свой" и не "Промпт")
    if (uploadedImages.length === 0 && currentCategory !== 'create' && currentCategory !== 'prompt') {
        alert('Пожалуйста, загрузите хотя бы одно фото для генерации');
        return;
    }
    
    const btn = document.getElementById('start-generate-btn');
    btn.disabled = true;
    btn.innerHTML = `<span class="generate-icon">⏳</span><span>Генерация...</span>`;
    
    // Имитация процесса
    setTimeout(() => {
        // Списание звёзд
        userBalance -= price;
        updateBalance();
        
        alert('🎉 Генерация завершена!\nФото добавлены в ваш профиль.');
        
        // Возвращаем кнопку
        setTimeout(() => {
            btn.disabled = false;
            updateTotalPrice();
            hideGenerateScreen();
        }, 500);
    }, 3000);
}

function calculatePrice() {
    let price = selectedModel === 'nano' ? 7 : 25;
    if (currentCategory === 'create') price += 10;
    return price;
}

function updateTotalPrice() {
    const price = calculatePrice();
    document.getElementById('total-price').textContent = price;
    
    const btn = document.getElementById('start-generate-btn');
    if (price > userBalance) {
        btn.disabled = true;
        btn.innerHTML = `<span class="generate-icon">⚠️</span><span>Недостаточно звёзд</span>`;
    } else {
        btn.disabled = false;
        btn.innerHTML = `<span class="generate-icon">✨</span><span>Сгенерировать за <span id="total-price">${price}</span> звёзд</span>`;
    }
}

function updateBalance() {
    document.getElementById('header-balance').textContent = userBalance;
    document.getElementById('profile-balance').textContent = userBalance;
}

// ========== ПЛАВНАЯ ЗАГРУЗКА ==========
document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.5s ease';

console.log('Nano Banana App готов!');
