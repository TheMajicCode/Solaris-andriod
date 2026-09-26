#!/usr/bin/env python3
from pathlib import Path
import argparse,hashlib,json,subprocess
here=Path(__file__).resolve().parent;workspace=here.parents[1]
p=argparse.ArgumentParser();p.add_argument('bundle',type=Path);p.add_argument('--label',default='candidate');a=p.parse_args()
out=here/'evidence'/('guided-races-'+a.label);out.mkdir(parents=True,exist_ok=True)
transpiler=workspace/'Solaris-Android-R2/evidence/integration-feasibility/transpile-hermes-fixture.cjs'
compiled=[]
for name in ['fixture','guided-races']:
 src=here/(name+'.js');dest=out/(name+'.compiled.js');subprocess.run(['node',str(transpiler),str(src),str(dest)],check=True,capture_output=True);compiled.append(dest)
runner=workspace/'Solaris-Android-R2/evidence/integration-feasibility/run-hermes-reference.py';prelude=workspace/'Solaris-Android-R2/tests/hermes/capture-prelude.js'
cmd=['python3',str(runner),'--tools',str(workspace/'reconstruction-work/r2-tools'),str(prelude),str(a.bundle.resolve()),*[str(x) for x in compiled]]
r=subprocess.run(cmd,capture_output=True,text=True,timeout=65);(out/'stdout.txt').write_text(r.stdout);(out/'stderr.txt').write_text(r.stderr)
try: result=json.loads(r.stdout)
except Exception: raise SystemExit('Harness failed: '+r.stdout+r.stderr)
(out/'result.json').write_text(json.dumps(result,indent=2)+'\n')
sha=lambda path:hashlib.sha256(path.read_bytes()).hexdigest()
(out/'provenance.json').write_text(json.dumps({'bundleSha256':sha(a.bundle),'sourceSha256':{name:sha(here/name) for name in ['fixture.js','guided-races.js']},'runnerSha256':sha(Path(__file__)),'command':cmd,'exitCode':r.returncode,'limitations':['Actual retained APK bytecode in matching desktop Hermes.','Synthetic nativeVault/VaultStore and model outputs; no Android installation or native background scheduling.','MAC awaits are explicit deferred promises; no real vault touched.']},indent=2)+'\n')
assert result['total']==15 and result['capturedModules']==966 and result['suppressedEntrypoints']==[191,3,0]
print(json.dumps({'pass':result['pass'],'total':result['total'],'failures':[c for c in result['cases'] if not c['pass']],'bundleSha256':sha(a.bundle),'output':str(out)},indent=2))
raise SystemExit(0 if result['pass'] and r.returncode==0 and not r.stderr.strip() else 1)
