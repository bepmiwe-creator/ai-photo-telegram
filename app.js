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
        
        // Устанавливаем заголовок в зависимости от типа генерации
        const titleElement = document.getElementById('generate-title');
        const typeBadge = document.getElementById('type-badge');
        
        if (currentCategory === 'prompt') {
            if (titleElement) titleElement.textContent = 'Генерация по описанию';
            if (typeBadge) typeBadge.textContent = '✨ По описанию';
            document.getElementById('prompt-section').style.display = 'block';
        } else if (currentCategory === 'create') {
            if (titleElement) titleElement.textContent = 'Создать свой стиль';
            if (typeBadge) typeBadge.textContent = '🆕 Свой стиль';
            document.getElementById('prompt-section').style.display = 'none';
        } else {
            if (titleElement) titleElement.textContent = 'Генерация фото';
            if (typeBadge) typeBadge.textContent = '📷 Из фото';
            document.getElementById('prompt-section').style.display = 'none';
        }
        
     // Просто настраиваем выбор формата
        setupFormatSelect();
        
        // Обновляем цену
        updateTotalPrice();
        
        // Настраиваем поле промпта
        setupPromptField();
        
        // Проверяем активность кнопки
        checkGenerateButton();
        
                       // Устанавливаем обработчик закрытия
        const backBtn = document.getElementById('generate-back-btn');
        if (backBtn) {
            backBtn.onclick = hideGenerateScreen;
        }
    }
function hideGenerateScreen() {
    const generateScreen = document.getElementById('screen-generate');
    if (generateScreen) {
        generateScreen.style.display = 'none';
        
        // Сбрасываем загруженные фото
        uploadedImages = [];
        updateUploadGrid();
        
        // Сбрасываем выбор модели (стандартная Nano)
        document.querySelectorAll('.model-card').forEach(card => {
            card.classList.remove('selected');
        });
        const nanoModel = document.querySelector('.model-card[data-model="nano"]');
        if (nanoModel) {
            nanoModel.classList.add('selected');
        }
        selectedModel = 'nano';
        
        // Сбрасываем выбор формата (стандартный 1:1)
        const formatSelect = document.getElementById('format-select');
        if (formatSelect) {
            formatSelect.value = '1:1';
            selectedFormat = '1:1';
        }
        
        // Очищаем поле промпта (если было открыто)
        const promptField = document.getElementById('ai-prompt');
        if (promptField) {
            promptField.value = '';
        }
        
        // Сбрасываем счетчик символов
        const charCount = document.getElementById('char-count');
        if (charCount) {
            charCount.textContent = '0';
            charCount.style.color = '#777';
        }
        
        console.log('Экран генерации закрыт');
    }
}
}

// ========== НОВЫЕ ФУНКЦИИ ДЛЯ УЛУЧШЕННОГО ИНТЕРФЕЙСА ==========

// 1. Загрузка форматов с иконками
function loadFormatIcons() {
    const container = document.getElementById('format-icons');
    if (!container) return;
    
    container.innerHTML = '';
    
    const formatsWithIcons = [
        { id: '1:1', name: 'Квадрат', icon: '⬜', class: 'square' },
        { id: '4:5', name: 'Портрет', icon: '📱', class: 'portrait' },
        { id: '16:9', name: 'Широкий', icon: '📺', class: 'wide' },
        { id: '9:16', name: 'Сторис', icon: '📲', class: 'story' },
        { id: '3:4', name: 'Классика', icon: '🖼️', class: 'classic' },
        { id: '2:3', name: 'Постер', icon: '🎬', class: 'poster' }
    ];
    
    formatsWithIcons.forEach(format => {
        const item = document.createElement('div');
        item.className = `format-icon-item ${format.id === selectedFormat ? 'selected' : ''}`;
        item.dataset.formatId = format.id;
        item.dataset.formatName = format.name;
        
        item.innerHTML = `
            <div class="format-icon-box ${format.class}">
                <div class="icon-inside">${format.icon}</div>
            </div>
            <span class="format-icon-label">${format.name}</span>
        `;
        
        item.addEventListener('click', () => {
            document.querySelectorAll('.format-icon-item').forEach(c => c.classList.remove('selected'));
            item.classList.add('selected');
            selectedFormat = format.id;
        });
        
        container.appendChild(item);
    });
}

// 2. Настройка поля промпта
function setupPromptField() {
    const promptTextarea = document.getElementById('ai-prompt');
    const charCount = document.getElementById('char-count');
    const exampleChips = document.querySelectorAll('.example-chip');
    
    if (promptTextarea && charCount) {
        // Счетчик символов
        promptTextarea.addEventListener('input', function() {
            const count = this.value.length;
            charCount.textContent = count;
            
            // Меняем цвет при приближении к лимиту
            if (count > 1800) {
                charCount.style.color = '#ff5722';
            } else if (count > 1500) {
                charCount.style.color = '#ff9800';
            } else {
                charCount.style.color = '#777';
            }
            
            // Проверяем кнопку генерации
            checkGenerateButton();
        });
        
        // Примеры промптов
        exampleChips.forEach(chip => {
            chip.addEventListener('click', function() {
                const example = this.dataset.example;
                promptTextarea.value = example;
                promptTextarea.dispatchEvent(new Event('input'));
                promptTextarea.focus();
            });
        });
        
        // Автофокус при открытии
        if (currentCategory === 'prompt') {
            setTimeout(() => {
                promptTextarea.focus();
            }, 300);
        }
    }
}

