"""Restore public, hash-pinned Linux-only probe inputs; never install to a device."""
from pathlib import Path
from urllib.request import urlopen
import hashlib,tarfile,json
root=Path(__file__).resolve().parent
manifest=json.loads((root/'PROBE-INPUTS-MANIFEST.json').read_text())
expected={x['path']:x['sha256'] for x in manifest['files']}
targets=[
 ('acquired/Qwen3-0.6B-Q4_0.gguf','https://huggingface.co/unsloth/Qwen3-0.6B-GGUF/resolve/50968a4468ef4233ed78cd7c3de230dd1d61a56b/Qwen3-0.6B-Q4_0.gguf'),
 ('acquired/llm-llamacpp-0.45.0.tgz','https://registry.npmjs.org/@qvac/llm-llamacpp/-/llm-llamacpp-0.45.0.tgz'),
 ('acquired/bare-runtime-linux-x64-1.28.0.tgz','https://registry.npmjs.org/bare-runtime-linux-x64/-/bare-runtime-linux-x64-1.28.0.tgz')]
def digest(p):
 h=hashlib.sha256()
 with p.open('rb') as f:
  for b in iter(lambda:f.read(1024*1024),b''):h.update(b)
 return h.hexdigest()
for name,url in targets:
 p=root/name;p.parent.mkdir(exist_ok=True)
 if not p.exists() or digest(p)!=expected[name]:
  temp=p.with_suffix(p.suffix+'.part')
  with urlopen(url,timeout=60) as r,temp.open('wb') as f:
   for b in iter(lambda:r.read(1024*1024),b''):f.write(b)
  if digest(temp)!=expected[name]:raise RuntimeError('Digest mismatch for '+name)
  temp.replace(p)
 print('Verified',name)
with tarfile.open(root/'acquired/bare-runtime-linux-x64-1.28.0.tgz') as t:
 p=root/'runtime/bin/bare';p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(t.extractfile('package/bin/bare').read());p.chmod(0o755)
 if digest(p)!=expected['runtime/bin/bare']:raise RuntimeError('Runtime digest mismatch')
with tarfile.open(root/'acquired/llm-llamacpp-0.45.0.tgz') as t:
 for m in t:
  if m.isfile() and m.name.startswith('package/prebuilds/linux-x64/'):
   suffix=m.name[len('package/'):];p=root/'reference-worker/node_modules/@qvac/llm-llamacpp'/suffix
   p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(t.extractfile(m).read())
   key=str(p.relative_to(root))
   if digest(p)!=expected[key]:raise RuntimeError('Addon digest mismatch: '+key)
print('Probe inputs restored. Run node sdk-source-probe.mjs and python run-actual-fixtures.py.')
