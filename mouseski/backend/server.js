import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

// Для ES модулей
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Проверка токенов
if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error('❌ ОШИБКА: TELEGRAM_TOKEN или TELEGRAM_CHAT_ID не установлены!');
    process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
aapp.use(express.static('./frontend'));

app.post('/api/send-appointment', async (req, res) => {
    try {
        const { name, phone, service, date } = req.body;

        // Формируем сообщение
        const message = `
        🟢 НОВАЯ ЗАПИСЬ в Mouse Services!

        🐭 Услуга: ${selectedService}
        🐁 Мышь: ${selectedMouse}
        💰 Стоимость: ${selectedServicePrice}
        💳 Оплата: ${selectedPaymentMethod === 'cash' ? 'При получении' : 'Картой онлайн'}

        👤 Клиент: ${name}
        📧 Email: ${email}
        📅 Дата: ${date}

        ⏰ Запись создана: ${new Date().toLocaleString('ru-RU')} `;

        // ✅ ПРАВИЛЬНАЯ СТРОКА - обратите внимание на обратные кавычки
        const response = await axios.post(
            `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
            {
                chat_id: TELEGRAM_CHAT_ID,
                text: message
            }
        );

        res.json({
            success: true,
            message: 'Запись отправлена!'
        });
    } catch (error) {
        console.error('Ошибка:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка отправки'
        });
    }
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});
app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
});