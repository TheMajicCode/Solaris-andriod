#!/usr/bin/env python3
"""Append two bounded HBC96 completion-guard repairs to an ANALYSIS COPY.

This is NOT an APK builder or signer. Exact code601 input SHA256 is mandatory.
Existing bytecode bodies, global tables, function IDs, lexical environments,
debug bytes and exception records remain in place. Only two compact function
headers plus fileLength/footer change in the original byte span. New function
bodies and relocated exception tables are appended before a new SHA1 footer.
"""
from pathlib import Path
from io import BytesIO
import argparse
import ctypes
import hashlib
import json
import struct
import sys

ROOT = Path(__file__).resolve().parents[2]
PARSER = ROOT / 'reconstruction-work/toolchain/hermes-dec-a0f18f97ab661eb8ed659c8c683a0d21ea619e69/src'
sys.path.insert(0, str(PARSER))
from hermes_dec.parsers.hbc_file_parser import HBCReader
from hermes_dec.parsers.hbc_bytecode_parser import parse_hbc_bytecode

EXPECTED_SHA256 = 'ac973292961cc7a1505a47a416ecafdff2e1688b7eac31f20571e503d74ec177'
EXPECTED_LENGTH = 30744132
TARGETS = {
    7314: dict(offset=29560571, bytecodeSizeInBytes=1150, infoOffset=30729532,
               frameSize=33, environmentSize=10, highestReadCacheIndex=30,
               highestWriteCacheIndex=9, insertion=0x163,
               exceptions=[(575, 1043, 1118)]),
    7337: dict(offset=29563214, bytecodeSizeInBytes=1037, infoOffset=30729636,
               frameSize=30, environmentSize=11, highestReadCacheIndex=23,
               highestWriteCacheIndex=6, insertion=0x13c,
               exceptions=[(515, 914, 1001)]),
}

def require(ok, message):
    if not ok:
        raise ValueError(message)

def sha256(data):
    return hashlib.sha256(data).hexdigest()

def read_hbc(data):
    require(len(data) > 148, 'Input is too short.')
    require(hashlib.sha1(data[:-20]).digest() == data[-20:], 'Invalid HBC footer SHA1.')
    r = HBCReader()
    r.read_whole_file(BytesIO(data))
    require(r.header.version == 96, 'Only exact HBC96 is supported.')
    require(r.header.fileLength == len(data), 'Trailing epilogue is outside scope.')
    require(ctypes.sizeof(r.get_small_func_header_reader()) == 16, 'Unexpected small header ABI.')
    return r

def header_fields(header):
    return {f[0]: getattr(header, f[0]) for f in header._fields_}

def encode_instruction(inst, values):
    require(len(values) == len(inst.operands), 'Operand count mismatch.')
    data = bytearray([inst.opcode])
    for operand, value in zip(inst.operands, values):
        ctype = operand.operand_type.c_type
        width = ctypes.sizeof(ctype)
        signed = operand.operand_type.name in ('Addr8', 'Addr32', 'Imm32')
        if operand.operand_type.name == 'Double':
            data.extend(struct.pack('<d', value))
        else:
            minimum = -(1 << (width*8-1)) if signed else 0
            maximum = (1 << (width*8-1)) - 1 if signed else (1 << (width*8)) - 1
            require(minimum <= value <= maximum, f'{inst.name} operand overflow: {value}; widening forbidden.')
            data.extend(int(value).to_bytes(width, 'little', signed=signed))
    require(len(data) == inst.binary_size, 'Instruction size mismatch.')
    return bytes(data)

def make_guard(r, fid):
    by_name = {x.name: x for x in r.parser_module._instructions}
    spec = []
    def emit(name, *values):
        inst = by_name[name]
        spec.append(dict(instruction=name, operands=list(values), size=inst.binary_size))
        return encode_instruction(inst, values)
    require(r.strings[73] == 'check', 'Existing check string identity mismatch.')
    if fid == 7314:
        # At the post-stage resume point r13 is outer environment; slot1 is
        # coordinator, r7 is operation; r9/r12 are dead until overwritten.
        blob = emit('LoadFromEnvironment', 9, 13, 1)
        blob += emit('GetByIdShort', 12, 9, 31, 73)
        blob += emit('Call2', 12, 12, 9, 7)
        return blob, spec
    # Re-evaluate the original private eligibility predicate. The existing
    # cancellation-constructor block at 0x54 is a fail-only path and throws.
    blob = emit('LoadFromEnvironment', 1, 9, 1)
    blob += emit('Call1', 1, 1, 7)
    branch_source = TARGETS[fid]['insertion'] + len(blob)
    blob += emit('JmpFalseLong', 0x54 - branch_source, 1)
    blob += emit('LoadFromEnvironment', 11, 9, 3)
    blob += emit('GetByIdShort', 12, 11, 24, 73)
    blob += emit('Call2', 12, 12, 11, 6)
    return blob, spec

