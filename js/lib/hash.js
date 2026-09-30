// Thin wrapper around Web Crypto's SubtleCrypto for the two places the site
// needs a real digest: the git-log commit hashes (SHA-1, truncated to 7
// hex chars, like `git log --oneline`) and the terminal's `hash <text>`
// command (full SHA-256). No third-party crypto library — the browser
// already ships one.

async function digestHex(algorithm, text) {
  const bytes = new TextEncoder().encode(text);
  const buffer = await crypto.subtle.digest(algorithm, bytes);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function shortCommitHash(text) {
  const full = await digestHex("SHA-1", text);
  return full.slice(0, 7);
}

export async function sha256Hex(text) {
  return digestHex("SHA-256", text);
}
