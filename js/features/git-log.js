// Feature 7 — experience rendered as a git log on the About page.
//
// Each entry in EXPERIENCE (data/content.js) becomes a commit: a real
// 7-character hash (truncated SHA-1 of the entry's own text, via Web
// Crypto — see lib/hash.js), a branch-coloured leadership/volunteering
// tag, and "role @ organisation" as the commit message. The Who Is
// Hussain? entries render as their own branch, indented off the trunk.
// Clicking a commit expands it, like `git show`.
//
// The list itself renders synchronously with a placeholder hash — hashing
// is async (Web Crypto), and awaiting it before the first render used to
// leave the whole section at 0 height until it resolved, then pop the full
// list in at once (a huge, measured layout shift). Each hash is patched in
// once its own digest resolves, which only ever changes a fixed-width
// 7-character string in place — never the page's layout.
//
// The branch line "drawing itself" as you scroll is a motion-pass addition
// (an IntersectionObserver growing the ::before line's height); the log
// itself is fully readable without it.

import { EXPERIENCE } from "../../data/content.js";
import { shortCommitHash } from "../lib/hash.js";

// Seven ordinary digits — not e.g. em-dashes — deliberately: this font may
// substitute a non-monospaced fallback glyph for characters it doesn't
// carry, and a placeholder narrower or wider than a real hex hash would
// itself cause a layout shift the moment the real hash swaps in.
const PLACEHOLDER_HASH = "0000000";

function commitSourceText(entry) {
  return `${entry.role} @ ${entry.org}\n${entry.body}`;
}

function renderCommit(entry) {
  const li = document.createElement("li");
  li.className = `git-commit branch-${entry.branch}`;
  li.dataset.commitId = entry.id;

  const header = document.createElement("button");
  header.type = "button";
  header.className = "git-commit-header";
  header.setAttribute("aria-expanded", "false");
  header.innerHTML = `
    <span class="git-hash" data-hash>${PLACEHOLDER_HASH}</span>
    <span class="git-tag tag-${entry.tag}">${entry.tag}</span>
    <span class="git-message">${entry.role} @ ${entry.org}</span>
    ${entry.year ? `<span class="git-year">${entry.year}</span>` : ""}
  `;

  const body = document.createElement("p");
  body.className = "git-commit-body";
  body.textContent = entry.body;
  body.id = `commit-body-${entry.id}`;
  header.setAttribute("aria-controls", body.id);

  header.addEventListener("click", () => {
    const expanded = li.classList.toggle("is-expanded");
    header.setAttribute("aria-expanded", String(expanded));
  });

  li.append(header, body);
  return li;
}

export function init() {
  const list = document.querySelector("[data-git-log]");
  if (!list) return;

  const main = EXPERIENCE.filter((e) => e.branch === "main");
  const whoIsHussain = EXPERIENCE.filter((e) => e.branch === "who-is-hussain").slice().reverse();
  const ordered = [...main, ...whoIsHussain];

  const fragment = document.createDocumentFragment();
  const commitEls = ordered.map((entry) => {
    const li = renderCommit(entry);
    fragment.append(li);
    return li;
  });
  list.replaceChildren(fragment);

  ordered.forEach((entry, i) => {
    shortCommitHash(commitSourceText(entry)).then((hash) => {
      commitEls[i].querySelector("[data-hash]").textContent = hash;
    });
  });
}
