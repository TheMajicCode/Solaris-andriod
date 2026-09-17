# R2 independent review — reconstructed host baseline

Date: 2026-09-15. Review scope: read-only instruction-to-source comparison of `src/host-baseline/qvac-service-baseline.mjs` against original function HASM in `reference/functions` and `evidence/writer-baseline`. The writer is a separate agent. A further read-only reviewer independently examined run/step/cancellation while this reviewer examined initialization, view methods, guards, worker startup and lifecycle. No source code, reference bytecode, APK or test was changed by this review.

## Decision

**PASS for the bounded static reconstruction review: no material register, branch, receiver or logical-await mismatch was identified in the implemented subset.** This is approval to retain the source as an executable baseline reference and compare it against original bytecode. It is not approval to substitute it for the full service, integrate a repair, sign an APK or claim complete behavioral equivalence.

Reviewed source SHA-256: `8962620f87095abcc7b48c9b672e0a47797ed286292f7d19634e61bf60130e30`.

The mapped constructor and 14 prototype methods are only a subset of the original service. Twenty-five prototype methods and the real adapters/bootstrap remain outside this source. Known baseline omissions/races were intentionally preserved; their presence is not an implementation mismatch in this review.

## Reference integrity

All 33 inspected wrapper/body/callback excerpts were compared byte for byte between writer evidence and the separate reference directory; all match. Function IDs:

`7146, 7147, 7148, 7149, 7150, 7151, 7152, 7167, 7168, 7170, 7172, 7174, 7176, 7178, 7179, 7180, 7182, 7184, 7186, 7188, 7189, 7190, 7192, 7194, 7195, 7196, 7292, 7294, 7369, 7371, 7372, 7373, 7374`.

For a compact binding, SHA-256 of the ordered reference list serialized as compact sorted-key JSON (`[{"function":ID,"sha256":"file-digest"},...]`) is `c632ab43ac822fdb47cc83418e1a0a3b6ebbf9b6401ab0650a90b7e73bd1d694`. These are text evidence excerpts from the retained code601-equivalent host bytecode, not newly compiled or patched instructions.

## Direct comparison results

| Surface | Evidence and preserved details |
|---|---|
| Constructor | #7146: argument default order, fresh budget copy, provisioner callback, all 41 instance-field assignments in order, two fresh resolved promises, filenames and undefined-receiver policy/runtime calls agree. #7147 retains instance receiver when calling changed. |
| Context and snapshots | #7148 returns non-nullish supplied context by identity or creates id/epoch/method. #7149 preserves key order, shallow copies, truthy busy/loaded logic and strict `verified === true`. #7150 preserves optional-current access and loadModel/cancelled condition. |
| Callbacks/progress | #7151 uses the instance as onChange receiver and nullish optional-call behavior. #7152 preserves default false force, Date.now call, 150ms gate, lastProgressAt assignment before callback, exactBytes source, onProgress receiver and final changed call. |
| Guards | #7167 checks inactive before busy before blocked; allowBlocked is the existing default-false argument. #7168 checks only operation.cancelled or inactive, with phase at the error call. No new generation/ownership/worker check was inserted. |
| Cancellation | #7172/#7174 preserve cached cancelPromise reuse, immediate cancelled/requested state and trace/change, no-action cooperative/unconfirmed branch without storing a promise, deferred `.then(cancelAction)`, bounded await, acknowledgement, catch and finally order. |
| Failure settlement | #7178 cancels first, bounds no-op resolution/rejection settlement, blocks and clears readiness on uncertain cleanup, then assigns settled only when not blocked and pendingSettled. |
| Run | #7184 setup remains outside exception regions. The lifecycle queue is reread until the awaited promise identity is current (`+0x91–0xb0`). Action receiver is undefined (`+0xd7`). Error normalization precedes awaited settlement (`+0x154–0x1d5`). Cleanup preserves `clearStorage:false` (`+0x273`) and baseline worker/model/status/inference/finalization branches. |
| Step | #7188 defers action via Promise.resolve().then(action) (`+0xab–0xb7`); uses nullish separatePending selection (`+0xbc–0xc5`); callback #7189/#7190 only sets pendingSettled. Reply trace, check, operation-settled trace, cancellation-field clearing and returned result match (`+0x14b–0x1b8`). |
| Worker startup | #7194 preserves strict physical-device gate, cached peek path, recoveryInfo update and recovery block check outside bootstrap catch, STARTING/change outside catch, bootstrap/runtime-config/heartbeat/idle awaits, ready/responsive assignment and original error rethrow. #7195/#7196 preserve runtime receivers. No extra check after idle staging was inserted. |
| Cancel request | #7294 matches current optional-access and strict id equality. Its existing undefined-id/null-current edge case remains present. |
| Lifecycle | #7371 synchronously stores active, captures the operation only for inactive/current/not-picking, chains on existing lifecycleWork, stores caught work as queue but awaits the original work. #7373 cancels the captured operation before reading runtime; skips absent/not-ready/blocked runtime; uses the latest active value; invokes resume/suspend with runtime receiver; catches only transition-region failures, blocks/clears readiness, then calls changed. Errors outside that region retain caller rejection behavior. |

The subsidiary reviewer independently found no mismatch in run, step, cancelOperation or settleAfterFailure and confirmed all 18 assigned wrapper/body/callback excerpt pairs matched. No code execution was performed as part of either static review.

## Explicit equivalence limits

1. The original async methods use Babel generator wrappers. The source expresses their logical await/try/catch/finally structure with native async functions. Matching instruction branches does **not** independently prove identical microtask, thenable-adoption or wrapper scheduling behavior. The actual Hermes-bytecode differential oracle should test interleavings and observable call/field/result order. This is a remaining verification boundary, not a discovered source mismatch.
2. Helper function identity, wrapper length/name/descriptors, compiled offsets and Babel implementation internals are intentionally not reproduced. The mapping document discloses that boundary. No reflection-equivalence claim is approved.
3. Injected adapters preserve evidenced module/member shapes. Mock adapters are explicit test fixtures; their success does not establish native transport, provisioner, QVAC SDK, Android lifecycle or vault authority behavior.
4. This baseline intentionally retains observed races: startup can finish without SDK lifecycle reconciliation; check omits current-operation ownership; deferred step dispatch does not recheck before its callback; lifecycle cancellation does not await complete pending settlement. These are separate repair targets and must not be silently corrected while claiming baseline equivalence.
5. Full application functionality is not preserved by substituting this partial class for the original service. The missing methods, surrounding AppState/session/consent ownership and native wiring remain required before any such integration.

## Status of tests and signing

This report records a static independent source review. Root's original-bytecode differential tests are a separate gate and their result is not presumed here. No test pass count, repair success, Android readiness or signing permission is inferred from this review. A subsequent source edit requires a new hash-bound review.
