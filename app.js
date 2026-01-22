// app.js - Единый рабочий код для Nano Banana

// ========== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ==========
let userBalance = 85;
let uploadedImages = [];
let currentCategory = null;
let selectedModel = 'nano';
let selectedFormat = '1:1';
let selectedStyle = null;

// Для категории "Создать свой"
let exampleImage = null; // Фото-пример из интернета
let userPhoto = null;    // Фото пользователя

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

const styleExamples = {
    winter: [
        { id: 1, name: "Снежная королева", icon: "👑", color: "#4FC3F7" },
        { id: 2, name: "Зимний лес", icon: "🌲", color: "#81C784" },
        { id: 3, name: "Новогоднее настроение", icon: "🎄", color: "#FF8A65" },
        { id: 4, name: "Лыжный курорт", icon: "⛷️", color: "#64B5F6" }
    ],
    birthday: [
        { id: 1, name: "Торт и свечи", icon: "🎂", color: "#FFB74D" },
        { id: 2, name: "Праздничный вечер", icon: "🎉", color: "#BA68C8" }
    ],
    trends: [
        { id: 1, name: "Неоновый стиль", icon: "💡", color: "#9575CD" },
        { id: 2, name: "Ретро волна", icon: "📻", color: "#FF8A65" }
    ],
    couples: [
        { id: 1, name: "Романтический вечер", icon: "💕", color: "#F06292" },
        { id: 2, name: "Прогулка в парке", icon: "🌳", color: "#81C784" }
    ],
    girls: [
        { id: 1, name: "Стиль принцессы", icon: "👸", color: "#CE93D8" },
        { id: 2, name: "Деловой образ", icon: "💼", color: "#80CBC4" }
    ],
    men: [
        { id: 1, name: "Классический костюм", icon: "🤵", color: "#78909C" },
        { id: 2, name: "Спортивный стиль", icon: "🏃", color: "#42A5F5" }
    ],
    pets: [
        { id: 1, name: "Домашний любимец", icon: "🐶", color: "#FFD54F" },
        { id: 2, name: "Игривый момент", icon: "🎾", color: "#AED581" }
    ],
    professions: [
        { id: 1, name: "Врач", icon: "👨‍⚕️", color: "#EF5350" },
        { id: 2, name: "Программист", icon: "💻", color: "#42A5F5" }
    ],
    luxury: [
        { id: 1, name: "Золотой шик", icon: "💰", color: "#FFD700" },
        { id: 2, name: "Алмазный блеск", icon: "💎", color: "#B39DDB" }
    ]
};

// ========== ОБЪЯВЛЕНИЕ ФУНКЦИЙ (чтобы избежать ошибок ReferenceError) ==========
function setupPhotosessions() {
    console.log('Фотосессии инициализированы (заглушка)');
    // Реализация функции будет позже
}

function setupVideo() {
    console.log('Видео инициализировано (заглушка)');
    // Реализация функции будет позже
}

function setupHistoryAndProfile() {
    console.log('История и профиль инициализированы (заглушка)');
    // Реализация функции будет позже
}

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
    const tabButtons = document.querySelectorAll('.tab-btn');
    const quickCards = document.querySelectorAll('.quick-card');
    const screens = document.querySelectorAll('.screen');
    const generateOverlay = document.getElementById('screen-generate');
    const helpOverlay = document.getElementById('screen-help');
    
    function switchScreen(screenId) {
        console.log('Переключаемся на экран:', screenId);
        
        screens.forEach(screen => {
            screen.classList.remove('active');
        });
        
        if (generateOverlay) {
            generateOverlay.style.display = 'none';
        }
        
        if (helpOverlay) {
            helpOverlay.style.display = 'none';
        }
        
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
            alert(`Ваш баланс: ${userBalance} звёзд\n\nДля пополнения откройте приложение в Telegram боте.`);
        });
    }
    
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
                currentCategory = cat.id;
                showCreateOwnScreen();
            } else {
                currentCategory = cat.id;
                showStyleSelection(cat.id);
            }
        });
        
        container.appendChild(card);
    });
    
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
    
    const category = categories.find(c => c.id === categoryId);
    if (category) {
        categoryTitle.textContent = category.title;
    }
    
    stylesContainer.innerHTML = '';
    
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
    
    stylesScreen.classList.add('active');
    
    const backBtn = document.getElementById('styles-back-btn');
    if (backBtn) {
        backBtn.onclick = function() {
            stylesScreen.classList.remove('active');
        };
    }
}

