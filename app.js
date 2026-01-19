// app.js
// Основной объект приложения
const App = {
    // Инициализация приложения
    async init() {
        console.log('AI Photo Studio: Инициализация...');

        // 1. Ждем, пока Telegram SDK полностью загрузится
        if (!window.Telegram || !window.Telegram.WebApp) {
            alert('Ошибка: Приложение должно быть запущено внутри Telegram!');
            return;
        }

        // 2. Инициализируем WebApp
        const tg = window.Telegram.WebApp;
        tg.expand(); // Раскрываем приложение на весь экран
        tg.enableClosingConfirmation(); // Спрашиваем при закрытии
        tg.ready(); // Сообщаем Telegram, что мы готовы

        console.log('Telegram WebApp SDK готов. Пользователь:', tg.initDataUnsafe?.user);

        // 3. Настраиваем цветовую схему из Telegram
        this.setTheme(tg);

        // 4. Показываем информацию о пользователе
        this.displayUserInfo(tg);

        // 5. Имитируем короткую загрузку (2 секунды), потом показываем главный экран
        setTimeout(() => {
            this.showMainScreen();
            // Добавляем легкую вибрацию (HapticFeedback) для обратной связи
            tg.HapticFeedback.impactOccurred('light');
        }, 2000);
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
            // Форматируем имя
            let userName = user.first_name || '';
            if (user.last_name) userName += ' ' + user.last_name;
            if (!userName) userName = 'Пользователь';

            // Показываем имя и id
            userInfoEl.innerHTML = `
                <i class="fas fa-user-circle"></i> ID: <strong>${user.id}</strong> | Имя: <strong>${userName}</strong>
            `;
            // Сохраняем данные пользователя в глобальной переменной для будущего использования
            window.userData = user;
            window.tg = tg; // Сохраняем объект Telegram для других функций
        } else {
            userInfoEl.textContent = 'Гость (войдите через Telegram)';
        }
    },

    // Функция для перехода на главный экран
    showMainScreen() {
        const welcomeScreen = document.getElementById('screen-welcome');
        const mainScreen = document.getElementById('screen-main');

        // Плавно скрываем экран приветствия
        welcomeScreen.style.opacity = '0';
        setTimeout(() => {
            welcomeScreen.classList.add('hidden');
            // Показываем главный экран
            mainScreen.classList.remove('hidden');
            setTimeout(() => {
                mainScreen.style.opacity = '1';
            }, 50);
        }, 400); // Ждем окончания анимации opacity
    }
};

// Запускаем приложение, когда страница полностью загружена
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});