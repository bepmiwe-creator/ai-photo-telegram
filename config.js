/**
 * Конфигурация приложения для продакшена.
 * Перед деплоем замените значения на реальные URL вашего бэкенда и бота.
 */
(function(global) {
    'use strict';

    var APP_CONFIG = {
        /** Базовый URL API бэкенда 'https://bepmiwe-creator.github.io/ai-photo-telegram/' */
        API_BASE_URL: 'http://127.0.0.1:3000',

        /** Ссылка на бота для пополнения баланса и поддержки */
        BOT_LINK: 'https://t.me/NeuroFlashStudio_bot',

        /** true = работать без бэкенда (мок-данные), false = вызывать API */
        USE_MOCK: false,

        /** Таймаут запросов к API (мс) */
        API_TIMEOUT: 30000,

        /** Версия приложения */
        VERSION: '5.0'
    };

    // При деплое можно переопределить через window.__ENV__ (например, из внешнего скрипта)
    if (global.__ENV__) {
        Object.keys(global.__ENV__).forEach(function(key) {
            if (global.__ENV__[key] !== undefined) {
                APP_CONFIG[key] = global.__ENV__[key];
            }
        });
    }

    global.APP_CONFIG = APP_CONFIG;
})(typeof window !== 'undefined' ? window : this);
