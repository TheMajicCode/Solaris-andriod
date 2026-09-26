# Build 603 HBC API and integration independent review

**PASS — bounded writer/inliner and exact candidate-06 integration scope.** Reviewed 2026-09-16 by `ui_review_603`, independently of the implementation authors (`hbc_integration` and root). The reviewer did not edit implementation. This review is bound to candidate HBC SHA-256 **b8ac7d1b58d9e8ea6eadd25de516e35842aea14e4b849462664bb3200fedc990**, 30,754,484 bytes, and the source/tool hashes below.

No unresolved material issue was found in this scope after the corrections below. This is not APK packaging/signing approval or a claim of on-device functionality.

## Review findings corrected before PASS

1. Branch and exception-handler targets could previously equal the function's bytecode length. The writer now distinguishes instruction starts from end-capable range boundaries: only exclusive try-end bounds may equal EOF. Original/donor branches to EOF and patched branches/handler targets to EOF are rejected. Negative regressions cover the latter two cases.
2. An operand could fit Reg8 encoding but exceed the actual function frame (for example register 100 in a frame of 39). Every patched Reg8/Reg32 operand is now checked against the resulting frame size. The corresponding malformed-plan regression is rejected.

The author also added an explicit positive forward/backward short-branch widening regression. Both destinations remain exact after conversion from Addr8 to Addr32.

## API assessment

- The production append writer requires the exact verified 602 input hash `fd8b38bcdd42421c18da4a0b69b2d58906ceddd7c4a2044b34faed51490f4653`, length 30,746,396, valid HBC96 length and footer SHA-1. It appends replacement bodies and aligned exception tables, and changes only selected compact function headers and fileLength in the original region. Original tables, function IDs, string IDs and debug bytes remain fixed.
- Edits must use original instruction boundaries, with no overlapping edits or duplicate labels. Relative control flow is recalculated against labels; widening accepts only the matching long opcode with identical non-address operand types. Deleted referenced boundaries fail closed. Exception starts/ends/targets are relocated and reparsed; nonempty ordered ranges and executable handler targets are required.
- The inliner rejects lexical environments, closures, imported function IDs, unsupported literal buffers, regexp/bigint tables, switch tables, generators, eval and unmapped parameters. Used string IDs must already match the baseline's value and kind. This imports one helper body, not a function/table graph.
- Helper registers occupy a suffix outside the original frame. Parameter loads copy from explicit original caller registers; returns copy to the designated caller register then jump to the original continuation. Property read/write caches use distinct suffix indices. Resulting register and cache limits were independently checked on the actual candidate.
- Enlarging a caller frame moves its implicit outgoing call area. The implementation copies the original Call/Construct/CallDirect/CallBuiltin argument area to the new tail immediately before each original implicit call. Argument count includes `this`; higher registers are copied first to avoid overlap corruption. The exact Hermes Interpreter/StackFrame evidence and bytecode operand definitions support the count and frame-relative conventions. Shifted donor frames retain their own tail-relative call placement; explicit Call1–Call4 register operands are shifted normally.
- F14894's diagnostic insertion follows the original epoch, authority/predicate and cancellation tests. It compares exact finite codes and constructs a new Error from a matching known code. Arbitrary Error.message/non-Error values continue to the existing generic fallback. The original cleanup exception region remains in force. Cache index 6 is reused for the same global Error lookup already present at the insertion point.

These structural checks are not a general proof of arbitrary edit semantics. Every new helper or insertion still needs its own behavioral review and execution tests.

## Actual candidate integration

Independent decoding and byte comparison found exactly three changed function headers: **7337, 14886, 14894**. Exactly one string value changes: HTML string **12364**, using the previously reviewed UI. All other original bytes are identical except fileLength and the three headers. No table or function linking occurred.

