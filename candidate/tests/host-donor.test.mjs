/* A605 bounded host donor suite — candidate/a605/host-donor/fast-guided.js.
 *
 * The donor is evaluated here as plain JavaScript, exactly as the frozen
 * shipped helper is evaluated by baseline.mjs, with the same synthetic task
 * envelope. Every case is run against BOTH: the shipped helper must show the
 * recorded defect and the donor must not, so each assertion is also a
 * regression control against the baseline.
 *
 * SCOPE LIMIT: helper-level only. The same behaviour was measured on the ACTUAL
 * host bundle (tools/host/run-host-probe.py with donor-proof-cases.js), which
 * needs private inputs and cannot run in CI. This suite is what CI enforces.
 */
import { readFileSync } from 'node:fs';
import { createContext, runInContext } from 'node:vm';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { baselineTask, runBaseline } from './baseline.mjs';

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const DONOR_PATH = 'candidate/a605/host-donor/fast-guided.js';
const context = createContext({});
runInContext(readFileSync(join(REPO, DONOR_PATH), 'utf8'), context);
const runDonor = (user, locale, options) => context.fastGuided(baselineTask(user, locale, options));

const CHECKIN = { vitality: 2, clarity: 4, balance: 3, alignment: 5, date: '2026-09-15' };
const selected = () => ({
  facts: [{ fields: { ...CHECKIN } }],
  sources: [{ category: 'questionnaires' }],
  sourceRefs: [{ id: 'source_' + 'f'.repeat(32), revision: 1 }],
});

export function run(t) {
  // --- F04: boundary punctuation and polite prefixes -----------------------
  for (const [label, user, kind] of [
    ['leading inverted exclamation', '¡Hola!', 'welcome'],
    ['leading inverted question', '¿Qué puedes hacer?', 'welcome'],
    ['polite prefix with comma and punctuation', 'Por favor, ¿qué puedes hacer?', 'welcome'],
    ['can-you prefix', 'Can you explain my check-in?', 'checkin-select'],
    ['please prefix', 'Please explain my check-in', 'checkin-select'],
  ]) {
    const donor = runDonor(user, 'en');
    t.equal(`donor F04 ${label}: guided`, donor && donor.kind, kind);
    t.equal(`shipped F04 ${label}: NOT guided (the recorded defect)`, runBaseline(user, 'en'), null);
  }

  // A prefix only counts when a delimiter follows it; a word that merely starts
  // with the same letters is left alone.
  t.equal('please followed by a comma is a polite prefix', runDonor('Please, explain my check-in', 'en')?.kind, 'checkin-select');
  t.equal('a word that starts with por-favor is not a prefix', runDonor('por favorito', 'en'), null);
  t.equal('por favor followed by a space is a prefix', runDonor('por favor explica mi check-in', 'es')?.kind, 'checkin-select');

  // --- SP-CHAT-03: the app's own quick-action payloads ----------------------
  for (const [label, user, kind] of [
    ['step quick action', 'Help me choose a step today', 'step-select'],
    ['who-is quick action', 'Who is Pocket LUCA AI?', 'welcome'],
  ]) {
    t.equal(`donor ${label}: guided`, runDonor(user, 'en')?.kind, kind);
    t.equal(`shipped ${label}: NOT guided`, runBaseline(user, 'en'), null);
  }
  t.equal('the explain quick action was already guided and still is',
          runDonor('Explain my check-in', 'en')?.kind, 'checkin-select');

  // --- F05: a clinical request is never answered by the wellness shortcut ----
  for (const user of [
    'What should I do about severe chest pain during my check-in?',
    'How was my check-in yesterday after I fainted?',
    'What is my check-in? I have chest pain',
    'Explain my check-in because I took too many pills',
  ]) {
    t.equal(`donor F05 not shortcut: ${user}`, runDonor(user, 'en'), null);
  }
  // Shipped answered these two with an ordinary check-in explanation. (Other
  // phrasings were never shortcut on shipped, because its check-in rule needs a
  // leading question word; see tools/host/probes/donor-proof-expectations.json.)
  for (const user of ['What should I do about severe chest pain during my check-in?',
                      'How was my check-in yesterday after I fainted?']) {
    t.equal(`shipped F05 defect reproduced: ${user}`, runBaseline(user, 'en')?.kind, 'checkin-select');
  }

  // --- positives: grounded values are unchanged and still come only from a
  //     selected record; no invented values without one -----------------------
  const grounded = runDonor('Can you explain my check-in?', 'en', selected());
  t.equal('donor grounded reply with a selected check-in', grounded?.kind, 'checkin');
  t.ok('it quotes the selected values', grounded?.message.includes('vitality: 2/5'));
  t.equal('it cites exactly the selected record', grounded?.sourceRefs.length, 1);
  const shippedGrounded = runBaseline('Explain my check-in', 'en', selected());
  const donorGrounded = runDonor('Explain my check-in', 'en', selected());
  t.equal('for a shipped-accepted form, donor and shipped render identically',
          donorGrounded?.message, shippedGrounded?.message);
  t.ok('without a selection no value is rendered',
       !/\d\/5/.test(runDonor('Explain my check-in', 'en')?.message || ''));

  // --- controls: open chat keeps the model path; Spanish locale still works --
  t.equal('open chat still returns null (model path)', runDonor('Tell me a short story', 'en'), null);
  t.equal('arbitrary text still returns null', runDonor('asdfghjkl', 'en'), null);
  t.ok('Spanish locale renders Spanish copy',
       (runDonor('¿Explica mi check-in?', 'es')?.message || '').startsWith('En Solaris'));
  t.equal('shipped did not guide the leading-¿ Spanish form', runBaseline('¿Explica mi check-in?', 'es'), null);

  // --- every shipped acceptance message keeps its shipped outcome ------------
  for (const user of ['Hello', 'Hi!', 'hola', 'What can you do?', 'Choose a step', 'Explain my check-in',
                      'What are my most recent activities?', 'Show my recent records', 'What are my habits?',
                      'How was my sleep?', 'Tell me a short story', 'My name is Nila', 'What name did I give?',
                      'Write a poem about a check-in', 'I could not sleep well']) {
    const shipped = runBaseline(user, 'en');
    const donor = runDonor(user, 'en');
    t.equal(`shipped acceptance message keeps its kind: ${user}`, donor && donor.kind, shipped && shipped.kind);
  }
}
