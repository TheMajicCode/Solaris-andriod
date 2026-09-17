# V6 compiled lifecycle and Health Connect findings

Read-only inspection of the uploaded V6 APK's exact Hermes bundle. This report adds compiled application evidence to the recovered QVAC worker evidence. It does not recover the original TypeScript project, modify the APK, or prove the phone's execution sequence.

## Input and method

- Bundle: `assets/index.android.bundle`, 30,744,132 bytes, HBC version 96.
- SHA-256: `cbfb0ec84116b5aa8a6aed22461a98f3753b365d202fa965f0e23c0a064930a5`.
- P1sec/hermes-dec, declared version 0.1.7, commit `a0f18f97ab661eb8ed659c8c683a0d21ea619e69`, AGPL-3.0-or-later. Public source: https://github.com/P1sec/hermes-dec/tree/a0f18f97ab661eb8ed659c8c683a0d21ea619e69
- Python disassembler completed with exit 0 across 15,513 functions. No bundle execution or phone interaction occurred. Tool source was obtained with one public Git clone; there was no framework/dependency installation in Solaris.
- Function names, IDs, offsets and instructions below come from bytecode. Source-like descriptions are analyst interpretations, not verbatim recovered TypeScript. Reproduce using commands and hashes in `evidence/TOOL-AND-INPUT-PROVENANCE.json`.

## Lifecycle findings

| Compiled function | Verified behavior | Consequence |
|---|---|---|
| #7146, QvacService constructor | Initializes `active=true`, `workerReady=false`, `blocked=false`, `lifecycleWork=Promise.resolve()` | Application foreground intent and worker admission state are separate. |
| #7371, lifecycle generator | Sets `this.active` synchronously, appends transition work to `lifecycleWork`, stores a caught promise, awaits the actual transition promise | A lifecycle queue already exists; the repair must preserve it. |
| #7373, queued lifecycle body | Cancels captured operation where applicable; obtains runtime through `peek()`; exits without SDK resume/suspend when runtime absent, `workerReady=false`, or `blocked=true`. Otherwise chooses resume/suspend from current `this.active`, bounded by cleanup budget; failures clear readiness and mark restart required | A foreground transition during worker startup can be skipped. A settled queue alone is not positive evidence that SDK admission is active. |
| #7184, run generator, offsets 0x91–0xb0 | Awaits `lifecycleWork`, rereads its identity and repeats if a newer queue was appended, then checks the operation and blocked flag before invoking the work callback | Existing code protects against a changed queue reference. Do not replace it with a weaker one-time wait or describe the bug as “no serialization.” It does not explicitly query SDK lifecycle state in this preflight. |
| #7194, ensureWorker generator | Starts/reuses runtime, stages bootstrap and heartbeat, then marks `workerReady=true` and runtime responsive. If already ready it returns `runtime.peek()` | The inspected readiness path does not explicitly reconcile SDK resume/state after a transition was skipped while startup was in progress. A responsive heartbeat is not proof of permitted model inference. |
| #6957, application AppState callback | Maps AppState `active` to Boolean and calls service.lifecycle(active); background also invalidates/hides private state and cancels operations | Preserve vault/session cancellation, not just engine availability. |
| #13051 and #13074, Bare kit | Registers its own AppState change listener. Worklet.update resumes on active and suspends on background | Bare execution suspension and QVAC RPC admission are separate mechanisms with independently scheduled callbacks. A Bare worklet being resumed does not alone prove QVAC is active. |

The exact worker's previously recovered `assertLifecycleAllowed` rejects normal operations while SDK state is suspending, suspended or resuming; only state/resume/suspend remain admissible. Combined evidence identifies a concrete readiness boundary that needs reconciliation. It does **not** establish that this specific boundary caused the user's screenshot. Native event ordering, actual error request type/state, startup timing and any transition failure remain unobserved.

### Minimal repair recommendation for the restored application source

Retain one service lifecycle queue, the changed-queue loop, foreground checks, worker failure blocking and all cancellation/session guards. After runtime creation and before admitting each model load/inference, reconcile the current desired lifecycle against actual SDK state through its allowed state/resume operations, serialized with lifecycle transitions. Do not treat `workerReady`, completed transfer, checksum or a settled queue as inference readiness. Preserve the valid model file and do not remove the SDK gate. A refused resume must yield a truthful retryable state and useful bounded diagnostics, not silently proceed.

Recheck operation/session/foreground authority after each awaited transition and immediately before inference or releasing its result. Do not blindly replay a model request that may already have run; retry only when an admission rejection proves it did not start, with the same valid session and explicit bounded retry policy. No TS coordinator was fabricated here.

### Targeted synthetic scenarios to add to the real coordinator tests

These are proposed tests, **not executed phone checks**:

1. Hold worker startup pending (`workerReady=false`). Deliver background then foreground. Complete startup with simulated SDK state suspended. Attempt load. Expect one serialized resume and active-state confirmation before load, or a clear failure with no load; no new model transfer.
2. While preflight awaits lifecycle, append another transition. Expect the existing queue-identity loop to wait for it; background prevents the request and result release.
3. Resume rejects or times out. Expect no load, no record mutation, no unbounded retry; valid model retained. A later explicit retry must reconcile/restart only the runtime under the existing policy.
4. First admission rejects as lifecycle-blocked. Record non-sensitive request type and SDK state. Do not label this as vault-save failure. Revocation/navigation while reconciliation waits prevents result release.

## Health Connect findings

The APK has separate request, read and save layers. They must not be conflated when interpreting empty metrics.

- `HealthService.read`, #14790, passes startDate/endDate/timeZone to native healthRead. It checks vault authority and epoch before and after, validates the response, requires response startDate/endDate/timeZone to exactly match the request, fetches current permission status and rejects revoked scopes. Possible explicit errors include `VAULT_LOCKED`, `CANCELLED`, `HEALTH_RESPONSE_INVALID`, and `HEALTH_PERMISSION_REVOKED`.
- Application bridge #6929 routes healthRead at offset 0xbf0: captures owner ID, awaits HealthService.read, then awaits `vault.saveHealthSnapshot(snapshot, authorityClosure)` (#6931). It returns the save result to the WebView. It does **not** directly return the raw native snapshot.
- Save generator #14856 checks the captured vault session and authority closure, queues the save, creates a health import with its existing ID/receipt mechanism, rechecks authority, persists the new state, and returns `this.view()` (offsets 0x241–0x250). Its existing duplicate shortcut also returns the vault view. The UI must read the resulting vault view's imported records, not assume healthRead resolved to a raw Health Connect snapshot.
- Bridge healthConnect is a distinct branch at #6929 offset 0xc77 and returns requestPermissions' result. Granting permission alone does not run this read/save path.

Missing metrics can therefore mean no provider records in the requested window, an invalid response, revoked/changed permission or session, failed persistence, or a UI result-shape mismatch. The screenshots do not distinguish those cases. Keep self-report 1–5 data separate from imported steps/sleep. Do not manufacture zero readings for absence.

## Delivery and limits

`DELIVERY-FILES.json` includes bounded relevant disassembly extracts, provenance, license and this report. Large full-disassembly intermediates and the cloned analysis tool repository are excluded from the delivery list. The original APK and recovered bundle remain unchanged. The signing environment, native build source, full lockfile and original V6 source/evidence ZIP are still not recovered by this analysis.
