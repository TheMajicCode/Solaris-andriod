#!/usr/bin/env python3
"""Build the reviewed R3 changes against the exact602 HBC, with no native rebuild.
Source helpers are compiler-produced then narrowly inlined into existing bodies.
The sole modified string is the fixed-size existing HTML slot. No APK/signing.
"""
import argparse, hashlib, importlib.util, json, subprocess, sys, zipfile
from pathlib import Path
from hbc_patch import I, Label, Ref, digest, read, require, rewrite, append_plans
from hbc_inline import inline_donor

ROOT=Path(__file__).resolve().parents[2]
R3=ROOT/'Solaris-Android-R3'

def module(name,path):
    spec=importlib.util.spec_from_file_location(name,path)
    value=importlib.util.module_from_spec(spec);spec.loader.exec_module(value)
    return value

def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('--baseline-apk',type=Path,required=True)
    p.add_argument('--output-dir',type=Path,required=True)
    a=p.parse_args()
    require(digest(a.baseline_apk.read_bytes())=='01da9f5281f5f92230dcbd64da62484557cc7a0a15e876cc2d99ec7ec3bcd2cd','Wrong602 APK')
    out=a.output_dir;out.mkdir(parents=True,exist_ok=False)
    with zipfile.ZipFile(a.baseline_apk) as z: base=z.read('assets/index.android.bundle')
    r=read(base,exact_base=True)
    (out/'baseline602.hbc').write_bytes(base)
    (out/'baseline-strings.json').write_text(json.dumps(r.strings))
    compiler=ROOT/'reconstruction-work/r2-tools/react-native-0.81.5/package/sdks/hermesc/linux64-bin/hermesc'
    require(digest(compiler.read_bytes())=='b4c37f09410c6c6c0ce90df00eb270dc257d2184c85ca320382ebe06057f2a14','Compiler hash')
    plans=[];donors=[]
    for filename,name,fid,boundary,params,result,prefix in [
        ('conversation-request','conversationRequest',7337,427,{1:8,2:13},8,[I('LoadFromEnvironment',13,9,2)]),
        ('recent-context','recentContext',14886,566,{1:3,2:5,3:6},3,[I('LoadParam',5,0),I('LoadParam',6,1)])]:
        source=R3/'src'/f'{filename}.js'
        prepared=out/f'{filename}.compiler.js';binary=out/f'{filename}.hbc'
        subprocess.run(['node',str(R3/'tools/prepare-donor.cjs'),str(source),str(out/'baseline-strings.json'),str(prepared)],check=True)
        subprocess.run([str(compiler),'-O','-g0','-emit-binary','-base-bytecode='+str(out/'baseline602.hbc'),'-out',str(binary),str(prepared)],check=True)
        d=read(binary.read_bytes())
        matches=[i for i,h in enumerate(d.function_headers) if d.strings[h.functionName]==name]
        require(len(matches)==1 and d.header.functionCount==2,'Unexpected donor function graph')
        nodes,updates,fixups,detail=inline_donor(r,d,fid,matches[0],params,result,namespace=filename)
        edits=fixups+[dict(start=boundary,end=boundary,nodes=prefix+nodes)]
        if fid==7337:
            # After the existing post-await eligibility test, before accepting
            # buffered content. SDK0.18.2 resolves explicit length termination;
            # ordinary EOS may omit stopReason. r6/r8 are dead at this boundary.
            sid=lambda s:r.strings.index(s)
            done=Ref('completion-limit:done')
            frame=updates['frameSize']
            guard=[I('LoadFromEnvironment',6,9,2),I('JmpFalse',done,6),
                I('JmpFalse',done,2),I('LoadConstString',6,sid('stopReason')),
                I('GetByVal',6,2,6),I('LoadConstString',8,sid('length')),
                I('JStrictNotEqual',done,6,8),I('LoadFromEnvironment',6,11,12),
                I('LoadConstString',13,sid('RuntimeError')),I('GetByVal',13,6,13),
                I('LoadConstString',6,sid('prototype')),I('GetByVal',6,13,6),
                I('CreateThis',8,6,13),I('Mov',frame-7,8),
                I('LoadConstString',frame-8,sid('OUTPUT_LIMIT')),
                I('LoadConstString',frame-9,sid('local')),
                I('Construct',6,13,3),I('SelectObject',6,8,6),I('Throw',6),Label('completion-limit:done')]
            edits.append(dict(start=652,end=652,nodes=guard))
        plan=rewrite(r,base,fid,edits,updates)
        plan['report']['source']=str(source.relative_to(ROOT))
        plan['report']['source_sha256']=digest(source.read_bytes())
        plan['report']['inline']=detail
        plans.append(plan)
        donors.append(dict(source=str(source.relative_to(ROOT)),source_sha256=digest(source.read_bytes()),compiler_input_sha256=digest(prepared.read_bytes()),donor_sha256=digest(binary.read_bytes())))
    diagnostics=module('diagnostics',R3/'tools/hbc-chat-diagnostics.py')
    plans.append(diagnostics.diagnostic_plan(r,base))
    code,report=append_plans(base,plans)
    decoder=module('decoder',ROOT/'Solaris-Android-Reconstruction/reference/601-recovery/v6-apk-recovery/extract_verified_apk.py')
    header,strings=decoder.decode_strings(code)
    html_path=R3/'ui/sanctuary.compact.html'
    html=html_path.read_text()
    require(digest(html.encode())=='41df124a23b47964e949189678d3c59a9cb788a05c766ffcf289539acca71f1d','Unreviewed UI hash')
    old,meta=strings[12364]
    require(old==r.strings[12364],'Unexpected base UI string')
    require(html.startswith('<!doctype html>') and html.endswith('</html>'),'HTML boundary')
    encoding=meta['encoding'];raw=html.encode(encoding)
    spare=meta['rawByteLength']-len(raw)
    require(encoding=='utf-16le' and spare>=0 and spare%2==0,'HTML slot fit')
    padded=html+' '*(spare//2);raw=padded.encode(encoding)
    start=meta['byteOffset'];end=start+len(raw)
    for i,(_,m) in enumerate(strings):
        require(i==12364 or m['byteOffset']>=end or m['byteOffset']+m['rawByteLength']<=start,'HTML overlap')
    patched=bytearray(code);patched[start:end]=raw;patched[-20:]=hashlib.sha1(patched[:-20]).digest();patched=bytes(patched)
    ah,ast=decoder.decode_strings(patched)
    require(ah==header,'HTML changed headers')
    require(patched[:start]==code[:start] and patched[end:-20]==code[end:-20],'HTML outside mutation')
    expected_meta=dict(meta,rawSha256=digest(raw))
    for i,(b,c) in enumerate(zip(strings,ast)):
        require(c==(padded,expected_meta) if i==12364 else b==c,'Other string mutation')
    rr=read(patched)
    require(rr.header.functionCount==r.header.functionCount,'Function count changed')
    for fid in (7314,):
        h=r.function_headers[fid];hh=rr.function_headers[fid]
        require(bytes(h)==bytes(hh) and base[h.offset:h.offset+h.bytecodeSizeInBytes]==patched[hh.offset:hh.offset+hh.bytecodeSizeInBytes],'Public602 guard changed')
    (out/'candidate603.hbc').write_bytes(patched)
    report.update(dict(final_hbc_sha256=digest(patched),final_hbc_bytes=len(patched),donors=donors,
        ui=dict(path=str(html_path.relative_to(ROOT)),sha256=digest(html.encode()),encoding=encoding,start=start,end=end,spare_bytes=spare),
        changed_function_ids=[7337,14886,14894],changed_string_ids=[12364],native_payload_changes=False))
    (out/'BUNDLE-RESULT.json').write_text(json.dumps(report,indent=2)+'\n')
    print(json.dumps({k:report[k] for k in ['status','final_hbc_sha256','final_hbc_bytes','changed_function_ids','changed_string_ids']},indent=2))

if __name__=='__main__':main()