// ========== ЭКРАН "СОЗДАТЬ СВОЙ" ==========
function showCreateOwnScreen() {
    const screen = document.getElementById('screen-create-own');
    if (!screen) return;
    
    // Сбрасываем загруженные фото
    exampleImage = null;
    userPhoto = null;
    
    // Обновляем экран
    screen.classList.add('active');
    
    // Скрываем другие экраны
    document.querySelectorAll('.screen').forEach(s => {
        if (s.id !== 'screen-create-own') {
            s.classList.remove('active');
        }
    });
    
    // Обновляем превью
    updateCreateOwnPreview();
    
    // Настраиваем кнопки загрузки
    setupCreateOwnUpload();
    
    // Проверяем кнопку генерации
    checkCreateOwnButton();
    
    // Кнопка "Назад"
    const backBtn = document.getElementById('create-own-back-btn');
    if (backBtn) {
        backBtn.onclick = function() {
            screen.classList.remove('active');
            const photoScreen = document.getElementById('screen-photo');
            if (photoScreen) {
                photoScreen.classList.add('active');
            }
        };
    }
    
    // Кнопка "Как это работает?"
    const helpBtn = document.getElementById('create-own-help-btn');
    if (helpBtn) {
        helpBtn.onclick = function() {
            showHelpScreen();
        };
    }
}

function setupCreateOwnUpload() {
    // Пример из интернета
    const exampleUploadBtn = document.getElementById('example-upload-btn');
    const exampleInput = document.getElementById('example-input');
    const exampleRemoveBtn = document.getElementById('example-remove-btn');
    
    if (exampleUploadBtn && exampleInput) {
        exampleUploadBtn.addEventListener('click', function() {
            exampleInput.click();
        });
        
        exampleInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                loadExampleImage(file);
            }
            exampleInput.value = '';
        });
    }
    
    if (exampleRemoveBtn) {
        exampleRemoveBtn.addEventListener('click', function() {
            exampleImage = null;
            updateCreateOwnPreview();
            checkCreateOwnButton();
        });
    }
    
    // Фото пользователя
    const userUploadBtn = document.getElementById('user-upload-btn');
    const userInput = document.getElementById('user-input');
    const userRemoveBtn = document.getElementById('user-remove-btn');
    
    if (userUploadBtn && userInput) {
        userUploadBtn.addEventListener('click', function() {
            userInput.click();
        });
        
        userInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                loadUserPhoto(file);
            }
            userInput.value = '';
        });
    }
    
    if (userRemoveBtn) {
        userRemoveBtn.addEventListener('click', function() {
            userPhoto = null;
            updateCreateOwnPreview();
            checkCreateOwnButton();
        });
    }
}

function loadExampleImage(file) {
    if (file.size > 5 * 1024 * 1024) {
        alert('Фото слишком большое (макс. 5MB)');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        exampleImage = {
            preview: e.target.result,
            file: file,
            name: file.name
        };
        updateCreateOwnPreview();
        checkCreateOwnButton();
        showNotification('Фото-пример загружено');
    };
    reader.readAsDataURL(file);
}

function loadUserPhoto(file) {
    if (file.size > 5 * 1024 * 1024) {
        alert('Фото слишком большое (макс. 5MB)');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        userPhoto = {
            preview: e.target.result,
            file: file,
            name: file.name
        };
        updateCreateOwnPreview();
        checkCreateOwnButton();
        showNotification('Ваше фото загружено');
    };
    reader.readAsDataURL(file);
}

