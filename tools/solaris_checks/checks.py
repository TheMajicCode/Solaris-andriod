"""Fail-closed source-only checks.

Design rule for every check in this module: **a check that could not do its job
FAILS.** It never reports green. Specifically a check fails when

  * a dependency it needs is unavailable,
  * it examined zero files while its scope says files exist,
  * it raised an unexpected exception, or
  * it found a defect that is not registered in CANDIDATE-CHANGES.json.

A genuinely out-of-scope gate (a native Android build, full-reference
reproduction) is reported separately as BLOCKED and never counted as a pass.
"""
from __future__ import annotations

import hashlib
import json
import re
import platform
import shutil
import subprocess
import tempfile
from dataclasses import dataclass, field
from pathlib import Path, PurePosixPath

from .classification import Classification, Rule
from . import jsonc

PASS, FAIL, NOT_APPLICABLE = 'PASS', 'FAIL', 'NOT_APPLICABLE'

# The only statuses a check may report. Anything else is malformed and fails.
VALID_STATUSES = frozenset({PASS, FAIL, NOT_APPLICABLE})

# Coverage semantics, declared per check rather than assumed globally. Checks
# have different meanings for "examined", so a single count-equality rule across
# all of them would be wrong.
#
#   'full'    — when passing, every in-scope file must have been inspected.
#   'nonzero' — when passing with a positive scope, at least one file must have
#               been inspected. Used where a check legitimately stops early or
#               counts differently from its scope.
COVERAGE_FULL, COVERAGE_NONZERO = 'full', 'nonzero'


@dataclass(frozen=True)
class CheckSpec:
    """What a registered check is, and what a valid result from it looks like.

    Registration is central: `run_all` requires every spec to produce exactly one
    well-formed result. A check that disappears, reports twice, reports an
    unknown status, or claims to pass without inspecting its scope is a failure
    of the run — not something an individual check gets to decide for itself.
    """
    name: str
    fn: object
    coverage: str = COVERAGE_NONZERO
    # NOT_APPLICABLE is only ever legitimate for a genuinely empty optional
    # scope. A check with work to do may never report it.
    allows_not_applicable: bool = False


@dataclass
class CheckResult:
    name: str
    scope: str
    status: str
    findings: list[str] = field(default_factory=list)
    files_examined: int = 0
    files_expected: int = 0

    @property
    def failed(self) -> bool:
        return self.status == FAIL

    def as_dict(self) -> dict:
        return {
            'check': self.name,
            'scope': self.scope,
            'status': self.status,
            'files_examined': self.files_examined,
            'files_expected': self.files_expected,
            'findings': self.findings,
        }


def _coverage(result: CheckResult) -> CheckResult:
    """A check that examined nothing while files were expected has not passed."""
    if result.status == PASS and result.files_expected > 0 and result.files_examined == 0:
        result.status = FAIL
        result.findings.append(
            f'examined 0 files but {result.files_expected} were in scope; '
            'a check that inspects nothing cannot pass'
        )
    return result


class Context:
    def __init__(self, repo: Path, files: list[str]):
        self.repo = repo
        self.files = files
        self.classification = Classification.load(repo / 'docs/provenance/SOURCE-CLASSIFICATION.json')
        self.resolved, self.unclassified = self.classification.partition(files)
        self.import_manifest = json.loads((repo / 'docs/provenance/REPO-IMPORT-MANIFEST.json').read_text())
        self.candidate = json.loads((repo / 'docs/provenance/CANDIDATE-CHANGES.json').read_text())

    def read(self, path: str) -> bytes:
        return (self.repo / path).read_bytes()

    def sha(self, path: str) -> str:
        return hashlib.sha256(self.read(path)).hexdigest()

    def scoped(self, *scopes: str) -> list[str]:
        return self.classification.paths_with_scope(self.resolved, *scopes)


# --------------------------------------------------------------------------
# Integrity
# --------------------------------------------------------------------------

