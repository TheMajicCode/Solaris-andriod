// Original HBC factory and reconstructed source use identical synthetic deps.
// Every mock is explicit; unexpected native/dependency access fails closed.
(function () {
  'use strict';
  var oracle = globalThis.__solarisOracle;
  var liveTimers=Object.create(null),nextTimer=1;
  // Success-path timer fixtures never fire. They do not test elapsed time.
  globalThis.setTimeout=function(callback,delay){var id=nextTimer++;liveTimers[id]={callback:callback,delay:delay};return id;};
  globalThis.clearTimeout=function(id){delete liveTimers[id];};
  var expectedDeps = [38,67,8,9,592,593,599,602,603,604,912,913,914,916,716,918];
  function assert(value, why) { if (!value) throw Error(why); }
  assert(oracle && oracle.factories[591], 'Original QvacService module not captured');
  assert(JSON.stringify(oracle.factories[591].deps) === JSON.stringify(expectedDeps), 'Dependency vector changed');
  function deferred() {
    var resolve, reject;
    var promise = new Promise(function (a,b) { resolve=a; reject=b; });
    return {promise:promise, resolve:resolve, reject:reject};
  }
  function fixture(variant, options) {
    options = options || {};
    var events = [], rejectBudget = options.rejectBudget;
    function event() { events.push(JSON.parse(JSON.stringify(Array.prototype.slice.call(arguments)))); }
    function RuntimeError(code, stage) { this.code=code; this.stage=stage; this.message=code; }
    RuntimeError.prototype = Object.create(Error.prototype);
    RuntimeError.prototype.constructor = RuntimeError;
    var runtime = {
      heartbeat: function () { event('heartbeat'); return options.heartbeat ? options.heartbeat() : Promise.resolve('alive'); },
      resume: function () { event('resume'); return options.resume ? options.resume() : Promise.resolve(); },
      suspend: function () { event('suspend'); return options.suspend ? options.suspend() : Promise.resolve(); },
      unloadModel: function (arg) { event('unloadModel',arg); return Promise.resolve(); },
    };
    var cached = options.cached ? runtime : null;
    var lazy = {peek:function () { event('peek'); return cached; }, get:function () { event('get'); cached=runtime; return Promise.resolve(runtime); }};
    function SafeTrace() {}
    SafeTrace.prototype.add = function (ctx,kind,code) { event('trace',ctx,kind,code === undefined ? null : code); };
    function ModelProvisioner(onChange) { this.state={verified:false}; this.onChange=onChange; }
    ModelProvisioner.prototype.recovery = function () { event('recovery'); return Promise.resolve({blocked:!!options.recoveryBlocked}); };
    ModelProvisioner.prototype.stage = function (stage) { event('stage',stage); return options.stage ? options.stage(stage) : Promise.resolve(); };
    var policy = {
      BUDGETS:{cleanup:10,heartbeat:20,status:30,firstToken:40,completion:50}, RuntimeError:RuntimeError,
      bounded:function (promise,budget,code,phase) {
        event('bounded',budget,code,phase);
        // Immediate synthetic timeout injection. No claim of wall-clock timing.
        if (rejectBudget === code) { Promise.resolve(promise).catch(function () {}); return Promise.reject(new RuntimeError(code,phase)); }
        return Promise.resolve(promise);
      },
      unknown:function (reason) { return {state:'unknown',value:null,reason:reason}; },
      known:function (value) { return {state:'known',value:value,reason:null}; },
      safeError:function (error,phase) { return error instanceof RuntimeError ? error : new RuntimeError(error.code || 'UNEXPECTED',phase); },
      preparationState:function (input) { return input; },
    };
    var deps = {
      filesystem:{documentDirectory:'file:///synthetic/'}, device:{isDevice:options.isDevice !== false},
      modelConfig:{MODEL:{bytes:382156480,id:'synthetic-catalog-id',checksum:'synthetic-checksum'}}, runtimeModule:{lazyRuntime:function () { return lazy; }},
      runtimeFactoryModule:{createRuntime:function () { throw Error('Unexpected runtime factory execution'); }},
      policy:policy, traceModule:{SafeTrace:SafeTrace,transientId:function () { return 'synthetic-context'; }},
      provisionerModule:{ModelProvisioner:ModelProvisioner},
    };
    var Class;
    if (variant === 'source') {
      Class = createQvacServiceBaseline(deps);
    } else {
      var mocks = {593:deps.filesystem,599:deps.device,602:deps.modelConfig,603:deps.runtimeModule,
        604:deps.runtimeFactoryModule,912:policy,913:deps.traceModule,914:deps.provisionerModule};
      var cache = Object.create(null);
      function requireModule(id) {
        if (Object.prototype.hasOwnProperty.call(mocks,id)) return mocks[id];
        // Babel helpers only; extend this allowlist only after inspecting evidence.
        if ([8,9,10,11,12,38,39,40,41,42,43,67,591,592].indexOf(id)===-1) throw Error('Unexpected module '+id);
        if (cache[id]) return cache[id].exports;
        var record = oracle.factories[id];
        assert(record, 'Missing helper '+id);
        var module = {exports:{}}; cache[id]=module;
        oracle.loaded.push(id);
        record.factory(globalThis,requireModule,function () {throw Error('Unexpected importDefault');},
          function () {throw Error('Unexpected importAll');},module,module.exports,record.deps);
        return module.exports;
      }
      Class = requireModule(591).QvacService;
    }
    var service = new Class();
    service.onChange = function () { event('changed'); };
    return {service:service,events:events,runtime:runtime,policy:policy,event:event};
  }
  function operation() { return {ctx:{id:'op',epoch:1,method:'loadModel'},cancelled:false,cancelAction:null,cancelPromise:null,pending:null,pendingSettled:true}; }
  function state(service) {
    return {active:service.active,workerReady:service.workerReady,blocked:service.blocked,phase:service.phase,
      status:service.status,cancellation:service.cancellation,modelId:service.modelId,runtimeState:service.runtimeState,
      current:!!service.current,error:service.error ? {code:service.error.code,stage:service.error.stage}:null};
  }
  async function caught(promise) { try { await promise; return null; } catch (e) { return {code:e.code,stage:e.stage}; } }
  var cases = [
    {name:'constructor snapshot and guard precedence',run:async function (f) { f.event('snapshot',f.service.snapshot());f.service.active=false;f.service.current=operation();f.service.blocked=true;try {f.service.guard();} catch(e) {f.event('guard',e.code,e.stage);}f.service.active=true;try {f.service.guard();} catch(e) {f.event('guard',e.code,e.stage);}f.service.current=null;try {f.service.guard();} catch(e) {f.event('guard',e.code,e.stage);}f.service.guard(true); }},
    {name:'first startup',run:async function (f) { await f.service.ensureWorker(operation()); }},
    {name:'cached startup',options:{cached:true},run:async function (f) { f.service.workerReady=true; await f.service.ensureWorker(operation()); }},
    {name:'physical device gate',options:{isDevice:false},run:async function (f) { return caught(f.service.ensureWorker(operation())); }},
    {name:'recovery blocked',options:{recoveryBlocked:true},run:async function (f) { return caught(f.service.ensureWorker(operation())); }},
    {name:'heartbeat rejection',options:{heartbeat:function () { return Promise.reject({code:'HEARTBEAT_FAILED'}); }},run:async function (f) { return caught(f.service.ensureWorker(operation())); }},
    {name:'background during final startup stage leaves ready true',run:async function (f) { var gate=deferred(),arrived=deferred();f.service.provisioner.stage=function (stage) {f.event('stage',stage);if(stage==='idle'){arrived.resolve();return gate.promise;}return Promise.resolve();};var op=operation();f.service.current=op;var startup=f.service.ensureWorker(op);await arrived.promise;await f.service.lifecycle(false);gate.resolve();await startup; }},
    {name:'background unready skips suspend',options:{cached:true},run:async function (f) { await f.service.lifecycle(false); }},
    {name:'ready background cancels then suspends',options:{cached:true},run:async function (f) { f.service.workerReady=true;f.service.current=operation();await f.service.lifecycle(false); }},
    {name:'picking background does not cancel',options:{cached:true},run:async function (f) { f.service.workerReady=true;f.service.picking=true;f.service.current=operation();await f.service.lifecycle(false); }},
    {name:'lifecycle timeout blocks',options:{cached:true,rejectBudget:'LIFECYCLE_TIMEOUT'},run:async function (f) { f.service.workerReady=true;await f.service.lifecycle(false); }},
    {name:'queued lifecycle uses latest active',options:{cached:true},run:async function (f) { f.service.workerReady=true;var gate=deferred();f.service.lifecycleWork=gate.promise;var a=f.service.lifecycle(false),b=f.service.lifecycle(true);gate.resolve();await Promise.all([a,b]); }},
    {name:'step cancelled before action microtask',run:async function (f) { var op=operation();var work=f.service.step(op,'load-model',function () {f.event('action');return 42;},20,true);op.cancelled=true;return caught(work); }},
    {name:'step separate pending ownership',run:async function (f) { var op=operation(),pending=deferred();await f.service.step(op,'load-model',function () {f.event('action');return 42;},20,true,pending.promise);f.event('pendingSettled',op.pendingSettled);pending.resolve();await Promise.resolve();f.event('pendingSettled',op.pendingSettled); }},
    {name:'step thenable settlement',run:async function (f) { var op=operation();await f.service.step(op,'heartbeat',function () {f.event('action');return {then:function (resolve) {f.event('thenable');resolve(42);}};},20,true);f.event('pendingSettled',op.pendingSettled); }},
    {name:'cancel action acknowledgement',run:async function (f) { var op=operation();op.cancelAction=function () {f.event('cancelAction');};await f.service.cancelOperation(op);await f.service.cancelOperation(op); }},
    {name:'cancel action rejection remains unconfirmed',run:async function (f) { var op=operation();op.cancelAction=function () {f.event('cancelAction');return Promise.reject(Error('synthetic'));};await f.service.cancelOperation(op); }},
    {name:'pending settlement timeout',options:{rejectBudget:'SETTLEMENT_UNCONFIRMED'},run:async function (f) { var op=operation();op.pending=deferred().promise;op.pendingSettled=false;await f.service.settleAfterFailure(op); }},
    {name:'run success cleanup',run:async function (f) { return f.service.run('loadModel',async function () {f.event('action');return 42;}); }},
    {name:'run crash blocks',run:async function (f) { return caught(f.service.run('loadModel',async function () {throw new f.policy.RuntimeError('QVAC_WORKER_CRASHED','heartbeat');})); }},
    {name:'run load failure unloads without clearing storage',options:{cached:true},run:async function (f) { f.service.modelId='retained-model-id';return caught(f.service.run('loadModel',async function () {throw Error('synthetic');})); }},
    {name:'run foreground guard',run:async function (f) { f.service.active=false;return caught(f.service.run('loadModel',async function () {f.event('FORBIDDEN action');})); }},
    {name:'run cancelled completion retains model',options:{cached:true},run:async function (f) { f.service.modelId='retained-model-id';f.service.workerReady=true;return caught(f.service.run('completePublic',async function (op) {op.cancelled=true;throw new f.policy.RuntimeError('CANCELLED','completion');})); }},
    {name:'run lifecycle promise replaced',run:async function (f) { var gate=deferred();f.service.lifecycleWork=gate.promise;var work=f.service.run('loadModel',async function () {f.event('action');});f.service.lifecycleWork=gate.promise.then(function () {f.event('newLifecycle');});gate.resolve();await work; }},
  ];
  (async function () {
    var results=[];
    for (var c of cases) {
      var outputs=[];
      for (var variant of ['bytecode','source']) {
        var f=fixture(variant,c.options);
        var value=await c.run(f);
        outputs.push({events:f.events,state:state(f.service),result:value === undefined ? null:value});
      }
      var equal=JSON.stringify(outputs[0]) === JSON.stringify(outputs[1]);
      results.push({name:c.name,pass:equal,bytecode:outputs[0],source:outputs[1]});
    }
    var failed=results.filter(function (r) {return !r.pass;});
    // These methods are NOT in the partial source reconstruction. Run their
    // original bytecode, including original run/step, with sentinel dispatch.
    var witnesses=[];
    for(var scenario of ['private-initially-denied','private-revoked-during-stage','public-not-ready','public-background-during-stage']) {
      var f=fixture('bytecode'),service=f.service,eligible=scenario!=='private-initially-denied',dispatches=[];
      service.modelId='synthetic-model';service.workerReady=scenario!=='public-not-ready';
      service.provisioner.stage=function(stage) {
        f.event('stage',stage);
        if(stage==='stream') {eligible=false;if(scenario==='public-background-during-stage')service.active=false;}
        return Promise.resolve();
      };
      f.runtime.completion=function(options) {
        dispatches.push({eligible:eligible,active:service.active,options:options});
        throw new f.policy.RuntimeError('SYNTHETIC_DISPATCH_PROBE','local');
      };
      // Runtime normally exists after model load; fixture explicitly supplies it.
      service.runtime.peek=function(){f.event('peek');return f.runtime;};
      var error=await caught(scenario.indexOf('private')===0
        ? service.completePrivate('{}',function(){return eligible;},false)
        : service.completePublic('smoke'));
      var repairedSite=scenario==='private-revoked-during-stage'||scenario==='public-background-during-stage';
      var expectedDispatch=repairedSite && globalThis.__solarisExpectedGuards!==true;
      var expectedError=repairedSite && !expectedDispatch ? 'CANCELLED'
        : scenario==='private-initially-denied'?'CANCELLED':'QVAC_NOT_READY';
      var pass=dispatches.length===(expectedDispatch?1:0) && !!error
        && (expectedDispatch ? error.code==='SYNTHETIC_DISPATCH_PROBE'
          : error.code===expectedError)
        && (!expectedDispatch || dispatches[0].eligible===false)
        && (!expectedDispatch || scenario!=='public-background-during-stage' || dispatches[0].active===false);
      witnesses.push({name:scenario,pass:pass,dispatches:dispatches,error:error,events:f.events,state:state(service)});
    }
    var witnessFailures=witnesses.filter(function(w){return !w.pass;});
    globalThis.__solarisTestResult={pass:failed.length === 0 && witnessFailures.length===0,total:results.length,failures:failed.length,
      capturedModules:Object.keys(oracle.factories).length,suppressedEntrypoints:oracle.entries,
      executedModules:Array.from(new Set(oracle.loaded)).sort(function (a,b) {return a-b;}),cases:results,
      bytecodeOnlyWitnesses:witnesses};
    print(JSON.stringify(__solarisTestResult));
  })().catch(function (error) { globalThis.__solarisTestError=String(error.stack || error);print('HARNESS_ERROR '+__solarisTestError); });
})();
