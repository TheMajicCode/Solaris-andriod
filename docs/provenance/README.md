# Provenance

Everything here records **where this repository's contents came from**. Nothing
here is a build gate.

| Path | What it is |
| --- | --- |
| [`REPO-IMPORT-MANIFEST.json`](REPO-IMPORT-MANIFEST.json) | This repository's projection manifest: original path, bytes, SHA-256, tracked destination, classification and inclusion reason for every imported file, plus exclusion-category counts and the deliberately edited documentation list |
| [`SOURCE-LINEAGE.md`](SOURCE-LINEAGE.md) | Dated source map, baseline identifiers and inherited-instruction provenance |
| [`import-pack/`](import-pack/) | The transport pack's own instruction files, **frozen byte-for-byte** |
| [`transport/`](transport/) | The authorization prompt and checksum file for the one-time transport archive |

## The frozen import pack

`import-pack/` holds the transport projection's own root files exactly as they
arrived: `README.md`, `AGENTS.md`, `CLAUDE.md`, `IMPORT-PACK-NOTES.md`,
`IMPORT-INVENTORY.json`, `IMPORT-PROVENANCE.json`, `verify-import.py`,
`selection-policy.py`, `dot-gitignore`, and `setup/`.

They are **superseded** at the repository root by this repository's own
[`README.md`](../../README.md), [`AGENTS.md`](../../AGENTS.md) and
[`CLAUDE.md`](../../CLAUDE.md). They are kept because they are the provenance of
the import decision, not because they are current instructions.

### `import-pack/verify-import.py` does not run here — and must not be made to

It verifies the transport pack against `IMPORT-INVENTORY.json` **in the pack's
own unchanged extracted directory**. In this repository it would correctly fail:
the source roots are no longer beneath it, and this repository deliberately adds
new documentation, governance and CI.

Do not edit it, do not move files to satisfy it, and do not refresh its
inventory. Use [`tools/repo-check.py`](../../tools/repo-check.py) instead — that
is this repository's equivalent entry point, and it verifies the same bytes
through `REPO-IMPORT-MANIFEST.json`.

At extraction time the pack verifier reported:

```json
{ "scope": "frozen-source-import-only", "files_checked": 1878, "status": "PASS", "failures": [] }
```

### Two files were renamed, with bytes unchanged

| Original | Tracked as | Why |
| --- | --- | --- |
| `.gitignore` | `import-pack/dot-gitignore` | So its ignore rules do not take effect inside the provenance folder. Bytes are unchanged and still hash-verified. |

The repository's own root `.gitignore` **starts from those exact bytes**, then
adds projection rules and re-includes five retained `build-inputs` JSON
descriptors that the full-handoff rule would otherwise drop. That edit is
recorded in the manifest's `deliberately_edited_documentation` list.

## What a verified import does and does not prove

It proves preserved file bytes. It proves **nothing** about application security,
licensing clearance, native build completeness or production readiness. See
[Build and test](../BUILD-AND-TEST.md) and
[`handoff/PRODUCTION-GATES.md`](../../handoff/PRODUCTION-GATES.md).
