#!/usr/bin/env python3
"""Extract the exact retained EMBLEM and FOREST_SANCTUARY artwork for the U0 preview.

Reads the frozen host UI (never writes it), decodes the two inline PNG data
URLs byte-for-byte and writes them to candidate/onboarding/preview/.assets/,
which is gitignored: the PNGs are not committed.

Fails closed (exit 1, nothing written) when:
  - the source file is missing or its SHA-256 is not the frozen import hash;
  - either constant is absent, duplicated, not strict base64, or not a PNG;
  - either decoded asset's SHA-256 differs from the contract's identity.

Usage: python3 tools/onboarding/extract-assets.py [--source PATH] [--out DIR]
"""
from __future__ import annotations

import argparse
import base64
import binascii
import hashlib
import json
import os
import re
import sys
import tempfile
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
DEFAULT_SOURCE = REPO / 'Solaris-Android-R4' / 'ui' / 'sanctuary.html'
DEFAULT_OUT = REPO / 'candidate' / 'onboarding' / 'preview' / '.assets'

# docs/provenance/REPO-IMPORT-MANIFEST.json entry for Solaris-Android-R4/ui/sanctuary.html
SOURCE_SHA256 = '1dd45155ee400b7316d32c30856d2b3394680e98af7148bca29e5610879dbab4'
# docs/reports/WELCOME-AND-ONBOARDING-CONTRACT-2026-09-18.md, "Visual contract"
ASSETS = {
    'EMBLEM': ('emblem.png', '1f85d6630a2acd377871288f75031a17aef0ae7d0978b105a935406fa1facec3'),
    'FOREST_SANCTUARY': ('forest_sanctuary.png', 'e7bd6d01e2278259882250175dc9f453920c595625e45eb40a6acafb19adeef4'),
}
PNG_SIGNATURE = b'\x89PNG\r\n\x1a\n'


def fail(message: str) -> int:
    print(f'FAIL: {message}', file=sys.stderr)
    return 1


def extract(text: str, constant: str) -> bytes:
    pattern = re.compile(r'\bconst ' + re.escape(constant) + r'="data:image/png;base64,([A-Za-z0-9+/=]+)"')
    matches = pattern.findall(text)
    if len(matches) != 1:
        raise ValueError(f'{constant}: expected exactly one inline PNG data URL, found {len(matches)}')
    try:
        data = base64.b64decode(matches[0], validate=True)
    except binascii.Error as error:
        raise ValueError(f'{constant}: not strict base64 ({error})') from error
    if not data.startswith(PNG_SIGNATURE):
        raise ValueError(f'{constant}: decoded bytes are not a PNG')
    return data


def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument('--source', type=Path, default=DEFAULT_SOURCE)
    parser.add_argument('--out', type=Path, default=DEFAULT_OUT)
    args = parser.parse_args(argv)

    if not args.source.is_file():
        return fail(f'source not found: {args.source}')
    raw = args.source.read_bytes()
    source_sha = hashlib.sha256(raw).hexdigest()
    if source_sha != SOURCE_SHA256:
        return fail(f'source SHA-256 {source_sha} is not the frozen import hash {SOURCE_SHA256}')
    text = raw.decode('utf-8')

    decoded: dict[str, bytes] = {}
    for constant, (name, expected) in ASSETS.items():
        try:
            data = extract(text, constant)
        except ValueError as error:
            return fail(str(error))
        actual = hashlib.sha256(data).hexdigest()
        if actual != expected:
            return fail(f'{constant}: SHA-256 {actual} does not match the contract identity {expected}')
        decoded[name] = data

    # Only after every check passed is anything written, and each file atomically.
    args.out.mkdir(parents=True, exist_ok=True)
    report = []
    for constant, (name, expected) in ASSETS.items():
        data = decoded[name]
        target = args.out / name
        fd, tmp = tempfile.mkstemp(dir=args.out, prefix=f'.{name}.')
        try:
            with os.fdopen(fd, 'wb') as handle:
                handle.write(data)
            os.chmod(tmp, 0o644)
            os.replace(tmp, target)
        finally:
            if os.path.exists(tmp):
                os.unlink(tmp)
        written = hashlib.sha256(target.read_bytes()).hexdigest()
        if written != expected:
            return fail(f'{target}: written bytes do not match {expected}')
        report.append({'constant': constant, 'file': name, 'bytes': len(data), 'sha256': written})

    print(json.dumps({'source_sha256': source_sha, 'out': str(args.out), 'assets': report}, indent=2))
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
