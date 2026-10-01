// Feature 11 — featured cards tilt toward the pointer with a moving glare,
// then spring back with a hand-written damped spring (lib/spring.js).
// Off on touch devices (no meaningful pointer position) and under reduced
// motion. Every property is set via the CSSOM (el.style.setProperty),
// never a style="" attribute, so it works under a strict style-src CSP.
//
// On Projects, a card is a <details> — once it's open and full of its own
// content (description, screenshots, buttons), tilting the whole expanded
// panel toward the pointer reads as broken rather than delightful, so tilt
// is suspended for as long as that card stays open.

import { createSpring } from "../lib/spring.js";

const MAX_TILT_DEG = 10;

function shouldEnable() {
  const touch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return !touch && !reduceMotion;
}

function wireCard(card) {
  const rotX = createSpring();
  const rotY = createSpring();
  let raf = null;
  let suspended = false;

  function render() {
    rotX.step();
    rotY.step();
    card.style.transform = `rotateX(${rotX.value}deg) rotateY(${rotY.value}deg) translateY(-6px)`;
    if (!rotX.isSettled || !rotY.isSettled) {
      raf = requestAnimationFrame(render);
    } else {
      raf = null;
    }
  }

  function ensureLoop() {
    if (raf === null) raf = requestAnimationFrame(render);
  }

  function reset() {
    card.classList.remove("is-tilting");
    rotX.set(0);
    rotY.set(0);
    ensureLoop();
  }

  card.addEventListener("pointerenter", () => {
    if (suspended) return;
    card.classList.add("is-tilting");
  });

  card.addEventListener("pointermove", (event) => {
    if (suspended) return;
    const rect = card.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width; // 0..1
    const py = (event.clientY - rect.top) / rect.height;
    rotY.set((px - 0.5) * MAX_TILT_DEG * 2);
    rotX.set(-(py - 0.5) * MAX_TILT_DEG * 2);
    card.style.setProperty("--glare-x", `${px * 100}%`);
    card.style.setProperty("--glare-y", `${py * 100}%`);
    ensureLoop();
  });

  card.addEventListener("pointerleave", () => {
    if (suspended) return;
    reset();
  });

  // <details> only — a's on Home never fire this.
  card.addEventListener("toggle", () => {
    suspended = card.open;
    if (suspended) reset();
  });
}

export function init() {
  if (!shouldEnable()) return;
  document.querySelectorAll(".project-card").forEach(wireCard);
}
