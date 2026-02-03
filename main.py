"""
Бэкенд FastAPI для Telegram Mini App.
- SQLite: пользователь и баланс (звёзды).
- POST /generate: фото пользователя + example_id + тип генерации (nano/pro).
- ЮKassa: пополнение баланса и webhook.
- ИИ: интеграция через ai_provider (API-ключи в .env).
Запуск: pip install -r requirements.txt && python main.py
"""
import hmac
import hashlib
import json
import os
import uuid
from pathlib import Path
from urllib.parse import parse_qsl, unquote

from fastapi import FastAPI, Request, Header, HTTPException, UploadFile, File, Form
from fastapi.responses import HTMLResponse, PlainTextResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from dotenv import load_dotenv

import database as db
from ai_provider import generate_image, generate_image_from_photo
from payment_yookassa import create_payment, get_payment_and_metadata

load_dotenv()

BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")
# Публичный URL приложения (нужен, чтобы Polza мог загрузить фото по filesUrl)
BASE_URL = os.getenv("BASE_URL", "http://localhost:8000").rstrip("/")
UPLOADS_DIR = Path(os.getenv("UPLOADS_DIR", "uploads"))
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)

app = FastAPI(title="Nana Banana AI — Telegram Mini App Backend")
templates = Jinja2Templates(directory="templates")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Цена генерации в звёздах: Nano — 7, Pro — 35
PRICE_NANO = 7
PRICE_PRO = 35


def validate_telegram_init_data(init_data: str) -> bool:
    """Валидация initData от Telegram Web App."""
    if not BOT_TOKEN:
        return True
    if not init_data:
        return False
    params = dict(parse_qsl(init_data, keep_blank_values=True))
    hash_val = params.pop("hash", None)
    if not hash_val:
        return False
    data_check_string = "\n".join(f"{k}={v}" for k, v in sorted(params.items()))
    secret_key = hmac.new(b"WebAppData", BOT_TOKEN.encode(), hashlib.sha256).digest()
    computed = hmac.new(secret_key, data_check_string.encode(), hashlib.sha256).hexdigest()
    return hmac.compare_digest(computed, hash_val)


def get_telegram_user_id(init_data: str) -> int | None:
    """Извлекает telegram user id из init_data (строка user в JSON)."""
    if not init_data:
        return None
    params = dict(parse_qsl(init_data, keep_blank_values=True))
    user_str = params.get("user")
    if not user_str:
        return None
    try:
        user = json.loads(unquote(user_str))
        return int(user.get("id"))
    except (json.JSONDecodeError, TypeError, ValueError):
        return None


def require_user(init_data: str | None) -> int:
    """Проверяет init_data и возвращает user_id; иначе 401."""
    if not init_data or not validate_telegram_init_data(init_data):
        raise HTTPException(status_code=401, detail="Invalid Telegram init data")
    user_id = get_telegram_user_id(init_data)
    if user_id is None:
        raise HTTPException(status_code=401, detail="User not found in init data")
    return user_id


# --- Модели запросов ---

class GenerateRequest(BaseModel):
    prompt: str
    aspect_ratio: str = "1:1"
    image_url: str | None = None


class PaymentCreateRequest(BaseModel):
    amount_stars: int
    return_url: str


# --- Жизненный цикл ---

@app.on_event("startup")
def startup():
    db.init_db()
    UPLOADS_DIR.mkdir(parents=True, exist_ok=True)


# --- Страница Mini App ---
STATIC_DIR = Path(__file__).parent / "static"
INDEX_STATIC = STATIC_DIR / "index.html"


@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    if INDEX_STATIC.exists():
        return FileResponse(INDEX_STATIC)
    return templates.TemplateResponse("index.html", {"request": request})


if STATIC_DIR.exists():
    app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

# Раздача загруженных файлов по URL (для Polza filesUrl)
app.mount("/uploads", StaticFiles(directory=str(UPLOADS_DIR)), name="uploads")


# --- Пользователь и баланс ---

@app.get("/api/me")
async def api_me(
    x_telegram_init_data: str | None = Header(default=None, alias="X-Telegram-Init-Data"),
):
    """Возвращает данные текущего пользователя и баланс."""
    user_id = require_user(x_telegram_init_data)
    user = db.get_or_create_user(user_id)
    return {"telegram_user_id": user["telegram_user_id"], "balance": user["balance"]}


@app.get("/api/balance")
async def api_balance(
    x_telegram_init_data: str | None = Header(default=None, alias="X-Telegram-Init-Data"),
):
    """Возвращает баланс в звёздах."""
    user_id = require_user(x_telegram_init_data)
    balance = db.get_balance(user_id)
    return {"balance": balance}


@app.get("/api/history")
async def api_history(
    x_telegram_init_data: str | None = Header(default=None, alias="X-Telegram-Init-Data"),
):
    """История генераций пользователя: ссылки на готовые фото из БД."""
    user_id = require_user(x_telegram_init_data)
    items = db.get_user_history(user_id)
    return {"history": items}


# --- Генерация (новый эндпоинт: фото + example_id + тип) ---

def _save_upload_and_get_url(photo_bytes: bytes, content_type: str) -> str:
    """Сохраняет байты в UPLOADS_DIR и возвращает публичный URL."""
    ext = "jpg"
    if content_type and "png" in content_type:
        ext = "png"
    elif content_type and "webp" in content_type:
        ext = "webp"
    name = f"{uuid.uuid4().hex}.{ext}"
    path = UPLOADS_DIR / name
    path.write_bytes(photo_bytes)
    return f"{BASE_URL}/uploads/{name}"


