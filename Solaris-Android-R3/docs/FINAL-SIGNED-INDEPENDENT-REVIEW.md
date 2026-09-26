# Final signed build 603 independent review

Reviewer: `/root/native_chat_repro`, independent of packaging/signing implementation. **PASS** for the exact signed artifact below. No signing, installation, data access/reset, key change, push or deployment was performed by this reviewer. Signing credentials were not read or printed.

| Item | Verified value |
|---|---|
| APK | `Solaris-V6.0.3-Pocket-Chat-Candidate.apk` |
| Size | 242,588,871 bytes |
| SHA-256 | `25d3642ab5f45986e5dfcfe5c5413d40982c6142eb703adffc391f9d3b033227` |
| Package | `org.solarishealth.edge.recovery` |
| Version | 603 / `6.0.3-preview.pocket-chat` |
| Existing certificate SHA-256 | `fac61745dc0903786fb9ede62a962b399f7348f0bb6f899b8332667591033b9c` |
| Signature | Verified; v2 only, matching baseline 602 |
| Packaged Hermes SHA-256 | `b8ac7d1b58d9e8ea6eadd25de516e35842aea14e4b849462664bb3200fedc990` |

The separately authored `tools/independent_packaging_verify.py` passed **725 checks** against the APK in `deliverables`. The verifier re-read the signed ZIP contents and compared them with exact baseline 602, independently parsed manifest structure, checked every native data offset, and invoked `apksigner`, `aapt2` and `zipalign`. The signed APK retains 599 baseline payloads byte for byte; only reviewed Hermes and app/manifest version metadata differ. All 51 native libraries remain byte-identical, stored and 16 KiB aligned. Package, manifest components/permissions and all other configuration fields are preserved. The signed file was stable across verification.

A further direct ZIP comparison found **all 602 payload entries exactly match the approved unsigned artifact**, SHA-256 `696333f57c630df950bdb369bc9bec339e44ec332ab3f2617d4b8a82896f4292`. Signing changed no payload.

The root approval gate SHA-256 is `d46331395f741525a87e070f5e2751664ac3447887732fb2473051ca04975b6f`. Its approved unsigned APK, Hermes, build declaration and packaging/signing source hashes match the reviewed files. The three distinct reviewer records and their current document hashes were independently checked; the DailyService and HBC API reviews explicitly cover final candidate06. The original gate-bound packaging review remains unchanged at SHA-256 `579fba8e4dbb3eff5ce417457c5d5ab6ae17b3e5d076602899d94b06c0f012b3`.

Verification source SHA-256: `1a4627f7ec890998a236afd11028e370e152786431a3f99876f48c7c47a1e171`.
Machine-readable report: `solaris-603-native-probe/packaging-independent-final-signed.json`, SHA-256 `8a95327eaf712a17628ac5f85f06f0d3829d0e2d4e4d17da601984949627dbb7`.

The independent packaging review also documents the actual-Hermes Qvac24 rerun and the exact-helper Linux model tests. Those targeted results support the reconstructed request/stream/guard boundaries. They do not establish phone inference speed, Android lifecycle behavior or full app-source reconstruction. This is an APK-derived signed candidate, with on-device validation still pending. This review approves neither model factual reliability nor unrestricted long-form chat capability.
