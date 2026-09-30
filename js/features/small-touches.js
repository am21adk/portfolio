// Feature 15 — the small touches: the scroll-progress bar, the footer's
// live London clock, the Konami code monogram shatter, and the "Security
// headers: A+" panel that reads this page's own response headers with a
// same-origin HEAD request.

function initScrollProgress() {
  const bar = document.querySelector("[data-scroll-progress]");
  if (!bar) return;
  function update() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    bar.style.width = `${Math.min(100, Math.max(0, pct))}%`;
  }
  document.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
}

function initClock() {
  const el = document.querySelector("[data-london-clock]");
  if (!el) return;
  const formatter = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/London" });
  function tick() {
    el.textContent = `London — ${formatter.format(new Date())}`;
  }
  tick();
  setInterval(tick, 10_000);
}

function initHeadersPanel() {
  const btn = document.querySelector("[data-open-headers-panel]");
  const panel = document.querySelector("[data-headers-panel]");
  if (!btn || !panel) return;

  let loaded = false;

  async function open() {
    panel.hidden = false;
    if (loaded) return;
    loaded = true;
    try {
      const res = await fetch(location.href, { method: "HEAD", cache: "no-store" });
      const rows = [...res.headers.entries()]
        .map(([name, value]) => `<dt>${name}</dt><dd>${value}</dd>`)
        .join("");
      panel.innerHTML = `<p><strong>Response headers for this page</strong></p><dl>${rows}</dl>
        <button type="button" class="footer-headers-link" data-close-headers-panel>Close</button>`;
    } catch {
      panel.innerHTML = `<p>Couldn't read headers from here — try securityheaders.com directly.</p>
        <button type="button" class="footer-headers-link" data-close-headers-panel>Close</button>`;
    }
    panel.querySelector("[data-close-headers-panel]")?.addEventListener("click", () => {
      panel.hidden = true;
    });
  }

  btn.addEventListener("click", () => (panel.hidden ? open() : (panel.hidden = true)));
}

function initKonami() {
  const sequence = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
  let progress = 0;

  document.addEventListener("keydown", (event) => {
    const expected = sequence[progress];
    if (event.key.toLowerCase() === expected.toLowerCase()) {
      progress += 1;
      if (progress === sequence.length) {
        progress = 0;
        shatterMonogram();
      }
    } else {
      progress = event.key === sequence[0] ? 1 : 0;
    }
  });
}

function shatterMonogram() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const monogram = document.querySelector(".nav-monogram");
  if (!monogram) return;

  const rect = monogram.getBoundingClientRect();
  const particles = [];
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.inset = "0";
  container.style.zIndex = "998";
  container.style.pointerEvents = "none";
  document.body.append(container);

  const PARTICLE_COUNT = 36;
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = document.createElement("span");
    p.style.position = "absolute";
    p.style.left = `${rect.left + rect.width / 2}px`;
    p.style.top = `${rect.top + rect.height / 2}px`;
    p.style.width = "4px";
    p.style.height = "4px";
    p.style.background = "#fff";
    p.style.borderRadius = "1px";
    container.append(p);
    particles.push({
      el: p,
      angle: (Math.PI * 2 * i) / PARTICLE_COUNT + Math.random() * 0.3,
      distance: 40 + Math.random() * 90,
    });
  }

  monogram.style.opacity = "0";

  const OUT_MS = 420;
  const start = performance.now();

  function animateOut(now) {
    const t = Math.min((now - start) / OUT_MS, 1);
    particles.forEach((p) => {
      const d = p.distance * t;
      p.el.style.transform = `translate(${Math.cos(p.angle) * d}px, ${Math.sin(p.angle) * d}px)`;
      p.el.style.opacity = String(1 - t * 0.2);
    });
    if (t < 1) {
      requestAnimationFrame(animateOut);
    } else {
      setTimeout(() => requestAnimationFrame(animateIn), 120);
    }
  }

  const inStart = { time: 0 };
  function animateIn(now) {
    if (!inStart.time) inStart.time = now;
    const t = Math.min((now - inStart.time) / OUT_MS, 1);
    particles.forEach((p) => {
      const d = p.distance * (1 - t);
      p.el.style.transform = `translate(${Math.cos(p.angle) * d}px, ${Math.sin(p.angle) * d}px)`;
      p.el.style.opacity = String(1 - t);
    });
    if (t < 1) {
      requestAnimationFrame(animateIn);
    } else {
      container.remove();
      monogram.style.opacity = "1";
    }
  }

  requestAnimationFrame(animateOut);
}

export function init() {
  initScrollProgress();
  initClock();
  initHeadersPanel();
  initKonami();
}
