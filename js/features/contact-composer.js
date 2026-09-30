// The message composer on Contact. There is no server and nothing is
// stored: "Open in email" validates the three fields, then builds a
// mailto: link to CONTACT.email and hands off to the visitor's own mail
// client. All client-side, no fetch, no inline handlers.

import { CONTACT } from "../../data/content.js";

function validateField(input) {
  const errorEl = document.getElementById(`${input.id}-error`);
  if (input.validity.valid) {
    errorEl.textContent = "";
    input.setAttribute("aria-invalid", "false");
    return true;
  }
  errorEl.textContent = input.validationMessage;
  input.setAttribute("aria-invalid", "true");
  return false;
}

export function init() {
  const form = document.querySelector("[data-composer-form]");
  if (!form) return;

  const fields = [...form.querySelectorAll("input[required], textarea[required]")];

  fields.forEach((field) => {
    field.addEventListener("blur", () => validateField(field));
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const allValid = fields.map(validateField).every(Boolean);
    if (!allValid) {
      fields.find((f) => !f.validity.valid)?.focus();
      return;
    }

    const name = form.elements.name.value.trim();
    const subject = form.elements.subject.value.trim();
    const message = form.elements.message.value.trim();

    const body = `${message}\n\n— ${name}`;
    const mailto = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  });
}
