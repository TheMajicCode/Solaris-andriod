# Solaris Android reconstruction — compatibility assessment

15 September 2026. **The first controlled reconstruction checkpoint is complete. A source-based Android candidate is not yet compatible enough to sign.** No APK was built, signed, installed, pushed or deployed in this work. The original APKs, phone, vault, identities, record IDs, signing identity and models were not changed.

This checkpoint contains all recovered/reconstructed work and available inputs produced in this session. It is **not the missing original source archive or a complete compilable Android project**. The result is more than a planning packet: it includes freshly recovered native/host representations, byte-exact packaged sources, reproducible source extraction, readable UI that reproduces the APK, and a compiled/tested isolated recovery codec.

## Verified baseline

The attached Sanctuary APK is code **600**. A newer retained artifact was located and independently identified before implementation:

| Property | Verified value |
|---|---|
| Baseline | `Solaris-V6.0.1-Sanctuary-Recovery.apk` |
| Version | `6.0.1-preview.sanctuary`, code **601** |
| Package | `org.solarishealth.edge.recovery` |
| Size | 242,580,679 bytes |
| APK SHA-256 | `228c3d9f282d716515e3640de2b13478a29e21c607293eaf589741ec6d34f183` |
| Signer certificate SHA-256 | `fac61745dc0903786fb9ede62a962b399f7348f0bb6f899b8332667591033b9c` |
| Fresh signature verification | Official Android apksigner: APK v2 verified; one matching signer |
| SDK levels | Minimum 29, target/compile 36 |
| Installed phone version | Not independently observed |

Every APK entry was compared between 600 and 601. Only the manifest, app configuration and HBC bundle differ. Inside HBC, every byte outside the HTML storage slot and required checksum footer is identical. Native DEX/libraries, worker source and host function instructions are unchanged. Code 601 therefore retains the unresolved LUCA lifecycle behavior; it must not be presented as an engine repair.

Later verified Expo development-fixture provenance supersedes the older “matching signer unavailable” claim. This is the same **shared development** identity, not an exclusively controlled production signing key. No new signer or key was generated. Signing is not the principal blocker.

## Concrete reconstruction result

| Area | Completed work | Limit |
|---|---|---|
| UI | Exact code 601 HTML literal recovered, including 2,681 padding spaces and embedded images; readable reviewed HTML reproduces it using the retained formatter lock | Synthetic host checks; no Android WebView run |
| Worker | All 1,013 packaged files recovered with exact byte ranges/hashes; worker bundle and 136 package declarations retained | Packaged dependency declarations are not the original application lockfile |
| Native code | All 254 DEX classes in the Solaris runtime/vault/app packages mapped to readable decompiler outputs; critical lower-level fallbacks preserved | Decompiled Java contains unresolved methods/types/control flow; not compile-ready original Kotlin |
| Host coordinator | Full 15,513-function disassembly, function index and decompiler pseudocode retained | Pseudocode fails syntax checking; no claim it is executable source or the recovered original App.tsx |
| Recovery codec | New portable Java reconstruction of the fully readable `L5.b` envelope and MAC behavior; compiled and cross-checked against Python cryptography | Isolated component, no Android bridge/storage/importer integration and no actual DEX execution |
| Existing A1 helper | Source, API evidence and tests retained unchanged and rerun | Still not integrated into the actual lifecycle owner |
| Build inputs | Exact reference APK, pinned analysis/Android tools, UI formatting dependencies/lock and input hashes retained | Original native build graph, app lockfile, generated registration and compiler pins remain unresolved |

## Compatibility contract now grounded in code

