// app.js - Nano Banana AI Photo - Old Money Edition
// Версия 3.0: Добавлены фотосессии

// ========== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ==========
let userBalance = 85;
let uploadedImages = [];
let currentCategory = null;
let selectedModel = 'nano';
let selectedFormat = '1:1';
let selectedStyle = null;
let uploadedExample = null;
let uploadedFace = null;
let photosessionFrames = 10; // Количество кадров для фотосессии
let selectedPhotoForSession = null; // Выбранное фото для фотосессии
let userGeneratedPhotos = []; // Массив сгенерированных фото пользователя

// ========== ДАННЫЕ ==========
const categories = [
    { id: 'create', title: 'Создать свой', icon: '🆕', count: 'Ваш стиль', color: '#9C27B0' },
    { id: 'winter', title: 'Зима', icon: '❄️', count: '24 стиля', color: '#64B5F6' },
    { id: 'birthday', title: 'День рождения', icon: '🎂', count: '18 стилей', color: '#FFB74D' },
    { id: 'trends', title: 'Тренды', icon: '🔥', count: '32 стиля', color: '#FF5722' },
    { id: 'couples', title: 'Парные', icon: '👫', count: '15 стилей', color: '#EC407A' },
    { id: 'girls', title: 'Для девушек', icon: '💃', count: '28 стилей', color: '#E91E63' },
    { id: 'men', title: 'Для мужчин', icon: '🕺', count: '16 стилей', color: '#42A5F5' },
    { id: 'pets', title: 'Питомцы', icon: '🐾', count: '12 стилей', color: '#81C784' },
    { id: 'professions', title: 'Профессии', icon: '💼', count: '21 стиль', color: '#78909C' },
    { id: 'luxury', title: 'Luxury', icon: '💎', count: '14 стилей', color: '#FFD700' }
];

// Тестовые сгенерированные фото пользователя (в реальном приложении будут загружаться из истории)
const mockGeneratedPhotos = [
    { id: 1, src: 'https://via.placeholder.com/300x300/E0F2FE/1E3A8A?text=Фото+1', title: 'Зимняя сказка' },
    { id: 2, src: 'https://via.placeholder.com/300x300/F8E1E7/B76E79?text=Фото+2', title: 'Розовый закат' },
    { id: 3, src: 'https://via.placeholder.com/300x300/FAF3E0/374151?text=Фото+3', title: 'Элегантность' },
    { id: 4, src: 'https://via.placeholder.com/300x300/E0F2FE/1E3A8A?text=Фото+4', title: 'Городские огни' },
    { id: 5, src: 'https://via.placeholder.com/300x300/F8E1E7/B76E79?text=Фото+5', title: 'Романтика' },
    { id: 6, src: 'https://via.placeholder.com/300x300/FAF3E0/374151?text=Фото+6', title: 'Минимализм' },
    { id: 7, src: 'https://via.placeholder.com/300x300/E0F2FE/1E3A8A?text=Фото+7', title: 'Природа' },
    { id: 8, src: 'https://via.placeholder.com/300x300/F8E1E7/B76E79?text=Фото+8', title: 'Стиль' }
];

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

// ========== ЗАПУСК ПРИЛОЖЕНИЯ ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('🍌 Nano Banana Old Money Edition запускается...');
    
    initTelegram();
    setupNavigation();
    loadPhotoCategories();
    setupButtons();
    setupRealUpload();
    setupHistoryAndProfile();
    
    // Загружаем тестовые фото пользователя
    userGeneratedPhotos = [...mockGeneratedPhotos];
    loadUserPhotos();
    
    setTimeout(() => {
        document.body.classList.add('loaded');
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
        
        if (tg.colorScheme === 'dark') {
            document.body.classList.add('dark-theme');
        }
        
        console.log('Telegram подключен');
    }
}

