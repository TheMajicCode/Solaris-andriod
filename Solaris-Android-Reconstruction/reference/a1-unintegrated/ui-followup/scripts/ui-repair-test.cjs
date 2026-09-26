'use strict';
// Exercises exact functions extracted from the candidate, using synthetic bridge responses.
// No Android runtime, real vault, microphone, model or phone is executed.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'candidate/sanctuary.html'),'utf8'),baseline=fs.readFileSync(path.join(root,'baseline/sanctuary.html'),'utf8');
const helpers=html.split('// BEGIN RECOVERED UI REPAIR HELPERS')[1].split('// END RECOVERED UI REPAIR HELPERS')[0].replace(/^.*\n/,'');
const line=name=>{const found=html.split('\n').filter(x=>x.startsWith('function '+name+'('));assert.equal(found.length,1);return found[0]};
let assertions=0;const ok=(value,message)=>{assert.ok(value,message);assertions++};const eq=(a,b,message)=>{assert.deepEqual(a,b,message);assertions++};
const ctx={state:{locked:false,ownerId:'synthetic',revision:1,experience:{locale:'en'},healthImports:[]},privateEpoch:0,sub:null,healthStatus:null,healthOperation:null,error:'',errorCode:'',errorAction:'',chartSource:null,root:{},calls:[],updates:0};
ctx.uiLocale=()=>ctx.state.experience?.locale==='es'?'es':'en';ctx.esc=value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');ctx.tr=value=>value;
ctx.btn=(label,action,kind='')=>'<button data-do="'+ctx.esc(action)+'">'+ctx.esc(label)+'</button>';
ctx.tracking=()=>({today:'2026-09-13',timeZone:'America/Toronto',series:{steps:[]}});
ctx.document={getElementById:()=>null};ctx.updateRuntimeRegion=()=>{ctx.updates++};ctx.updateError=()=>{ctx.updates++};ctx.adoptState=next=>{ctx.state=next};ctx.request=async(method,params)=>{ctx.calls.push([method,params]);return {}};
vm.createContext(ctx);vm.runInContext(helpers+'\n'+['showError','errorContents','updateError','runtimeReason','healthConnections','chartRows'].map(line).join('\n'),ctx,{timeout:1000});
const call=expression=>vm.runInContext(expression,ctx,{timeout:1000});const json=value=>JSON.parse(JSON.stringify(value));
async function main(){
 for(const match of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g))new vm.Script(match[1]);ok(true,'Entire candidate script parses');
 for(const locale of ['en','es']){
  ctx.state.experience.locale=locale;
  for(const code of ['QVAC_LIFECYCLE_OPERATION_BLOCKED','QVAC_LIFECYCLE_SUSPEND_FAILED','QVAC_LIFECYCLE_RESUME_FAILED','QVAC_MODEL_LOAD_FAILED','QVAC_RPC_CONNECTION_FAILED','QVAC_RPC_INIT_TIMEOUT','QVAC_WORKER_CRASHED','QVAC_WORKER_SHUTDOWN']){
   call('showError('+JSON.stringify(code)+')');ok(ctx.error&&!ctx.error.includes('This step was not saved'),'AI failures are not presented as record save failures');ok(call('errorContents()').includes('data-do="modelDetails"'),'AI failure retains existing setup action');ok(!call('runtimeReason('+JSON.stringify(code)+')').includes(code),'Setup explains recognized runtime code');
  }
  ok(call("operationErrorMessage('OPERATION_FAILED','converse')").includes(locale==='es'?'Tu borrador':'Your draft'),'Unknown chat failure retains text and accurate locale');
  call("showError('OPERATION_FAILED','healthRead')");ok(!ctx.error.includes('This step was not saved'),'Unknown health read failure is not labelled failed save');ok(ctx.error.includes(locale==='es'?'No se confirmó':'not confirmed'),'Health read outcome is unconfirmed');
  call("showError('HEALTH_PERMISSION_REVOKED','healthRead')");ok(ctx.error.includes(locale==='es'?'acceso':'access'),'Permission revoked is actionable');
  for(const code of ['HEALTH_PROVIDER_READ_FAILED','HEALTH_READ_FAILED','HEALTH_READ_TIMEOUT','HEALTH_PAGINATION_FAILED']){const message=call('operationErrorMessage('+JSON.stringify(code)+',"healthRead")');ok(message.includes(locale==='es'?'confirmar':'confirm'),'Provider read failure remains unconfirmed');ok(!message.includes(locale==='es'?'no hay lecturas':'no readings'),'Provider failure does not infer empty readings');}
  for(const action of ['healthRead','modelLoad']){const message=call('operationErrorMessage("ACTIVITY_ENTERS_BACKGROUND",'+JSON.stringify(action)+')');ok(message.includes(locale==='es'?'interrump':'interrupt'),'Background interruption has accurate wording');}
  call("showError('VAULT_LOCKED','converse')");ok(!ctx.error.includes(locale==='es'?'borrador':'draft'),'Locked state makes no draft-kept claim');
 }
 ctx.state.experience.locale='en';call("showError('HEALTH_PROVIDER_READ_FAILED','healthRead')");eq(ctx.errorAction,'healthRead');ctx.error='';call('updateError()');eq(ctx.errorCode,'');eq(ctx.errorAction,'');ctx.error='Still working on this action. Your saved records are kept.';ok(call('errorContents()').includes('Still working on this action'),'A later unrelated progress notice cannot reuse cleared Health failure context');ok(!call('errorContents()').includes('Health Connect'),'Cleared Health action cannot relabel unrelated progress');ctx.error='';call('updateError()');
 ctx.state.experience.locale='en';ctx.healthStatus={available:true,grantedScopes:['steps','sleep']};
 let view=call('healthConnections()');ok(view.includes('Permission alone does not confirm that readings were returned.'),'Permission and read states are distinct');ok(view.includes('No readable Health Connect snapshot'),'Permission grant invents no snapshot');ok(!view.includes('Days with steps: 0'),'Absent snapshot does not invent zero measurements');
 ctx.state.healthImports=[{snapshot:{fetchedAt:'2026-09-13T10:00:00Z',timeZone:'America/Toronto',daily:[{localDate:'2026-09-13',steps:null,sleepHours:null}]}}];
 eq(call('healthSnapshotSummary().stepDays'),0);ok(call('healthSavedReadings()').includes('contains no step or sleep values'),'Empty saved snapshot distinguished from absent snapshot');
 ctx.state.healthImports[0].snapshot.daily=[{localDate:'2026-09-13',steps:0,sleepHours:null},{localDate:'2026-09-12',steps:1234,sleepHours:7.125},{localDate:'2026-09-11',steps:'42',sleepHours:-1}];
 const summary=json(call('healthSnapshotSummary()'));eq(summary.stepDays,2);eq(summary.sleepDays,1);eq(summary.rows[0].steps,null);eq(summary.rows[0].sleepHours,null);eq(summary.rows[2].steps,0);
 view=call('healthSavedReadings()');ok(view.includes('<td>0</td>'),'Real zero is displayed');ok(view.includes('7.125'),'Saved value is not rescaled or rounded');ok(view.includes('Not recorded'),'Null stays missing');
 ctx.state.healthImports[0].snapshot.timeZone='UTC';ok(call('healthSavedReadings()').includes('different timezone'),'Timezone mismatch explained, not silently merged');
 ctx.state.healthImports.push({snapshot:{fetchedAt:'invalid',timeZone:'UTC',daily:[{localDate:'2026-09-13',steps:999}]}});eq(call('healthSnapshotSummary().snapshot.fetchedAt'),'2026-09-13T10:00:00Z','Invalid timestamp not used as latest snapshot');
 ctx.state.healthImports[0].snapshot.fetchedAt='2026-09-13T10:00:00Z';ctx.state.healthImports[0].snapshot.timeZone='<img src=x onerror=1>';
 ok(!call('healthSavedReadings()').includes('<img src=x'),'Snapshot provenance rendered as escaped text');
 // Native calls retain the original method and exact date/scope/zone argument shapes.
 ctx.state.healthImports=[];ctx.calls=[];ctx.request=async(method,params)=>{ctx.calls.push([method,params]);if(method==='healthRead')return {...ctx.state,revision:2,healthImports:[{snapshot:{fetchedAt:'2026-09-13T12:00:00Z',timeZone:'America/Toronto',daily:[]}}]};return {available:true,grantedScopes:['steps','sleep']}};
 await call("healthAction('healthConnect')");eq(json(ctx.calls[0]),['healthConnect',{scopes:['steps','sleep']}]);
 ctx.calls=[];await call("healthAction('healthRead')");eq(json(ctx.calls),[['healthRead',{startDate:'2026-08-15',endDate:'2026-09-13',timeZone:'America/Toronto'}],['healthStatus',undefined]].map(x=>json(x)));eq(ctx.healthOperation.phase,'completed');eq(ctx.state.revision,2);ok(call('healthReadMessage()').includes('may include earlier'),'Completed refresh does not promise new readings');
 const savedState=ctx.state;ctx.request=async()=>{throw Error('HEALTH_PROVIDER_READ_FAILED')};await assert.rejects(call("healthAction('healthRead')"),/HEALTH_PROVIDER_READ_FAILED/);assertions++;eq(ctx.healthOperation.phase,'failed');eq(ctx.state,savedState,'Read failure keeps pre-existing view');
 ctx.request=async(method)=>{if(method==='healthRead')return {...ctx.state,revision:3};throw Error('HEALTH_PROVIDER_UNAVAILABLE')};await call("healthAction('healthRead')");eq(ctx.healthOperation.phase,'completed','Follow-up availability failure does not erase read acknowledgement');eq(ctx.state.revision,3);eq(ctx.errorAction,'healthStatus');
 let release;ctx.request=()=>new Promise(resolve=>{release=resolve});const pending=call("healthAction('healthRead')");ctx.privateEpoch++;ctx.state={locked:true};ctx.healthOperation=null;release({...savedState,revision:10});await pending;eq(ctx.state.locked,true,'Late health result cannot reopen a locked vault');eq(ctx.healthOperation,null,'Late result does not expose prior read status');
 // Patch intentionally leaves lifecycle admissions, request actions, charts and form patching untouched.
 for(const name of ['chartRows','updateRuntimeUI','patchFormChildren']){
  const find=(text)=>{const pos=text.indexOf('function '+name+'(');let end=text.indexOf('\nfunction ',pos+1);return text.slice(pos,end===-1?undefined:end)};
  eq(find(html),find(baseline),name+' stays byte-identical');
 }
 ok(html.includes("await window.SolarisNativeAI.loadModel({bridgeVersion:'solaris-qvac-bridge/1'})"),'Same native model-start bridge');
 ok(html.includes("await window.SolarisNativeAI.cancelProvision({bridgeVersion:'solaris-qvac-bridge/1'})"),'Same native cancel bridge');
 ok(html.includes('pointer-events:none;filter:brightness(.74)}'),'Brightness only on forest image');
 ok(html.includes('background:rgba(6,16,23,.15)'),'Requested Home tint preserved');
 console.log(JSON.stringify({kind:'synthetic-exact-function-regression',assertions,status:'passed',androidDeviceTested:false,nativeInferenceTested:false},null,2));
}
main().catch(error=>{console.error(error);process.exitCode=1});
