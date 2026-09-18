/* A605 supported surface: what Pocket LUCA will answer, and what it says when it
 * will not.
 *
 * Contract: docs/ROUTING-AND-ANSWER-CONTRACT.md §3–§5.
 *
 * Two failure modes are equally unacceptable and this module exists to avoid
 * both:
 *
 *   1. Letting an unsupported request fall through to unrestricted generated
 *      personal or medical prose. Returning null did exactly that, because the
 *      caller then dispatches the model.
 *   2. "Solving" truthfulness by rejecting everything. A reject-all assistant is
 *      not a correct answer boundary; the text box must stay useful for the
 *      supported requests.
 *
 * So every request resolves to a deterministic outcome: a supported guided
 * answer, a bounded out-of-scope reply, or a clear limitation that names what
 * CAN be asked.
 */

export const SUPPORTED_CHOICES = {
  en: [
    'ask what Pocket LUCA can help with',
    'ask about a check-in you have selected in Sources',
    'ask for a small next step',
  ],
  es: [
    'preguntar en qué puede ayudarte Pocket LUCA',
    'preguntar por un check-in que hayas seleccionado en Fuentes',
    'pedir un pequeño paso siguiente',
  ],
};

/* Deterministic limitation reply.
 *
 * It states plainly that the request is outside what this assistant answers,
 * and lists what is supported. It never guesses, never answers "approximately",
 * and never hands the request to open generation.
 */
export function limitationReply(locale) {
  const lang = locale === 'es' ? 'es' : 'en';
  const choices = SUPPORTED_CHOICES[lang];
  const lead = lang === 'es'
    ? 'No puedo responder eso de forma fiable, así que no voy a suponerlo. Ahora mismo puedo ayudarte a:'
    : 'I cannot answer that reliably, so I am not going to guess. Right now I can help you:';
  const tail = lang === 'es'
    ? 'También puedes seleccionar registros en Fuentes para que los revisemos juntos.'
    : 'You can also select records in Sources so we can review them together.';
  return `${lead}\n· ${choices.join('\n· ')}\n${tail}`;
}

/* Record-derived strings are DATA, never instructions and never free text.
 * Only values matching a strict shape may be rendered into an answer, so a
 * record cannot inject prose or directives into assistant output.
 */
const ISO_DATE = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/;

/* SP-CHAT-01: shape alone is not a calendar. `2026-99-99` matches YYYY-MM-DD and
 * was rendered to the user as a check-in date. A displayed date must be a date
 * that exists.
 *
 * The stored record is NEVER modified to make this pass — an impossible value in
 * a record is a finding about that record, not something to correct silently.
 */
export function isRealCalendarDate(value) {
  if (typeof value !== 'string') return false;
  const match = ISO_DATE.exec(value);
  if (!match) return false;
  const [, y, m, d] = match;
  const year = Number(y);
  const month = Number(m);
  const day = Number(d);
  if (month < 1 || month > 12 || day < 1) return false;
  const leap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const lengths = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return day <= lengths[month - 1];
}

export function isRenderableValue(field, value) {
  if (field === 'date') return isRealCalendarDate(value);
  return typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= 5;
}

/* SP-CHAT-02: a malformed selection entry must not throw. A thrown TypeError
 * escapes the deterministic contract and leaves the caller free to fall back to
 * open generation, so entries are validated and unusable ones are skipped.
 */
export function isUsableSelectionEntry(entry) {
  return Boolean(entry)
    && typeof entry === 'object'
    && !Array.isArray(entry)
    && typeof entry.id === 'string'
    && entry.id.length > 0
    && Array.isArray(entry.approvedFields)
    && entry.fields !== null
    && typeof entry.fields === 'object'
    && !Array.isArray(entry.fields);
}

/** Keep only entries that are safe to read. Never mutates the input. */
export function usableSelection(selection) {
  if (!Array.isArray(selection)) return [];
  return selection.filter(isUsableSelectionEntry);
}

/** Missing is missing. Zero is a value. They are never conflated. */
export function valueState(value) {
  if (value === undefined || value === null) return 'missing';
  if (value === 0) return 'zero';
  return 'present';
}
