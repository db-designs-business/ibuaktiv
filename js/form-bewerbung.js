// ── MODAL ────────────────────────────────────────────────────────────────────
function openModal(stelleName) {
  document.getElementById('modalStelleName').textContent = stelleName;
  document.getElementById('formStelle').value = stelleName;
  document.getElementById('formSubject').value = 'Neue Bewerbung: ' + stelleName + ' – IBU Aktiv';

  const sel = document.getElementById('formStelleSelect');
  for (let i = 0; i < sel.options.length; i++) {
    if (sel.options[i].value === stelleName) { sel.selectedIndex = i; break; }
  }

  document.getElementById('bewerbungModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('bewerbungModal').classList.remove('open');
  document.body.style.overflow = '';
}

function handleOverlayClick(e) {
  if (e.target === document.getElementById('bewerbungModal')) closeModal();
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ── DATEI-UPLOAD ─────────────────────────────────────────────────────────────
let selectedFiles = [];

function handleFiles(files) {
  Array.from(files).forEach(file => {
    if (!selectedFiles.find(f => f.name === file.name && f.size === file.size)) {
      if (file.size > 10 * 1024 * 1024) {
        alert(file.name + ' ist zu groß (max. 10 MB).');
        return;
      }
      selectedFiles.push(file);
    }
  });
  renderFileList();
}

function renderFileList() {
  const list = document.getElementById('fileList');
  list.innerHTML = '';
  selectedFiles.forEach((file, idx) => {
    const ext  = file.name.split('.').pop().toUpperCase();
    const size = file.size < 1024 * 1024
      ? (file.size / 1024).toFixed(0) + ' KB'
      : (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    const icon = ext === 'PDF' ? '📄' : ['JPG', 'JPEG', 'PNG'].includes(ext) ? '🖼️' : '📝';

    list.innerHTML += `
      <div class="file-item">
        <span class="file-item-icon">${icon}</span>
        <span class="file-item-name">${file.name}</span>
        <span class="file-item-size">${size}</span>
        <button class="file-item-remove" type="button" onclick="removeFile(${idx})">✕</button>
      </div>`;
  });
}

function removeFile(idx) {
  selectedFiles.splice(idx, 1);
  renderFileList();
}

// Drag & Drop
const zone = document.getElementById('uploadZone');
if (zone) {
  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('dragover'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
  zone.addEventListener('drop', e => {
    e.preventDefault();
    zone.classList.remove('dragover');
    handleFiles(e.dataTransfer.files);
  });
}

// ── BEWERBUNGSFORMULAR ABSENDEN ───────────────────────────────────────────────
document.getElementById('bewerbungForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const btn = document.getElementById('bewSubmitBtn');
  btn.textContent = 'Wird gesendet…';
  btn.disabled = true;

  const data = new FormData(this);
  selectedFiles.forEach(file => data.append('dateien', file, file.name));

  try {
    const response = await fetch('https://formspree.io/f/xjgzbdrz', {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      this.style.display = 'none';
      document.getElementById('bewSuccess').style.display = 'block';

      const notif = document.getElementById('notification');
      if (notif) {
        notif.classList.add('show');
        setTimeout(() => notif.classList.remove('show'), 4000);
      }

      // Formular nach 9 Sekunden zurücksetzen
      setTimeout(() => {
        this.reset();
        this.style.display = 'block';
        document.getElementById('bewSuccess').style.display = 'none';
        selectedFiles = [];
        renderFileList();
        btn.textContent = 'Bewerbung absenden →';
        btn.disabled = false;
      }, 9000);
    } else {
      btn.textContent = 'Bewerbung absenden →';
      btn.disabled = false;
      alert('Fehler beim Senden. Bitte versuchen Sie es erneut oder rufen Sie uns an: 0561 317 53 004');
    }
  } catch (err) {
    btn.textContent = 'Bewerbung absenden →';
    btn.disabled = false;
    alert('Keine Verbindung. Bitte Internetverbindung prüfen oder anrufen: 0561 317 53 004');
  }
});
