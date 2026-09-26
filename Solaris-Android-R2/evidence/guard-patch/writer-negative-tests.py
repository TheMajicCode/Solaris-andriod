#!/usr/bin/env python3
"""Targeted fail-closed checks for the bounded analysis-copy writer."""
from pathlib import Path
import importlib.util, json, subprocess, sys, tempfile

ROOT = Path(__file__).resolve().parents[3]
WRITER = ROOT/'Solaris-Android-R2/tools/patch-completion-guards.py'
INPUT = ROOT/'Solaris-Android-Reconstruction/src/recovered-601/compiled-reference/assets/index.android.bundle'
spec = importlib.util.spec_from_file_location('guard_writer', WRITER)
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)
results=[]
def rejects(name, fn, part):
    try: fn()
    except ValueError as e:
        assert part in str(e), (name,str(e))
        results.append(dict(test=name,status='PASS',error=str(e)))
    else: raise AssertionError(name+' should fail')

rejects('short/unverified input',lambda:m.patch(b'not bytecode'),'verified code601')
raw = INPUT.read_bytes()
altered = bytearray(raw);altered[160] ^= 1
rejects('single changed byte rejected even at correct length',lambda:m.patch(bytes(altered)),'verified code601')
r=m.read_hbc(raw);ops={i.name:i for i in r.parser_module._instructions}
rejects('short forward branch overflow',lambda:m.encode_instruction(ops['JmpFalse'],[128,1]),'overflow')
rejects('short backward branch overflow',lambda:m.encode_instruction(ops['JmpFalse'],[-129,1]),'overflow')

with tempfile.TemporaryDirectory(prefix='guard-writer-negative-',dir=ROOT/'Solaris-Android-R2/evidence/guard-patch') as tmp:
    d=Path(tmp)
    cases=[('original overwrite rejected',INPUT,'Original overwrite forbidden'),
           ('APK output rejected',d/'candidate.apk','analysis .hbc'),
           ('recovered subtree output rejected',ROOT/'Solaris-Android-Reconstruction/forbidden.hbc','read-only'),
           ('existing output not replaced',d/'existing.hbc','Output exists')]
    (d/'existing.hbc').write_bytes(b'preserve')
    for name,dest,error in cases:
        p=subprocess.run([sys.executable,str(WRITER),str(INPUT),str(dest)],capture_output=True,text=True)
        assert p.returncode != 0 and error in p.stderr,(name,p.returncode,p.stderr)
        results.append(dict(test=name,status='PASS',returncode=p.returncode,expected_error=error))
    assert (d/'existing.hbc').read_bytes()==b'preserve'
    assert not (d/'candidate.apk').exists()
    assert not (ROOT/'Solaris-Android-Reconstruction/forbidden.hbc').exists()
assert INPUT.read_bytes()==raw
report=dict(status='PASS',checks=len(results),reference_input_unchanged=True,results=results)
(Path(__file__).parent/'writer-negative-tests.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({'status':'PASS','checks':len(results),'reference_input_unchanged':True}))