function updateCreateOwnPreview() {
    // Пример из интернета
    const examplePreview = document.getElementById('example-preview');
    const exampleUpload = document.getElementById('example-upload');
    const exampleRemoveBtn = document.getElementById('example-remove-btn');
    
    if (exampleImage) {
        examplePreview.innerHTML = `<img src="${exampleImage.preview}" alt="Пример">`;
        exampleUpload.style.display = 'none';
        exampleRemoveBtn.style.display = 'block';
    } else {
        examplePreview.innerHTML = '';
        exampleUpload.style.display = 'flex';
        exampleRemoveBtn.style.display = 'none';
    }
    
    // Фото пользователя
    const userPreview = document.getElementById('user-preview');
    const userUpload = document.getElementById('user-upload');
    const userRemoveBtn = document.getElementById('user-remove-btn');
    
    if (userPhoto) {
        userPreview.innerHTML = `<img src="${userPhoto.preview}" alt="Ваше фото">`;
        userUpload.style.display = 'none';
        userRemoveBtn.style.display = 'block';
    } else {
        userPreview.innerHTML = '';
        userUpload.style.display = 'flex';
        userRemoveBtn.style.display = 'none';
    }
}

function checkCreateOwnButton() {
    const generateBtn = document.getElementById('create-own-generate-btn');
    const btnText = document.getElementById('create-own-btn-text');
    const hintText = document.getElementById('create-own-hint');
    
    if (!generateBtn || !btnText || !hintText) return;
    
    const hasExample = exampleImage !== null;
    const hasUserPhoto = userPhoto !== null;
    const isEnabled = hasExample && hasUserPhoto;
    
    generateBtn.disabled = !isEnabled;
    
    if (isEnabled) {
        btnText.textContent = 'Сгенерировать за 10 звёзд';
        hintText.textContent = 'Готово к генерации!';
        hintText.style.color = '#4CAF50';
    } else {
        btnText.textContent = 'Загрузите оба фото';
        hintText.textContent = 'Загрузите фото-пример и своё фото';
        hintText.style.color = '#ff9800';
    }
}

function startCreateOwnGeneration() {
    if (!exampleImage || !userPhoto) {
        alert('Пожалуйста, загрузите оба фото');
        return;
    }
    
    const price = 10;
    
    if (price > userBalance) {
        alert(`Недостаточно звёзд!\nНужно: ${price}, у вас: ${userBalance}`);
        return;
    }
    
    const generateBtn = document.getElementById('create-own-generate-btn');
    const btnText = document.getElementById('create-own-btn-text');
    
    if (generateBtn) {
        generateBtn.disabled = true;
        btnText.textContent = 'Генерация...';
        
        // Имитация процесса (3 секунды)
        setTimeout(() => {
            userBalance -= price;
            updateBalance();
            
            if (window.addToHistory) {
                window.addToHistory('photo', 
                    'Фото: Создать свой стиль',
                    'Генерация по примеру с вашим лицом',
                    price
                );
            }
            
            alert('🎉 Генерация завершена!\nФото добавлено в ваш профиль.');
            
            // Восстанавливаем кнопку
            setTimeout(() => {
                generateBtn.disabled = false;
                btnText.textContent = 'Сгенерировать за 10 звёзд';
                
                // Переходим в историю
                if (window.switchScreen) {
                    window.switchScreen('history');
                }
            }, 500);
        }, 3000);
    }
}

// ========== ЭКРАН ПОМОЩИ ==========
function showHelpScreen() {
    const helpScreen = document.getElementById('screen-help');
    if (helpScreen) {
        helpScreen.style.display = 'flex';
        
        const closeBtn = document.getElementById('help-close-btn');
        if (closeBtn) {
            closeBtn.onclick = function() {
                helpScreen.style.display = 'none';
            };
        }
    }
}

// ========== ЭКРАН ГЕНЕРАЦИИ (для обычных категорий) ==========
function showGenerateScreen() {
    const generateScreen = document.getElementById('screen-generate');
    if (!generateScreen) return;
    
    // Сбрасываем загруженные фото для обычной генерации
    uploadedImages = [];
    
    generateScreen.style.display = 'flex';
    
    const titleElement = document.getElementById('generate-title');
    const typeBadge = document.getElementById('type-badge');
    
    if (currentCategory === 'prompt') {
        if (titleElement) titleElement.textContent = 'Генерация по описанию';
        if (typeBadge) typeBadge.textContent = '✨ По описанию';
        document.getElementById('prompt-section').style.display = 'block';
        document.getElementById('upload-section').style.display = 'block';
        document.getElementById('format-section').style.display = 'block';
        document.getElementById('model-section').style.display = 'block';
    } else {
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
        document.getElementById('upload-section').style.display = 'block';
        document.getElementById('format-section').style.display = 'block';
        document.getElementById('model-section').style.display = 'block';
    }
    
    setupFormatSelect();
    updateTotalPrice();
    updateUploadGrid();
    checkGenerateButton();
    
    if (currentCategory === 'prompt') {
        setupPromptField();
    }
    
    const backBtn = document.getElementById('generate-back-btn');
    if (backBtn) {
        backBtn.onclick = hideGenerateScreen;
    }
}

