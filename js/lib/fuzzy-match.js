// Hand-written fuzzy matching for the command palette — no fuzzy-search
// library. Classic subsequence matching: every character of the query must
// appear in the target, in order, but not necessarily contiguous. Scores
// reward consecutive runs and matches right after a word boundary (so
// "abw" ranks "ABsoc Website" above a random string that merely contains
// the same three letters scattered far apart).

export function fuzzyScore(query, target) {
  const q = query.toLowerCase();
  const t = target.toLowerCase();
  if (!q) return 0;

  let qi = 0;
  let score = 0;
  let consecutive = 0;

  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] !== q[qi]) {
      consecutive = 0;
      continue;
    }
    let bonus = 1;
    if (consecutive > 0) bonus += consecutive * 2; // reward runs
    if (ti === 0 || /[\s\-_/]/.test(t[ti - 1])) bonus += 3; // word-boundary bonus
    score += bonus;
    consecutive += 1;
    qi += 1;
  }

  return qi === q.length ? score : -1; // -1 = not every query char matched
}

/** Filters + ranks `items` by fuzzyScore(query, getText(item)), best first. */
export function fuzzySearch(query, items, getText) {
  if (!query) return items;
  return items
    .map((item) => ({ item, score: fuzzyScore(query, getText(item)) }))
    .filter(({ score }) => score >= 0)
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item);
}
