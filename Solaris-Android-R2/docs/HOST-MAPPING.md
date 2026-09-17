# Existing host coordinator: controlled reconstruction map

This checkpoint reconstructs a bounded subset of the **existing code-601 behavior**, before repair. `src/host-baseline/qvac-service-baseline.mjs` is editable, executable JavaScript under injected module adapters. It is not recovered original source, not the complete QvacService, and not an Android build entrypoint. No native implementation or application bootstrap is fabricated.

## Provenance

The source of truth is `Solaris-Android-Reconstruction/reference/host-disassembly/index.android.hasm`, supported by its pseudocode solely for reading convenience. The pseudocode contains synthetic registers, incorrect-looking call syntax and generator artifacts; it is not executable original JavaScript and is not copied as source.

The existing `evidence/600-to-601-host-equivalence.json` records that code-600 and code-601 host instructions are identical outside the UI string slot and integrity footer. Reference HBC SHA-256:

- 600: `cbfb0ec84116b5aa8a6aed22461a98f3753b365d202fa965f0e23c0a064930a5`
- 601: `ac973292961cc7a1505a47a416ecafdff2e1688b7eac31f20571e503d74ec177`

`evidence/writer-baseline/` contains exact HASM excerpts for functions 7140–7380, machine-readable source mapping, file hashes, and an extraction utility. These are evidence excerpts, not patched bytecode. Wrapper functions commonly share the same byte offset because their instructions are deduplicated; function ID and lexical closure identity remain necessary.

## Implemented subset

| Source member | Wrapper / body function IDs | Body offset | Preserved behavior |
|---|---|---|---|
| constructor | 7146; callback 7147 | `0x01c2dc94` | All 41 instance fields, assignment order, defaults, filenames, fresh promises and provisioner callback |
| context | 7148 | `0x01c2df27` | Supplied context by identity, or transient ID / epoch 0 / method |
| snapshot | 7149 | `0x01c2df5b` | Existing UI-facing keys; shallow copies only where observed |
| preparation | 7150 | `0x01c2e0cd` | Calls policy `preparationState` with observed inputs |
| changed | 7151 | `0x01c2e18e` | Optional onChange called with instance receiver |
| publishProgress | 7152 | `0x01c2e1a5` | 150 ms gate; exactBytes from MODEL; then changed |
| guard | 7167 | `0x01c2e89e` | Foreground check before busy before blocked; import override |
| check | 7168 | `0x01c2e961` | Cancellation or inactive only |
| cancelOperation | 7170 / 7172; inner 7174 | `0x01c2e9d7`, `0x01c2eaaf` | Existing cancellation promise reuse; deferred action; catch/finally |
| settleAfterFailure | 7176 / 7178; callbacks 7179–7180 | `0x01c2ebc2` | Cancel first; bounded pending settlement; block on uncertainty |
| run | 7182 / 7184 | `0x01c2ecee` | Stable lifecycle queue wait; error normalization; model-preserving cleanup; final current reset |
| step | 7186 / 7188; callbacks 7189–7190 | `0x01c2f1fb` | Deferred dispatch, optional separate pending, time bound, trace ordering |
| ensureWorker | 7192 / 7194; callbacks 7195–7196 | `0x01c2f403` | Physical-device gate, recovery gate, bootstrap/heartbeat/idle staging |
| cancelRequest | 7292 / 7294 | `0x01c30b8f` | Current ctx.id equality check, including existing undefined-ID edge case |
| lifecycle | 7369 / 7371; inner 7373, catch 7374 | `0x01c3292e`, `0x01c329ca` | Captured operation, queued work, latest active selection, error blocking |

Async wrapper IDs use Babel's generator helper. The reconstruction expresses the observed await and exception structure using native async functions. It does not reproduce Babel helper function identity, wrapper `.length`, property descriptors on helper functions, Hermes registers, compiled instruction offsets, or private implementation names. Those are not claimed as a full binary reproduction.

## Adapter contract and closure resolution

Module registration is function 7139, Metro module **591**. Global function 0 at local offset `0x47bd` registers it with dependency vector:

`[38, 67, 8, 9, 592, 593, 599, 602, 603, 604, 912, 913, 914, 916, 716, 918]`

The factory supplies original module-shaped references, not replacement native behavior. Imported policy functions are invoked with undefined receiver, as in HASM. The adapters are held in a closure; no new instance fields or record identifiers are introduced.

| Factory argument | Module environment slot | Metro module | Members used by this subset |
|---|---:|---:|---|
| filesystem | 7 | 593 | documentDirectory |
| device | 8 | 599 | isDevice |
| modelConfig | 9 | 602 | MODEL.bytes |
| runtimeModule | 10 | 603 | lazyRuntime |
| runtimeFactoryModule | 11 | 604 | createRuntime |
| policy | 12 | 912 | BUDGETS, RuntimeError, bounded, safeError, unknown, known, preparationState |
| traceModule | 13 | 913 | SafeTrace, transientId |
| provisionerModule | 14 | 914 | ModelProvisioner |