def check_classification(ctx: Context) -> CheckResult:
    r = CheckResult('classification-complete',
                    'Every tracked file resolves to one integrity role and one check scope',
                    PASS, files_expected=len(ctx.files), files_examined=len(ctx.files))
    for path in ctx.unclassified:
        r.findings.append(f'{path}: unclassified — add a rule to SOURCE-CLASSIFICATION.json')
    if r.findings:
        r.status = FAIL
    return _coverage(r)


def check_frozen_integrity(ctx: Context) -> CheckResult:
    """Frozen bytes must match the import manifest unless an override authorizes the change."""
    expected = {e['tracked_path']: e for e in ctx.import_manifest['files']}
    laundering = []
    # Frozen paths that arrived outside the transport pack are hash-pinned here
    # instead. Such a record may ONLY cover a path the import manifest does not
    # already pin. Allowing it to overwrite an import-manifest entry would let a
    # modified imported file be blessed by appending its new hash — with no
    # original hash, rationale or integration target. That is exactly the
    # baseline-refresh this repository prohibits; an authorized change to an
    # imported path must be a candidate_override.
    for record in ctx.candidate.get('frozen_external_records', []):
        path = record['path']
        if path in expected:
            laundering.append(
                f'{path}: listed in frozen_external_records but already pinned by the import '
                'manifest. An authorized change to an imported path must be a candidate_override '
                'with its original hash, rationale and integration target.')
            continue
        expected[path] = {'sha256': record['sha256'], 'bytes': record['bytes']}
    overrides = {o['path']: o for o in ctx.candidate['candidate_overrides']}
    frozen = ctx.classification.paths_with_integrity(ctx.resolved, 'frozen')

    r = CheckResult('frozen-integrity',
                    'Imported bytes match REPO-IMPORT-MANIFEST.json, or an authorized override',
                    PASS, files_expected=len(expected))
    r.findings.extend(laundering)
    tracked = set(ctx.files)

    for path, entry in expected.items():
        if path not in tracked:
            r.findings.append(f'{path}: recorded in the frozen manifest but no longer tracked')
            continue
        target = ctx.repo / path
        if target.is_symlink() or not target.is_file():
            r.findings.append(f'{path}: missing or not a regular file')
            continue
        actual = ctx.sha(path)
        r.files_examined += 1
        if actual == entry['sha256']:
            continue
        override = overrides.get(path)
        if override is None:
            r.findings.append(f'{path}: bytes differ from the frozen import hash and no override authorizes it')
        elif override.get('original_sha256') != entry['sha256']:
            r.findings.append(f'{path}: override records the wrong original hash')
        elif override.get('resulting_sha256') != actual:
            r.findings.append(f'{path}: override resulting hash does not match the file on disk')

    for path in frozen:
        if path not in expected:
            r.findings.append(f'{path}: classified frozen but hash-pinned by neither the import manifest '
                              'nor frozen_external_records')

    if r.findings:
        r.status = FAIL
    return _coverage(r)


REQUIRED_OVERRIDE_FIELDS = ('path', 'original_sha256', 'resulting_sha256', 'rationale', 'integration_target')
REQUIRED_DEFECT_FIELDS = ('id', 'path', 'sha256', 'tool', 'expected_diagnostic', 'disposition')
REQUIRED_EXTERNAL_FIELDS = ('path', 'sha256', 'bytes', 'origin', 'why_not_in_import_manifest')