| Boundary | Established facts | Remaining gate |
|---|---|---|
| Vault storage | `files/solaris-vault/v1`, `keys.sealed` with AtomicFile backup, `core.initialized`, `core.db` | Actual SQLCipher schema/transactions and cross-version round trips |
| Device wrapping | AndroidKeyStore alias `solaris.vault.wrap.v1`; AES-GCM; AAD `solaris-native-owner/1`; existing keys reused; missing keys/core fail closed | Android authentication/provider and existing-file combination tests |
| Owner continuity | Existing subject/owner/device/database key are read from sealed metadata. Recovery import is rejected when a vault exists | Full JS recovery/import validation and state/record continuity |
| Recovery envelope | `SVCORE1\n`, 32-byte salt, 12-byte IV, big-endian length, 56-byte authenticated header, PBKDF2-HMAC-SHA256/600,000/256, AES-GCM/128, NFC passphrase rules | Device-provider behavior and complete payload/JSON/database interoperability |
| Fresh restore | Restores subject/owner/ownerSecret/receiptKey; intentionally creates new device/database keys for a new installation | Must never be invoked as an in-place upgrade strategy |
| IDs and receipts | Native newId uses UUID; Health import prefixes existing generated IDs with `health_`/`receipt_`; receipts are MACed over exact text; revisions/session checks remain relevant | Full replay/import tests retaining exact existing IDs, ordering and receipt bytes |
| Valid model | Qwen3 0.6B Q4_0, 382,156,480 bytes, SHA-256 `33bcc57074ec7b6eada5a90651ee546ec0c2b271002c22baf9f1b2dd1e8f75cb`; published path and transfer preferences recovered | Model reuse, cancellation and atomic publication in the actual reconstructed service |
| Lifecycle | Existing queue, stable-queue wait and authority/cancellation boundaries are visible in disassembly; worker-only resume was rejected in prior review | Executable equivalent of the real coordinator and race/interleaving tests |
| Attachments/JSON | Native classes retained; attachment reader and strict JSON parser have decompiler uncertainties | Resolve control flow and rejection semantics before implementing either |
| Voice/Health | Native class coverage retained; voice remains separate from QVAC; permissions are separate from a Health read | Provider/permission and actual Android regressions |

Unknown behavior remains unknown. No substitute vault schema, migration, controller seed, ID derivation, permissive parser, SQLite replacement, worker auto-resume or reset path was introduced.

## Build-cycle evidence

**R0 — recovery and source reproduction.** Eleven source-integrity/negative-extraction tests passed. An independent reviewer performed 29 checks against the exact APK, covering all 1,024 recovered outputs, literal UI padding, worker ranges, image decoding, model notice, duplicate/path protections and unchanged input bytes. The readable UI independently reproduced the exact packaged literal with padding. The existing 18 lifecycle-helper tests and 120 synthetic UI assertions were rerun successfully; these remain helper/UI evidence, not Android integration evidence.

**R1 — isolated recovery-envelope reconstruction.** The Java component compiled. Its conformance run passed 112 Java assertions and four Python export-decryption checks, including independently produced import fixtures, tampering/wrong-password rejection, Unicode normalization, HMAC/UTF-8 behavior and the 16 MiB plaintext boundary. The reference is readable native control flow plus an independent cryptographic implementation, not execution of the original Android class. Review findings and exact source/test hashes are retained beside the test evidence. Provider-specific malformed UTF-16 behavior and actual Android execution remain unverified.

Every result is scoped. There was no Gradle application build, APK assembly/signing, physical inference, Health provider read, phone upgrade or data-retention test. Decompiler failures and the failed pseudocode syntax check are retained as evidence, not hidden or counted as passes.

## Decision and next reconstruction boundary

**Signed candidate gate: blocked.** The blockers are the incomplete host/database reconstruction, native control-flow ambiguities, missing verified application build graph and absent integration compatibility evidence. A successful envelope test or matching signing certificate does not clear those gates.

Continue from the retained 601 bytes, with one writer and an independent reviewer per component:

1. Reconstruct the actual host lifecycle coordinator and surrounding cancellation/session/consent boundaries. Compare executable behavior against the retained instructions; test skipped startup transitions, cached reopen, background during resume, late settlement, repeated taps and revocation. Do not integrate the helper into a guessed App.tsx shell.
2. Recover database schema, transaction and complete recovery-payload validation. Cross-check synthetic fixtures in both directions while retaining IDs, revisions, owner history and receipts. Resolve attachment and strict-JSON decompiler ambiguities.
3. Establish an explicit reconstructed native build graph with pinned dependencies and generated bridge registration. Label new pins as reconstruction choices, not recovered historical locks. Compile only after the preserved surfaces have coverage and independent review.
4. Consider a same-package, same-signer forward candidate only when static/source compatibility gates pass. Installation and physical acceptance remain separately prohibited under the current instruction.

The Solaris vision remains intact: private local identity/vault, delegated LUCA, removable adapters and future web/P2P coordination. The supplied Identity/GPS plan remains design context. No identity/GPS/RGB/P2P feature was inferred into this reconstruction from a proposal.

All work can resume from the saved editable checkpoint without retrieving the previously failed original source ZIP again. See `README.md` for paths and reproducible commands, and `build-inputs/BUILD-INPUTS.json` for the precise available/missing input list.