| Function | Insertion and live bindings | Final frame / body bytes |
| --- | --- | --- |
| F7337 | At old offset 427, request in r8; completion function/receiver remain r11/r12. The original outer environment r9 slot 2 supplies the conversation flag through dead r13. Helper result returns to r8 before the original Call2. | 90 / 3,713 |
| F14886 | At old offset 566 after compileConversation returns task in r3. Dead r5/r6 load the original owner/state parameters; r2 sources remains intact. Helper result returns to r3 before the original return-object construction. | 76 / 1,943 |
| F14894 | At old offset 1484, after authority and cancellation precedence checks; allowlisted diagnostic matching is on the throw-only path. | 39 / 2,336 |

The conversation flag provenance is confirmed by original F7334 storing its third argument in environment slot 2; completeConversationTask passes true and completeLocalTask passes false.

I independently compared every original opcode/operand against its relocated original instruction, allowing only matching branch widening and the recorded target relocation. **All 260 original instructions in F7337, 131 in F14886 and 387 in F14894 are retained semantically.** This includes the existing 602 cancellation/eligibility dispatch guards. The untouched public F7314 body/header remains byte-identical. Original implicit-call fixups occur at F7337 offsets 117, 185, 501, 584, 642, 705, 805 and F14886 offsets 95, 385.

All actual candidate branches target instruction starts; all exception targets are instruction starts and try ranges are valid. All register operands fit their frames. Actual read/write cache maxima equal or remain below the recorded header limits (F7337: 43/33, F14886: 64/7, F14894: 48/2). HTML fits its original non-overlapping UTF-16LE slot and uses the independently reviewed compact UI hash `41df124a23b47964e949189678d3c59a9cb788a05c766ffcf289539acca71f1d`.

## Final response-length guard delta

The final F7337 delta inserts one guard at original offset **652**, after the existing post-await eligibility check and before accepting the buffered conversation output. The resolved final SDK object is in r2; the original outer environment r9 slot 2 identifies conversation mode. Nonconversation calls skip the new test. Missing stopReason and ordinary success retain their existing behavior. Only explicit `stopReason === 'length'` in conversation mode is rejected as `OUTPUT_LIMIT`.

The throw uses the original policy module's **RuntimeError** constructor (outer environment r11 slot 12), with code OUTPUT_LIMIT and stage local. CreateThis/Construct/SelectObject mirrors the established constructor pattern. Its implicit arguments use the enlarged frame's correct tail registers **83, 82, 81**; no new cache index is needed. This preserves the code through the existing error normalization. The initial plain-Error draft was superseded before this final approval.

The final UI adds the matching safe OUTPUT_LIMIT message; its separate review has been refreshed to the compact hash above. I independently confirmed the final delta leaves F14886/F14894 body bytes unchanged from the earlier approved implementation and reran the full immutable-region, register/cache, branch/EH, and original-opcode comparisons against exact 602. All 260/131/387 original instructions, including 602 admission guards, remain preserved. The final HBC was independently rebuilt byte for byte in a fresh temporary directory.

## Independently rerun verification

```sh
python3 Solaris-Android-R3/evidence/integration/test-writer-failclosed.py
python3 Solaris-Android-R3/evidence/integration/test-inline-failclosed.py
python3 Solaris-Android-R3/evidence/integration/test-inline-vm.py
```

Results: **20 writer checks passed; 8 unsupported-donor/frame cases were rejected as expected.** The matching actual Hermes VM synthetic fixture produced original outputs `34`, `62` and inlined outputs `43`, `71`, proving the exercised original/donor constructors, generic argument lists, explicit calls and return continuation retain their intended behavior after frame growth.

I independently reran the recorded final-candidate actual-Hermes Qvac fixture command: **24 cases passed** on HBC `b8ac7d1b58d9e8ea6eadd25de516e35842aea14e4b849462664bb3200fedc990`. The added cases reject even parseable text when explicitly length-terminated, preserve nonconversation behavior, and retain cancellation priority after content but before final completion for revocation, backgrounding and cancellation. Missing-stopReason success and earlier request/stream/cleanup/admission cases also pass. Native SDK/model/timers are synthetic in this fixture; it is not an on-phone inference test.

