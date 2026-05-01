// Telegram WebApp Integration
let tg = window.Telegram?.WebApp;

if (tg) {
    tg.ready();
    tg.MainButton.text = 'Ready';
    tg.MainButton.show();
}

function getTelegramUserData() {
    if (!tg) return null;
    return tg.initDataUnsafe?.user;
}

function showAlert(message) {
    if (tg) {
        tg.showAlert(message);
    } else {
        alert(message);
    }
}

function showConfirm(message, callback) {
    if (tg) {
        tg.showConfirm(message, callback);
    } else {
        callback(confirm(message));
    }
}

function closeTelegramApp() {
    if (tg) {
        tg.close();
    }
}

// Set user info if available
const userInfo = getTelegramUserData();
if (userInfo) {
    const userElement = document.querySelector('.user-info');
    if (userElement) {
        userElement.textContent = `👤 ${userInfo.first_name || 'User'}`;
    }
}
