# Solaris V6 A1 lifecycle integration candidate

This checkpoint advances the recovered V6 AI repair with a small executable lifecycle admission helper and targeted host tests. It also retains the previous UI repair with two corrected Health Connect explanations. It is new source-independent code, **not** a reconstructed native project or a newly built APK.

Start with `CONTRACT-A1-RECOVERED-LIFECYCLE.md`, `INTEGRATION.md`, `review/API-EVIDENCE.md` and `review/INDEPENDENT-REVIEW.md`.

## Code and verification

- `src/active-qvac.mjs`: confirms the SDK is active before one dispatch; checks current authority throughout; abandons late results; prevents duplicate admission while timed-out native work remains unsettled. No storage, downloader, key access or model retry.
- `test/`: 18 targeted host cases using the exact recovered SDK lifecycle module/handlers with explicit logger/error and resource test doubles. They exercise the suspected startup boundary, not a recorded trace of the physical phone.
- `fixtures/qvac-0.18.2/`: unchanged, hash-checked recovered lifecycle code and schemas. The actual SDK public `state()` returns a string; resume/suspend return void. Compiled API excerpts substantiate that distinction.
- `ui-followup/`: full replayable HTML candidate, retaining dimmed Home and prior error/read-state repairs; two English/Spanish permission/data claims corrected. Its existing suite passes 120 assertions. No UI service behavior changed in this follow-up.
- `evidence/`: exact commands, exit codes, input/source hashes, build decision and file manifest. No native dependency installation or framework change.

From this directory:

```sh
node --experimental-vm-modules --test test/active-qvac.test.mjs
node ui-followup/scripts/ui-repair-test.cjs
python3 scripts/verify-checkpoint.py
```

The Node VM-module flag is for the host test harness. Full SDK/Bare/RPC/llama.cpp, native Health Connect, voice and physical-phone behavior were not exercised. The latest UI candidate has no new browser screenshots; the prior checkpoint's browser evidence remains tied to its earlier copy/hash.

## Review outcome

An independent reviewer found that setTimeout alone could not enforce an elapsed budget when JavaScript stalled. The final helper checks a monotonic clock across awaited boundaries, before dispatch and before release, and rejects missing/backwards clocks. It retains ownership until underlying work settles. See the independent review for the exact reviewed source hashes and decision.

## Build status and continuity

The newest verified APK remains V6 Sanctuary code 600, SHA-256 `4ac6a72c864118ec548ee5c05738c814b6e519f82b01a7d358d24952b900c518`. No new APK/code, signing operation, installation, record or key change, model redownload, commit/push/merge or deployment occurred.

Original native source/build configuration, complete lockfile and matching signing environment remain absent. Decompiled code and these host tests do not restore that build path. The existing service queue, cancellation policy, worker generation and commit guards must be preserved when integrating into actual source. Do not substitute D4/V5-B, bypass lifecycle checks, or use another signer/package to produce an apparently compatible release.

This isolated local workspace uses unborn branch `codex/a1-recovered-lifecycle`, with no HEAD/tree/commit or remote. It is not a canonical Android repository. Identity/GPS fixtures remain separate proposals; no native identity/P2P dependencies or financial behavior were added.
