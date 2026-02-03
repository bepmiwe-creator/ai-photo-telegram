"""
Генерация изображений через Polza API.
POST /images/generations → requestId → опрос статуса → ссылка на результат.
NANO BANANA: model "nano-banana", PRO: model "gemini-3-pro-image-preview".
"""
import os
import time
from typing import Literal

import httpx
from dotenv import load_dotenv

load_dotenv()

POLZA_BASE_URL = os.getenv("POLZA_BASE_URL", "https://api.polza.ai/api/v1").rstrip("/")
EXTERNAL_API_KEY = os.getenv("EXTERNAL_API_KEY", "") or os.getenv("API_KEY", "")

# Модели Polza (из доки)
MODEL_NANO = "nano-banana"
MODEL_PRO = "gemini-3-pro-image-preview"

GenerationType = Literal["nano", "pro"]

# Промпты: Face Swap (русский + технические параметры на английском для точности)
PROMPT_NANO = (
    "Действуй как профессиональная AI фотостудия. Твоя задача - выполнить высококачественный Face Swap. "
    "Возьми черты лица (глаза, нос, губы, форма лица) из 1-5 загруженных фотографий пользователя и точно интегрируй их "
    "в голову человека на шаблонном изображении. Сохраняй освещение, прическу и фон шаблонного изображения. "
    "Убедись, что тон кожи идеально совпадает."
)
PROMPT_PRO = (
    "Действуй как коммерческий фотограф высокого класса. Выполни профессиональную фотореалистичную замену лица в формате 4K. "
    "Проанализируй уникальные черты личности человека на фотографиях пользователя. "
    "Перенеси эту идентичность на шаблонное изображение с предельной точностью. "
    "Сохрани оригинальный художественный стиль, разрешение 4K и кинематографическое освещение. "
    "Результат должен быть неотличим от настоящей фотографии. "
    "hyper-realistic, 8k, high skin detail, masterwork."
)


def _get_model(generation_type: GenerationType) -> str:
    return MODEL_PRO if generation_type == "pro" else MODEL_NANO


async def _get_generation_status(request_id: str) -> dict:
    """Запрос статуса генерации по requestId."""
    url = f"{POLZA_BASE_URL}/images/generations/{request_id}"
    headers = {"Authorization": f"Bearer {EXTERNAL_API_KEY}"}
    async with httpx.AsyncClient(timeout=30.0) as client:
        resp = await client.get(url, headers=headers)
        resp.raise_for_status()
        return resp.json()


async def _wait_for_result(request_id: str, poll_interval: float = 2.0, max_wait: float = 120.0) -> str:
    """
    Опрашивает эндпоинт статуса по requestId до готовности или таймаута.
    Возвращает URL изображения или поднимает исключение.
    """
    deadline = time.monotonic() + max_wait
    while time.monotonic() < deadline:
        data = await _get_generation_status(request_id)
        status = (data.get("status") or data.get("state") or "").lower()
        if status in ("completed", "success", "done", "finished"):
            url = data.get("url") or data.get("image_url") or data.get("imageUrl") or data.get("output")
            if not url and isinstance(data.get("result"), dict):
                url = data["result"].get("url") or data["result"].get("image_url") or data["result"].get("imageUrl")
            if not url and isinstance(data.get("result"), list) and len(data["result"]) > 0:
                first = data["result"][0]
                url = first.get("url") or first.get("image_url") or first.get("imageUrl") if isinstance(first, dict) else first
            if isinstance(url, list) and len(url) > 0:
                url = url[0]
            if url and isinstance(url, str):
                return url
        if status in ("failed", "error", "cancelled"):
            msg = data.get("error_message") or data.get("message") or data.get("error") or "Generation failed"
            raise RuntimeError(msg)
        await asyncio.sleep(poll_interval)
    raise TimeoutError("Image generation timed out")


async def generate_image_from_photo(
    photo_url: str,
    example_id: str,
    generation_type: GenerationType,
    prompt: str | None = None,
    aspect_ratio: str = "5:4",
) -> str:
    """
    Генерация через Polza: filesUrl + prompt.
    photo_url — публичный URL фото пользователя (одно или первое из нескольких).
    После POST получаем requestId, опрашиваем статус и возвращаем URL результата.
    """
    if not EXTERNAL_API_KEY:
        raise ValueError("EXTERNAL_API_KEY or API_KEY required")

    model = _get_model(generation_type)
    files_url = [photo_url] if isinstance(photo_url, str) else list(photo_url)[:5]
    text_prompt = prompt or (PROMPT_PRO if generation_type == "pro" else PROMPT_NANO)

    body = {
        "model": model,
        "filesUrl": files_url,
        "prompt": text_prompt,
    }
    if generation_type == "nano":
        body["size"] = "auto"
    else:
        body["resolution"] = "2K"
        body["aspect_ratio"] = aspect_ratio

    url = f"{POLZA_BASE_URL}/images/generations"
    headers = {
        "Authorization": f"Bearer {EXTERNAL_API_KEY}",
        "Content-Type": "application/json",
    }

    async with httpx.AsyncClient(timeout=60.0) as client:
        resp = await client.post(url, json=body, headers=headers)
        resp.raise_for_status()
        data = resp.json()

    request_id = data.get("requestId") or data.get("request_id") or data.get("id")
    if not request_id:
        raise RuntimeError("No requestId in response")

    return await _wait_for_result(request_id)


async def generate_image(
    prompt: str,
    aspect_ratio: str = "1:1",
    image_url: str | None = None,
    init_data: str | None = None,
) -> str:
    """
    Старый формат: текстовый промпт. Если передан image_url — используем его в filesUrl.
    """
    if not EXTERNAL_API_KEY:
        return "https://via.placeholder.com/512x512/E0F2FE/1E3A8A?text=API+key+required"

    files_url = [image_url] if image_url else []
    body = {
        "model": MODEL_NANO,
        "prompt": prompt,
        "size": "auto",
    }
    if files_url:
        body["filesUrl"] = files_url

    url = f"{POLZA_BASE_URL}/images/generations"
    headers = {"Authorization": f"Bearer {EXTERNAL_API_KEY}", "Content-Type": "application/json"}

    async with httpx.AsyncClient(timeout=60.0) as client:
        resp = await client.post(url, json=body, headers=headers)
        resp.raise_for_status()
        data = resp.json()

    request_id = data.get("requestId") or data.get("request_id") or data.get("id")
    if not request_id:
        raise RuntimeError("No requestId in response")
    return await _wait_for_result(request_id)
