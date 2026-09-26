#!/usr/bin/env python3
"""Durable604 source checkpoint and input increment; no signing secrets.

Merge all previous603 editable source with the final604 source and evidence.
The unchanged603 tool/model input archives are referenced by exact hashes.
"""
import argparse, copy, hashlib, json, zipfile
from pathlib import Path

def sha(p):
    with p.open('rb') as f:return hashlib.file_digest(f,'sha256').hexdigest()

def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('--previous-editable',type=Path,required=True)
    p.add_argument('--r4',type=Path,required=True)
    p.add_argument('--baseline603',type=Path,required=True)
    p.add_argument('--output',type=Path,required=True)
    a=p.parse_args()
    assert sha(a.previous_editable)=='cfd440154530c4e6a4c832ed525122d57694d26e39e7d59cb9c6eb582a7bb0d5'
    assert sha(a.baseline603)=='25d3642ab5f45986e5dfcfe5c5413d40982c6142eb703adffc391f9d3b033227'
    a.output.mkdir(parents=True,exist_ok=True)
    source=a.output/'Solaris-604-Editable-Reconstruction.zip'
    inventory=[];names=set()
    with zipfile.ZipFile(source,'x',compression=zipfile.ZIP_DEFLATED,compresslevel=6,allowZip64=True) as out:
        def add(name,data,info=None):
            assert name not in names and not name.startswith('/') and '..' not in Path(name).parts,name
            names.add(name);out.writestr(info or name,data)
            inventory.append(dict(path=name,bytes=len(data),sha256=hashlib.sha256(data).hexdigest()))
        with zipfile.ZipFile(a.previous_editable) as old:
            for info in old.infolist():add(info.filename,old.read(info),copy.copy(info))
        for f in sorted(a.r4.rglob('*')):
            rel=f.relative_to(a.r4)
            if not f.is_file():continue
            if any(x.startswith('.') or x in {'__pycache__','node_modules','compiled'} for x in rel.parts):continue
            if any(x.startswith('run-') for x in rel.parts[:-1]):continue
            if f.suffix.lower() in {'.apk','.zip','.pyc','.tmp','.keystore','.jks'}:continue
            if any(x.startswith('candidate-') for x in rel.parts):continue
            if f.name in {'base.hbc','baseline603.hbc','expo-sdk54-template-build.gradle',
                          'bridge-fixture.hbc','bridge-fixture-debug.hbc','candidate-grounding.hbc','core'}:continue
            add('Solaris-Android-R4/'+str(rel),f.read_bytes())
        out.writestr('Solaris-604-EDITABLE-ARCHIVE-MANIFEST.json',json.dumps(inventory,indent=2)+'\n')
    inputs=a.output/'Solaris-604-Build-Inputs.zip'
    requirements={
      'Solaris-603-Build-Inputs.zip':'0745458668eb3ff149fa881b647095a74865b97fba84f39fc88297becb49019d',
      'Solaris-603-Model-Test-Input.zip':'d6a1d5640ce37e9aa2ff2aee56d1f78534ebd6b93e80dc6fe262c851a122f9da'}
    with zipfile.ZipFile(inputs,'x',compression=zipfile.ZIP_DEFLATED,compresslevel=6) as out:
        out.write(a.baseline603,'reconstruction-inputs/baseline-603/'+a.baseline603.name)
        out.writestr('reconstruction-inputs/604-INPUT-REQUIREMENTS.json',json.dumps(requirements,indent=2)+'\n')
        out.writestr('README-604-INPUTS.txt',
          'This archive adds the exact signed603 baseline. Extract beside the604 editable reconstruction and the previously saved Solaris-603-Build-Inputs.zip. All compiler, Android packaging tools and native runtime inputs remain unchanged. The model test archive is needed only to rerun model experiments, not to build the APK. Exact prerequisite hashes are in reconstruction-inputs/604-INPUT-REQUIREMENTS.json. Raw signing credentials are excluded.\n')
    result=[]
    for f in [source,inputs]:
        with zipfile.ZipFile(f) as z:assert z.testzip() is None
        result.append(dict(path=str(f),bytes=f.stat().st_size,sha256=sha(f)))
    print(json.dumps(result,indent=2))

if __name__=='__main__':main()
