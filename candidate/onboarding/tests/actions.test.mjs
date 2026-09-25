/* U0-02 intent adapter suite.
 *
 * A spy host records every operation; manual thenables and a fake clock make
 * each async path deterministic and synchronous. Positive controls (the happy
 * path works) sit beside every refusal.
 * SCOPE: adapter level. The host functions are doubles modelled on the traced
 * host (docs/onboarding/HOST-TRACE.md); this is not the host page, the native
 * wrapper, the APK or a device.
 */
import {
  SCREEN_ACTIONS, BRIDGE_VERSION, DONE_TIMEOUT_MS, OPENING_TIMEOUT_MS, INTENT_OPERATIONS, codeOf,
} from '../actions.mjs';
import { setup, STATES, ops, call } from './fakes.mjs';

const ALL_ACTIONS = [...new Set([...Object.values(SCREEN_ACTIONS).flat(), 'unknownAction', 'provisionChoice', 'welcomeAI', 'firstAI'])];
const COMPLETION = ['skip', 'done', 'doneCheckin', 'doneRecords'];
const SETUP = ['start', 'restore', 'unlock', 'migrationSetup'];

function startup(t) {
  {
    const { host, controller } = setup(null);
    t.equal('A1 nothing received -> opening', controller.view().screen, 'opening');
    controller.start();
    t.equal('A2 start only reads view', ops(host).join(), 'request:view');
    t.equal('A3 second start while pending is ignored', controller.start().status, 'ignored');
    t.equal('A4 still one read', host.calls.length, 1);
    call(host).d.resolve(STATES.noVault);
    t.equal('A5 POSITIVE confirmed no vault -> welcome', controller.view().screen, 'welcome');
  }
  {
    const { host, controller } = setup(null);
    controller.start();
    call(host).d.reject(Error('BRIDGE_UNAVAILABLE'));
    const v = controller.view();
    t.equal('A6 native error -> opening', v.screen, 'opening');
    t.equal('A7 reason error', v.reason, 'error');
    t.equal('A8 code kept', v.code, 'BRIDGE_UNAVAILABLE');
    t.equal('A9 retry offered', v.retry, true);
    t.equal('A10 retry starts', controller.dispatch('retry').status, 'started');
    t.equal('A11 retry is a second read, nothing else', ops(host).join(), 'request:view,request:view');
    call(host).d.resolve(STATES.locked);
    t.equal('A12 POSITIVE retry success -> returning', controller.view().screen, 'returning');
  }
  {
    const { host, clock, controller } = setup(null);
    controller.start();
    clock.advance(OPENING_TIMEOUT_MS - 1);
    t.equal('A13 before the wait: no retry', controller.view().retry, false);
    clock.advance(1);
    t.equal('A14 wait elapsed -> timeout reason', controller.view().reason, 'timeout');
    t.equal('A15 timeout is never welcome', controller.view().screen, 'opening');
    t.equal('A16 retry allowed although the first read hangs', controller.dispatch('retry').status, 'started');
    t.equal('A17 two reads', host.calls.length, 2);
    host.calls[0].d.resolve(STATES.noVault);
    t.equal('A18 a late valid native reply still routes', controller.view().screen, 'welcome');
  }
  {
    const { host, clock, controller } = setup(null);
    controller.start();
    call(host).d.resolve({ locked: true });
    t.equal('A19 reply with unknown hasVault stays opening', controller.view().screen, 'opening');
    clock.advance(OPENING_TIMEOUT_MS);
    t.equal('A20 retry appears after the wait even though the read resolved', controller.view().retry, true);
  }
  {
    const { controller } = setup({ locked: true });
    t.equal('A21 host initial {locked:true} is opening, not returning', controller.view().screen, 'opening');
  }
}

