// Feature 11 — featured cards tilt toward the pointer with a moving glare,
// then spring back with a hand-written damped spring (lib/spring.js).
// Off on touch devices (no meaningful pointer position) and under reduced
// motion. Every property is set via the CSSOM (el.style.setProperty),
// never a style="" attribute, so it works under a strict style-src CSP.

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

  card.addEventListener("pointerenter", () => {
    card.classList.add("is-tilting");
  });

  card.addEventListener("pointermove", (event) => {
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
    card.classList.remove("is-tilting");
    rotX.set(0);
    rotY.set(0);
    ensureLoop();
  });
}

export function init() {
  if (!shouldEnable()) return;
  document.querySelectorAll(".project-card").forEach(wireCard);
}
