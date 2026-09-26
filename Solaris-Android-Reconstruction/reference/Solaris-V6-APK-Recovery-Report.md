# Solaris V6 — verified APK and partial asset recovery

Date: 2026-09-13. **The uploaded APK is the exact previously recorded V6 binary. The original native source ZIP has not been recovered.** This checkpoint preserves real material extracted from that APK and the checks performed on it. It is not a replacement for `Solaris-V6-Sanctuary-Source-and-Evidence.zip`, a complete buildable project, or a new release.

## Verified candidate

| Field | Personally verified result |
| --- | --- |
| Package | `org.solarishealth.edge.recovery` |
| Version / code | `6.0.0-preview.sanctuary` / `600` |
| APK bytes | 242,584,391 |
| APK SHA-256 | `4ac6a72c864118ec548ee5c05738c814b6e519f82b01a7d358d24952b900c518` |
| Certificate SHA-256 | `fac61745dc0903786fb9ede62a962b399f7348f0bb6f899b8332667591033b9c` |
| Content signature | Official Android apksig 8.11.0: APK v2 signature verified, no errors or warnings |
| Debuggable / backup / cleartext | false / false / false |
| Minimum / target Android API | 29 / 36 |

The certificate is the recorded **development certificate** with subject `CN=Android Debug`; the application manifest itself sets `debuggable=false`. Verifying the public certificate does not recover its private signing key. The original uploaded APK was not modified, repacked, resigned or installed.

## What was recovered

- The complete packaged Sanctuary HTML, JavaScript and CSS: one verified Hermes string-table entry, decoded from UTF-16LE to UTF-8 with a reversible byte conversion.
- The two embedded PNG assets, decoded without editing the images.
- The complete Bare/QVAC worker bundle: one verified string-table entry. Its 1,013 contained file ranges were checked for contiguous, bounded coverage and extracted. Most are runtime dependencies, not Solaris-authored source files.
- The actual bundled root `package.json`, generated QVAC worker entry, SDK package metadata and model notice.
- The original compiled Hermes bundle, DEX, binary manifest, resource table, Expo config and build VCS metadata from the APK. These are packaged/compiled artifacts, not original TypeScript or Kotlin source.
- A per-file SHA-256 manifest, APK entry inventory, reproducible recovery script and signature/manifest verification evidence.

The packaged dependency declarations include Expo `54.0.37`, React Native `0.81.5`, QVAC SDK `0.18.2`, Bare runtime `1.28.7` and react-native-bare-kit `0.14.0`. These are actual bundled declarations; the original lockfile and complete resolved native build environment remain absent.

The HTML contains runtime-source metadata `c751ffd6de604e8fbfd016fd97d569f95bfee712a24d02aa11fdc0835e943c2c`, matching the historical record. This is an embedded claim, not a fresh hash calculation over missing original source.

## What the recovered code explains

**AI:** The packaged SDK's `assertLifecycleAllowed` permits normal requests only while its state is `active`; `suspend`, `resume` and `state` requests remain allowed during other states. It throws `LIFECYCLE_OPERATION_BLOCKED` when that condition is not met. This narrows the observed error to lifecycle admission, not a demonstrated model-size limitation. Why the phone remains in the blocked state still requires inspection of the missing application lifecycle bridge or targeted device evidence.

The recovered UI has no mapping for `QVAC_LIFECYCLE_OPERATION_BLOCKED`, so it displays the raw code and the unrelated generic “This step was not saved” message. That is a confirmed presentation defect; the banner cannot establish record loss or a failed Health Connect import.

**Health Connect:** Access permissions and a data read are distinct actions. The Connections screen shows granted scopes without returned/imported counts or a specific empty/error result. No measurements could mean no source records, but these screens do not prove that. The Home 1–5 self-report panel intentionally does not show Health Connect steps/sleep. The audit also identifies a conditional chart-date issue requiring the native tracking-view contract.

**Home:** The packaged forest image has no dimming filter. Cards use the requested 15% tint and no backdrop blur. A modest adjustment to the image layer can address brightness while preserving opaque text; no image or app styling was changed during recovery.

Detailed confirmed findings, hypotheses and seven synthetic UI assertions are in `audit/PACKAGED-UI-AUDIT.md`.

## Exact remaining blockers

| Item | Current status |
| --- | --- |
| `Solaris-V6-Sanctuary.apk` | Recovered from the user's upload and verified |
| Original V6 source/evidence ZIP | Missing; recorded size 49,170,655 bytes and SHA-256 `fe89616a59ee7d6fd227d28f65285b8c65b204180fca235802e84ce517c46112` |
| `v6-work/solaris-health` | Absent from accessible workspace |
| `v6-evidence/build/attempt-001`, including pre-build source checkpoint | Absent from accessible workspace |
| Original `App.tsx`, application services, Kotlin source, Gradle/plugin configuration, lockfiles and release tests | Not recovered from APK entries; only compiled representations and selected packaged scripts are available |
| Original native AGENTS/governance, current contract/handoff and full build/source manifests | Not recovered; surviving web/preparation instructions are separate evidence |
| Native branch/HEAD/tree/dirty state | No surviving native checkout to measure; previous branch/tree values remain historical |
| Compatible update signing capability | Public certificate verified; private signing environment not recovered or tested |
| New compatible APK | Not built; no running build |
| Physical phone, inference, data import or upgrade acceptance | Not performed here |

There is no current basis to call a new in-place update ready. Decompilation may permit further forensic analysis, but it cannot establish the exact lost authored source, lockfile, tests or signer custody. This recovery did not reconstruct from D4 or V5-B.

## Authorized scope and file boundaries

This work follows the owner's current recovery request and prior reversible-work authorization. It creates only an isolated `v6-apk-recovery/` directory and named deliverables; it does not edit a native or web repository. The surviving web AGENTS and preparation contracts were read as context. No obsolete exact-node approval was replayed, and no absent native governance was invented.

The existing APK, keys, model, records and phone storage remain unchanged. No Git commit, push, merge, production deployment, phone installation or external contact was performed.

## Reproduce the extraction

From the directory containing this checkpoint's recovery script, supply the unchanged uploaded APK and a new output directory:

```bash
python3 extract_verified_apk.py /absolute/path/Solaris-V6-Sanctuary.apk /absolute/path/new-recovery-directory
```

The script accepts only the exact recorded APK digest/size and Hermes version 96. It checks the Hermes footer, all 21,220 string ranges, exact HTML/worker entries, worker paths and file ranges. Existing output directories are rejected. It does not execute the recovered app or worker. Its output manifest records each extracted file and byte provenance. All 1,025 extracted output files were reread and matched their manifests after extraction.

`identity-evidence/` contains exact official verifier commands and exit codes. `audit/` contains the bounded synthetic UI checks. These checks do not replace the original app test suite or physical phone testing.

## Resume boundary

The APK is now safely identified and its packaged UI/worker evidence is available for review. Continue diagnostics against these actual artifacts. A source-based repair/build must first establish a compatible native source/build/signing path; it must not silently substitute D4. Once that path is established, prioritize lifecycle recovery and truthful read/save outcomes, then Home brightness, before identity/GPS or P2P features. Preserve the installed app throughout.
