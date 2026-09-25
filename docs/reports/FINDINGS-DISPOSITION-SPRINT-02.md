# Finding dispositions against the original reviewer text — Sprint-02

Prepared 2026-09-25, on top of `cdbf3a3` (branch
`claude/solaris-android-import-iyla4d`). This reconciles every finding raised by
the five recovered reviewer records against the reviewer's **own words**, not
against the summaries that were later written about them.

The originals are in [`docs/reviews/`](../reviews/). Each file's header records
the SHA-256 of the payload as it was recovered from the session transcript, and
every sanitization that was applied for publication. No finding text was
altered.

| Record | Reviewed commit | Verdict | Finding IDs used by the reviewer |
| --- | --- | --- | --- |
| [Review of `c57c0b2`](../reviews/2026-09-17-review-c57c0b2.md) | `c57c0b2` (import) | APPROVE WITH FINDINGS | B1, N1–N10 |
| [Review of `1b33e60`](../reviews/2026-09-18-review-1b33e60.md) | `1b33e60` | APPROVE WITH FINDINGS | B1–B4, N1–N7 |
| [AND-01 audit slice](../reviews/2026-09-18-audit-AND-01-slice.md) | `6126903` | read-only audit | AUD-01–AUD-10 |
| [Review of `6126903`](../reviews/2026-09-18-review-6126903.md) | `6126903` | APPROVE WITH FINDINGS | NB1–NB10 |
| [Review of `4f49ba8`](../reviews/2026-09-22-review-4f49ba8.md) | `4f49ba8` | APPROVE WITH FINDINGS, 0 blocking | NBR-1–NBR-10 |

**Namespacing.** The first two reviews reused the same short IDs (`B1`, `N1`…).
They are cited here as `c57c0b2/N3`, `1b33e60/N2` and so on. The `F`, `SP`,
`AND`, `AUD`, `NB` and `NBR` IDs are unchanged, and none is renumbered.

**Reviewer status** means what an independent reviewer actually did:

- **Re-attacked at `<sha>`**: a later reviewer tried to break the fix.
- **Reviewed at `<sha>`**: a later reviewer read and checked it.
- **Unreviewed**: the fix exists but no independent reviewer has examined it
  yet. Everything changed in Sprint-02 is in this state until the Sprint-02
  review is recorded in [`STATUS.md`](../workflow/STATUS.md).

AI review is recorded as evidence. It is not a GitHub approval from a second
eligible account.

"Path @ commit" pins the exact bytes the reviewer saw.

## Corrections to earlier records made by this pass

1. **AUD-06 existed. The published matrix said it did not.** The review of
   `4f49ba8` observed that `AUD-06` appeared nowhere in the repository and
   suggested "either note the withdrawal or renumber". The response in `cdbf3a3`
   recorded that AUD-06 "was withdrawn during the slice". **That was not true.**
   The recovered audit shows AUD-06 as the first finding the auditor wrote up:
   an assessment of AND-IMP-01 with a recommended resolution. It had simply been
   left out of the matrix. Recorded as **SP2-DOC-01**, and corrected in
   [`AUDIT-FINDINGS-MATRIX.md`](../AUDIT-FINDINGS-MATRIX.md).
2. **The published AUD-03 and AUD-07 rows misdescribed the findings.**
   - AUD-03 is "the donor-fit analysis understates the blockers by at least
     five". It is not "a recommendation was stated early", and it was never
     "withdrawn".
   - AUD-07 is "eight retained tools write their evidence into tracked frozen
     paths". It is not "the disposable-copy requirement was practice".
   - The fix recorded for AUD-07 in `BUILD-AND-TEST.md` is correct. Only the
     matrix row was wrong.
   - Both rows are now rewritten from the original text.
3. **The auditor's AUD-06 comparison is corrected, not adopted.** AUD-06 says
   the shipped `Solaris-Android-R3/src/conversation-request.js` implements "the
   identical recommendation: byte-identical system prompt…". Measured: the
   language clause differs, and the shipped builder sets no `kvCache`. The
   content is preserved **substantially, not verbatim**. The ledger entry says
   so.
