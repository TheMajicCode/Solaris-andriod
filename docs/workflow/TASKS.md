# Tasks

One writer per path. A task is not complete until its checks, review and
remaining limits are recorded here.

Every task records: problem, writer, reviewer, base SHA, allowed paths,
acceptance evidence, output paths, status, next step.

## AND-00 — Verified repository bootstrap

| Field | Value |
| --- | --- |
| **Problem** | The recovered 604 source existed only as a private archive. It needed to become a reviewable repository with honest documentation, provenance and scoped checks. |
| **Writer** | Claude Code |
| **Reviewer** | Independent review agent, against the exact candidate tree |
| **Base SHA** | `bf1d4e9` |
| **Allowed paths** | Imported source roots (byte-preserving); new root docs, `docs/`, `tools/`, `contracts/`, `artifacts/`, `.github/`, `.devcontainer/`, `.gitignore` |
| **Acceptance evidence** | Verified checksum; safe extraction; `verify-import.py` PASS; all 1,879 files re-hashed at their tracked destinations; `tools/repo-check.py` PASS; documentation with working/planned distinctions intact; blocked checks named; independent review; unmerged PR |
| **Output paths** | `docs/provenance/REPO-IMPORT-MANIFEST.json`, `docs/`, `tools/repo-check.py`, `.github/workflows/source-checks.yml`, root `README.md`/`AGENTS.md`/`CLAUDE.md` |
| **Status** | Complete, pending owner review |
| **Next step** | Owner decision on the PR |

### Explicitly not done in AND-00

No APK built, signed or installed. No data reset. No key change. No payment. No
deployment. No visibility change. No collaborator invite. No web-repository
change. No merge. No history rewrite. No dependency upgrade. No bulk lint fix. No
invented native build scaffolding. No artifact release created.

## AND-00b — Curate private reference-input artifacts

| Field | Value |
| --- | --- |
| **Problem** | `artifacts/manifest.json` is empty. Reference inputs needed for reproduction have no recorded restore path. |
| **Status** | **Blocked** — needs the restored full reference and a licensing review |
| **Acceptance evidence** | Reviewed non-sensitive bundles with hashes, sizes, restore paths and license status; no raw full-handoff upload |

## AND-01 — Baseline quality and security audit

| Field | Value |
| --- | --- |
| **Problem** | No security, dependency or license audit exists. The imported tree mixes authored source, recovered evidence and third-party inputs, which need different treatment. |
| **Status** | Ready to start after AND-00 review |
| **First slice** | Classify and triage the tree by scope; produce a prioritized findings list tied to exact paths and hashes, starting from `AND-IMP-01`. Findings only, no code changes. |
| **Acceptance evidence** | Prioritized findings with paths and SHAs; scoped lint/dependency/license/secret reports; native source gaps named; smallest next repair proposed |

## SPRINT-02 — Recovery, audit closure and welcome/onboarding

| Field | Value |
| --- | --- |
| **Problem** | Several things were outstanding: a stale handoff premise; unverified audit dispositions; an external Expo audit with no source; the host fit decision; and a welcome/onboarding refresh required by contract. |
| **Writer** | Integrator (Claude Code) for `candidate/a605/`, `tools/`, `docs/`. One onboarding writer on disjoint paths `candidate/onboarding/` and `tools/onboarding/`, in its own worktree. |
| **Reviewer** | Independent review agent. It covered `4f49ba8..b2a6ba8`: `cdbf3a3` approved with findings; `b2a6ba8` REQUEST CHANGES, 3 blocking. |
| **Base SHA** | `cdbf3a3` |
| **Allowed paths** | Maintained paths only: `candidate/`, `tools/`, `docs/`, `.gitignore`, `.devcontainer/`. No frozen byte. |
| **Acceptance evidence** | Per-finding dispositions against the reviewers' own words; mutation-tested controls; bounded host donor proven on the actual host; external audit kept as EXT-01–30; onboarding preview with browser checks; independent re-review of the fixes; remote CI on the pushed head. |
| **Output paths** | `docs/reports/FINDINGS-DISPOSITION-SPRINT-02.md`, `docs/EXTERNAL-AUDIT-STATUS.md`, `docs/HOST-REPRODUCTION-EVIDENCE.md`, `candidate/a605/host-donor/`, `tools/host/`, `candidate/onboarding/`, `tools/onboarding/` |
| **Status** | Integrated locally. The review fixes (`76b24f6`) and the onboarding commits await re-review. Onboarding HBC integration is BLOCKED on size (U0-02). |
| **Next step** | Re-review; push; CI; owner decisions recorded in `STATUS.md` |

### Explicitly not done in SPRINT-02

No APK built, signed or installed. No merge, force push or history rewrite. No
key, signer, schema or data change. No escalation copy extended without
clinical review. No Expo scaffold imported. Nothing in the Solaris web
repository.

Later items are sequenced in the [Roadmap](../ROADMAP.md).
