# Next native and host-recovery inputs

> **Companion document.** This file records the *documented pins* — the exact
> identities each input must have. [`NATIVE-RECOVERY-INVENTORY.md`](NATIVE-RECOVERY-INVENTORY.md)
> records the *reconciliation*: which of them are actually present, which were
> restored and verified, and which remain to be supplied. Read both.

Updated 18 September 2026. These identities were recovered from source at `edd43bd7404730480f3c5bd94720a3aef068fdb9`. **They are documented pins, not newly downloaded or verified binaries.** Reconcile them with Claude's N1–N7 inventory at the actual unpublished candidate before use.

## Exact identities

| Input | Required identity / location |
| --- | --- |
| N3: 603 base HBC | `assets/index.android.bundle` from the exact 603 APK; 30,754,484 bytes; SHA-256 `b8ac7d1b58d9e8ea6eadd25de516e35842aea14e4b849462664bb3200fedc990` |
| Existing builder's 603 APK input | `reconstruction-inputs/baseline-603/Solaris-V6.0.3-Pocket-Chat-Candidate.apk`; SHA-256 `25d3642ab5f45986e5dfcfe5c5413d40982c6142eb703adffc391f9d3b033227` |
| N4: pinned Linux x86_64 hermesc | `reconstruction-work/r2-tools/react-native-0.81.5/package/sdks/hermesc/linux64-bin/hermesc`; SHA-256 `b4c37f09410c6c6c0ce90df00eb270dc257d2184c85ca320382ebe06057f2a14` |
| Documented original compiler archive | `react-native-0.81.5.tgz`; 24,766,674 bytes; SHA-256 `e31721654764d1ca040bdddc5d6343376cef799f65115098ba250340af7e18b2` |

Sources: [HBC pin](https://github.com/TheMajicCode/Solaris-andriod/blob/edd43bd7404730480f3c5bd94720a3aef068fdb9/Solaris-Android-R4/tools/hbc_patch.py), [APK consumer](https://github.com/TheMajicCode/Solaris-andriod/blob/edd43bd7404730480f3c5bd94720a3aef068fdb9/Solaris-Android-R4/tools/build-bundle.py), [compiler consumer](https://github.com/TheMajicCode/Solaris-andriod/blob/edd43bd7404730480f3c5bd94720a3aef068fdb9/Solaris-Android-R4/grounding/build-plans.py), [compiler acquisition descriptor](https://github.com/TheMajicCode/Solaris-andriod/blob/edd43bd7404730480f3c5bd94720a3aef068fdb9/Solaris-Android-R2/evidence/integration-feasibility/compiler-acquisition.json).

The descriptor names the [original npm archive](https://registry.npmjs.org/react-native/-/react-native-0.81.5.tgz) and records additional npm integrity/provenance. If the compiler is missing, that exact archive is a narrowly scoped possible recovery source; downloading a newer React Native package is not equivalent. Inspect archive paths, verify recorded size/digests, then verify the extracted compiler digest and runtime prerequisites before execution. This is restoration, not an authorized dependency upgrade.

The existing private 604 build-input backup is the preferred source for the signed 603 baseline. `handoff/BUILD-INPUTS.md` also references retained 603 tools/runtime. Do not upload whole backups into ordinary Git or fabricate an artifact location: the accessible `artifacts/manifest.json` has no asset locations.

## What restoring them proves—and does not prove

The base HBC plus compiler may unblock applicable donor compilation, patch checks and host comparisons, provided the other exact harness/runtime inputs exist. The full current bundle builder requires the exact APK and extracts the HBC itself. HBC alone does not satisfy that CLI. Executable host comparisons may require the matching Hermes runtime separately from `hermesc`.

None of these inputs restores the original Gradle project, native sources, dependency graph or Android instrumentation environment. Track three independent milestones:

1. Exact historical host/component reproduction.
2. Candidate host integration and targeted regression evidence.
3. Genuine source-backed native application build and device compatibility.

A candidate is not installed, signed for distribution or called a native-source rebuild merely because milestone 1 or 2 passes. Preserve signer/package/record/recovery compatibility and keep keys out of source and CI.

## Retrieval and publication record

For each restored input record exact name, full hash, size, provenance/license status, approved retrieval source, destination, runtime/platform requirements and consuming test/build command. Verified public upstream locations are appropriate for non-sensitive tools; restricted backups remain separate. Public manifests may contain safe names/hashes/provenance, but not private retrieval URLs, credentials or patient data. Public GitHub Releases and Actions artifacts are not private storage. A hash prefix is not an integrity check. The source projection's frozen hashes remain unchanged; candidate edits use their own manifest.
