// Independent DailyService boundary tests. Never include in an Android package.
(function () {
  'use strict';
  var oracle=globalThis.__solarisOracle, results=[];
  function assert(v,m){if(!v)throw Error(m);}
  function clone(v){return JSON.parse(JSON.stringify(v));}
  function deferred(){var resolve,reject;var promise=new Promise(function(a,b){resolve=a;reject=b;});return {promise:promise,resolve:resolve,reject:reject};}
  var expectedDeps=[38,76,67,8,9,923,925,940,950,922,951,957,955,958,953,930,937,926,929,956,915,716];
  assert(JSON.stringify(oracle.factories[939].deps)===JSON.stringify(expectedDeps),'DailyService dependencies changed');
  var pure=[8,9,10,11,12,14,15,16,17,18,19,20,21,22,23,38,39,40,41,42,43,67,76,77,912,922,923,924,925,926,927,928,929,930,931,932,933,934,935,936,937,938,939,951,952,953,954,955,956,957,958];
  function fixture(options){
    options=options||{};
    var writes=[],calls=[],ids=[],macs=[],cache=Object.create(null),count=100;
    function newId(){var s=('00000000000000000000000000000000'+(++count).toString(16)).slice(-32);ids.push(s);return s;}
    function VaultStore(){this.unlocked=true;this.cipherVersion='synthetic';}
    VaultStore.prototype.write=function(value,revision){assert(revision===f.service.state.revision,'write revision mismatch');writes.push({state:clone(value),expectedRevision:revision});return Promise.resolve();};
    var mocks={940:{VaultStore:VaultStore},950:{nativeVault:function(){return {newId:newId,mac:function(s){macs.push(s);if(options.beforeMac)options.beforeMac(f,s);return Promise.resolve('a'.repeat(64));}};}}};
    function requireModule(id){
      if(Object.prototype.hasOwnProperty.call(mocks,id))return mocks[id];
      if(pure.indexOf(id)===-1)throw Error('Unexpected module '+id);
      if(cache[id])return cache[id].exports;
      var record=oracle.factories[id];assert(record,'Missing module '+id);
      var module={exports:{}};cache[id]=module;oracle.loaded.push(id);
      record.factory(globalThis,requireModule,function(){throw Error('Unexpected importDefault');},function(){throw Error('Unexpected importAll');},module,module.exports,record.deps);
      return module.exports;
    }
    var f={writes:writes,calls:calls,ids:ids,macs:macs,require:requireModule};
    var qvac={snapshot:function(){return {loaded:options.loaded!==false};},completeConversationTask:function(prompt,eligible){
      calls.push({prompt:prompt,eligibleAtCall:eligible()});f.eligible=eligible;
      if(options.complete)return options.complete(f,prompt,eligible);
      return Promise.resolve({text:options.output===undefined?'{"message":"Hello!","sourceRefs":[]}':options.output,contentEvents:7});
    }};
    var Daily=requireModule(939).DailyService;
    var service=new Daily(qvac,function(){throw Error('Unexpected session clock');});f.service=service;
    var domain=requireModule(951);
    var state=domain.freshVault({subjectId:'sol_'+'a'.repeat(32),ownerId:'owner_'+'b'.repeat(32),deviceId:'device_'+'c'.repeat(32)},{id:newId,now:new Date('2026-09-16T00:00:00.000Z')});
    domain.ensureExperience(state);
    state.grants={local:true,automatic:false,expiresAt:'2099-01-01T00:00:00.000Z'};
    state.migration={committed:true,legacyCleared:false,backupVerified:false};
    state.experience.localContext={categories:options.categories||[],expiresAt:'2099-01-01T00:00:00.000Z',revision:1};
    if(options.profile)state.displayName='Synthetic Profile';
    if(options.prior)state.conversation.push({id:'message_'+'d'.repeat(32),role:'user',text:options.prior,at:'2026-09-16T00:00:00.000Z',mode:'owner',sources:[]});
    service.state=state;
    // Exclude only presentation projection; converse/contextSources/parser/queue/persist stay actual HBC.
    service.view=function(){return {state:clone(service.state),busy:service.busy};};
    f.before=clone(state);
    requireModule(922).validState(state);
    return f;
  }
  async function invoke(f,options){options=options||{};try{await f.service.converse(options.message||'Hello',options.sources||[],options.local!==false,options.operation||'synthetic_op_0001',!!options.alreadySaved);return null;}catch(e){return String(e&&e.message||e);}}
  function noCommit(f){assert(f.writes.length===0,'unexpected persistence');assert(f.service.state.conversation.length===f.before.conversation.length,'unexpected conversation mutation');assert(f.service.busy===false,'busy not cleared');}
  function expectedDiagnostic(code){return globalThis.__solarisExpectedDiagnostics?code:'LUCA_RESPONSE_UNAVAILABLE';}
  function replaceState(f,mutate){var next=clone(f.service.state);mutate(next);f.service.state=next;}
  function envelope(prompt){var cut=prompt.indexOf('\n');assert(cut>=0&&prompt.slice(-10)===' /no_think','unexpected prompt structure');return JSON.parse(prompt.slice(cut+1,-10));}
  function preflight(f,message,sources){f.service.assertConversationAccess(message,sources||[],true);}
  function recentAt(f,index){return envelope(f.calls[index].prompt).recent;}
  async function test(name,body){try{var details=await body();results.push({name:name,pass:true,details:details||{}});}catch(e){results.push({name:name,pass:false,error:String(e.stack||e)});}}
  function addCheckin(f,id,date,ratings,approved){
    f.service.state.sources.push({id:id,revision:1,kind:'checkin',dataClass:'D3',createdAt:date+'T00:00:00.000Z',localDate:date,timeZone:'UTC',payload:{vitality:ratings[0],clarity:ratings[1],balance:ratings[2],alignment:ratings[3],note:'UNSELECTED_NOTE_SENTINEL'},approved:approved!==false,excluded:false,supersedes:null});
    f.require(922).validState(f.service.state);f.before=clone(f.service.state);
  }
  function reply(f){return f.service.state.conversation[f.service.state.conversation.length-1];}
  function checkGuided(f){assert(f.calls.length===0,'model called');assert(f.writes.length===1,'exactly one commit');assert(reply(f).mode==='rules','fake model attribution');assert(reply(f).eventCount===0,'fake token count');var receipt=JSON.parse(f.service.state.receipts[0].body);assert(receipt.result==='validated-template'&&receipt.model===null&&receipt.modelSha256===null&&receipt.contentEvents===0,'incorrect receipt '+JSON.stringify(receipt));assert(f.service.busy===false,'busy not cleared');}
  (async function(){
    for(var message of ['Hello','Hi!','hola','What can you do?','Choose a step','Explain my check-in','What are my most recent activities?','Show my recent records','What are my habits?','How was my sleep?']){
      await test('guided unloaded '+message,async function(){var f=fixture({loaded:false});var pf=f.service.assertConversationAccess(message,[],true);assert(pf&&pf.message,'preflight did not detect guided');assert(await invoke(f,{message:message})===null,'guided failed');checkGuided(f);assert(reply(f).sources.length===0&&reply(f).provenance.sourceRefs.length===0,'fake sources');return {message:reply(f).text};});
    }
    await test('Spanish guided reply uses locale',async function(){var f=fixture({loaded:false});f.service.state.experience.locale='es';assert(await invoke(f,{message:'Hola'})===null,'Spanish failed');checkGuided(f);assert(reply(f).text.indexOf('Hola.')===0,'wrong language');return {message:reply(f).text};});
    await test('selected checkin exact values and missing answers',async function(){var f=fixture({loaded:false,categories:['questionnaires']});addCheckin(f,'source_'+'f'.repeat(32),'2026-09-15',[4,4,3,null]);assert(await invoke(f,{message:'Explain my check-in',sources:[f.service.state.sources[0].id]})===null,'checkin failed');checkGuided(f);assert(reply(f).text.indexOf('vitality: 4/5')>=0&&reply(f).text.indexOf('balance: 3/5')>=0,'missing ratings');assert(reply(f).text.indexOf('alignment:')<0&&reply(f).text.indexOf('UNSELECTED_NOTE')<0,'missing or note invented');assert(reply(f).provenance.sourceRefs[0].id===f.service.state.sources[0].id,'incorrect source ref');return {message:reply(f).text,refs:reply(f).provenance.sourceRefs};});
    await test('unselected newest checkin excluded',async function(){var f=fixture({loaded:false,categories:['questionnaires']});addCheckin(f,'source_'+'e'.repeat(32),'2026-09-14',[2,3,4,5]);addCheckin(f,'source_'+'f'.repeat(32),'2026-09-15',[5,5,5,5]);assert(await invoke(f,{message:'Explain my check-in',sources:[f.service.state.sources[0].id]})===null,'checkin failed');checkGuided(f);assert(reply(f).text.indexOf('2026-09-14')>=0&&reply(f).text.indexOf('2026-09-15')<0,'unselected newest leaked');return {message:reply(f).text};});
    await test('latest of selected checkins independent of selection ordering',async function(){var f=fixture({loaded:false,categories:['questionnaires']});addCheckin(f,'source_'+'e'.repeat(32),'2026-09-14',[2,3,4,5]);addCheckin(f,'source_'+'f'.repeat(32),'2026-09-15',[4,4,3,3]);var ids=f.service.state.sources.map(function(s){return s.id;});assert(await invoke(f,{message:'Choose a step',sources:ids.reverse()})===null,'step failed');checkGuided(f);assert(reply(f).text.indexOf('2026-09-15')>=0&&reply(f).provenance.sourceRefs[0].id===ids[0],'wrong latest');return {message:reply(f).text};});
    await test('selected unrelated profile does not fabricate checkin',async function(){var f=fixture({loaded:false,profile:true,categories:['profile']});assert(await invoke(f,{message:'Explain my check-in',sources:['profile_owner']})===null,'missing checkin guidance failed');checkGuided(f);assert(reply(f).text.indexOf('Select a check-in')>=0&&reply(f).text.indexOf('Synthetic Profile')<0,'wrong grounding');assert(reply(f).provenance.sourceRefs.length===0,'irrelevant citation');return {message:reply(f).text};});
    await test('source denial precedes guided shortcut',async function(){var f=fixture({loaded:false,profile:true});var error=await invoke(f,{message:'Hello',sources:['profile_owner']});assert(error==='CONTEXT_NOT_APPROVED','unexpected '+error);noCommit(f);return {error:error};});
    await test('unapproved checkin denied before guided shortcut',async function(){var f=fixture({loaded:false,categories:['questionnaires']});addCheckin(f,'source_'+'e'.repeat(32),'2026-09-15',[4,4,3,3],false);var error=await invoke(f,{message:'Explain my check-in',sources:[f.service.state.sources[0].id]});assert(error==='CONTEXT_NOT_APPROVED','unexpected '+error);noCommit(f);return {error:error};});
    await test('local grant denial precedes guided shortcut',async function(){var f=fixture({loaded:false});f.service.state.grants.local=false;var error=await invoke(f);assert(error==='LOCAL_PERMISSION_REQUIRED','unexpected '+error);noCommit(f);return {error:error};});
    await test('expired local grant denial precedes guided shortcut',async function(){var f=fixture({loaded:false});f.service.state.grants.expiresAt='2000-01-01T00:00:00.000Z';var error=await invoke(f);assert(error==='LOCAL_PERMISSION_REQUIRED','unexpected '+error);noCommit(f);return {error:error};});
    var mutations=[
      ['epoch',function(f){f.service.epoch++;}],
      ['authority',function(f){replaceState(f,function(s){s.authorityEpoch++;});}],
      ['permission',function(f){replaceState(f,function(s){s.experience.localContext.revision++;});}],
      ['local grant',function(f){replaceState(f,function(s){s.grants.local=false;});}],
      ['vault lock',function(f){f.service.store.unlocked=false;}],
      ['session',function(f){f.service.session++;}]
    ];
    for(var mutation of mutations){await test('guided commit rejects change during MAC '+mutation[0],async function(){var f=fixture({loaded:false,beforeMac:function(f){mutation[1](f);}});var error=await invoke(f);assert(error==='CANCELLED'||error==='VAULT_LOCKED','unexpected '+error);noCommit(f);return {error:error};});}
    await test('selected source revision changes during MAC',async function(){var f=fixture({loaded:false,categories:['questionnaires'],beforeMac:function(f){replaceState(f,function(s){s.sources[0].revision++;s.sources[0].payload.balance=5;});}});addCheckin(f,'source_'+'e'.repeat(32),'2026-09-15',[4,4,3,3]);var error=await invoke(f,{message:'Explain my check-in',sources:[f.service.state.sources[0].id]});assert(error==='CANCELLED','changed source committed '+error);noCommit(f);return {error:error};});
    for(var message2 of ['Tell me a short story','My name is Nila','What name did I give?','Write a poem about a check-in','I could not sleep well']){
      await test('open chat retains inference '+message2,async function(){var f=fixture({output:message2==='I could not sleep well'?'{"message":"You said you could not sleep well.","sourceRefs":[]}':undefined});var pf=f.service.assertConversationAccess(message2,[],true);assert(pf===null,'open request routed');assert(await invoke(f,{message:message2})===null,'open request failed');assert(f.calls.length===1&&reply(f).mode==='qvac-device','model path missing');var receipt=JSON.parse(f.service.state.receipts[0].body);assert(receipt.result==='validated-generated-response','model receipt changed');return {mode:reply(f).mode};});
    }
    await test('ordinary model error retains603 diagnostic',async function(){var f=fixture({complete:function(){return Promise.reject(Error('STREAM_TIMEOUT'));}});var error=await invoke(f,{message:'Tell me a short story'});assert(error==='STREAM_TIMEOUT','diagnostic regression '+error);noCommit(f);return {error:error};});
    await test('guided operation remains idempotent',async function(){var f=fixture({loaded:false});assert(await invoke(f)===null,'first');var before=JSON.stringify(f.service.state);assert(await invoke(f)===null,'retry');assert(f.writes.length===1&&JSON.stringify(f.service.state)===before,'duplicate changed state');return {writes:f.writes.length};});
    await test('guided retry retains saved user id',async function(){var f=fixture({loaded:false,prior:'Hello'});assert(await invoke(f,{alreadySaved:true})===null,'retry');checkGuided(f);assert(f.service.state.conversation.length===2&&f.service.state.conversation[0].id==='message_'+'d'.repeat(32),'saved user replaced');return {messageIds:f.service.state.conversation.map(function(m){return m.id;})};});
    globalThis.__solarisTestResult={pass:results.every(function(r){return r.pass;}),total:results.length,cases:results,capturedModules:Object.keys(oracle.factories).length,suppressedEntrypoints:oracle.entries,executedModules:Array.from(new Set(oracle.loaded)).sort(function(a,b){return a-b;})};
    print(JSON.stringify(globalThis.__solarisTestResult));
  })().catch(function(e){print('HARNESS_ERROR '+String(e.stack||e));});
})();
