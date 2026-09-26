# Solaris 603 native chat probe

## Conclusion

The same pinned Qwen3 0.6B Q4_0 model can complete greetings with the published QVAC addon release used by APK602. A source-specific defect is reproduced: the original daily-chat request asks for an application-specific object while constraining generation only to generic JSON. The model can return valid JSON that lacks `message` or `sourceRefs`, and the application correctly refuses that object. The broad UI error conflates this with other failures.

This probe does **not** reproduce or diagnose the phone's approximately 120-second wait. Linux inference completes. Android worker startup, transport, interruption and latency remain separate validation requirements.

## Inputs and provenance

- Model: `Qwen3-0.6B-Q4_0.gguf`, revision `50968a4468ef4233ed78cd7c3de230dd1d61a56b`,382156480 bytes, SHA256 `33bcc57074ec7b6eada5a90651ee546ec0c2b271002c22baf9f1b2dd1e8f75cb`. Exact match to retained APK model manifest.
- Recovered SDK JavaScript: `@qvac/sdk` 0.18.2, copied from the602 reconstruction archive.
- Addon: published `@qvac/llm-llamacpp` 0.45.0, npm integrity SHA512 verified. Its `index.js`, `addon.js`, `binding.js` and `batchHandler.js` match recovered copies byte-for-byte.
- Linux-only probe runtime: Bare 1.28.0. This is not claimed to be the Android runtime binary.
- Npm Android addon `.bare` and the APK renamed `.so` have different whole-file hashes. Their `.text`, `.rodata` and `.eh_frame` bytes are identical; dynamic/data metadata differ. See `android-addon-comparison.json`. This evidence supports the published addon release relationship; it does not make the Linux binary identical to Android.
- Native source downloaded at npm gitHead `6620d695d3a07cafe3931182e7844dde376a23f8`; source shows `enable_thinking = reasoning_budget != 0` and user-final conversations receive an assistant generation prompt.
- All inference prompts are synthetic. No user records, keys or phone data were used.

`PROBE-INPUTS-MANIFEST.json` records local file hashes, including the model, Linux runtime/addon, CPU backends and package archives.

## Executed findings

1. Original public greeting: `Hello! 😊`, native EOS.
2. Exact original daily `Hello` prompt with generic-object grammar: one run returned `{"user":"Hello","facts":[],"allowed":[]}`. Further runs returned malformed application keys while still satisfying generic JSON syntax. These are unusable application responses.
3. Same guarded prompt with exact `message`/`sourceRefs` schema: greetings and simple supplied facts serialize correctly. This improves structural reliability; it does not establish factual truth.
4. Simplified zero-source system prompt plus actual user role and exact schema: completed greetings, current-message name extraction and limited prior-message recall in the final four tests.
5. The final `Hola` test answered in English. Automatic language following is not proven.
6. The final one-pair memory test retained Cedar but said `I told you Cedar`, an incorrect perspective. This is limited recall, not production conversational reasoning.
7. Broader exploratory prompts exposed limitations: capability questions may be echoed; some prompts dropped citations or confused check-in values. Those prompts are retained in evidence and are not recommended globally.
8. Malicious quoted source test can induce fabricated facts even with the old guarded prompt and a valid source ref. Exact JSON schema and valid citation labels do not prove factual grounding or injection resistance. Preserve compiler/validator restrictions; do not claim this issue is solved by this repair.

## Narrow recommendation

For the conversation-only **zero selected facts** path, use the request in `recommended-request-builder.cjs`: a short real system instruction, current user as an actual user message, optional bounded source-free prior pair, exact `message`/empty`sourceRefs` schema, per-request `predict:128`, `temp:0.3`, `reasoning_budget:0`, `seed:42`, `kvCache:false`. `captureThinking:true` separates any unexpected thinking events; the product must not display them.

For a conversation with selected facts, retain the original guarded prompt and its compiler/validator boundaries. Add an exact schema constrained to the current permitted refs and actions, rather than generic`json_object`. Do not relax output validation, infer missing citations, repair partial JSON, accept an aborted partial generation, or call preset support an AI-generated answer.

