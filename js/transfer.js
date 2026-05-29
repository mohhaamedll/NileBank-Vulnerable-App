// ── TRANSFER — BUG #2: SQL INJECTION (HIDDEN) ────────────────────
// The recipient account number is concatenated directly into the query.
// No prepared statements. No input validation.
// Payload: NB-00002' OR '1'='1

const ACCOUNTS_DB = {
  'NB-00001': { name: 'Ahmed Mohamed',  balance: 24850 },
  'NB-00002': { name: 'Sara Ali',       balance: 15200 },
  'NB-00003': { name: 'Omar Hassan',    balance: 8900  },
  'NB-00004': { name: 'Nour Ibrahim',   balance: 31400 },
  'NB-00005': { name: 'Khaled Mostafa', balance: 5600  },
};

function handleTransfer(e) {
  e.preventDefault();
  const recipient = document.getElementById('recipient').value.trim();
  const amount    = parseFloat(document.getElementById('amount').value);
  const pin       = document.getElementById('pin').value;

  if (!recipient || !amount || !pin) {
    return showMsg('transfer-msg', '✘ Please fill all required fields.', 'error');
  }

  // Simulated vulnerable SQL query (string concat — no parameterization)
  const simulatedQuery = `SELECT * FROM accounts WHERE account_no = '${recipient}'`;

  // Detect injection attempt
  const isInjection = recipient.includes("'")
    || recipient.toLowerCase().includes(' or ')
    || recipient.includes('--');

  if (isInjection) {
    return showMsg(
      'transfer-msg',
      `⚠ Query executed: ${simulatedQuery}\n\n` +
      `Result: ALL accounts returned (injection succeeded).\n` +
      `Transfer processed to EVERY account in the database.`,
      'error'
    );
  }

  const account = ACCOUNTS_DB[recipient];
  if (!account) {
    return showMsg('transfer-msg', `✘ Account ${recipient} not found.`, 'error');
  }

  if (pin !== '1234') {
    return showMsg('transfer-msg', '✘ Incorrect PIN.', 'error');
  }

  showMsg(
    'transfer-msg',
    `✔ Transfer of EGP ${amount.toLocaleString()} to ${account.name} (${recipient}) completed successfully.`,
    'success'
  );
}
