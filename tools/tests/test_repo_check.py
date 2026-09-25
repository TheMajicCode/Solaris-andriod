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


@case('a frozen_external_record CANNOT launder drift in an imported file')
def _(f: Fixture):
    baseline(f)
    original = f.frozen['imported/app.js']
    changed = b'var a = 999;\n'
    # The laundering attempt: pin the MODIFIED bytes as an "external" record.
    # No original hash, no rationale, no integration target.
    f.candidate['frozen_external_records'] = [{
        'path': 'imported/app.js', 'sha256': sha(changed), 'bytes': len(changed),
        'origin': 'pretend', 'why_not_in_import_manifest': 'pretend',
    }]
    f.write()
    (f.root / 'imported/app.js').write_bytes(changed)
    r = run_all(f.root, f.files())
    assert status_of(r, 'frozen-integrity') == 'FAIL', \
        'an external record must never overwrite an import-manifest entry'
    assert sha(original) != sha(changed)


@case('a frozen_external_record missing required fields FAILS')
def _(f: Fixture):
    baseline(f)
    f.add_file('extra/note.txt', b'hello\n')
    f.candidate['frozen_external_records'] = [{'path': 'extra/note.txt', 'sha256': sha(b'hello\n')}]
    f.write()
    r = run_all(f.root, f.files())
    assert status_of(r, 'candidate-changes-valid') == 'FAIL'


@case('declassifying candidate source does NOT silence its test gate')
def _(f: Fixture):
    baseline(f)
    f.add_file('candidate/src/ok.js', b'var x = 1;\n')
    f.write()
    # Reclassify candidate/ as documentation and drop the declared paths.
    classification = json.loads((f.root / 'docs/provenance/SOURCE-CLASSIFICATION.json').read_text())
    for rule in classification['rules']:
        if rule.get('prefix') == 'candidate/':
            rule['scope'] = 'documentation'
    (f.root / 'docs/provenance/SOURCE-CLASSIFICATION.json').write_text(json.dumps(classification))
    r = run_all(f.root, f.files())
    assert status_of(r, 'candidate-regression-tests') == 'FAIL', \
        'reclassification must not be a way to skip candidate tests'
    assert r['status'] == 'FAIL'


# --- executable-code-scope: the converse of AUD-08 ------------------------
# Each negative control below reproduces an attack that passed EVERY check in a
# scratch copy of the real tree on 2026-09-24, before this check existed.

def _prepend_rules(f: Fixture, *rules: dict) -> None:
    path = f.root / 'docs/provenance/SOURCE-CLASSIFICATION.json'
    classification = json.loads(path.read_text())
    classification['rules'] = list(rules) + classification['rules']
    path.write_text(json.dumps(classification))


def _maintained_evidence(prefix: str) -> dict:
    return {'prefix': prefix, 'integrity': 'maintained', 'scope': 'retained-evidence'}


@case('A1: a working candidate file missing from the ledger FAILS executable-code-scope')
def _(f: Fixture):
    baseline(f)
    f.add_file('candidate/src/declared.js', b'var x = 1;\n')
    f.add_file('candidate/src/undeclared.js', b'var y = 2;\n')
    f.candidate['maintained_candidate_paths'] = ['candidate/src/declared.js']
    f.write()
    r = run_all(f.root, f.files())
    assert status_of(r, 'executable-code-scope') == 'FAIL', status_of(r, 'executable-code-scope')
    assert r['status'] == 'FAIL'


@case('A2: candidate code moved into an evidence/ dir and reclassified FAILS')
def _(f: Fixture):
    baseline(f)
    f.add_file('candidate/src/evidence/escape.js', b'var z = 3;\n')
    f.candidate['maintained_candidate_paths'] = []
    f.write()
    _prepend_rules(f, _maintained_evidence('candidate/src/evidence/'))
    r = run_all(f.root, f.files())
    assert status_of(r, 'executable-code-scope') == 'FAIL', status_of(r, 'executable-code-scope')
    assert r['status'] == 'FAIL'


