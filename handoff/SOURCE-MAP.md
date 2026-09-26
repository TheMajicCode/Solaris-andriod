# Source and evidence map

Use `../README.md` and build 604 as the current entry point. This is the complete **available** saved reconstruction through 604, not a claim that missing original source has been recovered.

| Area | What is editable and what it proves |
| --- | --- |
| `Solaris-Android-R4/grounding/fast-guided.js` and `build-plans.py` | Current guided reply routing and reviewed integration plans. These are authored source; the donor bytecode and compiler-prepared files are generated derivatives. |
| `Solaris-Android-R4/ui/sanctuary.html` | Readable current UI with preserved embedded assets. `sanctuary.compact.html` is the reviewed derivative fitted into the original fixed UI slot. |
| `Solaris-Android-R4/tools/` | Controlled HBC reconstruction, packaging and signing-gate source. The audit runner executes only the unsigned bundle builder. Signing scripts are present for review, not setup hooks. |
| `Solaris-Android-R4/grounding/`, `review-functional/`, `tests/ui/`, `lifecycle/`, `latency/` | Current tests, independent reviews and investigations. Some earlier trials here failed or were rejected; final release evidence and the build report identify the accepted candidate. |
| `Solaris-Android-R3/src/`, `tools/` and UI | Retained 603 open-chat repair and dependencies used by 604. Preserve its provenance; this is not a separate app to deploy. |
| `Solaris-Android-R2/src/` | Reconstructed coordinator baseline and 602 guard repair with reference-bytecode comparisons. |
| `Solaris-Android-Reconstruction/src/reconstructed/` | Isolated recovery-envelope source reconstruction, with component compatibility tests. It is not the entire native vault implementation. |
| `Solaris-Android-Reconstruction/src/recovered-601/` | APK-recovered worker and UI evidence. Bundled `node_modules` are third-party inputs, not maintained first-party app source. |
| `Solaris-Android-Reconstruction/reference/native-decompiled/` | Native class representations including decompiler limitations. Do not mass-format, lint-fix or compile these as if they were the missing original Gradle project. |
| `Solaris-Android-Reconstruction/reference/host-disassembly/` | Full recovered host disassembly and pseudocode. Pseudocode is diagnostic evidence, not executable authored JavaScript. |
| `reference/a1-unintegrated/` and previous checkpoints | Older or explicitly unintegrated work. Presence in this handoff does not mean it is shipped in 604. |
| `reconstruction-inputs/`, `reconstruction-work/` | Reference APKs, pinned host compiler/parser, formatter, Android packaging and runtime tools; restored at the paths expected by the saved build scripts. |
| `solaris-603-native-probe/` | Desktop native model experiments, dependencies and the exact optional model weight. The weight is not needed for the scoped handoff checks and is not a replacement phone model. |
| `handoff/historical-plans/` | Vision and workflow history. See `DOCUMENT-STATUS.md` before applying any instruction or proposed feature. |

No original native Gradle app, original host `App.tsx`, complete native dependency lock/build graph, or complete editable native library sources were found. Four matching APKs preserve the verified lineage while these gaps remain. No missing implementation has been invented for this handoff.

`IMPORTED-FILES.json` maps every retained archive entry to a final relative path and hash. The earlier independent inventory review covered 5,166 entries; two exact model-input entries were added afterward, bringing the import manifest to 5,168. `FILE-INVENTORY.json` also covers the new handoff files. Hash checks establish the saved baseline, not authorship, security or production quality.

Do not run a root-wide linter across pseudocode, decompiled Java and dependencies and treat every error as an app defect. Establish separate scopes for current authored code, historical/recovered evidence, and third-party inputs; document blocked native checks.
