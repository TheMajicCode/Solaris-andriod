/* A605-01 host envelope adapter suite — AUD-04.
 *
 * The frozen helper's own harness
 * (Solaris-Android-R4/grounding/actual-tests.js:54) asserts `cut >= 0` and the
 * exact ' /no_think' suffix BEFORE parsing, so the shipped helper's unguarded
 * parse is invisible to it. These cases assert the guards on the integration
 * side instead. The frozen helper is not edited.
 *
 * SCOPE: the parse seam only. Not the actual DailyService, not host bytecode,
 * not a device.
 */
import {
  parseHostPrompt, routeHostPrompt, localeFromPrompt,
  PROMPT_SUFFIX, SPANISH_DIRECTIVE, ENVELOPE_ERROR,
} from '../a605/host-envelope.mjs';
import { limitationReply } from '../a605/supported-surface.mjs';
import { ESCALATION_COPY, ESCALATION_COPY_REVIEW_STATUS } from '../a605/risk-screen.mjs';

const HEADER_EN = 'You are Pocket LUCA. Reply in en briefly.';
const HEADER_ES = `You are Pocket LUCA. ${SPANISH_DIRECTIVE}briefly.`;

function prompt(header, envelope, suffix = PROMPT_SUFFIX) {
  return `${header}\n${typeof envelope === 'string' ? envelope : JSON.stringify(envelope)}${suffix}`;
}

/** A total function must never throw and never return null, for any input. */
function totalReply(input, options) {
  let reply;
  try {
    reply = routeHostPrompt(input, options);
  } catch (error) {
    return { threw: true, error };
  }
  return { threw: false, reply };
}

const SELECTION = [{
  id: 'source_1',
  revision: 2,
  approvedFields: ['vitality', 'clarity', 'balance', 'alignment', 'date'],
  fields: { vitality: 2, clarity: 4, balance: 3, alignment: 5, date: '2026-09-16' },
  authorityEpoch: 0,
  permissionRevision: 1,
}];
const AUTHORITY = { epoch: 0, permissionRevision: 1 };