@case('A4: the checker package reclassified as evidence FAILS')
def _(f: Fixture):
    baseline(f)
    f.add_file('tools/solaris_checks/checks.py', b'X = 1\n')
    f.write()
    _prepend_rules(f, {'prefix': 'tools/', 'integrity': 'maintained', 'scope': 'repo-tooling'},
                   _maintained_evidence('tools/solaris_checks/'))
    r = run_all(f.root, f.files())
    assert status_of(r, 'executable-code-scope') == 'FAIL', status_of(r, 'executable-code-scope')
    assert r['status'] == 'FAIL'


@case('A5: a new tool placed under tools/evidence/ and reclassified FAILS')
def _(f: Fixture):
    baseline(f)
    f.add_file('tools/evidence/escape.js', b'var w = 4;\n')
    f.write()
    _prepend_rules(f, {'prefix': 'tools/', 'integrity': 'maintained', 'scope': 'repo-tooling'},
                   _maintained_evidence('tools/evidence/'))
    r = run_all(f.root, f.files())
    assert status_of(r, 'executable-code-scope') == 'FAIL', status_of(r, 'executable-code-scope')
    assert r['status'] == 'FAIL'


@case('a maintained file classified retained-evidence anywhere FAILS (evidence is frozen)')
def _(f: Fixture):
    baseline(f)
    f.add_file('conf/evidence/made-up.json', b'{}\n')
    f.write()
    _prepend_rules(f, _maintained_evidence('conf/evidence/'))
    r = run_all(f.root, f.files())
    assert status_of(r, 'executable-code-scope') == 'FAIL', status_of(r, 'executable-code-scope')


@case('positive: genuine frozen nested evidence and declared candidate code PASS')
def _(f: Fixture):
    baseline(f)                      # includes frozen imported/evidence/old.js
    f.add_frozen('imported/sub/evidence/fixture.js', b'var f = 5;\n')
    f.add_file('candidate/src/ok.js', b'var x = 1;\n')
    f.candidate['maintained_candidate_paths'] = ['candidate/src/ok.js']
    f.write()
    _prepend_rules(f, {'prefix': 'imported/sub/evidence/', 'integrity': 'frozen',
                       'scope': 'retained-evidence'})
    r = run_all(f.root, f.files())
    assert status_of(r, 'executable-code-scope') == 'PASS', status_of(r, 'executable-code-scope')
    assert status_of(r, 'evidence-not-authored-source') == 'PASS'


# --- c57c0b2 review, non-blocking items closed in Sprint-02 -----------------

@case('N8: an imported file that lost its executable flag FAILS frozen-integrity')
def _(f: Fixture):
    baseline(f)
    f.add_frozen('imported/run.sh', b'#!/bin/sh\necho ok\n')
    f.write()
    manifest_path = f.root / 'docs/provenance/REPO-IMPORT-MANIFEST.json'
    manifest = json.loads(manifest_path.read_text())
    for entry in manifest['files']:
        entry['executable'] = entry['tracked_path'] == 'imported/run.sh'
    manifest_path.write_text(json.dumps(manifest))
    script = f.root / 'imported/run.sh'
    script.chmod(0o755)
    positive = run_all(f.root, f.files())
    assert status_of(positive, 'frozen-integrity') == 'PASS', 'matching modes must pass'
    script.chmod(0o644)
    r = run_all(f.root, f.files())
    assert status_of(r, 'frozen-integrity') == 'FAIL', 'a dropped exec bit went unnoticed'
    script.chmod(0o755)
    (f.root / 'imported/app.js').chmod(0o755)
    r = run_all(f.root, f.files())
    assert status_of(r, 'frozen-integrity') == 'FAIL', 'a gained exec bit went unnoticed'


