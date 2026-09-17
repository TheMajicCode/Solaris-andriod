import test from 'node:test';
import assert from 'node:assert/strict';
import {createQvacServiceBaseline} from './qvac-service-baseline.mjs';

// TEST-ONLY adapters. These do not replace native, policy or provisioner modules.
function fixture() {
  const calls = [];
  class RuntimeError extends Error {
    constructor(code, stage) { super(code); this.code = code; this.stage = stage; }
  }
  const runtime = {
    async heartbeat() { calls.push('heartbeat'); },
    async suspend() { calls.push('suspend'); },
    async resume() { calls.push('resume'); },
    async unloadModel(args) { calls.push(['unloadModel', args]); },
  };
  const policy = {
    RuntimeError,
    BUDGETS: {heartbeat: 11, cleanup: 12, status: 13},
    unknown: reason => ({state: 'unknown', value: null, reason}),
    known: value => ({state: 'known', value}),
    safeError: (error, stage) => error instanceof RuntimeError ? error : new RuntimeError('UNKNOWN', stage),
    preparationState: state => state,
    bounded(promise, budget, code, stage) {
      calls.push(['bounded', budget, code, stage]);
      return Promise.resolve(promise);
    },
  };
  const device = {isDevice: true};
  const Class = createQvacServiceBaseline({
    filesystem: {documentDirectory: 'file:///test-only/'},
    device,
    modelConfig: {MODEL: {bytes: 382156480}},
    runtimeModule: {lazyRuntime: factory => ({get: factory, peek: () => runtime})},
    runtimeFactoryModule: {createRuntime: () => { calls.push('runtime-created'); return runtime; }},
    policy,
    traceModule: {
      SafeTrace: class { add(...args) { calls.push(['trace', ...args]); } },
      transientId: () => 'test-transient-id',
    },
    provisionerModule: {
      ModelProvisioner: class {
        constructor(changed) { this.state = {verified: true}; this.changed = changed; }
        async recovery() { calls.push('recovery'); return {blocked: false}; }
        async stage(value) { calls.push(['stage', value]); }
      },
    },
  });
  return {service: new Class(), Class, calls, policy, runtime, device};
}

function operation() {
  return {ctx: {id: 'stable-test-id', epoch: 0, method: 'loadModel'}, cancelled: false,
    cancelAction: null, cancelPromise: null, pending: null, pendingSettled: true};
}

test('constructing baseline does not bootstrap native runtime or alter model storage', () => {
  const {service, calls} = fixture();
  assert.deepEqual(calls, []);
  assert.equal(service.modelRoot, 'file:///test-only/solaris-qvac-models/');
  assert.equal(service.choicePath, 'file:///test-only/solaris-model-preparation-v1.json');
  assert.equal(service.marker, 'file:///test-only/solaris-qvac-download.json');
  assert.equal(service.verifiedPath, null);
});

test('cached worker still requires a physical device, before native access', async () => {
  const {service, calls, device} = fixture();
  service.workerReady = true;
  device.isDevice = false;
  await assert.rejects(service.ensureWorker(operation()), {code: 'PHYSICAL_DEVICE_REQUIRED'});
  assert.deepEqual(calls, []);
});

test('baseline regression witness: cancellation during changed still permits deferred dispatch', async () => {
  const {service} = fixture();
  const op = operation();
  const seen = [];
  service.onChange = () => { op.cancelled = true; seen.push('cancelled'); };
  const work = service.step(op, 'heartbeat', () => { seen.push('dispatched'); }, 11);
  assert.deepEqual(seen, ['cancelled']);
  await assert.rejects(work, {code: 'CANCELLED'});
  assert.deepEqual(seen, ['cancelled', 'dispatched']);
  assert.equal(op.pendingSettled, true);
});

test('separate pending promise remains tracked after the bounded dispatch resolves', async () => {
  const {service} = fixture();
  const op = operation();
  let settle;
  const pending = new Promise(resolve => { settle = resolve; });
  const result = await service.step(op, 'heartbeat', () => 37, 11, true, pending);
  assert.equal(result, 37);
  assert.equal(op.pending, pending);
  assert.equal(op.pendingSettled, false);
  settle();
  await pending;
  assert.equal(op.pendingSettled, true);
});

