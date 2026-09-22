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
| `frame < 128` registers | unmeasured |

**This changes the recommendation.** "Express the supported surface as one
function" is not a flattening exercise. It additionally requires eliminating
exceptions as control flow, all regex, all literal buffers, and routing every new
string through `fromCharCode` chunking, under a 127-register ceiling. That may
well make **B — extend the donor contract under its own review** the cheaper
path, and the earlier preference for A is withdrawn pending the measurement
below.

### One measurement required before choosing

The candidate's entire F04 accent handling depends on
`String.prototype.normalize('NFD')`. **Nothing in this repository establishes
that the pinned Hermes 0.12.0 implements `normalize` correctly for the Spanish
diacritics involved**, and it must not be assumed. Probe `foldAccents('¿Qué?')`
and `'á'.normalize('NFD').length` under the pinned runtime, then re-state the A/B
choice. If `normalize` is absent or wrong, the accent strategy changes regardless
of which donor path is taken.

## What this is not

Desktop Hermes with synthetic native, storage and model seams is **not** Android
execution, not phone latency, and not evidence about model quality. A byte-identical
host-bundle reproduction is **not** a native source build and **not** an APK. The
historical 30–80 second phone waits are untouched by any of this.

No APK was built, signed or installed. No key, data or storage format changed.
