# Status

**Updated:** 2026-09-18 · Session 2

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

## Repository metadata and README consolidation

| Item | State |
| --- | --- |
| `main` tree | Contains exactly one file: the extensionless `README` |
| That file's claim | *"Private development workspace"* — **inaccurate**; the repository is public |
| Consolidation | Prepared on this branch: `README` is deleted and replaced by `README.md`, first done in `c57c0b2` |
| Resolution | Lands when PR #1 merges. Merging is the owner's decision and is **not** authorized here. |

### Proposed About description — needs the owner to set it

No tool available in this session can change the repository description, topics
or homepage. The wording below is reviewed and ready to paste into
**Settings → General → Description**:

```text
Solaris Android / Pocket LUCA: recovered local health-vault prototype and source-reconstruction workspace. Native build restoration is in progress; consented P2P, economic-passport and GPS/RGB adapters are roadmap work.
```

It labels P2P, economic-passport and GPS/RGB explicitly as roadmap work, claims
no shipped capability, and does not describe the repository as private. This is a
convenience item, not a blocker.

## Current task

| Field | Value |
| --- | --- |
| Sprint | Sprint-01 after `5d48426` |
| Writer | Claude Code (integrator) |
| Base | `5d48426e49a0e6e2d1f4eb7b6cdfa62dbaa657d7` (published, CI green) |
| Lanes | S0 state · S1 CI coverage · S2 candidate · S3 audit · S4 host reproduction · S5 fit proof · S6 native · S7 delivery |
| State | S0–S2, S4–S6 complete; S3 in progress; S7 in progress |

## Checks actually run — Sprint-01

Local. Remote CI runs on the pushed head.

| Check | Result |
| --- | --- |
| Sprint kit `SHA256SUMS.txt` (70 files) | PASS — 0 failures |
| Host kit `SHA256SUMS.txt` (184 files) | PASS — 0 failures |
| N3 host bundle vs pin | PASS — `b8ac7d1b…`, 30,754,484 bytes |
| N4 `hermesc` vs pin | PASS — `b4c37f09…`, Hermes 0.12.0, executes |
| `tools/repo-check.py` | PASS — 14 checks |
| `tools/tests/test_repo_check.py` | PASS — 27 negative controls |
| `tools/tests/test_js_parse_modes.py` | PASS — 11 parse-mode controls |
| `tools/tests/test_result_aggregation.py` | PASS — 27 aggregation controls |
| `candidate/tests/run-all.mjs` | PASS — 484 assertions |
| **604 host bundle reproduction** | **PASS — byte-identical `30be9989…`** |
| Original 34 host cases on the reproduced bundle | **PASS — 34/34** |
| Original 10 lifecycle cases on the reproduced bundle | **PASS — 10/10** |
| A605 donor fit | **DOES NOT FIT — measured**, 26 functions against a 2-function contract |

Host and lifecycle suites ran in actual Hermes with synthetic native, storage and
model seams, in a **disposable copy**; the tracked tree was never modified.

## What this sprint did not establish

No Android execution, no device, no phone latency, no model-quality evidence, no
native source build, no APK. Desktop Hermes is not a phone. The historical 30–80
second waits are untouched.

## Independent review

Review of `1b33e60` returned **APPROVE WITH FINDINGS**, with four blocking items.
All four were reproduced independently before being fixed:

| ID | Finding | Resolution |
| --- | --- | --- |
| B1 | `frozen_external_records` could overwrite an import-manifest entry, blessing a modified imported file with no original hash, rationale or integration target | Such a record may now only cover a path the manifest does not pin; required fields are validated. Two negative controls added. |
| B2 | Reclassifying `candidate/` out of scope silenced its test gate, and `NOT_APPLICABLE` counted as success | Tracked `candidate/` files with no maintained-candidate classification now FAIL. Only `PASS` and a genuinely empty `NOT_APPLICABLE` count as success. Control added. |
| B3 | `PUBLIC-EXPOSURE-RECORD.md` still said publication was blocked | Reconciled to the authorized public direction. |
| B4 | `AUDIT-FINDINGS-MATRIX.md` F09 acceptance still required a private repository | Visibility component recorded as closed by instruction; foundation acceptance stays open on its own merits. |

Non-blocking findings fixed in the same pass: stale assertion counts, an untested
rating-shape guard, missing coverage/diagnostic controls, and a non-string input
path that threw instead of resolving.

Independent review is **AI review, not a GitHub approval** from a second eligible
account, and is not presented as one.

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