function welcome(t) {
  {
    const { host, controller } = setup(STATES.noVault);
    t.equal('B1 Get started starts', controller.dispatch('start').status, 'started');
    t.equal('B2 POSITIVE Get started = openSetup alone (host 1376)', ops(host).join(), 'request:openSetup');
    t.equal('B3 openSetup sends no params', call(host).params, undefined);
    t.equal('B4 double tap ignored', controller.dispatch('start').status, 'ignored');
    t.equal('B5 restore during the same setup ignored', controller.dispatch('restore').status, 'ignored');
    t.equal('B6 one call', host.calls.length, 1);
    t.equal('B7 pending shown', controller.view().pending.setup, true);
    call(host).d.resolve({ opened: true });
    t.equal('B8 unchanged native state -> still welcome', controller.view().screen, 'welcome');
    t.equal('B9 nothing claimed on reply', controller.view().notice, null);
    t.equal('B10 no write of any kind', host.calls.some(c => c.op === 'change'), false);
    controller.setNativeState(STATES.incomplete);
    t.equal('B11 POSITIVE native unlock -> chapter 1', controller.view().screen, 'chapter');
  }
  {
    const { host, controller } = setup(STATES.noVault);
    controller.dispatch('restore');
    t.equal('B12 restore uses the same existing openSetup path', ops(host).join(), 'request:openSetup');
    call(host).d.reject(Error('CANCELLED'));
    const v = controller.view();
    t.equal('B13 restore cancelled -> welcome again', v.screen, 'welcome');
    t.equal('B14 cancel shows no error', v.notice, null);
    t.equal('B15 buttons usable again', v.pending.setup, false);
    t.equal('B16 cancel created nothing', host.calls.length, 1);
  }
  {
    const { host, controller } = setup(STATES.noVault);
    controller.dispatch('start');
    call(host).d.reject(Error('BRIDGE_SEND_FAILED'));
    const v = controller.view();
    t.equal('B17 setup failure is visible', v.notice && v.notice.key, 'error.setupFailed');
    t.equal('B18 retry repeats the same intent', v.notice && v.notice.retry, 'start');
    t.equal('B19 failure notice is an alert', v.notice && v.notice.tone, 'error');
  }
  {
    const { host, controller } = setup(STATES.noVault);
    controller.dispatch('vision');
    t.equal('B20 vision panel opens', controller.view().vision, true);
    controller.dispatch('visionClose');
    t.equal('B21 vision panel closes', controller.view().vision, false);
    t.equal('B22 vision makes no host call', host.calls.length, 0);
  }
}

function returningAndMigration(t) {
  {
    const { host, controller } = setup(STATES.locked);
    for (const a of ['start', 'restore', 'done', 'skip', 'next', 'aiSetup']) {
      t.equal(`C1 returning refuses ${a}`, controller.dispatch(a).status, 'blocked');
    }
    t.equal('C2 refusals made no call', host.calls.length, 0);
    controller.dispatch('unlock');
    t.equal('C3 POSITIVE unlock -> openSetup', ops(host).join(), 'request:openSetup');
    call(host).d.resolve({ opened: true });
    t.equal('C4 cancelled/unsuccessful authentication stays returning', controller.view().screen, 'returning');
    controller.dispatch('lockedAiSetup');
    t.equal('C5 locked AI setup -> openDiagnostics (host 1012)', call(host).op, 'openDiagnostics');
    t.equal('C6 bridge version', call(host).params.bridgeVersion, BRIDGE_VERSION);
    controller.setNativeState(STATES.complete);
    t.equal('C7 POSITIVE returning owner unlocks straight to home, no tour', controller.view().screen, 'home');
  }
  {
    const { host, controller } = setup(STATES.migrationPending);
    for (const a of ['skip', 'done', 'next', 'withoutAI']) {
      t.equal(`D1 migration refuses ${a}`, controller.dispatch(a).status, 'blocked');
    }
    t.equal('D2 no onboarding write during migration', host.calls.length, 0);
    controller.dispatch('migrationSetup');
    t.equal('D3 POSITIVE migration continues via openSetup', ops(host).join(), 'request:openSetup');
    call(host).d.resolve({ opened: true });
    t.equal('D4 still migration until native commits it', controller.view().screen, 'migration');
  }
}

