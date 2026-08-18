// ── KONTAKTFORMULAR (Formspree) ──────────────────────────────────────────────
// Wird von index.html genutzt

const form = document.getElementById('form-container');
if (form) {
  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const btn = form.querySelector('.form-submit');
    btn.textContent = 'Wird gesendet...';
    btn.disabled = true;

    const data = new FormData(form);

    try {
      const response = await fetch('https://formspree.io/f/mgoqwbyz', {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        // Erfolg: Formular ausblenden, Erfolgsmeldung zeigen
        form.style.display = 'none';
        document.getElementById('form-success').style.display = 'block';

        // Toast-Benachrichtigung
        const notif = document.getElementById('notification');
        if (notif) {
          notif.classList.add('show');
          setTimeout(() => notif.classList.remove('show'), 4000);
        }
      } else {
        btn.textContent = 'Nachricht absenden →';
        btn.disabled = false;
        alert('Es gab einen Fehler. Bitte versuchen Sie es erneut oder rufen Sie uns an.');
      }
    } catch (error) {
      btn.textContent = 'Nachricht absenden →';
      btn.disabled = false;
      alert('Keine Verbindung. Bitte prüfen Sie Ihre Internetverbindung.');
    }
  });
}
