#!/usr/bin/env python3
"""Reject donor linking/closure/table expansion and unbounded frame mappings."""
from pathlib import Path
import json,subprocess,sys
HERE=Path(__file__).resolve().parent;ROOT=HERE.parents[2]
sys.path.insert(0,str(ROOT/'Solaris-Android-R3/tools'))
from hbc_patch import read,digest
from hbc_inline import inline_donor
compiler=ROOT/'reconstruction-work/r2-tools/react-native-0.81.5/package/sdks/hermesc/linux64-bin/hermesc'
basepath=ROOT/'Solaris-Android-R2/evidence/guard-patch/completion-guards.hbc'
base=basepath.read_bytes();r=read(base,exact_base=True);results=[]
def donor(code,tag):
 src=HERE/('reject-'+tag+'.js');dest=HERE/('reject-'+tag+'.hbc');src.write_text(code+'\n')
 p=subprocess.run(list(map(str,[compiler,'-O','-g0','-emit-binary','-base-bytecode='+str(basepath),'-out='+str(dest),src])),capture_output=True,text=True)
 p.check_returncode();return read(dest.read_bytes())
def rejects(name,fn):
 try:fn()
 except (ValueError,KeyError) as e:results.append(dict(name=name,result='REJECT',reason=str(e)));return
 raise AssertionError(name+' unexpectedly accepted')
d=donor('function helper(a) { return a; }','identity')
rejects('unmapped parameter',lambda:inline_donor(r,d,14886,1,{},3))
rejects('unallocated original register destination',lambda:inline_donor(r,d,14886,1,{1:3},23))
rejects('scratch overlaps original frame',lambda:inline_donor(r,d,14886,1,{1:3},3,register_start=1))
rejects('oversized frame',lambda:inline_donor(r,d,14886,1,{1:3},3,register_start=127))
d=donor('function helper(a) { return "unapproved-new-string-for-negative603"; }','new-string')
rejects('new donor string',lambda:inline_donor(r,d,14886,1,{1:3},3))
d=donor('function helper(a) { return {message:"hello",type:"user"}; }','literal-buffer')
rejects('donor literal buffer',lambda:inline_donor(r,d,14886,1,{1:3},3))
d=donor('function helper(a) { return function () { return a; }; }','closure')
rejects('donor lexical closure',lambda:inline_donor(r,d,14886,1,{1:3},3))
d=donor('function helper(a) { return /hello/.test(a); }','regexp')
rejects('donor regexp table',lambda:inline_donor(r,d,14886,1,{1:3},3))
(HERE/'inline-failclosed-result.json').write_text(json.dumps(dict(status='PASS',checks=results,baseline_sha256=digest(base)),indent=2)+'\n')
print(json.dumps(dict(status='PASS',checks=len(results))))
