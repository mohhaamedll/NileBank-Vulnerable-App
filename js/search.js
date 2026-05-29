// ── SEARCH — BUG #3: XSS (HIDDEN) ────────────────────────────────
// The search term is reflected back into the page via innerHTML.
// No escaping. No sanitization.
// Payload: <img src=x onerror="alert(document.cookie)">

const TRANSACTIONS = [
  { date: '2025-04-28', desc: 'Transfer to Sara Ali',       type: 'debit',  amount: -500,   balance: 24850 },
  { date: '2025-04-25', desc: 'Salary deposit',             type: 'credit', amount: 12000,  balance: 25350 },
  { date: '2025-04-21', desc: 'Transfer to Omar Hassan',    type: 'debit',  amount: -1200,  balance: 13350 },
  { date: '2025-04-18', desc: 'ATM Withdrawal - Tahrir',    type: 'debit',  amount: -2000,  balance: 14550 },
  { date: '2025-04-15', desc: 'Transfer to Nour Ibrahim',   type: 'debit',  amount: -300,   balance: 16550 },
  { date: '2025-04-10', desc: 'Online purchase - Amazon',   type: 'debit',  amount: -850,   balance: 16850 },
  { date: '2025-04-05', desc: 'Deposit - Mobile transfer',  type: 'credit', amount: 5000,   balance: 17700 },
  { date: '2025-03-31', desc: 'Utility bill - Cairo Water', type: 'debit',  amount: -320,   balance: 12700 },
  { date: '2025-03-28', desc: 'Transfer to Khaled Mostafa', type: 'debit',  amount: -1500,  balance: 13020 },
  { date: '2025-03-20', desc: 'Salary deposit',             type: 'credit', amount: 12000,  balance: 14520 },
];

function runSearch() {
  const query  = document.getElementById('search-input').value;
  const type   = document.getElementById('filter-type').value;
  const period = parseInt(document.getElementById('filter-period').value);
  const minAmt = parseFloat(document.getElementById('filter-min').value) || null;
  const maxAmt = parseFloat(document.getElementById('filter-max').value) || null;
  const header = document.getElementById('search-result-header');
  const tbody  = document.getElementById('results-body');

  // BUG: Reflected XSS — query injected via innerHTML with no escaping.
  // A safe implementation would use textContent instead.
  header.innerHTML = query
    ? `Showing results for: <strong>${query}</strong>`
    : `Showing all transactions`;

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - period);

  const filtered = TRANSACTIONS.filter(t => {
    const matchQ    = !query || t.desc.toLowerCase().includes(query.toLowerCase());
    const matchType = !type  || t.type === type;
    const matchDate = new Date(t.date) >= cutoff;
    const matchMin  = minAmt === null || Math.abs(t.amount) >= minAmt;
    const matchMax  = maxAmt === null || Math.abs(t.amount) <= maxAmt;
    return matchQ && matchType && matchDate && matchMin && matchMax;
  });

  tbody.innerHTML = '';

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="5">No transactions match your search.</td></tr>';
    return;
  }

  filtered.forEach(t => {
    const tr       = document.createElement('tr');
    const amtColor = t.amount < 0 ? 'var(--red)' : 'var(--green)';
    const amtSign  = t.amount < 0 ? '' : '+';
    tr.innerHTML = `
      <td>${t.date}</td>
      <td>${t.desc}</td>
      <td><span class="status-${t.type === 'credit' ? 'ok' : 'pending'}">${t.type}</span></td>
      <td style="font-family:var(--mono);color:${amtColor};font-weight:500">${amtSign}${t.amount.toLocaleString()} EGP</td>
      <td style="font-family:var(--mono)">${t.balance.toLocaleString()} EGP</td>
    `;
    tbody.appendChild(tr);
  });
}