I also ran `tools/build-chat-bundle.py` from the verified 602 APK into a fresh temporary directory, using the corrected validators. It independently reproduced candidate-06 **byte for byte** with the hash above. The temporary verification output was removed; no APK was built or signed by this review.

## Limits and remaining gates

This review covers the transformation APIs, diagnostic insertion and exact helper placement/integration. It does not replace the separate source-level review of chat/history policy, actual Solaris permission/parser/persistence tests, native model inference tests, final APK payload/signature/alignment verification or phone validation. Original sourceHash/debug provenance remains legacy metadata because this is a partial binary-preserving reconstruction.

## Exact reviewed files

Paths are relative to `Solaris-Android-R3`.

| File | SHA-256 |
| --- | --- |
| `tools/hbc_patch.py` | `dafa136710d797e00dc01b7e7da465bc6fc04805c2bc2cddd20e855dbe37e7f4` |
| `tools/hbc_inline.py` | `0014f1b6174b6a4274b5090c9078d8a0b8526506c551383ae427f8aeb9102a89` |
| `tools/hbc-chat-diagnostics.py` | `9bb5d74ab204320f06e36cfa41388abf3d92143567f7e84e469e0d768bd9f2c1` |
| `tools/build-chat-bundle.py` | `60c6e3792188d8690a17b622a27c4ea86a15331662ea44326e133c9784ba5962` |
| `tools/prepare-donor.cjs` | `281b1b3eb75d143242dc0ee16842bb75093ee08c85a14861948b52307b143ab8` |
| `src/conversation-request.js` | `33f7e34b75c5e0b15bc7af32df1b2084c483792549be2295f73e7b8e32af6042` |
| `src/recent-context.js` | `3cf38b597e3627f7316a60b7b30ca69cebbb699f5877e153f191f806d1875455` |
| `evidence/integration/test-writer-failclosed.py` | `10a796667f765bf6e8731b7dc48e5015893490cabc90f01ac40f4aa1f8a7d765` |
| `evidence/integration/test-inline-failclosed.py` | `a993b0bfd2854c3125c823533e553885a0abb66ffc2494d9125fb83880828538` |
| `evidence/integration/test-inline-vm.py` | `863bf6f0d99bf1149b63c0bdd65f8d66dd84ad44d22d53c1a11bf59ef2797780` |
| `evidence/integration/writer-failclosed-result.json` | `b06c46dd653883b767f22877cf1b785aaccc6bf8a7256e903ebdf4fa453d1276` |
| `evidence/integration/inline-failclosed-result.json` | `9c04ac1e4596854c7ba3eb95ab7f795ab249bdd72a90ea733d89ebfdae8dfc9f` |
| `evidence/integration/inline-vm-result.json` | `6d7408febfe527e4c0cb80228a58aa6119af9ae54625d94d479d67cacf90962b` |
| `evidence/candidate-06/BUNDLE-RESULT.json` | `3b4bbd4267f738b3372872d8e5eabd8341d0cd80de2396d538e11d39f21246a2` |
| `evidence/candidate-06/candidate603.hbc` | `b8ac7d1b58d9e8ea6eadd25de516e35842aea14e4b849462664bb3200fedc990` |
| `tests/qvac-postlude.js` | `46d5916a7df7b1353772d188e2ac18d6b16d84b095eead7713f082ac7ef26bce` |
| `evidence/qvac-final-candidate06/result.json` | `41080c6359d03ca127d61188c16172966b1027e51a3928a73f3df2eec6c05333` |
| `evidence/qvac-final-candidate06/provenance.json` | `4c7c0103ab96f4ca00a8f610017f78d5f2b07675bf24051f9c95c67bebf65e9b` |
