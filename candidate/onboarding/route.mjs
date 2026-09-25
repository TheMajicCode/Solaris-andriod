/* U0 welcome/onboarding — entry routing. Maintained candidate, NOT integrated.
 *
 * Native state is authoritative. This module only reads the state object the
 * native entry wrapper delivers (host: window.__solarisVaultState / the reply to
 * request('view'), adopted at sanctuary.html:784). It never writes, never
 * infers a vault from a timeout, and never turns an unknown into `false`.
 *
 * Differences from the retained host (docs/onboarding/HOST-TRACE.md):
 *  - host 765/1012: initial state {locked:true} with hasVault undefined falls
 *    through to the returning "Unlock my Vault" screen. Here an unknown,
 *    missing, invalid or errored hasVault resolves to a neutral `opening`.
 *  - host 1013 reads state.migration.committed without a guard (a TypeError if
 *    migration is absent). Here anything but committed === true keeps the
 *    mandatory migration gate.
 *  - host 1014 treats any truthy onboardingComplete as complete. Here only a
 *    boolean is accepted; another type is an invalid state -> `opening`.
 */

export const SCREENS = Object.freeze(['opening', 'welcome', 'returning', 'migration', 'chapter', 'home']);
export const CHAPTER_COUNT = 3;

/** Screens that are shown while the vault is locked or its state is unknown. */
export const LOCKED_SCREENS = Object.freeze(['opening', 'welcome', 'returning']);

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/** In-memory chapter only. The host keeps `step` in memory (765) and persists no step. */
export function clampStep(step) {
  const n = Number(step);
  if (!Number.isInteger(n)) return 1;
  return Math.min(CHAPTER_COUNT, Math.max(1, n));
}

function opening(reason, code = null) {
  // Retry re-issues a read (request('view')) only. It is never destructive.
  const retry = reason !== 'pending';
  return { screen: 'opening', reason, retry, code };
}

/**
 * @param {object|null|undefined} nativeState  the last state the native wrapper
 *        delivered, or null/undefined when nothing has arrived yet.
 * @param {{entryError?: string|null, timedOut?: boolean, step?: number}} [ui]
 *        entryError: code from a failed request('view'); timedOut: the UI's own
 *        startup wait elapsed; step: the in-memory chapter (1..3).
 * @returns {{screen: string, reason: string, retry?: boolean, code?: string|null, step?: number}}
 */
export function resolveEntryScreen(nativeState, ui = {}) {
  const entryError = typeof ui.entryError === 'string' && ui.entryError ? ui.entryError : null;
  const unresolved = () => (entryError ? opening('error', entryError) : ui.timedOut === true ? opening('timeout') : opening('pending'));

  if (!isPlainObject(nativeState)) return unresolved();
  if (typeof nativeState.locked !== 'boolean') return nativeState.locked === undefined ? unresolved() : opening('invalid');

  if (nativeState.locked) {
    if (nativeState.hasVault === false) return { screen: 'welcome', reason: 'no-vault' };
    if (nativeState.hasVault === true) return { screen: 'returning', reason: 'vault-locked' };
    // undefined, null, 'false', 0, ... : Missing hasVault is not false.
    return nativeState.hasVault === undefined || nativeState.hasVault === null ? unresolved() : opening('invalid');
  }

  // Unlocked. Only native can report an unlocked vault, so a vault exists; the
  // host likewise ignores hasVault once unlocked (1011-1016).
  if (!(isPlainObject(nativeState.migration) && nativeState.migration.committed === true)) {
    return { screen: 'migration', reason: isPlainObject(nativeState.migration) ? 'migration-pending' : 'migration-state-missing' };
  }
  const complete = nativeState.onboardingComplete;
  if (complete === true) return { screen: 'home', reason: 'onboarding-complete' };
  if (complete === false || complete === undefined) {
    return { screen: 'chapter', reason: 'onboarding-incomplete', step: clampStep(ui.step) };
  }
  return opening('invalid');
}

/** Host-compatible merge: host 784 keeps the last known hasVault when a later state omits it. */
export function mergeNativeState(previous, next) {
  if (!isPlainObject(next)) return previous;
  const prior = isPlainObject(previous) ? previous : {};
  return { ...next, hasVault: next.hasVault ?? prior.hasVault };
}
