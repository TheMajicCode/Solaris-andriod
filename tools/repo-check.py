#!/usr/bin/env python3
"""Source-only checks for the Solaris Android repository projection.

This is NOT the frozen import verifier and NOT a full-reference gate.

  * `docs/provenance/import-pack/verify-import.py` verifies the frozen transport
    pack in its own unchanged extracted directory. It cannot run here, because
    this repository deliberately adds a new README, governance, CI and docs.
  * The complete 604 handoff's own verifier and reproduction harness run only
    against the restored immutable reference directory, never against this tree.

What passes here says the imported bytes are intact and the tracked text parses.
It says nothing about application security, licensing clearance, native build
completeness, device behaviour or production readiness.

Usage:  python3 tools/repo-check.py [--json]
"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path, PurePosixPath

REPO = Path(__file__).resolve().parent.parent
MANIFEST = REPO / 'docs' / 'provenance' / 'REPO-IMPORT-MANIFEST.json'

# Roots whose contents are imported bytes and must match the manifest exactly.
IMPORTED_ROOTS = (
    'Solaris-Android-R2', 'Solaris-Android-R3', 'Solaris-Android-R4',
    'Solaris-Android-Reconstruction', 'handoff', 'solaris-603-native-probe',
    'docs/provenance/import-pack',
)

# Checks that cannot run without inputs that are deliberately absent here.
BLOCKED = [
    ('full-reference-604-reproduction',
     'Needs the four restored Solaris-Android-604-Handoff-Part-N-of-4.zip backups '
     'and the reassembled 1,518,762,347-byte reference. Run it there, never here.'),
    ('frozen-import-pack-verification',
     'docs/provenance/import-pack/verify-import.py applies to the unchanged extracted '
     'transport pack only. This repository intentionally differs from it.'),
    ('hbc-reconstruction-and-packaging',
     'Needs the reference APKs, pinned host compiler/parser and packaging tools from '
     'Solaris-603/604-Build-Inputs.zip, which are excluded from this projection.'),
    ('native-android-gradle-build',
     'No complete original native application/build project exists. Not blocked by '
     'this import — the source itself is missing. Do not fabricate scaffolding.'),
    ('on-device-acceptance-and-latency',
     'Needs a target phone, an installed build and explicit authorization. No APK is '
     'built, signed or installed by this repository.'),
    ('local-model-inference-checks',
     'The Qwen3-0.6B Q4 phone model and the probe model weight are excluded binaries.'),
]

SECRET_PATTERNS = [
    ('private-key-block', re.compile(rb'-----BEGIN [A-Z ]*PRIVATE KEY-----')),
    ('aws-access-key-id', re.compile(rb'\bAKIA[0-9A-Z]{16}\b')),
    ('github-token', re.compile(rb'\bgh[pousr]_[A-Za-z0-9]{36,}')),
    ('slack-token', re.compile(rb'\bxox[abprs]-[A-Za-z0-9-]{10,}')),
    ('bip39-style-mnemonic-label', re.compile(rb'(?i)\b(mnemonic|seed[_ -]?phrase)\s*[:=]\s*["\'][a-z ]{40,}["\']')),
]
SECRET_FILENAMES = re.compile(r'(?i)\.(jks|keystore|p12|pfx|pem|key)$|(^|/)(local|key)\.properties$|(^|/)\.env($|\.)')

TEXT_SUFFIXES = {'.md', '.txt', '.json', '.js', '.cjs', '.mjs', '.ts', '.py', '.java', '.c', '.cpp',
                 '.h', '.hpp', '.html', '.css', '.xml', '.sh', '.hasm', '.yaml', '.yml', '.toml',
                 '.config', '.envelope'}


def tracked_files() -> list[str]:
    out = subprocess.run(['git', '-C', str(REPO), 'ls-files', '-z'],
                         capture_output=True, text=True, check=True).stdout
    return [p for p in out.split('\0') if p]


def check_import_integrity(files: list[str]) -> tuple[str, list[str]]:
    if not MANIFEST.is_file():
        return 'FAIL', ['docs/provenance/REPO-IMPORT-MANIFEST.json is missing']
    manifest = json.loads(MANIFEST.read_text())
    failures: list[str] = []
    expected: dict[str, dict] = {}
    for entry in manifest['files']:
        dest = entry['tracked_path']
        rel = PurePosixPath(dest)
        if rel.is_absolute() or '..' in rel.parts or dest in expected:
            return 'FAIL', ['unsafe or duplicate manifest path: ' + dest]
        expected[dest] = entry

    tracked = set(files)
    for dest, entry in expected.items():
        target = REPO.joinpath(*PurePosixPath(dest).parts)
        if dest not in tracked:
            failures.append(dest + ': not tracked by Git')
            continue
        if target.is_symlink() or not target.is_file():
            failures.append(dest + ': missing or not a regular file')
            continue
        data = target.read_bytes()
        if len(data) != entry['bytes'] or hashlib.sha256(data).hexdigest() != entry['sha256']:
            failures.append(dest + ': bytes differ from the recorded import hash')

    for path in tracked:
        if path.startswith(IMPORTED_ROOTS) and path not in expected:
            failures.append(path + ': tracked under an imported root but absent from the import manifest')

    return ('FAIL' if failures else 'PASS'), failures


# Files that are JSON with comments by specification, not strict JSON.
JSONC_NAMES = {'devcontainer.json', 'tsconfig.json', 'jsconfig.json'}
_LINE_COMMENT = re.compile(r'^\s*//.*$', re.MULTILINE)


def check_json(files: list[str]) -> tuple[str, list[str]]:
    failures = []
    for path in files:
        if not path.endswith('.json'):
            continue
        text = (REPO / path).read_text(encoding='utf-8')
        if PurePosixPath(path).name in JSONC_NAMES:
            text = _LINE_COMMENT.sub('', text)
        try:
            json.loads(text)
        except Exception as exc:  # noqa: BLE001 - report any parse problem verbatim
            failures.append(f'{path}: {exc}')
    return ('FAIL' if failures else 'PASS'), failures


def check_yaml(files: list[str]) -> tuple[str, list[str]]:
    """Parse tracked YAML. Workflow files must be valid before they are pushed."""
    targets = [p for p in files if p.endswith(('.yml', '.yaml'))]
    if not targets:
        return 'PASS', []
    try:
        import yaml  # noqa: PLC0415 - optional dependency, absence must not be a pass
    except ImportError:
        return 'SKIPPED', ['PyYAML is not installed; YAML parsing was not run (this is not a pass)']
    failures = []
    for path in targets:
        try:
            yaml.safe_load((REPO / path).read_text(encoding='utf-8'))
        except Exception as exc:  # noqa: BLE001
            failures.append(f'{path}: {exc}')
    return ('FAIL' if failures else 'PASS'), failures


def check_python(files: list[str]) -> tuple[str, list[str]]:
    failures = []
    for path in files:
        if not path.endswith('.py'):
            continue
        try:
            compile((REPO / path).read_text(encoding='utf-8'), path, 'exec')
        except SyntaxError as exc:
            failures.append(f'{path}:{exc.lineno}: {exc.msg}')
    return ('FAIL' if failures else 'PASS'), failures


# Current authored application, UI, tool and test source. A parse failure here is a
# defect in maintained code and fails this run.
AUTHORED_JS_ROOTS = ('Solaris-Android-R2/', 'Solaris-Android-R3/', 'Solaris-Android-R4/',
                     'Solaris-Android-Reconstruction/src/reconstructed/')


def _parse_js(paths: list[str]) -> list[str]:
    failures = []
    for path in paths:
        result = subprocess.run(['node', '--check', str(REPO / path)], capture_output=True, text=True)
        if result.returncode != 0:
            reason = next((line for line in result.stderr.splitlines() if 'Error' in line), 'parse failed')
            failures.append(f'{path}: {reason.strip()}')
    return failures


def check_javascript_authored(files: list[str]) -> tuple[str, list[str]]:
    targets = [p for p in files if p.endswith(('.js', '.cjs', '.mjs')) and p.startswith(AUTHORED_JS_ROOTS)]
    if not targets:
        return 'PASS', []
    if shutil.which('node') is None:
        return 'SKIPPED', ['node is not available; JavaScript parsing was not run (this is not a pass)']
    failures = _parse_js(targets)
    return ('FAIL' if failures else 'PASS'), failures


def check_javascript_evidence(files: list[str]) -> tuple[str, list[str]]:
    """Retained recovered/probe/reference JavaScript.

    These are preserved evidence fragments, not maintained application source. A
    parse failure is reported as a finding to triage, never repaired by editing
    imported bytes to obtain a green run. Known finding: AND-IMP-01 in
    docs/workflow/STATUS.md.
    """
    targets = [p for p in files if p.endswith(('.js', '.cjs', '.mjs')) and not p.startswith(AUTHORED_JS_ROOTS)]
    if not targets:
        return 'INFO', []
    if shutil.which('node') is None:
        return 'SKIPPED', ['node is not available; JavaScript parsing was not run (this is not a pass)']
    return 'INFO', _parse_js(targets)


LINK_RE = re.compile(r'\[[^\]]*\]\(([^)]+)\)')


def check_doc_links(files: list[str]) -> tuple[str, list[str]]:
    """Resolve relative Markdown links in this repository's own authored docs."""
    scope = [p for p in files
             if p.endswith('.md')
             and (p in ('README.md', 'AGENTS.md', 'CLAUDE.md') or p.startswith('docs/'))
             and not p.startswith('docs/provenance/import-pack/')]
    failures = []
    for path in scope:
        base = (REPO / path).parent
        for target in LINK_RE.findall((REPO / path).read_text(encoding='utf-8')):
            target = target.split(' ')[0].strip()
            if target.startswith(('http://', 'https://', 'mailto:', '#')) or not target:
                continue
            resolved = (base / target.split('#')[0]).resolve()
            if not resolved.exists():
                failures.append(f'{path}: broken relative link -> {target}')
    return ('FAIL' if failures else 'PASS'), failures


