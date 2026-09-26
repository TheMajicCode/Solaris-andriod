/* A605-01 host envelope adapter — AUD-04.
 *
 * Contract: docs/ROUTING-AND-ANSWER-CONTRACT.md §3.1.
 *
 * Build 604's shipped helper (Solaris-Android-R4/grounding/fast-guided.js) opens
 * with an UNGUARDED envelope parse:
 *
 *     var envelope = JSON.parse(prompt.slice(prompt.indexOf('\n') + 1, -10));
 *     var text = envelope.user.toLowerCase().trim();
 *
 * Its own harness guards what the shipped code does not. At
 * Solaris-Android-R4/grounding/actual-tests.js:54 the test helper asserts
 * `cut >= 0` and `prompt.slice(-10) === ' /no_think'` before parsing. The
 * shipped function asserts neither, and additionally calls `.toLowerCase()` on
 * `envelope.user` with no type check. So the harness can never observe the
 * shipped gap: every prompt the suite feeds the helper has already been proven
 * well-formed by the assertion in the helper the suite itself uses.
 *
 * The frozen helper is evidence and is NOT edited (AGENTS.md). Instead the
 * integration owns the three checks, here:
 *
 *   1. `indexOf('\n')` may be -1. The frozen slice then becomes
 *      `prompt.slice(0, -10)`, which parses the HEADER as the envelope.
 *   2. The `-10` suffix is the literal ` /no_think`. A changed or absent suffix
 *      silently truncates the JSON body by ten characters.
 *   3. `envelope.user` may be absent, null, a number or an object.
 *
 * Every failure resolves to the deterministic limitation reply, never a throw
 * and never null — a throw or a null at this seam returns the request to the
 * caller, which dispatches the model. That is the F03/F04 failure mode.
 *
 * INTEGRATION IS BLOCKED (contract §8). This is reviewed source, not a shipped
 * fix.
 */
import { routeRequest } from './guided-router.mjs';
import { limitationReply } from './supported-surface.mjs';

/** The exact suffix the frozen harness asserts. Ten characters. */
export const PROMPT_SUFFIX = ' /no_think';

/** The locale directive the frozen helper probes for. */
export const SPANISH_DIRECTIVE = 'Reply in es ';

export const ENVELOPE_ERROR = {
  NOT_A_STRING: 'prompt-not-a-string',
  NO_HEADER_BREAK: 'no-newline-between-header-and-envelope',
  BAD_SUFFIX: 'missing-or-changed-no_think-suffix',
  EMPTY_BODY: 'envelope-body-is-empty',
  NOT_JSON: 'envelope-body-is-not-json',
  NOT_AN_OBJECT: 'envelope-is-not-a-plain-object',
  USER_NOT_A_STRING: 'envelope-user-is-not-a-string',
};

/**
 * Probe the locale directive the way the frozen helper does, from the RAW
 * prompt. Deliberately independent of the envelope, so a malformed envelope
 * still produces a reply in the interface language rather than defaulting to
 * English. See contract §4 on what this locale is and is not.
 */
export function localeFromPrompt(prompt) {
  return typeof prompt === 'string' && prompt.indexOf(SPANISH_DIRECTIVE) >= 0 ? 'es' : 'en';
}

/**
 * Parse a host prompt into the envelope the frozen helper expects.
 *
 * @returns {{ok:true, user:string, locale:'en'|'es', facts:Array, envelope:object}
 *          |{ok:false, reason:string, locale:'en'|'es'}}
 */
export function parseHostPrompt(prompt) {
  const locale = localeFromPrompt(prompt);
  const fail = (reason) => ({ ok: false, reason, locale });

  if (typeof prompt !== 'string') return fail(ENVELOPE_ERROR.NOT_A_STRING);

  // Guard 1 — the frozen code adds 1 to a possible -1 and slices from 0.
  const cut = prompt.indexOf('\n');
  if (cut < 0) return fail(ENVELOPE_ERROR.NO_HEADER_BREAK);

  // Guard 2 — the frozen code assumes the trailing ten characters are the
  // directive. If they are not, it silently removes ten bytes of JSON.
  if (prompt.slice(-PROMPT_SUFFIX.length) !== PROMPT_SUFFIX) return fail(ENVELOPE_ERROR.BAD_SUFFIX);

  const body = prompt.slice(cut + 1, -PROMPT_SUFFIX.length);
  if (!body.trim().length) return fail(ENVELOPE_ERROR.EMPTY_BODY);

  let envelope;
  try {
    envelope = JSON.parse(body);
  } catch {
    return fail(ENVELOPE_ERROR.NOT_JSON);
  }
  if (!envelope || typeof envelope !== 'object' || Array.isArray(envelope)) {
    return fail(ENVELOPE_ERROR.NOT_AN_OBJECT);
  }

  // Guard 3 — `.toLowerCase()` on a non-string is the crash the frozen helper
  // takes. Read as an own property so a prototype-supplied `user` is not used.
  const user = Object.prototype.hasOwnProperty.call(envelope, 'user') ? envelope.user : undefined;
  if (typeof user !== 'string') return fail(ENVELOPE_ERROR.USER_NOT_A_STRING);

  return {
    ok: true,
    user,
    locale,
    facts: Array.isArray(envelope.facts) ? envelope.facts : [],
    envelope,
  };
}

/**
 * Route a raw host prompt. Total: always an object, never a throw, never null.
 *
 * `selection` and `authority` are supplied BY THE CALLER, not derived from the
 * envelope. The 604 envelope carries `facts[i].fields` and `task.sourceRefs[i]`
 * but no `revision`, no `approvedFields` and no authority epoch or permission
 * revision — the four things `buildTypedFact` requires. Manufacturing them here
 * would be exactly the unbound rendering the F03 boundary exists to forbid, so
 * this adapter does not manufacture them. Supplying them is a named part of
 * integration and is BLOCKED on the host work in contract §8.
 */
export function routeHostPrompt(prompt, options) {
  // NBR-1: `= {}` is a DEFAULT parameter, so it fires only on `undefined`.
  // Destructuring `null` throws — and `null` is exactly what a host bridge
  // passes for an absent optional. A throw here is the failure this adapter
  // exists to prevent, so the fallback must cover null too.
  const { selection = [], authority = null } = options ?? {};
  const parsed = parseHostPrompt(prompt);
  if (!parsed.ok) {
    return {
      kind: 'limitation',
      message: limitationReply(parsed.locale),
      sourceRefs: [],
      modelCallsRequired: 0,
      envelopeError: parsed.reason,
    };
  }
  return routeRequest({ user: parsed.user, locale: parsed.locale, selection, authority });
}
