# Candidate 603: Pocket LUCA presentation repair

This directory contains an editable patch of the recovered 601 readable UI (the 602 UI is unchanged from that baseline). It makes no APK, HBC, native vault, permission, record-selection or model changes.

## Changes

- Normal chat distinguishes first-output timeout, incomplete timeout, empty completion, response length limit, rejected output format, grounding rejection, answer checks, negation changes, unconfirmed cleanup and known runtime failure.
- Chat details display only an explicitly allowlisted diagnostic code. Unknown error text becomes OPERATION_FAILED. Prompts, selected records and raw native error strings are not rendered as diagnostic detail.
- Model loaded/public test success is shown separately from normal-chat proof. Session proof requires a completed normal-chat return with new final user and qvac-device assistant IDs, the submitted user text, nonempty assistant text, accepted revision and unchanged unlocked owner/epoch/grant. Stored history, repeated unchanged state, unrelated replies and predefined support do not establish proof.
- Proof clears on lock/epoch, owner change, global local-AI grant revocation/change/expiry, localContext category-grant changes or expiry of a previously-active category grant, or chat failure. Category grants do not become required for zero-source greetings. Permission expiry updates the displayed status without a model status event.
- Normal chat shows waiting text and elapsed time without claiming observed hidden model activity. The draft stays editable and stop remains available. A late completion from an earlier locked session cannot clear a newer request's waiting flag.
- Restart instructions explicitly tell the user to copy the current in-memory draft before closing Solaris. No draft persistence was added.
- Generated and predefined reply labels differ. Existing guided button actions, sourceRefs, explicit selection and textarea remain intact.

## Reproduce

From this directory, relative restored inputs are required:

```sh
python apply-ui-repair.py
"$CODEX_PRIMARY_RUNTIME_NODE" --max-old-space-size=1024 format-ui.cjs
"$CODEX_PRIMARY_RUNTIME_NODE" ../tests/ui/chat-ui.test.cjs
"$CODEX_PRIMARY_RUNTIME_NODE" ../tests/ui/chat-ui.test.cjs "$PWD/sanctuary.compact.html"
```

The apply script refuses any baseline other than SHA-256 d37c2cca5a60085924bf777e0c0428144f5955799e3d5e1b767e4dce0a7618a9. UI-PATCH.json records every anchored source substitution.

Formatting uses restored pinned Terser 5.44.0, acorn 8.15.0, eslint-scope 8.4.0 and css-tree 3.1.0. Terser performs no expression optimization; only formatting and local identifier renaming. The two large base64 image literals are temporarily represented by unique literal markers during AST comparison and are restored byte for byte. Their hashes are recorded. Parsed binding-normalized JS trees match. Parsed CSS trees match after whitespace formatting. No images or CSS declarations are removed.

## Verification and limits

42 assertions/scenarios pass against the actual readable script and the same 42 pass against the compact script through synthetic DOM/bridge objects. Test-only access is injected into the in-memory test script; it is not in either delivered HTML. UI-TEST-SYMBOLS.json maps compiler bindings only for the compact test harness. UI-FORMAT-CHECK.json records source, output, asset and AST hashes.

The compact HTML is 5,233,531 UTF-8 bytes / 10,464,958 UTF-16LE bytes and fits the prior recovered slot with 3,886 UTF-16LE bytes to spare. The packaging owner must recheck the actual 602 HBC slot and payload diff before integration.

There is no on-device inference or native compatibility proof in these UI tests. A browser rendering check was attempted, but no local Chromium was available and two bounded Playwright download attempts timed out. No browser layout or screenshot verification is claimed.
