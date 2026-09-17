# Recovered V6 QVAC lifecycle API evidence

Status: read-only contract investigation, 2026-09-13. This is evidence for a separate integration candidate, not recovered application source or a phone repair.

## Inputs verified in this investigation

The SDK package declares `@qvac/sdk` version `0.18.2`. The following hashes were freshly calculated from the exact recovered worker files under `v6-apk-recovery/extracted-v1/worker-files/node_modules/@qvac/sdk/`:

| Relative file | SHA-256 |
|---|---|
| `package.json` | `f04d6b5148124451a2844ce84564bafda697c1bb8d71cf7f822633ca5c24c3d2` |
| `dist/server/bare/runtime-lifecycle.js` | `9d52cf464f7e625ab5a0a3f81881c390e57bb40c80e0545f19d3e2843d302cab` |
| `dist/schemas/state.js` | `f978fb74cf2ee93906f95626934c8eb6e006f45ef09c6b9c50ad13cf3f700ab0` |
| `dist/schemas/resume.js` | `bc01dc35255eefa9ea94fc8833bdf1b816f064043bbc0000ac803a6109eab8a9` |
| `dist/schemas/suspend.js` | `d6c97f86f40cb4c4291480157cb240267f42ae40fe0db679de2aabe8eb1f538c` |
| `dist/server/rpc/handlers/state.js` | `15b2edf251e1a48645fb52d45872f325a7b9b9869aa13450d7708a803caae47f` |
| `dist/server/rpc/handlers/resume.js` | `cd14370b6ca341351049b5ddc1457423de265d3ac23cabe4c4f46affb969471a` |
| `dist/server/rpc/handlers/suspend.js` | `af0439e6822dcea1667ff4f93081f3ef9c0b920b474c7cc265a914374868a660` |
| `dist/server/rpc/handle-request.js` | `ea0d424488071015fb7a58e5ff067d9449381b9de12482b216c0406834c88254` |
| `dist/schemas/sdk-errors-server.js` | `8d4d24ce91d75073406c4bf1b4747c3ac299d551a452c57789573eefd6620506` |
| `dist/utils/errors-server.js` | `96a85b90c2c52f3500364080e187c4ea2be749cd97fc8a0e8ddc17ad862f38c6` |

- Exact packaged Hermes bundle SHA-256: `cbfb0ec84116b5aa8a6aed22461a98f3753b365d202fa965f0e23c0a064930a5`.
- Existing compact Hermes disassembly SHA-256: `af003491d5315bfeacbcf3d3779223d6a791085b398898edfc289f36b3e0c300`.
- The disassembly was produced in the previous recovery checkpoint; it was read this turn, not regenerated. Tool provenance remains in `v6-next-repair/hermes-audit/evidence/TOOL-AND-INPUT-PROVENANCE.json`.

## Public client API is distinct from RPC wire shape

| Layer | Call/request | Success result | Evidence |
|---|---|---|---|
| SDK client | `state()` with no arguments | Promise resolving to the string `active`, `suspending`, `suspended` or `resuming` | Hermes function #13769 at bundle offset `0x01cd9311`: sends `{type: 'state'}`, validates response type, returns `response.state` |
| SDK client | `resume()` with no arguments | Promise resolving to `undefined` | Hermes function #13764 at `0x01cd91e6`: sends `{type: 'resume'}`, validates response type, returns undefined |
| SDK client | `suspend()` with no arguments | Promise resolving to `undefined` | Hermes function #13759 at `0x01cd90bb`: same pattern with `suspend` |
| RPC wire | `{type: 'state'}` | `{type: 'state', state: <enum>}` | `dist/schemas/state.js`, `handlers/state.js` |
| RPC wire | `{type: 'resume'}` | `{type: 'resume'}` | `dist/schemas/resume.js`, `handlers/resume.js` |
| RPC wire | `{type: 'suspend'}` | `{type: 'suspend'}` | `dist/schemas/suspend.js`, `handlers/suspend.js` |

The complete instruction blocks for these three SDK public-call generators are included under `api-extracts/13769-state.hasm`, `api-extracts/13764-resume.hasm` and `api-extracts/13759-suspend.hasm`. `api-extracts/MANIFEST.json` records each exact excerpt's byte count and SHA-256, the source disassembly SHA-256 and extraction boundaries. These are bounded compiled evidence, not reconstructed TypeScript. They preserve the prior disassembler output verbatim and add no claim of native execution.

Do not require the SDK client `state()` to return the wire object. Do not interpret a successful resume return value as an independently observed active-state response. A source-independent helper can depend on these three public methods, with strict validation of the returned state string. Public client functions have no exposed abort signal or timeout parameter in this recovered implementation.

The compiled application already calls the runtime object's no-argument `resume()` / `suspend()` methods: function #7373, offsets `0x8f–0xa5`. The helper should reuse the actual restored runtime adapter, not create a second worker or call private SDK imports from the app.

## Worker admission and transition semantics

