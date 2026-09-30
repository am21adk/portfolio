// Feature 3 — prints an ASCII AMA monogram to the DevTools console on load
// and exposes window.amir with a few methods a curious developer can call.

import { formatHelp, formatProjects, formatExperience, formatContact, formatHire } from "../lib/site-info.js";

const ASCII_MONOGRAM = String.raw`
   ▄▄▄▄    ▄▄▄▄    ▄▄▄▄
  ██  ██  ██  ██  ██  ██
  ██▀▀██  ██▄▄██  ██▀▀██
  ▀▀  ▀▀  ██  ██  ▀▀  ▀▀
`;

export function init() {
  console.log("%c" + ASCII_MONOGRAM, "color:#fff;font-family:monospace;");
  console.log(
    "%cHey, curious developer 👋 Type amir.help() to look around.",
    "color:#8a8a8a;font-family:monospace;font-size:13px;"
  );

  window.amir = {
    help: () => console.log(formatHelp()),
    projects: () => console.log(formatProjects()),
    experience: () => console.log(formatExperience()),
    contact: () => console.log(formatContact()),
    hire: () => console.log(formatHire()),
  };
}