function hideGenerateScreen() {
    const generateScreen = document.getElementById('screen-generate');
    if (generateScreen) {
        generateScreen.style.display = 'none';
        
        const stylesScreen = document.getElementById('screen-styles');
        if (stylesScreen) {
            stylesScreen.classList.remove('active');
        }
        
        uploadedImages = [];
        updateUploadGrid();
        
        document.querySelectorAll('.model-card').forEach(card => {
            card.classList.remove('selected');
        });
        const nanoModel = document.querySelector('.model-card[data-model="nano"]');
        if (nanoModel) {
            nanoModel.classList.add('selected');
        }
        selectedModel = 'nano';
        
        const formatSelect = document.getElementById('format-select');
        if (formatSelect) {
            formatSelect.value = '1:1';
            selectedFormat = '1:1';
        }
        
        const promptField = document.getElementById('ai-prompt');
        if (promptField) {
            promptField.value = '';
        }
        
        const charCount = document.getElementById('char-count');
        if (charCount) {
            charCount.textContent = '0';
            charCount.style.color = '#777';
        }
        
        selectedStyle = null;
    }
}

// ========== ЗАГРУЗКА ФОТО ДЛЯ ОБЫЧНОЙ ГЕНЕРАЦИИ ==========
function setupRealUpload() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.multiple = true;
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);
    
    fileInput.addEventListener('change', function(e) {
        const files = e.target.files;
        if (files.length > 0) {
            handleFileUpload(files);
        }
        fileInput.value = '';
    });
    
    const uploadBtn = document.getElementById('upload-add-btn');
    if (uploadBtn) {
        uploadBtn.addEventListener('click', function() {
            fileInput.click();
        });
    }
}

function handleFileUpload(files) {
    const maxFiles = 5;
    const remaining = maxFiles - uploadedImages.length;
    
    if (files.length > remaining) {
        alert(`Можно загрузить не более ${maxFiles} фото. Осталось мест: ${remaining}`);
        return;
    }
    
    for (let i = 0; i < Math.min(files.length, remaining); i++) {
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
            uploadedImages.push({
                preview: e.target.result,
                file: file,
                name: file.name
            });
            
            updateUploadGrid();
            checkGenerateButton();
            showNotification(`Добавлено фото ${uploadedImages.length}/${maxFiles}`);
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
        item.innerHTML = `
            <img src="${img.preview}" alt="Фото ${index + 1}">
            <div class="upload-remove" data-index="${index}">×</div>
        `;
        
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
    
    if (uploadedImages.length < 5) {
        const addBtn = document.createElement('div');
        addBtn.className = 'upload-item upload-add';
        addBtn.id = 'upload-add-btn';
        addBtn.innerHTML = `
            <span class="material-icons-round">add</span>
            <span>Добавить фото</span>
            <div class="upload-count">${uploadedImages.length}/5</div>
        `;
        
        addBtn.addEventListener('click', function() {
            const fileInput = document.querySelector('input[type="file"]');
            if (fileInput) fileInput.click();
        });
        
        container.appendChild(addBtn);
    }
}

// ========== ОБЫЧНАЯ ГЕНЕРАЦИЯ ==========
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
        isEnabled = hasPrompt || hasPhotos;
        text = hasPrompt ? `Сгенерировать за ${calculatePrice()} звёзд` : 'Введите промпт';
        hint = hasPrompt ? 'Готово к генерации!' : 
               hasPhotos ? 'Готово к генерации по фото!' : 
               'Заполните поле "Опишите изображение" для генерации';
    } else {
        isEnabled = hasPhotos;
        text = hasPhotos ? `Сгенерировать за ${calculatePrice()} звёзд` : 'Загрузите фото';
        hint = hasPhotos ? 'Готово к генерации!' : 'Загрузите хотя бы одно фото';
    }
    
    generateBtn.disabled = !isEnabled;
    btnText.textContent = text;
    hintText.textContent = hint;
    
    if (isEnabled) {
        hintText.style.color = '#4CAF50';
    } else {
        hintText.style.color = '#ff9800';
    }
    
    const icon = generateBtn.querySelector('.generate-icon');
    if (icon) {
        icon.textContent = isEnabled ? '✨' : '📝';
    }
}