def rewrite_body(r, data, fid):
    h = r.function_headers[fid]
    expected = TARGETS[fid]
    for field, value in expected.items():
        if field not in ('insertion', 'exceptions'):
            require(getattr(h, field) == value, f'Function {fid} metadata changed: {field}.')
    require(not h.overflowed and not h.hasDebugInfo and h.hasExceptionHandler, 'Unsupported target header flags.')
    require([i for i,x in enumerate(r.function_headers) if x.offset == h.offset] == [fid], 'Aliased target body rejected.')
    exceptions = [(x.start,x.end,x.target) for x in r.function_id_to_exc_handlers[fid]]
    require(exceptions == expected['exceptions'], 'Unexpected exception table.')
    ops = list(parse_hbc_bytecode(h, r))
    require(ops and ops[-1].next_pos == h.bytecodeSizeInBytes, 'Incomplete opcode parsing.')
    require(not any(x.inst.name == 'SwitchImm' for x in ops), 'Switch jump tables are outside scope.')
    boundary = expected['insertion']
    offsets = {x.original_pos for x in ops} | {h.bytecodeSizeInBytes}
    require(boundary in offsets, 'Insertion is not an instruction boundary.')
    if fid == 7337:
        require(0x54 in offsets, 'Cancellation target is not an instruction boundary.')
    guard, guard_spec = make_guard(r, fid)
    growth = len(guard)
    def map_instruction(pos):
        return pos + (growth if pos >= boundary else 0)
    def map_branch_target(pos):
        # An old jump to this boundary must execute the newly inserted guard.
        return pos if pos == boundary else map_instruction(pos)
    blob = bytearray()
    branches = []
    for op in ops:
        if op.original_pos == boundary:
            blob.extend(guard)
        require(len(blob) == map_instruction(op.original_pos), 'Instruction relocation mismatch.')
        args = [getattr(op, f'arg{i+1}') for i in range(len(op.inst.operands))]
        for i, operand in enumerate(op.inst.operands):
            if operand.operand_type.name in ('Addr8', 'Addr32'):
                old_target = op.original_pos + args[i]
                require(old_target in offsets, f'Invalid original branch target {old_target}.')
                new_target = map_branch_target(old_target)
                new_delta = new_target - map_instruction(op.original_pos)
                if new_delta != args[i]:
                    branches.append(dict(instruction=op.inst.name, old_source=op.original_pos,
                                         new_source=map_instruction(op.original_pos), old_target=old_target,
                                         new_target=new_target, old_delta=args[i], new_delta=new_delta))
                args[i] = new_delta
        encoded = encode_instruction(op.inst, args)
        # Only relative-address fields may change within retained instructions.
        original = data[h.offset+op.original_pos:h.offset+op.next_pos]
        if not any(o.operand_type.name in ('Addr8','Addr32') for o in op.inst.operands):
            require(encoded == original, 'Non-branch instruction changed.')
        blob.extend(encoded)
    require(len(blob) == h.bytecodeSizeInBytes + growth, 'Unexpected body growth.')
    # Both legacy try regions begin after the new guard; preserve that behavior.
    require(all(start > boundary for start,end,target in exceptions), 'Ambiguous exception-boundary insertion.')
    new_exceptions = [tuple(map_instruction(v) for v in item) for item in exceptions]
    report = dict(function_id=fid, old_header=header_fields(h), old_body_sha256=sha256(data[h.offset:h.offset+h.bytecodeSizeInBytes]),
                  insertion_offset=boundary, inserted_bytes=growth, inserted_instructions=guard_spec,
                  relocated_branches=branches, old_exception_table=exceptions, new_exception_table=new_exceptions)
    return bytes(blob), new_exceptions, report