def check_secret_patterns(files: list[str]) -> tuple[str, list[str]]:
    """Pattern scan only. A filename/regex sweep is not a complete secret audit."""
    findings = []
    for path in files:
        if SECRET_FILENAMES.search(path):
            findings.append(f'{path}: credential-shaped filename is tracked')
            continue
        if Path(path).suffix.lower() not in TEXT_SUFFIXES:
            continue
        data = (REPO / path).read_bytes()
        for name, pattern in SECRET_PATTERNS:
            if pattern.search(data):
                findings.append(f'{path}: matched {name}')
    return ('FAIL' if findings else 'PASS'), findings


def check_excluded_paths(files: list[str]) -> tuple[str, list[str]]:
    """Nothing deliberately excluded from this projection may become tracked."""
    forbidden = (
        ('Solaris-Android-R4/evidence/phone604/', 'private phone evidence'),
        ('Solaris-Android-Reconstruction/reference/host-disassembly/', 'full host disassembly'),
        ('reconstruction-inputs/', 'external build inputs'),
        ('reconstruction-work/', 'external build work'),
        ('releases/', 'release binaries'),
    )
    binary_suffixes = ('.apk', '.aab', '.hbc', '.dex', '.so', '.gguf', '.jks', '.keystore',
                       '.zip', '.tar.xz', '.tgz', '.bundle')
    findings = []
    for path in files:
        for prefix, why in forbidden:
            if path.startswith(prefix) or f'/{prefix}' in path:
                findings.append(f'{path}: {why} must stay out of this repository')
        if path.endswith(binary_suffixes):
            findings.append(f'{path}: excluded binary/archive input is tracked')
        if '/node_modules/' in path or path.startswith('node_modules/'):
            findings.append(f'{path}: bundled third-party dependency is tracked')
    return ('FAIL' if findings else 'PASS'), findings


