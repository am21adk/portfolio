// Static content population, shared by every page. This is deliberately not
// a "feature" module — it just turns data/content.js into DOM once at load,
// so editing that file is enough to change what appears anywhere on the
// site. Interactive behaviour (odometer counting, marquee physics, card
// tilt, live status pings, FLIP filtering…) lives in js/features/ and reads
// the DOM nodes this module creates.

import {
  PERSON,
  SOCIALS,
  FEATURED_PROJECTS,
  ARCHIVE_PROJECTS,
  ARCHIVE_FILTERS,
  STATS,
  SKILLS,
  EDUCATION,
  CERTIFICATIONS,
} from "../data/content.js";
import { iconSVG } from "./lib/icons.js";

export function renderHeroSocials(container) {
  if (!container) return;
  container.innerHTML = SOCIALS.map(
    (s) => `<a href="${s.url}" target="_blank" rel="noopener noreferrer">${iconSVG(s.icon)}<span class="visually-hidden">${s.name}</span></a>`
  ).join("");
  const emailLink = document.createElement("a");
  emailLink.href = "contact.html";
  emailLink.innerHTML = `${iconSVG("email")}<span class="visually-hidden">Email</span>`;
  container.append(emailLink);
}

export function renderHeroBio(el) {
  if (el) el.textContent = PERSON.bio;
}

function statusLineHTML(project) {
  if (project.status === "app") {
    return `<span class="store-badges">
      <span class="store-badge">${iconSVG("apple", { size: 12 })} iOS</span>
      <span class="store-badge">${iconSVG("play", { size: 12 })} Android</span>
    </span>`;
  }
  return `<span class="project-card-status" data-live-status data-status-url="${project.statusCheckUrl}">
    <span class="status-dot is-live"></span> Live
  </span>`;
}

function cardInnerHTML(project) {
  return `
    <div class="project-card-image">
      <img src="${project.logo}" alt="" loading="lazy">
    </div>
    <p class="project-card-name">${project.name}</p>
    <ul class="project-card-meta">
      <li>${project.type}</li>
      <li>${project.stack}</li>
      <li>${statusLineHTML(project)}</li>
    </ul>
  `;
}

/** Home: each card is a plain link to the project's expanded view on Projects. */
export function renderFeaturedLinks(container) {
  if (!container) return;
  container.innerHTML = FEATURED_PROJECTS.map(
    (p) => `
    <li>
      <a class="project-card color-${p.color}" href="projects.html#${p.id}" data-card-id="${p.id}" data-reveal>
        ${cardInnerHTML(p)}
      </a>
    </li>`
  ).join("");
  // Set programmatically (not via a style="" attribute) so a strict
  // style-src CSP with no 'unsafe-inline' still allows it — CSP governs
  // parsed style attributes, not CSSOM property assignment.
  container.querySelectorAll("[data-card-id]").forEach((el) => {
    el.style.viewTransitionName = `card-${el.dataset.cardId}`;
  });
}

/** Projects page: each card is a native <details> — expand/collapse works
 *  with no JS at all; a tiny hash-sync script (see main.js) auto-opens the
 *  one a Home card linked to. */
export function renderFeaturedDetails(container) {
  if (!container) return;
  container.innerHTML = FEATURED_PROJECTS.map((p) => {
    const cta =
      p.status === "app"
        ? `<a class="btn-solid" href="${p.appStore}" target="_blank" rel="noopener noreferrer">${iconSVG("apple", { size: 14 })} App Store</a>
           <a class="btn-solid" href="${p.playStore}" target="_blank" rel="noopener noreferrer">${iconSVG("play", { size: 14 })} Google Play</a>`
        : `<a class="btn-solid" href="${p.cta.url}" target="_blank" rel="noopener noreferrer">${p.cta.label} →</a>`;

    return `
    <details class="project-card color-${p.color}" id="${p.id}" data-card-id="${p.id}" data-reveal>
      <summary>${cardInnerHTML(p)}</summary>
      <div class="project-card-expanded">
        <p>${p.description}</p>
        <ul>${p.highlights.map((h) => `<li>${h}</li>`).join("")}</ul>
        <div class="project-card-gallery">
          ${p.images.map((img) => `<img src="${img.src}" alt="${img.alt}" loading="lazy" width="${img.width}" height="${img.height}">`).join("")}
        </div>
        <div class="project-card-cta">${cta}</div>
      </div>
    </details>`;
  }).join("");
  container.querySelectorAll("[data-card-id]").forEach((el) => {
    el.style.viewTransitionName = `card-${el.dataset.cardId}`;
  });
}

export function renderStats(container) {
  if (!container) return;
  container.innerHTML = STATS.map(
    (s, i) => `
    <div class="stat" data-reveal>
      <p class="stat-value" data-odometer data-value="${s.value}" data-prefix="${s.prefix}" data-suffix="${s.suffix}">${s.prefix}${s.value}${s.suffix}</p>
      <p class="stat-label">${s.label}</p>
    </div>`
  ).join("");
}

export function renderArchive(gridEl, pillsEl, countEl) {
  if (!gridEl || !pillsEl) return;

  pillsEl.innerHTML = ARCHIVE_FILTERS.map(
    (f, i) => `<button type="button" class="filter-pill" data-filter="${f}" aria-pressed="${i === 0}">${f}</button>`
  ).join("");

  gridEl.innerHTML = ARCHIVE_PROJECTS.map(
    (p) => `
    <article class="archive-tile" data-tags="${p.tags.join(",")}">
      <p class="archive-tile-name">${p.name}</p>
      <p class="archive-tile-summary">${p.summary}</p>
      <p class="archive-tile-detail visually-hidden">${p.description}</p>
      <div class="archive-tile-tags">${p.tags.map((t) => `<span class="archive-tile-tag">${t}</span>`).join("")}</div>
    </article>`
  ).join("");

  if (countEl) countEl.textContent = `${ARCHIVE_PROJECTS.length} projects`;
}

function pillsMarkup(items) {
  return items.map((s) => `<span class="pill">${s}</span>`).join("");
}

export function renderSkillsMarquee(row1El, row2El) {
  if (row1El) row1El.innerHTML = pillsMarkup(SKILLS.build) + pillsMarkup(SKILLS.build);
  if (row2El) row2El.innerHTML = pillsMarkup(SKILLS.secure) + pillsMarkup(SKILLS.secure);
}

export function renderEducation(container) {
  if (!container) return;
  const eduItems = EDUCATION.map(
    (e) => `
    <div class="education-item">
      <p class="education-qualification">${e.qualification} — ${e.grade}</p>
      <p class="education-institution">${e.institution}</p>
      <p class="education-electives">Electives: ${e.electives.join(", ")}</p>
    </div>`
  ).join("");
  const certItems = CERTIFICATIONS.map(
    (c) => `
    <div class="education-item">
      <p class="education-qualification">${c.name}</p>
      <p class="education-institution">${c.issuer}</p>
    </div>`
  ).join("");
  container.innerHTML = `<div>${eduItems}</div><div>${certItems}</div>`;
}

export function renderContactSocials(container) {
  if (!container) return;
  container.innerHTML = SOCIALS.map(
    (s) => `<a href="${s.url}" target="_blank" rel="noopener noreferrer">${s.name}<span aria-hidden="true">→</span></a>`
  ).join("");
}

export function renderFooterYear(el) {
  if (el) el.textContent = String(new Date().getFullYear());
}
