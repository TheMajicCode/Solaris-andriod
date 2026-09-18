# Status

**Updated:** 2026-09-17 · Session 2

## Publication — authorized, conflict resolved

| Item | Verified value |
| --- | --- |
| Repository | `TheMajicCode/Solaris-andriod` — **public** |
| Visibility decision | Owner authorized public continuation, 18 September 2026 |
| Default branch | `main` at `5cc354c852565479020d4a6c99109fff992c6de4` |
| Input branch | `import/604-source` at `bf1d4e90ea173f088ca3fa9a6c806876aba51adc` |
| Task branch | `claude/solaris-android-import-iyla4d` |
| PR #1 | Open, draft, unmerged |

The earlier private-visibility gate is **superseded and closed**. It is not
reopened, and no further refusal-only commits are made. `F09`'s visibility
component is closed by instruction; foundation acceptance remains open on its own
merits.

What stays out of public Git regardless: patient and vault data, raw phone
recordings, credentials, signing and wallet secrets, restricted binaries. Public
source authorization is not a license grant for restricted material.

## Current task

| Field | Value |
| --- | --- |
| Task | `A604-01` — foundation: private import, integrity model and truthful CI |
| Writer | Claude Code (this session) |
| Reviewer | **NOT obtained.** The commissioned review of `8db241b` failed on a session rate limit (429). See [`SELF-REVIEW-8db241b.md`](SELF-REVIEW-8db241b.md) — a self-review is not a substitute. |
| Base | `edd43bd` |
| State | Foundation repairs complete locally and unpushed |

## Checks actually run this session

Local only. Remote CI has not run on this work.

| Check | Result |
| --- | --- |
| Handoff `HANDOFF-SHA256SUMS.txt` (7 files) | PASS |
| Audit evidence ZIP vs declared hash/size | PASS — `f3b30628…`, 1,319,606 bytes |
| Evidence `MANIFEST.json` (103 members) | PASS — 103 verified, 0 mismatched, 0 missing |
| `tools/tests/test_repo_check.py` | PASS — 22 negative controls, 0 failed |
| `tools/repo-check.py` | PASS — 13 checks, 0 failed |

## What was repaired this session

| Defect | Repair |
| --- | --- |
| `yaml-parse` reported `SKIPPED` with PyYAML absent while the run stayed green | Required checks now **fail closed**. Absent PyYAML fails; dependencies are pinned with hashes in `tools/requirements.txt` and installed in CI. |
| JSONC comments were stripped with a regex that corrupts strings and URLs | Replaced with a string-aware scanner (`tools/solaris_checks/jsonc.py`), with unit controls for URLs, `/* */` inside strings and escaped quotes. |
| New source outside the old `R2/R3/R4` prefixes would get informational treatment | Every path now resolves through `provenance/SOURCE-CLASSIFICATION.json`; unclassified paths fail, and maintained-candidate source gets the strictest treatment. |
| Imported-byte immutability had no way to express an authorized change | Two separate models: frozen reference (never changes) and `provenance/CANDIDATE-CHANGES.json` (overrides with original + resulting hash, rationale, integration target). Unlisted drift, deletion and reclassification fail. |
| `AND-IMP-01` was a whole-scope informational downgrade | Registered by exact path **and** exact hash. A change to it, its disappearance, or any second broken evidence file now fails. |
| Actions were unpinned | All four actions pinned to full commit SHAs with their upstream release recorded. |
| The reference workflow was an always-failing placeholder | Removed. The gate is reported as BLOCKED by the checker instead of masquerading as a job. |
| `node --check` silently passes broken ESM `.js` (`AND-CI-01`, new) | Each file is parsed under an explicit `.cjs`/`.mjs` extension; failure requires both modes to fail. |

## Open findings

| ID | Finding | Disposition |
| --- | --- | --- |
| `AND-IMP-01` | `solaris-603-native-probe/recommended-request-builder.cjs` is truncated at line 10. Imported byte-for-byte; **not** repaired. | OPEN — registered by exact hash. Recover from the full reference or record permanently as a truncated fragment. |
| `AND-CI-01` | `node --check` returns success for broken `.js` containing ESM syntax. | FIXED in the checker; negative control added. |
| `F09` | Repository public while every governing document assumes private. | OPEN — blocked on the owner action above. See `provenance/PUBLIC-EXPOSURE-RECORD.md`. |

## Unresolved boundaries

- Native production readiness is **unproven**. All eight gates in
  `handoff/PRODUCTION-GATES.md` remain open.
- `F01` complete native source/build, `F02` production signing custody, `F03`
  answer-boundary, `F05` mixed clinical routing and `F06` native durability are
  all open. See `AUDIT-FINDINGS-MATRIX.md`.
- No security, dependency, CVE or license audit exists. No repository license is
  set. No artifact release exists.
- Remote CI has not run on any commit after `edd43bd`.
- Independent review of the current candidate has **not** been obtained. A review
  of `c57c0b2` does not cover `edd43bd` or later, and must not be reused. The
  review commissioned for `8db241b` terminated on a session rate limit.
- A self-review of `8db241b` found and fixed three risk-screen gaps where a
  clinical request fell through to open generation rather than the bounded
  out-of-scope reply (`M9`–`M13`). Self-review is recorded as such and does not
  close the independent-review gate.

## Next action

1. Independent review of the exact final full SHA and diff.
2. Resolve findings, rerun affected checks.
3. Push the task branch, update draft PR #1, then run real remote CI. Record the
   branch-head SHA separately from the synthetic merge SHA. **Do not merge.**