CHECKS = [
    ('import-integrity', 'Imported bytes match docs/provenance/REPO-IMPORT-MANIFEST.json', check_import_integrity),
    ('excluded-path-policy', 'Deliberately excluded private/binary inputs stay untracked', check_excluded_paths),
    ('json-parse', 'Every tracked .json file parses (JSONC allowed for devcontainer/tsconfig)', check_json),
    ('yaml-parse', 'Every tracked .yml/.yaml file parses', check_yaml),
    ('python-syntax', 'Every tracked .py file compiles to bytecode (syntax only)', check_python),
    ('javascript-syntax-authored', 'Current authored JS in R2/R3/R4 and reconstructed src parses with node --check',
     check_javascript_authored),
    ('javascript-parse-evidence', 'Retained recovered/probe JS parses (informational triage, never a reason to edit imported bytes)',
     check_javascript_evidence),
    ('doc-links', "Relative Markdown links in this repository's authored docs resolve", check_doc_links),
    ('secret-pattern-scan', 'Pattern sweep for credential-shaped names and key material', check_secret_patterns),
]


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--json', action='store_true', help='emit a machine-readable report')
    args = parser.parse_args()

    files = tracked_files()
    results = []
    worst_ok = True
    for name, description, fn in CHECKS:
        status, detail = fn(files)
        results.append({'check': name, 'scope': description, 'status': status, 'findings': detail})
        if status == 'FAIL':
            worst_ok = False

    report = {
        'scope': 'source-only-repository-projection',
        'not_established': [
            'native Android build completeness or reproducibility',
            'application security or licensing clearance',
            'on-device behaviour, latency or release readiness',
        ],
        'tracked_files': len(files),
        'checks': results,
        'blocked': [{'check': n, 'reason': r} for n, r in BLOCKED],
        'status': 'PASS' if worst_ok else 'FAIL',
    }

    if args.json:
        print(json.dumps(report, indent=2))
    else:
        print(f'Solaris Android source-only repository checks — {len(files)} tracked files\n')
        for item in results:
            print(f"[{item['status']:7}] {item['check']}")
            print(f"           {item['scope']}")
            for finding in item['findings'][:25]:
                print(f'           - {finding}')
            if len(item['findings']) > 25:
                print(f"           - ... and {len(item['findings']) - 25} more")
        print('\nBlocked — these need inputs that are deliberately absent here:')
        for name, reason in BLOCKED:
            print(f'  [BLOCKED] {name}\n            {reason}')
        print(f"\nOverall: {report['status']}")
        print('A pass here proves preserved bytes and parseable text only. It does not prove')
        print('security, licensing, native build completeness or production readiness.')
    return 0 if worst_ok else 1


if __name__ == '__main__':
    raise SystemExit(main())
