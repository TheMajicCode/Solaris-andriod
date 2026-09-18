/* A605-01 guided routing.
 *
 * Contract: docs/ROUTING-AND-ANSWER-CONTRACT.md §3–§4.
 *
 * Deterministic. No model call, no store read, no source auto-selection, no
 * mutation. Unlike build 604's fastGuided, it NEVER returns null: every request
 * resolves to a supported answer, a bounded out-of-scope reply, or a
 * deterministic limitation. Returning null handed the request back to the
 * caller, which dispatches the model. The caller's authority, permission,
 * current-source, cancellation and persistence checks are unchanged.
 *
 * (The private groundedCheckin helper below does return null, meaning "no
 * usable selection"; routeRequest converts that into an honest reply.)
 *
 * INTEGRATION IS BLOCKED. See contract §8: building this into the candidate host
 * needs the exact 603 base HBC and the pinned hermesc, both excluded from this
 * source projection. This module is the reviewed source and its asserted
 * behaviour, not a shipped fix.
 */
import { matchingText, matchesWholeRequest } from './matching.mjs';
import { screenForRisk, ESCALATION_COPY } from './risk-screen.mjs';
import { limitationReply, usableSelection } from './supported-surface.mjs';
import { buildTypedFact, renderCheckinAnswer, AnswerRejected } from './answer-boundary.mjs';

const INTENTS = {
  greeting: {
    en: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
    es: ['hola', 'buenos dias', 'buenos días', 'buenas tardes', 'buenas noches'],
  },
  capabilities: {
    // `who is pocket luca ai` is the normalized form of the shipped UI button
    // payload `ask:Who is Pocket LUCA AI?`. Traced from
    // Solaris-Android-R4/ui/sanctuary.html and sanctuary.compact.html, where
    // quick actions dispatch via send(a.slice(4)).
    en: ['what can you do', 'what can you help me with', 'who are you', 'help',
         'who is pocket luca ai', 'who is pocket luca', 'what is pocket luca ai'],
    es: ['que puedes hacer', 'qué puedes hacer', 'quien eres', 'quién eres', 'ayuda',
         'quien es pocket luca ai', 'quién es pocket luca ai', 'que es pocket luca ai'],
  },
  checkinExplain: {
    en: ['what is a check-in', 'what is a check in', 'explain my check-in',
         'explain my check in', 'how is my check-in', 'how is my check in',
         'tell me about my check-in', 'review my check-in'],
    es: ['que es un check-in', 'qué es un check-in', 'como esta mi check-in',
         'cómo está mi check-in', 'explica mi check-in', 'revisa mi check-in'],
  },
  step: {
    // `help me choose a step today` is the shipped payload
    // `ask:Help me choose a step today`; `reflect on my step` is the adjacent
    // UI label. Both are supported so the app's own buttons work.
    en: ['choose a step', 'help me choose a step', 'help me choose a step today',
         'suggest a small step', 'reflect on my step', 'choose a step today'],
    es: ['elige un paso', 'elegir un paso', 'sugiere un paso pequeño',
         'ayudame a elegir un paso hoy', 'ayúdame a elegir un paso hoy',
         'reflexiona sobre mi paso'],
  },
};

function formsFor(intent) {
  return [...INTENTS[intent].en, ...INTENTS[intent].es];
}

const COPY = {
  welcome: {
    en: 'Hello. I am Pocket LUCA. I can help you reflect, choose a small step and review the records you select in Sources.',
    es: 'Hola. Soy Pocket LUCA. Puedo ayudarte a reflexionar, elegir un pequeño paso y revisar los registros que selecciones en Fuentes.',
  },
  checkinSelect: {
    en: 'A Solaris check-in records your impressions of vitality, clarity, balance and alignment. Select a check-in in Sources so we can review your own answers; missing answers stay missing.',
    es: 'En Solaris, un check-in es tu impresión de vitalidad, claridad, equilibrio y alineación. Selecciona un check-in en Fuentes para revisar tus respuestas; no completaré lo que falta.',
  },
  stepSuffix: {
    en: 'For a small step, choose one of those aspects and write what would support it today. You decide whether to act on it.',
    es: 'Para un pequeño paso, elige uno de esos aspectos y escribe qué te ayudaría hoy. Tú decides si quieres hacerlo.',
  },
  stepSelect: {
    en: 'Choose something small and concrete: write what is on your mind, name an intention or review an unfinished step. Which fits you now? Select a check-in in Sources to tailor this to your answers.',
    es: 'Elige algo pequeño y concreto: escribe lo que sientes, nombra una intención o revisa un paso pendiente. ¿Cuál encaja contigo ahora? Selecciona un check-in en Fuentes para adaptarlo a tus respuestas.',
  },
};

/**
 * Route one request.
 *
 * @param {object} request
 * @param {string} request.user      original user text, never mutated
 * @param {'en'|'es'} request.locale
 * @returns {{kind:string, message:string, sourceRefs:Array, modelCallsRequired:number}|null}
 */
