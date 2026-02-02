# Деплой Nano Banana в продакшен

## Что сделано для продакшена

- **config.js** — конфигурация (URL API, ссылка на бота, режим мок/реальный API).
- **api.js** — слой запросов к бэкенду: баланс, генерация, мои фото, история, отправка в чат.
- **app.js** — при старте запрашивает баланс и список фото через API (если не мок); генерация идёт через API или локальную имитацию.
- **index.html** — подключены `config.js` и `api.js` перед `app.js`, добавлен `theme-color` для Telegram.

## Режимы работы

1. **Только фронт (мок)** — `config.js`: `USE_MOCK: true` или `API_BASE_URL: ''`. Баланс и генерация работают локально, без бэкенда.
2. **С бэкендом** — задаёте `API_BASE_URL` и `USE_MOCK: false` в `config.js` (или через `window.__ENV__`). Приложение ходит на ваш API.

## Перед выкладкой на прод

### 1. Настроить config.js

Откройте `config.js` и задайте:

```javascript
API_BASE_URL: 'https://ваш-домен.com/api',  // без слэша в конце
BOT_LINK: 'https://t.me/ВашБот',
USE_MOCK: false,   // true = без бэкенда, false = запросы к API
API_TIMEOUT: 30000
```

Либо перед загрузкой страницы задайте переменные (например, из другого скрипта или шаблона):

```html
<script>
  window.__ENV__ = {
    API_BASE_URL: 'https://ваш-домен.com/api',
    BOT_LINK: 'https://t.me/ВашБот',
    USE_MOCK: false
  };
</script>
<script src="config.js"></script>
<script src="api.js"></script>
<script src="app.js"></script>
```

### 2. Ожидаемый API бэкенда

Бэкенд должен принимать запросы с заголовком **X-Telegram-Init-Data** (initData из Telegram Web App для проверки пользователя).

| Метод | Путь | Назначение |
|-------|------|------------|
| GET | `/api/balance` | Ответ: `{ "balance": number }` |
| POST | `/api/generate` | Тело: `{ "type": "photo"|"create-own"|"photosession", "data": { ... } }`. Ответ: `{ "imageUrl"?: string, "taskId"?: string }` |
| GET | `/api/task/:taskId` | (опционально) Статус задачи: `{ "status": "done"|"pending", "imageUrl"?: string }` |
| GET | `/api/my-photos` | Ответ: массив `[{ id, src, title, date, type }]` |
| GET | `/api/history` | (опционально) История генераций |
| POST | `/api/send-to-chat` | Тело: `{ "resultId", "type" }` — отправить результат в чат пользователю |

В `data` при генерации приходят, в зависимости от типа: `price`, `category`, `style`, `model`, `format`, `images` (base64), `exampleImage`, `faceImage`, `prompt`, `frames`, `title`.

### 3. Хостинг статики

- Залейте папку на любой хостинг (Vercel, Netlify, GitHub Pages, свой сервер, CDN).
- Файлы: `index.html`, `style.css`, `app.js`, `config.js`, `api.js`.
- HTTPS обязателен для Telegram Mini App.
- В настройках бота укажите URL вашего приложения (например `https://ваш-домен.com/`).

### 4. CORS

Если фронт и API на разных доменах, на бэкенде нужно разрешить запросы с домена приложения (Access-Control-Allow-Origin) и заголовок `X-Telegram-Init-Data`.

### 5. Проверка initData на бэкенде

На сервере проверяйте подпись Telegram для `initData`, чтобы убедиться, что запрос от реального пользователя бота. Документация: [Telegram WebApp — validating data](https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app).

---

После настройки `config.js` и (при необходимости) бэкенда приложение готово к продакшену.
