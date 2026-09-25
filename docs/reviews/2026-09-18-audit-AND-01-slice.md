<!-- Recovered verbatim from the session transcript of subagent `ae06e827aa60b15e3`; the report was delivered through its hand-back call. -->

> **Recovered reviewer record — AND-01 read-only audit slice (AUD-01–AUD-10).** Reviewed SHA `6126903`. This is the reviewer's own text, not a summary. Original payload SHA-256 `f356b7d908f6f4040ee8526ffdf91a4e35adad679a0e36ba79070ea22642687f`. Sanitized for publication only: 1× local repository path → `<repo>`; 1× relative link re-based from `docs/` to `docs/reviews/` so it still resolves. No finding text was altered. Independent AI review, not a GitHub approval.

---

# AND-01 audit slice — prioritized findings (READ-ONLY)

Branch `claude/solaris-android-import-iyla4d`. Note: HEAD moved during the audit (41cc19f → **6126903** "S7: update maintained documentation from measured Sprint-01 results"); `docs/workflow/STATUS.md` and `docs/BUILD-AND-TEST.md` were rewritten under me by the parent session. All hashes below were taken at 6126903 with a clean tree. **I modified nothing**; scratch probes live in the session scratchpad only.

Checks I executed: `tools/repo-check.py` (PASS, 13 checks, 1,952 files), `test_repo_check.py` (27), `test_js_parse_modes.py` (11), `test_result_aggregation.py` (17), `candidate/tests/run-all.mjs` (385). All pass. The tree is in good shape — the findings below are mostly *latent* defects in source that is not yet reachable, plus one reachable shipped-code gap and documentation drift.

## Findings table (highest first)

| ID | Path | Classification / scope | Reachable? | Impact | Severity |
|---|---|---|---|---|---|
| AUD-01 | `candidate/a605/answer-boundary.mjs` | maintained / maintained-candidate | Candidate router only (integration blocked) | Personal claim renders with a **vacuous authority binding** — contract §5.2 violated | High (for candidate) |
| AUD-02 | `candidate/a605/guided-router.mjs` + `answer-boundary.mjs` | maintained / maintained-candidate | Candidate router only | **False personal claim** "you recorded no aspect ratings" + dangling "choose one of those aspects"; regresses shipped 604's `checkin-empty` branch | High (for candidate) |
| AUD-03 | `candidate/a605/*.mjs` vs `Solaris-Android-R4/tools/hbc_inline.py` | maintained-candidate vs frozen/authored-source | Blocks all candidate reachability | At least **five more donor-contract blockers** beyond the two measured; changes the cost of "Path A" | High (planning) |
| AUD-04 | `Solaris-Android-R4/grounding/fast-guided.js` | frozen / authored-source | **YES — in the shipped 604 host bundle** (F14890/F14894) | Unguarded envelope parse in a preflight whose host function has no exception handler; two sibling consumers guard it | Medium |
| AUD-05 | `docs/FEATURE-STATUS.md` | maintained / documentation | Reader-facing; CLAUDE.md points here for evidence | Says "**This repository did not rerun them**" — contradicted by Sprint-01 S4 (34/34 + 10/10 re-run) | Medium |
| AUD-06 | `solaris-603-native-probe/recommended-request-builder.cjs` | frozen / retained-evidence | **No caller anywhere** | AND-IMP-01 assessed: truncation is materially harmless; content survives in two complete files | Low (keep OPEN, cheap to close) |
| AUD-07 | 8 retained tools (R2/R3/R4) | frozen / authored-source | Only if a reviewer reproduces evidence | Tools write results **into tracked frozen paths in place**; reproducing evidence breaks `frozen-integrity` | Low-Medium |
| AUD-08 | `docs/provenance/SOURCE-CLASSIFICATION.json` | maintained / provenance-record | Latent | Nested `evidence/` dirs under R4 subdirs resolve to **authored-source**, not retained-evidence (70 files, 21 `.js`) | Low |
| AUD-09 | `docs/AUDIT-FINDINGS-MATRIX.md`, `docs/workflow/HANDOFF.md`, `docs/BUILD-AND-TEST.md` | maintained / documentation | Reader-facing | Stale counts (278/82 vs measured 385/102); blocked-gate table lists 6 of the checker's 8 gates | Low |
| AUD-10 | `candidate/a605/risk-screen.mjs` | maintained / maintained-candidate | Candidate router only | Clinical escalation copy follows UI locale, not message language | Low |

---

