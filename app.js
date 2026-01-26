// ========== НАСТРОЙКИ ==========
let currentFormat = '3:4';
let isGenerating = false;
// ===============================

// Инициализация Telegram Mini App
window.addEventListener('DOMContentLoaded', () => {
    console.log('Nano Banana AI Photo loaded!');
    
    // Проверяем, открыты ли мы в Telegram
    if (window.Telegram && Telegram.WebApp) {
        console.log('Running in Telegram WebApp');
        
        // Расширяем на всё окно
        Telegram.WebApp.expand();
        
        // Получаем информацию о пользователе
        const user = Telegram.WebApp.initDataUnsafe.user;
        if (user) {
            console.log('User:', user);
            // Можно показать имя пользователя где-то в интерфейсе
        }
        
        // Настраиваем под тему Telegram
        if (Telegram.WebApp.colorScheme === 'dark') {
            document.body.classList.add('dark-theme');
        }
        
        // Слушаем смену темы
        Telegram.WebApp.onEvent('themeChanged', () => {
            if (Telegram.WebApp.colorScheme === 'dark') {
                document.body.classList.add('dark-theme');
            } else {
                document.body.classList.remove('dark-theme');
            }
        });
    } else {
        console.log('Running in browser');
    }
    
    // Инициализация кнопок формата
    initFormatButtons();
});

// ========== НАВИГАЦИЯ ==========

// Функции навигации по вкладкам
function openTab(tabName) {
    console.log('Opening tab:', tabName);
    
    // Убираем активный класс у всех кнопок
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Добавляем активный класс нажатой кнопке
    event.target.closest('.tab-btn').classList.add('active');
    
    // Показываем соответствующий экран
    switch(tabName) {
        case 'home':
            showScreen('main');
            break;
        case 'photo':
            showGenerateSection(); // ПОКАЗЫВАЕМ ФОРМУ ГЕНЕРАЦИИ
            break;
        case 'photosession':
            showNotification('🎬 Раздел "Фотосессии" скоро будет доступен!');
            showScreen('main'); // Возвращаем на главную
            break;
        case 'history':
            showNotification('📚 История генераций скоро будет доступна!');
            showScreen('main');
            break;
        case 'profile':
            showNotification('👤 Профиль и настройки скоро будут доступны!');
            showScreen('main');
            break;
    }
    
    // Тактильный отклик
    if (window.Telegram && Telegram.WebApp) {
        Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }
}

// Функция для открытия разделов с главной
function openSection(section) {
    console.log('Opening section:', section);
    
    if (section === 'photo') {
        showGenerateSection(); // ПОКАЗЫВАЕМ ФОРМУ ГЕНЕРАЦИИ
    } else if (section === 'photosession') {
        showNotification('🎬 Раздел "Фотосессии" скоро будет доступен!');
    } else if (section === 'profile') {
        showNotification('👤 Профиль и настройки скоро будут доступны!');
    }
}

// Показываем форму генерации фото
function showGenerateSection() {
    console.log('Showing generate section...');
    
    // Скрываем главный контент
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.style.display = 'none';
    }
    
    // Показываем форму генерации
    const generateSection = document.getElementById('generateSection');
    if (generateSection) {
        generateSection.style.display = 'block';
        
        // Активируем вкладку "Фото"
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.querySelector('.tab-text').textContent === 'Фото') {
                btn.classList.add('active');
            }
        });
        
        // Прокручиваем к форме
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Фокус на поле ввода
        setTimeout(() => {
            const promptInput = document.getElementById('promptInput');
            if (promptInput) {
                promptInput.focus();
            }
        }, 300);
    } else {
        console.error('Generate section not found!');
        showNotification('Форма генерации не найдена');
    }
    
    // Тактильный отклик
    if (window.Telegram && Telegram.WebApp) {
        Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }
}

