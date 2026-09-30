// One shared toast element per page (in the footer partial, see any page's
// HTML for `[data-toast]`). Anything that wants to confirm an action —
// copy buttons here, the command palette elsewhere — calls showToast().

let hideTimer = null;

export function showToast(message) {
  const toast = document.querySelector("[data-toast]");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(hideTimer);
  hideTimer = setTimeout(() => toast.classList.remove("is-visible"), 2200);
}
