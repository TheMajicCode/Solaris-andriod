# Candidate 603 packaging and signing scope

This tooling prepares a binary-preserving update from the verified signed 602 APK. It does not reconstruct the native Android build. Root must provide the final reviewed Hermes bundle and complete the behavioral/compatibility reviews before signing.

## Fixed inputs and allowed changes

- Baseline APK SHA-256: `01da9f5281f5f92230dcbd64da62484557cc7a0a15e876cc2d99ec7ec3bcd2cd`.
- Baseline Hermes SHA-256: `fd8b38bcdd42421c18da4a0b69b2d58906ceddd7c4a2044b34faed51490f4653`.
- Package ID: `org.solarishealth.edge.recovery`.
- Candidate version: `6.0.3-preview.pocket-chat`, code `603`.
- Existing signing certificate SHA-256: `fac61745dc0903786fb9ede62a962b399f7348f0bb6f899b8332667591033b9c`.
- Only `assets/index.android.bundle`, manifest version name/code, and app configuration version name/code may change. All 599 other payload entries, including every DEX and native library, must keep their original bytes and compression methods. All 51 native libraries must remain stored and aligned to 16 KiB.
- The manifest string pool is adjusted without changing string indices. The version-code typed value is located from the root element, Android namespace and resource ID, not a hardcoded offset. For the verified baseline its value is at byte 6728; shortening the version name moves the candidate value to byte 6720. All other XML node bytes and string values are checked; `aapt2` independently compares manifest semantics.
- APK signing is v2 only, matching the verified baseline. No installation, data reset, key generation/change, push or deployment is performed.

## Sealed build declaration

`tools/package-candidate.py` requires `--baseline`, `--patched-hbc`, `--build-manifest`, `--tools-dir` and a new `--output-dir`. The manifest has this shape, with actual final bundle values:

```json
{
  "format": "solaris-v6-603-build-manifest/1",
  "baselineApkSha256": "01da9f5281f5f92230dcbd64da62484557cc7a0a15e876cc2d99ec7ec3bcd2cd",
  "patchedHbcSha256": "FINAL_HBC_SHA256",
  "patchedHbcBytes": 0,
  "packageId": "org.solarishealth.edge.recovery",
  "versionCode": 603,
  "versionName": "6.0.3-preview.pocket-chat",
  "scope": "Exact independently reviewed implemented scope"
}
```

The package result records this declaration's SHA-256. To verify an existing APK, pass `--verify-apk`; use `--require-signature` after signing. The packager checks pinned Android-tool hashes, the baseline signature and alignment, then all payload/manifest/version/alignment checks. It never signs.

## Root signing gate

`tools/sign-reviewed-candidate.py` requires the same build declaration and bundle, aligned unsigned APK, baseline APK, tools, fixture, local fixture configuration, new output directory, and `--gate`, `--gate-sha256`, `--execute-reviewed-signing`. It performs pre- and post-sign packaging verification.

The gate must be written only after actual independent reviews have passed. Its fields are:

```json
{
  "format": "solaris-v6-603-signing-gate/1",
  "decision": "approve-signing",
  "baselineApkSha256": "BASELINE_SHA256",
  "packageId": "org.solarishealth.edge.recovery",
  "versionCode": 603,
  "versionName": "6.0.3-preview.pocket-chat",
  "expectedCertificateSha256": "EXISTING_CERTIFICATE_SHA256",
  "buildManifestSha256": "FINAL_BUILD_MANIFEST_SHA256",
  "patchedHbcSha256": "FINAL_HBC_SHA256",
  "unsignedApkSha256": "FINAL_ALIGNED_UNSIGNED_APK_SHA256",
  "signingScriptSha256": "SIGNING_SCRIPT_SHA256",
  "packagingScriptSha256": "PACKAGING_SCRIPT_SHA256",
  "independentReviews": [
    {"reviewer": "independent behavior reviewer", "decision": "approve", "path": "/absolute/review-one.md", "sha256": "REVIEW_ONE_SHA256"},
    {"reviewer": "independent packaging reviewer", "decision": "approve", "path": "/absolute/review-two.md", "sha256": "REVIEW_TWO_SHA256"}
  ]
}
```

Reviewers and file paths must be distinct; all review contents, scripts, bundle, unsigned APK, build declaration and baseline are hash-bound. This mechanism verifies the supplied decision and evidence integrity; it does not substitute for independent reviewers assessing the content. Edit any covered input only before issuing a new gate.

## Matching development fixture

`evidence/packaging-prep/fixture-provenance/retrieve_and_verify.py` retrieves the exact public Expo template fixture and Gradle configuration at the pinned commit `b26166dcfece76b91a682aead1838282df4a1318`. It verifies both SHA-256 values, saves them with mode 0600 inside a mode 0700 directory outside the editable-source tree, and checks that the loadable private key's public RSA components match the pinned certificate. It does not generate keys or sign.

The restored inputs are in `/workspace/scratch/7a1f5a13b137/solaris-603-private-signing-inputs/`. Neither that directory nor raw keystore/configuration credentials belong in download archives. The provenance retriever, public certificate and readiness report can be included. The signer reads the pinned local configuration without network access and passes credentials through standard input, never command-line values or logs.

## Preparation verification and limits

`evidence/packaging-prep/test-packaging-prep.py` checks dynamic manifest relocation, exact configuration scope, altered manifest/namespace/bundle declaration rejection, unexpected native payload rejection, and denial of invalid signing gates before any output/signing operation.

An interim diagnostics-only bundle is used for the unsigned structural probe in `evidence/packaging-prep/unsigned-structural-probe/`. It proves packaging boundaries only. It is not the final integrated 603 bundle, has no signing approval, and must not be delivered as an update. Final root packaging, behavioral tests and independent reviews must use the final sealed bundle. Preparation does not establish on-device behavior or prove completeness of the missing native source.
