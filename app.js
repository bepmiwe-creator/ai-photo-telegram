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
});

// Функции навигации
function openTab(tabName) {
    // Убираем активный класс у всех кнопок
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Добавляем активный класс нажатой кнопке
    event.target.closest('.tab-btn').classList.add('active');
    
    // Здесь будет логика переключения экранов
    showNotification(`Открыта вкладка: ${tabName}`);
}

function openSection(section) {
    if (section === 'photo') {
        openModal('photoModal');
    } else if (section === 'photosession') {
        showNotification('Раздел "Фотосессии" скоро будет доступен!');
    } else if (section === 'profile') {
        showNotification('Открыт профиль');
    }
}

function openCategory(category) {
    showNotification(`Выбрана категория: ${category}`);
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

function startGeneration(type) {
    closeModal();
    showNotification(`Запущена генерация: ${type}`);
    
    if (window.Telegram && Telegram.WebApp) {
        Telegram.WebApp.HapticFeedback.notificationOccurred('success');
    }
}

function openProfile() {
    showNotification('Открыт раздел "Пополнение баланса"');
}

function showNotification(message) {
    if (window.Telegram && Telegram.WebApp) {
        Telegram.WebApp.showAlert(message);
    } else {
        alert(message);
    }
}

// Закрытие модального окна при клике на фон
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
});
// Переменные для генерации
let currentFormat = '3:4';
let isGenerating = false;

// Показываем секцию генерации
function showGenerateSection() {
    document.getElementById('generateSection').style.display = 'block';
    document.querySelector('main').scrollTop = 0;
}

// Выбор формата
document.querySelectorAll('.format-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.format-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentFormat = this.dataset.format;
    });
});

// Генерация фото (ТЕСТОВАЯ ВЕРСИЯ - без реального API)
async function generatePhoto() {
    if (isGenerating) return;
    
    const promptInput = document.getElementById('promptInput');
    const styleSelect = document.getElementById('styleSelect');
    const generateText = document.getElementById('generateText');
    const loadingText = document.getElementById('loadingText');
    
    if (!promptInput.value.trim()) {
        showNotification('Введите описание для фото!');
        return;
    }
    
    // Проверяем баланс (в будущем будет проверка с сервера)
    const stars = parseInt(document.querySelector('.stars').textContent);
    if (stars < 7) {
        showNotification('Недостаточно звёзд! Пополните баланс.');
        return;
    }
    
    // Показываем загрузку
    isGenerating = true;
    generateText.style.display = 'none';
    loadingText.style.display = 'inline';
    
    // Тактильный отклик
    if (window.Telegram && Telegram.WebApp) {
        Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    }
    
    // ВРЕМЕННО: Имитация генерации (3 секунды)
    // В БУДУЩЕМ: Здесь будет реальный запрос к API
    
    setTimeout(() => {
        // Скрываем загрузку
        generateText.style.display = 'inline';
        loadingText.style.display = 'none';
        isGenerating = false;
        
        // Показываем результат (тестовое изображение)
        document.getElementById('resultContainer').style.display = 'block';
        document.getElementById('generatedImage').src = 
            'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop&crop=faces';
        
        // Обновляем баланс (тестово)
        const newStars = stars - 7;
        document.querySelector('.stars').textContent = `${newStars}⭐`;
        
        showNotification('✅ Фото успешно сгенерировано!');
        
        if (window.Telegram && Telegram.WebApp) {
            Telegram.WebApp.HapticFeedback.notificationOccurred('success');
        }
        
        // Прокручиваем к результату
        document.getElementById('resultContainer').scrollIntoView({ behavior: 'smooth' });
        
    }, 3000);
}

// Скачивание фото
function downloadPhoto() {
    showNotification('Фото отправлено в чат бота!');
    
    // В БУДУЩЕМ: Здесь будет реальная отправка в Telegram бот
    // Telegram.WebApp.sendData('download_photo');
    
    if (window.Telegram && Telegram.WebApp) {
        Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }
}

// Обнови функцию openSection, чтобы показывать генерацию
function openSection(section) {
    if (section === 'photo') {
        showGenerateSection(); // ПОМЕНЯЙ ЭТУ СТРОКУ
        showNotification('Открыт раздел генерации фото');
    } else if (section === 'photosession') {
        showNotification('Раздел "Фотосессии" скоро будет доступен!');
    } else if (section === 'profile') {
        showNotification('Открыт профиль');
    }
}
