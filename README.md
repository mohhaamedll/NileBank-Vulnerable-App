# NileBank — SRS Security Project 🏦

A realistic bank web application with **5 hidden security vulnerabilities** embedded in the code.
The team's task is to find, understand, and fix each one.

## How to Run
Open `index.html` in any browser. No server or installation needed.

**Demo Login:**
- Account: `NB-00001` / Password: `password123`
- Admin: `admin` / `admin`

---

## Pages & Hidden Bugs (for instructor reference)

| Page | File | Bug | Type |
|------|------|-----|------|
| Login | `index.html` + `js/main.js` | Credentials validated client-side in JS; no lockout | Client-side Auth + Brute Force |
| Transfer | `pages/transfer.html` + `js/transfer.js` | SQL string concatenation, no parameterization | SQL Injection |
| Search | `pages/search.html` + `js/search.js` | Search term reflected via `innerHTML` | XSS |
| Documents | `pages/upload.html` + `js/upload.js` | No file type / MIME validation | Unrestricted Upload |
| Profile | `pages/profile.html` + `js/profile.js` | `?user_id=` not checked against session; logout redirect not validated | IDOR + Open Redirect |

---

## Project Structure
```
nilebank/
├── index.html              ← Login page
├── css/main.css            ← All styles
├── js/
│   ├── main.js             ← Login logic (Bug #1)
│   ├── transfer.js         ← Transfer logic (Bug #2)
│   ├── search.js           ← Search logic (Bug #3)
│   ├── upload.js           ← Upload logic (Bug #4)
│   └── profile.js          ← Profile logic (Bug #5a + #5b)
└── pages/
    ├── transfer.html
    ├── search.html
    ├── upload.html
    └── profile.html
```