def patch(data):
    require(len(data) == EXPECTED_LENGTH and sha256(data) == EXPECTED_SHA256, 'Input is not the verified code601 HBC.')
    r = read_hbc(data)
    # BytecodeFileHeader is 109 structured bytes plus 19 bytes padding.
    # All 128 bytes are retained, except explicit fileLength at byte32.
    out = bytearray(data[:-20])
    reports = []
    small_type = r.get_small_func_header_reader()
    mutable_ranges = [(32,36)]
    for fid in TARGETS:
        body, exceptions, report = rewrite_body(r, data, fid)
        h = small_type.from_buffer_copy(data[128 + fid*16:128 + (fid+1)*16])
        h.offset = len(out)
        require(h.offset == len(out) and len(out) < (1 << 25), 'New body offset overflows small header.')
        out.extend(body)
        out.extend(b'\x00' * ((-len(out)) % 4))
        info_offset = len(out)
        require(info_offset < (1 << 25), 'New info offset overflows small header.')
        h.infoOffset = info_offset
        h.bytecodeSizeInBytes = len(body)
        require(h.bytecodeSizeInBytes == len(body), 'Body length overflows small header.')
        h.highestReadCacheIndex += 1
        out.extend(struct.pack('<I', len(exceptions)))
        for item in exceptions:
            out.extend(struct.pack('<III', *item))
        start = 128 + fid*16
        out[start:start+16] = bytes(h)
        mutable_ranges.append((start,start+16))
        report['new_header'] = header_fields(h)
        report['new_body_sha256'] = sha256(body)
        reports.append(report)
    struct.pack_into('<I', out, 32, len(out) + 20)
    out.extend(hashlib.sha1(out).digest())
    result = bytes(out)
    parsed = read_hbc(result)
    require(parsed.header.functionCount == r.header.functionCount, 'Function count changed.')
    require(parsed.header.debugInfoOffset == r.header.debugInfoOffset, 'Debug info was relocated.')
    for key in header_fields(r.header):
        if key == 'fileLength': continue
        before, after = getattr(r.header,key), getattr(parsed.header,key)
        if isinstance(before, ctypes.Array):
            before, after = bytes(before), bytes(after)
        require(before == after, f'Global header field changed: {key}.')
    # Prove byte-for-byte preservation of every original byte outside allowlist.
    cursor = 0
    for start,end in sorted(mutable_ranges):
        require(result[cursor:start] == data[cursor:start], f'Unauthorized original-byte change at span{cursor}:{start}.')
        cursor = end
    require(result[cursor:len(data)-20] == data[cursor:-20], 'Unauthorized original body/table/debug mutation.')
    for fid, report in zip(TARGETS, reports):
        h = parsed.function_headers[fid]
        instructions = list(parse_hbc_bytecode(h, parsed))
        valid_offsets = {op.original_pos for op in instructions} | {h.bytecodeSizeInBytes}
        require(instructions[-1].next_pos == h.bytecodeSizeInBytes, 'Patched body parsing incomplete.')
        for op in instructions:
            for i, operand in enumerate(op.inst.operands):
                if operand.operand_type.name in ('Addr8','Addr32'):
                    require(op.original_pos + getattr(op, f'arg{i+1}') in valid_offsets, 'Patched branch is not an instruction boundary.')
        observed = [(x.start,x.end,x.target) for x in parsed.function_id_to_exc_handlers[fid]]
        require(observed == report['new_exception_table'], 'Patched EH table disagrees.')
        old_fields, new_fields = report['old_header'], header_fields(h)
        allowed = {'offset','infoOffset','bytecodeSizeInBytes','highestReadCacheIndex'}
        require(all(old_fields[k] == new_fields[k] for k in old_fields.keys()-allowed), 'Protected function-header field changed.')
        report['instruction_count_after'] = len(instructions)
    return result, dict(status='STRUCTURAL_PASS_NOT_RELEASE_APPROVAL', original_sha256=sha256(data), output_sha256=sha256(result),
                        original_length=len(data), output_length=len(result), appended_bytes=len(result)-len(data),
                        original_debug_offset=r.header.debugInfoOffset, immutable_original_byte_ranges_verified=True,
                        original_bodies_tables_literals_debug_preserved=True, function_ids_preserved=True,
                        changed_original_ranges=[dict(start=s,end=e) for s,e in sorted(mutable_ranges)], repairs=reports,
                        limits=['No APK produced, changed, installed, signed or deployed.', 'Structural validation requires independent review and official-VM behavioral tests.',
                                'Original sourceHash retained as legacy provenance; this is a bounded binary repair, not a full source rebuild.'])

def main():
    cli = argparse.ArgumentParser(description=__doc__)
    cli.add_argument('input_hbc', type=Path)
    cli.add_argument('output_hbc', type=Path)
    args = cli.parse_args()
    source, dest = args.input_hbc.resolve(), args.output_hbc.resolve()
    require(source != dest, 'Original overwrite forbidden.')
    require(dest.suffix == '.hbc', 'Output must be an analysis .hbc, never an APK.')
    require(not dest.is_relative_to(ROOT / 'Solaris-Android-Reconstruction'), 'Recovered reference subtree is read-only for this writer.')
    require(not dest.exists(), 'Output exists; choose a new analysis path.')
    report_path = dest.with_suffix('.writer.json')
    require(not report_path.exists(), 'Report exists; choose a new analysis path.')
    original = source.read_bytes()
    result, report = patch(original)
    # Validation has completed before either artifact is written.
    dest.parent.mkdir(parents=True, exist_ok=True)
    with dest.open('xb') as f: f.write(result)
    report['input_path'] = str(source)
    report['output_path'] = str(dest)
    with report_path.open('x') as f: json.dump(report, f, indent=2); f.write('\n')
    require(source.read_bytes() == original, 'Source changed during execution.')
    print(json.dumps(dict(status=report['status'], output_path=str(dest), report_path=str(report_path), output_sha256=report['output_sha256'])))

if __name__ == '__main__':
    main()
