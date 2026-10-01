// Projects page — smoothly animates a featured <details> card open/closed
// instead of the browser's default instant snap. Progressive enhancement:
// summary.click() is only intercepted once this runs, so with JS disabled
// (or under reduced motion, where this never attaches) the card still
// opens and closes natively, just without the animation.
//
// Technique: prevent the native toggle, drive `.project-card-expanded`'s
// height with the Web Animations API (measuring real scrollHeight rather
// than guessing), and only flip `details.open` once the animation settles
// — that keeps assistive tech and :target/view-transition behaviour
// identical to the native element throughout.

const DURATION = 380;
const EASING = "cubic-bezier(.2,.7,.2,1)";

function wireCard(details) {
  const summary = details.querySelector("summary");
  const panel = details.querySelector(".project-card-expanded");
  if (!summary || !panel) return;

  let animation = null;

  function settle(open) {
    animation = null;
    details.classList.remove("is-animating");
    panel.style.height = "";
    panel.style.overflow = "";
    details.open = open;
  }

  function expand() {
    details.classList.add("is-animating");
    details.open = true; // needed so the panel is laid out to measure
    panel.style.overflow = "hidden";
    const target = panel.scrollHeight;
    animation?.cancel();
    animation = panel.animate({ height: ["0px", `${target}px`] }, { duration: DURATION, easing: EASING });
    animation.onfinish = () => settle(true);
  }

  function collapse() {
    details.classList.add("is-animating");
    const start = panel.getBoundingClientRect().height;
    panel.style.overflow = "hidden";
    animation?.cancel();
    animation = panel.animate({ height: [`${start}px`, "0px"] }, { duration: DURATION, easing: EASING });
    animation.onfinish = () => settle(false);
  }

  summary.addEventListener("click", (event) => {
    event.preventDefault();
    if (details.classList.contains("is-animating")) return;
    details.open ? collapse() : expand();
  });
}

export function init() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (typeof Element.prototype.animate !== "function") return; // Web Animations API required
  document.querySelectorAll("details.project-card").forEach(wireCard);
}
