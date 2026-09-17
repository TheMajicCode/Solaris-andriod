# Independent bridge execution review — build 604

Decision: APPROVE the guided bridge preparation bypass for the exact candidate below, within the bounded synthetic dependency scope.

- Candidate HBC SHA256: `30be9989cc00299836715cc3de5cf3a2a75b00019bdf2f1b91629205f558d8b3`.
- Actual bridge F6929 body SHA256: `92212b842e6e0f539a74643644f392efcca663840051d6f1f13bd7e363427099`.
- Result: 13 of 13 cases pass in the matching, binary-pinned Hermes runtime.
- Evidence: `BRIDGE-RESULT.json`, `BRIDGE-PROVENANCE.json`, `bridge-fixture.json`.

`make-bridge-fixture.py` constructs a TEST-ONLY copy. It replaces bootstrap functions F0, F1 and F2 to supply the module/app lexical environments from synthetic JavaScript arrays. F6928 (generator factory) and F6929 (actual bridge generator), their headers, bodies and exception tables remain the candidate's exact bytes. These test bootstrap changes are not present in the release bundle and must never be shipped.

The real candidate bridge generator is invoked and resumed across awaits. Its dependencies are explicit spies: origin/parser, preflight result, model snapshot/preparation, DailyService.converse, input eligibility and WebView reply injection. This independently verifies bridge orchestration; actual DailyService source selection, native-generation bypass and persistence are verified in the separate DailyService review. There is no React mount, native model operation, Android WebView execution or phone timing measurement in this fixture.

Results:

1. Guided preflight: one preflight, zero model snapshots, zero prepareForUse calls, one converse call. Original message/source IDs/useAI/operation ID arrive unchanged. Input eligibility is still checked before converse.
2. Unloaded open chat: one snapshot and one prepareForUse call before converse.
3. Loaded open chat: one snapshot, zero preparation calls, normal converse.
4. Local AI disabled: retains the original no-load path and forwards useAI=false.
5. Rejected preflight: permission error returned; no preparation or converse.
6. Guided request with lost input eligibility: cancelled; no converse.
7. Guided request with superseded request token: cancelled; no converse.
8. Concurrent voice recording: VOICE_BUSY before preflight or preparation.
9. Rejected origin: no conversation preflight, preparation, converse or reply.
10. Closed vault input gate: VAULT_LOCKED before preflight.
11. Failed model preparation: typed load error returned; converse not called.
12. Lost eligibility during model preparation: VAULT_LOCKED; converse not called.
13. Changed bridge epoch during converse: successful late reply suppressed.

An initial TEST-ONLY wrapper attempt failed before invoking the bridge while publishing the synthetic generator through a cached PutById instruction. The final wrapper uses PutByVal and completes normally. This was a harness defect, not a release-bundle failure. Both the failure limitation and final source hashes are recorded in the provenance file. No production changes were made to obtain the pass.

This evidence supports the claim that common guided requests skip the model's preparation stage in this bridge. Combined with the independently executed DailyService tests showing zero completion calls, it establishes avoided model work for the supported guided routes. It does not establish a specific number of seconds saved on the user's phone, general open-chat speed, or uninterrupted background generation.
