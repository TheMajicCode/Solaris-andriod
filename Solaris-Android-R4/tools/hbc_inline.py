#!/usr/bin/env python3
"""Inline one closure-free compiler-produced helper into an existing function.

Imports no function/table/constant pool. Every used string ID must be the same
ID/kind/value in the baseline. The helper's lexical environment, closures,
literal buffers, regexp/bigint, generators and eval are rejected. Generic calls
inside the helper retain their tail-relative argument positions after shifting.
The caller's frame-relative argument slots are explicitly repaired if enlarged.
This API is intentionally narrow and requires actual-Hermes tests of each use.
"""
from hbc_patch import I, Ins, Label, Ref, require, fields
from hermes_dec.parsers.hbc_bytecode_parser import parse_hbc_bytecode
from hermes_dec.parsers.hbc_opcodes.def_classes import OperandMeaning

READ_CACHE = {'GetByIdShort','GetById','GetByIdLong','TryGetById','TryGetByIdLong'}
WRITE_CACHE = {'PutById','PutByIdLong','TryPutById','TryPutByIdLong'}
IMPLICIT_CALLS = {'Call','CallLong','Construct','ConstructLong','CallDirect','CallDirectLongIndex','CallBuiltin','CallBuiltinLong'}

def reframe_edits(reader, caller_fid, new_frame):
    """Copy existing implicit-call arguments to the enlarged frame's call area.

    Hermes StackFrame offsets: this=frameSize-7; arg0=this-1; call count includes
    this. Evidence: exact RN0.81 Interpreter.cpp Call/Construct/CallBuiltin paths
    and StackFrameLayout (six caller metadata slots preceding ThisArg).
    """
    h=reader.function_headers[caller_fid]
    require(new_frame >= h.frameSize and new_frame <128, 'Unsupported frame resize')
    if new_frame==h.frameSize:return []
    edits=[]
    for op in parse_hbc_bytecode(h,reader):
        if op.inst.name not in IMPLICIT_CALLS:continue
        count=op.arg2 if op.inst.name in {'CallDirect','CallDirectLongIndex'} else op.arg3
        require(count>=1 and count <= h.frameSize-6,'Invalid implicit call arg count')
        # Destinations above source slots; high-to-low avoids overlap corruption.
        nodes=[I('Mov',new_frame-7-i,h.frameSize-7-i) for i in range(count)]
        edits.append(dict(start=op.original_pos,end=op.original_pos,nodes=nodes))
    return edits

def inline_donor(base_reader, donor_reader, caller_fid, donor_fid,
                 parameter_registers, result_register, namespace='inline', register_start=None):
    caller=base_reader.function_headers[caller_fid]
    donor=donor_reader.function_headers[donor_fid]
    require(not donor.overflowed and not donor.hasDebugInfo and not donor.hasExceptionHandler,
            'Donor overflow/debug/EH excluded')
    require(donor.environmentSize==0, 'Donor must have no lexical environment')
    start=caller.frameSize if register_start is None else register_start
    require(start>=caller.frameSize, 'Scratch registers must be outside original frame')
    frame=start+donor.frameSize
    require(frame<128,'Inlined frame exceeds compact limit')
    require(0<=result_register<caller.frameSize,'Return destination must be an original caller register')
    require(all(0<=x<caller.frameSize for x in parameter_registers.values()),'Parameter source outside original frame')
    read_offset=caller.highestReadCacheIndex+1
    write_offset=caller.highestWriteCacheIndex+1
    require(read_offset+donor.highestReadCacheIndex<256 and write_offset+donor.highestWriteCacheIndex<256,
            'Cache-index overflow')
    ops=list(parse_hbc_bytecode(donor,donor_reader))
    require(ops and ops[-1].next_pos==donor.bytecodeSizeInBytes,'Incomplete donor parsing')
    boundaries={o.original_pos for o in ops}
    nodes=[]; imported_strings={}; returned=False
    end_name=namespace+':end'
    forbidden={'SwitchImm','DirectEval','CreateRegExp','CreateArguments','ReifyArguments','GetArgumentsPropByVal','GetArgumentsLength',
               'LoadThisNS','CoerceThisNS','StartGenerator','ResumeGenerator','SaveGenerator','CompleteGenerator','Yield','Catch',
               'CallRequire','GetBuiltinClosure','Unreachable','Debugger'}
    for op in ops:
        name=op.inst.name
        require(name not in forbidden and
                'Environment' not in name and 'Closure' not in name and
                'WithBuffer' not in name and 'BigInt' not in name,
                'Unsupported donor opcode: '+name)
        nodes.append(Label(namespace+':%d'%op.original_pos))
        if name in {'LoadParam','LoadParamLong'}:
            require(op.arg2 in parameter_registers,'Unmapped donor parameter: %d'%op.arg2)
            nodes.append(I('Mov',start+op.arg1,parameter_registers[op.arg2]))
            continue
        if name=='Ret':
            nodes.extend([I('Mov',result_register,start+op.arg1),I('JmpLong',Ref(end_name))])
            returned=True;continue
        args=[]
        for i,operand in enumerate(op.inst.operands,1):
            value=getattr(op,'arg%d'%i)
            meaning=operand.operand_meaning
            require(meaning not in {OperandMeaning.function_id,OperandMeaning.bigint_id},'Donor ID reference excluded')
            if meaning==OperandMeaning.string_id:
                require(value<len(base_reader.strings),'New string table entry required')
                require(donor_reader.strings[value]==base_reader.strings[value] and
                        donor_reader.string_kinds[value]==base_reader.string_kinds[value],
                        'String ID/kind mismatch')
                imported_strings[value]=base_reader.strings[value]
            if operand.operand_type.name in {'Reg8','Reg32'}:
                value += start
                require(value<frame,'Donor register outside donor frame')
            elif operand.operand_type.name in {'Addr8','Addr32'}:
                target=op.original_pos+value
                require(target in boundaries,'Donor branch must target instruction, not EOF')
                value=Ref(namespace+':%d'%target)
            args.append(value)
        if name in READ_CACHE:args[2]+=read_offset
        if name in WRITE_CACHE:args[2]+=write_offset
        nodes.append(Ins(name,tuple(args)))
    require(returned,'Donor has no return')
    nodes.extend([Label(namespace+':%d'%donor.bytecodeSizeInBytes),Label(end_name)])
    header_updates=dict(frameSize=frame,
                        highestReadCacheIndex=read_offset+donor.highestReadCacheIndex,
                        highestWriteCacheIndex=write_offset+donor.highestWriteCacheIndex)
    report=dict(caller_fid=caller_fid, donor_fid=donor_fid, donor_header=fields(donor),
                parameter_registers=parameter_registers,result_register=result_register,
                register_start=start,header_updates=header_updates,used_string_ids=sorted(imported_strings),
                no_new_function_ids=True,no_new_strings=True,no_external_closures=True,
                implicit_caller_argument_fixups=[e['start'] for e in reframe_edits(base_reader,caller_fid,frame)])
    return nodes,header_updates,reframe_edits(base_reader,caller_fid,frame),report