// 3. Проверка активности кнопки генерации
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
        // Для генерации по описанию нужен либо промпт, либо фото
        isEnabled = hasPrompt || hasPhotos;
        text = hasPrompt ? `Сгенерировать за ${calculatePrice()} звёзд` : 'Введите промпт';
        hint = hasPrompt ? 'Готово к генерации!' : 
               hasPhotos ? 'Готово к генерации по фото!' : 
               'Заполните поле "Опишите изображение" для генерации';
    } else if (currentCategory === 'create') {
        // Для "Создать свой" нужны фото
        isEnabled = hasPhotos;
        text = hasPhotos ? `Создать за ${calculatePrice()} звёзд` : 'Загрузите фото';
        hint = hasPhotos ? 'Готово к созданию стиля!' : 'Загрузите хотя бы одно фото';
    } else {
        // Для обычных категорий нужны фото
        isEnabled = hasPhotos;
        text = hasPhotos ? `Сгенерировать за ${calculatePrice()} звёзд` : 'Загрузите фото';
        hint = hasPhotos ? 'Готово к генерации!' : 'Загрузите хотя бы одно фото';
    }
    
    // Обновляем кнопку
    generateBtn.disabled = !isEnabled;
    btnText.textContent = text;
    hintText.textContent = hint;
    
    // Меняем цвет подсказки
    if (isEnabled) {
        hintText.style.color = '#4CAF50';
    } else {
        hintText.style.color = '#ff9800';
    }
    
    // Обновляем иконку
    const icon = generateBtn.querySelector('.generate-icon');
    if (icon) {
        icon.textContent = isEnabled ? '✨' : '📝';
    }
}
// Простая настройка выбора формата
function setupFormatSelect() {
    const formatSelect = document.getElementById('format-select');
    
    if (!formatSelect) return;
    
    // Устанавливаем начальное значение
    formatSelect.value = selectedFormat;
    
    // Обработчик изменения
    formatSelect.addEventListener('change', function() {
        selectedFormat = this.value;
        console.log('Выбран формат:', selectedFormat);
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
 
    // Инициализация фотосессий
    setupPhotosessions();
    
    // Инициализация видео
    setupVideo();
}
 

function simulateUpload() {
    if (uploadedImages.length >= 5) {
        alert('Можно загрузить не более 5 фото');
        return;
    }
    
    // Имитируем загрузку (в реальном приложении будет выбор файлов)
    alert('В реальном приложении здесь откроется выбор файлов с телефона\n\nДля демо добавляем тестовое фото');
    
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
    
    // Вешаем обработчик на кнопку добавления
    const uploadBtn = document.getElementById('upload-add-btn');
    if (uploadBtn) {
        uploadBtn.addEventListener('click', simulateUpload);
    }
    checkGenerateButton();
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
        // Добавляем запись в историю
        const categoryName = currentCategory === 'create' ? 'Свой стиль' : 
                            currentCategory === 'prompt' ? 'По промпту' : 
                            categories.find(c => c.id === currentCategory)?.title || 'Фото';
        
        if (window.addToHistory) {
            window.addToHistory('photo', 
                `Фото: ${categoryName}`,
                `Модель: ${selectedModel === 'nano' ? 'Nano Banana' : 'Nano Banana Pro'}, Формат: ${selectedFormat}`,
                price
            );
        }
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
    
    // Обновляем цену в кнопке (если она активна)
    const btnText = document.getElementById('generate-btn-text');
    if (btnText && !document.getElementById('start-generate-btn').disabled) {
        btnText.textContent = `Сгенерировать за ${price} звёзд`;
    }
    
    // Проверяем кнопку генерации
    checkGenerateButton();
}

function updateBalance() {
    document.getElementById('header-balance').textContent = userBalance;
    document.getElementById('profile-balance').textContent = userBalance;
}

// ========== ПЛАВНАЯ ЗАГРУЗКА ==========
document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.5s ease';

// ========== ФОТОСЕССИИ ==========
function setupPhotosessions() {
    // Данные пакетов
    const photosessionPacks = {
        winter: { name: 'Зимняя сказка', price: 159, icon: '❄️' },
        wedding: { name: 'Свадебная', price: 159, icon: '💍' },
        beach: { name: 'Пляжный отдых', price: 159, icon: '🏖️' },
        luxury: { name: 'Роскошь Luxury', price: 159, icon: '💎' },
        custom: { name: 'Своя фотосессия', price: 200, icon: '🎨' }
    };
    
    let currentPack = null;
    let currentStep = 1;
    let uploadedSessionPhotos = [];
    
    // Обработчики для карточек пакетов
    document.querySelectorAll('.photosession-card').forEach(card => {
        card.addEventListener('click', function(e) {
            // Если кликнули не на кнопку внутри карточки
            if (!e.target.closest('.photosession-btn')) {
                const packId = this.dataset.pack;
                selectPhotosessionPack(packId);
            }
        });
    });
    
    // Обработчики для кнопок выбора пакета
    document.querySelectorAll('.photosession-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation(); // Чтобы не срабатывал клик по карточке
            const packId = this.dataset.pack;
            selectPhotosessionPack(packId);
        });
    });
    
    function selectPhotosessionPack(packId) {
        currentPack = photosessionPacks[packId];
        if (!currentPack) return;
        
        console.log('Выбран пакет:', currentPack.name);
        
        // Обновляем информацию в экране генерации
        document.getElementById('selected-pack-name').textContent = currentPack.name;
        document.getElementById('summary-pack-name').textContent = currentPack.name;
        
        // Устанавливаем цену
        const priceElement = document.getElementById('photosession-total-price');
        const finalPriceElement = document.getElementById('photosession-final-price');
        if (priceElement) priceElement.textContent = currentPack.price + ' звёзд';
        if (finalPriceElement) finalPriceElement.textContent = currentPack.price;
        
        // Показываем экран генерации
        showPhotosessionGenerate();
    }
    
    function showPhotosessionGenerate() {
        const generateScreen = document.getElementById('screen-photosession-generate');
        if (generateScreen) {
            generateScreen.style.display = 'flex';
            resetPhotosessionSteps();
            
            // Кнопка "Назад"
            const backBtn = document.getElementById('photosession-back-btn');
            if (backBtn) {
                backBtn.onclick = hidePhotosessionGenerate;
            }
            
            // Навигация по шагам
            setupPhotosessionSteps();
            
            // Загрузка фото
            setupPhotosessionUpload();
            
            // Кнопка генерации
            const generateBtn = document.getElementById('start-photosession-btn');
            if (generateBtn) {
                generateBtn.onclick = startPhotosessionGeneration;
            }
        }
    }
    
    function hidePhotosessionGenerate() {
        const generateScreen = document.getElementById('screen-photosession-generate');
        if (generateScreen) {
            generateScreen.style.display = 'none';
            resetPhotosessionSteps();
        }
    }
    
    function resetPhotosessionSteps() {
        currentStep = 1;
        uploadedSessionPhotos = [];
        updatePhotosessionSteps();
        
        // Сбрасываем загруженные фото
        const uploadedContainer = document.getElementById('photosession-uploaded');
        if (uploadedContainer) {
            uploadedContainer.innerHTML = '';
            document.getElementById('summary-photos-count').textContent = '0';
        }
    }
    
    function setupPhotosessionSteps() {
        const nextBtn = document.getElementById('next-step-btn');
        const prevBtn = document.getElementById('prev-step-btn');
        
        if (nextBtn) {
            nextBtn.onclick = function() {
                if (currentStep < 3) {
                    currentStep++;
                    updatePhotosessionSteps();
                }
            };
        }
        
        if (prevBtn) {
            prevBtn.onclick = function() {
                if (currentStep > 1) {
                    currentStep--;
                    updatePhotosessionSteps();
                }
            };
        }
    }
    
    function updatePhotosessionSteps() {
        // Обновляем шаги
        document.querySelectorAll('.step').forEach(step => {
            step.classList.remove('active');
            if (parseInt(step.dataset.step) === currentStep) {
                step.classList.add('active');
            }
        });
        
        // Показываем/скрываем контент шагов
        for (let i = 1; i <= 3; i++) {
            const stepContent = document.getElementById(`step-${i}`);
            if (stepContent) {
                stepContent.style.display = i === currentStep ? 'block' : 'none';
            }
        }
        
        // Управляем кнопками навигации
        const prevBtn = document.getElementById('prev-step-btn');
        const nextBtn = document.getElementById('next-step-btn');
        
        if (prevBtn) {
            prevBtn.style.display = currentStep > 1 ? 'block' : 'none';
        }
        
        if (nextBtn) {
            if (currentStep === 3) {
                nextBtn.style.display = 'none';
            } else if (currentStep === 2) {
                nextBtn.textContent = 'Подтвердить →';
                // Проверяем, загружены ли фото
                if (uploadedSessionPhotos.length < 3) {
                    nextBtn.disabled = true;
                    nextBtn.style.opacity = '0.6';
                } else {
                    nextBtn.disabled = false;
                    nextBtn.style.opacity = '1';
                }
            } else {
                nextBtn.textContent = 'Далее →';
                nextBtn.disabled = false;
                nextBtn.style.opacity = '1';
            }
        }
    }
    
    function setupPhotosessionUpload() {
        const uploadArea = document.getElementById('photosession-upload-area');
        const fileInput = document.getElementById('photosession-file-input');
        
        if (!uploadArea || !fileInput) return;
        
        // Клик по области загрузки
        uploadArea.addEventListener('click', function() {
            fileInput.click();
        });
        
        // Drag & Drop
        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.background = 'rgba(236, 64, 122, 0.1)';
            this.style.borderColor = 'rgba(236, 64, 122, 0.5)';
        });
        
        uploadArea.addEventListener('dragleave', function() {
            this.style.background = '';
            this.style.borderColor = '';
        });
        
        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.background = '';
            this.style.borderColor = '';
            
            const files = e.dataTransfer.files;
            handlePhotosessionFiles(files);
        });
        
        // Выбор файлов через input
        fileInput.addEventListener('change', function(e) {
            const files = e.target.files;
            handlePhotosessionFiles(files);
        });
    }
    
    function handlePhotosessionFiles(files) {
        const maxPhotos = 5;
        const remainingSlots = maxPhotos - uploadedSessionPhotos.length;
        
        if (files.length > remainingSlots) {
            alert(`Можно загрузить не более ${maxPhotos} фото. Осталось мест: ${remainingSlots}`);
            return;
        }
        
        for (let i = 0; i < Math.min(files.length, remainingSlots); i++) {
            const file = files[i];
            
            if (!file.type.startsWith('image/')) {
                alert('Пожалуйста, загружайте только изображения');
                continue;
            }
            
            if (file.size > 5 * 1024 * 1024) {
                alert(`Фото "${file.name}" слишком большое (макс. 5MB)`);
                continue;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                uploadedSessionPhotos.push({
                    preview: e.target.result,
                    name: file.name
                });
                
                updatePhotosessionUploadDisplay();
            };
            reader.readAsDataURL(file);
        }
    }
    
    function updatePhotosessionUploadDisplay() {
        const container = document.getElementById('photosession-uploaded');
        const countElement = document.getElementById('summary-photos-count');
        const nextBtn = document.getElementById('next-step-btn');
        
        if (!container) return;
        
        container.innerHTML = '';
        
        uploadedSessionPhotos.forEach((photo, index) => {
            const photoElement = document.createElement('div');
            photoElement.className = 'uploaded-photo';
            photoElement.innerHTML = `
                <img src="${photo.preview}" alt="Фото ${index + 1}">
            `;
            container.appendChild(photoElement);
        });
        
        // Обновляем счетчик
        if (countElement) {
            countElement.textContent = uploadedSessionPhotos.length;
        }
        
        // Активируем кнопку "Далее" если загружено минимум 3 фото
        if (nextBtn && currentStep === 2) {
            nextBtn.disabled = uploadedSessionPhotos.length < 3;
            nextBtn.style.opacity = uploadedSessionPhotos.length < 3 ? '0.6' : '1';
        }
    }
    
    function startPhotosessionGeneration() {
        if (!currentPack) {
            alert('Пожалуйста, выберите пакет фотосессии');
            return;
        }
        
        if (uploadedSessionPhotos.length < 3) {
            alert('Для создания фотосессии нужно загрузить минимум 3 фото');
            return;
        }
        
        // Проверяем баланс
        if (userBalance < currentPack.price) {
            alert(`Недостаточно звёзд!\nНужно: ${currentPack.price}, у вас: ${userBalance}`);
            return;
        }
        
        const generateBtn = document.getElementById('start-photosession-btn');
        if (generateBtn) {
            generateBtn.disabled = true;
            generateBtn.innerHTML = `<span class="generate-icon">⏳</span><span>Создание 13 фото...</span>`;
            
            // Имитация процесса (5 секунд)
            setTimeout(() => {
                // Списание звёзд
                userBalance -= currentPack.price;
                updateBalance();
               
                // Добавляем запись в историю
        if (window.addToHistory) {
            window.addToHistory('photosession',
                `Фотосессия: ${currentPack.name}`,
                '10 фото + 3 в подарок',
                currentPack.price
            );
        }
                alert(`🎉 Фотосессия "${currentPack.name}" создана!\n\n13 уникальных фото готовы! Они сохранены в вашей Истории.`);
                
                // Возвращаем кнопку
                setTimeout(() => {
                    generateBtn.disabled = false;
                    generateBtn.innerHTML = `<span class="generate-icon">✨</span><span>Создать фотосессию за <span id="photosession-final-price">${currentPack.price}</span> звёзд</span>`;
                    
                    // Закрываем экран
                    hidePhotosessionGenerate();
                    
                    // Переходим в историю
                    switchScreen('history');
                }, 500);
            }, 5000);
        }
    }
}

