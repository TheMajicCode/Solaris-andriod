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
import os
import shutil
import sys
from pathlib import Path

# No new bytecode caches next to the frozen modules these tools import (S2R4-2).
sys.dont_write_bytecode = True

REPO = Path(__file__).resolve().parents[2]
MANIFEST = REPO / 'docs/provenance/REPO-IMPORT-MANIFEST.json'

# donor SHA-256 -> candidate host bundle SHA-256, as built by
# build-donor-candidate.py and proven in docs/HOST-REPRODUCTION-EVIDENCE.md.
# Update only together with that evidence and CANDIDATE-CHANGES.json.
KNOWN_CANDIDATE_BUILDS = {
    '6ae8f2ceb931350e9f32bc5b5b05ecb5a1badadc3d0b0f7dfeb2e79fc404cc09':
        'd0e36d6e5cb47c191c45320231201984a86d48e294e3897e819572dd03db09db',
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


def verify_frozen(root: Path, prefixes: tuple[str, ...], import_dirs: tuple[str, ...] = ()) -> int:
    """import_dirs: directories the caller prepends to sys.path. Any .py file there
    that the manifest does not pin is refused, so a planted module cannot shadow a
    frozen one (re-review of 76b24f6, S2R2-2)."""
    manifest = json.loads(MANIFEST.read_text())['files']
    entries = [e for e in manifest if e['tracked_path'].startswith(prefixes)]
    pinned = {e['tracked_path'] for e in manifest}
    # Follow-up reviews of 9a3bf89 and e377669 (S2R3-1, S2R4-1, S2R4-2): a planted
    # package, a sourceless .pyc, an extension module or a symlinked directory
    # shadows a module as well as a planted .py file does. A forged __pycache__
    # entry does too, because Python checks a cache only against the source's
    # mtime and size, not its content. So under an import directory: no symlink
    # at all, every importable file pinned, and existing caches are discarded.
    # The tools also disable bytecode writing, so no new cache appears.
    importable = ('.py', '.pyc', '.so', '.pyd')
    planted = []
    for d in import_dirs:
        for dirpath, dirnames, filenames in os.walk(root / d, followlinks=False):
            here = Path(dirpath)
            if '__pycache__' in dirnames:
                shutil.rmtree(here / '__pycache__')
                dirnames.remove('__pycache__')
            for name in dirnames + filenames:
                p = here / name
                rel = str(p.relative_to(root))
                if p.is_symlink():
                    planted.append(rel + ' (symlink)')
                elif name in filenames and p.suffix in importable and rel not in pinned:
                    planted.append(rel)
    planted.sort()
    if planted:
        sys.exit('refusing: unpinned Python modules on the import path:\n  ' + '\n  '.join(planted[:20]))
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
