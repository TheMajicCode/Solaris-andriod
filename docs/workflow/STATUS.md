# Status

**Updated:** 2026-09-25 · Sprint-02

## Publication — authorized, conflict resolved

| Item | Verified value |
| --- | --- |
| Repository | `TheMajicCode/Solaris-andriod` — **public** |
| Visibility decision | Owner authorized public continuation, 18 September 2026 |
| Default branch | `main` at `5cc354c852565479020d4a6c99109fff992c6de4` |
| Input branch | `import/604-source` at `bf1d4e90ea173f088ca3fa9a6c806876aba51adc` |
| Task branch | `claude/solaris-android-import-iyla4d` |
| PR #1 | Open, draft, unmerged. Head at the last push: `e0efa1d` (Sprint-02, unreviewed) |

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
| Sprint | Sprint-02: recovery, audit closure, welcome/onboarding |
| Integrator | Claude Code (this session) |
| Writers | Integrator for `candidate/a605/`, `tools/`, `docs/`. One onboarding writer in its own worktree, on disjoint paths `candidate/onboarding/` and `tools/onboarding/`. |
| Reviewer | Independent review agent. It reviewed `4f49ba8..b2a6ba8` and changed no code. |
| Base | `cdbf3a3ab3785f9e3eaca5c09c2594de3833470a` (remote at sprint start, tree clean) |
| Checkpoints | Verified bundles of `cdbf3a3` and of `cdbf3a3..b2a6ba8`, held outside Git |
| State | Findings and EXT dispositions done. Bounded host donor revised after review. Onboarding candidate integrated as source and preview; HBC integration blocked on size. The review fixes and the onboarding work await re-review. |

Detail: [finding dispositions](../reports/FINDINGS-DISPOSITION-SPRINT-02.md) ·
[host evidence](../HOST-REPRODUCTION-EVIDENCE.md) ·
[external audit status](../EXTERNAL-AUDIT-STATUS.md).

## Checks actually run — Sprint-02

Local, on the staged integration tree, 2026-09-25. Remote CI results are in the
review ledger below. File and assertion counts are those of
[`BUILD-AND-TEST.md`](../BUILD-AND-TEST.md), which is transcribed from the same run.

| Check | Result |
| --- | --- |
| `tools/repo-check.py` | PASS — 15 checks (file counts in `BUILD-AND-TEST.md`) |
| `tools/tests/test_repo_check.py` | PASS — 46 negative and documentation-drift controls |
| `tools/tests/test_js_parse_modes.py` | PASS — 11 |
| `tools/tests/test_result_aggregation.py` | PASS — 33 |
| `candidate/tests/run-all.mjs` | PASS — 5,099 assertions, of which 4,220 are onboarding |
| Onboarding mutation check (`tools/onboarding/mutation-check.mjs`) | 34/34 mutations caught (re-run by the integrator) |
| Onboarding size (`tools/onboarding/measure-size.mjs`) | 35,687 characters minified vs a 968-character slot: 36.9× over (re-run by the integrator) |
| Real UI slot check via the wrapper | 968 characters appended: builds, 0 spare. 969: refused. Onboarding: refused (`UI slot overflow`). |
| Onboarding browser QA (`tools/onboarding/visual-qa.mjs`) | 680 runs, 0 failures: 0 overflow, targets at least 48 px, reduced motion off. **Run by the writer, not re-run by the integrator.** Headless Chromium only. |
| Host kit | 179 manifest entries, 184 checksummed files, 185 ZIP members — all match. Four executables lack their exec bit; the bytes match. |
| 604 host bundle via the refactored wrapper | PASS — byte-identical `30be9989…` |
| Bounded donor fit | Fits — 88 registers; the frozen inliner accepts it |
| Candidate bundle `105ade31…` | Host 34/34, lifecycle 10/10, input probes 8/8, donor proof 74/74 fields (29 cases) |
| Shipped 604 on the same proof | 69/69 fields; F05 reproduced |
| Full candidate router fit | Does not fit: 80 functions, 18 `Catch`, 27 closures |
| Guard attacks (tampered frozen tool, git-tree root, forged bundle) | All refused |

Every new control was mutation-tested: each fix reverted individually in a scratch
copy, with its control confirmed to fail.

## Checks actually run — Sprint-01 (history)

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
| `tools/tests/test_result_aggregation.py` | PASS — 33 aggregation controls |
| `candidate/tests/run-all.mjs` | PASS — 507 assertions |
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

**Reviewed SHAs and scope — this is the ledger `CLAUDE.md` points to.** NBR-9
found the review record lived only in `AUDIT-FINDINGS-MATRIX.md` while this file
still said no review existed. Recorded here now.

