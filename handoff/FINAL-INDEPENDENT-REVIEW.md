# Independent final handoff review

Reviewed 17 September 2026. **PASS within the handoff-documentation, audit-entry-point and packaging-script scope.** No unresolved blocking defect was found in the reviewed wrappers and current guidance after the corrections below. The final outer ZIP, final manifest membership and complete baseline reproduction remain the delivery owner's separate final gates; this report does not claim to verify a ZIP that had not yet been finalized.

This review made no application or reconstructed-source changes and performed no signing, installation, data reset, key change, repository creation, push or deployment. Checks used disposable synthetic directories outside the retained baseline.

## Findings corrected before approval

1. `audit.py --syntax` initially applied exclusions to absolute path components. Extracting the handoff under a parent named `evidence` silently skipped all R4 source while returning PASS. Exclusions now use paths relative to the R4 directory, and an empty source set is BLOCKED. The original defect was independently reproduced; the corrected case passed.
2. Unavailable Node and unsupported runtime conditions initially collapsed into a generic failed completion. The wrapper now preserves BLOCKED and returns exit 2, distinct from a failed check (exit 1) and a pass (exit 0). Missing Node and empty source were exercised independently.
3. Byte hashes alone did not detect missing executable permissions after ZIP extraction. The verifier now checks required executable access on POSIX when declared by the inventory. Both absent and present executable permissions were exercised independently.
4. Unimported transient release-copy files were observed outside the original checkpoint inventory. The delivery owner will exclude these from the final inventory and ZIP; `.gitignore` now ignores transient entries under `releases/`. This does not authorize dropping any imported source, evidence or build input.

## Bounded independent checks

Nine synthetic checks passed: source discovery beneath an ancestor named `evidence`; missing Node returns BLOCKED/2; empty R4 source returns BLOCKED/2; valid inventory passes; changed bytes fail; parent path escape is rejected; absent required executable permission fails; present permission passes; and a final-path symlink is rejected. Machine-readable results are preserved in `handoff-review-checks.json` alongside this review for inclusion in the final handoff.

The audit and verifier Python entry points parsed successfully. The current local Markdown links in the reviewed handoff guidance resolve. The Codespaces JSON is minimal and parseable; no Codespace was started and no pinned Android environment is claimed.

All six retained phone-recording JPEGs are excluded by `.gitignore`. The same directory also holds the recording-specific metadata and derived evidence. Ordinary retained large build inputs and APKs are ignored. An ignore rule is a staging aid, not a secret scan or permission to force-add private evidence. Retaining the frames in the user's complete private archive does not imply they belong in Git or an agent's audit prompt.

The newly restored exact model file was independently hashed: 382,156,480 bytes, SHA-256 `33bcc57074ec7b6eada5a90651ee546ec0c2b271002c22baf9f1b2dd1e8f75cb`. It matches the declared experimental input and is not loaded by either audit entry point. The updated source map clearly distinguishes the earlier 5,166-entry inventory review from the two model-input additions (5,168 imported entries).

## Execution and preservation review

`--syntax` parses Python and uses `node --check`; it does not execute application modules, install dependencies, sign or package an APK. It correctly describes this as syntax checking rather than full lint/security scanning.

`--reproduce` first verifies the supplied inventory and restricts execution to Linux x86_64 with Python 3.11+ and Node. It copies R4 into a fresh ignored output directory. The chosen R4 test runners write only inside that private copy or explicit new result paths. Retained R2/R3/reconstruction/tool roots are linked for reads. Inspection of the selected build/transpilation/Hermes runners found no reachable signing, installation, package download or network action. Python bytecode cache writes are disabled for child processes.

The bundle builder verifies the exact 603 APK, the pinned Hermes compiler and the narrow changed-function/string scope. The wrapper additionally compares the generated HBC to the reviewed build-604 hash before running existing UI, helper, guided, open-chat, authority-race and lifecycle suites. The linked older helpers write their generated fixture output only to supplied new paths. These tests use synthetic native/storage boundaries and do not establish Android persistence, rendered UI, background scheduling or phone latency.

This isolation is a property of the currently reviewed and hash-inventoried scripts; symlinking older roots is not an operating-system sandbox. A later edited runner must be reviewed again rather than assumed unable to write through those links.

## Packaging script review

`handoff/package.py` writes a normal ZIP from the frozen file inventory plus that inventory itself. It does not refresh hashes, install tools, sign, upload or perform a Git operation. Inputs are checked before archive creation; output must be new and outside the project. It writes Unix regular-file attributes, including declared executable permissions, and fixed entry timestamps.

Six independent packaging probes passed: exact declared ZIP members and payload; executable mode preservation; refusal to overwrite an existing output; refusal of output inside the project; refusal of changed input before creating output; and refusal of a symlinked input. Results are in `handoff-package-review-checks.json` for inclusion with the review.

