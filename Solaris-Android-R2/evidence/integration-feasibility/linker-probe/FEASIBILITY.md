# HBC96 bounded integration feasibility

Scope: local read-only inspection of pinned official Hermes source and original code601 bytecode, plus independently authored synthetic fixtures. No reference APK or original bytecode changed by this probe.

## Concrete preferred route for the two confirmed guard gaps

Append expanded replacements of existing functions 7314 and 7337 after the unchanged legacy debug block, immediately before a new footer. Redirect those two existing function headers to the appended bodies and new exception metadata. Preserve every function ID, string ID, literal buffer, closure environment layout, native APK entry, old function body and old debug byte.

The official runtime provider follows absolute function-header offsets and explicit debug-section lengths. It does not require a function body to precede the debug section. `narrow_probe.py` proves this on an independently authored synthetic HBC96 fixture using the pinned official VM. The appended function executes a new conditional guard; its original exception handler still catches the legacy error. Original bytes change only at fileLength and one compact function header, plus the replaced SHA1 footer.

For the actual inspected target functions:

| Function | Original body bytes | Insertion | Existing exception region | Debug info | Body aliases |
| --- | ---: | ---: | --- | --- | --- |
| 7314, public completion | 1,150 | 0x163 | (575, 1043, 1118) | None | Only itself |
| 7337, private completion | 1,037 | 0x13c | (515, 914, 1001) | None | Only itself |

Neither target contains `SwitchImm`. Both existing compact headers and the enlarged bodies fit all compact-header fields. Original file length is 30,744,132 bytes, below the 33,554,432-byte compact offset limit. Both exception regions start after the insertion, so their start/end/target positions shift uniformly. The two original forward branches crossing each insertion are long forms; later branches shift source and destination together. `SaveGenerator` operands still require systematic relocation validation even where their final values are unchanged.

The bounded implementation is `Solaris-Android-R2/tools/patch-completion-guards.py`. It accepts only the exact verified original SHA256 and metadata, writes a separate `.hbc`, appends only the two bodies and exception tables, and verifies byte preservation of the entire old span outside fileLength and the two header slots. This is a binary repair with editable repair code and auditable inputs, not a claim that the full lost application source has been recreated. Independent insertion/register review and official-VM tests remain necessary before any APK candidate decision.

## A broader donor module route is finite, but unnecessary here

The official compiler's `-base-bytecode` mode seeds the string accumulator from the original provider. This preserves old string IDs and appends new strings; it does **not** import the old functions. Relevant pinned source locations:

- `lib/BCGen/HBC/HBC.cpp`: `stringAccumulatorFromBCProvider`, and base-provider handling in `generateBytecodeModule`.
- `lib/BCGen/HBC/ConsecutiveStringStorage.cpp`: delta-mode string retention and packing.
- `include/hermes/BCGen/HBC/Bytecode.h`: full `BytecodeModule` and `BytecodeFunction` constructors support opcode vectors, all tables, flags and exception metadata.
- `lib/BCGen/HBC/BytecodeStream.cpp`: official serializer emits function headers, all tables, bodies, exception/debug metadata and SHA1 footer; it deduplicates identical bodies under optimization.
- `include/hermes/BCGen/HBC/BytecodeFileFormat.h`: exact header layouts, table order, offset widths and footer.

No turnkey official bytecode linker/import command was found in these facilities. A custom importer could reconstruct a `BytecodeModule` from a provider and use the official serializer, or preserve legacy byte regions and append mapped donor bodies with a narrowly validated writer.

`probe.py` demonstrates a smaller version of the latter on synthetic fixtures. Donor code is compiled with original strings as its base; donor functions are appended with function-ID operands remapped; one original global closure operand is redirected. A donor nested closure captures its new parent's local variables correctly. The original non-global bodies, old exception tables and old debug section remain unchanged. The official VM produces `patched:16` while retaining legacy normal and exception behavior.

### Requirements for a general importer

1. **Closure environments:** transplant a self-contained root factory and its reachable nested closures. The imported root must not refer to a donor-only parent environment. Matching function names or argument counts cannot prove this. Preserve nested environment slot counts, ancestry and all generator/async closure operands.
2. **Function references:** remap every operand marked as function ID by the pinned opcode definition, including direct calls, normal/async/generator closures and generator creation. Widen instructions if IDs overflow their operand width, then iteratively relocate branches. The synthetic probe rejects widening instead.
3. **Strings:** preserve original IDs and kinds; verify the donor's base-derived string prefix, identifier hashes, UTF16 flags/storage, overflow entries and the final table. Do not assume the presence of `-base-bytecode` alone proves this.
4. **Serialized literals:** retain legacy buffers exactly. Donor array/object key/object value offsets must be rebased, including string IDs inside serialized values if string preservation was not established. Literal buffers may overlap because of substring deduplication; a naive sequential parse is unsafe. Offset-width overflow may require long opcode forms and another relocation pass.
5. **Regexp and BigInt:** append tables and raw storage, rebase storage offsets and all bytecode indexes, and preserve pattern/flag string references. Regex opcode compatibility must match HBC96.
6. **Exception tables:** remap half-open protected regions and handler targets using exact instruction-boundary maps. Newly inserted code needs an explicit decision about protected-region membership.
7. **Switch tables:** `SwitchImm` uses separately aligned jump tables adjacent to bytecode. Reconstruct their extent, table placement, table operand and destination offsets. Moving bodies by nonmultiples of four without regenerating alignment is unsafe.
8. **Body deduplication:** several function IDs may alias the same opcode offset. A targeted change must redirect only its intended header or all explicitly intended aliases. Preserve each alias's independent function metadata. Never mutate a shared physical body blindly.
9. **Legacy metadata:** retain global index, segment ID, options/static-builtins flags, CJS tables, function-source tables, string kinds/hashes/overflow, literal storage, exception records, large headers, debug offsets, debug filenames/regions/data and any epilogue according to an explicit compatibility contract. SourceHash provenance must be documented after a binary repair.
10. **Verification:** validate the footer and exact input hash first; prove all untouched legacy bytes/tables/IDs remain fixed, parse every changed body independently, validate branches and metadata, run the pinned VM against differential behavior cases, and only then assess APK packaging/signature compatibility.

The general donor probe rejects array/object literals, regex, BigInt, CJS/source tables, switch tables, large function headers, operand widening and aliased modified bodies. Its successful result is evidence of a viable mechanism, not production readiness of a general-purpose linker. The narrow two-function repair avoids those donor-import obligations entirely.

## Local artifacts

- `probe.py`, `host.js`, `donor.js`, `result.json`: synthetic donor append/remap proof and full compiler/VM commands.
- `narrow_probe.py`, `narrow-result.json`: synthetic existing-function append-after-debug proof and full commands.
- Generated `.hbc` fixtures in this directory contain only independently authored toy code.

Pinned official source: `reconstruction-work/r2-tools/hermes-hermes-2025-07-07-RNv0.81.0-e0fc67142ec0763c6b6153ca2bf96df815539782`.
