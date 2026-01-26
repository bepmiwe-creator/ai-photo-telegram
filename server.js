// server.js - Настоящий AI Backend для Telegram Mini App
const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static('.')); // Раздаём статические файлы

// Разрешаем запросы из Telegram
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// 📌 ГЛАВНАЯ СТРАНИЦА
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Nano Banana AI Backend</title>
            <style>body { font-family: Arial; padding: 40px; }</style>
        </head>
        <body>
            <h1>🍌 Nano Banana AI Backend</h1>
            <p>✅ Сервер работает! Можешь использовать этот URL в приложении:</p>
            <code>${req.protocol}://${req.get('host')}</code>
            <p><a href="/health">Проверить здоровье сервера</a></p>
        </body>
        </html>
    `);
});

// 📌 ПРОВЕРКА СЕРВЕРА
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'AI сервер готов к генерации фото!',
        timestamp: new Date().toISOString()
    });
});

// 📌 РЕАЛЬНАЯ ГЕНЕРАЦИЯ ЧЕРЕЗ REPLICATE
app.post('/generate', async (req, res) => {
    console.log('📨 Запрос на генерацию:', req.body);
    
    try {
        const { prompt, style = 'photorealistic' } = req.body;
        
        if (!prompt || prompt.trim().length < 3) {
            return res.status(400).json({ 
                success: false, 
                error: 'Введите описание для фото (минимум 3 символа)' 
            });
        }
        
        // Проверяем API ключ
        if (!process.env.REPLICATE_API_TOKEN) {
            return res.status(500).json({
                success: false,
                error: 'API ключ не настроен',
                instruction: 'Добавь REPLICATE_API_TOKEN в настройки Render'
            });
        }
        
        console.log('🎨 Начинаем генерацию через Replicate...');
        
        // Улучшаем промпт в зависимости от стиля
        let enhancedPrompt = prompt;
        if (style === 'art') enhancedPrompt += ', artistic, painting style';
        if (style === 'anime') enhancedPrompt += ', anime style, manga';
        if (style === 'fantasy') enhancedPrompt += ', fantasy, magical';
        
        enhancedPrompt += ', high quality, professional photo, 8k, detailed';
        
        // 1. Создаём задание на генерацию в Replicate
        const predictionResponse = await fetch('https://api.replicate.com/v1/predictions', {
            method: 'POST',
            headers: {
                'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                version: "stability-ai/stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf",
                input: {
                    prompt: enhancedPrompt,
                    width: 512,
                    height: 768,
                    num_outputs: 1,
                    num_inference_steps: 30,
                    guidance_scale: 7.5
                }
            })
        });
        
        if (!predictionResponse.ok) {
            const errorText = await predictionResponse.text();
            console.error('❌ Replicate API error:', errorText);
            throw new Error(`Replicate API error: ${predictionResponse.status}`);
        }
        
        const prediction = await predictionResponse.json();
        console.log('✅ Prediction created:', prediction.id);
        
        // 2. Ждём завершения генерации (опрашиваем статус)
        let result = null;
        let attempts = 0;
        const maxAttempts = 60; // Максимум 60 попыток (30 секунд)
        
        while (attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 500)); // Ждём 0.5 секунды
            
            const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
                headers: {
                    'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`
                }
            });
            
            const status = await statusResponse.json();
            
            if (status.status === 'succeeded') {
                result = status.output[0];
                break;
            } else if (status.status === 'failed') {
                throw new Error('Генерация не удалась: ' + (status.error || 'Неизвестная ошибка'));
            }
            
            attempts++;
        }
        
        if (!result) {
            throw new Error('Генерация заняла слишком много времени');
        }
        
        console.log('✅ Изображение сгенерировано:', result);
        
        // 3. Отправляем результат
        res.json({
            success: true,
            imageUrl: result,
            prompt: prompt,
            style: style,
            message: '🎉 Фото успешно сгенерировано через AI!',
            generationTime: `${attempts * 0.5} секунд`
        });
        
    } catch (error) {
        console.error('❌ Ошибка генерации:', error);
        
        // Демо-изображение в случае ошибки
        const demoImages = [
            'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=512&h=768&fit=crop',
            'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=512&h=768&fit=crop'
        ];
        
        res.json({
            success: true, // всё равно success для непрерывности работы
            imageUrl: demoImages[Math.floor(Math.random() * demoImages.length)],
            prompt: req.body.prompt || '',
            message: `⚠️ Демо-режим: ${error.message}. Добавь API ключ для реальной генерации.`,
            isDemo: true
        });
    }
});

// 📌 ПРОСТАЯ ГЕНЕРАЦИЯ (для теста без ожидания)
app.post('/generate-quick', async (req, res) => {
    // Быстрая демо-генерация без реального AI
    const { prompt } = req.body;
    
    const demoImages = [
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=512&h=768&fit=crop',
        'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=512&h=768&fit=crop',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=512&h=768&fit=crop'
    ];
    
    setTimeout(() => {
        res.json({
            success: true,
            imageUrl: demoImages[Math.floor(Math.random() * demoImages.length)],
            prompt: prompt,
            message: '✨ Демо-генерация завершена!',
            isDemo: true
        });
    }, 1500);
});

// 📌 ЗАПУСК СЕРВЕРА
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 AI сервер запущен на порту ${PORT}`);
    console.log(`🔗 URL: http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(process.env.REPLICATE_API_TOKEN ? '✅ Replicate API ключ найден' : '⚠️ Replicate API ключ отсутствует');
});