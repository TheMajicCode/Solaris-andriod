#!/usr/bin/env python3
"""Rebuild the pinned analysis VM from retained, already extracted tool inputs.
No downloads, APK edits, signing, installation, or application execution.
"""
import argparse
import json
import pathlib
import subprocess

parser = argparse.ArgumentParser()
parser.add_argument('--tools', type=pathlib.Path, required=True)
parser.add_argument('--jobs', type=int, default=6)
args = parser.parse_args()
if not 1 <= args.jobs <= 8:
    parser.error('--jobs must be 1..8')
tools = args.tools.resolve()
source = tools / 'hermes-hermes-2025-07-07-RNv0.81.0-e0fc67142ec0763c6b6153ca2bf96df815539782'
cmake = tools / 'cmake-3.31.6/cmake/data/bin/cmake'
ninja = tools / 'ninja-1.11.1.4/ninja-1.11.1.4.data/scripts/ninja'
headers = tools / 'icu-dev/usr/include'
build = tools / 'hermes-build'
source_runner = pathlib.Path(__file__).resolve().with_name('hermes-runner.cpp')
for path in (source / 'CMakeLists.txt', cmake, ninja, headers / 'unicode/utypes.h', source_runner):
    if not path.exists():
        raise SystemExit(f'Missing retained input: {path}')
# These match the analysis host; use this environment or explicitly review ports.
icu = pathlib.Path('/lib/x86_64-linux-gnu')
for stem in ('icuuc','icui18n','icudata'):
    if not (icu / f'lib{stem}.so.74').exists():
        raise SystemExit('Needs the documented Linux x86-64 ICU74 runtime; no fallback')
commands = [
    [str(cmake), '-S', str(source), '-B', str(build), '-G', 'Ninja',
     '-DCMAKE_BUILD_TYPE=Release', '-DCMAKE_MAKE_PROGRAM=' + str(ninja),
     '-DHERMES_ENABLE_TEST_SUITE=OFF', '-DHERMES_ENABLE_DEBUGGER=ON',
     '-DHERMES_ENABLE_INTL=OFF', '-DICU_INCLUDE_DIR=' + str(headers),
     '-DICU_UC_LIBRARY_RELEASE=' + str(icu / 'libicuuc.so.74'),
     '-DICU_I18N_LIBRARY_RELEASE=' + str(icu / 'libicui18n.so.74'),
     '-DICU_DATA_LIBRARY_RELEASE=' + str(icu / 'libicudata.so.74')],
    [str(ninja), '-C', str(build), '-j' + str(args.jobs), 'hermes','hvm','hbcdump','libhermes'],
    ['g++', '-std=c++17', '-O2', str(source_runner),
     '-I' + str(source / 'API'), '-I' + str(source / 'API/jsi'), '-I' + str(source / 'public'),
     '-L' + str(build / 'API/hermes'), '-Wl,-rpath,' + str(build / 'API/hermes'), '-lhermes',
     '-L' + str(build / 'jsi'), '-Wl,-rpath,' + str(build / 'jsi'), '-ljsi',
     '-o', str(tools / 'hermes-runner')],
]
(tools / 'runtime-rebuild-commands.json').write_text(json.dumps(commands,indent=2)+'\n')
for command in commands:
    subprocess.run(command, check=True)