def check_candidate_changes(ctx: Context) -> CheckResult:
    """The candidate-change manifest must itself be well formed and current."""
    overrides = ctx.candidate['candidate_overrides']
    defects = ctx.candidate['inherited_defects']
    declared = ctx.candidate['maintained_candidate_paths']
    external = ctx.candidate.get('frozen_external_records', [])
    total = len(overrides) + len(defects) + len(declared) + len(external)

    r = CheckResult('candidate-changes-valid',
                    'Every override, declared candidate path and inherited defect resolves and matches',
                    PASS, files_expected=total, files_examined=total)
    tracked = set(ctx.files)

    for o in overrides:
        missing = [f for f in REQUIRED_OVERRIDE_FIELDS if not o.get(f)]
        if missing:
            r.findings.append(f'override {o.get("path", "<unnamed>")}: missing fields {missing}')
            continue
        if o['path'] not in tracked:
            r.findings.append(f'override {o["path"]}: not tracked')
        elif ctx.sha(o['path']) != o['resulting_sha256']:
            r.findings.append(f'override {o["path"]}: file no longer matches its recorded resulting hash')

    for d in defects:
        missing = [f for f in REQUIRED_DEFECT_FIELDS if not d.get(f)]
        if missing:
            r.findings.append(f'inherited defect {d.get("id", "<unnamed>")}: missing fields {missing}')
            continue
        if d['path'] not in tracked:
            r.findings.append(f'inherited defect {d["id"]}: {d["path"]} is no longer tracked; '
                              'the exception must be removed or re-evidenced')
        elif ctx.sha(d['path']) != d['sha256']:
            r.findings.append(f'inherited defect {d["id"]}: {d["path"]} changed; '
                              'the registered exception no longer describes this file')

    for record in ctx.candidate.get('frozen_external_records', []):
        missing = [f for f in REQUIRED_EXTERNAL_FIELDS if not record.get(f)]
        if missing:
            r.findings.append(f'frozen external record {record.get("path", "<unnamed>")}: '
                              f'missing fields {missing}')
            continue
        if record['path'] not in tracked:
            r.findings.append(f'frozen external record {record["path"]}: not tracked')
        elif ctx.sha(record['path']) != record['sha256']:
            r.findings.append(f'frozen external record {record["path"]}: hash no longer matches')

    for path in declared:
        if path not in tracked:
            r.findings.append(f'declared maintained-candidate path {path}: not tracked')
        else:
            rule = ctx.resolved.get(path)
            if rule is None or rule.scope != 'maintained-candidate':
                got = rule.scope if rule else 'unclassified'
                r.findings.append(f'{path}: declared as maintained candidate but classified {got}')

    if r.findings:
        r.status = FAIL
    return r


def check_excluded_paths(ctx: Context) -> CheckResult:
    forbidden = (
        ('Solaris-Android-R4/evidence/phone604/', 'private phone evidence'),
        ('Solaris-Android-Reconstruction/reference/host-disassembly/', 'full host disassembly'),
        ('reconstruction-inputs/', 'external build inputs'),
        ('reconstruction-work/', 'external build work'),
        ('releases/', 'release binaries'),
    )
    binary_suffixes = ('.apk', '.aab', '.hbc', '.dex', '.so', '.gguf', '.jks', '.keystore',
                       '.p12', '.pfx', '.zip', '.tar', '.tar.gz', '.tar.xz', '.tgz', '.gz',
                       '.xz', '.7z', '.rar', '.jar', '.aar', '.bundle', '.dylib', '.dll')
    r = CheckResult('excluded-path-policy',
                    'Private, binary and build-input material stays untracked',
                    PASS, files_expected=len(ctx.files), files_examined=len(ctx.files))
    for path in ctx.files:
        for prefix, why in forbidden:
            if path.startswith(prefix) or f'/{prefix}' in path:
                r.findings.append(f'{path}: {why} must stay out of this repository')
        if path.endswith(binary_suffixes):
            r.findings.append(f'{path}: excluded binary/archive input is tracked')
        if '/node_modules/' in path or path.startswith('node_modules/'):
            r.findings.append(f'{path}: bundled third-party dependency is tracked')
    if r.findings:
        r.status = FAIL
    return r


