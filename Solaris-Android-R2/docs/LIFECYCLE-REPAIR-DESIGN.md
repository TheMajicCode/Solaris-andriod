# Host lifecycle repair: evidence-bound design, not implemented

This is a finite repair plan for the actual code-601 host. It does not authorize a worker auto-resume, claim the reconstruction is complete, or approve an APK. The baseline in `src/host-baseline/` intentionally preserves existing behavior so it can be compared with the original bytecode. The real-Hermes comparison and race reports produced in this cycle are the execution evidence; this document's unexecuted sequences are explicitly design cases.

Current execution evidence: `evidence/hermes-differential-result.json` reports **24/24 source-versus-original-bytecode comparisons passing**, plus **4/4 original-bytecode-only completion probes**. The latter include two negative controls and two confirmed synthetic interleavings: private completion is invoked after its predicate was revoked during stream staging; public smoke completion is invoked after host active became false during stream staging. These are executed coordinator ordering findings, not a diagnosis of the owner's phone or proof that native inference processed a private prompt. The completion adapter throws at dispatch entry and never runs a model.

## What has to change

Reconcile the SDK lifecycle at the existing host ownership boundary before admitting heartbeat, load or completion. The host must still be active, the operation current and uncancelled, the same runtime owned, and the applicable existing private-authority predicate valid at the actual dispatch. A returned SDK state string is an observation, not authorization. Background must invalidate admission immediately and reconcile an already-started resume back to suspended after it actually settles when background remains the latest intent.

The old two-step proposal, resume then heartbeat inside `step`, was rejected for a concrete reason: background can arrive during resume while workerReady is false, causing the existing lifecycle callback to skip suspend; resume then leaves SDK resources active although the host has cancelled the operation. Suppressing heartbeat or the result does not compensate that transition. The prior review is `reference/601-recovery/v6-build-readiness/review/WORKER-PATCH-FEASIBILITY.md` in the reconstruction checkpoint.

The separate A1 helper was approved as a source-independent candidate after its delayed-timer defect was repaired. That approval did not establish host integration. Its useful parts are strict public API interpretation, authority/deadline checks around awaits, one dispatch, and retention of a pending lease after caller abandonment. Copying the helper around an entire operation without integrating the existing lifecycle queue would repeat the earlier gap.

## Newly mapped direct-dispatch owners

The minimal scope is larger than `ensureWorker` and `step`. Both completion paths start the stream directly **before** calling step. Therefore a fence added only inside step cannot prevent those earlier native dispatches.

| Method / actual body | Before dispatch | Actual direct dispatch | Later checks |
|---|---|---|---|
| completePrivate; #7334 → #7337 (`0x01c3194e`) | Predicate at local offset `0x49`; modelId and workerReady; runtime.peek; await provisioner.stage('stream') at `0x12a` / resume `0x133` | runtime.completion at `0x18f`; no intervening predicate or check after stage | step at `0x22c`; predicate again at `0x241`; stream loop #7343 uses check and predicate |
| completePublic; #7311 → helper #7312 → body #7314 (`0x01c30efb`) | modelId and workerReady; selected public prompt; runtime.peek; await stage('stream') at `0x151` / resume `0x15a` | runtime.completion at `0x1cb`; no check after stage | step at `0x268`; check lookup later at `0x2cc` |

Private signature is `completePrivate(prompt, predicate, conversationMode)`. False conversation mode limits input to 700 UTF-8 bytes; true uses policy.CONVERSATION_LIMITS.promptBytes. `completeLocalTask(prompt,predicate)` passes false; `completeConversationTask(prompt,predicate)` passes true. It uses run('completeLocalTask', action) for both. The observed producer is outer body #14894 at `0x01d38af3`: local call `0x29d` supplies predicate #14902; conversation call `0x410` supplies predicate #14901. Both short-circuit over captured epoch equality with owner.epoch, current state.authorityEpoch equality with captured authorityEpoch, localAllowed(current state, current ISO time), then store.unlocked. The conversation predicate additionally invokes currentSources (#14897). Exact excerpts are retained in `evidence/writer-baseline/`. Full invalidation and commit semantics remain to be mapped; the predicate must not be replaced by a constant or reduced to check(op).

