// Feature 8 — clicking a filter pill re-flows the archive grid using a
// hand-written FLIP (First, Last, Invert, Play): read every visible tile's
// position before the filter changes, apply the filter, read the new
// positions, then animate from old to new by starting each tile
// transformed back to where it used to be and transitioning that away.
// Tiles that newly appear fade + scale in instead of flying from nowhere.

function announceCount(countEl, filter, n) {
  if (filter === "All") {
    countEl.textContent = `${n} project${n === 1 ? "" : "s"}`;
  } else {
    countEl.textContent = `${n} ${filter.toLowerCase()} project${n === 1 ? "" : "s"}`;
  }
}

export function init() {
  const grid = document.querySelector("[data-archive-grid]");
  const pillsContainer = document.querySelector("[data-archive-pills]");
  const countEl = document.querySelector("[data-archive-count]");
  if (!grid || !pillsContainer || !countEl) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function tiles() {
    return [...grid.querySelectorAll(".archive-tile")];
  }

  function applyFilter(filter) {
    const before = new Map();
    if (!reduceMotion) {
      tiles().forEach((t) => {
        if (!t.hidden) before.set(t, t.getBoundingClientRect());
      });
    }

    tiles().forEach((t) => {
      const tags = t.dataset.tags.split(",");
      t.hidden = !(filter === "All" || tags.includes(filter));
    });

    const visible = tiles().filter((t) => !t.hidden);
    announceCount(countEl, filter, visible.length);

    if (reduceMotion) return;

    visible.forEach((t) => {
      const first = before.get(t);
      t.style.transition = "none";
      if (!first) {
        t.style.opacity = "0";
        t.style.transform = "scale(0.92)";
        requestAnimationFrame(() => {
          t.style.transition = "opacity 280ms var(--ease-out), transform 280ms var(--ease-out)";
          t.style.opacity = "1";
          t.style.transform = "none";
        });
        return;
      }
      const last = t.getBoundingClientRect();
      const dx = first.left - last.left;
      const dy = first.top - last.top;
      if (!dx && !dy) return;
      t.style.transform = `translate(${dx}px, ${dy}px)`;
      requestAnimationFrame(() => {
        t.style.transition = "transform 320ms var(--ease-out)";
        t.style.transform = "none";
      });
    });
  }

  pillsContainer.addEventListener("click", (event) => {
    const btn = event.target.closest(".filter-pill");
    if (!btn) return;
    pillsContainer.querySelectorAll(".filter-pill").forEach((p) => p.setAttribute("aria-pressed", String(p === btn)));
    applyFilter(btn.dataset.filter);
  });
}
