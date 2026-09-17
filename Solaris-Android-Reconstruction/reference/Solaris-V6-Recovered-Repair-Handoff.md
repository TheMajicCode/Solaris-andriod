# V6 continuation handoff — 2026-09-13

Read README, CONTRACT-V6-RECOVERED-UI-REPAIR, both forensic reports and INDEPENDENT-REVIEW first. This is a newly packaged APK-derived recovery/repair checkpoint, not the original native source/evidence archive. Keep the supplied APK, immutable recovered baseline and this patch distinguishable.

## Current state

| State | Evidence |
|---|---|
| Verified baseline | Uploaded V6 APK, code 600, package `org.solarishealth.edge.recovery`; SHA-256 `4ac6a72c864118ec548ee5c05738c814b6e519f82b01a7d358d24952b900c518` |
| Baseline signer | Development certificate SHA-256 `fac61745dc0903786fb9ede62a962b399f7348f0bb6f899b8332667591033b9c`; prior official apksig verification passed. Signing private key/environment not recovered. |
| Recovered UI | Exact packaged HTML SHA-256 `d8192125d041ac8521029dc9b348c2760fafce91e5cb9a5e12d7d91ba2897962` |
| Reviewed candidate UI | SHA-256 `be5c43771f1e1a1b1c409e5aba24804a746699789591b0185c19f3794ad24693` |
| Local work | Isolated `codex/v6-recovered-ui-repair`, unborn branch, no HEAD/tree/commit/remote. This is not the historical native branch. |
| Implemented and host checked | UI patch, actual-function regressions, synthetic-browser layouts/error/read states, independent review |
| Investigated | Actual HBC96 application functions, QVAC packaged lifecycle gate and selected Android DEX classes |
| Blocked | Full native integration, compatible signed build and actual engine repairs: verified native source/build/signing path absent |
| Device acceptance | Not performed in this stage. Prior user screenshots remain user observations, not checks personally run here. |
| Deferred | Identity/GPS/P2P phases, real health sharing, web synchronization and financial state; no native dependencies added |

The original `Solaris-V6-Sanctuary-Source-and-Evidence.zip`, `v6-work/solaris-health`, and `v6-evidence/build/attempt-001` including the pre-build checkpoint were not recovered. The APK cannot supply the original lockfile, development signing private key, or original source history. Do not substitute the D4/V5-B or old web tree, infer a recovered source HEAD, or ask the owner again for the ZIP they could not download. Existing recovery searches and the prior durable assets checkpoint remain relevant; repeat a search only if new access or evidence makes it useful.

## Concrete native repair target

QVAC has an existing lifecycle queue and a queue-identity loop before operations. Preserve both. The compiled lifecycle handler can skip SDK resume/suspend when `workerReady` is false; `ensureWorker` later marks readiness after bootstrap/heartbeat without an explicit SDK-state reconciliation. Bare transport resume is a separate mechanism. This is a verified code boundary and a plausible failure mechanism, not a proven trace of the owner's phone failure or a model-size diagnosis.

When a verified build path is recovered, implement a narrowly scoped reconciliation in the actual service: serialize desired foreground state and actual SDK lifecycle state after worker creation and before model admission; use allowed state/resume operations; retain operation/session/foreground and cancellation checks across awaits. Do not delete the model, bypass admission, weaken the existing queue, blindly replay inference, or expose private state in diagnostics. The exact test scenarios and compiled function offsets are in `hermes-audit/HERMES-FINDINGS.md`.

## Health Connect next check

Granting steps/sleep access returns permission status only. Explicit read runs native aggregation, validates date/timezone/session/permissions, saves the snapshot and returns the full vault view. The patch respects that view shape. Null aggregates remain missing values, not zero.

The current native exception mapper collapses several provider causes into `HEALTH_PROVIDER_READ_FAILED`. Preserve bounded provider reason codes in a later native repair; do not infer an empty provider from a generic failure. The new UI separately displays confirmed request completion, latest saved snapshot, missing values and failed refresh. It creates no metrics and leaves manual totals and 1–5 self-reports separate.

For later voluntary phone acceptance, inspect Health Connect's existing stored steps/sleep for the same date window, then explicitly refresh permitted records with Solaris foregrounded. Compare the imported snapshot provenance/values and any bounded error. A permission screenshot alone establishes access, not data availability or a successful read. No automatic phone action is authorized or included here.

## Authority and continuity

Current authorization covers reversible isolated source/analysis, necessary tests and a reviewable compatible build if possible. It does not permit pushes/merges/deployment, installation, data clearing, key rotation, new signer/package identity, funds or external contacts. Preserve vault/recovery formats, permanent ID, original signing identity, valid model and partial transfers, record IDs/history, voice, unlock and screenshots. Do not replay obsolete general approval prompts.

Once a real source repository survives or is recovered, read its actual AGENTS/governance and reconcile this amendment and the existing Identity/GPS plan. Integrate in a dedicated native path and isolated worktree under the shared Solaris repository when appropriate; do not make an APK-only branch permanently canonical. Keep source hashes, ownership, test evidence and handoffs in Git when that verified relationship exists. No GitHub repository was created or changed here.