## AUD-06 — AND-IMP-01, assessed (asked for first)

**Path** `solaris-603-native-probe/recommended-request-builder.cjs`
**SHA-256** `32e8ced1646b494fd3af6cb833ef9b9d1041f129805930bd7502b4dd77df3492` (839 bytes, 9 lines)
**Classification** frozen / retained-evidence; registered as inherited defect `AND-IMP-01` in `docs/provenance/CANDIDATE-CHANGES.json` by exact path **and** exact hash.

**What it is.** A single CommonJS export, `buildSourceFreeRequest(user, recent)`, which builds the QVAC request for the *zero-selected-facts* conversation branch: real system instruction, user as an actual user message, optional bounded source-free prior pair, `json_schema` with `message` + `sourceRefs` (`maxItems: 0`), `predict:128, temp:0.3, reasoning_budget:0, seed:42`, `kvCache:false`, `captureThinking:true`. The file ends after the return object's `};` — the function's closing brace is missing. `node --check` → `SyntaxError: Unexpected end of input` at line 10, exactly the registered diagnostic.

**Who calls it.** Nobody. `grep -rn "buildSourceFreeRequest\|recommended-request-builder"` over all source finds **one** hit: its own declaration. Every other hit is prose in seven docs. It is not imported by any probe runner, not loaded by `tools/repo-check.py` except as a parse target, and not on any host path. It is a *recommendation artifact*, not executable probe infrastructure.

**Does the truncation matter?** Materially, no — and this is the part worth recording:
- `solaris-603-native-probe/REPORT.md` §"Narrow recommendation" (line 34) enumerates every parameter in the file, in prose, completely.
- `Solaris-Android-R3/src/conversation-request.js` (sha `33f7e34b…`, 79 lines, parses clean, **shipped**) implements the identical recommendation: byte-identical system prompt, same `predict/temp/reasoning_budget/seed`, same `captureThinking`, same `solaris_conversation` schema with `maxItems` = `refs.length` = 0 on the source-free branch.
- `solaris-603-native-probe/actual-helper-validation.json` holds the resulting request objects, produced from that helper.

So the missing bytes are a closing brace plus (possibly) a trailing newline; no unique information is lost. REPORT.md line 34 does tell a reader to "use the request in `recommended-request-builder.cjs`" without noting it is truncated — that is the only way it misleads, and REPORT.md is frozen evidence that must not be edited.

**Proposed bounded action.** Take resolution option 2 — record it permanently as a truncated fragment — and add to the existing `AND-IMP-01` entry (a *maintained* record, no frozen byte touched) a `content_preserved_in` list naming `solaris-603-native-probe/REPORT.md` §Narrow recommendation and `Solaris-Android-R3/src/conversation-request.js` with its hash, plus a one-line note that REPORT.md's pointer refers to a truncated file. Option 1 (recover from the full reference) buys nothing measurable.

**Input dependency.** None for option 2. Option 1 needs the restored 1,518,762,347-byte reference — disproportionate for a closing brace.

**Do not:** guess the tail, add the brace, or "fix" the file. The current registration already does the important job: `check_js_evidence` fails if this file changes, disappears, changes diagnostic, starts parsing, or if *any second* evidence JS fails to parse — I verified that logic in `tools/solaris_checks/checks.py::check_js_evidence`, which answers the review question in `docs/reports/AUDIT-DISPOSITION-2026-09-18.md` ("prove the exception cannot mask a second malformed file"): it cannot; registration is a per-path dict keyed by exact path and hash, and unregistered failures are appended as findings.

---

## AUD-01 — Typed facts can be bound to *no* authority (contract §5.2 violated)

**Path** `candidate/a605/answer-boundary.mjs` — sha `60313aedb395d0a7aa3eb78e385752c1da13ddfffd3d35f8941973bbe3669694`
(reached via `candidate/a605/guided-router.mjs` — sha `e9613e2b9ad74b07fcb0c88c8cafadb8f8aef85478bab0eec187dda6824fd0ac`)
**Classification** maintained / maintained-candidate (strictest treatment).

**Defect.** `buildTypedFact` enforces authority with

```js
if (source.authorityEpoch !== authority.epoch
    || source.permissionRevision !== authority.permissionRevision) throw …AUTHORITY_CHANGED
```

