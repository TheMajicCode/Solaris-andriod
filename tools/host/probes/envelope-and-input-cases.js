// Standalone-parseable: this file is ONE function expression. tools/host/run-host-probe.py
// appends the invocation and closes the frozen harness's outer function.
  (async function(){
    // Maintained host probe. Appended by tools/host/run-host-probe.py to the
    // hash-verified helper prefix of the FROZEN Solaris-Android-R4/grounding/
    // actual-tests.js, which is never edited. Observational: each case records
    // what the actual host does; none asserts a desired outcome.
    //
    // AUD-04(c): what the host puts before the first newline of the prompt it
    // builds, and whether any user-influenced value can make the envelope parse
    // inlined into assertConversationAccess (function 14890) fail.
    // SP2-HOST-01: an unpaired UTF-16 surrogate in user text.
    function header(p){var cut=p.indexOf('\n');return {cut:cut,header:cut>=0?p.slice(0,cut):p.slice(0,200),suffixOk:p.slice(-10)===' /no_think'};}
    function tryPreflight(f,msg){try{var pf=f.service.assertConversationAccess(msg,[],true);return {threw:null,guided:!!(pf&&pf.message)};}catch(e){return {threw:String(e&&e.name)+': '+String(e&&e.message)};}}
    await test('prompt header, open chat, en', async function(){var f=fixture({});await invoke(f,{message:'Tell me a short story'});return header(f.calls[0].prompt);});
    await test('prompt header, es locale with a profile name', async function(){var f=fixture({profile:true});f.service.state.experience.locale='es';await invoke(f,{message:'Cuentame una historia'});return header(f.calls[0].prompt);});
    await test('user text containing a newline and the suffix', async function(){var f=fixture({loaded:false});var r=tryPreflight(f,'Hello\nthere /no_think');var g=fixture({});await invoke(g,{message:'Hello\nthere /no_think'});return {preflight:r,envelopeUserRoundTrips:envelope(g.calls[0].prompt).user==='Hello\nthere /no_think',header:header(g.calls[0].prompt)};});
    await test('display name containing a newline', async function(){var f=fixture({loaded:false,profile:true});f.service.state.displayName='Synthetic\nProfile';var valid=null;try{f.require(922).validState(f.service.state);valid=true;}catch(e){valid=String(e&&e.message);}var r=tryPreflight(f,'Hello');var g=fixture({profile:true});g.service.state.displayName='Synthetic\nProfile';var err=await invoke(g,{message:'Tell me a short story'});return {validState:valid,preflight:r,openChatError:err,header:g.calls.length?header(g.calls[0].prompt):null};});
    await test('very long non-BMP user text', async function(){var f=fixture({loaded:false});return tryPreflight(f,'😀'.repeat(500)+' ¿Qué?');});
    await test('unpaired high surrogate, preflight', async function(){var f=fixture({loaded:false});return tryPreflight(f,'Hello \uD800 there');});
    await test('unpaired low surrogate, full open-chat turn', async function(){var f=fixture({});var err=await invoke(f,{message:'Tell me \uDC00 a story'});return {error:err,modelCalls:f.calls.length,writes:f.writes.length,conversationGrew:f.service.state.conversation.length!==f.before.conversation.length};});
    await test('control: ordinary text, preflight', async function(){var f=fixture({loaded:false});return tryPreflight(f,'Hello there');});
    print(JSON.stringify({total:results.length,harnessErrors:results.filter(function(r){return !r.pass;}).length,cases:results,capturedModules:Object.keys(oracle.factories).length}));
  })
