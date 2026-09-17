#!/usr/bin/env python3
"""Preserve the602 editable checkpoint plus complete new603 source/evidence.
Binary APK delivery and offline model/runtime inputs are separate artifacts.
No signing inputs or unrelated workspace files are read by this archiver.
"""
import argparse,copy,hashlib,json,zipfile
from pathlib import Path

def sha(path):
    with path.open('rb') as f:return hashlib.file_digest(f,'sha256').hexdigest()

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--previous-editable',type=Path,required=True)
    parser.add_argument('--r3',type=Path,required=True)
    parser.add_argument('--native-probe',type=Path,required=True)
    parser.add_argument('--output',type=Path,required=True)
    a=parser.parse_args()
    assert sha(a.previous_editable)=='8ca6a13625275ae23414589ce6510c062ba8bc1cdb715d0dd8f62362e37f7352'
    native=a.native_probe/'Solaris-603-Native-Probe-Evidence.zip'
    assert sha(native)=='fc80473bb320528ad372a416333c3bd744b88126adde55672adb2663b938a9ea'
    inventory=[];names=set()
    with zipfile.ZipFile(a.output,'x',compression=zipfile.ZIP_DEFLATED,compresslevel=6,allowZip64=True) as out:
        def add(name,data,info=None):
            assert name not in names,name
            assert not name.startswith('/') and '..' not in Path(name).parts,name
            names.add(name)
            out.writestr(info or name,data)
            inventory.append({'path':name,'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest()})
        with zipfile.ZipFile(a.previous_editable) as old:
            assert old.testzip() is None
            for info in old.infolist():add(info.filename,old.read(info),copy.copy(info))
        for path in sorted(a.r3.rglob('*')):
            relative=path.relative_to(a.r3)
            if not path.is_file() or any(part.startswith('.') or part in {'__pycache__','node_modules'} for part in relative.parts):continue
            if path.suffix.lower() in {'.apk','.zip','.pyc','.tmp','.keystore','.jks'}:continue
            assert path.name!='expo-sdk54-template-build.gradle','Signing configuration excluded'
            add('Solaris-Android-R3/'+str(relative),path.read_bytes())
        with zipfile.ZipFile(native) as old:
            assert old.testzip() is None
            for info in old.infolist():
                name=info.filename.replace('Solaris-603-Native-Probe/','solaris-603-native-probe/',1)
                # These final verification files were created after the earlier
                # native evidence snapshot and are read in their final form below.
                if Path(name).name.startswith(('independent_packaging','packaging-independent','qvac-independent')):continue
                add(name,old.read(info))
        for path in sorted(a.native_probe.iterdir()):
            if path.is_file() and path.name.startswith(('independent_packaging','packaging-independent','qvac-independent')) and path.suffix in {'.py','.json','.md'}:
                add('solaris-603-native-probe/'+path.name,path.read_bytes())
        out.writestr('Solaris-603-EDITABLE-ARCHIVE-MANIFEST.json',json.dumps(inventory,indent=2)+'\n')
    with zipfile.ZipFile(a.output) as z:assert z.testzip() is None
    print(json.dumps({'path':str(a.output),'bytes':a.output.stat().st_size,'sha256':sha(a.output),'entries':len(inventory)+1},indent=2))

if __name__=='__main__':main()
