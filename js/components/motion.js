/* Ambient postcard motion.
   Hero postcards float continuously (CSS keyframes on their wrappers). When a fine pointer moves
   over the stack, each card turns up to 2deg towards the cursor and drifts up to 3px.
   Nothing here runs for touch-only devices or when reduced motion is requested. */
(function () {
  const ME = window.ME;
  const canTilt = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches && !ME.utils.reducedMotion();

  function bind(stack) {
    if (!stack || stack.dataset.motionBound) return;
    stack.dataset.motionBound = '1';
    let frame = 0, px = 0, py = 0;

    const apply = () => {
      frame = 0;
      stack.querySelectorAll('.postcard').forEach(card => {
        const r = card.getBoundingClientRect();
        const dx = px - (r.left + r.width / 2), dy = py - (r.top + r.height / 2);
        const clamp = v => Math.max(-1, Math.min(1, v));
        card.style.setProperty('--orient', `${(clamp(dx / 320) * 2).toFixed(2)}deg`);
        card.style.setProperty('--shift-x', `${(clamp(dx / 320) * 3).toFixed(1)}px`);
        card.style.setProperty('--shift-y', `${(clamp(dy / 320) * 3).toFixed(1)}px`);
      });
    };

    stack.addEventListener('pointermove', e => {
      if (!canTilt()) return;
      px = e.clientX; py = e.clientY;
      if (!frame) frame = requestAnimationFrame(apply);
    });
    stack.addEventListener('pointerleave', () => {
      stack.querySelectorAll('.postcard').forEach(card => {
        card.style.removeProperty('--orient');
        card.style.removeProperty('--shift-x');
        card.style.removeProperty('--shift-y');
      });
    });
  }

  ME.Motion = { bind };
})();
