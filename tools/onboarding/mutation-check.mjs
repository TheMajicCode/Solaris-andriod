#!/usr/bin/env node
/* Mutation check for the U0 onboarding candidate tests.
 *
 * Copies candidate/onboarding (without the generated .assets/) into a scratch
 * directory, reverts one guard at a time, runs tests/run.mjs in the copy and
 * requires BOTH a non-zero exit AND a failure line for the assertion that
 * guards that behaviour. A control that cannot fail is reported as SURVIVED.
 * The unmutated copy must pass first (the positive control).
 *
 * Usage: node tools/onboarding/mutation-check.mjs --out <scratch-dir>
 * Never writes inside the repository. Exit 0 only when every mutation is killed.
 */
import { cpSync, mkdirSync, readFileSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { join, resolve, relative, isAbsolute } from 'node:path';

const REPO = resolve(fileURLToPath(new URL('../..', import.meta.url)));
const SOURCE = join(REPO, 'candidate', 'onboarding');

// [id, file, find (must occur exactly once), replace, failing-label prefix, what the guard protects]
const MUTATIONS = [
  ['M01', 'route.mjs', "if (nativeState.hasVault === true) return { screen: 'returning', reason: 'vault-locked' };", "if (nativeState.hasVault !== false) return { screen: 'returning', reason: 'vault-locked' };", 'E3 screen', 'unknown hasVault falls through to returning (host 1012 behaviour)'],
  ['M02', 'route.mjs', "if (nativeState.hasVault === false) return { screen: 'welcome', reason: 'no-vault' };", "if (!nativeState.hasVault) return { screen: 'welcome', reason: 'no-vault' };", 'E3 screen', 'missing hasVault treated as false -> welcome'],
  ['M03', 'route.mjs', 'if (!(isPlainObject(nativeState.migration) && nativeState.migration.committed === true)) {', 'if (false) {', 'S4 screen', 'mandatory migration gate bypassed'],
  ['M04', 'route.mjs', "if (complete === true) return { screen: 'home', reason: 'onboarding-complete' };", "if (complete) return { screen: 'home', reason: 'onboarding-complete' };", 'S11 screen', 'non-boolean onboardingComplete accepted'],
  ['M05', 'actions.mjs', "call(() => host.request('openSetup'), () => {", "call(() => (host.request('provisionChoice', { enabled: true, mobileData: false }), host.request('openSetup')), () => {", 'B2 POSITIVE Get started', 'Get started reuses firstAI (provisionChoice then openSetup)'],
  ['M06', 'actions.mjs', 'call(() => host.openDiagnostics({ bridgeVersion: BRIDGE_VERSION }), () => {', "call(() => (host.change('onboarding', { name: '' }, host.uid()), host.openDiagnostics({ bridgeVersion: BRIDGE_VERSION })), () => {", 'E11 never change(onboarding)', 'Chapter-2 setup reuses the welcomeAI compound'],
  ['M07', 'actions.mjs', "    if (inflight.has('complete') && action !== 'language') {", '    if (false) {', 'F2 double tap ignored', 'Done double-tap guard'],
  ['M08', 'actions.mjs', "    emit();\n    call(() => host.change('onboarding', write.params, write.operationId), result => {", "    native = { ...native, onboardingComplete: true };\n    emit();\n    call(() => host.change('onboarding', write.params, write.operationId), result => {", 'F8 not Home before acknowledgement', 'Home before acknowledged success'],
  ['M09', 'actions.mjs', "} else if (settleCompletion(c, { key: 'error.doneFailed', retry: action })) {", "} else if (settleCompletion(c, { key: 'error.doneFailed', retry: action }) && (native = { ...native, onboardingComplete: true })) {", 'F20 failure keeps onboarding incomplete', 'failure marks onboarding complete'],
  ['M10', 'actions.mjs', '    }, doneTimeoutMs);', '    }, 1e12);', 'F31 timeout notice', 'Done timeout'],
  ['M11', 'actions.mjs', "      if (c.session !== epoch || isLocked()) { emit(); return; } // settled by the lock; never Home", '      // lock check removed', 'G4 a reply after the lock never navigates to Home', 'lock during await navigates Home'],
  ['M12', 'actions.mjs', '    if (LOCKED_SCREENS.includes(route().screen) || isLocked()) {', '    if (false) {', 'H2 ', 'locked language switch writes through the host'],
  ['M13', 'actions.mjs', '    ui.presentationLocale = target; // presentation only; drafts and patient text are untouched', '    ui.presentationLocale = target; const d = drafts(); for (const k of Object.keys(d)) delete d[k];', 'H5 ', 'language switch clears patient-entered drafts'],
  ['M14', 'actions.mjs', '    const reuse = ui.pendingWrite && ui.pendingWrite.params.name === name;', '    const reuse = false;', 'F34 timed-out retry reuses the exact operation', 'timeout retry issues a new operation id'],
  ['M15', 'actions.mjs', "      case 'withoutAI': ui.step = CHAPTER_COUNT;", "      case 'withoutAI': host.request('provisionChoice', { enabled: false, mobileData: false }); ui.step = CHAPTER_COUNT;", 'E19 Continue without AI needs no host call', 'Continue without AI calls the host'],
  ['M16', 'actions.mjs', '      if (completion) settleCompletion(completion, LOCKED_NOTICE);', '', 'G2 lock releases the save guard', 'lock leaves the save guard held'],
  ['M17', 'actions.mjs', "      case 'next': ui.step = clampStep(r.step + 1);", "      case 'next': host.change('sourcePermission', { id: 'all', approved: true }); ui.step = clampStep(r.step + 1);", 'E5 chapter 1 made no host call', 'chapter 1 changes source selections'],
  ['M18', 'actions.mjs', "if (code !== 'CANCELLED' && code !== 'VAULT_LOCKED') setNotice('error.setupFailed', 'error', { retry: action, screens: [key] });", '', 'B17 setup failure is visible', 'setup failure silently ignored'],
  ['M19', 'actions.mjs', '    }, openingTimeoutMs);', '    }, 1e12);', 'A14 wait elapsed', 'startup wait never offers retry'],
  ['M20', 'actions.mjs', "      if (!ui.presentationLocale && (storedBefore === 'es' || storedBefore === 'en')) ui.presentationLocale = storedBefore;", '', 'H20 a lock keeps the stored Spanish', 'locked screen falls back to English after a lock'],
  ['M21', 'render.mjs', "copyBlock(view, locale, 'returning.title', 'returning.body')", "copyBlock(view, locale, 'returning.title', 'returning.body', esc(view.name))", 'P4 returning ignores a name', 'personal name on the locked screen'],
  ['M22', 'render.mjs', ">${esc(t(locale, 'lang.button'))}</button>", '></button>', 'R5 ', 'button without a visible label/accessible name'],
  ['M23', 'render.mjs', 'alt="${esc(t(locale, \'a11y.emblem\'))}"', 'alt=""', 'R12 ', 'emblem without alt text'],
  ['M24', 'render.mjs', "${copyBlock(view, locale, 'welcome.title', 'welcome.body')}${renderNotice(view, locale)}${actions}", "${copyBlock(view, locale, 'welcome.title', 'welcome.body', actions)}${renderNotice(view, locale)}", 'R16 ', 'controls inside the animated copy'],
  ['M25', 'render.mjs', "${btn(t(locale, 'ch2.withoutAI'), 'withoutAI', 'ob-secondary', disabled)}", "${btn(t(locale, 'ch2.withoutAI'), 'withoutAI', 'ob-secondary', aiBusy ? 'disabled' : disabled)}", 'R21 ', 'Continue without AI blocked by AI setup'],
  ['M26', 'copy.mjs', "'ch2.withoutAI': 'Continuar sin IA',", "'ch2.withoutAI': 'Continue without AI',", 'K6 es ch2.withoutAI', 'English leaking into Spanish'],
  ['M27', 'copy.mjs', "  'ch3.doneRecords': 'Terminar y abrir mis registros',\n", '', 'K2 identical key sets', 'missing Spanish key'],
  ['M28', 'copy.mjs', "'welcome.aiNote': 'Pocket LUCA AI is optional. You can set it up later.',", "'welcome.aiNote': 'Pocket LUCA AI is optional. Local AI uses a one-time 382 MB download.',", 'K8 en welcome.aiNote has no model size', 'hardcoded model size'],
  ['M29', 'onboarding.css', '@media (prefers-reduced-motion: reduce) {', '@media (min-width: 99999px) {', 'M1 ', 'reduced-motion path removed'],
  ['M30', 'onboarding.css', '.ob-enter { animation: ob-in .24s ease-out both; }', '.ob-enter { animation: ob-in .24s ease-out infinite; }', 'M5 ', 'looping animation'],
  ['M31', 'onboarding.css', '/* U0 welcome/onboarding', `@import url(${'https:'}//fonts.example.invalid/inter.css);\n/* U0 welcome/onboarding`, 'F2 onboarding.css has no remote reference', 'remote font request'],
  ['M32', 'preview/index.html', "script-src 'self';", "script-src 'self' 'unsafe-inline';", 'I3 ', 'preview CSP weakened'],
  ['M34', 'render.mjs', "const copyClass = view => (view.animate === false ? 'ob-copy' : 'ob-copy ob-enter');", "const copyClass = view => 'ob-copy ob-enter';", 'A2 ', 'entrance replays on every same-screen update'],
  ['M33', 'actions.mjs', '        if (completion) settleCompletion(completion, null); // a retry still in flight is now moot\n', '', 'F36b the retry still in flight is settled', 'a moot retry keeps its guard and can post a notice on Home'],
];

function parseArgs(argv) {
  const i = argv.indexOf('--out');
  if (i < 0 || !argv[i + 1]) throw Error('usage: node tools/onboarding/mutation-check.mjs --out <scratch-dir>');
  const out = resolve(argv[i + 1]);
  const inside = relative(REPO, out);
  if (!inside.startsWith('..') && !isAbsolute(inside)) throw Error('--out must be outside the repository');
  return out;
}

function prepare(dir) {
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  cpSync(SOURCE, dir, { recursive: true, filter: src => !src.split(/[\\/]/).includes('.assets') });
}

function runTests(dir) {
  const r = spawnSync(process.execPath, [join(dir, 'tests', 'run.mjs')], { cwd: dir, encoding: 'utf8' });
  return { code: r.status, out: `${r.stdout}${r.stderr}` };
}

function main() {
  const out = parseArgs(process.argv.slice(2));
  const control = join(out, 'control');
  prepare(control);
  const base = runTests(control);
  const summary = (base.out.match(/summary: .*/) || ['?'])[0];
  console.log(`control (unmutated copy): exit ${base.code} — ${summary}`);
  if (base.code !== 0) { console.log('FAIL: the unmutated copy must pass before mutations mean anything'); process.exit(1); }

  let survived = 0;
  for (const [id, file, find, replace, label, protects] of MUTATIONS) {
    const dir = join(out, id);
    prepare(dir);
    const path = join(dir, file);
    const text = readFileSync(path, 'utf8');
    const count = text.split(find).length - 1;
    if (count !== 1) { console.log(`${id} INVALID  ${file}: pattern found ${count} times — ${protects}`); survived += 1; continue; }
    writeFileSync(path, text.replace(find, replace));
    const r = runTests(dir);
    const failing = r.out.split('\n').filter(l => l.startsWith('  - '));
    const matched = failing.some(l => l.startsWith(`  - ${label}`));
    const killed = r.code !== 0 && matched;
    if (!killed) survived += 1;
    console.log(`${id} ${killed ? 'KILLED  ' : 'SURVIVED'} exit ${r.code}, ${failing.length} failing, expected "${label}" ${matched ? 'failed' : 'did NOT fail'} — ${protects}`);
    rmSync(dir, { recursive: true, force: true });
  }
  rmSync(control, { recursive: true, force: true });
  console.log(`summary: ${MUTATIONS.length - survived} of ${MUTATIONS.length} mutations killed, ${survived} survived or invalid`);
  process.exit(survived ? 1 : 0);
}

if (!existsSync(SOURCE)) { console.log(`FAIL: ${SOURCE} not found`); process.exit(1); }
main();