test('cancellation action is deferred, unbound, cached, and acknowledgement is distinct from settlement', async () => {
  const {service} = fixture();
  const op = operation();
  let count = 0;
  op.cancelAction = function () { assert.equal(this, undefined); count++; };
  const first = service.cancelOperation(op);
  const cached = op.cancelPromise;
  const second = service.cancelOperation(op);
  assert.equal(count, 0);
  assert.equal(op.cancelPromise, cached);
  await Promise.all([first, second]);
  assert.equal(count, 1);
  assert.equal(service.cancellation, 'acknowledged');
});

test('unconfirmed pending settlement blocks runtime but retains valid model identity and path', async () => {
  const {service, policy} = fixture();
  const op = operation();
  op.pending = new Promise(() => {});
  op.pendingSettled = false;
  service.modelId = 'valid-model-id';
  service.verifiedPath = 'file:///existing-model.gguf';
  service.workerReady = true;
  policy.bounded = (_p, _ms, code, stage) => Promise.reject(new policy.RuntimeError(code, stage));
  await service.settleAfterFailure(op);
  assert.equal(service.blocked, true);
  assert.equal(service.workerReady, false);
  assert.equal(service.runtimeState.reason, 'RESTART_REQUIRED');
  assert.equal(service.cancellation, 'unconfirmed');
  assert.equal(service.modelId, 'valid-model-id');
  assert.equal(service.verifiedPath, 'file:///existing-model.gguf');
});

test('load failure cleanup explicitly retains model storage and clears current in finally', async () => {
  const {service, calls, policy} = fixture();
  service.modelId = 'valid-model-id';
  service.verifiedPath = 'file:///existing-model.gguf';
  const context = {id: 'retained-record-id', epoch: 4, method: 'loadModel'};
  await assert.rejects(service.run('loadModel', async op => {
    assert.equal(op.ctx, context);
    throw new policy.RuntimeError('LOAD_FAILURE', 'load');
  }, context), {code: 'LOAD_FAILURE'});
  assert.deepEqual(calls.find(c => Array.isArray(c) && c[0] === 'unloadModel'),
    ['unloadModel', {modelId: 'valid-model-id', clearStorage: false}]);
  assert.equal(service.modelId, null);
  assert.equal(service.verifiedPath, 'file:///existing-model.gguf');
  assert.equal(service.current, null);
  assert.deepEqual(context, {id: 'retained-record-id', epoch: 4, method: 'loadModel'});
});

test('baseline lifecycle queue reads latest active value at execution', async () => {
  const {service, calls} = fixture();
  service.workerReady = true;
  let release;
  service.lifecycleWork = new Promise(resolve => { release = resolve; });
  const background = service.lifecycle(false);
  const foreground = service.lifecycle(true);
  release();
  await Promise.all([background, foreground]);
  assert.equal(calls.filter(c => c === 'resume').length, 2);
  assert.equal(calls.includes('suspend'), false);
});

test('lifecycle errors outside transition try reject caller while stored queue remains usable', async () => {
  const {service, runtime, calls} = fixture();
  service.workerReady = true;
  service.runtime.peek = () => { throw new Error('test peek failure'); };
  await assert.rejects(service.lifecycle(false), /test peek failure/);
  await service.lifecycleWork;
  assert.equal(service.blocked, false);
  service.runtime.peek = () => runtime;
  await service.lifecycle(true);
  assert.equal(calls.includes('resume'), true);
});

test('transition failure blocks future worker use without clearing persistent model state', async () => {
  const {service, runtime} = fixture();
  service.workerReady = true;
  service.modelId = 'valid-model-id';
  runtime.suspend = async () => { throw new Error('test native suspend failure'); };
  await service.lifecycle(false);
  assert.equal(service.blocked, true);
  assert.equal(service.workerReady, false);
  assert.equal(service.runtimeState.reason, 'RESTART_REQUIRED');
  assert.equal(service.modelId, 'valid-model-id');
});
