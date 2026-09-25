# Historical host reproduction — measured evidence

**18 September 2026.** Executed in a disposable copy of the source tree with the
privately supplied host inputs restored. The tracked repository was not modified
at any point; `git status --porcelain` was empty before and after.

## What was reproduced

| Item | Result |
| --- | --- |
| Input host bundle (603) | SHA-256 `b8ac7d1b58d9e8ea6eadd25de516e35842aea14e4b849462664bb3200fedc990`, 30,754,484 bytes — **matches the pin** |
| Pinned compiler | `hermesc` SHA-256 `b4c37f09410c6c6c0ce90df00eb270dc257d2184c85ca320382ebe06057f2a14`, Hermes 0.12.0 |
| Base function count | 15,513 |
| Plan function ids produced | `6929, 14890, 14894, 14904` — exactly the set the frozen builder requires |
| Spare UI slot bytes | **1,936** — independently matches the figure in the 604 audit |
| Output `candidate604.hbc` | 30,800,788 bytes, SHA-256 `30be9989cc00299836715cc3de5cf3a2a75b00019bdf2f1b91629205f558d8b3` |
| **Byte-identical to the historical 604 host bundle** | **Yes** |

### Report parity with the historical release record

The wrapper originally discarded the `report` dictionary that `append_plans`
returns, so its output carried only the four fields it computed itself
(independent review of `6126903`, NB9). It now carries the frozen builder's own
report labels, which makes the run directly diffable against the historical
release record committed in this repository.

Deep field-by-field comparison of the reproduced `frozen_builder_report` against
`Solaris-Android-R4/evidence/release/BUNDLE-RESULT.json`:

```
total differing leaf fields: 1
   .ui.path
```

Every other leaf field is identical, including `status`,
`unchanged_original_bytes_verified`, `string_and_function_ids_preserved`, the
per-function plan records, `changed_string_ids: [12364]`,
`native_payload_changes: false`, `inference_request_and_worker_unchanged: true`
and `background_lock_and_cancel_unchanged: true`. The single difference is
`ui.path`, the local filesystem path of the input HTML, which is environment
state and not a property of the artifact.

**These labels are report fields, not `require()` assertions.** Carrying them
adds provenance to the record; it does not add verification. The verification is
the twelve `require()` calls and the SHA-256 comparison above.

### Tests run against the reproduced bundle

| Suite | Command | Result |
| --- | --- | --- |
| Original 34 host cases | `Solaris-Android-R4/grounding/run-tests.py <hbc> --output …` | **34/34 pass, 0 failures** |
| Original 10 lifecycle cases | `Solaris-Android-R4/lifecycle/tests/run.py <hbc> --label candidate604-repro` | **10/10 pass, 0 failures** |

Both executed in actual Hermes against the reproduced bytecode, with synthetic
native, storage and model seams. The lifecycle runner writes evidence relative to
its source tree, which is why a disposable copy is mandatory; running it against
the tracked tree would damage the frozen reference.

Running the 604 lifecycle fixtures against the **603** base bundle fails during
fixture transpilation. Those fixtures target 604; this is not a reproduction
failure and was not a target.

## The input-pin substitution, stated plainly

`Solaris-Android-R4/tools/build-bundle.py` requires the full 603 APK. It uses it
for exactly two things: asserting the APK's own SHA-256, and reading
`assets/index.android.bundle` from the ZIP. The APK was **not** supplied to this
workspace, so that CLI could not be satisfied — and it was **not edited, patched
or weakened.**

[`tools/host/hbc-input-wrapper.py`](../tools/host/hbc-input-wrapper.py) performs
the identical downstream sequence on the same bundle bytes, substituting one
exact pin for another:

| | frozen builder | wrapper |
| --- | --- | --- |
| Input assertion | `sha256(APK) == 25d3642a…` | `sha256(bundle) == b8ac7d1b…` |
| Bundle source | unzip `assets/index.android.bundle` | the bundle directly |
| Everything downstream | identical | identical |

This does not relax a check — an APK containing a different bundle would fail
here too. **What it does not establish**, and the frozen path does: that this
bundle came from that APK, and the APK's own integrity. A reproduction through
this wrapper is evidence about the **host bundle only**.

Byte-identical output is the wrapper's only success condition. Anything else is
reported as a mismatch, never as a reproduction.

## A605 donor fit — measured, and it does not fit

The frozen `Solaris-Android-R4/grounding/build-plans.py` asserts of the donor:

