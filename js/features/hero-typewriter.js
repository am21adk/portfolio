// Hero title (Home only): types out each of PERSON.titles, holds, deletes,
// and moves to the next — a small hand-written state machine driven by
// setTimeout, not a library. Under reduced motion it just shows the first
// title, statically (matching the page's no-JS fallback text).

import { PERSON } from "../../data/content.js";

const TYPE_MS = 55;
const DELETE_MS = 30;
const HOLD_MS = 1400;
const GAP_MS = 300;

export function init() {
  const el = document.querySelector("[data-hero-title]");
  if (!el) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    el.textContent = PERSON.titles[0];
    return;
  }

  const textNode = document.createTextNode(PERSON.titles[0]);
  const cursor = document.createElement("span");
  cursor.className = "cursor-blink";
  cursor.setAttribute("aria-hidden", "true");
  el.textContent = "";
  el.append(textNode, cursor);
  el.setAttribute("aria-live", "off");
  el.setAttribute("role", "text");

  let titleIndex = 0;

  function typeNext() {
    const full = PERSON.titles[titleIndex];
    let i = 0;
    (function typeChar() {
      textNode.textContent = full.slice(0, i);
      if (i < full.length) {
        i += 1;
        setTimeout(typeChar, TYPE_MS);
      } else {
        setTimeout(deleteCurrent, HOLD_MS);
      }
    })();
  }

  function deleteCurrent() {
    const full = PERSON.titles[titleIndex];
    let i = full.length;
    (function deleteChar() {
      textNode.textContent = full.slice(0, i);
      if (i > 0) {
        i -= 1;
        setTimeout(deleteChar, DELETE_MS);
      } else {
        titleIndex = (titleIndex + 1) % PERSON.titles.length;
        setTimeout(typeNext, GAP_MS);
      }
    })();
  }

  setTimeout(deleteCurrent, HOLD_MS);
}
