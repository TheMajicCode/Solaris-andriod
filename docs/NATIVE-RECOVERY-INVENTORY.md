# Native recovery inventory — A604-02 milestone 1

Evidence-backed inventory of what exists, what is reconstructed, what is
reference-only, and what is missing for a native build of build 604. This is
**milestone 1 (inventory and missing-input list)** of the native recovery
workstream. No build was attempted; none is possible from this projection.

> A generic empty Gradle or Expo scaffold, a successful hello-world build, or
> assembly around unverified replacements does **not** restore Solaris. Nothing
> below may be turned into fabricated scaffolding.

## Target artifact

| Property | Value | Source |
| --- | --- | --- |
| Package | `org.solarishealth.edge.recovery` | APK badging |
| Version | `6.0.4-preview.grounded-chat`, code `604` | APK badging |
| APK SHA-256 | `0e9a66da00cbe128851d981a9f9a3d9a1dbfe653f7a4ced93d638bc4d7d31827` | 604 build report; 242,638,023 bytes |
| Host HBC SHA-256 | `30be9989cc00299836715cc3de5cf3a2a75b00019bdf2f1b91629205f558d8b3` | 604 build report |
| Signer certificate | `fac61745dc0903786fb9ede62a962b399f7348f0bb6f899b8332667591033b9c` (`CN=Android Debug`) | `baseline/apk-signature.txt` |
| minSdk / targetSdk / compileSdk | 29 / 36 / 36 | APK badging, `BUILD-INPUTS.json` |
| Platform build version | 16 / 36 | APK badging |
| Preserved payload entries | 599, including all DEX and 51 native libraries | 604 build report |
| Native library alignment | 51/51 ELF load segments ≥ 16 KiB | `baseline/native-elf-alignment.json` — **program-header inspection only, no runtime 16 KB page-size test** |
| Declared permissions | INTERNET, VIBRATE, RECORD_AUDIO, health.READ_STEPS, health.READ_SLEEP, USE_BIOMETRIC, plus the app's dynamic-receiver permission | APK badging |

## Source availability by class

| Class | What it covers | Where | Buildable? |
| --- | --- | --- | --- |
| **Original authored** | None of the native application. The original `App.tsx` and authored host service sources were not recovered. | — | No |
| **Reconstructed** | Recovery-envelope component (`Solaris-Android-Reconstruction/src/reconstructed/`); guided routing (`Solaris-Android-R4/grounding/fast-guided.js`); UI (`sanctuary.html`) | Tracked | Partly — as a **patch**, not a project |
| **Reference-only** | Native decompiled classes (`reference/native-decompiled/`), generated `.hasm` function disassembly, recovered-601 worker/UI | Tracked | **No.** Decompiler output is evidence, not compilable production source. |
| **Generated** | HBC bundle, DEX, compiled UI derivative | Excluded binaries | N/A |
| **Missing** | See below | — | — |

## Not recovered — `BUILD-INPUTS.json` states these explicitly

1. Original `App.tsx` and authored host service sources
2. Complete native Gradle project
3. Gradle wrapper and distribution pin
4. Android Gradle Plugin and Kotlin plugin pins
5. Original resolved native/npm application lockfile
6. NDK/CMake compiler inputs and flags
7. Original release regression suite
8. Complete original authored native source for reference dependencies

`BUILD-INPUTS.json` records `"nativeBuildReady": false` and
`"signedCandidateAllowed": false`. **A signing fixture is not a build graph.**

## Dependency evidence that does exist

`packaged-dependencies.json` names **136 packaged dependency entries** (133 with
resolved names, each with a SHA-256): 122 unscoped, 10 `@qvac/*`, 1
`@hyperswarm/*`. The unscoped set is dominated by the `bare-*` runtime family
(`bare-buffer 3.7.1`, `bare-crypto 1.15.3`, `bare-fs 4.8.1`, `bare-events 2.9.2`,
and others).

This is a **packaged manifest**, not a resolved production lockfile. It records
what shipped, not how it was resolved, and it does not reconstruct the transitive
graph, build flags or native toolchain.

> The WDK React Native quickstart lists Bare Kit `>= 0.14.5` while the recovered
> 604 context records `0.14.0`. **Do not upgrade the 604 QVAC/Bare runtime** to
> satisfy a quickstart version table. Any wallet spike freezes its own versions.

UI toolchain pins (`ui-toolchain/package.json`): `acorn 8.15.0`,
`css-tree 3.1.0`, `eslint-scope 8.4.0`, `terser 5.44.0`.

Tool pins (`TOOL-PROVENANCE.json`, `"keysIncluded": false`,
`"toolPinsDoNotEstablishOriginalNativeBuildGraph": true`):

