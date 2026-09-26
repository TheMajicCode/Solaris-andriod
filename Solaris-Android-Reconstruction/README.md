# Solaris Android — controlled reconstruction checkpoint

Baseline: **V6.0.1 Sanctuary Recovery, code 601**. This checkpoint preserves all work produced in this reconstruction, its editable components, reference code, available build inputs and evidence. It is **not yet a complete buildable Android application** and contains **no new APK**.

Start with `docs/RECONSTRUCTION-SCOPE.md`, `docs/COMPATIBILITY-ASSESSMENT.md` and `docs/NATIVE-COMPATIBILITY.md`. Scope was written before implementation. Current authorization permits reconstruction and verification, but prohibits installation, reset, key changes, push and deployment.

## Source map

| Path | Meaning |
|---|---|
| `src/ui/sanctuary.html` | Readable reviewed UI source; its frozen formatting process reproduces the actual 601 HTML with recorded padding |
| `src/recovered-601/ui/` | Exact packaged UI literal, including padding, plus decoded images |
| `src/recovered-601/worker-files/` | 1,013 exact worker bundle files, including packaged dependencies; not the original host source tree |
| `src/reconstructed/RecoveryEnvelope.java` | New storage-free Java reconstruction of readable native recovery-envelope behavior; see component review and test limits |
| `src/recovered-601/compiled-reference/` | Original compiled HBC/DEX/resources/manifest; never confuse with authored source |
| `reference/native-decompiled/` | Complete selected native/app class coverage, decompiler fallbacks and dependencies; diagnostic source representations, not compile-ready Android code |
| `reference/host-disassembly/` | Full 15,513-function host disassembly and non-executable pseudocode; original host TypeScript remains missing |
| `reference/a1-unintegrated/` | Existing lifecycle helper and tests, preserved unchanged and still not integrated into the host |
| `reference/601-recovery/` | Prior reviewed repair, packaging evidence and signer provenance; historical commands are not instructions to sign now |
| `build-inputs/` | Observed dependency declarations, separate UI formatter lock and explicit missing build inputs |
| `evidence/` | Fresh logs, input hashes, independent reviews and verification results |

The companion build-inputs ZIP retains the exact code 601 APK and verified analysis/tool archives. The APK is a **reference input**, not a newly produced candidate. The shared development signing fixture is not included; its pinned provenance and matching certificate are recorded. No owner key material or phone data is included.

## Re-run the bounded checks

From this directory, with Python 3.12, Node 24 and Java 17 available:

```bash
python3 -m unittest discover -s tests -p 'test_recovery.py' -v
node --experimental-vm-modules --test reference/a1-unintegrated/test/active-qvac.test.mjs
node reference/a1-unintegrated/ui-followup/scripts/ui-repair-test.cjs
```

The first suite checks recovered source integrity and negative extraction cases. The latter two exercise the preserved helper and readable UI in synthetic host fixtures. None executes the Android application. The recovery codec has its own reproducible cross-reader command and dependencies in `docs/RECOVERY-CODEC.md`.

To reproduce extraction, supply the companion's exact code 601 APK and a **new** output directory:

```bash
python3 tools/recover_601.py /absolute/path/Solaris-V6.0.1-Sanctuary-Recovery.apk /absolute/path/new-extraction
```

The extractor accepts only the pinned artifact. It does not install, sign or execute it. `CHECKPOINT-MANIFEST.json` records every delivered source/evidence file; `tools/verify_checkpoint.py` checks those bytes.

## Resume safely

Continue reconstructing the actual Hermes host coordinator and database/recovery payload handling against the retained disassembly, with an executable reference comparison. Resolve the documented native decompiler ambiguities before replacing those components. Establish the application build graph and dependency lock explicitly as new reconstruction work; do not mislabel the formatter lock as the original Android lockfile.

Do not bypass the lifecycle queue, auto-resume from the worker, regenerate IDs, initialize over unreadable vaults, downgrade SQLCipher, replace the package/signer, or delete/redownload a valid model. Identity/GPS/P2P additions remain deferred. A source-based signed candidate remains blocked until every critical compatibility gate has evidence. Hardware acceptance is separate and unrun under the no-install instruction.
