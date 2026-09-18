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

Two independent constraints were measured, not assumed:

1. **Hermes 0.12.0 rejects ES6 `class`.** `class AnswerRejected extends Error`
   fails to compile: *"invalid statement encountered"*. The probe lowered it to a
   function to measure the next constraint.
2. **Function count.** The candidate compiles to 26 functions against a contract
   that asserts exactly 2, and its function 1 is the bundle IIFE rather than
   `fastGuided`. Every helper and arrow function becomes its own HBC function.

**The candidate cannot be integrated through the existing donor path as written.**
No assertion was disabled, no `eval` introduced, no patch surface widened and no
permission check removed to force a fit — the plan prohibits all four, and doing
any of them would make the result meaningless.

### The two honest paths forward

| Path | What it costs | What it preserves |
| --- | --- | --- |
| **A. Single-function rewrite.** Express the whole supported surface as one function with no inner closures, matching the shape the donor contract expects. | A substantial rewrite of five modules into one function; readability and the current module tests would need rework. | The frozen builder, its assertions and the reviewed patch surface, all untouched. |
| **B. Extend the donor contract** to accept a multi-function donor. | `build-plans.py` is frozen; changing it needs its own review, and `inline_donor` inlines a single function body. | The candidate's structure and tests. |

**A is the smaller and safer change** and does not touch frozen builders. Neither
path is attempted here: this milestone was to prove fit, and the measured answer
is that it does not fit yet.

## What this is not

Desktop Hermes with synthetic native, storage and model seams is **not** Android
execution, not phone latency, and not evidence about model quality. A byte-identical
host-bundle reproduction is **not** a native source build and **not** an APK. The
historical 30–80 second phone waits are untouched by any of this.

No APK was built, signed or installed. No key, data or storage format changed.
