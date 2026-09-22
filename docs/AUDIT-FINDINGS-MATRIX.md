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
| **F01** | Complete native application source and build graph are missing. The builder patches four Hermes functions and a fixed HTML slot with 1,936 bytes spare. | **BLOCKED** — inventory milestone 1 delivered | A604-02 | Milestone 1 (inventory, source classification, exact missing-artifact requests N1–N7) is done. Milestones 2–5 need the artifacts. | Artifacts N1–N4 in [`NATIVE-RECOVERY-INVENTORY.md`](NATIVE-RECOVERY-INVENTORY.md). **F01 now blocks F03/F04/F05 integration too.** |
| **F02** | Signing identity is a shared public development fixture (`CN=Android Debug`). | **OPEN** | REL-01 | A deliberate production signer with exclusive custody and a tested existing-user transition. | F01. Explicitly **not** in scope now; no silent key replacement. |
| **F03** | Generated-answer validation does not enforce truthful or safe output. The actual 604 parser accepted 5 of 7 injected strings. | **CONTAINED at source level — integration BLOCKED** | A605-02 | Done at source: personal facts render only from typed facts bound to source ID, revision, approved field and authority; the supported surface admits only deterministic renderings; validation precedes display, persistence, receipts and later model context. the answer-boundary suite, part of a 507-assertion candidate total, including all 7 original probe strings and a source-backed contradiction. **Still needed:** integration into a running candidate, and adversarial evaluation against a real model. | Executable integration — see F01. Module 958's parser is **not** repaired; this is containment, not semantic verification. |
| **F05** | A mixed urgent-symptom + "check-in" request is persisted as an ordinary wellness reply, with zero model calls. | **REPAIRED at source level — integration BLOCKED** | A605-01 | Done at source: a risk screen runs before every wellness shortcut; 8 mixed-intent rows measured EN/ES, baseline-failing and candidate-passing, with a no-false-positive control. **Still needed:** integration, service-level assertions against the actual DailyService, and **qualified clinical review of the EN/ES escalation copy — a patient-release gate that is not met.** | Executable integration (F01); clinician review. |
| **F06** | Native vault/recovery durability is unestablished; one unconfirmed stale-completion race hypothesis from decompiled code. | **BLOCKED** | A606-01 | Reproduce against actual DEX/native execution with synthetic data before treating the race as real; plus the wider upgrade/attachment/recovery matrix. | F01. Decompiler output is not conclusive source. |

## High-priority findings

| ID | Finding | Disposition | Owner | Acceptance condition | Next dependency |
| --- | --- | --- | --- | --- | --- |
| **F04** | Leading Spanish punctuation (`¡`, `¿`) defeats guided routing; `Can you explain my check-in?` also falls outside recognized prefixes. | **REPAIRED at source level — integration BLOCKED** | A605-01 | Done at source: documented normalization on a separate matching representation, original text preserved, 19 measured routing rows. **Still needed:** integration, and unloaded-model/coordinator spies before any claim about avoided model preparation. | Executable integration (F01). Lands **with** F05, never alone. |
| **F07** | Background interruption discards unfinished user work. | **OPEN** | A606-02 | Encrypted durable pending turns with explicit retry and fresh authority after unlock. No plaintext browser drafts, no silent replay. | Native persistence contract (F01/F06). |
| **F08** | Local AI performance and usefulness are unmeasured on 604 phones. Conversational memory is far narrower than the visible history. | **BLOCKED** | A606-03 | Named-device cold/warm first-feedback, first-token, completion, cancel latency, memory and thermal measurements. | A device and explicit authorization. The historical 49–93 s observations are **not** 604 measurements. |
| **F09** | Early archive-only bootstrap state, and a public/private mismatch against the setup documents. | Visibility component **CLOSED by owner instruction** (public development authorized, 18 Sep 2026); foundation acceptance **OPEN** on its own merits. | A604-01 | Foundation: reviewed push of the existing branch, draft PR #1 updated, real remote CI run, stale docs corrected once. Visibility is no longer an acceptance condition. | Independent review, then push and remote CI. |
| **F10** | Dependency, supply-chain and license coverage is incomplete. | **BLOCKED** | AND-01 / REL-01 | SBOM tied to the actual APK, license notices retained, CVE triage on reachable shipped dependencies. | F01 for the complete dependency graph. |

## Lower-priority and scope findings

