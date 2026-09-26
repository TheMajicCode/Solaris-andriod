#!/usr/bin/env python3
"""Negative/structural checks of exact602 bounded writer; no APK outputs."""
from pathlib import Path
import copy,hashlib,importlib.util,json,struct,sys
HERE=Path(__file__).resolve().parent;ROOT=HERE.parents[2]
sys.path.insert(0,str(ROOT/'Solaris-Android-R3/tools'))
from hbc_patch import I,Ref,Label,read,rewrite,append_plans,assemble,digest
spec=importlib.util.spec_from_file_location('diag',ROOT/'Solaris-Android-R3/tools/hbc-chat-diagnostics.py');diag=importlib.util.module_from_spec(spec);spec.loader.exec_module(diag)
base=(ROOT/'Solaris-Android-R2/evidence/guard-patch/completion-guards.hbc').read_bytes()
r=read(base,exact_base=True);good=diag.diagnostic_plan(r,base);results=[]
def rejects(name,fn):
 try:fn()
 except (ValueError,KeyError) as e:results.append(dict(name=name,result='REJECT',reason=str(e)));return
 raise AssertionError(name+' unexpectedly accepted')
mutated=bytearray(base);mutated[200]^=1;mutated[-20:]=hashlib.sha1(mutated[:-20]).digest()
rejects('different valid-HBC hash',lambda:read(bytes(mutated),exact_base=True))
rejects('bad footer',lambda:read(base[:-1]+bytes([base[-1]^1])))
rejects('middle-of-opcode insertion',lambda:rewrite(r,base,14894,[dict(start=1485,end=1485,nodes=[])]))
rejects('overlapping edits',lambda:rewrite(r,base,14894,[dict(start=1484,end=1501,nodes=[]),dict(start=1490,end=1490,nodes=[])]))
rejects('deleted branch target',lambda:rewrite(r,base,14894,[dict(start=1484,end=1518,nodes=[I('Throw',5)])]))
rejects('new instruction register overflow',lambda:assemble(r,[I('Mov',256,0)]))
rejects('missing branch label',lambda:assemble(r,[I('JmpLong',Ref('absent'))]))
rejects('label in nonaddress operand',lambda:assemble(r,[I('Mov',Ref('x'),0),Label('x')]))
rejects('duplicate label',lambda:assemble(r,[Label('x'),Label('x')]))
rejects('empty plan list',lambda:append_plans(base,[]))
rejects('duplicate fid',lambda:append_plans(base,[good,good]))
p=copy.deepcopy(good);p['header_updates']['environmentSize']=1
rejects('lexical environment mutation',lambda:append_plans(base,[p]))
p=copy.deepcopy(good);p['header_updates']['frameSize']=1
rejects('frame shrink',lambda:append_plans(base,[p]))
p=copy.deepcopy(good);p['body']=p['body']+b'\0'
rejects('body changed after report',lambda:append_plans(base,[p]))
p=copy.deepcopy(good);p['exceptions'][0]=(0,1,3)
rejects('exception record changed after report',lambda:append_plans(base,[p]))
p=rewrite(r,base,14886,[dict(start=597,end=599,nodes=[I('JmpLong',Ref('old:599'))])])
rejects('branch target at function EOF',lambda:append_plans(base,[p]))
p=copy.deepcopy(good);p['exceptions'][0]=(p['exceptions'][0][0],p['exceptions'][0][1],len(p['body']))
p['report']['new_exceptions']=p['exceptions']
rejects('exception handler target at function EOF',lambda:append_plans(base,[p]))
p=rewrite(r,base,14894,[dict(start=1484,end=1484,nodes=[I('Mov',100,0)])])
rejects('encoded register outside actual frame',lambda:append_plans(base,[p]))
body,labels=assemble(r,[Label('start'),I('Jmp',Ref('end'))]+[I('LoadConstZero',0)]*70+[I('Jmp',Ref('start')),Label('end'),I('Ret',0)])
wide=next(x for x in r.parser_module._instructions if x.name=='JmpLong')
assert body[0]==wide.opcode and struct.unpack_from('<i',body,1)[0]==labels['end']
back=labels['end']-wide.binary_size
assert body[back]==wide.opcode and struct.unpack_from('<i',body,back+1)[0]==-back
results.append(dict(name='forward/backward Addr8 widening with target fidelity',result='PASS',forward=labels['end'],backward=-back))
out,report=append_plans(base,[good]);rr=read(out)
for fid in [7314,7337]:
 a=r.function_headers[fid];b=rr.function_headers[fid]
 assert bytes(a)==bytes(b) and base[a.offset:a.offset+a.bytecodeSizeInBytes]==out[b.offset:b.offset+b.bytecodeSizeInBytes]
assert rr.strings==r.strings and rr.string_kinds==r.string_kinds
results.append(dict(name='actual602 diagnostics preservation',result='PASS',code602_guards_unchanged=True,all_existing_strings_ids_unchanged=True))
(HERE/'writer-failclosed-result.json').write_text(json.dumps(dict(status='PASS',checks=results,input_sha256=digest(base),diagnostics_hbc_sha256=digest(out)),indent=2)+'\n')
print(json.dumps(dict(status='PASS',checks=len(results))))
