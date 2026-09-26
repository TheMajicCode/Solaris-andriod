from pathlib import Path
import hashlib
import json

root=Path(__file__).resolve().parents[1]
manifest=json.loads((root/'CHECKPOINT-MANIFEST.json').read_text())
for entry in manifest['files']:
    path=(root/entry['path']).resolve()
    if root not in path.parents or not path.is_file():
        raise SystemExit('Missing or unsafe path: '+entry['path'])
    data=path.read_bytes()
    if len(data)!=entry['bytes'] or hashlib.sha256(data).hexdigest()!=entry['sha256']:
        raise SystemExit('Content mismatch: '+entry['path'])
print(json.dumps({'status':'passed','verifiedFiles':len(manifest['files']),
                  'scope':'Content against manifest only; not an APK signature or device test'}))
