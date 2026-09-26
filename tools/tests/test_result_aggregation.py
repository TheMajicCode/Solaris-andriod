#!/usr/bin/env python3
"""SP-CI-02: central result-aggregation invariants.

Adapted from `evidence/repo-review/probe-result-aggregation.py`, which injected
synthetic results into `run_all`. That probe patched `ALL_CHECKS`; `run_all` now
iterates a registry of `CheckSpec`s, so the injection point moved to the `specs`
argument. The defect it demonstrated is what these controls pin:

    NOT_APPLICABLE / expected=1 / examined=0  ->  overall PASS   (was)
    PASS           / expected=1 / examined=0  ->  overall PASS   (was)

Both are now failures. Equally important, the legitimate cases must still pass:
a genuinely empty optional scope, and a check that inspected everything in a
scope that happens to be empty. A rule that failed those would just be a
different kind of wrong.

There is deliberately no global "examined == expected" rule across all checks —
they do not share that semantic. Coverage is declared per check.

Run:  python3 tools/tests/test_result_aggregation.py
"""
from __future__ import annotations

import sys
from pathlib import Path

TOOLS = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(TOOLS))

import solaris_checks.checks as checks  # noqa: E402
from solaris_checks.checks import (  # noqa: E402
    CheckResult, CheckSpec, COVERAGE_FULL, COVERAGE_NONZERO,
)

PASSED = 0
FAILURES: list[str] = []


def _spec(name, status, expected, examined, coverage=COVERAGE_NONZERO, allows_na=False,
          min_scope=0):
    def fn(_ctx, _n=name, _s=status, _e=expected, _x=examined):
        return CheckResult(_n, 'synthetic result injection', _s,
                           files_expected=_e, files_examined=_x)
    return CheckSpec(name, fn, coverage, allows_not_applicable=allows_na, min_scope=min_scope)


def overall(specs) -> dict:
    # Context construction is irrelevant here: every injected fn ignores it.
    real_context = checks.Context
    checks.Context = lambda repo, files: object()
    try:
        return checks.run_all(TOOLS.parent, ['fixture.js'], specs=specs)
    finally:
        checks.Context = real_context


def case(label, specs, expect):
    global PASSED
    report = overall(specs)
    got = report['status']
    if got == expect:
        PASSED += 1
        print(f'  ok   {label}: {got}')
    else:
        FAILURES.append(f'{label}: expected {expect}, got {got} '
                        f'(violations={report["result_invariant_violations"]})')
        print(f'  FAIL {label}: expected {expect}, got {got}')


