// Shared "decrypt" text effect: used by features/decrypt-headings.js (every
// heading, on scroll) and features/encrypted-contact.js (email/phone, on
// hover/focus/tap). Resolves a string left-to-right from random glyphs into
// real characters over `duration` ms, driven by requestAnimationFrame so it
// can be cancelled mid-flight (e.g. the pointer leaves before it finishes).

const GLYPHS = "!<>-_\\/[]{}—=+*^?#$%&ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function randomGlyph() {
  return GLYPHS[(Math.random() * GLYPHS.length) | 0];
}

export function scrambledPlaceholder(text) {
  return text.replace(/\S/g, randomGlyph);
}

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Animates `el`'s text content from scrambled glyphs into `realText`,
 * resolving one extra character (left to right) every `duration / length`
 * ms. Returns a cancel function. Whitespace never scrambles, so word
 * spacing doesn't jitter.
 */
export function decryptInto(el, realText, { duration = 600, onDone } = {}) {
  if (prefersReducedMotion()) {
    el.textContent = realText;
    onDone?.();
    return () => {};
  }

  const chars = realText.split("");
  const revealEvery = Math.max(duration / chars.length, 16);
  let revealed = 0;
  let rafId = null;
  let lastStep = performance.now();

  function frame(now) {
    if (now - lastStep >= revealEvery) {
      lastStep = now;
      revealed += 1;
      el.textContent = chars
        .map((ch, i) => {
          if (ch === " ") return " ";
          if (i < revealed) return ch;
          return randomGlyph();
        })
        .join("");
      if (revealed >= chars.length) {
        onDone?.();
        return;
      }
    } else {
      // Still scrambling the not-yet-revealed tail every frame for the
      // flicker effect, without advancing the reveal count.
      el.textContent = chars
        .map((ch, i) => (ch === " " || i < revealed ? ch : randomGlyph()))
        .join("");
    }
    rafId = requestAnimationFrame(frame);
  }

  rafId = requestAnimationFrame(frame);
  return () => rafId !== null && cancelAnimationFrame(rafId);
}