| Reviewed SHA | Scope | Verdict | Findings |
| --- | --- | --- | --- |
| `1b33e60` | full candidate tree | APPROVE WITH FINDINGS | 4 blocking (B1–B4), all reproduced then fixed |
| `6126903` | full tree at that commit | APPROVE WITH FINDINGS | 0 blocking, 10 non-blocking (NB1–NB10) |
| `4f49ba8` | delta `6126903..4f49ba8` | APPROVE WITH FINDINGS | 0 blocking, 10 non-blocking (NBR-1…NBR-10) |
| `cdbf3a3` | delta `4f49ba8..cdbf3a3` (the NBR fixes) | APPROVE WITH FINDINGS | Covered by the Sprint-02 review below |
| `b2a6ba8` | delta `cdbf3a3..b2a6ba8` | **REQUEST CHANGES** | 3 blocking (S2R-1 donor widened shipped shortcuts; S2R-2 donor dropped 604 grounded answers; S2R-3 ledgers stale), 12 non-blocking. All fixed; **the fixes await re-review.** |

`e0efa1d` (documentation only) was pushed during that review and was not reviewed.

Remote CI, branch head (`push`) and synthetic merge (`pull_request`) recorded
separately:

| Head | `push` run | `pull_request` run |
| --- | --- | --- |
| `cdbf3a3` | 35678409412 — success | 35678413073 — success |
| `e0efa1d` | 36078420652 — success | 36078425072 — success |

The `6126903` reviewer also raised a **process** finding: a writer modified files
on the reviewed paths during the review, contrary to this repository's
one-writer-per-path rule. Correct, and recorded. The `4f49ba8` review confirmed a
clean tree at both start and end.

Independent AI review is real evidence. It is **not** an enforced GitHub approval
from a second eligible account and is never presented as one.


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
| `F09` | Visibility component | CLOSED by owner instruction (public continuation authorized, 18 Sep 2026). Foundation acceptance stays open on its own merits. |
| `SP2-HOST-01` | A lone UTF-16 surrogate makes the host throw `URIError` before any model call or write. | OPEN — host budget code, not editable here (F01). |
| `1b33e60/N2` | 17 clinical phrasings reach the generic limitation, not a referral. | OPEN — clinician gate. Containment is pinned. |
| `S2R-2` residual | A check-in question outside the accepted forms takes the model path on the donor. | Deliberate cost of the F05 fix. Needs owner and clinician acceptance. |
| `U0-01` | Long Spanish words break mid-word at 320 px and 200% text in the preview; headless Chromium did not hyphenate. | OPEN — needs a WebView or device check with `hyphens`. |
| `U0-02` | The onboarding does not fit the host UI slot (36.9×). | BLOCKED — native UI source (F01). |
| `U0-03` | Two finish-button labels ("Finish and check in", "Finish and open my records") are the writer's wording, not the contract's. | Needs qualified EN/ES copy review. |

## Unresolved boundaries

- Native production readiness is **unproven**. All eight gates in
  `handoff/PRODUCTION-GATES.md` remain open.
- `F01` complete native source/build, `F02` production signing custody, `F03`
  answer-boundary, `F05` mixed clinical routing and `F06` native durability are
  all open. See `AUDIT-FINDINGS-MATRIX.md`.
- No security, dependency, CVE or license audit exists. No repository license is
  set. No artifact release exists.
- Remote CI has passed on `6126903`, `4f49ba8`, `cdbf3a3` and `e0efa1d`, on
  both the `push` (branch head) and `pull_request` (synthetic merge) events. The
  branch head and the synthetic merge commit are different objects and are
  recorded separately. **A green run is not a review.**
- Independent review covers up to `cdbf3a3` (approved with findings) and
  `b2a6ba8` (changes requested). The Sprint-02 fixes and the onboarding work are
  integrator changes after that review, and are unreviewed until the re-review is
  recorded here. A review of an earlier SHA never covers later work.
- A self-review of `8db241b` found and fixed three risk-screen gaps where a
  clinical request fell through to open generation rather than the bounded
  out-of-scope reply (`M9`–`M13`). Self-review is recorded as such and does not
  close the independent-review gate.

## Next action

1. Re-review the S2R fixes and the onboarding commit, which are integrator
   changes after the last review.
2. Resolve any findings, rerun the affected checks, and push. Update draft PR #1,
   run remote CI, and record the branch-head SHA separately from the synthetic
   merge SHA. **Do not merge.**
3. Owner decisions: the S2R-2 trade-off, the clinician gate (escalation copy,
   under-referred phrasings, crisis phrasings), and the packaging inputs for any
   A605 APK rehearsal.
