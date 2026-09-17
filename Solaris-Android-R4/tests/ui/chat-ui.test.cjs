'use strict';
// Execute the actual packaged UI script with synthetic DOM/bridge objects.
// No Android, model inference, real vault or network operations are performed.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../..'),checks=[];
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
api.setFixture(fixture());api.setRoute('luca');api.setRuntime({loaded:true,verified:true,inference:{state:'succeeded'},preparation:{state:'ready',label:'Ready for a conversation'}});
check('Loaded/public-test success does not verify normal chat',()=>{assert.match(api.aiModeLabel(),/not verified/);assert.equal(api.chatVerified(),false);assert.match(api.prepDescription().text,/checked separately/)});
api.setFixture(fixture({conversation:pair('old')}));
check('Stored historical model reply does not verify unlocked session',()=>assert.equal(api.chatVerified(),false));
api.setFixture(fixture());
for(const code of ['FIRST_TOKEN_TIMEOUT','STREAM_TIMEOUT','COMPLETION_TIMEOUT','EMPTY_COMPLETION','OUTPUT_LIMIT','CANDIDATE_INVALID','CANDIDATE_UNGROUNDED','CANDIDATE_UNSAFE','CANDIDATE_NEGATION','SETTLEMENT_UNCONFIRMED','QVAC_WORKER_CRASHED']){
 api.setDraft('Hello');const job=api.send();assert.equal(api.snapshot().waiting,true);
 check('Waiting preserves editable draft and stop: '+code,()=>{assert.match(api.composer(),/>Hello<\/textarea>/);assert.match(api.composer(),/data-do="stop"/);assert.match(api.chat(),/Your draft stays here/);assert.deepEqual(Array.from(request().params.sourceIds),[]);assert.equal(request().params.message,'Hello');assert.equal(request().params.useAI,true)});
 reply(undefined,code);await job;
 check('Friendly distinct recoverable error: '+code,()=>{assert.equal(api.snapshot().waiting,false);assert.equal(api.snapshot().chatDraft,'Hello');assert.equal(api.snapshot().errorCode,code);assert.match(api.errorContents(),new RegExp(code));assert.doesNotMatch(api.snapshot().error,/shorter question|thinking|token|JSON/i);assert.equal(api.chatVerified(),false)});
}
check('Output limit has a distinct message and safe diagnostic code',()=>{assert.equal(api.safeChatCode('OUTPUT_LIMIT'),'OUTPUT_LIMIT');assert.match(api.chatFailureMessage('OUTPUT_LIMIT'),/length limit before finishing/);assert.match(api.chatFailureMessage('OUTPUT_LIMIT'),/draft is kept/)});
api.setDraft('Hello');let job=api.send();api.setDraft('A newer draft');reply(undefined,'DO_NOT_DISPLAY synthetic_private_record');await job;
check('Unknown errors suppressed and newer draft preserved',()=>{assert.equal(api.snapshot().errorCode,'OPERATION_FAILED');assert.doesNotMatch(api.errorContents(),/synthetic_private_record|DO_NOT_DISPLAY/);assert.equal(api.snapshot().chatDraft,'A newer draft')});
api.setDraft('Hello');job=api.send();reply(fixture({revision:2,conversation:pair()}));await job;
check('New input-dependent normal-chat result verifies this session',()=>{assert.equal(api.chatVerified(),true);assert.match(api.aiModeLabel(),/answered in this session/);assert.equal(api.snapshot().chatDraft,'');assert.match(api.chat(),/generated on this phone/)});
check('Restart instruction protects an in-memory draft',()=>{assert.match(api.chatFailureMessage('SETTLEMENT_UNCONFIRMED'),/Copy your draft before closing/);assert.doesNotMatch(api.chatFailureMessage('SETTLEMENT_UNCONFIRMED'),/draft is kept/)});
api.setContext({revision:2,categories:[],expiresAt:'2099-01-01T00:00:00Z'});
check('Category grant change invalidates proof without granting access',()=>assert.equal(api.chatVerified(),false));
api.setFixture(fixture({revision:3,conversation:pair(),grants:{local:false,expiresAt:'2099-01-01T00:00:00Z'}}));
check('Permission revocation resets session proof',()=>{assert.equal(api.chatVerified(),false);assert.match(api.aiModeLabel(),/off/)});
api.setFixture(fixture({revision:4,conversation:pair()}));api.setDraft('Hello');job=api.send();reply(fixture({revision:4,conversation:pair()}));await job;
check('Identical state cannot reverify session',()=>assert.equal(api.chatVerified(),false));
api.setDraft('Hello');job=api.send();reply(fixture({revision:5,conversation:pair('Different input','qvac-device','different')}));await job;
check('Unrelated new tail does not verify submitted question',()=>assert.equal(api.chatVerified(),false));
api.setDraft('Hello');job=api.send();reply(fixture({revision:6,conversation:pair('Hello','guided','guided')}));await job;
check('Guided support is labeled predefined and never verifies AI',()=>{assert.equal(api.chatVerified(),false);assert.match(api.chat(),/Guided support · predefined/);assert.doesNotMatch(api.chat(),/generated on this phone/)});
api.setDraft('Hello');job=api.send();reply(fixture({revision:7,conversation:pair('Hello','qvac-device','success2')}));await job;assert.equal(api.chatVerified(),true);
api.setSub('modelDetails');elements['model-details-live'].innerHTML=api.modelDetailsContent();assert.match(elements['model-details-live'].innerHTML,/Chat answered in this session/);api.expireGrant();intervals[0]();
check('Open model details removes proof on expiry without a state event',()=>{assert.doesNotMatch(elements['model-details-live'].innerHTML,/Chat answered in this session/);assert.match(elements['model-details-live'].innerHTML,/Local AI is off/)});api.setSub(null);
check('Expired permission resets proof and changes displayed label',()=>{assert.equal(api.chatVerified(),false);assert.match(mode.textContent,/off/)});
api.setFixture(fixture({revision:9}));api.setDraft('Hello');job=api.send();api.setRoute('home');reply(undefined,'FIRST_TOKEN_TIMEOUT');await job;
check('Navigate-away failure is retained without replacing draft',()=>{assert.equal(api.snapshot().chatDraft,'Hello');assert.equal(api.snapshot().errorCode,'FIRST_TOKEN_TIMEOUT');assert.equal(api.snapshot().waiting,false)});
api.setRoute('luca');api.setDraft('Hello');job=api.send();context.window.__solarisPrivateHide();api.setFixture(fixture({revision:10}));api.setDraft('Hola');const job2=api.send();await job;
check('Old request settlement cannot stop new session waiting',()=>{assert.equal(api.snapshot().waiting,true);assert.equal(api.snapshot().chatDraft,'Hola');assert.equal(api.chatVerified(),false)});
reply(fixture({revision:11,conversation:pair('Hola','qvac-device','hola')}));await job2;
check('Reopened session requires its own new completed reply',()=>assert.equal(api.chatVerified(),true));
api.setFixture(fixture({revision:12,experience:{locale:'es'}}));api.setDraft('Hola');job=api.send();reply(undefined,'EMPTY_COMPLETION');await job;
check('Spanish diagnostic and draft display',()=>{assert.match(api.snapshot().error,/terminó sin una respuesta/);assert.match(api.errorContents(),/Detalles para soporte/);assert.equal(api.snapshot().chatDraft,'Hola')});
api.setFixture(fixture({revision:20,experience:{locale:'en',localContext:{revision:1,categories:['reflections'],expiresAt:new Date(Date.now()+10000).toISOString()}}}));api.setDraft('Hello');job=api.send();reply(fixture({revision:21,experience:{locale:'en',localContext:{revision:1,categories:['reflections'],expiresAt:new Date(Date.now()+10000).toISOString()}},conversation:pair('Hello','qvac-device','context-expiry')}));await job;assert.equal(api.chatVerified(),true);
const NativeDate=Date;context.Date=class extends NativeDate{static now(){return NativeDate.now()+20000}};api.setSub('modelDetails');elements['model-details-live'].innerHTML='Chat answered in this session';intervals[0]();
check('Category grant expiry removes proof independently of global AI permission',()=>{assert.equal(api.chatVerified(),false);assert.doesNotMatch(api.aiModeLabel(),/off/);assert.doesNotMatch(elements['model-details-live'].innerHTML,/Chat answered in this session/)});context.Date=NativeDate;api.setSub(null);
api.setFixture(fixture({revision:22,experience:{locale:'en',localContext:{revision:2,categories:[],expiresAt:'2000-01-01T00:00:00Z'}}}));api.setDraft('Hello');job=api.send();reply(fixture({revision:23,experience:{locale:'en',localContext:{revision:2,categories:[],expiresAt:'2000-01-01T00:00:00Z'}},conversation:pair('Hello','qvac-device','no-context')}));await job;
check('Zero-source greeting proof does not require an active category grant',()=>assert.equal(api.chatVerified(),true));
api.setFixture(fixture({revision:30}));api.setDraft('Hello');job=api.send();reply(fixture({revision:30}));await job;
check('Unchanged bridge result retains submitted draft without establishing proof',()=>{assert.equal(api.snapshot().chatDraft,'Hello');assert.equal(api.snapshot().waiting,false)});
api.setDraft('Hello');job=api.send();reply(fixture({revision:31,conversation:pair('Different','rules','unrelated604')}));await job;
check('Unrelated reply cannot clear current draft',()=>assert.equal(api.snapshot().chatDraft,'Hello'));
api.setDraft('Hello');job=api.send();api.showError('EMPTY_COMPLETION','converse');reply(fixture({revision:32,conversation:pair('Hello','rules','guided604')}));await job;
check('Confirmed guided reply clears its draft and stale chat error without AI proof',()=>{assert.equal(api.snapshot().chatDraft,'');assert.equal(api.snapshot().error,'');assert.equal(api.chatVerified(),false);assert.match(api.chat(),/Guided support · predefined/)});
api.setDraft('Hello');job=api.send();api.showError('SESSION_SAVE_TIMEOUT','sessionSave');reply(fixture({revision:33,conversation:pair('Hello','rules','guided604b')}));await job;
check('Chat success preserves unrelated save error',()=>assert.equal(api.snapshot().errorCode,'SESSION_SAVE_TIMEOUT'));
api.setDraft('Hello');job=api.send();api.setSub('permissions');api.setRoute('home');api.setSub(null);api.setRoute('luca');const beforeRenders=context.window.__renders;reply(fixture({revision:34,conversation:pair('Hello','qvac-device','navigate604')}));await job;
check('Completion after visiting another view refreshes chat controls',()=>{assert(context.window.__renders>beforeRenders);assert.equal(api.snapshot().waiting,false);assert.match(api.composer(),/data-do="send"/);assert.doesNotMatch(api.composer(),/data-do="stop"/)});
const activeNotice=()=>timers.filter(t=>t.active&&t.delay===12000);
api.setDraft('Hello');job=api.run(()=>api.send(),'ask:Hello');
check('Chat shortcuts do not start generic action warning timers',()=>assert.equal(activeNotice().length,0));reply(fixture({revision:35,conversation:pair('Hello','rules','shortcut604')}));await job;
let finish;job=api.run(()=>new Promise(resolve=>finish=resolve),'syntheticAction');activeNotice().at(-1).fn();
check('Slow generic action exposes a temporary notice',()=>assert.match(api.snapshot().error,/Still working/));finish();await job;
check('Finished generic action clears its own temporary notice',()=>assert.equal(api.snapshot().error,''));
job=api.run(()=>new Promise(resolve=>finish=resolve),'syntheticAction');activeNotice().at(-1).fn();api.showError('SESSION_SAVE_TIMEOUT','sessionSave');finish();await job;
check('Action cleanup does not clear an intervening real error',()=>assert.equal(api.snapshot().errorCode,'SESSION_SAVE_TIMEOUT'));
let finishA,finishB;const jobA=api.run(()=>new Promise(resolve=>finishA=resolve),'syntheticA');activeNotice().at(-1).fn();const jobB=api.run(()=>new Promise(resolve=>finishB=resolve),'syntheticB');activeNotice().at(-1).fn();finishA();await jobA;
check('Earlier action cleanup cannot clear a newer action notice',()=>assert.match(api.snapshot().error,/Still working/));finishB();await jobB;
check('Latest notice clears when its own action settles',()=>assert.equal(api.snapshot().error,''));
api.setSelected([]);check('Zero-source composer explicitly offers personalization context',()=>{assert.match(api.composer(),/Choose sources/);assert.match(api.composer(),/No records selected/)});
api.setSub('sourcePicker');check('Empty picker offers existing context categories control',()=>assert.match(api.composer(),/data-do="contextSettings"/));api.setSub(null);
api.setSelected(['approved-source']);check('Explicit source choice replaces no-source guidance without auto selection',()=>{assert.match(api.composer(),/1 selected sources/);assert.doesNotMatch(api.composer(),/No records selected/)});api.setSelected([]);
api.setFixture(fixture({revision:40,conversation:pair('Saved earlier','rules','saved604')}));api.setRoute('luca');api.setDraft('Private unfinished question');api.setSelected(['private-source']);job=api.send();const callsBeforeHide=calls.length;context.window.__solarisPrivateHide();await job;
check('Background hide clears private draft, selection, waiting and inference proof',()=>{assert.equal(api.snapshot().chatDraft,'');assert.deepEqual(Array.from(api.snapshot().selected),[]);assert.equal(api.snapshot().waiting,false);assert.equal(api.chatVerified(),false);assert.equal(api.snapshot().chatReturn,2);assert.doesNotMatch(api.chat(),/Private unfinished question|private-source/)});
api.setFixture(fixture({revision:40,conversation:pair('Saved earlier','rules','saved604')}));context.window.__solarisDailyRoute('home');
check('Unlock returns to saved chat with accurate interruption explanation',()=>{assert.equal(api.snapshot().route,'luca');assert.equal(api.snapshot().chatReturn,3);assert.match(api.chat(),/cleared the draft/);assert.match(api.chat(),/Saved earlier/);assert.equal(calls.length,callsBeforeHide)});
api.setDraft('Retry by choice');job=api.send();check('Only explicit send dismisses the interruption notice',()=>{assert.equal(api.snapshot().chatReturn,0);assert.doesNotMatch(api.chat(),/cleared the draft/)});context.window.__solarisPrivateHide();await job;context.window.__solarisDailyRoute('home');api.setFixture(fixture({revision:41,conversation:pair('Saved earlier','rules','saved604')}));
check('Home-route callback before unlock also returns without replay',()=>{assert.equal(api.snapshot().route,'luca');assert.equal(api.snapshot().chatReturn,3);assert.equal(api.snapshot().chatDraft,'');assert.equal(api.snapshot().waiting,false)});
rootEvents.click({target:{closest:()=>({dataset:{do:'lock'},disabled:false})}});for(let turn=0;turn<8;turn++)await Promise.resolve();const lockRequest=calls.at(-1);assert.equal(lockRequest.method,'lock');context.window.__solarisVaultReply({id:lockRequest.id,ok:true,result:{locked:true}});for(let turn=0;turn<8;turn++)await Promise.resolve();api.setFixture(fixture({revision:42}));context.window.__solarisDailyRoute('home');
check('Manual lock does not restore chat or retry an interrupted request',()=>{assert.equal(api.snapshot().route,'home');assert.equal(api.snapshot().chatReturn,0);assert.equal(api.snapshot().waiting,false)});
api.setRoute('luca');rootEvents.click({target:{closest:()=>({dataset:{do:'lock'},disabled:false})}});for(let turn=0;turn<8;turn++)await Promise.resolve();assert.equal(calls.at(-1).method,'lock');context.window.__solarisPrivateHide();for(let turn=0;turn<8;turn++)await Promise.resolve();api.setFixture(fixture({revision:43}));context.window.__solarisDailyRoute('home');
check('Background during an explicit lock cannot create an automatic chat return',()=>{assert.equal(api.snapshot().route,'home');assert.equal(api.snapshot().chatReturn,0)});
api.setRoute('luca');context.window.__solarisPrivateHide();api.setFixture(fixture({revision:43}));context.window.__solarisDailyRoute('home');
check('Background return without a pending reply restores chat silently',()=>{assert.equal(api.snapshot().route,'luca');assert.equal(api.snapshot().chatReturn,0);assert.doesNotMatch(api.chat(),/cleared the draft/)});
check('No new private storage writes or network bridge authority',()=>{assert(calls.every(c=>['solaris-legacy-read/1','solaris-vault-ui/1'].includes(c.transport)));assert(calls.filter(c=>c.transport==='solaris-vault-ui/1').every(c=>['converse','view','lock'].includes(c.method)))});
const report={scope:'Actual '+(compact?'compact':'readable')+' UI script; synthetic DOM and bridge only. No on-device inference or visual render verification.',htmlSha256:crypto.createHash('sha256').update(html).digest('hex'),passed:checks.length,checks};fs.writeFileSync(path.join(__dirname,compact?'UI-COMPACT-TEST-RESULTS.json':'UI-TEST-RESULTS.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
})().catch(e=>{console.error(e.stack);process.exitCode=1});
