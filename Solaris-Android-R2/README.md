# Solaris candidate 602 reconstruction

This is the editable reconstruction and build evidence for a narrow candidate
from verified code 601. It adds two completion admission guards. The existing
package and signing identity are preserved. It does not complete LUCA's SDK
resume repair or recover the missing original native project.

Read `docs/CANDIDATE-SCOPE-602.md`, the final `BUILD-REPORT.md`, and the independent
reviews under `evidence/guard-patch/` and `evidence/apk-packaging/`.

## What is editable

- `src/host-baseline/qvac-service-baseline.mjs`: evidence-mapped constructor and
  14 coordinator methods, compared with the original compiled functions.
- `src/patches/completion-guards.semantic.js`: the precise readable repair intent.
- `tools/patch-completion-guards.py`: complete deterministic HBC transformation.
- `tools/package-candidate.py`: complete unsigned APK packaging and verifier.
- `tools/sign-reviewed-candidate.py`: signing with an explicit hash-bound review gate.
- `tests/`, `tools/run-hermes-comparison.py`, `tools/test-completion-guards.py`:
  actual-bytecode and reconstruction comparisons, fixtures and assertions.
- `evidence/integration-feasibility/`: complete reference VM runner, compiler
  transforms, pinned acquisitions, source rebuild commands and portability helpers.

The companion editable archive also contains the complete previous
`Solaris-Android-Reconstruction/` checkpoint: recovered UI and worker source,
partial native reconstruction, exact compiled references, recovery codec and
all recorded unknowns. Retained binaries are identified as binaries; no original
App.tsx or native dependency graph is invented.

## Restore and reproduce

Extract the editable and build-input archives into the same empty directory,
keeping their top-level paths. The baseline APK is at
`reconstruction-inputs/baseline/Solaris-V6.0.1-Sanctuary-Recovery.apk`.
Both archives include `DELIVERY-CONTENTS.json` with every member's SHA-256.

The exercised host environment is Linux x86-64 with Python 3.12, Node 24 and Java
17. The retained Hermes binaries also require the recorded ICU 74 and compatible
system C/C++ runtime. This is not a complete operating-system image. Exact tool
archives, binary hashes and runtime build inputs are retained; the analysis VM
can be rebuilt using `evidence/integration-feasibility/rebuild-runtime.py`.

From the extraction directory:

```bash
python3 Solaris-Android-Reconstruction/tools/verify_checkpoint.py
python3 Solaris-Android-R2/tools/run-hermes-comparison.py
python3 Solaris-Android-R2/tools/run-hermes-comparison.py --patched --output patched-comparison.json
python3 Solaris-Android-R2/tools/test-completion-guards.py
```

To reproduce the transformation, choose a new output so preserved evidence is
not overwritten:

```bash
python3 Solaris-Android-R2/tools/patch-completion-guards.py \
  Solaris-Android-Reconstruction/src/recovered-601/compiled-reference/assets/index.android.bundle \
  rebuilt-602.hbc
python3 Solaris-Android-R2/tools/package-candidate.py \
  --baseline reconstruction-inputs/baseline/Solaris-V6.0.1-Sanctuary-Recovery.apk \
  --patched-hbc rebuilt-602.hbc \
  --tools-dir reconstruction-work/toolchain/android-tools \
  --output-dir rebuilt-602-unsigned
```

Signing is separate and requires the exact reviewed hashes. Its complete
command and gate are retained with the signed build evidence. The existing
shared public development fixture is not a newly generated key or a vault key.
Following the prior signer handoff, raw keystore bytes and credentials are
excluded from downloadable archives. The pinned official commit, byte hash,
acquisition/verification code and public certificate are retained so the same
fixture can be recovered and verified; signing requires that exact fixture.

No command here installs an app, resets data, migrates keys, pushes or deploys.

## Interpretation of tests

The desktop reference executes actual original and modified Hermes bytecode
with explicit synthetic dependencies. It verifies the selected host boundary;
it is not an Android device test or actual model inference. Recovery/vault/ID
and native model behavior are preserved by retaining their original bytes,
not by replacing them with newly invented implementations.

Full lifecycle state reconciliation, deferred step dispatch and missing full
native source remain separate work. See `docs/LIFECYCLE-REPAIR-DESIGN.md`.
