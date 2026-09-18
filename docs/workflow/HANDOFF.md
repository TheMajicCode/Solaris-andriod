# Handoff

## State at handoff

| Item | Value |
| --- | --- |
| Branch | `claude/solaris-android-import-iyla4d` |
| Local HEAD | `5a3d4ad` |
| `origin` HEAD | `edd43bd` — behind local; push authorized once review passes |
| Repository visibility | **Public** — public continuation authorized 18 Sep 2026 |
| PR #1 | Open, draft, unmerged, still showing `edd43bd` |
| Remote CI on local work | **BLOCKED**, not passed |
| Independent review | **NOT obtained** — commissioned review failed on a rate limit |

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
python3 tools/tests/test_repo_check.py     # 27 negative controls
python3 tools/tests/test_js_parse_modes.py # 11 parse-mode controls
python3 tools/repo-check.py                # 13 checks
node candidate/tests/run-all.mjs           # 278 assertions
```

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
- A605 is **source and tests only**. Integration is BLOCKED on artifacts N3/N4.
  An unused helper is not a delivered fix.
- The EN/ES escalation copy is an engineering placeholder and a patient-release
  gate until a qualified clinician reviews it.
