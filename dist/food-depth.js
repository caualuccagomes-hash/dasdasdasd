/* Interruptible spring tilt on food only. No perpetual movement. */
(() => {
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('.dish figure').forEach((figure, index) => {
    const image = figure.querySelector('img');
    if (!image) return;
    const state = { x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0, lift: 0, vl: 0, targetLift: 0 };
    const restRotation = [-3, 2, -2][index] || 0;
    const restDepth = index === 1 ? 48 : 34;
    let frame = 0, previous = 0;
    function reset() {
      cancelAnimationFrame(frame); frame = previous = 0;
      Object.keys(state).forEach(key => { state[key] = 0; });
      image.style.removeProperty('transform');
    }
    function step(now) {
      frame = 0;
      if (reduced.matches || !fine.matches || document.hidden) { reset(); return; }
      const dt = previous ? Math.min((now - previous) / 1000, .032) : .016;
      previous = now;
      // Spring: mass 1, stiffness 100, damping 10.
      for (const [value, velocity, target] of [['x', 'vx', 'tx'], ['y', 'vy', 'ty'], ['lift', 'vl', 'targetLift']]) {
        state[velocity] += ((state[target] - state[value]) * 100 - state[velocity] * 10) * dt;
        state[value] += state[velocity] * dt;
      }
      image.style.transform = `translate3d(${state.x * 1.1}px,${-8 - state.lift * 9 + state.y * .5}px,${restDepth + state.lift * 24}px) rotateX(${-state.y}deg) rotateY(${state.x}deg) rotateZ(${restRotation + state.x * .15}deg) scale(1.04)`;
      const unsettled = Math.abs(state.x - state.tx) + Math.abs(state.y - state.ty) + Math.abs(state.lift - state.targetLift) + Math.abs(state.vx) + Math.abs(state.vy) + Math.abs(state.vl) > .025;
      if (unsettled) frame = requestAnimationFrame(step);
      else { previous = 0; if (!state.targetLift) image.style.removeProperty('transform'); }
    }
    function start() { if (!frame) frame = requestAnimationFrame(step); }
    figure.addEventListener('pointermove', event => {
      if (event.pointerType !== 'mouse' || !fine.matches || reduced.matches) return;
      const rect = figure.getBoundingClientRect();
      state.tx = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1)) * 7;
      state.ty = Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1)) * 5;
      state.targetLift = 1; start();
    }, { passive: true });
    figure.addEventListener('pointerleave', () => { state.tx = state.ty = state.targetLift = 0; start(); });
    reduced.addEventListener('change', reset); fine.addEventListener('change', reset);
    document.addEventListener('visibilitychange', reset); window.addEventListener('blur', reset);
  });
})();