4. **Two numbers from the handoff were checked, not assumed.**
   - "945 evidence paths": **verified**. 945 tracked paths contain an `evidence/`
     segment, and all 945 resolve to frozen retained-evidence.
   - "413 assertions": **never a committed count.** The candidate suite
     measures 385 at `6126903`, 484 at `4f49ba8`, 507 at `cdbf3a3` and 638 in
     the Sprint-02 tree. 413 was an intermediate working-tree figure reported in
     chat.

## `c57c0b2` review — B1, N1–N10

| ID | Original text (abridged, verbatim phrases) | Path @ commit | Reproduced | Fix | Regression evidence | Reviewer status | Remaining gate |
| --- | --- | --- | --- | --- | --- | --- | --- |
| c57c0b2/B1 | "`SKIPPED` is folded into `Overall: PASS`, exit 0" | `tools/repo-check.py` @ `c57c0b2` | Reviewer reproduced it with `node` off `PATH`. | `9dc5b23`: required checks fail closed; PyYAML pinned with hashes and installed in CI. | Control: "absent PyYAML FAILS yaml-parse rather than reporting a green skip". | Re-attacked at `1b33e60` ("Hide PyYAML → FAIL, exit 1"). | — |
| c57c0b2/N1 | "Documentation asserts a PR, a review and delivery that had not happened at commit time" | `docs/workflow/*`, `docs/ROADMAP.md` @ `c57c0b2` | By reading the text. | Superseded: all four statements were rewritten in later commits. | Re-read in the Sprint-02 documentation pass. | Unreviewed as a separate item. | — |
| c57c0b2/N2 | "'Two files were renamed', but only one was" | `docs/provenance/README.md` @ `c57c0b2` | **Still present at `cdbf3a3`.** | Sprint-02: heading corrected to one file, with the error noted in place. | — (documentation) | Unreviewed | — |
| c57c0b2/N3 | "binary list is case-sensitive and incomplete" (`.APK`, `.bin`, `.safetensors`…) | `tools/repo-check.py` @ `c57c0b2` | **Partly still present at `cdbf3a3`**: `.tar`, `.jar` and `.aar` had been added, but matching was case-sensitive and model-weight suffixes were missing. | Sprint-02: case-insensitive match; `.bin`, `.safetensors`, `.pt`, `.pth`, `.ckpt`, `.onnx`, `.tflite` added. No tracked file uses these suffixes. | New control `N3: an upper-case .APK and a .safetensors weight FAIL`. Reverting the fix fails it. | Unreviewed | — |
| c57c0b2/N4 | "content sweep is limited to `TEXT_SUFFIXES`" (`.tsx`, `.jsx`, `.sql`…) | `tools/repo-check.py` @ `c57c0b2` | **Partly still present**: config-style and extensionless files had been added in `5d48426`, but `.tsx`, `.jsx` and `.sql` were not. | Sprint-02: `.tsx`, `.jsx`, `.sql`, `.mts`, `.cts` added. | New control `N4: key material in a .tsx file FAILS`. Reverting fails it. | Unreviewed | The sweep is still a pattern sweep, not a secret audit, and is labelled so. |
| c57c0b2/N5 | "`config.yml:4` points at a URL that 404s today" | `.github/ISSUE_TEMPLATE/config.yml` | Still true: `main` is `5cc354c` and has no `docs/`. | **OPEN by design.** The link resolves when `docs/` reaches the default branch, and merging is not authorized. | — | — | Owner's merge decision. |
| c57c0b2/N6 | "Deletion of the owner's pre-existing root `README` is not recorded anywhere" | import commit `c57c0b2` | `git show 5cc354c:README` (6 lines) exists; nothing recorded the deletion. | Sprint-02: recorded in `docs/provenance/README.md`. The frozen import manifest is not edited. | — (documentation) | Unreviewed | — |
| c57c0b2/N7 | "`doc-links` scope excludes `contracts/README.md` and `.github/*.md`"; a link escaping the repo "would pass" | `tools/repo-check.py` @ `c57c0b2` | `contracts/README.md` had since entered scope. **`.github/*.md` and the escape were still open at `cdbf3a3`.** | Sprint-02: repo-config Markdown included; a resolved target outside the repository fails. | New control `N7: a doc link escaping the repository FAILS doc-links, and .github Markdown is checked`. Both halves are mutation-verified. | Unreviewed | — |
| c57c0b2/N8 | "`import-integrity` does not verify the `executable` flag the manifest records" | `tools/repo-check.py` @ `c57c0b2` | **Still open at `cdbf3a3`**: frozen-integrity compared bytes only. | Sprint-02: frozen-integrity compares the working-tree exec bit with the manifest's `executable` field. All 1,881 frozen files pass. | New control `N8: an imported file that lost its executable flag FAILS` (positive, dropped bit, gained bit). Reverting fails it. | Unreviewed | Measures the working-tree mode, which equals the committed mode on a Linux checkout with `core.fileMode` enabled, as in CI. |
| c57c0b2/N9 | "`actions/*` [pinned] by major tag, not commit SHA"; devcontainer features unpinned | workflow, `.devcontainer/devcontainer.json` | — | Actions pinned to full SHAs in `9dc5b23`. Sprint-02: the devcontainer disclosure now states that its features are floating tags as well. | Workflow file | Actions: reviewed at `1b33e60` ("verified all four pinned action SHAs against upstream tags"). Devcontainer: unreviewed. | The devcontainer is untested and unpinned, and says so. |
| c57c0b2/N10 | "the '5,234 archive members' figure is derived, not independently evidenced here" | `docs/provenance/SOURCE-LINEAGE.md` | By reading the text. | Sprint-02: labelled "derived" in all three places, with the reason. | — (documentation) | Unreviewed | Confirmable only against the restored full reference. |

