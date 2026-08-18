// ── NAVBAR: Schatten bei Scroll ─────────────────────────────────────────────
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// ── SCROLL REVEAL ────────────────────────────────────────────────────────────
const revealEls = document.querySelectorAll('.reveal');
const observer  = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target); // Performance: Element nicht weiter beobachten
    }
  });
}, { threshold: 0.1 });
revealEls.forEach(el => observer.observe(el));

// ── HAMBURGER MENÜ (Mobil) ───────────────────────────────────────────────────
function toggleMenu() {
  const links = document.querySelector('.nav-links');
  const btn   = document.querySelector('.hamburger');
  const isOpen = links.classList.contains('mobile-open');

  links.classList.toggle('mobile-open', !isOpen);
  if (btn) btn.setAttribute('aria-expanded', String(!isOpen));
}

// Menü bei Resize auf Desktop automatisch zurücksetzen
window.addEventListener('resize', () => {
  if (window.innerWidth > 900) {
    document.querySelector('.nav-links').classList.remove('mobile-open');
  }
}, { passive: true });

// Menü schließen wenn ein Link geklickt wird
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelector('.nav-links').classList.remove('mobile-open');
  });
});

// ── COPYRIGHT JAHR automatisch aktualisieren ────────────────────────────────
document.querySelectorAll('.footer-copy').forEach(el => {
  el.innerHTML = el.innerHTML.replace(/\d{4}/, new Date().getFullYear());
});
