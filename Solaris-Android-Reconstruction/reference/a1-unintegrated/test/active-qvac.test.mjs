import test from 'node:test';
import assert from 'node:assert/strict';
import {withActiveQvac, admissionStatus} from '../src/active-qvac.mjs';
import {recoveredSdk} from './recovered-sdk.mjs';

const deferred = () => { let resolve, reject; const promise=new Promise((a,b)=>{resolve=a;reject=b;}); return {promise,resolve,reject}; };
const drain = async () => { await new Promise(setImmediate); await new Promise(setImmediate); };
const defaults = {isCurrent:()=>true, timeoutMs:1000};
const code = expected => error => error.code === expected;

test('skipped startup reconciliation: exact SDK rejects suspended load; helper resumes before one dispatch', async()=>{
  const {sdk,runtime,calls}=await recoveredSdk();
  await runtime.suspend();
  assert.throws(()=>sdk.assertLifecycleAllowed({type:'load-model'}),code('QVAC_LIFECYCLE_OPERATION_BLOCKED'));
  let dispatched=0;
  calls.length=0;
  const result=await withActiveQvac({...defaults,runtime,dispatch:()=>{dispatched++;sdk.assertLifecycleAllowed({type:'load-model'});return 'synthetic hello';}});
  assert.equal(result,'synthetic hello');assert.equal(dispatched,1);
  assert.deepEqual(calls,['state','resume','state']);
  assert.equal(sdk.getLifecycleState(),'active');
});

test('active SDK needs no resume and public state is a string',async()=>{
  const {runtime,calls}=await recoveredSdk();
  assert.equal(await runtime.state(),'active');calls.length=0;
  assert.equal(await withActiveQvac({...defaults,runtime,dispatch:()=>42}),42);
  assert.deepEqual(calls,['state']);
});

test('resume waits for an exact SDK suspend in progress',async()=>{
  const {sdk,runtime}=await recoveredSdk();const hold=deferred();
  sdk.registerCorestore({suspend:()=>hold.promise,resume:async()=>{}},{label:'synthetic store'});
  const suspending=runtime.suspend();assert.equal(sdk.getLifecycleState(),'suspending');
  let dispatched=0;
  const job=withActiveQvac({...defaults,runtime,dispatch:()=>{dispatched++;sdk.assertLifecycleAllowed({type:'load-model'});}});
  await drain();assert.equal(dispatched,0);assert.equal(admissionStatus(runtime).stage,'resume');
  hold.resolve();await suspending;await job;assert.equal(dispatched,1);
});

test('failed SDK resume leaves suspended; no automatic retry or operation; explicit retry can recover',async()=>{
  const {sdk,runtime,calls}=await recoveredSdk();let fail=true,dispatched=0;
  sdk.registerCorestore({suspend:async()=>{},resume:async()=>{if(fail)throw Error('synthetic private text must not be exposed');}},{label:'synthetic store'});
  await runtime.suspend();calls.length=0;
  await assert.rejects(withActiveQvac({...defaults,runtime,dispatch:()=>dispatched++}),error=>{
    assert.equal(error.code,'SOLARIS_AI_RESUME_FAILED');assert(!error.message.includes('private'));return true;
  });
  assert.equal(sdk.getLifecycleState(),'suspended');assert.equal(dispatched,0);
  assert.equal(calls.filter(x=>x==='resume').length,1);
  fail=false;await withActiveQvac({...defaults,runtime,dispatch:()=>dispatched++});
  assert.equal(dispatched,1);
});

test('resume acknowledgement alone does not prove active',async()=>{
  let dispatched=0,resumed=0;
  const runtime={state:async()=>'suspended',resume:async()=>{resumed++;}};
  await assert.rejects(withActiveQvac({...defaults,runtime,dispatch:()=>dispatched++}),code('SOLARIS_AI_NOT_ACTIVE'));
  assert.equal(resumed,1);assert.equal(dispatched,0);
});

