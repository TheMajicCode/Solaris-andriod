# Independent A1 lifecycle candidate review

Review date: 2026-09-13. Reviewer had no implementation ownership and edited only this report. This is a review of source-independent candidate code and recovered-UI copy; it is not an Android integration, APK build, or phone test.

Status: **approved as a source-independent integration candidate after R1 repair; no remaining blocking finding in this bounded review.** This does not approve or establish an installable Android update.

## Scope and evidence personally checked

Read `CONTRACT-A1-RECOVERED-LIFECYCLE.md`, `INTEGRATION.md`, `review/API-EVIDENCE.md`, helper implementation, recovered-SDK loader, all helper tests, UI change notes, actual candidate diff, and recovered state/resume/suspend handlers. Independently compared all eight hash-guarded SDK fixture files with their original APK-extracted counterparts: byte-for-byte equal and manifest hashes match. The public API state string / resume-void contract matches the separately inspected compiled evidence and the clearly labelled synthetic client wrapper.

Ran `node --experimental-vm-modules --test test/active-qvac.test.mjs` from this folder: exit 0, 15 tests passed. Ran `node ui-followup/scripts/ui-repair-test.cjs`: exit 0, 120 host assertions passed. Node reported the expected experimental VM-modules warning. No full Bare, RPC transport, llama.cpp, Health Connect provider, real vault, or native engine ran.

An additional independent in-memory probe held an exact recovered SDK suspend hook, began helper reconciliation, then rejected the suspend. The helper returned `SOLARIS_AI_RESUME_FAILED`, dispatched zero operations, retained `suspended`, and released its lease after actual settlement. This verified the opposite-transition rejection path absent from the initial checked-in suite.

## Finding R1 — caller budget can expire before a delayed timer fires

Priority: blocking for the helper's stated timeout contract. The initial implementation used only a `setTimeout` callback to mark the request abandoned. JavaScript can remain occupied, or native scheduling can delay that callback, while a promise continuation still reaches dispatch after the caller's elapsed budget.

Independent reproduction used `timeoutMs: 5` and a synthetic `state()` that occupied its turn for approximately 40 ms before resolving `active`. The helper returned success and dispatched once at approximately 40.4 ms. It did not reject on timeout. This is host scheduling evidence, not proof of the owner's phone failure.

Required repair: check a suitable elapsed-time deadline at awaited boundaries and immediately before dispatch/result release, alongside current-authority checks. Timer expiry must still retain ownership of an unsettled native promise. Preserve fail-closed behavior, no automatic replay, no new worker, and one dispatcher. Add regression coverage for delayed timer delivery before dispatch and before result release.

Resolution personally rechecked: the helper now uses monotonic elapsed-budget checks around its synchronous authority predicate and awaited boundaries, before dispatch, and before result release. Missing, non-finite or backwards clock readings fail closed; there is no wall-clock fallback. The integration notes explicitly require verification of the actual host clock and foreground/session invalidation. Existing pending leases still wait for underlying settlement.

Re-ran the complete helper suite after repair: exit 0, **18 tests passed**. Two added checks hold a JS turn past the deadline before dispatch and before result release; a third covers invalid clocks. The original independent approximately 40 ms blocked-turn / 5 ms budget probe now rejects with `SOLARIS_AI_ADMISSION_TIMEOUT`, performs **zero dispatches**, and releases only after the state promise settles. The initial reproduction and repair evidence remain recorded here rather than describing the helper as flawless on first review.

Final follow-up also subtracts time already spent in the synchronous guard from the timer delay. Verified that this is the only change from reviewed helper hash `3333affdc9c4baddd10bc599b879bf1731e9b98213a79422590f9721e776450e`, then reran all 18 tests with exit 0. An independent synthetic-clock probe consumed 40 ms of a 50 ms budget in the first guard, captured a 10 ms scheduled timer, observed timeout with the state promise still pending, and verified that ownership remained until state settlement with zero dispatches. This aligns timer scheduling and elapsed-budget checks without treating timeout as native quiescence.

## Other review conclusions

