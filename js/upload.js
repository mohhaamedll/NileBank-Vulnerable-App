// ── UPLOAD — BUG #4: UNRESTRICTED FILE UPLOAD (HIDDEN) ───────────
// No file type validation on client or (simulated) server.
// No MIME check. No extension whitelist.
// The file would be saved directly to /uploads/ inside the web root.
// Payload: upload shell.php → access via https://nilebank.com/uploads/shell.php
// → Remote Code Execution possible.

// NOTE: SAFE_EXT and SAFE_MIME are intentionally defined but never checked —
// that is the vulnerability. Do not add validation here.
const SAFE_EXT  = ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'tiff'];
const SAFE_MIME = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif'];

let selectedFile = null;

function fileSelected(input) {
  selectedFile = input.files[0];
  if (selectedFile) {
    document.getElementById('drop-filename').textContent =
      `Selected: ${selectedFile.name} (${(selectedFile.size / 1024).toFixed(1)} KB)`;
  }
}

function handleDrop(e) {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  if (file) {
    selectedFile = file;
    document.getElementById('drop-filename').textContent = `Selected: ${selectedFile.name}`;
  }
}

function handleUpload(e) {
  e.preventDefault();
  const docType = document.getElementById('doc-type').value;
  const docDesc = document.getElementById('doc-desc').value.trim();

  if (!docType)      return showMsg('upload-msg', 'Please select a document type.', 'error');
  if (!selectedFile) return showMsg('upload-msg', 'Please select a file to upload.', 'error');

  // BUG: No validation — any file type is accepted
  const ext         = selectedFile.name.split('.').pop().toLowerCase();
  const isDangerous = ['php', 'exe', 'sh', 'asp', 'aspx', 'jsp', 'py', 'rb', 'bat', 'cmd', 'cgi'].includes(ext);

  // Simulate server accepting the file and adding it to the table
  const newRow = document.createElement('tr');
  newRow.innerHTML = `
    <td>${selectedFile.name}</td>
    <td>${docType.replace('_', ' ')}</td>
    <td>${new Date().toISOString().split('T')[0]}</td>
    <td><span class="status-pending">Pending Review</span></td>
    <td><a href="#" class="tbl-link">View</a></td>
  `;
  document.getElementById('docs-list').appendChild(newRow);

  if (isDangerous) {
    showMsg(
      'upload-msg',
      `File "${selectedFile.name}" uploaded successfully.\n` +
      `Saved to: /uploads/${selectedFile.name}\n\n` +
      `[Simulated] A .${ext} file was accepted with no validation.\n` +
      `On a real server this would be accessible at:\n` +
      `https://nilebank.com/uploads/${selectedFile.name}\n` +
      `→ Remote Code Execution possible.`,
      'error'
    );
  } else {
    showMsg('upload-msg', `✔ Document "${selectedFile.name}" uploaded successfully and is pending review.`, 'success');
  }

  clearUpload();
}

function clearUpload() {
  selectedFile = null;
  document.getElementById('file-inp').value        = '';
  document.getElementById('drop-filename').textContent = 'Supported formats: PDF, JPG, PNG';
  document.getElementById('doc-type').value        = '';
  document.getElementById('doc-desc').value        = '';
  document.getElementById('doc-expiry').value      = '';
}
