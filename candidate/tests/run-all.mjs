#!/usr/bin/env node
/* Candidate regression runner.
 *
 * Counts DISTINCT cases. It does not multiply a case by the number of times it
 * is executed, and it does not add packaging or UI-form repetitions to the total.
 */
import * as routing from './routing.test.mjs';
import * as answerBoundary from './answer-boundary.test.mjs';
import * as hostEnvelope from './host-envelope.test.mjs';
import * as hostDonor from './host-donor.test.mjs';

let passed = 0;
const failures = [];

const t = {
  ok(label, condition) {
    if (condition) { passed += 1; } else { failures.push(`${label}: expected truthy`); }
  },
  equal(label, actual, expected) {
    if (Object.is(actual, expected)) { passed += 1; }
    else { failures.push(`${label}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`); }
  },
};

const suites = [
  ['A605-01 routing (F04/F05)', routing],
  ['A605-02 answer boundary (F03)', answerBoundary],
  ['A605-01 host envelope adapter (AUD-04)', hostEnvelope],
  ['A605 bounded host donor (F04/F05/SP-CHAT-03)', hostDonor],
];

for (const [name, suite] of suites) {
  const before = failures.length;
  try {
    suite.run(t);
  } catch (error) {
    failures.push(`${name}: threw ${error && error.stack ? error.stack : error}`);
  }
  const added = failures.length - before;
  console.log(`${added === 0 ? 'ok  ' : 'FAIL'} ${name}${added ? ` (${added} failures)` : ''}`);
}

for (const failure of failures) console.log(`  - ${failure}`);
console.log(`summary: ${passed} assertions passed, ${failures.length} failed`);
console.log('scope: helper-level and service-commit-level only. Not the actual DailyService,');
console.log('not host bytecode, not a device, and not evidence of model behaviour.');
process.exit(failures.length ? 1 : 0);
