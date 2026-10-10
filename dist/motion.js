/* One-time entrances and restrained interaction feedback; no dependencies. */
(() => {
  if (window.trapicheMotionInitialized) return;
  window.trapicheMotionInitialized = true;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const running = new Set();
  const revealed = new WeakSet();
  const easing = 'cubic-bezier(0.23, 1, 0.32, 1)';
  function enter(element, delay = 0, distance = 26) {
    if (revealed.has(element)) return;
    revealed.add(element);
    if (reduced.matches || !element.animate || element.contains(document.activeElement)) return;
    const visual = element.matches('figure, .dish, .hero-food, .address-panel');
    const animation = element.animate([
      { opacity: 0, transform: `translateY(${visual ? 34 : distance}px) scale(${visual ? .96 : 1})` },
      { opacity: 1, transform: 'translateY(0) scale(1)' }
    ], { duration: visual ? 1150 : 950, delay, easing, fill: 'backwards' });
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
  const targets = document.querySelectorAll('.intro-grid > *, .section-heading > *, .dish, .menu-cta, .about-grid > figure, .about-grid > div > *, .review-grid > div:first-child > *, .quotes > *, .services > .wrap > .eyebrow, .services > .wrap > h2, .service-grid > article, .location-grid > div:first-child > *, .address-panel, .gallery-heading > *, .gallery-mosaic > figure, .menu-heading > div > *, .menu-drawer-toggle, .menu-group, .footer-top > *');
  const reveal = new IntersectionObserver(entries => {
    const entering = entries.filter(entry => entry.isIntersecting && !revealed.has(entry.target));
    entering.forEach((entry, i) => {
      reveal.unobserve(entry.target);
      enter(entry.target, Math.min(i * 100, 300));
    });
  }, { threshold: .08, rootMargin: '0px 0px -28px 0px' });
  targets.forEach(el => {
    // Animate the smallest content block only, never both it and its ancestor.
    if (![...targets].some(other => other !== el && el.contains(other))) reveal.observe(el);
  });
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
