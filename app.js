// app.js - ПОЛНЫЙ РАБОЧИЙ КОД
const App = {
    // Инициализация приложения
    async init() {
        console.log('AI Photo Studio: Инициализация...');

        // 1. Ждем, пока Telegram SDK полностью загрузится
        if (!window.Telegram || !window.Telegram.WebApp) {
            this.showTelegramWarning();
            return;
        }

        // 2. Инициализируем WebApp
        const tg = window.Telegram.WebApp;
        tg.expand();
        tg.enableClosingConfirmation();
        tg.ready();

        console.log('Telegram WebApp SDK готов. Пользователь:', tg.initDataUnsafe?.user);

        // 3. Настраиваем цветовую схему из Telegram
        this.setTheme(tg);

        // 4. Показываем информацию о пользователе
        this.displayUserInfo(tg);

        // 5. Инициализируем каталог стилей
        this.initCatalog();

        // 6. Настраиваем кнопку покупки
        this.setupBuyButton();

        // 7. Имитируем короткую загрузку, потом показываем главный экран
        setTimeout(() => {
            this.showMainScreen();
            tg.HapticFeedback.impactOccurred('light');
        }, 2000);
    },

    // Предупреждение, если открыто не в Telegram
    showTelegramWarning() {
        document.body.innerHTML = `
            <div class="telegram-warning">
                <div class="warning-card glass-card">
                    <h1><i class="fas fa-camera-retro"></i> AI Photo Studio</h1>
                    <p class="warning-text">Это приложение работает только внутри Telegram</p>
                    <a href="https://t.me/NeuroFlashStudio_bot" class="tg-button">
                        <i class="fab fa-telegram"></i> Открыть в Telegram
                    </a>
                    <p class="instruction">
                        1. Нажмите кнопку выше<br>
                        2. В боте нажмите "✨ AI Photo Studio" внизу экрана
                    </p>
                </div>
            </div>
        `;
    },

    // Функция для применения темы из Telegram
    setTheme(tg) {
        document.documentElement.style.setProperty('--tg-theme-bg-color', tg.themeParams.bg_color || '#1a1a1a');
        document.documentElement.style.setProperty('--tg-theme-text-color', tg.themeParams.text_color || '#ffffff');
        document.documentElement.style.setProperty('--tg-theme-hint-color', tg.themeParams.hint_color || '#aaaaaa');
        document.documentElement.style.setProperty('--tg-theme-link-color', tg.themeParams.link_color || '#5ac8fb');
        document.body.style.backgroundColor = tg.themeParams.bg_color || '#1a1a1a';
    },

    // Функция для отображения информации о пользователе
    displayUserInfo(tg) {
        const user = tg.initDataUnsafe?.user;
        const userInfoEl = document.getElementById('user-info');

        if (user) {
            let userName = user.first_name || '';
            if (user.last_name) userName += ' ' + user.last_name;
            if (!userName) userName = 'Пользователь';

            userInfoEl.innerHTML = `
                <i class="fas fa-user-circle"></i> ID: <strong>${user.id}</strong> | Имя: <strong>${userName}</strong>
            `;
            window.userData = user;
            window.tg = tg;
        } else {
            userInfoEl.textContent = 'Гость (войдите через Telegram)';
        }
    },

    // Инициализация каталога стилей
    initCatalog() {
        const styles = [
            { id: 'business', name: 'Бизнес-портрет', icon: 'fas fa-suitcase', desc: 'Профессиональный образ для LinkedIn', credits: 5 },
            { id: 'cyberpunk', name: 'Киберпанк', icon: 'fas fa-city', desc: 'Неоновые огни будущего', credits: 8 },
            { id: 'fantasy', name: 'Фэнтези', icon: 'fas fa-dragon', desc: 'Мир магии и замков', credits: 8 },
            { id: 'vintage', name: 'Винтаж', icon: 'fas fa-film', desc: 'Стиль старого кино', credits: 6 },
            { id: 'beach', name: 'Пляжный отдых', icon: 'fas fa-umbrella-beach', desc: 'Солнце, море, песок', credits: 7 },
            { id: 'viking', name: 'Викинг', icon: 'fas fa-shield-alt', desc: 'Суровый северный воин', credits: 9 },
            { id: 'space', name: 'Космонавт', icon: 'fas fa-user-astronaut', desc: 'Среди звезд и галактик', credits: 10 },
            { id: 'royal', name: 'Королевский стиль', icon: 'fas fa-crown', desc: 'Роскошь и величие', credits: 12 }
        ];

        const catalogContainer = document.getElementById('catalog-container');
        catalogContainer.innerHTML = ''; // Очищаем контейнер
        
        styles.forEach(style => {
            const styleCard = document.createElement('div');
            styleCard.className = 'style-card glass-card';
            styleCard.innerHTML = `
                <div class="style-icon">
                    <i class="${style.icon}"></i>
                </div>
                <div class="style-info">
                    <h3>${style.name}</h3>
                    <p class="style-desc">${style.desc}</p>
                </div>
                <div class="style-credits">
                    <span class="credits-badge">
                        <i class="fas fa-star"></i> ${style.credits}
                    </span>
                </div>
            `;
            
            styleCard.addEventListener('click', () => {
                this.selectStyle(style);
            });
            
            catalogContainer.appendChild(styleCard);
        });
    },

    // Обработка выбора стиля
    selectStyle(style) {
        console.log('Выбран стиль:', style);
        
        if (window.tg) {
            window.tg.HapticFeedback.impactOccurred('medium');
        }
        
        window.selectedStyle = style;
        
        this.showUploadScreen(style);
    },

    // Настройка кнопки покупки
    setupBuyButton() {
        const btnBuy = document.getElementById('btn-buy');
        if (btnBuy) {
            btnBuy.addEventListener('click', () => {
                if (window.tg) {
                    window.tg.HapticFeedback.impactOccurred('light');
                }
                this.showNotification('Система оплаты будет подключена на следующем этапе!');
            });
        }
    },

    // Показать уведомление
    showNotification(message, duration = 3000) {
        let notification = document.getElementById('custom-notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'custom-notification';
            document.querySelector('.app-container').appendChild(notification);
        }
        
       notification.innerHTML = `
    <div class="notification-content">
        <i class="fas fa-palette"></i> ${message}
    </div>
`;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, duration);
    },
    // Переход на экран загрузки фото
    showUploadScreen(style) {
        // Обновляем текст с выбранным стилем
        document.getElementById('current-style').textContent = style.name;
        document.getElementById('credits-cost').textContent = `(${style.credits} кредитов)`;
        
        // Скрываем главный экран, показываем экран загрузки
        const mainScreen = document.getElementById('screen-main');
        const uploadScreen = document.getElementById('screen-upload');
        
        mainScreen.style.opacity = '0';
        setTimeout(() => {
            mainScreen.classList.add('hidden');
            uploadScreen.classList.remove('hidden');
            setTimeout(() => {
                uploadScreen.style.opacity = '1';
            }, 50);
            
            // Инициализируем загрузку фото
            this.initFileUpload();
        }, 400);
    },

    // Инициализация загрузки файлов
    initFileUpload() {
        const dropZone = document.getElementById('drop-zone');
        const fileInput = document.getElementById('file-input');
        const selectButton = document.getElementById('select-button');
        const generateButton = document.getElementById('generate-button');
        const backButton = document.getElementById('back-button');
        
        // Массив для хранения загруженных фото
        window.uploadedPhotos = [];
        
        // Обработка drag & drop
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('drag-over');
        });
        
        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('drag-over');
        });
        
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
            const files = e.dataTransfer.files;
            this.handleFiles(files);
        });
        
        // Клик по области загрузки
        dropZone.addEventListener('click', () => {
            fileInput.click();
        });
        
        // Кнопка выбора файлов
        selectButton.addEventListener('click', (e) => {
            e.stopPropagation();
            fileInput.click();
        });
        
        // Обработка выбора файлов
        fileInput.addEventListener('change', (e) => {
            const files = e.target.files;
            this.handleFiles(files);
        });
        
        // Кнопка "Назад"
        backButton.addEventListener('click', () => {
            this.goBackToCatalog();
        });
        
        // Кнопка "Сгенерировать"
        generateButton.addEventListener('click', () => {
            this.startGeneration();
        });
        
        // Обновляем счетчик фото
        this.updatePhotoCount();
    },

    // Обработка выбранных файлов
    handleFiles(files) {
        const maxPhotos = 10;
        const remainingSlots = maxPhotos - window.uploadedPhotos.length;
        
        if (files.length > remainingSlots) {
            this.showNotification(`Можно загрузить не более ${maxPhotos} фото. Осталось мест: ${remainingSlots}`);
            return;
        }
        
        for (let i = 0; i < Math.min(files.length, remainingSlots); i++) {
            const file = files[i];
            
            // Проверяем, что это изображение
            if (!file.type.startsWith('image/')) {
                this.showNotification('Пожалуйста, загружайте только изображения');
                continue;
            }
            
            // Проверяем размер (максимум 5MB)
            if (file.size > 5 * 1024 * 1024) {
                this.showNotification(`Фото "${file.name}" слишком большое (макс. 5MB)`);
                continue;
            }
            
            // Добавляем фото в массив
            window.uploadedPhotos.push({
                file: file,
                id: Date.now() + Math.random(),
                validated: false
            });
            
            // Создаем превью
            this.createPreview(file, window.uploadedPhotos.length - 1);
        }
        
        // Обновляем интерфейс
        this.updatePhotoCount();
        this.checkGenerateButton();
        
        // Запускаем "валидацию"
        if (window.uploadedPhotos.length > 0) {
            this.simulateValidation();
        }
    },

    // Создание превью фото
    createPreview(file, index) {
        const reader = new FileReader();
        const previewGrid = document.getElementById('preview-grid');
        
        reader.onload = (e) => {
            const previewItem = document.createElement('div');
            previewItem.className = 'preview-item';
            previewItem.dataset.index = index;
            
            previewItem.innerHTML = `
                <img src="${e.target.result}" alt="Preview">
                <button class="remove-btn" data-index="${index}">
                    <i class="fas fa-times"></i>
                </button>
                <span class="badge">${index + 1}</span>
            `;
            
            previewGrid.appendChild(previewItem);
            
            // Добавляем обработчик удаления
            const removeBtn = previewItem.querySelector('.remove-btn');
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.removePhoto(index);
            });
            
            // Если это первое фото, убираем сообщение "нет фото"
            const emptyMessage = previewGrid.querySelector('.empty-message');
            if (emptyMessage) {
                emptyMessage.remove();
            }
        };
        
        reader.readAsDataURL(file);
    },

    // Удаление фото
    removePhoto(index) {
        window.uploadedPhotos.splice(index, 1);
        
        // Обновляем превью
        this.updatePreviews();
        this.updatePhotoCount();
        this.checkGenerateButton();
        
        // Виброотклик
        if (window.tg) {
            window.tg.HapticFeedback.impactOccurred('light');
        }
        
        this.showNotification('Фото удалено');
    },

    // Обновление всех превью
    updatePreviews() {
        const previewGrid = document.getElementById('preview-grid');
        previewGrid.innerHTML = '';
        
        if (window.uploadedPhotos.length === 0) {
            previewGrid.innerHTML = '<div class="empty-message">Загрузите ваши фото для предпросмотра</div>';
            return;
        }
        
        // Пересоздаем все превью
        window.uploadedPhotos.forEach((photo, index) => {
            this.createPreview(photo.file, index);
        });
    },

    // Обновление счетчика фото
    updatePhotoCount() {
        const countElement = document.getElementById('photo-count');
        countElement.textContent = `(${window.uploadedPhotos.length}/10)`;
    },

    // Проверка кнопки генерации
    checkGenerateButton() {
        const generateButton = document.getElementById('generate-button');
        generateButton.disabled = window.uploadedPhotos.length === 0;
    },

    // Имитация валидации фото
    simulateValidation() {
        const validationPanel = document.getElementById('validation-panel');
        const progressFill = document.getElementById('progress-fill');
        const validationText = document.getElementById('validation-text');
        
        // Показываем панель валидации
        validationPanel.classList.remove('hidden');
        validationPanel.classList.add('validating');
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            progressFill.style.width = `${progress}%`;
            
            if (progress <= 30) {
                validationText.textContent = 'Анализ лиц на фото...';
            } else if (progress <= 60) {
                validationText.textContent = 'Проверка качества изображения...';
            } else if (progress <= 90) {
                validationText.textContent = 'Оптимизация для ИИ...';
            } else {
                validationText.textContent = '✅ Фото готовы к генерации!';
                validationPanel.classList.remove('validating');
                clearInterval(interval);
                
                // Помечаем фото как валидированные
                window.uploadedPhotos.forEach(photo => {
                    photo.validated = true;
                });
                
                // Виброотклик
                if (window.tg) {
                    window.tg.HapticFeedback.notificationOccurred('success');
                }
            }
        }, 300);
    },

    // Возврат в каталог
    goBackToCatalog() {
        const uploadScreen = document.getElementById('screen-upload');
        const mainScreen = document.getElementById('screen-main');
        
        uploadScreen.style.opacity = '0';
        setTimeout(() => {
            uploadScreen.classList.add('hidden');
            mainScreen.classList.remove('hidden');
            setTimeout(() => {
                mainScreen.style.opacity = '1';
            }, 50);
        }, 400);
        
        // Виброотклик
        if (window.tg) {
            window.tg.HapticFeedback.impactOccurred('light');
        }
    },

    // Начало генерации (заглушка для следующего этапа)
    startGeneration() {
        if (window.uploadedPhotos.length === 0) {
            this.showNotification('Сначала загрузите фото');
            return;
        }
        
        this.showNotification('Генерация AI фото начнется на следующем этапе!');
        
        // Виброотклик
        if (window.tg) {
            window.tg.HapticFeedback.impactOccurred('heavy');
        }
    },


    // Функция для перехода на главный экран
    showMainScreen() {
        const welcomeScreen = document.getElementById('screen-welcome');
        const mainScreen = document.getElementById('screen-main');

        welcomeScreen.style.opacity = '0';
        setTimeout(() => {
            welcomeScreen.classList.add('hidden');
            mainScreen.classList.remove('hidden');
            setTimeout(() => {
                mainScreen.style.opacity = '1';
            }, 50);
        }, 400);
    }
};

// Запускаем приложение
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
