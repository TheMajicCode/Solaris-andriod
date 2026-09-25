#!/usr/bin/env python3
"""Run a maintained observational probe against an actual host bundle.

The probe is the hash-verified helper prefix of the FROZEN
Solaris-Android-R4/grounding/actual-tests.js (lines 1-63, which build the
synthetic native/storage/model seams around the real DailyService), followed by
a maintained case file. The frozen harness is read, never edited.

Everything that writes runs inside a DISPOSABLE copy of this repository that
also holds the private reconstruction-work/r2-tools inputs, because the frozen
transpiler and runner resolve those relative to the tree they live in. Nothing
is written to the tracked tree. Without the private inputs this is BLOCKED, and
it exits non-zero rather than reporting a pass.

A candidate bundle (not one of the two pinned hosts) is accepted only when its
hash is the one recorded in tools/host/_guard.py for the donor currently in this
checkout. A hand-written result record is not enough (review of b2a6ba8, S2R-8).
The disposable root and the output directory must not be inside any git work
tree, and the frozen transpiler, runner and harness in the disposable copy must
match their import hashes. With --expect, each case's observed fields are
compared with the expected outcomes for the named bundle label, and any mismatch
fails the run.

Usage:
  run-host-probe.py --disposable-root <copy> --bundle <hbc> --out <new-dir>
                    [--cases <file>] [--expect <json> --label <name>]
"""
import argparse, hashlib, json, shutil, subprocess, sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
REPO = HERE.parents[1]
sys.path.insert(0, str(HERE))
from _guard import candidate_identity, refuse_git_worktree, verify_frozen  # noqa: E402
HARNESS = 'Solaris-Android-R4/grounding/actual-tests.js'
PREFIX_LINES = 63
PREFIX_SHA256 = '839496d353ef7ff55cda420339770a0c7d7f4c812559fc2c23dc9086e24ad639'
KNOWN_BUNDLES = {
    'b8ac7d1b58d9e8ea6eadd25de516e35842aea14e4b849462664bb3200fedc990': '603 base host bundle',
    '30be9989cc00299836715cc3de5cf3a2a75b00019bdf2f1b91629205f558d8b3': '604 host bundle (byte-identical reproduction)',
}

def sha(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()

def main() -> int:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument('--disposable-root', type=Path, required=True)
    p.add_argument('--bundle', type=Path, required=True)
    p.add_argument('--out', type=Path, required=True)
    p.add_argument('--cases', type=Path, default=HERE / 'probes/envelope-and-input-cases.js')
    p.add_argument('--expect', type=Path)
    p.add_argument('--label')
    a = p.parse_args()
    if bool(a.expect) != bool(a.label):
        sys.exit('--expect and --label go together')

    root = a.disposable_root.resolve()
    refuse_git_worktree(root, 'disposable root')
    refuse_git_worktree(a.out.resolve().parent, 'output directory')
    tools = root / 'reconstruction-work/r2-tools'
    if not tools.is_dir():
        sys.exit(f'BLOCKED: {tools} is missing (private inputs are not in this projection)')
    bundle = a.bundle.read_bytes()
    identity = KNOWN_BUNDLES.get(sha(bundle)) or candidate_identity(sha(bundle))
    if identity is None:
        sys.exit(f'refusing an unpinned bundle: {sha(bundle)}')
    verify_frozen(root, ('Solaris-Android-R2/evidence/integration-feasibility/',
                         'Solaris-Android-R2/tests/hermes/', 'Solaris-Android-R4/grounding/'))

    harness = (REPO / HARNESS).read_text(encoding='utf-8').splitlines(keepends=True)
    prefix = ''.join(harness[:PREFIX_LINES])
    if sha(prefix.encode()) != PREFIX_SHA256:
        sys.exit('frozen harness prefix changed; the probe no longer wraps the reviewed seams')

    a.out.mkdir(parents=True, exist_ok=False)
    probe = a.out / 'probe.js'
    # The case file is one standalone function expression (so the syntax gate can
    # parse it); the invocation and the harness's closing brace are added here.
    probe.write_text(prefix + a.cases.read_text(encoding='utf-8')
                     + "  ().catch(function(e){ print('HARNESS_ERROR ' + String(e.stack || e)); });\n})();\n",
                     encoding='utf-8')
    compiled = a.out / 'probe.compiled.js'
    subprocess.run(['node', str(root / 'Solaris-Android-R2/evidence/integration-feasibility/transpile-hermes-fixture.cjs'),
                    str(probe), str(compiled)], cwd=root, check=True, capture_output=True, text=True)
    run = subprocess.run(['python3', str(root / 'Solaris-Android-R2/evidence/integration-feasibility/run-hermes-reference.py'),
                          '--tools', str(tools), str(root / 'Solaris-Android-R2/tests/hermes/capture-prelude.js'),
                          str(a.bundle.resolve()), str(compiled)],
                         cwd=root, capture_output=True, text=True, timeout=120)
    (a.out / 'stdout.txt').write_text(run.stdout)
    (a.out / 'stderr.txt').write_text(run.stderr)
    result = json.loads(run.stdout)
    record = {
        'scope': 'observational probe of the actual host bundle in desktop Hermes with synthetic seams; not a device, not an APK',
        'bundle': identity, 'bundleSha256': sha(bundle),
        'harnessPrefixSha256': PREFIX_SHA256, 'casesSha256': sha(a.cases.read_bytes()),
        'compiledSha256': sha(compiled.read_bytes()), 'runnerExit': run.returncode,
        'result': result,
    }
    (a.out / 'PROBE-RESULT.json').write_text(json.dumps(record, indent=2, ensure_ascii=False) + '\n')
    print(json.dumps({k: record[k] for k in ('bundle', 'bundleSha256', 'runnerExit')} |
                     {'cases': [(c['name'], c.get('details') or c.get('error')) for c in result['cases']]},
                     ensure_ascii=False, indent=1))
    ok = run.returncode == 0 and result.get('harnessErrors') == 0
    if a.expect:
        expected = json.loads(a.expect.read_text())[a.label]
        observed = {c['name']: (c.get('details') or {}) for c in result['cases']}
        mismatches = [f'{name}: {field} expected {want!r}, observed {observed.get(name, {}).get(field)!r}'
                      for name, fields in expected.items() for field, want in fields.items()
                      if observed.get(name, {}).get(field) != want]
        missing = sorted(set(expected) - set(observed))
        record['expectations'] = {'label': a.label, 'checked': sum(len(v) for v in expected.values()),
                                  'mismatches': mismatches, 'missingCases': missing}
        (a.out / 'PROBE-RESULT.json').write_text(json.dumps(record, indent=2, ensure_ascii=False) + '\n')
        print(json.dumps(record['expectations'], indent=1, ensure_ascii=False))
        ok = ok and not mismatches and not missing
    return 0 if ok else 1

if __name__ == '__main__':
    raise SystemExit(main())
