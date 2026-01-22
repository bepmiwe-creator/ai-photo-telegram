// app.js - Единый рабочий код для Nano Banana

// ========== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ==========
let userBalance = 85;
let uploadedImages = [];
let currentCategory = null;
let selectedModel = 'nano';
let selectedFormat = '1:1';
let selectedStyle = null; // Новый параметр для выбранного стиля

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

// Примеры стилей для каждой категории
const styleExamples = {
    winter: [
        { id: 1, name: "Снежная королева", icon: "👑", color: "#4FC3F7" },
        { id: 2, name: "Зимний лес", icon: "🌲", color: "#81C784" },
        { id: 3, name: "Новогоднее настроение", icon: "🎄", color: "#FF8A65" },
        { id: 4, name: "Лыжный курорт", icon: "⛷️", color: "#64B5F6" },
        { id: 5, name: "Морозные узоры", icon: "❄️", color: "#90CAF9" },
        { id: 6, name: "Рождественский вечер", icon: "🎅", color: "#E57373" }
    ],
    birthday: [
        { id: 1, name: "Торт и свечи", icon: "🎂", color: "#FFB74D" },
        { id: 2, name: "Праздничный вечер", icon: "🎉", color: "#BA68C8" },
        { id: 3, name: "Воздушные шары", icon: "🎈", color: "#4DD0E1" },
        { id: 4, name: "Подарки", icon: "🎁", color: "#AED581" }
    ],
    trends: [
        { id: 1, name: "Неоновый стиль", icon: "💡", color: "#9575CD" },
        { id: 2, name: "Ретро волна", icon: "📻", color: "#FF8A65" },
        { id: 3, name: "Футуризм", icon: "🚀", color: "#4DB6AC" },
        { id: 4, name: "Минимализм", icon: "⬜", color: "#90A4AE" }
    ],
    couples: [
        { id: 1, name: "Романтический вечер", icon: "💕", color: "#F06292" },
        { id: 2, name: "Прогулка в парке", icon: "🌳", color: "#81C784" },
        { id: 3, name: "Пляжный закат", icon: "🌅", color: "#FFB74D" }
    ],
    girls: [
        { id: 1, name: "Стиль принцессы", icon: "👸", color: "#CE93D8" },
        { id: 2, name: "Деловой образ", icon: "💼", color: "#80CBC4" },
        { id: 3, name: "Спортивный шик", icon: "👟", color: "#FFAB91" }
    ],
    men: [
        { id: 1, name: "Классический костюм", icon: "🤵", color: "#78909C" },
        { id: 2, name: "Спортивный стиль", icon: "🏃", color: "#42A5F5" },
        { id: 3, name: "Кэжуал образ", icon: "👕", color: "#26A69A" }
    ],
    pets: [
        { id: 1, name: "Домашний любимец", icon: "🐶", color: "#FFD54F" },
        { id: 2, name: "Игривый момент", icon: "🎾", color: "#AED581" },
        { id: 3, name: "Портрет питомца", icon: "📷", color: "#80DEEA" }
    ],
    professions: [
        { id: 1, name: "Врач", icon: "👨‍⚕️", color: "#EF5350" },
        { id: 2, name: "Программист", icon: "💻", color: "#42A5F5" },
        { id: 3, name: "Учитель", icon: "👩‍🏫", color: "#66BB6A" },
        { id: 4, name: "Повар", icon: "👨‍🍳", color: "#FFA726" }
    ],
    luxury: [
        { id: 1, name: "Золотой шик", icon: "💰", color: "#FFD700" },
        { id: 2, name: "Алмазный блеск", icon: "💎", color: "#B39DDB" },
        { id: 3, name: "Шикарный вечер", icon: "🍾", color: "#F8BBD0" }
    ]
};

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
    
    // 5. Настраиваем реальную загрузку фото
    setupRealUpload();
    
    // 6. Плавное появление
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
    
    // Экспортируем функцию для глобального использования
    window.switchScreen = switchScreen;
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
            if (cat.id === 'create') {
                // Для "Создать свой" сразу показываем генерацию
                currentCategory = cat.id;
                selectedStyle = null;
                showGenerateScreen();
            } else {
                // Для других категорий показываем выбор стиля
                currentCategory = cat.id;
                showStyleSelection(cat.id);
            }
        });
        
        container.appendChild(card);
    });
    
    // Кнопка "Генерация по описанию"
    const promptBtn = document.getElementById('prompt-generate-btn');
    if (promptBtn) {
        promptBtn.addEventListener('click', function() {
            currentCategory = 'prompt';
            selectedStyle = null;
            showGenerateScreen();
        });
    }
}

