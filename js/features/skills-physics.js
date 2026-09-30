// Feature 12 — "Break it" drops the skill pills out of their marquees into
// a pile with hand-written 2D physics: gravity, wall/floor collisions, and
// pairwise circle-approximated collision between pills. Pills can be
// dragged (pointer events) and thrown — releasing mid-drag carries the
// last measured velocity into the simulation. "Tidy up" fades the physics
// copies out; the marquees were never actually stopped underneath (their
// CSS animation keeps running while hidden), so they're exactly where
// they'd naturally be when revealed again.
//
// Every pill stays a real, focusable, labelled control — Enter/Space gives
// it a small random impulse — so keyboard users get *something* physical
// to do even though free-form dragging is inherently pointer/touch-only.

const GRAVITY = 0.55;
const AIR_FRICTION = 0.995;
const WALL_RESTITUTION = 0.55;
const FLOOR_RESTITUTION = 0.45;
const GROUND_FRICTION = 0.92;

export function init() {
  const breakBtn = document.querySelector("[data-skills-break]");
  const tidyBtn = document.querySelector("[data-skills-tidy]");
  const stage = document.querySelector("[data-physics-stage]");
  const rows = document.querySelectorAll(".marquee-row");
  if (!breakBtn || !tidyBtn || !stage || !rows.length) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let pills = [];
  let rafId = null;
  let running = false;

  function sourcePills() {
    // Each marquee track renders its pill list twice back-to-back for a
    // seamless CSS loop — only take the first half so we don't spawn two
    // physics bodies per skill.
    const out = [];
    rows.forEach((row) => {
      const track = row.querySelector(".marquee-track");
      const all = [...track.querySelectorAll(".pill")];
      all.slice(0, all.length / 2).forEach((el) => out.push(el));
    });
    return out;
  }

  function wireDrag(body) {
    const { el } = body;
    el.addEventListener("pointerdown", (event) => {
      body.dragging = true;
      el.setPointerCapture(event.pointerId);
      let lastX = event.clientX;
      let lastY = event.clientY;
      let lastT = performance.now();

      function onMove(ev) {
        const now = performance.now();
        const dt = Math.max(now - lastT, 1);
        const dx = ev.clientX - lastX;
        const dy = ev.clientY - lastY;
        body.x += dx;
        body.y += dy;
        body.vx = (dx / dt) * 16;
        body.vy = (dy / dt) * 16;
        lastX = ev.clientX;
        lastY = ev.clientY;
        lastT = now;
        el.style.transform = `translate(${body.x}px, ${body.y}px)`;
      }
      function onUp() {
        body.dragging = false;
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerup", onUp);
      }
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerup", onUp);
    });

    el.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      body.vx += (Math.random() - 0.5) * 10;
      body.vy -= 8 + Math.random() * 4;
    });
  }

  function breakIt() {
    if (running) return;
    stage.classList.add("is-active");
    stage.removeAttribute("aria-hidden");
    const stageRect = stage.getBoundingClientRect();

    pills = sourcePills().map((source) => {
      const r = source.getBoundingClientRect();
      const clone = source.cloneNode(true);
      clone.className = "pill";
      clone.style.position = "absolute";
      clone.style.left = "0";
      clone.style.top = "0";
      clone.style.margin = "0";
      clone.setAttribute("tabindex", "0");
      clone.setAttribute("aria-label", `${source.textContent} — press Enter to flick it`);
      stage.appendChild(clone);

      const body = {
        el: clone,
        x: r.left - stageRect.left,
        y: r.top - stageRect.top,
        w: r.width,
        h: r.height,
        radius: r.height / 2,
        vx: (Math.random() - 0.5) * 3,
        vy: 0,
        dragging: false,
      };
      wireDrag(body);
      return body;
    });

    rows.forEach((row) => (row.style.visibility = "hidden"));
    breakBtn.hidden = true;
    tidyBtn.hidden = false;
    tidyBtn.focus();
    running = true;

    if (reduceMotion) {
      // Lay them out in a static grid instead of simulating — the point
      // (skills come apart, then tidy up) still reads without motion.
      layoutStatic(stageRect);
    } else {
      rafId = requestAnimationFrame(step);
    }
  }

  function layoutStatic(stageRect) {
    const perRow = Math.floor(stageRect.width / 140) || 1;
    pills.forEach((p, i) => {
      p.x = (i % perRow) * 140 + 12;
      p.y = Math.floor(i / perRow) * 44 + 12;
      p.el.style.transform = `translate(${p.x}px, ${p.y}px)`;
    });
  }

  function step() {
    const stageRect = stage.getBoundingClientRect();
    const W = stageRect.width;
    const H = stageRect.height;

    pills.forEach((p) => {
      if (p.dragging) return;
      p.vy += GRAVITY;
      p.vx *= AIR_FRICTION;
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) { p.x = 0; p.vx *= -WALL_RESTITUTION; }
      if (p.x + p.w > W) { p.x = W - p.w; p.vx *= -WALL_RESTITUTION; }
      if (p.y < 0) { p.y = 0; p.vy *= -WALL_RESTITUTION; }
      if (p.y + p.h > H) {
        p.y = H - p.h;
        p.vy *= -FLOOR_RESTITUTION;
        p.vx *= GROUND_FRICTION;
        if (Math.abs(p.vy) < 0.6) p.vy = 0;
      }
    });

    for (let i = 0; i < pills.length; i++) {
      for (let j = i + 1; j < pills.length; j++) {
        const a = pills[i];
        const b = pills[j];
        if (a.dragging || b.dragging) continue;
        const acx = a.x + a.w / 2;
        const acy = a.y + a.h / 2;
        const bcx = b.x + b.w / 2;
        const bcy = b.y + b.h / 2;
        const dx = bcx - acx;
        const dy = bcy - acy;
        const dist = Math.hypot(dx, dy) || 0.001;
        const minDist = a.radius + b.radius;
        if (dist >= minDist) continue;

        const overlap = (minDist - dist) / 2;
        const nx = dx / dist;
        const ny = dy / dist;
        a.x -= nx * overlap;
        a.y -= ny * overlap;
        b.x += nx * overlap;
        b.y += ny * overlap;

        const avn = a.vx * nx + a.vy * ny;
        const bvn = b.vx * nx + b.vy * ny;
        const diff = (bvn - avn) * 0.6;
        a.vx += diff * nx;
        a.vy += diff * ny;
        b.vx -= diff * nx;
        b.vy -= diff * ny;
      }
    }

    pills.forEach((p) => {
      if (!p.dragging) p.el.style.transform = `translate(${p.x}px, ${p.y}px)`;
    });

    rafId = requestAnimationFrame(step);
  }

  function tidyUp() {
    if (!running) return;
    running = false;
    if (rafId) cancelAnimationFrame(rafId);

    pills.forEach((p) => {
      p.el.style.transition = `opacity ${reduceMotion ? 1 : 260}ms ease, transform ${reduceMotion ? 1 : 260}ms ease`;
      p.el.style.opacity = "0";
    });

    setTimeout(() => {
      pills.forEach((p) => p.el.remove());
      pills = [];
      stage.classList.remove("is-active");
      stage.setAttribute("aria-hidden", "true");
      rows.forEach((row) => (row.style.visibility = ""));
      breakBtn.hidden = false;
      tidyBtn.hidden = true;
      breakBtn.focus();
    }, reduceMotion ? 0 : 280);
  }

  breakBtn.addEventListener("click", breakIt);
  tidyBtn.addEventListener("click", tidyUp);
}
