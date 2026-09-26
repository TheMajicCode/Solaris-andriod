#!/usr/bin/env python3
"""Source-only checks for the Solaris Android repository projection.

This is NOT the frozen import verifier and NOT a full-reference gate.

  * docs/provenance/import-pack/verify-import.py verifies the frozen transport
    pack in its own unchanged extracted directory. It cannot run here, because
    this repository deliberately adds documentation, governance and CI. The
    `frozen-integrity` check is its equivalent for this projection.
  * The complete 604 handoff's verifier and reproduction harness run only
    against the restored immutable reference directory, never against this tree.

Every check here fails closed. A missing dependency, an empty scope or an
unexpected error is a FAILURE, never a skip and never a pass. A pass means the
imported bytes are intact and the tracked text parses. It establishes nothing
about application security, licensing, native build completeness or release
readiness.

Usage:
    python3 tools/repo-check.py [--json] [--report PATH]
"""
from __future__ import annotations

import argparse
import json
import subprocess
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO / 'tools'))

from solaris_checks.checks import run_all  # noqa: E402


def tracked_files() -> list[str]:
    out = subprocess.run(['git', '-C', str(REPO), 'ls-files', '-z'],
                         capture_output=True, text=True, check=True).stdout
    return [p for p in out.split('\0') if p]


def render(report: dict) -> str:
    lines = [f"Solaris Android source-only repository checks — {report['tracked_files']} tracked files", '']
    for item in report['checks']:
        lines.append(f"[{item['status']:<14}] {item['check']}  "
                     f"({item['files_examined']}/{item['files_expected']} files)")
        lines.append(f"                 {item['scope']}")
        for finding in item['findings'][:25]:
            lines.append(f'                 - {finding}')
        if len(item['findings']) > 25:
            lines.append(f"                 - ... and {len(item['findings']) - 25} more")
    lines += ['', 'Blocked — these need inputs that are deliberately absent here.',
              'A blocked gate is never a pass and never an Android build:']
    for gate in report['blocked']:
        lines.append(f"  [BLOCKED] {gate['check']}")
        lines.append(f"            {gate['reason']}")
    lines += ['', f"Overall: {report['status']}"]
    if report['failed_checks']:
        lines.append(f"Failed checks: {', '.join(report['failed_checks'])}")
    lines += ['A pass proves preserved bytes and parseable text only. It does not prove security,',
              'licensing, native build completeness, device behaviour or production readiness.']
    return '\n'.join(lines)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__,
                                     formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--json', action='store_true', help='emit the machine-readable report on stdout')
    parser.add_argument('--report', metavar='PATH',
                        help='also write the machine-readable report to PATH (exit status is unchanged)')
    args = parser.parse_args()

    report = run_all(REPO, tracked_files())

    if args.report:
        Path(args.report).write_text(json.dumps(report, indent=2) + '\n', encoding='utf-8')
    print(json.dumps(report, indent=2) if args.json else render(report))
    return 1 if report['status'] != 'PASS' else 0


if __name__ == '__main__':
    raise SystemExit(main())
