# Build 603 UI independent review

**PASS — UI scope only.** Reviewed 2026-09-16 by the independent `ui_review_603` agent. The reviewer did not author or edit implementation. This approval covers the exact files below; it does not approve APK signing, native inference, or an unreviewed later UI revision.

## Findings and corrections

Two concrete defects found during review were returned to the UI author and corrected before this PASS:

1. The periodic update could clear expired chat proof before deciding to refresh the model-details region, leaving that region's success text stale. Invalidation now happens before the waiting-label update. A regression runs the actual registered interval with model details open and expires the grant without a native state/status event.
2. Unconfirmed-cleanup text advised closing the app while implying the draft would remain. Drafts are held in memory. The text now explicitly says to copy the draft before closing and reopening Solaris; no new persistence was added.

The author also clarified category-grant invalidation. A changed context-grant snapshot or expiry of a previously active category grant clears the presentation proof. A source-free greeting still can establish proof when no category grant is active.

The final reviewed delta adds an exact `OUTPUT_LIMIT` allowlist entry and a distinct English/Spanish length-limit message. I proved these are the only readable implementation additions beyond the previously reviewed UI by removing those two additions and recovering the prior exact source hash. All 42 readable/compact checks and the formatter proof were rerun. The draft remains in the current UI, and arbitrary error text remains suppressed.

No unresolved material defect was found in the final UI change scope.

## Behavior reviewed

- Loading a model, public setup-test success, existing stored replies, unchanged returned state, an unrelated new reply, empty output and predefined guided support cannot establish normal-chat proof. Proof requires the completed normal-chat result with a new user/assistant pair, matching submitted user text, nonempty `qvac-device` assistant text and accepted state revision, within the current unlocked epoch and active grant.
- Locking and owner changes reset the proof. Global local-AI revocation/expiry and category-grant changes/expiry invalidate it. Late settlement from an earlier locked session cannot clear a new request's waiting state.
- The normal-chat failure path keeps the current draft, including a newer draft edited during the request. Only successful submission clears the same submitted text. Existing lock behavior still clears private UI state; the change makes no claim that drafts survive a process restart.
- Known chat diagnostics are mapped to bounded, predefined English/Spanish messages. Support details accept only exact allowlisted codes. Unknown error text is replaced by `OPERATION_FAILED`; prompts, records and arbitrary native text are not echoed through this new diagnostic path.
- Waiting text and elapsed time describe awaiting completion without claiming that hidden model reasoning was observed. The editable textarea, stop control, source selection and existing guided actions remain available. Generated replies and predefined guidance have distinct labels.
- The 23 anchored source substitutions introduce presentation state only. They do not modify permission grants, selected-source authority, keys, vault/recovery formats, record IDs, model files, storage APIs or inference requests. The existing `converse` request still carries the submitted message, explicitly selected IDs, current `useAI` value and operation ID.

## Independent verification

I reran the following on the final files:

```sh
node Solaris-Android-R3/tests/ui/chat-ui.test.cjs
node Solaris-Android-R3/tests/ui/chat-ui.test.cjs Solaris-Android-R3/ui/sanctuary.compact.html
node --max-old-space-size=1024 Solaris-Android-R3/ui/format-ui.cjs
```

All **42 checks passed against the actual readable script and the same 42 against the actual compact script**, using synthetic DOM and bridge objects. The test seam is inserted only into in-memory test input and is absent from delivered HTML. Coverage includes public-test false positives, expired/revoked grants, navigation and lock races, unchanged/unrelated replies, distinct diagnostic codes, raw-error suppression, draft preservation and both languages.

An independent replay of every unique patch-manifest anchor from the pinned readable baseline produced the final readable HTML exactly. The baseline SHA-256 is `d37c2cca5a60085924bf777e0c0428144f5955799e3d5e1b767e4dce0a7618a9`.

Rerunning the formatter reproduced the final compact hash. JavaScript binding-normalized syntax trees were identical, with unchanged global names and optimization disabled. Their common tree SHA-256 is `62612d9b6887d67a96f861d788ff20e7e2c934e330576a0db60f3f2556b6f354`. CSS parsed syntax trees also matched. Both large embedded image literals were independently compared to the original baseline and remain byte-for-byte identical.

I decoded the actual verified 602 HBC (SHA-256 `fd8b38bcdd42421c18da4a0b69b2d58906ceddd7c4a2044b34faed51490f4653`). HTML string 12364 starts at byte 18,085,610, uses UTF-16LE, and has 10,468,844 bytes of capacity. The final compact HTML encodes to 10,464,958 bytes, leaving 3,886 bytes for padding. No other string overlaps this slot. This proves fit; the integration/packaging reviewer must separately verify the actual patched HBC and APK payload diff.

## Limits

These checks are synthetic UI execution and syntax-preservation checks. Browser rendering was unavailable: the author documented missing local Chromium and unsuccessful bounded download attempts. No browser layout screenshot, Android WebView rendering, on-phone inference, whole-app compatibility or installation is claimed by this review. Native/HBC integration, final APK packaging, signing identity and payload preservation require their own gates.

## Exact reviewed files

Paths are relative to `Solaris-Android-R3`.

| File | SHA-256 |
| --- | --- |
| `ui/apply-ui-repair.py` | `64fdaf2ae1738b36c46d1a8e77ad99ba5575eb81822f837126854f4176b415f6` |
| `ui/chat-repair-helpers.js` | `9fd0f73052ddc8988c52291a2b71ae332446869cc506c78b148fb5c8366e4301` |
| `ui/sanctuary.html` | `ef223edffb22dbbcafded33f94c54ec2c784121ecba006ac9cea29c9325642e2` |
| `ui/format-ui.cjs` | `e4ebae129ef1b43ab37a990c1276eb1cb00771be758e1729812b59c019c2fa63` |
| `ui/sanctuary.compact.html` | `41df124a23b47964e949189678d3c59a9cb788a05c766ffcf289539acca71f1d` |
| `ui/UI-PATCH.json` | `3ff4062f3b12bc9bc6950146423f10aa1446d8de0955bdca4f48cc3e2aba5aa3` |
| `ui/UI-FORMAT-CHECK.json` | `4a00cae19e147051a5ff14aeeedcbed4e077d8a33227fac9f8473bebd6e327c8` |
| `ui/UI-TEST-SYMBOLS.json` | `6c1e93efc29b2bde9d89a6959428bab90ed4301578e6f6bb7415d64bedb7e02b` |
| `tests/ui/chat-ui.test.cjs` | `37d1aa926dc399fc9302e9e5c7499e2cbf92487e150cde1404523b3d4ff88883` |
| `tests/ui/UI-TEST-RESULTS.json` | `4b336f03c1034587b492b2e9314cdf059ca2066fa4eea60a09484d2640a17dad` |
| `tests/ui/UI-COMPACT-TEST-RESULTS.json` | `594d9001bda12e894a0fe41f5601760e9cdd9ab6165cca51b489ff3b8b710338` |
