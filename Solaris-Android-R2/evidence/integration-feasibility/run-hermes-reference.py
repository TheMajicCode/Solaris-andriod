#!/usr/bin/env python3
"""Run retained reference fixtures with the pinned VM after relocating tool inputs.
Loads only a fixed allowlist of the runner and its two libraries. Never installs.
"""
import argparse
import hashlib
import json
import os
import pathlib
import subprocess

parser = argparse.ArgumentParser()
parser.add_argument('--tools', required=True, type=pathlib.Path)
parser.add_argument('--timeout', type=int, default=60)
parser.add_argument('inputs', nargs='+', type=pathlib.Path)
args = parser.parse_args()
if not 1 <= args.timeout <= 600:
    parser.error('--timeout must be 1..600 seconds')
tool_root = args.tools.resolve()
evidence = pathlib.Path(__file__).resolve().parent
manifest = json.loads((evidence / 'verified-tool-binaries.json').read_text())
expected = {row['path'].removeprefix('reconstruction-work/r2-tools/'): row for row in manifest}
required = ['hermes-runner','hermes-build/API/hermes/libhermes.so','hermes-build/jsi/libjsi.so']
for name in required:
    path = tool_root / name
    if not path.is_file() or hashlib.sha256(path.read_bytes()).hexdigest() != expected[name]['sha256']:
        raise SystemExit(f'Pinned tool verification failed: {name}')
for path in args.inputs:
    if not path.is_file():
        raise SystemExit(f'Input missing: {path}')
env = os.environ.copy()
# Override embedded local build RUNPATHs with the relocated retained libraries.
env['LD_LIBRARY_PATH'] = os.pathsep.join(str(tool_root / name) for name in
    ['hermes-build/API/hermes','hermes-build/jsi'])
try:
    result = subprocess.run([str(tool_root / 'hermes-runner'), *[str(p.resolve()) for p in args.inputs]],
                            env=env, timeout=args.timeout)
except subprocess.TimeoutExpired:
    raise SystemExit('Reference fixture exceeded its execution bound')
raise SystemExit(result.returncode)
