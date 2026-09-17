function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
// Run after original Metro capture and the shared, generated fixture definitions.
// Synthetic data only. Fixed clock and non-firing timers make success-path parity
// deterministic. This does not exercise real inference or wall-clock timeouts.
(function () {
  var test = __solarisFixtures,
    fixture = test.fixture,
    caught = test.caught,
    state = test.state;
  var NativeDate = Date;
  function FixedDate(value) {
    return arguments.length ? new NativeDate(value) : new NativeDate(1700000000000);
  }
  FixedDate.now = function () {
    return 1700000000000;
  };
  FixedDate.parse = NativeDate.parse;
  FixedDate.UTC = NativeDate.UTC;
  FixedDate.prototype = NativeDate.prototype;
  globalThis.Date = FixedDate;
  var names = ['public-success', 'private-success', 'private-truthy-success', 'public-background', 'public-cancelled', 'private-revoked', 'private-background', 'private-cancelled', 'private-initially-denied', 'public-not-ready', 'private-not-ready', 'public-empty', 'private-empty', 'public-sdk-throw', 'private-sdk-throw', 'public-repeated-success', 'private-repeated-success'];
  _asyncToGenerator(function* () {
    var results = [];
    for (var name of names) {
      var f = fixture('bytecode', {
          cached: true
        }),
        s = f.service,
        privateMode = name.indexOf('private') === 0;
      var eligible = name !== 'private-initially-denied',
        dispatches = [],
        tokens = [],
        predicateCalls = 0;
      s.modelId = 'retained-model-id';
      s.workerReady = name.indexOf('not-ready') < 0;
      s.onToken = function (token) {
        tokens.push(token);
      };
      s.provisioner.stage = function (stage) {
        f.event('stage', stage);
        if (stage === 'stream') {
          if (name === 'private-revoked') eligible = false;
          if (name.indexOf('background') >= 0) s.active = false;
          if (name.indexOf('cancelled') >= 0) s.current.cancelled = true;
        }
        return Promise.resolve();
      };
      f.runtime.cancel = function (arg) {
        f.event('sdk-cancel', arg);
        return Promise.resolve();
      };
      f.runtime.completion = function (options) {
        dispatches.push({
          options: options,
          active: s.active,
          eligible: eligible,
          cancelled: s.current.cancelled
        });
        if (name.indexOf('sdk-throw') >= 0) throw new f.policy.RuntimeError('SYNTHETIC_SDK_FAILURE', 'stream');
        var text = privateMode ? '{}' : 'Hello.';
        return {
          requestId: 'synthetic-request',
          events: name.indexOf('empty') >= 0 ? [] : [{
            type: 'contentDelta',
            text: text
          }],
          final: Promise.resolve({
            contentText: name.indexOf('empty') >= 0 ? '' : text
          })
        };
      };
      function predicate() {
        predicateCalls++;
        return eligible ? name === 'private-truthy-success' ? {
          truthy: true
        } : true : false;
      }
      function invoke() {
        return privateMode ? s.completePrivate('{}', predicate, false) : s.completePublic('smoke');
      }
      var value = null,
        error = null;
      try {
        value = yield invoke();
        if (name.indexOf('repeated') >= 0) value = [value, yield invoke()];
      } catch (e) {
        error = {
          code: e.code,
          stage: e.stage
        };
      }
      results.push({
        name: name,
        value: value,
        error: error,
        dispatches: dispatches,
        tokens: tokens,
        predicateCalls: predicateCalls,
        events: f.events,
        state: state(s),
        output: s.output,
        receipt: s.receipt,
        inference: s.inference,
        remainingTimerCount: Object.keys(test.liveTimers).length
      });
    }
    print(JSON.stringify({
      kind: 'completion-guard-probe',
      cases: results,
      complete: true
    }));
  })().catch(function (e) {
    print('HARNESS_ERROR ' + String(e.stack || e));
  });
})();
