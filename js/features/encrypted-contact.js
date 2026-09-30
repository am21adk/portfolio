// Feature 6 — encrypted contact details on the Contact page.
//
// CONTACT.email/phone (data/content.js) are plain strings in the JS module
// graph — they have to be, so the mailto composer and terminal `contact`
// command can use them — but they are never written into HTML as static
// text. Each button starts showing scrambled glyphs (aria-hidden, so a
// screen reader doesn't try to read garbage), with its accessible name
// coming from a visually-hidden sibling span, not an aria-label — a label
// whose text isn't contained in the visible content fails the "label
// matches visible text" accessibility check, and scrambled glyphs can
// never contain a fixed label. Hover, focus or tap decrypts the glyphs
// into the real text and updates that hidden span to the real value. A
// page scraper reading static HTML, or view-source, never sees either
// address; a bot that executes JS and waits for a hover is getting
// nothing this site wouldn't give a human anyway.

import { CONTACT } from "../../data/content.js";
import { scrambledPlaceholder, decryptInto } from "../lib/scramble.js";
import { showToast } from "../lib/toast.js";

function wireReveal(button, label, realText) {
  const glyphSpan = button.querySelector("[data-glyphs]");
  glyphSpan.textContent = scrambledPlaceholder(realText);

  const a11yName = document.createElement("span");
  a11yName.className = "visually-hidden";
  a11yName.textContent = `Reveal ${label}`;
  button.prepend(a11yName);

  let revealed = false;

  function reveal() {
    if (revealed) return;
    revealed = true;
    decryptInto(glyphSpan, realText, {
      onDone: () => {
        a11yName.textContent = realText;
      },
    });
  }

  button.addEventListener("mouseenter", reveal);
  button.addEventListener("focus", reveal);
  button.addEventListener("touchstart", reveal, { passive: true });
}

function wireCopy(button, label, realText) {
  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(realText);
      showToast(`Copied ${label} to clipboard`);
    } catch {
      showToast(`Copy failed — here it is: ${realText}`);
    }
  });
}

export function init() {
  const emailReveal = document.querySelector('[data-reveal-secret="email"]');
  const phoneReveal = document.querySelector('[data-reveal-secret="phone"]');
  const emailCopy = document.querySelector('[data-copy-secret="email"]');
  const phoneCopy = document.querySelector('[data-copy-secret="phone"]');

  if (emailReveal) wireReveal(emailReveal, "email address", CONTACT.email);
  if (phoneReveal) wireReveal(phoneReveal, "phone number", CONTACT.phone);
  if (emailCopy) wireCopy(emailCopy, "email", CONTACT.email);
  if (phoneCopy) wireCopy(phoneCopy, "phone number", CONTACT.phone);
}
