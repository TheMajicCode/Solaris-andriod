"""604 guided routing. Caller must supply the exact603 reader and bytes.
No APK work. Preserves original permission/source/epoch/session commit gates.
"""
import hashlib, json, subprocess, sys
from pathlib import Path
ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT/'Solaris-Android-R4/tools'))
sys.path.insert(1, str(ROOT/'Solaris-Android-R3/tools'))
from hbc_patch import I, Label, Ref, read, require, rewrite, digest, old
from hbc_inline import inline_donor
from hermes_dec.parsers.hbc_bytecode_parser import parse_hbc_bytecode
BASE='b8ac7d1b58d9e8ea6eadd25de516e35842aea14e4b849462664bb3200fedc990'

def plans(r, base, output_dir=None):
    require(digest(base)==BASE, 'Guided plans require exact603 HBC')
    out = Path(output_dir) if output_dir else HERE/'compiled'
    out.mkdir(parents=True,exist_ok=True)
    (out/'base.hbc').write_bytes(base)
    (out/'strings.json').write_text(json.dumps(r.strings))
    compiler=ROOT/'reconstruction-work/r2-tools/react-native-0.81.5/package/sdks/hermesc/linux64-bin/hermesc'
    require(digest(compiler.read_bytes())=='b4c37f09410c6c6c0ce90df00eb270dc257d2184c85ca320382ebe06057f2a14','Wrong compiler')
    source=HERE/'fast-guided.js'
    prepared=out/'fast-guided.compiler.js';binary=out/'fast-guided.hbc'
    subprocess.run(['node',str(HERE/'prepare-guided.cjs'),str(source),str(out/'strings.json'),str(prepared)],check=True)
    subprocess.run([str(compiler),'-O','-g0','-emit-binary','-base-bytecode='+str(out/'base.hbc'),'-out',str(binary),str(prepared)],check=True)
    d=read(binary.read_bytes())
    require(d.header.functionCount==2 and d.strings[d.function_headers[1].functionName]=='fastGuided','Unexpected guided donor')
    sid=lambda s:r.strings.index(s)
    output=[]
    # assertConversationAccess retains the same checks, but returns a guided
    # candidate only for validated v3 context; legacy return stays undefined.
    nodes,updates,fixups,detail=inline_donor(r,d,14890,1,{1:1},0,namespace='preflight-guided')
    end=Ref('preflight-guided:skip')
    insert=[I('GetByIdShort',2,3,10,sid('format')),I('LoadConstString',7,sid('solaris-daily-state/3')),
            I('JStrictNotEqual',end,2,7),I('LoadConstString',2,sid('task')),I('GetByVal',1,1,2)]+nodes+[Label(end.name)]
    plan=rewrite(r,base,14890,fixups+[dict(start=220,end=220,nodes=insert)],updates)
    plan['report']['inline']=detail;output.append(plan)
    # Bridge consults the preflight return before the optional model load.
    # Both token generation and inputAllowed/vault guards remain at2384+.
    # Exact603: Call4 r15,... at2283; following params load begins2290.
    ops=list(parse_hbc_bytecode(r.function_headers[6929],r))
    call=next(o for o in ops if o.original_pos==2283)
    require(call.inst.name=='Call4' and call.arg1==15,'Bridge preflight call changed')
    boundary=call.next_pos
    output.append(rewrite(r,base,6929,[dict(start=boundary,end=boundary,nodes=[I('JmpTrue',old(2384),15)])]))
    # After context compilation and installing the currentSources closure,
    # return guided text through original epoch/authority/permission rechecks.
    nodes,updates,fixups,detail=inline_donor(r,d,14894,1,{1:16},19,namespace='daily-guided')
    skip=Ref('daily-guided:continue-model')
    tail=[I('JmpFalse',skip,19),I('LoadConstString',8,sid('message')),I('GetByVal',14,19,8),I('StoreToEnvironment',9,14,14),
          I('NewObject',8),I('LoadConstString',20,sid('sourceRefs')),I('GetByVal',21,19,20),I('PutByVal',8,20,21),
          I('LoadConstString',20,sid('authorityEpoch')),I('PutByVal',8,20,18),
          I('LoadConstString',20,sid('experience')),I('GetByVal',21,17,20),I('LoadConstString',20,sid('localContext')),I('GetByVal',21,21,20),
          I('LoadConstString',20,sid('revision')),I('GetByVal',21,21,20),I('LoadConstString',20,sid('permissionRevision')),I('PutByVal',8,20,21),
          I('StoreToEnvironment',9,15,8),I('JmpLong',old(1154)),Label(skip.name)]
    plan=rewrite(r,base,14894,fixups+[dict(start=972,end=972,nodes=nodes+tail)],updates)
    plan['report']['inline']=detail;output.append(plan)
    # Receipt type follows actual generation mode, not the existence of a
    # response string. No guided response is called a generated model reply.
    output.append(rewrite(r,base,14904,[
      dict(start=605,end=609,nodes=[I('LoadFromEnvironment',12,1,10),I('LoadConstString',11,sid('qvac-device')),I('StrictEq',12,12,11)]),
      # Before the existing epoch/currentSources checks, recheck authority
      # after asynchronous receipt MAC. Both model and guided commits share it.
      dict(start=780,end=780,nodes=[I('LoadFromEnvironment',7,1,4),I('LoadConstString',8,sid('state')),I('GetByVal',7,7,8),
          I('JmpFalse',old(946),7),I('LoadConstString',8,sid('authorityEpoch')),I('GetByVal',7,7,8),I('LoadFromEnvironment',8,1,9),I('JStrictNotEqual',old(946),7,8)])]))
    for plan in output:
        plan['report']['source']=str(source.relative_to(ROOT));plan['report']['source_sha256']=digest(source.read_bytes())
    (out/'DONOR-PROVENANCE.json').write_text(json.dumps(dict(sourceSha256=digest(source.read_bytes()),preparedSha256=digest(prepared.read_bytes()),donorSha256=digest(binary.read_bytes()),changedFunctions=[p['function_id'] for p in output]),indent=2)+'\n')
    return output