// Возврат на главный экран
function showMainScreen() {
    console.log('Showing main screen...');
    
    // Показываем главный контент
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.style.display = 'block';
    }
    
    // Скрываем форму генерации
    const generateSection = document.getElementById('generateSection');
    if (generateSection) {
        generateSection.style.display = 'none';
    }
    
    // Скрываем результат
    const resultContainer = document.getElementById('resultContainer');
    if (resultContainer) {
        resultContainer.style.display = 'none';
    }
    
    // Активируем вкладку "Главная"
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.querySelector('.tab-text').textContent === 'Главная') {
            btn.classList.add('active');
        }
    });
}

// Общая функция показа экранов
function showScreen(screenName) {
    if (screenName === 'main') {
        showMainScreen();
    } else if (screenName === 'generate') {
        showGenerateSection();
    }
}

// ========== ГЕНЕРАЦИЯ ФОТО ==========

// Инициализация кнопок формата
function initFormatButtons() {
    document.querySelectorAll('.format-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.format-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFormat = this.dataset.format;
            console.log('Selected format:', currentFormat);
        });
    });
}

// Генерация фото (ДЕМО-РЕЖИМ)
async function generatePhoto() {
    if (isGenerating) return;
    
    const promptInput = document.getElementById('promptInput');
    const styleSelect = document.getElementById('styleSelect');
    const generateText = document.getElementById('generateText');
    const loadingText = document.getElementById('loadingText');
    const resultContainer = document.getElementById('resultContainer');
    const generatedImage = document.getElementById('generatedImage');
    
    if (!promptInput || !promptInput.value.trim()) {
        showNotification('✏️ Введите описание для фото!');
        return;
    }
    
    // Проверяем баланс (демо)
    const starsElement = document.querySelector('.stars');
    let stars = 85; // Начальный баланс
    if (starsElement) {
        const starsText = starsElement.textContent;
        stars = parseInt(starsText) || 85;
    }
    
    if (stars < 7) {
        showNotification('⭐ Недостаточно звёзд! Пополните баланс.');
        return;
    }
    
    // Показываем загрузку
    isGenerating = true;
    if (generateText) generateText.style.display = 'none';
    if (loadingText) loadingText.style.display = 'inline';
    
    // Тактильный отклик
    if (window.Telegram && Telegram.WebApp) {
        Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    }
    
    // Демо-изображения (разные в зависимости от запроса)
    const prompt = promptInput.value.toLowerCase();
    let demoImage;
    
    if (prompt.includes('зим') || prompt.includes('snow') || prompt.includes('winter')) {
        demoImage = 'https://images.unsplash.com/photo-1549476464-37392f717541?w=400&h=600&fit=crop';
    } else if (prompt.includes('лет') || prompt.includes('summer') || prompt.includes('beach')) {
        demoImage = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=600&fit=crop';
    } else if (prompt.includes('город') || prompt.includes('city') || prompt.includes('urban')) {
        demoImage = 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&h=600&fit=crop';
    } else if (prompt.includes('портрет') || prompt.includes('portrait') || prompt.includes('face')) {
        demoImage = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop';
    } else if (prompt.includes('природа') || prompt.includes('nature') || prompt.includes('forest')) {
        demoImage = 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&h=600&fit=crop';
    } else {
        // Случайное фото из коллекции
        const demoImages = [
            'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop',
            'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400&h=600&fit=crop',
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop',
            'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop',
            'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=600&fit=crop'
        ];
        demoImage = demoImages[Math.floor(Math.random() * demoImages.length)];
    }
    
    // Имитация загрузки (2-3 секунды)
    const delay = 2000 + Math.random() * 1000; // 2-3 секунды
    
    setTimeout(() => {
        // Скрываем загрузку
        if (generateText) generateText.style.display = 'inline';
        if (loadingText) loadingText.style.display = 'none';
        isGenerating = false;
        
        // Показываем результат
        if (resultContainer) {
            resultContainer.style.display = 'block';
        }
        if (generatedImage && demoImage) {
            generatedImage.src = demoImage;
            generatedImage.alt = 'Сгенерированное фото: ' + promptInput.value.substring(0, 30) + '...';
        }
        
        // Обновляем баланс (демо)
        const newStars = stars - 7;
        if (starsElement) {
            starsElement.textContent = `${newStars}⭐`;
        }
        
        // Прокручиваем к результату
        if (resultContainer) {
            resultContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        
        showNotification('🎉 Фото успешно сгенерировано!');
        
        // Успешный тактильный отклик
        if (window.Telegram && Telegram.WebApp) {
            Telegram.WebApp.HapticFeedback.notificationOccurred('success');
        }
        
    }, delay);
}

// Скачивание/отправка фото
function downloadPhoto() {
    const generatedImage = document.getElementById('generatedImage');
    
    if (!generatedImage || !generatedImage.src) {
        showNotification('❌ Нет фото для отправки');
        return;
    }
    
    showNotification('📤 Фото отправляется в чат бота...');
    
    // В реальном приложении здесь будет отправка на сервер
    // А пока просто имитируем
    setTimeout(() => {
        showNotification('✅ Фото отправлено в чат с ботом!');
        
        if (window.Telegram && Telegram.WebApp) {
            Telegram.WebApp.HapticFeedback.impactOccurred('light');
        }
    }, 1000);
}

// ========== КАТЕГОРИИ И МОДАЛЬНЫЕ ОКНА ==========

function openCategory(category) {
    console.log('Opening category:', category);
    
    // Показываем уведомление с названием категории
    const categoryNames = {
        'winter': '❄️ Зима',
        'birthday': '🎂 День рождения',
        'luxury': '💎 Luxury',
        'couple': '👫 Парные',
        'pets': '🐾 Питомцы'
    };
    
    const name = categoryNames[category] || category;
    showNotification(`Выбрана категория: ${name}`);
    
    // Автоматически заполняем промпт
    const promptInput = document.getElementById('promptInput');
    if (promptInput) {
        const prompts = {
            'winter': 'Красивая зимняя фотосессия в лесу со снегом, пушистый снег, тёплая одежда, магия зимы',
            'birthday': 'Праздничная фотосессия на день рождения, воздушные шары, торт, улыбки, праздник',
            'luxury': 'Роскошная фотосессия, дорогой интерьер, элегантная одежда, шик, гламур',
            'couple': 'Романтическая фотосессия для пары, любовь, нежность, совместные моменты',
            'pets': 'Фотосессия с питомцем, милые животные, домашние любимцы, радость'
        };
        
        if (prompts[category]) {
            promptInput.value = prompts[category];
            showGenerateSection(); // Переходим к генерации
        }
    }
    
    // Тактильный отклик
    if (window.Telegram && Telegram.WebApp) {
        Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        if (window.Telegram && Telegram.WebApp) {
            Telegram.WebApp.HapticFeedback.impactOccurred('medium');
        }
    }
}

function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

// ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========

function showNotification(message) {
    console.log('Notification:', message);
    
    if (window.Telegram && Telegram.WebApp) {
        Telegram.WebApp.showAlert(message);
    } else {
        alert(message);
    }
}

function openProfile() {
    showNotification('👤 Профиль и пополнение баланса скоро будут доступны!');
}

// Закрытие модального окна при клике на фон
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    });
    
    // Кнопка "Назад" в форме генерации
    const backButton = document.querySelector('.back-button');
    if (backButton) {
        backButton.addEventListener('click', showMainScreen);
    }
});

// Глобальные функции для HTML
window.showGenerateSection = showGenerateSection;
window.generatePhoto = generatePhoto;
window.downloadPhoto = downloadPhoto;
window.openCategory = openCategory;
window.openTab = openTab;
window.openSection = openSection;
window.openProfile = openProfile;
window.closeModal = closeModal;