function chapters(t) {
  {
    const { host, controller } = setup(STATES.incomplete);
    t.equal('E1 chapter 1', controller.view().step, 1);
    t.equal('E2 chapter 1 has no Back', controller.dispatch('back').status, 'blocked');
    controller.dispatch('next');
    t.equal('E3 POSITIVE Continue -> chapter 2', controller.view().step, 2);
    controller.dispatch('back');
    t.equal('E4 Back -> chapter 1', controller.view().step, 1);
    t.equal('E5 chapter 1 made no host call: no source selection added or cleared', host.calls.length, 0);
  }
  {
    const { host, controller } = setup(STATES.incomplete, { step: 2 });
    t.equal('E6 at chapter 2', controller.view().step, 2);
    controller.dispatch('aiSetup');
    t.equal('E7 POSITIVE Set up Pocket LUCA -> openDiagnostics only', ops(host).join(), 'openDiagnostics');
    t.equal('E8 Continue without AI stays available while setup opens', SCREEN_ACTIONS.chapter2.includes('withoutAI'), true);
    call(host).d.resolve({ opened: true });
    const v = controller.view();
    t.equal('E9 returns to the intended chapter', v.step, 2);
    t.equal('E10 tour not completed by setup', v.screen, 'chapter');
    t.equal('E11 never change(onboarding) from setup', host.calls.some(c => c.op === 'change'), false);
    t.equal('E12 never provisionChoice', host.calls.some(c => c.method === 'provisionChoice'), false);
    t.equal('E13 no model claim after setup returns', v.notice, null);
  }
  for (const code of ['BRIDGE_REPLY_TIMEOUT', 'LOCAL_PERMISSION_REQUIRED', 'QVAC_UNAVAILABLE', 'BRIDGE_SEND_FAILED']) {
    const { host, controller } = setup(STATES.incomplete, { step: 2 });
    controller.dispatch('aiSetup');
    call(host).d.reject(Error(code));
    t.equal(`E14 ${code}: visible notice`, controller.view().notice && controller.view().notice.key, 'error.aiSetupFailed');
    t.equal(`E15 ${code}: stays on chapter 2`, controller.view().step, 2);
    t.equal(`E16 ${code}: Continue without AI works`, controller.dispatch('withoutAI').status, 'done');
    controller.dispatch('done');
    call(host).d.resolve(STATES.complete);
    t.equal(`E17 ${code}: POSITIVE local tools (Home) reached without AI`, controller.view().screen, 'home');
    t.equal(`E18 ${code}: only diagnostics + one onboarding write`, ops(host).join(), 'openDiagnostics,change:onboarding');
  }
  {
    const { host, controller } = setup(STATES.incomplete, { step: 2 });
    controller.dispatch('withoutAI');
    t.equal('E19 Continue without AI needs no host call and no network', host.calls.length, 0);
    t.equal('E20 Continue without AI -> chapter 3', controller.view().step, 3);
  }
  {
    const { host, controller } = setup(STATES.incomplete, { step: 2 });
    controller.dispatch('aiSetup');
    controller.dispatch('aiSetup');
    t.equal('E21 AI setup double tap = one call', host.calls.length, 1);
  }
}

