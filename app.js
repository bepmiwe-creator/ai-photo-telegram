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
     
    // Инициализация фотосессий
    setupPhotosessions();
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

console.log('Nano Banana App готов!');

