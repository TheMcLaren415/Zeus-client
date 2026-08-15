// Элементы модального окна
const authModal = document.getElementById('authModal');
const openAuthBtn = document.getElementById('openAuthBtn');
const closeAuthBtn = document.getElementById('closeAuthBtn');

const loginTabBtn = document.getElementById('loginTabBtn');
const registerTabBtn = document.getElementById('registerTabBtn');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

// Открыть окно
function openAuthModal(tab = 'login') {
    authModal.classList.add('active');
    if (tab === 'register') {
        switchTab('register');
    } else {
        switchTab('login');
    }
}

// Закрыть окно
closeAuthBtn.addEventListener('click', () => {
    authModal.classList.remove('active');
});

openAuthBtn.addEventListener('click', () => openAuthModal('login'));

// Закрытие при клике вне окна
window.addEventListener('click', (e) => {
    if (e.target === authModal) {
        authModal.classList.remove('active');
    }
});

// Переключение табов
function switchTab(tab) {
    if (tab === 'login') {
        loginTabBtn.classList.add('active');
        registerTabBtn.classList.remove('active');
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
    } else {
        registerTabBtn.classList.add('active');
        loginTabBtn.classList.remove('active');
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
    }
}

loginTabBtn.addEventListener('click', () => switchTab('login'));
registerTabBtn.addEventListener('click', () => switchTab('register'));

// Симуляция отправки формы
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Успешный вход в аккаунт Zeus!');
    authModal.classList.remove('active');
});

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Аккаунт создан! Теперь вы можете скачать Zeus Client v1.0.');
    authModal.classList.remove('active');
});
