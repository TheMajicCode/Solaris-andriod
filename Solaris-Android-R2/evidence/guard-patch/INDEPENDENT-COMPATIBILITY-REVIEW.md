# Independent two-guard compatibility review

Date: 2026-09-15. Reviewer: compatibility-audit agent, supported by a separate read-only instruction/relocation reviewer and separate read-only behavioral-harness reviewer. The writer and implementation author did not perform this independent review. No app implementation, bytecode, APK, key or device data was modified by these reviewers.

**Structural and instruction-semantic PASS for the exact analysis HBC below.** Behavioral acceptance is recorded in the final addendum. This report concerns two additional synchronous admission checks before completion dispatch. It is not a full Android source reconstruction, general LUCA lifecycle repair or whole-APK release approval.

## Exact inputs

| Artifact | SHA-256 |
|---|---|
| Original code601 HBC | `ac973292961cc7a1505a47a416ecafdff2e1688b7eac31f20571e503d74ec177` |
| Bytecode writer | `498e34875eb04aedf33e0bec4c90ed4005abb5fa7b1c6ba85411dc4bd5cc86a2` |
| Editable semantic specification | `fb4ee1a4c1ad86dd54d4700005a898fcfa86633d578fa216fe5b1eb629699ee0` |
| Resulting analysis HBC | `fd8b38bcdd42421c18da4a0b69b2d58906ceddd7c4a2044b34faed51490f4653` |

The writer pins the original SHA-256 and length, HBC96 header/ABI, footer, target offsets/sizes/frames/environments/caches/EH metadata, original string identity, unique target body ownership and instruction boundaries. It rejects unsupported switch tables and branch-width overflow, instead of guessing new encodings. The command refuses original overwrite, existing destinations, APK destinations and destinations under the recovered reference subtree. Review of this actual writer and artifact found no unbounded code selection or replacement.

## Preservation established independently

The secondary instruction reviewer decoded the original and produced HBC directly and reproduced the writer result in memory, without writing another artifact. All 15,511 nontarget function headers and referenced bodies remain unchanged. All 528 original target instructions are retained: 524 are byte-identical, and four differ only in the necessary relative branch displacement. All original destinations, including `SaveGenerator` continuations, retain their intended instruction boundaries.

Exactly 18 differing bytes occur within the original non-footer byte span. They are confined to file length and the two target compact function headers. The retained original bodies, string/literal tables, environment layout, function IDs, debug bytes, old exception records and unrelated byte ranges remain byte-identical. Appended bodies/tables precede a valid replacement SHA-1 footer. Original and resulting footer hashes both verify. Header sourceHash is retained as legacy input provenance; it must not be represented as a new full-source-build identity.

| Function | Insertion | Added instructions / bytes | Original EH | Relocated EH |
|---|---|---|---|---|
| Public generator #7314 | `0x163` | 3 / 14 | `(575,1043,1118)` | `(589,1057,1132)` |
| Private generator #7337 | `0x13c` | 6 / 28 | `(515,914,1001)` | `(543,942,1029)` |

The appended body and exception-table offsets, four-byte exception-table alignment and new lengths verify. Read-cache maxima increase from 30 to 31 and from 23 to 24; frame sizes remain 33 and 30. No parameter count, environment size, write cache, function flag or other protected header field changes. Guards remain outside their original local exception ranges, so the existing outer `run` settlement path receives their errors.

## Register, receiver and branch semantics

Public #7314 inserts `LoadFromEnvironment r9,r13,1; GetByIdShort r12,r9,31,73; Call2 r12,r12,r9,r7`. At the resumed continuation, `r13` is the parent environment, its slot1 is the original service and `r7` is the original operation. This invokes the existing `service.check(operation)` with its service receiver. The live runtime receiver `r14` remains intact. Scratch registers r9 and r12 are overwritten before their next original read.

Private #7337 loads the existing authority predicate from parent environment r9/slot1, calls it using the original undefined receiver in r7, and branches on JavaScript falsey semantics to the existing cancellation block at `0x54`. Its new branch originates at `0x144` with displacement −240. That original block initializes all constructor operands and throws the original `RuntimeError('CANCELLED','local')`. On truthy authority, the inserted call uses service r11 loaded from environment slot3 and original operation r6. The original runtime r8 remains intact. Scratch r11/r12 are dead until their next original definitions; r1's later textual `Ret` belongs exclusively to the pre-insertion generator-return branch and cannot read the inserted predicate result on normal continuation.

The pinned official Hermes interpreter's `Call1`/`Call2` conventions confirm receiver and argument positions. Callee/destination register aliasing is consistent with original call encodings. The inserted instructions add no await or yield. The existing `check` function #7168 throws `CANCELLED` using the current phase when the operation is cancelled or service inactive; it does not introduce a new policy implementation. Private predicate evaluation increases by one for each invocation reaching this boundary, which is intentional and must be stated when describing behavior preservation.

