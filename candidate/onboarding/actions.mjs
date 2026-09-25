/* U0 welcome/onboarding — intent adapter. Maintained candidate, NOT integrated.
 *
 * Maps UI intents to host operations that docs/onboarding/HOST-TRACE.md proves
 * exist in the retained host (Solaris-Android-R4/ui/sanctuary.html). The host
 * is injected so tests can spy on every call:
 *
 *   host.request(method, params)            -> thenable   host 774 request()
 *   host.change(kind, params, operationId)  -> thenable   host 925 change(); resolves to adopted state
 *   host.openDiagnostics(params)            -> thenable   host 762 SolarisNativeAI.openDiagnostics
 *   host.uid()                              -> string     host 772 uid()
 *   host.getDrafts()                        -> object     host 766 `drafts` (host 786 REASSIGNS it on lock,
 *                                                         so it is read through a getter, never captured)
 *
 * Native state enters through setNativeState() (host 788 __solarisVaultState /
 * 1401 request('view')). This adapter never writes storage, never calls
 * provisionChoice, never creates keys and never touches source selections.
 *
 * Every host result is consumed with a single `.then(ok, err)` so a test can
 * drive it synchronously with a manual thenable and an injected clock.
 */
import { resolveEntryScreen, mergeNativeState, clampStep, CHAPTER_COUNT, LOCKED_SCREENS } from './route.mjs';
import { normalizeLocale } from './copy.mjs';

export const BRIDGE_VERSION = 'solaris-qvac-bridge/1'; // host 1376
/** Host 778 gives questionnaire/session saves 20 s; host 774 gives change('onboarding') no timeout at all. */
export const DONE_TIMEOUT_MS = 20000;
export const OPENING_TIMEOUT_MS = 8000;

/** Actions each screen accepts. Anything else is refused without a host call. */
export const SCREEN_ACTIONS = Object.freeze({
  opening: ['retry', 'language'],
  welcome: ['start', 'restore', 'language', 'vision', 'visionClose'],
  returning: ['unlock', 'lockedAiSetup', 'language'],
  migration: ['migrationSetup', 'language'],
  chapter1: ['next', 'skip', 'language'],
  chapter2: ['back', 'aiSetup', 'withoutAI', 'skip', 'language'],
  chapter3: ['back', 'done', 'doneCheckin', 'doneRecords', 'language'],
  home: [],
});

const COMPLETION_ACTIONS = Object.freeze(['skip', 'done', 'doneCheckin', 'doneRecords']);

/** The only host operation each intent may reach (documentation + test oracle). */
export const INTENT_OPERATIONS = Object.freeze({
  retry: "request('view') — host 1401",
  start: "request('openSetup') — host 1376 `setup`",
  restore: "request('openSetup') — host 1376 `setup` (no dedicated restore API exists)",
  unlock: "request('openSetup') — host 1012/1376 `setup`",
  migrationSetup: "request('openSetup') — host 1013/1376 `setup`",
  lockedAiSetup: 'SolarisNativeAI.openDiagnostics — host 1012/1376 `aiSetup`',
  aiSetup: 'SolarisNativeAI.openDiagnostics — host 1376 `aiSetup`',
  language: "locked: none (memory only); unlocked: change('experienceLocale') — host 1094",
  next: 'none (in-memory step, host 1377)',
  back: 'none (in-memory step, host 1377)',
  withoutAI: 'none (in-memory step)',
  skip: "change('onboarding',{name}) — host 1100 `onboardSkip`",
  done: "change('onboarding',{name}) — host 1100 `onboardSkip`",
  doneCheckin: "change('onboarding',{name}), then existing `checkin` — host 1100, 1373/1379",
  doneRecords: "change('onboarding',{name}), then existing `healthTab:records` — host 1100, 1096",
  vision: 'none (static panel)',
  visionClose: 'none (static panel)',
});

const defaultClock = Object.freeze({
  set: (fn, ms) => setTimeout(fn, ms),
  clear: id => clearTimeout(id),
});

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/** Host codes are upper snake case (host 787/755); anything else is generic. */
export function codeOf(error) {
  const message = error && typeof error.message === 'string' ? error.message : '';
  return /^[A-Z][A-Z0-9_]{2,60}$/.test(message) ? message : 'OPERATION_FAILED';
}