test('malformed public state response fails closed rather than confusing wire response shape',async()=>{
  for(const value of [{type:'state',state:'active'},undefined,'unknown']) {
    let calls=0;
    const runtime={state:async()=>value,resume:async()=>calls++};
    await assert.rejects(withActiveQvac({...defaults,runtime,dispatch:()=>calls++}),code('SOLARIS_AI_STATE_INVALID'));
    assert.equal(calls,0);
  }
});

test('second admission cannot dispatch while first native operation is pending',async()=>{
  const {runtime}=await recoveredSdk();const hold=deferred(),entered=deferred();let calls=0;
  const first=withActiveQvac({...defaults,runtime,dispatch:()=>{calls++;entered.resolve();return hold.promise;}});
  await entered.promise;
  await assert.rejects(withActiveQvac({...defaults,runtime,dispatch:()=>calls++}),code('SOLARIS_AI_ADMISSION_BUSY'));
  assert.equal(calls,1);hold.resolve('done');assert.equal(await first,'done');
  assert.equal(admissionStatus(runtime).pending,false);
});

test('timeout does not release an unsettled SDK resume or admit a duplicate operation',async()=>{
  const {sdk,runtime}=await recoveredSdk();const hold=deferred();let dispatched=0;
  sdk.registerCorestore({suspend:async()=>{},resume:()=>hold.promise},{label:'synthetic store'});
  await runtime.suspend();
  await assert.rejects(withActiveQvac({...defaults,timeoutMs:25,runtime,dispatch:()=>dispatched++}),error=>error.code==='SOLARIS_AI_ADMISSION_TIMEOUT'&&error.stage==='resume');
  assert.equal(admissionStatus(runtime).pending,true);assert.equal(sdk.getLifecycleState(),'resuming');
  await assert.rejects(withActiveQvac({...defaults,runtime,dispatch:()=>dispatched++}),code('SOLARIS_AI_ADMISSION_BUSY'));
  hold.resolve();await drain();assert.equal(dispatched,0);assert.equal(admissionStatus(runtime).pending,false);
  await withActiveQvac({...defaults,runtime,dispatch:()=>dispatched++});assert.equal(dispatched,1);
});

test('timeout after dispatch discards late result and holds ownership until actual settlement',async()=>{
  const {runtime}=await recoveredSdk();const hold=deferred();let dispatched=0,released=0;
  const job=withActiveQvac({...defaults,timeoutMs:25,runtime,dispatch:()=>{dispatched++;return hold.promise;}});
  const observed=job.then(()=>{released++;});
  await assert.rejects(observed,code('SOLARIS_AI_ADMISSION_TIMEOUT'));
  assert.equal(admissionStatus(runtime).pending,true);
  hold.resolve('late synthetic result');await drain();
  assert.equal(dispatched,1);assert.equal(released,0);assert.equal(admissionStatus(runtime).pending,false);
});

test('lock/permission/worker invalidation during state query prevents resume and dispatch',async()=>{
  const hold=deferred(),entered=deferred();let current=true,actions=0;
  const runtime={state:()=>{entered.resolve();return hold.promise;},resume:async()=>actions++};
  const job=withActiveQvac({...defaults,runtime,isCurrent:()=>current,dispatch:()=>actions++});
  await entered.promise;current=false;hold.resolve('suspended');
  await assert.rejects(job,code('SOLARIS_AI_REQUEST_INVALIDATED'));assert.equal(actions,0);
});

test('navigation invalidation while operation completes prevents result release',async()=>{
  const {runtime}=await recoveredSdk();const hold=deferred(),entered=deferred();let current=true;
  const job=withActiveQvac({...defaults,runtime,isCurrent:()=>current,dispatch:()=>{entered.resolve();return hold.promise;}});
  await entered.promise;current=false;hold.resolve('synthetic result');
  await assert.rejects(job,code('SOLARIS_AI_REQUEST_INVALIDATED'));
});