// ========== ВЫБОР СТИЛЯ В КАТЕГОРИИ ==========
function showStyleSelection(categoryId) {
    const stylesContainer = document.getElementById('styles-container');
    const stylesScreen = document.getElementById('screen-styles');
    const categoryTitle = document.getElementById('styles-category-title');
    
    if (!stylesContainer || !stylesScreen || !categoryTitle) return;
    
    // Устанавливаем заголовок категории
    const category = categories.find(c => c.id === categoryId);
    if (category) {
        categoryTitle.textContent = category.title;
    }
    
    // Очищаем контейнер
    stylesContainer.innerHTML = '';
    
    // Загружаем примеры стилей для категории
    const styles = styleExamples[categoryId] || [];
    
    styles.forEach(style => {
        const styleCard = document.createElement('div');
        styleCard.className = 'style-card';
        styleCard.style.backgroundColor = style.color + '20';
        
        styleCard.innerHTML = `
            <div class="style-icon" style="background-color: ${style.color}40;">${style.icon}</div>
            <div class="style-name">${style.name}</div>
        `;
        
        styleCard.addEventListener('click', () => {
            selectedStyle = style.name;
            showGenerateScreen();
        });
        
        stylesContainer.appendChild(styleCard);
    });
    
    // Добавляем кнопку "Случайный стиль"
    if (styles.length > 0) {
        const randomCard = document.createElement('div');
        randomCard.className = 'style-card random-style';
        randomCard.innerHTML = `
            <div class="style-icon">🎲</div>
            <div class="style-name">Случайный стиль</div>
        `;
        
        randomCard.addEventListener('click', () => {
            const randomStyle = styles[Math.floor(Math.random() * styles.length)];
            selectedStyle = randomStyle.name + ' (случайный)';
            showGenerateScreen();
        });
        
        stylesContainer.appendChild(randomCard);
    }
    
    // Показываем экран выбора стиля
    stylesScreen.classList.add('active');
    
    // Настраиваем кнопку "Назад"
    const backBtn = document.getElementById('styles-back-btn');
    if (backBtn) {
        backBtn.onclick = function() {
            stylesScreen.classList.remove('active');
        };
    }
}

// ========== ЭКРАН ГЕНЕРАЦИИ ==========
function showGenerateScreen() {
    const generateScreen = document.getElementById('screen-generate');
    if (!generateScreen) return;
    
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
        // Для обычных категорий показываем выбранный стиль
        const category = categories.find(c => c.id === currentCategory);
        if (titleElement) titleElement.textContent = `Генерация: ${category?.title || 'Фото'}`;
        
        if (typeBadge) {
            if (selectedStyle) {
                typeBadge.textContent = `📷 ${selectedStyle}`;
            } else {
                typeBadge.textContent = `📷 ${category?.title || 'Из фото'}`;
            }
        }
        document.getElementById('prompt-section').style.display = 'none';
    }
    
    // Настраиваем выбор формата
    setupFormatSelect();
    
    // Обновляем цену
    updateTotalPrice();
    
    // Настраиваем поле промпта (только для генерации по описанию)
    if (currentCategory === 'prompt') {
        setupPromptField();
    }
    
    // Проверяем активность кнопки
    checkGenerateButton();
    
    // Обновляем загруженные фото
    updateUploadGrid();
    
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
        
        // Скрываем экран стилей, если он был открыт
        const stylesScreen = document.getElementById('screen-styles');
        if (stylesScreen) {
            stylesScreen.classList.remove('active');
        }
        
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
        
        // Сбрасываем выбранный стиль
        selectedStyle = null;
        
        console.log('Экран генерации закрыт');
    }
}

// ========== НАСТРОЙКА ПОЛЯ ПРОМПТА ==========
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

// ========== ПРОВЕРКА АКТИВНОСТИ КНОПКИ ГЕНЕРАЦИИ ==========
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