Public signature is `completePublic(promptKey, suppliedContext)`. A promptKey of `smoke` selects run('runSmoke', action, context) and the built-in hello prompt. Other keys must be own properties of module602.PROMPTS and select run('completePublic', ...). These dispatch owners must be reconstructed or independently exercised as original bytecode before patch integration.

## Required invariants

1. **One transition owner.** Existing lifecycle transitions and new state/resume/state preflight share the service's lifecycleWork ordering. No worker hook, independent client or separate auto-resume loop becomes a second owner.
2. **Immediate invalidation.** lifecycle(false) updates desired active synchronously, as it does now. Cancellation/authority revocation cannot wait behind a pending native transition before becoming visible to dispatch guards. Foreground restoration never uncancels an old operation.
3. **One native dispatch.** A model load or completion is called at most once for one admitted action. SDK gate rejection, state mismatch, transition rejection and timeout do not cause automatic replay. Existing explicit retry paths remain separately owned.
4. **Underlying settlement owns the lease.** A caller timeout ends its wait, not the runtime transition. Retain the actual state/resume/suspend promise and runtime identity until settlement. Do not turn a bounded wrapper rejection into proof that a queue slot is quiescent.
5. **Readiness remains truthful.** A configured client is not a completed heartbeat and not a loaded model. Do not set workerReady early merely to bypass the old startup suspend guard. Active SDK state does not prove inference readiness.
6. **Latest desired state wins.** After an owned resume actually settles, if the host is still inactive, the same transition owner requests and verifies suspend before the transition obligation is considered reconciled. A late result never makes the abandoned operation successful. If foreground has returned, old operation cancellation remains in force; a future explicitly admitted operation may reuse the same valid model.
7. **Bounded work without fake quiescence.** Existing caller budgets remain bounded; a queued or native promise that outlives them leaves truthful blocked/pending status. No unbounded retry/reconcile loop. Monotonic elapsed checks are required for any new admission deadline; delayed timer delivery is a covered case.
8. **Persistence boundaries are unchanged.** Record IDs, package, signer, vault/recovery formats, valid model bytes and model paths are untouched. Existing failure unloads retain `clearStorage:false`. No lifecycle failure justifies model deletion, re-download, re-keying, database reset or clearing the recovery blocker.

## Finite patch map

The following is the proposed implementation surface, conditional on the unresolved mappings below. It is a plan, not code already inserted into the APK.

| Existing owner | Planned narrow delta | Required proof before integration |
|---|---|---|
| step #7188 and its deferred callback | Recheck cancellation/foreground immediately inside the actual deferred callback, not just before Promise.then is scheduled; retain the original callback receiver and fulfillment argument. Keep pending and separatePending tracking, time bound, trace order and failure settlement. | Actual-bytecode witness of the gap; repaired callback suppresses dispatch under cancellation/background between scheduling and invocation; no changed return or exception path when valid. |
| ensureWorker #7194 | New startup path: after runtime.get resolves, obtain an owned active-state preflight before heartbeat. Cached path: do not return merely because workerReady was true; reconcile and revalidate the same runtime before releasing it. Revalidate after stage awaits and before the final workerReady update. | Runtime.get/peek identity and RPC-ready boundary; cached/startup witnesses; no false-ready state, changed model identity or duplicate heartbeat/load. |
| lifecycle #7371/#7373 | Use the same queue for SDK transitions and admission preflight. Preserve immediate active update and cancellation capture. Add an explicit, verified transition-capable client obligation during startup, distinct from workerReady, so compensation cannot be skipped just because heartbeat is incomplete. | No blanket removal of workerReady/blocked guards; retained exact runtime identity; pending resume plus background completes a compensating suspend or remains truthfully unresolved. |
| New private host preflight primitive | Under the lifecycle owner: validate operation/runtime/current authority; query public state(); if known non-active and still eligible, await resume once; query state again; require active. Revalidate at every boundary and immediately before dispatch/release. Carry the actual transition promise separately from caller waiting. | SDK state returns enum string; resume returns void; exact recovered SDK fixtures; shared queue and no stale generation or blocked worker admission. |
| Public/private completion bodies #7314/#7337 | Put admission and the final synchronous authority guard immediately before their direct completion invocation, after any stage awaits. Preserve request options, stream/final ownership, cancel action, stream checks, first-token deadline and existing output/receipt behavior. Private preflight receives the existing captured predicate, not a fabricated replacement. | Full body reconstruction or original-bytecode test fixture; actual dispatch count zero after revocation; normal one-dispatch completion remains intact; no release or record commit after late invalidation. |
| Load/catalog/other SDK dispatch owners | Inventory and map all direct SDK calls in #7198–#7367, including loadModelOperation #7278, then route only actual admission sites through the same primitive. Do not assume sdk=true on step identifies every native dispatch. | Complete call-site inventory with function/offset and receiver; no uncovered direct dispatch, double wrapping, altered download flow or blocked-import regression. |
| run #7184 and settlement #7172/#7178 | Keep current operation and stable-lifecycle wait semantics. Extend bookkeeping only where needed to preserve an unsettled transition obligation after a caller timeout. Keep current failure sanitization/model cleanup; do not clear blocked merely because state later reads active. | No queue self-wait/deadlock; no finally that frees native ownership early; lifecycle cancellation remains prompt during long inference. |