| ID | Finding | Disposition | Owner | Acceptance condition | Next dependency |
| --- | --- | --- | --- | --- | --- |
| **F11** | Visual design is coherent; accessibility and consent clarity need work. Concrete issues: ineffective Home reduced-transparency override (~`sanctuary.html:710–713`), chat container without `role=log` (~line 1115). | **OPEN** | A606-03 | TalkBack, font-scaling, contrast and touch-target checks at 320/360/390 logical widths. | A device or a real rendering environment. The inspected image was an **archived 601 synthetic** screenshot, not a fresh 604 render. |
| **F12** | Production P2P practitioner sharing is not implemented or proven. | **OPEN — roadmap** | P2P-01 | A separately versioned sharing contract and synthetic two-device tests. | Stable vault/identity. Must stay described as roadmap. |

## Sprint-01 findings (18 September 2026)

Recorded without renumbering or closing F01–F12. F03 remains **containment**, not
a parser repair. F06 remains an **unreproduced** native race hypothesis.

| ID | Finding | Disposition | Evidence |
| --- | --- | --- | --- |
| **SP-CI-01** | Actions were pinned by SHA but runtimes were selectors, so the remote resolved Python 3.12.14 / Node 22.23.2 while a local run used 22.22.2. | **FIXED** | Runtimes pinned explicitly; the checker now records the versions that actually executed, because a selector is a request, not evidence. |
| **SP-CI-02** | Injected results showed `NOT_APPLICABLE` or `PASS` with scope 1 and nothing inspected yielding overall PASS. | **FIXED** | Reproduced exactly against current code first. Registration, status and coverage are now enforced centrally in `validate_results`. 33 controls, including legitimate empty-scope positives. The prior CI run did inspect files; this does not invalidate its results. |
| **SP-CHAT-01** | A stored `date: "2026-99-99"` rendered to the user as a check-in date; returned bindings omitted the date. | **FIXED** | Real calendar validation incl. leap years. The stored record is **not** corrected — an impossible value is a finding about that record. The date is now bound like any displayed claim (five bindings, not four). |
| **SP-CHAT-02** | `selection: [null]` threw a `TypeError` while reading `.id`. | **FIXED** | Entries validated and unusable ones dropped. Twelve malformed shapes yield the honest select reply with no throw and no diagnostic leakage; a usable record among malformed entries is still honoured. |
| **SP-CHAT-03** | Literal `Reflect` returned the limitation route. | **PREMISE DISPROVED, real defect found and FIXED** | Traced to the UI first: quick actions dispatch `send(a.slice(4))` on `ask:` payloads, and `Reflect` is **not** one. The three real payloads are `Explain my check-in`, `Help me choose a step today`, `Who is Pocket LUCA AI?` — and **two of the three fell to the limitation reply**, so the app answered its own buttons with "I cannot answer that". All three now route correctly, EN and ES. |
| **SP-DOC-01** | Operative docs mixed stale statements; the routing contract still showed candidate `null` outcomes. | **FIXED** | Matrix regenerated from measured behaviour across 37 rows; router header corrected. No candidate row is `null`. |
| **SP-INT-01** | Candidate modules were never bound to the actual host; a fixture could supply allowed renderings. | **MEASURED — does not fit** | The frozen donor asserts 2 functions with function 1 named `fastGuided`. The candidate compiles to **26**, function 1 being the bundle IIFE. Hermes 0.12.0 also rejects ES6 `class`. Nothing was weakened to force a fit. See [host reproduction evidence](HOST-REPRODUCTION-EVIDENCE.md). |

### Sprint-01 audit slice (AND-01) and the independent reviews

The audit slice raised nine findings against this repository's own candidate and
documentation. They are numbered AUD-01…AUD-05 and AUD-07…AUD-10: **there is no
AUD-06.** It was withdrawn during the slice and the numbering was not closed up,
so an earlier "AUD-01…AUD-10" implied a finding that does not exist (NBR-10).

The independent reviewer of commit `6126903` raised NB1…NB10 as non-blocking
hardening items on top of an APPROVE verdict, and the reviewer of `4f49ba8`
raised NBR-1…NBR-10 the same way. All three sets are recorded here rather than in
a side document.

