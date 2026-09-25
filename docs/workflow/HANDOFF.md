# Handoff

## State at handoff

| Item | Value |
| --- | --- |
| Branch | `claude/solaris-android-import-iyla4d` |
| `origin` HEAD | See [`STATUS.md`](STATUS.md). At the last update it was `e0efa1d` (Sprint-02, unreviewed); check `git log origin/<branch>` before writing. |
| Repository visibility | **Public** — public continuation authorized 18 Sep 2026 |
| PR #1 | Open, draft, **unmerged** |
| Remote CI | **PASS** on `6126903`, `4f49ba8`, `cdbf3a3` and `e0efa1d`, push and pull_request runs both |
| Independent review | APPROVE WITH FINDINGS on `6126903`, `4f49ba8` and `cdbf3a3`. **REQUEST CHANGES** on `b2a6ba8` (S2R-1…S2R-15). |
| Sprint-02 state | The S2R fixes were re-reviewed (S2R2-1 blocking, fixed in `9a3bf89`). `9a3bf89` was approved with findings; S2R3-1/2 are fixed in the next commit, which touches only the host guard, one checker control and the records. The onboarding commits and `e0efa1d` were approved, with findings. |

## No owner action is blocking

The earlier private-visibility request is **withdrawn and closed**. Public
continuation is authorized. Do not reopen it.

## Unpushed commits

```sh
git log --oneline origin/claude/solaris-android-import-iyla4d..HEAD
```

Push is authorized once independent review of the exact final commit passes and
the outgoing range is inspected.

## Read first

1. [`../../AGENTS.md`](../../AGENTS.md) — binding constraints, including the publication gate.
2. [`STATUS.md`](STATUS.md) — verified state, repairs, open findings.
3. [`SELF-REVIEW-8db241b.md`](SELF-REVIEW-8db241b.md) — what self-review covered and, more importantly, what it did not.
4. [`../AUDIT-FINDINGS-MATRIX.md`](../AUDIT-FINDINGS-MATRIX.md) — F01–F12 dispositions.
5. [`../ROUTING-AND-ANSWER-CONTRACT.md`](../ROUTING-AND-ANSWER-CONTRACT.md) — what A605 promises and what it explicitly does not.

## Establish your own baseline first

```sh
python3 -m pip install --require-hashes --no-deps -r tools/requirements.txt
python3 tools/tests/test_repo_check.py     # negative and doc-drift controls
python3 tools/tests/test_js_parse_modes.py # parse-mode controls
python3 tools/tests/test_result_aggregation.py # aggregation controls
python3 tools/repo-check.py                # registered checks
node candidate/tests/run-all.mjs           # candidate assertions
```

The current counts are in [`BUILD-AND-TEST.md`](../BUILD-AND-TEST.md), whose
check tables CI ties to the registry. They are deliberately not repeated here,
because repeated counts are what drifted three times (AUD-09, NBR-2, S2R-3).

Host tools under `tools/host/` need the private inputs and a disposable copy
outside any git work tree; see [host evidence](../HOST-REPRODUCTION-EVIDENCE.md),
section "Reproducing".

If `frozen-integrity` fails, **stop** — imported bytes have drifted, which is a
provenance incident, not something to fix by regenerating a manifest.

## Next actions in order

1. Independent review of the exact final full SHA and diff. A prior self-review
   and a timed-out reviewer are **not** approval.
2. Resolve material findings; rerun affected checks.
3. Push the existing task branch and update draft PR #1, then run **real remote
   CI**. Record the branch-head SHA separately from the synthetic merge SHA.
   Remote CI on an unpublished commit cannot be a prerequisite to pushing it.
4. Review material follow-ups. **Do not merge.**
5. Dependent chat/native branches may build on the exact reviewed foundation
   checkpoint; record base dependencies and revalidate when the base moves.

## Traps specific to this repository

- `docs/provenance/import-pack/verify-import.py` **cannot** run here. That is
  correct. Do not repair it or relocate files to satisfy it.
- A parse failure in retained evidence is a finding, not a file to edit.
  `AND-IMP-01` is registered by exact path and hash.
- `node --check foo.js` passes broken ESM `.js` (`AND-CI-01`). The checker works
  around it; do not "simplify" that back.
- There is no `gradlew` and no native build. Do not create scaffolding.
- Do not upgrade the 604 QVAC/Bare runtime, whatever a dependency quickstart says.
- The full A605 router is **source and tests only**; it does not fit the frozen
  donor contract. Only the bounded host donor is proven on the actual host, in
  desktop Hermes. No new A605 APK has been built.
- Never normalize before shipped 604's substring branches in the donor. That
  widened canned replies to clinical messages (S2R-1).
- Host tools refuse any directory inside a git work tree, including
  `.claude/worktrees/`. Build disposable copies elsewhere.
- The EN/ES escalation copy is an engineering placeholder and a patient-release
  gate until a qualified clinician reviews it.
