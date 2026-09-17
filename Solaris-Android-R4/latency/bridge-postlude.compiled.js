function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
(function (t) {
  var rows = [];
  function assert(ok, msg) {
    if (!ok) throw Error(msg);
  }
  function reset(options) {
    t.options = options || {};
    t.counts = {
      trace: 0,
      snapshot: 0,
      prepare: 0,
      preflight: 0,
      converse: 0,
      eligible: 0
    };
    t.replies = [];
    t.entries[11].current = true;
    t.entries[12].current = 0;
    t.entries[27].current = 0;
  }
  function runGenerator(it) {
    return new Promise(function (resolve, reject) {
      function step(method, arg) {
        var value;
        try {
          value = it[method](arg);
        } catch (e) {
          reject(e);
          return;
        }
        if (value.done) {
          resolve(value.value);
          return;
        }
        Promise.resolve(value.value).then(function (x) {
          step('next', x);
        }, function (e) {
          step('throw', e);
        });
      }
      step('next');
    });
  }
  function invoke(_x) {
    return _invoke.apply(this, arguments);
  }
  function _invoke() {
    _invoke = _asyncToGenerator(function* (options) {
      options = options || {};
      return runGenerator(t.receive(JSON.stringify({
        transport: 'solaris-vault-ui/1',
        id: 'fixture_01',
        method: 'converse',
        params: {
          message: 'Hello',
          sourceIds: ['synthetic_source'],
          useAI: options.useAI !== false,
          operationId: 'op_fixture01'
        }
      }), options.badOrigin ? 'https://untrusted.example/' : 'file:///synthetic-solaris.html'));
    });
    return _invoke.apply(this, arguments);
  }
  function testCase(_x2, _x3, _x4) {
    return _testCase.apply(this, arguments);
  }
  function _testCase() {
    _testCase = _asyncToGenerator(function* (name, options, body) {
      reset(options);
      try {
        yield body();
        rows.push({
          name: name,
          pass: true,
          counts: t.counts,
          replies: t.replies
        });
      } catch (e) {
        rows.push({
          name: name,
          pass: false,
          error: String(e.stack || e),
          counts: t.counts,
          replies: t.replies
        });
      }
    });
    return _testCase.apply(this, arguments);
  }
  _asyncToGenerator(function* () {
    yield testCase('Guided preflight skips model snapshot and prepare but reaches converse', {
      guided: true
    }, /*#__PURE__*/_asyncToGenerator(function* () {
      yield invoke();
      assert(t.counts.preflight === 1 && t.counts.prepare === 0 && t.counts.snapshot === 0 && t.counts.converse === 1, 'guided did not bypass preparation');
      assert(t.counts.eligible === 1, 'post-preflight guard missing');
      assert(t.replies[0].ok === true, 'no success reply');
      assert(t.converse.message === 'Hello' && t.converse.sourceIds[0] === 'synthetic_source' && t.converse.useAI === true && t.converse.operationId === 'op_fixture01', 'forwarded parameters changed');
    }));
    yield testCase('Open chat with unloaded model still prepares', {
      guided: false,
      loaded: false
    }, /*#__PURE__*/_asyncToGenerator(function* () {
      yield invoke();
      assert(t.counts.prepare === 1 && t.counts.snapshot === 1 && t.counts.converse === 1, 'open chat model load skipped');
      assert(t.replies[0].ok === true, 'open chat failed');
    }));
    yield testCase('Open chat with loaded model does not reload', {
      loaded: true
    }, /*#__PURE__*/_asyncToGenerator(function* () {
      yield invoke();
      assert(t.counts.prepare === 0 && t.counts.snapshot === 1 && t.counts.converse === 1, 'warm model behavior changed');
    }));
    yield testCase('AI disabled retains original no-load path', {}, /*#__PURE__*/_asyncToGenerator(function* () {
      yield invoke({
        useAI: false
      });
      assert(t.counts.prepare === 0 && t.counts.snapshot === 0 && t.counts.converse === 1 && t.converse.useAI === false, 'AI-off path changed');
    }));
    yield testCase('Rejected preflight cannot load model or converse', {
      reject: 'LOCAL_PERMISSION_REQUIRED'
    }, /*#__PURE__*/_asyncToGenerator(function* () {
      yield invoke();
      assert(t.counts.preflight === 1 && t.counts.prepare === 0 && t.counts.converse === 0, 'rejected preflight dispatched');
      assert(t.replies[0].error === 'LOCAL_PERMISSION_REQUIRED', 'permission error lost');
    }));
    yield testCase('Guided preflight still checks post-preflight input eligibility', {
      guided: true,
      ineligible: true
    }, /*#__PURE__*/_asyncToGenerator(function* () {
      yield invoke();
      assert(t.counts.prepare === 0 && t.counts.converse === 0, 'guided bypassed eligibility');
      assert(t.replies[0].error === 'CANCELLED', 'expected cancellation');
    }));
    yield testCase('Guided preflight still honors superseded request token', {
      guided: true,
      afterPreflight: function () {
        t.entries[12].current++;
      }
    }, /*#__PURE__*/_asyncToGenerator(function* () {
      yield invoke();
      assert(t.counts.prepare === 0 && t.counts.converse === 0, 'superseded guided dispatched');
      assert(t.replies[0].error === 'CANCELLED', 'expected cancellation');
    }));
    yield testCase('Guided preflight still rejects concurrent voice recording', {
      guided: true,
      voiceState: 'recording'
    }, /*#__PURE__*/_asyncToGenerator(function* () {
      yield invoke();
      assert(t.counts.preflight === 0 && t.counts.prepare === 0 && t.counts.converse === 0, 'voice busy dispatched');
      assert(t.replies[0].error === 'VOICE_BUSY', 'voice error changed');
    }));
    yield testCase('Invalid origin never calls conversation preflight', {
      guided: true
    }, /*#__PURE__*/_asyncToGenerator(function* () {
      yield invoke({
        badOrigin: true
      });
      assert(t.counts.preflight === 0 && t.counts.prepare === 0 && t.counts.converse === 0 && t.replies.length === 0 && t.counts.trace === 1, 'bad origin accepted');
    }));
    yield testCase('Closed input gate rejects before preflight', {
      guided: true
    }, /*#__PURE__*/_asyncToGenerator(function* () {
      t.entries[11].current = false;
      yield invoke();
      assert(t.counts.preflight === 0 && t.counts.converse === 0, 'locked input accepted');
      assert(t.replies[0].error === 'VAULT_LOCKED', 'locked error lost');
    }));
    yield testCase('Preparation failure does not call converse', {
      prepareReject: 'QVAC_MODEL_LOAD_FAILED'
    }, /*#__PURE__*/_asyncToGenerator(function* () {
      yield invoke();
      assert(t.counts.prepare === 1 && t.counts.converse === 0, 'failed load dispatched');
      assert(t.replies[0].error === 'QVAC_MODEL_LOAD_FAILED', 'load error lost');
    }));
    yield testCase('Input eligibility loss while preparing prevents converse', {
      afterPrepare: function () {
        t.options.ineligible = true;
      }
    }, /*#__PURE__*/_asyncToGenerator(function* () {
      yield invoke();
      assert(t.counts.prepare === 1 && t.counts.converse === 0, 'post-load eligibility lost');
      assert(t.replies[0].error === 'VAULT_LOCKED', 'expected locked after prepare');
    }));
    yield testCase('Changed bridge epoch suppresses successful late reply', {
      guided: true,
      afterConverse: function () {
        t.entries[27].current++;
      }
    }, /*#__PURE__*/_asyncToGenerator(function* () {
      yield invoke();
      assert(t.counts.prepare === 0 && t.counts.converse === 1 && t.replies.length === 0, 'late epoch reply leaked');
    }));
    print(JSON.stringify({
      scope: 'Actual candidate F6929 and F6928 bytecode with synthetic lexical dependencies. No React mount, Android model or phone timing claim.',
      pass: rows.every(function (x) {
        return x.pass;
      }),
      total: rows.length,
      cases: rows
    }));
  })().catch(function (e) {
    print(JSON.stringify({
      fatal: String(e.stack || e)
    }));
  });
})(globalThis.test);
