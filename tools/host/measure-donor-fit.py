#!/usr/bin/env python3
"""Measure a donor source against the frozen A604 inliner contract.

Runs the same pipeline as the frozen Solaris-Android-R4/grounding/build-plans.py
(prepare-guided.cjs string lowering, then the pinned hermesc with
-base-bytecode against the exact 603 HBC), then evaluates EVERY requirement of
the frozen Solaris-Android-R4/tools/hbc_inline.py::inline_donor for both host
call sites it is used at, collecting all violations instead of stopping at the
first. Finally, if nothing was violated, it calls the real inline_donor as a
control, so this tool cannot report a fit the frozen inliner would refuse.

It measures; it builds nothing that ships. It needs the private inputs and runs
in a DISPOSABLE copy of the repository that holds reconstruction-work/.

Usage: measure-donor-fit.py --disposable-root <copy> --base <603 hbc> --donor <script.js> --out <new-dir>
"""
import argparse, hashlib, json, subprocess, sys
from pathlib import Path

BASE_SHA = 'b8ac7d1b58d9e8ea6eadd25de516e35842aea14e4b849462664bb3200fedc990'
HERMESC_SHA = 'b4c37f09410c6c6c0ce90df00eb270dc257d2184c85ca320382ebe06057f2a14'
# The two inline sites in build-plans.py: (caller fid, parameter map, result register).
SITES = {14890: ({1: 1}, 0), 14894: ({1: 16}, 19)}
FORBIDDEN = {'SwitchImm', 'DirectEval', 'CreateRegExp', 'CreateArguments', 'ReifyArguments',
             'GetArgumentsPropByVal', 'GetArgumentsLength', 'LoadThisNS', 'CoerceThisNS',
             'StartGenerator', 'ResumeGenerator', 'SaveGenerator', 'CompleteGenerator', 'Yield',
             'Catch', 'CallRequire', 'GetBuiltinClosure', 'Unreachable', 'Debugger'}
FORBIDDEN_FRAGMENTS = ('Environment', 'Closure', 'WithBuffer', 'BigInt')