The new bookkeeping is transient host coordination state only. It must be attributable to one service and captured runtime. The exact storage form (service-private closure or newly mapped instance field) is an implementation detail to choose after the host integration route is proven; it must not be persisted into records, recovery files or the vault. No existing persisted epoch is repurposed.

## Queue discipline and compensation

Preflight must finish or retain its transition obligation in the existing queue; it must not enqueue itself and then await a lifecycleWork value that includes its own task. The existing outer run loop may await newer lifecycleWork references before action, but a callback already holding transition ownership cannot use that same changed-reference loop on itself.

Do not hold long model inference at the head of the transition queue. Background must be able to mark the operation cancelled and request SDK cancellation while inference is pending. Queue serialization covers lifecycle/preflight transitions and the admission boundary. Native operation settlement remains tracked separately through the existing operation pending/cancel machinery.

For resume followed by background: the desired host state changes immediately. Suppress heartbeat/load/completion once authority is invalid. Wait for the original resume to settle before attempting opposite transition; do not create a second runtime. If it settles and host remains inactive, request suspend via the same owner, inspect the settled SDK state, and retain restart blocking if the transition cannot be confirmed. The SDK can reject an opposite transition while awaiting a failed transition, so an error is not proof that the requested compensation ran. Automatic repeated resume or suspend retries are outside this patch.

If the original transition never settles, caller failure is bounded but quiescence remains unknown. Preserve the obligation and blocker; no new inference or worker replacement is admitted. A later resolution may perform owner-bound inactive compensation, but may not release the abandoned model result or clear unrelated recovery blockers. Compensation can be authorized by current inactive intent even after the original active operation is cancelled; that does not authorize new active computation.

At an admission boundary, there must be no await between the final current-authority check and calling the native method. Native transport may still deliver an already-dispatched request after background. This host patch cannot retroactively retract that request or claim cross-process atomicity; preserve SDK admission, cancellation and stale-result suppression. If stronger worker-side host-epoch enforcement becomes necessary, it requires an explicit protocol change and is outside this finite repair.

## Targeted acceptance matrix

Tests should first establish original-bytecode witnesses, then compare the repaired actual host candidate with the reviewed repair source. Test adapters must be disclosed; they are not native-device evidence.

