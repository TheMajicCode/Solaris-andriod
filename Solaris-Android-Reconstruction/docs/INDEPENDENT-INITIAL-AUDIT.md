# Independent compatibility audit — Solaris controlled source reconstruction

Date: 2026-09-15. Read-only analysis of APK bytes and recovered evidence; no app changes, signing, installation, key operations or data migration were performed by this reviewer.

## Decision

The selected reconstruction reference is **code 601, 6.0.1-preview.sanctuary**, APK SHA-256 `228c3d9f282d716515e3640de2b13478a29e21c607293eaf589741ec6d34f183`. Code 600 is the forensic ancestor, not the next-build baseline. A complete compatible native source build is **not yet verified**. Recovered editable HTML and worker files can be retained directly; new vault/recovery/storage implementations cannot safely be substituted using string names or screenshots alone.

This reviewer independently compared all ZIP payload entries in the recovered code601 APK against the uploaded code600 APK. Exactly `AndroidManifest.xml`, `assets/app.config`, and `assets/index.android.bundle` differ. DEX and all native libraries match byte for byte. Thus native code600 evidence below also applies to the code601 native payload. The code601 report states all Hermes function ranges and all strings except the HTML string remain unchanged; root verification should retain the corresponding actual byte comparison evidence. The UI in code601 is the current UI reference. The AI lifecycle repair remains unintegrated.

## Evidence locations

Paths below are relative to `reconstruction-work/`:

- `Solaris-V6-APK-Recovered-Assets-and-Evidence/` (A): ancestor recovery, exact packaged DEX/Hermes, worker files and model notice.
- `Solaris-V6-Recovered-UI-Repair-and-Evidence/Solaris-V6-Recovered-Repair/` (R): native/Hermes focused inspection and readable prior UI patch.
- `Solaris-V6.0.1-Recovered-Code-and-Evidence/` (C): selected baseline's source-independent UI recovery/build evidence.
- `compatibility-code600-code601-entry-diff.json`: reviewer-computed independent APK-entry comparison.
- `compatibility-string-evidence.json`: fresh bounded-size strings recovered from exact ancestor Hermes and DEX. **Presence is not execution proof.** SDK registry strings include many irrelevant models; their presence does not authorize adopting them.
- `compatibility-dex-owner-candidates.json`: approximate const-string owner scan used to prioritize decompilation. This scans code units and is a candidate locator, not a full DEX verifier or control-flow analysis.

## Contracts established and unresolved