| Tool | Version / commit | SHA-256 |
| --- | --- | --- |
| JADX | 1.5.6 | `545ea2be9c242511bc145755cf4bda2485ade42966e096f8b4d3da2a230e8974` |
| hermes-dec | `a0f18f97ab661eb8ed659c8c683a0d21ea619e69` | `8b14716ae7d571d130bceee120956b3c3bab5533955cc67da86fbc3fbb7ce52f` |
| Android build tools | 36.0.0 | `5d9ac77fb6ff43d9da518a337b4fcf8f9097113df531d99ccefe80ef7ce8250b` |

Versions named in `BUILD-INPUTS.json` / `build-plans.py` evidence rather than
chosen: React Native 0.81.5 (its bundled `hermesc`), Android build tools 36,
minSdk 29 / target 36. **No version here was selected by picking "latest".**
Gradle, AGP, Kotlin, JDK, NDK and CMake versions are **not** established by any
available evidence and must not be guessed.

## Exact minimum artifact requests

Each entry is a concrete request: name, hash where known, and what it unblocks.
Deliver through the private artifact workflow — never Git.

| # | Artifact | SHA-256 | Unblocks |
| --- | --- | --- | --- |
| N1 | `Solaris-Android-604-Handoff-Part-1..4-of-4.zip` + `Assemble-Solaris-604-Handoff.py` | reassembles to `b31177db52d0b041d8dd66ed5e3d3b504ef2448e60b54f8e6a8a436f9a8c0e3d` (1,518,762,347 bytes) | Everything below; the full-reference gate |
| N2 | `Solaris-603-Build-Inputs.zip` | `0745458668eb3ff149fa881b647095a74865b97fba84f39fc88297becb49019d` | HBC reconstruction: pinned `hermesc`, parser, formatter, packaging tools |
| N3 | Exact 603 base HBC | digest `b8ac7d1b58d9e8ea6eadd25de516e35842aea14e4b849462664bb3200fedc990` (required by `build-plans.py`) | Any guided-routing patch build, including the A605 candidate |
| N4 | Pinned `hermesc` from RN 0.81.5 | `b4c37f09410c6c6c0ce90df00eb270dc257d2184c85ca320382ebe06057f2a14` | Same as N3 |
| N5 | Signed 604 APK | `0e9a66da…` | Differential component comparison; payload/alignment verification |
| N6 | `reconstruction-inputs/` + `reconstruction-work/` trees | per full-reference inventory | Reference APKs and restored tool paths the saved scripts expect |
| N7 | `Solaris-603-Model-Test-Input.zip` | `d6a1d5640ce37e9aa2ff2aee56d1f78534ebd6b93e80dc6fe262c851a122f9da` | **Optional** — model experiments only |

N3 and N4 are the smallest pair that would unblock an executable A605 candidate.
N1 is the smallest single request that unblocks the full-reference gate.

## Milestones

| # | Milestone | State |
| --- | --- | --- |
| 1 | Inventory and missing-input list | **This document** |
| 2 | Pinned clean build environment | BLOCKED on N1/N2 |
| 3 | Source-backed **unsigned** native build | BLOCKED on milestone 2 and the eight unrecovered items |
| 4 | Integration of the actual host/UI/worker | BLOCKED on milestone 3 |
| 5 | Differential component tests and compatibility assessment | BLOCKED on milestone 4 |

A byte-identical 604 HBC reproduction is useful evidence, **not** a whole-app
native source build. Reproducibility claims require more than one machine.

## F06 — treat the race as a hypothesis

Decompiled references (`reference/native-decompiled/L5/m.java:223–232,324–329`,
`m$I.java:18–25`, `m$h$a.java:37–90`) suggest an asynchronous recovery operation
may complete after lock and repopulate temporary recovery state while completion
resolves a mutable current promise.

**This is not a demonstrated vulnerability.** Reproduce against actual DEX/native
execution with synthetic data — lock during recovery, overlapped next operation —
before claiming it or patching anything. If reproduced, fix with immutable
operation identity and generation checks at every state assignment and
completion. Do **not** modify crypto, record IDs, recovery encoding or storage
layouts to avoid reproducing it.

The established part of F06 is the **validation gap**, which stands regardless:
process death during database/recovery operations, disk-full failure,
authenticated recovery onto a second device, biometric/key invalidation,
attachment restoration, and an upgrade retaining identity and record semantics
are all untested.

Two constraints to carry forward:

- The recovery envelope has a preserved **16 MiB plaintext ceiling**
  (`src/reconstructed/RecoveryEnvelope.java:27,37–43,80–81`). Characterize the
  supported capacity at that boundary and warn before backup becomes impossible.
  Do not change the format or advertise unlimited capacity.
- `allowBackup=false` does **not** prove every OEM device-transfer path is
  disabled. Test OS/OEM cloud backup and device transfer separately.

## Signing — preserve, do not rotate

The shipped signer is a shared public Expo development fixture. It cannot
establish exclusive production key custody. Preserve the current update identity
throughout reconstruction; a production signing transition is a separate design
with its own migration evidence. No silent key rotation, uninstall or data reset.
No key in Git or CI.
