# Native recovery inventory — A604-02 milestone 1

> **Companion document.** [`NATIVE-RECOVERY-INPUTS.md`](NATIVE-RECOVERY-INPUTS.md)
> records the documented pins each input must match. This file records what is
> actually present, what was restored and verified, and what is still needed.

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

## Input reconciliation — 18 September 2026

Verified in this workspace against the privately supplied
`Solaris-603-Host-Inputs.zip` (184/184 files matched its own manifest, 0
failures). Nothing below was requested from the owner before checking.

| # | Input | Status | Evidence |
| --- | --- | --- | --- |
| **N3** | Exact 603 host bundle `assets/index.android.bundle` | **RESTORED**, 30,754,484 bytes, SHA-256 `b8ac7d1b…` — exact | Supplied in the private kit |
| **N4** | Pinned Linux x86-64 `hermesc` | **RESTORED**, SHA-256 `b4c37f09…` — exact, Hermes 0.12.0, executes | Private kit; also independently retrievable from pinned public upstream |
| **Host runtime** | Custom `hermes-runner`, `libhermes.so`, `libjsi.so` | **RESTORED** — executed the 34-case and 10-case suites successfully | Private kit |
| **Transpile toolchain** | Babel 7.28.5, pinned `hermes-dec` source subset | **RESTORED** | Private kit |
| **N-APK** | Exact 603 APK, 242,588,871 bytes, SHA-256 `25d3642a…` | **MISSING** | Not in the kit. Needed only for APK-provenance verification; see below. |
| N1 | Four-part 604 handoff backup | **MISSING** | Restricted; owner-held |
| N2 | `Solaris-603-Build-Inputs.zip` | **Superseded for this purpose** — the selected tools it contains are restored | Kit provenance |
| N5 | Signed 604 APK | **MISSING** | Needed for differential APK/payload comparison, not for host work |
| N6 | `reconstruction-inputs/` + `reconstruction-work/` trees | **PARTIALLY RESTORED** — the paths the builders expect are populated from the kit | Restored into a disposable copy only |
| N7 | `Solaris-603-Model-Test-Input.zip` | **MISSING — optional** | Model experiments only |

### What changed: the host lane is no longer blocked

The 604 host bundle was reproduced **byte-identically** without the APK, and the
original host and lifecycle suites pass against it. See
[Host reproduction evidence](HOST-REPRODUCTION-EVIDENCE.md).

The APK is consequently **no longer the blocker it was**. It is still wanted, but
only for what it uniquely proves: that this bundle came from that APK, and the
APK's own integrity. It is not needed to continue host work.

## Separate the four things this often conflates

| Layer | State |
| --- | --- |
| **Host tools** — compiler, runner, libraries, transpiler | **Restored and executing.** |
| **Retained binaries** — 603 bundle, 604/603 APKs, native `.so`, model weights | Bundle restored; APKs and weights absent and restricted. |
| **Authored application source** | Host/UI/grounding layers present. The original native Gradle/Kotlin/NDK project is **not recovered**, and no tool in this kit recovers it. |
| **Native build graph** | **Absent.** Gradle wrapper, AGP, Kotlin, JDK, SDK, NDK and CMake versions are not established by any available evidence and must not be guessed. |

**Restoring host tools does not reconstruct Gradle or native source.** Those are
different problems; the kit moves only the first.

## Exact minimum artifact requests

The host lane is unblocked, so these are ordered by what they actually unlock now.

| # | Artifact | SHA-256 | What it uniquely unlocks | Priority |
| --- | --- | --- | --- | --- |
| N-APK | Exact 603 APK | `25d3642ab5f45986e5dfcfe5c5413d40982c6142eb703adffc391f9d3b033227` | Runs the **frozen** `build-bundle.py` unmodified, proving APK provenance for the bundle. The host reproduction itself no longer needs it. | Medium |
| N5 | Signed 604 APK | `0e9a66da00cbe128851d981a9f9a3d9a1dbfe653f7a4ced93d638bc4d7d31827` | Differential payload/DEX/native-library comparison and packaging verification | Medium |
| N1 | Four-part 604 handoff backup | reassembles to `b31177db…` | The full-reference gate | Low for host work |
| N7 | `Solaris-603-Model-Test-Input.zip` | `d6a1d5640ce37e9aa2ff2aee56d1f78534ebd6b93e80dc6fe262c851a122f9da` | Model experiments only | Optional |

**No artifact unblocks the native source build**, because the authored native
project was not recovered by this retrieval. That is a reconstruction problem,
not a transfer problem, and remains the largest open item (`F01`).

## Session and lifecycle continuity — requirements, not a design

Documented against the **existing** encrypted persistence. Nothing here changes a
storage or recovery format, and nothing claims background inference works.

| State | Current 604 behaviour | Requirement for a future bounded task |
| --- | --- | --- |
| **Draft** (typed, unsent) | Cleared on foreground loss. Not persisted. | If ever retained, it must live in the encrypted vault — **never** browser/plaintext storage. Explicit user retry, never silent resend. |
| **Pending** (sent, unanswered) | Does not exist. Inference is cancelled on background/lock. | Encrypted pending turn committed **before** inference, carrying a stable idempotent operation id. After unlock, explicit retry re-checks current authority and current selection. |
| **Completed** | Persisted and survives; chat view restores after unlock. | Unchanged. Completed-history survival and unfinished-work survival are **different claims** and must not be merged. |
| **Restart / process death** | Unfinished work is lost by design. | Restore only from the authenticated current vault. An uncertain write acknowledgement must be reconcilable without duplicating a record. |
| **Reauthorization** | Authority is rechecked at the side effect, including after receipt authentication. | Preserved. A retry after unlock is a **new** authorization, not a replay of the old one. |
| **Duplicate prevention** | Existing record IDs and commit guards. | Idempotent by operation id; retrying must never produce two assistant records or two receipts. |

This is `A606-02`, gated on understanding the existing persistence contract. It
is **not** in scope now, and the 16 MiB recovery-envelope ceiling and OEM
transfer behaviour remain unassessed.

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
