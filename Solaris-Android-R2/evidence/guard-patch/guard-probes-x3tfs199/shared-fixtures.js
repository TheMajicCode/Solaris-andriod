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

 globalThis.__solarisFixtures={fixture:fixture,caught:caught,state:state,liveTimers:liveTimers};
})();