Packaging reopens inputs after the initial hash pass. Keep the workspace frozen during packaging, and retain the delivery owner's planned post-packaging comparison of every ZIP entry against the frozen hashes. No proof of a completed full archive is inferred from these small synthetic probes.

## Documentation and collaboration review

The root README and source map correctly call the archive the complete available reconstruction through 604, while explicitly identifying the missing original native Gradle/application graph, original host source and complete native dependency/build inputs. Decompiled class representations and host pseudocode are classified as reference evidence. No production-readiness claim is made from lint, scans, packaging or desktop tests.

The signing certificate is accurately described as the matching existing development fixture, with raw credentials absent. The instructions prohibit silent key replacement and preserve package identity, vault/recovery formats, record IDs, existing models, explicit source selection and lock/cancellation boundaries. The handoff does not promise ongoing background generation or durable unfinished-draft recovery.

`CLAUDE.md` imports `AGENTS.md` using the documented literal import form. Shared task/revision/review records coordinate Claude Code and Codex, with one writer per path. Dedicated Android repository guidance follows the current workflow; older monorepo/Copilot-primary plans are explicitly historical and do not activate schedules or authorize web/backend changes. The Codespaces configuration has no install hooks, services, forwarded ports, secrets or automatic model downloads, and its untested/unpinned status is disclosed.

The first-audit prompt separates source categories, requires evidence-based findings, avoids automatic upgrades or mechanical repairs to decompiler output, and preserves independent review. The production-gate document keeps native source completeness, vault/identity compatibility, device acceptance, model reliability, dependency posture and release signing as distinct outstanding work.

## Reviewed revision

The following hashes bind this review. Changes to these files after review need proportional re-review; historical source/archive inventory coverage is recorded separately in the inventory review.

| File | SHA-256 |
| --- | --- |
| `README.md` | `dab54991702df03110a9b83c4685432d42e244020531fb4075b392fb3af66ce9` |
| `AGENTS.md` | `37fed2687d3bf2acd6d444232f7c6a1e4828772625d16ec214885075bc1a2fdb` |
| `CLAUDE.md` | `5346cc435f3999319cd911b609ead95a2795c387d30052ff9e5c7c53af237ff9` |
| `.gitignore` | `1119763895c1efef238451a4dcd7a030c9d2ec334176fc604f2f0046d2f73194` |
| `.devcontainer/devcontainer.json` | `f53f00aca1a64f00b48e500a5f66f9ca27b0e35e6968534517e5813dc71929e8` |
| `handoff/verify.py` | `ec11c91ba9705f2717af4cea0e9734189ab049c814a0c5bdc1643a4fba2cc5a0` |
| `handoff/audit.py` | `fcbead143436509bf1cc046651600661d558d8247eb3244f39ab5fbb4f5a1f61` |
| `handoff/FIRST-AUDIT-PROMPT.md` | `884281041d7f22d2dad286653c4343acd511288658cd34ac3e7f96f306fbadbc` |
| `handoff/GIT-IMPORT.md` | `00c72177a921ec1b22e82a98197178206ac2445fdc7a809217d4818263dc98d6` |
| `handoff/PRODUCTION-GATES.md` | `78c1d71e1495e72d0fd69021d52a03b0c03ec6d7e378b5d754824cb5766bcf9d` |
| `handoff/WORKFLOW.md` | `91905b7bebd2e951abc3e439155a7e478a5583dec1556fd6178bd10797130aa9` |
| `handoff/BUILD-INPUTS.md` | `7afc943307501e0fc2964426baa24e20b9c1655dec67bcf940e26e3cd49ac8a4` |
| `handoff/CURRENT-STATE.md` | `7e04c3a2fecb7ca841dc35d8cbb6297243db3073db73606b51d9699a8aa41201` |
| `handoff/SOURCE-MAP.md` | `f78f88213deead4e5e20b8c89a6f0c76c40e677ac4664b863a2baa106bf2f80d` |
| `handoff/DOCUMENT-STATUS.md` | `925ddddd79e5f0681d26393672af4f0884499ca160c3ca19e546a9a67dedfcd8` |
| `handoff/package.py` | `2a2de3123dc4aac49038263bcf737e74054cc8a025e855215e46c91bb1b665e4` |

## Final delivery checks still required

- Freeze the final inventory with every imported file preserved and no accidental transient/output files included.
- Run the supported handoff reproduction in the new location and confirm the imported baseline remains byte-identical afterward; report any missing tool or failed check accurately.
- Verify every final ZIP entry, path, content hash and required executable mode against the frozen inventory and preserved import mapping. Record the ZIP's own checksum separately.
- Preserve this review, its synthetic check results and the final command/results with the delivered handoff. Do not describe these packaging checks as production certification or on-device validation.
