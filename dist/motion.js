/* One-time entrances and restrained interaction feedback; no dependencies. */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const running = new Set();
  const easing = 'cubic-bezier(0.23, 1, 0.32, 1)';
  function enter(element, delay = 0, distance = 14) {
    if (reduced.matches || !element.animate || element.contains(document.activeElement)) return;
    const animation = element.animate([
      { opacity: 0, transform: `translateY(${distance}px)` },
      { opacity: 1, transform: 'translateY(0)' }
    ], { duration: 260, delay, easing, fill: 'backwards' });
    running.add(animation);
    animation.finished.then(() => running.delete(animation)).catch(() => running.delete(animation));
  }
  const hero = document.querySelector('.hero-copy');
  // Avoid replaying the opening when the visitor followed a section link.
  if (!location.hash && window.scrollY < 100 && hero) {
    [...hero.children].forEach((el, i) => enter(el, Math.min(i * 40, 160), 10));
    const photo = document.querySelector('.hero-food');
    if (photo) enter(photo, 80, 12);
  }
  const targets = document.querySelectorAll('.intro-grid > *, .section-heading > *, .dish, .menu-cta, .about-grid > *, .review-grid > div:first-child, .quotes > *, .services > .wrap > h2, .service-grid > article, .location-grid > *');
  const reveal = new IntersectionObserver(entries => {
    const entering = entries.filter(entry => entry.isIntersecting);
    entering.forEach((entry, i) => {
      reveal.unobserve(entry.target);
      enter(entry.target, Math.min(i * 50, 100));
    });
  }, { threshold: .12 });
  targets.forEach(el => reveal.observe(el));
  reduced.addEventListener('change', () => {
    if (reduced.matches) { running.forEach(a => a.cancel()); running.clear(); }
  });
  // Never leave a keyboard-focused control inside an invisible entrance.
  document.addEventListener('focusin', e => {
    running.forEach(a => { if (a.effect.target.contains(e.target)) a.cancel(); });
  });
  const header = document.querySelector('header');
  let scheduled = false;
  function updateHeader() { header.classList.toggle('scrolled', window.scrollY > 24); scheduled = false; }
  window.addEventListener('scroll', () => {
    if (!scheduled) { scheduled = true; requestAnimationFrame(updateHeader); }
  }, { passive: true });
  updateHeader();
})();
