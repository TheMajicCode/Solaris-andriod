/* Synchronous test doubles for the U0 controller. Not a suite.
 *
 * deferred(): a manual thenable. `.then(ok, err)` handlers run synchronously
 * when the test calls resolve()/reject(), so suites stay synchronous and can be
 * wired into candidate/tests/run-all.mjs, which calls suite.run(t) without await.
 */
import { createOnboardingController } from '../actions.mjs';

export function deferred() {
  let state = 'pending';
  let value;
  const handlers = [];
  const d = {
    then(onOk, onErr) {
      if (state === 'pending') handlers.push([onOk, onErr]);
      else if (state === 'ok') { if (onOk) onOk(value); }
      else if (onErr) onErr(value);
      return d;
    },
    resolve(v) {
      if (state !== 'pending') return;
      state = 'ok'; value = v;
      for (const [ok] of handlers) if (ok) ok(v);
    },
    reject(e) {
      if (state !== 'pending') return;
      state = 'err'; value = e;
      for (const [, err] of handlers) if (err) err(e);
    },
    get state() { return state; },
  };
  return d;
}

export function fakeClock() {
  let now = 0;
  let next = 0;
  const timers = new Map();
  return {
    set(fn, ms) { next += 1; timers.set(next, { at: now + ms, fn }); return next; },
    clear(id) { timers.delete(id); },
    advance(ms) {
      now += ms;
      for (const [id, timer] of [...timers].sort((a, b) => a[1].at - b[1].at)) {
        if (timer.at <= now && timers.has(id)) { timers.delete(id); timer.fn(); }
      }
    },
    get size() { return timers.size; },
  };
}

/** Records every host call; each returns a manual thenable the test settles. */
export function fakeHost(drafts = {}) {
  let n = 0;
  const calls = [];
  const host = {
    calls,
    drafts,
    request(method, params) { const d = deferred(); calls.push({ op: 'request', method, params, d }); return d; },
    change(kind, params, operationId) { const d = deferred(); calls.push({ op: 'change', kind, params, operationId, d }); return d; },
    openDiagnostics(params) { const d = deferred(); calls.push({ op: 'openDiagnostics', params, d }); return d; },
    uid() { n += 1; return `op_${n}`; },
    getDrafts() { return host.drafts; },
  };
  return host;
}

export const STATES = Object.freeze({
  noVault: { locked: true, hasVault: false },
  locked: { locked: true, hasVault: true },
  migrationPending: { locked: false, hasVault: true, migration: { committed: false }, onboardingComplete: false },
  incomplete: { locked: false, hasVault: true, migration: { committed: true }, onboardingComplete: false },
  complete: { locked: false, hasVault: true, migration: { committed: true }, onboardingComplete: true },
});

/** A controller already holding `state`, with a spy host and fake clock. */
export function setup(state, { drafts = {}, step = 1, locale, ...options } = {}) {
  const host = fakeHost(drafts);
  const clock = fakeClock();
  const views = [];
  const controller = createOnboardingController({ host, clock, onChange: v => views.push(v), ...options });
  if (state) controller.setNativeState(locale ? { ...state, experience: { locale } } : state);
  for (let i = 1; i < step; i += 1) controller.dispatch(i === 1 ? 'next' : 'withoutAI');
  return { host, clock, controller, views };
}

export const call = (host, i = -1) => host.calls.at(i);
export const ops = host => host.calls.map(c => (c.op === 'request' ? `request:${c.method}` : c.op === 'change' ? `change:${c.kind}` : c.op));