function startGeneration() {
    const price = calculatePrice();
    
    if (price > userBalance) {
        alert(`Недостаточно звёзд!\nНужно: ${price}, у вас: ${userBalance}`);
        return;
    }
    
    if (uploadedImages.length === 0 && currentCategory !== 'prompt') {
        alert('Пожалуйста, загрузите хотя бы одно фото для генерации');
        return;
    }
    
    const btn = document.getElementById('start-generate-btn');
    const btnText = document.getElementById('generate-btn-text');
    
    if (btn) {
        btn.disabled = true;
        btnText.textContent = 'Генерация...';
        
        setTimeout(() => {
            userBalance -= price;
            updateBalance();
            
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
            
            setTimeout(() => {
                btn.disabled = false;
                btnText.textContent = `Сгенерировать за ${price} звёзд`;
                hideGenerateScreen();
                
                setTimeout(() => {
                    if (window.switchScreen) {
                        window.switchScreen('history');
                    }
                }, 500);
            }, 500);
        }, 3000);
    }
}

// ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========
function setupFormatSelect() {
    const formatSelect = document.getElementById('format-select');
    
    if (!formatSelect) return;
    
    formatSelect.value = selectedFormat;
    
    formatSelect.addEventListener('change', function() {
        selectedFormat = this.value;
        updateTotalPrice();
    });
}

function setupPromptField() {
    const promptTextarea = document.getElementById('ai-prompt');
    const charCount = document.getElementById('char-count');
    const exampleChips = document.querySelectorAll('.example-chip');
    
    if (promptTextarea && charCount) {
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
            
            checkGenerateButton();
        });
        
        exampleChips.forEach(chip => {
            chip.addEventListener('click', function() {
                const example = this.dataset.example;
                promptTextarea.value = example;
                promptTextarea.dispatchEvent(new Event('input'));
                promptTextarea.focus();
            });
        });
        
        if (currentCategory === 'prompt') {
            setTimeout(() => {
                promptTextarea.focus();
            }, 300);
        }
    }
}

function calculatePrice() {
    let price = selectedModel === 'nano' ? 7 : 25;
    if (selectedStyle && (selectedStyle.includes('люкс') || selectedStyle.includes('Luxury'))) price += 15;
    return price;
}

function updateTotalPrice() {
    const price = calculatePrice();
    
    const btnText = document.getElementById('generate-btn-text');
    if (btnText) {
        const generateBtn = document.getElementById('start-generate-btn');
        if (!generateBtn.disabled) {
            btnText.textContent = `Сгенерировать за ${price} звёзд`;
        }
    }
    
    checkGenerateButton();
}

function updateBalance() {
    document.getElementById('header-balance').textContent = userBalance;
    document.getElementById('profile-balance').textContent = userBalance;
}

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

// ========== КНОПКИ ==========
function setupButtons() {
    document.querySelectorAll('.model-card').forEach(card => {
        card.addEventListener('click', function() {
            document.querySelectorAll('.model-card').forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            selectedModel = this.dataset.model;
            updateTotalPrice();
        });
    });
    
    const generateBtn = document.getElementById('start-generate-btn');
    if (generateBtn) {
        generateBtn.addEventListener('click', function() {
            startGeneration();
        });
    }
    
    const createOwnGenerateBtn = document.getElementById('create-own-generate-btn');
    if (createOwnGenerateBtn) {
        createOwnGenerateBtn.addEventListener('click', function() {
            startCreateOwnGeneration();
        });
    }
    
    // Эти функции уже объявлены в начале файла
    setupRealUpload();
    setupPhotosessions();
    setupVideo();
    
    // Инициализация остальных модулей
    setupHistoryAndProfile();
}

console.log('Nano Banana App готов!');
