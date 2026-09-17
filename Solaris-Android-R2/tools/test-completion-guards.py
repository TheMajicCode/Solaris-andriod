#!/usr/bin/env python3
"""Execute original and repaired HBC and assert dispatch guards and success parity."""
import hashlib
import json
import pathlib
import subprocess
import tempfile

root=pathlib.Path(__file__).resolve().parents[1]
workspace=root.parent
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
baseline=workspace/'Solaris-Android-Reconstruction/src/recovered-601/compiled-reference/assets/index.android.bundle'
patched=root/'evidence/guard-patch/completion-guards.hbc'
assert sha(baseline)=='ac973292961cc7a1505a47a416ecafdff2e1688b7eac31f20571e503d74ec177'
assert sha(patched)=='fd8b38bcdd42421c18da4a0b69b2d58906ceddd7c4a2044b34faed51490f4653'
source=root/'tests/hermes/compare-postlude.js'
guard=root/'tests/hermes/guard-postlude.js'
build=pathlib.Path(tempfile.mkdtemp(prefix='guard-probes-',dir=root/'evidence/guard-patch'))
text=source.read_text()
assert text.count('  var cases = [')==1
shared=build/'shared-fixtures.js'
shared.write_text(text.split('  var cases = [')[0]+'\n globalThis.__solarisFixtures={fixture:fixture,caught:caught,state:state,liveTimers:liveTimers};\n})();\n')
tool=root/'evidence/integration-feasibility/transpile-hermes-fixture.cjs'
compiled=[]
for inp,name in [(shared,'shared.compiled.js'),(guard,'guard.compiled.js')]:
    out=build/name
    subprocess.run(['node',str(tool),str(inp),str(out)],check=True,capture_output=True,text=True)
    compiled.append(out)
outputs={}
commands=[]
expected_names={'public-success','private-success','private-truthy-success','public-background',
 'public-cancelled','private-revoked','private-background','private-cancelled','private-initially-denied',
 'public-not-ready','private-not-ready','public-empty','private-empty','public-sdk-throw','private-sdk-throw',
 'public-repeated-success','private-repeated-success'}
for label,bundle in [('original',baseline),('patched',patched)]:
    command=['python3',str(root/'evidence/integration-feasibility/run-hermes-reference.py'),'--tools',
      str(workspace/'reconstruction-work/r2-tools'),str(root/'tests/hermes/capture-prelude.js'),str(bundle),*[str(p) for p in compiled]]
    run=subprocess.run(command,capture_output=True,text=True,timeout=65)
    (build/(label+'.stdout.txt')).write_text(run.stdout)
    (build/(label+'.stderr.txt')).write_text(run.stderr)
    assert run.returncode==0 and not run.stderr.strip(), (label,run.stderr)
    data=json.loads(run.stdout)
    assert data['complete'] is True and data['kind']=='completion-guard-probe' and len(data['cases'])==17
    assert {c['name'] for c in data['cases']}==expected_names
    outputs[label]={c['name']:c for c in data['cases']}
    commands.append(command)
original,changed=outputs['original'],outputs['patched']
assert original.keys()==changed.keys()
denied={'public-background','public-cancelled','private-revoked','private-background','private-cancelled'}
checks=[]
for name,after in changed.items():
    before=original[name]
    if name in denied:
        assert len(before['dispatches'])==1, (name,'original witness must dispatch')
        assert after['dispatches']==[], (name,'patched must not dispatch')
        assert after['error']['code']=='CANCELLED', (name,after['error'])
        assert after['error']['stage']==('local' if name=='private-revoked' else 'idle')
        assert after['tokens']==[] and after['output']=='' and after['receipt'] is None
        if 'background' in name: assert before['dispatches'][0]['active'] is False
        if 'cancelled' in name: assert before['dispatches'][0]['cancelled'] is True
        if name=='private-revoked': assert before['dispatches'][0]['eligible'] is False
    else:
        # An extra existing predicate evaluation is the intended private guard.
        a=dict(before);b=dict(after)
        a.pop('predicateCalls');b.pop('predicateCalls')
        assert a==b, (name,'normal/control behavior changed',a,b)
        if 'success' in name:
            expected=2 if 'repeated' in name else 1
            assert after['error'] is None and len(after['dispatches'])==expected
            assert all(d['active'] and d['eligible'] and not d['cancelled'] for d in after['dispatches'])
            assert after['inference']['state']=='succeeded'
            # Existing private stream output stays private; no public token callback.
            assert len(after['tokens'])==(0 if name.startswith('private') else expected)
            if name.startswith('private'): assert after['predicateCalls']==before['predicateCalls']+expected
        elif name=='private-initially-denied':
            assert after['dispatches']==[] and after['error']=={'code':'CANCELLED','stage':'local'}
        elif 'not-ready' in name:
            assert after['dispatches']==[] and after['error']['code']=='QVAC_NOT_READY'
        elif 'empty' in name: assert after['error']['code']=='EMPTY_COMPLETION'
        elif 'sdk-throw' in name: assert after['error']['code']=='SYNTHETIC_SDK_FAILURE'
    assert after['state']['modelId']=='retained-model-id' and after['state']['current'] is False
    assert after['remainingTimerCount']==0, (name,'timer cleanup')
    checks.append({'name':name,'pass':True,'dispatchBefore':len(before['dispatches']),'dispatchAfter':len(after['dispatches'])})
report={'pass':True,'cases':checks,'baselineSha256':sha(baseline),'patchedSha256':sha(patched),
 'fixtureSourceSha256':sha(source),'guardSourceSha256':sha(guard),'testScriptSha256':sha(pathlib.Path(__file__)),
 'outputs':outputs,'commands':commands,'buildDirectory':str(build.relative_to(root)),
 'limits':['synthetic runtime, budgets and timers','fixed clock','desktop Hermes microtask queue',
 'no Android/BareKit event delivery, actual inference, vault persistence or elapsed timeout proof',
 'does not repair SDK lifecycle reconciliation or deferred step dispatch']}
(root/'evidence/guard-patch/BEHAVIORAL-RESULT.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({'pass':True,'cases':len(checks),'changedDenialCases':len(denied),'preservedCases':len(checks)-len(denied)}))
