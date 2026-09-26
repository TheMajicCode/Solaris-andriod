#!/usr/bin/env python3
"""Sign only this reviewed binary-patched candidate after an explicit hash-bound root gate.
Never installs, resets data, generates keys, pushes or deploys. Credentials are in-process only.
"""
import argparse
import hashlib
import json
import re
import subprocess
import sys
import urllib.request
from pathlib import Path

UNSIGNED_SHA = '8f0246f04150747ee671e1945781410689f3a5b18f7623f498cecee7ff44206d'
HBC_SHA = 'fd8b38bcdd42421c18da4a0b69b2d58906ceddd7c4a2044b34faed51490f4653'
FIXTURE_SHA = '221e0a3106aa4c3ccc154e0a418b55020b3f9ea6e84f92e8749cd9e2f39f5e58'
PACKAGER_SHA = '54a88a21cbeb3e7e93ad33d4df9b8987f5e4c49c542f82e3b1a88e2b712df2a7'
CONFIG_SHA = '82e4c3b15f3727d937918e96ecabb1fbf7f96abc463e33b21e4c6bbfbf79019d'
CONFIG_URL = ('https://raw.githubusercontent.com/expo/expo/b26166dcfece76b91a682aead1838282df4a1318/'
              'templates/expo-template-bare-minimum/android/app/build.gradle')


def digest(path):
    with Path(path).open('rb') as f:
        return hashlib.file_digest(f, 'sha256').hexdigest()


def require(condition, code):
    if not condition:
        raise RuntimeError(code)


def main():
    p = argparse.ArgumentParser(description=__doc__)
    for name in ['unsigned-apk', 'baseline', 'patched-hbc', 'tools-dir', 'fixture', 'gate', 'output-dir']:
        p.add_argument('--' + name, type=Path, required=True)
    p.add_argument('--gate-sha256', required=True)
    p.add_argument('--execute-reviewed-signing', action='store_true', required=True)
    a = p.parse_args()
    require(a.execute_reviewed_signing, 'EXPLICIT_SIGNING_REQUIRED')
    require(digest(a.gate) == a.gate_sha256, 'GATE_HASH')
    gate = json.loads(a.gate.read_text())
    require(gate['decision'] == 'approve-signing', 'GATE_DECISION')
    require(gate['unsignedApkSha256'] == UNSIGNED_SHA and gate['patchedHbcSha256'] == HBC_SHA, 'GATE_PAYLOADS')
    require(gate['packageId'] == 'org.solarishealth.edge.recovery' and gate['versionCode'] == 602, 'GATE_IDENTITY')
    require(gate['signingScriptSha256'] == digest(Path(__file__)), 'GATE_SIGNING_SCRIPT')
    require(len(gate['independentReviews']) >= 2, 'GATE_REVIEWS')
    for review in gate['independentReviews']:
        require(digest(review['path']) == review['sha256'] and Path(review['path']).stat().st_size > 0,
                'GATE_REVIEW_HASH')
    require(digest(a.unsigned_apk) == UNSIGNED_SHA and digest(a.patched_hbc) == HBC_SHA, 'PAYLOAD_HASH')
    require(digest(a.fixture) == FIXTURE_SHA and (a.fixture.stat().st_mode & 0o077) == 0, 'FIXTURE_HASH_OR_PERMISSIONS')
    packager = Path(__file__).with_name('package-candidate.py')
    require(digest(packager) == PACKAGER_SHA, 'PACKAGER_SOURCE_HASH')
    a.output_dir.mkdir(parents=True, exist_ok=False)
    verify = [sys.executable, str(packager), '--baseline', str(a.baseline), '--patched-hbc', str(a.patched_hbc),
              '--tools-dir', str(a.tools_dir)]
    pre = subprocess.run(verify + ['--verify-apk', str(a.unsigned_apk), '--output-dir', str(a.output_dir / 'pre-sign-verification')],
                         capture_output=True, text=True)
    (a.output_dir / 'pre-sign-verification.txt').write_text(pre.stdout + pre.stderr)
    require(pre.returncode == 0, 'PRE_SIGN_VERIFICATION')
    with urllib.request.urlopen(CONFIG_URL, timeout=30) as response:
        config_bytes = response.read()
    require(hashlib.sha256(config_bytes).hexdigest() == CONFIG_SHA, 'PINNED_CONFIGURATION_HASH')
    config = config_bytes.decode('utf-8')
    store = re.search(r'storePassword\s+[\'\"]([^\'\"]+)', config)
    key = re.search(r'keyPassword\s+[\'\"]([^\'\"]+)', config)
    require(store is not None and key is not None, 'PINNED_CONFIGURATION_CREDENTIALS')
    credentials = (store.group(1) + '\n' + key.group(1) + '\n').encode()
    candidate = a.output_dir / 'Solaris-V6.0.2-Sanctuary-Guards-Candidate.apk'
    command = ['java', '-jar', str(a.tools_dir / 'lib/apksigner.jar'), 'sign', '--ks', str(a.fixture),
               '--ks-pass', 'stdin', '--key-pass', 'stdin', '--v1-signing-enabled', 'false',
               '--v2-signing-enabled', 'true', '--v3-signing-enabled', 'false', '--v4-signing-enabled', 'false',
               '--out', str(candidate), str(a.unsigned_apk)]
    result = subprocess.run(command, input=credentials, capture_output=True)
    del credentials, store, key, config, config_bytes
    (a.output_dir / 'signing-command.json').write_text(json.dumps(command, indent=2) + '\n')
    (a.output_dir / 'signing-output.txt').write_bytes(result.stdout + result.stderr)
    require(result.returncode == 0, 'SIGNING_FAILED')
    final = subprocess.run(verify + ['--verify-apk', str(candidate), '--require-signature', '--output-dir', str(a.output_dir / 'post-sign-verification')],
                           capture_output=True, text=True)
    (a.output_dir / 'post-sign-verification.txt').write_text(final.stdout + final.stderr)
    require(final.returncode == 0, 'POST_SIGN_VERIFICATION')
    report = json.loads((a.output_dir / 'post-sign-verification/PACKAGING-RESULT.json').read_text())
    report.update({'format': 'solaris-v6-602-signed-candidate-result/1', 'signingPerformedByThisTool': True,
                   'gateSha256': a.gate_sha256, 'sharedPublicDevelopmentSigner': True,
                   'keystoreAndCredentialsPackaged': False, 'signingScheme': 'v2 only'})
    (a.output_dir / 'SIGNED-CANDIDATE-RESULT.json').write_text(json.dumps(report, indent=2) + '\n')
    print(json.dumps(report, indent=2))


if __name__ == '__main__':
    main()
