#!/usr/bin/env node
/* U0 onboarding candidate runner.
 *
 * Same `t.ok` / `t.equal` interface and exit convention as
 * candidate/tests/run-all.mjs. Each suite exports a SYNCHRONOUS run(t), so the
 * suites can be added to run-all.mjs's `suites` array unchanged.
 */
import * as route from './route.test.mjs';
import * as actions from './actions.test.mjs';
import * as copy from './copy.test.mjs';
import * as render from './render.test.mjs';
import * as staticSource from './static.test.mjs';

let passed = 0;
const failures = [];
const labels = new Set();

// A repeated label would count one case twice, so it is itself a failure.
function distinct(label) {
  if (labels.has(label)) { failures.push(`${label}: label repeated; a case would be counted twice`); return false; }
  labels.add(label);
  return true;
}

const t = {
  ok(label, condition) {
    if (!distinct(label)) return;
    if (condition) { passed += 1; } else { failures.push(`${label}: expected truthy`); }
  },
  equal(label, actual, expected) {
    if (!distinct(label)) return;
    if (Object.is(actual, expected)) { passed += 1; }
    else { failures.push(`${label}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`); }
  },
};

const suites = [
  ['U0-01 onboarding entry routing', route],
  ['U0-02 onboarding intent adapter', actions],
  ['U0-03 onboarding EN/ES copy', copy],
  ['U0-04 onboarding renderer', render],
  ['U0-05 onboarding static source', staticSource],
];

for (const [name, suite] of suites) {
  const before = failures.length;
  try {
    const result = suite.run(t);
    if (result && typeof result.then === 'function') failures.push(`${name}: run(t) returned a promise; suites must be synchronous`);
  } catch (error) {
    failures.push(`${name}: threw ${error && error.stack ? error.stack : error}`);
  }
  const added = failures.length - before;
  console.log(`${added === 0 ? 'ok  ' : 'FAIL'} ${name}${added ? ` (${added} failures)` : ''}`);
}

for (const failure of failures) console.log(`  - ${failure}`);
console.log(`summary: ${passed} assertions passed, ${failures.length} failed`);
console.log('scope: adapter, renderer and source level only. Synthetic host doubles; not the host page,');
console.log('not the native wrapper, not the APK, not a device, and not TalkBack.');
process.exit(failures.length ? 1 : 0);