- Same-client WeakMap ownership prevents a second admission while the first state/resume/operation promise is unsettled, including after timeout or abort. Its documented inability to arbitrate a different wrapper for the same worker is an integration constraint, not hidden protection.
- Successful resume is followed by a validated active state query. Unknown states and RPC-shaped objects fail closed. A normal SDK gate rejection after observation propagates once; there is no automatic operation replay.
- Current-authority checks surround successful awaited boundaries and result release; abort, lock/navigation invalidation, permission invalidation, and worker invalidation prevent successful abandoned results from escaping in the tested paths. The original service must recheck again at persistence/receipt/UI commit, as explicitly documented.
- State/resume/guard errors are bounded. Operation errors retain original owner sanitization responsibilities. No prompts, keys, record contents, model paths, or new download/reset method was introduced.
- Existing lifecycle queue, foreground eligibility, worker identity, restart blockers, cancellation and current authority remain explicit native integration prerequisites. The helper is not presented as an already installed app repair.
- Compared the revised HTML with `v6-next-repair/candidate/sanctuary.html`: exactly four literal replacements, representing two claims in English and Spanish, and no other byte change. The two claims correctly avoid treating permission as successful retrieval or an external tracker as always mandatory. Original APK-recovered baseline is unchanged. No new UI behavior is claimed.

## Reviewed initial hashes

| File | SHA-256 |
|---|---|
| `src/active-qvac.mjs` | `bee29bcb9741a1539a546291bf7060c0bf1ac079e9fa2e353cd3769c4a50792b` |
| `test/active-qvac.test.mjs` | `64bbf78763b04bb1f0137a3d7a33f874fa0470e025fde70e87e9df5879765f2a` |
| `test/recovered-sdk.mjs` | `b11f060b21bd102a19128da67d4d7162384c7f109b81b5402f29d70e208112b4` |
| `INTEGRATION.md` | `8bb215b1dee7d957c564b57c6f0625cb26f54603bd671e82fc210763ae5d07dd` |
| `CONTRACT-A1-RECOVERED-LIFECYCLE.md` | `310c2698c7f8f8f2f44cbc88da0755f21a1c957e207d4b04707cb867dccabed2` |
| `review/API-EVIDENCE.md` | `5b96183a923e731bf22de4fb74cc8c83c603792cfaba53274581d0ffcb9f811a` |
| `ui-followup/candidate/sanctuary.html` | `d37c2cca5a60085924bf777e0c0428144f5955799e3d5e1b767e4dce0a7618a9` |

## Reviewed final hashes after R1 repair

| File | SHA-256 |
|---|---|
| `src/active-qvac.mjs` | `11dc0d090ba14f5ad3e79fe388d6a60a2e8ad9991b6dd1bebc5516c0f0ab4530` |
| `test/active-qvac.test.mjs` | `2d26c4cc67ba1a0f7e7562f9ca0b3b9156816ade14be148e2182fcabc6ebe87e` |
| `test/recovered-sdk.mjs` | `b11f060b21bd102a19128da67d4d7162384c7f109b81b5402f29d70e208112b4` |
| `INTEGRATION.md` | `0a3af93b4826823505cf03689b7e0fe7a8c7fbb374a89ccb94c6f7f5d8aa2b37` |
| `CONTRACT-A1-RECOVERED-LIFECYCLE.md` | `310c2698c7f8f8f2f44cbc88da0755f21a1c957e207d4b04707cb867dccabed2` |
| `review/API-EVIDENCE.md` | `5b96183a923e731bf22de4fb74cc8c83c603792cfaba53274581d0ffcb9f811a` |
| `ui-followup/candidate/sanctuary.html` | `d37c2cca5a60085924bf777e0c0428144f5955799e3d5e1b767e4dce0a7618a9` |

## Remaining delivery boundary

Even after this finding is repaired, approval applies only to a reviewable source-independent integration candidate. Original native source, full lockfile, actual lifecycle coordinator integration, matching signing environment and physical-device acceptance remain absent. No APK was modified, built, signed, installed, or represented as ready. Previous checkpoints, user data, installed app, keys, models, and remote repository were untouched.
