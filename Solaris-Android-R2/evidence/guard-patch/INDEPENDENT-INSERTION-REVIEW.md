# Independent insertion review

Reviewed against the original code601 disassembly and pinned official Hermes opcode semantics, independently of the relocation writer. This reviews the insertion plan; the root reviewer must separately review and execute the produced HBC.

## Public generator #7314

Insert at original `0x163`, after `ResumeGenerator r1,r9` at `0x15a` and its generator-return branch at `0x15d`. The original next operation reads `runtime.completion`; there is no further await before the existing call at `0x1cb`.

- `r13` already holds the parent lexical environment (`GetEnvironment` level 2 at `0x42`); slot 1 is the original service instance.
- `r7` is the original operation, initialized from parameter 1 at `0x0f` and retained at this boundary.
- Scratch `r9` held the generator-return flag consumed at `0x15d`; its next original use is a new definition by `NewObjectWithBuffer` at `0x169`.
- Scratch `r12` is newly defined by the original `GetById completion` at `0x163`; its incoming value is unused.
- Reusing those scratch registers preserves the operation, runtime (`r14`) and parent environment. `GetByIdShort` may use the already-existing `check` identifier; read cache 31 is fresh above the original maximum 30 and within UInt8.

The new method call is `service.check(operation)` with the original service receiver, not an unbound call or a new guard implementation. If it throws, the surrounding service `run` error/settlement path remains responsible, as with other pre-stream errors. The new instruction block is before the original local exception range `[0x23f,0x413)`.

## Private generator #7337

Insert at original `0x13c`, after `ResumeGenerator r1,r11` at `0x133` and generator-return branch `0x136`. The original runtime receiver is retained in `r8`; original code moves it into `r12` then reads `completion` and calls it at `0x18f` without another await.

- `r9` holds the original parent lexical environment from `0x46`; slot 1 is the existing authority predicate and slot 3 is the service instance.
- `r6` is the operation; `r7` remains the original `undefined` value used for an unbound predicate call.
- `r11` held the consumed generator-return flag; its next original use is a new definition by `GetById completion` at `0x13f`.
- `r12` is redefined by the original `Mov r12,r8` at `0x13c`; its incoming Date receiver value is dead.
- `r1` is the yielded stage result. Its only subsequent original reference is `Ret r1` at `0x408`, reachable only through the generator-return branch at `0x136`, which bypasses the inserted block. All normal continuation exits after insertion return other registers or throw. It is therefore a valid scratch value on this continuation, despite a later textual `Ret r1`.

The predicate call preserves original truthiness semantics. A false result takes a long backward branch to the existing error-construction block at original `0x54`; that block loads its own policy constructor and fully defines its construction operands, then throws `RuntimeError('CANCELLED','local')`. No new error format, string or constructor is added. On truthy authority, `service.check(operation)` executes with fresh read cache 24 above original maximum 23. No await is added before dispatch. The block remains outside the original local exception range `[0x203,0x392)`.

## Relocation requirements reviewed before implementation

Both targets have compact, non-overflowed function headers, unique body offsets and no per-function debug information. Each has one exception table. Appending replacement bodies instead of overwriting the old bytes preserves any potential unrelated aliases; the writer must still assert the observed unique aliases for these pinned targets.

All relative branch operands, including `SaveGenerator`, must retain their original instruction-boundary targets after insertion; crossing instructions may need opcode-width expansion or a fail-closed rejection. Existing exception start/end/handler offsets must map through the same relocation. The new private false branch must land exactly at the existing `0x54` instruction after relocation. Cache maxima must be raised, while frame size, environment size, parameters, flags, function count, strings, literal tables and all untouched function metadata remain unchanged.

The artifact gate requires byte comparisons and real-VM tests on the patched HBC. This plan review alone is not compatibility approval. It also does not fix worker resume/admission reconciliation; a truthful candidate must retain that limitation.
