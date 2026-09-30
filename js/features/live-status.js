// Feature 10 — the pulsing "Live · 84ms" dot on website project cards.
// Timing is real: a no-cors request to the project's own favicon, timed
// with performance.now() (no-cors means we can't read the response body or
// status, only that it resolved — which is exactly what "is it up" needs).
// Only pings while the card is on screen, every 30s, and shows a quiet
// fallback if the request fails (blocked by the visitor's network, CORS,
// an ad blocker, or the site actually being down — this can't tell which,
// so it doesn't guess).

const POLL_MS = 30000;

async function pingOnce(url) {
  const start = performance.now();
  try {
    await fetch(url, { mode: "no-cors", cache: "no-store" });
    return Math.round(performance.now() - start);
  } catch {
    return null;
  }
}

async function refresh(el) {
  const url = el.dataset.statusUrl;
  const dot = el.querySelector(".status-dot");
  const label = el.querySelector("[data-live-status-label]");
  const ms = await pingOnce(url);
  if (ms === null) {
    dot.classList.remove("is-live");
    dot.classList.add("is-down");
    label.textContent = "Unreachable";
  } else {
    dot.classList.add("is-live");
    dot.classList.remove("is-down");
    label.textContent = `Live · ${ms}ms`;
  }
}

export function init() {
  const cards = document.querySelectorAll("[data-live-status]");
  if (!cards.length) return;

  cards.forEach((el) => {
    // Wrap the trailing text in its own span once, so refresh() has a
    // stable node to update without touching the dot.
    const label = document.createElement("span");
    label.dataset.liveStatusLabel = "";
    label.textContent = " Live";
    el.append(label);
  });

  const timers = new Map();

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const el = entry.target;
      if (entry.isIntersecting) {
        refresh(el);
        if (!timers.has(el)) timers.set(el, setInterval(() => refresh(el), POLL_MS));
      } else {
        clearInterval(timers.get(el));
        timers.delete(el);
      }
    });
  }, { threshold: 0.1 });

  cards.forEach((el) => io.observe(el));
}
