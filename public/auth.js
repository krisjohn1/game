// ============ AUTH & API LOGIC ============
const API_URL = 'http://localhost:3030/api';
let currentUser = null;

// UI Elements
const loginModal = document.getElementById('login-modal');
const registerModal = document.getElementById('register-modal');
const withdrawModal = document.getElementById('withdraw-modal');

const guestNav = document.getElementById('nav-auth-guest');
const userNav = document.getElementById('nav-auth-user');
const adminBtn = document.getElementById('btn-admin-nav');
const usernameLabel = document.getElementById('nav-username');

// ============ INITIALIZATION ============
document.addEventListener('DOMContentLoaded', () => {
    // Buttons to open modals
    const btnLogin = document.getElementById('btn-login-nav');
    const btnRegister = document.getElementById('btn-register-nav');
    const btnWithdraw = document.getElementById('btn-withdraw-nav');
    const btnLogout = document.getElementById('btn-logout-nav');

    if (btnLogin && loginModal) btnLogin.addEventListener('click', () => loginModal.classList.add('show'));
    if (btnRegister && registerModal) btnRegister.addEventListener('click', () => registerModal.classList.add('show'));
    if (btnWithdraw && withdrawModal) btnWithdraw.addEventListener('click', () => withdrawModal.classList.add('show'));

    // Close buttons
    const closeLogin = document.getElementById('close-login');
    const closeRegister = document.getElementById('close-register');
    const closeWithdraw = document.getElementById('close-withdraw');

    if (closeLogin && loginModal) closeLogin.addEventListener('click', () => loginModal.classList.remove('show'));
    if (closeRegister && registerModal) closeRegister.addEventListener('click', () => registerModal.classList.remove('show'));
    if (closeWithdraw && withdrawModal) closeWithdraw.addEventListener('click', () => withdrawModal.classList.remove('show'));
    
    // Close on overlay click
    [loginModal, registerModal, withdrawModal].forEach(modal => {
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) modal.classList.remove('show');
            });
        }
    });

    // Form Submits
    const submitLogin = document.getElementById('submit-login');
    const submitRegister = document.getElementById('submit-register');
    const submitWithdraw = document.getElementById('submit-withdraw');

    if (submitLogin) submitLogin.addEventListener('click', handleLogin);
    if (submitRegister) submitRegister.addEventListener('click', handleRegister);
    if (submitWithdraw) submitWithdraw.addEventListener('click', handleWithdraw);
    
    // Logout
    if (btnLogout) btnLogout.addEventListener('click', logout);

    // Check existing session
    checkSession();
});

// ============ API FUNCTIONS ============

async function apiCall(endpoint, method = 'GET', body = null) {
    const headers = { 'Content-Type': 'application/json' };
    const token = localStorage.getItem('token');
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);

    const res = await fetch(`${API_URL}${endpoint}`, options);
    const data = await res.json();
    
    if (!res.ok) {
        throw new Error(data.error || 'Terjadi kesalahan');
    }
    return data;
}

window.apiCall = apiCall;

async function checkSession() {
    const token = localStorage.getItem('token');
    if (!token) return updateAuthUI(null);

    try {
        const user = await apiCall('/me');
        currentUser = user;
        // Make it globally accessible for game.js
        window.appUser = currentUser;
        updateAuthUI(user);
        
        // Sync balance to game.js if it's loaded
        if (window.syncBalance) window.syncBalance(user.balance);
    } catch (e) {
        console.error('Session invalid:', e);
        logout();
    }
}

async function handleLogin() {
    const u = document.getElementById('login-username').value;
    const p = document.getElementById('login-password').value;
    if (!u || !p) return showFloatingText('Isi semua field!', 'red');

    try {
        const data = await apiCall('/login', 'POST', { username: u, password: p });
        localStorage.setItem('token', data.token);
        currentUser = data.user;
        window.appUser = currentUser;
        
        loginModal.classList.remove('show');
        showFloatingText(`Selamat datang, ${u}!`, 'green');
        updateAuthUI(currentUser);
        if (window.syncBalance) window.syncBalance(currentUser.balance);
    } catch (e) {
        showFloatingText(e.message, 'red');
    }
}

async function handleRegister() {
    const u = document.getElementById('register-username').value;
    const p = document.getElementById('register-password').value;
    if (!u || !p) return showFloatingText('Isi semua field!', 'red');

    try {
        await apiCall('/register', 'POST', { username: u, password: p });
        registerModal.classList.remove('show');
        showFloatingText('Registrasi berhasil! Silakan login.', 'green');
    } catch (e) {
        showFloatingText(e.message, 'red');
    }
}

function logout() {
    localStorage.removeItem('token');
    currentUser = null;
    window.appUser = null;
    updateAuthUI(null);
    if (window.syncBalance) window.syncBalance(0);
    showFloatingText('Berhasil logout', 'gold');
}

