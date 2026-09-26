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

## Scope of authorized work

This repository began as an **import-only** bootstrap. The owner has since
authorized a **bounded candidate repair** (routing and answer-boundary work) and
a **native build recovery** workstream, in separately reviewable branches.

That extension does not relax the imported-byte rule; it makes deviation
explicit. See [`docs/provenance/CANDIDATE-CHANGES.json`](docs/provenance/CANDIDATE-CHANGES.json).

The extension still does **not** authorize: merging, force-pushing, history
rewriting, branch or repository deletion, releases, deployment, APK signing or
installation, key or signer changes, data resets, wallet generation, payments,
or any change to the Solaris web repository.

**Merge and evaluation-release authorization (26 September 2026).** The owner
has additionally authorized exactly two actions on the reviewed engineering
foundation, superseding the "merging" and "releases" clauses above **only**
for these: (1) a normal merge commit of the reviewed `claude/solaris-android-import-iyla4d`
branch into `main`, with no squash or force-push that would discard the
reviewed history; and (2) publishing the specific, already-signed historical
604 APK (`org.solarishealth.edge.recovery`, `6.0.4-preview.grounded-chat` /
code 604) as a clearly labeled GitHub **prerelease** evaluation artifact,
subject to its own eligibility, hash and outgoing-content checks. See
[`docs/ARTIFACTS.md`](docs/ARTIFACTS.md). Every other item on the list above —
branch/repository deletion, deployment, new APK signing or repackaging,
installation, key or signer changes, data resets, wallet generation, payments,
and any change to the Solaris web repository — remains unauthorized.

## Evidence rules

- **Preserve imported bytes.** Imported source, tests and evidence are
  hash-verified against the import manifest. New README, governance, CI and docs
  are explicit new work, tracked separately — never a reason to refresh a
  baseline hash.
- **Two integrity models, never merged.** The *frozen reference* (original
  hashes and evidence) never changes to accommodate a repair. The *maintained
  candidate* records every authorized addition, modification or replacement in
  `docs/provenance/CANDIDATE-CHANGES.json` with the original hash, the resulting
  hash, a rationale and an integration target. `tools/repo-check.py` rejects
  unlisted drift, deletion and reclassification.
- **Every path is classified.** `docs/provenance/SOURCE-CLASSIFICATION.json`
  assigns one integrity role and one check scope to every tracked file. A new
  directory never silently inherits informational treatment — an unclassified
  path fails the run.
- **New candidate source gets the strictest treatment**, not the loosest: syntax,
  lint where configured, and functional tests must pass.
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

- `python3 -m pip install --require-hashes --no-deps -r tools/requirements.txt`
  — the checker's dependencies are **required**, not optional.
- `python3 tools/repo-check.py` — this repository's **source-only** checks.
- `python3 tools/tests/test_repo_check.py` — the checker's own negative controls.
- `docs/provenance/import-pack/verify-import.py` — frozen transport-pack check.
  It applies to the unchanged extracted pack only and cannot run in this tree.
- Full-reference 604 reproduction runs in the restored immutable reference
  directory, never here. See [`docs/BUILD-AND-TEST.md`](docs/BUILD-AND-TEST.md).

**Checks fail closed.** A missing dependency, an empty scope, an unexpected error
or an unregistered defect is a FAILURE — never a skip, and never a green run. A
genuinely out-of-scope gate is reported as BLOCKED and is never a pass.

## Publication policy

This repository is **public**, and public continuation is explicitly authorized
by the owner (18 September 2026). That supersedes the earlier private-visibility
requirement and the mandatory-private-backup prerequisite. **Do not open the
visibility question again, and do not create refusal-only commits.**

What stays out of public Git, CI logs, artifacts and Releases, without exception:
patient and vault data, raw phone recordings, credentials, signing and wallet
secrets, and restricted third-party binaries.

Public source authorization is **not** a license grant for unrelated or
restricted material. Inspect the specific outgoing commit range and newly
reachable history before a push; exclude any affected addition and continue the
unaffected work. Never print a discovered secret value — report the concrete
action needed. No silent history rewrite, and no key rotation.

Still unauthorized, except for the two narrow actions dated 26 September 2026
above (merging the reviewed branch, and publishing the one named historical APK
as a labeled prerelease): force-pushing, history rewriting, any other release,
deployment, new APK signing or repackaging, installation, key or signer
changes, data resets, SDK upgrades, wallet creation, fund movement, creating a
replacement repository, and any change to the Solaris web repository.

Long product and history documents are linked from
[`README.md`](README.md) rather than injected into every agent session.
