# Independent packaging-script review for 604

Reviewer: `/root/604_recording`. Reviewer did not author the functional changes, packager, signing script or root signing gate.

**Script review passed. Candidate approval is pending an actual unsigned APK and sealed build manifest.** Exact inspected script hashes are recorded in `script-review.json`; subsequent changes require re-review.

Reviewed `tools/package-candidate.py` and `tools/sign-reviewed-candidate.py` against the exact saved signed 603 APK. Direct ZIP/AXML inspection independently confirms 603 APK SHA-256 `25d3642ab5f45986e5dfcfe5c5413d40982c6142eb703adffc391f9d3b033227`, manifest SHA-256 `f906d8709e4eecdd850d3acc33d565e50b0d296abf235598a3e15e5f3bd4c20c`, 602 unique ZIP entries, the 112-string plain UTF-16 pool, and version-name string index 35 at offset 1452. The new name is longer by two characters, which the pool relocation logic handles while preserving indexes and non-version node bytes.

The packager pins the baseline, HBC, manifest, toolchain and existing certificate; verifies build-manifest identity; limits payload changes to HBC and two version-metadata entries; requires 599 unchanged payloads and 51 unchanged stored, 16 KiB-aligned native libraries; compares manifest semantic trees and app configuration; and performs final stable-input hashes. It does not sign or install.

The signing script pins the existing key fixture/configuration and private permissions, requires a caller-supplied hash-bound gate naming the exact unsigned APK/HBC/build/packaging/signing scripts, requires two distinct review labels and files, verifies payloads before signing, uses v2 only with stdin credentials, and verifies payloads and original certificate after signing. It creates no new signing identity and performs no installation, reset, push or deployment. The independence and substantive contents of reviews remain the root coordinator's responsibility: a JSON reviewer label alone is not proof of actual independent review.

No blocking defect was found in the 603-to-604 adaptations. Functional compatibility, latency improvements and lifecycle behavior are outside this packaging-only decision and need separate exact-candidate tests and review.

`verify_independent.py` is a separate checker that does not import the packager. It directly decodes AXML chunks/attributes and compares every non-pool chunk, all ZIP payloads, compression, native offsets, configuration, declared HBC and HBC internal SHA-1 footer. It verifies the baseline signer and alignment, final candidate alignment, package/version using pinned Android tools, and signed candidate identity when `--signed` is supplied. It hashes inputs before and after verification.
