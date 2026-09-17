# Native compatibility evidence — code 601

Assessment date: 2026-09-15. Read-only reconstruction reference, not replacement Android code and not permission to sign or install.

## Provenance and coverage

The reference input is `Solaris-V6.0.1-Sanctuary-Recovery.apk`, SHA-256 `228c3d9f282d716515e3640de2b13478a29e21c607293eaf589741ec6d34f183`, 242,580,679 bytes. Its `classes.dex` is SHA-256 `c05b0cc8e3ed118b26023440896c946e2722e3dbb6fd017b61e56da581d53d75`, 5,903,400 bytes. All facts below concern these bytes, not independently observed phone state.

JADX 1.5.6 JAR SHA-256: `fe3e12c45acf75f92369685fd02d1d7a7323385dc725680a9b98a0dac0ea554b`. Downloaded distribution ZIP SHA-256: `545ea2be9c242511bc145755cf4bda2485ade42966e096f8b4d3da2a230e8974`.

`reference/native-decompiled/` contains all 254 DEX classes in K5, L5, and `org.solarishealth.edge.recovery`, including inner/synthetic classes. Two dependency files resolve charset and numeric constants. JADX renames case-colliding classes; `evidence/native-recovery/dex-class-coverage.json` maps original descriptors to actual filenames. Do not assume `K5.e0` is literally named `e0.java` in this output.

`evidence/native-recovery/` retains exact commands, tool/input digests, full log, source diagnostic inventory, output hashes, and raw fallback commands. The full decompile exited 3 with 21 dependency errors. The sole explicit `Method not decompiled` placeholder in retained Solaris classes is `L5.p.e(Context, Uri, p$a)`, the supporting-file attachment read path. Five fallback files preserve lower-level output for L5.p, L5.n$a, K5.A0, K5.C0 and K5.J0. They are diagnostic Java-like instruction dumps, not compilable source. K5.C0 contains unresolved `??` types; K5.J0's structured constructor contains a possibly uninitialized variable. These are decompiler problems and cannot be copied into a release.

## Device vault boundary: L5.s

Paths below are under the existing package's `Context.getFilesDir()`; changing the package or storage root would strand these files.

| Item | Recovered value / behavior |
|---|---|
| Vault directory | `solaris-vault/v1` |
| Sealed owner file | `keys.sealed`, read/write using Android `AtomicFile`; existence check also includes `keys.sealed.bak` |
| Core marker and database | `core.initialized` (one byte `01` when first marked), `core.db` |
| Keystore provider / alias | `AndroidKeyStore` / `solaris.vault.wrap.v1` |
| Wrapping key generation | AES, 256 bits, encrypt/decrypt purposes, GCM, no padding, user authentication required, 30-second authentication validity |
| Sealed owner encryption | `AES/GCM/NoPadding`; leading 12-byte IV; ciphertext and 128-bit tag follow; UTF-8 AAD exactly `solaris-native-owner/1` |
| Decrypted owner format | JSON `format: solaris-owner-keys/1` |
| Owner fields | `subjectId`, `ownerId`, `deviceId`, `databaseKey`, `ownerSecret`, `receiptKey`; optional `pendingRecovery` |
| Subject validation | `sol_[a-f0-9]{32}` |
| Owner validation | `owner_[a-f0-9-]{36}` |
| Three secret encodings | `databaseKey`, `ownerSecret`, `receiptKey` each lower-case hex matching `[a-f0-9]{64}` |
| Hardware assertion | Returned `hardwareSecurity` is literally `unknown`; do not advertise verified hardware backing |

The existing-vault path reads and decrypts sealed owner bytes and returns the stored subject, owner, device and database key; it does not allocate replacement IDs. Supplying recovery data while sealed keys exist is rejected with `VAULT_ALREADY_EXISTS`.

`L5.s.m(createAllowed)` refuses missing sealed keys when `core.db` or the initialization marker exists (`VAULT_KEY_UNAVAILABLE`). It reuses an existing wrapping alias. It refuses to generate an absent alias if sealed keys exist or creation is not allowed. `L5.s.l` rejects `core.initialized` without `core.db` (`VAULT_CORE_MISSING`). Preserve these fail-closed behaviors; unreadable storage is not evidence of an empty installation.