function completion(t) {
  {
    const drafts = { name: 'Ana Synthetic' };
    const { host, controller } = setup(STATES.incomplete, { step: 3, drafts });
    t.equal('F1 Done starts', controller.dispatch('done').status, 'started');
    t.equal('F2 double tap ignored', controller.dispatch('done').status, 'ignored');
    t.equal('F3 another finish button during save is a duplicate, ignored', controller.dispatch('doneCheckin').status, 'ignored');
    t.equal('F4 Back during save is busy', controller.dispatch('back').status, 'busy');
    t.equal('F5 exactly one call', ops(host).join(), 'change:onboarding');
    t.equal('F6 name sent', call(host).params.name, 'Ana Synthetic');
    t.equal('F7 operation id from host uid', call(host).operationId, 'op_1');
    t.equal('F8 not Home before acknowledgement', controller.view().screen, 'chapter');
    t.equal('F9 saving shown', controller.view().pending.complete, true);
    call(host).d.resolve(STATES.complete);
    t.equal('F10 POSITIVE acknowledged -> home', controller.view().screen, 'home');
    t.equal('F11 plain Done has no follow-up', controller.view().after, null);
    t.equal('F12 adapter never edits drafts', drafts.name, 'Ana Synthetic');
  }
  {
    const { host, controller } = setup(STATES.incomplete, { step: 2 });
    controller.dispatch('skip');
    t.equal('F13 Skip uses the same acknowledged completion (host 1100)', ops(host).join(), 'change:onboarding');
    t.equal('F14 Skip + Done double tap = one call', controller.dispatch('skip').status, 'ignored');
    call(host).d.resolve(STATES.complete);
    t.equal('F15 POSITIVE Skip acknowledged -> home', controller.view().screen, 'home');
  }
  {
    const { host, controller } = setup(STATES.incomplete, { step: 3 });
    controller.dispatch('doneCheckin');
    t.equal('F16 check-in not offered before success', controller.view().after, null);
    call(host).d.resolve(STATES.complete);
    t.equal('F17 POSITIVE check-in only after success', controller.view().after, 'checkin');
  }
  {
    const { host, controller } = setup(STATES.incomplete, { step: 3 });
    controller.dispatch('doneRecords');
    call(host).d.reject(Error('OPERATION_FAILED'));
    t.equal('F18 records not offered after failure', controller.view().after, null);
    t.equal('F19 failure stays on the chapter', controller.view().screen, 'chapter');
  }
  {
    const { host, controller } = setup(STATES.incomplete, { step: 3, drafts: { name: 'Ana Synthetic' } });
    controller.dispatch('done');
    call(host).d.reject(Error('VAULT_OPERATION_FAILED'));
    const v = controller.view();
    t.equal('F20 failure keeps onboarding incomplete', v.screen, 'chapter');
    t.equal('F21 failure keeps step 3', v.step, 3);
    t.equal('F22 localized failure notice', v.notice && v.notice.key, 'error.doneFailed');
    t.equal('F23 retry names the action', v.notice && v.notice.retry, 'done');
    t.equal('F24 draft kept after failure', v.name, 'Ana Synthetic');
    t.equal('F25 guard released after failure', v.pending.complete, false);
    controller.dispatch('done');
    t.equal('F26 retry after a definite failure is a new operation', call(host).operationId, 'op_2');
    call(host).d.resolve(STATES.complete);
    t.equal('F27 POSITIVE retry success -> home', controller.view().screen, 'home');
  }
  {
    const { host, controller } = setup(STATES.incomplete, { step: 3 });
    controller.dispatch('done');
    call(host).d.resolve(STATES.incomplete);
    t.equal('F28 reply that does not confirm completion stays on the chapter', controller.view().screen, 'chapter');
    t.equal('F29 not-confirmed notice', controller.view().notice && controller.view().notice.key, 'error.doneNotConfirmed');
  }
  {
    const { host, clock, controller } = setup(STATES.incomplete, { step: 3, drafts: { name: 'Ana Synthetic' } });
    controller.dispatch('done');
    clock.advance(DONE_TIMEOUT_MS - 1);
    t.equal('F30 before the timeout: still saving', controller.view().pending.complete, true);
    clock.advance(1);
    const v = controller.view();
    t.equal('F31 timeout notice', v.notice && v.notice.key, 'error.doneTimeout');
    t.equal('F32 timeout keeps onboarding incomplete', v.screen, 'chapter');
    t.equal('F33 retry available after timeout', controller.dispatch('done').status, 'started');
    t.equal('F34 timed-out retry reuses the exact operation (host pendingWrite 1256-1283)', call(host).operationId, call(host, 0).operationId);
    t.equal('F35 one call per deliberate tap', host.calls.length, 2);
    host.calls[0].d.resolve(STATES.complete);
    t.equal('F36 POSITIVE late acknowledged success still reaches home', controller.view().screen, 'home');
    t.equal('F36b the retry still in flight is settled by that success', controller.view().pending.complete, false);
    host.calls[1].d.reject(Error('OPERATION_FAILED'));
    t.equal('F36c a later failure of the moot retry leaves no notice', controller.view().notice, null);
  }
  {
    const drafts = { name: 'Ana' };
    const { host, clock, controller } = setup(STATES.incomplete, { step: 3, drafts });
    controller.dispatch('done');
    clock.advance(DONE_TIMEOUT_MS);
    drafts.name = 'Ana Synthetic';
    controller.dispatch('done');
    t.ok('F37 an edited name after timeout is a new operation', call(host).operationId !== call(host, 0).operationId);
    t.equal('F38 the edited name is sent', call(host).params.name, 'Ana Synthetic');
  }
  {
    const { host, clock, controller } = setup(STATES.incomplete, { step: 3 });
    controller.dispatch('done');
    clock.advance(DONE_TIMEOUT_MS);
    call(host).d.reject(Error('OPERATION_FAILED'));
    t.equal('F39 a late failure after timeout does not replace the notice', controller.view().notice && controller.view().notice.key, 'error.doneTimeout');
  }
}

