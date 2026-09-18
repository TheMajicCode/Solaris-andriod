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

## Input reconciliation — checked before requesting anything

Verified against what is actually present in this workspace on 18 September 2026.
Nothing below was requested from the owner before checking.

| # | Input | Status | Evidence |
| --- | --- | --- | --- |
| **N4** | Pinned Linux x86_64 `hermesc` | **RESTORED and digest-verified** | See the restoration record below |
| N3 | Exact 603 base HBC, `assets/index.android.bundle`, 30,754,484 bytes, SHA-256 `b8ac7d1b58d9e8ea6eadd25de516e35842aea14e4b849462664bb3200fedc990` | **MISSING** | Not present. Extracted from the 603 APK, which is restricted. |
| N-APK | Exact 603 APK `Solaris-V6.0.3-Pocket-Chat-Candidate.apk`, SHA-256 `25d3642ab5f45986e5dfcfe5c5413d40982c6142eb703adffc391f9d3b033227` | **MISSING** | `reconstruction-inputs/baseline-603/` absent. **The current builder needs the APK, not the HBC alone** — it extracts the bundle itself. |
| N1 | Four-part 604 handoff backup | **MISSING** | Restricted; owner-held |
| N2 | `Solaris-603-Build-Inputs.zip` | **MISSING** | Restricted; owner-held |
| N5 | Signed 604 APK | **MISSING** | Restricted; owner-held |
| N6 | `reconstruction-inputs/` + `reconstruction-work/` trees | **MISSING** | Restricted; owner-held |
| N7 | `Solaris-603-Model-Test-Input.zip` | **MISSING — optional** | Model experiments only |
| Hermes runtime/harness | Matching runtime for executable host comparison | **MISSING and separately required** | `hermesc` compiles; it does not execute host bytecode. |

### N4 restoration record

Retrieved from verified public upstream — a non-sensitive tool, explicitly
permitted, and **restoration rather than a dependency upgrade**. Nothing was
upgraded and no application dependency changed.

| Field | Value |
| --- | --- |
| Approved source | `https://registry.npmjs.org/react-native/-/react-native-0.81.5.tgz` |
| Archive size | 24,766,674 bytes — **matches the pin exactly** |
| Archive SHA-256 | `e31721654764d1ca040bdddc5d6343376cef799f65115098ba250340af7e18b2` — **matches the pin exactly** |
| Archive member extracted | `package/sdks/hermesc/linux64-bin/hermesc` (only this one) |
| Compiler SHA-256 | `b4c37f09410c6c6c0ce90df00eb270dc257d2184c85ca320382ebe06057f2a14` — **matches the N4 pin exactly** |
| Compiler size / type | 3,787,344 bytes; ELF 64-bit x86-64, statically linked, stripped |
| Reported version | Hermes release 0.12.0 (LLVM 8.0.0svn) |
| Smoke check | `hermesc -O -g0 -emit-binary` on a trivial script produced HBC, exit 0 |
| Destination | Outside the repository, in the session scratchpad. **Not committed** — binaries stay out of ordinary Git. |
| License status | React Native is MIT-licensed upstream; redistribution here is **not** performed and remains unreviewed |
| Consuming command | `Solaris-Android-R4/grounding/build-plans.py`, which requires it at `reconstruction-work/r2-tools/react-native-0.81.5/package/sdks/hermesc/linux64-bin/hermesc` |

Archive members were listed and checked for absolute and traversal paths before
extraction, and only the single required member was extracted.

**What this unblocks, and what it does not.** The compiler is available, so donor
compilation is no longer blocked *by the compiler*. It is still blocked by N3 and
the 603 APK: `build-plans.py` asserts the exact 603 base bytecode digest, and
`build-bundle.py` consumes the APK. Executable host comparison would need a
matching Hermes **runtime**, which `hermesc` is not.

## Exact minimum artifact requests

Only these are actually needed from the owner. Each is restricted and must come
through the private artifact workflow, never Git.

| # | Artifact | SHA-256 | Unblocks |
| --- | --- | --- | --- |
| **N-APK** | `Solaris-V6.0.3-Pocket-Chat-Candidate.apk` | `25d3642ab5f45986e5dfcfe5c5413d40982c6142eb703adffc391f9d3b033227` | **The smallest single request.** The builder extracts N3's bundle from it, so it satisfies both. |
| N3 | 603 base HBC, if the APK cannot be supplied | `b8ac7d1b58d9e8ea6eadd25de516e35842aea14e4b849462664bb3200fedc990` | Donor compilation and patch checks, but not the full bundle builder |
| N5 | Signed 604 APK | `0e9a66da00cbe128851d981a9f9a3d9a1dbfe653f7a4ced93d638bc4d7d31827` | Differential component comparison |
| N1 | Four-part 604 handoff backup | reassembles to `b31177db52d0b041d8dd66ed5e3d3b504ef2448e60b54f8e6a8a436f9a8c0e3d` | The full-reference gate and N6 |
| N7 | `Solaris-603-Model-Test-Input.zip` | `d6a1d5640ce37e9aa2ff2aee56d1f78534ebd6b93e80dc6fe262c851a122f9da` | **Optional** — model experiments only |

**N-APK is now the single highest-value request**, because N4 is restored and the
APK yields N3.

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
