# Feature status

Every row states a claim, its status and the evidence path behind it. Status
words have fixed meanings:

| Status | Meaning |
| --- | --- |
| **Working (604)** | Implemented in the 604 candidate and covered by dated handoff checks within their stated boundaries. |
| **Tested in isolation** | Verified by desktop/host tests with synthetic native or DOM boundaries. Not device-verified. |
| **Experimental** | Investigated, with results recorded. Not an accepted product behaviour. |
| **Planned** | Documented intent only. No implementation exists. |
| **Blocked** | Cannot be established until a named missing input is restored. |

**604 results below are attributed to the dated 604 handoff, except where a row
explicitly names a Sprint-01 or Sprint-02 run.** Sprint-01 reproduced the 604 host
bundle byte-identically and re-ran two of the original suites against it.
Sprint-02 re-proved that reproduction and built a bounded donor candidate on the
same path. Both sets of rows are marked. Everything else remains historical. See
[Build and test](BUILD-AND-TEST.md) and
[Host reproduction evidence](HOST-REPRODUCTION-EVIDENCE.md).

## Pocket LUCA chat

| Claim | Status | Evidence |
| --- | --- | --- |
| Recognized greetings, capability questions, common check-in questions and the small-step shortcut answer without a model wait, labelled guided | Working (604) | [604 build report](../Solaris-Android-R4/docs/Solaris-604-Build-Report.md); guided behaviour 34/34, adversarial classification 8/8 |
| Activity-history questions direct the user to real history instead of inventing activities | Working (604) | [604 build report](../Solaris-Android-R4/docs/Solaris-604-Build-Report.md) |
| Check-in answers quote the latest **selected** check-in's non-missing ratings; enabling a context category never silently shares its records | Working (604) | Guided behaviour and permission/source race tests, 34/34 |
| Without a selected check-in, LUCA explains what a check-in is and asks the user to choose Sources | Working (604) | [604 build report](../Solaris-Android-R4/docs/Solaris-604-Build-Report.md) |
| General open chat quality and speed | **Known limitation** | Same Qwen3-0.6B Q4 model, prompt and generation settings as 603. Can be slow, vague or make unsupported claims. The router covers recognized intents; it is not a universal factuality filter. |
| Phone response times for 604 | **Blocked** | Never measured. Needs a target device and explicit authorization. |
| Prompt/output-cap tuning improves ordinary answers | Experimental — **rejected** | 30 exact-model Linux experiments; no reliable benefit, some long answers truncated mid-thought. Changes were not adopted. |

## Waiting, authority and lifecycle

| Claim | Status | Evidence |
| --- | --- | --- |
| Completed replies clear their own stale error/progress notices; navigating away and back no longer leaves Stop/Working on a completed request | Working (604) | Independent UI tests 15/15 per source form; UI author tests 63/63 per source form |
| A matching new reply must exist before the submitted draft clears; unrelated errors and newly edited drafts are preserved | Working (604) | Independent UI tests |
| After unlock, the UI restores the saved chat view and explains interrupted replies without resubmitting the old question | Working (604) | Lifecycle and locking 10/10 |
| A reproduced race during asynchronous receipt authentication is closed for guided and generated replies | Working (604) | Independent deferred-MAC race tests 15/15 |
| Leaving the foreground locks the vault and cancels unfinished generation; an unsent question is cleared | Working (604) — **by design, not yet recoverable** | [Lifecycle assessment](../Solaris-Android-R4/lifecycle/LIFECYCLE-ASSESSMENT.md) |
| Durable encrypted pending-turn recovery / continuous background generation | Planned | Proposed protocol in the lifecycle assessment. Not implemented. |

## Build, packaging and identity

