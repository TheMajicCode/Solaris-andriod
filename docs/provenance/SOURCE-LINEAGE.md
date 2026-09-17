# Source lineage — 17 September 2026

## Baseline identifiers

| Item | Value |
| --- | --- |
| Package | `org.solarishealth.edge.recovery` |
| Version | `6.0.4-preview.grounded-chat`, version code **604** |
| Signed 604 APK | SHA-256 `0e9a66da00cbe128851d981a9f9a3d9a1dbfe653f7a4ced93d638bc4d7d31827`, 242,638,023 bytes |
| Released/reproduced 604 HBC | SHA-256 `30be9989cc00299836715cc3de5cf3a2a75b00019bdf2f1b91629205f558d8b3` |
| Existing signing certificate | SHA-256 `fac61745dc0903786fb9ede62a962b399f7348f0bb6f899b8332667591033b9c` (development fixture, not a production signer) |
| Complete 604 handoff ZIP | SHA-256 `b31177db52d0b041d8dd66ed5e3d3b504ef2448e60b54f8e6a8a436f9a8c0e3d`, 1,518,762,347 bytes |
| Transport archive used for this import | `Solaris-604-GitHub-Source-Import.tar.xz`, SHA-256 `d9e6bc8eb8a361eca34485f31802dff1edcbd7c6068097b533d358ba4793a4ca`, 20,179,572 bytes |

## Import chain

```
Four private backups                  Solaris-Android-604-Handoff-Part-N-of-4.zip
        │                             (held privately, outside this repository)
        ▼
Complete 604 handoff ZIP              5,234 archive members
        │                             b31177db…  1,518,762,347 bytes
        │  selection-policy.py projection
        ▼
Transport archive                     1,879 files — 1,867 retained originals
        │                             + 12 new projection/instruction records
        │                             d9e6bc8e…  20,179,572 bytes  ✔ verified
        ▼
This repository                       1,867 source files at original relative paths
                                      + 12 frozen pack files under docs/provenance/
```

`1,867 retained + 3,367 excluded = 5,234` archive members. The excluded counts are
carried verbatim into `REPO-IMPORT-MANIFEST.json`.

## What was retained, by classification

| Classification | Files | Meaning |
| --- | ---: | --- |
| `included-source-and-reference` | 1,733 | Reviewed source, tests, tools and reference evidence for the 604 lineage |
| `included-probe-source-and-evidence` | 112 | Desktop native-probe experiment source and results |
| `included-handoff-reference` | 19 | Handoff reference documents |
| `included-original-ui-asset` | 2 | Original embedded UI images used by retained readable source |
| `included-required-recovery-tool` | 1 | Recovery tool referenced by the retained 604 builder |

## What was excluded, by category

| Category | Files | Where it still exists |
| --- | ---: | --- |
| `third-party-dependency-excluded` | 2,623 | Bundled `node_modules` — exact copies and notices in the complete backup |
| `binary-or-asset-excluded` | 396 | APK, HBC, DEX, native library, model and other binaries |
| `external-build-input-excluded` | 122 | `reconstruction-inputs/`, `reconstruction-work/`, `releases/` |
| `optional-probe-input-excluded` | 93 | Probe runtime, model weight and acquired inputs |
| `historical-reference-excluded` | 64 | Full host disassembly and most archived 601 recovery material |
| `full-reference-runner-or-evidence-excluded` | 41 | Complete-handoff verifier/audit runners and their evidence |
| `generated-full-string-table-excluded` | 9 | Generated whole-bundle string tables |
| `private-evidence-excluded` | 8 | **Private phone evidence.** Filenames and hashes deliberately not reproduced. |
| `root-reference-excluded` | 6 | Original root files replaced by transport-aware instructions |
| `full-reference-inventory-excluded` | 5 | Complete-handoff manifests, which would falsely appear to gate a partial clone |

The selection rules themselves are preserved at
[`import-pack/selection-policy.py`](import-pack/selection-policy.py).

## Source roots and what each proves

Summarized from [`handoff/SOURCE-MAP.md`](../../handoff/SOURCE-MAP.md), which
remains the authoritative version:

| Root | Files | Role |
| --- | ---: | --- |
| `Solaris-Android-R4/` | 243 | Latest 604 change layer: guided routing, UI, tools, tests, reviews, lifecycle, latency, build report |
| `Solaris-Android-R3/` | 326 | Retained 603 open-chat repair and dependencies used by 604 |
| `Solaris-Android-R2/` | 761 | Reconstructed coordinator baseline, 602 guard repair, reference bytecode comparisons |
| `Solaris-Android-Reconstruction/` | 406 | Recovery-envelope reconstruction, recovered-601 evidence, native decompilations, build-input descriptors |
| `solaris-603-native-probe/` | 112 | Desktop native model experiment source and results — retained experiment code, not installed dependencies |
| `handoff/` | 19 | Retained handoff reference documents |

**No original native Gradle app, original host `App.tsx`, complete native
dependency lock/build graph, or complete editable native library sources were
found.** Four matching APKs preserve the verified lineage while these gaps
remain. No missing implementation has been invented.

## Inherited instruction provenance

| Layer | Where it now lives | Authority |
| --- | --- | --- |
| Original handoff root instructions | Replaced upstream by the transport pack | Historical |
| Transport pack `README`/`AGENTS`/`CLAUDE` | [`import-pack/`](import-pack/), frozen | Provenance of the import decision |
| Transport pack setup brief and README draft | [`import-pack/setup/`](import-pack/setup/), frozen | Source material for this repository's docs |
| This repository's instructions | [`AGENTS.md`](../../AGENTS.md), [`CLAUDE.md`](../../CLAUDE.md) | **Current** |
| Import authorization | [`transport/Solaris-604-Claude-GitHub-Import-Prompt.txt`](transport/Solaris-604-Claude-GitHub-Import-Prompt.txt) | Scope of this bootstrap only |

Historical no-push statements in retained handoff documents describe the earlier
handoff. A later explicit scoped instruction supersedes them **for that
instruction's scope only** — it does not grant general production actions.

## Verification performed for this import

1. Archive size and SHA-256 computed and matched against both the expected value
   and the adjacent `SHA256SUMS` file. ✔
2. Member list inspected before extraction: 1,879 entries, all regular files, one
   root `solaris-android-import`, zero absolute paths, zero parent traversals,
   zero links or device nodes. ✔
3. Extracted into a temporary directory **outside** the Git worktree. ✔
4. `verify-import.py` reviewed, then run in the unchanged extracted directory:
   1,878 files checked, PASS, zero failures. ✔
5. Every file re-hashed at its tracked destination in this repository while
   generating `REPO-IMPORT-MANIFEST.json`: 1,879 entries, zero mismatches. ✔
6. Transport archive removed from the working tree after verified import. Its
   earlier Git object remains in branch history; history was not rewritten. ✔
