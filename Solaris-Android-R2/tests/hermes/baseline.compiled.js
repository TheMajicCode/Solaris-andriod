function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
// Generated solely by stripping ESM export; do not edit.
/**
 * Controlled, partial semantic reconstruction of the code-601 QvacService.
 * Evidence: ../../evidence/writer-baseline/function-*.hasm; docs/HOST-MAPPING.md.
 * This is the EXISTING behavior, including known races. It is not a repair,
 * a full application, or recovered original TypeScript. No native adapter is
 * provided here. Dependencies must be the evidenced modules or explicit tests.
 */
function createQvacServiceBaseline(_ref) {
  let filesystem = _ref.filesystem,
    device = _ref.device,
    modelConfig = _ref.modelConfig,
    runtimeModule = _ref.runtimeModule,
    runtimeFactoryModule = _ref.runtimeFactoryModule,
    policy = _ref.policy,
    traceModule = _ref.traceModule,
    provisionerModule = _ref.provisionerModule;
  return /*#__PURE__*/function () {
    "use strict";

    // #7146; arrow callback #7147. Default arguments remain positional.
    function QvacService() {
      let trace = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new traceModule.SafeTrace();
      let budgets = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _objectSpread({}, policy.BUDGETS);
      _classCallCheck(this, QvacService);
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
      this.preparationChoice = {
        chosen: false,
        enabled: false,
        mobileData: false
      };
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
      this.inference = {
        state: 'not-run',
        code: null,
        completedAt: null
      };
      this.trace = trace;
    }

    // #7148
    return _createClass(QvacService, [{
      key: "context",
      value: function context(method, supplied) {
        return supplied !== null && supplied !== void 0 ? supplied : {
          id: (0, traceModule.transientId)(),
          epoch: 0,
          method
        };
      }

      // #7149: deliberately exposes the original field names and null handling.
    }, {
      key: "snapshot",
      value: function snapshot() {
        return {
          preparation: this.preparation(),
          preparationChoice: _objectSpread({}, this.preparationChoice),
          transfer: this.provisioner.state,
          recovery: this.recoveryInfo,
          importing: this.transferImport,
          status: this.status,
          phase: this.phase,
          error: this.error ? {
            code: this.error.code,
            stage: this.error.stage
          } : null,
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
          inference: _objectSpread({}, this.inference),
          local: this.localStatus
        };
      }

      // #7150
    }, {
      key: "preparation",
      value: function preparation() {
        var _this$current;
        return (0, policy.preparationState)({
          transfer: this.provisioner.state,
          phase: this.phase,
          preparing: ((_this$current = this.current) === null || _this$current === void 0 ? void 0 : _this$current.ctx.method) === 'loadModel' && !this.current.cancelled,
          loaded: Boolean(this.modelId && this.workerReady && !this.blocked && this.active),
          blocked: this.blocked,
          recovery: this.recoveryInfo,
          error: this.error
        });
      }

      // #7151: retain callback receiver.
    }, {
      key: "changed",
      value: function changed() {
        var _this$onChange;
        (_this$onChange = this.onChange) === null || _this$onChange === void 0 || _this$onChange.call(this);
      }

      // #7152
    }, {
      key: "publishProgress",
      value: function publishProgress() {
        var _this$onProgress;
        let force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        const now = Date.now();
        if (!force && now - this.lastProgressAt < 150) return;
        this.lastProgressAt = now;
        (_this$onProgress = this.onProgress) === null || _this$onProgress === void 0 || _this$onProgress.call(this, {
          status: this.status,
          phase: this.phase,
          percent: this.progress,
          receivedBytes: this.receivedBytes,
          exactBytes: modelConfig.MODEL.bytes
        });
        this.changed();
      }

      // #7167. Precedence: foreground, busy, blocked (unless import override).
    }, {
      key: "guard",
      value: function guard() {
        let allowBlocked = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        if (!this.active) throw new policy.RuntimeError('FOREGROUND_REQUIRED', 'service');
        if (this.current) throw new policy.RuntimeError('QVAC_BUSY', 'service');
        if (this.blocked && !allowBlocked) {
          throw new policy.RuntimeError('RUNTIME_RESTART_REQUIRED', 'service');
        }
      }

      // #7168. Baseline has no ownership, generation, blocked or worker-state check.
    }, {
      key: "check",
      value: function check(operation) {
        if (operation.cancelled || !this.active) {
          throw new policy.RuntimeError('CANCELLED', this.phase);
        }
      }

      // Wrapper #7170; generators #7172, #7174. No-action path stores no promise.
    }, {
      key: "cancelOperation",
      value: function () {
        var _cancelOperation = _asyncToGenerator(function* (operation) {
          var _this = this;
          if (operation.cancelPromise) return operation.cancelPromise;
          operation.cancelled = true;
          this.cancellation = 'requested';
          this.trace.add(operation.ctx, 'cancel-requested');
          this.changed();
          if (!operation.cancelAction) {
            this.cancellation = operation.pending && !operation.pendingSettled ? 'unconfirmed' : 'cooperative';
            this.changed();
            return;
          }
          operation.cancelPromise = _asyncToGenerator(function* () {
            try {
              yield (0, policy.bounded)(Promise.resolve().then(operation.cancelAction), _this.budgets.cleanup, 'CANCEL_UNCONFIRMED', 'cancel');
              _this.cancellation = 'acknowledged';
              _this.trace.add(operation.ctx, 'cancel-ack');
            } catch {
              _this.cancellation = 'unconfirmed';
            } finally {
              _this.changed();
            }
          })();
          return operation.cancelPromise;
        });
        function cancelOperation(_x) {
          return _cancelOperation.apply(this, arguments);
        }
        return cancelOperation;
      }() // Wrapper #7176; generator #7178; no-op settlement callbacks #7179/#7180.
    }, {
      key: "settleAfterFailure",
      value: function () {
        var _settleAfterFailure = _asyncToGenerator(function* (operation) {
          yield this.cancelOperation(operation);
          if (operation.pending && !operation.pendingSettled) {
            try {
              yield (0, policy.bounded)(operation.pending.then(() => {}, () => {}), this.budgets.cleanup, 'SETTLEMENT_UNCONFIRMED', 'cleanup');
            } catch {
              this.blocked = true;
              this.workerReady = false;
              this.runtimeState = (0, policy.unknown)('RESTART_REQUIRED');
              this.cancellation = 'unconfirmed';
            }
          }
          if (!this.blocked && operation.pendingSettled) this.cancellation = 'settled';
        });
        function settleAfterFailure(_x2) {
          return _settleAfterFailure.apply(this, arguments);
        }
        return settleAfterFailure;
      }() // Wrapper #7182; generator #7184. Guard/setup are OUTSIDE try/finally.
    }, {
      key: "run",
      value: function () {
        var _run = _asyncToGenerator(function* (method, action, suppliedContext) {
          this.guard(method === 'importModel');
          const ctx = this.context(method, suppliedContext);
          const operation = {
            ctx,
            cancelled: false,
            cancelAction: null,
            cancelPromise: null,
            pending: null,
            pendingSettled: true
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
              yield lifecycleWork;
            } while (lifecycleWork !== this.lifecycleWork);
            this.check(operation);
            if (this.blocked && method !== 'importModel') {
              throw new policy.RuntimeError('RUNTIME_RESTART_REQUIRED', 'lifecycle');
            }
            const result = yield action(operation);
            this.check(operation);
            return result;
          } catch (caught) {
            const error = operation.cancelled && !(caught instanceof policy.RuntimeError) ? new policy.RuntimeError('CANCELLED', this.phase) : (0, policy.safeError)(caught, this.phase);
            yield this.settleAfterFailure(operation);
            if (['QVAC_WORKER_CRASHED', 'QVAC_WORKER_SHUTDOWN'].includes(error.code)) {
              this.blocked = true;
              this.workerReady = false;
              this.runtimeState = (0, policy.unknown)('RESTART_REQUIRED');
            }
            if (method === 'loadModel' && this.modelId && !this.blocked) {
              try {
                const runtime = this.runtime.peek();
                yield (0, policy.bounded)(runtime.unloadModel({
                  modelId: this.modelId,
                  clearStorage: false
                }), this.budgets.cleanup, 'UNLOAD_TIMEOUT', 'cleanup');
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
            if (error.code === 'CANCELLED' && ['completePublic', 'runSmoke', 'completeLocalTask'].includes(method) && operation.pendingSettled && this.cancellation === 'settled' && this.workerReady && !this.blocked && this.modelId) {
              try {
                yield (0, policy.bounded)(this.provisioner.stage('model-ready'), this.budgets.status, 'RECOVERY_STATE_TIMEOUT', 'cleanup');
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
              this.inference = {
                state: 'failed',
                code: error.code,
                completedAt: null
              };
            }
            this.trace.add(_objectSpread(_objectSpread({}, ctx), {}, {
              phase: error.stage
            }), 'error', error.code);
            throw error;
          } finally {
            this.current = null;
            this.changed();
          }
        });
        function run(_x3, _x4, _x5) {
          return _run.apply(this, arguments);
        }
        return run;
      }() // Wrapper #7186; generator #7188; settlement callbacks #7189/#7190.
    }, {
      key: "step",
      value: function () {
        var _step = _asyncToGenerator(function (operation, phase, action, budget) {
          var _this2 = this;
          let sdk = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
          let separatePending = arguments.length > 5 ? arguments[5] : undefined;
          return function* () {
            _this2.check(operation);
            _this2.phase = phase;
            _this2.changed();
            if (sdk) _this2.trace.add(_objectSpread(_objectSpread({}, operation.ctx), {}, {
              phase
            }), 'sdk-dispatch');
            operation.pendingSettled = false;
            const task = Promise.resolve().then(action);
            operation.pending = separatePending !== null && separatePending !== void 0 ? separatePending : task;
            operation.pending.then(() => {
              operation.pendingSettled = true;
            }, () => {
              operation.pendingSettled = true;
            });
            const result = yield (0, policy.bounded)(task, budget, ''.concat(phase.toUpperCase().replace(/-/g, '_'), '_TIMEOUT'), phase);
            if (sdk) _this2.trace.add(_objectSpread(_objectSpread({}, operation.ctx), {}, {
              phase
            }), 'sdk-reply');
            _this2.check(operation);
            _this2.trace.add(_objectSpread(_objectSpread({}, operation.ctx), {}, {
              phase
            }), 'operation-settled');
            operation.cancelAction = null;
            operation.cancelPromise = null;
            return result;
          }();
        });
        function step(_x6, _x7, _x8, _x9) {
          return _step.apply(this, arguments);
        }
        return step;
      }() // Wrapper #7192; generator #7194; runtime/heartbeat callbacks #7195/#7196.
    }, {
      key: "ensureWorker",
      value: function () {
        var _ensureWorker = _asyncToGenerator(function* (operation) {
          if (device.isDevice !== true) {
            throw new policy.RuntimeError('PHYSICAL_DEVICE_REQUIRED', 'heartbeat');
          }
          if (this.workerReady) return this.runtime.peek();
          this.recoveryInfo = yield this.provisioner.recovery();
          if (this.recoveryInfo.blocked) {
            throw new policy.RuntimeError('WORKER_RECOVERY_REQUIRED', 'heartbeat');
          }
          this.runtimeState = (0, policy.unknown)('STARTING');
          this.changed();
          try {
            yield this.provisioner.stage('sdk-bootstrap');
            const runtime = yield this.step(operation, 'runtime-config', () => this.runtime.get(), this.budgets.heartbeat);
            yield this.provisioner.stage('sdk-heartbeat');
            yield this.step(operation, 'heartbeat', () => runtime.heartbeat(), this.budgets.heartbeat, true);
            yield this.provisioner.stage('idle');
            this.workerReady = true;
            this.runtimeState = (0, policy.known)('responsive');
            return runtime;
          } catch (error) {
            this.runtimeState = {
              state: 'error',
              value: null,
              reason: (0, policy.safeError)(error, this.phase).code
            };
            throw error;
          }
        });
        function ensureWorker(_x0) {
          return _ensureWorker.apply(this, arguments);
        }
        return ensureWorker;
      }() // Wrapper #7292; generator #7294. Intentionally preserves undefined-id edge case.
    }, {
      key: "cancelRequest",
      value: function () {
        var _cancelRequest = _asyncToGenerator(function* (id) {
          var _this$current2;
          if (((_this$current2 = this.current) === null || _this$current2 === void 0 ? void 0 : _this$current2.ctx.id) === id) yield this.cancelOperation(this.current);
        });
        function cancelRequest(_x1) {
          return _cancelRequest.apply(this, arguments);
        }
        return cancelRequest;
      }() // Wrapper #7369; generators #7371/#7373; no-op catch #7374.
    }, {
      key: "lifecycle",
      value: function () {
        var _lifecycle = _asyncToGenerator(function* (active) {
          var _this3 = this;
          this.active = active;
          const operation = !active && this.current && !this.picking ? this.current : null;
          const work = this.lifecycleWork.then(/*#__PURE__*/_asyncToGenerator(function* () {
            if (operation) yield _this3.cancelOperation(operation);
            const runtime = _this3.runtime.peek();
            if (!runtime || !_this3.workerReady || _this3.blocked) return;
            try {
              yield (0, policy.bounded)(_this3.active ? runtime.resume() : runtime.suspend(), _this3.budgets.cleanup, 'LIFECYCLE_TIMEOUT', 'lifecycle');
            } catch {
              _this3.workerReady = false;
              _this3.blocked = true;
              _this3.runtimeState = (0, policy.unknown)('RESTART_REQUIRED');
            }
            _this3.changed();
          }));
          this.lifecycleWork = work.catch(() => {});
          yield work;
        });
        function lifecycle(_x10) {
          return _lifecycle.apply(this, arguments);
        }
        return lifecycle;
      }()
    }]);
  }();
}
