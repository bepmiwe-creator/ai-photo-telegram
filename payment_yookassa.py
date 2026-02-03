"""
Интеграция ЮKassa через официальную библиотеку yookassa (yookassa-python-sdk).
Создание платежа (metadata: telegram_user_id, amount_stars). После успешной оплаты
ЮKassa отправляет уведомление на webhook в main.py — там вызывается обновление
баланса (db.add_balance) по user_id из metadata.
"""
import os
import uuid
from typing import Optional

from dotenv import load_dotenv

load_dotenv()

SHOP_ID = os.getenv("YOO_KASSA_SHOP_ID", "")
SECRET_KEY = os.getenv("YOO_KASSA_SECRET_KEY", "")

# Курс: сколько рублей за 1 звезду (можно вынести в .env)
STARS_PER_RUB = 1.0  # 1 звезда = 1 рубль


def _client():
    if not SHOP_ID or not SECRET_KEY:
        raise ValueError("YOO_KASSA_SHOP_ID и YOO_KASSA_SECRET_KEY должны быть заданы в .env")
    from yookassa import Configuration
    Configuration.configure(SHOP_ID, SECRET_KEY)
    return None


def create_payment(
    telegram_user_id: int,
    amount_stars: int,
    return_url: str,
    idempotence_key: Optional[str] = None,
) -> dict:
    """
    Создать платёж в ЮKassa.
    amount_stars — сумма пополнения в звёздах.
    Возвращает: {"payment_id": "...", "confirmation_url": "...", "amount": ..., "status": "pending"}
    """
    _client()
    from yookassa import Payment

    amount_rub = max(1, int(amount_stars * STARS_PER_RUB))
    idempotence = idempotence_key or str(uuid.uuid4())

    payment = Payment.create(
        {
            "amount": {"value": f"{amount_rub:.2f}", "currency": "RUB"},
            "confirmation": {"type": "redirect", "return_url": return_url},
            "capture": True,
            "description": f"Пополнение баланса: {amount_stars} звёзд",
            "metadata": {"telegram_user_id": str(telegram_user_id), "amount_stars": str(amount_stars)},
        },
        idempotence_key=idempotence,
    )

    conf = payment.confirmation
    confirmation_url = conf.redirect_url if conf else ""

    return {
        "payment_id": payment.id,
        "confirmation_url": confirmation_url,
        "amount_stars": amount_stars,
        "amount_rub": amount_rub,
        "status": payment.status,
    }


def get_payment_and_metadata(payment_id: str) -> Optional[dict]:
    """
    Получить платёж из ЮKassa (для webhook: проверка статуса и metadata).
    Возвращает {"status": "...", "telegram_user_id": int, "amount_stars": int} или None.
    """
    _client()
    from yookassa import Payment

    try:
        payment = Payment.find_one(payment_id)
    except Exception:
        return None

    meta = payment.metadata or {}
    try:
        telegram_user_id = int(meta.get("telegram_user_id", 0))
        amount_stars = int(meta.get("amount_stars", 0))
    except (TypeError, ValueError):
        return None

    return {
        "status": payment.status,
        "telegram_user_id": telegram_user_id,
        "amount_stars": amount_stars,
    }
