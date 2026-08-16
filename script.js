const API_URL = 'https://redesigned-space-orbit-4jvgqpp7rx7q3vgw-3000.app.github.dev/api';

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

// Регистрация напрямую без кода на почту
async function handleRegister(username, email, password) {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (data.success) {
            // Сохраняем сессию сразу
            localStorage.setItem('zeus_logged_in', 'true');
            localStorage.setItem('zeus_username', username);
            localStorage.setItem('zeus_email', email);

            // Мгновенный переход в личный кабинет
            window.location.href = 'dashboard.html';
        } else {
            alert(data.message || 'Ошибка регистрации');
        }
    } catch (err) {
        // Запасной локальный вход, если сервер не отвечает
        localStorage.setItem('zeus_logged_in', 'true');
        localStorage.setItem('zeus_username', username);
        localStorage.setItem('zeus_email', email);
        window.location.href = 'dashboard.html';
    }
}

// Вход в аккаунт
function handleLogin(login) {
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

// Модальное окно авторизации
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

// Инициализация событий
document.addEventListener('DOMContentLoaded', () => {
    
    // Шапка
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

    // Форма регистрации
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

    // Форма входа
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const login = document.getElementById('loginInput').value;
            handleLogin(login);
        });
    }

    // Заполнение профиля в Dashboard
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
