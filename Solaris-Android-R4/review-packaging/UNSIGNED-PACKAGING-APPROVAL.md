# Independent unsigned packaging approval — Solaris 604

Reviewer: `/root/604_recording`. Decision: **approve this exact unsigned candidate for the packaging portion of the signing gate**, subject to independent functional approval and final signed-candidate verification.

- APK: `/tmp/solaris604-unsigned-final/candidate-aligned-unsigned.apk`
- APK SHA-256: `1064281a1ee874726d1e16e69e0d621af4dad23539fba301e0b91eed3b175b10`; 242628887 bytes.
- HBC SHA-256: `30be9989cc00299836715cc3de5cf3a2a75b00019bdf2f1b91629205f558d8b3`.
- Build manifest SHA-256: `38b14c723fa8f08d0e4719384a6abf6ab4640fba2db2d57162bc077825cc0c13`.
- Baseline signed 603 APK SHA-256: `25d3642ab5f45986e5dfcfe5c5413d40982c6142eb703adffc391f9d3b033227`.

The separate `verify_independent.py` checker passed **1673 checks**, without importing or invoking the packager. Its direct ZIP comparison found exactly the three declared changed payloads (Hermes bundle, Android manifest, app configuration) and **599 unchanged payloads**. All **51 native libraries** are unchanged, uncompressed, and aligned to 16 KiB. The exact reviewed HBC is present, with a valid internal SHA-1 footer and matching build-manifest size/hash.

Direct AXML decoding verifies the package remains `org.solarishealth.edge.recovery`, the version is `6.0.4-preview.grounded-chat` / code **604**, and every XML chunk outside the string pool is byte-identical except the root version-code value. The only string change is the version name. Permissions, components and other manifest fields are preserved. App configuration changes only its two version fields.

The baseline signature verifies with the existing certificate `fac61745dc0903786fb9ede62a962b399f7348f0bb6f899b8332667591033b9c`, v2 only. Candidate is unsigned as expected. Android tooling independently confirms candidate package/version and alignment. All checked files remained stable throughout verification; packaging/signing/verifier scripts still match the previously inspected hashes.

This review establishes packaging compatibility, not on-phone performance, functional behavior, complete source reconstruction, or background inference support. No signing, installation, reset, key modification, push or deployment was performed by this reviewer. Full machine-readable evidence and command outputs are in `unsigned-final-review.json`.
