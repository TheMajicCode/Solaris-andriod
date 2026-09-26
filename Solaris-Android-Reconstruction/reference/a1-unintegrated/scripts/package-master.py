"""Assemble a new master checkpoint without changing previous artifacts."""
from pathlib import Path
import hashlib
import json
import shutil
import subprocess
import zipfile

root=Path(__file__).resolve().parents[1]
workspace=root.parent
out=workspace/'v6-master-deliverables'
out.mkdir(exist_ok=True)
latest=out/'Solaris-V6-A1-Lifecycle-Integration-Candidate.zip'
master=out/'Solaris-V6-Recovery-Master-Checkpoint.zip'
if latest.exists() or master.exists():
    raise SystemExit('Existing checkpoints preserved; choose a new output location.')
def digest(path): return hashlib.sha256(path.read_bytes()).hexdigest()

expected='11dc0d090ba14f5ad3e79fe388d6a60a2e8ad9991b6dd1bebc5516c0f0ab4530'
if digest(root/'src/active-qvac.mjs')!=expected:
    raise SystemExit('Helper differs from independently reviewed candidate.')
if expected not in (root/'review/INDEPENDENT-REVIEW.md').read_text():
    raise SystemExit('Review does not identify final helper.')
files=sorted(p for p in root.rglob('*') if p.is_file() and '.git' not in p.relative_to(root).parts
             and '__pycache__' not in p.relative_to(root).parts and p.name!='CHECKPOINT-MANIFEST.json')
entries=[{'path':p.relative_to(root).as_posix(),'bytes':p.stat().st_size,'sha256':digest(p)} for p in files]
manifest={'format':'solaris-a1-recovered-lifecycle-checkpoint/1',
          'classification':'Source-independent integration candidate; not original native project or APK',
          'helperSha256':expected,'nativeBuildRun':False,'deviceTestsRun':False,'files':entries}
manifest_path=root/'CHECKPOINT-MANIFEST.json'
manifest_path.write_text(json.dumps(manifest,indent=2)+'\n')
subprocess.run(['python3',str(root/'scripts/verify-checkpoint.py')],check=True)
with zipfile.ZipFile(latest,'x',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
    for p in files+[manifest_path]:z.write(p,'Solaris-V6-A1-Reconciliation/'+p.relative_to(root).as_posix())
with zipfile.ZipFile(latest) as z:
    if z.testzip() is not None: raise SystemExit('Latest ZIP failed integrity check.')
    for item in entries:
        if hashlib.sha256(z.read('Solaris-V6-A1-Reconciliation/'+item['path'])).hexdigest()!=item['sha256']:
            raise SystemExit('Archived source mismatch: '+item['path'])

archives=[
 ('01-A1-Lifecycle-Integration-Candidate.zip',latest,None),
 ('02-V6-APK-Recovered-Assets-and-Evidence.zip',workspace/'v6-apk-deliverables/Solaris-V6-APK-Recovered-Assets-and-Evidence.zip','44def3c89020e499564eeda41f8a659f840128a2b48625632184e1a6372b62c9'),
 ('03-Reviewed-UI-Repair-and-Evidence.zip',workspace/'v6-repair-deliverables/Solaris-V6-Recovered-UI-Repair-and-Evidence.zip','61ab3c8a31a50dd3bd5fc751a25af9fc37829b43f38196fcf1280bfe557d5da3'),
 ('04-Identity-GPS-Preparation.zip',workspace/'v61-deliverables/Solaris-V6-Continuation-Recovery-and-Protocol.zip',None)]
recorded={item['path']:item['sha256'] for item in json.loads((root/'evidence/PRESERVED-INPUTS.json').read_text())['files']}
inner=[]
for name,p,expected_hash in archives:
    actual=digest(p)
    required=expected_hash or recorded.get(str(p.resolve()))
    if required and required!=actual:raise SystemExit('Changed prior archive: '+name)
    inner.append(actual+'  '+name)
with zipfile.ZipFile(master,'x',zipfile.ZIP_STORED) as z:
    prefix='Solaris-V6-Recovery-Master/'
    for name,p,_ in archives:z.write(p,prefix+name)
    z.write(root/'MASTER-START-HERE.md',prefix+'START-HERE.md')
    z.writestr(prefix+'INNER-SHA256SUMS.txt','\n'.join(inner)+'\n')
with zipfile.ZipFile(master) as z:
    if z.testzip() is not None:raise SystemExit('Master ZIP failed integrity check.')
    for name,p,_ in archives:
        if hashlib.sha256(z.read(prefix+name)).hexdigest()!=digest(p):raise SystemExit('Nested archive mismatch')
guide=out/'Solaris-V6-Recovery-Master-Start-Here.md'
shutil.copyfile(root/'MASTER-START-HERE.md',guide)
checks=out/'Solaris-V6-Recovery-Master-SHA256SUMS.txt'
checks.write_text('\n'.join(digest(p)+'  '+p.name for p in [master,latest,guide])+'\n')
print(json.dumps({'files':[{'path':str(p),'bytes':p.stat().st_size,'sha256':digest(p)} for p in [master,latest,guide,checks]],'innerFileCount':len(entries)+1,'nativeBuildRun':False},indent=2))
