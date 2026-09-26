/* A605-02 answer-support boundary.
 *
 * Contract: docs/ROUTING-AND-ANSWER-CONTRACT.md §5.
 *
 * Finding F03: the actual 604 parser accepted 5 of 7 injected strings, including
 * an invented completed activity, an unseen laboratory claim, and medication
 * imperatives in English and Spanish. A control string with banned wording and
 * one with an invented number were rejected, which is exactly why a phrase list
 * is not a fix.
 *
 * This module does NOT repair module 958's parser — that parser has no recovered
 * authored implementation. It is an outer acceptance layer. Describe it as
 * CONTAINMENT, never as semantic verification of model output.
 *
 * The rule is structural rather than lexical: on the supported surface, personal
 * factual statements are RENDERED from validated typed facts. Free-form model
 * prose is never admitted, so there is nothing for a cleverer sentence to defeat.
 */

import { isRenderableValue } from './supported-surface.mjs';

export const REJECT = {
  UNKNOWN_SOURCE: 'CANDIDATE_UNKNOWN_SOURCE',
  STALE_REVISION: 'CANDIDATE_STALE_REVISION',
  FIELD_NOT_APPROVED: 'CANDIDATE_FIELD_NOT_APPROVED',
  MISSING_VALUE: 'CANDIDATE_MISSING_VALUE',
  UNRENDERABLE_VALUE: 'CANDIDATE_UNRENDERABLE_VALUE',
  AUTHORITY_CHANGED: 'CANDIDATE_AUTHORITY_CHANGED',
  AUTHORITY_UNBOUND: 'CANDIDATE_AUTHORITY_UNBOUND',
  NOT_RENDERED: 'CANDIDATE_NOT_RENDERED_FROM_TYPED_FACTS',
};

export class AnswerRejected extends Error {
  constructor(code, detail) {
    super(code);
    this.code = code;
    this.detail = detail;
  }
}

/**
 * Bind one approved field of one explicitly selected source to a typed fact.
 *
 * Every binding carries source id, revision, field, value, and the authority
 * epoch and permission revision it was read under. Category permission is NOT
 * record selection: a source absent from `selection` is unknown here even when
 * its category is enabled.
 */
