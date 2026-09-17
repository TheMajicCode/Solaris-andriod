# Independent APK packaging and signing-path review

**PASS for the exact unsigned package and the reviewed signing path below. No material defect found.** This review was performed independently of the packaging/signing-script author. It is not the root signing decision: signing still requires the separate hash-bound gate and successful post-sign verification. No signing or installation was performed in this review.

## Bound inputs

| Input | SHA-256 |
|---|---|
| `tools/package-candidate.py` | `54a88a21cbeb3e7e93ad33d4df9b8987f5e4c49c542f82e3b1a88e2b712df2a7` |
| `tools/sign-reviewed-candidate.py` | `415eec27b292e4be42508709cb262bff3c5b4b654094e34b05dad60789f62f77` |
| Original code601 APK | `228c3d9f282d716515e3640de2b13478a29e21c607293eaf589741ec6d34f183` |
| Aligned unsigned candidate | `8f0246f04150747ee671e1945781410689f3a5b18f7623f498cecee7ff44206d` |
| Approved guard-only HBC | `fd8b38bcdd42421c18da4a0b69b2d58906ceddd7c4a2044b34faed51490f4653` |
| Candidate binary manifest | `b24ee9859a63c1c27c09fcf7f4d9f96a4bf7e3f1146fb791b6d3bd81399f860f` |
| Candidate `assets/app.config` | `9f1505a7cb7bfb1fb916feb3a2edfb7a3e7ec451dd983225bfc5a9c6e7a7e280` |

Unsigned candidate path: `evidence/apk-packaging/unsigned/candidate-aligned-unsigned.apk`; size **242,574,503 bytes**. Identity remains `org.solarishealth.edge.recovery`; version is **602 / 6.0.2-preview.sanctuary-guards**.

## Independent binary-manifest findings

I separately decoded the actual baseline and candidate AXML bytes without importing the packaging implementation, including the string pool, chunk headers, resource map and all start-element attributes. Official `aapt2 dump xmltree` was also run independently on both APKs.

- Both contain **130 XML chunks** and **112 string-pool entries**. The original pool is plain UTF-16, unstyled and unsorted, with 112 unique offsets. Its style count and style offset remain zero.
- String index **35** changes only from `6.0.1-preview.sanctuary` to `6.0.2-preview.sanctuary-guards`. All other strings retain their exact values and indices. The changed string grows 14 bytes; pool size grows 16 bytes with two added padding bytes. Subsequent string-data offsets grow by exactly 14; earlier offsets are unchanged.
- The overall XML size grows from **12,444 to 12,460 bytes**. Every resource-map, namespace, tag and attribute byte after the pool is identical after allowing for the uniform 16-byte relocation and the root `versionCode` integer changing 601 to 602. The version-code data moves from offset 6712 to 6728.
- Independent resource-ID decoding confirms the only changed root attributes are Android `versionCode` (`0x0101021b`) and `versionName` (`0x0101021c`). All other decoded attributes and element order match.
- Official AAPT output differs only at the two version fields. Package ID, SDK declarations, permissions, components, authorities, exported settings, backup configuration, metadata, native extraction configuration and all other manifest semantics are preserved.

The patcher's fixed ASCII name length and UTF-16 layout handling are correct for these hash-pinned inputs. It rejects other baseline manifests rather than attempting a generic AXML rewrite.

## Independent archive and alignment findings

I compared the actual uncompressed bytes of every baseline and candidate ZIP entry, checked duplicate/name/order/compression properties, and independently calculated native-library data offsets from ZIP local headers.

- Both archives contain **602 entries**, with the same names, order and compression method per entry.
- Exactly three payloads change: `AndroidManifest.xml`, `assets/app.config`, and `assets/index.android.bundle`. The other **599 payloads are byte-identical**, including DEX, resources, all native libraries and the nested OSGI manifest.
- Parsed `app.config` changes only `version` and `android.versionCode`; package, plugins, native configuration and other settings match.
- The actual packaged HBC has the approved `fd8b38...` hash. Its instruction/behavior compatibility is covered by the separate bytecode reviews and tests; this packaging review does not expand that scope.
- All **51 native libraries** are byte-identical, stored uncompressed, and begin at offsets divisible by 16,384. Independent `zipalign -c -P 16 4` succeeds.
- No entry was removed from this exact baseline. The signature-removal predicate correctly excludes nested paths, preserving `META-INF/versions/9/OSGI-INF/MANIFEST.MF`.

## Signing identity and reviewed execution path

Independent `apksigner verify --verbose --print-certs` on the original APK succeeds with exactly one signer, v2 enabled and v1/v3/v3.1/v4 disabled. Its certificate SHA-256 is:

`fac61745dc0903786fb9ede62a962b399f7348f0bb6f899b8332667591033b9c`

The new unsigned archive correctly fails signature verification at this stage. It must not be described as signed until the reviewed signing path completes and the final artifact passes verification.

The retained public certificate DER independently hashes to that same signer. The existing matching Expo development fixture independently hashes to `221e0a3106aa4c3ccc154e0a418b55020b3f9ea6e84f92e8749cd9e2f39f5e58`, is 2,257 bytes and has mode 0600. I inspected the pinned acquisition and `VerifyFixture.java` identity check: it authentically loads the one key entry, checks RSA modulus/public-exponent agreement with the certificate and requires the expected certificate hash. Its successful readiness evidence is in `fixture-provenance/FIXTURE-READINESS.json`. No key is generated or changed by these scripts. The fixture remains the shared public development identity already used by the baseline, not newly claimed production key custody.

The signing-only script has the following effective safeguards, verified by source review:

1. Requires explicit execution plus an `approve-signing` gate whose file hash is supplied by the root, bound to the exact unsigned APK, HBC, package, code, signing-script hash and at least two hash-bound review documents.
2. Requires the exact unsigned/HBC/fixture/packager hashes and restrictive fixture permissions before signing. The pinned packager re-verifies the complete unsigned payload set, manifest identity, alignment and original signer before invoking the signer.
3. Fetches signing configuration only from the pinned Expo commit and verifies its exact SHA-256. Credentials remain in process and reach `apksigner` through stdin; they are absent from command arguments, recorded command JSON and archives.
4. Uses the existing fixture with **v2 only**, writing a new candidate into a newly created output directory. It contains no key generation, installation, reset, push or deployment operation.
5. Invokes the pinned packager again after signing with `--require-signature`. A successful result requires the expected signer/schemes, unchanged package and allowed versions, the exact three approved replacement payloads, all other payloads unchanged, and preserved native alignment.

The gate's substantive compatibility decision belongs to the root; a list of review hashes is an integrity binding, not an automatic interpretation of review conclusions. The final signed APK's hash and successful post-sign evidence must be retained separately. The raw fixture and credential-bearing configuration remain excluded from delivery archives; pinned acquisition code and non-secret descriptors provide reproducible provenance.

## Scope of this pass

This pass covers the exact unsigned artifact, version-only packaging change, preserved package/data-bearing binaries, existing signing identity and the reviewed signing path. It does not assert that an Android installation or hardware inference test occurred. The guard-only HBC repair remains limited to the two confirmed completion-dispatch authority gaps; full LUCA SDK resume reconciliation remains pending.