function lockDuringAwait(t) {
  {
    const { host, controller } = setup(STATES.incomplete, { step: 3, drafts: { name: 'Ana Synthetic' } });
    controller.dispatch('done');
    controller.setNativeState({ locked: true }); // host 792 accept({locked:true})
    t.equal('G1 lock during await -> returning immediately', controller.view().screen, 'returning');
    t.equal('G2 lock releases the save guard', controller.view().pending.complete, false);
    t.equal('G3 non-private notice on the locked screen', controller.view().notice && controller.view().notice.key, 'error.lockedDuringSave');
    call(host).d.resolve(STATES.complete); // reply arrives after the lock
    const v = controller.view();
    t.equal('G4 a reply after the lock never navigates to Home', v.screen, 'returning');
    t.equal('G5 no name exposed on the locked screen', v.name, '');
  }
  {
    const { host, controller } = setup(STATES.incomplete, { step: 3 });
    controller.dispatch('done');
    controller.setNativeState({ locked: true });
    call(host).d.reject(Error('VAULT_LOCKED')); // host 792 rejects pending with VAULT_LOCKED
    t.equal('G6 VAULT_LOCKED rejection keeps the locked screen', controller.view().screen, 'returning');
    t.equal('G7 no failure claim, only the lock notice', controller.view().notice && controller.view().notice.key, 'error.lockedDuringSave');
  }
  {
    const { host, clock, controller } = setup(STATES.incomplete, { step: 3 });
    controller.dispatch('done');
    controller.setNativeState({ locked: true });
    clock.advance(DONE_TIMEOUT_MS);
    t.equal('G8 the timeout after a lock stays on the locked screen', controller.view().screen, 'returning');
    t.equal('G9 no timeout notice replaces the lock notice', controller.view().notice && controller.view().notice.key, 'error.lockedDuringSave');
  }
  {
    const { host, controller } = setup(STATES.incomplete, { step: 3 });
    controller.dispatch('done');
    controller.setNativeState({ locked: true });
    controller.setNativeState(STATES.incomplete); // restored session authority
    call(host).d.resolve(STATES.complete); // stale reply from before the lock
    t.equal('G10 a stale pre-lock reply does not navigate after re-unlock', controller.view().screen, 'chapter');
    t.equal('G11 lock notice cleared after unlock', controller.view().notice, null);
    t.equal('G12 POSITIVE Done works again at once after re-unlock', controller.dispatch('done').status, 'started');
  }
}

function language(t) {
  for (const state of [STATES.noVault, STATES.locked, null, { locked: true }]) {
    const drafts = { name: 'Ana Synthetic', checkin: { note: 'synthetic note' } };
    const snapshot = JSON.stringify(drafts);
    const { host, controller } = setup(state, { drafts });
    const label = state ? JSON.stringify(state) : 'null';
    const storage = [];
    const spy = new Proxy({}, { get: (o, k) => { storage.push(String(k)); return () => null; } });
    const saved = { local: globalThis.localStorage, session: globalThis.sessionStorage };
    globalThis.localStorage = spy;
    globalThis.sessionStorage = spy;
    let result;
    try { result = controller.dispatch('language'); } finally {
      globalThis.localStorage = saved.local;
      globalThis.sessionStorage = saved.session;
    }
    t.equal(`H1 ${label}: locked switch persists nothing`, result.persisted, false);
    t.equal(`H2 ${label}: no host call`, host.calls.length, 0);
    t.equal(`H3 ${label}: POSITIVE presentation switched`, controller.view().locale, 'es');
    t.equal(`H4 ${label}: drafts object kept`, host.drafts, drafts);
    t.equal(`H5 ${label}: patient-entered text unchanged`, JSON.stringify(drafts), snapshot);
    t.equal(`H6 ${label}: no storage touched`, storage.length, 0);
    controller.dispatch('language');
    t.equal(`H7 ${label}: switches back`, controller.view().locale, 'en');
  }
  {
    const drafts = { name: 'Ana Synthetic' };
    const { host, controller } = setup(STATES.incomplete, { step: 3, drafts, locale: 'en' });
    const result = controller.dispatch('language');
    t.equal('H8 POSITIVE unlocked switch persists via change(experienceLocale) (host 1094)', ops(host).join(), 'change:experienceLocale');
    t.equal('H9 target locale sent', call(host).params.locale, 'es');
    t.equal('H10 started', result.status, 'started');
    t.equal('H11 presentation switches immediately', controller.view().locale, 'es');
    call(host).d.resolve({ ...STATES.incomplete, experience: { locale: 'es' } });
    t.equal('H12 stored locale adopted', controller.view().locale, 'es');
    t.equal('H13 chapter and draft unchanged by the switch', `${controller.view().step}|${controller.view().name}`, '3|Ana Synthetic');
  }
  {
    const { host, controller } = setup(STATES.incomplete, { locale: 'en' });
    controller.dispatch('language');
    call(host).d.reject(Error('OPERATION_FAILED'));
    t.equal('H14 unlocked save failure keeps the chosen presentation', controller.view().locale, 'es');
    t.equal('H15 unlocked save failure is visible', controller.view().notice && controller.view().notice.key, 'error.languageNotSaved');
  }
  {
    const { host, controller } = setup(STATES.noVault);
    controller.dispatch('language');
    t.equal('H16 still nothing persisted while locked', host.calls.length, 0);
    controller.setNativeState({ ...STATES.incomplete, experience: { locale: 'en' } });
    t.equal('H17 POSITIVE after unlock the chosen locale is persisted once', ops(host).join(), 'change:experienceLocale');
    t.equal('H18 with the chosen value', call(host).params.locale, 'es');
  }
  {
    const { host, controller } = setup(STATES.noVault);
    controller.dispatch('language');
    controller.setNativeState({ ...STATES.incomplete, experience: { locale: 'es' } });
    t.equal('H19 no write when the stored locale already matches', host.calls.length, 0);
  }
  {
    const { host, controller } = setup(STATES.complete, { locale: 'es' });
    controller.setNativeState({ locked: true });
    t.equal('H20 a lock keeps the stored Spanish on the returning screen (host 792 falls back to English)', controller.view().locale, 'es');
    controller.setNativeState({ ...STATES.complete, experience: { locale: 'es' } });
    t.equal('H21 unlocking with the same stored locale writes nothing', host.calls.length, 0);
  }
  {
    const { host, controller } = setup(STATES.noVault, { deviceLocale: 'es' });
    controller.setNativeState({ ...STATES.incomplete, experience: { locale: 'en' } });
    t.equal('H22 a device-language default is never written on unlock', host.calls.length, 0);
    t.equal('H23 stored locale wins over the device default once known', controller.view().locale, 'en');
  }
}