// ========== НАСТРОЙКА ВЫБОРА ФОРМАТА ==========
function setupFormatSelect() {
    const formatSelect = document.getElementById('format-select');
    
    if (!formatSelect) return;
    
    // Устанавливаем начальное значение
    formatSelect.value = selectedFormat;
    
    // Обработчик изменения
    formatSelect.addEventListener('change', function() {
        selectedFormat = this.value;
        updateTotalPrice();
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

// ========== РЕАЛЬНАЯ ЗАГРУЗКА ФОТО ==========
function setupRealUpload() {
    // Создаем скрытый input для выбора файлов
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.multiple = true;
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);
    
    // Когда выбрали файлы
    fileInput.addEventListener('change', function(e) {
        const files = e.target.files;
        if (files.length > 0) {
            handleFileUpload(files);
        }
        fileInput.value = '';
    });
    
    // Привязываем красивую кнопку к скрытому input
    const uploadBtn = document.getElementById('upload-add-btn');
    if (uploadBtn) {
        uploadBtn.addEventListener('click', function() {
            fileInput.click();
        });
    }
}

// Обработка загруженных файлов
function handleFileUpload(files) {
    const maxFiles = 5;
    const remaining = maxFiles - uploadedImages.length;
    
    if (files.length > remaining) {
        alert(`Можно загрузить не более ${maxFiles} фото. Осталось мест: ${remaining}`);
        return;
    }
    
    for (let i = 0; i < Math.min(files.length, remaining); i++) {
        const file = files[i];
        
        // Проверяем, что это изображение
        if (!file.type.startsWith('image/')) {
            alert('Пожалуйста, загружайте только изображения');
            continue;
        }
        
        // Проверяем размер (макс. 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert(`Фото "${file.name}" слишком большое (макс. 5MB)`);
            continue;
        }
        
        // Читаем файл и создаем превью
        const reader = new FileReader();
        reader.onload = function(e) {
            uploadedImages.push({
                preview: e.target.result,
                file: file,
                name: file.name
            });
            
            updateUploadGrid();
            checkGenerateButton();
            
            // Показываем уведомление
            showNotification(`Добавлено фото ${uploadedImages.length}/${maxFiles}`);
        };
        reader.readAsDataURL(file);
    }
}

function updateUploadGrid() {
    const container = document.getElementById('upload-grid');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Добавляем загруженные фото
    uploadedImages.forEach((img, index) => {
        const item = document.createElement('div');
        item.className = 'upload-item';
        item.innerHTML = `
            <img src="${img.preview}" alt="Фото ${index + 1}">
            <div class="upload-remove" data-index="${index}">×</div>
        `;
        
        // Добавляем обработчик удаления
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
    
    // Добавляем кнопку добавления (если не достигнут лимит)
    if (uploadedImages.length < 5) {
        const addBtn = document.createElement('div');
        addBtn.className = 'upload-item upload-add';
        addBtn.id = 'upload-add-btn';
        addBtn.innerHTML = `
            <span class="material-icons-round">add</span>
            <span>Добавить фото</span>
            <div class="upload-count">${uploadedImages.length}/5</div>
        `;
        
        // Вешаем обработчик
        addBtn.addEventListener('click', function() {
            setupRealUpload();
            document.querySelector('input[type="file"]').click();
        });
        
        container.appendChild(addBtn);
    }
}

// ========== ГЕНЕРАЦИЯ ФОТО ==========
function startGeneration() {
    const price = calculatePrice();
    
    // Проверка баланса
    if (price > userBalance) {
        alert(`Недостаточно звёзд!\nНужно: ${price}, у вас: ${userBalance}`);
        return;
    }
    
    // Проверка загруженных фото
    if (uploadedImages.length === 0 && currentCategory !== 'prompt') {
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
        
        const details = `Модель: ${selectedModel === 'nano' ? 'Nano Banana' : 'Nano Banana Pro'}, Формат: ${selectedFormat}`;
        
        if (window.addToHistory) {
            window.addToHistory('photo', 
                `Фото: ${categoryName}${selectedStyle ? ' - ' + selectedStyle : ''}`,
                details,
                price
            );
        }
        
        alert('🎉 Генерация завершена!\nФото добавлены в ваш профиль.');
        
        // Возвращаем кнопку
        setTimeout(() => {
            btn.disabled = false;
            updateTotalPrice();
            hideGenerateScreen();
            
            // Переходим в историю
            setTimeout(() => {
                if (window.switchScreen) {
                    window.switchScreen('history');
                }
            }, 500);
        }, 500);
    }, 3000);
}

// ========== РАСЧЕТ ЦЕНЫ ==========
function calculatePrice() {
    let price = selectedModel === 'nano' ? 7 : 25;
    if (currentCategory === 'create') price += 10;
    if (selectedStyle && selectedStyle.includes('люкс') || selectedStyle && selectedStyle.includes('Luxury')) price += 15;
    return price;
}

function updateTotalPrice() {
    const price = calculatePrice();
    
    // Обновляем цену в кнопке
    const btnText = document.getElementById('generate-btn-text');
    if (btnText) {
        const generateBtn = document.getElementById('start-generate-btn');
        if (!generateBtn.disabled) {
            btnText.textContent = `Сгенерировать за ${price} звёзд`;
        }
    }
    
    // Проверяем кнопку генерации
    checkGenerateButton();
}

function updateBalance() {
    document.getElementById('header-balance').textContent = userBalance;
    document.getElementById('profile-balance').textContent = userBalance;
}

// ========== УВЕДОМЛЕНИЯ ==========
function showNotification(message) {
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
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(notificationStyle);

// ========== ИНИЦИАЛИЗАЦИЯ ДОПОЛНИТЕЛЬНЫХ МОДУЛЕЙ ==========
// Инициализация фотосессий
setupPhotosessions();

// Инициализация видео
setupVideo();

// Инициализация истории и профиля
setupHistoryAndProfile();

console.log('Nano Banana App готов!');
