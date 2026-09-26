# Lifecycle adapter integration boundary

This is new source-independent repair code informed by actual V6 evidence. It has not been inserted into the missing Android source, bundled into Hermes, compiled, signed or installed. It does not recreate the original QvacService. The `ui-followup/` candidate separately retains the reviewed UI repairs and corrects two Health Connect explanations.

## What the helper provides

`src/active-qvac.mjs` exports `withActiveQvac`, `admissionStatus` and a bounded error class. It accepts the QVAC public client's verified `state()` and `resume()` methods, a synchronous current-authority predicate, a single dispatch callback, the caller's timeout budget and optional cancellation signal.

State is a **string**, not the RPC object. Resume returns void; after resume the helper re-queries state and requires `active` before dispatch. Only one operation is dispatched. Admission errors are not automatic retry instructions. The SDK's own admission gate remains authoritative if state changes after observation.

There is no downloader, file deletion, worker creator, recovery reset, identity/key access, record persistence, UI render/timer subscription, network service or new dependency in this helper. All of those remain with their original owners.

## Required native integration

Use the actual restored service's lifecycle and operation coordination. Preserve its existing `lifecycleWork` queue, changed-queue-reference loop, worker-generation checks, blocked/restart conditions, private epochs, current capability/consent and foreground gating. The helper's WeakMap excludes overlapping admissions for one client; it is **not** a replacement lifecycle queue, distributed lock, security policy engine or proof that the worker is idle.

The service must serialize its own SDK transitions and admission preflight under the same ownership mechanism, and recheck eligibility immediately before dispatch. Background still invalidates the operation and runs the existing suspend/cancel path. Do not hold an entire long inference ahead of the owner's needed background cancellation. The exact placement must be resolved and tested in the real coordinator source; no fabricated App.tsx patch is included.

The required synchronous `isCurrent()` returns true only while all captured authority remains valid: same worker generation, foreground/eligible app, current unlocked vault session, current consumer/navigation intent, valid local-AI consent/capability and no restart-blocked worker. Never replace it with a permanent `true` predicate in the application. The host tests use explicit synthetic predicates. Recheck again at the existing receipt/record commit and UI release boundary; returning a model response does not itself authorize saving it.

## Timeout and cancellation

The timeout bounds caller waiting when the JavaScript event loop can run; it cannot preempt a blocked JS turn and does not cancel a native call. Monotonic elapsed-budget checks across awaits and immediately before dispatch/release prevent a delayed timer callback from admitting expired work. Supply the existing service's verified monotonic clock if needed; the default is `performance.now()`. There is no wall-clock fallback. A missing, non-finite or backwards clock fails closed. Verify clock behavior through actual Android background/suspend at integration; a clock that excludes suspended time does not replace foreground/session invalidation.

The helper retains an in-flight lease until the underlying state/resume/dispatch promise actually settles; late results are abandoned and no second dispatch is admitted through the same client. `admissionStatus` exposes only pending/stage for the owner to classify. Do not create another wrapper/client around the same worker to circumvent this lease. A new worker requires the existing owner's verified quiescence/teardown/restart policy, unavailable in this recovery checkpoint.

No automatic replay occurs even for `QVAC_LIFECYCLE_OPERATION_BLOCKED`: the error may occur at a boundary where only the original coordinator can establish whether any work started. Explicit retry remains subject to current authority and existing idempotency. No resetLifecycleState call is used. A still-pending operation remains a concrete blocked state rather than a falsely completed background task.

## Errors

The new `SOLARIS_AI_*` codes identify contract, busy, invalidated, state-query, invalid-state, failed-resume, not-active and timeout stages. They are integration-candidate codes, not errors already implemented in the installed APK. State/resume failures are deliberately bounded; raw native exception text is not copied into them. Existing operation errors propagate to the original service's established error mapping; that owner must continue sanitizing before any display/export. Do not log prompts, transcripts, raw identity bindings, model paths or private exception causes.

## Host evidence

Tests run the exact hash-checked `@qvac/sdk` 0.18.2 lifecycle source and state/resume/suspend handlers recovered from the APK, unchanged. Only logger/error imports and registered resources are replaced with explicit test doubles. A tiny synthetic public-client wrapper follows the separately inspected compiled API unwrapping. This is stronger evidence for the lifecycle helper than a newly invented state machine, but it is **not** full SDK/Bare/RPC/llama.cpp execution, native engine inference or an Android lifecycle test.

The control case proves the recovered SDK gate rejects a suspended synthetic load; the helper then reconciles before one synthetic dispatch. This does not establish that the owner's exact phone sequence had the same cause.

Run `node --experimental-vm-modules --test test/active-qvac.test.mjs` from this directory. Node's VM-module warning concerns the host test harness, not an Android dependency. The original native lockfile was not recovered; this helper adds no package install or lockfile.

## Next build acceptance

After recovering a verified native project and matching signing environment, integrate under its current contract, retain the reviewed UI candidate, and build a compatible forward version above the newest actual installed build. Re-run the service's real tests for startup/background/foreground races, cancellation during inference and commit, model reuse, repeated taps, denied/revoked authority and delayed native settlement. Then separately verify real inference on the physical phone, a same-signer in-place upgrade with data retained, working local voice and Health reads. No such native build or phone check has run in this checkpoint.
