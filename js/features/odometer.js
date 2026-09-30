// Feature 9 — the stats strip counts up digit by digit when it scrolls
// into view, like an odometer. content-render.js already puts the final
// value in each element (so it's correct with JS disabled or before this
// runs); this just animates from 0 up to that value once, per element.

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function animateValue(el, target, duration) {
  const prefix = el.dataset.prefix || "";
  const suffix = el.dataset.suffix || "";
  const start = performance.now();

  function frame(now) {
    const t = Math.min((now - start) / duration, 1);
    const current = Math.round(target * easeOutCubic(t));
    el.textContent = `${prefix}${current.toLocaleString("en-GB")}${suffix}`;
    if (t < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

export function init() {
  const nodes = document.querySelectorAll("[data-odometer]");
  if (!nodes.length) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        animateValue(el, Number(el.dataset.value), 1400);
        io.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );
  nodes.forEach((el) => io.observe(el));
}
