# Solaris Android 604 — small source import

This package is for importing the **available editable/recovered source, tests and selected references** into a private GitHub repository and starting a Claude Code audit. It was projected from the exact verified full 604 archive. It is not the full backup, a complete original native Android project, or a self-contained APK build environment.

The original four large ZIPs remain the complete private backup. They are not needed merely to import and inspect this source package. Keep them for later restoration of missing build inputs. No application source was edited for this package.

## Start here

1. Read `AGENTS.md`, `IMPORT-PACK-NOTES.md`, `handoff/SOURCE-MAP.md` and `Solaris-Android-R4/docs/Solaris-604-Build-Report.md`.
2. Review `verify-import.py`, then run `python3 verify-import.py`. It verifies this source package's inventory only. It does not reproduce the APK or rerun the historical regression suite.
3. Read `setup/Solaris-Android-GitHub-Setup-and-Product-Brief-2026-09-17.md` and the companion README draft for the repository's product vision, documentation and bounded roadmap.
4. Follow `setup/CLAUDE-IMPORT-PROMPT.txt` for the private bootstrap. Its small-package input route replaces the old requirement to supply all four backup ZIPs before any source work. Full-reference reproduction still needs the original inputs.

`Solaris-Android-R4` is the latest 604 change layer. R3/R2 and `Solaris-Android-Reconstruction` supply older source and reference evidence. Preserve these relative paths. The probe folder contains retained experiment code, not installed model/runtime dependencies.

The source includes guided common replies and selected-check-in grounding, while general model answers and background/draft behavior have known limits. Native Gradle/application source remains incomplete. P2P practitioner exchange, wallets, GPS payouts and sovereignty discovery are roadmap work. See the build report and setup brief for evidence and product boundaries.

## Provenance and omissions

Full original ZIP SHA-256: `b31177db52d0b041d8dd66ed5e3d3b504ef2448e60b54f8e6a8a436f9a8c0e3d`.

`IMPORT-PROVENANCE.json` lists every retained original file, its original relative path/hash and exclusion-category counts. Private evidence names and hashes are not copied into that inventory. `IMPORT-INVENTORY.json` also covers the new import instructions. `selection-policy.py` records the selection rules. These are new projection records, not rewritten original manifests.

Excluded: private phone evidence; APK/HBC/model/tool binaries; bundled `node_modules`; full-host disassembly and generated whole-bundle string tables; most archived 601 recovery material; full-backup manifests/runners and optional runtime/native experiment dependencies. Original UI images used by retained readable source are included; phone screenshots are not. The four large original ZIPs preserve excluded material without changing its bytes.

Some retained historical documents, tests and reports refer to excluded paths or old workspace locations. Such references are known restoration dependencies, not an instruction to fabricate inputs. Some isolated source tests may run after inspection; complete baseline verification/reproduction is blocked in this small package.

A successful import inventory check proves preserved file bytes, not application security, licensing clearance, native build completeness or production readiness. Keep the repo private while auditing. No GitHub repository, push, APK build, installation or deployment was performed in preparing this package.