## `1b33e60` review — B1–B4, N1–N7

| ID | Original text (abridged) | Path @ commit | Reproduced | Fix | Regression evidence | Reviewer status | Remaining gate |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1b33e60/B1 | "`frozen_external_records` can launder arbitrary drift in an imported file into a PASS" | `tools/solaris_checks/checks.py` @ `1b33e60` | Yes, by the writer, before the fix ("gave Overall PASS"). | `5d48426`: such a record may only cover a path the import manifest does not pin. | Control: "a frozen_external_record CANNOT launder drift in an imported file". | Re-attacked at `6126903` (§2, "still genuinely closed"). | — |
| 1b33e60/B2 | "Reclassification silences the candidate test gate, and `NOT_APPLICABLE` counts as success" | same | Yes, before the fix. | `5d48426` | Control: "declassifying candidate source does NOT silence its test gate". | Re-attacked at `6126903`. Sprint-02 extends the idea to **every** maintained path (SP2-CHK-01). | — |
| 1b33e60/B3 | "`PUBLIC-EXPOSURE-RECORD.md:18-20` states publication is currently blocked" | `docs/provenance/PUBLIC-EXPOSURE-RECORD.md` | Yes | `5d48426` | — (documentation) | Reviewed at `6126903` (§6, "Documentation honesty — CLEAN"). | — |
| 1b33e60/B4 | "F09 acceptance condition still reads 'Repository is private'" | `docs/AUDIT-FINDINGS-MATRIX.md` | Yes | `5d48426` | — | Reviewed at `6126903`. | — |
| 1b33e60/N1 | "Stale assertion counts presented as current" | `HANDOFF.md`, matrix | Yes | `5d48426`. It drifted again (AUD-09, then NBR-2) and was fixed each time. | Blocked-gate table: new CI drift control (Sprint-02). Assertion counts are quoted in one place, `BUILD-AND-TEST.md`, which the matrix points to. | Recurrences were found by the audit of `6126903` (AUD-09) and the review of `4f49ba8` (NBR-2). The fix itself was not re-checked. | Counts regenerated from a live run at Sprint-02 delivery. |
| 1b33e60/N2 | "Many genuinely clinical requests get the generic limitation, not the escalation copy"; "the specific in-source claim of over-referral is not supported" | `candidate/a605/risk-screen.mjs` @ `1b33e60` | **Re-measured 2026-09-25: all 17 phrasings still reach `limitation`.** At helper level, shipped 604 and the bounded donor both return `null` (the model path) for all 17, in both locales. | **OPEN, held for clinical review.** Sprint-02: the unsupported "deliberately over-refers" claim is removed from the source, and the set is recorded in contract §4, "Known under-referral". The markers were **not** extended, because that would route people to unreviewed escalation copy. | New: 68 containment assertions. None of the 17, in either locale, becomes a wellness, check-in, step or welcome answer, and none needs a model call. These do not lock in the limitation reply. | Unreviewed | Qualified clinician: what crisis and clinical phrasings should receive, and in which language. |
| 1b33e60/N3 | "Bare `"help"` / `"¡Ayuda!"` returns the product welcome… worth a conscious call" | `candidate/a605/guided-router.mjs` | Yes (still the behaviour). | Sprint-02: **recorded decision** in contract §3. It is kept because the reply makes no clinical claim, and step 1 screens `help` inside a clinical sentence first (measured: `I need help, my chest pain is severe` → `out-of-scope-clinical`). | — | Unreviewed | — |
| 1b33e60/N4 | "`routeRequest` throws instead of resolving deterministically on non-string input" | `candidate/a605/matching.mjs:46` | Yes | `5d48426` | Controls in `routing.test.mjs`. The `null`-options sibling was found later as NBR-1. | Re-attacked at `6126903` (§4: `routeRequest()` with no argument and with `null` return the limitation) | — |
| 1b33e60/N5 | "Rating-shape validation is not pinned by any test" | `supported-surface.mjs` | Yes (the mutation left the suite green). | `5d48426` | Mutating either branch produces 16 failures. | Not specifically re-checked by a later reviewer | — |
| 1b33e60/N6 | "Two checker guards have no negative control" | `checks.py` | Yes | `5d48426` | Controls: "a check that examines zero expected files FAILS" and "a registered defect whose DIAGNOSTIC changed FAILS". | Not specifically re-checked by a later reviewer | — |
| 1b33e60/N7 | "Minor checker scope gaps": dead `tools/tests/fixtures/` exclusions; `TEXT_SUFFIXES`; `binary_suffixes`; a phrase in the 18 September disposition; `STATUS.md` date | `checks.py`, docs | Yes | Binary suffixes and config/extensionless secret sweep: `5d48426`. STATUS date: `4f49ba8` (NB10). **Dead fixtures exclusion: still present at `cdbf3a3`; removed in Sprint-02.** The directory was never tracked, so the exclusion would have silently un-checked whatever landed there first. The disposition phrase is correct as written and unchanged. | JSON, YAML and Python parse checks now cover every tracked file. | Not specifically re-checked; the Sprint-02 part is unreviewed. | — |

