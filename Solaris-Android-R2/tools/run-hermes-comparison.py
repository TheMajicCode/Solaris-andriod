#!/usr/bin/env python3
"""Build fixtures and require a complete successful actual-HBC comparison.
Desktop synthetic reference only; no APK modification or Android access.
"""
import argparse
import hashlib
import json
import pathlib
import subprocess
import tempfile

root = pathlib.Path(__file__).resolve().parents[1]
workspace = root.parent
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--tools',type=pathlib.Path,default=workspace/'reconstruction-work/r2-tools')
parser.add_argument('--output',type=pathlib.Path,default=root/'evidence/hermes-differential-result.json')
parser.add_argument('--patched',action='store_true',help='Verify the exact two-guard analysis bytecode')
args = parser.parse_args()
bundle=workspace/'Solaris-Android-Reconstruction/src/recovered-601/compiled-reference/assets/index.android.bundle'
expected='ac973292961cc7a1505a47a416ecafdff2e1688b7eac31f20571e503d74ec177'
if args.patched:
    bundle=root/'evidence/guard-patch/completion-guards.hbc'
    expected='fd8b38bcdd42421c18da4a0b69b2d58906ceddd7c4a2044b34faed51490f4653'
sha=lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
if sha(bundle)!=expected: raise SystemExit('Original bytecode hash mismatch')
source=root/'src/host-baseline/qvac-service-baseline.mjs'
postlude=root/'tests/hermes/compare-postlude.js'
prelude=root/'tests/hermes/capture-prelude.js'
tool=root/'evidence/integration-feasibility/transpile-hermes-fixture.cjs'
runner=root/'evidence/integration-feasibility/run-hermes-reference.py'
build=pathlib.Path(tempfile.mkdtemp(prefix='hermes-comparison-',dir=root/'evidence'))
plain=build/'baseline-script.js'
content=source.read_text()
if content.count('export function createQvacServiceBaseline')!=1: raise SystemExit('Unexpected source export')
plain.write_text(content.replace('export function createQvacServiceBaseline','function createQvacServiceBaseline',1))
compiled=[]
for src,name in [(plain,'baseline.compiled.js'),(postlude,'comparison.compiled.js')]:
    dest=build/name
    subprocess.run(['node',str(tool),str(src),str(dest)],check=True,capture_output=True,text=True)
    compiled.append(dest)
flag=build/'mode.js'
flag.write_text('globalThis.__solarisExpectedGuards='+('true' if args.patched else 'false')+';\n')
command=['python3',str(runner),'--tools',str(args.tools),str(prelude),str(bundle),str(flag),*[str(p) for p in compiled]]
result=subprocess.run(command,capture_output=True,text=True,timeout=65)
(build/'stdout.txt').write_text(result.stdout)
(build/'stderr.txt').write_text(result.stderr)
if result.returncode or result.stderr.strip(): raise SystemExit('Hermes runner failed; see '+str(build))
try: data=json.loads(result.stdout)
except Exception as e: raise SystemExit('Missing or invalid harness result: '+str(e))
assert data.get('pass') is True
assert data.get('total')==24 and data.get('failures')==0
assert len(data.get('cases',[]))==24 and all(c.get('pass') is True for c in data['cases'])
assert len(data.get('bytecodeOnlyWitnesses',[]))==4 and all(c.get('pass') is True for c in data['bytecodeOnlyWitnesses'])
assert data['capturedModules']==966 and data['suppressedEntrypoints']==[191,3,0]
assert data['executedModules']==[8,9,10,11,12,38,39,40,41,42,43,67,591,592]
args.output.write_text(json.dumps(data,indent=2)+'\n')
provenance={'bundleSha256':sha(bundle),'patchedMode':args.patched,'sourceSha256':sha(source),'preludeSha256':sha(prelude),
 'postludeSha256':sha(postlude),'transformSha256':sha(tool),'buildDirectory':str(build.relative_to(root)),
 'command':command,'exitCode':result.returncode,'resultSha256':sha(args.output),
 'limits':['synthetic dependencies','desktop Hermes microtask queue','JSON-normalized events and selected state',
 'no Android AppState/BareKit ordering or real model execution','no real wall-clock timer test']}
args.output.with_suffix('.provenance.json').write_text(json.dumps(provenance,indent=2)+'\n')
print(json.dumps({'pass':True,'differentialCases':24,'originalBytecodeWitnesses':4,'result':str(args.output)}))