```python
require(d.header.functionCount == 2
        and d.strings[d.function_headers[1].functionName] == 'fastGuided',
        'Unexpected guided donor')
```

Compiled with the pinned `hermesc`:

| Source | `functionCount` | Function names | Satisfies the donor contract |
| --- | ---: | --- | --- |
| Frozen `fast-guided.js` | **2** | `global`, `fastGuided` | Yes |
| Candidate, five ESM modules bundled to one script | **26** | `global`, `''`, `limitationReply`, `isRealCalendarDate`, … | **No** |

### The full constraint list, from `hbc_inline.py`

The first version of this section named **two** constraints and concluded that a
single-function rewrite was the smaller change. That was under-informed. The
frozen inliner (`Solaris-Android-R4/tools/hbc_inline.py`) enforces considerably
more, and the candidate violates most of it:

| Constraint enforced by the frozen inliner | Candidate today |
| --- | --- |
| `functionCount == 2`, function 1 named `fastGuided` | **26 functions**; function 1 is the bundle IIFE |
| Hermes 0.12.0 language support | **ES6 `class` is rejected outright** — "invalid statement encountered" |
| `not donor.hasExceptionHandler` — try/catch forbidden | **3 try/catch blocks, and 13 `throw` sites**: the entire rejection mechanism is exceptions |
| `donor.environmentSize == 0`, no `Closure` opcodes | **10 arrow functions** used as `filter`/`map`/`find` callbacks |
| `CreateRegExp` forbidden | **regex literals** for whitespace, combining marks and the ISO date |
| No `WithBuffer` opcodes — array/object literal buffers forbidden | many array and object literals, including the ~80-entry risk-marker list and the intent/copy tables |
| `no_new_strings`, every string already in the base table | **dozens of new EN/ES sentences**; `prepare-guided.cjs` handles new constants only as eight-code-unit `String.fromCharCode` chunks, which is expensive per constant |
| `frame < 128` registers, caller plus donor | measured in Sprint-02 — see [the budget](#measured-budget-at-the-two-inline-sites) |

**This changes the recommendation.** "Express the supported surface as one
function" is not a flattening exercise. It additionally requires eliminating
exceptions as control flow, all regex, all literal buffers, and routing every new
string through `fromCharCode` chunking, under a 127-register ceiling. That may
well make **B — extend the donor contract under its own review** the cheaper
path, and the earlier preference for A is withdrawn pending the measurement
below.

### The `normalize` measurement (AUD-03) — done in Sprint-02

The candidate's F04 accent handling depends on `String.prototype.normalize`. An
earlier revision of this section said nothing established that the pinned Hermes
0.12.0 implements it. **Measured on 2026-09-24.** The actual
`candidate/a605/matching.mjs`, with only its `export` keywords removed, was
compiled to bytecode by the pinned `hermesc` and run on the pinned Hermes VM. It
produced output byte-identical to Node for six EN/ES inputs and three
whole-request matches:

- `¡Hola!` → `hola`.
- `¿Qué es un check-in?` → `que es un check-in` (folded).
- `¡Ayúdame a elegir un paso hoy!` → `ayudame a elegir un paso hoy`.
- `Por favor, ¿qué puedes hacer?` matches `qué puedes hacer`.
- An unrelated question does not match.

A separate transcribed probe confirmed `'á'.normalize('NFD').length === 2` and
the NFC round-trip. The accent strategy therefore does not need to change for
Hermes. The A/B choice is re-stated below, from measurement.

## Sprint-02 re-verification (2026-09-24/25)

Everything in this section ran in a disposable copy (`<disposable>`) holding the
privately supplied host inputs. The tracked tree was not written to. Result files
stay outside Git, because they carry local absolute paths.

### Input kit

The private host-input kit reconciles to exactly three counts:

- **179** manifest entries, all hash-matching.
- **184** checksum-listed files: the 179 plus 5 metadata files, all `OK`.
- **185** ZIP members: the 184 plus `SHA256SUMS` itself.

The three figures count different sets and do not contradict each other.

**Four kit files arrived without their executable bit:** `hermes-runner`,
`hermesc`, `libhermes.so` and `libjsi.so`. The kit's own verifier reports this.
(An earlier revision of this page named only the runner; the independent review
of `b2a6ba8` found the other three, S2R-13.) The bits were set on copies only, and
the bytes of all four match their pins. The full 603 APK is not needed on this
path; the wrapper below uses the pinned bundle directly.

### Wrapper refactor, re-proven

`tools/host/hbc-input-wrapper.py` now exposes `build(src, bundle, out,
plans_loader=…, ui_path=…)`. By default it loads the frozen plans unchanged, so
the donor builder can reuse the identical sequence. The `require()` set is
unchanged. Re-run after the refactor, it produced `30be9989…` again, byte for
byte, with **1,936** spare UI bytes.

### Actual-host input probes (AUD-04(c), and SP2-HOST-01)

`tools/host/run-host-probe.py` works in four steps:

1. Takes the hash-verified prefix (lines 1–63, SHA-256 `839496d3…`) of the frozen
   `Solaris-Android-R4/grounding/actual-tests.js`, which builds the synthetic
   native, storage and model seams around the real `DailyService`.
2. Appends a maintained case file.
3. Transpiles the result with the frozen transpiler.
4. Runs it with the frozen runner against a pinned bundle.

Every host tool uses the guards in `tools/host/_guard.py`, added after the
independent review of `b2a6ba8` found the first versions too narrow (S2R-8):

- A disposable root or output directory inside **any** git work tree is
  refused. An earlier revision refused only the tool's own checkout.
- Every frozen file a tool executes from the disposable copy must match its
  import-manifest hash. A tampered `hbc_inline.py` is refused before it runs.
  The private toolchain under `reconstruction-work/` is not in the import
  manifest; it is pinned by the kit's own `SHA256SUMS`.
- A candidate bundle is accepted only as the recorded pair of donor hash and
  bundle hash, and only while the donor in the checkout still has that hash. A
  hand-written result record no longer suffices.
- The result files are git-ignored, since they carry local paths.

`tools/host/probes/envelope-and-input-cases.js`: 8 cases, 8 pass on each of 603
(`b8ac7d1b…`), 604 (`30be9989…`) and the donor candidate (`105ade31…`), with 0
harness errors.

| Observation on the actual host | Consequence |
| --- | --- |
| The prompt header is a fixed 315-character template. Only the `Reply in en`/`es` directive varies. | The display name is not in the header. |
| User text containing a newline and the `' /no_think'` suffix round-trips through the envelope. It is JSON-escaped. | The AUD-04 malformed-envelope throw is **not reachable from user text** on the measured paths. The frozen helper's missing guard stays recorded, but it is not a user-triggerable crash here. |
| A display name containing a newline yields a valid state and no preflight throw. | As above. |
| Very long non-BMP text throws `CONTEXT_BUDGET`. | This is the host's own named budget error. |
| **An unpaired UTF-16 surrogate in user text** makes `assertConversationAccess` throw `URIError: Malformed encodeURI input` from the `encodeURIComponent` byte budget. A full open-chat turn ends in that error with 0 model calls, 0 writes and no conversation growth. | **SP2-HOST-01, OPEN.** Identical on 603, 604 and the candidate, so it predates the grounding patch and the donor. Nothing is written, but the turn fails with an unnamed error instead of a handled one. The fix belongs in the host's budget code (for example, measuring bytes with a surrogate-safe encoder or rejecting lone surrogates with a named error). That code is not the donor, and it is not recoverable as editable source here (F01). |

### Measured budget at the two inline sites

`tools/host/measure-donor-fit.py` runs the frozen pipeline:

1. `prepare-guided.cjs` string lowering.
2. The pinned `hermesc -O -g0 -emit-binary -base-bytecode=<603>`.
3. Every `inline_donor` requirement, evaluated non-fatally for both call sites.
4. For a fit, the real `inline_donor` as a control.

| Site | Caller frame | Caller read-cache | Donor limit implied |
| --- | ---: | ---: | --- |
| 14890 `assertConversationAccess` | 20 | 12 | frame ≤ 107 |
| 14894 | 39 | 48 | **frame ≤ 88**, read-cache index ≤ 206 |

Site 14894 binds. **The shipped donor already uses 88 registers**, so the
inlined frame there is exactly 127: zero headroom. The frame is the highest
explicit register (81) plus the call area. `hermesc -O` coalesces locals, so
reusing variables does not lower it; temporaries and code shape do.

### The full candidate does not fit — measured

`tools/host/lower-candidate.cjs` produces the two measured inputs. The recipe was
uncommitted in the first revision, so the numbers could not be reproduced exactly
(S2R-13); it is committed now and records the module hashes it read.

| Input | Result |
| --- | --- |
| The six candidate modules (`matching`, `risk-screen`, `supported-surface`, `answer-boundary`, `guided-router`, `host-envelope`) concatenated as one script, `import` lines dropped, `export` keywords removed | **Rejected by the pinned `hermesc`**: `class AnswerRejected extends Error` is an invalid statement for Hermes 0.12.0. |
| The same script lowered with the kit's pinned `@babel/standalone` 7.28.5 (classes, spread, for-of, template literals, block scoping, arrows, parameters, destructuring, shorthand) | Compiles to **80 functions** (79 besides `global`) against the required 2. |

Measured on the candidate as of this revision, with the `wholeProgram` block of
`measure-donor-fit.py`, across those 79 functions:

- 9 have exception handlers, with **18 `Catch`** opcodes.
- **27 `CreateClosure`** and **14 `CreateEnvironment`**; 10 functions have a
  non-zero environment.
- **3 `CreateRegExp`** and **7 literal buffers**.
- Argument reification and `this` access.
- Read-cache indices summing to 419, against a single-function donor limit of
  206. This is indicative only.
- One string not in the base table.

The first revision reported 78, 20, 26 and 12 for the same quantities. The
candidate has changed since, and the independent reviewer's own lowering gave
slightly different figures again. None of these differences changes the
conclusion.

**Decision.** The full candidate router cannot reach the host through the frozen
donor contract. That needs either recovered native source (F01) or a separately
reviewed extension of a frozen, security-relevant inliner. Neither is attempted
here.

## Bounded donor proof

The smallest adapter that fits is built and exercised on the actual host: the
maintained donor `candidate/a605/host-donor/fast-guided.js`, SHA-256
`ab7067e6cf433e9a19e16a8df68fc439e42f9765d013e5c2de2cca078f89f667`. It is
derived from the frozen helper (`100a7ce8…`), which is not modified.

> **Revised after independent review.** The first revision (`a0224b4e…`, bundle
> `611a2430…`) was reviewed at `b2a6ba8` and returned **REQUEST CHANGES**.
> - **S2R-1:** it normalized before shipped's substring branches, so on the
>   actual host 10 of 10 messages such as `Can you tell me about my sleep? I took
>   too many pills` got a canned reply with 0 model calls, where 604 took the
>   model path.
> - **S2R-2:** it dropped 17 check-in phrasings that 604 answered from the
>   user's selected record, sending them to the model path.
>
> This page's earlier claims ("a clinical or unsupported request returns
> `null`, as in shipped 604"; "every shipped-accepted message keeping its kind
> and rendering") were therefore false. Both defects are fixed below, and the
> reviewer's cases are now host cases.

**How it works: two texts, on purpose.**

- **Shipped's own text** decides shipped 604's substring branches: activity
  history, "no records selected", and bare `help`/`ayuda`. This is the text
  lower-cased, trimmed, and stripped of trailing `!?.,`, tested with shipped's
  exact conditions *before* any normalization. Those branches therefore fire on
  exactly the messages they fired on in 604, never more.
- **The normalized text** is used only for whole-request matches, where the
  entire message must equal an accepted form, so normalization cannot hide an
  extra clause.
  - **F04:** leading and trailing `¡¿!?.,;:` are stripped; then one polite prefix
    (`can/could/would you`, `please`, `por favor`, `puedes`, `podrías`) and one
    polite suffix (`please`, `por favor`); then the edges again. `checkin` and
    `check in` are written `check-in`.
  - **F05:** the check-in reply requires the **whole** request to be an accepted
    form.
  - **SP-CHAT-03:** the app's quick-action payloads are accepted forms.

**What changes relative to shipped 604**, measured at helper level on the
reviewer's corpus plus clinical and quick-action cases, and re-checked on the host:

1. A mixed clinical and check-in request no longer gets the check-in reply. It
   takes 604's model path. This is **the check-in branch only**.
2. Whole-request forms that 604 missed now get the guided reply:
   - `¡Hola!`, `¿Qué puedes hacer?`;
   - polite wrappers around a supported form;
   - the app's two quick actions that 604 did not answer.
3. **A deliberate cost of (1):** a check-in question that 604 answered through
   its substring rule, but that is not an accepted form (for example `how did my
   check-in go`), now takes the model path, where F03 is still open. The common
   phrasings the reviewer measured are accepted forms and render exactly what
   604 renders. The trade is pinned in tests and must be accepted at the owner
   and clinician gate.

**What does not change:**

- Activity history, records-select and bare help behave exactly as in 604. That
  includes 604's **pre-existing** records-select reply to `How is my sleep? I want
  to kill myself`, which is recorded for the clinician gate and not changed by
  keyword.
- There is no escalation copy in the donor: it is clinically unreviewed, and the
  typed-fact answer boundary does not fit the donor contract.

| Measurement | Result |
| --- | --- |
| Fit (`measure-donor-fit.py`) | 2 functions, `fastGuided`, **88 registers** (inlined frame 127 at 14894, 108 at 14890), no exception handler, environment 0, no forbidden opcodes, no function-ID operands, every string in the base table. **The real frozen `inline_donor` accepted it at both sites.** |
| Build (`build-donor-candidate.py`) | The frozen `build-plans.py` is exec'd with only its donor path replaced. That line is asserted to occur exactly once, and the plans file is pinned at `7025545b…`. Every wrapper `require()` passes. Output: `candidate604.hbc`, 30,815,560 bytes, SHA-256 `105ade31744618ab37460b3b42fe4a46bafb221f91690a1f05ff6635695b279f`. Same four changed functions, 1,936 spare UI bytes. Not byte-identical to 604, by design. |
| Original 34 host cases on the candidate bundle | **34/34** |
| Original 10 lifecycle cases on the candidate bundle | **10/10** |
| Envelope and input probes (above) | **8/8**, identical to 604 |
| Donor proof, candidate bundle (`donor-proof-cases.js`, label `candidate`) | **29 cases, 74/74 expected fields match**, 0 missing, 0 harness errors |
| Donor proof, shipped 604 bundle (label `shipped-604`) | **29 cases, 69/69 match**. Shipped reproduces F05 on the actual host for `severe chest pain during my check-in?` and for a fainting-plus-check-in request. |

The expectations are pre-registered in
`tools/host/probes/donor-proof-expectations.json`:

- The review cases were written before the runs.
- In the first revision, three shipped-604 predictions were wrong: 604
  shortcuts a check-in only when the text *starts* with a question word. They
  were corrected to the observed model path, and the file says so.
- Swapping the two expectation sets produces 30 and 25 mismatches, so the oracle
  discriminates.

On the host, both bundles behave identically on the S2R-1 and S2R-11 cases, the
S2R-2 check-in phrasings and the pre-existing records-select case. They differ
on the F04, F05 and SP-CHAT-03 cases and on the one deliberate-difference case.

Helper-level regression for the same donor runs in CI:
`candidate/tests/host-donor.test.mjs` evaluates the donor file itself. It covers:

- the S2R-1 no-widening cases in both locales, and the pre-existing 604
  records-select replies;
- the 18 S2R-2 phrasings, compared by **message**, with and without a
  selection;
- the pinned deliberate differences;
- help;
- every normalization step;
- the shipped acceptance messages, compared by message.

Removing any single normalization step fails between 1 and 32 assertions. The
first-revision donor fails 92.

**Status: a desktop-Hermes candidate only.** No new A605 APK was built, and
nothing was signed, installed or measured on a phone. Packaging needs the exact
603 APK and three pinned packaging tools, and signing is separately gated (F01,
F02). See the [native inventory](NATIVE-RECOVERY-INVENTORY.md).

### Reproducing (requires the private inputs)

```
python3 tools/host/hbc-input-wrapper.py <disposable> <603 bundle> <out>             # → 30be9989…
node tools/host/lower-candidate.cjs <disposable> <new dir>                          # full-router inputs
python3 tools/host/measure-donor-fit.py --disposable-root <disposable> --base <603 bundle> \
        --donor <script.js> --out <new dir>
python3 tools/host/build-donor-candidate.py --disposable-root <disposable> --bundle <603 bundle> \
        --donor <disposable>/candidate/a605/host-donor/fast-guided.js --out <new dir>   # → 105ade31…
python3 tools/host/run-host-probe.py --disposable-root <disposable> --bundle <hbc> --out <new dir> \
        [--cases tools/host/probes/donor-proof-cases.js \
         --expect tools/host/probes/donor-proof-expectations.json --label candidate|shipped-604]
```

The disposable copy must hold this checkout's `tools/` and `candidate/`, the
unmodified frozen trees, and the private `reconstruction-work/`. None of the
directories may be inside a git work tree.

## What this is not

Desktop Hermes with synthetic native, storage and model seams is **not** Android
execution, not phone latency, and not evidence about model quality. A byte-identical
host-bundle reproduction is **not** a native source build and **not** an APK. The
historical 30–80 second phone waits are untouched by any of this.

No APK was built, signed or installed. No key, data or storage format changed.
