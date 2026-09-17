# Candidate 604 UI repairs

This editable patch derives from the verified 603 readable UI. `apply-ui-repair.py` checks the baseline SHA-256 and records every anchored substitution in `UI-PATCH.json`. It does not change the native vault, model, bridge authority, selected-record permissions or existing lock/cancellation policy.

## Evidence and changes

- The recording shows a completed reply with stale working controls after a permissions-screen visit. The 603 `send` cleanup updated its flag but rendered only when the original navigation ticket was still current. Cleanup now refreshes the current chat view after same-session settlement, without navigating away from another current screen.
- Chat shortcuts run inside the generic action wrapper. Its 12-second warning could survive successful completion and duplicate chat progress. Chat shortcuts now use chat progress alone. Other action notices carry ownership and clear only when their own action finishes; intervening real errors and other actions' notices survive.
- A successful bridge return used to clear the draft even when the returned conversation was unchanged or unrelated. A new matching user/assistant pair now confirms completion. Both guided and model replies can complete the request, while only a generated `qvac-device` reply can establish inference proof.
- The composer explicitly offers **Choose sources** when none are selected and explains that records need selection for personal answers. The existing picker now exposes the existing context-category control. No record is automatically selected or approved.
- The unique host `__solarisPrivateHide` callback is sent by the non-active AppState handler (recovered function 6957); explicit manual lock does not send it. A numeric, nonprivate marker preserves only the chat destination and whether a reply was interrupted. The subsequent host home-route callback returns to chat after unlock. The code tolerates that callback before the unlocked view as well. Existing private draft/selection clearing remains in force.
- An interrupted request is explained accurately after unlock: the saved chat remains, the draft was cleared, and retry requires explicit input. No reply resumes automatically. Explicit manual lock, including a race with backgrounding, does not trigger automatic chat return.

## Reproduce and verify

Run from the restored `solaris-603-work` directory:

```sh
python3 Solaris-Android-R4/ui/apply-ui-repair.py
"$CODEX_PRIMARY_RUNTIME_NODE" --max-old-space-size=1024 Solaris-Android-R4/ui/format-ui.cjs
"$CODEX_PRIMARY_RUNTIME_NODE" Solaris-Android-R4/tests/ui/chat-ui.test.cjs
"$CODEX_PRIMARY_RUNTIME_NODE" Solaris-Android-R4/tests/ui/chat-ui.test.cjs Solaris-Android-R4/ui/sanctuary.compact.html
```

The tests execute the actual HTML script with synthetic DOM/bridge objects. They retain the 603 diagnostic, proof and privacy checks and add navigation settlement, notice ownership, matching completion, explicit source selection and background/manual-lock boundaries. `UI-TEST-RESULTS.json` and `UI-COMPACT-TEST-RESULTS.json` record the exact tested hashes.

The pinned formatter performs local binding renaming and whitespace formatting, with no expression optimization. Complete binding-normalized JavaScript trees and CSS trees must match; both embedded images are restored byte for byte. `UI-FORMAT-CHECK.json` records those proofs. The host packager must independently verify the UTF-16 slot size and exact final packaged bytes.

These tests do not prove Android layout, model speed, Android background execution or persistence of unfinished messages across lock/process death. This repair restores the existing saved chat view and clarifies interruption; background generation and encrypted pending-message persistence remain separate work.

The return marker deliberately retains no owner identifier. If a different vault is restored while this same WebView remains alive, the marker can at most reopen that vault's current chat view and show a stale interruption notice. It cannot restore the prior owner's draft, selected sources, history, permission or inference proof. No verified separate owner-replacement callback was available to distinguish this cosmetic case without retaining identity across lock.
