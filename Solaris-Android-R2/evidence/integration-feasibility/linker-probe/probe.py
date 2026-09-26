#!/usr/bin/env python3
"""Synthetic-only append/remap experiment. Not a production HBC linker.

Fails closed on unsupported constructs. It NEVER accepts external input paths.
The three generated HBC files contain independently authored tiny fixtures only.
"""
from pathlib import Path
from io import BytesIO
import ctypes, hashlib, json, struct, subprocess, sys

ROOT = Path(__file__).resolve().parents[4]
HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT / 'reconstruction-work/toolchain/hermes-dec-a0f18f97ab661eb8ed659c8c683a0d21ea619e69/src'))
from hermes_dec.parsers.hbc_file_parser import HBCReader
from hermes_dec.parsers.hbc_bytecode_parser import parse_hbc_bytecode
from hermes_dec.parsers.hbc_opcodes.def_classes import OperandMeaning

COMPILER = ROOT / 'reconstruction-work/r2-tools/react-native-0.81.5/package/sdks/hermesc/linux64-bin/hermesc'
VM = ROOT / 'reconstruction-work/r2-tools/hermes-build/bin/hvm'
results = []
def run(*args):
    p = subprocess.run([str(a) for a in args], capture_output=True, text=True)
    results.append(dict(args=[str(a) for a in args], returncode=p.returncode, stdout=p.stdout, stderr=p.stderr))
    p.check_returncode()
    return p.stdout

def read(path):
    raw = path.read_bytes()
    r = HBCReader()
    r.read_whole_file(BytesIO(raw))
    assert r.header.version == 96
    assert hashlib.sha1(raw[:-20]).digest() == raw[-20:]
    return r, raw

def sections(r, raw):
    h = r.header
    counts = [
        ('functions', h.functionCount * 16),
        ('kinds', h.stringKindCount * 4),
        ('hashes', h.identifierCount * 4),
        ('strings', h.stringCount * 4),
        ('overflow', h.overflowStringCount * 8),
        ('storage', h.stringStorageSize),
        ('arrays', h.arrayBufferSize),
        ('keys', h.objKeyBufferSize),
        ('values', h.objValueBufferSize),
        ('bigints', h.bigIntCount * 8),
        ('bigint_storage', h.bigIntStorageSize),
        ('regexps', h.regExpCount * 8),
        ('regexp_storage', h.regExpStorageSize),
        ('cjs', h.cjsModuleCount * 8),
        ('sources', h.functionSourceCount * 8),
    ]
    pos, out = 128, {}
    for name, size in counts:
        pos = (pos + 3) & ~3
        out[name] = raw[pos:pos+size]
        pos += size
    out['body_start'] = pos
    return counts, out

def copy_struct(obj):
    return type(obj).from_buffer_copy(bytes(obj))

def append_aligned(out, data):
    out.extend(b'\x00' * ((-len(out)) % 4))
    pos = len(out)
    out.extend(data)
    return pos

def small_header(r, h):
    small = r.get_small_func_header_reader()()
    for field in small._fields_:
        name = field[0]
        value = getattr(h, name)
        if len(field) == 3:
            assert value < 1 << field[2], (name, value)
        setattr(small, name, value)
    assert not small.overflowed, 'Synthetic probe does not implement overflow headers.'
    return bytes(small)

def remap_function_operands(r, h, body, mapping):
    changes = []
    for inst in parse_hbc_bytecode(h, r):
        assert inst.inst.name != 'SwitchImm', 'Synthetic probe excludes switch jump tables.'
        offset = inst.original_pos + 1
        for n, operand in enumerate(inst.inst.operands, 1):
            width = ctypes.sizeof(operand.operand_type.c_type)
            if operand.operand_meaning == OperandMeaning.function_id:
                old = getattr(inst, 'arg%d' % n)
                new = mapping.get(old, old)
                assert new < 1 << (8 * width), 'Opcode widening is outside the probe.'
                body[offset:offset+width] = new.to_bytes(width, 'little')
                if new != old: changes.append(dict(instruction=inst.inst.name, offset=offset, old=old, new=new))
            offset += width
    return changes

run(COMPILER, '-O', '-g1', '-emit-binary', '-out=' + str(HERE/'host.hbc'), HERE/'host.js')
run(COMPILER, '-O0', '-g0', '-emit-binary', '-base-bytecode=' + str(HERE/'host.hbc'), '-out=' + str(HERE/'donor.hbc'), HERE/'donor.js')
base, br = read(HERE/'host.hbc')
donor, dr = read(HERE/'donor.hbc')
order, bs = sections(base, br)
_, ds = sections(donor, dr)
assert donor.strings[:len(base.strings)] == base.strings
assert donor.string_kinds[:len(base.string_kinds)] == base.string_kinds
assert donor.header.cjsModuleCount == donor.header.functionSourceCount == 0
assert all(not ds[name] for name in ('arrays','keys','values','bigints','bigint_storage','regexps','regexp_storage'))
assert all(not h.hasDebugInfo and not h.overflowed for h in donor.function_headers)
assert all(not h.overflowed for h in base.function_headers)
base_target = next(i for i,h in enumerate(base.function_headers) if base.strings[h.functionName] == 'original')
donor_target = next(i for i,h in enumerate(donor.function_headers) if donor.strings[h.functionName] == 'replacement')
nf = len(base.function_headers)
merged_header = copy_struct(base.header)
merged_header.functionCount += donor.header.functionCount
for name in ('stringKindCount','identifierCount','stringCount','overflowStringCount','stringStorageSize'):
    setattr(merged_header, name, getattr(donor.header, name))
