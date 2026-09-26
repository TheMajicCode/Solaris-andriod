from pathlib import Path
import hashlib,json,zipfile,struct,subprocess,sys
root=Path('/workspace/scratch/7a1f5a13b137')
base=root/'apk-602-download/Solaris-V6.0.2-Sanctuary-Guards-Candidate.apk'
work=root/'solaris-603-work'
candidate=Path(sys.argv[1]) if len(sys.argv)>1 else work/'Solaris-Android-R3/evidence/packaging-candidate-03/candidate-aligned-unsigned.apk'
output=Path(sys.argv[2]) if len(sys.argv)>2 else Path(__file__).parent/'packaging-independent-unsigned.json'
tools=work/'reconstruction-work/toolchain/android-tools'
sha=lambda b:hashlib.sha256(b).hexdigest()
checks=[]
def check(n,c):
 if not c:raise AssertionError(n)
 checks.append(n)
def h(p):
 with p.open('rb') as f:return hashlib.file_digest(f,'sha256').hexdigest()
candidate_hash_start=h(candidate)
check('baseline602 exact hash',h(base)=='01da9f5281f5f92230dcbd64da62484557cc7a0a15e876cc2d99ec7ec3bcd2cd')
with zipfile.ZipFile(base) as a,zipfile.ZipFile(candidate) as b:
 an=a.namelist();bn=b.namelist();check('unique same602 archive entry set',len(an)==len(set(an))==len(bn)==len(set(bn))==602 and set(an)==set(bn))
 changed=[];native=[]
 with candidate.open('rb') as f:
  for name in an:
   av=a.read(name);bv=b.read(name)
   ai=a.getinfo(name);bi=b.getinfo(name)
   check('compression '+name,ai.compress_type==bi.compress_type)
   if av!=bv:changed.append(name)
   if name.startswith('lib/') and name.endswith('.so'):
    check('native exact '+name,av==bv and bi.compress_type==0)
    f.seek(bi.header_offset);hdr=f.read(30);nl,el=struct.unpack_from('<HH',hdr,26);offset=bi.header_offset+30+nl+el
    check('native stored16K '+name,offset%16384==0);native.append({'name':name,'offset':offset,'sha256':sha(bv)})
 check('only three changed payloads',set(changed)=={'AndroidManifest.xml','assets/app.config','assets/index.android.bundle'})
 check('599 original payloads preserved',len(an)-len(changed)==599)
 check('51 native libraries',len(native)==51)
 check('final reviewed HBC',sha(b.read('assets/index.android.bundle'))=='7233230f3cd6843345d0e7267469f72c9fe81eb6b5488830339dc4274f82dfd6')
 old=json.loads(a.read('assets/app.config'));new=json.loads(b.read('assets/app.config'))
 check('original app version identity',old['version']=='6.0.2-preview.sanctuary-guards' and old['android']['versionCode']==602)
 check('package unchanged',new['android']['package']==old['android']['package']=='org.solarishealth.edge.recovery')
 old['version']='6.0.3-preview.pocket-chat';old['android']['versionCode']=603
 check('config version only',old==new)
 def parse_pool(data):
  count,styles,flags,start,style_start=struct.unpack_from('<5I',data,16);size=struct.unpack_from('<I',data,12)[0]
  strs=[]
  for i in range(count):
   off=struct.unpack_from('<I',data,36+i*4)[0];p=8+start+off;n=struct.unpack_from('<H',data,p)[0];strs.append(data[p+2:p+2+n*2].decode('utf-16-le'))
  return size,strs
 am=a.read('AndroidManifest.xml');bm=b.read('AndroidManifest.xml');alen,astr=parse_pool(am);blen,bstr=parse_pool(bm)
 check('manifest string pool onlyversion',len(astr)==len(bstr)==112 and [i for i,(x,y) in enumerate(zip(astr,bstr)) if x!=y]==[35] and bstr[35]=='6.0.3-preview.pocket-chat')
 # Different relative pool lengths must explain the relocation; locate exact typed root attributes independently.
 def root_attrs(data,strings):
  at=8
  while at<len(data):
   typ,hs,sz=struct.unpack_from('<HHI',data,at)
   if typ==0x102:
    ns,name,attrs,stride,num=struct.unpack_from('<IIHHH',data,at+16)
    if strings[name]=='manifest':
     out={}
     for i in range(num):
      p=at+16+attrs+i*stride;an,ak,raw,vs,res,vt,val=struct.unpack_from('<IIIHBBI',data,p);out[strings[ak]]=(an,raw,vs,res,vt,val,p+16)
     return out
   at+=sz
  raise AssertionError('missing root')
 aa=root_attrs(am,astr);ba=root_attrs(bm,bstr)
 check('manifest typed version code',aa['versionCode'][5]==602 and ba['versionCode'][5]==603)
 norm=bytearray(am[8+alen:]);struct.pack_into('<I',norm,aa['versionCode'][6]-(8+alen),603)
 check('every other AXML node byte identical',bytes(norm)==bm[8+blen:])
 check('AXML total size consistent',struct.unpack_from('<I',bm,4)[0]==len(bm))