When *both* sides are absent the comparison is `undefined !== undefined` → false → accepted. `routeRequest` only requires `authority` to be a non-null object, so `authority: {}` plus a selection entry carrying no `authorityEpoch`/`permissionRevision` passes. `isUsableSelectionEntry` also does not require `revision`, so `revision` can be `undefined` too — and in `groundedCheckin` the staleness check is self-referential (`ref.revision` is read from the same object), so `STALE_REVISION` can never fire on that path.

**Reproduce** (node, no writes):

```js
routeRequest({ user:'explain my check-in', locale:'en',
  selection:[{ id:'s1', revision:1, approvedFields:['date','vitality'],
               fields:{ date:'2026-01-01', vitality:4 } }],
  authority:{} })
```
→ `kind:"checkin"`, message *"In the selected check-in dated 2026-01-01, you recorded vitality: 4/5…"*, and `typedFacts[…]` with `authorityEpoch`/`permissionRevision` **undefined**. Dropping `revision` from the entry likewise yields `sourceRefs:[{id:'s3'}]` — a receipt-bound citation with no revision.

**Impact.** The module's own docstring and `docs/ROUTING-AND-ANSWER-CONTRACT.md` §5 rule 2 promise that "every typed fact is bound to source ID, source revision, approved field, value, **and the authority epoch and permission revision it was read under**". A displayed and committed personal claim can carry `undefined` for three of those five. Downstream, `commitSupportedAnswer` pushes the rendered text to `persisted`, `receipts` and `modelContext`, so an unbound claim would enter the receipt chain. This is exactly the F03 class of defect, introduced by the containment layer itself.

**Why the suite misses it.** `candidate/tests/answer-boundary.test.mjs` (sha `1482658d…`) covers *changed* authority (`epoch: 1` vs `0`, `permissionRevision: 2` vs `1`) at lines 85–95. There is no control for **absent** authority fields on either side.

**Bounded action.** In `buildTypedFact`, require `authority` to be an object with an integer-ish `epoch` and `permissionRevision` and require the source to carry both, rejecting with `AUTHORITY_CHANGED` (or a new `AUTHORITY_UNBOUND` code) otherwise; add `revision` to `isUsableSelectionEntry`'s shape check. Add three negative controls: absent authority fields, absent source binding, absent `revision`. Roughly 10 lines plus tests, inside one lane, no frozen byte touched.

**Input dependency.** None. This is source-only work on maintained-candidate files and can be done and asserted today — and should be done *before* the Path-A rewrite (AUD-03), or the defect gets carried into the rewrite.

---

## AUD-02 — The candidate states a false personal fact when nothing is renderable

**Paths** `candidate/a605/guided-router.mjs` (`e9613e2b…`), `candidate/a605/answer-boundary.mjs` (`60313aed…`), `candidate/a605/supported-surface.mjs` (`9c3cc72f7dab4fd318d590c2d982fbf5049c440393a74557e454165c0ba00db1`)
**Classification** maintained / maintained-candidate.

**Defect.** `renderCheckinAnswer` falls back to the literal string `no aspect ratings` / `ninguna valoración` whenever no aspect fact survived binding. But a fact can fail to survive for **four different reasons** that are not equivalent:

1. the user genuinely skipped the answer (`MISSING_VALUE`),
2. the field is not in `approvedFields` (`FIELD_NOT_APPROVED`),
3. the value is out of shape — e.g. a `0` rating (`UNRENDERABLE_VALUE`),
4. the revision/authority no longer matches.

Cases 2–4 produce a **false statement about what the user recorded**. Measured:

```
selection: { date:'2026-02-03', vitality:5, clarity:5, balance:5, alignment:5 }, approvedFields:['date']
→ "In the selected check-in dated 2026-02-03, you recorded no aspect ratings. These are your own impressions."
```
The user recorded four 5/5 ratings. Similarly a `vitality: 0` is silently dropped with no trace, although `supported-surface.mjs` exports `valueState` whose docstring says *"Missing is missing. Zero is a value. They are never conflated."* — `valueState` is **never called by anything** (dead export; grep confirms only its own definition).

**Second half of the same defect — a regression against shipped 604.** The frozen `Solaris-Android-R4/grounding/fast-guided.js` handles the all-null check-in with a dedicated `checkin-empty` kind and an honest follow-up (*"You can return to the check-in when you want to answer, or leave it skipped."*), and on the step path it names the actual lowest aspects (`choose an aspect (clarity, balance)`). The candidate has neither. Measured on an all-null check-in:

