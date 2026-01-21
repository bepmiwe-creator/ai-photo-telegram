// app.js - Основная логика приложения Nano Banana

// ========== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ==========
let currentCategory = null;
let selectedModel = 'nano';
let selectedFormat = '1:1';
let uploadedImages = [];
let userBalance = 50; // Для примера, позже получим с сервера

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

// ========== ФУНКЦИИ ДЛЯ РАБОТЫ С ИНТЕРФЕЙСОМ ==========

// 1. ЗАГРУЗКА КАТЕГОРИЙ НА ГЛАВНЫЙ ЭКРАН ФОТО
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
}

// 2. ОБРАБОТКА НАЖАТИЯ НА КАТЕГОРИЮ
function onCategoryClick(categoryId) {
    currentCategory = categoryId;
    
    if (categoryId === 'create') {
        // Для "Создать свой" показываем экран генерации сразу
        showGenerateScreen();
    } else {
        // Для остальных категорий можно загрузить примеры стилей
        // Сейчас просто показываем экран генерации
        showGenerateScreen();
        
        // В будущем здесь будет загрузка стилей из этой категории
        // loadStylesForCategory(categoryId);
    }
}

// 3. ПОКАЗ ЭКРАНА ГЕНЕРАЦИИ
function showGenerateScreen() {
    // Скрываем сетку категорий, показываем оверлей
    document.getElementById('categories-container').style.display = 'none';
    document.getElementById('styles-container').style.display = 'none';
    document.getElementById('screen-generate').style.display = 'flex';
    
    // Загружаем форматы
    loadFormats();
    
    // Обновляем цену
    updateTotalPrice();
    
    // Устанавливаем обработчик закрытия
    document.getElementById('generate-back-btn').onclick = hideGenerateScreen;
}

// 4. СКРЫТИЕ ЭКРАНА ГЕНЕРАЦИИ
function hideGenerateScreen() {
    document.getElementById('screen-generate').style.display = 'none';
    document.getElementById('categories-container').style.display = 'grid';
    
    // Сбрасываем выбранные параметры
    uploadedImages = [];
    updateUploadGrid();
    
    // Убираем выделение
    document.querySelectorAll('.model-card').forEach(card => card.classList.remove('selected'));
    document.querySelector('.model-card[data-model="nano"]').classList.add('selected');
    selectedModel = 'nano';
    
    document.querySelectorAll('.format-card').forEach(card => card.classList.remove('selected'));
    document.querySelector('.format-card').classList.add('selected');
    selectedFormat = '1:1';
}

// 5. ЗАГРУЗКА ВАРИАНТОВ ФОРМАТА
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

// 6. ОБНОВЛЕНИЕ СЕТКИ ЗАГРУЖЕННЫХ ФОТО
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
    document.getElementById('upload-add-btn').addEventListener('click', simulateUpload);
}

// 7. СИМУЛЯЦИЯ ЗАГРУЗКИ ФОТО (заглушка)
function simulateUpload() {
    if (uploadedImages.length >= 5) {
        alert('Можно загрузить не более 5 фото');
        return;
    }
    
    // В реальном приложении здесь будет вызов нативной загрузки файлов
    // Через <input type="file"> или Telegram Web App SDK
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

// 8. ВЫБОР МОДЕЛИ И ОБНОВЛЕНИЕ ЦЕНЫ
function setupModelSelection() {
    document.querySelectorAll('.model-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.model-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedModel = card.dataset.model;
            updateTotalPrice();
        });
    });
}

// 9. РАСЧЕТ И ОБНОВЛЕНИЕ ИТОГОВОЙ ЦЕНЫ
function updateTotalPrice() {
    let price = selectedModel === 'nano' ? 7 : 25;
    
    // Если выбрана категория "Создать свой" - добавляем 10 звезд
    if (currentCategory === 'create') {
        price += 10;
    }
    
    document.getElementById('total-price').textContent = price;
    
    // Проверяем хватит ли баланса
    const btn = document.getElementById('start-generate-btn');
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

// 10. ЗАПУСК ГЕНЕРАЦИИ (заглушка)
function setupGenerateButton() {
    const btn = document.getElementById('start-generate-btn');
    if (!btn) return;
    
    btn.addEventListener('click', () => {
        if (uploadedImages.length === 0 && currentCategory !== 'create') {
            alert('Пожалуйста, загрузите хотя бы одно фото для генерации');
            return;
        }
        
        // Показываем имитацию процесса
        btn.disabled = true;
        btn.innerHTML = `<span class="generate-icon">⏳</span><span>Генерация...</span>`;
        
        // Имитация запроса к ИИ (3 секунды)
        setTimeout(() => {
            alert('🎉 Генерация завершена! В реальном приложении здесь будет переход к результату.');
            hideGenerateScreen();
            
            // Возвращаем кнопку в исходное состояние
            setTimeout(() => {
                btn.disabled = false;
                updateTotalPrice();
            }, 500);
        }, 3000);
    });
}

// ========== ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ ==========
document.addEventListener('DOMContentLoaded', () => {
    // Загружаем категории
    loadCategories();
    
    // Настраиваем выбор модели
    setupModelSelection();
    
    // Настраиваем кнопку генерации
    setupGenerateButton();
    
    // Настраиваем кнопку "Генерация по промпту"
    document.getElementById('prompt-generate-btn')?.addEventListener('click', () => {
        currentCategory = 'prompt';
        showGenerateScreen();
    });
    
    // Инициализируем сетку загрузки фото
    updateUploadGrid();
    
    // Показываем баланс
    document.getElementById('header-balance').textContent = userBalance;
    document.getElementById('profile-balance').textContent = userBalance;
    
    console.log('Nano Banana App инициализирован!');
});
