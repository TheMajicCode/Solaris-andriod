# Handoff

## State at handoff

| Item | Value |
| --- | --- |
| Branch | `claude/solaris-android-import-iyla4d` |
| Local HEAD | `5a3d4ad` |
| `origin` HEAD | `edd43bd` — **5 commits behind local; nothing pushed** |
| Repository visibility | **PUBLIC** — blocks all publication |
| PR #1 | Open, draft, unmerged, still showing `edd43bd` |
| Remote CI on local work | **BLOCKED**, not passed |
| Independent review | **NOT obtained** — commissioned review failed on a rate limit |

## The one blocking owner action

> GitHub → `TheMajicCode/Solaris-andriod` → **Settings → General → Danger Zone →
> Change repository visibility → Make private**.

No tool in the working session can change visibility, and creating a replacement
repository is prohibited. Until this is done and re-verified, nothing may be
pushed.

## Unpushed commits

| SHA | What |
| --- | --- |
| `9dc5b23` | A604-01 foundation: fail-closed checks, candidate change tracking, exposure record |
| `8a00e4f` | A605 contract, implementation and regression suite |
| `8db241b` | Measured acceptance matrix; finding dispositions |
| `2853244` | Stop-hook publication conflict recorded as an unpushed checkpoint |
| `5a3d4ad` | Three risk-screen gaps closed after adversarial self-review |

## Read first

1. [`../../AGENTS.md`](../../AGENTS.md) — binding constraints, including the publication gate.
2. [`STATUS.md`](STATUS.md) — verified state, repairs, open findings.
3. [`SELF-REVIEW-8db241b.md`](SELF-REVIEW-8db241b.md) — what self-review covered and, more importantly, what it did not.
4. [`../AUDIT-FINDINGS-MATRIX.md`](../AUDIT-FINDINGS-MATRIX.md) — F01–F12 dispositions.
5. [`../ROUTING-AND-ANSWER-CONTRACT.md`](../ROUTING-AND-ANSWER-CONTRACT.md) — what A605 promises and what it explicitly does not.

## Establish your own baseline first

```sh
python3 -m pip install --require-hashes --no-deps -r tools/requirements.txt
python3 tools/tests/test_repo_check.py     # 22 negative controls
python3 tools/repo-check.py                # 13 checks
node candidate/tests/run-all.mjs           # 224 assertions
```

If `frozen-integrity` fails, **stop** — imported bytes have drifted, which is a
provenance incident, not something to fix by regenerating a manifest.

## Next actions in order

1. **Owner:** make the repository private.
2. Re-verify visibility, then obtain **independent** review of the then-current
   full SHA. A review of an older SHA must not be reused.
3. Resolve material findings, rerun affected tests, re-review changed areas.
4. Push, and update PR #1 with the real evidence, blocked gates and both
   branch-head and merge-commit CI coverage. Do **not** merge.
5. Then `AND-01` audit slice, and native recovery milestone 2 once artifacts
   N1–N4 arrive.

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