def check_gitignore_exceptions(ctx: Context) -> CheckResult:
    """The five build-input descriptors are the only permitted re-inclusions there."""
    allowed = {
        'Solaris-Android-Reconstruction/build-inputs/BUILD-INPUTS.json',
        'Solaris-Android-Reconstruction/build-inputs/TOOL-PROVENANCE.json',
        'Solaris-Android-Reconstruction/build-inputs/packaged-dependencies.json',
        'Solaris-Android-Reconstruction/build-inputs/ui-toolchain/package.json',
        'Solaris-Android-Reconstruction/build-inputs/ui-toolchain/package-lock.json',
    }
    prefix = 'Solaris-Android-Reconstruction/build-inputs/'
    actual = {p for p in ctx.files if p.startswith(prefix)}
    r = CheckResult('build-input-exceptions',
                    'Only the five recorded JSON descriptors are re-included under build-inputs/',
                    PASS, files_expected=len(allowed), files_examined=len(actual))
    for extra in sorted(actual - allowed):
        r.findings.append(f'{extra}: unauthorized re-inclusion under build-inputs/')
    for missing in sorted(allowed - actual):
        r.findings.append(f'{missing}: expected descriptor is not tracked')

    expected_hashes = {e['tracked_path']: e['sha256'] for e in ctx.import_manifest['files']}
    for path in sorted(actual & allowed):
        if path not in expected_hashes:
            r.findings.append(f'{path}: not present in the frozen import manifest')

    # A binary must still be ignored there.
    probe = prefix + 'unauthorized-probe.apk'
    result = subprocess.run(['git', '-C', str(ctx.repo), 'check-ignore', '-q', probe])
    if result.returncode != 0:
        r.findings.append('a binary under build-inputs/ would NOT be ignored; the re-inclusion is too broad')

    if r.findings:
        r.status = FAIL
    return r


# --------------------------------------------------------------------------
# Parsing
# --------------------------------------------------------------------------

def check_json(ctx: Context) -> CheckResult:
    targets = [p for p in ctx.files if p.endswith('.json')
               and ctx.resolved[p].scope != 'repo-config' or
               (p.endswith('.json') and ctx.resolved[p].scope == 'repo-config'
                and not p.startswith('tools/tests/fixtures/'))]
    targets = sorted(set(targets))
    r = CheckResult('json-parse', 'Every tracked .json file parses (JSONC only where the spec allows it)',
                    PASS, files_expected=len(targets))
    for path in targets:
        name = PurePosixPath(path).name
        try:
            jsonc.loads((ctx.repo / path).read_text(encoding='utf-8'), jsonc=name in jsonc.JSONC_NAMES)
            r.files_examined += 1
        except Exception as exc:  # noqa: BLE001
            r.files_examined += 1
            r.findings.append(f'{path}: {exc}')
    if r.findings:
        r.status = FAIL
    return _coverage(r)


def check_yaml(ctx: Context) -> CheckResult:
    targets = sorted(p for p in ctx.files
                     if p.endswith(('.yml', '.yaml')) and not p.startswith('tools/tests/fixtures/'))
    r = CheckResult('yaml-parse', 'Every tracked .yml/.yaml file parses',
                    PASS, files_expected=len(targets))
    try:
        import yaml  # noqa: PLC0415
    except ImportError:
        r.status = FAIL
        r.findings.append(
            'PyYAML is not installed, so YAML was not validated. This is a FAILURE, not a skip: '
            'install the pinned dependencies with `python3 -m pip install -r tools/requirements.txt`.'
        )
        return r
    for path in targets:
        try:
            yaml.safe_load((ctx.repo / path).read_text(encoding='utf-8'))
            r.files_examined += 1
        except Exception as exc:  # noqa: BLE001
            r.files_examined += 1
            r.findings.append(f'{path}: {exc}')
    if r.findings:
        r.status = FAIL
    return _coverage(r)


def check_python_syntax(ctx: Context) -> CheckResult:
    targets = sorted(p for p in ctx.files
                     if p.endswith('.py') and not p.startswith('tools/tests/fixtures/'))
    r = CheckResult('python-syntax', 'Every tracked .py file compiles (syntax only; this is not a lint audit)',
                    PASS, files_expected=len(targets))
    for path in targets:
        try:
            compile((ctx.repo / path).read_text(encoding='utf-8'), path, 'exec')
            r.files_examined += 1
        except SyntaxError as exc:
            r.files_examined += 1
            r.findings.append(f'{path}:{exc.lineno}: {exc.msg}')
    if r.findings:
        r.status = FAIL
    return _coverage(r)


# `node --check some.js` returns 0 for a file containing ESM syntax even when that
# file has a real syntax error, because Node's module-syntax detection stops
# short of a full module parse. Checking the source under an explicit extension
# closes that blind spot. A file is valid if it parses as EITHER a script or a
# module, so we try the likelier mode first and only fall back on failure.
_ESM_MARKER = re.compile(r'^\s*(?:export\s|import\s|import\()', re.MULTILINE)