// Инициализация фотосессий при загрузке
setupPhotosessions();

// ========== ВИДЕО ==========
function setupVideo() {
    // Типы видео и их цены
    const videoTypes = {
        text: { name: 'Text-to-Video', price: 70, icon: '✍️' },
        image: { name: 'Image-to-Video', price: 70, icon: '🔄' },
        reference: { name: 'Reference Video', price: 70, icon: '🎞️' },
        animate: { name: 'Оживить фото', price: 300, icon: '🖼️' }
    };
    
    let currentVideoType = null;
    let startFrame = null;
    let endFrame = null;
    
    // Обработчики для карточек видео
    document.querySelectorAll('.video-card').forEach(card => {
        card.addEventListener('click', function(e) {
            // Если кликнули не на кнопку внутри карточки
            if (!e.target.closest('.video-btn')) {
                const videoType = this.dataset.videoType;
                selectVideoType(videoType);
            }
        });
    });
    
    // Обработчики для кнопок создания видео
    document.querySelectorAll('.video-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation(); // Чтобы не срабатывал клик по карточке
            const videoType = this.dataset.videoType;
            selectVideoType(videoType);
        });
    });
    
    function selectVideoType(videoType) {
        currentVideoType = videoTypes[videoType];
        if (!currentVideoType) return;
        
        console.log('Выбран тип видео:', currentVideoType.name);
        
        // Показываем соответствующий экран генерации
        if (videoType === 'text') {
            showVideoTextScreen();
        } else if (videoType === 'image') {
            showVideoImageScreen();
        } else {
            // Для остальных типов - заглушка
            alert(`Генерация "${currentVideoType.name}" скоро будет доступна!`);
        }
    }
    
    // ========== TEXT-TO-VIDEO ==========
    function showVideoTextScreen() {
        const screen = document.getElementById('screen-video-text');
        if (screen) {
            screen.style.display = 'flex';
            setupVideoText();
            
            // Кнопка "Назад"
            const backBtn = document.getElementById('video-text-back-btn');
            if (backBtn) {
                backBtn.onclick = function() {
                    screen.style.display = 'none';
                };
            }
            
            // Кнопка генерации
            const generateBtn = document.getElementById('start-video-text-btn');
            if (generateBtn) {
                generateBtn.onclick = startVideoTextGeneration;
            }
        }
    }
    
    function setupVideoText() {
        // Примеры промптов
        document.querySelectorAll('.example-chip').forEach(chip => {
            chip.addEventListener('click', function() {
                const example = this.dataset.example;
                document.getElementById('video-prompt').value = example;
            });
        });
        
        // Обновление предпросмотра при изменении настроек
        const durationSelect = document.getElementById('video-duration');
        const qualityRadios = document.querySelectorAll('input[name="quality"]');
        
        function updateVideoPreview() {
            const duration = durationSelect.value;
            let quality = '720p';
            let price = 70;
            
            qualityRadios.forEach(radio => {
                if (radio.checked) {
                    quality = radio.value;
                    if (quality === '1080p') {
                        price += 20;
                    }
                }
            });
            
            // Обновляем предпросмотр
            document.getElementById('preview-duration').textContent = duration;
            document.getElementById('preview-quality').textContent = quality;
            document.getElementById('video-text-price').textContent = price;
            document.getElementById('video-text-final-price').textContent = price;
        }
        
        durationSelect.addEventListener('change', updateVideoPreview);
        qualityRadios.forEach(radio => {
            radio.addEventListener('change', updateVideoPreview);
        });
        
        // Изначальное обновление
        updateVideoPreview();
    }
    
    function startVideoTextGeneration() {
        const prompt = document.getElementById('video-prompt').value.trim();
        if (!prompt) {
            alert('Пожалуйста, опишите сцену для видео');
            return;
        }
        
        const duration = document.getElementById('video-duration').value;
        let quality = '720p';
        let price = 70;
        
        document.querySelectorAll('input[name="quality"]').forEach(radio => {
            if (radio.checked) {
                quality = radio.value;
                if (quality === '1080p') {
                    price += 20;
                }
            }
        });
        
        // Проверка баланса
        if (userBalance < price) {
            alert(`Недостаточно звёзд!\nНужно: ${price}, у вас: ${userBalance}`);
            return;
        }
        
        const generateBtn = document.getElementById('start-video-text-btn');
        if (generateBtn) {
            generateBtn.disabled = true;
            generateBtn.innerHTML = `<span class="generate-icon">⏳</span><span>Генерация видео...</span>`;
            
            console.log('Начинаем генерацию видео:', {
                prompt: prompt,
                duration: duration,
                quality: quality,
                price: price
            });
            
            // Имитация процесса (4 секунды)
            setTimeout(() => {
                // Списание звёзд
                userBalance -= price;
                updateBalance();
                  // ДОБАВЛЯЕМ ЗАПИСЬ В ИСТОРИЮ 
            if (window.addToHistory) {
                window.addToHistory('video',
                    `Video: Text-to-Video`,
                    `Длительность: ${duration} сек, Качество: ${quality}`,
                    price
                );
            }
                alert(`🎬 Видео создано!\n\n"${prompt.substring(0, 50)}..."\n\nВидео сохранено в вашей Истории.`);
                
                // Возвращаем кнопку
                setTimeout(() => {
                    generateBtn.disabled = false;
                    generateBtn.innerHTML = `<span class="generate-icon">🎬</span><span>Сгенерировать видео за <span id="video-text-final-price">${price}</span> звёзд</span>`;
                    
                    // Закрываем экран
                    document.getElementById('screen-video-text').style.display = 'none';
                    
                    // Очищаем текстовое поле
                    document.getElementById('video-prompt').value = '';
                }, 500);
            }, 4000);
        }
    }
    
    // ========== IMAGE-TO-VIDEO ==========
    function showVideoImageScreen() {
        const screen = document.getElementById('screen-video-image');
        if (screen) {
            screen.style.display = 'flex';
            setupVideoImage();
            
            // Кнопка "Назад"
            const backBtn = document.getElementById('video-image-back-btn');
            if (backBtn) {
                backBtn.onclick = function() {
                    screen.style.display = 'none';
                    resetVideoImage();
                };
            }
            
            // Кнопка генерации
            const generateBtn = document.getElementById('start-video-image-btn');
            if (generateBtn) {
                generateBtn.onclick = startVideoImageGeneration;
            }
        }
    }
    
    function setupVideoImage() {
        // Загрузка начального кадра
        const startUpload = document.getElementById('start-frame-upload');
        const startInput = document.getElementById('start-frame-input');
        const startPreview = document.getElementById('start-frame-preview');
        
        if (startUpload && startInput) {
            startUpload.addEventListener('click', function() {
                startInput.click();
            });
            
            startInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file && file.type.startsWith('image/')) {
                    loadImageFrame(file, startPreview, 'start');
                }
            });
            
            // Drag & Drop
            setupDragAndDrop(startUpload, startPreview, 'start');
        }
        
        // Загрузка конечного кадра
        const endUpload = document.getElementById('end-frame-upload');
        const endInput = document.getElementById('end-frame-input');
        const endPreview = document.getElementById('end-frame-preview');
        
        if (endUpload && endInput) {
            endUpload.addEventListener('click', function() {
                endInput.click();
            });
            
            endInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file && file.type.startsWith('image/')) {
                    loadImageFrame(file, endPreview, 'end');
                }
            });
            
            // Drag & Drop
            setupDragAndDrop(endUpload, endPreview, 'end');
        }
    }
    
    function setupDragAndDrop(uploadElement, previewElement, frameType) {
        uploadElement.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.background = 'rgba(156, 39, 176, 0.1)';
            this.style.borderColor = 'rgba(156, 39, 176, 0.5)';
        });
        
        uploadElement.addEventListener('dragleave', function() {
            this.style.background = '';
            this.style.borderColor = '';
        });
        
        uploadElement.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.background = '';
            this.style.borderColor = '';
            
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                loadImageFrame(file, previewElement, frameType);
            }
        });
    }
    
    function loadImageFrame(file, previewElement, frameType) {
        if (file.size > 5 * 1024 * 1024) {
            alert('Фото слишком большое (макс. 5MB)');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            
            // Очищаем preview и добавляем новое изображение
            previewElement.innerHTML = '';
            previewElement.appendChild(img);
            
            // Сохраняем в переменную
            if (frameType === 'start') {
                startFrame = { file: file, preview: e.target.result };
            } else {
                endFrame = { file: file, preview: e.target.result };
            }
            
            // Показываем сообщение об успешной загрузке
            showNotification('Фото загружено!');
        };
        reader.readAsDataURL(file);
    }
    
    function resetVideoImage() {
        startFrame = null;
        endFrame = null;
        
        const startPreview = document.getElementById('start-frame-preview');
        const endPreview = document.getElementById('end-frame-preview');
        
        if (startPreview) startPreview.innerHTML = '';
        if (endPreview) endPreview.innerHTML = '';
        
        const startInput = document.getElementById('start-frame-input');
        const endInput = document.getElementById('end-frame-input');
        
        if (startInput) startInput.value = '';
        if (endInput) endInput.value = '';
    }
    
    function startVideoImageGeneration() {
        // Проверка загруженных кадров
        if (!startFrame) {
            alert('Пожалуйста, загрузите начальный кадр');
            return;
        }
        
        if (!endFrame) {
            alert('Пожалуйста, загрузите конечный кадр');
            return;
        }
        
        const price = 70;
        
        // Проверка баланса
        if (userBalance < price) {
            alert(`Недостаточно звёзд!\nНужно: ${price}, у вас: ${userBalance}`);
            return;
        }
        
        const transitionType = document.getElementById('transition-type').value;
        const duration = document.getElementById('transition-duration').value;
        
        const generateBtn = document.getElementById('start-video-image-btn');
        if (generateBtn) {
            generateBtn.disabled = true;
            generateBtn.innerHTML = `<span class="generate-icon">⏳</span><span>Создание анимации...</span>`;
            
            console.log('Начинаем создание анимации:', {
                transition: transitionType,
                duration: duration,
                price: price
            });
            
            // Имитация процесса (3 секунды)
            setTimeout(() => {
                // Списание звёзд
                userBalance -= price;
                updateBalance();
                 // ДОБАВЛЯЕМ ЗАПИСЬ В ИСТОРИЮ 
            if (window.addToHistory) {
                window.addToHistory('video',
                    `Video: Image-to-Video`,
                    `Переход: ${getTransitionName(transitionType)}, Длительность: ${duration} сек`,
                    price
                );
            }
                alert(`🔄 Анимация создана!\n\nПлавный переход между кадрами (${duration} сек)\n\nВидео сохранено в вашей Истории.`);
                
                // Возвращаем кнопку
                setTimeout(() => {
                    generateBtn.disabled = false;
                    generateBtn.innerHTML = `<span class="generate-icon">🔄</span><span>Создать анимацию за <span id="video-image-price">${price}</span> звёзд</span>`;
                    
                    // Закрываем экран
                    document.getElementById('screen-video-image').style.display = 'none';
                    resetVideoImage();
                }, 500);
            }, 3000);
        }
    }
    
    // Вспомогательная функция для уведомлений
    function showNotification(message) {
        // Создаем временное уведомление
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 12px 24px;
            border-radius: 10px;
            z-index: 9999;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            animation: slideIn 0.3s ease;
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 2000);
    }
    
       // Добавляем стили для анимации уведомлений
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// Вспомогательная функция для получения названия перехода
function getTransitionName(type) {
    const transitions = {
        'smooth': 'Плавный',
        'morph': 'Морфинг',
        'zoom': 'Приближение',
        'rotate': 'Вращение'
    };
    return transitions[type] || type;
}

