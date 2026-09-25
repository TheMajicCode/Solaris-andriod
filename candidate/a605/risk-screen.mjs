/* A605-01 risk / out-of-scope screen.
 *
 * Contract: docs/ROUTING-AND-ANSWER-CONTRACT.md §4, precedence step 1.
 *
 * Finding F05: build 604 admits `What should I do about severe chest pain
 * during my check-in?`, makes zero model calls, and persists the ordinary
 * explanation of a Solaris check-in, because the substring `check-in` wins over
 * the rest of the request. This screen runs FIRST so a clinical request can
 * never reach a wellness shortcut.
 *
 * THIS IS NOT A CLINICAL CLASSIFIER. It is a conservative screen that moves
 * ambiguous clinical requests OUT of the supported surface. It does not triage,
 * rate urgency or name a condition. Every decision it makes is "answer this as
 * out of scope", never "this is an emergency".
 *
 * It does NOT reliably over-refer. The independent review of 1b33e60 (N2)
 * measured 17 clinical requests, two of them suicidal ideation, that miss every
 * marker and reach the generic limitation reply instead of the referral. That
 * set is recorded in contract §4 ("Known under-referral") for the clinician who
 * holds the escalation-copy gate; routing.test.mjs pins only its containment.
 */
import { matchingText, foldAccents } from './matching.mjs';

// Symptom, medication and clinical-decision markers. Folded (accent-free) so
// `medicamento` and `medicamentó` both match.
const RISK_MARKERS = [
  // English — symptoms
  'chest pain', 'severe pain', 'severe', 'bleeding', 'blood in', 'cant breathe',
  "can't breathe", 'cannot breathe', 'shortness of breath', 'trouble breathing',
  'fainted', 'faint', 'unconscious', 'seizure', 'stroke', 'heart attack',
  'suicidal', 'kill myself', 'self harm', 'overdose', 'poison',
  'numbness', 'slurred speech', 'vision loss', 'allergic reaction',
  // English — medication and clinical decisions
  'medication', 'medicine', 'prescription', 'dose', 'dosage', 'mg of',
  'meds', 'my med', 'pill', 'double my', 'ibuprofen', 'paracetamol', 'acetaminophen', 'antibiotic', 'insulin',
  'stop taking', 'start taking', 'should i take', 'is it safe to take',
  'diagnos', 'treatment for', 'cure for',
  // Spanish — symptoms
  'dolor de pecho', 'dolor fuerte', 'dolor severo', 'sangrado', 'sangre en',
  'no puedo respirar', 'dificultad para respirar', 'desmay', 'inconsciente',
  'convulsion', 'infarto', 'derrame', 'suicid', 'sobredosis', 'veneno',
  'entumecimiento', 'reaccion alergica',
  // Spanish — medication and clinical decisions
  'medicamento', 'medicina', 'receta', 'dosis', 'antibiotico', 'insulina', 'pastilla', 'tomar mas',
  'dejar de tomar', 'empezar a tomar', 'debo tomar', 'es seguro tomar',
  'diagnostic', 'tratamiento para', 'cura para',
];

const FOLDED_MARKERS = RISK_MARKERS.map(foldAccents);

/* Fixed phrases miss ordinary paraphrase. Self-review found three clinical
 * requests falling through to open generation rather than the bounded
 * out-of-scope reply: `Hola. Tengo dolor en el pecho.`, `¿Qué puedes hacer? Me
 * duele mucho el pecho` and `Take my meds?`. A pain word co-occurring with a
 * body site is treated as clinical regardless of the words between them. */
const PAIN_WORDS = ['pain', 'hurts', 'hurting', 'ache', 'aching', 'sore',
                    'dolor', 'duele', 'duelen', 'molestia'];
const BODY_SITES = ['chest', 'heart', 'head', 'stomach', 'abdomen', 'back',
                    'throat', 'arm', 'leg', 'breathing', 'breath',
                    'pecho', 'corazon', 'cabeza', 'estomago', 'vientre',
                    'espalda', 'garganta', 'brazo', 'pierna', 'respirar'];
const FOLDED_PAIN = PAIN_WORDS.map(foldAccents);
const FOLDED_SITES = BODY_SITES.map(foldAccents);

/**
 * @returns {{risk: boolean, markers: string[]}}
 */
export function screenForRisk(originalText) {
  const match = matchingText(originalText);
  const haystack = match.folded;
  const markers = FOLDED_MARKERS.filter((m) => haystack.indexOf(m) >= 0);

  const pain = FOLDED_PAIN.find((w) => new RegExp(`\\b${w}`).test(haystack));
  const site = FOLDED_SITES.find((w) => new RegExp(`\\b${w}`).test(haystack));
  if (pain && site) markers.push(`${pain}+${site}`);

  return { risk: markers.length > 0, markers };
}

/* Non-diagnostic out-of-scope copy.
 *
 * RELEASE GATE: this wording, in both languages, requires review by a qualified
 * clinician before any patient release. It is an engineering placeholder. It
 * must not assess, triage or name a condition, and it must not tell the user
 * how urgent their situation is.
 */
export const ESCALATION_COPY = {
  en: 'I am not able to help with symptoms, medication or clinical decisions, '
    + 'and I should not guess about them. Please speak with a qualified health '
    + 'professional about this. If this feels urgent, contact your local '
    + 'emergency service or urgent care. I can still help you reflect on a '
    + 'check-in you select in Sources.',
  es: 'No puedo ayudarte con síntomas, medicamentos ni decisiones clínicas, y no '
    + 'debo suponer nada sobre ellos. Por favor habla con un profesional de salud '
    + 'calificado sobre esto. Si te parece urgente, comunícate con tu servicio de '
    + 'emergencia o atención urgente local. Puedo ayudarte a reflexionar sobre un '
    + 'check-in que selecciones en Fuentes.',
};

export const ESCALATION_COPY_REVIEW_STATUS = {
  reviewedByQualifiedClinician: false,
  gate: 'patient-release',
  note: 'Engineering placeholder. Blocks patient release until reviewed in EN and ES.',
};
