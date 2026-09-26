#!/usr/bin/env python3
"""Bounded HBC96 function-body patching for the exact Solaris602 reference.

No string/function linking, no compilation/eval, no APK manipulation. Plans are
instruction edits at verified old boundaries. Existing functions and metadata
remain untouched except explicitly targeted compact headers and fileLength.
Relative branches and exception records are relocated using instruction labels.
"""
from pathlib import Path
from io import BytesIO
from dataclasses import dataclass
import ctypes
import hashlib
import struct
import sys

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / 'reconstruction-work/toolchain/hermes-dec-a0f18f97ab661eb8ed659c8c683a0d21ea619e69/src'))
from hermes_dec.parsers.hbc_file_parser import HBCReader
from hermes_dec.parsers.hbc_bytecode_parser import parse_hbc_bytecode

BASE_SHA256 = 'fd8b38bcdd42421c18da4a0b69b2d58906ceddd7c4a2044b34faed51490f4653'
BASE_LENGTH = 30746396

def require(ok, message):
    if not ok:
        raise ValueError(message)

def digest(data):
    return hashlib.sha256(data).hexdigest()

def fields(obj):
    return {f[0]: getattr(obj, f[0]) for f in obj._fields_}

def read(data, exact_base=False):
    require(len(data) > 148, 'Short HBC input')
    require(hashlib.sha1(data[:-20]).digest() == data[-20:], 'HBC SHA1 mismatch')
    if exact_base:
        require(len(data) == BASE_LENGTH and digest(data) == BASE_SHA256, 'Not exact verified602 input')
    r = HBCReader()
    r.read_whole_file(BytesIO(data))
    require(r.header.version == 96 and r.header.fileLength == len(data), 'Unsupported HBC layout/version')
    return r

@dataclass(frozen=True)
class Ref:
    name: str

@dataclass(frozen=True)
class Label:
    name: str

@dataclass(frozen=True)
class Ins:
    name: str
    args: tuple

def I(name, *args):
    return Ins(name, args)

def old(pos):
    return Ref('old:%d' % pos)

def encode(inst, args):
    require(len(args) == len(inst.operands), 'Operand count mismatch: ' + inst.name)
    blob = bytearray([inst.opcode])
    for operand, value in zip(inst.operands, args):
        size = ctypes.sizeof(operand.operand_type.c_type)
        if operand.operand_type.name == 'Double':
            blob.extend(struct.pack('<d', value))
            continue
        signed = operand.operand_type.name in ('Addr8', 'Addr32', 'Imm32')
        lower = -(1 << (8*size-1)) if signed else 0
        upper = (1 << (8*size-1)) - 1 if signed else (1 << (8*size)) - 1
        require(isinstance(value, int) and lower <= value <= upper,
                '%s %s operand overflow: %r' % (inst.name, operand.operand_type.name, value))
        blob.extend(value.to_bytes(size, 'little', signed=signed))
    require(len(blob) == inst.binary_size, 'Instruction ABI mismatch')
    return bytes(blob)

def assemble(r, nodes):
    """Resolve labels; widen only Addr8 opcodes to their exact Long variant."""
    table = {x.name: x for x in r.parser_module._instructions}
    nodes = list(nodes)
    for attempt in range(len(nodes)+1):
        labels, pos = {}, 0
        for n in nodes:
            if isinstance(n, Label):
                require(n.name not in labels, 'Duplicate label: ' + n.name)
                labels[n.name] = pos
            else:
                require(isinstance(n, Ins) and n.name in table, 'Invalid assembly node')
                pos += table[n.name].binary_size
        cursor, widened = 0, False
        for index, n in enumerate(nodes):
            if isinstance(n, Label):
                continue
            inst = table[n.name]
            require(inst.name != 'SwitchImm', 'Switch jump tables excluded')
            require(len(n.args) == len(inst.operands), 'Assembly operand count')
            for operand, value in zip(inst.operands, n.args):
                if isinstance(value, Ref):
                    require(value.name in labels, 'Missing label: ' + value.name)
                    require(operand.operand_type.name in ('Addr8', 'Addr32'), 'Label used outside relative branch')
                    delta = labels[value.name] - cursor
                    if operand.operand_type.name == 'Addr8' and not -128 <= delta <= 127:
                        replacement = table.get(inst.name + 'Long')
                        require(replacement is not None, 'No supported wide form: ' + inst.name)
                        require(len(replacement.operands) == len(inst.operands), 'Wide opcode shape mismatch')
                        for a,b in zip(inst.operands, replacement.operands):
                            require(a.operand_type.name == b.operand_type.name or
                                    (a.operand_type.name,b.operand_type.name) == ('Addr8','Addr32'),
                                    'Widening changed a non-address operand')
                        nodes[index] = Ins(replacement.name, n.args)
                        widened = True
                        break
            cursor += inst.binary_size
        if widened:
            continue
        out, cursor = bytearray(), 0
        for n in nodes:
            if isinstance(n, Label):
                continue
            inst = table[n.name]
            args = [labels[a.name]-cursor if isinstance(a,Ref) else a for a in n.args]
            out.extend(encode(inst, args))
            cursor += inst.binary_size
        return bytes(out), labels
    raise ValueError('Branch assembly failed to converge')

