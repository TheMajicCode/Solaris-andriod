#!/usr/bin/env python3
"""TEST ONLY. Build a synthetic lexical environment around unchanged F6929.
Replaces only bootstrap F0, F1 and F2. Never ship this HBC.
"""
import sys,json,hashlib,struct,pathlib
HERE=pathlib.Path(__file__).resolve().parent;R4=HERE.parent
sys.path.insert(0,str(R4/'tools'));sys.path.insert(1,str(R4.parent/'Solaris-Android-R3/tools'))
from hbc_patch import read,fields,assemble,I
p=pathlib.Path(sys.argv[1]);out=pathlib.Path(sys.argv[2]);data=p.read_bytes();r=read(data)
sid=lambda s:r.strings.index(s)
# Create a module-scope environment then an app-scope function. Environment
# slots are filled from arrays provided by synthetic JS fixtures.
def env_nodes(key,slots):
 nodes=[I('CreateEnvironment',0),I('GetGlobalObject',1),I('GetById',2,1,1,sid('test')),I('GetById',3,2,2,sid(key))]
 for slot in slots:
  nodes += [I('LoadConstUInt8',4,slot),I('GetByVal',5,3,4),I('StoreToEnvironment',0,slot,5)]
 return nodes
f0=env_nodes('module',range(20))+[I('CreateClosure',6,0,1),I('LoadConstUndefined',7),I('Call1',6,6,7),I('LoadConstString',3,sid('receive')),I('PutByVal',2,3,6),I('Ret',7)]
f1=env_nodes('entries',range(34))+[I('CreateClosure',6,0,2),I('LoadConstUndefined',7),I('Call1',6,6,7),I('Ret',6)]
f2=[I('CreateEnvironment',0),I('CreateGeneratorClosure',0,0,6928),I('Ret',0)]
mutable=bytearray(data[:-20]);changed=[]
for fid,nodes,envsize in [(0,f0,20),(1,f1,34),(2,f2,0)]:
 body,_=assemble(r,nodes);h=r.get_small_func_header_reader().from_buffer_copy(bytes(r.function_headers[fid]));before=fields(h)
 h.offset=len(mutable);h.bytecodeSizeInBytes=len(body);h.environmentSize=envsize;h.frameSize=20;h.highestReadCacheIndex=2;h.highestWriteCacheIndex=1;h.paramCount=1;h.hasExceptionHandler=0;h.hasDebugInfo=0
 mutable.extend(body);mutable.extend(b'\0'*(-len(mutable)%4));h.infoOffset=len(mutable)
 mutable[128+fid*16:128+(fid+1)*16]=bytes(h);changed.append({'fid':fid,'before':before,'after':fields(h)})
struct.pack_into('<I',mutable,32,len(mutable)+20);mutable.extend(hashlib.sha1(mutable).digest());result=bytes(mutable);rr=read(result)
# Body, generator factory and EH rows are exact candidate bytes, not recreated.
for fid in [6928,6929]:
 a=r.function_headers[fid];b=rr.function_headers[fid]
 assert bytes(a)==bytes(b)
 assert data[a.offset:a.offset+a.bytecodeSizeInBytes]==result[b.offset:b.offset+b.bytecodeSizeInBytes]
out.write_bytes(result)
sha=lambda b:hashlib.sha256(b).hexdigest()
report={'scope':'TEST ONLY lexical wrapper; F6928/F6929 headers, bodies and exception tables unchanged from candidate. Bootstrap F0/F1/F2 synthetic, do not ship.','candidate':str(p),'candidateSHA256':sha(data),'testCloneSHA256':sha(result),'changed':changed,'F6929_bodySHA256':sha(data[r.function_headers[6929].offset:r.function_headers[6929].offset+r.function_headers[6929].bytecodeSizeInBytes])}
out.with_suffix('.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2))
