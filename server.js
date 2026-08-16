const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Прямой регистрационный эндпоинт без отправки писем
app.post('/api/register', (req, res) => {
    const { username, email } = req.body;

    if (!username || !email) {
        return res.status(400).json({ success: false, message: 'Заполните все поля' });
    }

    // Возвращаем успешный ответ сразу
    res.json({ success: true, username, email });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`=================================`);
    console.log(`Zeus Server запущен на порту ${PORT}`);
    console.log(`=================================`);
});
