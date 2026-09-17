# Solaris Android — shared agent instructions

This is the **Android product** repository: Solaris Android · Pocket LUCA. The
separate Solaris web repository is out of scope and must not be modified from
here.

Current application baseline: package `org.solarishealth.edge.recovery`, version
`6.0.4-preview.grounded-chat`, version code **604**. Exact source provenance for
every imported file is recorded in
[`docs/provenance/REPO-IMPORT-MANIFEST.json`](docs/provenance/REPO-IMPORT-MANIFEST.json).

## What this repository is

A reviewed **source projection** of the verified 604 handoff, plus this
repository's own documentation, workflow and scoped CI. It is an audit and
reconstruction workspace. It does not become a complete native Android source
project by adding Git, CI or a devcontainer.

The complete four-part 604 backup is the immutable reference and lives outside
this repository. See [`docs/ARTIFACTS.md`](docs/ARTIFACTS.md).

## Protected boundaries — do not change these without a separate authorization

- Package identity `org.solarishealth.edge.recovery`, the existing development
  signer and certificate, and the private Subject ID.
- Vault and recovery formats, record IDs, database schema and valid models.
- Existing selected-source, current-authority, foreground, lock and cancellation
  enforcement. Pocket LUCA holds no root, signing or spending authority.
- No data reset, key regeneration, new APK signing, installation, payment,
  deployment, public visibility change or automatic dependency upgrade.

## Evidence rules

- **Preserve imported bytes.** Imported source, tests and evidence are
  hash-verified against the import manifest. New README, governance, CI and docs
  are explicit new work, tracked separately — never a reason to refresh a
  baseline hash.
- Never edit imported bytes to make a check pass. A parse or lint failure in
  retained recovered/probe evidence is a **finding to triage**, not a file to fix.
  See `AND-IMP-01` in [`docs/workflow/STATUS.md`](docs/workflow/STATUS.md).
- Keep scopes separate: current authored source, recovered/decompiled evidence,
  third-party inputs and missing inputs each get different treatment. Do not run
  one root-wide linter across pseudocode and decompiled Java and call every error
  an app defect.
- State what was actually run. Never report a historical handoff test result as a
  newly executed check, and never relabel a blocked check as passed.
- Do not invent missing source, a native Gradle project, build scaffolding, a
  placeholder wallet or a pretend API server to make the tree look finished.

## Working method

- One named bounded task, one branch or worktree, **one writer per path**.
- Another agent reviews an exact commit or recorded file-hash set. Independent AI
  review is real evidence but is **not** an enforced GitHub approval from a second
  eligible account — never present it as one.
- Record task, writer, reviewer, base SHA, allowed paths, checks run, blocked
  checks, unresolved findings and next action in
  [`docs/workflow/`](docs/workflow/STATUS.md). Local agent memory is not the
  project ledger.
- Continue reversible local investigation and setup without repeated permission
  requests. Consequential and outward-facing actions need explicit authorization.

## Data handling

Use synthetic data. Patient records, production credentials, signing keys, wallet
seeds and personal phone evidence stay out of Git, Actions artifacts, release
assets, issue/PR bodies, logs and model prompts.

## Checks

- `python3 tools/repo-check.py` — this repository's **source-only** checks.
- `docs/provenance/import-pack/verify-import.py` — frozen transport-pack check.
  It applies to the unchanged extracted pack only and cannot run in this tree.
- Full-reference 604 reproduction runs in the restored immutable reference
  directory, never here. See [`docs/BUILD-AND-TEST.md`](docs/BUILD-AND-TEST.md).

Long product and history documents are linked from
[`README.md`](README.md) rather than injected into every agent session.
