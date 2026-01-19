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
        
        this.showNotification(`Выбран стиль: <strong>${style.name}</strong>. Теперь загрузите ваше фото.`);
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
