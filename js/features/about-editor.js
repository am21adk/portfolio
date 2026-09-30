// Feature 2 — the AboutMe.js editor on the About page.
//
// Renders a genuine `const amir = {...}` object as source text (built from
// ABOUT_ME_CODE in data/content.js, so editing that object is all that's
// needed to change what the editor shows), syntax-highlights it with the
// hand-written tokenizer in lib/tokenizer.js, and wires the "Run" button to
// print a pretty-printed version of the *real* object into an output pane —
// never `eval`, just JSON.stringify on the object Amir already has in memory.
//
// Lines type in one at a time, once the panel scrolls into view: each line
// is typed as plain text character-by-character, then swapped for its
// syntax-highlighted HTML the instant it finishes (re-tokenizing on every
// keystroke would be wasted work for something on screen for a few
// milliseconds). Under reduced motion every line just appears immediately,
// already highlighted — the no-JS/no-animation state this always rendered
// before this feature existed.

import { ABOUT_ME_CODE } from "../../data/content.js";
import { highlightLineHTML } from "../lib/tokenizer.js";

const CHAR_MS = 10;
const LINE_GAP_MS = 60;

function quote(value) {
  return `"${String(value).replace(/"/g, '\\"')}"`;
}

function arrayLiteral(values) {
  return `[${values.map(quote).join(", ")}]`;
}

function buildSourceLines(data) {
  return [
    "const amir = {",
    `  name: ${quote(data.name)},`,
    `  role: ${quote(data.role)},`,
    `  based: ${quote(data.based)},`,
    `  education: ${arrayLiteral(data.education)},`,
    `  certifications: ${arrayLiteral(data.certifications)},`,
    `  languages: ${arrayLiteral(data.languages)},`,
    `  currently: ${arrayLiteral(data.currently)},`,
    `  linkedin: ${quote(data.linkedin)},`,
    `  instagram: ${quote(data.instagram)},`,
    "};",
    "",
    "// prints the object above, exactly as it is",
    "console.log(amir);",
  ];
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function typeLines(gutter, code, lines) {
  const gutterLines = [];
  for (let i = 0; i < lines.length; i++) {
    const num = document.createElement("div");
    num.className = "editor-line";
    num.textContent = "";
    gutter.append(num);
    gutterLines.push(num);

    const lineEl = document.createElement("div");
    lineEl.className = "editor-line";
    code.append(lineEl);

    const text = lines[i];
    for (let c = 0; c <= text.length; c++) {
      lineEl.textContent = text.slice(0, c);
      if (c === 0 && text.length === 0) break;
      await sleep(CHAR_MS);
    }
    lineEl.innerHTML = highlightLineHTML(text) || "&nbsp;";
    num.textContent = String(i + 1);
    await sleep(LINE_GAP_MS);
  }
}

function renderInstant(gutter, code, lines) {
  gutter.innerHTML = lines.map((_, i) => `<div class="editor-line">${i + 1}</div>`).join("");
  code.innerHTML = lines.map((line) => `<div class="editor-line">${highlightLineHTML(line) || "&nbsp;"}</div>`).join("");
}

export function init() {
  const panel = document.querySelector(".editor");
  const gutter = document.querySelector("[data-editor-gutter]");
  const code = document.querySelector("[data-editor-code]");
  const runBtn = document.querySelector("[data-editor-run]");
  const output = document.querySelector("[data-editor-output]");
  if (!code || !gutter) return;

  const lines = buildSourceLines(ABOUT_ME_CODE);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion || !panel) {
    renderInstant(gutter, code, lines);
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          io.unobserve(entry.target);
          typeLines(gutter, code, lines);
        });
      },
      { threshold: 0.3 }
    );
    io.observe(panel);
  }

  if (runBtn && output) {
    runBtn.addEventListener("click", () => {
      const isOpen = output.classList.toggle("is-open");
      runBtn.setAttribute("aria-expanded", String(isOpen));
      if (isOpen) {
        output.textContent = JSON.stringify(ABOUT_ME_CODE, null, 2);
      }
    });
  }
}
