# Build 604 lifecycle assessment and bounded repair

## Finding

The retained application deliberately locks the vault and cancels private inference whenever React Native reports any state other than `active`. The dropped in-progress turn is therefore an expected consequence of the current implementation, not evidence that the model failed or that Android killed the process. The screenshots do not establish which native lifecycle operations completed on the phone.

The build-603 reference APK is SHA-256 `25d3642ab5f45986e5dfcfe5c5413d40982c6142eb703adffc391f9d3b033227`; its bundle is `b8ac7d1b58d9e8ea6eadd25de516e35842aea14e4b849462664bb3200fedc990`. `evidence/lifecycle-function-identity.json` verifies 12 relevant host function bodies are byte-identical to the recovered 601 functions, so the retained disassembly is an applicable reference for these paths.

| Boundary | Existing behavior | User-visible consequence |
|---|---|---|
| AppState callback F6957 | Set active reference, call Qvac.lifecycle, hide private UI; when inactive, cancel voice/health operations, invalidate entry and call Daily.lock unless a vault ceremony owns the transition | Leaving the app cancels an in-progress chat and initiates vault locking |
| UI `__solarisPrivateHide` | Increment navigation epoch, clear action jobs, accept locked state and reject pending bridge calls | Draft, source selection and waiting status are cleared; no private draft is retained outside the vault |
| Daily.lock F14921/F14923 | Synchronously increment epoch and session, clear state/restoreData, then cancel provision and lock the store; reuse a pending lock promise | Previously admitted completions become ineligible immediately, before native lock settlement |
| Qvac.lifecycle F7371/F7373 | Set active synchronously, serialize cancellation and suspend/resume on lifecycleWork; block reuse if transition status is uncertain | Foreground return resumes a usable runtime, but never reauthorizes the old cancelled request |
| Daily.converse F14894 → F14904 | Generate and validate first; only then queue one transaction adding user, assistant, receipt and operation ID | The in-progress user message has not yet been saved and cannot be recovered from the vault |
| Entry F6925, VaultSetup.onClose F6972 | Publish unlocked state, then inject `__solarisDailyRoute('home')` | Unlock returns the user to Home even if they were previously in chat |

The executable `__solarisPrivateHide` call occurs only in F6957. The manual UI lock bridge branch calls Daily.lock, without invoking PrivateHide. The other text occurrence is the bundled HTML definition. A UI repair can therefore distinguish background return from the explicit lock action without inferring a reason from unreliable browser visibility events.

## Bounded build-604 change

The UI owner can preserve a public return-to-chat boolean and an interruption boolean when PrivateHide runs, retain all existing private-state clearing, and consume the return marker when the host sends its next home route after unlock. It must clear this marker for an explicit UI lock or an owner replacement observable while unlocked. It must not preserve the text, owner identity, selected sources, pending operation credentials or grants in localStorage/sessionStorage or a closure outside the locked vault. Return is navigation only: there is no automatic retry or model dispatch.

There is no verified public owner-replacement callback. Once locked state has discarded the owner identity, the public numeric marker alone cannot distinguish a hypothetical different owner on subsequent unlock. In that case it can at most restore the chat route and a stale generic interruption notice; displayed history must always come from the newly unlocked current vault, and no prior private material or authority is restored. This is a cosmetic limitation, not a reason to retain the old owner identifier through lock.

If the interrupted turn had not completed, the UI should explain that leaving locked the vault and stopped that reply, and invite the user to send the question again. It must not claim the current draft was saved. Previously completed messages are already in the encrypted conversation and remain available after successful unlock. The UI tests must cover publish-before-route and route-before-publish order, repeated background events, explicit lock, owner change, pending rejection and zero automatic dispatch.

No host lifecycle or native change is proposed for this cycle. In particular, keeping private state unlocked, bypassing foreground/authority predicates, or replaying an old operation on foreground return would change the security boundary and are not appropriate substitutes for session recovery.

## Executed boundary tests

`tests/run.py` executes the actual retained QvacService and DailyService methods in the matching Hermes runtime with Android startup suppressed. The native vault, successful unlock projection, SDK transport and timers are explicit synthetic fixtures. The baseline 603 run passed 10/10 cases in `evidence/baseline603/result.json`:

1. Pending input has no persisted user record until the completed pair commits.
2. Explicit lock synchronously revokes epoch/session and deduplicates native cancellation/lock.
3. Late completion after lock writes neither records nor receipt.
4. Previously persisted conversation bytes and IDs are unchanged by lock.
5. Synthetic successful unlock projection never replays interrupted inference or invents a saved pending message.
6. Authority mutation during generation suppresses the late save.
7. Active → inactive cancels before suspend and retains the valid model.
8. Inactive → active resumes the runtime while keeping the old operation cancelled.
9. Background admission fails before invoking the requested action.
10. Uncertain lifecycle settlement blocks reuse without deleting model storage.

The same harness passed **10/10** against integrated candidate02, bundle SHA-256 `30be9989cc00299836715cc3de5cf3a2a75b00019bdf2f1b91629205f558d8b3`, in `evidence/candidate02-reviewed/`. Two tests that previously used the fixture's default greeting now explicitly submit `A short reflection please`, and assert one model dispatch. This is necessary because 604's reviewed greeting fast path intentionally never invokes the model; awaiting its synthetic model adapter would leave that test unfinished. All lifecycle, cancellation and persistence assertions remain intact. An earlier unadapted `candidate02` output is an incomplete harness run and is not passing evidence.

These tests prove retained JavaScript ordering under controlled conditions; they do not prove Android background execution, phone latency, native biometric unlock, process-death recovery or storage durability. Rerun against any later changed candidate bundle before signing.

## Background execution limit

`evidence/manifest603.txt` is an aapt2 dump of the exact signed 603 APK. It contains no Android service component, `FOREGROUND_SERVICE` permission or `WAKE_LOCK` permission. The retained host expressly requires active state for inference. Native source reconstruction is incomplete. Therefore this evidence does not support promising that generation continues while another app is visible, the screen locks, or Android stops the process. A reviewed foreground-service architecture and device tests would be a separate implementation scope; it cannot be established by dropping the current guard.

## Next persistence design, not implemented in 604

The existing state validator accepts an unanswered user record with the normal message fields; it does not enforce alternating roles. The converse implementation also has an existing fifth `alreadySaved` argument that suppresses adding a second user record in its final transaction. These are useful compatibility anchors, not a complete recovery protocol.

A subsequent cycle can implement a revisioned encrypted pending-user transaction before native dispatch, followed by the existing validated assistant/receipt transaction. It must associate an explicit retry with the exact still-unanswered user record, reject stale/replaced owners and revisions, and avoid marking the operation completed until the final reply transaction commits. The bridge needs a validated retry identity; it currently supplies only message, selected source IDs, useAI and operation ID. New prompt submission and retry must remain distinguishable to prevent duplicate users or a reply attaching to the wrong question.

On lock, clear all transient prompt/source material as today. After explicit unlock, restore only from the decrypted current vault. Offer explicit retry of the saved unanswered message with fresh current permissions and explicit current source selection; never reuse stale source authority or silently dispatch. Preserve existing message IDs and avoid schema/key changes. Required tests include lock during the first save, process death between the two transactions, missing save acknowledgment, duplicate taps, permission/source revocation, source deletion, second question before retry, owner change, and replay after a completed operation. Native SQLCipher transaction and recovery-envelope compatibility remain independent gates.
