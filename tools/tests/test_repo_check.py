#!/usr/bin/env python3
"""Negative controls for tools/repo-check.py.

A checker nobody tests is a checker nobody can trust. Each test below builds a
small synthetic repository, breaks exactly one thing, and asserts that the
matching required check FAILS. Several of these encode defects this repository
actually shipped:

  * yaml-parse reported SKIPPED with PyYAML absent while the run stayed green;
  * JSONC comments were stripped with a regex that corrupts strings and URLs;
  * new source outside the old R2/R3/R4 prefixes received informational
    retained-evidence treatment instead of a failing syntax check.

Run:  python3 tools/tests/test_repo_check.py
"""
from __future__ import annotations

import builtins
import hashlib
import json
import shutil
import subprocess
import sys
import tempfile
import traceback
from pathlib import Path

TOOLS = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(TOOLS))

from solaris_checks import jsonc                      # noqa: E402
from solaris_checks.checks import run_all             # noqa: E402

FAILURES: list[str] = []
PASSES = 0


def sha(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


class Fixture:
    """A minimal synthetic repository the real checker can run against."""

    def __init__(self, root: Path):
        self.root = root
        (root / 'docs/provenance').mkdir(parents=True)
        (root / 'candidate/tests').mkdir(parents=True)
        self.frozen: dict[str, bytes] = {}
        self.extra: list[str] = []
        self.candidate = {
            'format': 'solaris-android-candidate-changes/1',
            'rules': [],
            'candidate_overrides': [],
            'maintained_candidate_paths': [],
            'inherited_defects': [],
            'frozen_external_records': [],
        }

    def add_frozen(self, rel: str, data: bytes) -> None:
        p = self.root / rel
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_bytes(data)
        self.frozen[rel] = data

    def add_file(self, rel: str, data: bytes) -> None:
        p = self.root / rel
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_bytes(data)
        self.extra.append(rel)

    def write(self) -> None:
        classification = {
            'format': 'solaris-android-source-classification/1',
            'integrity_roles': {'frozen': 'imported', 'maintained': 'ours'},
            'check_scopes': {
                'authored-source': '', 'retained-evidence': '', 'maintained-candidate': '',
                'documentation': '', 'repo-tooling': '', 'repo-config': '', 'provenance-record': '',
            },
            'rules': [
                {'prefix': 'imported/evidence/', 'integrity': 'frozen', 'scope': 'retained-evidence'},
                {'prefix': 'imported/', 'integrity': 'frozen', 'scope': 'authored-source'},
                {'prefix': 'candidate/', 'integrity': 'maintained', 'scope': 'maintained-candidate'},
                {'prefix': 'docs/', 'integrity': 'maintained', 'scope': 'provenance-record'},
                {'prefix': 'conf/', 'integrity': 'maintained', 'scope': 'repo-config'},
            ],
        }
        (self.root / 'docs/provenance/SOURCE-CLASSIFICATION.json').write_text(json.dumps(classification))
        manifest = {
            'format': 'solaris-android-repo-import-manifest/1',
            'files': [{'tracked_path': rel, 'bytes': len(d), 'sha256': sha(d)}
                      for rel, d in self.frozen.items()],
        }
        (self.root / 'docs/provenance/REPO-IMPORT-MANIFEST.json').write_text(json.dumps(manifest))
        (self.root / 'docs/provenance/CANDIDATE-CHANGES.json').write_text(json.dumps(self.candidate))

    def files(self) -> list[str]:
        return sorted(list(self.frozen) + self.extra + [
            'docs/provenance/SOURCE-CLASSIFICATION.json',
            'docs/provenance/REPO-IMPORT-MANIFEST.json',
            'docs/provenance/CANDIDATE-CHANGES.json',
        ])

    def run(self) -> dict:
        self.write()
        subprocess.run(['git', 'init', '-q', str(self.root)], check=True,
                       capture_output=True)
        return run_all(self.root, self.files())


def status_of(report: dict, name: str) -> str:
    for c in report['checks']:
        if c['check'] == name:
            return c['status']
    raise AssertionError(f'check {name} not present in report')


def case(description: str):
    def wrap(fn):
        global PASSES
        try:
            with tempfile.TemporaryDirectory() as tmp:
                fn(Fixture(Path(tmp) / 'repo'))
            PASSES += 1
            print(f'  ok   {description}')
        except AssertionError as exc:
            FAILURES.append(f'{description}: {exc}')
            print(f'  FAIL {description}: {exc}')
        except Exception:  # noqa: BLE001
            FAILURES.append(f'{description}: {traceback.format_exc()}')
            print(f'  FAIL {description}: unexpected error')
        return fn
    return wrap


def baseline(f: Fixture) -> None:
    f.add_frozen('imported/app.js', b'var a = 1;\n')
    f.add_frozen('imported/evidence/old.js', b'var b = 2;\n')


# --- integrity -------------------------------------------------------------

@case('unauthorized drift in an imported file FAILS frozen-integrity')
def _(f: Fixture):
    baseline(f)
    f.write()
    (f.root / 'imported/app.js').write_bytes(b'var a = 999;\n')   # edited after hashing
    r = run_all(f.root, f.files())
    subprocess.run(['git', 'init', '-q', str(f.root)], capture_output=True)
    assert status_of(r, 'frozen-integrity') == 'FAIL', status_of(r, 'frozen-integrity')
    assert r['status'] == 'FAIL'


@case('an authorized override with correct hashes PASSES frozen-integrity')
def _(f: Fixture):
    baseline(f)
    original = f.frozen['imported/app.js']
    changed = b'var a = 999;\n'
    f.candidate['candidate_overrides'] = [{
        'path': 'imported/app.js', 'original_sha256': sha(original), 'resulting_sha256': sha(changed),
        'rationale': 'test', 'integration_target': 'test',
    }]
    f.write()
    (f.root / 'imported/app.js').write_bytes(changed)
    r = run_all(f.root, f.files())
    assert status_of(r, 'frozen-integrity') == 'PASS', status_of(r, 'frozen-integrity')


@case('an override claiming the wrong original hash FAILS frozen-integrity')
def _(f: Fixture):
    baseline(f)
    changed = b'var a = 999;\n'
    f.candidate['candidate_overrides'] = [{
        'path': 'imported/app.js', 'original_sha256': sha(b'not the original'),
        'resulting_sha256': sha(changed), 'rationale': 'test', 'integration_target': 'test',
    }]
    f.write()
    (f.root / 'imported/app.js').write_bytes(changed)
    r = run_all(f.root, f.files())
    assert status_of(r, 'frozen-integrity') == 'FAIL'


@case('a deleted imported file FAILS frozen-integrity')
def _(f: Fixture):
    baseline(f)
    f.write()
    (f.root / 'imported/app.js').unlink()
    r = run_all(f.root, f.files())
    assert status_of(r, 'frozen-integrity') == 'FAIL'


@case('an unclassified path FAILS classification-complete')
def _(f: Fixture):
    baseline(f)
    f.add_file('somewhere-new/thing.js', b'var c = 3;\n')
    r = f.run()
    assert status_of(r, 'classification-complete') == 'FAIL'


# --- inherited defect registry --------------------------------------------

@case('a registered inherited defect that no longer exists FAILS candidate-changes-valid')
def _(f: Fixture):
    baseline(f)
    f.candidate['inherited_defects'] = [{
        'id': 'X-01', 'path': 'imported/evidence/gone.js', 'sha256': sha(b'x'),
        'tool': 'node --check', 'expected_diagnostic': 'SyntaxError', 'disposition': 'OPEN',
    }]
    r = f.run()
    assert status_of(r, 'candidate-changes-valid') == 'FAIL'


@case('a registered inherited defect whose file changed FAILS candidate-changes-valid')
def _(f: Fixture):
    baseline(f)
    f.add_frozen('imported/evidence/broken.js', b'function a(){\n')
    f.candidate['inherited_defects'] = [{
        'id': 'X-02', 'path': 'imported/evidence/broken.js', 'sha256': sha(b'different bytes'),
        'tool': 'node --check', 'expected_diagnostic': 'SyntaxError', 'disposition': 'OPEN',
    }]
    r = f.run()
    assert status_of(r, 'candidate-changes-valid') == 'FAIL'


@case('an UNregistered evidence parse defect FAILS javascript-parse-evidence')
def _(f: Fixture):
    baseline(f)
    f.add_frozen('imported/evidence/broken.js', b'function a(){\n')   # truncated, unregistered
    r = f.run()
    assert status_of(r, 'javascript-parse-evidence') == 'FAIL'


@case('a registered evidence defect PASSES, and covers only its own exact path')
def _(f: Fixture):
    baseline(f)
    broken = b'function a(){\n'
    f.add_frozen('imported/evidence/broken.js', broken)
    f.add_frozen('imported/evidence/also-broken.js', b'function b(){\n')
    f.candidate['inherited_defects'] = [{
        'id': 'X-03', 'path': 'imported/evidence/broken.js', 'sha256': sha(broken),
        'tool': 'node --check', 'expected_diagnostic': 'SyntaxError: Unexpected end of input',
        'disposition': 'OPEN',
    }]
    r = f.run()
    # The second broken file is NOT covered by the first one's registration.
    assert status_of(r, 'javascript-parse-evidence') == 'FAIL', 'one exception must not shield a directory'
    findings = next(c for c in r['checks'] if c['check'] == 'javascript-parse-evidence')['findings']
    assert any('also-broken.js' in x for x in findings)
    assert not any('/broken.js' in x for x in findings), findings


# --- maintained candidate --------------------------------------------------

@case('a syntax error in NEW maintained-candidate JS FAILS javascript-syntax-authored')
def _(f: Fixture):
    baseline(f)
    f.add_file('candidate/src/router.js', b'export function r(){\n')   # truncated
    f.candidate['maintained_candidate_paths'] = ['candidate/src/router.js']
    r = f.run()
    assert status_of(r, 'javascript-syntax-authored') == 'FAIL', \
        'new candidate source must not receive informational evidence treatment'


@case('a failing candidate regression suite FAILS candidate-regression-tests')
def _(f: Fixture):
    baseline(f)
    f.add_file('candidate/src/ok.js', b'var x = 1;\n')
    f.add_file('candidate/tests/run-all.mjs', b'console.log("summary: 1 failed");process.exit(1);\n')
    f.candidate['maintained_candidate_paths'] = ['candidate/src/ok.js']
    r = f.run()
    assert status_of(r, 'candidate-regression-tests') == 'FAIL'


@case('maintained-candidate source with no runner FAILS candidate-regression-tests')
def _(f: Fixture):
    baseline(f)
    f.add_file('candidate/src/ok.js', b'var x = 1;\n')
    f.candidate['maintained_candidate_paths'] = ['candidate/src/ok.js']
    r = f.run()
    assert status_of(r, 'candidate-regression-tests') == 'FAIL'


# --- parsing ---------------------------------------------------------------

@case('malformed YAML FAILS yaml-parse')
def _(f: Fixture):
    baseline(f)
    f.add_file('conf/bad.yml', b'a: [1, 2\nb: {\n')
    r = f.run()
    assert status_of(r, 'yaml-parse') == 'FAIL'


@case('absent PyYAML FAILS yaml-parse rather than reporting a green skip')
def _(f: Fixture):
    baseline(f)
    f.add_file('conf/ok.yml', b'a: 1\n')
    f.write()
    subprocess.run(['git', 'init', '-q', str(f.root)], capture_output=True)
    real_import = builtins.__import__

    def blocked(name, *a, **k):
        if name == 'yaml':
            raise ImportError('simulated: PyYAML is not installed')
        return real_import(name, *a, **k)

    builtins.__import__ = blocked
    try:
        sys.modules.pop('yaml', None)
        r = run_all(f.root, f.files())
    finally:
        builtins.__import__ = real_import
    assert status_of(r, 'yaml-parse') == 'FAIL', status_of(r, 'yaml-parse')
    assert r['status'] == 'FAIL', 'the overall run must not be green when a required check could not run'


@case('malformed JSON FAILS json-parse')
def _(f: Fixture):
    baseline(f)
    f.add_file('conf/bad.json', b'{"a": 1,}\n')
    r = f.run()
    assert status_of(r, 'json-parse') == 'FAIL'


@case('a comment in strict JSON FAILS json-parse')
def _(f: Fixture):
    baseline(f)
    f.add_file('conf/strict.json', b'{\n  // not allowed here\n  "a": 1\n}\n')
    r = f.run()
    assert status_of(r, 'json-parse') == 'FAIL'


@case('JSONC with a URL and comment-like string content PASSES json-parse')
def _(f: Fixture):
    baseline(f)
    f.add_file('conf/devcontainer.json',
               b'{\n  // a real comment\n  "image": "https://example.com/x",\n'
               b'  "note": "a /* not a comment */ b"\n}\n')
    r = f.run()
    assert status_of(r, 'json-parse') == 'PASS', \
        'a regex comment stripper corrupts URLs and strings; the scanner must not'


# --- jsonc unit checks -----------------------------------------------------

def unit_jsonc() -> None:
    global PASSES
    checks = [
        ('url survives', '{"u":"https://e.com/a"}', 'https://e.com/a', 'u'),
        ('block comment in string survives', '{"n":"a /* b */ c"}', 'a /* b */ c', 'n'),
        ('escaped quote survives', '{"n":"say \\" // no"}', 'say " // no', 'n'),
    ]
    for label, text, expected, key in checks:
        try:
            assert jsonc.loads(text, jsonc=True)[key] == expected
            PASSES += 1
            print(f'  ok   jsonc: {label}')
        except AssertionError:
            FAILURES.append(f'jsonc: {label}')
            print(f'  FAIL jsonc: {label}')
    for label, text in [('unterminated block comment', '{"a":1} /* x'),
                        ('unterminated string', '{"a":"x')]:
        try:
            jsonc.loads(text, jsonc=True)
            FAILURES.append(f'jsonc: {label} should raise')
            print(f'  FAIL jsonc: {label} should raise')
        except Exception:  # noqa: BLE001
            PASSES += 1
            print(f'  ok   jsonc: {label} raises')


def main() -> int:
    print('repo-check negative controls\n')
    unit_jsonc()
    print(f'\nsummary: {PASSES} passed, {len(FAILURES)} failed')
    if FAILURES:
        print('\nFAILURES:')
        for f in FAILURES:
            print('  -', f)
        return 1
    return 0


if __name__ == '__main__':
    if shutil.which('node') is None:
        print('node is required for these tests (JavaScript parse controls)')
        raise SystemExit(1)
    raise SystemExit(main())
