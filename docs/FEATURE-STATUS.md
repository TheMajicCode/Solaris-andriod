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

**All 604 results below are attributed to the dated 604 handoff. This repository
did not rerun them.** The only checks this repository has executed are in
[Build and test](BUILD-AND-TEST.md).

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
| HBC reconstruction and packaging reproducible in this repository | **Blocked — inputs excluded** | Needs reference APKs and the pinned host compiler/parser/packaging tools from the build-input archives. |
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
