# Final signed candidate — independent review

**PASS.** The final signed APK independently verifies against the reviewed unsigned candidate and original code601 baseline. No material defect was found in this bounded final-artifact check.

| Artifact | SHA-256 |
|---|---|
| Signed V6.0.2 candidate | `01da9f5281f5f92230dcbd64da62484557cc7a0a15e876cc2d99ec7ec3bcd2cd` |
| Reviewed unsigned candidate | `8f0246f04150747ee671e1945781410689f3a5b18f7623f498cecee7ff44206d` |
| Original code601 APK | `228c3d9f282d716515e3640de2b13478a29e21c607293eaf589741ec6d34f183` |
| Packaged guard-only HBC | `fd8b38bcdd42421c18da4a0b69b2d58906ceddd7c4a2044b34faed51490f4653` |

Signed file: `signed/Solaris-V6.0.2-Sanctuary-Guards-Candidate.apk`  
Size: **242,580,679 bytes**  
Package: `org.solarishealth.edge.recovery`  
Version: **602 / 6.0.2-preview.sanctuary-guards**

## Executed checks

- Independently ran the retained official Android `apksigner verify --verbose --print-certs` on the final APK. It succeeds with one signer and **v2 only**; v1, v3, v3.1 and v4 remain disabled.
- Signer certificate SHA-256 is `fac61745dc0903786fb9ede62a962b399f7348f0bb6f899b8332667591033b9c`, exactly matching the verified original APK. The certificate's public-key SHA-256 is also unchanged: `06104aa0b28fac286bae06b08313ac69c37c35a6462853db32d2ec5fa7b1ed0e`.
- Independently ran `zipalign -c -P 16 4`; it succeeds.
- Compared the actual uncompressed bytes of **all 602 ZIP entries** against the reviewed unsigned archive. Every payload is byte-identical; entry names, order and compression methods match.
- Compared against the original code601 APK. Exactly the approved HBC, manifest and app.config payloads differ; the other **599 payloads are byte-identical**.
- Independently read each native library's ZIP local header. All **51 native libraries** are byte-identical to the original, stored uncompressed, and start on a 16,384-byte boundary.
- Confirmed that the actual packaged HBC matches the reviewed repair hash, and parsed app.config confirms the unchanged package and approved version.
- Recomputed hashes of the original and unsigned APKs during this check; both remain unchanged. The final manifest equals the reviewed unsigned manifest byte-for-byte, so the earlier independent AXML/index/resource/permission/component review carries through without another manifest mutation.

Raw verification output is retained in `final-independent-signature.log` and `final-independent-payloads.log`. The latter records the successful combined alignment and direct-payload comparison command result.

## Scope

This is final-artifact verification of the reviewed two-guard repair and preserved signing identity. The signer remains the baseline's shared public development fixture. No install, device execution, data reset, key change, push or deployment was performed by this review. It does not claim full LUCA SDK resume reconciliation or a complete native source rebuild.