| Case | Required repaired outcome |
|---|---|
| Startup client exists, SDK suspended, heartbeat not yet attempted | State/resume/state under queue; one heartbeat only if still current/active; no model reset |
| Cached workerReady true but SDK suspended | Cached branch reconciles before returning/admitting work |
| Cancellation or background after step scheduling but before deferred callback | Zero dispatched action calls |
| Private predicate revokes while stage('stream') is pending | Zero direct completion calls, even though step has not begun |
| Public smoke backgrounds while stage('stream') is pending | Zero direct completion calls |
| Background during pending startup resume | No heartbeat/load/completion; settled resume followed by verified inactive compensation; no false workerReady |
| Background then foreground while old resume/operation is pending | Old operation remains cancelled; latest desired state reconciled; no replay or duplicate model request |
| Resume fails, times out, or settles after caller abandonment | No model dispatch; actual promise ownership retained until settled; no implicit new worker |
| State returns an unknown value or RPC-shaped object | Fail closed; no dispatch; no assumption that resume's void result proves active |
| Caller timer delivery delayed past budget | Monotonic boundary check refuses expired dispatch/result release |
| Newer lifecycle work appended during run wait | No skipped queue entry; no self-await deadlock |
| Repeated taps and runtime-object replacement | No second owner/dispatch for uncertain work; stale runtime result rejected |
| Long inference followed by background | Cancellation/inactive reconciliation not blocked behind entire inference; no unauthorized release/commit |
| Valid model followed by lifecycle failure | Existing bytes/IDs/path retained; clearStorage never true; no download added |
| Existing import while runtime blocked | Preserve current guard import override where allowed; do not accidentally classify file import as active SDK work |

## Minimal actual-bytecode probe fixtures

These probes isolate entry into completion without pretending to run a model stream. They have now executed the original class methods in Hermes with the actual run wrapper and explicit synthetic dependencies. The original-bytecode-only records in `evidence/hermes-differential-result.json` are `private-initially-denied`, `private-revoked-during-stage`, `public-not-ready`, and `public-background-during-stage`; all four matched the expected observations.

Private probe: set `modelId` to a synthetic nonempty ID, `workerReady=true`, `active=true`, `blocked=false`; runtime.peek returns a synthetic client. Call `completePrivate('{}', predicate, false)`. The predicate initially returns true. In provisioner.stage('stream'), change the predicate's source variable to false before resolving. The client's completion records its invocation and current predicate value, then throws an explicit synthetic RuntimeError. No events/final/cancel mock is required because the throw stops execution at that call. The original flow permits entry into completion after revocation; a control with an initially false predicate must make no completion call. This proves host dispatch ordering under a controlled predicate, not an observed phone leak or native computation.

Public probe: use the same service readiness setup and call `completePublic('smoke')`. In stage('stream'), set service.active=false before resolving. The synthetic completion records active and throws the probe RuntimeError. This avoids the PROMPTS dependency and records whether the actual bytecode invokes completion after foreground loss. A control with missing modelId or workerReady must reject QVAC_NOT_READY before dispatch.

## Unresolved gates, stated precisely

- The immediate private predicate producers #14901/#14902 are now mapped to owner epoch, authorityEpoch, localAllowed, store.unlocked, and conversation currentSources. The complete producer/invalidation chain, localAllowed implementation, source freshness, captured session use and final save transaction still require reconstruction and tests. `check(op)` alone proves only cancelled/active checks. Preserve the actual predicates; no new constant-true predicate is acceptable.
- Runtime object identity is available, but a verified worker-generation authority source and the ability to detect replacement behind the same wrapper are not yet established. Object reference equality is not claimed to cover hidden native worker replacement.
- The runtime.get resolution point, lifetime of peek, native service/transport start-stop boundaries, and separate Android/Bare lifecycle callbacks must be mapped before declaring startup transition eligibility. Do not infer that a returned JavaScript client means heartbeat succeeded.
- All direct SDK call sites and private/public completion owners need exact integration evidence. The present baseline module intentionally omits 25 prototype methods; it cannot replace the complete original service.
- The existing bounded implementation and Android monotonic clock must be verified before choosing admission-deadline wiring. A source-independent helper test does not establish clock behavior through actual phone suspend.
- Outer result/save/receipt/UI authority gates are not reconstructed here. Preserve existing originals and prove the repaired dispatch path reaches them unchanged; do not claim return-time checks authorize storage.
- No safe HBC relocation/injection procedure, complete native source rebuild or final candidate compatibility is established by this design. Signing is conditional on separately verified integration, bytecode structure, unchanged unrelated entries and independent review of exact candidate digests.

The two direct-dispatch gaps now have actual-bytecode witnesses. The next implementation cycle should expand executable reconstruction to those completion bodies and their authority producers, complete the SDK call-site inventory, and prove the integration route. It can then author a reviewable patch against the actual coordinator with a precise function/offset map. Until those gates pass, this document is a concrete reconstruction and repair scope rather than a claim that the next signed APK is ready.
