/**
 * Слой API для работы с бэкендом Telegram-бота.
 * При USE_MOCK или отсутствии API_BASE_URL методы возвращают мок-данные или ошибку.
 */
(function(global) {
    'use strict';

    var config = global.APP_CONFIG || {};
    var baseUrl = (config.API_BASE_URL || '').replace(/\/$/, '');
    var useMock = config.USE_MOCK !== false && !baseUrl;

    function getInitData() {
        if (global.Telegram && global.Telegram.WebApp && global.Telegram.WebApp.initData) {
            return global.Telegram.WebApp.initData;
        }
        return '';
    }

    function request(method, path, body) {
        if (!baseUrl) {
            return Promise.reject(new Error('API_BASE_URL не задан'));
        }
        var url = baseUrl + path;
        var timeoutMs = config.API_TIMEOUT || 30000;
        var controller = new AbortController();
        var timeoutId = setTimeout(function() { controller.abort(); }, timeoutMs);
        var options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'X-Telegram-Init-Data': getInitData()
            },
            signal: controller.signal
        };
        if (body && (method === 'POST' || method === 'GET')) {
            if (method === 'POST') {
                options.body = JSON.stringify(body);
            } else {
                var qs = Object.keys(body).map(function(k) { return encodeURIComponent(k) + '=' + encodeURIComponent(body[k]); }).join('&');
                if (qs) url += (url.indexOf('?') >= 0 ? '&' : '?') + qs;
            }
        }
        return fetch(url, options).then(function(res) {
            clearTimeout(timeoutId);
            if (!res.ok) {
                return res.json().then(function(data) { throw new Error(data.message || 'Ошибка ' + res.status); }, function() { throw new Error('Ошибка ' + res.status); });
            }
            return res.json();
        }, function(err) {
            clearTimeout(timeoutId);
            if (err.name === 'AbortError') throw new Error('Таймаут запроса');
            throw err;
        });
    }

    /**
     * Получить баланс пользователя (звёзды).
     * @returns {Promise<number>}
     */
    function getBalance() {
        if (useMock) return Promise.resolve(85);
        return request('GET', '/api/balance').then(function(data) { return data.balance != null ? data.balance : 85; });
    }

    /**
     * Запустить генерацию (фото / свой стиль / фотосессия).
     * @param {string} type - 'photo' | 'create-own' | 'photosession'
     * @param {object} data - параметры (price, images base64, style, format, model и т.д.)
     * @returns {Promise<{ imageUrl?: string, taskId?: string }>}
     */
    function startGeneration(type, data) {
        if (useMock) return Promise.reject(new Error('MOCK'));
        return request('POST', '/api/generate', { type: type, data: data });
    }

    /**
     * Проверить статус задачи генерации (если бэкенд отдаёт taskId).
     * @param {string} taskId
     * @returns {Promise<{ status: string, imageUrl?: string }>}
     */
    function getTaskStatus(taskId) {
        if (!taskId || useMock) return Promise.reject(new Error('MOCK'));
        return request('GET', '/api/task/' + encodeURIComponent(taskId));
    }

    /**
     * Список сгенерированных фото пользователя (для раздела «Своя фотосессия»).
     * @returns {Promise<Array<{ id, src, title, date, type }>>}
     */
    function getMyPhotos() {
        if (useMock) return Promise.reject(new Error('MOCK'));
        return request('GET', '/api/my-photos');
    }

    /**
     * История генераций (если хранится на сервере).
     * @returns {Promise<Array>}
     */
    function getHistory() {
        if (useMock) return Promise.reject(new Error('MOCK'));
        return request('GET', '/api/history');
    }

    /**
     * Скачать результат в чат бота (если бэкенд поддерживает).
     * @param {string} resultId или imageUrl
     * @param {string} type
     */
    function sendToChat(resultId, type) {
        if (useMock) return Promise.resolve();
        return request('POST', '/api/send-to-chat', { resultId: resultId, type: type });
    }

    global.API = {
        getBalance: getBalance,
        startGeneration: startGeneration,
        getTaskStatus: getTaskStatus,
        getMyPhotos: getMyPhotos,
        getHistory: getHistory,
        sendToChat: sendToChat,
        getInitData: getInitData,
        isMock: function() { return useMock; },
        getBotLink: function() { return config.BOT_LINK || 'https://t.me/NeuroFlashStudio_bot'; }
    };
})(typeof window !== 'undefined' ? window : this);
