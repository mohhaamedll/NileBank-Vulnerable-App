// ── PROFILE — BUG #5a: IDOR (HIDDEN) ─────────────────────────────
// The profile loaded is determined by ?user_id= in the URL.
// No check that the logged-in user matches the requested user_id.
// Payload: profile.html?user_id=2  (or 3, 4…)

// ── PROFILE — BUG #5b: OPEN REDIRECT (HIDDEN) ────────────────────
// Post-logout redirect URL is taken from an input field with NO validation.
// Payload: https://evil-bank.com/fake-login
// Attack chain: attacker sends "Your NileBank session expired — login again"
// email with this logout link → victim lands on phishing page and enters
// real credentials.

const CUSTOMERS = {
  1: { name: 'Ahmed Mohamed',  email: 'ahmed@gmail.com',   phone: '010-1234-5678', nid: '12345678901234', dob: '1990-05-15', address: '12 Tahrir St, Cairo'        },
  2: { name: 'Sara Ali',       email: 'sara@hotmail.com',  phone: '011-9876-5432', nid: '98765432109876', dob: '1988-11-22', address: '45 Corniche, Alexandria'    },
  3: { name: 'Omar Hassan',    email: 'omar@yahoo.com',    phone: '012-5555-0011', nid: '55550011223344', dob: '1995-03-08', address: '7 Nile St, Giza'            },
  4: { name: 'Nour Ibrahim',   email: 'nour@outlook.com',  phone: '015-3333-7777', nid: '33337777889900', dob: '1992-07-30', address: '88 Victory Ave, Cairo'      },
  5: { name: 'Khaled Mostafa', email: 'khaled@gmail.com',  phone: '010-2222-4444', nid: '22224444556677', dob: '1985-01-19', address: '3 Desert Rd, 6th October'   },
};

const LOGGED_IN_ID = 1; // Simulated session — always user #1

window.addEventListener('DOMContentLoaded', () => {
  // BUG #5a: Read user_id from URL with no authorization check
  const params      = new URLSearchParams(window.location.search);
  const requestedId = parseInt(params.get('user_id')) || LOGGED_IN_ID;
  const customer    = CUSTOMERS[requestedId] || CUSTOMERS[LOGGED_IN_ID];

  document.getElementById('prof-name').value    = customer.name;
  document.getElementById('prof-email').value   = customer.email;
  document.getElementById('prof-phone').value   = customer.phone;
  document.getElementById('prof-nid').value     = customer.nid;
  document.getElementById('prof-dob').value     = customer.dob;
  document.getElementById('prof-address').value = customer.address;

  // Show IDOR notice when viewing another user's profile
  if (requestedId !== LOGGED_IN_ID && CUSTOMERS[requestedId]) {
    const notice = document.getElementById('idor-notice');
    notice.style.cssText = `
      display: block;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 13px;
      margin-bottom: 16px;
      background: var(--red-bg);
      color: var(--red);
      border: 1px solid #F0B7B2;
    `;
    notice.textContent =
      `⚠ IDOR: You are viewing profile of user #${requestedId} (${customer.name}). ` +
      `No authorization check was performed. Change ?user_id= in the URL to access any account.`;
  }
});

function saveProfile() {
  showMsg('profile-msg', '✔ Profile changes saved successfully.', 'success');
}

function handleLogout() {
  const redirectUrl = document.getElementById('logout-redirect').value.trim() || '/index.html';

  // BUG #5b: No domain whitelist — any external URL is accepted
  let isExternal = false;
  try {
    const parsed = new URL(redirectUrl);
    isExternal   = parsed.hostname !== '' && parsed.hostname !== window.location.hostname;
  } catch (e) {
    // Relative URL — safe
  }

  if (isExternal) {
    showMsg(
      'logout-msg',
      `⚠ Open Redirect Triggered!\n\n` +
      `Logging out → redirecting to:\n${redirectUrl}\n\n` +
      `This is an external domain.\n` +
      `Phishing attack vector: attacker sends "session expired" email\n` +
      `with link to this logout URL → victim re-enters credentials on fake site.`,
      'error'
    );
  } else {
    showMsg('logout-msg', `✔ Logged out. Redirecting to ${redirectUrl}…`, 'success');
    setTimeout(() => { window.location.href = '../index.html'; }, 1500);
  }
}
