# Nana Banana AI — FastAPI Telegram Mini App
# Сборка: docker build -t nana-banana-ai .
# Запуск: docker run -p 8000:8000 --env-file .env nana-banana-ai
# С томами (БД и загрузки): добавьте -v nana_data:/app/data -e DATABASE_PATH=/app/data/nana_banana.db -e UPLOADS_DIR=/app/data/uploads

FROM python:3.12-slim

WORKDIR /app

# Зависимости системы (минимально для работы)
RUN apt-get update && apt-get install -y --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Python-зависимости
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Код приложения
COPY main.py .
COPY database.py .
COPY ai_provider.py .
COPY payment_yookassa.py .
COPY templates/ ./templates/

# Полная версия UI в static/ (главная страница + ресурсы)
RUN mkdir -p static uploads
COPY index.html app.js style.css ./static/
RUN sed -i 's|href="style.css"|href="/static/style.css"|g' static/index.html \
    && sed -i 's|src="app.js"|src="/static/app.js"|g' static/index.html

# Порт приложения
EXPOSE 8000

# Переменные окружения задаются при запуске (--env-file .env)
# Нужны: TELEGRAM_BOT_TOKEN, BASE_URL, EXTERNAL_API_KEY, YOO_KASSA_* и т.д.
ENV PYTHONUNBUFFERED=1

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