@app.post("/generate")
async def generate(
    photo: UploadFile = File(...),
    example_id: str = Form(...),
    generation_type: str = Form("nano"),
    aspect_ratio: str = Form("5:4"),
    x_telegram_init_data: str | None = Header(default=None, alias="X-Telegram-Init-Data"),
):
    """
    Принимает фото пользователя, ID примера и тип генерации (nano / pro).
    Сохраняет фото, отдаёт его URL в Polza (filesUrl), опрашивает статус по requestId.
    Списывает звёзды и возвращает URL сгенерированного изображения.
    """
    user_id = require_user(x_telegram_init_data)
    if generation_type not in ("nano", "pro"):
        raise HTTPException(status_code=400, detail="generation_type must be 'nano' or 'pro'")

    price = PRICE_PRO if generation_type == "pro" else PRICE_NANO
    balance = db.get_balance(user_id)
    if balance <= 0 or balance < price:
        raise HTTPException(status_code=402, detail="Пополните баланс")

    content_type = photo.content_type or ""
    if not content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    await photo.seek(0)
    photo_bytes = await photo.read()
    if len(photo_bytes) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Image size must be under 10 MB")

    if not db.deduct_balance(user_id, price):
        raise HTTPException(status_code=402, detail="Пополните баланс")

    try:
        photo_url = _save_upload_and_get_url(photo_bytes, content_type)
        image_url = await generate_image_from_photo(
            photo_url=photo_url,
            example_id=example_id,
            generation_type=generation_type,
            aspect_ratio=aspect_ratio,
        )
    except Exception as e:
        db.add_balance(user_id, price)
        raise HTTPException(status_code=500, detail=str(e))

    db.add_history(
        telegram_user_id=user_id,
        image_url=image_url,
        title=f"Генерация ({generation_type})",
        generation_type="photo",
        price_stars=price,
    )
    return {"image_url": image_url, "balance_after": db.get_balance(user_id)}


# --- Старый эндпоинт генерации по промпту (для совместимости) ---

@app.post("/api/generate")
async def api_generate(
    req: GenerateRequest,
    x_telegram_init_data: str | None = Header(default=None, alias="X-Telegram-Init-Data"),
):
    if not validate_telegram_init_data(x_telegram_init_data or ""):
        raise HTTPException(status_code=401, detail="Invalid Telegram init data")
    try:
        image_url = await generate_image(
            prompt=req.prompt,
            aspect_ratio=req.aspect_ratio,
            image_url=req.image_url,
            init_data=x_telegram_init_data,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    return {"imageUrl": image_url}


# --- ЮKassa: создание платежа ---

@app.post("/api/payment/create")
async def api_payment_create(
    body: PaymentCreateRequest,
    x_telegram_init_data: str | None = Header(default=None, alias="X-Telegram-Init-Data"),
):
    """Создать платёж ЮKassa для пополнения баланса. Возвращает URL для редиректа пользователя."""
    user_id = require_user(x_telegram_init_data)
    if body.amount_stars < 1:
        raise HTTPException(status_code=400, detail="amount_stars must be at least 1")
    try:
        result = create_payment(
            telegram_user_id=user_id,
            amount_stars=body.amount_stars,
            return_url=body.return_url,
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/create-payment")
async def create_payment_route(
    body: PaymentCreateRequest,
    x_telegram_init_data: str | None = Header(default=None, alias="X-Telegram-Init-Data"),
):
    """
    Создание ссылки на оплату звёзд через ЮKassa.
    Тело: { "amount_stars": number, "return_url": string }.
    Статус платежа сохраняется в БД через webhook ЮKassa (POST /api/payment/webhook).
    """
    return await api_payment_create(body, x_telegram_init_data)


# --- ЮKassa: webhook (уведомления о платеже) ---

@app.post("/api/payment/webhook", response_class=PlainTextResponse)
async def api_payment_webhook(request: Request):
    """
    Webhook-обработчик ЮKassa.
    При получении статуса payment.succeeded находит пользователя по user_id из metadata
    платежа и прибавляет купленные звёзды к его балансу в БД.
    В личном кабинете ЮKassa укажите URL этого эндпоинта и включите уведомления.
    """
    try:
        payload = await request.json()
    except Exception:
        return PlainTextResponse("Bad request", status_code=400)

    event = payload.get("event")
    if event != "payment.succeeded":
        return PlainTextResponse("OK", status_code=200)

    obj = payload.get("object", {})
    payment_id = obj.get("id")
    if not payment_id:
        return PlainTextResponse("OK", status_code=200)

    info = get_payment_and_metadata(payment_id)
    if not info or info["status"] != "succeeded":
        return PlainTextResponse("OK", status_code=200)

    user_id = info["telegram_user_id"]
    amount_stars = info["amount_stars"]
    if not user_id or amount_stars <= 0:
        return PlainTextResponse("OK", status_code=200)

    if db.get_payment_status(payment_id) == "succeeded":
        return PlainTextResponse("OK", status_code=200)

    db.save_payment(payment_id, user_id, amount_stars, "succeeded")
    db.add_balance(user_id, amount_stars)
    return PlainTextResponse("OK", status_code=200)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
