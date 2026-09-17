#!/usr/bin/env python3
"""Acquire the exact matching public Expo development fixture. Never generates keys or signs.
Raw fixture goes only to the caller's restricted local directory, never the evidence directory.
"""
import argparse, hashlib, json, os, re, subprocess, urllib.request
from pathlib import Path

COMMIT = 'b26166dcfece76b91a682aead1838282df4a1318'
BASE = f'https://raw.githubusercontent.com/expo/expo/{COMMIT}/templates/expo-template-bare-minimum/android/app/'
FIXTURE_HASH = '221e0a3106aa4c3ccc154e0a418b55020b3f9ea6e84f92e8749cd9e2f39f5e58'
CONFIG_HASH = '82e4c3b15f3727d937918e96ecabb1fbf7f96abc463e33b21e4c6bbfbf79019d'


def acquire(name, expected):
    with urllib.request.urlopen(BASE + name, timeout=30) as response:
        data = response.read()
    if hashlib.sha256(data).hexdigest() != expected:
        raise RuntimeError('PINNED_INPUT_HASH_MISMATCH:' + name)
    return data


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--restricted-directory', type=Path, required=True)
    p.add_argument('--evidence-directory', type=Path, required=True)
    a = p.parse_args()
    a.restricted_directory.mkdir(parents=True, exist_ok=False, mode=0o700)
    a.evidence_directory.mkdir(parents=True, exist_ok=True)
    fixture = acquire('debug.keystore', FIXTURE_HASH)
    if len(fixture) != 2257:
        raise RuntimeError('FIXTURE_SIZE_MISMATCH')
    location = a.restricted_directory / 'expo-sdk54-template-debug.keystore'
    fd = os.open(location, os.O_CREAT | os.O_EXCL | os.O_WRONLY, 0o600)
    with os.fdopen(fd, 'wb') as target:
        target.write(fixture)
    config_bytes = acquire('build.gradle', CONFIG_HASH)
    config_location = a.restricted_directory / 'expo-sdk54-template-build.gradle'
    fd = os.open(config_location, os.O_CREAT | os.O_EXCL | os.O_WRONLY, 0o600)
    with os.fdopen(fd, 'wb') as target:
        target.write(config_bytes)
    config = config_bytes.decode('utf-8')
    store = re.search(r'storePassword\s+[\'\"]([^\'\"]+)', config)
    key = re.search(r'keyPassword\s+[\'\"]([^\'\"]+)', config)
    if store is None or key is None or store.group(1) != key.group(1):
        raise RuntimeError('PUBLIC_FIXTURE_CONFIGURATION_MISMATCH')
    cert = a.evidence_directory / 'matching-public-certificate.der'
    result = subprocess.run(['java', str(Path(__file__).with_name('VerifyFixture.java')), str(location), str(cert)],
                            input=(store.group(1) + '\n').encode(), capture_output=True)
    if result.returncode != 0:
        raise RuntimeError('OFFLINE_PRIVATE_PUBLIC_MATCH_FAILED')
    verified = json.loads(result.stdout)
    report = {'format': 'solaris-v6-603-fixture-readiness/1', 'officialCommit': COMMIT,
              'fixtureUrl': BASE + 'debug.keystore', 'fixtureSha256': FIXTURE_HASH, 'fixtureBytes': len(fixture),
              'configurationUrl': BASE + 'build.gradle', 'configurationSha256': CONFIG_HASH,
              'localRestrictedFixturePath': str(location), 'localRestrictedConfigurationPath': str(config_location), 'fixtureFileMode': oct(location.stat().st_mode & 0o777),
              'source': 'Shared public Expo SDK54 development signing fixture; not exclusive production custody',
              'generatedOrChangedKey': False, 'fixtureExcludedFromDownloadArchives': True,
              'credentialsLogged': False, 'publicConfigurationSavedOnlyInRestrictedDirectory': True, **verified}
    (a.evidence_directory / 'FIXTURE-READINESS.json').write_text(json.dumps(report, indent=2) + '\n')
    print(json.dumps(report, indent=2))


if __name__ == '__main__':
    main()