def _parse_one(source: bytes, tmpdir: Path) -> tuple[bool, str]:
    looks_esm = bool(_ESM_MARKER.search(source.decode('utf-8', 'replace')))
    modes = ['.mjs', '.cjs'] if looks_esm else ['.cjs', '.mjs']
    last = 'parse failed'
    for ext in modes:
        probe = tmpdir / f'probe{ext}'
        probe.write_bytes(source)
        result = subprocess.run(['node', '--check', str(probe)], capture_output=True, text=True)
        if result.returncode == 0:
            return True, ''
        last = next((line.strip() for line in result.stderr.splitlines() if 'Error' in line),
                    'parse failed')
    return False, last


def _node_check(repo: Path, paths: list[str]) -> list[tuple[str, str]]:
    failures = []
    with tempfile.TemporaryDirectory() as tmp:
        tmpdir = Path(tmp)
        for path in paths:
            ok, reason = _parse_one((repo / path).read_bytes(), tmpdir)
            if not ok:
                failures.append((path, reason))
    return failures


JS_SUFFIXES = ('.js', '.cjs', '.mjs')


def check_js_authored(ctx: Context) -> CheckResult:
    targets = [p for p in ctx.scoped('authored-source', 'maintained-candidate', 'repo-tooling')
               if p.endswith(JS_SUFFIXES)]
    r = CheckResult('javascript-syntax-authored',
                    'Authored and maintained-candidate JavaScript parses with node --check',
                    PASS, files_expected=len(targets))
    if targets and shutil.which('node') is None:
        r.status = FAIL
        r.findings.append('node is unavailable, so authored JavaScript was not parsed. This is a FAILURE, not a skip.')
        return r
    for path, reason in _node_check(ctx.repo, targets):
        r.findings.append(f'{path}: {reason}')
    r.files_examined = len(targets)
    if r.findings:
        r.status = FAIL
    return _coverage(r)


def check_js_evidence(ctx: Context) -> CheckResult:
    """Retained evidence: every parse failure must be a registered inherited defect.

    An unregistered failure FAILS the run. The registration is by exact path and
    exact hash, so it cannot quietly cover a directory or a newly broken file.
    """
    targets = [p for p in ctx.scoped('retained-evidence') if p.endswith(JS_SUFFIXES)]
    registered = {d['path']: d for d in ctx.candidate['inherited_defects']}

    r = CheckResult('javascript-parse-evidence',
                    'Retained-evidence JavaScript parses, except defects registered by exact path and hash',
                    PASS, files_expected=len(targets))
    if targets and shutil.which('node') is None:
        r.status = FAIL
        r.findings.append('node is unavailable, so retained-evidence JavaScript was not parsed. This is a FAILURE, not a skip.')
        return r

    failures = dict(_node_check(ctx.repo, targets))
    r.files_examined = len(targets)

    for path, reason in sorted(failures.items()):
        entry = registered.get(path)
        if entry is None:
            r.findings.append(f'{path}: unregistered parse defect ({reason}) — '
                              'register it in CANDIDATE-CHANGES.json or recover the file')
        elif entry['expected_diagnostic'] not in reason:
            r.findings.append(f'{path}: diagnostic changed — expected '
                              f'{entry["expected_diagnostic"]!r}, got {reason!r}')

    for path, entry in registered.items():
        if entry.get('tool') != 'node --check':
            continue
        if path not in targets:
            r.findings.append(f'{entry["id"]}: {path} is no longer a retained-evidence JavaScript file; '
                              'the registered exception is stale')
        elif path not in failures:
            r.findings.append(f'{entry["id"]}: {path} now parses cleanly; '
                              'remove the registered exception rather than leaving it')

    if r.findings:
        r.status = FAIL
    return _coverage(r)


# --------------------------------------------------------------------------
# Documentation and hygiene
# --------------------------------------------------------------------------

LINK_RE = re.compile(r'\[[^\]]*\]\(([^)]+)\)')


