// Entry point, loaded as a module by every page. Renders this page's static
// content from data/content.js, then initialises whichever feature modules
// this page actually has markup for. Each feature's init() is safe to call
// on a page that lacks its markup — they all no-op via an early
// `if (!el) return`, so this file doesn't need a big per-page switch.

import {
  renderHeroSocials,
  renderHeroBio,
  renderFeaturedLinks,
  renderFeaturedDetails,
  renderStats,
  renderArchive,
  renderSkillsMarquee,
  renderEducation,
  renderContactSocials,
  renderFooterYear,
} from "./content-render.js";

import { init as initAboutEditor } from "./features/about-editor.js";
import { init as initGitLog } from "./features/git-log.js";
import { init as initEncryptedContact } from "./features/encrypted-contact.js";
import { init as initContactComposer } from "./features/contact-composer.js";
import { init as initErrorPage } from "./features/error-page.js";
import { init as initRevealOnScroll } from "./features/reveal-on-scroll.js";
import { init as initDecryptHeadings } from "./features/decrypt-headings.js";
import { init as initHeroTypewriter } from "./features/hero-typewriter.js";
import { init as initOdometer } from "./features/odometer.js";
import { init as initLiveStatus } from "./features/live-status.js";
import { init as initTiltCards } from "./features/tilt-cards.js";
import { init as initSkillsPhysics } from "./features/skills-physics.js";
import { init as initArchiveFilter } from "./features/archive-filter.js";
import { init as initProjectCardExpand } from "./features/project-card-expand.js";
import { init as initCommandPalette } from "./features/command-palette.js";
import { init as initTerminal } from "./features/terminal.js";
import { init as initConsoleEasterEgg } from "./features/console-easter-egg.js";
import { init as initCursor } from "./features/cursor.js";
import { init as initSmallTouches } from "./features/small-touches.js";

// Gates the [data-reveal] CSS transition (see css/components.css) — content
// is fully visible with JS disabled, and only animates in when this class
// proves JS actually ran.
document.documentElement.classList.add("js");

// The font CSS is <link rel="preload"> in <head> (starts the fetch early,
// non-blocking) and applied here rather than as a plain <link rel="stylesheet">
// — that would sit on the critical rendering path for one external request's
// round trip. Every page already lists Outfit/system-ui fallbacks in
// --font-sans, so text is never invisible while this loads.
const fontCSS = document.createElement("link");
fontCSS.rel = "stylesheet";
fontCSS.href = "https://api.fontshare.com/v2/css?f[]=general-sans@400,500,700&f[]=satoshi@400,500,700,900&display=optional";
document.head.append(fontCSS);

renderFooterYear(document.querySelector("[data-copyright-year]"));

renderHeroSocials(document.querySelector("[data-hero-socials]"));
renderHeroBio(document.querySelector("[data-hero-bio]"));
renderFeaturedLinks(document.querySelector("[data-featured-links]"));
renderStats(document.querySelector("[data-stats]"));

renderFeaturedDetails(document.querySelector("[data-featured-details]"));
renderArchive(
  document.querySelector("[data-archive-grid]"),
  document.querySelector("[data-archive-pills]"),
  document.querySelector("[data-archive-count]")
);

renderSkillsMarquee(document.querySelector("[data-marquee-build]"), document.querySelector("[data-marquee-secure]"));
renderEducation(document.querySelector("[data-education]"));

renderContactSocials(document.querySelector("[data-contact-socials]"));

// A card linked from Home (/projects#absoc-website) should land already
// expanded, not just scrolled to.
// location.hash already includes its leading "#", which is exactly the ID
// selector syntax needed here — CSS.escape would instead escape that "#"
// into a literal character and break the selector, since our project ids
// are plain kebab-case with nothing that actually needs escaping.
const targetDetails = location.hash && document.querySelector(`details${location.hash}`);
if (targetDetails) targetDetails.open = true;

// Content-driven features (need the DOM the render calls above just built).
initAboutEditor();
initGitLog();
initEncryptedContact();
initContactComposer();
initErrorPage();
initHeroTypewriter();
initOdometer();
initLiveStatus();
initTiltCards();
initSkillsPhysics();
initArchiveFilter();
initProjectCardExpand();

// Global, page-agnostic features.
initRevealOnScroll();
initDecryptHeadings();
initCommandPalette();
initTerminal();
initConsoleEasterEgg();
initCursor();
initSmallTouches();
