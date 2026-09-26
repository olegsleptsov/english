const NEGATIVE_CONTRACTION_REPLACEMENTS: Array<{
  pattern: RegExp;
  replacement: string;
}> = [
  { pattern: /\bdo\s+not\b/giu, replacement: "don't" },
  { pattern: /\bdoes\s+not\b/giu, replacement: "doesn't" },
  { pattern: /\bdid\s+not\b/giu, replacement: "didn't" },
  { pattern: /\bis\s+not\b/giu, replacement: "isn't" },
  { pattern: /\bare\s+not\b/giu, replacement: "aren't" },
  { pattern: /\bwas\s+not\b/giu, replacement: "wasn't" },
  { pattern: /\bwere\s+not\b/giu, replacement: "weren't" },
  { pattern: /\bhave\s+not\b/giu, replacement: "haven't" },
  { pattern: /\bhas\s+not\b/giu, replacement: "hasn't" },
  { pattern: /\bhad\s+not\b/giu, replacement: "hadn't" },
  { pattern: /\bwill\s+not\b/giu, replacement: "won't" },
  { pattern: /\bwould\s+not\b/giu, replacement: "wouldn't" },
  { pattern: /\bshould\s+not\b/giu, replacement: "shouldn't" },
  { pattern: /\bcould\s+not\b/giu, replacement: "couldn't" },
  { pattern: /\bcan\s+not\b/giu, replacement: "can't" },
  { pattern: /\bcannot\b/giu, replacement: "can't" },
  { pattern: /\bmust\s+not\b/giu, replacement: "mustn't" },
  { pattern: /\bshall\s+not\b/giu, replacement: "shan't" },
  { pattern: /\bdo\s+n['’]t\b/giu, replacement: "don't" },
  { pattern: /\bdoes\s+n['’]t\b/giu, replacement: "doesn't" },
  { pattern: /\bdid\s+n['’]t\b/giu, replacement: "didn't" },
  { pattern: /\bis\s+n['’]t\b/giu, replacement: "isn't" },
  { pattern: /\bare\s+n['’]t\b/giu, replacement: "aren't" },
  { pattern: /\bwas\s+n['’]t\b/giu, replacement: "wasn't" },
  { pattern: /\bwere\s+n['’]t\b/giu, replacement: "weren't" },
  { pattern: /\bhave\s+n['’]t\b/giu, replacement: "haven't" },
  { pattern: /\bhas\s+n['’]t\b/giu, replacement: "hasn't" },
  { pattern: /\bhad\s+n['’]t\b/giu, replacement: "hadn't" },
  { pattern: /\bwo\s+n['’]t\b/giu, replacement: "won't" },
  { pattern: /\bwould\s+n['’]t\b/giu, replacement: "wouldn't" },
  { pattern: /\bshould\s+n['’]t\b/giu, replacement: "shouldn't" },
  { pattern: /\bcould\s+n['’]t\b/giu, replacement: "couldn't" },
  { pattern: /\bca\s+n['’]t\b/giu, replacement: "can't" },
  { pattern: /\bmust\s+n['’]t\b/giu, replacement: "mustn't" },
  { pattern: /\bsha\s+n['’]t\b/giu, replacement: "shan't" },
];

export function normalizeEnglishNegativeContractions(value: string) {
  return NEGATIVE_CONTRACTION_REPLACEMENTS.reduce(
    (normalizedValue, { pattern, replacement }) =>
      normalizedValue.replace(pattern, replacement),
    value.replace(/’/gu, "'"),
  );
}