For a genuinely new vault, a missing subject becomes `sol_` plus 16 random bytes encoded as hex; new owner/device IDs use UUIDs. For a fresh recovery import, the owner capsule supplies the existing subject, owner, ownerSecret and receiptKey; code intentionally allocates a new deviceId and databaseKey and retains the remaining recovery JSON as `pendingRecovery` after removing `ownerCapsule`. That recovery path is not an in-place upgrade path and must never be used to reconstruct an existing installation's identity.

`L5.s.n()` exports `solaris-owner-recovery/1` with subjectId, ownerId, ownerSecret and receiptKey. It does not export the deviceId or databaseKey in that capsule. Database schema, record IDs/revisions and complete outer recovery payload are owned by the JS/worker layer and require separate evidence; this native file alone does not prove them.

## Portable recovery envelope: L5.b

| Byte offset | Length | Meaning |
|---|---:|---|
| 0 | 8 | ASCII magic `SVCORE1\n` |
| 8 | 32 | Random salt |
| 40 | 12 | Random AES-GCM IV |
| 52 | 4 | Big-endian plaintext byte length |
| 56 | plaintext length + 16 | Ciphertext followed by GCM authentication tag |

The complete 56-byte header is AAD. The plaintext limit is 1–16,777,216 bytes inclusive; exact total envelope length must be plaintext length + 72. Decoder range is 73–16,777,288 bytes inclusive. The code rejects mismatched magic, out-of-range lengths, and inconsistent total size before decryption.

Passphrase normalization is Unicode NFC. The normalized passphrase must contain at least 20 Unicode code points and at most 1,024 UTF-8 bytes. PBKDF2WithHmacSHA256 uses 600,000 iterations, the exact 32-byte salt, and a 256-bit derived key. AES/GCM/NoPadding uses a 128-bit tag. The derived key and temporary password char array are cleared in finally blocks. Do not replace this with raw SHA-256, different normalization, code-unit counting, trimmed passwords, different iteration counts, or guessed platform defaults.

`L5.b.e` performs strict UTF-8 decoding with malformed/unmappable input rejection. `L5.n` / `L5.n$a` contain additional JSON syntax validation, including depth/token limits and string/surrogate validation. All parser class representations are retained, but its exact control flow is not established: structured output appears to fall through after Unicode-escape parsing and contains an unreachable-looking object comma branch. These may be decompiler artifacts, not APK bugs. The raw `fallback/L5.n$a.java` is preserved for branch-level investigation; the parser is not approved for reconstruction. A generic permissive JSON parser is not established as compatible.

Receipt generation in `L5.s.i` is HMAC-SHA256 over the exact UTF-8 text, with at most 65,536 UTF-8 bytes, using the stored hex-decoded receiptKey; output is lowercase hex. `L5.b.f` verifies the same bytes, requires a 64-character lowercase-hex expected digest, and uses `MessageDigest.isEqual`. Canonical JSON generation is not defined by these native methods and must be preserved from worker evidence.

Numeric constants are resolved from retained `IntBufferBatchMountItem.java`: 128-bit GCM tag, 256-bit AES/PBKDF key. UTF-8 and US-ASCII are resolved from retained `p027d5/C0681d.java`.

## Model storage and transfer: K5.A0 / K5.C0

| Item | Recovered value |
|---|---|
| Model filename | `Qwen3-0.6B-Q4_0.gguf` |
| Expected bytes | 382,156,480 |
| Expected SHA-256 | `33bcc57074ec7b6eada5a90651ee546ec0c2b271002c22baf9f1b2dd1e8f75cb` |
| Pinned origin | `https://huggingface.co/unsloth/Qwen3-0.6B-GGUF/resolve/50968a4468ef4233ed78cd7c3de230dd1d61a56b/Qwen3-0.6B-Q4_0.gguf` |
| Published model location | `files/solaris-qvac-models/Qwen3-0.6B-Q4_0.gguf` |
| Metadata file | `files/solaris-qvac-download.json`, AtomicFile; fields `path` (file URI) and `checksum` |
| Transfer preferences | `solaris-model-transfer-v2`; persistent `id` and `manifest` |
| Private partials | `download.partial`, `import.partial`, `verified.partial` under `solaris-qvac-models` |
| DownloadManager destination | App external `solaris-models` directory; UUID `.partial` filenames |

Candidate discovery considers the published model, metadata-referenced file, private partials and owned DownloadManager completions. Matching file size alone only establishes a candidate. K5.C0 checks actual byte count and SHA-256 before successful publication. DownloadManager discovery requires the exact pinned source URI, a canonical destination whose parent is the app's external model directory, and the UUID-partial filename pattern.

