// Feature 5 — headings decrypt from random glyphs into real text as they
// scroll into view. The real words live in a visually-hidden span the
// whole time (that's the heading's accessible name — screen readers never
// see the scramble); a sibling aria-hidden span carries the visual glyph
// effect via the shared scramble helper. Deliberately not an aria-label:
// a label whose value doesn't match the currently-rendered visible text
// (true for most of this animation) fails the "label matches visible
// text" accessibility check — a real, hidden text node sidesteps that
// because it's simply never the visible content a sighted user reads.

import { scrambledPlaceholder, decryptInto } from "../lib/scramble.js";

export function init() {
  const headings = document.querySelectorAll("[data-decrypt]");
  if (!headings.length) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  headings.forEach((heading) => {
    const realText = heading.textContent.trim();

    const a11yText = document.createElement("span");
    a11yText.className = "visually-hidden";
    a11yText.textContent = realText;

    const visual = document.createElement("span");
    visual.setAttribute("aria-hidden", "true");
    visual.textContent = reduceMotion ? realText : scrambledPlaceholder(realText);

    heading.textContent = "";
    heading.append(a11yText, visual);

    if (reduceMotion) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          decryptInto(visual, realText, { duration: 600 });
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.6 }
    );
    io.observe(heading);
  });
}
