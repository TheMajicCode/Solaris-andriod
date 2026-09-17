#!/usr/bin/env python3
"""Synthetic proof: append expanded existing function after legacy debug block.

Only reads independently authored host.js in this directory. No Solaris input.
"""
from pathlib import Path
from io import BytesIO
import ctypes, hashlib, json, struct, subprocess, sys
HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[3]
sys.path.insert(0,str(ROOT/'reconstruction-work/toolchain/hermes-dec-a0f18f97ab661eb8ed659c8c683a0d21ea619e69/src'))
from hermes_dec.parsers.hbc_file_parser import HBCReader
from hermes_dec.parsers.hbc_bytecode_parser import parse_hbc_bytecode
COMPILER = ROOT/'reconstruction-work/r2-tools/react-native-0.81.5/package/sdks/hermesc/linux64-bin/hermesc'
VM = ROOT/'reconstruction-work/r2-tools/hermes-build/bin/hvm'
logs=[]
def run(*cmd):
 p=subprocess.run(list(map(str,cmd)),capture_output=True,text=True)
 logs.append(dict(args=list(map(str,cmd)),returncode=p.returncode,stdout=p.stdout,stderr=p.stderr))
 p.check_returncode();return p.stdout
def read(data):
 r=HBCReader();r.read_whole_file(BytesIO(data));return r
run(COMPILER,'-O','-g0','-emit-binary','-out='+str(HERE/'narrow-base.hbc'),HERE/'host.js')
b=(HERE/'narrow-base.hbc').read_bytes();r=read(b)
fid=next(i for i,h in enumerate(r.function_headers) if r.strings[h.functionName]=='preserved')
h=r.function_headers[fid]
assert not h.hasDebugInfo and not h.overflowed
table={i.name:i for i in r.parser_module._instructions}
def ins(name,*args):
 i=table[name];s=i.structure()
 for n,v in enumerate(args,1):setattr(s,'arg%d'%n,v)
 return bytes([i.opcode])+bytes(s)
boundary=3
guard=ins('LoadConstUInt8',1,3)+ins('JStrictNotEqual',10,0,1)+ins('LoadConstString',0,r.strings.index('old:'))+ins('Ret',0)
assert len(guard)==13
ops=list(parse_hbc_bytecode(h,r));new=bytearray()
def moved(x):return x+(len(guard) if x>=boundary else 0)
for op in ops:
 if op.original_pos==boundary:new.extend(guard)
 args=[getattr(op,'arg%d'%(i+1)) for i in range(len(op.inst.operands))]
 for i,o in enumerate(op.inst.operands):
  if o.operand_type.name in ('Addr8','Addr32'):
   oldtarget=op.original_pos+args[i]
   args[i]=(boundary if oldtarget==boundary else moved(oldtarget))-moved(op.original_pos)
 new.extend(ins(op.inst.name,*args))
out=bytearray(b[:-20]);nh=r.get_small_func_header_reader().from_buffer_copy(bytes(h))
nh.offset=len(out);nh.bytecodeSizeInBytes=len(new);out.extend(new)
out.extend(b'\0'*((-len(out))%4));nh.infoOffset=len(out)
eh=[(moved(e.start),moved(e.end),moved(e.target)) for e in r.function_id_to_exc_handlers[fid]]
out.extend(struct.pack('<I',len(eh)))
for e in eh:out.extend(struct.pack('<III',*e))
start=128+16*fid;out[start:start+16]=bytes(nh)
struct.pack_into('<I',out,32,len(out)+20);out.extend(hashlib.sha1(out).digest())
nr=read(bytes(out));assert nr.header.debugInfoOffset==r.header.debugInfoOffset
assert out[36:start]==b[36:start] and out[start+16:len(b)-20]==b[start+16:-20]
(HERE/'narrow-appended.hbc').write_bytes(out)
before=run(VM,HERE/'narrow-base.hbc');after=run(VM,HERE/'narrow-appended.hbc')
assert before=='retained:6\nretained exception\nold:5\n'
assert after=='old:\nretained exception\nold:5\n'
report=dict(status='PASS',scope='Independently authored synthetic fixture only',original_output=before,appended_output=after,
 function_id=fid,old_offset=h.offset,new_offset=nh.offset,old_size=h.bytecodeSizeInBytes,new_size=nh.bytecodeSizeInBytes,
 debug_info_offset=r.header.debugInfoOffset,body_follows_original_debug=True,
 preserved_original_bytes_except_fileLength_and_one_header=True,new_exception_table=eh,command_results=logs)
(HERE/'narrow-result.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({k:report[k] for k in ('status','original_output','appended_output','body_follows_original_debug')}))
