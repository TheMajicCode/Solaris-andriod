// Standalone-parseable: this file is ONE function expression. tools/host/run-host-probe.py
// appends the invocation and closes the frozen harness's outer function.
  (async function(){
    // Maintained donor-proof cases, appended by tools/host/run-host-probe.py to the
    // hash-verified helper prefix of the FROZEN actual-tests.js. Each case records
    // whether the ACTUAL host answered through the guided shortcut (no model call)
    // or took the model path. Expected outcomes live in donor-proof-expectations.json,
    // separately for shipped 604 and for the candidate donor bundle.
    async function route(message, options){
      options = options || {};
      var f = fixture({loaded: true, categories: options.categories, profile: options.profile});
      if (options.locale) f.service.state.experience.locale = options.locale;
      if (options.checkin) addCheckin(f, 'source_'+'f'.repeat(32), '2026-09-15', [2,4,3,5]);
      var pf = f.service.assertConversationAccess(message, options.checkin ? [f.service.state.sources[0].id] : [], true);
      var err = await invoke(f, {message: message, sources: options.checkin ? [f.service.state.sources[0].id] : []});
      var last = f.service.state.conversation[f.service.state.conversation.length - 1];
      return {guided: !!(pf && pf.message), modelCalls: f.calls.length, error: err,
              mode: last && last.role !== 'user' ? last.mode : null,
              text: last && last.role !== 'user' ? String(last.text).slice(0, 90) : null};
    }
    var supported = [['F04 leading inverted exclamation', '¡Hola!'],
                     ['F04 leading inverted question', '¿Qué puedes hacer?'],
                     ['F04 polite prefix and punctuation', 'Por favor, ¿qué puedes hacer?'],
                     ['F04 can-you prefix', 'Can you explain my check-in?'],
                     ['SP-CHAT-03 step quick action', 'Help me choose a step today'],
                     ['SP-CHAT-03 who-is quick action', 'Who is Pocket LUCA AI?']];
    for (var s of supported) await test('supported: ' + s[0], (function(m){ return function(){ return route(m); }; })(s[1]));
    await test('supported: grounded values from a selected check-in', function(){ return route('Can you explain my check-in?', {checkin: true, categories: ['questionnaires']}); });
    await test('supported: Spanish explain with Spanish locale', function(){ return route('¿Explica mi check-in?', {locale: 'es'}); });
    var rejected = [['F05 severe chest pain during check-in', 'What should I do about severe chest pain during my check-in?'],
                    ['F05 Spanish chest pain plus explain', 'Tengo dolor en el pecho, explica mi check-in'],
                    ['F05 medication plus explain', 'Can I double my meds? Explain my check-in'],
                    ['F05 fainted plus check-in question', 'How was my check-in yesterday after I fainted?']];
    for (var r of rejected) await test('rejected: ' + r[0], (function(m){ return function(){ return route(m); }; })(r[1]));
    await test('control: open chat stays with the model', function(){ return route('Tell me a short story'); });
    await test('control: exact shipped form still guided', function(){ return route('Explain my check-in'); });
    print(JSON.stringify({total: results.length, harnessErrors: results.filter(function(x){ return !x.pass; }).length,
                          cases: results, capturedModules: Object.keys(oracle.factories).length}));
  })
