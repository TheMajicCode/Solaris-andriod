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
  const source = selection.find((s) => s.id === ref.sourceId);
  if (!source) throw new AnswerRejected(REJECT.UNKNOWN_SOURCE, ref.sourceId);
  if (source.revision !== ref.revision) {
    throw new AnswerRejected(REJECT.STALE_REVISION, `${ref.sourceId}@${ref.revision} != ${source.revision}`);
  }
  if (!source.approvedFields.includes(ref.field)) {
    throw new AnswerRejected(REJECT.FIELD_NOT_APPROVED, `${ref.sourceId}.${ref.field}`);
  }
  const value = source.fields[ref.field];
  if (value === undefined || value === null) {
    throw new AnswerRejected(REJECT.MISSING_VALUE, `${ref.sourceId}.${ref.field}`);
  }
  if (source.authorityEpoch !== authority.epoch
      || source.permissionRevision !== authority.permissionRevision) {
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
export function renderCheckinAnswer(typedFacts, locale, date) {
  const lang = locale === 'es' ? 'es' : 'en';
  const labels = ASPECT_LABELS[lang];
  const parts = typedFacts
    .filter((f) => Object.prototype.hasOwnProperty.call(labels, f.field))
    .map((f) => `${labels[f.field]}: ${f.value}/5`);
  const body = parts.length
    ? parts.join(', ')
    : (lang === 'es' ? 'ninguna valoración' : 'no aspect ratings');
  return lang === 'es'
    ? `En el check-in seleccionado de ${date} registraste ${body}. Son tus propias impresiones.`
    : `In the selected check-in dated ${date}, you recorded ${body}. These are your own impressions.`;
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
