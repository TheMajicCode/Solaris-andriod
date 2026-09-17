'use strict';
// Execute the actual packaged UI script with synthetic DOM/bridge objects.
// No Android, model inference, real vault or network operations are performed.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),checks=[];
const html=fs.readFileSync(process.argv[2]||path.join(root,'ui/sanctuary.html'),'utf8');
let script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
// Expose the actual functions through a test-only seam before first rendering.
const compact=!!process.argv[2],symbols=compact?JSON.parse(fs.readFileSync(path.join(root,'ui/UI-TEST-SYMBOLS.json'),'utf8')):{};
const sym=name=>symbols[name]||name;
const tail="render();void request('view').then(accept).catch(()=>{})"+(compact?'':';');
assert.equal(script.split(tail).length,2,'Readable source expected for this harness');
script=script.replace(tail,`render=()=>{window.__renders=(window.__renders||0)+1};updateRuntimeRegion=(el,html)=>{if(el)el.innerHTML=html};
window.__test={send,run,showError,chat,composer,aiModeLabel,prepDescription,modelDetailsContent,chatFailureMessage,safeChatCode,errorContents,chatVerified,recordChatResult,resetChatProof,updateChatWait,
setFixture:next=>accept(next),setDraft:x=>{${sym('chatDraft')}=x},setRoute:x=>{${sym('route')}=x;${sym('navigationEpoch')}++},snapshot:()=>({${['waiting','chatDraft','privateEpoch','chatPendingId','error','errorCode','chatReturn','route'].map(n=>n+':'+sym(n)).join(',')},selected:Array.from(${sym('selected')}),proof:chatVerified()}),
setSelected:x=>{${sym('selected')}=new Set(x)},setContext:x=>{${sym('state')}.experience.localContext=x},setSub:x=>{${sym('sub')}=x},expireGrant:()=>{${sym('state')}.grants.expiresAt='2000-01-01T00:00:00Z'},setRuntime:s=>window.__solarisDailyStatus(s)};`);
const events={},rootEvents={},calls=[],elements={};
function element(){return {innerHTML:'',textContent:'',value:'',hidden:false,style:{},classList:{toggle(){},add(){},remove(){}},addEventListener(){},querySelector(){return null},querySelectorAll(){return []},matches(){return false},setAttribute(){},removeAttribute(){}}}
const domRoot=element(),mode=element();domRoot.querySelector=q=>q==='[data-mode]'?mode:null;
domRoot.addEventListener=(name,fn)=>{rootEvents[name]=fn};
elements['daily-root']=domRoot;elements['daily-error']=element();elements['chat-draft']=element();elements['chat-wait-label']=element();elements['chat-wait-elapsed']=element();elements['model-details-live']=element();
const timers=[],intervals=[];
const context={console,performance:{now:()=>Date.now()},Intl,Date,Map,Set,WeakMap,Promise,URL,URLSearchParams,structuredClone,TextEncoder,TextDecoder,Uint8Array,JSON,Math,
setTimeout:(fn,delay)=>{timers.push({fn,delay,active:true});return timers.length},clearTimeout:id=>{if(timers[id-1])timers[id-1].active=false},setInterval:(fn)=>{intervals.push(fn);return intervals.length},clearInterval(){},
localStorage:{getItem:()=>null,removeItem(){throw Error('UNEXPECTED_STORAGE_MUTATION')}},
document:{getElementById:id=>elements[id]||null,hidden:false,body:element(),activeElement:null,createElement:()=>element()},CustomEvent:function(){},
window:{ReactNativeWebView:{postMessage:raw=>calls.push(JSON.parse(raw))},addEventListener:(name,fn)=>{events[name]=fn},dispatchEvent(){}}};
context.window.window=context.window;vm.createContext(context);vm.runInContext(script,context,{timeout:20000});const api=context.window.__test;
function fixture(extra={}){return {format:'solaris-daily-state/3',locked:false,hasVault:true,ownerId:'synthetic-owner',subjectId:'synthetic-subject',revision:1,migration:{committed:true},onboardingComplete:true,experience:{locale:'en'},grants:{local:true,expiresAt:'2099-01-01T00:00:00Z'},sources:[],actions:[],contextSources:[],conversation:[],questionnaires:{templates:[]},tracking:{today:'2026-09-16',timeZone:'UTC',measurements:[],habits:[],series:{}},...extra}}
function request(){return calls.filter(c=>c.transport==='solaris-vault-ui/1'&&c.method==='converse').at(-1)}
function reply(result,error){context.window.__solarisVaultReply({id:request().id,ok:!error,result,error})}
function pair(message='Hello',mode='qvac-device',id='new'){return [{id:id+'-u',role:'user',mode:'user',text:message,at:'2026-09-16T12:00:00Z'},{id:id+'-a',role:'assistant',mode,text:'Hello from a synthetic fixture.',at:'2026-09-16T12:00:01Z'}]}
function check(name,fn){fn();checks.push(name)}
(async()=>{
 const bridgeCount=()=>calls.filter(c=>c.transport==='solaris-vault-ui/1'&&c.method==='converse').length;
 api.setFixture(fixture());api.setRoute('luca');api.setRuntime({loaded:false,verified:true,inference:{state:'not-run'}});
 api.setDraft('First pending input');let job=api.send();const initial=bridgeCount();
 await api.send('Second tap input');
 check('Duplicate send does not dispatch a second request or replace pending input',()=>{assert.equal(bridgeCount(),initial);assert.equal(api.snapshot().chatDraft,'First pending input');assert.equal(request().params.message,'First pending input')});
 const dispatched=request();api.setSelected(['later-choice']);api.setDraft('Next edited question');
 check('Active request uses selected source snapshot; later choices do not change it',()=>assert.deepEqual(Array.from(dispatched.params.sourceIds),[]));
 reply(fixture({revision:2,conversation:pair('First pending input','rules','first604')}));await job;
 check('Guided completion leaves newer user edits intact and does not attest model inference',()=>{assert.equal(api.snapshot().chatDraft,'Next edited question');assert.equal(api.snapshot().proof,false);assert.equal(api.snapshot().waiting,false);assert.match(api.chat(),/predefined/)});
 api.setSelected([]);api.setDraft('Retry once');job=api.send();reply(undefined,'OUTPUT_LIMIT');await job;
 const failedCount=bridgeCount();for(const fn of intervals)fn();
 check('Failure does not automatically retry or overwrite draft on polling',()=>{assert.equal(bridgeCount(),failedCount);assert.equal(api.snapshot().chatDraft,'Retry once');assert.equal(api.snapshot().errorCode,'OUTPUT_LIMIT');assert.equal(api.snapshot().waiting,false)});
 api.setDraft('Return from sources');job=api.send();api.setSub('sourcePicker');api.setRoute('home');api.setRoute('luca');const renders=context.window.__renders;
 reply(fixture({revision:3,conversation:pair('Return from sources','rules','sourceback604')}));await job;
 check('Completion refreshes pending controls after route changes with source picker still open',()=>{assert(context.window.__renders>renders);assert.equal(api.snapshot().waiting,false);assert.match(api.composer(),/data-do="send"/);assert.doesNotMatch(api.composer(),/data-do="stop"/)});
 api.setSub(null);api.setDraft('Unchanged snapshot');job=api.send();reply(fixture({revision:3,conversation:pair('Return from sources','rules','sourceback604')}));await job;
 check('Unchanged result cannot be confused with a newly finished request',()=>{assert.equal(api.snapshot().chatDraft,'Unchanged snapshot');assert.equal(api.snapshot().proof,false)});
 api.setDraft('Old pending input');job=api.send();const oldRequest=request();const beforeHide=bridgeCount();context.window.__solarisPrivateHide();await job;
 check('Private hide clears private draft and selected IDs immediately',()=>{assert.equal(api.snapshot().chatDraft,'');assert.deepEqual(Array.from(api.snapshot().selected),[]);assert.equal(api.snapshot().waiting,false);assert.equal(api.snapshot().proof,false)});
 api.setFixture(fixture({revision:4,conversation:pair('Saved before hide','rules','saved604')}));context.window.__solarisDailyRoute('home');
 check('Unlock returns to saved chat without re-dispatching the interrupted request',()=>{assert.equal(api.snapshot().route,'luca');assert.equal(bridgeCount(),beforeHide);assert.equal(api.snapshot().chatDraft,'');assert.match(api.chat(),/cleared the draft/);assert.match(api.chat(),/saved chat/)});
 api.setDraft('A new explicit question');const next=api.send();const newId=request().id;
 context.window.__solarisVaultReply({id:oldRequest.id,ok:true,result:fixture({revision:100,conversation:pair('Old pending input','qvac-device','late604')})});
 check('Late bridge response from locked session cannot settle current request',()=>{assert.equal(api.snapshot().waiting,true);assert.equal(api.snapshot().chatDraft,'A new explicit question');assert.equal(request().id,newId)});
 reply(fixture({revision:5,conversation:pair('A new explicit question','rules','next604')}));await next;
 check('New explicit completion settles itself and dismisses interruption notice',()=>{assert.equal(api.snapshot().waiting,false);assert.equal(api.snapshot().chatDraft,'');assert.doesNotMatch(api.chat(),/cleared the draft/)});
 api.setSelected([]);api.setFixture(fixture({revision:6,grants:{local:false,expiresAt:'2099-01-01T00:00:00Z'}}));api.setDraft('Hello');job=api.send();
 check('Guided mode does not enable local AI permission',()=>{assert.equal(request().params.useAI,false);assert.match(api.aiModeLabel(),/off/);assert.deepEqual(Array.from(request().params.sourceIds),[])});
 reply(fixture({revision:7,grants:{local:false,expiresAt:'2099-01-01T00:00:00Z'},conversation:pair('Hello','rules','off604')}));await job;
 check('Guided reply completes with AI permission off without inventing inference proof',()=>{assert.equal(api.snapshot().chatDraft,'');assert.equal(api.snapshot().proof,false);assert.match(api.chat(),/predefined/);assert.match(api.aiModeLabel(),/off/)});
 api.setFixture(fixture({revision:8,experience:{locale:'es'}}));api.setSelected([]);
 check('Spanish context guidance is visible with zero selected sources',()=>{assert.match(api.composer(),/Elegir fuentes/);assert.match(api.composer(),/Sin registros seleccionados/)});
 const notice=()=>timers.filter(t=>t.active&&t.delay===12000).at(-1);
 let finish;job=api.run(()=>new Promise(r=>finish=r),'syntheticReview');api.showError('LOCAL_PERMISSION_REQUIRED','converse');notice().fn();
 check('Delayed progress timer cannot replace an intervening permission error',()=>assert.equal(api.snapshot().errorCode,'LOCAL_PERMISSION_REQUIRED'));finish();await job;
 check('Finished action preserves intervening permission error',()=>assert.equal(api.snapshot().errorCode,'LOCAL_PERMISSION_REQUIRED'));
 const report={scope:'Independent cases executing actual UI script through the author synthetic-DOM setup, no real browser or Android validation.',htmlSha256:crypto.createHash('sha256').update(html).digest('hex'),passed:checks.length,checks};
 fs.writeFileSync(path.join(__dirname,compact?'UI-INDEPENDENT-COMPACT.json':'UI-INDEPENDENT-READABLE.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
})().catch(e=>{console.error(e.stack);process.exitCode=1});
