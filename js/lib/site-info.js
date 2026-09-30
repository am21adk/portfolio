// Plain-text formatters shared by the console easter egg (window.amir) and
// the terminal overlay, so `amir.projects()` in the DevTools console and
// `projects` in the terminal print the same thing from the same data.

import { PERSON, CONTACT, SOCIALS, FEATURED_PROJECTS, EXPERIENCE, SKILLS, EDUCATION, CERTIFICATIONS } from "../../data/content.js";

export function formatHelp() {
  return [
    "Amir Mashallah Ali — Programmer & Mobile Developer",
    "",
    "Try: amir.projects(), amir.experience(), amir.contact(), amir.hire()",
  ].join("\n");
}

export function formatProjects() {
  return FEATURED_PROJECTS.map((p) => `• ${p.name} — ${p.summary} (${p.liveUrl || p.appStore})`).join("\n");
}

export function formatExperience() {
  return EXPERIENCE.filter((e) => e.branch === "main")
    .map((e) => `• ${e.role} @ ${e.org}`)
    .join("\n");
}

export function formatSkills() {
  return [`Build: ${SKILLS.build.join(", ")}`, "", `Secure: ${SKILLS.secure.join(", ")}`].join("\n");
}

export function formatEducation() {
  return [
    ...EDUCATION.map((e) => `${e.qualification} — ${e.grade}, ${e.institution}`),
    ...CERTIFICATIONS.map((c) => `${c.name} (${c.issuer})`),
  ].join("\n");
}

export function formatContact() {
  return [`Email: ${CONTACT.email}`, `Phone: ${CONTACT.phone}`, ...SOCIALS.map((s) => `${s.name}: ${s.url}`)].join("\n");
}

export function formatHire() {
  return `${PERSON.name} is open to full-stack and mobile roles. Start with ${CONTACT.email} or /contact.`;
}
