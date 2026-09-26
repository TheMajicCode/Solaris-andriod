#!/usr/bin/env python3
"""Targeted actual-Hermes guided route tests; synthetic native/storage seams."""
import argparse,hashlib,json,subprocess,tempfile
from pathlib import Path
HERE=Path(__file__).resolve().parent;ROOT=HERE.parents[1]
p=argparse.ArgumentParser();p.add_argument('bundle',type=Path);p.add_argument('--output',type=Path,required=True);a=p.parse_args()
a.output.mkdir(parents=True,exist_ok=False)
compiled=a.output/'actual-tests.compiled.js'
subprocess.run(['node',str(ROOT/'Solaris-Android-R2/evidence/integration-feasibility/transpile-hermes-fixture.cjs'),str(HERE/'actual-tests.js'),str(compiled)],check=True,capture_output=True,text=True)
runner=ROOT/'Solaris-Android-R2/evidence/integration-feasibility/run-hermes-reference.py';prelude=ROOT/'Solaris-Android-R2/tests/hermes/capture-prelude.js'
cmd=['python3',str(runner),'--tools',str(ROOT/'reconstruction-work/r2-tools'),str(prelude),str(a.bundle.resolve()),str(compiled)]
r=subprocess.run(cmd,capture_output=True,text=True,timeout=65)
(a.output/'stdout.txt').write_text(r.stdout);(a.output/'stderr.txt').write_text(r.stderr)
result=json.loads(r.stdout)
(a.output/'result.json').write_text(json.dumps(result,indent=2)+'\n')
sha=lambda f:hashlib.sha256(f.read_bytes()).hexdigest()
(a.output/'provenance.json').write_text(json.dumps({'bundleSha256':sha(a.bundle),'testSha256':sha(HERE/'actual-tests.js'),'compiledSha256':sha(compiled),'preludeSha256':sha(prelude),'exitCode':r.returncode,'command':cmd,'limitations':['Synthetic VaultStore and nativeVault/MAC','Synthetic QVAC output, no phone timing claim','Presentation projection simplified','Actual bridge is a separate review test']},indent=2)+'\n')
assert result['total']==34 and len(result['cases'])==34,'Incomplete suite'
assert result['capturedModules']==966 and result['suppressedEntrypoints']==[191,3,0],'Unexpected bundle capture'
print(json.dumps({'pass':result['pass'],'total':result['total'],'bundleSha256':sha(a.bundle),'failures':[v for v in result['cases'] if not v['pass']]}))
raise SystemExit(0 if result['pass'] and r.returncode==0 and not r.stderr.strip() else 1)
