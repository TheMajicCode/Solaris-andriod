/* U0-01 entry routing suite.
 *
 * Every row names the synthetic native state, the expected candidate screen,
 * and, where it differs, what the retained host does (docs/onboarding/HOST-TRACE.md).
 * SCOPE: pure routing helper. Not the host page, not the native wrapper, not a device.
 */
import { resolveEntryScreen, mergeNativeState, clampStep } from '../route.mjs';
import { STATES } from './fakes.mjs';

// id, native state, ui, expected screen, expected reason, host behaviour note
const ROUTES = [
  // --- unresolved / unknown / invalid: never welcome, never returning ----------
  ['E1', null, {}, 'opening', 'pending', 'host 765/1012: {locked:true} with no hasVault renders "Unlock my Vault"'],
  ['E2', undefined, {}, 'opening', 'pending', 'nothing delivered yet'],
  ['E3', { locked: true }, {}, 'opening', 'pending', 'host 1012: returning screen'],
  ['E4', { locked: true, hasVault: null }, {}, 'opening', 'pending', 'null is not false'],
  ['E5', { locked: true, hasVault: 'false' }, {}, 'opening', 'invalid', 'string is not a boolean'],
  ['E6', { locked: true, hasVault: 0 }, {}, 'opening', 'invalid', 'falsy number is not false'],
  ['E7', { locked: true }, { entryError: 'BRIDGE_UNAVAILABLE' }, 'opening', 'error', 'host 1401 swallows a failed view'],
  ['E8', null, { timedOut: true }, 'opening', 'timeout', 'a timeout never proves "no vault"'],
  ['E9', { locked: 'true', hasVault: false }, {}, 'opening', 'invalid', 'locked must be boolean'],
  ['E10', { hasVault: false }, {}, 'opening', 'pending', 'locked missing'],
  ['E11', [], {}, 'opening', 'pending', 'array is not a state'],
  ['E12', 'locked', {}, 'opening', 'pending', 'string is not a state'],
  // --- confirmed states --------------------------------------------------------
  ['S1', STATES.noVault, {}, 'welcome', 'no-vault', 'host 1011'],
  ['S2', STATES.locked, {}, 'returning', 'vault-locked', 'host 1012'],
  ['S3', { ...STATES.locked, onboardingComplete: false }, {}, 'returning', 'vault-locked', 'a returning owner never gets the tour while locked'],
  ['S4', STATES.migrationPending, {}, 'migration', 'migration-pending', 'host 1013'],
  ['S5', { locked: false, hasVault: true, onboardingComplete: true }, {}, 'migration', 'migration-state-missing', 'host 1013 would throw TypeError'],
  ['S6', { ...STATES.migrationPending, onboardingComplete: true }, {}, 'migration', 'migration-pending', 'Skip/complete cannot bypass migration'],
  ['S7', { locked: false, hasVault: true, migration: { committed: 'yes' }, onboardingComplete: true }, {}, 'migration', 'migration-pending', 'only committed === true passes'],
  ['S8', STATES.incomplete, {}, 'chapter', 'onboarding-incomplete', 'host 1014'],
  ['S9', { ...STATES.incomplete, onboardingComplete: undefined }, {}, 'chapter', 'onboarding-incomplete', 'absent flag = incomplete, as host 1014'],
  ['S10', STATES.complete, {}, 'home', 'onboarding-complete', 'host 1016'],
  ['S11', { ...STATES.complete, onboardingComplete: 'true' }, {}, 'opening', 'invalid', 'host 1014 treats a truthy string as complete'],
  ['S12', { ...STATES.complete, hasVault: false }, {}, 'home', 'onboarding-complete', 'unlocked state proves a vault; never welcome'],
  ['S13', { ...STATES.complete }, { entryError: 'BRIDGE_UNAVAILABLE' }, 'home', 'onboarding-complete', 'a later valid native state wins over an earlier error'],
];

export function run(t) {
  for (const [id, state, ui, screen, reason] of ROUTES) {
    const r = resolveEntryScreen(state, ui);
    t.equal(`${id} screen`, r.screen, screen);
    t.equal(`${id} reason`, r.reason, reason);
    if (screen === 'opening') t.equal(`${id} retry only when not merely pending`, r.retry, reason !== 'pending');
  }

  // No unknown state may ever resolve to welcome or to a setup-offering screen.
  const unknowns = [null, undefined, {}, { locked: true }, { locked: true, hasVault: undefined }, { locked: true, hasVault: null },
    { locked: true, hasVault: '' }, { locked: true, hasVault: 'no' }, { locked: true, hasVault: NaN }, { locked: null, hasVault: false }];
  for (const [i, s] of unknowns.entries()) {
    for (const ui of [{}, { entryError: 'X_FAILED' }, { timedOut: true }]) {
      t.equal(`U${i} ${JSON.stringify(ui)} unknown never welcome/returning`, resolveEntryScreen(s, ui).screen, 'opening');
    }
  }

  // Partial onboarding: the in-memory step is honoured and clamped; nothing persisted.
  t.equal('P1 partial step 2 restored in memory', resolveEntryScreen(STATES.incomplete, { step: 2 }).step, 2);
  t.equal('P2 fresh launch (no in-memory step) starts at chapter 1', resolveEntryScreen(STATES.incomplete, {}).step, 1);
  t.equal('P3 step clamps high', clampStep(9), 3);
  t.equal('P4 step clamps low', clampStep(0), 1);
  t.equal('P5 non-integer step', clampStep('2.5'), 1);

  // Repeated update launch after completion never replays the tour.
  for (let launch = 1; launch <= 3; launch += 1) {
    t.equal(`L${launch} completed owner lands on home`, resolveEntryScreen(STATES.complete, { step: 2 }).screen, 'home');
  }

  // Host-compatible merge (host 784): a lock push keeps the known hasVault.
  const merged = mergeNativeState(STATES.complete, { locked: true });
  t.equal('M1 lock keeps hasVault', merged.hasVault, true);
  t.equal('M2 lock push routes to returning, not welcome', resolveEntryScreen(merged).screen, 'returning');
  t.equal('M3 lock drops unlocked fields', merged.onboardingComplete, undefined);
  t.equal('M4 explicit false replaces true', mergeNativeState(STATES.locked, { locked: true, hasVault: false }).hasVault, false);
  t.equal('M5 non-object next ignored', mergeNativeState(STATES.locked, null), STATES.locked);
}
