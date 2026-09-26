function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
// Actual integrated QvacService bytecode with synthetic SDK boundaries only.
(function () {
  'use strict';

  var shared = globalThis.__solarisFixtures,
    oracle = globalThis.__solarisOracle;
  var results = [],
    cache = Object.create(null);
  function assert(ok, why) {
    if (!ok) throw Error(why);
  }
  function clone(v) {
    return JSON.parse(JSON.stringify(v));
  }
  function sort(v) {
    if (Array.isArray(v)) return v.map(sort);
    if (v && typeof v === 'object') {
      var o = {};
      Object.keys(v).sort().forEach(function (k) {
        o[k] = sort(v[k]);
      });
      return o;
    }
    return v;
  }
  function equal(a, b) {
    return JSON.stringify(sort(a)) === JSON.stringify(sort(b));
  }
  var allowed = [8, 9, 10, 11, 12, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 38, 39, 40, 41, 42, 43, 67, 76, 77, 912, 922, 923, 924, 925, 926, 927, 928, 929, 930, 931, 932, 933, 934, 935, 936, 937, 938, 951, 952, 953, 954, 955, 956, 957, 958];
  function requirePure(id) {
    assert(allowed.indexOf(id) >= 0, 'Unexpected compiler dependency ' + id);
    if (cache[id]) return cache[id].exports;
    var rec = oracle.factories[id];
    assert(rec, 'Missing compiler module ' + id);
    var mod = {
      exports: {}
    };
    cache[id] = mod;
    rec.factory(globalThis, requirePure, function () {
      throw Error('Unexpected importDefault');
    }, function () {
      throw Error('Unexpected importAll');
    }, mod, mod.exports, rec.deps);
    return mod.exports;
  }
  var compiler = requirePure(958),
    policy = requirePure(912);
  function promptFor(kind) {
    var sources = [],
      categories = [],
      actions = [];
    if (kind === 'facts') {
      categories = ['profile'];
      sources = [{
        id: 'source_synthetic',
        revision: 1,
        sha256: 'a'.repeat(64),
        category: 'profile',
        approved: true,
        excluded: false,
        fields: {
          displayName: 'Cedar'
        }
      }];
    }
    if (kind === 'actions') actions = ['reflect'];
    var options = {
      message: kind === 'spanish' ? 'Hola' : 'Hello',
      locale: kind === 'spanish' ? 'es' : 'en',
      sessionId: 'synthetic_session',
      authorityEpoch: 1,
      permissionRevision: 1,
      expiresAt: '2099-01-01T00:00:00.000Z',
      now: '2026-09-16T00:00:00.000Z',
      localAllowed: true,
      grantedCategories: categories,
      sources: sources,
      allowedActionIds: actions
    };
    var prompt = compiler.compileConversation(options).prompt;
    if (kind === 'history') {
      var split = prompt.indexOf('\n'),
        envelope = JSON.parse(prompt.slice(split + 1, -10));
      envelope.recent = [{
        role: 'user',
        content: 'My test nickname is Cedar.'
      }, {
        role: 'assistant',
        content: 'Your test nickname is Cedar.'
      }];
      prompt = prompt.slice(0, split + 1) + JSON.stringify(envelope) + ' /no_think';
    }
    return prompt;
  }
  function originalRequest(prompt) {
    return {
      modelId: 'retained-model-id',
      history: [{
        role: 'user',
        content: prompt
      }],
      stream: true,
      captureThinking: false,
      kvCache: false,
      responseFormat: {
        type: 'json_object'
      }
    };
  }
  function fixture() {
    var f = shared.fixture('bytecode', {
        cached: true
      }),
      s = f.service;
    f.policy.CONVERSATION_LIMITS = policy.CONVERSATION_LIMITS;
    s.modelId = 'retained-model-id';
    s.workerReady = true;
    f.dispatches = [];
    f.publicTokens = [];
    f.cancelled = [];
    s.onToken = function (t) {
      f.publicTokens.push(t);
    };
    f.runtime.cancel = function (arg) {
      f.cancelled.push(clone(arg));
      return Promise.resolve();
    };
    f.runtime.completion = function (req) {
      f.dispatches.push(clone(req));
      var text = '{"message":"Hello!","sourceRefs":[]}';
      return {
        requestId: 'synthetic_request',
        events: [{
          type: 'thinkingDelta',
          text: 'SYNTHETIC_PRIVATE_THINKING'
        }, {
          type: 'contentDelta',
          text: text.slice(0, 12)
        }, {
          type: 'thinkingDelta',
          text: 'SYNTHETIC_PRIVATE_THINKING'
        }, {
          type: 'contentDelta',
          text: text.slice(12)
        }],
        final: Promise.resolve({
          contentText: text
        })
      };
    };
    return f;
  }
  function test(_x, _x2) {
    return _test.apply(this, arguments);
  }
  function _test() {
    _test = _asyncToGenerator(function* (name, fn) {
      print('START ' + name);
      try {
        results.push({
          name: name,
          pass: true,
          details: (yield fn()) || {}
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
  function clean(f) {
    assert(!f.service.current, 'operation left active');
    assert(Object.keys(shared.liveTimers).length === 0, 'timer not cleaned');
    assert(f.service.modelId === 'retained-model-id', 'model identity lost');
  }
  _asyncToGenerator(function* () {
    for (var kind of ['zero', 'spanish', 'facts', 'actions', 'history']) {
      yield test('actual donor request matches editable helper: ' + kind, /*#__PURE__*/_asyncToGenerator(function* () {
        var f = fixture(),
          prompt = promptFor(kind),
          expected = conversationRequest(originalRequest(prompt), true);
        var value = yield f.service.completePrivate(prompt, function () {
          return true;
        }, true);
        assert(f.dispatches.length === 1, 'completion not called once');
        assert(equal(f.dispatches[0], expected), 'actual request differs from helper');
        assert(value.text === '{"message":"Hello!","sourceRefs":[]}' && value.contentEvents === 2, 'content stream mismatch/thinking leaked');
        assert(f.publicTokens.length === 0 && f.service.output === '', 'private output became public');
        assert(f.service.inference.state === 'succeeded', 'missing completed inference status');
        assert(!('stopReason' in value), 'unexpected synthetic stopReason needed');
        assert(f.events.some(function (e) {
          return e[0] === 'bounded' && e[2] === 'STREAM_TIMEOUT' && e[3] === 'stream';
        }), 'step argument placement changed');
        clean(f);
        return {
          request: f.dispatches[0],
          value: value,
          privateTokens: f.publicTokens.length,
          state: shared.state(f.service),
          finalHadStopReason: false
        };
      }));
    }
    yield test('nonconversation private task retains original JSON request', /*#__PURE__*/_asyncToGenerator(function* () {
      var f = fixture(),
        prompt = '{"intent":"reflect"}';
      var value = yield f.service.completePrivate(prompt, function () {
        return true;
      }, false);
      assert(equal(f.dispatches[0], originalRequest(prompt)), 'nonconversation path mutated');
      assert(value.contentEvents === 2, 'nonconversation stream changed');
      clean(f);
      return {
        request: f.dispatches[0]
      };
    }));
    yield test('explicit length termination rejects even a parseable conversation body', /*#__PURE__*/_asyncToGenerator(function* () {
      var f = fixture();
      f.runtime.completion = function (req) {
        f.dispatches.push(clone(req));
        var text = '{"message":"Hello!","sourceRefs":[]}';
        return {
          requestId: 'synthetic_limit',
          events: [{
            type: 'contentDelta',
            text: text
          }],
          final: Promise.resolve({
            contentText: text,
            stopReason: 'length'
          })
        };
      };
      var error = yield shared.caught(f.service.completePrivate(promptFor('zero'), function () {
        return true;
      }, true));
      assert(error && error.code === 'OUTPUT_LIMIT', 'explicit limit not reported: ' + JSON.stringify(error));
      assert(f.service.inference.state === 'failed', 'length completion marked succeeded');
      assert(f.publicTokens.length === 0, 'private content leaked');
      clean(f);
      return {
        error: error,
        dispatches: f.dispatches.length
      };
    }));
    yield test('nonconversation length termination retains existing behavior', /*#__PURE__*/_asyncToGenerator(function* () {
      var f = fixture(),
        text = '{"intent":"reflect"}';
      f.runtime.completion = function (req) {
        f.dispatches.push(clone(req));
        return {
          requestId: 'synthetic_local_limit',
          events: [{
            type: 'contentDelta',
            text: text
          }],
          final: Promise.resolve({
            contentText: text,
            stopReason: 'length'
          })
        };
      };
      var value = yield f.service.completePrivate(text, function () {
        return true;
      }, false);
      assert(value.text === text && f.service.inference.state === 'succeeded', 'unrelated local task length behavior changed');
      assert(equal(f.dispatches[0], originalRequest(text)), 'unrelated local request changed');
      clean(f);
      return {
        value: value
      };
    }));
    for (var scenario of ['revoked', 'background', 'cancelled']) {
      yield test('cancellation takes priority over explicit length: ' + scenario, /*#__PURE__*/_asyncToGenerator(function* () {
        var f = fixture(),
          eligible = true;
        f.runtime.completion = function (req) {
          f.dispatches.push(clone(req));
          var finish,
            final = new Promise(function (resolve) {
              finish = resolve;
            }),
            index = 0;
          var events = {};
          events[Symbol.asyncIterator] = function () {
            return {
              next: function () {
                if (index++ === 0) return Promise.resolve({
                  done: false,
                  value: {
                    type: 'contentDelta',
                    text: '{"message":"Hello!","sourceRefs":[]}'
                  }
                });
                if (scenario === 'revoked') eligible = false;
                if (scenario === 'background') f.service.active = false;
                if (scenario === 'cancelled') f.service.current.cancelled = true;
                finish({
                  stopReason: 'length'
                });
                return Promise.resolve({
                  done: true
                });
              }
            };
          };
          return {
            requestId: 'synthetic_cancel_limit',
            events: events,
            final: final
          };
        };
        var error = yield shared.caught(f.service.completePrivate(promptFor('zero'), function () {
          return eligible;
        }, true));
        assert(error && error.code === 'CANCELLED', 'length displaced cancellation: ' + JSON.stringify(error));
        assert(f.publicTokens.length === 0, 'private content leaked');
        clean(f);
        return {
          error: error,
          dispatches: f.dispatches.length
        };
      }));
    }
    yield test('truthy existing conversation flag and predicate preserve admission', /*#__PURE__*/_asyncToGenerator(function* () {
      var f = fixture(),
        prompt = promptFor('zero');
      yield f.service.completePrivate(prompt, function () {
        return {
          allowed: true
        };
      }, {
        conversation: true
      });
      assert(f.dispatches.length === 1 && f.dispatches[0].responseFormat.type === 'json_schema', 'truthy admission changed');
      clean(f);
    }));
    for (var scenario of ['private-revoked', 'private-background', 'private-cancelled', 'public-background', 'public-cancelled']) {
      yield test('602 admission guard preserved: ' + scenario, /*#__PURE__*/_asyncToGenerator(function* () {
        var f = fixture(),
          eligible = true,
          isPrivate = scenario.indexOf('private') === 0;
        f.service.provisioner.stage = function (stage) {
          if (stage === 'stream') {
            if (scenario === 'private-revoked') eligible = false;
            if (scenario.indexOf('background') >= 0) f.service.active = false;
            if (scenario.indexOf('cancelled') >= 0) f.service.current.cancelled = true;
          }
          return Promise.resolve();
        };
        var error = yield shared.caught(isPrivate ? f.service.completePrivate(promptFor('zero'), function () {
          return eligible;
        }, true) : f.service.completePublic('smoke'));
        assert(error && error.code === 'CANCELLED', 'wrong guard error ' + JSON.stringify(error));
        assert(f.dispatches.length === 0, 'guard allowed dispatch');
        assert(f.publicTokens.length === 0, 'guard leaked output');
        clean(f);
        return {
          error: error,
          dispatches: f.dispatches.length
        };
      }));
    }
    yield test('initially denied private request cannot execute donor or SDK', /*#__PURE__*/_asyncToGenerator(function* () {
      var f = fixture(),
        error = yield shared.caught(f.service.completePrivate(promptFor('zero'), function () {
          return false;
        }, true));
      assert(error && error.code === 'CANCELLED' && error.stage === 'local', 'constructor arguments changed');
      assert(f.dispatches.length === 0, 'denied dispatch');
      clean(f);
      return {
        error: error
      };
    }));
    for (var isPrivate of [false, true]) {
      yield test('not-ready constructor remains correct: ' + (isPrivate ? 'private' : 'public'), /*#__PURE__*/_asyncToGenerator(function* () {
        var f = fixture();
        f.service.workerReady = false;
        var error = yield shared.caught(isPrivate ? f.service.completePrivate(promptFor('zero'), function () {
          return true;
        }, true) : f.service.completePublic('smoke'));
        assert(error && error.code === 'QVAC_NOT_READY' && error.stage === (isPrivate ? 'local' : 'stream'), 'wrong constructor code/stage ' + JSON.stringify(error));
        assert(f.dispatches.length === 0, 'not-ready dispatch');
        clean(f);
        return {
          error: error
        };
      }));
    }
    yield test('completed empty private stream remains rejected', /*#__PURE__*/_asyncToGenerator(function* () {
      var f = fixture();
      f.runtime.completion = function (req) {
        f.dispatches.push(clone(req));
        return {
          requestId: 'synthetic',
          events: [],
          final: Promise.resolve({})
        };
      };
      var error = yield shared.caught(f.service.completePrivate(promptFor('zero'), function () {
        return true;
      }, true));
      assert(error && error.code === 'EMPTY_COMPLETION', 'empty accepted');
      clean(f);
      return {
        error: error
      };
    }));
    yield test('helper invalid conversation envelope fails before dispatch', /*#__PURE__*/_asyncToGenerator(function* () {
      var f = fixture(),
        error = yield shared.caught(f.service.completePrivate('{}', function () {
          return true;
        }, true));
      assert(error && error.code === 'UNEXPECTED', 'mock safeError should sanitize plain context Error');
      assert(f.dispatches.length === 0, 'invalid envelope dispatched');
      clean(f);
      return {
        error: error
      };
    }));
    yield test('repeated real private completions clear current operation and timers', /*#__PURE__*/_asyncToGenerator(function* () {
      var f = fixture(),
        prompt = promptFor('zero');
      yield f.service.completePrivate(prompt, function () {
        return true;
      }, true);
      yield f.service.completePrivate(prompt, function () {
        return true;
      }, true);
      assert(f.dispatches.length === 2, 'repeat failed');
      clean(f);
      return {
        dispatches: f.dispatches.length
      };
    }));
    yield test('public smoke still streams its content', /*#__PURE__*/_asyncToGenerator(function* () {
      var f = fixture();
      f.runtime.completion = function (req) {
        f.dispatches.push(clone(req));
        return {
          requestId: 'synthetic_public',
          events: [{
            type: 'contentDelta',
            text: 'Hello.'
          }],
          final: Promise.resolve({
            contentText: 'Hello.'
          })
        };
      };
      yield f.service.completePublic('smoke');
      assert(f.publicTokens.length === 1 && f.publicTokens[0].text === 'Hello.', 'public smoke output changed');
      assert(f.dispatches[0].responseFormat === undefined, 'private format added to public');
      clean(f);
      return {
        request: f.dispatches[0],
        tokens: f.publicTokens
      };
    }));
    print(JSON.stringify({
      pass: results.every(function (r) {
        return r.pass;
      }),
      total: results.length,
      cases: results,
      capturedModules: Object.keys(oracle.factories).length,
      suppressedEntrypoints: oracle.entries
    }));
  })().catch(function (e) {
    print('HARNESS_ERROR ' + String(e.stack || e));
  });
})();
