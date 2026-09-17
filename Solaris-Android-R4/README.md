# Solaris Android604 — grounded chat candidate

This is an editable, APK-derived update to the verified signed603 baseline. It preserves the existing model, native libraries, vault/recovery formats, package ID and signing certificate. It is not a complete reconstruction of the missing native Android project.

The user authorized604 after reporting 30–80-second chat waits, unsupported personal answers and interrupted conversations when leaving the app. The supplied recording shows roughly49–93-second waits, zero selected sources, and stale waiting/error controls. No installation, data reset, key change, push or deployment is authorized or performed.

## Changes

- Common greetings/capability questions, check-in questions, the small-step shortcut and recognized record/history questions use a deterministic guided path. Check-in personalization uses only valid fields from the explicitly selected, currently approved records. Missing records produce a request to choose sources. The original permission, source, session and cancellation checks still govern persistence.
- Guided answers bypass model preparation and generation and retain the existing guided label and template receipt. Open chat retains the exact603 model request, model and validation behavior. This avoids model work for supported guided intents; it does not establish a new phone latency for generated chat or eliminate all possible unsupported model claims.
- The final save rechecks authority after asynchronous receipt authentication, closing a reproduced race for both guided and generated replies.
- Chat completion clears only its own stale notices, keeps unrelated errors, and refreshes waiting/Stop controls when returning from another app screen. A matching new completed pair is required before clearing the submitted draft.
- The chat exposes source selection and context-category controls. Category permission does not silently select or share records.
- After background locking and an explicit unlock, the UI returns to chat. It explains that an unfinished reply was stopped and its unsent draft cleared. No automatic replay occurs. All existing private-state wiping and foreground/cancellation guards remain in force.

## Limits

Generation still stops when the app leaves the foreground. Pending text is not yet durably saved; only completed conversation is stored. The lifecycle assessment records a separate encrypted pending-turn design and its required tests. Android foreground-service execution, process-death recovery and full native source reconstruction remain open.

The existing0.6B model remains limited. The guided router covers named common intents; arbitrary open chat can still be vague or unsupported. Tighter generation caps and a stricter short prompt were evaluated on the exact model and rejected after quality failures. Native Linux timings are not Android performance measurements. No new APK is claimed device-tested until the user tests it.

## Reproduce and preserve

Extract `Solaris-604-Editable-Reconstruction.zip`, `Solaris-604-Build-Inputs.zip` and the previously saved `Solaris-603-Build-Inputs.zip` beside each other. The604 editable archive includes the complete603 source checkpoint and new604 source/tests/reviews. The604 input archive adds the exact603 baseline APK; compiler, Android packaging tools and native runtime inputs are unchanged from the603 input archive. Exact prerequisite hashes are recorded in the604 input archive. The previously saved model test input is needed only to rerun model experiments.

From the extracted parent directory:

```sh
python3 Solaris-Android-R4/tools/build-bundle.py --baseline-apk reconstruction-inputs/baseline-603/Solaris-V6.0.3-Pocket-Chat-Candidate.apk --ui Solaris-Android-R4/ui/sanctuary.compact.html --output-dir /tmp/solaris604-rebuilt
```

The generated HBC must match `evidence/release/BUNDLE-RESULT.json`. The source helper and build tool preserve every host function outside the four declared changes and the original fixed UI string. Test commands and boundary limitations are recorded alongside each result. Reviews and signing gates bind exact source, bundle and APK hashes. Old approvals are not reusable for modified artifacts.

The existing verified public development signing fixture is separately hash-pinned. Raw keystore/password files are excluded from all delivery archives. The build report gives final artifact identity and validation results. The compressed update ZIP contains the exact same signed APK as the direct APK download.
