# Backend Nano Banana

Сервер для Telegram Mini App: проверка Telegram initData и генерация изображений через Replicate (Nano Banana / Nano Banana Pro).

Доступны два варианта: **Node.js** (`server.js`) и **Python** (`app.py`). Достаточно использовать один из них.

## Требования

- **Node.js 18+** (для варианта на Node.js) **или Python 3.8+** (для варианта на Python)
- Аккаунт [Replicate](https://replicate.com) и API-токен
- Токен Telegram-бота (для проверки initData)

## Настройка .env

Скопируйте пример и отредактируйте:

```bash
cd backend
copy .env.example .env
```

(В PowerShell: `Copy-Item .env.example .env`)

Переменные в `.env`:

- **TELEGRAM_BOT_TOKEN** — токен бота из [@BotFather](https://t.me/BotFather). Если не задан, проверка initData отключена (удобно для локальной разработки).
- **REPLICATE_API_TOKEN** — токен с [replicate.com/account/api-tokens](https://replicate.com/account/api-tokens).
- **REPLICATE_MODEL_NANO** — модель для уровня «Nano» (по умолчанию `black-forest-labs/flux-schnell` — быстрая).
- **REPLICATE_MODEL_PRO** — модель для уровня «Pro» (по умолчанию `black-forest-labs/flux-dev` — выше качество).
- **PORT** — порт сервера (по умолчанию 3000).

---

## Вариант 1: запуск на Python (рекомендуется, если Node.js не установлен)

### Установка зависимостей

```bash
cd backend
pip install -r requirements.txt
```

(Если у вас несколько версий Python, используйте `pip3` и `python3`.)

### Запуск

```bash
python app.py
```

Сервер будет доступен по адресу `http://localhost:3000` (или выбранному порту в `.env`).

---

## Вариант 2: запуск на Node.js

### Установка зависимостей

```bash
cd backend
npm install
```

### Запуск

```bash
npm start
# или с автоперезагрузкой:
npm run dev
```

Сервер будет доступен по адресу `http://localhost:3000` (или выбранному порту).

## API

- **GET /api/balance** — возвращает баланс пользователя. Заголовок `X-Telegram-Init-Data` обязателен при заданном `TELEGRAM_BOT_TOKEN`. Сейчас отдаётся заглушка `{ "balance": 85 }`; для продакшена нужно подключать БД или Telegram Stars.

- **POST /api/generate** — запуск генерации изображения.
  - Заголовок: `X-Telegram-Init-Data` (initData из Telegram Web App).
  - Тело: `{ "type": "photo"|"create-own"|"photosession", "data": { "model": "nano"|"pro", "format": "1:1"|"4:5"|…, "prompt": "…", "images": ["data:image/…"] (опционально) } }`.
  - Ответ: `{ "imageUrl": "https://…", "taskId": "…" }` или ошибка.

- **GET /api/task/:id** — статус задачи Replicate: `{ "status": "succeeded"|"starting"|…, "imageUrl": "…" }` (imageUrl только при status === 'succeeded').

## Модели Replicate

- **Nano** — `black-forest-labs/flux-schnell`: быстрая генерация, подходит для уровня «Nano Banana».
- **Pro** — `black-forest-labs/flux-dev`: выше качество и поддержка image-to-image, уровень «Nano Banana Pro».

В `.env` можно подставить другой идентификатор модели или версию в формате `owner/name` или `owner/name:version_id` (см. [Replicate HTTP API](https://replicate.com/docs/reference/http)).

## Деплой

1. Установите переменные окружения на хостинге (Railway, Render, Fly.io, VPS и т.п.).
2. Убедитесь, что фронт в `config.js` указывает на URL этого бэкенда (`API_BASE_URL`).
3. Включите CORS при необходимости; сервер уже отдаёт `Access-Control-Allow-Origin` для запросов с фронта.

Подробнее про деплой фронта и ожидаемый контракт API — в корневом [DEPLOY.md](../DEPLOY.md).