```
'help me choose a step today'
→ kind "step": "… you recorded no aspect ratings. These are your own impressions.
   For a small step, choose one of those aspects and write what would support it today."
```
"those aspects" refers to a list that was never produced. The candidate is strictly worse than the code it replaces on this path.

**Impact.** Contract §5 rule 5 ("Absence is stated, never filled… never a claim that records were reviewed") is violated in the direction the whole A605-02 workstream exists to prevent: the *deterministic renderer itself* emits an untrue personal claim, and the answer-boundary layer admits it because it is a legitimate rendering. `candidate/tests/answer-boundary.test.mjs:131` actively asserts the behaviour (`'zero sources renders no aspect ratings'`), so it is currently locked in by a test.

**Bounded action.** (a) Distinguish *answered-but-not-available* from *unanswered*: carry per-field rejection codes out of `groundedCheckin` and only say "no aspect ratings" when every aspect was `MISSING_VALUE`; otherwise state that some answers could not be shown, without naming values. (b) Restore a `checkin-empty` equivalent with the shipped follow-up sentence, EN and ES. (c) Make the step suffix name the rendered low aspects, or omit the phrase when none were rendered. (d) Either use `valueState` or delete it — a live docstring describing behaviour the code does not have is itself a small false claim. (e) Replace the test at line 131 with one that asserts the *distinction*.

**Input dependency.** None; all source-only. The ES copy changes are engineering placeholders and stay behind the existing `ESCALATION_COPY_REVIEW_STATUS`-style clinical gate only where they touch the clinical path (they do not here).

---

## AUD-03 — The A605 donor-fit analysis understates the blockers by at least five

**Paths** `candidate/a605/*.mjs` (maintained-candidate) vs `Solaris-Android-R4/tools/hbc_inline.py` — sha `0014f1b6174b6a4274b5090c9078d8a0b8526506c551383ae427f8aeb9102a89` (frozen / authored-source) and `docs/HOST-REPRODUCTION-EVIDENCE.md` — sha `85e54250a2efb9f51fdca8d26b1f55c5b115efaa54d8577db6e5a1a818aac10b`.

**Observation.** `docs/HOST-REPRODUCTION-EVIDENCE.md` §"A605 donor fit" records **two** measured constraints: Hermes 0.12.0 rejects `class`, and the bundled candidate compiles to 26 functions against a `functionCount == 2` assertion. It then concludes "**A is the smaller and safer change**". The frozen inliner imposes more than that. From `hbc_inline.py` (lines 43–68) the donor must satisfy:

- `not donor.hasExceptionHandler` — **try/catch is forbidden**. The candidate has 3 (`groundedCheckin` ×2, `commitSupportedAnswer`), and its entire rejection mechanism is `throw`/`catch` (12 `throw` sites).
- `environmentSize == 0`, no closures — the candidate has 6 arrow functions used as callbacks (`filter`/`map`/`find`).
- forbidden opcode `CreateRegExp` — the candidate has 4 regex literals (`/\s+/g`, the combining-marks class, `ISO_DATE`, the ESM marker).
- `'WithBuffer' not in name` — array/object literal buffers are forbidden. The candidate has ~9 array literals (including the ~80-entry `RISK_MARKERS`) and ~8 object literals (`INTENTS`, `COPY`, `ASPECT_LABELS`, `REJECT`, …).
- `no_new_strings=True` + `require(value < len(base_reader.strings))` — every string must already exist in the base table at the same index. The candidate introduces dozens of new EN/ES sentences and ~110 marker strings; `prepare-guided.cjs` handles new constants only via eight-code-unit `String.fromCharCode` chunks, which is per-constant expensive.

**Impact.** A reader planning "Path A: express the whole supported surface as one function" will under-budget: it is not a flattening, it is a rewrite that must also eliminate exceptions as control flow, all regex, all literal buffers, and route every new string through `fromCharCode` chunking — under a 127-register compact-frame ceiling. That may well flip the A-vs-B recommendation toward B (extend the donor contract under its own review).

**Additionally unmeasured:** the candidate depends on `String.prototype.normalize('NFD')` for the entire F04 accent fix. Nothing in the repository establishes that the pinned Hermes 0.12.0 implements `normalize` correctly for the Spanish diacritics involved. Do not assume it; measure it.

**Bounded action.** Extend the fit section with the full constraint list taken from `hbc_inline.py`, and add one runtime probe under the pinned Hermes: `foldAccents('¿Qué?')` and `'á'.normalize('NFD').length`. Re-state the A/B recommendation after that measurement rather than before it.

