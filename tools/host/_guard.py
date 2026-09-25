"""Shared guards for the host tools (independent review of b2a6ba8, S2R-8).

These tools run frozen builders and runners that write next to themselves, so
they must only ever run in a DISPOSABLE copy. They must also run the frozen code
that was reviewed, not whatever happens to sit in that copy.

  * refuse_git_worktree: any directory inside a git work tree is refused. That
    covers this checkout, any sibling clone, and the per-agent worktrees under
    .claude/worktrees/ — not only the checkout the tool itself lives in.
  * verify_frozen: every file the import manifest pins under the given prefixes
    must be present in the disposable copy with exactly its import hash. A
    tampered hbc_inline.py, transpiler or runner is refused before it runs.
  * candidate_identity: a candidate bundle is accepted only when its donor and
    bundle hashes are a pair recorded in KNOWN_CANDIDATE_BUILDS, and the donor
    file in this checkout still has that hash. A hand-written result record is
    not enough.

What these guards do NOT cover: the private toolchain under reconstruction-work/
(hermes-dec, the Hermes runner and libraries) is not in the import manifest.
It is pinned by the private kit's own SHA256SUMS, which the operator verifies
when restoring it.
"""
import hashlib
import json
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
MANIFEST = REPO / 'docs/provenance/REPO-IMPORT-MANIFEST.json'

# donor SHA-256 -> candidate host bundle SHA-256, as built by
# build-donor-candidate.py and proven in docs/HOST-REPRODUCTION-EVIDENCE.md.
# Update only together with that evidence and CANDIDATE-CHANGES.json.
KNOWN_CANDIDATE_BUILDS = {
    'ab7067e6cf433e9a19e16a8df68fc439e42f9765d013e5c2de2cca078f89f667':
        '105ade31744618ab37460b3b42fe4a46bafb221f91690a1f05ff6635695b279f',
}
DONOR_PATH = 'candidate/a605/host-donor/fast-guided.js'


def sha(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def refuse_git_worktree(path: Path, what: str) -> None:
    path = path.resolve()
    for candidate in (path, *path.parents):
        if (candidate / '.git').exists():
            sys.exit(f'refusing: {what} {path} is inside a git work tree ({candidate}); '
                     'use a disposable copy outside any repository')


def verify_frozen(root: Path, prefixes: tuple[str, ...]) -> int:
    entries = [e for e in json.loads(MANIFEST.read_text())['files']
               if e['tracked_path'].startswith(prefixes)]
    if not entries:
        sys.exit(f'no frozen files pinned under {prefixes}; refusing to run unverified code')
    bad = []
    for entry in entries:
        target = root / entry['tracked_path']
        if not target.is_file():
            bad.append(f"{entry['tracked_path']}: missing")
        elif sha(target.read_bytes()) != entry['sha256']:
            bad.append(f"{entry['tracked_path']}: differs from its import hash")
    if bad:
        sys.exit('refusing: the disposable copy does not hold the reviewed frozen code:\n  '
                 + '\n  '.join(bad[:20]))
    return len(entries)


def candidate_identity(bundle_sha: str):
    donor_sha = sha((REPO / DONOR_PATH).read_bytes())
    if KNOWN_CANDIDATE_BUILDS.get(donor_sha) == bundle_sha:
        return f'candidate bundle from donor {DONOR_PATH} ({donor_sha[:16]})'
    return None
