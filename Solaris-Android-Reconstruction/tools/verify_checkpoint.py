#!/usr/bin/env python3
"""Verify delivered checkpoint bytes; this is not an Android release gate."""
import hashlib
import json
from pathlib import Path
import sys

root=Path(__file__).resolve().parents[1]
manifest=json.loads((root/'CHECKPOINT-MANIFEST.json').read_text())
failures=[]
for row in manifest['files']:
    path=root/row['path']
    if not path.is_file() or path.is_symlink():
        failures.append(row['path'])
        continue
    if path.stat().st_size!=row['bytes'] or hashlib.file_digest(path.open('rb'),'sha256').hexdigest()!=row['sha256']:
        failures.append(row['path'])
print(json.dumps({'checked':len(manifest['files']),'failures':failures,'androidCompatibilityVerified':False},indent=2))
sys.exit(1 if failures else 0)
