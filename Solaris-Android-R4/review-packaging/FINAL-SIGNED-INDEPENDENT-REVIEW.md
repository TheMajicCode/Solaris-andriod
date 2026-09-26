# Final independent signed APK review — Solaris 604

Reviewer: `/root/604_recording`. Decision: **APPROVE this exact signed candidate for delivery**, within the bounded reviewed scope and stated device-validation limits.

Final file: `/workspace/scratch/7a1f5a13b137/deliverables/Solaris-V6.0.4-Grounded-Chat-Candidate.apk`

| Artifact | SHA-256 |
| --- | --- |
| Signed APK (242638023 bytes) | `0e9a66da00cbe128851d981a9f9a3d9a1dbfe653f7a4ced93d638bc4d7d31827` |
| Packaged HBC | `30be9989cc00299836715cc3de5cf3a2a75b00019bdf2f1b91629205f558d8b3` |
| Build manifest | `38b14c723fa8f08d0e4719384a6abf6ab4640fba2db2d57162bc077825cc0c13` |
| Root signing gate | `303b7d0beeae02fd47d96e30c2799446e407c62ef3c7d2405519f042e054f6dd` |

The independent ZIP/AXML checker passed **1675 checks** on the actual deliverable path. The signature verifies as **v2 only** with original certificate `fac61745dc0903786fb9ede62a962b399f7348f0bb6f899b8332667591033b9c`. Package ID remains `org.solarishealth.edge.recovery`; version is `6.0.4-preview.grounded-chat`, code 604. Exactly three payload entries differ from 603 as declared; all 599 others, including every DEX/native library, are preserved. All 51 native libraries remain stored and 16 KiB aligned. Manifest changes only version name/code; configuration changes only version fields. Packaged HBC exactly matches independently reviewed bytes.

Additional gate-freeze review checked all three independent approval files, both packaging/signing scripts, the HBC/build manifest, helper/patch-plan/UI hashes recorded in functional/UI reviews, and the unsigned candidate. All 12 files match their frozen hashes. Prior unsigned approval was not modified. Full evidence is in `signed-final-review.json` and `signed-gate-freeze-review.json`.

This confirms final packaging and signing compatibility. On-device validation is pending. General open-chat model speed/quality remain unchanged; background generation and durable pending drafts remain unsupported. No installation, data reset, key change, push or deployment was performed by this reviewer.
