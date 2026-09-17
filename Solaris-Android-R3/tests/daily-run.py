#!/usr/bin/env python3
"""Execute actual APK DailyService with synthetic native/inference boundaries."""
import argparse, hashlib, json, pathlib, subprocess, tempfile
root=pathlib.Path(__file__).resolve().parents[1]; workspace=root.parent
p=argparse.ArgumentParser();p.add_argument('bundle',type=pathlib.Path);p.add_argument('--patched',action='store_true');p.add_argument('--recent',action='store_true');p.add_argument('--label',default='probe');args=p.parse_args()
out=root/'evidence'/('daily-tests-'+args.label);out.mkdir(parents=True,exist_ok=True)
build=pathlib.Path(tempfile.mkdtemp(prefix='run-',dir=out));compiled=build/'daily.compiled.js'
tool=workspace/'Solaris-Android-R2/evidence/integration-feasibility/transpile-hermes-fixture.cjs'
subprocess.run(['node',str(tool),str(root/'tests/daily-postlude.js'),str(compiled)],check=True,capture_output=True,text=True)
flag=build/'mode.js';flag.write_text('globalThis.__solarisExpectedDiagnostics='+str(args.patched).lower()+';\nglobalThis.__solarisExpectedRecent='+str(args.recent).lower()+';\n')
runner=workspace/'Solaris-Android-R2/evidence/integration-feasibility/run-hermes-reference.py'
prelude=workspace/'Solaris-Android-R2/tests/hermes/capture-prelude.js'
cmd=['python3',str(runner),'--tools',str(workspace/'reconstruction-work/r2-tools'),str(prelude),str(args.bundle),str(flag),str(compiled)]
r=subprocess.run(cmd,capture_output=True,text=True,timeout=65)
(build/'stdout.txt').write_text(r.stdout);(build/'stderr.txt').write_text(r.stderr)
try: result=json.loads(r.stdout)
except Exception: raise SystemExit('Harness failed '+r.stdout+r.stderr)
(out/'result.json').write_text(json.dumps(result,indent=2)+'\n')
sha=lambda q:hashlib.sha256(q.read_bytes()).hexdigest()
(out/'provenance.json').write_text(json.dumps({'bundle':str(args.bundle),'bundleSha256':sha(args.bundle),'preludeSha256':sha(prelude),'testSha256':sha(root/'tests/daily-postlude.js'),'compiledSha256':sha(compiled),'patchedExpected':args.patched,'recentExpected':args.recent,'command':cmd,'exitCode':r.returncode,'limitations':['synthetic model output','synthetic VaultStore/nativeVault boundary','presentation view projection simplified','no Android or native QVAC execution','no real timers']},indent=2)+'\n')
assert result.get('total')==94 and len(result.get('cases',[]))==94,'Expected complete 94-case suite'
assert result.get('capturedModules')==966 and result.get('suppressedEntrypoints')==[191,3,0],'Unexpected capture/startup state'
summary={'pass':result.get('pass'),'total':result.get('total'),'failures':[c for c in result.get('cases',[]) if not c.get('pass')],'result':str(out/'result.json'),'bundleSha256':sha(args.bundle)}
print(json.dumps(summary,indent=2));raise SystemExit(0 if result.get('pass') and not r.returncode and not r.stderr.strip() else 1)