export function routeRequest(request) {
  const locale = request && request.locale === 'es' ? 'es' : 'en';
  // A non-string or absent input is a host-path defect, not a user question.
  // It still resolves deterministically rather than throwing, so no caller can
  // fall back to open generation on an exception.
  if (!request || typeof request.user !== 'string') {
    return {
      kind: 'limitation',
      message: limitationReply(locale),
      sourceRefs: [],
      modelCallsRequired: 0,
    };
  }
  const match = matchingText(request.user);
  if (!match.normalized.length) {
    // Empty or punctuation-only input (`¿?`, whitespace) still gets a
    // deterministic outcome. Returning null here would hand it to the model.
    return {
      kind: 'limitation',
      message: limitationReply(locale),
      sourceRefs: [],
      modelCallsRequired: 0,
    };
  }

  // Step 1 — risk screen runs BEFORE any wellness shortcut. This is the F05 fix.
  const risk = screenForRisk(request.user);
  if (risk.risk) {
    return {
      kind: 'out-of-scope-clinical',
      message: ESCALATION_COPY[locale],
      sourceRefs: [],
      modelCallsRequired: 0,
      markers: risk.markers,
      reviewGate: 'escalation-copy-requires-qualified-clinical-review',
    };
  }

  // Step 2 — zero-source-safe intents.
  if (matchesWholeRequest(match, formsFor('greeting'))
      || matchesWholeRequest(match, formsFor('capabilities'))) {
    return { kind: 'welcome', message: COPY.welcome[locale], sourceRefs: [], modelCallsRequired: 0 };
  }

  // Step 3 — record-dependent supported intents. Selection, never inference.
  const wantsCheckin = matchesWholeRequest(match, formsFor('checkinExplain'));
  const wantsStep = matchesWholeRequest(match, formsFor('step'));

  if (wantsCheckin || wantsStep) {
    const grounded = groundedCheckin(request);
    if (grounded) {
      return {
        kind: wantsStep ? 'step' : 'checkin',
        message: wantsStep ? `${grounded.message} ${COPY.stepSuffix[locale]}` : grounded.message,
        sourceRefs: grounded.sourceRefs,
        modelCallsRequired: 0,
        typedFacts: grounded.typedFacts,
      };
    }
    // Nothing usable is selected. Say so; never fill the gap.
    return {
      kind: wantsStep ? 'step-select' : 'checkin-select',
      message: wantsStep ? COPY.stepSelect[locale] : COPY.checkinSelect[locale],
      sourceRefs: [],
      modelCallsRequired: 0,
    };
  }

  // Step 4 — not the supported surface. A deterministic limitation that names
  // what CAN be asked. Returning null here would hand the request to open
  // generation, which is exactly what this contract forbids.
  return {
    kind: 'limitation',
    message: limitationReply(locale),
    sourceRefs: [],
    modelCallsRequired: 0,
  };
}

/**
 * Build a grounded check-in answer from explicitly selected, approved fields.
 *
 * Returns null when no usable selection exists — missing stays missing, and the
 * caller must not substitute anything for it.
 */
function groundedCheckin(request) {
  // Malformed entries are dropped rather than read: selection: [null] used to
  // throw here, which escaped the deterministic contract entirely.
  const selection = usableSelection(request.selection);
  const authority = request.authority;
  if (!selection.length || !authority || typeof authority !== 'object') return null;

  const locale = request.locale === 'es' ? 'es' : 'en';
  const aspects = ['vitality', 'clarity', 'balance', 'alignment'];

  // Newest selected check-in that actually carries a valid date.
  let chosen = null;
  for (const source of selection) {
    let dateFact;
    try {
      dateFact = buildTypedFact(selection, authority,
                                { sourceId: source.id, revision: source.revision, field: 'date' });
    } catch (error) {
      if (error instanceof AnswerRejected) continue;
      throw error;
    }
    if (!chosen || dateFact.value > chosen.date) chosen = { source, date: dateFact.value, dateFact };
  }
  if (!chosen) return null;

  // The rendered answer states the date, so the date is bound like any other
  // displayed fact. Previously it was validated but omitted from typedFacts,
  // leaving a displayed claim with no authorized binding behind it.
  const typedFacts = [chosen.dateFact];
  for (const field of aspects) {
    try {
      typedFacts.push(buildTypedFact(selection, authority,
                                     { sourceId: chosen.source.id, revision: chosen.source.revision, field }));
    } catch (error) {
      if (error instanceof AnswerRejected) continue;   // missing or unapproved stays absent
      throw error;
    }
  }

  return {
    message: renderCheckinAnswer(typedFacts, locale, chosen.date),
    sourceRefs: [{ id: chosen.source.id, revision: chosen.source.revision }],
    typedFacts,
  };
}
