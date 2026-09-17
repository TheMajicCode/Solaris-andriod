#!/usr/bin/env python3
"""Negative release-tool gates, with temporary synthetic inputs and no signing."""
import argparse, hashlib, json, subprocess, sys, tempfile
from pathlib import Path

p = argparse.ArgumentParser()
p.add_argument('--project', type=Path, required=True)
p.add_argument('--baseline', type=Path, required=True)
p.add_argument('--tools', type=Path, required=True)
p.add_argument('--report', type=Path, required=True)
a = p.parse_args()
records = []
with tempfile.TemporaryDirectory(prefix='solaris-packaging-negative-') as directory:
    temporary = Path(directory)
    wrong_hbc = temporary / 'wrong.hbc'
    wrong_hbc.write_bytes(b'nonmatching synthetic input')
    output = temporary / 'must-not-exist'
    command = [sys.executable, str(a.project / 'tools/package-candidate.py'), '--baseline', str(a.baseline),
               '--patched-hbc', str(wrong_hbc), '--tools-dir', str(a.tools), '--output-dir', str(output)]
    result = subprocess.run(command, capture_output=True, text=True)
    assert result.returncode != 0 and 'PATCHED_HBC_HASH' in result.stderr and not output.exists()
    records.append({'test': 'unreviewed HBC rejected before creating candidate directory', 'passed': True})
    gate = temporary / 'not-approved.json'
    gate.write_text(json.dumps({'decision': 'not-approved'}))
    command = [sys.executable, str(a.project / 'tools/sign-reviewed-candidate.py'), '--unsigned-apk', str(wrong_hbc),
               '--baseline', str(a.baseline), '--patched-hbc', str(wrong_hbc), '--tools-dir', str(a.tools),
               '--fixture', str(temporary / 'does-not-exist'), '--gate', str(gate), '--output-dir', str(output),
               '--gate-sha256', hashlib.sha256(gate.read_bytes()).hexdigest(), '--execute-reviewed-signing']
    result = subprocess.run(command, capture_output=True, text=True)
    assert result.returncode != 0 and 'GATE_DECISION' in result.stderr and not output.exists()
    records.append({'test': 'unapproved gate rejected before fixture access or output creation', 'passed': True})
    command[command.index('--gate-sha256') + 1] = '0' * 64
    result = subprocess.run(command, capture_output=True, text=True)
    assert result.returncode != 0 and 'GATE_HASH' in result.stderr and not output.exists()
    records.append({'test': 'changed review gate rejected before output creation', 'passed': True})
report = {'format': 'solaris-packaging-negative-tests/1', 'tests': records,
          'allPassed': True, 'signingPerformed': False, 'deviceUsed': False}
a.report.write_text(json.dumps(report, indent=2) + '\n')
print(json.dumps(report, indent=2))