def rewrite(r, data, fid, edits, header_updates=None):
    """edits: [{'start': old_offset, 'end': old_offset, 'nodes': [...] }].

    An insertion (start==end) labels its first inserted instruction as the old
    boundary. Therefore old branches/try starts execute inserted instructions;
    a try end at that boundary excludes them. Deleted internal branch/EH targets
    are forbidden unless the edit explicitly provides their old:N labels.
    """
    h = r.function_headers[fid]
    require(not h.overflowed and len(bytes(h)) == 16 and not h.hasDebugInfo,
            'Target overflow/debug headers excluded')
    require([i for i,x in enumerate(r.function_headers) if x.offset == h.offset] == [fid],
            'Aliased target body excluded')
    ops = list(parse_hbc_bytecode(h, r))
    require(ops and ops[-1].next_pos == h.bytecodeSizeInBytes, 'Incomplete original parsing')
    starts = {x.original_pos for x in ops}
    bounds = starts | {h.bytecodeSizeInBytes}
    require(not any(x.inst.name == 'SwitchImm' for x in ops), 'Switch jump tables excluded')
    edits = sorted(edits, key=lambda e: (e['start'],e['end']))
    end = -1
    for edit in edits:
        a,b = edit['start'],edit['end']
        require(a in bounds and b in bounds and 0 <= a <= b <= h.bytecodeSizeInBytes, 'Edit not on boundaries')
        require(a >= end, 'Overlapping edits')
        end = max(b, a + 1)  # only one insertion/edit per starting boundary
    by_start = {e['start']:e for e in edits}
    require(len(by_start) == len(edits), 'Duplicate edit boundary')
    nodes, skipped_until = [], -1
    for op in ops:
        p = op.original_pos
        if p < skipped_until:
            continue
        nodes.append(Label('old:%d' % p))
        if p in by_start:
            edit = by_start[p]
            nodes.extend(edit['nodes'])
            skipped_until = edit['end']
            if skipped_until > p:
                continue
        args = []
        for i,o in enumerate(op.inst.operands,1):
            value = getattr(op,'arg%d'%i)
            if o.operand_type.name in ('Addr8','Addr32'):
                target = p + value
                require(target in starts, 'Original branch must target an instruction, not EOF')
                value = old(target)
            args.append(value)
        nodes.append(Ins(op.inst.name, tuple(args)))
    nodes.append(Label('old:%d' % h.bytecodeSizeInBytes))
    if h.bytecodeSizeInBytes in by_start:
        nodes.extend(by_start[h.bytecodeSizeInBytes]['nodes'])
    body, labels = assemble(r,nodes)
    exceptions = []
    for eh in r.function_id_to_exc_handlers.get(fid, []):
        try:
            exceptions.append(tuple(labels['old:%d'%p] for p in (eh.start,eh.end,eh.target)))
        except KeyError as exc:
            raise ValueError('Deleted exception boundary') from exc
    report = dict(function_id=fid, original_header=fields(h), old_body_sha256=digest(data[h.offset:h.offset+h.bytecodeSizeInBytes]),
                  new_body_sha256=digest(body), old_length=h.bytecodeSizeInBytes, new_length=len(body),
                  old_exceptions=[(e.start,e.end,e.target) for e in r.function_id_to_exc_handlers.get(fid,[])],
                  new_exceptions=exceptions,
                  edits=[dict(start=e['start'],end=e['end'], instructions=[dict(name=n.name,args=[a.name if isinstance(a,Ref) else a for a in n.args]) if isinstance(n,Ins) else dict(label=n.name) for n in e['nodes']]) for e in edits],
                  boundary_map={k:v for k,v in labels.items() if k.startswith('old:')},
                  header_updates=header_updates or {})
    return dict(function_id=fid, body=body, exceptions=exceptions, header_updates=header_updates or {}, report=report)

