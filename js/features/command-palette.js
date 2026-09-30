// Feature 13 — Ctrl/Cmd+K command palette. Actions are a flat static list;
// fuzzy-match.js (hand-written, no library) ranks them against whatever's
// typed. Arrow keys + Enter to choose, Escape to dismiss.

import { CONTACT, SOCIALS, FEATURED_PROJECTS } from "../../data/content.js";
import { fuzzySearch } from "../lib/fuzzy-match.js";
import { showToast } from "../lib/toast.js";

function buildActions() {
  const actions = [
    { label: "Go to Home", run: () => (location.href = "index.html") },
    { label: "Go to Projects", run: () => (location.href = "projects.html") },
    { label: "Go to About", run: () => (location.href = "about.html") },
    { label: "Go to Contact", run: () => (location.href = "contact.html") },
    {
      label: "Copy email address",
      run: async () => {
        await navigator.clipboard.writeText(CONTACT.email);
        showToast("Copied email to clipboard");
      },
    },
    { label: "Download CV", run: () => window.open("assets/cv.pdf", "_blank", "noopener,noreferrer") },
    {
      label: "Open terminal",
      run: () => document.querySelector("[data-open-terminal]")?.click(),
    },
  ];

  FEATURED_PROJECTS.forEach((p) => {
    actions.push({
      label: `Open ${p.name}`,
      run: () => window.open(p.liveUrl || p.appStore, "_blank", "noopener,noreferrer"),
    });
  });

  SOCIALS.forEach((s) => {
    actions.push({ label: `Open ${s.name}`, run: () => window.open(s.url, "_blank", "noopener,noreferrer") });
  });

  return actions;
}

export function init() {
  const backdrop = document.querySelector("[data-command-palette]");
  if (!backdrop) return;

  const actions = buildActions();

  backdrop.innerHTML = `
    <div class="command-palette" role="dialog" aria-modal="true" aria-label="Command palette">
      <input type="text" class="command-palette-input" placeholder="Type a command…" aria-label="Search commands" autocomplete="off">
      <ul class="command-palette-list" role="listbox"></ul>
    </div>
  `;
  const input = backdrop.querySelector(".command-palette-input");
  const list = backdrop.querySelector(".command-palette-list");

  let filtered = actions;
  let activeIndex = 0;
  let lastFocused = null;

  function render() {
    list.innerHTML = filtered
      .map((a, i) => `<li class="command-palette-item" role="option" aria-selected="${i === activeIndex}" id="cmd-${i}">${a.label}</li>`)
      .join("");
    list.querySelectorAll(".command-palette-item").forEach((el, i) => {
      el.addEventListener("mousedown", (e) => {
        e.preventDefault();
        activeIndex = i;
        choose();
      });
    });
    input.setAttribute("aria-activedescendant", filtered.length ? `cmd-${activeIndex}` : "");
  }

  function choose() {
    const action = filtered[activeIndex];
    close();
    action?.run();
  }

  function open() {
    lastFocused = document.activeElement;
    backdrop.hidden = false;
    input.value = "";
    filtered = actions;
    activeIndex = 0;
    render();
    input.focus();
  }

  function close() {
    backdrop.hidden = true;
    lastFocused?.focus();
  }

  input.addEventListener("input", () => {
    filtered = fuzzySearch(input.value, actions, (a) => a.label);
    if (!filtered.length) filtered = [];
    activeIndex = 0;
    render();
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      activeIndex = Math.min(activeIndex + 1, filtered.length - 1);
      render();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      activeIndex = Math.max(activeIndex - 1, 0);
      render();
    } else if (event.key === "Enter") {
      event.preventDefault();
      choose();
    } else if (event.key === "Escape") {
      close();
    } else if (event.key === "Tab") {
      // The list items aren't independently focusable (arrow keys drive
      // selection), so keeping focus on the input is the whole focus trap.
      event.preventDefault();
    }
  });

  backdrop.addEventListener("mousedown", (event) => {
    if (event.target === backdrop) close();
  });

  document.addEventListener("keydown", (event) => {
    const isK = event.key.toLowerCase() === "k";
    if (isK && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      backdrop.hidden ? open() : close();
    }
  });
}
