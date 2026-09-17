// Generated solely by stripping ESM export; do not edit.
/**
 * Controlled, partial semantic reconstruction of the code-601 QvacService.
 * Evidence: ../../evidence/writer-baseline/function-*.hasm; docs/HOST-MAPPING.md.
 * This is the EXISTING behavior, including known races. It is not a repair,
 * a full application, or recovered original TypeScript. No native adapter is
 * provided here. Dependencies must be the evidenced modules or explicit tests.
 */
function createQvacServiceBaseline({
  filesystem,             // module environment slot 7: documentDirectory
  device,                 // slot 8: isDevice
  modelConfig,            // slot 9: MODEL.bytes
  runtimeModule,          // slot 10: lazyRuntime
  runtimeFactoryModule,   // slot 11: createRuntime
  policy,                 // slot 12: BUDGETS, RuntimeError, bounded, etc.
  traceModule,            // slot 13: SafeTrace, transientId
  provisionerModule,      // slot 14: ModelProvisioner
}) {
  return class QvacService {
    // #7146; arrow callback #7147. Default arguments remain positional.
    constructor(trace = new traceModule.SafeTrace(), budgets = {...policy.BUDGETS}) {
      this.budgets = budgets;
      this.provisioner = new provisionerModule.ModelProvisioner(() => this.changed());
      this.recoveryInfo = null;
      this.transferImport = false;
      this.onProgress = null;
      this.onToken = null;
      this.onChange = null;
      this.runtime = (0, runtimeModule.lazyRuntime)(runtimeFactoryModule.createRuntime);
      this.current = null;
      this.active = true;
      this.lifecycleWork = Promise.resolve();
      this.picking = false;
      this.workerReady = false;
      this.blocked = false;
      this.modelId = null;
      this.verifiedPath = null;
      this.status = 'not-installed';
      this.phase = 'idle';
      this.error = null;
      this.progress = 0;
      this.receivedBytes = 0;
      this.lastProgressAt = 0;
      this.marker = ''.concat(filesystem.documentDirectory, 'solaris-qvac-download.json');
      this.modelRoot = ''.concat(filesystem.documentDirectory, 'solaris-qvac-models/');
      this.localStatus = null;
      this.statusWork = null;
      this.prepareWork = null;
      this.preparationChoice = {chosen: false, enabled: false, mobileData: false};
      this.choiceLoaded = false;
      this.choiceRead = null;
      this.choiceWrite = Promise.resolve();
      this.choiceEpoch = 0;
      this.attemptedPreparationEpoch = null;
      this.choicePath = ''.concat(filesystem.documentDirectory, 'solaris-model-preparation-v1.json');
      this.catalog = (0, policy.unknown)('NOT_CHECKED');
      this.runtimeState = (0, policy.unknown)('NOT_STARTED');
      this.cancellation = 'none';
      this.output = '';
      this.receipt = null;
      this.inference = {state: 'not-run', code: null, completedAt: null};
      this.trace = trace;
    }

    // #7148
    context(method, supplied) {
      return supplied ?? {id: (0, traceModule.transientId)(), epoch: 0, method};
    }

    // #7149: deliberately exposes the original field names and null handling.
    snapshot() {
      return {
        preparation: this.preparation(),
        preparationChoice: {...this.preparationChoice},
        transfer: this.provisioner.state,
        recovery: this.recoveryInfo,
        importing: this.transferImport,
        status: this.status,
        phase: this.phase,
        error: this.error ? {code: this.error.code, stage: this.error.stage} : null,
        busy: Boolean(this.current),
        blocked: this.blocked,
        loaded: Boolean(this.modelId && this.workerReady && !this.blocked && this.active),
        verified: this.provisioner.state.verified === true,
        progress: this.progress,
        receivedBytes: this.receivedBytes,
        runtime: this.runtimeState,
        catalog: this.catalog,
        cancellation: this.cancellation,
        output: this.output,
        receipt: this.receipt,
        inference: {...this.inference},
        local: this.localStatus,
      };
    }

    // #7150
    preparation() {
      return (0, policy.preparationState)({
        transfer: this.provisioner.state,
        phase: this.phase,
        preparing: this.current?.ctx.method === 'loadModel' && !this.current.cancelled,
        loaded: Boolean(this.modelId && this.workerReady && !this.blocked && this.active),
        blocked: this.blocked,
        recovery: this.recoveryInfo,
        error: this.error,
      });
    }

    // #7151: retain callback receiver.
    changed() { this.onChange?.(); }

    // #7152
    publishProgress(force = false) {
      const now = Date.now();
      if (!force && now - this.lastProgressAt < 150) return;
      this.lastProgressAt = now;
      this.onProgress?.({
        status: this.status,
        phase: this.phase,
        percent: this.progress,
        receivedBytes: this.receivedBytes,
        exactBytes: modelConfig.MODEL.bytes,
      });
      this.changed();
    }

    // #7167. Precedence: foreground, busy, blocked (unless import override).
    guard(allowBlocked = false) {
      if (!this.active) throw new policy.RuntimeError('FOREGROUND_REQUIRED', 'service');
      if (this.current) throw new policy.RuntimeError('QVAC_BUSY', 'service');
      if (this.blocked && !allowBlocked) {
        throw new policy.RuntimeError('RUNTIME_RESTART_REQUIRED', 'service');
      }
    }

    // #7168. Baseline has no ownership, generation, blocked or worker-state check.
    check(operation) {
      if (operation.cancelled || !this.active) {
        throw new policy.RuntimeError('CANCELLED', this.phase);
      }
    }

    // Wrapper #7170; generators #7172, #7174. No-action path stores no promise.
    async cancelOperation(operation) {
      if (operation.cancelPromise) return operation.cancelPromise;
      operation.cancelled = true;
      this.cancellation = 'requested';
      this.trace.add(operation.ctx, 'cancel-requested');
      this.changed();
      if (!operation.cancelAction) {
        this.cancellation = operation.pending && !operation.pendingSettled
          ? 'unconfirmed' : 'cooperative';
        this.changed();
        return;
      }
      operation.cancelPromise = (async () => {
        try {
          await (0, policy.bounded)(
            Promise.resolve().then(operation.cancelAction),
            this.budgets.cleanup, 'CANCEL_UNCONFIRMED', 'cancel',
          );
          this.cancellation = 'acknowledged';
          this.trace.add(operation.ctx, 'cancel-ack');
        } catch {
          this.cancellation = 'unconfirmed';
        } finally {
          this.changed();
        }
      })();
      return operation.cancelPromise;
    }

    // Wrapper #7176; generator #7178; no-op settlement callbacks #7179/#7180.
    async settleAfterFailure(operation) {
      await this.cancelOperation(operation);
      if (operation.pending && !operation.pendingSettled) {
        try {
          await (0, policy.bounded)(
            operation.pending.then(() => {}, () => {}),
            this.budgets.cleanup, 'SETTLEMENT_UNCONFIRMED', 'cleanup',
          );
        } catch {
          this.blocked = true;
          this.workerReady = false;
          this.runtimeState = (0, policy.unknown)('RESTART_REQUIRED');
          this.cancellation = 'unconfirmed';
        }
      }
      if (!this.blocked && operation.pendingSettled) this.cancellation = 'settled';
    }

    // Wrapper #7182; generator #7184. Guard/setup are OUTSIDE try/finally.
    async run(method, action, suppliedContext) {
      this.guard(method === 'importModel');
      const ctx = this.context(method, suppliedContext);
      const operation = {
        ctx, cancelled: false, cancelAction: null, cancelPromise: null,
        pending: null, pendingSettled: true,
      };
      this.current = operation;
      this.error = null;
      this.cancellation = 'none';
      this.trace.add(ctx, 'service-start');
      this.changed();
      try {
        let lifecycleWork;
        do {
          lifecycleWork = this.lifecycleWork;
          await lifecycleWork;
        } while (lifecycleWork !== this.lifecycleWork);
        this.check(operation);
        if (this.blocked && method !== 'importModel') {
          throw new policy.RuntimeError('RUNTIME_RESTART_REQUIRED', 'lifecycle');
        }
        const result = await action(operation);
        this.check(operation);
        return result;
      } catch (caught) {
        const error = operation.cancelled && !(caught instanceof policy.RuntimeError)
          ? new policy.RuntimeError('CANCELLED', this.phase)
          : (0, policy.safeError)(caught, this.phase);
        await this.settleAfterFailure(operation);
        if (['QVAC_WORKER_CRASHED', 'QVAC_WORKER_SHUTDOWN'].includes(error.code)) {
          this.blocked = true;
          this.workerReady = false;
          this.runtimeState = (0, policy.unknown)('RESTART_REQUIRED');
        }
        if (method === 'loadModel' && this.modelId && !this.blocked) {
          try {
            const runtime = this.runtime.peek();
            await (0, policy.bounded)(
              runtime.unloadModel({modelId: this.modelId, clearStorage: false}),
              this.budgets.cleanup, 'UNLOAD_TIMEOUT', 'cleanup',
            );
            this.modelId = null;
          } catch {
            this.blocked = true;
            this.workerReady = false;
            this.runtimeState = (0, policy.unknown)('RESTART_REQUIRED');
          }
        }
        if (method === 'unloadModel' && this.modelId) {
          this.blocked = true;
          this.workerReady = false;
          this.runtimeState = (0, policy.unknown)('RESTART_REQUIRED');
        }
        if (error.code === 'CANCELLED'
          && ['completePublic', 'runSmoke', 'completeLocalTask'].includes(method)
          && operation.pendingSettled && this.cancellation === 'settled'
          && this.workerReady && !this.blocked && this.modelId) {
          try {
            await (0, policy.bounded)(
              this.provisioner.stage('model-ready'),
              this.budgets.status, 'RECOVERY_STATE_TIMEOUT', 'cleanup',
            );
            this.phase = 'idle';
          } catch {
            this.blocked = true;
            this.workerReady = false;
            this.runtimeState = (0, policy.unknown)('RESTART_REQUIRED');
          }
        }
        this.error = error;
        this.status = ['CANCELLED', 'PICKER_CANCELLED'].includes(error.code) ? 'paused' : 'failed';
        if (['completePublic', 'runSmoke', 'completeLocalTask'].includes(method)) {
          this.inference = {state: 'failed', code: error.code, completedAt: null};
        }
        this.trace.add({...ctx, phase: error.stage}, 'error', error.code);
        throw error;
      } finally {
        this.current = null;
        this.changed();
      }
    }

    // Wrapper #7186; generator #7188; settlement callbacks #7189/#7190.
    async step(operation, phase, action, budget, sdk = false, separatePending) {
      this.check(operation);
      this.phase = phase;
      this.changed();
      if (sdk) this.trace.add({...operation.ctx, phase}, 'sdk-dispatch');
      operation.pendingSettled = false;
      const task = Promise.resolve().then(action);
      operation.pending = separatePending ?? task;
      operation.pending.then(
        () => { operation.pendingSettled = true; },
        () => { operation.pendingSettled = true; },
      );
      const result = await (0, policy.bounded)(
        task, budget, ''.concat(phase.toUpperCase().replace(/-/g, '_'), '_TIMEOUT'), phase,
      );
      if (sdk) this.trace.add({...operation.ctx, phase}, 'sdk-reply');
      this.check(operation);
      this.trace.add({...operation.ctx, phase}, 'operation-settled');
      operation.cancelAction = null;
      operation.cancelPromise = null;
      return result;
    }

    // Wrapper #7192; generator #7194; runtime/heartbeat callbacks #7195/#7196.
    async ensureWorker(operation) {
      if (device.isDevice !== true) {
        throw new policy.RuntimeError('PHYSICAL_DEVICE_REQUIRED', 'heartbeat');
      }
      if (this.workerReady) return this.runtime.peek();
      this.recoveryInfo = await this.provisioner.recovery();
      if (this.recoveryInfo.blocked) {
        throw new policy.RuntimeError('WORKER_RECOVERY_REQUIRED', 'heartbeat');
      }
      this.runtimeState = (0, policy.unknown)('STARTING');
      this.changed();
      try {
        await this.provisioner.stage('sdk-bootstrap');
        const runtime = await this.step(
          operation, 'runtime-config', () => this.runtime.get(), this.budgets.heartbeat,
        );
        await this.provisioner.stage('sdk-heartbeat');
        await this.step(operation, 'heartbeat', () => runtime.heartbeat(), this.budgets.heartbeat, true);
        await this.provisioner.stage('idle');
        this.workerReady = true;
        this.runtimeState = (0, policy.known)('responsive');
        return runtime;
      } catch (error) {
        this.runtimeState = {
          state: 'error', value: null, reason: (0, policy.safeError)(error, this.phase).code,
        };
        throw error;
      }
    }

    // Wrapper #7292; generator #7294. Intentionally preserves undefined-id edge case.
    async cancelRequest(id) {
      if (this.current?.ctx.id === id) await this.cancelOperation(this.current);
    }

    // Wrapper #7369; generators #7371/#7373; no-op catch #7374.
    async lifecycle(active) {
      this.active = active;
      const operation = !active && this.current && !this.picking ? this.current : null;
      const work = this.lifecycleWork.then(async () => {
        if (operation) await this.cancelOperation(operation);
        const runtime = this.runtime.peek();
        if (!runtime || !this.workerReady || this.blocked) return;
        try {
          await (0, policy.bounded)(
            this.active ? runtime.resume() : runtime.suspend(),
            this.budgets.cleanup, 'LIFECYCLE_TIMEOUT', 'lifecycle',
          );
        } catch {
          this.workerReady = false;
          this.blocked = true;
          this.runtimeState = (0, policy.unknown)('RESTART_REQUIRED');
        }
        this.changed();
      });
      this.lifecycleWork = work.catch(() => {});
      await work;
    }
  };
}
