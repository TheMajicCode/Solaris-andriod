# Solaris 603 — Pocket LUCA chat repair

Signed candidate **603**, version `6.0.3-preview.pocket-chat`, is built from the verified 602 APK. The build repairs the normal-chat request format, adds limited recent context and clearer feedback, and retains open chat, guided tools and the existing Qwen3 0.6B Q4 model.

The native tests reproduced one concrete reason a greeting could fail: the original request constrained output to generic JSON, while the app required specific answer and citation fields. The model sometimes returned a JSON object with the wrong fields. The corrected request constrains those fields before generation and uses a shorter, separate system/user prompt for zero-source chat. Selected-record requests retain the original guarded prompt and validator.

What changed:

- Short English/Spanish chat requests use the correct nested SDK response schema. Citations and optional actions are limited to the current compiled request.
- One recent, completed, source-free exchange can be used during the current unlocked session. A whole pair is omitted if it exceeds 300 encoded bytes or the 1200-byte task budget. Older-session records and source-bearing replies are excluded; saved message text and record formats are unchanged.
- Explicit response-length termination is reported as a limit, even if the partial result happens to form valid JSON. Normal SDK completion without a stop reason remains accepted. Existing cancellation and foreground/permission checks retain priority.
- Chat keeps the draft on failure, shows elapsed waiting, and displays specific sanitized timeout, limit, format or runtime errors. A loaded model/setup greeting is distinguished from a newly completed normal-chat reply. Generated and predefined replies retain separate labels.

Verification completed for the final candidate:

| Check | Result and boundary |
|---|---|
| Actual Hermes DailyService | 94 cases passed: original compiler/parser, state validation, IDs, retry, persistence, consent, sources and history boundaries; native storage/model mocked. |
| Actual Hermes QvacService | 24 cases passed and independently rerun: request fidelity, repeated replies, private thinking exclusion, completion, length limits and retained 602 guards; native events/timers synthetic. |
| UI | 42 checks passed on each readable and compact script; independent review, JS/CSS equivalence, image preservation and actual HTML-slot fit. |
| Exact model/native addon release | Five synthetic requests passed exact recovered SDK validation and native Linux generation: English greeting, Spanish greeting, a name supplied in the message, limited prior-pair recall, and an approved synthetic check-in with citation. |
| Binary compatibility | Only three existing host functions and the HTML string changed inside the bundle; original instructions/guards retained. No new host function or string IDs. |
| APK packaging | All 599 other payload entries preserved; all 51 native libraries unchanged, uncompressed and 16 KiB aligned. Manifest/config changes are version metadata only. |
| Signing | Independent final verification passed: original certificate, valid v2 signature and approved payloads. Signing was gated to the reviewed source, bundle, unsigned APK, declaration and independent reviews. |

The package remains `org.solarishealth.edge.recovery`. DEX/native vault and model components are byte-identical to 602. Vault/recovery formats, record IDs, existing valid models and signing identity are preserved. Nothing was installed, reset, pushed or deployed; phone data and keys were not accessed or changed.

This is an APK-derived candidate with complete editable repair source and preserved reconstruction inputs. The missing complete native Android project and broader LUCA resume repair remain unfinished. Browser/device rendering and actual phone inference are unverified. Linux tests do not diagnose or predict the approximately 120-second wait observed on the phone.

Realistic expectations remain modest: greetings and short, focused questions are the tested use case. The model can still give awkward wording, echo broader capability questions, or mishandle complex instructions. Prior-turn-only numbers still fail the original grounding policy. Valid JSON and citation IDs do not prove factual accuracy or resistance to instructions embedded in source text. This build preserves those validators and makes failures clearer; it does not establish general assistant-quality conversation.

After updating, a normal chat reply to **Hello** with zero selected sources is the useful first check. Setup alone is not proof that normal chat works. If chat still fails, its specific diagnostic code can distinguish the remaining failure stage without exporting personal records. Keep the existing app installed and its data intact.

Files:

- [Solaris-V6.0.3-Pocket-Chat-Candidate.apk](sandbox:/workspace/scratch/7a1f5a13b137/deliverables/Solaris-V6.0.3-Pocket-Chat-Candidate.apk)
- [Solaris-603-Update.zip](sandbox:/workspace/scratch/7a1f5a13b137/deliverables/Solaris-603-Update.zip) — the same signed APK compressed for download.
- [Solaris-603-Editable-Reconstruction.zip](sandbox:/workspace/scratch/7a1f5a13b137/deliverables/Solaris-603-Editable-Reconstruction.zip) — earlier editable reconstruction plus all 603 source, tests, reviews and evidence.
- [Solaris-603-Build-Inputs.zip](sandbox:/workspace/scratch/7a1f5a13b137/deliverables/Solaris-603-Build-Inputs.zip) — pinned reference APKs, build tools and offline native probe runtime.
- [Solaris-603-Model-Test-Input.zip](sandbox:/workspace/scratch/7a1f5a13b137/deliverables/Solaris-603-Model-Test-Input.zip) — the unchanged model for offline test reproduction; not needed to update the app.
- [Solaris-603-SHA256SUMS.txt](sandbox:/workspace/scratch/7a1f5a13b137/deliverables/Solaris-603-SHA256SUMS.txt)

Signed APK SHA-256: `25d3642ab5f45986e5dfcfe5c5413d40982c6142eb703adffc391f9d3b033227` (242,588,871 bytes).

Final Hermes SHA-256: `b8ac7d1b58d9e8ea6eadd25de516e35842aea14e4b849462664bb3200fedc990`.

Existing certificate SHA-256: `fac61745dc0903786fb9ede62a962b399f7348f0bb6f899b8332667591033b9c`.

Raw signing keystore/password inputs are excluded from download archives. Exact public-fixture provenance, acquisition/verification code and certificate evidence are retained. A truncated intermediate unsigned copy was rejected and regenerated before approval; only the final signed APK identified above is delivered.
