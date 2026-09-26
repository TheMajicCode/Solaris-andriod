# U0 host trace: welcome, unlock and onboarding in the retained R4 UI

**What this is:** a read-only trace of the frozen host UI. It records the facts
the U0 candidate (`candidate/onboarding/`) relies on. Nothing here was executed
on a phone, and no host file was edited.

**Source traced:** [`Solaris-Android-R4/ui/sanctuary.html`](../../Solaris-Android-R4/ui/sanctuary.html)

- 5,261,956 bytes, 1,402 lines.
- SHA-256 `1dd45155ee400b7316d32c30856d2b3394680e98af7148bca29e5610879dbab4`.
- Git blob `2ddee40622168e2bf342ced81d26df04739f7472`.

That hash matches the entry in
[`REPO-IMPORT-MANIFEST.json`](../provenance/REPO-IMPORT-MANIFEST.json) and the
sprint-02 `SOURCE-HASHES.json`. The bytes were read from commit `cdbf3a3`.

**Reading method:** lines were printed one by one with inline
`data:image/…;base64,…` runs replaced by `<b64>`. The line numbers below are
1-based lines of the file itself. The code quoted is literal; `…` marks an
elision.

**The HBC variant:** the embedded variant
[`sanctuary.compact.html`](../../Solaris-Android-R4/ui/sanctuary.compact.html)
(10 lines, SHA-256 `82f96bdb…4831`, also manifest-verified) carries the same
logic with module-local identifiers renamed. Observed renames: `state`→`a`,
`drafts`→`y` and `step`→`r`. The behaviours below were confirmed there by
substring search. Line numbers do not apply to it.

## 1. Entry state and `hasVault`

| Line | Literal code | What it proves |
|---|---|---|
| 765 | `let state={locked:true},route='home',sub=null,step=0,…` | The UI starts locked, and **`hasVault` is undefined** until native supplies it. `step` is a plain in-memory variable. |
| 766 | `let …,chatDraft='',drafts={},…` | `drafts` is an in-memory object (`drafts.name` holds the preferred-name draft). |
| 783 | `// hasVault belongs to the native entry wrapper, not DailyService's record view.` | `hasVault` comes from the native entry wrapper. |
| 784 | `…state={...next,hasVault:next.hasVault??state.hasVault};…` | A later state that omits `hasVault` keeps the previous value. This is why a lock push `{locked:true}` keeps `hasVault:true`. |
| 786 | `function accept(next){adoptState(next);…if(state.locked){…chatDraft='';drafts={};legacyView=null;selected.clear();…}…render()}` | On lock the host **reassigns** `drafts={}` and clears `selected`. A module that captured the old `drafts` object would keep a stale reference, so the candidate reads drafts through a getter. |
| 788 | `window.__solarisVaultState=next=>accept(next);` | Native pushes state here. |
| 792 | `window.__solarisPrivateHide=()=>{…accept({locked:true});for(const p of pending.values()){clearTimeout(p.timer);p.reject(Error('VAULT_LOCKED'));}pending.clear()};` | Hiding or locking adopts `{locked:true}` **first**, then rejects every pending vault request with `VAULT_LOCKED`. |
| 1401 | `render();void request('view').then(accept).catch(()=>{});` | The first render happens with `{locked:true}`. **A failed `view` is swallowed**: no error and no retry is shown. |

**Current behaviour (differs from the contract).** With `state={locked:true}`
and `hasVault` undefined, line 1011 (`state.hasVault===false`) is false, so line
1012 renders the **returning "Unlock my Vault" screen**. So does a native
error, since 1401 swallows it. An unknown state is therefore presented as an
existing locked vault. The contract requires a neutral "Opening Solaris…" state
with retry.

## 2. Screen selection: `render()` 1008–1025 and `viewKey()` 958

