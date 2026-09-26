#!/usr/bin/env python3
"""Retain a finite, non-sensitive error code at the actual chat catch boundary."""
from pathlib import Path
import argparse
import json
from hbc_patch import I, Label, Ref, read, rewrite, append_plans, require

DIRECT_CODES = (
    'FIRST_TOKEN_TIMEOUT', 'EMPTY_COMPLETION', 'OUTPUT_LIMIT',
    'QVAC_NOT_READY', 'QVAC_BUSY', 'RUNTIME_RESTART_REQUIRED',
    'FOREGROUND_REQUIRED', 'WORKER_RECOVERY_REQUIRED',
    'QVAC_WORKER_CRASHED', 'QVAC_WORKER_SHUTDOWN',
    'CONTEXT_BUDGET', 'CONTEXT_INVALID', 'CONTEXT_NOT_APPROVED',
    'LOCAL_PERMISSION_REQUIRED', 'PERMISSION_CHANGED',
    'CANDIDATE_INVALID', 'CANDIDATE_UNGROUNDED', 'CANDIDATE_UNSAFE',
    'CANDIDATE_NEGATION', 'OPERATION_FAILED', 'STATUS_TIMEOUT',
    'RECOVERY_STATE_TIMEOUT', 'LIFECYCLE_TIMEOUT', 'UNLOAD_TIMEOUT',
)
SDK_CODES = (
    'REQUEST_VALIDATION_FAILED', 'RPC_CONNECTION_FAILED', 'RPC_INIT_TIMEOUT',
    'WORKER_CRASHED', 'WORKER_SHUTDOWN', 'CONFIG_FILE_INVALID',
    'CONFIG_FILE_PARSE_FAILED', 'CONFIG_VALIDATION_FAILED',
    'WORKER_PLUGINS_NOT_REGISTERED', 'MODEL_NOT_LOADED', 'MODEL_LOAD_FAILED',
    'MODEL_FILE_NOT_FOUND', 'MODEL_FILE_NOT_FOUND_IN_DIR', 'MODEL_FILE_LOCATE_FAILED',
    'MODEL_UNLOAD_FAILED', 'COMPLETION_FAILED', 'CONTEXT_OVERFLOW',
    'CACHE_DIR_NOT_WRITABLE', 'LIFECYCLE_SUSPEND_FAILED', 'LIFECYCLE_RESUME_FAILED',
    'LIFECYCLE_OPERATION_BLOCKED', 'PLUGIN_NOT_FOUND', 'PLUGIN_LOAD_CONFIG_VALIDATION_FAILED',
)

def diagnostic_plan(r, data):
    fid=14894; h=r.function_headers[fid]
    require((h.offset,h.bytecodeSizeInBytes,h.frameSize,h.environmentSize)==(30640883,1589,39,19), 'Unexpected chat catch function')
    sid=lambda s: r.strings.index(s)
    nodes=[]
    # At old1484: r7 is the Error.message (or the non-Error throw object),
    # r3 is undefined, r1 is global. r5/r6/r8 are dead on this throw-only path.
    # Authority and CANCEL tests remain original instructions before this point.
    matched=Ref('diag:matched'); fallback=Ref('diag:fallback')
    for code in DIRECT_CODES:
        nodes.extend([I('LoadConstString',5,sid(code)), I('JStrictEqualLong',matched,7,5)])
    for prefix,suffix in [('STREAM','_TIMEOUT')] + [('QVAC_',s) for s in SDK_CODES]:
        nodes.extend([I('LoadConstString',5,sid(prefix)), I('LoadConstString',8,sid(suffix)),
                      I('Add',5,5,8), I('JStrictEqualLong',matched,7,5)])
    nodes.extend([I('JmpLong',fallback), Label('diag:matched'),
                  I('TryGetById',6,1,6,sid('Error')), I('Call2',5,6,3,5), I('Throw',5),
                  Label('diag:fallback')])
    plan=rewrite(r,data,fid,[dict(start=1484,end=1484,nodes=nodes)])
    plan['report']['purpose']='Whitelist diagnostic code without exposing raw model/patient/error text; preserve original cancellation and authority precedence.'
    plan['report']['accepted_codes']=list(DIRECT_CODES)+['STREAM_TIMEOUT']+['QVAC_'+s for s in SDK_CODES]
    return plan

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('input',type=Path); parser.add_argument('output',type=Path)
    args=parser.parse_args()
    require(args.input.resolve()!=args.output.resolve(),'Overwrite forbidden')
    require(args.output.suffix=='.hbc' and not args.output.exists(),'Output must be new .hbc analysis file')
    data=args.input.read_bytes(); r=read(data,exact_base=True)
    out,report=append_plans(data,[diagnostic_plan(r,data)])
    args.output.parent.mkdir(parents=True,exist_ok=True)
    args.output.write_bytes(out)
    args.output.with_suffix('.json').write_text(json.dumps(report,indent=2)+'\n')
    print(json.dumps({k:report[k] for k in ('status','input_sha256','output_sha256','output_length')}))

if __name__=='__main__':main()