def main() -> int:
    global PASSED
    print('SP-CI-02 result-aggregation invariants\n')

    print('Negatives — a non-failing status that inspected nothing must FAIL:')
    case('NOT_APPLICABLE with a non-empty scope',
         (_spec('candidate-regression-tests', 'NOT_APPLICABLE', 1, 0, allows_na=True),), 'FAIL')
    case('NOT_APPLICABLE from a check that may never report it',
         (_spec('json-parse', 'NOT_APPLICABLE', 0, 0),), 'FAIL')
    case('unknown status SKIPPED',
         (_spec('json-parse', 'SKIPPED', 1, 0),), 'FAIL')
    case('PASS with a non-empty scope and nothing inspected',
         (_spec('json-parse', 'PASS', 1, 0),), 'FAIL')
    case('PASS with partial coverage where full is declared',
         (_spec('json-parse', 'PASS', 5, 3, COVERAGE_FULL),), 'FAIL')
    case('examined more files than were in scope',
         (_spec('json-parse', 'PASS', 2, 7),), 'FAIL')
    case('malformed counts',
         (_spec('json-parse', 'PASS', 'many', 0),), 'FAIL')

    print('\nRegistration — the registry is the authority:')
    missing = CheckSpec('json-parse', lambda ctx: CheckResult('json-parse', 'x', 'PASS', [], 1, 1))
    other = CheckSpec('yaml-parse', lambda ctx: CheckResult('yaml-parse', 'x', 'PASS', [], 1, 1))
    case('all registered checks report', (missing, other), 'PASS')

    renamed = CheckSpec('json-parse',
                        lambda ctx: CheckResult('something-else', 'x', 'PASS', [], 1, 1))
    case('a check renaming itself', (renamed,), 'FAIL')

    # A registered check that vanishes: validate_results is called with the full
    # registry while only a subset actually ran.
    violations = checks.validate_results([CheckResult('yaml-parse', 'x', 'PASS', [], 1, 1)],
                                         (missing, other))
    if any('produced no result' in v for v in violations):
        PASSED += 1
        print('  ok   a missing registered check is a violation')
    else:
        FAILURES.append('missing registered check not detected')
        print('  FAIL a missing registered check is not detected')

    dup = checks.validate_results(
        [CheckResult('json-parse', 'x', 'PASS', [], 1, 1),
         CheckResult('json-parse', 'x', 'PASS', [], 1, 1)], (missing,))
    if any('exactly one is required' in v for v in dup):
        PASSED += 1
        print('  ok   a duplicated result is a violation')
    else:
        FAILURES.append('duplicate result not detected')
        print('  FAIL a duplicated result is not detected')

    unregistered = checks.validate_results(
        [CheckResult('json-parse', 'x', 'PASS', [], 1, 1),
         CheckResult('surprise-check', 'x', 'PASS', [], 1, 1)], (missing,))
    if any('unregistered' in v for v in unregistered):
        PASSED += 1
        print('  ok   an unregistered result is a violation')
    else:
        FAILURES.append('unregistered result not detected')
        print('  FAIL an unregistered result is not detected')

    print('\nIndependent review of 6126903, findings NB1-NB5:')
    # NB1: zero registered checks produced zero results and zero violations,
    # which aggregated to a green run that inspected nothing.
    case('an empty check registry', (), 'FAIL')

    # NB2: an unrecognised coverage string silently degraded to NONZERO, so a
    # typo in the registry became quiet under-enforcement rather than an error.
    case('a spec declaring an unknown coverage value',
         (_spec('json-parse', 'PASS', 5, 5, 'banana'),), 'FAIL')
    # (A FAIL result with a bad coverage value is deliberately NOT a case here:
    # it reports FAIL either way, so it could not detect a regression.)
    case('an unknown coverage value at partial coverage',
         (_spec('json-parse', 'PASS', 5, 3, 'banana'),), 'FAIL')

    # NB4: the registered-name comparison sits outside the try/except wrapping
    # the check call, so a check returning None raised AttributeError out of
    # run_all and no report was produced at all.
    case('a check that returns None',
         (CheckSpec('json-parse', lambda ctx: None, COVERAGE_FULL),), 'FAIL')
    case('a check that returns a non-CheckResult',
         (CheckSpec('json-parse', lambda ctx: {'status': 'PASS'}, COVERAGE_FULL),), 'FAIL')

    # NB5: isinstance(True, int) is True in Python, so booleans passed as counts.
    case('boolean file counts',
         (_spec('json-parse', 'PASS', True, True, COVERAGE_FULL),), 'FAIL')
    case('a boolean examined count against an integer scope',
         (_spec('json-parse', 'PASS', 5, True, COVERAGE_NONZERO),), 'FAIL')

    print('\nNBR-6 — an emptied scope is not an empty success:')
    # NB1 closed the empty-REGISTRY case. This is the empty-SCOPE sibling: every
    # check derives files_expected from SOURCE-CLASSIFICATION.json, so
    # reclassifying a check's paths out of scope zeroes it. Before min_scope, a
    # full registry of PASS 0/0 results aggregated to a green run that inspected
    # nothing — exactly the shape AGENTS.md calls a FAILURE.
    case('a declared-floor check whose scope was emptied',
         (_spec('json-parse', 'PASS', 0, 0, COVERAGE_FULL, min_scope=1),), 'FAIL')
    case('a whole registry of emptied scopes',
         tuple(_spec(n, 'PASS', 0, 0, COVERAGE_FULL, min_scope=1)
               for n in ('json-parse', 'python-syntax', 'doc-links')), 'FAIL')
    case('an emptied scope reported NOT_APPLICABLE is still a failure',
         (_spec('candidate-regression-tests', 'NOT_APPLICABLE', 0, 0,
                COVERAGE_FULL, allows_na=True, min_scope=1),), 'FAIL')
    case('a scope above its floor passes',
         (_spec('json-parse', 'PASS', 3, 3, COVERAGE_FULL, min_scope=1),), 'PASS')
    # A check already FAILING is not additionally penalised for a small scope:
    # the failure is the signal, and a duplicate violation would only be noise.
    case('a failing check is not re-flagged for its scope',
         (_spec('json-parse', 'FAIL', 0, 0, COVERAGE_FULL, min_scope=1),), 'FAIL')
    # No floor declared means the old behaviour, which the positives below pin.
    case('a check with no declared floor may have an empty scope',
         (_spec('yaml-parse', 'PASS', 0, 0, COVERAGE_FULL),), 'PASS')

    print('\nLegitimate positives — these must NOT be broken by the rule:')
    case('NOT_APPLICABLE with a genuinely empty optional scope',
         (_spec('candidate-regression-tests', 'NOT_APPLICABLE', 0, 0, allows_na=True),), 'PASS')
    case('PASS with an empty required scope',
         (_spec('json-parse', 'PASS', 0, 0, COVERAGE_FULL),), 'PASS')
    case('PASS with complete coverage',
         (_spec('json-parse', 'PASS', 5, 5, COVERAGE_FULL),), 'PASS')
    case('PASS with partial coverage where only nonzero is declared',
         (_spec('frozen-integrity', 'PASS', 5, 3, COVERAGE_NONZERO),), 'PASS')
    case('FAIL is reported as FAIL',
         (_spec('json-parse', 'FAIL', 5, 5, COVERAGE_FULL),), 'FAIL')
    # NB3: three checks were declared NONZERO but achieve full coverage. They are
    # now COVERAGE_FULL. NBR-8: that is strictly stronger for frozen-integrity
    # and candidate-regression-tests, but INERT for candidate-changes-valid,
    # which sets files_examined = files_expected unconditionally, so
    # examined != expected is unreachable there. Recorded rather than claimed as
    # an improvement it is not. These confirm no legitimate complete run fails.
    for promoted in ('frozen-integrity', 'candidate-changes-valid'):
        case(f'{promoted} passing at complete coverage',
             (_spec(promoted, 'PASS', 9, 9, COVERAGE_FULL),), 'PASS')
    case('candidate-regression-tests still allows a genuinely empty scope',
         (_spec('candidate-regression-tests', 'NOT_APPLICABLE', 0, 0,
                COVERAGE_FULL, allows_na=True),), 'PASS')

    print(f'\nsummary: {PASSED} passed, {len(FAILURES)} failed')
    if FAILURES:
        print('\nFAILURES:')
        for f in FAILURES:
            print('  -', f)
        return 1
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