`runtime-lifecycle.js` is a module singleton. It begins `state = 'active'` with no transition promise. Only `state`, `resume` and `suspend` requests bypass the admission block while non-active. `handle-request.js` validates requests and calls `assertLifecycleAllowed` before invoking either normal or duplex handler execution. `state()` is a snapshot, not a barrier or authority lease.

- Suspend: already suspended is a no-op; another suspend during suspending awaits the current transition. If resume is in progress, suspend awaits it and then re-evaluates. Stores suspend before swarms.
- Resume: already active is a no-op; another resume during resuming awaits the current transition. If suspend is in progress, resume awaits it and then re-evaluates. Swarms resume before stores.
- Each phase uses a snapshot of registered resources, iterates sequentially, collects errors for still-registered resources, and throws an `AggregateError` if any remain. A failed phase stops progression to the next phase. A removed resource's error is ignored.
- Failed suspend commits the state to suspended before rejecting so that a subsequent resume may repair it. Failed resume leaves suspended and rejects. A new explicit resume can retry.
- An opposite transition's rejection propagates out of the waiting call; that call does **not** automatically run its own requested transition after the failure.
- Success notifies resume listeners after setting active. Listener exceptions are logged. Callers unregister listeners after their work finishes.
- This coordinator has no intrinsic deadline. A pending resource hook can keep a transition pending. Timing out an outer Promise does not cancel the underlying transition.
- `resetLifecycleState()` clears resource registries/listeners and sets active. It is suitable for a fully isolated test module; it must **not** be used as a runtime repair, because it discards tracked resources and bypasses reconciliation.

These registered resources are swarms/corestores. They are not fake proof that the LLM engine loaded or completed inference.

## Errors to preserve

The recovered SDK server definitions use numeric codes and names:

| Numeric code | SDK name | Meaning |
|---|---|---|
| 53600 | `LIFECYCLE_SUSPEND_FAILED` | Handler wrapped a failed suspend transition |
| 53601 | `LIFECYCLE_RESUME_FAILED` | Handler wrapped a failed resume transition |
| 53602 | `LIFECYCLE_OPERATION_BLOCKED` | Normal operation was refused by the lifecycle gate |

The admission error constructor receives request type and lifecycle state; its message is `Operation "<requestType>" is blocked while runtime state is "<state>"`. The UI-visible `QVAC_...` prefix is an application-normalized representation; do not infer that the worker emits that string as its raw numeric code. Diagnostics should record only a bounded, non-sensitive request type/state and operation stage. Do not record model prompts, records or identity material.

## Existing application safeguards must remain

The existing `HERMES-FINDINGS.md` correctly distinguishes a readiness gap from a proven phone root cause. This investigation also inspected function #7373: lifecycle work skips SDK transitions when the runtime is absent, worker is not ready, or the service is blocked. The service's existing serialized queue and queue-identity recheck are documented by function #7184. Preserve both.

A restored-source integration should reconcile after worker creation and immediately before admitting model work, **within the existing lifecycle ordering**, then recheck current foreground intent, operation/session validity, worker identity and blocked state after every await. A completed transition or an active snapshot cannot authorize an operation after background, navigation, lock, revocation or worker replacement. The helper must not clear the app's blocked flag, reset the worker, redownload a model, bypass the gate, or blindly replay a model request. A timeout should fail closed; later completion must not release an abandoned result.

## Host feasibility personally checked

1. Ordinary direct Node import of the exact recovered module fails before use: `MODULE_NOT_FOUND: Cannot find module './env'` through recovered `@qvac/logging/index.js`. This is a recovered package-resolution limitation, not a phone inference result. No dependency installation or recovered file mutation was attempted.
2. Executed the **unchanged exact** `runtime-lifecycle.js` using Node `vm.SourceTextModule` with two explicit import stubs: a no-op logger factory and a probe-only `LifecycleOperationBlockedError` constructor. Registered a synthetic store and swarm using the real exports. The module was not rewritten or decompiled for execution. The resulting 12 assertions passed with exit 0.
3. Verified initial active state; suspend phase order; suspended state; blocked load request; admissibility of state/resume/suspend; failed resume rejection and retained suspended state; successful explicit retry; resumed admission; and swarm-before-store resume order.

The probe command used `node --experimental-vm-modules --input-type=module` and in-memory source linking. It is a feasibility probe, not the final integration regression suite. Parent-owned tests should preserve the source hash guard and disclose the two stubs. Meaningful further tests can hold/reject fake resource hooks to exercise same-direction concurrency, opposite-transition failure, timeouts, background/lock invalidation and late completion. That tests the exact SDK transition implementation plus a candidate coordinator, while keeping real RPC transport, Bare scheduling, Android background handling, native model loading and inference explicitly unverified.

## Remaining limits

The original native application project and its exact lockfile/signing environment remain absent. This review does not establish source-build reproducibility or a compatible installable APK. The APK's actual phone execution sequence was not observed. No model request or Health Connect read occurred. No original file, APK, vault, signer, branch or installed app was modified by this investigation.