@case('N3: an upper-case .APK and a .safetensors weight FAIL excluded-path-policy')
def _(f: Fixture):
    for name in ('conf/app.APK', 'conf/model.safetensors'):
        g = Fixture(f.root.parent / name.replace('/', '_').replace('.', '_'))
        baseline(g)
        g.add_file(name, b'x')
        r = g.run()
        assert status_of(r, 'excluded-path-policy') == 'FAIL', f'{name} was accepted'


@case('N4: key material in a .tsx file FAILS secret-pattern-scan')
def _(f: Fixture):
    baseline(f)
    f.add_file('conf/leak.tsx', b'const k = `-----BEGIN ' + b'RSA PRIVATE KEY-----`;\n')
    r = f.run()
    assert status_of(r, 'secret-pattern-scan') == 'FAIL', 'the .tsx suffix was not scanned'


@case('N7: a doc link escaping the repository FAILS doc-links, and .github Markdown is checked')
def _(f: Fixture):
    baseline(f)
    f.add_file('manual/guide.md', b'[ok](guide.md) [escape](../../../../../../etc/hostname)\n')
    f.add_file('conf/template.md', b'[broken](missing.md)\n')
    f.write()
    _prepend_rules(f, {'prefix': 'manual/', 'integrity': 'maintained', 'scope': 'documentation'})
    r = run_all(f.root, f.files())
    report = next(c for c in r['checks'] if c['check'] == 'doc-links')
    text = ' '.join(report['findings'])
    assert report['status'] == 'FAIL'
    assert 'escapes the repository' in text, text
    assert 'conf/template.md' in text, 'repo-config Markdown was not link-checked'


@case('a check that examines zero expected files FAILS (coverage guard)')
def _(f: Fixture):
    baseline(f)
    f.write()
    from solaris_checks.checks import CheckResult, _coverage, PASS as _PASS
    probe = _coverage(CheckResult('probe', 'scope', _PASS, files_expected=5, files_examined=0))
    assert probe.status == 'FAIL', 'a check inspecting nothing must not pass'
    ok = _coverage(CheckResult('probe', 'scope', _PASS, files_expected=5, files_examined=5))
    assert ok.status == 'PASS'


@case('a registered defect whose DIAGNOSTIC changed FAILS')
def _(f: Fixture):
    baseline(f)
    broken = b'function a(){\n'
    f.add_frozen('imported/evidence/broken.js', broken)
    f.candidate['inherited_defects'] = [{
        'id': 'X-04', 'path': 'imported/evidence/broken.js', 'sha256': sha(broken),
        'tool': 'node --check', 'expected_diagnostic': 'SyntaxError: Some Other Diagnostic',
        'disposition': 'OPEN',
    }]
    r = f.run()
    assert status_of(r, 'javascript-parse-evidence') == 'FAIL', \
        'the exception is narrowed to one diagnostic, not the whole file'


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


def unit_blocked_gate_table() -> None:
    """AUD-09 / NBR-2: the documented blocked-gate table drifted from the checker
    twice while being maintained by hand. Compare the real document with the real
    registry, so the next drift fails CI instead of waiting for a reviewer."""
    global PASSES
    import re
    from solaris_checks.checks import BLOCKED_GATES
    doc = (TOOLS.parent / 'docs/BUILD-AND-TEST.md').read_text(encoding='utf-8')
    section = doc.split('## Blocked gates', 1)[1].split('\n## ', 1)[0]
    documented = re.findall(r'^\| `([a-z0-9-]+)` \|', section, flags=re.M)
    registered = [name for name, _ in BLOCKED_GATES]
    count = re.search(r'prints all (\d+) of these', section)
    label = 'docs: BUILD-AND-TEST blocked-gate table matches BLOCKED_GATES'
    if documented == registered and count and int(count.group(1)) == len(registered):
        PASSES += 1
        print(f'  ok   {label}')
    else:
        FAILURES.append(f'{label}: documented {documented} (count {count and count.group(1)}) '
                        f'vs registered {registered}')
        print(f'  FAIL {label}')


def main() -> int:
    print('repo-check negative controls\n')
    unit_jsonc()
    unit_blocked_gate_table()
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