**Input dependency.** The pinned `hermesc`/Hermes VM (digest `b4c37f09…`) — same blocker as F01. The *documentation* correction needs no input at all.

---

## AUD-04 — Shipped `fastGuided` parses the prompt envelope with no structural guard

**Path** `Solaris-Android-R4/grounding/fast-guided.js` — sha `100a7ce8045aa1ec64d554715eb0980d7379afb2c78cc6441ae424900a5c0369`
**Classification** frozen / authored-source. **Reachability: this is the real one.** Per `Solaris-Android-R4/grounding/IMPLEMENTATION.md` and `build-plans.py`, this helper is inlined into host functions **14890** (`assertConversationAccess` preflight) and **14894** (`converse`) of the byte-identical 604 host bundle `30be9989…`.

**Defect.** Lines 7–9:

```js
var envelope = JSON.parse(prompt.slice(prompt.indexOf('\n') + 1, -10));
var text = envelope.user.toLowerCase().trim();
```

No check that `indexOf('\n') >= 0`, no check that the last 10 characters are `' /no_think'`, no `typeof envelope.user === 'string'`. The two sibling consumers of the *same* envelope both guard exactly these conditions:

- `Solaris-Android-R3/src/conversation-request.js` (sha `33f7e34b…`): `if (split < 0 || prompt.slice(-10) !== ' /no_think') throw Error('CONTEXT_INVALID')`, then validates `typeof envelope.user !== 'string' || !Array.isArray(envelope.facts) || !Array.isArray(envelope.allowed)`.
- `Solaris-Android-R3/src/recent-context.js`: same two-part guard, returning the task unchanged instead of throwing.

So the authors treated this seam as not-guaranteed in two of three places. The third is the one injected earliest.

**Concrete consequence.** `Solaris-Android-R4/grounding/F14890.txt` contains **zero** `Catch`/`TryStart` markers, so a `SyntaxError`/`TypeError` raised by the injected code propagates out of `assertConversationAccess` — a function that, before this change, could only throw its own named errors (`MIGRATION_REQUIRED`, `MESSAGE_EMPTY`). A malformed envelope turns what was an ordinary open-chat turn into an unhandled host throw. Two secondary index-coupling assumptions sit in the same function: `task.manifest.sources[i]` and `task.sourceRefs[i]` are indexed in lockstep with `facts[i]`, and `task.sourceRefs[latest]` is the citation attached to the rendered claim — a misalignment would cite the wrong record rather than fail.

**Not covered by tests.** The 34 actual-Hermes cases in `Solaris-Android-R4/grounding/actual-tests.js` cover selection, denial, expiry, MAC races, idempotency and open chat — there is **no malformed-prompt/envelope case**; the test harness's own `envelope()` helper asserts the structure it then relies on.

**Bounded action.** Do **not** edit the frozen helper. (a) Record the guard asymmetry as a known 604 characteristic in the routing contract §8 / matrix. (b) Make the replacement carry the guard: the candidate's `routeRequest` already resolves non-string input deterministically, but it receives an already-parsed object — the integration must own the `indexOf('\n')`/suffix/`typeof user` checks before calling it, and must decide *deterministically* what a malformed envelope means (limitation reply, not a throw, and not a silent fall-through to open generation). (c) Add one malformed-envelope case to the host suite when it can next run.

**Input dependency.** (c) needs the 603 base HBC `b8ac7d1b…` and pinned `hermesc` — the F01 blockers. (a) and (b) need nothing.

**Relationship to existing findings:** this is *not* F04 (routing normalization) and *not* F05 (risk screen ordering) and it does not upgrade F06 (which stays an unreproduced native race hypothesis — I found no new evidence about it, and looked only at decompiled/authored JS, not DEX).

---

## AUD-05 — `FEATURE-STATUS.md` asserts something Sprint-01 contradicts

**Path** `docs/FEATURE-STATUS.md` — sha `a81d0e004163fb6c55b05aedc5e98f8f609b3725bd1b93568970335c55e65df2`. maintained / documentation.

Lines 15–17 state, in bold: "**All 604 results below are attributed to the dated 604 handoff. This repository did not rerun them.** The only checks this repository has executed are in [Build and test](../BUILD-AND-TEST.md)."

