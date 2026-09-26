import urllib.request,json,pathlib,hashlib,tarfile,concurrent.futures,base64
out=pathlib.Path(__file__).parent/'acquired';out.mkdir(exist_ok=True)
def fetch(task):
 name,url,digest=task
 p=out/name
 try:
  with urllib.request.urlopen(url,timeout=45) as r,p.open('wb') as f:
   while True:
    b=r.read(1024*1024)
    if not b:break
    f.write(b)
  sha=hashlib.sha256(p.read_bytes()).hexdigest()
  result={'name':name,'url':url,'sha256':sha,'size':p.stat().st_size,'expectedSha256':digest,'matchesExpected':sha==digest if digest else None}
  if digest and sha!=digest:raise Exception('Digest mismatch')
  print(json.dumps(result),flush=True); return result
 except Exception as e:
  result={'name':name,'url':url,'error':str(e)};print(json.dumps(result),flush=True);return result
tasks=[
 ('llm-llamacpp-0.45.0.tgz','https://registry.npmjs.org/@qvac/llm-llamacpp/-/llm-llamacpp-0.45.0.tgz',None),
 ('Qwen3-0.6B-Q4_0.gguf','https://huggingface.co/unsloth/Qwen3-0.6B-GGUF/resolve/50968a4468ef4233ed78cd7c3de230dd1d61a56b/Qwen3-0.6B-Q4_0.gguf','33bcc57074ec7b6eada5a90651ee546ec0c2b271002c22baf9f1b2dd1e8f75cb'),
 ('bare-1.24.0.tgz','https://registry.npmjs.org/bare/-/bare-1.24.0.tgz',None)]
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as ex:results=list(ex.map(fetch,tasks))
(out/'acquisition.json').write_text(json.dumps(results,indent=2)+'\n')
