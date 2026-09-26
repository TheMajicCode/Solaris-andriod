#!/usr/bin/env python3
"""Independent synthetic fixture for compiler-inlining/frame argument fidelity.

Never reads or writes any Solaris APK. The low-level synthetic serializer here
exists solely because the production writer deliberately accepts only exact602.
"""
from pathlib import Path
import hashlib,json,struct,subprocess,sys
HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[2]
sys.path.insert(0,str(ROOT/'Solaris-Android-R3/tools'))
from hbc_patch import read,rewrite,digest
from hbc_inline import inline_donor
from hermes_dec.parsers.hbc_bytecode_parser import parse_hbc_bytecode

compiler=ROOT/'reconstruction-work/r2-tools/react-native-0.81.5/package/sdks/hermesc/linux64-bin/hermesc'
vm=ROOT/'reconstruction-work/r2-tools/hermes-build/bin/hvm'
commands=[]
def run(*args):
 p=subprocess.run(list(map(str,args)),capture_output=True,text=True)
 commands.append(dict(args=list(map(str,args)),code=p.returncode,stdout=p.stdout,stderr=p.stderr))
 p.check_returncode();return p.stdout
host=HERE/'inline-host.js'; donor=HERE/'inline-donor.js'
host.write_text('function target(x) { var a=new Date(x); var b=Math.max(x,1,2,3,4,5,6); return a.getTime()+b; }\nJSON.stringify(0).length; print(target(17)); print(target(31));\n')
donor.write_text('function helper(x) { var d=new Date(x); var p=JSON.stringify(x); return Math.max(2,3,4,5,6,7)+d.getTime()+p.length; }\n')
run(compiler,'-O','-g0','-emit-binary','-out='+str(HERE/'inline-host.hbc'),host)
run(compiler,'-O','-g0','-emit-binary','-base-bytecode='+str(HERE/'inline-host.hbc'),'-out='+str(HERE/'inline-donor.hbc'),donor)
b=(HERE/'inline-host.hbc').read_bytes();db=(HERE/'inline-donor.hbc').read_bytes();r=read(b);dr=read(db)
fid=next(i for i,h in enumerate(r.function_headers) if r.strings[h.functionName]=='target')
dfid=next(i for i,h in enumerate(dr.function_headers) if dr.strings[h.functionName]=='helper')
ret=next(op for op in parse_hbc_bytecode(r.function_headers[fid],r) if op.inst.name=='Ret')
nodes,updates,fixups,proof=inline_donor(r,dr,fid,dfid,{1:ret.arg1},ret.arg1,'synthetic')
plan=rewrite(r,b,fid,fixups+[dict(start=ret.original_pos,end=ret.original_pos,nodes=nodes)],updates)
out=bytearray(b[:-20]);h=r.get_small_func_header_reader().from_buffer_copy(bytes(r.function_headers[fid]));h.offset=len(out);out.extend(plan['body']);h.bytecodeSizeInBytes=len(plan['body']);h.infoOffset=len(out)
for k,v in updates.items():setattr(h,k,v)
out[128+16*fid:128+16*(fid+1)]=bytes(h);struct.pack_into('<I',out,32,len(out)+20);out.extend(hashlib.sha1(out).digest());read(bytes(out))
patched=HERE/'inline-patched.hbc';patched.write_bytes(out)
baseline=run(vm,HERE/'inline-host.hbc');actual=run(vm,patched)
assert baseline=='34\n62\n',baseline
assert actual=='43\n71\n',actual
report=dict(status='SYNTHETIC_VM_PASS_NOT_SOLARIS_BEHAVIOR_PROOF',baseline=baseline,patched=actual,inline=proof,functions=plan['report'],
            host_sha256=digest(b),donor_sha256=digest(db),patched_sha256=digest(out),commands=commands,
            verified=['Original Construct argument preserved after caller frame growth','Original generic Math.max argument list preserved','Donor Construct and generic Math.max relative argument positions preserved','Donor explicit calls JSON.stringify/getTime preserved','Returned value reaches original Ret'])
(HERE/'inline-vm-result.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({k:report[k] for k in ['status','baseline','patched']}))
