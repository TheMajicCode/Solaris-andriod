#!/usr/bin/env python3
"""Targeted packaging integrity and signing-gate rejection tests; never signs."""
import copy
import hashlib
import importlib.util
import json
import struct
import subprocess
import sys
import tempfile
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
BASELINE = Path('/workspace/scratch/7a1f5a13b137/apk-602-download/Solaris-V6.0.2-Sanctuary-Guards-Candidate.apk')
spec = importlib.util.spec_from_file_location('packager603', ROOT / 'tools/package-candidate.py')
packager = importlib.util.module_from_spec(spec)
spec.loader.exec_module(packager)
cases = []


def expect_error(name, action, code):
    try:
        action()
    except RuntimeError as error:
        assert str(error) == code, (name, str(error), code)
    else:
        raise AssertionError('Did not reject ' + name)
    cases.append({'name': name, 'outcome': 'pass', 'expectedError': code})


with zipfile.ZipFile(BASELINE) as archive:
    manifest = archive.read(packager.MANIFEST)
    config = archive.read(packager.CONFIG)
    _, _, _, original_strings = packager.pool_strings(manifest)
    patched, details = packager.patch_manifest(manifest)
    _, _, _, new_strings = packager.pool_strings(patched)
    assert packager.version_code_offset(manifest, original_strings) == 6728
    assert packager.version_code_offset(patched, new_strings) == 6720
    assert struct.unpack_from('<I', patched, 6720)[0] == 603
    assert details['allOtherXmlNodeBytesUnchanged'] and details['allOtherStringsUnchanged']
    cases.append({'name': 'dynamic-version-attribute-after-negative-string-pool-growth', 'outcome': 'pass'})
    assert json.loads(packager.patch_config(config))['android']['versionCode'] == 603
    cases.append({'name': 'config-only-version-fields-changed', 'outcome': 'pass'})
    corrupted = bytearray(manifest)
    corrupted[-1] ^= 1
    expect_error('manifest-hash-mismatch', lambda: packager.patch_manifest(corrupted), 'BASELINE_MANIFEST_HASH')
    corrupted = bytearray(manifest)
    struct.pack_into('<I', corrupted, 6712, 0xffffffff)
    expect_error('version-code-namespace-mismatch', lambda: packager.version_code_offset(corrupted, original_strings),
                 'AXML_VERSION_CODE_NAMESPACE')

