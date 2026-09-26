#!/usr/bin/env python3
"""Build 604 from the exact signed603 host. No APK signing or installation.

Only reviewed function plans and the original fixed-size UI string may change.
The complete603 inference request, model worker and lifecycle guards remain.
"""
import argparse, hashlib, importlib.util, json, zipfile
from pathlib import Path
from hbc_patch import read, require, digest, append_plans

ROOT=Path(__file__).resolve().parents[2]
R4=ROOT/'Solaris-Android-R4'
BASE_APK='25d3642ab5f45986e5dfcfe5c5413d40982c6142eb703adffc391f9d3b033227'

def module(name,path):
    spec=importlib.util.spec_from_file_location(name,path)
    result=importlib.util.module_from_spec(spec);spec.loader.exec_module(result)
    return result

def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('--baseline-apk',type=Path,required=True)
    p.add_argument('--output-dir',type=Path,required=True)
    p.add_argument('--ui',type=Path)
    a=p.parse_args()
    require(digest(a.baseline_apk.read_bytes())==BASE_APK,'Wrong603 APK')
    out=a.output_dir;out.mkdir(parents=True,exist_ok=False)
    with zipfile.ZipFile(a.baseline_apk) as z:base=z.read('assets/index.android.bundle')
    r=read(base,exact_base=True)
    guided=module('guided604',R4/'grounding/build-plans.py')
    plans=guided.plans(r,base,out/'guided-compiler')
    require({p['function_id'] for p in plans}=={6929,14890,14894,14904},'Unexpected functional scope')
    code,report=append_plans(base,plans)
    changed_strings=[]
    if a.ui:
        decoder=module('decoder',ROOT/'Solaris-Android-Reconstruction/reference/601-recovery/v6-apk-recovery/extract_verified_apk.py')
        header,strings=decoder.decode_strings(code)
        html=a.ui.read_text()
        old,meta=strings[12364]
        require(old==r.strings[12364],'Unexpected UI slot')
        require(html.startswith('<!doctype html>') and html.endswith('</html>'),'HTML boundary')
        encoding=meta['encoding'];raw=html.encode(encoding);spare=meta['rawByteLength']-len(raw)
        require(encoding=='utf-16le' and spare>=0 and spare%2==0,'UI slot overflow')
        padded=html+' '*(spare//2);raw=padded.encode(encoding)
        start=meta['byteOffset'];end=start+len(raw)
        for i,(_,m) in enumerate(strings):
            require(i==12364 or m['byteOffset']>=end or m['byteOffset']+m['rawByteLength']<=start,'UI overlap')
        patched=bytearray(code);patched[start:end]=raw;patched[-20:]=hashlib.sha1(patched[:-20]).digest();patched=bytes(patched)
        ah,ast=decoder.decode_strings(patched)
        require(ah==header,'UI changed headers')
        require(patched[:start]==code[:start] and patched[end:-20]==code[end:-20],'UI outside mutation')
        expected_meta=dict(meta,rawSha256=digest(raw))
        for i,(b,c) in enumerate(zip(strings,ast)):
            require(c==(padded,expected_meta) if i==12364 else b==c,'Other string mutation')
        code=patched;changed_strings=[12364]
        report['ui']=dict(path=str(a.ui),sha256=digest(html.encode()),encoding=encoding,start=start,end=end,spare_bytes=spare)
    rr=read(code)
    require(rr.header.functionCount==r.header.functionCount,'Function count changed')
    changed={p['function_id'] for p in plans}
    for fid,(h,hh) in enumerate(zip(r.function_headers,rr.function_headers)):
        if fid in changed:continue
        require(bytes(h)==bytes(hh),'Unexpected function header mutation '+str(fid))
        require(base[h.offset:h.offset+h.bytecodeSizeInBytes]==code[hh.offset:hh.offset+hh.bytecodeSizeInBytes],
                'Unexpected function body mutation '+str(fid))
    (out/'candidate604.hbc').write_bytes(code)
    report.update(final_hbc_sha256=digest(code),final_hbc_bytes=len(code),changed_function_ids=sorted(changed),
                  changed_string_ids=changed_strings,native_payload_changes=False,
                  inference_request_and_worker_unchanged=True,background_lock_and_cancel_unchanged=True)
    (out/'BUNDLE-RESULT.json').write_text(json.dumps(report,indent=2)+'\n')
    print(json.dumps({k:report[k] for k in ('status','final_hbc_sha256','final_hbc_bytes','changed_function_ids','changed_string_ids')},indent=2))

if __name__=='__main__':main()
