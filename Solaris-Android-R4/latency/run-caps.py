import subprocess,json,pathlib,time,hashlib
root=pathlib.Path(__file__).parent.resolve()
probe=root.parents[2]/'solaris-603-native-probe'
results=[]
for p in sorted((root/'fixtures').glob('*.json')):
 if not(p.stem.startswith('caps604-') or p.stem in ['base603-many','base603-long','base603-spanish']):continue
 start=time.time()
 try:
  r=subprocess.run([str(probe/'runtime/bin/bare'),str(probe/'native-fixture-runner.cjs'),str(p)],capture_output=True,text=True,timeout=22,cwd=probe)
  log=root/'results'/(p.stem+'.log');log.write_text(r.stdout+r.stderr)
  events=[]
  for line in r.stdout.splitlines():
   try:events.append(json.loads(line))
   except:pass
  terminal=next((e for e in events if e.get('type')=='done'),None)
  loaded=next((e for e in events if e.get('type')=='loaded'),None)
  parsed=None
  if terminal:
   try:parsed=json.loads(terminal['output'])
   except:pass
  record={'name':p.stem,'exitCode':r.returncode,'wallSeconds':round(time.time()-start,3),'loaded':loaded,'nativeTerminal':terminal,'parsed':parsed,'requiredKeysPresent':isinstance(parsed,dict) and isinstance(parsed.get('message'),str) and isinstance(parsed.get('sourceRefs'),list)}
 except Exception as e:record={'name':p.stem,'error':str(e)}
 results.append(record)
 print(json.dumps({'name':record['name'],'valid':record.get('requiredKeysPresent'), 'output':record.get('parsed'),'ms':record.get('nativeTerminal',{}).get('ms'),'tokens':record.get('nativeTerminal',{}).get('data',{}).get('generatedTokens'),'error':record.get('error')}),flush=True)
 (root/'caps-native-summary.json').write_text(json.dumps({'scope':'Linux native addon only; exact pinned model; no Android RPC or phone performance claim','results':results},indent=2))
