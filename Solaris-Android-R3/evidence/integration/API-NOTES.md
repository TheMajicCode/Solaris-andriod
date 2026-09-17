# Build603 bounded HBC integration API

The production writer accepts only the verified602 bundle SHA-256 `fd8b38bcdd42421c18da4a0b69b2d58906ceddd7c4a2044b34faed51490f4653` (30,746,396 bytes).

`tools/hbc_patch.py` reads that baseline, rewrites reviewed function bodies from instruction-boundary edits, resolves relative labels and widens short branches only to the matching Long opcode. It appends new bodies/exception records, updates only their original compact function headers plus `fileLength`, and recomputes the HBC footer. It proves every other original byte unchanged. Existing functions, string contents/IDs, literal tables, native library interfaces, debug bytes and both602 guards remain in their original regions. Modified functions may retain legacy sourceHash because this remains a partial binary-preserving reconstruction.

`tools/hbc_inline.py` imports no function IDs or table entries. It takes one compiler-produced helper with no lexical environment or exception table. Each used string operand must already have the same ID, value and kind in602. It rejects new closures, function references, eval, regexp/bigint, literal buffers, generators and switch tables. Helper parameters are explicitly mapped to caller registers. Helper temporaries occupy a new suffix of the caller frame. Returns copy to the designated old caller register and branch to the original continuation. Property-cache indices occupy a distinct suffix.

Generic Call/Construct instructions use argument registers at the end of the caller frame. Growing a frame would otherwise break original calls. The inliner therefore returns additional edits copying each original implicit-call argument (including `this`) from the old frame tail to the new tail immediately before that call. Donor generic calls already have the correct placement because donor registers shift by exactly the frame suffix offset. This rule was checked against the exact Hermes2025-07-07/RN0.81 Interpreter implementation and exercised with the actual matching `hvm` binary.

The helper's code is compiled with `hermesc -O -g0 -emit-binary -base-bytecode=<602>`. New readable source string constants can be lowered at build time to bounded `String.fromCharCode` calls; that is ordinary ahead-of-time compiled bytecode, not eval or source injection at runtime. The transformed source must be equivalence-tested and the resulting actual helper executed in Hermes.

Exception-boundary semantics: an insertion owns the old boundary label. Existing jumps to that point execute the new code. A try start at that point includes the insertion; a try end excludes it. Deleted internal branch/exception boundaries are rejected unless explicitly remapped. A helper Throw has normal caller exception behavior at its insertion point.

Concrete reviewed insertion contexts:

- F7337 / code602 offset427 (`0x1ab`): before completion Call2. `r8` holds request, `r11` completion function, `r12` receiver. `r9` holds known outer environment. Load its slot2 into dead `r13` for the conversation-mode flag. Map helper params `{1:8,2:13}`, return to8. Original frame30. Existing cancellation guards remain earlier instructions.
- F14886 / offset566 (`0x236`): after compileConversation returns task in `r3`. Load caller `this` into dead5 and original param1 state into dead6. Map helper `{1:3,2:5,3:6}`, return to3. Preserve `r2` sources. Original frame23. Required original implicit call fixups are Set constructor at95 and Date constructor at385.
- F14894 / offset1484: diagnostic whitelist inserted after original epoch/predicate/cancellation checks. Only known finite error code strings are propagated as a newly constructed Error. Arbitrary raw/model/patient error text retains the old generic fallback. All throws still traverse original cleanup.

Verification evidence: `inline-vm-result.json` proves synthetic original and donor constructors, six-argument generic calls, explicit calls and return continuation under matching Hermes; `writer-failclosed-result.json` passes16 checks including identity, malformed plans, branch/header tampering and preservation of602 guard bodies. These are integration-tool proofs, not a substitute for actual Solaris request-path, permission, parser and native generation tests.

No APK is packaged, signed, installed, pushed or deployed by these tools.