export function run(t) {
  // --- the suffix is exactly what the frozen harness asserts ---------------
  t.equal('suffix is the frozen ten-character directive', PROMPT_SUFFIX, ' /no_think');
  t.equal('suffix length is the frozen slice constant', PROMPT_SUFFIX.length, 10);

  // --- well-formed prompts parse, and route as the router specifies --------
  const good = parseHostPrompt(prompt(HEADER_EN, { user: 'hello', facts: [] }));
  t.ok('well-formed prompt parses', good.ok === true);
  t.equal('user is read from the envelope', good.user, 'hello');
  t.equal('facts default to the envelope array', good.facts.length, 0);
  t.equal('well-formed prompt routes', routeHostPrompt(prompt(HEADER_EN, { user: 'hello' })).kind, 'welcome');

  // A user string containing the suffix or a newline must not confuse the
  // parse — only the FIRST newline and the LAST ten characters are structural.
  const tricky = parseHostPrompt(prompt(HEADER_EN, { user: 'what can you do\nand /no_think' }));
  t.ok('a newline inside the JSON body does not split the envelope', tricky.ok === true);
  t.equal('the embedded newline survives in the user text',
          tricky.user, 'what can you do\nand /no_think');

  // --- Guard 1: indexOf('\n') === -1 --------------------------------------
  // The frozen code computes slice(-1 + 1, -10) === slice(0, -10), so it parses
  // the HEADER as the envelope instead of reporting a structural failure.
  const noBreak = parseHostPrompt(`${JSON.stringify({ user: 'hello' })}${PROMPT_SUFFIX}`);
  t.ok('a prompt with no newline is rejected, not parsed from offset 0', noBreak.ok === false);
  t.equal('no-newline reports the structural reason',
          noBreak.reason, ENVELOPE_ERROR.NO_HEADER_BREAK);

  // --- Guard 2: the trailing ten characters ------------------------------
  const wrongSuffix = parseHostPrompt(prompt(HEADER_EN, { user: 'hello' }, ' /nothink'));
  t.ok('a changed suffix is rejected', wrongSuffix.ok === false);
  t.equal('changed suffix reports the suffix reason', wrongSuffix.reason, ENVELOPE_ERROR.BAD_SUFFIX);

  const noSuffix = parseHostPrompt(prompt(HEADER_EN, { user: 'hello' }, ''));
  t.ok('an absent suffix is rejected rather than truncating ten JSON bytes',
       noSuffix.ok === false);
  t.equal('absent suffix reports the suffix reason', noSuffix.reason, ENVELOPE_ERROR.BAD_SUFFIX);

  // Short enough that slice(-10) would reach back past the newline.
  const shorterThanSuffix = parseHostPrompt('a\nb');
  t.ok('a prompt shorter than the suffix is rejected', shorterThanSuffix.ok === false);
  t.equal('short prompt reports the suffix reason',
          shorterThanSuffix.reason, ENVELOPE_ERROR.BAD_SUFFIX);

  const emptyBody = parseHostPrompt(prompt(HEADER_EN, ''));
  t.ok('an empty envelope body is rejected', emptyBody.ok === false);
  t.equal('empty body reports the empty reason', emptyBody.reason, ENVELOPE_ERROR.EMPTY_BODY);

  // --- Guard 3: JSON.parse and the envelope shape -------------------------
  const notJson = parseHostPrompt(prompt(HEADER_EN, '{user: hello}'));
  t.ok('a non-JSON body is rejected, not thrown', notJson.ok === false);
  t.equal('non-JSON reports the parse reason', notJson.reason, ENVELOPE_ERROR.NOT_JSON);

  for (const [label, body] of [['null', 'null'], ['an array', '[]'],
                               ['a number', '7'], ['a bare string', '"hello"']]) {
    const shape = parseHostPrompt(prompt(HEADER_EN, body));
    t.ok(`an envelope that is ${label} is rejected`, shape.ok === false);
    t.equal(`${label} reports the shape reason`, shape.reason, ENVELOPE_ERROR.NOT_AN_OBJECT);
  }

  // --- Guard 4: envelope.user is the value `.toLowerCase()` is called on ---
  for (const [label, value] of [['absent', undefined], ['null', null], ['a number', 7],
                                ['an object', { toLowerCase: 1 }], ['an array', ['hello']],
                                ['a boolean', true]]) {
    const envelope = value === undefined ? { facts: [] } : { user: value, facts: [] };
    const bad = parseHostPrompt(prompt(HEADER_EN, envelope));
    t.ok(`a user that is ${label} is rejected`, bad.ok === false);
    t.equal(`${label} user reports the user reason`, bad.reason, ENVELOPE_ERROR.USER_NOT_A_STRING);
  }

  // A `user` reachable only through the prototype chain must not be read.
  const proto = prompt(HEADER_EN, { facts: [] })
    .replace('{"facts":[]}', '{"facts":[],"__proto__":{"user":"hello"}}');
  const inherited = parseHostPrompt(proto);
  t.ok('a prototype-supplied user is not accepted', inherited.ok === false);

  // --- totality: every malformed input still produces a reply -------------
  const hostile = [
    undefined, null, 0, 7, true, false, {}, [], () => 'hello', Symbol('x'),
    '', ' ', '\n', PROMPT_SUFFIX, `\n${PROMPT_SUFFIX}`,
    `${HEADER_EN}\n${PROMPT_SUFFIX}`,
    prompt(HEADER_EN, '{'),
    prompt(HEADER_EN, '{"user":'),
    prompt(HEADER_EN, { user: 'hello' }, ' /no_thin'),
    prompt(HEADER_EN, { user: 'hello' }, ' /no_thinkk'),
    `${HEADER_EN}\n${JSON.stringify({ user: 'hello' })}`,
  ];
  let threw = 0;
  let nulled = 0;
  let leaked = 0;
  const LEAK = /TypeError|Cannot read|undefined|\[object|NaN|\.mjs|at Object/;
  for (const input of hostile) {
    const outcome = totalReply(input);
    if (outcome.threw) { threw += 1; continue; }
    if (outcome.reply === null || outcome.reply === undefined) { nulled += 1; continue; }
    if (typeof outcome.reply.message !== 'string' || LEAK.test(outcome.reply.message)) leaked += 1;
  }
  t.equal('no hostile prompt throws', threw, 0);
  t.equal('no hostile prompt returns null', nulled, 0);
  t.equal('no hostile prompt leaks a diagnostic', leaked, 0);
  t.equal('every hostile prompt is a limitation reply',
          hostile.filter((i) => totalReply(i).reply.kind === 'limitation').length, hostile.length);
  t.ok('every hostile prompt names its envelope error',
       hostile.every((i) => typeof totalReply(i).reply.envelopeError === 'string'));
  t.equal('a limitation from a bad envelope still requires zero model calls',
          totalReply(null).reply.modelCallsRequired, 0);

  // --- locale is probed from the raw prompt, so it survives a bad envelope --
  t.equal('the Spanish directive is detected', localeFromPrompt(HEADER_ES), 'es');
  t.equal('no directive means en', localeFromPrompt(HEADER_EN), 'en');
  t.equal('a non-string prompt defaults to en', localeFromPrompt(null), 'en');
  const badEs = routeHostPrompt(`${HEADER_ES}\nnot json${PROMPT_SUFFIX}`);
  const badEn = routeHostPrompt(`${HEADER_EN}\nnot json${PROMPT_SUFFIX}`);
  t.equal('a malformed Spanish prompt still replies in Spanish',
          badEs.message, limitationReply('es'));
  t.equal('a malformed English prompt replies in English',
          badEn.message, limitationReply('en'));
  t.ok('the two locales are not the same text', badEs.message !== badEn.message);

  // --- the adapter does not manufacture bindings --------------------------
  // The 604 envelope carries fields but no revision, approvedFields or
  // authority. Passing facts through as a selection must NOT produce an answer.
  const enveloped = prompt(HEADER_EN, {
    user: 'explain my check-in',
    facts: [{ fields: { vitality: 2, clarity: 4, balance: 3, alignment: 5, date: '2026-09-16' } }],
  });
  const unbound = routeHostPrompt(enveloped);
  t.equal('envelope facts alone yield no grounded answer', unbound.kind, 'checkin-select');
  t.ok('envelope facts alone bind no source', unbound.sourceRefs.length === 0);

  // With a caller-supplied, fully bound selection the same prompt answers.
  const bound = routeHostPrompt(enveloped, { selection: SELECTION, authority: AUTHORITY });
  t.equal('a caller-supplied bound selection answers', bound.kind, 'checkin');
  t.equal('the bound answer cites its source', bound.sourceRefs.length, 1);
  t.ok('the bound answer states the selected date', bound.message.includes('2026-09-16'));

  // --- the risk screen still runs first, through this seam ----------------
  const risky = routeHostPrompt(prompt(HEADER_EN, {
    user: 'my chest hurts, can we do my check-in?',
  }), { selection: SELECTION, authority: AUTHORITY });
  t.equal('a mixed clinical request through the host seam escalates',
          risky.kind, 'out-of-scope-clinical');
  t.equal('escalation through the host seam carries the clinician-review gate',
          risky.reviewGate, 'escalation-copy-requires-qualified-clinical-review');
  t.equal('escalation through the host seam cites no source', risky.sourceRefs.length, 0);

  // --- AUD-10: escalation language follows UI locale, by decision ----------
  // Contract §4. Asserted so the decision cannot change silently, NOT because
  // English copy for a Spanish message is a settled-good outcome. It is an open
  // item inside the existing clinician-review gate.
  const spanishMessageEnglishUi = routeHostPrompt(prompt(HEADER_EN, {
    user: 'me duele el pecho',
  }));
  const spanishMessageSpanishUi = routeHostPrompt(prompt(HEADER_ES, {
    user: 'me duele el pecho',
  }));
  t.equal('a Spanish clinical message escalates under an English UI',
          spanishMessageEnglishUi.kind, 'out-of-scope-clinical');
  t.equal('the Spanish marker is matched regardless of UI locale',
          spanishMessageEnglishUi.markers.join(','), 'duele+pecho');
  t.equal('escalation copy follows the UI locale, not the message language',
          spanishMessageEnglishUi.message, ESCALATION_COPY.en);
  t.equal('the same message under a Spanish UI escalates in Spanish',
          spanishMessageSpanishUi.message, ESCALATION_COPY.es);
  t.ok('the escalation copy is still an unreviewed engineering placeholder',
       ESCALATION_COPY_REVIEW_STATUS.reviewedByQualifiedClinician === false
       && ESCALATION_COPY_REVIEW_STATUS.gate === 'patient-release');

  // --- the original prompt text is never mutated --------------------------
  const original = prompt(HEADER_EN, { user: '  ¿Qué Es Un Check-In?  ' });
  const copy = String(original);
  routeHostPrompt(original);
  t.equal('the prompt string is not mutated by routing', original, copy);
  t.equal('the original user text is preserved verbatim',
          parseHostPrompt(original).user, '  ¿Qué Es Un Check-In?  ');
}