def check_doc_links(ctx: Context) -> CheckResult:
    targets = [p for p in ctx.scoped('documentation')
               if p.endswith('.md') and ctx.resolved[p].integrity == 'maintained']
    r = CheckResult('doc-links', "Relative Markdown links in this repository's authored docs resolve",
                    PASS, files_expected=len(targets))
    for path in targets:
        base = (ctx.repo / path).parent
        r.files_examined += 1
        for target in LINK_RE.findall((ctx.repo / path).read_text(encoding='utf-8')):
            target = target.split(' ')[0].strip()
            if target.startswith(('http://', 'https://', 'mailto:', '#')) or not target:
                continue
            if not (base / target.split('#')[0]).resolve().exists():
                r.findings.append(f'{path}: broken relative link -> {target}')
    if r.findings:
        r.status = FAIL
    return _coverage(r)


SECRET_PATTERNS = [
    ('private-key-block', re.compile(rb'-----BEGIN [A-Z ]*PRIVATE KEY-----')),
    ('aws-access-key-id', re.compile(rb'\bAKIA[0-9A-Z]{16}\b')),
    ('github-token', re.compile(rb'\bgh[pousr]_[A-Za-z0-9]{36,}')),
    ('slack-token', re.compile(rb'\bxox[abprs]-[A-Za-z0-9-]{10,}')),
    ('bip39-style-mnemonic-label',
     re.compile(rb'(?i)\b(mnemonic|seed[_ -]?phrase)\s*[:=]\s*["\'][a-z ]{40,}["\']')),
]
SECRET_FILENAMES = re.compile(
    r'(?i)\.(jks|keystore|p12|pfx|pem|key)$|(^|/)(local|key)\.properties$|(^|/)\.env($|\.)')
TEXT_SUFFIXES = {'.md', '.txt', '.json', '.js', '.cjs', '.mjs', '.ts', '.py', '.java', '.c', '.cpp',
                 '.h', '.hpp', '.html', '.css', '.xml', '.sh', '.hasm', '.yaml', '.yml', '.toml',
                 '.config', '.envelope', '.properties', '.gradle', '.kt', '.kts', '.pro', '.cfg',
                 '.ini', '.env', '.conf', '.patch', '.diff', '.lock', '.gitignore', ''}


def check_secret_patterns(ctx: Context) -> CheckResult:
    r = CheckResult('secret-pattern-scan',
                    'Credential-shaped filenames and key material (a pattern sweep, NOT a secret audit)',
                    PASS, files_expected=len(ctx.files))
    for path in ctx.files:
        r.files_examined += 1
        if SECRET_FILENAMES.search(path):
            r.findings.append(f'{path}: credential-shaped filename is tracked')
            continue
        if PurePosixPath(path).suffix.lower() not in TEXT_SUFFIXES:
            continue
        data = ctx.read(path)
        for name, pattern in SECRET_PATTERNS:
            if pattern.search(data):
                r.findings.append(f'{path}: matched {name}')
    if r.findings:
        r.status = FAIL
    return r


# --------------------------------------------------------------------------
# Maintained candidate tests
# --------------------------------------------------------------------------

def check_candidate_tests(ctx: Context) -> CheckResult:
    """Run the candidate regression suite when candidate source exists."""
    candidate_files = ctx.scoped('maintained-candidate')
    runner = ctx.repo / 'candidate/tests/run-all.mjs'
    r = CheckResult('candidate-regression-tests',
                    'Maintained-candidate regression suite passes',
                    PASS, files_expected=len(candidate_files))
    if not candidate_files:
        # Reclassifying candidate source out of scope must not silence this gate.
        # NOT_APPLICABLE is only honest when no candidate source exists at all.
        orphaned = [p for p in ctx.files if p.startswith('candidate/')]
        if orphaned:
            r.status = FAIL
            r.files_expected = len(orphaned)
            r.findings.append(
                f'{len(orphaned)} files are tracked under candidate/ but none is classified '
                'maintained-candidate. Reclassifying candidate source out of scope cannot be '
                'used to skip its tests.')
            return r
        r.status = NOT_APPLICABLE
        r.findings.append('no candidate source is tracked')
        return r
    if not runner.is_file():
        r.status = FAIL
        r.findings.append('maintained-candidate source exists but candidate/tests/run-all.mjs is missing')
        return r
    if shutil.which('node') is None:
        r.status = FAIL
        r.findings.append('node is unavailable, so candidate tests did not run. This is a FAILURE, not a skip.')
        return r
    proc = subprocess.run(['node', str(runner)], capture_output=True, text=True, cwd=str(ctx.repo))
    r.files_examined = len(candidate_files)
    tail = (proc.stdout + proc.stderr).strip().splitlines()
    if proc.returncode != 0:
        r.status = FAIL
        r.findings.extend(line for line in tail if line.strip())
    else:
        r.findings.extend(line for line in tail if line.startswith('summary:'))
    return r


