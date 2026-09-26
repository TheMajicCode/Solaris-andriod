/* A605-01 matching representation.
 *
 * Contract: docs/ROUTING-AND-ANSWER-CONTRACT.md §2.
 *
 * The user's original text is NEVER mutated. This module derives a separate
 * representation used only for intent matching. Build 604 normalizes in place
 * and strips only trailing `!?.,`, which is why `¡Hola!` never matches `hola`
 * (finding F04).
 */

// Boundary punctuation, leading and trailing. Inverted Spanish marks are the
// point of the exercise; interior punctuation is deliberately preserved.
const BOUNDARY = '¡¿!?.,;:"\'“”‘’()[]{}';

/** Collapse every run of whitespace, including newlines and tabs, to one space. */
function collapseWhitespace(value) {
  return value.replace(/\s+/g, ' ').trim();
}

function stripBoundary(value) {
  let out = value;
  let changed = true;
  while (changed) {
    changed = false;
    while (out.length && BOUNDARY.indexOf(out.charAt(0)) >= 0) { out = out.slice(1); changed = true; }
    while (out.length && BOUNDARY.indexOf(out.charAt(out.length - 1)) >= 0) { out = out.slice(0, -1); changed = true; }
    const trimmed = out.trim();
    if (trimmed !== out) { out = trimmed; changed = true; }
  }
  return out;
}

/** Remove combining marks so `que` and `qué` compare equal. Additive only. */
export function foldAccents(value) {
  return value.normalize('NFD').replace(/[̀-ͯ]/g, '').normalize('NFC');
}

/**
 * Derive the matching representation.
 * Returns the original untouched alongside the derived forms.
 */
export function matchingText(original) {
  if (typeof original !== 'string') throw new TypeError('original text must be a string');
  const nfc = original.normalize('NFC');
  const lowered = collapseWhitespace(nfc.toLowerCase());
  const stripped = stripBoundary(lowered);
  return {
    original,                    // never mutated, used for display and persistence
    normalized: stripped,        // accented, boundary-stripped, whitespace-collapsed
    folded: foldAccents(stripped),
    words: stripped.length ? stripped.split(' ') : [],
  };
}

/** Polite wrappers accepted around an otherwise exact supported form. */
const POLITE_PREFIXES = [
  'please', 'could you', 'can you', 'would you', 'hey',
  'por favor', 'podrias', 'podrías', 'puedes',
];
const POLITE_SUFFIXES = ['please', 'por favor', 'thanks', 'thank you', 'gracias'];

/**
 * Whole-request match: the ENTIRE matching text must equal an accepted form,
 * optionally wrapped in one polite prefix and/or suffix.
 *
 * A supported intent is never inferred from a substring of a longer request.
 * That substring behaviour is finding F05.
 */
export function matchesWholeRequest(match, acceptedForms) {
  const accepted = new Set();
  for (const form of acceptedForms) {
    accepted.add(form);
    accepted.add(foldAccents(form));
  }
  const candidates = [match.normalized, match.folded];

  for (const candidate of candidates) {
    if (accepted.has(candidate)) return true;
    for (const prefix of POLITE_PREFIXES) {
      // The prefix may be followed by a space or by boundary punctuation,
      // as in `Por favor, ¿qué puedes hacer?`.
      if (!candidate.startsWith(prefix)) continue;
      const next = candidate.charAt(prefix.length);
      if (next !== ' ' && BOUNDARY.indexOf(next) < 0) continue;
      const rest = stripBoundary(candidate.slice(prefix.length));
      if (accepted.has(rest) || accepted.has(foldAccents(rest))) return true;
      for (const suffix of POLITE_SUFFIXES) {
        if (!rest.endsWith(' ' + suffix)) continue;
        const core = stripBoundary(rest.slice(0, -(suffix.length + 1)));
        if (accepted.has(core) || accepted.has(foldAccents(core))) return true;
      }
    }
    for (const suffix of POLITE_SUFFIXES) {
      if (!candidate.endsWith(suffix)) continue;
      const before = candidate.charAt(candidate.length - suffix.length - 1);
      if (before !== ' ' && BOUNDARY.indexOf(before) < 0) continue;
      const core = stripBoundary(candidate.slice(0, candidate.length - suffix.length));
      if (accepted.has(core) || accepted.has(foldAccents(core))) return true;
    }
  }
  return false;
}
