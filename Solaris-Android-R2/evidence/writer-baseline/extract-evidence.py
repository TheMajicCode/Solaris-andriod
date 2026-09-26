#!/usr/bin/env python3
"""Recreate raw evidence excerpts and source map. Never modifies APK/HBC input."""
import hashlib
import json
import pathlib
import re

OUTPUT = pathlib.Path(__file__).resolve().parent
ROOT = OUTPUT.parents[1]
CHECKPOINT = ROOT.parent / 'Solaris-Android-Reconstruction'
INPUT = CHECKPOINT / 'reference/host-disassembly/index.android.hasm'
SOURCE = ROOT / 'src/host-baseline/qvac-service-baseline.mjs'

mapping = {
    'constructor': [7146, 7147], 'context': [7148], 'snapshot': [7149],
    'preparation': [7150], 'changed': [7151], 'publishProgress': [7152],
    'guard': [7167], 'check': [7168],
    'cancelOperation': [7169, 7170, 7171, 7172, 7173, 7174],
    'settleAfterFailure': [7175, 7176, 7177, 7178, 7179, 7180],
    'run': [7181, 7182, 7183, 7184],
    'step': [7185, 7186, 7187, 7188, 7189, 7190],
    'ensureWorker': [7191, 7192, 7193, 7194, 7195, 7196],
    'cancelRequest': [7291, 7292, 7293, 7294],
    'lifecycle': [7368, 7369, 7370, 7371, 7372, 7373, 7374],
}
text = INPUT.read_text()
chunks = re.split(r'(?=^=> \[Function #)', text, flags=re.M)
functions = {}
for chunk in chunks:
    match = re.match(r'=> \[Function #(\d+) "([^"]*)" of (\d+) bytes\].*@ offset (0x[0-9a-f]+)', chunk)
    if not match:
        continue
    identifier = int(match[1])
    if identifier == 0:
        lines = chunk.splitlines()
        pos = next(i for i, line in enumerate(lines) if 'function_id: 7139>' in line)
        (OUTPUT / 'module-591-registration.hasm').write_text('\n'.join(lines[pos-1:pos+5]) + '\n')
    if not (7139 <= identifier <= 7380 or identifier in (14894, 14897, 14901, 14902)):
        continue
    out = OUTPUT / f'function-{identifier}.hasm'
    out.write_text(chunk)
    functions[identifier] = {
        'id': identifier, 'name': match[2], 'byteLength': int(match[3]),
        'offset': match[4], 'excerpt': out.name,
        'excerptSha256': hashlib.sha256(chunk.encode()).hexdigest(),
    }
result = {
    'scope': 'partial semantic reconstruction of existing coordinator; no repair',
    'input': str(INPUT.relative_to(ROOT.parent)),
    'inputSha256': hashlib.sha256(INPUT.read_bytes()).hexdigest(),
    'source': str(SOURCE.relative_to(ROOT)),
    'sourceSha256': hashlib.sha256(SOURCE.read_bytes()).hexdigest(),
    'moduleId': 591,
    'moduleDependencyVector': [38,67,8,9,592,593,599,602,603,604,912,913,914,916,716,918],
    'members': {name: [functions[i] for i in ids] for name, ids in mapping.items()},
    'supplementalAuthorityEvidence': [functions[i] for i in (14894, 14897, 14901, 14902)],
    'verification': 'HASM-extracted mapping; syntax check only is not semantic proof',
}
(OUTPUT / 'source-map.json').write_text(json.dumps(result, indent=2) + '\n')
print(json.dumps({'members': len(mapping), 'functions': len(functions), 'sourceSha256': result['sourceSha256']}))
