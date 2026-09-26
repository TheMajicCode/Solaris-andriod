function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
// Independent DailyService boundary tests. Never include in an Android package.
(function () {
  'use strict';

  var oracle = globalThis.__solarisOracle,
    results = [];
  function assert(v, m) {
    if (!v) throw Error(m);
  }
  function clone(v) {
    return JSON.parse(JSON.stringify(v));
  }
  function deferred() {
    var resolve, reject;
    var promise = new Promise(function (a, b) {
      resolve = a;
      reject = b;
    });
    return {
      promise: promise,
      resolve: resolve,
      reject: reject
    };
  }
  var expectedDeps = [38, 76, 67, 8, 9, 923, 925, 940, 950, 922, 951, 957, 955, 958, 953, 930, 937, 926, 929, 956, 915, 716];
  assert(JSON.stringify(oracle.factories[939].deps) === JSON.stringify(expectedDeps), 'DailyService dependencies changed');
  var pure = [8, 9, 10, 11, 12, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 38, 39, 40, 41, 42, 43, 67, 76, 77, 912, 922, 923, 924, 925, 926, 927, 928, 929, 930, 931, 932, 933, 934, 935, 936, 937, 938, 939, 951, 952, 953, 954, 955, 956, 957, 958];
  function fixture(options) {
    options = options || {};
    var writes = [],
      calls = [],
      ids = [],
      macs = [],
      cache = Object.create(null),
      count = 100;
    function newId() {
      var s = ('00000000000000000000000000000000' + (++count).toString(16)).slice(-32);
      ids.push(s);
      return s;
    }
    function VaultStore() {
      this.unlocked = true;
      this.cipherVersion = 'synthetic';
    }
    VaultStore.prototype.write = function (value, revision) {
      assert(revision === f.service.state.revision, 'write revision mismatch');
      writes.push({
        state: clone(value),
        expectedRevision: revision
      });
      return Promise.resolve();
    };
    var mocks = {
      940: {
        VaultStore: VaultStore
      },
      950: {
        nativeVault: function () {
          return {
            newId: newId,
            mac: function (s) {
              macs.push(s);
              return Promise.resolve('a'.repeat(64));
            }
          };
        }
      }
    };
    function requireModule(id) {
      if (Object.prototype.hasOwnProperty.call(mocks, id)) return mocks[id];
      if (pure.indexOf(id) === -1) throw Error('Unexpected module ' + id);
      if (cache[id]) return cache[id].exports;
      var record = oracle.factories[id];
      assert(record, 'Missing module ' + id);
      var module = {
        exports: {}
      };
      cache[id] = module;
      oracle.loaded.push(id);
      record.factory(globalThis, requireModule, function () {
        throw Error('Unexpected importDefault');
      }, function () {
        throw Error('Unexpected importAll');
      }, module, module.exports, record.deps);
      return module.exports;
    }
    var f = {
      writes: writes,
      calls: calls,
      ids: ids,
      macs: macs,
      require: requireModule
    };
    var qvac = {
      snapshot: function () {
        return {
          loaded: options.loaded !== false
        };
      },
      completeConversationTask: function (prompt, eligible) {
        calls.push({
          prompt: prompt,
          eligibleAtCall: eligible()
        });
        f.eligible = eligible;
        if (options.complete) return options.complete(f, prompt, eligible);
        return Promise.resolve({
          text: options.output === undefined ? '{"message":"Hello!","sourceRefs":[]}' : options.output,
          contentEvents: 7
        });
      }
    };
    var Daily = requireModule(939).DailyService;
    var service = new Daily(qvac, function () {
      throw Error('Unexpected session clock');
    });
    f.service = service;
    var domain = requireModule(951);
    var state = domain.freshVault({
      subjectId: 'sol_' + 'a'.repeat(32),
      ownerId: 'owner_' + 'b'.repeat(32),
      deviceId: 'device_' + 'c'.repeat(32)
    }, {
      id: newId,
      now: new Date('2026-09-16T00:00:00.000Z')
    });
    domain.ensureExperience(state);
    state.grants = {
      local: true,
      automatic: false,
      expiresAt: '2099-01-01T00:00:00.000Z'
    };
    state.migration = {
      committed: true,
      legacyCleared: false,
      backupVerified: false
    };
    state.experience.localContext = {
      categories: options.categories || [],
      expiresAt: '2099-01-01T00:00:00.000Z',
      revision: 1
    };
    if (options.profile) state.displayName = 'Synthetic Profile';
    if (options.prior) state.conversation.push({
      id: 'message_' + 'd'.repeat(32),
      role: 'user',
      text: options.prior,
      at: '2026-09-16T00:00:00.000Z',
      mode: 'owner',
      sources: []
    });
    service.state = state;
    // Exclude only presentation projection; converse/contextSources/parser/queue/persist stay actual HBC.
    service.view = function () {
      return {
        state: clone(service.state),
        busy: service.busy
      };
    };
    f.before = clone(state);
    requireModule(922).validState(state);
    return f;
  }
  function invoke(_x, _x2) {
    return _invoke.apply(this, arguments);
  }
  function _invoke() {
    _invoke = _asyncToGenerator(function* (f, options) {
      options = options || {};
      try {
        yield f.service.converse(options.message || 'Hello', options.sources || [], options.local !== false, options.operation || 'synthetic_op_0001', !!options.alreadySaved);
        return null;
      } catch (e) {
        return String(e && e.message || e);
      }
    });
    return _invoke.apply(this, arguments);
  }
  function noCommit(f) {
    assert(f.writes.length === 0, 'unexpected persistence');
    assert(f.service.state.conversation.length === f.before.conversation.length, 'unexpected conversation mutation');
    assert(f.service.busy === false, 'busy not cleared');
  }
  function expectedDiagnostic(code) {
    return globalThis.__solarisExpectedDiagnostics ? code : 'LUCA_RESPONSE_UNAVAILABLE';
  }
  function replaceState(f, mutate) {
    var next = clone(f.service.state);
    mutate(next);
    f.service.state = next;
  }
  function test(_x3, _x4) {
    return _test.apply(this, arguments);
  }
  function _test() {
    _test = _asyncToGenerator(function* (name, body) {
      try {
        var details = yield body();
        results.push({
          name: name,
          pass: true,
          details: details || {}
        });
      } catch (e) {
        results.push({
          name: name,
          pass: false,
          error: String(e.stack || e)
        });
      }
    });
    return _test.apply(this, arguments);
  }
  _asyncToGenerator(function* () {
    yield test('valid greeting reaches real parser and persists valid state', /*#__PURE__*/_asyncToGenerator(function* () {
      var f = fixture(),
        error = yield invoke(f);
      assert(error === null, 'unexpected ' + error);
      assert(f.writes.length === 1, 'one write expected');
      var s = f.service.state;
      assert(s.conversation.length === 2, 'user and assistant required');
      assert(s.conversation[0].id === 'message_' + f.ids[1], 'user record id');
      assert(s.conversation[1].id === 'message_' + f.ids[2], 'assistant record id');
      assert(s.receipts[0].id === 'receipt_' + f.ids[3], 'receipt id');
      assert(s.subjectId === f.before.subjectId && s.ownerId === f.before.ownerId && s.deviceId === f.before.deviceId && s.agentId === f.before.agentId, 'identity changed');
      assert(s.revision === 1 && s.operations[0] === 'synthetic_op_0001', 'revision/operation');
      assert(s.conversation[1].mode === 'qvac-device' && s.conversation[1].text === 'Hello!', 'assistant provenance');
      assert(s.conversation[1].provenance.sourceRefs.length === 0, 'zero sources valid');
      return {
        prompt: f.calls[0].prompt,
        messageIds: s.conversation.map(function (m) {
          return m.id;
        }),
        receiptId: s.receipts[0].id,
        revision: s.revision,
        mode: s.conversation[1].mode
      };
    }));
    var directCodes = ['FIRST_TOKEN_TIMEOUT', 'EMPTY_COMPLETION', 'OUTPUT_LIMIT', 'QVAC_NOT_READY', 'QVAC_BUSY', 'RUNTIME_RESTART_REQUIRED', 'FOREGROUND_REQUIRED', 'WORKER_RECOVERY_REQUIRED', 'QVAC_WORKER_CRASHED', 'QVAC_WORKER_SHUTDOWN', 'CONTEXT_BUDGET', 'CONTEXT_INVALID', 'CONTEXT_NOT_APPROVED', 'LOCAL_PERMISSION_REQUIRED', 'PERMISSION_CHANGED', 'CANDIDATE_INVALID', 'CANDIDATE_UNGROUNDED', 'CANDIDATE_UNSAFE', 'CANDIDATE_NEGATION', 'OPERATION_FAILED', 'STATUS_TIMEOUT', 'RECOVERY_STATE_TIMEOUT', 'LIFECYCLE_TIMEOUT', 'UNLOAD_TIMEOUT', 'STREAM_TIMEOUT'];
    var sdkCodes = ['REQUEST_VALIDATION_FAILED', 'RPC_CONNECTION_FAILED', 'RPC_INIT_TIMEOUT', 'WORKER_CRASHED', 'WORKER_SHUTDOWN', 'CONFIG_FILE_INVALID', 'CONFIG_FILE_PARSE_FAILED', 'CONFIG_VALIDATION_FAILED', 'WORKER_PLUGINS_NOT_REGISTERED', 'MODEL_NOT_LOADED', 'MODEL_LOAD_FAILED', 'MODEL_FILE_NOT_FOUND', 'MODEL_FILE_NOT_FOUND_IN_DIR', 'MODEL_FILE_LOCATE_FAILED', 'MODEL_UNLOAD_FAILED', 'COMPLETION_FAILED', 'CONTEXT_OVERFLOW', 'CACHE_DIR_NOT_WRITABLE', 'LIFECYCLE_SUSPEND_FAILED', 'LIFECYCLE_RESUME_FAILED', 'LIFECYCLE_OPERATION_BLOCKED', 'PLUGIN_NOT_FOUND', 'PLUGIN_LOAD_CONFIG_VALIDATION_FAILED'];
    for (var code of directCodes.concat(sdkCodes.map(function (c) {
      return 'QVAC_' + c;
    }))) {
      yield test('finite diagnostic ' + code, /*#__PURE__*/_asyncToGenerator(function* () {
        var f = fixture({
          complete: function () {
            return Promise.reject(Error(code));
          }
        });
        var error = yield invoke(f);
        assert(error === expectedDiagnostic(code), 'expected ' + expectedDiagnostic(code) + ' got ' + error);
        noCommit(f);
        return {
          expected: expectedDiagnostic(code),
          actual: error
        };
      }));
    }
    for (var value of ['SYNTHETIC_PRIVATE_ERROR health record text', 'STREAM_TIMEOUT sensitive suffix', 'CANDIDATE_INVALID\nprivate detail', 'UNKNOWN_ERROR']) {
      yield test('sanitize raw Error ' + value.split(' ')[0], /*#__PURE__*/_asyncToGenerator(function* () {
        var f = fixture({
          complete: function () {
            return Promise.reject(Error(value));
          }
        });
        var error = yield invoke(f);
        assert(error === 'LUCA_RESPONSE_UNAVAILABLE', 'raw Error leaked: ' + error);
        noCommit(f);
        return {
          actual: error
        };
      }));
    }
    yield test('sanitize non-Error object', /*#__PURE__*/_asyncToGenerator(function* () {
      var f = fixture({
        complete: function () {
          return Promise.reject({
            message: 'STREAM_TIMEOUT',
            secret: 'synthetic private text'
          });
        }
      });
      var error = yield invoke(f);
      assert(error === 'LUCA_RESPONSE_UNAVAILABLE', 'non-Error object leaked');
      noCommit(f);
      return {
        actual: error
      };
    }));
    yield test('sanitize non-Error raw string', /*#__PURE__*/_asyncToGenerator(function* () {
      var f = fixture({
        complete: function () {
          return Promise.reject('synthetic private text');
        }
      });
      var error = yield invoke(f);
      assert(error === 'LUCA_RESPONSE_UNAVAILABLE', 'raw string leaked');
      noCommit(f);
      return {
        actual: error
      };
    }));
    for (var cancel of ['CANCELLED', 'QVAC_INFERENCE_CANCELLED', 'synthetic CANCEL detail']) {
      yield test('cancellation precedence ' + cancel, /*#__PURE__*/_asyncToGenerator(function* () {
        var f = fixture({
          complete: function () {
            return Promise.reject(Error(cancel));
          }
        });
        var error = yield invoke(f);
        assert(error === 'CANCELLED', 'cancellation changed ' + error);
        noCommit(f);
        return {
          actual: error
        };
      }));
    }
    var invalid = [{
      name: 'plain greeting',
      output: 'Hello',
      code: 'CANDIDATE_INVALID'
    }, {
      name: 'wrong JSON keys',
      output: '{"text":"Hello","sourceRefs":[]}',
      code: 'CANDIDATE_INVALID'
    }, {
      name: 'extra JSON key',
      output: '{"message":"Hello","sourceRefs":[],"private":"synthetic"}',
      code: 'CANDIDATE_INVALID'
    }, {
      name: 'missing references',
      output: '{"message":"Hello"}',
      code: 'CANDIDATE_INVALID'
    }, {
      name: 'fabricated source',
      output: '{"message":"Hello","sourceRefs":["s1"]}',
      code: 'CANDIDATE_INVALID'
    }, {
      name: 'invented numeric advice',
      output: '{"message":"Try 42 steps","sourceRefs":[]}',
      code: 'CANDIDATE_UNGROUNDED'
    }, {
      name: 'unsafe treatment advice',
      output: '{"message":"You should take medication","sourceRefs":[]}',
      code: 'CANDIDATE_UNSAFE'
    }, {
      name: 'negation removed',
      message: 'I cannot sleep',
      output: '{"message":"You sleep well","sourceRefs":[]}',
      code: 'CANDIDATE_NEGATION'
    }, {
      name: 'unallowed action',
      output: '{"message":"Hello","sourceRefs":[],"actionId":"save_secret"}',
      code: 'CANDIDATE_INVALID'
    }];
    for (var bad of invalid) {
      yield test('actual parser rejects ' + bad.name, /*#__PURE__*/_asyncToGenerator(function* () {
        var f = fixture({
          output: bad.output,
          prior: 'retained synthetic request'
        });
        var error = yield invoke(f, {
          message: bad.message || 'Hello',
          alreadySaved: true
        });
        assert(error === expectedDiagnostic(bad.code), 'unexpected ' + error);
        noCommit(f);
        assert(f.service.state.conversation[0].id === f.before.conversation[0].id, 'retained message ID changed');
        return {
          actual: error,
          retainedId: f.service.state.conversation[0].id
        };
      }));
    }
    yield test('retry preserves existing user ID and creates only assistant and receipt', /*#__PURE__*/_asyncToGenerator(function* () {
      var f = fixture({
        prior: 'Hello'
      });
      var error = yield invoke(f, {
        alreadySaved: true
      });
      assert(error === null, 'retry failed ' + error);
      var s = f.service.state;
      assert(s.conversation.length === 2, 'duplicate user message');
      assert(s.conversation[0].id === 'message_' + 'd'.repeat(32), 'existing ID lost');
      assert(s.conversation[1].id === 'message_' + f.ids[1], 'assistant new ID');
      assert(f.ids.length === 3, 'unexpected ID allocation');
      return {
        messageIds: s.conversation.map(function (m) {
          return m.id;
        })
      };
    }));
    yield test('same operation ID is idempotent', /*#__PURE__*/_asyncToGenerator(function* () {
      var f = fixture();
      assert((yield invoke(f)) === null, 'first failed');
      var before = clone(f.service.state);
      assert((yield invoke(f)) === null, 'duplicate failed');
      assert(f.calls.length === 1 && f.writes.length === 1, 'duplicate generated/persisted');
      assert(JSON.stringify(before) === JSON.stringify(f.service.state), 'duplicate modified state');
      return {
        calls: f.calls.length,
        writes: f.writes.length
      };
    }));
    yield test('approved selected profile cited through original contextSources', /*#__PURE__*/_asyncToGenerator(function* () {
      var f = fixture({
        profile: true,
        categories: ['profile'],
        output: '{"message":"Your profile says Synthetic Profile.","sourceRefs":["s1"]}'
      });
      var error = yield invoke(f, {
        sources: ['profile_owner']
      });
      assert(error === null, 'profile response failed ' + error);
      var answer = f.service.state.conversation[1];
      assert(answer.sources[0] === 'profile_owner' && answer.provenance.sourceRefs[0].id === 'profile_owner', 'wrong provenance');
      assert(f.calls[0].prompt.indexOf('Synthetic Profile') !== -1, 'selected context omitted');
      return {
        sourceRefs: answer.provenance.sourceRefs
      };
    }));
    yield test('unselected profile excluded from actual model prompt', /*#__PURE__*/_asyncToGenerator(function* () {
      var f = fixture({
        profile: true,
        categories: ['profile']
      });
      assert((yield invoke(f)) === null, 'greeting failed');
      assert(f.calls[0].prompt.indexOf('Synthetic Profile') === -1, 'unselected profile disclosed');
      return {
        prompt: f.calls[0].prompt
      };
    }));
    yield test('missing profile category denies request before inference', /*#__PURE__*/_asyncToGenerator(function* () {
      var f = fixture({
        profile: true
      });
      var error = yield invoke(f, {
        sources: ['profile_owner']
      });
      assert(error === 'CONTEXT_NOT_APPROVED', 'permission failure ' + error);
      assert(f.calls.length === 0, 'inference dispatched');
      noCommit(f);
      return {
        actual: error
      };
    }));
    yield test('unavailable selected source denies request before inference', /*#__PURE__*/_asyncToGenerator(function* () {
      var f = fixture();
      var error = yield invoke(f, {
        sources: ['missing_source']
      });
      assert(error === 'CONTEXT_NOT_APPROVED', 'missing source failure ' + error);
      assert(f.calls.length === 0, 'inference dispatched');
      noCommit(f);
      return {
        actual: error
      };
    }));
    yield test('local permission denied before inference', /*#__PURE__*/_asyncToGenerator(function* () {
      var f = fixture();
      f.service.state.grants.local = false;
      var error = yield invoke(f);
      assert(error === 'LOCAL_PERMISSION_REQUIRED', 'unexpected ' + error);
      assert(f.calls.length === 0, 'inference dispatched');
      noCommit(f);
      return {
        actual: error
      };
    }));
    var mutations = [{
      name: 'epoch changes',
      mutate: function (f) {
        f.service.epoch++;
      }
    }, {
      name: 'authority changes',
      mutate: function (f) {
        replaceState(f, function (s) {
          s.authorityEpoch++;
        });
      }
    }, {
      name: 'local grant revoked',
      mutate: function (f) {
        replaceState(f, function (s) {
          s.grants.local = false;
        });
      }
    }, {
      name: 'local grant expired',
      mutate: function (f) {
        replaceState(f, function (s) {
          s.grants.expiresAt = '2000-01-01T00:00:00.000Z';
        });
      }
    }, {
      name: 'permission revision changes',
      mutate: function (f) {
        replaceState(f, function (s) {
          s.experience.localContext.revision++;
        });
      }
    }, {
      name: 'vault locks',
      mutate: function (f) {
        f.service.store.unlocked = false;
      }
    }];
    for (var mutation of mutations) {
      yield test('completion rejected after ' + mutation.name, /*#__PURE__*/_asyncToGenerator(function* () {
        var arrived = deferred(),
          finish = deferred();
        var f = fixture({
          complete: function () {
            arrived.resolve();
            return finish.promise;
          }
        });
        var pending = invoke(f);
        yield arrived.promise;
        mutation.mutate(f);
        assert(f.eligible() === false, 'eligibility not revoked');
        finish.resolve({
          text: '{"message":"Hello!","sourceRefs":[]}',
          contentEvents: 1
        });
        var error = yield pending;
        assert(error === 'CANCELLED' || error === 'VAULT_LOCKED', 'unexpected ' + error);
        noCommit(f);
        return {
          actual: error
        };
      }));
    }
    for (var mutation2 of ['epoch', 'contextRevision']) {
      yield test('revocation wins over whitelisted failure ' + mutation2, /*#__PURE__*/_asyncToGenerator(function* () {
        var f = fixture({
          complete: function (f) {
            if (mutation2 === 'epoch') f.service.epoch++;else replaceState(f, function (s) {
              s.experience.localContext.revision++;
            });
            return Promise.reject(Error('STREAM_TIMEOUT'));
          }
        });
        var error = yield invoke(f);
        assert(error === 'CANCELLED', 'diagnostic overrode revocation ' + error);
        noCommit(f);
        return {
          actual: error
        };
      }));
    }
    yield test('selected source changes while awaiting generation', /*#__PURE__*/_asyncToGenerator(function* () {
      var f = fixture({
        profile: true,
        categories: ['profile'],
        complete: function (f) {
          replaceState(f, function (s) {
            s.displayName = 'Changed Synthetic Profile';
          });
          return Promise.resolve({
            text: '{"message":"Synthetic Profile","sourceRefs":["s1"]}',
            contentEvents: 1
          });
        }
      });
      var error = yield invoke(f, {
        sources: ['profile_owner']
      });
      assert(error === 'CANCELLED', 'changed source not cancelled ' + error);
      noCommit(f);
      return {
        actual: error
      };
    }));
    yield test('selected category revoked while awaiting generation', /*#__PURE__*/_asyncToGenerator(function* () {
      var f = fixture({
        profile: true,
        categories: ['profile'],
        complete: function (f) {
          replaceState(f, function (s) {
            s.experience.localContext.categories = [];
            s.experience.localContext.revision++;
          });
          return Promise.resolve({
            text: '{"message":"Synthetic Profile","sourceRefs":["s1"]}',
            contentEvents: 1
          });
        }
      });
      var error = yield invoke(f, {
        sources: ['profile_owner']
      });
      assert(error === 'CANCELLED', 'revoked source not cancelled ' + error);
      noCommit(f);
      return {
        actual: error
      };
    }));
    globalThis.__solarisTestResult = {
      pass: results.every(function (r) {
        return r.pass;
      }),
      total: results.length,
      cases: results,
      capturedModules: Object.keys(oracle.factories).length,
      suppressedEntrypoints: oracle.entries,
      executedModules: Array.from(new Set(oracle.loaded)).sort(function (a, b) {
        return a - b;
      })
    };
    print(JSON.stringify(globalThis.__solarisTestResult));
  })().catch(function (e) {
    print('HARNESS_ERROR ' + String(e.stack || e));
  });
})();