/** Run a host operation; a synchronous throw is reported like a rejection. */
function call(operation, onOk, onErr) {
  let pending;
  try { pending = operation(); } catch (error) { onErr(error); return; }
  if (pending && typeof pending.then === 'function') pending.then(onOk, onErr);
  else onOk(pending);
}

export function screenKey(route) {
  return route.screen === 'chapter' ? `chapter${route.step}` : route.screen;
}

export function createOnboardingController(options) {
  const {
    host,
    clock = defaultClock,
    onChange = () => {},
    doneTimeoutMs = DONE_TIMEOUT_MS,
    openingTimeoutMs = OPENING_TIMEOUT_MS,
    deviceLocale = 'en',
  } = options;
  if (!host) throw Error('HOST_REQUIRED');

  let native = null;
  let epoch = 0; // privacy epoch: advances on every transition into a locked state
  let viewTicket = 0;
  let completion = null; // the one in-flight completion: {session, timer, settled}
  const inflight = new Set();
  const LOCKED_NOTICE = Object.freeze({ key: 'error.lockedDuringSave', screens: ['returning', 'opening'] });
  const ui = {
    entryError: null,
    timedOut: false,
    step: 1,
    presentationLocale: null, // memory only, never persisted while locked
    notice: null, // {key, tone, retry?, screens}
    vision: false,
    pendingWrite: null, // {operationId, params} kept across a timeout, like host pendingWrite (1256-1283)
    after: null, // navigation intent after acknowledged completion
  };

  const isLocked = () => !isPlainObject(native) || native.locked !== false;
  const route = () => resolveEntryScreen(native, ui);
  const drafts = () => {
    const d = typeof host.getDrafts === 'function' ? host.getDrafts() : null;
    return isPlainObject(d) ? d : {};
  };

  function locale() {
    if (ui.presentationLocale) return ui.presentationLocale;
    const stored = isPlainObject(native) && isPlainObject(native.experience) ? native.experience.locale : undefined;
    if (stored === 'es' || stored === 'en') return stored;
    return normalizeLocale(deviceLocale);
  }

  function setNotice(key, tone, extra = {}) {
    ui.notice = { key, tone, screens: extra.screens || [screenKey(route())], retry: extra.retry || null };
  }

  function view() {
    const r = route();
    const key = screenKey(r);
    const notice = ui.notice && ui.notice.screens.includes(key) ? ui.notice : null;
    return {
      ...r,
      key,
      locale: locale(),
      pending: {
        view: inflight.has('view') && !ui.timedOut && !ui.entryError,
        setup: inflight.has('setup'),
        aiSetup: inflight.has('aiSetup'),
        complete: inflight.has('complete'),
        locale: inflight.has('locale'),
      },
      notice,
      vision: ui.vision && r.screen === 'welcome',
      // Only an unlocked chapter screen may read patient-entered text.
      name: r.screen === 'chapter' && typeof drafts().name === 'string' ? drafts().name : '',
      after: r.screen === 'home' ? ui.after : null,
    };
  }

  function emit() {
    onChange(view());
  }

  function setNativeState(next) {
    if (!isPlainObject(next)) return;
    const wasLocked = isLocked();
    const storedBefore = isPlainObject(native) && isPlainObject(native.experience) ? native.experience.locale : undefined;
    native = mergeNativeState(native, next);
    if (native.locked !== false && !wasLocked) {
      epoch += 1;
      // A lock push carries no experience (host 792/784), so the host's locked screen falls
      // back to English. Keep the stored language for presentation only (memory, non-secret).
      if (!ui.presentationLocale && (storedBefore === 'es' || storedBefore === 'en')) ui.presentationLocale = storedBefore;
      ui.pendingWrite = null;
      // A save interrupted by a lock is settled now: its guard is released, any
      // later reply is ignored, and only a non-private notice remains.
      if (completion) settleCompletion(completion, LOCKED_NOTICE);
    }
    if (route().screen !== 'opening') {
      ui.entryError = null;
      ui.timedOut = false;
    }
    if (wasLocked && native.locked === false) {
      if (ui.notice && ui.notice.key === 'error.lockedDuringSave') ui.notice = null;
      syncLocaleAfterUnlock();
    }
    emit();
  }

  // --- entry ---------------------------------------------------------------
  function start() {
    // A hung first attempt must not block retry: host 774 sets no timer for 'view'.
    if (inflight.has('view') && !ui.timedOut && !ui.entryError) return { status: 'ignored' };
    const ticket = ++viewTicket;
    inflight.add('view');
    ui.entryError = null;
    ui.timedOut = false;
    const timer = clock.set(() => {
      if (ticket === viewTicket && route().screen === 'opening') { ui.timedOut = true; emit(); }
    }, openingTimeoutMs);
    emit();
    call(() => host.request('view'), result => {
      if (ticket === viewTicket) inflight.delete('view');
      if (isPlainObject(result)) setNativeState(result); else emit();
      // A reply that still leaves hasVault unknown keeps the timer, so retry appears.
      if (route().screen !== 'opening') clock.clear(timer);
    }, error => {
      if (ticket !== viewTicket) return;
      inflight.delete('view');
      clock.clear(timer);
      if (route().screen === 'opening') ui.entryError = codeOf(error);
      emit();
    });
    return { status: 'started', op: "request('view')" };
  }

  // --- native setup (create / restore / unlock / migration) ----------------
  function openSetup(action) {
    if (inflight.has('setup')) return { status: 'ignored' };
    inflight.add('setup');
    ui.notice = null;
    const key = screenKey(route());
    emit();
    call(() => host.request('openSetup'), () => {
      // The reply may mean "opened", not "finished" (docs/onboarding/HOST-TRACE.md §7).
      // Nothing is claimed; the route follows the next native state.
      inflight.delete('setup');
      emit();
    }, error => {
      inflight.delete('setup');
      const code = codeOf(error);
      if (code !== 'CANCELLED' && code !== 'VAULT_LOCKED') setNotice('error.setupFailed', 'error', { retry: action, screens: [key] });
      emit();
    });
    return { status: 'started', op: "request('openSetup')" };
  }

  // --- existing Pocket LUCA AI preparation entry ----------------------------
  function openAiSetup() {
    if (inflight.has('aiSetup')) return { status: 'ignored' };
    inflight.add('aiSetup');
    ui.notice = null;
    const key = screenKey(route());
    emit();
    call(() => host.openDiagnostics({ bridgeVersion: BRIDGE_VERSION }), () => {
      inflight.delete('aiSetup');
      emit(); // stays on the same screen and step; nothing is claimed about the model
    }, () => {
      inflight.delete('aiSetup');
      setNotice('error.aiSetupFailed', 'error', { screens: [key] });
      emit();
    });
    return { status: 'started', op: 'openDiagnostics' };
  }

  // --- language --------------------------------------------------------------
  function persistLocale(target) {
    if (inflight.has('locale')) return; // the settle handler re-checks the wanted locale
    inflight.add('locale');
    const session = epoch;
    call(() => host.change('experienceLocale', { locale: target }), result => {
      inflight.delete('locale');
      if (session !== epoch || isLocked()) { emit(); return; }
      if (isPlainObject(result)) native = mergeNativeState(native, result);
      const wanted = ui.presentationLocale;
      const stored = isPlainObject(native.experience) ? native.experience.locale : undefined;
      if (wanted && wanted !== target) { persistLocale(wanted); emit(); return; }
      if (stored === target) ui.presentationLocale = null;
      emit();
    }, () => {
      inflight.delete('locale');
      if (session === epoch && !isLocked()) setNotice('error.languageNotSaved', 'info');
      emit();
    });
  }

  function syncLocaleAfterUnlock() {
    if (!ui.presentationLocale || isLocked()) return;
    const stored = isPlainObject(native.experience) ? native.experience.locale : undefined;
    if (stored === ui.presentationLocale) { ui.presentationLocale = null; return; }
    persistLocale(ui.presentationLocale);
  }

  function toggleLanguage() {
    const target = locale() === 'es' ? 'en' : 'es';
    ui.presentationLocale = target; // presentation only; drafts and patient text are untouched
    if (LOCKED_SCREENS.includes(route().screen) || isLocked()) {
      emit();
      return { status: 'done', persisted: false };
    }
    if (ui.notice && ui.notice.key === 'error.languageNotSaved') ui.notice = null;
    emit();
    persistLocale(target);
    return { status: 'started', op: "change('experienceLocale')" };
  }

  // --- acknowledged completion ----------------------------------------------
  function settleCompletion(c, notice) {
    if (c.settled) return false;
    c.settled = true;
    clock.clear(c.timer);
    if (completion === c) { completion = null; inflight.delete('complete'); }
    if (notice) setNotice(notice.key, 'error', notice);
    return true;
  }

  // Only reachable through dispatch(), whose in-flight guard makes a double tap one call.
  function complete(action, then) {
    const name = typeof drafts().name === 'string' ? drafts().name : '';
    const reuse = ui.pendingWrite && ui.pendingWrite.params.name === name;
    const write = reuse ? ui.pendingWrite : { operationId: host.uid(), params: { name } };
    ui.pendingWrite = write;
    ui.notice = null;
    ui.after = null;
    const c = { session: epoch, settled: false, timer: null };
    completion = c;
    inflight.add('complete');
    c.timer = clock.set(() => {
      if (settleCompletion(c, { key: 'error.doneTimeout', retry: action })) emit();
    }, doneTimeoutMs);
    emit();
    call(() => host.change('onboarding', write.params, write.operationId), result => {
      if (c.session !== epoch || isLocked()) { emit(); return; } // settled by the lock; never Home
      if (isPlainObject(result)) native = mergeNativeState(native, result);
      if (native.onboardingComplete === true) {
        settleCompletion(c, null); // a late success after a timeout notice is still honoured
        if (completion) settleCompletion(completion, null); // a retry still in flight is now moot
        ui.notice = null;
        ui.pendingWrite = null;
        ui.after = then;
        ui.step = 1; // host 1100 resets step after success
      } else if (settleCompletion(c, { key: 'error.doneNotConfirmed', retry: action })) {
        ui.pendingWrite = null;
      }
      emit();
    }, error => {
      if (c.session !== epoch || isLocked()) { emit(); return; }
      if (codeOf(error) === 'VAULT_LOCKED') {
        // host 925 throws this when its own state is already locked; the lock push follows.
        settleCompletion(c, { ...LOCKED_NOTICE, screens: [...LOCKED_NOTICE.screens, screenKey(route())] });
      } else if (settleCompletion(c, { key: 'error.doneFailed', retry: action })) {
        ui.pendingWrite = null; // a definite failure retries as a new operation (host 1283)
      } // a late failure after the timeout notice changes nothing
      emit();
    });
    return { status: 'started', op: "change('onboarding')" };
  }

  // --- dispatcher --------------------------------------------------------------
  function dispatch(action) {
    const r = route();
    const key = screenKey(r);
    const allowed = SCREEN_ACTIONS[key] || [];
    if (!allowed.includes(action)) return { status: 'blocked', screen: key };
    if (inflight.has('complete') && action !== 'language') {
      // Any second completion request during a save is a duplicate; other controls wait.
      return { status: COMPLETION_ACTIONS.includes(action) ? 'ignored' : 'busy' };
    }
    switch (action) {
      case 'retry': return start();
      case 'start':
      case 'restore':
      case 'unlock':
      case 'migrationSetup': return openSetup(action);
      case 'lockedAiSetup':
      case 'aiSetup': return openAiSetup();
      case 'language': return toggleLanguage();
      case 'next': ui.step = clampStep(r.step + 1); ui.notice = null; emit(); return { status: 'done' };
      case 'back': ui.step = clampStep(r.step - 1); ui.notice = null; emit(); return { status: 'done' };
      case 'withoutAI': ui.step = CHAPTER_COUNT; ui.notice = null; emit(); return { status: 'done' };
      case 'skip':
      case 'done': return complete(action, null);
      case 'doneCheckin': return complete(action, 'checkin');
      case 'doneRecords': return complete(action, 'records');
      case 'vision': ui.vision = !ui.vision; emit(); return { status: 'done' };
      case 'visionClose': ui.vision = false; emit(); return { status: 'done' };
      default: return { status: 'blocked', screen: key };
    }
  }

  return Object.freeze({ start, dispatch, setNativeState, view, locale });
}
