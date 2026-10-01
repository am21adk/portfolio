// The message composer on Contact. Validates the fields, then POSTs the
// message straight to Amir's inbox via Web3Forms (https://web3forms.com)
// — a free relay keyed by WEB3FORMS_ACCESS_KEY in data/content.js (that
// key is meant to be public; it just tells Web3Forms which inbox to
// deliver to). No server of Amir's own to run or pay for, which is the
// whole point of a static site.

import { WEB3FORMS_ACCESS_KEY } from "../../data/content.js";
import { showToast } from "../lib/toast.js";

const ENDPOINT = "https://api.web3forms.com/submit";

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

  const submitBtn = form.querySelector("[data-composer-submit]");
  const formError = document.getElementById("composer-form-error");
  const fields = [...form.querySelectorAll("input[required], textarea[required]")];

  fields.forEach((field) => {
    field.addEventListener("blur", () => validateField(field));
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    formError.textContent = "";

    const allValid = fields.map(validateField).every(Boolean);
    if (!allValid) {
      fields.find((f) => !f.validity.valid)?.focus();
      return;
    }

    const name = form.elements.name.value.trim();
    const email = form.elements.email.value.trim();
    const subject = form.elements.subject.value.trim();
    const message = form.elements.message.value.trim();

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          name,
          email,
          subject: `Portfolio message: ${subject}`,
          message,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || `Web3Forms responded ${res.status}`);

      showToast("Message sent");
      form.reset();
      fields.forEach((f) => f.setAttribute("aria-invalid", "false"));
    } catch (err) {
      formError.textContent = "Couldn't send that — please try again, or email me directly.";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send message →";
    }
  });
}
