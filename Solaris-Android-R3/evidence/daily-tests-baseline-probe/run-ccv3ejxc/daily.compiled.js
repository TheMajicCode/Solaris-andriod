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
      categories: [],
      expiresAt: '2099-01-01T00:00:00.000Z',
      revision: 1
    };
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
        calls: f.calls,
        writes: f.writes
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
