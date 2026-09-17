# Handoff

## To the next writer

**State:** the 604 source import is complete and verified on branch
`claude/solaris-android-import-iyla4d`, documented, and proposed as an unmerged
draft PR. Nothing is merged. Nothing is deployed.

### Read first

1. [`AGENTS.md`](../../AGENTS.md) — binding constraints.
2. [`workflow/STATUS.md`](STATUS.md) — current writer, checks run, open findings.
3. [`BUILD-AND-TEST.md`](../BUILD-AND-TEST.md) — what runs, what is blocked.
4. [`FEATURE-STATUS.md`](../FEATURE-STATUS.md) — before calling anything working.

### Establish your own baseline before changing anything

```sh
python3 tools/repo-check.py
```

Expect `PASS` overall with one `INFO` finding (`AND-IMP-01`). If
`import-integrity` fails, **stop** — imported bytes have drifted, and that is a
provenance incident, not something to fix by regenerating the manifest.

### Traps specific to this repository

- `docs/provenance/import-pack/verify-import.py` **cannot** run here. That is
  correct. Do not repair it, relocate files for it, or refresh its inventory.
- A parse failure in retained recovered or probe evidence is a **finding**, not a
  file to edit. `AND-IMP-01` is the live example.
- Historical 604 test results belong to the dated handoff. Never present them as
  newly executed checks.
- There is no `gradlew` and no native build. Do not create scaffolding to make
  the tree look complete.
- Do not upgrade the 604 QVAC/Bare runtime, even if a dependency quickstart's
  version table suggests it.

### Carried-forward limits

Native production readiness is unproven; all eight production gates are open. No
security, dependency or license audit exists. No repository license is set. No
artifact release exists. Branch protection and required reviews are unset and are
the owner's to configure.

### Next action

Owner decision on the PR, then `AND-01` first slice — classification and triage,
findings only. See [`TASKS.md`](TASKS.md).
