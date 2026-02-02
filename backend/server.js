/**
 * Backend Nano Banana — генерация изображений (Nano / Pro) через Replicate.
 * Запуск: npm install && npm start
 */
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import crypto from 'crypto';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: true }));
app.use(express.json({ limit: '20mb' }));

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const REPLICATE_TOKEN = process.env.REPLICATE_API_TOKEN || '';
const MODEL_NANO = process.env.REPLICATE_MODEL_NANO || 'black-forest-labs/flux-schnell';
const MODEL_PRO = process.env.REPLICATE_MODEL_PRO || 'black-forest-labs/flux-dev';

// Соотношение сторон для FLUX (Replicate принимает aspect_ratio)
const FORMAT_TO_ASPECT = {
  '1:1': '1:1',
  '4:5': '4:5',
  '16:9': '16:9',
  '9:16': '9:16',
  '3:4': '3:4',
  '2:3': '2:3',
  auto: '1:1'
};

function validateTelegramInitData(initData) {
  if (!BOT_TOKEN || !initData || typeof initData !== 'string') return false;
  const params = new URLSearchParams(initData);
  const hash = params.get('hash');
  params.delete('hash');
  const sorted = [...params.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  const dataCheckString = sorted.map(([k, v]) => `${k}=${v}`).join('\n');
  const secretKey = crypto.createHmac('sha256', 'WebAppData').update(BOT_TOKEN).digest();
  const computed = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');
  return computed === hash;
}

async function runReplicate(versionOrModel, input, waitSeconds = 60) {
  const url = 'https://api.replicate.com/v1/predictions';
  const wait = Math.min(Math.max(1, waitSeconds), 60); // Replicate: 1–60
  const body = { version: versionOrModel, input };
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${REPLICATE_TOKEN}`,
      'Content-Type': 'application/json',
      Prefer: `wait=${wait}`
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `Replicate ${res.status}`);
  }
  const data = await res.json();
  if (data.status === 'failed' && data.error) throw new Error(data.error);
  const output = data.output;
  if (Array.isArray(output) && output[0]) return { imageUrl: output[0], taskId: data.id };
  if (typeof output === 'string') return { imageUrl: output, taskId: data.id };
  throw new Error('Нет результата от модели');
}

// GET /api/balance — заглушка (реальный баланс из БД/Telegram)
app.get('/api/balance', (req, res) => {
  const initData = req.headers['x-telegram-init-data'] || '';
  if (BOT_TOKEN && !validateTelegramInitData(initData)) {
    return res.status(401).json({ error: 'Invalid init data' });
  }
  res.json({ balance: 85 });
});

// POST /api/generate — генерация изображения (Nano / Pro)
app.post('/api/generate', async (req, res) => {
  const initData = req.headers['x-telegram-init-data'] || '';
  if (BOT_TOKEN && !validateTelegramInitData(initData)) {
    return res.status(401).json({ message: 'Неверные данные Telegram' });
  }
  if (!REPLICATE_TOKEN) {
    return res.status(503).json({ message: 'Сервис генерации не настроен' });
  }

  const { type, data: payload } = req.body || {};
  const modelTier = (payload && payload.model === 'pro') ? 'pro' : 'nano';
  const modelName = modelTier === 'pro' ? MODEL_PRO : MODEL_NANO;
  const format = (payload && payload.format) || '1:1';
  const aspectRatio = FORMAT_TO_ASPECT[format] || '1:1';

  let prompt = (payload && payload.prompt) || '';
  if (!prompt && payload && payload.style) prompt = payload.style;
  if (!prompt) prompt = 'красивое фото, высокое качество';

  const input = {
    prompt,
    aspect_ratio: aspectRatio,
    num_outputs: 1
  };

  // Если модель принимает image (img2img) и есть референс — data URL или HTTP URL
  if (payload && (payload.images && payload.images[0]) && typeof payload.images[0] === 'string') {
    input.image = payload.images[0];
  }

  try {
    const result = await runReplicate(modelName, input, 60);
    res.json({ imageUrl: result.imageUrl, taskId: result.taskId });
  } catch (e) {
    console.error('Replicate error:', e.message);
    res.status(500).json({ message: e.message || 'Ошибка генерации' });
  }
});

// GET /api/task/:id — статус задачи (опционально)
app.get('/api/task/:id', async (req, res) => {
  if (!REPLICATE_TOKEN) return res.status(503).json({ message: 'Сервис не настроен' });
  try {
    const r = await fetch(`https://api.replicate.com/v1/predictions/${req.params.id}`, {
      headers: { Authorization: `Bearer ${REPLICATE_TOKEN}` }
    });
    const data = await r.json();
    const imageUrl = Array.isArray(data.output) ? data.output[0] : data.output;
    res.json({ status: data.status, imageUrl: data.status === 'succeeded' ? imageUrl : undefined });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`Nano Banana backend: http://localhost:${PORT}`);
  if (!REPLICATE_TOKEN) console.warn('REPLICATE_API_TOKEN не задан — генерация недоступна');
  if (!BOT_TOKEN) console.warn('TELEGRAM_BOT_TOKEN не задан — проверка initData отключена');
});
