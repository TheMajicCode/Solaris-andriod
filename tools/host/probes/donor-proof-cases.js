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
    // Independent review of b2a6ba8. S2R-1: normalization must not widen shipped's
    // substring branches. S2R-2: shipped check-in phrasings keep their grounded
    // reply. S2R-11: bare help keeps shipped semantics. Both bundles are expected
    // to behave identically on every case in this block except the last one.
    var unchanged = [['S2R-1 pills via can-you', 'Can you tell me about my sleep? I took too many pills', {}],
                     ['S2R-1 want to die via please', 'Please, my sleep is bad and I want to die', {}],
                     ['S2R-1 overdose via can-you history', 'Can you review my history? I overdosed', {}],
                     ['S2R-1 bleeding via inverted question', '¿Cómo están mis hábitos? Estoy sangrando mucho', {locale: 'es'}],
                     ['S2R-1 cannot breathe via could-you', 'Could you show my sleep record? I cannot breathe', {}],
                     ['S2R-11 please help', 'Please help!', {}],
                     ['S2R-11 inverted ayuda', '¡Ayuda!', {locale: 'es'}],
                     ['pre-existing 604 records-select with a clinical clause', 'How is my sleep? I want to kill myself', {}],
                     ['S2R-2 show my check-in', 'show my check-in', {checkin: true, categories: ['questionnaires']}],
                     ['S2R-2 summarize my check-in', 'Summarize my check-in', {checkin: true, categories: ['questionnaires']}],
                     ['S2R-2 what did I record', 'what did I record in my check-in?', {checkin: true, categories: ['questionnaires']}],
                     ['S2R-2 checkin spelling', 'explain my checkin', {checkin: true, categories: ['questionnaires']}],
                     ['S2R-2 polite suffix', 'Show my check-in please', {checkin: true, categories: ['questionnaires']}],
                     ['S2R-2 Spanish mi check-in', 'mi check-in', {checkin: true, categories: ['questionnaires'], locale: 'es'}],
                     ['deliberate difference: unlisted check-in question', 'how did my check-in go', {checkin: true, categories: ['questionnaires']}],
                     ['S2R2-1 check-in plus chest pain', 'Explain my check-in, I noted chest pain', {}],
                     ['S2R2-1 check-in plus fainted', 'How was my check-in? I recorded that I fainted', {}],
                     ['S2R2-1 check-in plus overdose', 'What is my check-in? My sleep is bad, I overdosed', {}]];
    for (var u of unchanged) await test('review: ' + u[0], (function(m, o){ return function(){ return route(m, o); }; })(u[1], u[2]));
    await test('control: open chat stays with the model', function(){ return route('Tell me a short story'); });
    await test('control: exact shipped form still guided', function(){ return route('Explain my check-in'); });
    print(JSON.stringify({total: results.length, harnessErrors: results.filter(function(x){ return !x.pass; }).length,
                          cases: results, capturedModules: Object.keys(oracle.factories).length}));
  })