test('abort before start makes no SDK call; abort during resume retains unsettled ownership',async()=>{
  const {sdk,runtime,calls}=await recoveredSdk();const early=new AbortController();early.abort();
  await assert.rejects(withActiveQvac({...defaults,runtime,signal:early.signal,dispatch:()=>{throw Error('must not dispatch');}}),code('SOLARIS_AI_REQUEST_INVALIDATED'));
  assert.deepEqual(calls,[]);
  const hold=deferred();sdk.registerCorestore({suspend:async()=>{},resume:()=>hold.promise},{label:'synthetic store'});await runtime.suspend();
  const later=new AbortController();let dispatches=0;
  const job=withActiveQvac({...defaults,runtime,signal:later.signal,dispatch:()=>dispatches++});
  await drain();later.abort();await assert.rejects(job,code('SOLARIS_AI_REQUEST_INVALIDATED'));
  assert.equal(admissionStatus(runtime).pending,true);hold.resolve();await drain();assert.equal(dispatches,0);
});

test('actual gate rejection after active observation is propagated once, never replayed',async()=>{
  const {sdk,runtime}=await recoveredSdk();let dispatches=0;
  await assert.rejects(withActiveQvac({...defaults,runtime,dispatch:async()=>{dispatches++;await runtime.suspend();sdk.assertLifecycleAllowed({type:'completion'});}}),code('QVAC_LIFECYCLE_OPERATION_BLOCKED'));
  assert.equal(dispatches,1);assert.equal(sdk.getLifecycleState(),'suspended');
});

test('guard exceptions are private, and non-boolean/async guards never grant admission',async()=>{
  for(const isCurrent of [()=>{throw Error('private identity');},()=>Promise.resolve(true),()=>Promise.reject(Error('private guard rejection')),()=>1]) {
    let calls=0;const runtime={state:async()=>{calls++;return 'active';},resume:async()=>calls++};
    await assert.rejects(withActiveQvac({...defaults,runtime,isCurrent,dispatch:()=>calls++}),error=>error.code==='SOLARIS_AI_REQUEST_INVALIDATED'&&!error.message.includes('private'));
    assert.equal(calls,0);
  }
});

test('failed state query produces a bounded error and no resume or operation',async()=>{
  let calls=0;
  const runtime={state:async()=>{throw Error('private native detail');},resume:async()=>calls++};
  await assert.rejects(withActiveQvac({...defaults,runtime,dispatch:()=>calls++}),error=>error.code==='SOLARIS_AI_STATE_QUERY_FAILED'&&!error.message.includes('private'));
  assert.equal(calls,0);assert.equal(admissionStatus(runtime).pending,false);
});

test('an event-loop stall cannot admit dispatch after the elapsed budget',async()=>{
  let dispatched=0;
  const runtime={state:async()=>{
    const until=performance.now()+40;
    while(performance.now()<until) { /* synthetic blocked JS turn: timer cannot fire */ }
    return 'active';
  },resume:async()=>{}};
  await assert.rejects(withActiveQvac({...defaults,timeoutMs:5,runtime,dispatch:()=>dispatched++}),code('SOLARIS_AI_ADMISSION_TIMEOUT'));
  assert.equal(dispatched,0);assert.equal(admissionStatus(runtime).pending,false);
});

test('an event-loop stall during dispatch cannot release a result after the budget',async()=>{
  const {runtime}=await recoveredSdk();let dispatched=0;
  await assert.rejects(withActiveQvac({...defaults,timeoutMs:5,runtime,dispatch:()=>{
    dispatched++;const until=performance.now()+40;
    while(performance.now()<until) { /* synthetic synchronous native callback */ }
    return 'late synthetic result';
  }}),code('SOLARIS_AI_ADMISSION_TIMEOUT'));
  assert.equal(dispatched,1);assert.equal(admissionStatus(runtime).pending,false);
});

test('a missing or backwards monotonic clock fails closed',async()=>{
  let now=100,dispatched=0;
  const runtime={state:async()=>{now=99;return 'active';},resume:async()=>{}};
  await assert.rejects(withActiveQvac({...defaults,runtime,monotonicNow:()=>now,dispatch:()=>dispatched++}),code('SOLARIS_AI_CLOCK_INVALID'));
  await assert.rejects(withActiveQvac({...defaults,runtime,monotonicNow:()=>NaN,dispatch:()=>dispatched++}),code('SOLARIS_AI_CLOCK_INVALID'));
  assert.equal(dispatched,0);
});