# The registry. Every entry must produce exactly one well-formed result.
CHECK_SPECS = (
    CheckSpec('classification-complete', check_classification, COVERAGE_FULL),
    CheckSpec('frozen-integrity', check_frozen_integrity, COVERAGE_NONZERO),
    CheckSpec('candidate-changes-valid', check_candidate_changes, COVERAGE_NONZERO),
    CheckSpec('excluded-path-policy', check_excluded_paths, COVERAGE_FULL),
    CheckSpec('build-input-exceptions', check_gitignore_exceptions, COVERAGE_FULL),
    CheckSpec('json-parse', check_json, COVERAGE_FULL),
    CheckSpec('yaml-parse', check_yaml, COVERAGE_FULL),
    CheckSpec('python-syntax', check_python_syntax, COVERAGE_FULL),
    CheckSpec('javascript-syntax-authored', check_js_authored, COVERAGE_FULL),
    CheckSpec('javascript-parse-evidence', check_js_evidence, COVERAGE_FULL),
    CheckSpec('doc-links', check_doc_links, COVERAGE_FULL),
    CheckSpec('secret-pattern-scan', check_secret_patterns, COVERAGE_FULL),
    # The only optional scope: with no candidate source tracked at all, there is
    # genuinely nothing to run. check_candidate_tests still fails when candidate
    # files exist but are declassified.
    CheckSpec('candidate-regression-tests', check_candidate_tests, COVERAGE_NONZERO,
              allows_not_applicable=True),
)

# Kept for callers that only need the functions.
ALL_CHECKS = tuple(spec.fn for spec in CHECK_SPECS)


def validate_results(results: list[CheckResult], specs=CHECK_SPECS) -> list[str]:
    """Central invariants. Returns a list of violations; empty means valid.

    This is deliberately outside the individual checks. A check cannot be
    trusted to police itself: the defect this exists to stop is exactly a check
    that reports a non-failing status without having inspected anything.
    """
    violations: list[str] = []
    by_name: dict[str, list[CheckResult]] = {}
    for result in results:
        by_name.setdefault(result.name, []).append(result)

    registered = {spec.name: spec for spec in specs}

    for name in registered:
        found = by_name.get(name, [])
        if not found:
            violations.append(f'{name}: registered check produced no result')
        elif len(found) > 1:
            violations.append(f'{name}: produced {len(found)} results; exactly one is required')

    for name, found in by_name.items():
        if name not in registered:
            violations.append(f'{name}: unregistered check result')
            continue
        spec = registered[name]
        for result in found:
            if result.status not in VALID_STATUSES:
                violations.append(f'{name}: invalid status {result.status!r}')
                continue
            expected, examined = result.files_expected, result.files_examined
            if not isinstance(expected, int) or not isinstance(examined, int) \
                    or expected < 0 or examined < 0:
                violations.append(f'{name}: malformed counts '
                                  f'(expected={expected!r}, examined={examined!r})')
                continue
            if examined > expected:
                violations.append(f'{name}: examined {examined} files but only '
                                  f'{expected} were in scope')
            if result.status == NOT_APPLICABLE:
                if not spec.allows_not_applicable:
                    violations.append(f'{name}: reported NOT_APPLICABLE, which this check '
                                      'may never do')
                elif expected > 0:
                    violations.append(f'{name}: reported NOT_APPLICABLE with {expected} files '
                                      'in scope; an empty scope is the only legitimate case')
            elif result.status == PASS and expected > 0:
                if examined == 0:
                    violations.append(f'{name}: passed with {expected} files in scope but '
                                      'inspected none')
                elif spec.coverage == COVERAGE_FULL and examined != expected:
                    violations.append(f'{name}: passed having inspected {examined} of '
                                      f'{expected} in-scope files')
    return violations

