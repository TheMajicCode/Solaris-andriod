# Solaris Android candidate603 — Pocket chat repair

This is an editable, reproducible, APK-derived update to verified build602. It is not a reconstruction of the missing complete native Android project. The executable host and UI changes are supplied here alongside their compiler/patching tools, reference evidence, targeted tests and independent reviews. The earlier reconstruction remains under `Solaris-Android-Reconstruction` and `Solaris-Android-R2`.

The user authorized this build on 2026-09-16 after a failed ordinary greeting, a successful setup greeting, and an assessment of realistic tiny-model capabilities. Existing authorization requires preserving package identity, signer, vault/recovery formats, record IDs and valid models; independent review and targeted tests; no installation, reset, key change, push or deployment. No additional features from the broader Solaris/LUCA vision are inferred here.

## Implemented scope

- Only normal private conversation uses the corrected nested SDK JSON schema. Required answer and citation fields are constrained before generation, with refs/actions limited to those compiled for the current request. Other local task requests retain their existing format.
- Zero-source short chat receives a concise system message and the actual user message as a separate role. The app's English/Spanish locale is preserved. Selected-fact conversation retains the original guarded prompt.
- Generation uses the same pinned Qwen3 0.6B Q4 model. Per-request reasoning budget is zero; unexpected thinking events are separated and are not displayed. Existing stream settlement, output limits, validation, cancellation and authority checks remain in force.
- A conversation final result explicitly marked `stopReason: 'length'` now fails with the existing typed `OUTPUT_LIMIT` runtime error after the existing eligibility check. Normal completion with no stopReason remains valid; other local tasks retain their original behavior. This guard is editable in `tools/build-chat-bundle.py` and has focused actual-Hermes tests.
- One completed source-free user/assistant pair may be included after a new successful reply during the current unlocked session. The pair must fit 300 encoded bytes; the whole original task prompt must fit 1200 bytes. Oversize history is omitted whole. Prior records present at scope initialization, source-bearing replies, guided replies and mismatched authority/permission provenance are excluded. No persistent memory format or saved message text is changed.
- Finite error codes replace the blanket normal-chat failure at the host boundary; unknown/raw details stay generic. The UI distinguishes timeouts, invalid results and known runtime errors, retains drafts, shows elapsed waiting, and distinguishes loaded/setup status from a newly completed normal-chat answer.

## Compatibility boundary

Only Hermes functions7337,14886,14894 and existing UI string12364 change. All original instructions are retained, including build602's dispatch guards. The generated helpers are inlined into existing function bodies without adding function IDs, environment slots, strings or native components. The HTML fits its original fixed UTF-16 slot; all other strings, including the QVAC worker, remain intact.

APK payload changes are the reviewed Hermes bundle and version metadata. All599 other payloads, including DEX/native libraries and vault/model components, remain byte-identical to602. Package ID remains `org.solarishealth.edge.recovery`. The original verified development certificate must be used; no substitute key is permitted. Signing is separately hash-gated after independent approval.

## Evidence and limits

The exact model reproduced a concrete original defect: generic JSON grammar can produce valid JSON without the fields required by the chat parser. The corrected executable request passes the exact recovered SDK schema and five native Linux test cases. Linux uses the published matching addon release; this does not prove Android timing or transport behavior. The approximately120-second phone wait is not diagnosed by these tests.

Actual-Hermes DailyService tests use original compiler/parser/state validation and explicit synthetic native storage/model boundaries. Independent tests cover authority, consent, source selection, IDs, retry, invalid output, history scope and budgets. UI tests execute readable and compact scripts with synthetic DOM/bridge objects. Chromium could not be retrieved, so browser and device rendering are unverified.

This model remains limited. A retained name can be answered with incorrect conversational perspective. General capability questions can be echoed. Previous-turn-only numbers still fail the original grounding policy. Valid JSON and citation IDs do not establish factual correctness or resistance to instructions embedded in quoted sources. Existing validators are preserved; none of these broader limitations is claimed solved. Full LUCA resume repair, missing native source reconstruction and on-device validation remain pending.

## Reproduce

Extract the editable reconstruction and build inputs into the same parent directory. The inputs supply the pinned602 APK under `reconstruction-inputs/baseline-602/`, matching Hermes compiler/runner and Android packaging tools. The source archive includes the final candidate evidence and all earlier recovered reference code. Native probe evidence/inputs use their own `solaris-603-native-probe` sibling directory.

From the shared parent:

```sh
python3 Solaris-Android-R3/tools/build-chat-bundle.py --baseline-apk reconstruction-inputs/baseline-602/Solaris-V6.0.2-Sanctuary-Guards-Candidate.apk --output-dir /tmp/solaris603-rebuilt-bundle
```

The result must match the final release declaration's Hermes SHA-256. See the exact test commands/provenance adjacent to each result and `docs/PACKAGING-SCOPE.md` for unsigned packaging. A new signed artifact requires a new concrete root gate bound to the actual reviewed bytes and scripts; copying an old gate is not an approval. Raw keystore/password files are excluded from archives; the pinned public-fixture acquisition and verification code is retained.

For user delivery, the APK and compressed download ZIP contain the same signed bytes. The ZIP is a delivery fallback, not a different build. Nothing in this workflow installs the app or modifies a phone's data.
