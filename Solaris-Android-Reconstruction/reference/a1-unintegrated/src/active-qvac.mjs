/**
 * Source-independent V6 integration candidate. Not installed in the Android app.
 * The owner must call this within its existing lifecycle/operation coordination.
 * This excludes overlapping admissions; it does not replace that lifecycle queue.
 */
const pending = new WeakMap();
const sdkStates = new Set(['active', 'suspending', 'suspended', 'resuming']);

export class LifecycleAdmissionError extends Error {
  constructor(code, stage) {
    super(code);
    this.name = 'LifecycleAdmissionError';
    this.code = code;
    this.stage = stage;
  }
}

// Bounded metadata only. No prompts, model paths, user IDs, or native messages.
export function admissionStatus(runtime) {
  const lease = pending.get(runtime);
  return lease ? {pending: true, stage: lease.stage} : {pending: false, stage: 'idle'};
}

/**
 * runtime: actual QVAC public client: state() -> state string, resume() -> void.
 * isCurrent: synchronous, returns true only for current worker, foreground,
 *   vault session, consumer and permission. Recheck authority again at commit.
 * dispatch: one load/inference operation; never retried by this helper.
 * timeoutMs: caller's existing operation budget; timeout does not cancel native work.
 * signal: optional existing operation cancellation signal.
 * monotonicNow: existing host monotonic clock; defaults to performance.now().
 */
export async function withActiveQvac({runtime, isCurrent, dispatch, timeoutMs, signal,
    monotonicNow = () => globalThis.performance.now()}) {
  if (!runtime || typeof runtime.state !== 'function' || typeof runtime.resume !== 'function' ||
      typeof isCurrent !== 'function' || typeof dispatch !== 'function' || typeof monotonicNow !== 'function' ||
      !Number.isInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > 2147483647 ||
      (signal && (typeof signal.addEventListener !== 'function' || typeof signal.removeEventListener !== 'function'))) {
    throw new LifecycleAdmissionError('SOLARIS_AI_ADMISSION_CONTRACT_INVALID', 'contract');
  }
  if (pending.has(runtime)) {
    throw new LifecycleAdmissionError('SOLARIS_AI_ADMISSION_BUSY', pending.get(runtime).stage);
  }
  const lease = {stage: 'queued'};
  let abandoned = false;
  let started;
  try { started = monotonicNow(); } catch { /* rejected below */ }
  if (!Number.isFinite(started)) throw new LifecycleAdmissionError('SOLARIS_AI_CLOCK_INVALID', 'contract');
  let lastTime = started;
  const checkBudget = () => {
    let now;
    try { now = monotonicNow(); } catch { /* rejected below */ }
    if (!Number.isFinite(now) || now < lastTime) {
      abandoned = true;
      throw new LifecycleAdmissionError('SOLARIS_AI_CLOCK_INVALID', lease.stage);
    }
    lastTime = now;
    if (now - started >= timeoutMs) {
      abandoned = true;
      throw new LifecycleAdmissionError('SOLARIS_AI_ADMISSION_TIMEOUT', lease.stage);
    }
  };
  const checkCurrent = () => {
    checkBudget();
    let current = false;
    if (!abandoned && !signal?.aborted) {
      try {
        const value = isCurrent();
        current = value === true;
        // An accidentally async guard never grants authority. Consume a rejected
        // thenable to avoid leaking its exception through an unhandled rejection.
        if (value && typeof value.then === 'function') Promise.resolve(value).catch(() => {});
      } catch { /* fail closed */ }
    }
    checkBudget();
    if (!current) throw new LifecycleAdmissionError('SOLARIS_AI_REQUEST_INVALIDATED', lease.stage);
  };
  checkCurrent();
  pending.set(runtime, lease);

  // The underlying promise owns the lease until actual settlement, even if the
  // caller stops waiting. A timeout/abort is never proof of native quiescence.
  const work = Promise.resolve().then(async () => {
    const readState = async () => {
      lease.stage = 'state';
      checkCurrent();
      let value;
      try { value = await runtime.state(); }
      catch { checkCurrent(); throw new LifecycleAdmissionError('SOLARIS_AI_STATE_QUERY_FAILED', lease.stage); }
      checkCurrent();
      if (!sdkStates.has(value)) throw new LifecycleAdmissionError('SOLARIS_AI_STATE_INVALID', lease.stage);
      return value;
    };
    let state = await readState();
    checkCurrent();
    if (state !== 'active') {
      lease.stage = 'resume';
      checkCurrent();
      try { await runtime.resume(); }
      catch { checkCurrent(); throw new LifecycleAdmissionError('SOLARIS_AI_RESUME_FAILED', lease.stage); }
      checkCurrent();
      // resume() resolves void. Only the subsequent state query confirms active.
      state = await readState();
      checkCurrent();
      if (state !== 'active') throw new LifecycleAdmissionError('SOLARIS_AI_NOT_ACTIVE', lease.stage);
    }
    lease.stage = 'operation';
    checkCurrent();
    const result = await dispatch();
    checkCurrent();
    return result;
  });
  const release = () => { if (pending.get(runtime) === lease) pending.delete(runtime); };
  // Both handlers consume late settlement without an unhandled rejection.
  work.then(release, release);

  let timer;
  let onAbort;
  const interruption = new Promise((_, reject) => {
    onAbort = () => {
      abandoned = true;
      reject(new LifecycleAdmissionError('SOLARIS_AI_REQUEST_INVALIDATED', lease.stage));
    };
    signal?.addEventListener('abort', onAbort, {once: true});
    if (signal?.aborted) onAbort();
    timer = setTimeout(() => {
      abandoned = true;
      reject(new LifecycleAdmissionError('SOLARIS_AI_ADMISSION_TIMEOUT', lease.stage));
    }, Math.max(0, timeoutMs - (lastTime - started)));
  });
  try {
    const result = await Promise.race([work, interruption]);
    checkCurrent();
    return result;
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', onAbort);
  }
}