out = bytearray(bytes(merged_header)).ljust(128, b'\x00')
header_start = len(out)
for name, size in order:
    data = b'\x00' * (merged_header.functionCount * 16) if name == 'functions' else ds[name] if name in ('kinds','hashes','strings','overflow','storage') else bs[name]
    append_aligned(out, data)
# Keep the full old opcode/info region byte-for-byte, relocated by a multiple of 4.
old_body_start = bs['body_start']
while (len(out) - old_body_start) % 4: out.append(0)
relocation = len(out) - old_body_start
out.extend(br[old_body_start:base.header.debugInfoOffset])
headers = []
changes = []
for i,h0 in enumerate(base.function_headers):
    h = copy_struct(h0)
    h.offset += relocation
    h.infoOffset += relocation
    body = bytearray(br[h0.offset:h0.offset+h0.bytecodeSizeInBytes])
    edits = remap_function_operands(base, h0, body, {base_target: nf + donor_target})
    if edits:
        assert sum(x.offset == h0.offset for x in base.function_headers) == 1, 'Modified aliased body excluded.'
        out[h.offset:h.offset+len(body)] = body
        changes.append(dict(base_function=i, edits=edits))
    headers.append(h)
donor_headers = []
for i,h0 in enumerate(donor.function_headers):
    h = copy_struct(h0)
    body = bytearray(dr[h0.offset:h0.offset+h0.bytecodeSizeInBytes])
    remap_function_operands(donor, h0, body, {j: nf+j for j in range(len(donor.function_headers))})
    h.offset = len(out)
    out.extend(body)
    donor_headers.append(h)
for i,h in enumerate(donor_headers):
    append_aligned(out, b'')
    h.infoOffset = len(out)
    exc = donor.function_id_to_exc_handlers.get(i)
    if exc is not None:
        out.extend(struct.pack('<I', len(exc)))
        out.extend(bytes(exc))
headers += donor_headers
merged_header.debugInfoOffset = append_aligned(out, br[base.header.debugInfoOffset:-20])
merged_header.fileLength = len(out) + 20
out[:ctypes.sizeof(merged_header)] = bytes(merged_header)
out[header_start:header_start+len(headers)*16] = b''.join(small_header(base, h) for h in headers)
out.extend(hashlib.sha1(out).digest())
(HERE/'merged.hbc').write_bytes(out)
merged, mr = read(HERE/'merged.hbc')
assert merged.header.globalCodeIndex == base.header.globalCodeIndex
assert mr[merged.header.debugInfoOffset:-20] == br[base.header.debugInfoOffset:-20]
assert len(changes) == 1 and changes[0]['base_function'] == base.header.globalCodeIndex
for i,h in enumerate(base.function_headers):
    if i == base.header.globalCodeIndex: continue
    mh = merged.function_headers[i]
    assert br[h.offset:h.offset+h.bytecodeSizeInBytes] == mr[mh.offset:mh.offset+mh.bytecodeSizeInBytes]
    assert bytes(base.function_id_to_exc_handlers.get(i, b'')) == bytes(merged.function_id_to_exc_handlers.get(i, b''))
    assert bytes(base.function_id_to_debug_offsets.get(i, b'')) == bytes(merged.function_id_to_debug_offsets.get(i, b''))
original_output = run(VM, HERE/'host.hbc')
merged_output = run(VM, HERE/'merged.hbc')
assert original_output == 'retained:6\nretained exception\nold:5\n'
assert merged_output == 'retained:6\nretained exception\npatched:16\n'
report = dict(scope='Synthetic fixtures only; original Solaris bytecode/APK never modified', status='PASS', original_output=original_output, merged_output=merged_output, base_function_count=nf, donor_function_count=len(donor_headers), merged_function_count=len(headers), original_string_count=len(base.strings), merged_string_count=len(merged.strings), preserved_original_function_ids=True, preserved_original_strings=True, preserved_original_debug_bytes=True, original_global_edits=changes, original_body_relocation=relocation, command_results=results, limitations=['No input parameters; synthetic fixtures only', 'Donor arrays, object literals, regexp, bigint, CJS, function source tables rejected', 'SwitchImm and overflow function headers rejected', 'Operand-width overflows rejected; opcode widening not implemented', 'Original modified body alias rejected', 'Nested donor lexical capture works; external donor parent captures not addressed'])
(HERE/'result.json').write_text(json.dumps(report, indent=2)+'\n')
print(json.dumps({k:report[k] for k in ('status','original_output','merged_output','base_function_count','donor_function_count','merged_function_count')}))
