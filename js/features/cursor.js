// Feature 14 — custom cursor (desktop with a fine pointer only). A dot
// tracks the pointer exactly; a ring trails behind it with simple lerp
// smoothing, grows over interactive elements, and blends via
// mix-blend-mode: difference so it inverts over white. Primary/outline
// buttons get a small magnetic pull toward the pointer.

export function init() {
  const isCoarse = window.matchMedia("(hover: none), (pointer: coarse)").matches;
  if (isCoarse) return;

  document.documentElement.classList.add("has-custom-cursor");

  const dot = document.createElement("div");
  dot.className = "cursor-dot";
  const ring = document.createElement("div");
  ring.className = "cursor-ring";
  document.body.append(dot, ring);

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  function place(el, x, y) {
    el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
  }

  document.addEventListener("pointermove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    place(dot, mouseX, mouseY);
    if (reduceMotion) place(ring, mouseX, mouseY);
  });

  if (!reduceMotion) {
    (function loop() {
      ringX += (mouseX - ringX) * 0.22;
      ringY += (mouseY - ringY) * 0.22;
      place(ring, ringX, ringY);
      requestAnimationFrame(loop);
    })();
  }

  document.querySelectorAll("a, button, input, textarea, [role='button']").forEach((el) => {
    el.addEventListener("mouseenter", () => ring.classList.add("is-hovering"));
    el.addEventListener("mouseleave", () => ring.classList.remove("is-hovering"));
  });

  if (!reduceMotion) {
    document.querySelectorAll(".btn-solid, .btn-outline").forEach((btn) => {
      btn.addEventListener("mousemove", (event) => {
        const r = btn.getBoundingClientRect();
        const relX = event.clientX - (r.left + r.width / 2);
        const relY = event.clientY - (r.top + r.height / 2);
        btn.style.transform = `translate(${relX * 0.25}px, ${relY * 0.25}px)`;
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "";
      });
    });
  }
}
