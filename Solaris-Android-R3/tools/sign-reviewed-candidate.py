#!/usr/bin/env python3
"""Sign candidate 603 only after the caller supplies a hash-bound gate and two independent reviews.
Never installs, resets data, generates keys, pushes or deploys. Reads pinned local public fixture inputs.
"""
import argparse
import hashlib
import json
import re
import subprocess
import sys
from pathlib import Path

BASELINE_SHA = '01da9f5281f5f92230dcbd64da62484557cc7a0a15e876cc2d99ec7ec3bcd2cd'
FIXTURE_SHA = '221e0a3106aa4c3ccc154e0a418b55020b3f9ea6e84f92e8749cd9e2f39f5e58'
CONFIG_SHA = '82e4c3b15f3727d937918e96ecabb1fbf7f96abc463e33b21e4c6bbfbf79019d'
PACKAGE = 'org.solarishealth.edge.recovery'
VERSION = '6.0.3-preview.pocket-chat'
CERTIFICATE = 'fac61745dc0903786fb9ede62a962b399f7348f0bb6f899b8332667591033b9c'


def digest(path):
    with Path(path).open('rb') as stream:
        return hashlib.file_digest(stream, 'sha256').hexdigest()


def require(condition, code):
    if not condition:
        raise RuntimeError(code)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    for name in ['unsigned-apk', 'baseline', 'patched-hbc', 'build-manifest', 'tools-dir',
                 'fixture', 'fixture-config', 'gate', 'output-dir']:
        parser.add_argument('--' + name, type=Path, required=True)
    parser.add_argument('--gate-sha256', required=True)
    parser.add_argument('--execute-reviewed-signing', action='store_true', required=True)
    args = parser.parse_args()
    require(args.execute_reviewed_signing, 'EXPLICIT_SIGNING_REQUIRED')
    require(digest(args.gate) == args.gate_sha256, 'GATE_HASH')
    gate = json.loads(args.gate.read_text())
    require(gate['format'] == 'solaris-v6-603-signing-gate/1' and gate['decision'] == 'approve-signing',
            'GATE_DECISION')
    require(gate['baselineApkSha256'] == BASELINE_SHA and digest(args.baseline) == BASELINE_SHA,
            'GATE_BASELINE')
    require(gate['packageId'] == PACKAGE and gate['versionCode'] == 603 and gate['versionName'] == VERSION,
            'GATE_IDENTITY')
    require(gate['expectedCertificateSha256'] == CERTIFICATE, 'GATE_SIGNING_IDENTITY')
    require(gate['buildManifestSha256'] == digest(args.build_manifest), 'GATE_BUILD_MANIFEST')
    build = json.loads(args.build_manifest.read_text())
    require(gate['patchedHbcSha256'] == build['patchedHbcSha256'] == digest(args.patched_hbc), 'GATE_HBC')
    require(gate['unsignedApkSha256'] == digest(args.unsigned_apk), 'GATE_UNSIGNED_APK')
    require(gate['signingScriptSha256'] == digest(Path(__file__)), 'GATE_SIGNING_SCRIPT')
    packager = Path(__file__).with_name('package-candidate.py')
    require(gate['packagingScriptSha256'] == digest(packager), 'GATE_PACKAGING_SCRIPT')
    reviews = gate['independentReviews']
    require(len(reviews) >= 2, 'GATE_REVIEW_COUNT')
    reviewers, review_paths = set(), set()
    for review in reviews:
        require(isinstance(review['reviewer'], str) and review['reviewer'].strip(), 'GATE_REVIEWER')
        require(review['reviewer'] not in reviewers and review['decision'] == 'approve', 'GATE_REVIEW_INDEPENDENCE')
        require(str(Path(review['path']).resolve()) not in review_paths, 'GATE_DUPLICATE_REVIEW_PATH')
        reviewers.add(review['reviewer'])
        review_paths.add(str(Path(review['path']).resolve()))
        require(digest(review['path']) == review['sha256'] and Path(review['path']).stat().st_size > 0,
                'GATE_REVIEW_HASH')
    require(digest(args.fixture) == FIXTURE_SHA and (args.fixture.stat().st_mode & 0o077) == 0,
            'FIXTURE_HASH_OR_PERMISSIONS')
    require(digest(args.fixture_config) == CONFIG_SHA and (args.fixture_config.stat().st_mode & 0o077) == 0,
            'FIXTURE_CONFIG_HASH_OR_PERMISSIONS')
    args.output_dir.mkdir(parents=True, exist_ok=False)
    verify = [sys.executable, str(packager), '--baseline', str(args.baseline), '--patched-hbc', str(args.patched_hbc),
              '--build-manifest', str(args.build_manifest), '--tools-dir', str(args.tools_dir)]
    pre = subprocess.run(verify + ['--verify-apk', str(args.unsigned_apk), '--output-dir',
                                  str(args.output_dir / 'pre-sign-verification')], capture_output=True, text=True)
    (args.output_dir / 'pre-sign-verification.txt').write_text(pre.stdout + pre.stderr)
    require(pre.returncode == 0, 'PRE_SIGN_VERIFICATION')
    config = args.fixture_config.read_text()
    store = re.search(r'storePassword\s+[\'\"]([^\'\"]+)', config)
    key = re.search(r'keyPassword\s+[\'\"]([^\'\"]+)', config)
    require(store is not None and key is not None, 'PINNED_CONFIGURATION_CREDENTIALS')
    credentials = (store.group(1) + '\n' + key.group(1) + '\n').encode()
    candidate = args.output_dir / 'Solaris-V6.0.3-Pocket-Chat-Candidate.apk'
    command = ['java', '-jar', str(args.tools_dir / 'lib/apksigner.jar'), 'sign', '--ks', str(args.fixture),
               '--ks-pass', 'stdin', '--key-pass', 'stdin', '--v1-signing-enabled', 'false',
               '--v2-signing-enabled', 'true', '--v3-signing-enabled', 'false', '--v4-signing-enabled', 'false',
               '--out', str(candidate), str(args.unsigned_apk)]
    require(digest(args.unsigned_apk) == gate['unsignedApkSha256'], 'UNSIGNED_CHANGED_BEFORE_SIGNING')
    result = subprocess.run(command, input=credentials, capture_output=True)
    del credentials, store, key, config
    (args.output_dir / 'signing-command.json').write_text(json.dumps(command, indent=2) + '\n')
    (args.output_dir / 'signing-output.txt').write_bytes(result.stdout + result.stderr)
    require(result.returncode == 0, 'SIGNING_FAILED')
    final = subprocess.run(verify + ['--verify-apk', str(candidate), '--require-signature', '--output-dir',
                                    str(args.output_dir / 'post-sign-verification')], capture_output=True, text=True)
    (args.output_dir / 'post-sign-verification.txt').write_text(final.stdout + final.stderr)
    require(final.returncode == 0, 'POST_SIGN_VERIFICATION')
    report = json.loads((args.output_dir / 'post-sign-verification/PACKAGING-RESULT.json').read_text())
    report.update({'format': 'solaris-v6-603-signed-candidate-result/1', 'signingPerformedByThisTool': True,
                   'gateSha256': args.gate_sha256, 'sharedPublicDevelopmentSigner': True,
                   'keystoreAndCredentialsPackaged': False, 'signingScheme': 'v2 only'})
    (args.output_dir / 'SIGNED-CANDIDATE-RESULT.json').write_text(json.dumps(report, indent=2) + '\n')
    print(json.dumps(report, indent=2))


if __name__ == '__main__':
    main()
