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


def _spec(name, status, expected, examined, coverage=COVERAGE_NONZERO, allows_na=False):
    def fn(_ctx, _n=name, _s=status, _e=expected, _x=examined):
        return CheckResult(_n, 'synthetic result injection', _s,
                           files_expected=_e, files_examined=_x)
    return CheckSpec(name, fn, coverage, allows_not_applicable=allows_na)


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

    print(f'\nsummary: {PASSED} passed, {len(FAILURES)} failed')
    if FAILURES:
        print('\nFAILURES:')
        for f in FAILURES:
            print('  -', f)
        return 1
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
