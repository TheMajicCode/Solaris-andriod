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

## APK-EVAL — Historical 604 evaluation APK verification

| Field | Value |
| --- | --- |
| **Problem** | PR #1 (the reviewed source foundation) merged into `main` at `25c9e93`. The narrow, separately authorized evaluation-prerelease of the historical 604 APK (see `docs/ARTIFACTS.md`, "Evaluation-release authorization") remained blocked because the binary itself had not been supplied to any session. It was then supplied as a three-part transport archive. |
| **Writer** | Claude Code (this session), isolated branch `claude/solaris-604-apk-eval` |
| **Reviewer** | Independent review agent. It independently reassembled the archive, re-derived every hash, wrote its own from-scratch APK Signing Block v2 parser/verifier (catching and fixing a real bug in its own first draft, then cross-validating against a second independent tool, `apksigtool`), and independently re-ran the secrets/content scan. **APPROVE WITH FINDINGS** on `2b0931b`: one non-blocking finding, `S2R7-1` (this ledger entry was missing — now added). |
| **Base SHA** | `25c9e93` (`main`, post-merge) |
| **Allowed paths** | `docs/ARTIFACTS.md`, `docs/THIRD-PARTY-NOTICES.md` only. No source, no binary committed to Git. |
| **Acceptance evidence** | Reassembly matched all pinned hashes; APK SHA-256 `0e9a66da00cbe128851d981a9f9a3d9a1dbfe653f7a4ced93d638bc4d7d31827` (242,638,023 bytes) independently recomputed twice; package/version/version-code parsed from the binary manifest and matched; v2 APK Signing Block signature cryptographically verified against the certificate's public key, with the content digest recomputed over the full file and matched against the embedded digest; certificate SHA-256 `fac61745dc0903786fb9ede62a962b399f7348f0bb6f899b8332667591033b9c` matched, confirmed as the existing self-signed Android Debug certificate; `classes.dex`, the JS bundle and `assets/app.config` scanned for secrets/PII with none found; license evidence gathered for bundled third-party components (Apache-2.0/MIT only, no copyleft identified) — recorded in `docs/THIRD-PARTY-NOTICES.md` as evidence for this one binary, explicitly not as `AND-01` closure. `tools/repo-check.py` PASS at this head (15/15 applicable checks). |
| **Output paths** | `docs/ARTIFACTS.md`, `docs/THIRD-PARTY-NOTICES.md` |
| **Status** | Verification complete and independently reviewed. **Publication itself is BLOCKED**: this session's GitHub tooling exposes no release-creation or asset-upload capability (only reading existing releases), and this repository's operating instructions restrict GitHub actions to that sanctioned tooling. No release, tag, README download link, or badge was created. The unchanged APK, a `SHA256SUMS.txt`, and drafted evaluation notes are prepared and held outside Git, ready to attach. |
| **Next step** | A session or maintainer with GitHub release-asset-upload capability creates the "Solaris Android 604 — Historical evaluation preview" prerelease using the verified hash above, attaches the APK and `SHA256SUMS.txt`, and only then is the README updated with the real release/download URLs in a further small reviewed change. |

### Explicitly not done in APK-EVAL

No APK signed, repackaged or installed. No release, tag or download link
created. No merge to `main`. `AND-01` (the full dependency/license inventory)
was not closed — only per-component evidence for this one binary was
gathered. The F05 trade-off, clinical escalation-copy review and native
source recovery were not touched.

Later items are sequenced in the [Roadmap](../ROADMAP.md).