This source-specific recommendation applies only to the conversation boolean branch of`completePrivate`. Independently inspected wrappers show`completeLocalTask` passes`false`, while`completeConversationTask` passes`true`; other local tasks may have a different output contract.

## SDK completion semantics

The 10 checks in`sdk-source-probe-results.json` execute the recovered SDK JavaScript:

- `responseFormat:{type:'json_object'}` translates only to schema`{type:'object'}`.
- `captureThinking:false` does not disable model reasoning. For generic Qwen `<think>` markers it leaves those markers in content;`true` separates them.
- Baseline model loading already sets`reasoning_budget:0`. Repeating it per request is robustness, not evidence that hidden reasoning caused this failure.
- Ordinary EOS may emit`completionDone` without a`stopReason`. Requiring`stopReason==='eos'` would reject a valid normal completion. Require actual terminal completion/settlement and reject explicit error, cancellation or length stops according to the host contract.

## Final four native requests

Exact fixture/result files are in`fixtures/final-*.json` and`results/final-summary.json`.

| Input | Output message | Native completion | Limitation |
|---|---|---|---|
| Hello | Hello! How can I assist you today? | EOS, valid schema | One bounded local request |
| Hola | Hello! How can I assist you today? | EOS, valid schema | Replied in English |
| My name is Cedar. What is my name? | Your name is Cedar. | EOS, valid schema | Current-message recall only |
| What name did I tell you? (one prior source-free pair) | I told you Cedar | EOS, valid schema | Perspective wording is wrong |

Each final run finished in approximately 1 second of Linux wall time on this shared runtime. These values cannot predict phone latency. Counts are not a model benchmark or an Android acceptance claim.

## Reproduction

1. Restore this directory with its`reference-worker` inputs. Read`PROBE-INPUTS-MANIFEST.json` before using binaries.
2. `node sdk-source-probe.mjs` executes source-level configuration/normalizer checks.
3. `python run-final-fixtures.py` executes the four final same-model Linux requests and writes raw event logs.
4. `runtime/bin/bare native-fixture-runner.cjs /absolute/path/to/fixture.json` executes one synthetic request.

The native runner calls the exact published binding directly and reproduces SDK config conversion. It is not the full SDK RPC transport. A watchdog keeps the native event loop alive and fails requests after 15 seconds. Initial exploratory raw-binding runs without that keepalive could exit before queued terminal callbacks; those early truncated logs are harness artifacts and are not reported as a model failure.

No APK was changed by this probe. Nothing was installed on a device, reset, pushed, signed or deployed.

## Actual integrated helper verification (supersedes illustrative final-four request)

The root's actual `Solaris-Android-R3/src/conversation-request.js` was read and executed through Node VM, then its request was validated by the **exact recovered SDK** `completionClientParamsSchema` and translated by the exact `getResponseFormatJsonSchema` implementation before native inference.

- Helper SHA256: `33f7e34b75c5e0b15bc7af32df1b2084c483792549be2295f73e7b8e32af6042`.
- Five cases passed SDK schema validation and reached native EOS with valid required output shape.
- Hello in English: `Hello! How can I assist you today?`
- Hola with explicit Spanish locale: `Hola! ¿Quieres algo específico?`
- Current-message name: `Cedar`.
- Prior source-free pair: `I told you Cedar` (identity retained, perspective wording remains weak).
- Synthetic check-in: exact four scores preserved, with `sourceRefs:["s1"]`.
- See `actual-helper-validation.json`, `fixtures/actual-*.json`, `results/actual-summary.json`, and `verify-actual-helper.mjs`.

An intermediate root helper incorrectly shaped `responseFormat`; this was caught and corrected before these tests. The verified schema uses the SDK-required nested `json_schema:{name,schema}` object. No APK was built with the rejected intermediate shape by this agent.

Independent `recentContext` helper tests passed ten boundaries: prior-session baseline exclusion; new source-free pair eligibility; repeated preflight stability; selected-source task exclusion; permission revision reset; session change reset; record-bearing pair exclusion; guided/non-generated pair exclusion; oversize exclusion without row mutation; and provenance revision mismatch. See `recent-context-review-results.json`. The root must separately establish that the real owner session changes on lock/unlock; the helper test cannot prove the host lifecycle integration.