Metadata-assisted reuse is bounded to the model filename under the app's canonical files/cache roots, a metadata file no larger than 4,096 bytes, the expected checksum and expected size. K5.A0's structured metadata method contains awkward control flow; preserved fallback must be consulted before implementing its branches.

Verification uses cancellation state and an optional `verified.partial` copy; successful publication uses `ATOMIC_MOVE` and `REPLACE_EXISTING`, then atomic metadata write. Decompiler evidence shows fsync, bounded stream chunks and cleanup paths in K5.C0, but its exception flow/type recovery is imperfect. No physical model was downloaded or verified in this work, and no owner-device model files were accessed. Preserve valid existing models and transfer identity; future code must not interpret a lost in-memory verification flag as authority to delete data or redownload.

## Native runtime crash guard: K5.J0 and J0$a

Preferences name is `solaris-runtime-recovery-v2`. Stored keys include `phase`, `armed`, `armedAt`, and `blocked`; each native runtime object gets a fresh diagnostic `runId`. Stage names are `bare-init`, `bare-start`, `bare-echo`, `sdk-bootstrap`, `sdk-heartbeat`, `model-load`, `model-ready`, `stream`, `stream-complete`, `unload`, `idle`. Armed stages are bare-init, bare-start, sdk-bootstrap, sdk-heartbeat, model-load, stream and unload.

API 30+ code queries historical process exits and checks matching package and an exit timestamp at/after armedAt. Existing blocked state survives restart. J0$a's decision helper requires a recognized previous stage and blocks if armed or if exit reason is Java crash (4), native crash (5), or ANR (6). The stage setter rejects unknown stages and rejects work while recovery is required. State is persisted with synchronous commit; failures throw `RECOVERY_STATE_FAILED`. Explicit recovery clearing resets blocked/armed and removes phase.

Do not infer full lifecycle ordering from this helper alone. Queue admission, worker cancellation, sessions and stale callback handling also live in other K5 classes and the Hermes coordinator. J0 structured constructor has a decompiler artifact; preserve the fallback and verify control flow before implementation.

## Host and bridge boundary

MainActivity retains the existing React activity integration, component name `main`, Expo delegate, theme setting and `super.onCreate(null)`. MainApplication constructs the Expo-wrapped React Native host; its nested host uses `.expo/.virtual-metro-entry` and generated package registration. All four app-package classes are retained. This establishes integration shape, not the missing Gradle graph, dependency locks, generated registration source, native ABI build flags, or an executable reconstructed host.

`L5.m$K` implements `nativeVault.newId` with `UUID.randomUUID().toString()`. This identifies the new-record ID source only; an existing-record reconstruction must retain already stored IDs rather than call it again.

K5/L5 include the native runtime, model transfer, voice, Health Connect and vault bridge implementations and callback classes. They are all retained for further reconstruction. Presence of readable classes does not establish working provider permissions, hardware authentication, process lifecycle behavior, or successful inference.

## Compatibility decision and required next evidence

**Native replacement compatibility is not yet verified. No signed candidate is justified from this recovery alone.**

Completed targeted evidence checks: pinned APK and DEX hashes; 254/254 target DEX classes mapped to recovered files; exact constants/charsets resolved; explicit failed-method and warning inventory; raw fallback for five critical classes. These are source-evidence checks, not Android runtime or cross-reader tests.

Remaining gates include:

- Cross-reader synthetic recovery fixtures produced/read with independently grounded native-equivalent code; tamper, bad UTF-8, duplicate-key, password normalization and size-boundary cases.
- Existing sealed-key/core combinations, missing alias and failed authentication cases on an isolated compatible Android test environment; no owner-phone installation or reset.
- Worker database encryption/schema/transaction evidence and round-trip verification preserving exact record IDs, revisions, receipts and owner history.
- Model verification cancellation/failure/publication tests against a reconstruction that actually uses the recovered protocol; no broad deletion or automatic replacement.
- Branch-level JSON parser verification, specifically Unicode escapes, duplicate-key detection and object comma iteration; Android URI attachment behavior for the failed method; permission/provider behavior for Health Connect and voice.
- Native host and package-registration reconstruction, pinned build graph/lockfiles, full lifecycle integration tests, and independent review bound to the resulting source digests.

No implemented app code, crypto, keys, vault data, APK or models were changed by this native evidence recovery.
