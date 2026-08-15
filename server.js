const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Временное хранилище кодов подтверждения
const verificationCodes = {};

// Настройка почтового сервера (укажите свои данные SMTP или почту)
const transporter = nodemailer.createTransport({
    service: 'gmail', // Или 'yandex', 'mail.ru'
    auth: {
        user: 'YOUR_EMAIL@gmail.com',       // Ваша почта
        pass: 'YOUR_APP_PASSWORD'          // Пароль приложения (App Password)
    }
});

// Эндпоинт отправки 4-значного кода
app.post('/api/send-code', async (req, res) => {
    const { username, email, password } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: 'Email обязателен' });
    }

    // Генерация случайного 4-значного кода
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    
    // Сохраняем код в памяти
    verificationCodes[email] = { code, username, password };

    // Шаблон красивого письма
    const mailOptions = {
        from: '"Zeus Client" <YOUR_EMAIL@gmail.com>',
        to: email,
        subject: 'Код подтверждения регистрации — Zeus Client v1.0',
        html: `
            <div style="background-color: #0b0d12; color: #ffffff; padding: 30px; font-family: sans-serif; border-radius: 10px;">
                <h2 style="color: #00d2ff; margin-bottom: 10px;">Zeus Client v1.0</h2>
                <p>Здравствуйте, <b>${username}</b>!</p>
                <p>Ваш код подтверждения для завершения регистрации:</p>
                <div style="background: #141821; border: 1px solid #00d2ff; color: #00d2ff; font-size: 32px; font-weight: bold; letter-spacing: 5px; text-align: center; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    ${code}
                </div>
                <p style="color: #9aa0a6; font-size: 12px;">Если вы не регистрировались на нашем сайте, просто проигнорируйте это письмо.</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`[Zeus Server] Код ${code} успешно отправлен на ${email}`);
        res.json({ success: true, message: 'Код успешно отправлен на Email' });
    } catch (error) {
        console.error('[Zeus Server] Ошибка отправки письма:', error);
        res.status(500).json({ success: false, message: 'Не удалось отправить письмо' });
    }
});

// Эндпоинт проверки кода
app.post('/api/verify-code', (req, res) => {
    const { email, code } = req.body;
    const record = verificationCodes[email];

    if (!record) {
        return res.status(400).json({ success: false, message: 'Код не запрашивался или срок его действия истек' });
    }

    if (record.code === code) {
        delete verificationCodes[email];
        res.json({ success: true, username: record.username });
    } else {
        res.status(400).json({ success: false, message: 'Неверный код подтверждения' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`=================================`);
    console.log(`Zeus Server запущен: http://localhost:${PORT}`);
    console.log(`=================================`);
});
