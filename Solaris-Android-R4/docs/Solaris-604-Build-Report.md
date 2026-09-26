# Solaris604 build report — Grounded Chat candidate

Signed candidate604 is complete. Independent functional, UI, bridge and final packaging verification passed within the boundaries below. The APK remains uninstalled by this workflow.

## What changes for the user

- **Common questions avoid the model wait.** Greetings, capability questions, common check-in questions and the small-step shortcut now use a guided answer. Activity-history questions direct the user to actual history instead of inventing activities. These answers are labelled guided; they are not presented as model inference.
- **Check-in answers use selected records.** The answer quotes the latest selected check-in's nonmissing ratings and offers a focused reflection or small step. Without a selected check-in, LUCA explains what a Solaris check-in means and asks the user to choose Sources. Enabling a context category never silently shares its records.
- **Waiting controls settle correctly.** Completed replies clear their own stale errors/progress notice. Navigating away and back no longer leaves a completed request showing Stop/Working. A matching new reply must exist before the submitted draft clears; unrelated errors and newly edited drafts are preserved.
- **Unlock returns to saved chat.** After leaving chat and unlocking, the UI restores the chat view and explains interrupted replies. It does not automatically resubmit an old question.
- **Saving checks authority again.** A reproduced race during asynchronous receipt authentication is closed for both guided and generated replies.

## What remains open

General open chat retains the same Qwen3-0.6B Q4 model, prompt and generation settings. It can still take a long time, be vague or make unsupported claims. The router covers recognized common intents; it is not a universal factuality filter. Phone response times for 604 have not been measured.

Leaving the foreground still locks the vault and cancels unfinished generation. An unsent question is still cleared and must be typed again. Completed chat remains stored. Continuous background generation and an encrypted pending-turn/retry protocol require further work; the lifecycle assessment contains the evidence and proposed protocol. No private draft or source authority is retained in browser storage to simulate recovery. A public numeric navigation marker can produce a stale generic notice after a hypothetical vault-owner replacement; it exposes no prior private data and performs no replay.

Full native Android source reconstruction, Android WebView rendering, native storage durability and on-device acceptance are not established by these tests. This remains a controlled APK-derived candidate, not a complete native source rebuild.

## Why these changes address the recording

The recording shows roughly 49,56,55 and93-second waits. Chat repeatedly shows zero selected sources, while generated text invents activities and describes an unrelated administrative check-in. A completed response can retain waiting/Stop controls for over 15 seconds, and generic “Still working” notices survive completion. Permission-category selection in the video does not select records for a chat request.

The new guided route avoids model preparation and completion entirely for its supported questions. This is verified in executable host tests, not a claimed milliseconds-per-reply phone benchmark. Thirty exact-model Linux experiments compared shorter prompts and output caps; ordinary answers gained no reliable benefit and some long answers were cut off mid-thought. Those experimental changes were rejected. The603 request helper, model worker and native libraries remain unchanged.

## Validation and independent review

| Check | Result | Scope |
| --- | --- | --- |
| Open-chat regression |94/94 pass | Actual Hermes DailyService/compiler/parser with synthetic native boundaries |
| Guided behavior and permission/source races |34/34 pass | Actual host code; selected fields, no inference, current authority, IDs and receipts |
| Independent deferred-MAC races |15/15 pass | Guided and generated persistence, all tested revocation boundaries |
| Adversarial helper classification |8/8 pass | Excludes unrelated fields/categories and instruction-bearing dates |
| Lifecycle and locking |10/10 pass | Actual host lifecycle/lock ordering with synthetic native interfaces |
| Actual bridge orchestration |13/13 pass | Exact F6928/F6929 in a test-only lexical wrapper; guided preparation bypass and existing guards |
| UI author tests |63/63 per source form | Readable and compact real UI scripts with synthetic DOM/bridge |
| Independent UI tests |15/15 per source form | Completion, draft, navigation, privacy and notice boundaries |
| Structural host verification |Pass | Four changed functions;15,509 other function bodies/headers unchanged; branches/registers/43 handlers validated |
| Final signed packaging |1,675 independent checks pass | Direct ZIP/AXML, exact reviewed HBC, package, payloads, alignment and signature |

The source build was repeated and produced identical HBC bytes. The UI minifier preserved normalized JavaScript/CSS syntax trees and both original embedded image assets; the original fixed UTF-16 UI slot retains 1,936 bytes spare.

The bridge wrapper changed only test bootstrap functions and never entered the release artifact. Its initial bootstrap failure was corrected within the test fixture; final 13 cases passed. This is additional evidence after the original frozen functional approval. There was no Android installation, React mount or phone benchmark in that fixture.

## Compatibility and identity

| Item | Verified result |
| --- | --- |
| Package |org.solarishealth.edge.recovery |
| Version |6.0.4-preview.grounded-chat / code 604 |
| Signed APK size |242,638,023bytes |
| Signed APK SHA-256 |0e9a66da00cbe128851d981a9f9a3d9a1dbfe653f7a4ced93d638bc4d7d31827 |
| HBC SHA-256 |30be9989cc00299836715cc3de5cf3a2a75b00019bdf2f1b91629205f558d8b3 |
| Existing certificate SHA-256 |fac61745dc0903786fb9ede62a962b399f7348f0bb6f899b8332667591033b9c |
| Signature |Verified v2, existing development identity |
| Preserved payloads |599 entries, including all DEX and 51 native libraries |
| Native packaging |Uncompressed and aligned to 16 KiB |
| Manifest/config |Only version name/code changed; package, permissions and components preserved |
| Storage/model |No native vault, recovery, schema, key or model change |

Signing was gated by exact bundle/APK/source-script hashes and independent approvals. The user explicitly authorized this new build; no further approval was required. No installation, reset, key replacement, push or deployment was performed.

## Deliverables and reproduction

`Solaris-V6.0.4-Grounded-Chat-Candidate.apk` is the direct update. `Solaris-604-Update.zip` contains the identical APK, compressed to about78.3MB for download. Extract it and choose Update while keeping the existing app and data.

`Solaris-604-Editable-Reconstruction.zip` merges the complete saved 603 editable checkpoint with 604 source, tests, reports and final build evidence. Reproducible test-only binary clones and intermediate build copies are omitted; their source generators remain. The source README gives the exact build command.

`Solaris-604-Build-Inputs.zip` adds the exact signed603 baseline APK. The unchanged tools/runtime remain in the already saved `Solaris-603-Build-Inputs.zip` (SHA-256 0745458668eb3ff149fa881b647095a74865b97fba84f39fc88297becb49019d). The already saved `Solaris-603-Model-Test-Input.zip` is needed only for model experiments (SHA-256 d6a1d5640ce37e9aa2ff2aee56d1f78534ebd6b93e80dc6fe262c851a122f9da). Input requirements are pinned in the 604 archive. Raw signing credentials are excluded.

All current deliverable hashes are in `Solaris-604-SHA256SUMS.txt`. Independent reviews are under `review-functional`, `review-packaging` and `latency`; the background/pending-turn assessment is under `lifecycle`.