| Claim | Status | Evidence |
| --- | --- | --- |
| Package `org.solarishealth.edge.recovery`, version `6.0.4-preview.grounded-chat` / code 604 | Working (604) | [604 build report](../Solaris-Android-R4/docs/Solaris-604-Build-Report.md) |
| Signed APK SHA-256 `0e9a66da00cbe128851d981a9f9a3d9a1dbfe653f7a4ced93d638bc4d7d31827`, 242,638,023 bytes | Recorded | 604 build report |
| HBC SHA-256 `30be9989cc00299836715cc3de5cf3a2a75b00019bdf2f1b91629205f558d8b3`; source build repeated and produced identical bytes | Recorded (604) | 604 build report |
| Signature verified v2 against the **existing development identity**, certificate SHA-256 `fac61745dc0903786fb9ede62a962b399f7348f0bb6f899b8332667591033b9c` | Recorded (604) | 604 build report. This is a development fixture, **not** a production signer. |
| 599 preserved payload entries including all DEX and 51 native libraries; uncompressed, 16 KiB aligned | Recorded (604) | Final signed packaging, 1,675 independent checks |
| Structural host verification: four changed functions, 15,509 other function bodies/headers unchanged | Recorded (604) | 604 build report |
| No native vault, recovery, schema, key or model change in 604 | Recorded (604) | 604 build report |
| Complete native Gradle/application source build | **Blocked — source missing** | No original native Gradle app, original host `App.tsx`, complete native dependency lock/build graph or complete editable native library sources were found. See [`handoff/SOURCE-MAP.md`](../handoff/SOURCE-MAP.md). |
| 604 **host bundle** reproducible | **Re-run 18 Sep 2026 — byte-identical** | Reproduced as `30be9989…` from the exact 603 host bundle and pinned compiler via `tools/host/hbc-input-wrapper.py`. Host bundle only; **not** an APK and **not** a native build. |
| Original 34 host cases | **Re-run 18 Sep 2026 — 34/34 pass** | Against the reproduced bundle in actual Hermes, synthetic native/storage/model seams, disposable copy. |
| Original 10 lifecycle cases | **Re-run 18 Sep 2026 — 10/10 pass** | Same conditions. |
| Full A605 candidate router integrated into the host | **Measured — does not fit** (Sprint-02) | Lowered for Hermes (`tools/host/lower-candidate.cjs`) it is 80 functions, with 18 `Catch`, 27 closures, 14 environments, 3 regexps and 7 literal buffers, against a one-function donor contract. Unlowered, `class` is rejected. See [host reproduction evidence](HOST-REPRODUCTION-EVIDENCE.md). |
| Bounded A605 host donor (F04 punctuation and polite wrappers, F05 whole-request check-in, the app's quick actions) on the actual host | **Tested in isolation — Sprint-02, 25 Sep 2026** | The frozen inliner accepts it (88 registers, the measured budget). Candidate host bundle `105ade31…`: original host cases 34/34, lifecycle 10/10, input probes 8/8, donor proof 29 cases with 74/74 pre-registered fields. Shipped 604 reproduces F05 on the same host (69/69). F05 is fixed for the **check-in branch only**. Shipped's history and records-select branches are kept exactly, including their pre-existing reply to a clinical clause inside a sleep question. A check-in question outside the accepted forms now takes the model path (deliberate, pinned). The first revision widened those shipped branches and was corrected after independent review (S2R-1, S2R-2). Desktop Hermes, synthetic seams, disposable copy. **No new A605 APK was built.** [Bounded donor proof](HOST-REPRODUCTION-EVIDENCE.md#bounded-donor-proof). |
| Welcome/onboarding refresh (contract of 18 Sep 2026): EN/ES welcome, returning unlock, three chapters, optional LUCA branch, vision panel labelled Planned | **Tested in isolation — candidate only, not integrated** | `candidate/onboarding/`: 4,220 assertions; 34/34 mutations caught. A browser preview in headless Chromium ran 680 page runs at 320–390 px, EN/ES, 100/200% text and both motion modes, with 0 overflow and every target at least 48 px. It is not TalkBack, not a device and not the WebView. [Visual QA](onboarding/VISUAL-QA.md) · [host trace](onboarding/HOST-TRACE.md). |
| Welcome/onboarding refresh inside the current app | **Blocked — does not fit** | 35,687 characters minified against the 968-character UI slot (36.9×). The real slot check refuses it. Needs native UI source (F01). No UI byte of the host bundle or APK changed. [U1 measurement](HOST-REPRODUCTION-EVIDENCE.md#welcomeonboarding-against-the-ui-slot-u1). |
| Lone UTF-16 surrogate in chat text is handled | **Not working — SP2-HOST-01** | The host throws `URIError` before any model call or write, identically on 603, 604 and the candidate. Nothing is persisted, but the error is unnamed. |
| APK packaging reproducible in this repository | **Blocked — inputs excluded** | Needs the reference APKs and packaging tools. The host-bundle reproduction does not cover APK assembly or signing. |
| Android WebView rendering, native storage durability, on-device acceptance | **Blocked** | Desktop synthetic DOM/host tests do not substitute. Requires a device and separate authorization. |

## Product direction — not implemented

| Claim | Status |
| --- | --- |
| P2P practitioner exchange, scoped record delivery, acknowledgements | Planned |
| Own-device encrypted synchronization | Planned |
| Breez SDK Spark Bitcoin/Lightning wallet | Planned — no integration in 604 |
| Tether WDK stablecoin wallet | Planned — chain, token and account model undecided |
| GPS contribution evidence, allocation and settlement | Planned — design only, no reward engine, no funds movement |
| BTC Map sovereignty discovery | Planned — optional read-only adapter after contract review |
| Practitioner trust / credential badges | Planned — no trust evidence system exists |
| Production or patient release readiness | **Not established.** See [`handoff/PRODUCTION-GATES.md`](../handoff/PRODUCTION-GATES.md). |

## Repository-level findings from this import

| ID | Finding | Status |
| --- | --- | --- |
| `AND-IMP-01` | `solaris-603-native-probe/recommended-request-builder.cjs` is truncated at line 10 (`SyntaxError: Unexpected end of input`). It is retained probe evidence, imported byte-for-byte, and was **not** repaired. | Open — triage in [`docs/workflow/STATUS.md`](workflow/STATUS.md) |
