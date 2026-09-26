# Handoff

## State at handoff

| Item | Value |
| --- | --- |
| Branch | `claude/solaris-android-import-iyla4d` |
| `origin` HEAD | `192d7ab4a739076decdf2fb487d4c3ffb686761c` — **independently reviewed, 0 findings.** Re-check `git log origin/<branch>` before writing in case it has moved since this line was last touched. |
| Repository visibility | **Public** — public continuation authorized 18 Sep 2026 |
| PR #1 | Open, draft, **unmerged** |
| Remote CI | **PASS** on every pushed Sprint-02 head, push and pull_request runs both: `e0efa1d`, `9198227`, `9a3bf89`, `e377669`, `bfaf23b`, `192d7ab`. See the run table in `STATUS.md`. |
| Independent review | APPROVE WITH FINDINGS on `6126903`, `4f49ba8` and `cdbf3a3`. `b2a6ba8` initially got **REQUEST CHANGES** (S2R-1…S2R-15); every finding across the seven follow-up rounds was fixed, and the final round approved `192d7ab` with **0 findings**. |
| Sprint-02 state | **Closed at `192d7ab`.** Seven review rounds on the host-tool hardening (S2R-1…S2R5-2); the final round approved `192d7ab` with **0 findings**. The onboarding commits and `e0efa1d` were approved, with findings, each recorded and resolved or accepted. See the full ledger in `STATUS.md`. |

## No owner action is blocking

The earlier private-visibility request is **withdrawn and closed**. Public
continuation is authorized. Do not reopen it.

## Current head — reviewed, pushed, CI green

`192d7ab` is fully pushed with nothing outstanding
(`git log --oneline origin/claude/solaris-android-import-iyla4d..HEAD` is empty
as of this writing). The engineering foundation on this head has cleared
independent review and required CI. **Merging this reviewed branch into `main`
is authorized** — see the dated, narrowly scoped authorization in
[`../../AGENTS.md`](../../AGENTS.md) ("Merge and evaluation-release
authorization, 26 September 2026"). Verify the branch has not moved before
merging, since a changed head needs its own review and CI pass.

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

1. If the branch head has moved since `192d7ab`, review and CI the new head
   before treating it as merge-ready — a review of an earlier SHA never covers
   later work.
2. Merge PR #1 into `main` with a normal merge commit (no squash, no
   force-push), checking the expected head SHA immediately before merging.
   Verify `main` afterward and check its post-merge CI.
3. Native source recovery (F01), the qualified-clinician escalation-copy
   review, the F05 model-path trade-off acceptance, and onboarding UI-slot
   integration remain open product gates and are **not** merge blockers — see
   `STATUS.md` for the full list.
4. The historical 604 APK evaluation-prerelease authorization is separate from
   the source merge; see [`../ARTIFACTS.md`](../ARTIFACTS.md). It is blocked in
   this workspace because the actual binary was not supplied here.
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