| Boundary | What the supplied evidence establishes | What remains unresolved / preservation requirement |
|---|---|---|
| Application identity | Package `org.solarishealth.edge.recovery`; code601 version above. Existing development signer public certificate SHA-256 `fac61745dc0903786fb9ede62a962b399f7348f0bb6f899b8332667591033b9c`. C reports matching pinned Expo signing fixture. | Current signing capability and every reconstructed compatibility gate must be independently verified before signing. A public certificate alone does not prove available private key. Do not create another signer or infer vault key equivalence from APK signer equality. |
| Native preservation | Code600 and code601 DEX/native library bytes are identical by this reviewer's comparison. | New source compilation changes byte identity; compatibility must then be established through reviewed source contracts and tests, not old payload hashes. |
| SQLCipher requirement | A `packaged/assets/app.config` configures expo-sqlite with `useSQLCipher: true`; app includes SQL text for singleton `vault_state(id,revision,payload)`, `core.db`, DELETE journaling, MEMORY temp store and secure_delete. | Need exact database directory selection, key derivation/application timing, PRAGMAs, encryption version/cipher options, open/failure handling, transaction/revision semantics. Do not create an ordinary SQLite database named `core.db` as replacement. |
| Native vault envelope | DEX contains `solaris-vault/v1`, `solaris.vault.wrap.v1`, `solaris-native-owner/1`, `solaris-owner-keys/1`, `solaris-owner-recovery/1`, `solaris-core-payload/1`. L5.s owns related strings; L5.m registers `SolarisVault`. | Names are candidate contracts, not sufficient schemas. L5.s/L5.m must establish directories, files, field types, wrapped plaintext, creation/restore prerequisites, authentication policy, deletion behavior and authority/session gates. No migration/rewrapping authorized merely because a reconstructed component cannot read a fixture. |
| Cryptography | DEX L5.b references AES/GCM/NoPadding and PBKDF2WithHmacSHA256. L5.s references AndroidKeyStore and candidate alias `solaris.vault.wrap.v1`. | Exact salt/nonce lengths, encoding, tag bits, KDF rounds/key size, AAD, version checks, key use/auth settings and failure ordering are not established by the selected excerpts. Do not guess conventional defaults. |
| Recovery files | Native strings identify `Solaris-recovery.solaris-core`, owner recovery/core payload version 1; UI distinguishes preview from restore and says restore only into an empty installation with original Solaris ID and new device identity. | UI text is intended behavior, not proof of completed recovery interoperability. Need native SAF export write/read-back verification, parser/size bounds, passphrase handling, MAC/authentication validation and restore commit ordering. Preserve existing owner ID, records, receipts; retain intended inactive AI permissions on restore only after exact implementation is proven. |
| Health import records | Hermes R `function-14856.hasm` establishes `{id: 'health_' + nativeVault.newId(), snapshot}` appended to `healthImports`; revision and authorityEpoch increment; state save is queued with captured session and prior revision. | `newId()` algorithm and duplicate predicate helper #14857 are not in the focused extracts. Preserve all existing IDs verbatim; do not derive replacements from timestamps or snapshot order. Need full duplicate behavior and record validators. |
| Health receipts | Same #14856 builds JSON `solaris-local-action/1`, kind `healthImport`, result `saved`, timestamp; experienceRecord `{collection:'healthImports', id, sha256:digest(JSON.stringify(importRecord))}`; receipt ID is `receipt_`+native newId and body is MACed by nativeVault.mac. | JSON ordering/encoding, digest implementation and native MAC key/algorithm are compatibility inputs. Do not reconstruct bodies with reordered serialization or claim cryptographic authenticity from string equality. |
| Health bridge | HealthService.read checks session/epoch/range/permissions; bridge saves snapshot then returns complete vault view. UI reads `healthImports[].snapshot`. Native snapshot schema is `solaris-health-snapshot/1`. | Permission grant alone is not a read/import. Preserve null aggregates, provider IDs, timestamps, origin and offsets. Selected review is not evidence that a physical provider returned data. |
| Other record families | Hermes includes questionnaire_, measurement_, owner_, key_, device_, agent_, plan_, habit_, habitlog_, session_, attachment_, event_, message_, action_, source_ and restore_ names. It contains daily-state versions 1/2/3, experience/1, questionnaire-catalog/1, field/2 and attachment/1. | Presence alone does not prove all construction/migration rules. Inspect validators, migrations and all writers before implementing; retain older accepted schema versions and unknown permitted fields where the original contract requires. Do not collapse mixed record versions into the newest by assumption. |
| Model identity | Model notice pins `Qwen3-0.6B-Q4_0.gguf`, source revision `50968a4468ef4233ed78cd7c3de230dd1d61a56b`, SHA-256 `33bcc57074ec7b6eada5a90651ee546ec0c2b271002c22baf9f1b2dd1e8f75cb`. Weights are not bundled. | Need native exact expected length/header validation, canonical storage path, partial-file/ready semantics and import/download rules. Preserve already-valid model bytes; lifecycle failure does not justify deletion or re-download. |
| Model storage/recovery | K5.A0 candidates own `solaris-qvac-models`, `solaris-qvac-download.json`, `solaris-model-transfer-v2`, `solaris-models`; K5.J0 owns `solaris-runtime-recovery-v2`. Hermes also includes `solaris-model-preparation-v1.json`, `solaris-model-preparation/1`, `solaris-qvac-cache`. | Establish whether each is filesystem path, preference namespace or other identifier, and versioned contents. Runtime recovery is distinct from user vault recovery; do not conflate them. |
| Runtime readiness | R Hermes evidence proves lifecycle queue, changed-queue wait loop, worker readiness/blocked guards, AppState background cancellation; worker SDK separately gates inference to active lifecycle state. | Full coordinator source and native event ordering remain missing. Preserve all authority/epoch/foreground checks, confirm SDK active state before inference, and do not blindly replay potentially executed operations. Valid transfer/checksum is not inference readiness. |

## Precisely missing editable source/build areas

