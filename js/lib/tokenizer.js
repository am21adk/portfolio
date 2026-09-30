// A small hand-written tokenizer for the AboutMe.js editor (feature 2).
// It only needs to understand the tiny subset of JS the editor actually
// prints — keywords, strings, numbers, comments and punctuation — so this
// is a scanner, not a real parser. Returns a flat list of
// { type, value } tokens per line; components/render code turns each type
// into a `tok-*` span.

const KEYWORDS = new Set(["const", "let", "var", "function", "return", "new", "true", "false", "null"]);

export function tokenizeLine(line) {
  const tokens = [];
  let i = 0;

  while (i < line.length) {
    const ch = line[i];

    if (/\s/.test(ch)) {
      let j = i;
      while (j < line.length && /\s/.test(line[j])) j++;
      tokens.push({ type: "space", value: line.slice(i, j) });
      i = j;
      continue;
    }

    // Line comment: everything after // is a comment.
    if (ch === "/" && line[i + 1] === "/") {
      tokens.push({ type: "comment", value: line.slice(i) });
      break;
    }

    // Strings: single, double or template-quoted.
    if (ch === '"' || ch === "'" || ch === "`") {
      const quote = ch;
      let j = i + 1;
      while (j < line.length && line[j] !== quote) {
        if (line[j] === "\\") j++;
        j++;
      }
      j = Math.min(j + 1, line.length);
      tokens.push({ type: "string", value: line.slice(i, j) });
      i = j;
      continue;
    }

    // Numbers.
    if (/[0-9]/.test(ch)) {
      let j = i;
      while (j < line.length && /[0-9.]/.test(line[j])) j++;
      tokens.push({ type: "value", value: line.slice(i, j) });
      i = j;
      continue;
    }

    // Identifiers / keywords.
    if (/[A-Za-z_$]/.test(ch)) {
      let j = i;
      while (j < line.length && /[A-Za-z0-9_$]/.test(line[j])) j++;
      const word = line.slice(i, j);
      tokens.push({ type: KEYWORDS.has(word) ? "keyword" : "identifier", value: word });
      i = j;
      continue;
    }

    // Everything else (punctuation/operators) — grouped one char at a time
    // is plenty for this editor's simple lines.
    tokens.push({ type: "punct", value: ch });
    i += 1;
  }

  return tokens;
}

export function highlightLineHTML(line) {
  return tokenizeLine(line)
    .map((tok) => {
      const escaped = tok.value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      if (tok.type === "space" || tok.type === "identifier") return escaped;
      return `<span class="tok-${tok.type}">${escaped}</span>`;
    })
    .join("");
}