| Line | Literal code (abridged) | Screen |
|---|---|---|
| 958 | `function viewKey(){return JSON.stringify([!!state.locked,state.hasVault,!!state.migration?.committed,!!state.onboardingComplete,route,sub,step,…])}` | Render identity. Note the optional chaining on `migration` here. |
| 1011 | `if(state.locked&&state.hasVault===false){root.innerHTML=\`${prepStrip()}<section class="onboard">…<h1>Welcome to Solaris.</h1><p>Meet LUCA AI, your private Solaris companion. …</p><p class="muted">Local AI uses a one-time 382 MB public download over Wi-Fi. …</p></article><footer>${btn('Begin with LUCA AI','firstAI','')}${btn('Use without AI','firstNoAI','plain')}${btn('Restore my vault','setup','plain')}</footer></section>\`;return}` | **Welcome** (no vault). Actions: `firstAI`, `firstNoAI`, `setup` ("Restore my vault"). |
| 1012 | `if(state.locked){root.innerHTML=\`<div class="locked">…<h1>Your day.<br>Your own rhythm.</h1>…${btn('Unlock my Vault','setup','')}${btn('Pocket LUCA AI setup','aiSetup')}<small>…Unlock with your fingerprint or phone screen lock. …</small></div>\`;return}` | **Returning / locked**, reached by every locked state other than `hasVault===false`. Actions: `setup`, `aiSetup`. |
| 1013 | `if(!state.migration.committed){root.innerHTML=shell(\`…ONE-TIME OWNER SETUP…${btn('Continue Vault setup','setup','soft')}</div>${legacyPanel()}\`)}` | **Mandatory migration.** It has no optional chaining, so an unlocked state without a `migration` object would **throw `TypeError`** here. |
| 1014 | `else if(!state.onboardingComplete){renderOnboarding()}` | **Onboarding.** Any truthy value (for example the string `'true'`) counts as complete. |
| 1016 | `const content=sanctuaryPage()??guidedPage()??…` | Home and sub-pages, **only after** onboarding. `sub` is not consulted during onboarding. |
| 1021 | `enhanceSanctuary();` | Runs only for shell/onboarding renders; 1011 and 1012 `return` before it. |

**Hardcoded English and model size.** On the welcome (1011) and locked (1012)
screens the headings and paragraphs are literal English strings. They are not
passed through `tr()`, and `localizeStaticText` (1086–1092) never runs because
1011–1012 return before `enhanceSanctuary()` (1074, which also sets
`document.documentElement.lang`).

Only the `btn()` labels (773: `${esc(tr(label))}`) translate, and only when
`state.experience?.locale==='es'` (1034). Whether native supplies `experience`
while locked is **not known**. Neither screen has a language switch.

"382 MB" is hardcoded in three places:

- 1011, welcome;
- 1227, `modelDetailsContent`: `One public model file: 382 MB (364.45 MiB).`;
- 1027, `legacyRenderOnboarding`, which is defined but **never called** (the
  only occurrence of `legacyRenderOnboarding(` is its definition).

The same strings exist in the compact variant.

## 3. Onboarding: `renderOnboarding()` 1073, `uiLocale()` 1034

1073, abridged:

```
function renderOnboarding(){const stages=[{title:'A place for your everyday.',…},{title:'Pocket LUCA AI',…},{title:'Your vault is ready.',…}],current=stages[Math.min(2,step)];root.innerHTML=`${prepStrip()}<section class="onboard"><div class="row">…<button class="icon-button language-switch" data-do="languageToggle" …>…</button>${btn('Skip','onboardSkip','plain')}</div></div><article>…<div class="progress" aria-label="${step+1} / 3">…${step===2?`<label for="name">…<input id="name" maxlength="80" … value="${esc(drafts.name||'')}"></label>`:''}</article><footer>${step?btn('Back','onboardBack','plain'):''}${step<2?btn('Continue','onboardNext',''):btn('Done','onboardSkip','')}${step===1?btn('Begin with LUCA AI','welcomeAI','plain'):''}</footer></section>`;enhanceSanctuary()}
```

- There are three stages, and `step` is in memory only (0-based). **No step is
  persisted**, so after a relaunch onboarding restarts at the first stage.
- **Skip and Done dispatch the same action, `onboardSkip`.**
- The progress label is `"2 / 3"`; there is no "Step n of 3" text.
- There is no `#daily-error` region in this markup (see §6).
- 1034: `function uiLocale(){return state.experience?.locale==='es'?'es':'en'}`.

## 4. Actions: the dispatcher 1362–1393, `run()` 941–953

1362–1367 routes every `button[data-do]` click through `run(fn, action)`. The
attribute is **`data-do`**, not `data-action`.

`run()` is at 941–953:

| Line | Literal code | Meaning |
|---|---|---|
| 942 | `…const group=actionGroup(action);if(actionJobs.has(group)){updatePendingControls();return;}` | **The host already drops a second tap** of the same action group while the first is pending. |
| 947 | `const isCurrent=()=>ticket===navigationEpoch&&session===privateEpoch;` | A lock or navigation invalidates the job. |
| 949 | `…setTimeout(()=>{…error=…'Still working on this action. Your saved records are kept.';…},12000);` | After 12 s, a notice that the action is still running. **It is not a timeout, and the job keeps waiting.** |
| 951 | `catch(e){if(isCurrent())showError(e.message,action)}` | Failures go to `showError`, and only while the job is current. |

The onboarding-relevant actions:

| Line | Literal code | Meaning |
|---|---|---|
| 1094 | `if(a==='languageToggle'){const target=uiLocale()==='es'?'en':'es';await change('experienceLocale',{locale:target});if(questionnaire){…}return true;}` | The language switch is a **durable write**. |
| 1100 | `if(a==='onboardSkip'){await change('onboarding',{name:drafts.name\|\|''});step=0;return true}` | **Skip and Done complete onboarding.** `step` resets only after the awaited write succeeds. |
| 1316 | `async function guidedAction(a,…){if(a==='modelDetails'){sub='modelDetails';return true}if(a==='modelLoad'){await window.SolarisNativeAI.loadModel(…);return true}if(a==='modelWifi'\|\|a==='modelMobile'){await request('provisionChoice',{enabled:true,mobileData:a==='modelMobile'});return true}if(a==='modelCancel'){await window.SolarisNativeAI.cancelProvision(…);return true}` | `modelDetails` only sets `sub`. `modelWifi`/`modelMobile` enable provisioning. |
| 1372 | `if(a==='welcomeAI'\|\|a==='welcomeNoAI'){await request('provisionChoice',{enabled:a==='welcomeAI',mobileData:false});await change('onboarding',{name:drafts.name\|\|document.getElementById('name')?.value\|\|''});step=0;return}` | **A compound:** it chooses provisioning and then **completes onboarding**. Unsafe for a mid-tour "Set up Pocket LUCA". |
| 1373 | `if(a==='checkin'&&qTemplate('daily-checkin')){await openQuestionnaire('daily-checkin',false,isCurrent);return}if(a==='method'&&qTemplate('method')){…}` | The existing check-in entry. |
| 1375 | `if(a==='firstAI'\|\|a==='firstNoAI'){await request('provisionChoice',{enabled:a==='firstAI',mobileData:false});await request('openSetup');return}` | The welcome AI choice happens **before** setup. `firstAI` enables provisioning. |
| 1376 | `if(a==='setup'){await request('openSetup');return}if(a==='aiSetup'){await window.SolarisNativeAI.openDiagnostics({bridgeVersion:'solaris-qvac-bridge/1'});return}if(a==='lock'){…}` | **`openSetup` alone is an existing legal path** (restore, unlock, migration and settings all use it). `aiSetup` opens native diagnostics and is offered on the **locked** screen (1012). |
| 1377 | `if(a==='onboardBack'){step=Math.max(0,step-1);return}if(a==='onboardNext'){if(step<2)step++;else await change('onboarding',{name:…});return}` | Back and Next are in-memory only. |
| 1379 | `if(['checkin','method','permissions','settings'].includes(a)){sub=a;return}` | Fallback check-in route when no template exists. |
| 1096 | `if(a.startsWith('healthTab:')…){…healthTab=next;route='health';sub=healthSub[next];…}` | `healthTab:records` opens Records (`healthSub.records='records'`, 1031). |
| 1360 | `root.addEventListener('input',e=>{…if(t.id==='name')drafts.name=t.value;…})` | The preferred-name input must keep `id="name"` to reuse this listener. |

## 5. `request()` 774–780, `change()` 925, and the native-AI `call()` 740–748