// ========== НАВИГАЦИЯ ==========
function setupNavigation() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const quickCards = document.querySelectorAll('.quick-card');
    const screens = document.querySelectorAll('.screen');
    
    function switchScreen(screenId) {
        console.log('Переключаемся на экран:', screenId);
        
        screens.forEach(screen => {
            screen.classList.remove('active');
        });
        
        hideGenerateScreen();
        hideHowItWorks();
        hidePhotosessionModal();
        
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
            } else if (screenId === 'photosession') {
                loadUserPhotos();
            } else if (screenId === 'history') {
                loadHistory();
            } else if (screenId === 'profile') {
                updateProfileStats();
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
            showNotification(`Ваш баланс: ${userBalance} звёзд\nДля пополнения откройте приложение в Telegram боте.`);
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
        card.style.borderColor = cat.color + '30';
        
        card.innerHTML = `
            <div class="category-icon" style="background-color: ${cat.color}20; color: ${cat.color};">${cat.icon}</div>
            <div class="category-title">${cat.title}</div>
            <div class="category-count">${cat.count}</div>
        `;
        
        card.addEventListener('click', () => {
            if (cat.id === 'create') {
                currentCategory = cat.id;
                selectedStyle = null;
                uploadedExample = null;
                uploadedFace = null;
                showCreateOwnStyle();
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
        styleCard.style.borderColor = style.color + '50';
        styleCard.style.backgroundColor = style.color + '15';
        
        styleCard.innerHTML = `
            <div class="style-icon" style="background-color: ${style.color}30; color: ${style.color};">${style.icon}</div>
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

// ========== СОЗДАТЬ СВОЙ СТИЛЬ ==========
function showCreateOwnStyle() {
    const createScreen = document.getElementById('screen-create-own');
    if (!createScreen) return;
    
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    createScreen.classList.add('active');
    
    uploadedExample = null;
    uploadedFace = null;
    updateCreateOwnUploads();
    checkCreateOwnButton();
    
    const howItWorksBtn = document.getElementById('how-it-works-btn');
    if (howItWorksBtn) {
        howItWorksBtn.onclick = showHowItWorks;
    }
}

function updateCreateOwnUploads() {
    const exampleContainer = document.getElementById('example-container');
    const faceContainer = document.getElementById('face-container');
    
    if (exampleContainer) {
        exampleContainer.innerHTML = uploadedExample ? 
            `<div class="uploaded-photo">
                <img src="${uploadedExample.preview}" alt="Пример">
                <button class="remove-photo" onclick="removeExample()">×</button>
            </div>` :
            `<div class="upload-placeholder" onclick="uploadExample()">
                <span class="material-icons-round">add_photo_alternate</span>
                <span class="upload-label">Фото пример</span>
                <span class="upload-subtitle">Пример из интернета</span>
            </div>`;
    }
    
    if (faceContainer) {
        faceContainer.innerHTML = uploadedFace ? 
            `<div class="uploaded-photo">
                <img src="${uploadedFace.preview}" alt="Ваше фото">
                <button class="remove-photo" onclick="removeFace()">×</button>
            </div>` :
            `<div class="upload-placeholder" onclick="uploadFace()">
                <span class="material-icons-round">person_add</span>
                <span class="upload-label">Ваше фото</span>
                <span class="upload-subtitle">Ваше лицо</span>
            </div>`;
    }
}

function uploadExample() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => handleCreateOwnUpload(e, 'example');
    input.click();
}

function uploadFace() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => handleCreateOwnUpload(e, 'face');
    input.click();
}

function handleCreateOwnUpload(event, type) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        showNotification('Пожалуйста, загружайте только изображения');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
        showNotification('Фото слишком большое (макс. 5MB)');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const imageData = {
            preview: e.target.result,
            file: file,
            name: file.name
        };
        
        if (type === 'example') {
            uploadedExample = imageData;
        } else {
            uploadedFace = imageData;
        }
        
        updateCreateOwnUploads();
        checkCreateOwnButton();
        showNotification(`${type === 'example' ? 'Пример' : 'Лицо'} загружено`);
    };
    reader.readAsDataURL(file);
}

function removeExample() {
    uploadedExample = null;
    updateCreateOwnUploads();
    checkCreateOwnButton();
}

function removeFace() {
    uploadedFace = null;
    updateCreateOwnUploads();
    checkCreateOwnButton();
}

function checkCreateOwnButton() {
    const generateBtn = document.getElementById('create-own-generate-btn');
    const btnText = document.getElementById('create-own-btn-text');
    
    if (!generateBtn || !btnText) return;
    
    const hasBothPhotos = uploadedExample && uploadedFace;
    
    generateBtn.disabled = !hasBothPhotos;
    btnText.textContent = hasBothPhotos ? 'Сгенерировать за 10 звёзд' : 'Загрузите оба фото';
    
    const icon = generateBtn.querySelector('.generate-icon');
    if (icon) {
        icon.textContent = hasBothPhotos ? '✨' : '📷';
    }
}

function startCreateOwnGeneration() {
    if (!uploadedExample || !uploadedFace) {
        showNotification('Загрузите оба фото для генерации');
        return;
    }
    
    if (10 > userBalance) {
        showNotification(`Недостаточно звёзд! Нужно: 10, у вас: ${userBalance}`);
        return;
    }
    
    const btn = document.getElementById('create-own-generate-btn');
    const originalHTML = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `<span class="generate-icon">⏳</span><span>Генерация...</span>`;
    
    setTimeout(() => {
        userBalance -= 10;
        updateBalance();
        
        // Добавляем сгенерированное фото в массив пользователя
        const newPhoto = {
            id: Date.now(),
            src: uploadedExample.preview, // В реальном приложении это будет сгенерированное фото
            title: 'Свой стиль'
        };
        userGeneratedPhotos.unshift(newPhoto);
        loadUserPhotos();
        
        if (window.addToHistory) {
            window.addToHistory('photo', 'Создать свой стиль', 'Генерация по примеру', 10);
        }
        
        showNotification('🎉 Генерация завершена! Фото добавлены в историю.');
        
        setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = originalHTML;
            
            setTimeout(() => {
                if (window.switchScreen) {
                    window.switchScreen('history');
                }
            }, 500);
        }, 500);
    }, 3000);
}

// ========== ФОТОСЕССИИ ==========
function loadUserPhotos() {
    const container = document.getElementById('user-photos-container');
    if (!container) return;
    
    container.innerHTML = '';
    
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
        const photoCard = document.createElement('div');
        photoCard.className = 'user-photo-card';
        photoCard.innerHTML = `
            <img src="${photo.src}" alt="${photo.title}">
            <div class="photo-overlay">
                <div class="photo-title">${photo.title}</div>
            </div>
        `;
        
        photoCard.addEventListener('click', () => {
            selectedPhotoForSession = photo;
            showPhotosessionModal();
        });
        
        container.appendChild(photoCard);
    });
}

function showPhotosessionModal() {
    if (!selectedPhotoForSession) return;
    
    const modal = document.getElementById('photosession-modal');
    if (!modal) return;
    
    // Обновляем изображение
    const imgElement = document.getElementById('selected-photo-img');
    if (imgElement) {
        imgElement.src = selectedPhotoForSession.src;
        imgElement.alt = selectedPhotoForSession.title;
    }
    
    // Обновляем количество кадров
    updatePhotosessionCount();
    
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('show'), 10);
}

function hidePhotosessionModal() {
    const modal = document.getElementById('photosession-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
            selectedPhotoForSession = null;
        }, 300);
    }
}

function updatePhotosessionCount() {
    const countElement = document.getElementById('photosession-count');
    const totalElement = document.getElementById('photosession-total');
    const priceElement = document.getElementById('photosession-price');
    const resultCountElement = document.getElementById('result-photo-count');
    
    if (countElement) countElement.textContent = photosessionFrames;
    
    // Рассчитываем цену: 159 звезд за 10 кадров + 15 за каждый дополнительный
    const basePrice = 159;
    const extraFrames = Math.max(0, photosessionFrames - 10);
    const totalPrice = basePrice + (extraFrames * 15);
    
    if (priceElement) priceElement.textContent = totalPrice;
    
    // Общее количество фото: выбранные кадры + 3 бесплатных
    const totalPhotos = photosessionFrames + 3;
    if (totalElement) totalElement.textContent = totalPhotos;
    if (resultCountElement) resultCountElement.textContent = totalPhotos;
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

function startPhotosessionGeneration() {
    if (!selectedPhotoForSession) {
        showNotification('Выберите фото для фотосессии');
        return;
    }
    
    const basePrice = 159;
    const extraFrames = Math.max(0, photosessionFrames - 10);
    const totalPrice = basePrice + (extraFrames * 15);
    
    if (totalPrice > userBalance) {
        if (window.Telegram && window.Telegram.WebApp) {
            const tg = window.Telegram.WebApp;
            tg.showPopup({
                title: 'Недостаточно звёзд',
                message: `Telegram баланс: ${userBalance}\nПополнить баланс в боте?`,
                buttons: [
                    { id: 'exit', type: 'default', text: 'Выход' },
                    { id: 'ok', type: 'ok', text: 'ОК' }
                ]
            }, function(buttonId) {
                if (buttonId === 'ok') {
                    tg.openTelegramLink('https://t.me/NeuroFlashStudio_bot');
                }
            });
        } else {
            showNotification(`Недостаточно звёзд! Нужно: ${totalPrice}, у вас: ${userBalance}`);
        }
        return;
    }
    
    const btn = document.getElementById('start-photosession-btn');
    const originalHTML = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `<span class="generate-icon">⏳</span><span>Создание фотосессии...</span>`;
    
    setTimeout(() => {
        userBalance -= totalPrice;
        updateBalance();
        
        if (window.addToHistory) {
            window.addToHistory('photosession', 
                `Фотосессия: ${selectedPhotoForSession.title}`,
                `${photosessionFrames} кадров + 3 в подарок`,
                totalPrice
            );
        }
        
        showNotification(`🎉 Фотосессия создана! Вы получите ${photosessionFrames + 3} уникальных фото.`);
        
        setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = originalHTML;
            hidePhotosessionModal();
            
            setTimeout(() => {
                if (window.switchScreen) {
                    window.switchScreen('history');
                }
            }, 500);
        }, 500);
    }, 3000);
}

// ========== КАК ЭТО РАБОТАЕТ ==========
function showHowItWorks() {
    const overlay = document.getElementById('how-it-works-overlay');
    if (overlay) {
        overlay.style.display = 'flex';
        setTimeout(() => overlay.classList.add('show'), 10);
    }
}

function hideHowItWorks() {
    const overlay = document.getElementById('how-it-works-overlay');
    if (overlay) {
        overlay.classList.remove('show');
        setTimeout(() => overlay.style.display = 'none', 300);
    }
}

// ========== ЭКРАН ГЕНЕРАЦИИ ==========
function showGenerateScreen() {
    const generateScreen = document.getElementById('screen-generate');
    if (!generateScreen) return;
    
    generateScreen.style.display = 'flex';
    setTimeout(() => generateScreen.classList.add('show'), 10);
    
    const titleElement = document.getElementById('generate-title');
    const typeBadge = document.getElementById('type-badge');
    
    if (currentCategory === 'prompt') {
        if (titleElement) titleElement.textContent = 'Генерация по описанию';
        if (typeBadge) typeBadge.textContent = '✨ По описанию';
        document.getElementById('prompt-section').style.display = 'block';
    } else {
        const category = categories.find(c => c.id === currentCategory);
        if (titleElement) titleElement.textContent = `Генерация: ${category?.title || 'Фото'}`;
        if (typeBadge) {
            typeBadge.textContent = selectedStyle ? `📷 ${selectedStyle}` : `📷 ${category?.title || 'Из фото'}`;
        }
        document.getElementById('prompt-section').style.display = 'none';
    }
    
    setupFormatSelect();
    updateTotalPrice();
    
    if (currentCategory === 'prompt') {
        setupPromptField();
    }
    
    checkGenerateButton();
    updateUploadGrid();
    
    const backBtn = document.getElementById('generate-back-btn');
    if (backBtn) {
        backBtn.onclick = hideGenerateScreen;
    }
}

function hideGenerateScreen() {
    const generateScreen = document.getElementById('screen-generate');
    if (generateScreen) {
        generateScreen.classList.remove('show');
        setTimeout(() => {
            generateScreen.style.display = 'none';
            
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
        }, 300);
    }
}

// ========== НАСТРОЙКА ПОЛЯ ПРОМПТА ==========
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

// ========== ПРОВЕРКА АКТИВНОСТИ КНОПКИ ==========
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
    hintText.style.color = isEnabled ? '#4CAF50' : '#ff9800';
    
    const icon = generateBtn.querySelector('.generate-icon');
    if (icon) {
        icon.textContent = isEnabled ? '✨' : '📝';
    }
}

// ========== ВЫБОР ФОРМАТА ==========
function setupFormatSelect() {
    const formatSelect = document.getElementById('format-select');
    
    if (!formatSelect) return;
    
    formatSelect.value = selectedFormat;
    
    formatSelect.addEventListener('change', function() {
        selectedFormat = this.value;
        updateTotalPrice();
    });
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
        generateBtn.addEventListener('click', startGeneration);
    }
    
    const createOwnBtn = document.getElementById('create-own-generate-btn');
    if (createOwnBtn) {
        createOwnBtn.addEventListener('click', startCreateOwnGeneration);
    }
    
    const createOwnBackBtn = document.getElementById('create-own-back-btn');
    if (createOwnBackBtn) {
        createOwnBackBtn.addEventListener('click', () => {
            switchScreen('photo');
        });
    }
    
    const photosessionBackBtn = document.getElementById('photosession-back-btn');
    if (photosessionBackBtn) {
        photosessionBackBtn.addEventListener('click', () => {
            switchScreen('photosession');
        });
    }
    
    setupPhotosessions();
    setupVideo();
}

// ========== ЗАГРУЗКА ФОТО ==========
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
        showNotification(`Можно загрузить не более ${maxFiles} фото. Осталось мест: ${remaining}`);
        return;
    }
    
    for (let i = 0; i < Math.min(files.length, remaining); i++) {
        const file = files[i];
        
        if (!file.type.startsWith('image/')) {
            showNotification('Пожалуйста, загружайте только изображения');
            continue;
        }
        
        if (file.size > 5 * 1024 * 1024) {
            showNotification(`Фото "${file.name}" слишком большое (макс. 5MB)`);
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
            document.querySelector('input[type="file"]').click();
        });
        
        container.appendChild(addBtn);
    }
}

// ========== ГЕНЕРАЦИЯ ФОТО ==========
function startGeneration() {
    const price = calculatePrice();
    
    if (price > userBalance) {
        showNotification(`Недостаточно звёзд!\nНужно: ${price}, у вас: ${userBalance}`);
        return;
    }
    
    if (uploadedImages.length === 0 && currentCategory !== 'prompt') {
        showNotification('Пожалуйста, загрузите хотя бы одно фото для генерации');
        return;
    }
    
    const btn = document.getElementById('start-generate-btn');
    const originalHTML = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `<span class="generate-icon">⏳</span><span>Генерация...</span>`;
    
    setTimeout(() => {
        userBalance -= price;
        updateBalance();
        
        const categoryName = currentCategory === 'prompt' ? 'По промпту' : 
                            categories.find(c => c.id === currentCategory)?.title || 'Фото';
        
        const details = `Модель: ${selectedModel === 'nano' ? 'Nano Banana' : 'Nano Banana Pro'}, Формат: ${selectedFormat}`;
        
        // Добавляем сгенерированное фото
        const newPhoto = {
            id: Date.now(),
            src: uploadedImages[0]?.preview || 'https://via.placeholder.com/300x300/E0F2FE/1E3A8A?text=Сгенерировано',
            title: categoryName + (selectedStyle ? ' - ' + selectedStyle : '')
        };
        userGeneratedPhotos.unshift(newPhoto);
        loadUserPhotos();
        
        if (window.addToHistory) {
            window.addToHistory('photo', 
                `Фото: ${categoryName}${selectedStyle ? ' - ' + selectedStyle : ''}`,
                details,
                price
            );
        }
        
        showNotification('🎉 Генерация завершена! Фото добавлены в историю.');
        
        setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = originalHTML;
            hideGenerateScreen();
            
            setTimeout(() => {
                switchScreen('history');
            }, 500);
        }, 500);
    }, 3000);
}

// ========== РАСЧЕТ ЦЕНЫ ==========
function calculatePrice() {
    let price = selectedModel === 'nano' ? 7 : 25;
    if (currentCategory === 'create') price += 10;
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

// ========== УВЕДОМЛЕНИЯ ==========
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

// ========== ДОПОЛНИТЕЛЬНЫЕ МОДУЛИ ==========
function setupPhotosessions() {
    const photoSessionBtns = document.querySelectorAll('.photosession-btn:not([data-pack="custom"])');
    photoSessionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const pack = this.dataset.pack;
            showNotification(`Выбран пакет: ${pack}. Функция скоро будет доступна!`);
        });
    });
    
    const customSessionBtn = document.querySelector('.photosession-btn[data-pack="custom"]');
    if (customSessionBtn) {
        customSessionBtn.addEventListener('click', function() {
            showCustomPhotosession();
        });
    }
}

function showCustomPhotosession() {
    switchScreen('photosession-custom');
}

function setupVideo() {
    const videoBtns = document.querySelectorAll('.video-btn');
    videoBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const type = this.dataset.videoType;
            showNotification(`Выбран тип видео: ${type}. Функция скоро будет доступна!`);
        });
    });
}

// ========== ИСТОРИЯ И ПРОФИЛЬ ==========
function setupHistoryAndProfile() {
    if (typeof Storage !== 'undefined') {
        if (!localStorage.getItem('nanoBananaHistory')) {
            localStorage.setItem('nanoBananaHistory', JSON.stringify([]));
        }
    }
    
    window.addToHistory = function(type, title, description, price) {
        const history = JSON.parse(localStorage.getItem('nanoBananaHistory') || '[]');
        const newItem = {
            id: Date.now(),
            type: type,
            title: title,
            description: description,
            price: price,
            date: new Date().toISOString()
        };
        
        history.unshift(newItem);
        localStorage.setItem('nanoBananaHistory', JSON.stringify(history));
        updateProfileStats();
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
    const container = document.getElementById('history-container');
    const empty = document.getElementById('history-empty');
    const count = document.getElementById('history-count');
    
    if (!container || !empty || !count) return;
    
    const history = JSON.parse(localStorage.getItem('nanoBananaHistory') || '[]');
    count.textContent = history.length;
    
    if (history.length === 0) {
        empty.style.display = 'block';
        container.innerHTML = '';
        return;
    }
    
    empty.style.display = 'none';
    container.innerHTML = '';
    
    history.forEach(item => {
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
            <button class="history-btn download">Скачать</button>
        `;
        
        container.appendChild(historyItem);
    });
}

function updateProfileStats() {
    const history = JSON.parse(localStorage.getItem('nanoBananaHistory') || '[]');
    
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

console.log('🍌 Nano Banana App готов! Версия 3.0 с фотосессиями');
