# Code 602 binary-patched candidate packaging

The controlled payload is the two completion guards identified by the R2 host evidence. This packaging preserves the 601 APK's native implementation and resources. It is not a complete native source rebuild, and it does not claim to solve the full LUCA resume lifecycle.

## Verified unsigned result

- Baseline: `Solaris-V6.0.1-Sanctuary-Recovery.apk`, SHA-256 `228c3d9f282d716515e3640de2b13478a29e21c607293eaf589741ec6d34f183`.
- Patched HBC: `completion-guards.hbc`, SHA-256 `fd8b38bcdd42421c18da4a0b69b2d58906ceddd7c4a2044b34faed51490f4653`.
- Aligned unsigned candidate: `evidence/apk-packaging/unsigned/candidate-aligned-unsigned.apk`, SHA-256 `8f0246f04150747ee671e1945781410689f3a5b18f7623f498cecee7ff44206d`, 242,574,503 bytes.
- Package: `org.solarishealth.edge.recovery`.
- Version: `6.0.2-preview.sanctuary-guards`, code `602`.
- Exactly three payload entries changed: `AndroidManifest.xml`, `assets/app.config`, `assets/index.android.bundle`. All 599 other payload entries retain identical uncompressed bytes, sizes and compression methods. No entries were removed.
- All 51 native libraries retain identical bytes, remain uncompressed and have 16 KiB aligned ZIP data offsets. Official `zipalign -c -P 16 4` passed. This verifies ZIP alignment and preservation; it does not add a new claim about native ELF behavior on a device.
- Official `aapt2 dump xmltree` semantic output changes only the version code and version name. Package, permissions, components, resource references and SDK declarations retain the baseline semantics.

The manifest's new version name is seven UTF-16 code units longer. The script expands string index 35 by 14 bytes, adds two alignment bytes, updates subsequent string offsets without changing their indexes, and grows the string-pool and file sizes by 16 bytes. Every other decoded string is equal, and the remaining XML node bytes differ only in the version-code integer. The regenerated manifest SHA-256 is `b24ee9859a63c1c27c09fcf7f4d9f96a4bf7e3f1146fb791b6d3bd81399f860f`.

## Reproduction

From the working directory containing `Solaris-Android-R2`, `newest-inputs` and the previously preserved build inputs:

```sh
python3 Solaris-Android-R2/tools/package-candidate.py \
  --baseline newest-inputs/Solaris-V6.0.1-Sanctuary-Recovery.apk \
  --patched-hbc Solaris-Android-R2/evidence/guard-patch/completion-guards.hbc \
  --tools-dir reconstruction-work/toolchain/android-tools \
  --output-dir NEW-EMPTY-UNSIGNED-OUTPUT-DIRECTORY
```

The script refuses existing output directories and unexpected baseline, HBC or Android-tool hashes. Extract `zipalign`, `aapt2`, `lib/apksigner.jar` and `lib64/libc++.so` from the already preserved official build-tools 36 archive into the tools directory; make the executable binaries executable. The archive SHA-256 is `5d9ac77fb6ff43d9da518a337b4fcf8f9097113df531d99ccefe80ef7ce8250b`. The script records entry inventories, manifest trees, package badging, native alignment and public signature information.

Changing ZIP-writing runtimes can change compressed ZIP bytes. Any different unsigned APK hash requires a fresh review and an updated explicit signing gate; source or ZIP reproducibility is not assumed from payload equality alone.

## Matching signer and signing boundary

The exact matching key is the existing shared public Expo SDK 54 development fixture, fetched from pinned commit `b26166dcfece76b91a682aead1838282df4a1318`. Its SHA-256 is `221e0a3106aa4c3ccc154e0a418b55020b3f9ea6e84f92e8749cd9e2f39f5e58`. Its certificate SHA-256 is `fac61745dc0903786fb9ede62a962b399f7348f0bb6f899b8332667591033b9c`, exactly matching the verified 601 APK. Authenticated offline loading found one recoverable RSA private-key entry whose public modulus and exponent match that certificate. No key was generated or changed.

`evidence/apk-packaging/fixture-provenance/` preserves pinned acquisition and verification code, public certificate and the non-secret readiness report. The raw fixture remains in the restricted local path recorded in that report and is excluded from downloadable archives and Git. No credentials are logged or persisted. This fixture provides continuity with the development APK, not exclusive production signing custody; it is separate from vault encryption keys.

The packaging script cannot sign. `tools/sign-reviewed-candidate.py` is a separate signing-only tool, prepared for the root to run only after completing compatibility and independent review gates. It requires a supplied gate file and its exact hash, `decision: approve-signing`, exact unsigned/HBC identity, package/code, its own source hash and at least two hash-bound independent review files. A gate file does not substitute for the root's assessment of review conclusions.

The signer verifies the entire unsigned artifact again, fetches the pinned official template configuration with its recorded SHA-256, passes fixture credentials through process input, and uses v2 signing only. It then re-verifies signature/certificate, version, exact entry inventory and 16 KiB native ZIP alignment. It cannot install, reset, push or deploy. Any failed verification leaves an unapproved artifact; only a successful `SIGNED-CANDIDATE-RESULT.json` plus the completed root review constitutes the candidate result.

The signing invocation uses the same baseline, HBC and tools arguments plus:

```text
--unsigned-apk <reviewed aligned unsigned APK>
--fixture <restricted matching fixture path>
--gate <root signing gate JSON>
--gate-sha256 <exact gate SHA-256>
--output-dir <new empty signing output directory>
--execute-reviewed-signing
```

No phone installation or device tests were performed. All data-retention and live Android lifecycle behavior remain bounded by the absence of device testing. `NEGATIVE-GATE-TESTS.json` records three passing tests showing that unreviewed HBC, unapproved decisions and changed gate files fail before candidate output or signing.
