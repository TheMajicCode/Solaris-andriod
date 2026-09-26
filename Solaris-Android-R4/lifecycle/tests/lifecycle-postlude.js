// Actual retained HBC lifecycle and DailyService lock tests; native adapters synthetic.
(function () {
  'use strict';
  var D=globalThis.__dailyLifecycleFixtures,Q=globalThis.__qvacLifecycleFixtures,results=[];
  // Greetings are a reviewed deterministic path in 604. Exercise open chat
  // explicitly so lifecycle tests still reach the model boundary they test.
  var openChat='A short reflection please';
  function assert(v,m){if(!v)throw Error(m);}
  function clone(x){return JSON.parse(JSON.stringify(x));}
  function deferred(){var resolve,reject;var promise=new Promise(function(a,b){resolve=a;reject=b;});return {promise:promise,resolve:resolve,reject:reject};}
  async function test(name,body){try{results.push({name:name,pass:true,details:await body()});}catch(e){results.push({name:name,pass:false,error:String(e.stack||e)});}}
  function withLock(f){var counts={cancel:0,lock:0};f.service.qvac.cancelProvision=function(){counts.cancel++;return Promise.resolve();};f.service.store.lock=function(){counts.lock++;this.unlocked=false;return Promise.resolve();};return counts;}
  function op(){return {ctx:{id:'synthetic-lifecycle',epoch:1,method:'completeLocalTask'},cancelled:false,cancelAction:null,cancelPromise:null,pending:null,pendingSettled:true};}
  function events(f,name){return f.events.filter(function(e){return e[0]===name;});}
  (async function(){
    await test('pending model turn is not yet a saved user message',async function(){
      var entered=deferred(),finish=deferred(),f=D.fixture({complete:function(){entered.resolve();return finish.promise;}}),run=D.invoke(f,{message:'SYNTHETIC_PENDING_TEXT'});await entered.promise;
      assert(f.writes.length===0&&f.service.state.conversation.length===0,'pending turn unexpectedly persisted');
      finish.resolve({text:'{"message":"Hello!","sourceRefs":[]}',contentEvents:1});assert(await run===null,'completion failed');assert(f.writes.length===1&&f.service.state.conversation.length===2,'completed pair not atomic');
      return {writesBeforeReply:0,writesAfterReply:1,limitation:'An interrupted pending send has no saved user message to recover.'};
    });
    await test('explicit lock revokes epoch and session synchronously',async function(){
      var f=D.fixture(),counts=withLock(f),epoch=f.service.epoch,session=f.service.session,locking=f.service.lock();
      assert(f.service.state===null&&f.service.restoreData===null,'private state retained');assert(f.service.epoch===epoch+1&&f.service.session===session+1,'authority not revoked immediately');
      assert(f.service.lock()===locking,'lock not deduplicated');await locking;assert(counts.cancel===1&&counts.lock===1,'duplicate native lock/cancel');
      return {stateCleared:true,epochIncrement:1,sessionIncrement:1,cancelCalls:counts.cancel,lockCalls:counts.lock};
    });
    await test('reply completed after lock cannot save records or receipt',async function(){
      var entered=deferred(),finish=deferred(),f=D.fixture({complete:function(){entered.resolve();return finish.promise;}}),counts=withLock(f),run=D.invoke(f,{message:'SYNTHETIC_INTERRUPTED_TEXT'});await entered.promise;
      await f.service.lock();assert(f.eligible()===false,'old predicate still eligible');finish.resolve({text:'{"message":"Hello!","sourceRefs":[]}',contentEvents:1});var error=await run;
      assert(error==='CANCELLED'||error==='VAULT_LOCKED','wrong cancellation '+error);assert(f.writes.length===0&&f.macs.length===0,'late reply persisted');assert(f.service.state===null,'state resurrected');
      return {error:error,writes:0,receipts:0,stateRemainsNull:true,cancelCalls:counts.cancel};
    });
    await test('lock keeps previously persisted conversation bytes intact',async function(){
      var f=D.fixture();withLock(f);assert(await D.invoke(f,{message:openChat})===null,'initial reply');assert(f.calls.length===1,'open chat bypassed model');var durable=JSON.stringify(f.writes[0].state),ids=f.writes[0].state.conversation.map(function(m){return m.id;});await f.service.lock();
      assert(f.writes.length===1&&JSON.stringify(f.writes[0].state)===durable,'existing saved state changed on lock');return {preservedMessageIds:ids,noAdditionalWrite:true};
    });
    await test('restoring unlocked saved state never replays interrupted inference',async function(){
      var entered=deferred(),finish=deferred(),f=D.fixture({complete:function(){entered.resolve();return finish.promise;}}),saved=clone(f.service.state);withLock(f);
      var run=D.invoke(f,{message:'SYNTHETIC_INTERRUPTED_TEXT'});await entered.promise;await f.service.lock();finish.resolve({text:'{"message":"Hello!","sourceRefs":[]}',contentEvents:1});await run;
      // Synthetic successful vault unlock projects its previously saved state.
      f.service.state=clone(saved);f.service.store.unlocked=true;f.service.changed();await Promise.resolve();
      assert(f.calls.length===1&&f.writes.length===0,'unlock replayed work');assert(f.service.state.conversation.length===0,'interrupted text invented');
      return {dispatchesBeforeAndAfterUnlock:1,pendingTextRecovered:false,unlockAdapter:'synthetic state projection; no biometric/native unlock exercised'};
    });
    await test('authority change during generation rejects late save',async function(){
      var entered=deferred(),finish=deferred(),f=D.fixture({complete:function(){entered.resolve();return finish.promise;}}),run=D.invoke(f,{message:openChat});await entered.promise;assert(f.calls.length===1,'open chat bypassed model');f.service.state=clone(f.service.state);f.service.state.authorityEpoch++;
      finish.resolve({text:'{"message":"Hello!","sourceRefs":[]}',contentEvents:1});var error=await run;assert(error==='CANCELLED','authority change failed '+error);assert(f.writes.length===0,'late write');return {error:error,writes:0};
    });
    await test('active to inactive cancels current task before suspend and retains model',async function(){
      var f=Q.fixture('bytecode',{cached:true}),s=f.service,current=op();s.workerReady=true;s.modelId='synthetic-existing-model';s.current=current;current.cancelAction=function(){f.event('cancelAction');return Promise.resolve();};
      var work=s.lifecycle(false);assert(s.active===false,'background not immediate');await work;
      assert(current.cancelled===true,'current task not cancelled');assert(events(f,'cancelAction').length===1&&events(f,'suspend').length===1,'cancel/suspend count');assert(f.events.findIndex(function(e){return e[0]==='cancelAction';})<f.events.findIndex(function(e){return e[0]==='suspend';}),'suspend before cancellation');assert(s.modelId==='synthetic-existing-model'&&events(f,'unloadModel').length===0,'model removed');
      return {cancelCalls:1,suspendCalls:1,modelRetained:true};
    });
    await test('inactive to active resumes runtime but never uncancels old task',async function(){
      var f=Q.fixture('bytecode',{cached:true}),s=f.service,current=op();s.workerReady=true;s.modelId='synthetic-existing-model';s.current=current;await s.lifecycle(false);await s.lifecycle(true);
      assert(s.active===true&&current.cancelled===true,'old task reauthorized');assert(events(f,'resume').length===1,'runtime resume count');assert(events(f,'heartbeat').length===0&&events(f,'unloadModel').length===0,'extra runtime work');var error;try{s.check(current);}catch(e){error=e.code;}assert(error==='CANCELLED','old dispatch guard allowed work');
      return {runtimeResumeCalls:1,oldOperationRemainsCancelled:true,guardError:error};
    });
    await test('background admission fails before invoking requested action',async function(){
      var f=Q.fixture('bytecode',{cached:true}),called=0;await f.service.lifecycle(false);var error=await Q.caught(f.service.run('completeLocalTask',function(){called++;return 'synthetic';}));assert(error.code==='FOREGROUND_REQUIRED'&&called===0,'background dispatch admitted');return {error:error.code,dispatchCount:called};
    });
    await test('failed lifecycle transition blocks reuse without deleting model',async function(){
      var f=Q.fixture('bytecode',{cached:true,rejectBudget:'LIFECYCLE_TIMEOUT'}),s=f.service;s.workerReady=true;s.modelId='synthetic-existing-model';await s.lifecycle(false);await s.lifecycle(true);
      assert(s.blocked===true&&s.workerReady===false,'uncertain runtime not blocked');assert(s.modelId==='synthetic-existing-model'&&events(f,'unloadModel').length===0,'model storage affected');assert(events(f,'resume').length===0,'blocked runtime resumed');
      return {blocked:true,modelRetained:true,resumeCalls:0,limitation:'Synthetic timeout injection, not an Android wall-clock test.'};
    });
    print(JSON.stringify({pass:results.every(function(r){return r.pass;}),total:results.length,cases:results,capturedModules:Object.keys(globalThis.__solarisOracle.factories).length,suppressedEntrypoints:globalThis.__solarisOracle.entries}));
  })().catch(function(e){print('HARNESS_ERROR '+String(e.stack||e));});
})();
