// 404 page: echoes back whatever path the visitor actually typed, styled as
// a failed shell command. textContent only — the path comes straight from
// location.pathname, so this never introduces an XSS sink.

export function init() {
  const targets = document.querySelectorAll("[data-attempted-path]");
  if (!targets.length) return;
  targets.forEach((el) => {
    el.textContent = decodeURIComponent(location.pathname) || "/";
  });
}
