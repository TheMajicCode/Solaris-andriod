#!/usr/bin/env python3
"""Bounded actual QvacService request/stream/guard tests under matching Hermes."""
from pathlib import Path
import argparse,hashlib,json,subprocess,tempfile
R3=Path(__file__).resolve().parents[1];ROOT=R3.parent
p=argparse.ArgumentParser();p.add_argument('bundle',type=Path);p.add_argument('--label',default='candidate');args=p.parse_args()
out=R3/'evidence'/('qvac-'+args.label);out.mkdir(parents=True,exist_ok=True);build=Path(tempfile.mkdtemp(prefix='run-',dir=out))
shared_source=ROOT/'Solaris-Android-R2/tests/hermes/compare-postlude.js'
raw=shared_source.read_text();assert raw.count('  var cases = [')==1
shared=build/'shared.js';shared.write_text(raw.split('  var cases = [')[0]+'\n globalThis.__solarisFixtures={fixture:fixture,caught:caught,state:state,liveTimers:liveTimers};\n})();\n')
compiled=[];transpiler=ROOT/'Solaris-Android-R2/evidence/integration-feasibility/transpile-hermes-fixture.cjs'
for source,name in [(shared,'shared.compiled.js'),(R3/'src/conversation-request.js','expected.compiled.js'),(R3/'tests/qvac-postlude.js','qvac.compiled.js')]:
 dest=build/name;subprocess.run(['node',str(transpiler),str(source),str(dest)],capture_output=True,text=True,check=True);compiled.append(dest)
runner=ROOT/'Solaris-Android-R2/evidence/integration-feasibility/run-hermes-reference.py';prelude=ROOT/'Solaris-Android-R2/tests/hermes/capture-prelude.js'
cmd=['python',str(runner),'--tools',str(ROOT/'reconstruction-work/r2-tools'),str(prelude),str(args.bundle),*[str(x) for x in compiled]]
run=subprocess.run(cmd,capture_output=True,text=True,timeout=65);(build/'stdout.txt').write_text(run.stdout);(build/'stderr.txt').write_text(run.stderr)
try:result=json.loads(run.stdout)
except Exception:raise SystemExit('Harness failed '+run.stdout+run.stderr)
(out/'result.json').write_text(json.dumps(result,indent=2)+'\n')
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
(out/'provenance.json').write_text(json.dumps(dict(bundle=str(args.bundle),bundle_sha256=sha(args.bundle),test_sha256=sha(R3/'tests/qvac-postlude.js'),expected_source_sha256=sha(R3/'src/conversation-request.js'),shared_fixture_sha256=sha(shared_source),compiled=[dict(path=str(x),sha256=sha(x)) for x in compiled],command=cmd,returncode=run.returncode,limitations=['Actual patched QvacService and original compiler module execute in matching desktop Hermes','Native SDK/model/timers/provisioner are explicit synthetic fixtures','No wall-clock timeout, Android background scheduling or on-device inference proof']),indent=2)+'\n')
assert result.get('total')==24 and len(result.get('cases',[]))==24,'Incomplete qvac suite'
assert result.get('capturedModules')==966 and result.get('suppressedEntrypoints')==[191,3,0],'Unexpected startup capture'
print(json.dumps(dict(pass_=result.get('pass'),total=result['total'],failures=[x for x in result['cases'] if not x['pass']],result=str(out/'result.json')),indent=2))
raise SystemExit(0 if result.get('pass') and run.returncode==0 and not run.stderr.strip() else 1)
