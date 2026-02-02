"""
Backend Nano Banana — генерация изображений (Nano / Pro) через Replicate.
Запуск: pip install -r requirements.txt && python app.py
"""
import hmac
import hashlib
import os
import urllib.parse
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, origins=True)
app.config['MAX_CONTENT_LENGTH'] = 20 * 1024 * 1024  # 20 MB

BOT_TOKEN = os.environ.get('TELEGRAM_BOT_TOKEN', '')
REPLICATE_TOKEN = os.environ.get('REPLICATE_API_TOKEN', '')
MODEL_NANO = os.environ.get('REPLICATE_MODEL_NANO', 'black-forest-labs/flux-schnell')
MODEL_PRO = os.environ.get('REPLICATE_MODEL_PRO', 'black-forest-labs/flux-dev')
PORT = int(os.environ.get('PORT', 3000))

FORMAT_TO_ASPECT = {
    '1:1': '1:1',
    '4:5': '4:5',
    '16:9': '16:9',
    '9:16': '9:16',
    '3:4': '3:4',
    '2:3': '2:3',
    'auto': '1:1',
}


def validate_telegram_init_data(init_data: str) -> bool:
    if not BOT_TOKEN or not init_data:
        return False
    params = urllib.parse.parse_qsl(init_data, keep_blank_values=True)
    params_dict = dict(params)
    hash_val = params_dict.pop('hash', None)
    if not hash_val:
        return False
    data_check_string = '\n'.join(f'{k}={v}' for k, v in sorted(params_dict.items()))
    secret_key = hmac.new(
        b'WebAppData', BOT_TOKEN.encode(), hashlib.sha256
    ).digest()
    computed = hmac.new(
        secret_key, data_check_string.encode(), hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(computed, hash_val)


def run_replicate(version_or_model: str, input_data: dict, wait_seconds: int = 60) -> dict:
    url = 'https://api.replicate.com/v1/predictions'
    wait = max(1, min(wait_seconds, 60))
    body = {'version': version_or_model, 'input': input_data}
    resp = requests.post(
        url,
        json=body,
        headers={
            'Authorization': f'Bearer {REPLICATE_TOKEN}',
            'Content-Type': 'application/json',
            'Prefer': f'wait={wait}',
        },
        timeout=120,
    )
    if not resp.ok:
        raise RuntimeError(resp.text or f'Replicate {resp.status_code}')
    data = resp.json()
    if data.get('status') == 'failed' and data.get('error'):
        raise RuntimeError(data['error'])
    output = data.get('output')
    if isinstance(output, list) and output:
        return {'imageUrl': output[0], 'taskId': data.get('id')}
    if isinstance(output, str):
        return {'imageUrl': output, 'taskId': data.get('id')}
    raise RuntimeError('Нет результата от модели')


@app.route('/api/balance', methods=['GET'])
def api_balance():
    init_data = request.headers.get('X-Telegram-Init-Data', '')
    if BOT_TOKEN and not validate_telegram_init_data(init_data):
        return jsonify({'error': 'Invalid init data'}), 401
    return jsonify({'balance': 85})


@app.route('/api/generate', methods=['POST'])
def api_generate():
    init_data = request.headers.get('X-Telegram-Init-Data', '')
    if BOT_TOKEN and not validate_telegram_init_data(init_data):
        return jsonify({'message': 'Неверные данные Telegram'}), 401
    if not REPLICATE_TOKEN:
        return jsonify({'message': 'Сервис генерации не настроен'}), 503

    body = request.get_json() or {}
    payload = body.get('data') or {}
    model_tier = 'pro' if payload.get('model') == 'pro' else 'nano'
    model_name = MODEL_PRO if model_tier == 'pro' else MODEL_NANO
    format_key = payload.get('format') or '1:1'
    aspect_ratio = FORMAT_TO_ASPECT.get(format_key, '1:1')

    prompt = payload.get('prompt') or payload.get('style') or 'красивое фото, высокое качество'

    input_data = {
        'prompt': prompt,
        'aspect_ratio': aspect_ratio,
        'num_outputs': 1,
    }
    images = payload.get('images')
    if images and isinstance(images, list) and isinstance(images[0], str):
        input_data['image'] = images[0]

    try:
        result = run_replicate(model_name, input_data, 60)
        return jsonify({'imageUrl': result['imageUrl'], 'taskId': result.get('taskId')})
    except Exception as e:
        app.logger.exception('Replicate error')
        return jsonify({'message': str(e) or 'Ошибка генерации'}), 500


@app.route('/api/task/<task_id>', methods=['GET'])
def api_task(task_id):
    if not REPLICATE_TOKEN:
        return jsonify({'message': 'Сервис не настроен'}), 503
    try:
        r = requests.get(
            f'https://api.replicate.com/v1/predictions/{task_id}',
            headers={'Authorization': f'Bearer {REPLICATE_TOKEN}'},
            timeout=30,
        )
        data = r.json()
        output = data.get('output')
        image_url = output[0] if isinstance(output, list) and output else (output if isinstance(output, str) else None)
        return jsonify({
            'status': data.get('status'),
            'imageUrl': image_url if data.get('status') == 'succeeded' else None,
        })
    except Exception as e:
        return jsonify({'message': str(e)}), 500


if __name__ == '__main__':
    print(f'Nano Banana backend (Python): http://localhost:{PORT}')
    if not REPLICATE_TOKEN:
        print('REPLICATE_API_TOKEN не задан — генерация недоступна')
    if not BOT_TOKEN:
        print('TELEGRAM_BOT_TOKEN не задан — проверка initData отключена')
    app.run(host='0.0.0.0', port=PORT, debug=False)