def sha(b): return hashlib.sha256(b).hexdigest()


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument('--disposable-root', type=Path, required=True)
    p.add_argument('--base', type=Path, required=True)
    p.add_argument('--donor', type=Path, required=True)
    p.add_argument('--donor-function', default='fastGuided')
    p.add_argument('--out', type=Path, required=True)
    a = p.parse_args()
    root = a.disposable_root.resolve()
    sys.path.insert(0, str(Path(__file__).resolve().parent))
    from _guard import refuse_git_worktree, verify_frozen
    refuse_git_worktree(root, 'disposable root')
    refuse_git_worktree(a.out.resolve().parent, 'output directory')
    verify_frozen(root, ('Solaris-Android-R4/tools/', 'Solaris-Android-R3/tools/', 'Solaris-Android-R4/grounding/'),
                  ('Solaris-Android-R4/tools', 'Solaris-Android-R3/tools'))
    # Same order as the frozen builders: R4 tools shadow R3's older hbc_patch.
    for i, sub in enumerate(('Solaris-Android-R4/tools', 'Solaris-Android-R3/tools',
                             'reconstruction-work/toolchain/hermes-dec-a0f18f97ab661eb8ed659c8c683a0d21ea619e69/src')):
        sys.path.insert(i, str(root / sub))
    from hbc_patch import read
    from hbc_inline import inline_donor
    from hermes_dec.parsers.hbc_bytecode_parser import parse_hbc_bytecode
    from hermes_dec.parsers.hbc_opcodes.def_classes import OperandMeaning

    base = a.base.read_bytes()
    if sha(base) != BASE_SHA: sys.exit('not the exact 603 base HBC')
    compiler = root / 'reconstruction-work/r2-tools/react-native-0.81.5/package/sdks/hermesc/linux64-bin/hermesc'
    if sha(compiler.read_bytes()) != HERMESC_SHA: sys.exit('not the pinned hermesc')
    r = read(base, exact_base=True)
    a.out.mkdir(parents=True, exist_ok=False)
    (a.out / 'base.hbc').write_bytes(base)
    (a.out / 'strings.json').write_text(json.dumps(r.strings))
    prepared, binary = a.out / 'donor.compiler.js', a.out / 'donor.hbc'
    prep = subprocess.run(['node', str(root / 'Solaris-Android-R4/grounding/prepare-guided.cjs'), str(a.donor.resolve()),
                           str(a.out / 'strings.json'), str(prepared)], cwd=root, capture_output=True, text=True)
    result = {'donor': str(a.donor), 'donorSha256': sha(a.donor.read_bytes()), 'violations': [], 'sites': {}}
    if prep.returncode:
        result['violations'].append('prepare-guided.cjs failed: ' + prep.stderr.strip()[-300:])
    else:
        comp = subprocess.run([str(compiler), '-O', '-g0', '-emit-binary', '-base-bytecode=' + str(a.out / 'base.hbc'),
                               '-out', str(binary), str(prepared)], capture_output=True, text=True)
        if comp.returncode:
            result['violations'].append('pinned hermesc rejected the donor: ' + (comp.stderr or comp.stdout).strip()[-400:])
    if not result['violations']:
        d = read(binary.read_bytes())
        names = [d.strings[h.functionName] for h in d.function_headers]
        result['functions'] = names
        result['functionCount'] = d.header.functionCount
        result['preparedStringChunks'] = prepared.read_text().count('String.fromCharCode')
        if not (d.header.functionCount == 2 and names[1] == a.donor_function):
            result['violations'].append(f'build-plans requires exactly 2 functions with function 1 named '
                                        f'{a.donor_function!r}; got {d.header.functionCount}: {names[:6]}')
        # The donor contract is about ONE function, so a many-function program
        # fails the count check above before anything else is said about it.
        # This aggregate records what the rest of the program would also have to
        # shed, so "does not fit" comes with a size rather than a single reason.
        whole = dict(functionsExcludingGlobal=d.header.functionCount - 1, exceptionHandlers=0,
                     nonZeroEnvironments=0, readCacheSlots=0, opcodes={})
        for other in d.function_headers[1:]:
            whole['exceptionHandlers'] += bool(other.hasExceptionHandler)
            whole['nonZeroEnvironments'] += other.environmentSize != 0
            whole['readCacheSlots'] += other.highestReadCacheIndex
            for op in parse_hbc_bytecode(other, d):
                name = op.inst.name
                if name in FORBIDDEN or any(f in name for f in FORBIDDEN_FRAGMENTS):
                    whole['opcodes'][name] = whole['opcodes'].get(name, 0) + 1
        result['wholeProgram'] = whole
        fid = names.index(a.donor_function) if a.donor_function in names else 1
        h = d.function_headers[fid]
        ops = list(parse_hbc_bytecode(h, d))
        opcodes = {}
        bad_strings, id_refs = [], 0
        for op in ops:
            opcodes[op.inst.name] = opcodes.get(op.inst.name, 0) + 1
            for i, operand in enumerate(op.inst.operands, 1):
                v = getattr(op, 'arg%d' % i)
                if operand.operand_meaning in {OperandMeaning.function_id, OperandMeaning.bigint_id}:
                    id_refs += 1
                if operand.operand_meaning == OperandMeaning.string_id:
                    if v >= len(r.strings) or d.strings[v] != r.strings[v] or d.string_kinds[v] != r.string_kinds[v]:
                        bad_strings.append(v)
        forbidden = {k: n for k, n in opcodes.items()
                     if k in FORBIDDEN or any(f in k for f in FORBIDDEN_FRAGMENTS)}
        donor = dict(frameSize=h.frameSize, bytecodeBytes=h.bytecodeSizeInBytes, exceptionHandler=bool(h.hasExceptionHandler),
                     environmentSize=h.environmentSize, overflowed=bool(h.overflowed), debugInfo=bool(h.hasDebugInfo),
                     highestReadCacheIndex=h.highestReadCacheIndex, highestWriteCacheIndex=h.highestWriteCacheIndex,
                     instructions=len(ops), forbiddenOpcodes=forbidden, functionOrBigintIdOperands=id_refs,
                     stringIdsNotInBase=len(set(bad_strings)), returns=opcodes.get('Ret', 0))
        result['donorFunction'] = donor
        for flag, message in [(donor['overflowed'] or donor['debugInfo'] or donor['exceptionHandler'], 'donor overflow/debug-info/exception handler'),
                              (donor['environmentSize'] != 0, 'donor has a lexical environment'),
                              (bool(forbidden), f'forbidden opcodes {forbidden}'),
                              (id_refs > 0, f'{id_refs} function/bigint ID operands (calls into other donor functions)'),
                              (bool(bad_strings), f'{len(set(bad_strings))} string IDs absent from or different in the base table'),
                              (donor['returns'] == 0, 'donor has no return')]:
            if flag: result['violations'].append(message)
        for caller, (params, res) in SITES.items():
            c = r.function_headers[caller]
            frame = c.frameSize + h.frameSize
            site = dict(callerFrame=c.frameSize, inlinedFrame=frame, frameLimit=127,
                        readCache=(c.highestReadCacheIndex + 1) + h.highestReadCacheIndex,
                        writeCache=(c.highestWriteCacheIndex + 1) + h.highestWriteCacheIndex, cacheLimit=255)
            result['sites'][caller] = site
            if frame >= 128: result['violations'].append(f'site {caller}: inlined frame {frame} >= 128')
            if site['readCache'] >= 256 or site['writeCache'] >= 256:
                result['violations'].append(f'site {caller}: cache index overflow {site["readCache"]}/{site["writeCache"]}')
        if not result['violations']:
            # Control: the real frozen inliner must agree.
            for caller, (params, res) in SITES.items():
                inline_donor(r, d, caller, fid, params, res, namespace=f'measure-{caller}')
            result['frozenInlinerAccepted'] = True
    result['fits'] = not result['violations']
    (a.out / 'FIT-RESULT.json').write_text(json.dumps(result, indent=2, ensure_ascii=False) + '\n')
    print(json.dumps(result, indent=1, ensure_ascii=False))
    return 0 if result['fits'] else 3


if __name__ == '__main__':
    raise SystemExit(main())
