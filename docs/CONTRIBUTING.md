# Contributing

## Before you write anything

1. Read [`AGENTS.md`](../AGENTS.md). It is binding for human and AI contributors
   alike.
2. Read [Feature status](FEATURE-STATUS.md) before describing any behaviour as
   working.
3. Read [Build and test](BUILD-AND-TEST.md) so you know which checks exist and
   which are blocked.
4. Check [`workflow/STATUS.md`](workflow/STATUS.md) for the current writer and
   open findings.

## One writer per path

A path has one writer at a time. Coordinate through
[`workflow/STATUS.md`](workflow/STATUS.md) before touching a path someone else
owns. Use separate branches or worktrees when two agents write concurrently.

## Branch workflow

```sh
git switch -c <kind>/<short-name>      # e.g. audit/android-604
python3 tools/repo-check.py            # establish the baseline BEFORE changing anything
# ... bounded change ...
python3 tools/repo-check.py            # re-run
git add <explicit paths>               # never `git add .` on an unreviewed tree
git diff --cached --stat && git diff --cached
```

Review the **complete staged diff and the file classifications**, not just
filename extensions, before committing.

## Task records

Every task records: problem, owner/writer, reviewer, base SHA, allowed paths,
acceptance evidence, output paths, status and next step. Keep it in
[`workflow/TASKS.md`](workflow/TASKS.md) and hand off through
[`workflow/HANDOFF.md`](workflow/HANDOFF.md). Local agent memory is not the
project ledger.

## Independent review

Another agent or person reviews an **exact commit or recorded file-hash set**,
not a description of the change. Material findings are resolved before pushing,
and review is refreshed after any material change.

Be accurate about what review is: independent AI review is genuine evidence, but
it is **not** an enforced GitHub approval from a second eligible account. A PR
author cannot approve their own PR, and a bot review does not count as a required
human approval. Where enforceable protection is unavailable, record the gap
honestly rather than implying it is covered.

## Rules that do not bend

- **Never edit imported bytes to make a check pass.** A failure in retained
  recovered or probe evidence is a finding to triage. See `AND-IMP-01`.
- **Never refresh a baseline hash** to conceal drift. New documentation is new
  work, tracked separately.
- **Never report a historical handoff result as a newly executed check**, and
  never relabel a blocked check as passed.
- **No bulk lint fixes** across pseudocode, decompiled Java or dependencies.
  Scope every check.
- **No dependency upgrades** as a side effect of another task. Specifically, do
  not upgrade the 604 QVAC/Bare runtime.
- **No invented scaffolding**: no fake Gradle project, no empty production
  modules, no placeholder wallet, no pretend API server.
- **No secrets** in Git, Actions artifacts, release assets, issue/PR bodies, logs
  or model prompts. Synthetic data only.
- **Preserve the source roots.** Moving `Solaris-Android-R*/`,
  `Solaris-Android-Reconstruction/`, `handoff/` or `solaris-603-native-probe/`
  breaks evidence links and needs its own reviewed task.
- **Do not modify the Solaris web repository** from here.

## Pull requests

Use the [PR template](../.github/pull_request_template.md). State exactly which
checks ran, which are blocked and why, what independent review found, and what
remains unproven. Leave merging to the owner's workflow; do not bypass
unavailable checks or use administrator overrides.

## Commit messages

Describe the change and its scope. Keep import commits separate from later lint,
dependency or product edits, so the baseline stays identifiable.
