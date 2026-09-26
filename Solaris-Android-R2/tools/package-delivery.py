#!/usr/bin/env python3
"""Archive the editable reconstruction and retained build inputs without keys.
Requires completed reviews/build report; never modifies an APK or signs.
"""
from pathlib import Path
import hashlib
import json
import zipfile

workspace=Path(__file__).resolve().parents[2]
r2=workspace/'Solaris-Android-R2'
delivery=workspace/'deliverables'
delivery.mkdir(exist_ok=True)
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()

def allowed(path):
    return path.is_file() and '__pycache__' not in path.parts and path.suffix not in {'.pyc','.keystore','.jks','.p12','.pfx'}

sources=[]
for name in ['Solaris-Android-Reconstruction','Solaris-Android-R2']:
    for p in (workspace/name).rglob('*'):
        if allowed(p) and p.suffix!='.apk' and p.name!='candidate-unsigned.zip':
            sources.append(p)

inputs={p for p in (workspace/'reconstruction-inputs').rglob('*') if allowed(p)}
for manifest in ['retained-tool-archives.json','verified-tool-binaries.json']:
    for row in json.loads((r2/'evidence/integration-feasibility'/manifest).read_text()):
        p=workspace/row['path']
        if sha(p)!=row['sha256']:raise SystemExit('Input hash mismatch: '+str(p))
        inputs.add(p)
tools=workspace/'reconstruction-work/r2-tools'
for name in ['babel-standalone-7.28.5/package/babel.js','babel-standalone-7.28.5/package/LICENSE']:
    inputs.add(tools/name)
parser=workspace/'reconstruction-work/toolchain/hermes-dec-a0f18f97ab661eb8ed659c8c683a0d21ea619e69'
inputs.update(p for p in parser.rglob('*') if allowed(p) and not any(x in p.parts for x in ['.git','.github']))
android=workspace/'reconstruction-work/toolchain/android-tools'
for name in ['aapt2','zipalign','lib/apksigner.jar','lib64/libc++.so','NOTICE.txt']:
    p=android/name
    if p.exists():inputs.add(p)
# The existing public signer fixture is intentionally not archived. Its pinned
# acquisition and offline verification source are in the editable source set.

def archive(name,files):
    files=sorted(set(files))
    index=[{'path':str(p.relative_to(workspace)),'bytes':p.stat().st_size,'sha256':sha(p)} for p in files]
    out=delivery/name
    if out.exists():raise SystemExit('Refusing to overwrite deliverable: '+str(out))
    with zipfile.ZipFile(out,'x',compression=zipfile.ZIP_DEFLATED,compresslevel=6,allowZip64=True) as z:
        for p in files:z.write(p,str(p.relative_to(workspace)))
        z.writestr('DELIVERY-CONTENTS.json',json.dumps(index,indent=2)+'\n')
    # Verify every member against its recorded uncompressed hash, not just CRC.
    with zipfile.ZipFile(out) as z:
        for row in index:
            if hashlib.sha256(z.read(row['path'])).hexdigest()!=row['sha256']:
                raise SystemExit('Archive verification failed: '+row['path'])
    return {'name':name,'path':str(out),'bytes':out.stat().st_size,'sha256':sha(out),'members':len(index)}

results=[archive('Solaris-602-Editable-Reconstruction.zip',sources),archive('Solaris-602-Build-Inputs.zip',inputs)]
(delivery/'Solaris-602-ARCHIVE-VERIFICATION.json').write_text(json.dumps(results,indent=2)+'\n')
print(json.dumps(results,indent=2))
