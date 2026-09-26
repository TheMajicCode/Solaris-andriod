#!/usr/bin/env python3
"""Independent read-only structural comparison of604 against exact603."""
from pathlib import Path
from io import BytesIO
import argparse,ctypes,hashlib,json,sys
HERE=Path(__file__).resolve().parent;ROOT=HERE.parents[1]
sys.path.insert(0,str(ROOT/'reconstruction-work/toolchain/hermes-dec-a0f18f97ab661eb8ed659c8c683a0d21ea619e69/src'))
from hermes_dec.parsers.hbc_file_parser import HBCReader
from hermes_dec.parsers.hbc_bytecode_parser import parse_hbc_bytecode
p=argparse.ArgumentParser();p.add_argument('bundle',type=Path);p.add_argument('--output',type=Path,required=True);p.add_argument('--ui',type=Path);a=p.parse_args()
basepath=ROOT/'Solaris-Android-R3/evidence/candidate-06/candidate603.hbc';base=basepath.read_bytes();candidate=a.bundle.read_bytes()
sha=lambda x:hashlib.sha256(x).hexdigest()
assert sha(base)=='b8ac7d1b58d9e8ea6eadd25de516e35842aea14e4b849462664bb3200fedc990'
def reader(data):
 assert hashlib.sha1(data[:-20]).digest()==data[-20:]
 r=HBCReader();r.read_whole_file(BytesIO(data));assert r.header.version==96 and r.header.fileLength==len(data);return r
b,c=reader(base),reader(candidate);allowed={6929,14890,14894,14904}
assert b.header.functionCount==c.header.functionCount and b.header.stringCount==c.header.stringCount
assert b.string_kinds==c.string_kinds
strings=[i for i,(x,y) in enumerate(zip(b.strings,c.strings)) if x!=y]
assert strings==([12364] if a.ui else [])
if a.ui: assert c.strings[12364].rstrip()==a.ui.read_text().rstrip()
changed=[];details=[]
for fid,(x,y) in enumerate(zip(b.function_headers,c.function_headers)):
 old=base[x.offset:x.offset+x.bytecodeSizeInBytes];new=candidate[y.offset:y.offset+y.bytecodeSizeInBytes]
 if bytes(x)!=bytes(y) or old!=new:changed.append(fid)
 else:continue
 assert fid in allowed
 for key in ['paramCount','functionName','environmentSize','prohibitInvoke','strictMode','hasExceptionHandler','hasDebugInfo','overflowed','kind']:
  assert getattr(x,key)==getattr(y,key),(fid,key)
 assert y.frameSize<128 and y.offset>=len(base)-20
 ops=list(parse_hbc_bytecode(y,c));bounds={op.original_pos for op in ops};assert ops[-1].next_pos==y.bytecodeSizeInBytes
 branches=registers=0
 for op in ops:
  for i,arg in enumerate(op.inst.operands,1):
   value=getattr(op,'arg'+str(i));typ=arg.operand_type.name
   if typ in ['Reg8','Reg32']:assert value<y.frameSize;(registers:=registers+1)
   if typ in ['Addr8','Addr32']:assert op.original_pos+value in bounds;(branches:=branches+1)
 exceptions=c.function_id_to_exc_handlers.get(fid,[])
 assert len(exceptions)==len(b.function_id_to_exc_handlers.get(fid,[]))
 for eh in exceptions:
  assert eh.start in bounds and eh.target in bounds and eh.end in bounds|{y.bytecodeSizeInBytes}
  assert eh.start<eh.end
 details.append({'functionId':fid,'frameBefore':x.frameSize,'frameAfter':y.frameSize,'registerOperandsChecked':registers,'branchTargetsChecked':branches,'exceptionHandlersChecked':len(exceptions),'bodySha256':sha(new)})
assert set(changed)==allowed
# Compare unchanged original data across the entire binary, except the known
# header fields and the fixed UI slot. New bodies are append-only.
mutable=[(32,36)]+[(128+16*fid,128+16*(fid+1)) for fid in sorted(allowed)]
if a.ui:
 import importlib.util
 q=ROOT/'Solaris-Android-Reconstruction/reference/601-recovery/v6-apk-recovery/extract_verified_apk.py'
 spec=importlib.util.spec_from_file_location('independent_decoder',q);decoder=importlib.util.module_from_spec(spec);spec.loader.exec_module(decoder)
 _,strs=decoder.decode_strings(base);meta=strs[12364][1];mutable.append((meta['byteOffset'],meta['byteOffset']+meta['rawByteLength']))
mutable.sort();cursor=0
for start,end in mutable:
 assert start>=cursor
 assert base[cursor:start]==candidate[cursor:start],('outside approved ranges',cursor,start)
 cursor=end
assert base[cursor:-20]==candidate[cursor:len(base)-20]
result={'pass':True,'baseSha256':sha(base),'candidateSha256':sha(candidate),'candidateBytes':len(candidate),'changedFunctionIds':changed,'changedStringIds':strings,'unchangedFunctions':len(b.function_headers)-len(allowed),'originalBytesOutsideApprovedRangesIdentical':True,'functionChecks':details,'mutableOriginalRanges':mutable,'limitations':['Same pinned HBC parser as build tooling; independent comparison/assertion code.','Structural check supplements execution tests and cannot prove all Android behavior.']}
a.output.parent.mkdir(parents=True,exist_ok=True);a.output.write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))