with tempfile.TemporaryDirectory(prefix='solaris603-packaging-checks-') as scratch:
    temporary = Path(scratch)
    hbc = ROOT / 'evidence/packaging-prep/diagnostics-structural-probe.hbc'
    declaration = json.loads((ROOT / 'evidence/packaging-prep/structural-probe-build-manifest.json').read_text())
    test_manifest = temporary / 'build.json'
    for key, value, error in [('versionCode', 604, 'BUILD_MANIFEST_IDENTITY'),
                              ('patchedHbcSha256', '0' * 64, 'PATCHED_HBC_HASH_OR_SIZE'),
                              ('patchedHbcBytes', hbc.stat().st_size + 1, 'PATCHED_HBC_HASH_OR_SIZE')]:
        test_value = dict(declaration, **{key: value})
        test_manifest.write_text(json.dumps(test_value))
        expect_error('build-manifest-' + key, lambda: packager.read_build_manifest(test_manifest, hbc), error)
    test_manifest.write_text(json.dumps(declaration))

    # A changed native payload must be rejected, even when the three allowed replacements are correct.
    tiny = temporary / 'payload.zip'
    replacements = {key: b'replacement' for key in packager.CHANGED}
    with zipfile.ZipFile(tiny, 'w') as archive:
        for key, data in replacements.items():
            archive.writestr(key, data)
        archive.writestr('lib/arm64-v8a/example.so', b'changed-native-data')
    before = packager.inventory(tiny)
    before['lib/arm64-v8a/example.so']['sha256'] = hashlib.sha256(b'original-native-data').hexdigest()
    expect_error('unexpected-native-payload-change', lambda: packager.verify_payload(tiny, before, replacements),
                 'UNEXPECTED_PAYLOAD_CHANGE:lib/arm64-v8a/example.so')

    unsigned = ROOT / 'evidence/packaging-prep/unsigned-structural-probe/candidate-aligned-unsigned.apk'
    signer = ROOT / 'tools/sign-reviewed-candidate.py'
    review_one, review_two = temporary / 'review1.md', temporary / 'review2.md'
    review_one.write_text('Synthetic gate rejection input; not an approval.\n')
    review_two.write_text('Second synthetic gate rejection input; not an approval.\n')
    gate = {'format': 'solaris-v6-603-signing-gate/1', 'decision': 'approve-signing',
            'baselineApkSha256': packager.BASELINE_APK, 'packageId': packager.PACKAGE, 'versionCode': 603,
            'versionName': packager.VERSION, 'expectedCertificateSha256': packager.CERTIFICATE,
            'buildManifestSha256': packager.file_sha(test_manifest),
            'patchedHbcSha256': declaration['patchedHbcSha256'], 'unsignedApkSha256': packager.file_sha(unsigned),
            'signingScriptSha256': packager.file_sha(signer),
            'packagingScriptSha256': packager.file_sha(ROOT / 'tools/package-candidate.py'),
            'independentReviews': [{'reviewer': 'synthetic-one', 'decision': 'approve', 'path': str(review_one),
                                    'sha256': packager.file_sha(review_one)},
                                   {'reviewer': 'synthetic-two', 'decision': 'approve', 'path': str(review_two),
                                    'sha256': packager.file_sha(review_two)}]}
    variants = []
    rejected = copy.deepcopy(gate); rejected['decision'] = 'reject'; variants.append(('denied-gate', rejected, 'GATE_DECISION'))
    rejected = copy.deepcopy(gate); rejected['unsignedApkSha256'] = '0' * 64; variants.append(('wrong-apk-hash', rejected, 'GATE_UNSIGNED_APK'))
    rejected = copy.deepcopy(gate); rejected['independentReviews'] = rejected['independentReviews'][:1]; variants.append(('missing-review', rejected, 'GATE_REVIEW_COUNT'))
    rejected = copy.deepcopy(gate); rejected['independentReviews'][1]['reviewer'] = 'synthetic-one'; variants.append(('duplicate-reviewer', rejected, 'GATE_REVIEW_INDEPENDENCE'))
    rejected = copy.deepcopy(gate); rejected['independentReviews'][1]['path'] = str(review_one); variants.append(('duplicate-review-file', rejected, 'GATE_DUPLICATE_REVIEW_PATH'))
    rejected = copy.deepcopy(gate); rejected['independentReviews'][1]['sha256'] = '0' * 64; variants.append(('changed-review', rejected, 'GATE_REVIEW_HASH'))
    for name, invalid_gate, error in variants:
        gate_path = temporary / 'gate.json'; gate_path.write_text(json.dumps(invalid_gate))
        output = temporary / ('must-not-exist-' + name)
        command = [sys.executable, str(signer), '--unsigned-apk', str(unsigned), '--baseline', str(BASELINE),
                   '--patched-hbc', str(hbc), '--build-manifest', str(test_manifest),
                   '--tools-dir', str(temporary / 'missing-tools'), '--fixture', str(temporary / 'missing-key'),
                   '--fixture-config', str(temporary / 'missing-config'), '--gate', str(gate_path),
                   '--gate-sha256', packager.file_sha(gate_path), '--output-dir', str(output), '--execute-reviewed-signing']
        result = subprocess.run(command, capture_output=True, text=True)
        assert result.returncode != 0 and ('RuntimeError: ' + error) in result.stderr, (name, result.stderr)
        assert not output.exists(), 'Gate rejection must precede signing outputs'
        cases.append({'name': name, 'outcome': 'pass', 'expectedError': error})

report = {'format': 'solaris603-packaging-prep-targeted-tests/1', 'passed': len(cases), 'failed': 0,
          'packagingScriptSha256': packager.file_sha(ROOT / 'tools/package-candidate.py'),
          'signingScriptSha256': packager.file_sha(ROOT / 'tools/sign-reviewed-candidate.py'),
          'signingPerformed': False, 'cases': cases}
Path(__file__).with_name('targeted-test-result.json').write_text(json.dumps(report, indent=2) + '\n')
print(json.dumps(report, indent=2))
