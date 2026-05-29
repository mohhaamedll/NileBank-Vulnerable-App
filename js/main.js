// ── SHARED UTILITIES ─────────────────────────────────────────────

/**
 * showMsg(id, text, type)
 * Single shared feedback renderer used across all pages.
 * Eliminates the duplicate showMsg / showUploadMsg / showProfileMsg
 * functions that previously existed in transfer.js, upload.js, profile.js.
 * type: 'success' | 'error' | 'warning'
 */
function showMsg(id, text, type) {
  const el = document.getElementById(id);
  if (!el) return;
  const colors = {
    success: { bg: 'var(--green-bg)', fg: 'var(--green)',  border: '#A7D9C4' },
    error:   { bg: 'var(--red-bg)',   fg: 'var(--red)',    border: '#F0B7B2' },
    warning: { bg: 'var(--amber-bg)', fg: 'var(--amber)',  border: '#F6D98A' },
  };
  const c = colors[type] || colors.error;
  el.style.cssText = `
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 13px;
    white-space: pre-wrap;
    margin-top: 14px;
    background: ${c.bg};
    color: ${c.fg};
    border: 1px solid ${c.border};
  `;
  el.textContent = text;
}

// ── TOGGLE PASSWORD VISIBILITY ────────────────────────────────────
function togglePass() {
  const inp = document.getElementById('login-pass');
  inp.type = inp.type === 'password' ? 'text' : 'password';
}

// ── LOGIN ─────────────────────────────────────────────────────────
// BUG #1 [CLIENT-SIDE AUTH + NO LOCKOUT — HIDDEN]:
// Credentials are validated entirely in JavaScript on the client.
// Anyone can open DevTools, read the USERS object, or bypass
// the check by manipulating JS. No server involved.
// Also: no lockout after N failed attempts — brute-force friendly.
const USERS = {
  'NB-00001': { password: 'password123', name: 'Ahmed Mohamed', role: 'customer' },
  'NB-00002': { password: 'sara2024',    name: 'Sara Ali',      role: 'customer' },
  'NB-00003': { password: 'omar@bank',   name: 'Omar Hassan',   role: 'customer' },
  'admin':    { password: 'admin',       name: 'Admin User',    role: 'admin'    },
};

function handleLogin(e) {
  e.preventDefault();
  const user = document.getElementById('login-user').value.trim();
  const pass = document.getElementById('login-pass').value;

  const account = USERS[user];
  if (account && account.password === pass) {
    showMsg('login-msg', `✔ Welcome, ${account.name}! Redirecting…`, 'success');
    setTimeout(() => { window.location.href = 'pages/transfer.html'; }, 1200);
  } else {
    showMsg('login-msg', '✘ Incorrect account number or password.', 'error');
    // No failed attempt counter. No lockout. Brute-force away.
  }
}