def append_plans(data, plans):
    r = read(data, exact_base=True)
    plans = list(plans)
    require(plans and len({p['function_id'] for p in plans}) == len(plans), 'Empty/duplicate function plan')
    out, mutable, reports = bytearray(data[:-20]), [(32,36)], []
    for plan in plans:
        fid = plan['function_id']
        h0 = r.function_headers[fid]
        require(plan['report']['old_body_sha256'] == digest(data[h0.offset:h0.offset+h0.bytecodeSizeInBytes]), 'Plan reference mismatch')
        h = r.get_small_func_header_reader().from_buffer_copy(bytes(h0))
        body, exceptions = plan['body'],plan['exceptions']
        require(plan['report']['new_body_sha256']==digest(body), 'Plan body differs from reviewed report')
        require(plan['report']['original_header']==fields(h0), 'Plan original header mismatch')
        require(plan['report']['new_exceptions']==exceptions, 'Plan exception report mismatch')
        require(bool(exceptions) == bool(h.hasExceptionHandler), 'Handler flag change excluded')
        h.offset = len(out)
        require(h.offset == len(out), 'Compact offset overflow')
        h.bytecodeSizeInBytes = len(body)
        require(h.bytecodeSizeInBytes == len(body), 'Compact bytecode-size overflow')
        out.extend(body)
        out.extend(b'\0'*((-len(out))%4))
        h.infoOffset = len(out)
        require(h.infoOffset == len(out), 'Compact info offset overflow')
        if exceptions:
            out.extend(struct.pack('<I',len(exceptions)))
            for eh in exceptions:
                out.extend(struct.pack('<III',*eh))
        for k,v in plan['header_updates'].items():
            require(k in {'frameSize','highestReadCacheIndex','highestWriteCacheIndex'}, 'Protected header update: '+k)
            require(v >= getattr(h0,k), 'Unexpected cache/frame shrink')
            setattr(h,k,v)
            require(getattr(h,k)==v, 'Header field overflow')
        start = 128+fid*16
        out[start:start+16] = bytes(h)
        mutable.append((start,start+16))
        report = dict(plan['report']); report['new_header'] = fields(h); reports.append(report)
    struct.pack_into('<I',out,32,len(out)+20)
    out.extend(hashlib.sha1(out).digest())
    result = bytes(out)
    rr = read(result)
    cursor = 0
    for a,b in sorted(mutable):
        require(result[cursor:a] == data[cursor:a], 'Unauthorized original-byte mutation')
        cursor = b
    require(result[cursor:len(data)-20] == data[cursor:-20], 'Original body/table/debug mutation')
    require(rr.strings == r.strings and rr.header.functionCount == r.header.functionCount, 'Table/ID change')
    require(rr.header.debugInfoOffset == r.header.debugInfoOffset, 'Original debug offset change')
    for p in plans:
        fid=p['function_id']; h=rr.function_headers[fid]
        ops=list(parse_hbc_bytecode(h,rr))
        starts={x.original_pos for x in ops}
        bounds=starts | {h.bytecodeSizeInBytes}
        require(ops[-1].next_pos==h.bytecodeSizeInBytes, 'Patched opcode parsing incomplete')
        for op in ops:
            for i,o in enumerate(op.inst.operands,1):
                if o.operand_type.name in ('Addr8','Addr32'):
                    require(op.original_pos+getattr(op,'arg%d'%i) in starts, 'Invalid patched branch: must target instruction, not EOF')
                elif o.operand_type.name in ('Reg8','Reg32'):
                    require(0<=getattr(op,'arg%d'%i)<h.frameSize, 'Patched register outside function frame')
        for start,end,target in p['exceptions']:
            require(start in starts and end in bounds and target in starts and start<end,
                    'Invalid patched exception boundary')
        require([(e.start,e.end,e.target) for e in rr.function_id_to_exc_handlers.get(fid,[])] == p['exceptions'], 'Exception table mismatch')
    return result, dict(status='STRUCTURAL_PASS_REQUIRES_INDEPENDENT_VM_REVIEW', input_sha256=digest(data),output_sha256=digest(result),
                        input_length=len(data), output_length=len(result), changed_original_ranges=sorted(mutable),functions=reports,
                        unchanged_original_bytes_verified=True, string_and_function_ids_preserved=True,
                        limits=['Not an APK build; no signing/install/push/deploy.', 'Behavioral validation must execute the actual patched functions in Hermes.', 'Original sourceHash retained as legacy provenance; partial binary-preserving repair.'])
