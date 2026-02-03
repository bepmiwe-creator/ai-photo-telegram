"""
SQLite: пользователи и баланс (звёзды) для Telegram Mini App.
"""
import sqlite3
import os
from contextlib import contextmanager
from pathlib import Path

# Файл БД рядом с проектом
DB_PATH = os.getenv("DATABASE_PATH", str(Path(__file__).parent / "nana_banana.db"))


@contextmanager
def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def init_db():
    """Создаёт таблицы при первом запуске."""
    with get_connection() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS users (
                telegram_user_id INTEGER PRIMARY KEY,
                balance INTEGER NOT NULL DEFAULT 0,
                created_at TEXT DEFAULT (datetime('now')),
                updated_at TEXT DEFAULT (datetime('now'))
            )
        """)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS payments (
                id TEXT PRIMARY KEY,
                telegram_user_id INTEGER NOT NULL,
                amount_stars INTEGER NOT NULL,
                status TEXT NOT NULL,
                created_at TEXT DEFAULT (datetime('now')),
                FOREIGN KEY (telegram_user_id) REFERENCES users(telegram_user_id)
            )
        """)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                telegram_user_id INTEGER NOT NULL,
                image_url TEXT NOT NULL,
                title TEXT,
                generation_type TEXT,
                price_stars INTEGER,
                created_at TEXT DEFAULT (datetime('now')),
                FOREIGN KEY (telegram_user_id) REFERENCES users(telegram_user_id)
            )
        """)


def get_or_create_user(telegram_user_id: int) -> dict:
    """Возвращает пользователя по Telegram ID; создаёт с балансом 0, если нет."""
    with get_connection() as conn:
        row = conn.execute(
            "SELECT telegram_user_id, balance FROM users WHERE telegram_user_id = ?",
            (telegram_user_id,),
        ).fetchone()
        if row:
            return {"telegram_user_id": row["telegram_user_id"], "balance": row["balance"]}
        conn.execute(
            "INSERT INTO users (telegram_user_id, balance) VALUES (?, 0)",
            (telegram_user_id,),
        )
        return {"telegram_user_id": telegram_user_id, "balance": 0}


def get_balance(telegram_user_id: int) -> int:
    """Баланс пользователя в звёздах."""
    user = get_or_create_user(telegram_user_id)
    return user["balance"]


def add_balance(telegram_user_id: int, amount: int) -> int:
    """Пополнить баланс. Возвращает новый баланс."""
    get_or_create_user(telegram_user_id)
    with get_connection() as conn:
        conn.execute(
            "UPDATE users SET balance = balance + ?, updated_at = datetime('now') WHERE telegram_user_id = ?",
            (amount, telegram_user_id),
        )
        row = conn.execute("SELECT balance FROM users WHERE telegram_user_id = ?", (telegram_user_id,)).fetchone()
        return row["balance"] if row else 0


def deduct_balance(telegram_user_id: int, amount: int) -> bool:
    """Списать звёзды. Возвращает True при успехе, False если недостаточно средств."""
    with get_connection() as conn:
        cur = conn.execute(
            "UPDATE users SET balance = balance - ?, updated_at = datetime('now') WHERE telegram_user_id = ? AND balance >= ?",
            (amount, telegram_user_id, amount),
        )
        return cur.rowcount > 0


def save_payment(payment_id: str, telegram_user_id: int, amount_stars: int, status: str):
    """Сохранить или обновить платёж (для webhook ЮKassa)."""
    with get_connection() as conn:
        conn.execute(
            """
            INSERT INTO payments (id, telegram_user_id, amount_stars, status)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET status = excluded.status
            """,
            (payment_id, telegram_user_id, amount_stars, status),
        )


def get_payment_status(payment_id: str) -> str | None:
    """Статус платежа (succeeded, pending, canceled и т.д.)."""
    with get_connection() as conn:
        row = conn.execute("SELECT status FROM payments WHERE id = ?", (payment_id,)).fetchone()
        return row["status"] if row else None


def add_history(telegram_user_id: int, image_url: str, title: str = "", generation_type: str = "photo", price_stars: int = 0) -> int:
    """Сохранить результат генерации в историю. Возвращает id записи."""
    with get_connection() as conn:
        cur = conn.execute(
            """INSERT INTO history (telegram_user_id, image_url, title, generation_type, price_stars)
               VALUES (?, ?, ?, ?, ?)""",
            (telegram_user_id, image_url, title or "Фото", generation_type, price_stars),
        )
        return cur.lastrowid


def get_user_history(telegram_user_id: int, limit: int = 100):
    """Список записей истории пользователя (последние сверху)."""
    with get_connection() as conn:
        rows = conn.execute(
            """SELECT id, image_url, title, generation_type, price_stars, created_at
               FROM history WHERE telegram_user_id = ? ORDER BY created_at DESC LIMIT ?""",
            (telegram_user_id, limit),
        ).fetchall()
        return [
            {
                "id": r["id"],
                "image_url": r["image_url"],
                "title": r["title"] or "Фото",
                "generation_type": r["generation_type"] or "photo",
                "price_stars": r["price_stars"] or 0,
                "created_at": r["created_at"],
            }
            for r in rows
        ]