Both sentences are now false. `docs/workflow/STATUS.md` (current head) records under "Checks actually run — Sprint-01": **604 host bundle reproduction PASS — byte-identical `30be9989…`**, **Original 34 host cases on the reproduced bundle PASS — 34/34**, **Original 10 lifecycle cases PASS — 10/10**, and **A605 donor fit DOES NOT FIT — measured**. `README.md` lines 41–44 and `docs/HOST-REPRODUCTION-EVIDENCE.md` record the same. Meanwhile `docs/BUILD-AND-TEST.md` (sha `133b80a3…`) does not mention the host reproduction at all, so the cross-reference in the second sentence points at a document that omits the runs.

The same file still carries the row "HBC reconstruction and packaging reproducible in this repository | **Blocked — inputs excluded**" with no row for the measured host-bundle result. That row is arguably still literally true (the inputs are outside the tree), but a reader consulting the designated claim-by-claim evidence file — which `CLAUDE.md` names as the authority before calling anything working — will conclude the reproduction never happened.

**Impact.** This is the repository's own truthfulness rule cutting the other way: the docs now *understate* what was achieved, in the one file whose entire job is claim-to-evidence mapping.

**Bounded action.** Reword the header sentence to "604 results below are attributed to the dated 604 handoff except where a row names a Sprint-01 re-run", add rows for the byte-identical host reproduction, the 34/34 and 10/10 re-runs (with the "desktop Hermes, synthetic seams, disposable copy" qualifier and a link to `HOST-REPRODUCTION-EVIDENCE.md`), and add a row for the measured A605 donor-fit failure. Add the host-reproduction entry point to `BUILD-AND-TEST.md`.

**Input dependency.** None.

---

## AUD-07 — Retained tools write their evidence into tracked frozen paths

**Classification** frozen / authored-source (the tools); frozen (the outputs they overwrite).

Eight retained tools write results in place, with no `--out` and no dry-run:

- `Solaris-Android-R4/review-functional/helper-adversarial.cjs` (sha `09c6ffac57475e7b9c4b0c8737970d0a07641db2798fe6327d9d27834dee85d3`) → `evidence/helper-adversarial.json`
- `Solaris-Android-R4/tests/ui/chat-ui.test.cjs` and `Solaris-Android-R3/tests/ui/chat-ui.test.cjs` → `UI-TEST-RESULTS.json` / `UI-COMPACT-TEST-RESULTS.json` (tracked, frozen)
- `Solaris-Android-R4/latency/prepare-caps.mjs` → `caps-validation.json`; `prepare-probe.mjs` → `helper-validation.json`; `run-caps.py` → `caps-native-summary.json`; `run-probes.py` → `native-summary.json`
- `Solaris-Android-R2/tools/test-completion-guards.py` → `evidence/guard-patch/BEHAVIORAL-RESULT.json`

**Impact.** A reviewer who reproduces any of this evidence in the working tree silently mutates frozen bytes; the next `tools/repo-check.py` fails `frozen-integrity`, and the naive repair is exactly the prohibited baseline refresh. The team already knows the mitigation — Sprint-01's host/lifecycle suites "ran in a **disposable copy**; the tracked tree was never modified" — but that discipline is recorded in `STATUS.md` for those two suites only and appears nowhere in `BUILD-AND-TEST.md`.

**Bounded action.** One subsection in `docs/BUILD-AND-TEST.md`: list these eight write targets, state that any reproduction runs in a disposable copy, and note that a diff in these files is a reproduction artifact, never an authorized override. Do not modify the tools.

**Input dependency.** None for the documentation; most of the tools cannot run here anyway (excluded model/toolchain inputs).

---

## AUD-08 — Nested `evidence/` directories get authored-source treatment

**Path** `docs/provenance/SOURCE-CLASSIFICATION.json` — sha `c6306fa00142fc5572d74beb6ea3ffad310b5898e80fedad564b858f0007575d`. maintained / provenance-record.

The rules pin `Solaris-Android-R{2,3,4}/evidence/` to retained-evidence, but longest-prefix matching sends **nested** evidence trees to the generic `Solaris-Android-R4/` rule → *frozen / authored-source*:

- `Solaris-Android-R4/lifecycle/evidence/` — 36 files
- `Solaris-Android-R4/review-functional/evidence/` — 34 files

70 files total, of which 21 are `.js` (compiled Hermes fixtures and `provenance.json` siblings). They currently parse, so nothing fails today. But this inverts the intended treatment in both directions: a generated fixture that fails to parse there would **hard-fail** `javascript-syntax-authored` with no triage path (the registered-defect mechanism only applies to `retained-evidence`), while `docs/provenance/SOURCE-CLASSIFICATION.json`'s own stated purpose is that "a new directory never silently inherits informational treatment". By contrast `Solaris-Android-Reconstruction/…/evidence/` correctly lands on retained-evidence via that tree's catch-all.