| ID | Finding | Disposition | Evidence |
| --- | --- | --- | --- |
| **AUD-01** | `undefined !== undefined` is false, so a record and an authority that BOTH omitted the epoch and permission revision compared equal, and a claim rendered with no authority binding. | **FIXED** | Absence rejected before equality (`AUTHORITY_UNBOUND`). Independently re-raised by the reviewer as NB6, confirmed pre-existing at the published base `5d48426`, so not a regression. |
| **AUD-02** | The reply asserted "you recorded no aspect ratings" when the aspects existed but were unapproved or unbindable — an affirmative false statement about the user's own data. | **FIXED** | `renderCheckinAnswer` now distinguishes unanswered from unavailable; the step suffix names only aspects actually rendered. Independently re-raised as NB7. |
| **AUD-03** | The A/B donor recommendation was stated before the constraint set had been read in full. | **WITHDRAWN** | The full `hbc_inline.py` constraint table is now recorded. The recommendation is withheld pending a `normalize()` measurement. |
| **AUD-04** | Build 604's shipped `fast-guided.js` parses the prompt envelope with no guards, while its own harness asserts the structure before parsing — so the gap is invisible to the 34 passing host cases. | **FIXED at source — integration BLOCKED** | Measured across nine rows: seven leave the frozen helper by exception; the remaining malformed row is accepted only because an absent header made the unguarded slice coincide with the envelope. Guards moved to `candidate/a605/host-envelope.mjs`; the frozen helper is not edited. Contract §3.1. |
| **AUD-05** | `FEATURE-STATUS.md` lacked a header stating its evidence basis, and carried no Sprint-01 rows. | **FIXED** | Header plus per-claim Sprint-01 rows. |
| **AUD-07** | The disposable-copy requirement was practice, not a recorded reason. | **FIXED** | Recorded: `lifecycle/tests/run.py` writes evidence inside its own source tree, so running it against the tracked tree would damage the frozen reference. |
| **AUD-08** | Longest-prefix classification sent nested `evidence/` trees to authored-source treatment. | **FIXED** | Seven classification rules plus `check_evidence_not_authored`, which immediately caught a path the audit itself had missed. All 945 evidence paths now resolve to `retained-evidence`. |
| **AUD-09** | Assertion counts and the blocked-gate list were maintained by hand and had drifted. | **FIXED** | Counts reconciled; the blocked-gate table is generated from `BLOCKED_GATES`. |
| **AUD-10** | Escalation copy follows UI locale, not the language of the user's message, so `me duele el pecho` in an English-locale session receives English care instructions. | **RECORDED DECISION — inside the existing clinician gate** | Measured EN/ES both ways; the risk screen matches the Spanish markers correctly, only the reply language follows the interface. Build 604 does the same (`IMPLEMENTATION.md`: "English and Spanish **UI locale**"). No language-detection heuristic added — that is a clinical decision made by inference. Contract §4. |
| **NB1** | `validate_results` returned no violations for an empty registry, so a run that registered and inspected nothing aggregated to PASS. | **FIXED** | Not reachable from the shipped entrypoint, but fixed and controlled. Reverting the fix flips the control to PASS. |
| **NB2** | An unrecognised `CheckSpec.coverage` string degraded silently to `NONZERO`, turning a registry typo into quiet under-enforcement. | **FIXED** | Rejected against `VALID_COVERAGE`. Controlled. |
| **NB3** | `frozen-integrity`, `candidate-changes-valid` and `candidate-regression-tests` were declared `COVERAGE_NONZERO` but achieve full coverage. | **FIXED** | Promoted to `COVERAGE_FULL`, which is strictly stronger; positives confirm a legitimate complete run still passes. |
| **NB4** | A check returning `None` raised `AttributeError` out of `run_all` from *outside* the guarded path, so no report was produced at all. | **FIXED** | Non-`CheckResult` returns become a FAIL result. Reverting the fix reproduces the crash exactly. |
| **NB5** | `isinstance(True, int)` is true in Python, so booleans were accepted as file counts. | **FIXED** | Bools rejected explicitly. Reverting the fix yields overall PASS with zero violations. |
| **NB6 / NB7** | See AUD-01 and AUD-02. | **FIXED** | Raised independently by two reviews; both confirmed pre-existing at `5d48426`, neither a regression in the reviewed range. |
| **NB8** | `approvedFields.includes()` and `fields[...]` trusted caller-supplied object semantics: an overridden `includes()` bypassed the approval gate and a prototype-supplied value was rendered. | **FIXED** | Read structurally (`Array.isArray` + `some`, `hasOwnProperty`). Outside the realistic threat model — the boundary should not depend on that. |
| **NB9** | The host wrapper discarded `append_plans`' report, so its output omitted the frozen builder's own labels. | **FIXED** | No assertion was lost — they are report fields. The wrapper now carries them, and the run is byte-identical and differs from the historical release record in exactly one leaf field, `ui.path`. |
| **NB10** | `STATUS.md` was dated 2026-09-17 while carrying 18 September content. | **FIXED** | Date corrected. |

### Independent review of `4f49ba8` — NBR-1…NBR-10

**APPROVE WITH FINDINGS, zero blocking.** The reviewer reproduced the nine-row
frozen-helper table exactly, re-ran the host reproduction to the same
`30be9989…`, independently re-ran the 34 host cases against **their own**
reproduced bundle (34/34), confirmed the deep report diff is 48,719 leaves per
side with exactly one difference, and confirmed every NB1–NB5 reversion claim
including NB4's exact `AttributeError`. It verified the AUD-08 reclassification
is not laundering: all 21 moved files sit under literal `evidence/` directories,
all parse cleanly, none gained a defect registration, and zero files entered
`authored-source`.

