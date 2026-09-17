# Audit findings matrix

Every finding from `Solaris-604-Production-Readiness-Audit-2026-09-17.md`, plus
the findings this repository raised, mapped to evidence, disposition, owner,
acceptance condition and next dependency.

The original audit and proposal are **unchanged**. Corrections, newer
observations and implementation decisions live in
[`ADDENDUM-2026-09-17.md`](ADDENDUM-2026-09-17.md), not by editing the originals.

## Disposition vocabulary

| Term | Meaning |
| --- | --- |
| **FIXED** | Changed, and verified by a check that fails if the fix regresses. |
| **CONTAINED** | Not repaired at its root; an enforced outer boundary prevents the harmful outcome. Containment is not universal semantic verification. |
| **OPEN** | Accepted as real; no fix or containment is in place yet. |
| **BLOCKED** | Cannot progress until a named missing input or decision arrives. |

A stronger regex is **not** F03 resolved. F04 routing is **not** F05 clinical
handling resolved. Do not merge them.

## Release-blocking findings

| ID | Finding | Disposition | Owner | Acceptance condition | Next dependency |
| --- | --- | --- | --- | --- | --- |
| **F01** | Complete native application source and build graph are missing. The builder patches four Hermes functions and a fixed HTML slot with 1,936 bytes spare. | **BLOCKED** | A604-02 | A traceable source-to-artifact map and a reproducible unsigned native build from a clean, pinned environment. | Missing inputs listed in [`NATIVE-RECOVERY-INVENTORY.md`](NATIVE-RECOVERY-INVENTORY.md). |
| **F02** | Signing identity is a shared public development fixture (`CN=Android Debug`). | **OPEN** | REL-01 | A deliberate production signer with exclusive custody and a tested existing-user transition. | F01. Explicitly **not** in scope now; no silent key replacement. |
| **F03** | Generated-answer validation does not enforce truthful or safe output. The actual 604 parser accepted 5 of 7 injected strings. | **OPEN** | A605-02 | Personal factual claims rendered only from validated typed facts bound to selected source ID, revision, field and authority; unsupported generation contained before display, persistence and later model context. | Routing/answer contract; see [`ROUTING-AND-ANSWER-CONTRACT.md`](ROUTING-AND-ANSWER-CONTRACT.md). |
| **F05** | A mixed urgent-symptom + "check-in" request is persisted as an ordinary wellness reply, with zero model calls. | **OPEN** | A605-01 | Risk/out-of-scope handling precedes ordinary wellness shortcuts; mixed clinical requests never reach an ordinary check-in answer; EN/ES service-level assertions. | Qualified review of bilingual escalation copy is a **patient-release gate**. |
| **F06** | Native vault/recovery durability is unestablished; one unconfirmed stale-completion race hypothesis from decompiled code. | **BLOCKED** | A606-01 | Reproduce against actual DEX/native execution with synthetic data before treating the race as real; plus the wider upgrade/attachment/recovery matrix. | F01. Decompiler output is not conclusive source. |

## High-priority findings

| ID | Finding | Disposition | Owner | Acceptance condition | Next dependency |
| --- | --- | --- | --- | --- | --- |
| **F04** | Leading Spanish punctuation (`¡`, `¿`) defeats guided routing; `Can you explain my check-in?` also falls outside recognized prefixes. | **OPEN** | A605-01 | Documented normalization policy applied to a separate matching representation; original text preserved; EN/ES variants route identically with zero model preparations. | Must land **with** F05 handling, never alone. |
| **F07** | Background interruption discards unfinished user work. | **OPEN** | A606-02 | Encrypted durable pending turns with explicit retry and fresh authority after unlock. No plaintext browser drafts, no silent replay. | Native persistence contract (F01/F06). |
| **F08** | Local AI performance and usefulness are unmeasured on 604 phones. Conversational memory is far narrower than the visible history. | **BLOCKED** | A606-03 | Named-device cold/warm first-feedback, first-token, completion, cancel latency, memory and thermal measurements. | A device and explicit authorization. The historical 49–93 s observations are **not** 604 measurements. |
| **F09** | Repository visibility does not match the intended private workflow. | **OPEN** | Owner | Repository is private and visibility is re-verified before publication. | **Owner action** — see [`workflow/STATUS.md`](workflow/STATUS.md). |
| **F10** | Dependency, supply-chain and license coverage is incomplete. | **BLOCKED** | AND-01 / REL-01 | SBOM tied to the actual APK, license notices retained, CVE triage on reachable shipped dependencies. | F01 for the complete dependency graph. |

## Lower-priority and scope findings

| ID | Finding | Disposition | Owner | Acceptance condition | Next dependency |
| --- | --- | --- | --- | --- | --- |
| **F11** | Visual design is coherent; accessibility and consent clarity need work. Concrete issues: ineffective Home reduced-transparency override (~`sanctuary.html:710–713`), chat container without `role=log` (~line 1115). | **OPEN** | A606-03 | TalkBack, font-scaling, contrast and touch-target checks at 320/360/390 logical widths. | A device or a real rendering environment. The inspected image was an **archived 601 synthetic** screenshot, not a fresh 604 render. |
| **F12** | Production P2P practitioner sharing is not implemented or proven. | **OPEN — roadmap** | P2P-01 | A separately versioned sharing contract and synthetic two-device tests. | Stable vault/identity. Must stay described as roadmap. |

## Findings raised by this repository

| ID | Finding | Disposition | Owner | Acceptance condition |
| --- | --- | --- | --- | --- |
| **AND-IMP-01** | `solaris-603-native-probe/recommended-request-builder.cjs` is truncated at line 10. Imported byte-for-byte; hash matches the frozen manifest, so the truncation predates this repository. | **OPEN** | AND-01 | Recover the complete original from the restored full reference and register it as an override, **or** record it permanently as a truncated evidence fragment. Do not guess the missing tail. |
| **AND-CI-01** | `node --check file.js` returns success for a `.js` file containing ESM syntax even when it has a real syntax error. The first checker inherited this blind spot. | **FIXED** | A604-01 | Each file is parsed under an explicit `.cjs`/`.mjs` extension; failure requires both modes to fail. Covered by a negative control. |
| **AND-CI-02** | A required check could report `SKIPPED` (PyYAML absent) while the overall run stayed green. | **FIXED** | A604-01 | Required checks fail closed; dependencies pinned with hashes and installed in CI. Covered by a negative control that simulates the missing import. |
| **AND-CI-03** | JSONC comments were stripped with a regex that corrupts strings and URLs. | **FIXED** | A604-01 | String-aware scanner with unit controls for URLs, `/* */` inside strings and escaped quotes. |

## What this matrix is not

It is not a completion percentage. The audit's 45/100 is a weighted planning
judgment, not a measured fraction of finished code, and dividing fixed findings
by total findings would be just as misleading. Hard blockers override any score:
**the release decision remains NO-GO.**
