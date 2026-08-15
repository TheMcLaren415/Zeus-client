const API_URL = 'http://localhost:3000/api';

// Проверка сессии пользователя
function isLoggedIn() {
    return localStorage.getItem('zeus_logged_in') === 'true';
}

function getCurrentUser() {
    return localStorage.getItem('zeus_username') || 'Пользователь';
}

function getCurrentEmail() {
    return localStorage.getItem('zeus_email') || 'user@zeus.client';
}

function handleLogout() {
    localStorage.setItem('zeus_logged_in', 'false');
    localStorage.removeItem('zeus_username');
    localStorage.removeItem('zeus_email');
    window.location.href = 'index.html';
}

// Отправка кода при регистрации
async function handleRegister(username, email, password) {
    try {
        const response = await fetch(`${API_URL}/send-code`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (data.success) {
            localStorage.setItem('temp_reg_email', email);
            localStorage.setItem('temp_reg_username', username);
            window.location.href = 'verify.html';
        } else {
            alert(data.message || 'Ошибка отправки кода');
        }
    } catch (err) {
        alert('Ошибка подключения к серверу! Убедитесь, что server.js запущен.');
    }
}

// Проверка введенного кода на странице verify.html
async function handleVerify(code) {
    const email = localStorage.getItem('temp_reg_email');
    const username = localStorage.getItem('temp_reg_username');

    try {
        const response = await fetch(`${API_URL}/verify-code`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, code })
        });

        const data = await response.json();

        if (data.success) {
            localStorage.setItem('zeus_logged_in', 'true');
            localStorage.setItem('zeus_username', username);
            localStorage.setItem('zeus_email', email);

            localStorage.removeItem('temp_reg_email');
            localStorage.removeItem('temp_reg_username');

            alert('Email успешно подтвержден!');
            window.location.href = 'dashboard.html';
        } else {
            alert(data.message || 'Неверный код!');
        }
    } catch (err) {
        alert('Ошибка соединения с сервером.');
    }
}

// Вход в аккаунт
function handleLogin(login, password) {
    localStorage.setItem('zeus_logged_in', 'true');
    localStorage.setItem('zeus_username', login);
    window.location.href = 'dashboard.html';
}

// Обработка клика по кнопке скачивания
function handleDownloadClick(event) {
    if (event) event.preventDefault();
    
    if (isLoggedIn()) {
        window.location.href = 'dashboard.html';
    } else {
        showAuthChoiceModal();
    }
}

// Модальное окно выбора действия
function showAuthChoiceModal() {
    let modal = document.getElementById('authChoiceModal');
    if (!modal) {
        const modalHTML = `
            <div class="modal-overlay active" id="authChoiceModal">
                <div class="modal-card">
                    <button class="modal-close" onclick="closeAuthChoiceModal()">&times;</button>
                    <h2>Требуется авторизация</h2>
                    <p style="color: var(--text-muted); margin-bottom: 25px;">
                        Чтобы скачать Zeus Client v1.0 за 0 ₽, войдите в аккаунт или зарегистрируйтесь.
                    </p>
                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        <a href="register.html" class="btn-primary full-width">Зарегистрироваться</a>
                        <a href="login.html" class="btn-secondary full-width">Войти в аккаунт</a>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    } else {
        modal.classList.add('active');
    }
}

function closeAuthChoiceModal() {
    const modal = document.getElementById('authChoiceModal');
    if (modal) modal.classList.remove('active');
}

// Инициализация интерфейсов
document.addEventListener('DOMContentLoaded', () => {
    
    // Кнопки шапки
    const navButtons = document.getElementById('navAuthButtons');
    if (navButtons) {
        if (isLoggedIn()) {
            navButtons.innerHTML = `
                <a href="dashboard.html" class="btn-primary nav-btn">Личный кабинет</a>
                <button onclick="handleLogout()" class="btn-secondary nav-btn">Выйти</button>
            `;
        } else {
            navButtons.innerHTML = `
                <a href="login.html" class="btn-secondary nav-btn">Войти</a>
                <a href="register.html" class="btn-primary nav-btn">Регистрация</a>
            `;
        }
    }

    // Регистрация
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('regUsername').value;
            const email = document.getElementById('regEmail').value;
            const password = document.getElementById('regPassword').value;
            handleRegister(username, email, password);
        });
    }

    // Верификация кода
    const verifyForm = document.getElementById('verifyForm');
    const emailDisplay = document.getElementById('sentEmailDisplay');
    if (verifyForm) {
        const tempEmail = localStorage.getItem('temp_reg_email');
        if (emailDisplay && tempEmail) emailDisplay.innerText = tempEmail;

        verifyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const code = document.getElementById('verifyCodeInput').value;
            handleVerify(code);
        });
    }

    // Вход
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const login = document.getElementById('loginInput').value;
            handleLogin(login, '');
        });
    }

    // Личный кабинет
    const usernameElement = document.getElementById('usernameDisplay');
    const userEmailElement = document.getElementById('userEmailDisplay');
    const avatarElement = document.getElementById('avatarDisplay');
    
    if (usernameElement) {
        if (!isLoggedIn()) {
            window.location.href = 'register.html';
        } else {
            const username = getCurrentUser();
            const email = getCurrentEmail();
            usernameElement.innerText = username;
            if (userEmailElement) userEmailElement.innerText = email;
            if (avatarElement) avatarElement.innerText = username.charAt(0).toUpperCase();
        }
    }
});
