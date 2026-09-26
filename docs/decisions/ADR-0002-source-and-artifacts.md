# ADR-0002 — Frozen reference versus repository projection

**Status:** Accepted · **Date:** 2026-09-17

## Context

The complete 604 handoff includes its own README, AGENTS, tools, binaries and
private phone evidence, and its own `handoff/verify.py` validates that **complete
frozen** set. A source-only Git clone necessarily lacks deliberately excluded
files, and this repository's README and governance intentionally differ. Running
the full inventory check here would correctly fail — which makes it useless as a
gate and dangerous as a habit.

## Decision

Two artefacts, never conflated:

1. **The immutable reference.** The complete 604 handoff, restored outside any
   Git working tree, unchanged. The handoff's own verifier and reproduction
   harness run **there**.
2. **The repository projection.** This repository: reviewed source and evidence at
   their original relative paths, plus new documentation, workflow and CI.

The projection gets its **own** entry point and CI name — `tools/repo-check.py`
and the `source-checks` workflow — which never reports a missing full reference
as a passed full-reference check.

Every imported file's original path, hash, tracked destination, classification
and inclusion reason is recorded in
[`REPO-IMPORT-MANIFEST.json`](../provenance/REPO-IMPORT-MANIFEST.json). The frozen
transport pack, including its own `verify-import.py` and inventory, is preserved
byte-for-byte under [`docs/provenance/import-pack/`](../provenance/import-pack/).

## Consequences

- Imported application bytes are preserved and continuously verifiable. New
  README, governance and CI are explicit new work and are **never** an excuse to
  refresh baseline hashes.
- `verify-import.py` cannot run in this tree. That is correct, documented, and
  must not be "fixed" by editing it or relocating files to satisfy it.
- Historical 604 test results stay attributed to the dated handoff. When app
  source is actually changed, a separately reviewed **candidate** harness is
  required; reusing the old verifier as a release gate is prohibited.
- Deliberately excluded material — private phone evidence, binaries, bundled
  `node_modules`, host disassembly, build inputs — stays out, enforced by the
  `excluded-path-policy` check rather than by good intentions.

## Large files and privacy

| Material | Destination |
| --- | --- |
| Reviewed source, tests, scripts, docs | Normal Git history, by explicit allowlist |
| Toolchains, weights, reference APKs, large bytecode | Curated private release assets, referenced by immutable hash |
| Full 1.52 GB handoff | Private, outside Git. Never uploaded unchanged — it contains private phone evidence. |
| Patient records, secrets, phone frames | Excluded from Git, Actions artifacts, release assets and issue/PR bodies |

Exclusion classes are recorded **without** reproducing sensitive filenames, user
text or health-linked digests into repository documentation. Details:
[Artifacts](../ARTIFACTS.md).

## The one-time transport exception

A single reviewed 20 MB source archive was authorized as a Git transport,
verified by hash, inspected, extracted outside the worktree and then removed from
the working tree. Its earlier Git object remains in branch history; **history was
not rewritten**. The exception does not extend to the four full backups, APKs,
models or tool archives.