function sweep(t) {
  // Every action on every screen: only the traced operations can ever be reached.
  const screens = [
    ['opening', null, 1], ['welcome', STATES.noVault, 1], ['returning', STATES.locked, 1],
    ['migration', STATES.migrationPending, 1], ['chapter1', STATES.incomplete, 1],
    ['chapter2', STATES.incomplete, 2], ['chapter3', STATES.incomplete, 3], ['home', STATES.complete, 1],
  ];
  let reached = 0;
  for (const [name, state, step] of screens) {
    for (const action of ALL_ACTIONS) {
      const { host, controller } = setup(state, { step });
      controller.dispatch(action);
      for (const c of host.calls) {
        reached += 1;
        const op = c.op === 'request' ? `request:${c.method}` : c.op === 'change' ? `change:${c.kind}` : c.op;
        t.ok(`S1 ${name}/${action}: operation ${op} is one of the traced operations`,
          ['request:view', 'request:openSetup', 'openDiagnostics', 'change:onboarding', 'change:experienceLocale'].includes(op));
        t.ok(`S2 ${name}/${action}: never provisionChoice`, c.method !== 'provisionChoice' && c.kind !== 'provisionChoice');
        if (op === 'change:onboarding') t.ok(`S3 ${name}/${action}: onboarding write only from a completion action on a chapter`, COMPLETION.includes(action) && name.startsWith('chapter'));
        if (op === 'request:openSetup') t.ok(`S4 ${name}/${action}: openSetup only from a setup action`, SETUP.includes(action));
        if (c.op === 'change') t.ok(`S5 ${name}/${action}: no write while locked or unknown`, !['opening', 'welcome', 'returning'].includes(name));
      }
      if (!(SCREEN_ACTIONS[name] || []).includes(action)) t.equal(`S6 ${name}/${action}: refused action made no call`, host.calls.length, 0);
    }
  }
  t.ok('S7 the sweep reached host operations (the oracle is not vacuous)', reached >= 10);
  t.equal('S8 every accepted action has a documented operation', Object.values(SCREEN_ACTIONS).flat().every(a => Object.hasOwn(INTENT_OPERATIONS, a)), true);
  t.equal('S9 codeOf keeps host codes', codeOf(Error('VAULT_LOCKED')), 'VAULT_LOCKED');
  t.equal('S10 codeOf hides free text', codeOf(Error('something with a name in it')), 'OPERATION_FAILED');
}

export function run(t) {
  startup(t);
  welcome(t);
  returningAndMigration(t);
  chapters(t);
  completion(t);
  lockDuringAwait(t);
  language(t);
  sweep(t);
}