// Инициализация видео при загрузке
setupVideo();

// ========== ИСТОРИЯ И ПРОФИЛЬ ==========
function setupHistoryAndProfile() {
    // Инициализация истории из localStorage
    let history = JSON.parse(localStorage.getItem('nano_history')) || [];
    let stats = JSON.parse(localStorage.getItem('nano_stats')) || {
        photos: 0,
        videos: 0,
        spent: 0,
        saved: 0
    };
    
    // Сохранение истории
    function saveHistory() {
        localStorage.setItem('nano_history', JSON.stringify(history));
        localStorage.setItem('nano_stats', JSON.stringify(stats));
        updateProfileStats();
    }
    
    // Добавление записи в историю
    function addHistoryRecord(type, title, details, price) {
        const record = {
            id: Date.now(),
            type: type, // 'photo', 'photosession', 'video'
            title: title,
            details: details,
            price: price,
            date: new Date().toISOString(),
            status: 'completed'
        };
        
        history.push(record);
        
        // Обновляем статистику
        if (type === 'photo' || type === 'photosession') {
            stats.photos += (type === 'photosession' ? 13 : 1);
        } else if (type === 'video') {
            stats.videos += 1;
        }
        stats.spent += price;
        
        // Ограничиваем историю 7 днями
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        history = history.filter(record => {
            const recordDate = new Date(record.date);
            return recordDate >= sevenDaysAgo;
        });
        
        // Ограничиваем максимум 50 записей
        if (history.length > 50) {
            history = history.slice(-50);
        }
        
        saveHistory();
        updateHistoryDisplay();
        updateRecentList();
    }
    
    // Обновление отображения истории
    function updateHistoryDisplay(filter = 'all') {
        const container = document.getElementById('history-container');
        const emptyElement = document.getElementById('history-empty');
        const countElement = document.getElementById('history-count');
        
        if (!container) return;
        
        // Фильтрация записей
        let filteredHistory = history;
        if (filter !== 'all') {
            filteredHistory = history.filter(record => record.type === filter);
        }
        
        // Обновление счетчика
        if (countElement) {
            countElement.textContent = filteredHistory.length;
        }
        
        // Если история пуста
        if (filteredHistory.length === 0) {
            container.innerHTML = '';
            if (emptyElement) {
                emptyElement.style.display = 'block';
                container.appendChild(emptyElement);
            }
            return;
        }
        
        // Скрываем пустой блок
        if (emptyElement) {
            emptyElement.style.display = 'none';
        }
        
        // Сортируем по дате (новые сверху)
        filteredHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Очищаем и добавляем записи
        container.innerHTML = '';
        
        filteredHistory.forEach(record => {
            const historyItem = createHistoryItem(record);
            container.appendChild(historyItem);
        });
    }
    
    // Создание элемента истории
    function createHistoryItem(record) {
        const item = document.createElement('div');
        item.className = 'history-item';
        
        // Иконка в зависимости от типа
        let icon = '📷';
        let iconColor = '#ec407a';
        if (record.type === 'photosession') {
            icon = '📸';
            iconColor = '#42a5f5';
        } else if (record.type === 'video') {
            icon = '🎬';
            iconColor = '#9c27b0';
        }
        
        // Форматирование даты
        const date = new Date(record.date);
        const formattedDate = formatDate(date);
        
        item.innerHTML = `
            <div class="history-item-icon" style="background: ${iconColor}20; color: ${iconColor}">
                ${icon}
            </div>
            <div class="history-item-content">
                <div class="history-item-title">${record.title}</div>
                <div class="history-item-desc">${record.details}</div>
                <div class="history-item-meta">
                    <span class="history-item-date">
                        <span class="material-icons-round" style="font-size: 14px;">schedule</span>
                        ${formattedDate}
                    </span>
                    <span class="history-item-price">${record.price} звёзд</span>
                </div>
            </div>
            <div class="history-item-actions">
                <button class="history-btn download" onclick="downloadHistoryItem(${record.id})">
                    <span class="material-icons-round" style="font-size: 18px;">download</span>
                </button>
                <button class="history-btn" onclick="deleteHistoryItem(${record.id})">
                    <span class="material-icons-round" style="font-size: 18px;">delete</span>
                </button>
            </div>
        `;
        
        return item;
    }
    
    // Форматирование даты
    function formatDate(date) {
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 1) return 'только что';
        if (diffMins < 60) return `${diffMins} мин назад`;
        if (diffHours < 24) return `${diffHours} ч назад`;
        if (diffDays < 7) return `${diffDays} дн назад`;
        
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'short'
        });
    }
    
    // Обновление недавних записей в профиле
    function updateRecentList() {
        const container = document.getElementById('recent-list');
        const emptyElement = document.getElementById('recent-empty');
        
        if (!container) return;
        
        // Берем последние 3 записи
        const recent = history.slice(-3).reverse();
        
        if (recent.length === 0) {
            if (emptyElement) {
                emptyElement.style.display = 'block';
            }
            container.innerHTML = '';
            container.appendChild(emptyElement);
            return;
        }
        
        if (emptyElement) {
            emptyElement.style.display = 'none';
        }
        
        container.innerHTML = '';
        
        recent.forEach(record => {
            const recentItem = document.createElement('div');
            recentItem.className = 'recent-item';
            recentItem.style.cssText = `
                padding: 12px;
                border-bottom: 1px solid rgba(0,0,0,0.05);
                display: flex;
                align-items: center;
                gap: 12px;
            `;
            
            let icon = '📷';
            if (record.type === 'photosession') icon = '📸';
            if (record.type === 'video') icon = '🎬';
            
            recentItem.innerHTML = `
                <div style="font-size: 20px;">${icon}</div>
                <div style="flex: 1;">
                    <div style="font-weight: 600; color: #333; font-size: 14px;">${record.title}</div>
                    <div style="color: #777; font-size: 12px;">${formatDate(new Date(record.date))}</div>
                </div>
                <div style="color: #ec407a; font-weight: 700; font-size: 16px;">${record.price}⭐</div>
            `;
            
            container.appendChild(recentItem);
        });
    }
    
    // Обновление статистики в профиле
    function updateProfileStats() {
        // Обновляем цифры статистики
        document.getElementById('stats-photos').textContent = stats.photos;
        document.getElementById('stats-videos').textContent = stats.videos;
        document.getElementById('stats-spent').textContent = stats.spent;
        document.getElementById('stats-saved').textContent = stats.saved;
        
        // Обновляем стаж
        const startDate = localStorage.getItem('nano_start_date') || new Date().toISOString();
        const start = new Date(startDate);
        const now = new Date();
        const diffDays = Math.floor((now - start) / (1000 * 60 * 60 * 24));
        
        let daysText = 'сегодня';
        if (diffDays === 1) daysText = '1 день';
        else if (diffDays > 1 && diffDays < 5) daysText = `${diffDays} дня`;
        else if (diffDays >= 5) daysText = `${diffDays} дней`;
        
        document.getElementById('profile-days').textContent = daysText;
        
        // Обновляем уровень
        let level = '👶 Новичок';
        const totalItems = stats.photos + stats.videos;
        
        if (totalItems >= 50) level = '👑 Профи';
        else if (totalItems >= 20) level = '⭐ Любитель';
        else if (totalItems >= 5) level = '🚀 Начинающий';
        
        document.getElementById('profile-level').textContent = level;
    }
    
    // Фильтры истории
    function setupHistoryFilters() {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                // Убираем активный класс у всех кнопок
                document.querySelectorAll('.filter-btn').forEach(b => {
                    b.classList.remove('active');
                });
                
                // Добавляем активный класс текущей кнопке
                this.classList.add('active');
                
                // Применяем фильтр
                const filter = this.dataset.filter;
                updateHistoryDisplay(filter);
            });
        });
    }
    
    // Кнопка "Создать первую генерацию"
    const startBtn = document.getElementById('start-from-history');
    if (startBtn) {
        startBtn.addEventListener('click', function() {
            switchScreen('main');
        });
    }
    
    // Кнопка пополнения баланса в профиле
    const addBalanceBtn = document.getElementById('add-balance-profile');
    if (addBalanceBtn) {
        addBalanceBtn.addEventListener('click', function() {
            if (window.tg) {
                window.tg.showPopup({
                    title: 'Пополнение баланса',
                    message: `Ваш баланс: ${userBalance} звёзд\n\nДля пополнения напишите @NeuroFlashStudio_bot`,
                    buttons: [{ type: 'default', text: 'Понятно' }]
                });
            } else {
                alert(`Ваш баланс: ${userBalance} звёзд\n\nДля пополнения откройте приложение в Telegram боте.`);
            }
        });
    }
    
    // Настройки профиля
    function setupProfileSettings() {
        // Темная тема
        const darkModeToggle = document.getElementById('dark-mode');
        if (darkModeToggle) {
            darkModeToggle.checked = localStorage.getItem('nano_dark_mode') !== 'false';
            darkModeToggle.addEventListener('change', function() {
                localStorage.setItem('nano_dark_mode', this.checked);
                applyTheme();
            });
        }
        
        // Автосохранение
        const autoSaveToggle = document.getElementById('auto-save');
        if (autoSaveToggle) {
            autoSaveToggle.checked = localStorage.getItem('nano_auto_save') !== 'false';
            autoSaveToggle.addEventListener('change', function() {
                localStorage.setItem('nano_auto_save', this.checked);
            });
        }
        
        // Уведомления
        const notificationsToggle = document.getElementById('notifications');
        if (notificationsToggle) {
            notificationsToggle.checked = localStorage.getItem('nano_notifications') !== 'false';
            notificationsToggle.addEventListener('change', function() {
                localStorage.setItem('nano_notifications', this.checked);
            });
        }
    }
    
    // Применение темы
    function applyTheme() {
        const darkMode = localStorage.getItem('nano_dark_mode') !== 'false';
        if (darkMode) {
            document.body.classList.add('tg-theme-dark');
        } else {
            document.body.classList.remove('tg-theme-dark');
        }
    }
    
    // Инициализация
    function init() {
        // Сохраняем дату начала использования
        if (!localStorage.getItem('nano_start_date')) {
            localStorage.setItem('nano_start_date', new Date().toISOString());
        }
        
        // Настройки по умолчанию
        if (!localStorage.getItem('nano_dark_mode')) {
            localStorage.setItem('nano_dark_mode', 'true');
        }
        if (!localStorage.getItem('nano_auto_save')) {
            localStorage.setItem('nano_auto_save', 'true');
        }
        if (!localStorage.getItem('nano_notifications')) {
            localStorage.setItem('nano_notifications', 'true');
        }
        
        setupHistoryFilters();
        setupProfileSettings();
        applyTheme();
        updateHistoryDisplay();
        updateRecentList();
        updateProfileStats();
        
        // Обновляем баланс в профиле
        updateBalance();
    }
    
    // Глобальные функции для истории
    window.clearHistory = function() {
        if (confirm('Очистить всю историю? Это действие нельзя отменить.')) {
            history = [];
            saveHistory();
            updateHistoryDisplay();
            updateRecentList();
            alert('История очищена');
        }
    };
    
    window.downloadHistoryItem = function(id) {
        alert('Скачивание будет доступно при подключении AI API');
    };
    
    window.deleteHistoryItem = function(id) {
        history = history.filter(record => record.id !== id);
        saveHistory();
        updateHistoryDisplay();
        updateRecentList();
    };
    
    // Функция для добавления записи из других модулей
    window.addToHistory = function(type, title, details, price) {
        addHistoryRecord(type, title, details, price);
    };
    
    // Запуск инициализации
    init();
}

// Инициализация истории и профиля
setupHistoryAndProfile();
console.log('Nano Banana App готов!');












