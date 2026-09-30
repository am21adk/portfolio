// In-page motion: sections "reveal" as they scroll into view — a short
// fade plus a 20–30px rise (see [data-reveal] in css/components.css).
//
// Rather than hand-marking every block in every page, this module tags the
// direct children of each <main> section automatically, so a new section
// added later gets the same treatment for free. Two things need care:
//
// 1. Chrome's Cumulative Layout Shift metric counts ANY visual movement of
//    rendered content, including a transform-driven translateY — it is not
//    exempt just because layout geometry didn't technically change. Reveal-
//    animating one huge container (a whole 900px-tall commit log, or a
//    16-tile archive grid) as a single block therefore tanks CLS. So a
//    container that holds more than one repeated item (a git-commit, an
//    archive-tile, an education-item) has ITS ITEMS tagged individually
//    instead of the container — many small, separately-timed shifts
//    instead of one huge one, and most of them happen well after first
//    paint as the user actually scrolls to them.
// 2. Anything already animating on its own (the skills marquees) is left
//    alone — adding a reveal transform to a track that's already mid-loop
//    would just fight its own animation.
//
// Nothing here runs under prefers-reduced-motion — the page simply never
// gets the `reveal-armed` class, so css/components.css's base rule
// ([data-reveal] { opacity: 1 }) is all that applies and content is
// visible immediately, statically.

const REPEATED_ITEM_SELECTOR = ".git-commit, .archive-tile, .education-item";
const SKIP_SELECTOR = ".marquee-row, .skills-controls, .physics-stage";

function tagRevealTargets() {
  document.querySelectorAll("main > section").forEach((section) => {
    [...section.children].forEach((child) => {
      if (child.hasAttribute("data-reveal") || child.matches(SKIP_SELECTOR)) return;

      const items = child.querySelectorAll(REPEATED_ITEM_SELECTOR);
      if (items.length > 1) {
        items.forEach((item) => item.setAttribute("data-reveal", ""));
      } else {
        child.setAttribute("data-reveal", "");
      }
    });
  });
}

export function init() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  tagRevealTargets();

  document.querySelectorAll(".featured-grid > *").forEach((card, i) => {
    card.style.transitionDelay = `${i * 90}ms`;
  });

  document.documentElement.classList.add("reveal-armed");

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
  );

  document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
}