## AND-01 audit slice — AUD-01–AUD-10 (audited `6126903`)

| ID | Original text (abridged) | Path @ hash (auditor's) | Reproduced | Fix | Regression evidence | Reviewer status | Remaining gate |
| --- | --- | --- | --- | --- | --- | --- | --- |
| AUD-01 | "Typed facts can be bound to *no* authority (contract §5.2 violated)"; also "`isUsableSelectionEntry` also does not require `revision`… `STALE_REVISION` can never fire on that path" | `answer-boundary.mjs` `60313aed…`, `guided-router.mjs` `e9613e2b…` | Yes: `authority:{}` rendered a claim with undefined bindings. | `4f49ba8`: absence is rejected before equality (`AUTHORITY_UNBOUND`); `revision` is required. | Controls for absent authority fields, absent source binding and absent revision. Same finding as NB6. | Reviewed at `4f49ba8` | **Note:** inside one synchronous snapshot the source and its reference are the same object, so `STALE_REVISION` compares a value with itself. That is inherent, not a bug. Staleness **across an await** is the host's commit-time check, which only native or host integration can exercise. |
| AUD-02 | "The candidate states a false personal fact when nothing is renderable"; second half: "a regression against shipped 604" (`checkin-empty` lost, dangling "those aspects") | `guided-router.mjs`, `answer-boundary.mjs`, `supported-surface.mjs` `9c3cc72f…` | Yes | (a) unanswered vs unavailable, (c) step suffix, (d) `valueState` used, (e) test at `:131` replaced: `4f49ba8`. **(b) `checkin-empty` restored in Sprint-02**, using the shipped EN/ES follow-up sentence and no step suffix. | **Three different truths:** nothing selected → `checkin-select`; selected but every aspect unanswered → `checkin-empty`; selected but some answers not available → "some answers could not be shown". The AUD-02(b) controls pass. Reverting (b) fails 7, 2 and 2 assertions across the three mutations. | (a)(c)(d)(e) reviewed at `4f49ba8`; (b) unreviewed | — |
| AUD-03 | "The A605 donor-fit analysis understates the blockers by at least five"; "measure `normalize`" | `hbc_inline.py` `0014f1b6…`; `HOST-REPRODUCTION-EVIDENCE.md` `85e54250…` | Yes | Constraint table: `4f49ba8`. **Sprint-02:** `normalize` measured on the pinned Hermes (the real `matching.mjs` gives output identical to Node). The full candidate was measured at 79 functions, 20 `Catch`, 26 closures, 12 environments, 3 regexps and 7 literal buffers, so it does not fit. The smallest adapter was built and proven on the host. | `tools/host/measure-donor-fit.py` (whole-program block); `candidate/tests/host-donor.test.mjs`; host evidence under [Bounded donor proof](../HOST-REPRODUCTION-EVIDENCE.md#bounded-donor-proof). | Constraint table: reviewed at `4f49ba8`. Sprint-02 measurement: unreviewed. | Full router integration needs native source (F01) or a reviewed inliner extension. |
| AUD-04 | "Shipped `fastGuided` parses the prompt envelope with no structural guard" | `R4/grounding/fast-guided.js` `100a7ce8…` | Yes: nine rows | (a) recorded in contract §3.1; (b) guards in `candidate/a605/host-envelope.mjs`: `4f49ba8`. **(c) Sprint-02:** 8 cases on the actual 603, 604 and candidate hosts, 8/8 each. The envelope header is a fixed template, and user text is JSON-escaped. | `tools/host/probes/envelope-and-input-cases.js`; `host-envelope.test.mjs` | (a)(b) reviewed at `4f49ba8` (nine-row table reproduced; 3,344 totality probes). (c) unreviewed. | The malformed-envelope throw is **not reachable from user text** on the measured paths. Probing it found **SP2-HOST-01**. |
| AUD-05 | "`FEATURE-STATUS.md` asserts something Sprint-01 contradicts" | `docs/FEATURE-STATUS.md` `a81d0e00…` | Yes | `4f49ba8` | — | Not specifically re-checked by a reviewer | — |
| AUD-06 | "AND-IMP-01, assessed… truncation is materially harmless; content survives in two complete files"; recommends option 2 plus `content_preserved_in` | `solaris-603-native-probe/recommended-request-builder.cjs` `32e8ced1…` | Yes: `SyntaxError` at line 10; no caller anywhere. | **Sprint-02:** `content_preserved_in` (three sources, each marked "substantially, not verbatim") and `recommended_resolution` (option 2) were added to the AND-IMP-01 ledger entry. No frozen byte was touched. The auditor's "byte-identical system prompt" claim is corrected (see above). | Existing: `check_js_evidence` fails if the file changes, starts parsing, changes diagnostic, or if any second evidence file fails. | Unreviewed | **AND-IMP-01 stays OPEN** until the owner adopts option 2 (recommended, not adopted). |
| AUD-07 | "Retained tools write their evidence into tracked frozen paths" (8 tools) | 8 retained tools, R2/R3/R4 | By reading the sources (no tool was run in the tracked tree). | `4f49ba8`: `BUILD-AND-TEST.md` §"Reproducing retained evidence — always in a disposable copy" lists all eight write targets. Tools unmodified. | Sprint-02 host tools refuse to run inside the tracked tree. | Not specifically re-checked | — |
| AUD-08 | "Nested `evidence/` directories get authored-source treatment" (70 files, 21 `.js`) | `SOURCE-CLASSIFICATION.json` `c6306fa0…` | Yes | `4f49ba8`: rules plus the `evidence-not-authored-source` check. | 945 of 945 evidence paths resolve to frozen retained-evidence (re-verified 2026-09-25). | Reviewed at `4f49ba8` ("NOT laundering, verified in depth"). | The converse was open; see SP2-CHK-01. |
| AUD-09 | "Stale measured numbers in maintained docs"; blocked-gate table "lists 6 of the checker's 8 gates" | matrix `2ceadef4…`, `HANDOFF.md` `8a58cb6b…`, `BUILD-AND-TEST.md` | Yes | `4f49ba8`; refuted in part by NBR-2 and fixed again in `cdbf3a3`. **Sprint-02 adds the control the auditor suggested**: CI fails if the documented blocked-gate table disagrees with `BLOCKED_GATES`. The doc no longer claims the table is "generated". | `docs: BUILD-AND-TEST blocked-gate table matches BLOCKED_GATES`. Deleting one row fails it. | Unreviewed (the control) | — |
| AUD-10 | "Clinical escalation copy follows UI locale, not message language" | `risk-screen.mjs` `d6d7452d…` | Yes | Recorded decision, contract §4. | EN/ES measured both ways. | Reviewed at `4f49ba8` ("measured independently, honestly recorded"). | Clinician gate (the same gate as F05). |

## `6126903` review — NB1–NB10

| ID | Original text (abridged) | Reproduced | Fix | Regression evidence | Reviewer status | Remaining gate |
| --- | --- | --- | --- | --- | --- | --- |
| NB1 | "`validate_results` fails open on an empty registry" | Yes, by reverting | `4f49ba8` | Control; reverting flips it to PASS. | Re-attacked at `4f49ba8` ("every reversion claim CONFIRMED") | Sibling empty-scope hole → NBR-6 |
| NB2 | "`CheckSpec.coverage` is never validated" | Yes | `4f49ba8` | Control | Re-attacked at `4f49ba8` | — |
| NB3 | "three checks are declared `COVERAGE_NONZERO` but achieve full coverage" | — | `4f49ba8`: promoted to FULL | Positives | Reviewed at `4f49ba8`, which found one promotion inert (NBR-8) | — |
| NB4 | "a check function returning `None` crashes outside the guarded path" | Yes (exact `AttributeError`) | `4f49ba8` | Control | Re-attacked at `4f49ba8` | — |
| NB5 | "`isinstance(x, int)` accepts `bool`" | Yes | `4f49ba8` | Control | Re-attacked at `4f49ba8` | — |
| NB6 | "authority binding is equality-only, so mutual absence compares equal" | = AUD-01 | = AUD-01 | = AUD-01 | Reviewed at `4f49ba8` | — |
| NB7 | "'you recorded no aspect ratings' is stated when aspects exist but could not be bound" | = AUD-02 | = AUD-02 | = AUD-02 | Reviewed at `4f49ba8` | — |
| NB8 | "approval/field lookups trust caller-supplied object semantics" | Yes | `4f49ba8`, partially; completed in `cdbf3a3` (NBR-5) | Controls | Partial fix reviewed at `4f49ba8`; completion unreviewed | — |
| NB9 | "wrapper cosmetics": unused `ROOT`; the `append_plans` report discarded | Yes | `4f49ba8`: report carried; `ROOT` no longer present | Deep diff: exactly one leaf (`ui.path`) | Re-attacked at `4f49ba8` ("both claims TRUE") | — |
| NB10 | "`STATUS.md` header reads 2026-09-17 while the content is dated 18 September" | Yes | `4f49ba8` | — | Reviewed at `4f49ba8` | — |

## `4f49ba8` review — NBR-1–NBR-10 (fixed in `cdbf3a3`)

`cdbf3a3` itself has **never been independently reviewed**. Every fix below is
therefore unreviewed until the Sprint-02 review. That review is asked to cover
`cdbf3a3..<Sprint-02 head>` as one range.

| ID | Original heading | Fix in `cdbf3a3` | Regression evidence | Reviewer status |
| --- | --- | --- | --- | --- |
| NBR-1 | "`routeHostPrompt` is not total; `null` options throw" | `?? {}`; 11 option shapes | Reverting reproduces the throw. | Unreviewed |
| NBR-2 | "`BUILD-AND-TEST.md` result table is stale and missing a row; refutes AUD-09" | Table transcribed from a live run | Sprint-02: the blocked-gate part now has a CI control; the result table is re-transcribed at delivery. | Unreviewed |
| NBR-3 | "the prototype-`user` control cannot fail" | The control pollutes `Object.prototype` and restores it. | Reverting the guard fails 2 assertions. | Unreviewed |
| NBR-4 | "§3.1 summary prose contradicts its own measured table" | Prose corrected | — | Unreviewed |
| NBR-5 | "NB8 is partially applied; `selection.find()` still trusts object semantics" | Array-checked scan and own-property reads | Controls | Unreviewed |
| NBR-6 | "NB1 leaves a sibling green-run hole open" | `CheckSpec.min_scope` on the checks that must never be empty | Reverting flips 3 controls to PASS. Sprint-02's new check also declares `min_scope=1`. | Unreviewed |
| NBR-7 | "the 'manufactures no bindings' control does not discriminate" | The control uses fully bound records. | Reverting fails 6 assertions. | Unreviewed |
| NBR-8 | "NB3's promotion of `candidate-changes-valid` is vacuous" | Rationale corrected | — | Unreviewed |
| NBR-9 | "the designated ledger does not carry this commit's status" | Reviewed-SHA ledger in `STATUS.md` | — | Unreviewed |
| NBR-10 | "two minor items": a guard that replaces a 604 *success*; "`AUD-06` appears nowhere… Either note the withdrawal or renumber"; `WRAPPER-RESULT.json` not ignored | Divergence stated in §3.1; output files ignored. **The AUD-06 part was answered wrongly** ("withdrawn"). Sprint-02 corrects this: see SP2-DOC-01. | — | Unreviewed |

## New in Sprint-02

| ID | Finding | Evidence | Disposition | Remaining gate |
| --- | --- | --- | --- | --- |
| **SP2-HOST-01** | An unpaired UTF-16 surrogate in user text makes `assertConversationAccess` throw `URIError: Malformed encodeURI input`, from the host's `encodeURIComponent` byte budget. A full turn ends in that error with 0 model calls and 0 writes. | Actual-host probe, identical on 603 (`b8ac7d1b…`), 604 (`30be9989…`) and the donor candidate (`611a2430…`). | **OPEN.** Pre-existing: it predates both the grounding patch and the donor. Nothing is written, but the error is unnamed and unhandled. | The fix belongs in host budget code (a surrogate-safe byte count, or a named rejection). That code is not editable source here (F01). |
| **SP2-CHK-01** | The converse of AUD-08. Four attacks passed **every** check on a scratch copy of the real tree: undeclared candidate code (A1); candidate code moved under `evidence/` and reclassified (A2); the checker package reclassified as evidence (A4); a new tool under `tools/evidence/` (A5). Retained-evidence scope admits registered defects, so each was a route to launder broken maintained code. | Measured 2026-09-24 | **FIXED at source.** New registered check `executable-code-scope` (full coverage, `min_scope=1`) enforces three things: retained-evidence is always frozen; `candidate/` and `tools/` may only have their own scope; every maintained-candidate file is declared in the ledger. | Five negative controls and one positive. Disabling the check fails exactly those five. **Unreviewed.** |
| **SP2-DOC-01** | The published matrix stated that AUD-06 had been withdrawn, and misdescribed AUD-03 and AUD-07. | Recovered audit text | **FIXED**: rows rewritten from the original text. | Unreviewed |
| **SP2-DOC-02** | `risk-screen.mjs` claimed it "deliberately over-refers". Contradicted by the 17 measured phrasings (1b33e60/N2). | Measured | **FIXED** (the claim); the underlying under-referral stays OPEN. | Clinician gate |

## Findings not reopened here

`F01`–`F12`, `SP-CI-01/02`, `SP-CHAT-01/02/03`, `SP-DOC-01`, `SP-INT-01` and
`AND-IMP-01`/`AND-CI-01/02/03` keep the dispositions recorded in
[`AUDIT-FINDINGS-MATRIX.md`](../AUDIT-FINDINGS-MATRIX.md), with these Sprint-02
updates:

- **SP-INT-01** is superseded for the donor path by the bounded donor proof. The
  full router still does not fit.
- **F04 and F05** are proven on the actual host for the bounded donor, within
  the scope of the donor's forms. They are not proven in an APK.
- **F03** stays open for model replies on the donor path.
- **F01** is unchanged.

External-audit items are kept under their own IDs, `EXT-01`–`EXT-30`, in
[`EXTERNAL-AUDIT-STATUS.md`](../EXTERNAL-AUDIT-STATUS.md).
