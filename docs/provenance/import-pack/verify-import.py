#!/usr/bin/env python3
"""Read-only verification of this frozen source import, not a build/test gate."""
import hashlib
import json
import os
from pathlib import Path, PurePosixPath


def main():
    root = Path(__file__).resolve().parent
    manifest = json.loads((root / 'IMPORT-INVENTORY.json').read_text())
    seen = set()
    failures = []
    for entry in manifest['files']:
        name = entry['path']
        relative = PurePosixPath(name)
        if relative.is_absolute() or '..' in relative.parts or name in seen:
            raise ValueError('Unsafe or duplicate inventory path')
        seen.add(name)
        target = root.joinpath(*relative.parts)
        if any(p.is_symlink() for p in [target, *target.parents] if p != root.parent):
            failures.append(name + ': symlink')
            continue
        if not target.is_file():
            failures.append(name + ': missing')
            continue
        data = target.read_bytes()
        if len(data) != entry['bytes'] or hashlib.sha256(data).hexdigest() != entry['sha256']:
            failures.append(name + ': bytes differ')
        if os.name == 'posix' and entry['executable'] and not os.access(target, os.X_OK):
            failures.append(name + ': executable mode missing')
    actual = {p.relative_to(root).as_posix() for p in root.rglob('*') if p.is_file() or p.is_symlink()}
    extras = sorted(actual - seen - {'IMPORT-INVENTORY.json'})
    failures += [name + ': unexpected file' for name in extras]
    print(json.dumps({'scope': 'frozen-source-import-only', 'files_checked': len(seen),
                      'status': 'FAIL' if failures else 'PASS', 'failures': failures}, indent=2))
    return 1 if failures else 0


if __name__ == '__main__':
    raise SystemExit(main())