Slots 2–6 are helper imports, including generator/class helpers; their generated mechanics are replaced by native JavaScript syntax. Remaining lazy dependencies in the 16-entry vector belong to other QvacService methods. None are assumed absent from the full app.

The evidenced runtime adapter must expose `get()` and `peek()`. Its returned object is invoked via `heartbeat()`, `resume()`, `suspend()` and `unloadModel({modelId, clearStorage:false})` in this subset. The provisioner exposes `state`, `recovery()` and `stage(string)`. Policy, provisioner, runtime and trace internals remain external; a mock policy is acceptable only in explicit tests and is not an Android implementation.

## Ordering and failure details that must not be silently repaired in the baseline

- `run` performs guard/context/current/error/trace/changed setup outside try/finally. A setup callback throw can therefore leave current populated. Inside try it waits until the awaited lifecycleWork is still the latest promise, calls check, checks blocked again, awaits action, and calls check again. Finalization unconditionally sets current to null and calls changed.
- `run` normalizes errors before settlement. If cancelled and the thrown object is not RuntimeError, it creates CANCELLED; otherwise it calls safeError. Settlement failure can replace the original error. Cleanup never sets clearStorage true.
- `step` checks once, updates phase and emits change/dispatch, then schedules action with `Promise.resolve().then(action)`. It does not recheck inside that deferred callback. The tracked pending can differ from the bounded task. Reply trace precedes the second check. Only the successful final path clears cancelAction and cancelPromise.
- `cancelOperation` immediately sets cancelled/requested and emits a trace/change. Without an action it chooses cooperative versus unconfirmed and stores no promise. With an action it caches the inner async promise, records acknowledgement only after bounded success, maps caught errors to unconfirmed and always emits changed in finally.
- `settleAfterFailure` awaits cancellation before testing pending. Pending resolution and rejection are both treated as settlement by its no-op callbacks. A cleanup timeout blocks the runtime; no model ID or file is deleted.
- `ensureWorker` sets recoveryInfo before checking recovery.blocked. A recovery failure is outside its bootstrap catch. STARTING/change are also outside. The cached workerReady path returns runtime.peek after the physical-device gate. No extra cancellation check is present after idle staging and before setting workerReady true.
- `lifecycle` immediately updates active, captures an operation only when called inactive/current/not-picking, then chains on lifecycleWork. The callback reads runtime and latest active when executed. It cancels the captured operation but does not await pending settlement before suspend/resume. Runtime transition failure blocks the runtime and marks restart required. It assigns `work.catch(noop)` as lifecycleWork **but awaits the original work**; errors outside the inner runtime try can therefore reject the caller while leaving the queue usable.

These are preserved baseline observations, not endorsed repaired behavior. There is no generation/epoch validation, operation ownership validation or new resume/suspend fence added in this file.

## Explicitly incomplete

Twenty-five of the 39 prototype methods are not implemented here: getStatus, probeRuntime, getCatalog, space, refreshSetup, acknowledgeWorker, testBareWorker, provisionModel, verifyDownload, stopDownload, importModel, loadModel, retryModel, loadModelOperation, cancelProvision, unloadModel, deleteModel, completePublic, completeLocalTask, completeConversationTask, completePrivate, loadPreparationChoice, choosePreparation, advancePreparation, prepareForUse. Their disassembly remains available. Missing methods are absent rather than represented by success-returning stubs.

This subset alone cannot preserve all existing application functionality if substituted for the complete service. Before any source-built APK, the unreconstructed methods, all referenced adapters, native/runtime bootstrap and database integration must be established. Before any retained-binary host patch, independent bytecode compatibility and targeted behavioral comparisons must establish that the exact edits implement the reviewed repair. No APK is produced, modified, signed or installed by this reconstruction module.

## Verification limits

`node --check` passed and establishes syntax only. Ten writer behavior tests passed using `node --test --test-reporter=tap src/host-baseline/baseline.behavior.test.mjs`; output is `evidence/writer-baseline/writer-behavior-tests.tap`. They exercise deferred dispatch cancellation, distinct pending settlement, cancellation acknowledgement, blocking on uncertain settlement, model-preserving failure cleanup, queued lifecycle state selection, and caller-versus-queue rejection boundaries. Two tests deliberately witness existing race behavior; they are not repair acceptance tests. The tests use controlled adapters and cannot establish native Android compatibility. An independent reference-bytecode harness should compare returned values, rejection codes, trace/call order, field mutations and queue boundaries for the mapped functions. Device-specific runtime behavior and installation compatibility remain separate gates.