The patch closes only the demonstrated post-stage/pre-completion gaps. It does not reconcile SDK/worker resume state, repair deferred `step` scheduling, guarantee arbitrary predicate purity or account for every native event delivery. No vault/recovery/model implementation is rewritten by this HBC patch. Byte preservation establishes that limited fact, not tested end-to-end vault compatibility.

## Targeted test evidence reviewed

The writer's retained eight negative checks cover unverified/modified input, forward/backward short-branch overflow, original overwrite, APK output, recovered-reference output and an existing output. They passed and record the original input unchanged. This reviewer inspected those results and the fail-closed code; the independent in-memory reproduction and direct structural check above provide the separate positive artifact validation. The pinned official `hbcdump` also accepted and disassembled the targets; actual-VM behavioral tests below are stronger evidence than the third-party parser alone.

## Release boundary

No material defect was found in this exact structural/instruction change. Do not extrapolate this approval to an APK with other entry changes. Any candidate package still needs independent manifest/version/entry comparison, signer verification against the original certificate, packaging integrity/alignment checks and clear documentation of untested Android runtime behavior. No installation, data reset, key change, push or deployment is authorized by this review.


## Final behavioral addendum and bounded approval

**PASS after final harness hardening.** The independent reviewer executed all three final commands: the original-HBC 24-case/four-witness comparison, the patched-HBC 24-case/four-witness comparison, and `python3 Solaris-Android-R2/tools/test-completion-guards.py`. The final 17-case run completed with exit 0; both actual-HBC subprocesses produced one complete JSON object with empty stderr. The retained independent result is `INDEPENDENT-BEHAVIORAL-RERUN.json`, copied immediately after that run. The two 24-case reruns are retained under `evidence/reviewer-oracle-reruns/` and bound in `HERMES-ORACLE-REVIEW.md`.

The 17-case harness uses separate original and patched processes/VMs and fresh captured factory591 instances. It runs the actual original and patched completion generators. Shared fixture extraction retains the source-variant branch as unused text, but these probes call only the bytecode branch and never replace original prototype methods with reconstructed methods. The final wrapper requires all 17 unique expected names before dictionary conversion, closing the earlier duplicate/missing-case weakness.

Five cases demonstrate exactly one original dispatch with a forbidden condition already present (public background/cancelled; private revoked/background/cancelled), then zero patched dispatches with the expected `CANCELLED` code/stage. The final gate also checks no tokens, empty output and null receipt on every patched denial, plus retained model identity, cleared current operation and zero synthetic timers. Independent inspection of the retained denial outputs additionally confirmed failed `CANCELLED` inference.

Twelve controls preserve the entire recorded result dictionary except predicate-call counts: public/private success, truthy-object private eligibility, initially denied authority, both not-ready cases, both empty completions, both synchronous SDK failures, and both repeated-success cases. Comparison includes returned values, completion arguments, traces, tokens, selected service state, output, receipt, inference and timer count. Successful private operations require exactly one additional predicate evaluation per invocation; existing private output does not invoke the public token callback. Other private controls also show the single additional predicate check only when reaching the new boundary. The wrapper excludes predicate counts for these nonsuccess controls, so that latter detail is current-output evidence rather than a generic future assertion.

The current recorded normal paths preserve their observed behavior. This is bounded synthetic compatibility evidence: fixed time, non-firing timers, immediate synthetic events and synthetic runtime/policy dependencies do not establish arbitrary predicate side effects, delayed stream schedules, real timeout duration, native inference or Android lifecycle ordering. Earlier incorrect expectations about private token callbacks and empty completion error names were corrected against the original bytecode result; the implementation was not changed to satisfy those expectations.

| Final reviewed artifact | SHA-256 |
|---|---|
| Behavioral gate | `40636ec26adcce34d844f5901e754fda3dfa128cff9ecc0cc74f7d4ed9f624fc` |
| Completion probes | `dc575e4ebb547c312b0111cdc059d9ae61f9eecacf4c34af8b5dc56b5ab44e79` |
| Shared fixture source | `f3e370d994b9636b6530fe2cc711cbed413fd54c96cbb48b6cd4f73b607aaa5d` |
| Independent behavioral result | `1f8a8ab1e31f83db538dab2eb6dec50160ac5b1f60bbb54e97f438185aa8b2dd` |
| Candidate scope | `c2adc299b6c97afc050ee60a9452edaaf884562c263ffa077d0ced6d23f5df11` |

`docs/CANDIDATE-SCOPE-602.md` accurately limits the candidate to these two guards, retains full lifecycle/step repairs as pending, and identifies missing full native/app source and runtime coverage. Its compatibility claims match this evidence when read with its stated synthetic-test limits.

**Approval scope:** the exact `fd8b38bc…4653` HBC passes independent structural, instruction and targeted actual-VM compatibility review for the described 602 guards. No code blocker remains within that narrow scope. Packaging/signer/version/entry integrity gates remain separate and must pass before a signed candidate. This report does not approve an APK hash, installation or a claim that all Solaris/LUCA functionality has been runtime-tested.