**Bounded action.** Add two prefix rules (`Solaris-Android-R4/lifecycle/evidence/`, `Solaris-Android-R4/review-functional/evidence/`) as frozen / retained-evidence — or, better, one rule per tree plus a checker control asserting that **no** tracked path containing `/evidence/` resolves to `authored-source`. The second form prevents the next nested evidence dir from repeating it.

**Input dependency.** None. Note this changes which gate those 21 `.js` files run under, so the checker self-tests and the recorded file counts in `BUILD-AND-TEST.md` move with it.

---

## AUD-09 — Stale measured numbers in maintained docs

- `docs/AUDIT-FINDINGS-MATRIX.md` (sha `2ceadef48d90f7522bb2c8f83f2d9cb9bb7cb4d52bca4c3bedefb5da127d04b2`), F03 row: "the answer-boundary suite (**82** assertions of a **278**-assertion candidate total)". **Measured now: answer-boundary 102, routing 283, total 385.**
- `docs/workflow/HANDOFF.md` (sha `8a58cb6b80ea96b295d9ad1f6c8b006bf0bafb8b89a3a651db4a620b5886569d`) line 44: `node candidate/tests/run-all.mjs   # 278 assertions`.
- `docs/BUILD-AND-TEST.md` "Blocked gates" table lists **6** gates; `tools/solaris_checks/checks.py::BLOCKED_GATES` prints **8** — `dependency-cve-and-license-audit` (F10) and `maintained-source-lint` (AND-01's own lint task) are missing from the doc.

`STATUS.md` and `BUILD-AND-TEST.md` were refreshed to 385 at HEAD 6126903; these three did not move with them. The checker has no control tying a documented count to a measured one, which is why they drift.

**Bounded action.** Correct the three places (F03 row → "102 of 385"; HANDOFF → 385; blocked-gate table → all 8, generated from `BLOCKED_GATES`). Optionally add a checker control that the blocked-gate table in `BUILD-AND-TEST.md` lists exactly the registered gate names — cheap, and it is the class of drift the repository cares most about. Assertion counts are better handled by not quoting them in two places.

---

## AUD-10 — Clinical escalation copy follows UI locale, not message language

**Path** `candidate/a605/risk-screen.mjs` — sha `d6d7452d1ca6a433044140927b9b8756974e51c09e9f2f81bfa89bae57a4a0fe`, with the dispatch in `guided-router.mjs`. maintained-candidate; candidate-only reachability.

`screenForRisk` detects Spanish clinical markers (`dolor de pecho`, `medicamento`, …) from the message content, but `routeRequest` selects `ESCALATION_COPY[locale]` from `request.locale`. A Spanish-language clinical message sent while the UI locale is `en` produces English escalation copy. Shipped 604 behaves the same way (`prompt.indexOf('Reply in es ')`), and `docs/ROUTING-AND-ANSWER-CONTRACT.md` is silent on it, so this is a deliberate-looking gap rather than a regression — but it is on the one path where comprehension matters most, and the copy is already behind a clinician-review gate (`ESCALATION_COPY_REVIEW_STATUS.reviewedByQualifiedClinician: false`).

**Bounded action.** When the matched marker set is Spanish-only and the locale is `en`, emit both language variants, or state the decision explicitly in contract §4 so the reviewer sees it. Fold into the same clinician review that already blocks patient release for this copy — do not ship new escalation wording without it.

**Input dependency.** Qualified clinical review (already the named gate for F05).

---

## Contradictions with the repository's own documentation

1. **AUD-05** — `FEATURE-STATUS.md`: "This repository did not rerun them / the only checks this repository has executed are in Build and test" vs Sprint-01's recorded 34/34 + 10/10 re-runs on a reproduced bundle. Strongest contradiction found.
2. **AUD-01** — `ROUTING-AND-ANSWER-CONTRACT.md` §5 rule 2 ("every typed fact is bound to … the authority epoch and permission revision") vs `buildTypedFact` accepting `undefined` on both sides.
3. **AUD-02** — §5 rule 5 ("Absence is stated, never filled") and `supported-surface.mjs`'s "Missing is missing. Zero is a value. They are never conflated" vs a renderer that conflates unapproved/unrenderable/stale with unanswered, and a `valueState` helper nothing calls.
4. **AUD-03** — `HOST-REPRODUCTION-EVIDENCE.md` names two donor constraints and recommends Path A; `hbc_inline.py` enforces at least five more that the candidate violates.
5. **AUD-08** — `SOURCE-CLASSIFICATION.json`'s stated purpose ("a new directory never silently inherits informational treatment") vs 70 nested evidence files inheriting *authored-source* treatment.
6. **AUD-09** — three stale counts / an incomplete blocked-gate table.

## Existing findings — preserved, not re-litigated

F01–F12, AND-CI-01/02/03, SP-CI-01/02, SP-CHAT-01/02/03, SP-DOC-01 are left exactly as recorded. Specifically: **F03 stays CONTAINMENT** (AUD-01/AUD-02 are defects *inside* the containment layer, not a claim that module 958's parser is repaired or that containment failed); **F06 stays an unreproduced native race hypothesis** (I inspected no DEX or native code and found nothing bearing on it); **F04/F05 remain repaired-at-source, integration-blocked** (AUD-04 is a distinct guard gap in the same shipped helper, not an upgrade of either). AND-IMP-01 stays OPEN — AUD-06 recommends the cheaper of its two already-recorded resolution options and adds provenance pointers, not a byte change.

## What I inspected, and what I did not

**Inspected in full:** all 5 `candidate/a605/` modules and all 4 `candidate/tests/` files; `tools/repo-check.py`, `tools/solaris_checks/checks.py` (all 753 lines), `classification.py`, `jsonc.py`; `Solaris-Android-R4/grounding/fast-guided.js`, `IMPLEMENTATION.md`, `build-plans.py`; `Solaris-Android-R3/src/conversation-request.js` and `recent-context.js`; `Solaris-Android-Reconstruction/src/reconstructed/RecoveryEnvelope.java`; `tools/host/hbc-input-wrapper.py`; `.github/workflows/source-checks.yml`; `SOURCE-CLASSIFICATION.json`, `CANDIDATE-CHANGES.json`, `AUDIT-FINDINGS-MATRIX.md`, `BUILD-AND-TEST.md`, `FEATURE-STATUS.md`, `ROUTING-AND-ANSWER-CONTRACT.md`, `HOST-REPRODUCTION-EVIDENCE.md`, `STATUS.md`, `solaris-603-native-probe/REPORT.md`.

**Grepped/spot-checked only:** `hbc_inline.py` (restriction list, not the relocation maths), `hbc_patch.py`, the R2/R3/R4 packaging and signing tools, `actual-tests.js` (case names and the envelope helper), `helper-adversarial.cjs`, `verify_checkpoint.py`, `recover_601.py`, the latency probe variants.

**Deliberately not audited** (per your scope rules, and flagged here as coverage limits):
- ~1,160 files of retained evidence/reference: `Solaris-Android-R2/evidence/` (477), `Solaris-Android-R3/evidence/` (290), `Solaris-Android-R2/reference/` (256), `Solaris-Android-Reconstruction/reference/` (338), all `.hasm` disassembly, decompiled Java. I confirmed via `repo-check` that they parse and match frozen hashes; I did not read them.
- `Solaris-Android-R{3,4}/ui/sanctuary.html` accessibility/consent surface — that is F11's territory and needs a real rendering environment.
- No Hermes execution, no Android build, no device, no model, no dependency/CVE/license work (F10 remains BLOCKED — nothing I saw changes that).
- No independent verification of the 1,881 frozen hashes beyond running the repository's own `frozen-integrity` check.
- `RecoveryEnvelope.java` reviewed for crypto hygiene (AES-GCM with header as AAD, 600k-iteration PBKDF2-HMAC-SHA256, 32-byte salt / 12-byte nonce from `SecureRandom`, key zeroing in `finally`, `MessageDigest.isEqual` constant-time MAC compare, strict UTF-8 as a separate operation): **clean — no finding.** I did not verify it against the actual 601 native codec; that is the conformance test's job and it needs inputs not present here.
- The repository tooling category is otherwise **clean**: fail-closed semantics, central `validate_results` invariants, the `frozen_external_records` laundering guard and the candidate-declassification guard all do what they claim, and the three self-test suites report exactly the 27/11/17 the docs record.

**Reproduction note.** Every measurement above came from reading files, `sha256sum`, and running the repository's own suites plus three throwaway node scripts that only import `candidate/a605/` modules. No file in `<repo>` was created, modified or deleted by me; `git status` was clean before and after.
