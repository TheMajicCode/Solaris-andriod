# Solaris V6 recovery master checkpoint — start here

This newly assembled checkpoint preserves the surviving code/assets and reviewable repairs in one download. It **is not** the original `Solaris-V6-Sanctuary-Source-and-Evidence.zip` or a complete native build project. It includes no private signing key, patient data or phone backup. The original verified APK is kept separately to avoid duplicating a 243 MB download.

## Open in this order

| Archive in this master package | Use and evidence status |
|---|---|
| `01-A1-Lifecycle-Integration-Candidate.zip` | **Newest work.** Lifecycle helper, 18 host tests, latest UI candidate, 120 UI assertions, API evidence, independent review and exact integration limits. Start with its README and INTEGRATION.md. |
| `02-V6-APK-Recovered-Assets-and-Evidence.zip` | Original packaged UI, QVAC worker, recovered assets, package/signature evidence and extraction provenance from the supplied APK. APK-derived recovery; not original authored native source. |
| `03-Reviewed-UI-Repair-and-Evidence.zip` | Prior reviewed UI repair, synthetic-browser screenshots, focused DEX/Hermes forensics and baseline. Its UI copy is superseded only by the documented follow-up in archive 01. |
| `04-Identity-GPS-Preparation.zip` | Dated shared-protocol proposals, framing fixtures, plans and earlier recovery evidence. Source-independent preparation; not activated identity, GPS or P2P. Its old missing-APK claims are superseded by later actual APK recovery. |

`INNER-SHA256SUMS.txt` verifies those four exact archives. Each includes its own provenance/manifests. Preserve them before extracting into separate directories; do not overlay older archives onto newer candidates or a working repository.

## Current facts

- Verified installed-candidate artifact: `Solaris-V6-Sanctuary.apk`, package `org.solarishealth.edge.recovery`, `6.0.0-preview.sanctuary`, code **600**.
- APK SHA-256: `4ac6a72c864118ec548ee5c05738c814b6e519f82b01a7d358d24952b900c518`.
- Verified development certificate SHA-256 from prior official apksig check: `fac61745dc0903786fb9ede62a962b399f7348f0bb6f899b8332667591033b9c`. The private signer/build environment is not recovered.
- Latest HTML repair candidate SHA-256: `d37c2cca5a60085924bf777e0c0428144f5955799e3d5e1b767e4dce0a7618a9`. It retains previous Home/error/read-state repairs and corrects two EN/ES Health Connect explanations.
- New lifecycle code is independently reviewable and host tested; it has **not** been integrated into the APK. A small-model limitation has not been established as the cause of the phone error.
- No new APK, native compilation, physical inference, phone installation/update, GitHub write or key/data change occurred in this follow-up.

## What the next implementation session can do

Read archive 01's contract, integration notes, API evidence, tests and review. It defines the exact adapter interface, timeouts, unsettled-operation ownership and safeguards. Use its newest UI candidate. Preserve the original service lifecycle queue and changed-queue loop. Loading and a real successful reply remain separate milestones.

Native integration/build remains blocked by the missing original project/build configuration/lockfile and matching signing environment. The original source ZIP, `v6-work/solaris-health`, `v6-evidence/build/attempt-001` and pre-build native checkpoint have not been recovered. Do not claim these are present in this master ZIP. The owner already cannot supply the failed-download source archive; do not keep asking for it or replaying the same recovery search without new evidence/access.

If a genuine native checkout or backup becomes accessible, verify its actual source/hash/governance and reconcile it against code 600 before applying this candidate. Keep the APK and vault intact. Do not rebuild from D4/V5-B, derive a replacement signer, change package identity, reset records, redownload a valid model or invent source provenance to obtain a build.

The next APK gate is actual source integration and native tests, matching-signer forward build, then separately observed physical-phone inference and data-retaining upgrade. A compiled artifact alone does not pass that phone gate. A2–A4 identity/GPS integration follows repaired A1 and the jointly frozen shared protocol; A5/A6 P2P/financial experiments remain later scope.

## Repository and multi-AI continuity

This package is ready for review by Codex, Claude, Gemini or MiMo without depending on this chat's memory. It does not grant any additional permissions. Use one writer per scoped task and independent review; keep accepted contracts, hashes, handoffs and evidence together. Once the genuine native source is available, prefer dedicated native paths in the shared Solaris repository when its actual ownership/release arrangement permits. Do not make a permanent APK-only branch the source of truth by assumption.

No repository push/merge, deployment, phone installation, data deletion, existing-key change, production funds or external contacts are authorized by this checkpoint.