async function handleWithdraw() {
    if (!currentUser) return showFloatingText('Login dahulu!', 'red');
    
    const amount = parseInt(document.getElementById('withdraw-amount').value);
    const acc = document.getElementById('withdraw-account').value;
    
    if (!amount || amount < 50000) return showFloatingText('Minimal tarik 50.000!', 'red');
    if (!acc) return showFloatingText('Isi nomor rekening!', 'red');

    try {
        const data = await apiCall('/transaction', 'POST', { type: 'withdraw', amount });
        withdrawModal.classList.remove('show');
        currentUser.balance = data.newBalance;
        if (window.syncBalance) window.syncBalance(data.newBalance);
        showFloatingText(`Penarikan ${formatRupiah(amount)} diproses!`, 'green');
    } catch (e) {
        showFloatingText(e.message, 'red');
    }
}

// Function to call from game.js for topups/bets/wins
window.apiTransaction = async function(type, amount) {
    if (!currentUser) {
        showFloatingText('Silakan login terlebih dahulu!', 'red');
        return false;
    }
    try {
        const data = await apiCall('/transaction', 'POST', { type, amount });
        currentUser.balance = data.newBalance;
        return data.newBalance;
    } catch (e) {
        showFloatingText(e.message, 'red');
        return false;
    }
}

// ============ UI UPDATES ============
function updateAuthUI(user) {
    if (user) {
        if (guestNav) guestNav.style.display = 'none';
        if (userNav) userNav.style.display = 'flex';
        if (usernameLabel) usernameLabel.textContent = user.username;
        if (adminBtn) {
            if (user.role === 'admin') {
                adminBtn.style.display = 'inline-block';
            } else {
                adminBtn.style.display = 'none';
            }
        }
    } else {
        if (guestNav) guestNav.style.display = 'flex';
        if (userNav) userNav.style.display = 'none';
        if (adminBtn) adminBtn.style.display = 'none';
    }
}

// Ensure formatRupiah is available (fallback if game.js loads later)
window.formatRupiah = window.formatRupiah || function(n) {
    return 'Rp ' + Math.round(n).toLocaleString('id-ID');
}

// ============ FLOATING TEXT ============
window.showFloatingText = function(text, color = 'gold') {
  const el = document.createElement('div');
  const colors = { gold: '#ffd700', green: '#00c851', red: '#dc143c' };
  el.style.cssText = `
    position: fixed;
    top: 80px; right: 20px;
    font-family: 'Orbitron', monospace;
    font-size: 1.2rem;
    font-weight: 700;
    color: ${colors[color] || colors.gold};
    z-index: 5000;
    pointer-events: none;
    animation: floatText 2s ease-out forwards;
    text-shadow: 0 0 10px currentColor;
  `;
  el.textContent = text;
  document.body.appendChild(el);
  const style = document.createElement('style');
  style.textContent = `@keyframes floatText { 0%{opacity:1;transform:translateY(0)} 100%{opacity:0;transform:translateY(-60px)} }`;
  document.head.appendChild(style);
  setTimeout(() => el.remove(), 2000);
}

// ============ TOPUP LOGIC (GLOBAL) ============
document.addEventListener('DOMContentLoaded', () => {
    const topupModal = document.getElementById('topup-modal');
    const btnTopupNav = document.getElementById('btn-topup-nav');
    const btnTopupHero = document.getElementById('btn-topup-hero');
    const closeTopup = document.getElementById('close-topup');
    
    function showTopup() {
        if (!currentUser) return showFloatingText('Silakan login terlebih dahulu!', 'red');
        if (topupModal) topupModal.classList.add('show');
    }
    function hideTopup() {
        if (topupModal) topupModal.classList.remove('show');
    }

    if (btnTopupNav) btnTopupNav.addEventListener('click', showTopup);
    if (btnTopupHero) btnTopupHero.addEventListener('click', showTopup);
    if (closeTopup) closeTopup.addEventListener('click', hideTopup);
    
    if (topupModal) {
        topupModal.addEventListener('click', (e) => {
            if (e.target === topupModal) hideTopup();
        });
    }

    document.querySelectorAll('.topup-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const amount = parseInt(btn.dataset.amount);
            try {
                const newBal = await window.apiTransaction('topup', amount);
                if (newBal !== false) {
                    showFloatingText(`Berhasil Top Up ${formatRupiah(amount)}`, 'green');
                    hideTopup();
                }
            } catch (e) {
                showFloatingText('Gagal Top Up', 'red');
            }
        });
    });

    const btnCustomTopup = document.getElementById('topup-custom');
    const customAmountInput = document.getElementById('custom-amount');
    
    if (btnCustomTopup && customAmountInput) {
        btnCustomTopup.addEventListener('click', async () => {
            const val = parseInt(customAmountInput.value);
            if (!val || val < 10000) {
                return showFloatingText('Minimal Top Up Rp 10.000', 'red');
            }
            try {
                const newBal = await window.apiTransaction('topup', val);
                if (newBal !== false) {
                    showFloatingText(`Berhasil Top Up ${formatRupiah(val)}`, 'green');
                    hideTopup();
                }
            } catch (e) {
                showFloatingText('Gagal Top Up', 'red');
            }
        });
    }
});