| Line | Literal code | Meaning |
|---|---|---|
| 774–775 | `function request(method,params={}){return new Promise((resolve,reject)=>{ const id=uid(),entry={resolve,reject,timer:null};pending.set(id,entry);` | A vault bridge request. |
| 778 | `if(method==='change'&&(params.kind==='questionnaireSave'\|\|params.kind?.startsWith('session')))entry.timer=setTimeout(…,20000);` | **Only** questionnaire and session saves get a 20 s timeout. **`change('onboarding')`, `openSetup` and `view` have no timeout.** |
| 779 | `window.ReactNativeWebView?.postMessage(JSON.stringify({transport:'solaris-vault-ui/1',id,method,params}));` | Transport. |
| 787 | `window.__solarisVaultReply=m=>{…if(m.ok)p.resolve(m.result);else p.reject(Error(m.error\|\|'OPERATION_FAILED'))};` | Failures surface as `Error(code)`. |
| 925 | `async function change(kind,params,operationId=uid()){const epoch=privateEpoch,result=await request('change',{kind,params,operationId});if(epoch!==privateEpoch\|\|state.locked)throw Error('VAULT_LOCKED');adoptState(result);return state}` | `change` returns the adopted state. **If the UI is locked when the reply arrives it throws `VAULT_LOCKED`, even if native succeeded.** |
| 1256–1283 | `const write=current.pendingWrite\|\|{operationId:uid(),…}; … await change('questionnaireSave',write.params,write.operationId); … if(![…'QUESTIONNAIRE_SAVE_TIMEOUT','QUESTIONNAIRE_SAVE_UNCONFIRMED'].includes(e.message))current.pendingWrite=null;` | **A precedent for retrying a timed-out write with the same `operationId`**; a definite failure drops it. |
| 736 | `const budgets={ping:1000,…,openDiagnostics:3000};` | `openDiagnostics` is a registered native-AI method with a 3 s reply budget. |
| 743–744 | `const timer=setTimeout(()=>fail('BRIDGE_REPLY_TIMEOUT'),budgets[method]); const ack=setTimeout(()=>fail('BRIDGE_ACK_TIMEOUT'),1000);` | Native-AI calls do time out. |
| 762 | `window.SolarisNativeAI = Object.freeze(Object.fromEntries(Object.keys(budgets).map(method => [method,params => call(method,params)])));` | `SolarisNativeAI.openDiagnostics` exists. |

**Is `change` legal while locked?**

- **UI side (proven):** no. 925 rejects with `VAULT_LOCKED` whenever
  `state.locked` is true at reply time, and 1094 is only reachable from the
  unlocked shell (954) and onboarding (1073). The welcome and locked screens
  offer no language switch.
- **Native side (unknown):** whether a locked `change('experienceLocale')`
  would be committed natively is not established. The recovered handler in §7
  delegates `change` to a service function this trace did not read. A locked
  write could therefore **succeed natively and be reported as failed**. The
  candidate never issues one.

## 6. How failures are shown: `showError` 924, `updateError` 1007

| Line | Literal code | Meaning |
|---|---|---|
| 1007 | `function updateError(){…const el=document.getElementById('daily-error');if(el){updateRuntimeRegion(el,errorContents());el.hidden=!error}}` | Errors render **only** into `#daily-error`. |
| 954 | `…<div id="daily-error" class="alertbar" role="alert" ${error?'':'hidden'}>${errorContents()}</div>…` | That region exists only inside `shell()`. |
| 1205 | `function prepStrip(){return \`<div id="daily-preparation">${prepContents()}</div>\`}` | The welcome, locked and onboarding screens include only this strip, with no error region. |

**Consequence (a host defect, not fixed here).** A failed `onboardSkip`,
`openSetup`, `firstAI` or `aiSetup` on the welcome, locked or onboarding
screens sets `error` but **renders nothing**. The user sees buttons re-enable
with no message. The candidate renders every failure in its own localized
`role="alert"` region.

## 7. Native boundary (recovered bytecode; reference only, not executed)

[`Solaris-Android-R4/grounding/F6929.txt`](../../Solaris-Android-R4/grounding/F6929.txt)
is a retained Hermes disassembly of the vault-UI bridge handler. Its
interpretation here is read-only and **unverified**.

| Offset | Observation |
|---|---|
| 1743–1772 | Before dispatch, an environment flag `.current` is tested and `VAULT_LOCKED` is thrown if it is falsy. Which flag this is was not determined. |
| 1782–1992 | Method dispatch includes `view`, `provisionChoice`, `openSetup`, `lock` and `change`. |
| 2533–2551 | `change` calls a service `change(params)`. **This function contains no lock test for it.** |
| 2736–2832 | `openSetup` has two branches. If `store.unlocked && state && state.migration.committed`, it calls an environment function with `true` and returns `{opened:true}`. Otherwise it **awaits** another environment function first and then returns `{opened:true}`. The reply may mean "setup opened" rather than "setup finished", so the candidate claims nothing when `openSetup` resolves. |
| 3657–3693 | The `view` result is built with `hasVault` taken from an environment `.current` ref. This is consistent with the comment at 783. |