export function buildTypedFact(selection, authority, ref) {
  // NBR-5: `selection.find(...)` trusted the caller's object semantics exactly as
  // `approvedFields.includes(...)` once did — a non-array with a forged `find()`
  // returned an arbitrary record and it was admitted. The record lookup is the
  // first gate, so it is scanned structurally rather than through a method the
  // caller can supply.
  if (!Array.isArray(selection)) {
    throw new AnswerRejected(REJECT.UNKNOWN_SOURCE, 'selection is not an array');
  }
  // Index loop, not for...of: a real array can still carry an own
  // Symbol.iterator that yields records which are not its elements (S2R-7).
  let source;
  for (let i = 0; i < selection.length; i += 1) {
    const entry = selection[i];
    if (entry && typeof entry === 'object'
        && Object.prototype.hasOwnProperty.call(entry, 'id') && entry.id === ref.sourceId) {
      source = entry;
      break;
    }
  }
  if (!source) throw new AnswerRejected(REJECT.UNKNOWN_SOURCE, ref.sourceId);
  // The identity and approval gates must read the record's OWN properties, never
  // inherited ones. The authority binding is deliberately NOT in this list: a
  // record that simply omits it must still be rejected as AUTHORITY_UNBOUND,
  // which is a different and more precise statement than "unknown source".
  for (const own of ['revision', 'approvedFields', 'fields']) {
    if (!Object.prototype.hasOwnProperty.call(source, own)) {
      throw new AnswerRejected(REJECT.UNKNOWN_SOURCE, `${ref.sourceId} lacks own ${own}`);
    }
  }
  if (source.revision !== ref.revision) {
    throw new AnswerRejected(REJECT.STALE_REVISION, `${ref.sourceId}@${ref.revision} != ${source.revision}`);
  }
  // NB8: `approvedFields.includes(...)` and `fields[...]` trusted caller-supplied
  // object semantics. An overridden `includes()` returning true bypassed the
  // approval gate, and a value reachable only through the prototype chain was
  // read and rendered. Both are now read structurally. NBR-5 extended the same
  // treatment upward to the record lookup and to every field these gates read;
  // the earlier claim that NB8 alone made this complete was wrong.
  // Index loop, not approved.some(): a real array can carry an own `some`, and
  // Array.prototype.some can be replaced (S2R-7).
  const approved = source.approvedFields;
  let isApproved = false;
  if (Array.isArray(approved)) {
    for (let i = 0; i < approved.length; i += 1) {
      if (approved[i] === ref.field) { isApproved = true; break; }
    }
  }
  if (!isApproved) {
    throw new AnswerRejected(REJECT.FIELD_NOT_APPROVED, `${ref.sourceId}.${ref.field}`);
  }
  const fields = source.fields;
  if (!fields || typeof fields !== 'object'
      || !Object.prototype.hasOwnProperty.call(fields, ref.field)) {
    throw new AnswerRejected(REJECT.MISSING_VALUE, `${ref.sourceId}.${ref.field}`);
  }
  const value = fields[ref.field];
  if (value === undefined || value === null) {
    throw new AnswerRejected(REJECT.MISSING_VALUE, `${ref.sourceId}.${ref.field}`);
  }
  // AUD-01: `undefined !== undefined` is false, so a source and an authority that
  // BOTH omit these fields used to compare equal and be accepted. A claim could
  // then be displayed, persisted and receipted carrying no authority binding at
  // all — the exact failure the contract's "every typed fact is bound" rule
  // exists to prevent. Absence is now rejected before equality is considered.
  // NBR-5: read as own properties so an inherited epoch cannot bind a claim,
  // while a record that omits them still gets the precise AUTHORITY_UNBOUND.
  const ownNumber = (object, key) => (
    object && typeof object === 'object' && Object.prototype.hasOwnProperty.call(object, key)
      ? object[key] : undefined);
  const bound = (value) => Number.isInteger(value);
  const authorityEpoch = ownNumber(authority, 'epoch');
  const authorityRevision = ownNumber(authority, 'permissionRevision');
  const sourceEpoch = ownNumber(source, 'authorityEpoch');
  const sourceRevision = ownNumber(source, 'permissionRevision');
  if (!bound(authorityEpoch) || !bound(authorityRevision)) {
    throw new AnswerRejected(REJECT.AUTHORITY_UNBOUND, 'authority carries no epoch/permissionRevision');
  }
  if (!bound(sourceEpoch) || !bound(sourceRevision)) {
    throw new AnswerRejected(REJECT.AUTHORITY_UNBOUND, `${ref.sourceId} carries no authority binding`);
  }
  if (sourceEpoch !== authorityEpoch || sourceRevision !== authorityRevision) {
    throw new AnswerRejected(REJECT.AUTHORITY_CHANGED, ref.sourceId);
  }
  // Record content is DATA, never instructions and never free text. Only a value
  // matching its field's strict shape may ever be rendered into an answer, so a
  // record cannot inject prose or directives into assistant output.
  if (!isRenderableValue(ref.field, value)) {
    throw new AnswerRejected(REJECT.UNRENDERABLE_VALUE, `${ref.sourceId}.${ref.field}`);
  }
  return Object.freeze({
    sourceId: source.id,
    revision: source.revision,
    field: ref.field,
    value,
    authorityEpoch: authority.epoch,
    permissionRevision: authority.permissionRevision,
  });
}

const ASPECT_LABELS = {
  en: { vitality: 'vitality', clarity: 'clarity', balance: 'balance', alignment: 'alignment' },
  es: { vitality: 'vitalidad', clarity: 'claridad', balance: 'equilibrio', alignment: 'alineación' },
};

/**
 * Deterministically render the supported personal answer from typed facts.
 * This is the ONLY producer of personal factual text on the supported surface.
 */
