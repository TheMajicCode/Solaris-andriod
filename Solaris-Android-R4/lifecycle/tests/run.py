#!/usr/bin/env python3
"""Run actual retained DailyService and QvacService lifecycle boundaries in Hermes."""
from pathlib import Path
import argparse, hashlib, json, subprocess
HERE=Path(__file__).resolve().parents[1]
ROOT=HERE.parents[1]
p=argparse.ArgumentParser();p.add_argument('bundle',type=Path);p.add_argument('--label',default='baseline603');args=p.parse_args()
out=HERE/'evidence'/args.label;out.mkdir(parents=True,exist_ok=True)
daily=ROOT/'Solaris-Android-R3/tests/daily-postlude.js'
qvac=ROOT/'Solaris-Android-R2/tests/hermes/compare-postlude.js'
fixtures=[(daily,'  (async function(){','globalThis.__dailyLifecycleFixtures={fixture:fixture,invoke:invoke};'),(qvac,'  var cases = [','globalThis.__qvacLifecycleFixtures={fixture:fixture,caught:caught};')]
compiled=[]
transpiler=ROOT/'Solaris-Android-R2/evidence/integration-feasibility/transpile-hermes-fixture.cjs'
for i,(source,split,export) in enumerate(fixtures):
 raw=source.read_text();assert raw.count(split)==1
 adapted=out/f'fixture-{i}.js';adapted.write_text(raw.split(split)[0]+export+'\n})();\n')
 dest=out/f'fixture-{i}.compiled.js'
 subprocess.run(['node',str(transpiler),str(adapted),str(dest)],check=True,capture_output=True);compiled.append(dest)
post=HERE/'tests/lifecycle-postlude.js';dest=out/'lifecycle.compiled.js'
subprocess.run(['node',str(transpiler),str(post),str(dest)],check=True,capture_output=True);compiled.append(dest)
runner=ROOT/'Solaris-Android-R2/evidence/integration-feasibility/run-hermes-reference.py'
prelude=ROOT/'Solaris-Android-R2/tests/hermes/capture-prelude.js'
command=['python3',str(runner),'--tools',str(ROOT/'reconstruction-work/r2-tools'),str(prelude),str(args.bundle.resolve()),*[str(x) for x in compiled]]
run=subprocess.run(command,capture_output=True,text=True,timeout=65)
(out/'stdout.txt').write_text(run.stdout);(out/'stderr.txt').write_text(run.stderr)
try: result=json.loads(run.stdout)
except Exception: raise SystemExit('Harness failed: '+run.stdout+run.stderr)
(out/'result.json').write_text(json.dumps(result,indent=2)+'\n')
sha=lambda path: hashlib.sha256(path.read_bytes()).hexdigest()
(out/'provenance.json').write_text(json.dumps({'bundle':str(args.bundle.resolve()),'bundle_sha256':sha(args.bundle),'test_sha256':sha(post),'fixture_source_hashes':{str(x):sha(x) for x in [daily,qvac]},'command':command,'returncode':run.returncode,'limitations':['Actual retained application bytecode runs in matching desktop Hermes.','Native vault storage, successful unlock, SDK transport and timers are explicit synthetic adapters.','No Android background scheduling, biometric unlock or device inference timing is established.']},indent=2)+'\n')
assert result['total']==10 and result['capturedModules']==966 and result['suppressedEntrypoints']==[191,3,0]
print(json.dumps({'pass':result['pass'],'total':result['total'],'failures':[x for x in result['cases'] if not x['pass']],'output':str(out)}))
raise SystemExit(0 if result['pass'] and run.returncode==0 and not run.stderr.strip() else 1)