Two findings refuted **published claims** and are the reason this commit was not
called reviewed until they were fixed.

| ID | Finding | Disposition |
| --- | --- | --- |
| **NBR-1** | `routeHostPrompt` was **not total**. `= {}` is a default parameter, firing only on `undefined`; destructuring `null` threw — and `null` is what a host bridge passes for an absent optional. The contract claimed totality. Every hostile case passed `undefined`, so the axis was untested. | **FIXED** — `?? {}`, plus 11 option shapes asserted. Reverting reproduces the throw. |
| **NBR-2** | The `BUILD-AND-TEST.md` result table was four rows stale and missing the `evidence-not-authored-source` row, while **this matrix listed AUD-09 as "counts reconciled"**. The table is the artifact AUD-09 is about. | **FIXED** — the table is now transcribed from a live run, and the drift is stated in place so the next hand edit is discouraged. |
| **NBR-3** | The prototype-`user` control **could not fail**. A `__proto__` key in JSON becomes an own property, so guarded and unguarded reads agree; the assertion passed for the wrong reason. | **FIXED** — the control now pollutes `Object.prototype` and restores it. Reverting the guard fails 2 assertions. |
| **NBR-4** | The §3.1 summary said one row "parses the wrong region", which no measured row does — the row that parses the wrong region throws and is already inside the seven. The prose contradicted its own table. | **FIXED** — corrected in the contract, this matrix and the record, with the error stated rather than quietly rewritten. |
| **NBR-5** | NB8 was **partially applied**. `selection.find()` still trusted caller semantics: a non-array with a forged `find()` admitted an arbitrary record, and `approvedFields`/`revision`/authority were prototype-traversing reads. The comment claiming "both are now read structurally" overstated completeness. | **FIXED** — array-checked identity scan, own-property gates on the lookup fields, own-property authority reads. A record that merely *omits* its authority still gets the precise `AUTHORITY_UNBOUND` rather than being collapsed into `UNKNOWN_SOURCE`. |
| **NBR-6** | NB1 closed the empty-**registry** hole; the empty-**scope** sibling stayed open. A full registry of `PASS 0/0` still aggregated to a green run that inspected nothing, and every check derives its scope from the classification file. | **FIXED** — `CheckSpec.min_scope`, declared on the twelve checks that must never be empty here. Reverting flips 3 controls to PASS. |
| **NBR-7** | The "manufactures no bindings" control **did not discriminate** — unbound facts are refused downstream, so it passed whether or not the adapter forwarded them. | **FIXED** — the control now puts *fully bound* records in the envelope, so only the adapter's refusal keeps them refused. Reverting fails 6 assertions. |
| **NBR-8** | NB3's promotion of `candidate-changes-valid` to `COVERAGE_FULL` is **inert**, not stronger: it sets `examined = expected` unconditionally. | **FIXED** — the rationale now says so instead of claiming an improvement it does not make. |
| **NBR-9** | The review record lived only in this matrix, while `docs/workflow/` — the ledger `CLAUDE.md` designates — still said no review had been obtained and showed `origin` at `edd43bd`. | **FIXED** — reviewed-SHA ledger added to `STATUS.md`; `HANDOFF.md` reconciled. |
| **NBR-10** | Three minor items: one guard replaces a 604 *success* rather than a failure and was presented as pure hardening; **`AUD-06` does not exist** though the numbering implied it; `WRAPPER-RESULT.json` was not ignored though it provably carries an absolute local path. | **FIXED** — divergence stated in §3.1, the numbering gap recorded above, the output files ignored. |

**On NBR-1 and NBR-5 specifically:** both are cases where the code was narrower
than the claim written about it. The defect was not only the missing guard but
the assertion of a property that had not been tested on the axis where it failed.

**The reviewer's process caveat is recorded and was correct.** Review began on a
clean tree at `6126903`; a writer then modified 12 files on the same paths during
the review, contrary to AGENTS.md's one-writer-per-path rule. That approval
therefore covers `6126903` and nothing else. The AUD and NB work above is
**outside** the reviewed commit and needs its own review before it is described
as reviewed.

### F01 and F06 status after this sprint

**F01 is partially advanced, not closed.** The 604 **host bundle** now reproduces
byte-identically (`30be9989…`) and its original 34 host and 10 lifecycle cases
pass. That is the host layer only. The authored native Gradle/Kotlin/NDK project
is still not recovered, and no supplied tool recovers it. A host-bundle
reproduction is **not** a native source build and **not** an APK.

**F06 is unchanged.** Nothing in this sprint executed native or DEX code, so the
stale-completion race remains an unreproduced hypothesis.

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
