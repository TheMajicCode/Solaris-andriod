#!/usr/bin/env python3
"""AND-CI-01: JavaScript parse-mode controls under the ACTUAL pinned runtime.

`node --check file.js` exits 0 for a `.js` file containing ESM syntax even when
that file has a real syntax error, because Node's module-syntax detection stops
short of a full module parse. An external probe reproduced this on Node
v24.19.0; this repository's workflow pins Node 22. The behaviour must therefore
be measured here, not assumed from another version.

The fix must cut both ways:

  * every MALFORMED file must fail, whichever extension it carries, and
  * every VALID file must pass, including valid ESM.

Rejecting valid ESM because it was parsed as CommonJS is NOT a correct fix, and
this suite exists to catch that.

Run:  python3 tools/tests/test_js_parse_modes.py
"""
from __future__ import annotations

import json
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

TOOLS = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(TOOLS))

from solaris_checks.checks import _parse_one  # noqa: E402

VALID_ESM = b'export const value = 1;\nexport function f() { return value; }\n'
VALID_ESM_IMPORT = b'import { readFileSync } from "node:fs";\nexport const r = readFileSync;\n'
VALID_ESM_DYNAMIC = b'const p = import("node:fs");\nexport default p;\n'
VALID_CJS = b'const fs = require("node:fs");\nmodule.exports = { fs };\n'
VALID_CJS_EXPORTS = b'exports.build = function build() { return 1; };\n'
VALID_PLAIN = b'var a = 1;\nfunction f(){ return a; }\n'

BROKEN_ESM_MISSING_EXPR = b'export const value = ;\n'
BROKEN_ESM_UNCLOSED = b'export function f(){\n'
BROKEN_ESM_IMPORT_UNCLOSED = b'import fs from "node:fs";\nfunction broken( {\n'
BROKEN_CJS = b'function broken(){\n'
BROKEN_PLAIN = b'const a = ;\n'

# (label, source, must_parse)
CASES = [
    ('valid ESM: export const + function',       VALID_ESM,                 True),
    ('valid ESM: import + export',               VALID_ESM_IMPORT,          True),
    ('valid ESM: dynamic import',                VALID_ESM_DYNAMIC,         True),
    ('valid CJS: require + module.exports',      VALID_CJS,                 True),
    ('valid CJS: exports.fn',                    VALID_CJS_EXPORTS,         True),
    ('valid script: no module syntax',           VALID_PLAIN,               True),
    ('BROKEN ESM: missing expression',           BROKEN_ESM_MISSING_EXPR,   False),
    ('BROKEN ESM: unclosed function',            BROKEN_ESM_UNCLOSED,       False),
    ('BROKEN ESM: import + unclosed',            BROKEN_ESM_IMPORT_UNCLOSED, False),
    ('BROKEN CJS: unclosed function',            BROKEN_CJS,                False),
    ('BROKEN script: missing expression',        BROKEN_PLAIN,              False),
]


def node_version() -> str:
    return subprocess.run(['node', '--version'], capture_output=True, text=True).stdout.strip()


def raw_node_check(source: bytes, ext: str, tmpdir: Path) -> int:
    probe = tmpdir / f'raw{ext}'
    probe.write_bytes(source)
    return subprocess.run(['node', '--check', str(probe)], capture_output=True).returncode


def main() -> int:
    if shutil.which('node') is None:
        print('node is required for these controls')
        return 1

    version = node_version()
    print(f'AND-CI-01 parse-mode controls — pinned runtime {version}\n')

    passed, failures = 0, []
    raw_blind_spots = []

    with tempfile.TemporaryDirectory() as tmp:
        tmpdir = Path(tmp)

        # 1. Reproduce the raw blind spot on THIS runtime, so the claim is measured.
        for label, source, must_parse in CASES:
            if must_parse:
                continue
            if raw_node_check(source, '.js', tmpdir) == 0:
                raw_blind_spots.append(label)

        print('Raw `node --check <file>.js` blind spot on this runtime:')
        if raw_blind_spots:
            for label in raw_blind_spots:
                print(f'  REPRODUCED  malformed file accepted as .js — {label}')
        else:
            print('  not reproduced on this runtime (the checker fix is still required '
                  'for the runtimes where it is)')
        print()

        # 2. The checker's own parser must be correct in BOTH directions.
        for label, source, must_parse in CASES:
            ok, reason = _parse_one(source, tmpdir)
            if ok == must_parse:
                passed += 1
                print(f'  ok   {"parses" if must_parse else "rejected"}: {label}')
            else:
                if must_parse:
                    failures.append(f'{label}: VALID source was rejected ({reason}) — '
                                    'rejecting valid ESM is not a correct fix')
                else:
                    failures.append(f'{label}: malformed source was accepted')
                print(f'  FAIL {label}')

    print(f'\nsummary: {passed} passed, {len(failures)} failed')
    if failures:
        print('\nFAILURES:')
        for f in failures:
            print('  -', f)
        return 1

    report = {
        'scope': 'AND-CI-01 parse-mode controls on the pinned runtime',
        'node_version': version,
        'raw_js_blind_spot_reproduced': bool(raw_blind_spots),
        'raw_blind_spot_cases': raw_blind_spots,
        'checker_cases_passed': passed,
        'limitation': 'Measured on this runtime only. Node behaviour varies by version; '
                      'the checker parses under explicit .cjs/.mjs extensions so it does not '
                      'depend on module-syntax detection.',
    }
    print('\n' + json.dumps(report, indent=2))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
