# Independent review: DailyService diagnostics and recent context

Reviewer: `/root/trace_chat_validation`, independent test author; did not implement the application changes.

Decision: APPROVE the reviewed DailyService diagnostic boundary and bounded recent-context integration in final candidate-06. This is a scoped behavioral review, not authority to install, reset, deploy or bypass the separate native, packaging and signing gates.

Reviewed final integrated Hermes bundle SHA-256: `b8ac7d1b58d9e8ea6eadd25de516e35842aea14e4b849462664bb3200fedc990` (30,754,484 bytes).

## Evidence and findings

- Independently authored 94-case actual-Hermes suite passes on baseline 602, diagnostics-only bytecode, interim candidates and final candidate-06 with the appropriate expected feature modes. `daily-tests-candidate-06/result.json` and its adjacent provenance record bind the final executed bundle and test inputs.
- The final candidate has a conversation-only explicit SDK `stopReason === 'length'` rejection below DailyService, after the existing post-await eligibility check. It uses the original policy module's `RuntimeError` constructor with `OUTPUT_LIMIT`, preserving the code through runtime error normalization; the earlier plain-Error construction was superseded. The compared function body hashes for 14886 and 14894 and both helper donor hashes remain unchanged from candidate-04; function 7337 and the UI changed. Inspected the typed guard in `tools/build-chat-bundle.py` and reran the full 94-case suite against candidate-06. Native/final-event execution of that lower guard and final UI mapping remain under the separate runtime/UI reviewers rather than this synthetic QVAC boundary.
- The original compiler, parser, selected-source construction, consent checks, full state schema, operation deduplication, ID allocation, queue and persistence guards execute in the harness. Native storage/MAC and model output are explicit synthetic boundaries; the final presentation projection is simplified.
- The diagnostic patch retains exact codes from a finite allowlist at the original catch boundary. Raw detail and non-Error private text remain generic. Original cancellation/authority precedence and rejected-result non-persistence pass.
- The helper executes only after the original compiler succeeds. Its cursor stores scope and baseline tail ID, not a duplicate of message text. Its scope includes unlock session, subject, authority epoch and permission revision. No saved record/state object is modified by the helper.
- Repeated bridge preflights do not advance the fixed baseline cursor, and the subsequent actual `converse` receives the last newly completed pair. Old completed pairs present before scope establishment remain excluded. Only the latest eligible user/assistant pair is added; role, generated mode, source-free provenance and current authority/permission checks are required.
- Both prior source-bearing answers and requests selecting current sources exclude recent text. Changes to session, authority and permission revision reset the baseline. The encoded pair limit of 300 bytes and combined prompt limit of 1200 bytes drop the whole pair rather than truncate it. Actual integrated executions verify these branches.
- Original number grounding intentionally remains unchanged: a number occurring only in prior conversation does not become an approved current fact. The suite demonstrates that a numerical follow-up can still reject rather than silently broadening the grounding policy. This limitation should remain visible in product/build reporting.
- Inspected the real bridge function 6929: `assertConversationAccess` precedes optional `prepareForUse` and `converse`; no user-message persistence is inserted between those calls. The harness's repeated preflight tests therefore exercise the relevant compiler sequence.

No release-blocking finding remains within this reviewed scope.

## Boundaries of approval

This suite does not execute native QVAC, prove actual model quality or generation speed, verify streamed native final-event handling, inspect an installed phone vault, or certify APK packaging/signing. The request-format helper and native runtime integration require their separate evidence. None of these tests is represented as a successful on-phone greeting.

Review depends on the exact integrated bundle hash above. Any subsequent HBC change requires rerunning the same suite and reviewing the changed behavior before reusing this approval.
