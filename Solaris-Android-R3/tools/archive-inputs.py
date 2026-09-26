#!/usr/bin/env python3
"""Preserve pinned offline build/test inputs; excludes signing credentials."""
import argparse,copy,hashlib,json,os,shutil,zipfile
from pathlib import Path

def sha(path):
    with path.open('rb') as f:return hashlib.file_digest(f,'sha256').hexdigest()

def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('--previous-inputs',type=Path,required=True)
    p.add_argument('--baseline602',type=Path,required=True)
    p.add_argument('--native-probe',type=Path,required=True)
    p.add_argument('--output',type=Path,required=True)
    a=p.parse_args()
    assert sha(a.previous_inputs)=='41f784798e40d7901172e60386aa8ad5fcbce0c8c202a5ff14aec14f90fc70ab'
    assert sha(a.baseline602)=='01da9f5281f5f92230dcbd64da62484557cc7a0a15e876cc2d99ec7ec3bcd2cd'
    a.output.mkdir(parents=True,exist_ok=True)
    records=[]
    inputs=a.output/'Solaris-603-Build-Inputs.zip'
    with zipfile.ZipFile(inputs,'x',compression=zipfile.ZIP_DEFLATED,compresslevel=6,allowZip64=True) as out:
        with zipfile.ZipFile(a.previous_inputs) as old:
            assert old.testzip() is None
            for info in old.infolist():out.writestr(copy.copy(info),old.read(info))
        out.write(a.baseline602,'reconstruction-inputs/baseline-602/'+a.baseline602.name)
        # Exact extracted Linux runtime/addon bytes used by the native fixture.
        # SDK and JavaScript dependencies are in the editable evidence archive.
        for relative in ['runtime','reference-worker/node_modules/@qvac/llm-llamacpp/prebuilds/linux-x64']:
            for path in sorted((a.native_probe/relative).rglob('*')):
                if path.is_file() and not any(x.startswith('.') for x in path.relative_to(a.native_probe).parts):
                    name='solaris-603-native-probe/'+str(path.relative_to(a.native_probe))
                    out.write(path,name)
                    records.append(dict(path=name,bytes=path.stat().st_size,sha256=sha(path)))
        out.writestr('reconstruction-inputs/603-OFFLINE-NATIVE-INPUTS.json',json.dumps(records,indent=2)+'\n')
    model=a.native_probe/'acquired/Qwen3-0.6B-Q4_0.gguf'
    assert sha(model)=='33bcc57074ec7b6eada5a90651ee546ec0c2b271002c22baf9f1b2dd1e8f75cb'
    modelzip=a.output/'Solaris-603-Model-Test-Input.zip'
    with zipfile.ZipFile(modelzip,'x',compression=zipfile.ZIP_DEFLATED,compresslevel=6) as out:
        out.write(model,'solaris-603-native-probe/acquired/'+model.name)
        out.writestr('README.txt','Exact existing model retained for offline test reproduction. This is not a model upgrade and is not required to update the APK. SHA-256: '+sha(model)+'\n')
    result=[]
    for path in [inputs,modelzip]:
        with zipfile.ZipFile(path) as z:assert z.testzip() is None
        result.append(dict(path=str(path),bytes=path.stat().st_size,sha256=sha(path)))
    (a.output/'INPUT-ARCHIVES.json').write_text(json.dumps(result,indent=2)+'\n')
    print(json.dumps(result,indent=2))

if __name__=='__main__':main()