BLOCKED_GATES = [
    ('full-reference-604-reproduction',
     'Needs the four restored Solaris-Android-604-Handoff-Part-N-of-4.zip backups and the reassembled '
     '1,518,762,347-byte reference. Run it there, never here.'),
    ('frozen-import-pack-verification',
     'docs/provenance/import-pack/verify-import.py applies to the unchanged extracted transport pack only. '
     'This repository intentionally differs from it; frozen-integrity is its equivalent here.'),
    ('hbc-reconstruction-and-packaging',
     'Needs the reference APKs and the pinned host compiler/parser/packaging tools from the build-input '
     'archives, which are excluded from this projection.'),
    ('native-android-gradle-build',
     'No complete original native application/build project exists. The source itself is missing; do not '
     'fabricate scaffolding.'),
    ('on-device-acceptance-and-latency',
     'Needs a target phone, an installed build and explicit authorization. No APK is built, signed or '
     'installed by this repository.'),
    ('local-model-inference-checks',
     'The Qwen3-0.6B Q4 phone model and the probe model weight are excluded binaries.'),
    ('dependency-cve-and-license-audit',
     'Needs a complete locked dependency graph, which the missing native build graph does not yet provide.'),
    ('maintained-source-lint',
     'No pinned lint toolchain is vendored yet. python-syntax and javascript-syntax-authored are syntax '
     'checks, not lint. Configuring a pinned linter is task AND-01.'),
]


def runtime_versions() -> dict:
    """Record the runtime the checks actually ran on, not the one requested.

    SP-CI-01: the workflow selected Node 22 / Python 3.12 while the remote runner
    resolved 22.23.2 / 3.12.14 and a local run used 22.22.2. Selectors are not
    evidence of what executed, so the executed versions are captured here.
    """
    node = None
    if shutil.which('node'):
        node = subprocess.run(['node', '--version'], capture_output=True, text=True).stdout.strip()
    return {
        'python': platform.python_version(),
        'python_implementation': platform.python_implementation(),
        'node': node,
        'platform': platform.platform(),
    }


def run_all(repo: Path, files: list[str], specs=CHECK_SPECS) -> dict:
    ctx = Context(repo, files)
    results: list[CheckResult] = []
    for spec in specs:
        try:
            result = spec.fn(ctx)
        except Exception as exc:  # noqa: BLE001 - an unexpected error is a failure, never a pass
            result = CheckResult(spec.name, 'check raised an unexpected exception', FAIL,
                                 [f'{type(exc).__name__}: {exc}'])
        # A check may not rename itself out from under its registration.
        if result.name != spec.name:
            result.findings.append(
                f'result name {result.name!r} does not match registered name {spec.name!r}')
            result.name = spec.name
            result.status = FAIL
        results.append(result)

    # Central invariants, enforced here rather than inside the checks. A check
    # cannot be trusted to police itself.
    violations = validate_results(results, specs)

    # Only PASS and a legitimately empty NOT_APPLICABLE count as success. Any
    # other status — including one added later — is a failure by default.
    failed = [r for r in results if r.status not in (PASS, NOT_APPLICABLE)]
    return {
        'scope': 'source-only-repository-projection',
        'runtime': runtime_versions(),
        'result_invariant_violations': violations,
        'not_established': [
            'native Android build completeness or reproducibility',
            'application security or licensing clearance',
            'on-device behaviour, latency or release readiness',
        ],
        'tracked_files': len(files),
        'checks': [r.as_dict() for r in results],
        'blocked': [{'check': n, 'reason': why} for n, why in BLOCKED_GATES],
        'status': FAIL if (failed or violations) else PASS,
        'failed_checks': [r.name for r in failed],
    }
