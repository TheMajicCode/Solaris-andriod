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
    var mocks={940:{VaultStore:VaultStore},950:{nativeVault:function(){return {newId:newId,mac:function(s){macs.push(s);return f.macGate ? f.macGate(s) : Promise.resolve('a'.repeat(64));}};}}};
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
globalThis.__reviewFixture={fixture:fixture,invoke:invoke,replaceState:replaceState};
})();
