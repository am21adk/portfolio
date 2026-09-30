// Feature 4 — the full-screen terminal overlay, opened with the backtick
// key or the >_ button in the nav. Built entirely at runtime (the HTML just
// has an empty, hidden container) so it costs nothing on a page where it's
// never opened.
//
// Command history persists across page loads via sessionStorage, so
// `history` (and ↑/↓ recall) survives a `cd` to another page in the same
// tab session.

import { FEATURED_PROJECTS } from "../../data/content.js";
import {
  formatHelp,
  formatProjects,
  formatExperience,
  formatSkills,
  formatEducation,
  formatContact,
} from "../lib/site-info.js";
import { sha256Hex } from "../lib/hash.js";
import { closestMatch } from "../lib/levenshtein.js";

const PAGES = { home: "/", about: "/about", projects: "/projects", contact: "/contact" };
const COMMANDS = [
  "help", "whoami", "ls", "cd", "about", "projects", "open", "experience",
  "skills", "education", "certs", "contact", "socials", "cv", "hash",
  "date", "history", "clear", "exit",
];
const HISTORY_KEY = "terminal-history";

function loadHistory() {
  try {
    return JSON.parse(sessionStorage.getItem(HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
}
function saveHistory(list) {
  try {
    sessionStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(-50)));
  } catch {
    /* sessionStorage unavailable (private mode) — history just won't persist */
  }
}

export function init() {
  const overlay = document.querySelector("[data-terminal]");
  const openTriggers = document.querySelectorAll("[data-open-terminal]");
  if (!overlay) return;

  overlay.innerHTML = `
    <div class="terminal-header-row">
      <span>Terminal — type 'help'</span>
      <button type="button" class="terminal-close-btn" data-terminal-close aria-label="Close terminal">✕</button>
    </div>
    <div class="terminal-log" role="log" aria-live="polite" data-terminal-log></div>
    <div class="terminal-input-row">
      <span aria-hidden="true">amir@portfolio:~$</span>
      <input type="text" data-terminal-input aria-label="Terminal command input" autocomplete="off" autocapitalize="off" spellcheck="false">
    </div>
  `;

  const log = overlay.querySelector("[data-terminal-log]");
  const input = overlay.querySelector("[data-terminal-input]");
  const closeBtn = overlay.querySelector("[data-terminal-close]");

  let history = loadHistory();
  let historyCursor = history.length;
  let awaitingPassword = false;
  let lastFocused = null;

  function print(text, { echo = false } = {}) {
    const line = document.createElement("div");
    line.className = `terminal-line${echo ? " is-echo" : ""}`;
    line.textContent = text;
    log.append(line);
    log.scrollTop = log.scrollHeight;
  }

  function printBlock(text) {
    text.split("\n").forEach((l) => print(l));
  }

  function open() {
    lastFocused = document.activeElement;
    overlay.hidden = false;
    input.value = "";
    input.focus();
    if (!log.childElementCount) {
      printBlock("Amir's portfolio terminal. Type 'help' to see what's here.");
    }
  }

  function close() {
    overlay.hidden = true;
    awaitingPassword = false;
    input.type = "text";
    lastFocused?.focus();
  }

  function runMatrix() {
    const canvas = document.createElement("canvas");
    canvas.className = "terminal-canvas";
    overlay.append(canvas);
    const ctx = canvas.getContext("2d");
    canvas.width = overlay.clientWidth;
    canvas.height = overlay.clientHeight;

    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = new Array(columns).fill(1);
    const glyphs = "01アイウエオカキクケコ";

    let frames = 0;
    const maxFrames = 160; // ~4s at ~40fps via setInterval below

    const timer = setInterval(() => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#3ddc71";
      ctx.font = `${fontSize}px monospace`;
      drops.forEach((y, i) => {
        const char = glyphs[(Math.random() * glyphs.length) | 0];
        ctx.fillText(char, i * fontSize, y * fontSize);
        if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i] += 1;
      });
      frames += 1;
      if (frames >= maxFrames) {
        clearInterval(timer);
        canvas.remove();
        print("(connection to the matrix closed)");
      }
    }, 33);
  }

  function runMeltdown() {
    const lines = [
      "rm: descending into '/'",
      "rm: removing '/etc'... permission denied (obviously)",
      "rm: removing '/home'... nope",
      "rm: removing '/'... this isn't happening",
      "",
      "Just kidding — nothing was deleted. This is a portfolio, not a shell.",
    ];
    lines.forEach((l, i) => setTimeout(() => print(l), i * 220));
  }

  const handlers = {
    help: () => formatHelp() + "\n\nCommands: " + COMMANDS.join(", "),
    whoami: () => "amir — programmer, mobile developer, cyber security MSc",
    ls: () => Object.keys(PAGES).join("  "),
    cd: (args) => {
      const target = args[0]?.toLowerCase();
      if (!target || !(target in PAGES)) return `cd: no such page: ${args[0] || ""}`;
      location.href = PAGES[target];
      return `Heading to ${PAGES[target]}…`;
    },
    about: () => "Programmer & Mobile Developer, London. See /about for the full picture.",
    projects: () => FEATURED_PROJECTS.map((p, i) => `${i + 1}. ${p.name} — ${p.summary}`).join("\n"),
    open: (args) => {
      const n = Number(args[0]);
      const project = FEATURED_PROJECTS[n - 1];
      if (!project) return `open: no project #${args[0] || ""}. Try 'projects' to list them.`;
      const url = project.liveUrl || project.appStore;
      window.open(url, "_blank", "noopener,noreferrer");
      return `Opening ${project.name}…`;
    },
    experience: () => formatExperience(),
    skills: () => formatSkills(),
    education: () => formatEducation(),
    certs: () => formatEducation(),
    contact: () => formatContact(),
    socials: () => formatContact(),
    cv: () => {
      window.open("/assets/cv.pdf", "_blank", "noopener,noreferrer");
      return "Opening CV…";
    },
    hash: async (args) => {
      if (!args.length) return "usage: hash <text>";
      const text = args.join(" ");
      return `sha256: ${await sha256Hex(text)}`;
    },
    date: () => new Intl.DateTimeFormat("en-GB", { dateStyle: "full", timeStyle: "long", timeZone: "Europe/London" }).format(new Date()),
    history: () => history.map((h, i) => `${i + 1}  ${h}`).join("\n") || "(empty)",
    clear: () => {
      log.innerHTML = "";
      return null;
    },
    exit: () => {
      close();
      return null;
    },
  };

  async function runCommand(raw) {
    const trimmed = raw.trim();
    if (!trimmed) return;

    print(trimmed, { echo: true });
    history.push(trimmed);
    saveHistory(history);
    historyCursor = history.length;

    if (trimmed === "rm -rf /") return runMeltdown();
    if (trimmed === "matrix") return runMatrix();
    if (/^sudo\b/.test(trimmed)) return print("Nice try. This incident will be reported.");
    if (trimmed === "ssh amir@portfolio") {
      print("Password:");
      awaitingPassword = true;
      input.type = "password";
      return;
    }
    const [cmd, ...args] = trimmed.split(/\s+/);
    const handler = handlers[cmd.toLowerCase()];
    if (!handler) {
      const { match, distance } = closestMatch(cmd.toLowerCase(), COMMANDS);
      print(distance <= 3 ? `command not found: ${cmd} — did you mean '${match}'?` : `command not found: ${cmd}`);
      return;
    }
    const result = await handler(args);
    if (result) printBlock(result);
  }

  input.addEventListener("keydown", (event) => {
    if (awaitingPassword) {
      if (event.key === "Enter") {
        event.preventDefault();
        input.type = "text";
        input.value = "";
        awaitingPassword = false;
        print("Access denied. Nice try — I have an MSc in this.");
      }
      if (event.key === "c" && event.ctrlKey) {
        input.type = "text";
        input.value = "";
        awaitingPassword = false;
        print("(cancelled)");
      }
      return;
    }

    if (event.key === "Enter") {
      const value = input.value;
      input.value = "";
      runCommand(value);
      return;
    }
    if (event.key === "l" && event.ctrlKey) {
      event.preventDefault();
      log.innerHTML = "";
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (historyCursor > 0) historyCursor -= 1;
      input.value = history[historyCursor] || "";
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (historyCursor < history.length) historyCursor += 1;
      input.value = history[historyCursor] || "";
    }
    if (event.key === "Tab") {
      // Plain Tab autocompletes when there's something to complete; Shift+Tab,
      // or plain Tab on an empty line, moves to the close button instead —
      // this overlay only has two focusable elements, so that's the whole
      // focus trap.
      event.preventDefault();
      if (event.shiftKey) {
        closeBtn.focus();
        return;
      }
      const partial = input.value.trim().toLowerCase();
      if (!partial) {
        closeBtn.focus();
        return;
      }
      const matches = COMMANDS.filter((c) => c.startsWith(partial));
      if (matches.length === 1) input.value = matches[0] + " ";
      else if (matches.length > 1) print(matches.join("  "));
    }
    if (event.key === "Escape") {
      close();
    }
  });

  closeBtn.addEventListener("click", close);
  closeBtn.addEventListener("keydown", (event) => {
    if (event.key === "Tab") {
      event.preventDefault();
      input.focus();
    }
  });

  openTriggers.forEach((btn) => btn.addEventListener("click", open));

  document.addEventListener("keydown", (event) => {
    if (event.key !== "`") return;
    const tag = document.activeElement?.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") return;
    event.preventDefault();
    overlay.hidden ? open() : close();
  });
}
