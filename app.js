// app.js - ПОЛНЫЙ РАБОЧИЙ КОД
const App = {
    // Инициализация приложения
    async init() {
        console.log('AI Photo Studio: Инициализация...');
        
        // 1. Ждем, пока Telegram SDK полностью загрузится
        if (!window.Telegram || !window.Telegram.WebApp) {
            console.log('Telegram WebApp SDK не найден!');
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

        // 6. Инициализируем кнопку профиля
        this.initProfileButton();

        // 7. Настраиваем кнопку покупки
        this.setupBuyButton();

        // 8. Устанавливаем начальный баланс
        let initialBalance = localStorage.getItem('ai_photo_balance');
        if (!initialBalance) {
            initialBalance = '85';
            localStorage.setItem('ai_photo_balance', initialBalance);
        }
        document.querySelector('.balance-amount .credits-count').textContent = initialBalance;

        // 9. Имитируем короткую загрузку, потом показываем главный экран
        setTimeout(() => {
            this.showMainScreen();
            if (tg.HapticFeedback) {
                tg.HapticFeedback.impactOccurred('light');
            }
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
                        <i class="fas fa-star"></i> ${style.credits} звезд
                    </span>
                </div>
            `;
            
            styleCard.addEventListener('click', () => {
                this.selectStyle(style);
            });
            
            catalogContainer.appendChild(styleCard);
        });

        // Обновляем баланс на главном экране
        const currentBalance = localStorage.getItem('ai_photo_balance') || '85';
        document.querySelector('.balance-panel .credits-count').textContent = currentBalance;
        const label = document.querySelector('.balance-panel .credits-label');
        if (label) {
            label.textContent = 'звезд';
        }
    },

    // Обработка выбора стиля
    selectStyle(style) {
        console.log('Выбран стиль:', style);
        
        // Проверяем баланс
        const currentBalance = parseInt(localStorage.getItem('ai_photo_balance') || '85');
        if (currentBalance < style.credits) {
            this.showNotification(`Недостаточно звезд! Нужно: ${style.credits}, у вас: ${currentBalance}`);
            
            // Предлагаем пополнить баланс
            setTimeout(() => {
                this.showPaymentModal();
            }, 1500);
            
            return;
        }
        
        if (window.tg && window.tg.HapticFeedback) {
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
                if (window.tg && window.tg.HapticFeedback) {
                    window.tg.HapticFeedback.impactOccurred('light');
                }
                this.showPaymentModal();
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
        document.getElementById('credits-cost').textContent = `(${style.credits} звезд)`;
        
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
        if (window.tg && window.tg.HapticFeedback) {
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
                if (window.tg && window.tg.HapticFeedback) {
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
        if (window.tg && window.tg.HapticFeedback) {
            window.tg.HapticFeedback.impactOccurred('light');
        }
    },

    // Начало генерации AI-фото
    startGeneration() {
        if (window.uploadedPhotos.length === 0) {
            this.showNotification('Сначала загрузите фото');
            return;
        }
        
        // Проверяем баланс перед генерацией
        const currentBalance = parseInt(localStorage.getItem('ai_photo_balance') || '85');
        const styleCost = window.selectedStyle.credits;
        
        if (currentBalance < styleCost) {
            this.showNotification(`Недостаточно звезд! Нужно: ${styleCost}, у вас: ${currentBalance}`);
            
            // Предлагаем пополнить баланс
            setTimeout(() => {
                this.showPaymentModal();
            }, 1500);
            
            return;
        }
        
        // СПИСЫВАЕМ БАЛАНС
        const newBalance = this.updateBalance(-styleCost);
        
        // Показываем уведомление о списании
        this.showNotification(`Списано ${styleCost} звезд. Остаток: ${newBalance}`);
        
        // Переходим на экран генерации
        this.showGenerationScreen();
        
        // Виброотклик
        if (window.tg && window.tg.HapticFeedback) {
            window.tg.HapticFeedback.impactOccurred('heavy');
        }
    },

    // Обновление баланса
    updateBalance(change) {
        // Преобразуем change в число
        const changeNum = parseInt(change) || 0;
        
        // Получаем текущий баланс как число
        let balance = parseInt(localStorage.getItem('ai_photo_balance') || '85');
        
        // Обновляем баланс
        balance += changeNum;
        
        // Баланс не может быть отрицательным
        if (balance < 0) balance = 0;
        
        // Сохраняем
        localStorage.setItem('ai_photo_balance', balance.toString());
        
        // Обновляем отображение баланса
        document.querySelector('.balance-amount .credits-count').textContent = balance;
        document.querySelector('.balance-panel .credits-count').textContent = balance;
        
        // В профиле
        const profileBalanceEl = document.getElementById('profile-balance');
        if (profileBalanceEl) {
            profileBalanceEl.textContent = balance;
        }
        
        console.log(`Баланс обновлен: ${changeNum} звезд. Новый баланс: ${balance}`);
        
        return balance;
    },

    // Показ экрана генерации
    showGenerationScreen() {
        const uploadScreen = document.getElementById('screen-upload');
        const generationScreen = document.getElementById('screen-generation');
        
        // Обновляем текст с выбранным стилем
        document.getElementById('generation-style').textContent = window.selectedStyle.name;
        document.getElementById('complete-style').textContent = window.selectedStyle.name;
        
        uploadScreen.style.opacity = '0';
        setTimeout(() => {
            uploadScreen.classList.add('hidden');
            generationScreen.classList.remove('hidden');
            setTimeout(() => {
                generationScreen.style.opacity = '1';
                // Запускаем процесс генерации
                this.startAIProcess();
            }, 50);
        }, 400);
        
        // Настраиваем кнопку "Назад"
        const backButton = document.getElementById('back-to-upload');
        backButton.addEventListener('click', () => {
            this.goBackToUpload();
        });
    },

    // Запуск процесса AI-генерации
    startAIProcess() {
        // Сброс прогресса
        this.resetProgress();
        
        // Этапы генерации
        const steps = [
            { text: 'Загрузка модели Stable Diffusion...', duration: 3000 },
            { text: 'Анализ лиц на фото...', duration: 4000 },
            { text: 'Применение стиля "' + window.selectedStyle.name + '"...', duration: 5000 },
            { text: 'Генерация изображений...', duration: 6000 },
            { text: 'Финальная обработка...', duration: 3000 }
        ];
        
        let currentStep = 0;
        let totalProgress = 0;
        const totalTime = steps.reduce((sum, step) => sum + step.duration, 0);
        
        // Обновляем таймер
        const timeElement = document.getElementById('time-left');
        let timeLeft = Math.round(totalTime / 1000);
        timeElement.textContent = timeLeft;
        
        const timeInterval = setInterval(() => {
            timeLeft--;
            if (timeLeft >= 0) {
                timeElement.textContent = timeLeft;
            }
        }, 1000);
        
        // Функция для выполнения шага
        const executeStep = (stepIndex) => {
            if (stepIndex >= steps.length) {
                this.completeGeneration();
                clearInterval(timeInterval);
                return;
            }
            
            const step = steps[stepIndex];
            const stepElement = document.getElementById(`step-${stepIndex + 1}-fill`);
            const stepIcon = document.querySelectorAll('.step-icon')[stepIndex];
            const processStep = document.getElementById('process-step');
            
            // Активируем иконку шага
            stepIcon.classList.add('active');
            processStep.textContent = step.text;
            
            // Анимация прогресса шага
            let stepProgress = 0;
            const stepInterval = setInterval(() => {
                stepProgress += 1;
                stepElement.style.width = stepProgress + '%';
                
                // Общий прогресс
                totalProgress += (100 / steps.length) / (step.duration / 100);
                if (totalProgress > 100) totalProgress = 100;
                
                this.updateMainProgress(totalProgress);
                
                if (stepProgress >= 100) {
                    clearInterval(stepInterval);
                    
                    // Показываем предпросмотр после 3 шага
                    if (stepIndex === 2) {
                        this.showGenerationPreview();
                    }
                    
                    // Переход к следующему шагу
                    currentStep++;
                    setTimeout(() => executeStep(currentStep), 500);
                }
            }, step.duration / 100);
        };
        
        // Запускаем первый шаг
        executeStep(currentStep);
    },

    // Сброс прогресса
    resetProgress() {
        // Сбрасываем все прогресс-бары
        for (let i = 1; i <= 4; i++) {
            const fillElement = document.getElementById(`step-${i}-fill`);
            if (fillElement) {
                fillElement.style.width = '0%';
            }
        }
        
        const mainProgressFill = document.getElementById('main-progress-fill');
        if (mainProgressFill) {
            mainProgressFill.style.width = '0%';
        }
        
        const progressGlow = document.querySelector('.progress-glow');
        if (progressGlow) {
            progressGlow.style.width = '0%';
        }
        
        const percentElement = document.getElementById('progress-percent');
        if (percentElement) {
            percentElement.textContent = '0%';
        }
        
        // Сбрасываем иконки шагов
        document.querySelectorAll('.step-icon').forEach(icon => {
            icon.classList.remove('active');
        });
        
        // Скрываем предпросмотр и завершение
        const generationPreview = document.getElementById('generation-preview');
        if (generationPreview) {
            generationPreview.classList.add('hidden');
        }
        
        const generationComplete = document.getElementById('generation-complete');
        if (generationComplete) {
            generationComplete.classList.add('hidden');
        }
    },

    // Обновление основного прогресс-бара
    updateMainProgress(percent) {
        const progressFill = document.getElementById('main-progress-fill');
        const progressGlow = document.querySelector('.progress-glow');
        const percentElement = document.getElementById('progress-percent');
        
        if (progressFill) {
            progressFill.style.width = percent + '%';
        }
        if (progressGlow) {
            progressGlow.style.width = percent + '%';
        }
        if (percentElement) {
            percentElement.textContent = Math.round(percent) + '%';
        }
    },

    // Показ предпросмотра генерируемых фото
    showGenerationPreview() {
        const previewContainer = document.getElementById('generation-preview');
        const previewGrid = document.getElementById('generation-preview-grid');
        
        if (!previewContainer || !previewGrid) return;
        
        // Очищаем предыдущие превью
        previewGrid.innerHTML = '';
        
        // Создаем 4 карточки для предпросмотра
        for (let i = 0; i < 4; i++) {
            const previewItem = document.createElement('div');
            previewItem.className = 'preview-item generating';
            previewItem.innerHTML = `
                <div class="loading-placeholder">
                    <i class="fas fa-spinner fa-spin"></i>
                    <span>Генерация ${i + 1}/4</span>
                </div>
            `;
            previewGrid.appendChild(previewItem);
        }
        
        // Показываем контейнер
        previewContainer.classList.remove('hidden');
    },

    // Завершение генерации
    completeGeneration() {
        const processStep = document.getElementById('process-step');
        const previewGrid = document.getElementById('generation-preview-grid');
        const completeContainer = document.getElementById('generation-complete');
        
        if (!processStep || !previewGrid || !completeContainer) return;
        
        // Обновляем текст
        processStep.textContent = '✅ Генерация завершена!';
        
        // Обновляем предпросмотр - убираем анимацию загрузки
        previewGrid.innerHTML = '';
        for (let i = 0; i < 4; i++) {
            const previewItem = document.createElement('div');
            previewItem.className = 'preview-item';
            previewItem.innerHTML = `
                <div class="placeholder-complete">
                    <i class="fas fa-image"></i>
                    <span>Фото ${i + 1}</span>
                </div>
            `;
            previewGrid.appendChild(previewItem);
        }
        
        // Показываем блок завершения через 1 секунду
        setTimeout(() => {
            completeContainer.classList.remove('hidden');
            
            // Настраиваем кнопки
            const viewResultsBtn = document.getElementById('view-results-btn');
            const downloadAllBtn = document.getElementById('download-all-btn');
            
            if (viewResultsBtn) {
                viewResultsBtn.addEventListener('click', () => {
                    this.showResultsScreen();
                });
            }
            
            if (downloadAllBtn) {
                downloadAllBtn.addEventListener('click', () => {
                    this.showNotification('Скачивание будет доступно на следующем этапе!');
                });
            }
        }, 1000);
        
        // Виброотклик успеха
        if (window.tg && window.tg.HapticFeedback) {
            window.tg.HapticFeedback.notificationOccurred('success');
        }
    },

    // Возврат на экран загрузки
    goBackToUpload() {
        const generationScreen = document.getElementById('screen-generation');
        const uploadScreen = document.getElementById('screen-upload');
        
        if (!generationScreen || !uploadScreen) return;
        
        generationScreen.style.opacity = '0';
        setTimeout(() => {
            generationScreen.classList.add('hidden');
            uploadScreen.classList.remove('hidden');
            setTimeout(() => {
                uploadScreen.style.opacity = '1';
            }, 50);
        }, 400);
        
        // Виброотклик
        if (window.tg && window.tg.HapticFeedback) {
            window.tg.HapticFeedback.impactOccurred('light');
        }
    },

    // ============================================
    // ФУНКЦИИ ДЛЯ ЭКРАНА РЕЗУЛЬТАТОВ И ПРОФИЛЯ
    // ============================================

    // Инициализация кнопки профиля
    initProfileButton() {
        const profileButton = document.getElementById('profile-button');
        if (profileButton) {
            profileButton.addEventListener('click', () => {
                this.showProfileScreen();
            });
        }
    },

    // Показ экрана профиля
    showProfileScreen() {
        const currentScreen = this.getCurrentScreen();
        const profileScreen = document.getElementById('screen-profile');
        
        if (!currentScreen || !profileScreen) return;
        
        // Обновляем данные профиля
        this.updateProfileData();
        
        currentScreen.style.opacity = '0';
        setTimeout(() => {
            currentScreen.classList.add('hidden');
            profileScreen.classList.remove('hidden');
            setTimeout(() => {
                profileScreen.style.opacity = '1';
                
                // Настраиваем кнопки профиля
                this.setupProfileButtons();
            }, 50);
        }, 400);
        
        // Виброотклик
        if (window.tg && window.tg.HapticFeedback) {
            window.tg.HapticFeedback.impactOccurred('light');
        }
    },

    // Обновление данных профиля
    updateProfileData() {
        const user = window.userData || { first_name: 'Пользователь' };
        
        // Имя пользователя
        const profileName = document.getElementById('profile-name');
        if (profileName) {
            profileName.textContent = user.first_name || 'Пользователь';
        }
        
        // ID пользователя
        const profileId = document.getElementById('profile-id');
        if (profileId) {
            profileId.textContent = user.id || '000000';
        }
        
        // Аватар
        const avatar = document.getElementById('user-avatar');
        if (avatar) {
            const firstName = user.first_name || 'П';
            avatar.innerHTML = `<span style="font-size: 2rem;">${firstName.charAt(0)}</span>`;
        }
        
        // Баланс
        const balance = localStorage.getItem('ai_photo_balance') || '85';
        const profileBalance = document.getElementById('profile-balance');
        if (profileBalance) {
            profileBalance.textContent = balance;
        }
        
        // Статистика
        const generated = localStorage.getItem('ai_photos_generated') || '12';
        const styles = localStorage.getItem('ai_styles_used') || '4';
        
        const photosGenerated = document.getElementById('photos-generated');
        if (photosGenerated) {
            photosGenerated.textContent = generated;
        }
        
        const stylesUsed = document.getElementById('styles-used');
        if (stylesUsed) {
            stylesUsed.textContent = styles;
        }
        
        // Загружаем историю
        this.loadHistory();
    },

    // Загрузка истории генераций
    loadHistory() {
        const historyList = document.getElementById('history-list');
        const historyEmpty = document.getElementById('history-empty');
        
        if (!historyList || !historyEmpty) return;
        
        // Получаем историю из localStorage
        let history = JSON.parse(localStorage.getItem('ai_generation_history')) || [];
        
        if (history.length === 0) {
            historyList.classList.add('hidden');
            historyEmpty.classList.remove('hidden');
            return;
        }
        
        historyEmpty.classList.add('hidden');
        historyList.classList.remove('hidden');
        historyList.innerHTML = '';
        
        // Показываем последние 5 записей
        history.slice(-5).forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            
            const date = new Date(item.date);
            const formattedDate = date.toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'short'
            });
            
            historyItem.innerHTML = `
                <div class="history-icon">
                    <i class="fas fa-camera"></i>
                </div>
                <div class="history-details">
                    <h4>${item.style}</h4>
                    <div class="history-meta">
                        <span>${formattedDate}</span>
                        <span>${item.photos} фото</span>
                        <span class="history-credits">${item.credits} звезд</span>
                    </div>
                </div>
            `;
            
            historyList.appendChild(historyItem);
        });
    },

    // Настройка кнопок профиля
    setupProfileButtons() {
        // Кнопка "Назад" в профиле
        const backToMain = document.getElementById('back-to-main');
        if (backToMain) {
            backToMain.addEventListener('click', () => {
                this.goBackFromProfile();
            });
        }
        
        // Кнопка пополнения баланса
        const addBalanceBtn = document.getElementById('add-balance-btn');
        if (addBalanceBtn) {
            addBalanceBtn.addEventListener('click', () => {
                this.showPaymentModal();
            });
        }
        
        // Кнопка "Создать первую фотосессию"
        const startFromProfile = document.getElementById('start-from-profile');
        if (startFromProfile) {
            startFromProfile.addEventListener('click', () => {
                this.goBackFromProfile();
            });
        }
        
        // Переключатели в настройках
        document.querySelectorAll('.switch input').forEach(switchEl => {
            switchEl.addEventListener('change', (e) => {
                const setting = e.target.parentElement.parentElement.querySelector('span').textContent;
                const value = e.target.checked;
                console.log(`Настройка "${setting}" изменена на: ${value}`);
            });
        });
    },

    // Возврат из профиля
    goBackFromProfile() {
        const profileScreen = document.getElementById('screen-profile');
        const mainScreen = document.getElementById('screen-main');
        
        if (!profileScreen || !mainScreen) return;
        
        profileScreen.style.opacity = '0';
        setTimeout(() => {
            profileScreen.classList.add('hidden');
            mainScreen.classList.remove('hidden');
            setTimeout(() => {
                mainScreen.style.opacity = '1';
            }, 50);
        }, 400);
        
        // Виброотклик
        if (window.tg && window.tg.HapticFeedback) {
            window.tg.HapticFeedback.impactOccurred('light');
        }
    },

    // ============================================
    // ФУНКЦИИ ДЛЯ ЭКРАНА РЕЗУЛЬТАТОВ
    // ============================================

    // Показ экрана результатов
    showResultsScreen() {
        const generationScreen = document.getElementById('screen-generation');
        const resultsScreen = document.getElementById('screen-results');
        
        if (!generationScreen || !resultsScreen) return;
        
        // Обновляем информацию
        const resultsStyle = document.getElementById('results-style');
        if (resultsStyle) {
            resultsStyle.textContent = window.selectedStyle.name;
        }
        
        const creditsSpent = document.getElementById('credits-spent');
        if (creditsSpent) {
            creditsSpent.textContent = window.selectedStyle.credits;
        }
        
        // Устанавливаем текущую дату
        const now = new Date();
        const orderDate = document.getElementById('order-date');
        if (orderDate) {
            orderDate.textContent = now.toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        }
        
        generationScreen.style.opacity = '0';
        setTimeout(() => {
            generationScreen.classList.add('hidden');
            resultsScreen.classList.remove('hidden');
            setTimeout(() => {
                resultsScreen.style.opacity = '1';
                
                // Настраиваем экран результатов
                this.setupResultsScreen();
            }, 50);
        }, 400);
        
        // Сохраняем в историю
        this.saveToHistory();
        
        // Виброотклик успешной генерации
        if (window.tg && window.tg.HapticFeedback) {
            window.tg.HapticFeedback.notificationOccurred('success');
        }
    },

    // Настройка экрана результатов
    setupResultsScreen() {
        // Кнопка "Назад"
        const backToGeneration = document.getElementById('back-to-generation');
        if (backToGeneration) {
            backToGeneration.addEventListener('click', () => {
                this.goBackToGenerationFromResults();
            });
        }
        
        // Кнопка "Создать новую фотосессию"
        const newGenerationBtn = document.getElementById('new-generation-btn');
        if (newGenerationBtn) {
            newGenerationBtn.addEventListener('click', () => {
                this.goBackToCatalogFromResults();
            });
        }
        
        // Кнопки действий
        const downloadSingleBtn = document.getElementById('download-single-btn');
        if (downloadSingleBtn) {
            downloadSingleBtn.addEventListener('click', () => {
                this.showNotification('Скачивание будет доступно при подключении AI API');
            });
        }
        
        const downloadAllResultsBtn = document.getElementById('download-all-results-btn');
        if (downloadAllResultsBtn) {
            downloadAllResultsBtn.addEventListener('click', () => {
                this.showNotification('Скачивание ZIP архива будет доступно при подключении AI API');
            });
        }
        
        const shareBtn = document.getElementById('share-btn');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => {
                this.showNotification('Поделиться результатами можно после генерации реальных фото');
            });
        }
        
        // Дополнительные возможности
        const enhanceBtn = document.getElementById('enhance-btn');
        if (enhanceBtn) {
            enhanceBtn.addEventListener('click', () => {
                this.showPaymentForFeature('Улучшение качества', 3);
            });
        }
        
        const variationsBtn = document.getElementById('variations-btn');
        if (variationsBtn) {
            variationsBtn.addEventListener('click', () => {
                this.showPaymentForFeature('Создание вариаций', 5);
            });
        }
        
        const differentStyleBtn = document.getElementById('different-style-btn');
        if (differentStyleBtn) {
            differentStyleBtn.addEventListener('click', () => {
                this.showPaymentForFeature('Смена стиля', 7);
            });
        }
        
        const removeBgBtn = document.getElementById('remove-bg-btn');
        if (removeBgBtn) {
            removeBgBtn.addEventListener('click', () => {
                this.showPaymentForFeature('Удаление фона', 2);
            });
        }
        
        // Загружаем тестовые изображения
        this.loadTestResults();
    },

    // Загрузка тестовых результатов
    loadTestResults() {
        const galleryGrid = document.getElementById('results-gallery');
        if (!galleryGrid) return;
        
        // Очищаем галерею
        galleryGrid.innerHTML = '';
        
        // Тестовые URL изображений
        const testImages = [
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=533&fit=crop',
            'https://images.unsplash.com/photo-1494790108755-2616b786d4d9?w=400&h=533&fit=crop',
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=533&fit=crop',
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=533&fit=crop'
        ];
        
        // Создаем карточки с тестовыми изображениями
        testImages.forEach((imgUrl, index) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.innerHTML = `
                <img src="${imgUrl}" alt="AI фото ${index + 1}" loading="lazy">
                <div class="select-overlay">
                    <i class="fas fa-check"></i>
                </div>
            `;
            
            // Добавляем обработчик выбора
            galleryItem.addEventListener('click', () => {
                galleryItem.classList.toggle('selected');
                
                // Виброотклик
                if (window.tg && window.tg.HapticFeedback) {
                    window.tg.HapticFeedback.impactOccurred('light');
                }
            });
            
            galleryGrid.appendChild(galleryItem);
        });
    },

    // Возврат из результатов на генерацию
    goBackToGenerationFromResults() {
        const resultsScreen = document.getElementById('screen-results');
        const generationScreen = document.getElementById('screen-generation');
        
        if (!resultsScreen || !generationScreen) return;
        
        resultsScreen.style.opacity = '0';
        setTimeout(() => {
            resultsScreen.classList.add('hidden');
            generationScreen.classList.remove('hidden');
            setTimeout(() => {
                generationScreen.style.opacity = '1';
            }, 50);
        }, 400);
    },

    // Возврат из результатов в каталог
    goBackToCatalogFromResults() {
        const resultsScreen = document.getElementById('screen-results');
        const mainScreen = document.getElementById('screen-main');
        
        if (!resultsScreen || !mainScreen) return;
        
        resultsScreen.style.opacity = '0';
        setTimeout(() => {
            resultsScreen.classList.add('hidden');
            mainScreen.classList.remove('hidden');
            setTimeout(() => {
                mainScreen.style.opacity = '1';
            }, 50);
        }, 400);
    },

    // Сохранение в историю
    saveToHistory() {
        let history = JSON.parse(localStorage.getItem('ai_generation_history')) || [];
        
        history.push({
            date: new Date().toISOString(),
            style: window.selectedStyle.name,
            photos: 4,
            credits: window.selectedStyle.credits
        });
        
        // Сохраняем только последние 20 записей
        if (history.length > 20) {
            history = history.slice(-20);
        }
        
        localStorage.setItem('ai_generation_history', JSON.stringify(history));
        
        // Обновляем счетчик сгенерированных фото
        let generated = parseInt(localStorage.getItem('ai_photos_generated') || '0');
        generated += 4;
        localStorage.setItem('ai_photos_generated', generated.toString());
    },

    // ============================================
    // ФУНКЦИИ ДЛЯ ОПЛАТЫ (ЮKassa)
    // ============================================

    // Показ модального окна оплаты
    showPaymentModal() {
        const modal = document.getElementById('payment-modal');
        if (modal) {
            modal.classList.remove('hidden');
            
            // Настройка модального окна
            this.setupPaymentModal();
            
            // Виброотклик
            if (window.tg && window.tg.HapticFeedback) {
                window.tg.HapticFeedback.impactOccurred('medium');
            }
        }
    },

// Настройка модального окна оплаты
setupPaymentModal() {
    const modal = document.getElementById('payment-modal');
    if (!modal) return;
    
    const closeBtn = document.getElementById('modal-close');
    const payBtn = document.getElementById('pay-button');
    const paymentCards = document.querySelectorAll('.payment-card');
    
    // Закрытие модального окна
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            this.closePaymentModal();
        });
    }
    
    const overlay = modal.querySelector('.modal-overlay');
    if (overlay) {
        overlay.addEventListener('click', () => {
            this.closePaymentModal();
        });
    }
    
    // Выбор пакета звезд - НАЧАЛЬНЫЕ ЗНАЧЕНИЯ ИЗ ВЫБРАННОЙ КАРТОЧКИ
    let selectedAmount = 180; // Значение из выбранной по умолчанию карточки
    let selectedPrice = 180;  // Значение из выбранной по умолчанию карточки
    
    // Обновляем начальные значения в тексте
    const selectedPack = document.getElementById('selected-pack');
    const totalPrice = document.getElementById('total-price');
    
    if (selectedPack) {
        selectedPack.textContent = '180 звезд';
    }
    if (totalPrice) {
        totalPrice.textContent = '180 ₽';
    }
    
    paymentCards.forEach(card => {
        card.addEventListener('click', () => {
            // Убираем выделение со всех карточек
            paymentCards.forEach(c => c.classList.remove('selected'));
            
            // Выделяем выбранную карточку
            card.classList.add('selected');
            
            // Обновляем выбранные значения
            selectedAmount = parseInt(card.dataset.amount) || 180;
            selectedPrice = parseInt(card.dataset.price) || 180;
            
            // Обновляем информацию в модальном окне
            if (selectedPack) {
                selectedPack.textContent = `${selectedAmount} звезд`;
            }
            if (totalPrice) {
                totalPrice.textContent = `${selectedPrice} ₽`;
            }
            
            console.log(`Выбран тариф: ${selectedAmount} звезд за ${selectedPrice} ₽`);
        });
    });
    
    // Кнопка оплаты
    if (payBtn) {
        payBtn.addEventListener('click', () => {
            this.processPayment(selectedAmount, selectedPrice);
        });
    }
},

    // Закрытие модального окна оплаты
    closePaymentModal() {
        const modal = document.getElementById('payment-modal');
        if (modal) {
            modal.classList.add('hidden');
            
            // Виброотклик
            if (window.tg && window.tg.HapticFeedback) {
                window.tg.HapticFeedback.impactOccurred('light');
            }
        }
    },

 // Обработка оплаты (имитация)
processPayment(amount, price) {
    // Преобразуем в числа
    const amountNum = parseInt(amount) || 0;
    const priceNum = parseInt(price) || 0;
    
    console.log(`=== НАЧАЛО ОПЛАТЫ ===`);
    console.log(`Выбрано звезд: ${amountNum}`);
    console.log(`Стоимость: ${priceNum} ₽`);
    
    // Проверяем валидность
    if (amountNum <= 0) {
        this.showNotification('Ошибка: неверная сумма пополнения');
        return;
    }
    
    // Получаем текущий баланс ДО пополнения
    const currentBalance = parseInt(localStorage.getItem('ai_photo_balance') || '85');
    console.log(`Текущий баланс до пополнения: ${currentBalance} звезд`);
    
    // Рассчитываем ожидаемый баланс
    const expectedBalance = currentBalance + amountNum;
    console.log(`Ожидаемый баланс после пополнения: ${currentBalance} + ${amountNum} = ${expectedBalance} звезд`);
    
    // Имитация процесса оплаты
    this.showNotification(`Перенаправление на ЮKassa... ${priceNum} ₽`);
    
    // Через 2 секунды "завершаем" оплату
    setTimeout(() => {
        // ОБНОВЛЯЕМ БАЛАНС - ТОЛЬКО ОДИН РАЗ!
        const newBalance = this.updateBalance(amountNum);
        
        // Проверяем результат
        console.log(`=== РЕЗУЛЬТАТ ОПЛАТЫ ===`);
        console.log(`Полученный баланс: ${newBalance} звезд`);
        console.log(`Ожидалось: ${expectedBalance} звезд`);
        console.log(`Совпадение: ${newBalance === expectedBalance ? 'ДА' : 'НЕТ'}`);
        
        if (newBalance !== expectedBalance) {
            console.error(`ОШИБКА: Баланс не совпадает! Разница: ${Math.abs(newBalance - expectedBalance)} звезд`);
        }
        
        // Закрываем модальное окно
        this.closePaymentModal();
        
        // Показываем успешное уведомление
        this.showNotification(`✅ Баланс пополнен на ${amountNum} звезд!`);
        
        // Виброотклик успеха
        if (window.tg && window.tg.HapticFeedback) {
            window.tg.HapticFeedback.notificationOccurred('success');
        }
    }, 2000);
},

    // Показ оплаты за дополнительную функцию
    showPaymentForFeature(featureName, credits) {
        const currentBalance = parseInt(localStorage.getItem('ai_photo_balance') || '85');
        const creditsNum = parseInt(credits) || 0;
        
        if (currentBalance < creditsNum) {
            this.showNotification(`Недостаточно звезд. Нужно ${creditsNum}, доступно ${currentBalance}`);
            this.showPaymentModal();
            return;
        }
        
        // Подтверждение покупки
        if (confirm(`Использовать ${creditsNum} звезд для "${featureName}"?`)) {
            // Списание звезд
            this.updateBalance(-creditsNum);
            
            // Показываем уведомление
            this.showNotification(`✅ ${featureName} активировано!`);
            
            // Виброотклик
            if (window.tg && window.tg.HapticFeedback) {
                window.tg.HapticFeedback.notificationOccurred('success');
            }
        }
    },

    // Получение текущего экрана
    getCurrentScreen() {
        const screens = [
            'screen-welcome',
            'screen-main', 
            'screen-upload',
            'screen-generation',
            'screen-results',
            'screen-profile'
        ];
        
        for (const screenId of screens) {
            const screen = document.getElementById(screenId);
            if (screen && !screen.classList.contains('hidden')) {
                return screen;
            }
        }
        
        return document.getElementById('screen-main');
    },

    // Функция для перехода на главный экран
    showMainScreen() {
        const welcomeScreen = document.getElementById('screen-welcome');
        const mainScreen = document.getElementById('screen-main');

        if (!welcomeScreen || !mainScreen) return;

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

// Тестовая функция для проверки математики тарифов
function testTariffs() {
    console.log('=== ТЕСТИРОВАНИЕ ТАРИФОВ ===');
    
    const tariffs = [
        { name: 'Базовый', stars: 180, price: 180, bonus: 0 },
        { name: 'Средний', stars: 330, price: 299, bonus: 15 },
        { name: 'Премиум', stars: 1188, price: 990, bonus: 50 }
    ];
    
    tariffs.forEach(tariff => {
        const totalStars = tariff.stars + tariff.bonus;
        const pricePerStar = tariff.price / totalStars;
        const discount = tariff.name === 'Базовый' ? 0 : 
                        tariff.name === 'Средний' ? 10 : 20;
        
        console.log(`\n${tariff.name}:`);
        console.log(`  - Звезд: ${tariff.stars} + ${tariff.bonus} бонусных = ${totalStars}`);
        console.log(`  - Цена: ${tariff.price} ₽`);
        console.log(`  - Цена за звезду: ${pricePerStar.toFixed(2)} ₽`);
        console.log(`  - Скидка: ${discount}%`);
        console.log(`  - data-amount: ${totalStars}`);
        console.log(`  - data-price: ${tariff.price}`);
    });
}

// Можно вызвать в консоли: testTariffs()
window.testTariffs = testTariffs;

// Запускаем приложение
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});


