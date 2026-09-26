import subprocess,json,pathlib,time,hashlib
root=pathlib.Path(__file__).parent
(root/'results').mkdir(exist_ok=True)
results=[]
for p in sorted((root/'fixtures').glob('plaintext-*.json')):
 start=time.time()
 try:
  r=subprocess.run([str(root/'runtime/bin/bare'),str(root/'native-fixture-runner.cjs'),str(p.resolve())],capture_output=True,text=True,timeout=22,cwd=root)
  log=root/'results'/(p.stem+'.log');log.write_text(r.stdout+r.stderr)
  events=[]
  for line in r.stdout.splitlines():
   try:events.append(json.loads(line))
   except:pass
  terminal=next((e for e in events if e.get('type')=='done'),None)
  parsed=None
  if terminal:
   try:parsed=json.loads(terminal['output'])
   except:pass
  record={'name':p.stem,'exitCode':r.returncode,'wallSeconds':round(time.time()-start,3),'nativeTerminal':terminal,'parsed':parsed,'requiredKeysPresent':isinstance(parsed,dict) and isinstance(parsed.get('message'),str) and isinstance(parsed.get('sourceRefs'),list)}
 except Exception as e:record={'name':p.stem,'error':str(e)}
 results.append(record);print(json.dumps(record),flush=True)
 (root/'results/plaintext-summary.json').write_text(json.dumps({'scope':'Linux native addon only, same pinned model, no Android RPC or phone performance claim','results':results},indent=2))