## 8. Styling and motion anchors

| Line | Literal code (abridged) | Meaning |
|---|---|---|
| 688–690 | `@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: .01ms !important; … } }` | Global reduced-motion rule. |
| 694 | `…@media(prefers-reduced-motion:reduce){.daily *{animation:none!important;transition:none!important;scroll-behavior:auto!important}…}` | Scoped reduced-motion rule. |
| 709 | `:root{--canvas:#061017;--surface:#0f2430;--surface-2:#19313b;--ink:#f1f5ed;--muted:#afc2bc;--mint:#6dffba;--mint-deep:#6dffba;--on-mint:#102119;--gold:#d7ac76;--copper:#d7ac76;--line:rgba(241,245,237,.18);…}` | **The effective V6 tokens.** They override the earlier `:root` at 692. |
| 710 | `.daily h1{font-size:34px;…}….daily button{min-height:48px;…}` | 48 px controls. |
| 713 | `…@media(prefers-reduced-motion:reduce){….daily *{transition:none!important;animation:none!important}}` | Reduced motion again, after the V6 overrides. |
| 716 | `.daily .sanctuary-forest{position:absolute;inset:0;…object-fit:cover;…}` | The forest is positioned `absolute` within the root. The candidate does the same. |

## 9. Where current behaviour differs from the contract

| # | Host today | Contract | Candidate |
|---|---|---|---|
| D1 | Unknown `hasVault` (765) or a swallowed `view` error (1401) shows the returning "Unlock my Vault" screen (1012). | Neutral "Opening Solaris…" with retry; missing is not false. | `opening` with retry (`route.mjs`). |
| D2 | Welcome and locked copy is hardcoded English (1011, 1012) with no language switch. | EN/ES everywhere, including accessible names and errors. | Full EN/ES, a switch on every screen, memory-only while locked. |
| D3 | "382 MB" is hardcoded (1011, 1227; dead copy at 1027). | Real sizes from runtime, never hardcoded. | No size anywhere; tests reject any `\d+ MB`. |
| D4 | `welcomeAI` (1372) = provisioning choice **then onboarding completion**. | Chapter-2 setup must not complete the tour. | Chapter 2 uses `openDiagnostics` (1376) only and never `change('onboarding')`. |
| D5 | `firstAI` (1375) enables provisioning **before** setup. | Get started must not auto-enable or download. | Get started = `openSetup` alone (1376). |
| D6 | Errors on welcome, locked and onboarding render nowhere (§6). | Visible failure and retry. | A localized `role="alert"` notice with retry. |
| D7 | A lock push drops `experience` (784/792), so the locked screen falls back to English. | Localized locked screens. | The last stored locale is kept for presentation (memory only). |
| D8 | `migration` absent while unlocked throws `TypeError` (1013). | The mandatory gate is preserved. | Anything but `committed===true` routes to the migration screen. |
| D9 | `change('onboarding')` has no timeout (778); only a 12 s notice (949). | Test timeout and retry. | A 20 s "not confirmed" notice with retry. A timed-out retry reuses the `operationId` (the 1256–1283 precedent). |

## 10. What remains unknown

- Whether native delivers `hasVault` in the `view` reply while locked (§7 3657
  suggests yes), or only through `__solarisVaultState`. Also which flag gates
  §7 1743.
- Whether `change(...)` is accepted natively while locked (§5).
- What the native setup screen offers: create, restore, recovery file. The
  existing host labels `openSetup` as "Restore my vault", "Unlock my Vault",
  "Continue Vault setup" and "Recovery & backup" (1011, 1012, 1013, 1355). No
  dedicated restore method exists in the UI.
- When `openSetup` resolves: when setup opens or when it closes (§7 2736).
- What `SolarisNativeAI.openDiagnostics` shows, whether it offers download
  controls, and whether returning from it preserves the WebView's in-memory
  `step`.
- Whether native deduplicates a repeated `change('onboarding')` by
  `operationId`. The UI precedent (1256–1283) assumes an exact retry is safe;
  native idempotence was not verified.
- Device authentication, biometric prompts and cancellation behaviour.
  "Unlock with your fingerprint or phone screen lock" (1012) is host copy, not
  verified behaviour.