commands={}
def run(label,args):
 r=subprocess.run(args,capture_output=True,text=True);commands[label]={'returncode':r.returncode,'stdout':r.stdout,'stderr':r.stderr};return r
r=run('baseline_signature',['java','-jar',str(tools/'lib/apksigner.jar'),'verify','--verbose','--print-certs',str(base)])
check('baseline verified existing certificate',r.returncode==0 and 'Signer #1 certificate SHA-256 digest: fac61745dc0903786fb9ede62a962b399f7348f0bb6f899b8332667591033b9c' in r.stdout and 'Verified using v2 scheme (APK Signature Scheme v2): true' in r.stdout)
r=run('candidate_alignment',[str(tools/'zipalign'),'-c','-P','16','4',str(candidate)]);check('independent zipalign16K check',r.returncode==0)
ar=run('baseline_tree',[str(tools/'aapt2'),'dump','xmltree',str(base),'--file','AndroidManifest.xml']);br=run('candidate_tree',[str(tools/'aapt2'),'dump','xmltree',str(candidate),'--file','AndroidManifest.xml'])
expected=ar.stdout.replace('6.0.2-preview.sanctuary-guards','6.0.3-preview.pocket-chat').replace('versionCode(0x0101021b)=602','versionCode(0x0101021b)=603')
check('independent aapt2 semantic tree version only',ar.returncode==br.returncode==0 and br.stdout==expected)
br=run('candidate_badging',[str(tools/'aapt2'),'dump','badging',str(candidate)]);check('aapt2 final package and603 identity',br.returncode==0 and "name='org.solarishealth.edge.recovery' versionCode='603' versionName='6.0.3-preview.pocket-chat'" in br.stdout)
sr=run('candidate_signature',['java','-jar',str(tools/'lib/apksigner.jar'),'verify','--verbose','--print-certs',str(candidate)])
signed='--signed' in sys.argv
if signed:
 check('signedcandidate signature verifies',sr.returncode==0)
 check('signedcandidate certificate matches',sr.stdout.count('certificate SHA-256 digest:')==1 and 'Signer #1 certificate SHA-256 digest: fac61745dc0903786fb9ede62a962b399f7348f0bb6f899b8332667591033b9c' in sr.stdout)
 check('signedcandidate v2 only',all(x in sr.stdout for x in ['Verified using v1 scheme (JAR signing): false','Verified using v2 scheme (APK Signature Scheme v2): true','Verified using v3 scheme (APK Signature Scheme v3): false','Verified using v3.1 scheme (APK Signature Scheme v3.1): false','Verified using v4 scheme (APK Signature Scheme v4): false']))
else:check('unsignedcandidate has no accepted signature',sr.returncode!=0)
check('candidate bytes stable across verification',h(candidate)==candidate_hash_start)
report={'reviewer':'native_chat_repro independent packaging review','candidate':str(candidate),'candidateSha256':h(candidate),'candidateBytes':candidate.stat().st_size,'baselineSha256':h(base),'hbcSha256':'7233230f3cd6843345d0e7267469f72c9fe81eb6b5488830339dc4274f82dfd6','signedVerified':signed,'checksPassed':len(checks),'checks':checks,'changed':changed,'native':native,'commands':commands}
output.write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({k:report[k] for k in ['candidateSha256','candidateBytes','checksPassed','changed','signedVerified']}))