/**
 * Render the supported personal answer from typed facts.
 *
 * AUD-02: saying "you recorded no aspect ratings" when the aspects existed but
 * could not be BOUND — unapproved field, stale revision, out-of-shape value — is
 * a false statement about what the user recorded. An aspect that is genuinely
 * unanswered and one that is merely unavailable to this answer are different
 * things, and the reply must not conflate them.
 *
 * @param {object} [absence] `{ unanswered, unavailable }` counts for the aspects
 *   that produced no fact. Omit only when there were none.
 */
export function renderCheckinAnswer(typedFacts, locale, date, absence = {}) {
  const lang = locale === 'es' ? 'es' : 'en';
  const labels = ASPECT_LABELS[lang];
  // The date fact is bound and returned, but it is rendered in the sentence
  // frame rather than listed as an aspect rating.
  const parts = typedFacts
    .filter((f) => Object.prototype.hasOwnProperty.call(labels, f.field))
    .map((f) => `${labels[f.field]}: ${f.value}/5`);

  const unavailable = absence.unavailable || 0;
  const lead = lang === 'es'
    ? `En el check-in seleccionado de ${date}`
    : `In the selected check-in dated ${date}`;
  const own = lang === 'es' ? 'Son tus propias impresiones.' : 'These are your own impressions.';

  if (parts.length) {
    const body = lang === 'es'
      ? `${lead} registraste ${parts.join(', ')}.`
      : `${lead}, you recorded ${parts.join(', ')}.`;
    if (!unavailable) return `${body} ${own}`;
    const caveat = lang === 'es'
      ? 'No puedo mostrar el resto de tus respuestas aquí.'
      : 'I cannot show the rest of your answers here.';
    return `${body} ${own} ${caveat}`;
  }

  // Nothing rendered. Say which of the two situations it actually is.
  if (unavailable) {
    return lang === 'es'
      ? `${lead} no puedo mostrar tus respuestas aquí. No voy a suponer lo que registraste.`
      : `${lead}, I cannot show your answers here. I will not guess what you recorded.`;
  }
  return lang === 'es'
    ? `${lead} no registraste valoraciones. Puedes volver al check-in cuando quieras responder o saltarlo.`
    : `${lead}, you did not record any ratings. You can return to the check-in when you want to answer, or leave it skipped.`;
}

/**
 * Admit text to the supported surface.
 *
 * Accepts ONLY text identical to a deterministic rendering produced above. A
 * model completion is never admitted, however plausible, however many source
 * references it cites, and whether or not it contains a banned phrase.
 *
 * @returns {{accepted:true, text:string}}
 * @throws {AnswerRejected}
 */
export function admitToSupportedSurface(proposedText, allowedRenderings) {
  const normalized = String(proposedText).trim();
  for (const rendering of allowedRenderings) {
    if (normalized === rendering.trim()) return { accepted: true, text: rendering };
  }
  throw new AnswerRejected(REJECT.NOT_RENDERED, 'text was not produced by deterministic rendering');
}

/**
 * The sinks rejected content must never reach.
 *
 * Validation happens BEFORE any of them, so nothing is streamed to the UI and
 * retracted, and a rejected string cannot gain storage or prompt authority
 * through a diagnostic or error path.
 */
export function commitSupportedAnswer({ proposedText, allowedRenderings, sinks }) {
  let admitted;
  try {
    admitted = admitToSupportedSurface(proposedText, allowedRenderings);
  } catch (rejection) {
    // The rejected text is deliberately NOT echoed into any sink, including the
    // diagnostic record. Only its rejection code travels.
    sinks.diagnostics.push({ rejected: true, code: rejection.code, detail: rejection.detail });
    return { accepted: false, code: rejection.code };
  }
  sinks.displayed.push(admitted.text);
  sinks.persisted.push(admitted.text);
  sinks.receipts.push({ text: admitted.text });
  sinks.modelContext.push(admitted.text);
  return { accepted: true, text: admitted.text };
}

export function freshSinks() {
  return { displayed: [], persisted: [], receipts: [], modelContext: [], diagnostics: [] };
}