1. App.tsx/root React component and the full WebView message/response dispatcher; adapters tying UI to vault, input, Health, QVAC and AppState.
2. QvacService/runtime start/stop/recovery policy, native/Bare transport ownership, lifecycle scheduling and per-operation cancellation/result-release checks.
3. VaultStore state schemas/validators, revision transactions, ID generation call sites, receipt/authority logic, recovery adapters and all accepted historical migrations.
4. Native SolarisVault Kotlin modules, key wrapping, owner/recovery envelopes, SAF export/restore, authenticated attachment operations and secure storage paths. Prior selected native audit recovered SolarisRuntime and Health classes, not this layer.
5. Native model store/recovery/lifecycle implementation and exact main/application registration; native Health input handling must preserve the proven reader.
6. `plugins/withNativeSafety`, Expo module registrations/codegen, Gradle/configuration/proguard/resource inputs and native build modifications; dependency package declarations alone do not replace these.
7. Full native resolved lockfile and dependency patch history. The code601 UI-tool lock is only for minifier tools. Preserve original QVAC/Bare extracted dependency files with provenance; do not label them a full npm-installable root source tree.
8. Original test implementations. The recovered root package.json lists extensive recovery/runtime/vault/authority/tracking/questionnaire/voice/health/attachment/experience/scroll/history tests, but the references do not recover their contents or prove their results.

## Prioritized inspection

1. **L5.s**: owner directory/envelope, Keystore alias/config, creation/restore/open semantics.
2. **L5.b**: crypto/KDF encoding and exact constants.
3. **L5.m and nested classes**: bridge surface, authenticated attachment checks, SAF export and restore ordering; selected matching classes include h.a, f, m and o.
4. **K5.A0**, then **K5.J0**: canonical model files/metadata and runtime failure recovery.
5. Full Hermes vault module: validState/migrations/newId/persist/open/export/import; get code601 disassembly or prove unchanged code slices.
6. Full Hermes QvacService/bridge module before integrating any lifecycle helper.

## Targeted compatibility tests required before a signed source candidate

These are acceptance requirements, **not claimed executed tests**. Use isolated synthetic fixtures; no user vault or phone writes.

- Decrypt/parse fixed historical-format vault/recovery fixtures with known synthetic keys and verify every owner ID, record ID, revision, receipt body/MAC and attachment hash; re-export and validate through the old reader or an independently verified equivalent. Test wrong passphrase, tampered ciphertext/tag/AAD, malformed sizes, unsupported versions and failed auth: no partial mutation or replacement file.
- Existing-vault open must use exact directory and alias. Missing/unusable key must fail closed without generating a new identity, resetting storage or overwriting original files. Verify SQLCipher key usage and crash/transaction/revision conflict behavior.
- Recovery preview must be read-only; restore must reject a populated installation; failed commit must leave the original empty state or prior state intact. Verify retained original owner ID versus intentionally new device identity exactly as original code defines.
- Existing health snapshot duplicate import must preserve IDs and return the vault view. A new import must preserve provider record IDs, null values and canonical receipt serialization. Session lock/permission revocation before and after async read/MAC/persist must prevent abandoned results becoming visible.
- Valid model fixture must be reused without transfer/deletion. Partial and mismatched model fixtures must follow original validation/recovery rules, and a failed SDK resume must leave a valid model unchanged.
- Worker startup pending -> background -> foreground -> startup completes suspended: one serialized, verified resume before load/inference or truthful refusal. Append transitions during wait; suspend/resume failures; lock/navigation/permission changes; ensure no stale result release, no unbounded retries and no model request replay without proof it was rejected before admission.
- UI regression replay against code601 readable source: unchanged bridge arguments, authority-sensitive flows, questionnaires, IDs, input drafts/focus and health view shape. Synthetic browser success is not Android/native or in-place upgrade success.
- Build gate: pinned editable inputs and lock resolved; independent source review; no signer/package/backup/cleartext/permissions/ABI drift; official APK signature+manifest+alignment checks; no installation as part of this authorized cycle. Physical upgrade and private-data retention remain explicitly unverified until separately authorized device testing.

## Review conclusion

A truthful bounded deliverable is an editable reconstruction workspace containing the exact recovered current UI and worker, provenance, compatibility contracts, missing-source inventory and unintegrated reviewed components. It must not be described as complete original source or as a compatible native update until the unresolved vault/crypto/storage/coordinator/build contracts have been established and targeted tests pass. The missing source problem is reduced by decompilation; it is not resolved by wrapping the old APK or creating a fresh shell with the same package name.
