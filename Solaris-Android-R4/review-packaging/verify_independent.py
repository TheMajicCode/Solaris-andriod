#!/usr/bin/env python3
"""Independent 604 archive/identity reviewer. Never imports packaging code or signs."""
import argparse
import copy
import hashlib
import json
import re
import struct
import subprocess
import zipfile
from pathlib import Path

BASE_SHA = '25d3642ab5f45986e5dfcfe5c5413d40982c6142eb703adffc391f9d3b033227'
BASE_HBC_SHA = 'b8ac7d1b58d9e8ea6eadd25de516e35842aea14e4b849462664bb3200fedc990'
CERT_SHA = 'fac61745dc0903786fb9ede62a962b399f7348f0bb6f899b8332667591033b9c'
PACKAGE = 'org.solarishealth.edge.recovery'
OLD_VERSION, NEW_VERSION = '6.0.3-preview.pocket-chat', '6.0.4-preview.grounded-chat'
ALLOWED_CHANGES = {'AndroidManifest.xml', 'assets/app.config', 'assets/index.android.bundle'}
TOOL_SHA = {
    'zipalign': 'c5f559e946de5a9e7d58792181db20383b228877812136bc469d97ae00a43b0a',
    'aapt2': '1a6a396b9cd071f7040071fdd108718cb98c3c9f4960044f373b288993d19eb7',
    'lib/apksigner.jar': '3716d9311e55d2b0918a2fd9d54ba9e406c5f6abeea700b287f11259bc163dec',
    'lib64/libc++.so': '96a19cd2154a4423a61f8444e5d3148a608fa3033bc1a22285d19855a950d05a',
}
checks, commands = [], {}


def check(name, condition):
    if not condition:
        raise AssertionError(name)
    checks.append(name)


def file_hash(path):
    with Path(path).open('rb') as f:
        return hashlib.file_digest(f, 'sha256').hexdigest()


def data_hash(data):
    return hashlib.sha256(data).hexdigest()


def run(label, command):
    r = subprocess.run([str(x) for x in command], capture_output=True, text=True)
    commands[label] = {'exit': r.returncode, 'stdout': r.stdout, 'stderr': r.stderr}
    return r


def xml_chunks(data, label):
    check(label + ' XML file header', struct.unpack_from('<HHI', data) == (3, 8, len(data)))
    result, pos = [], 8
    while pos < len(data):
        kind, head, size = struct.unpack_from('<HHI', data, pos)
        check(label + f' chunk bounds {pos}', size >= head >= 8 and pos + size <= len(data))
        result.append((kind, head, data[pos:pos+size]))
        pos += size
    check(label + ' XML end', pos == len(data))
    return result


def decode_pool(chunk, label):
    kind, head, raw = chunk
    check(label + ' pool header', (kind, head) == (1, 28))
    count, styles, flags, start, style_start = struct.unpack_from('<5I', raw, 8)
    check(label + ' pool format', styles == style_start == flags == 0 and start >= head+4*count)
    strings = []
    for i in range(count):
        offset = struct.unpack_from('<I', raw, head + 4*i)[0]
        at = start + offset
        length = struct.unpack_from('<H', raw, at)[0]
        check(label + f' string bounds {i}', length < 32768 and at+4+length*2 <= len(raw))
        check(label + f' string terminator {i}', raw[at+2+length*2:at+4+length*2] == b'\0\0')
        strings.append(raw[at+2:at+2+length*2].decode('utf-16-le'))
    return strings


def root_attributes(chunks, strings, label):
    roots = []
    for index, (kind, head, raw) in enumerate(chunks):
        if kind != 0x102:
            continue
        ns, name, attrs_offset, stride, count = struct.unpack_from('<IIHHH', raw, head)
        if strings[name] != 'manifest':
            continue
        check(label + ' root attribute layout', head == 16 and ns == 0xffffffff and stride == 20)
        values = {}
        for i in range(count):
            offset = head + attrs_offset + stride*i
            check(label + f' root attribute bounds {i}', offset+20 <= len(raw))
            ans, name, plain, width, reserved, value_type, value = struct.unpack_from('<IIIHBBI', raw, offset)
            key = strings[name]
            check(label + ' root unique attribute ' + key, key not in values)
            values[key] = {'namespace': None if ans == 0xffffffff else strings[ans], 'raw': plain,
                           'type': value_type, 'value': value, 'width': width, 'reserved': reserved,
                           'chunk': index, 'valueOffset': offset+16}
        roots.append(values)
    check(label + ' unique manifest root', len(roots) == 1)
    return roots[0]


def compare_manifest(old, new):
    a, b = xml_chunks(old, 'baseline'), xml_chunks(new, 'candidate')
    check('AXML chunk topology unchanged', [(x[0], x[1]) for x in a] == [(x[0], x[1]) for x in b])
    check('one leading string pool', a[0][0] == b[0][0] == 1 and sum(x[0] == 1 for x in a) == 1)
    av, bv = decode_pool(a[0], 'baseline'), decode_pool(b[0], 'candidate')
    check('pool string counts unchanged', len(av) == len(bv) == 112)
    differences = [(i, x, y) for i, (x, y) in enumerate(zip(av, bv)) if x != y]
    check('only version-name string differs', differences == [(35, OLD_VERSION, NEW_VERSION)])
    aa, ba = root_attributes(a, av, 'baseline'), root_attributes(b, bv, 'candidate')
    check('root keys unchanged', aa.keys() == ba.keys())
    for attrs, strings, code, version, label in [(aa, av, 603, OLD_VERSION, 'baseline'), (ba, bv, 604, NEW_VERSION, 'candidate')]:
        vc, vn, package = attrs['versionCode'], attrs['versionName'], attrs['package']
        check(label + ' typed versionCode', vc['namespace'] == 'http://schemas.android.com/apk/res/android'
              and (vc['raw'], vc['type'], vc['width'], vc['reserved'], vc['value']) == (0xffffffff, 16, 8, 0, code))
        check(label + ' typed versionName', vn['namespace'] == 'http://schemas.android.com/apk/res/android'
              and vn['type'] == 3 and strings[vn['value']] == version)
        check(label + ' package identity', package['namespace'] is None and package['type'] == 3
              and strings[package['value']] == PACKAGE)
    patched = bytearray(a[aa['versionCode']['chunk']][2])
    struct.pack_into('<I', patched, aa['versionCode']['valueOffset'], 604)
    for i in range(1, len(a)):
        expected = bytes(patched) if i == aa['versionCode']['chunk'] else a[i][2]
        check(f'AXML non-pool chunk {i} unchanged except versionCode', b[i][2] == expected)
    return {'onlyVersionNameAndCodeChanged': True, 'stringIndex': 35}


def signature_check(result, label):
    check(label + ' valid signature', result.returncode == 0)
    digests = re.findall(r'Signer #\d+ certificate SHA-256 digest: (\w+)', result.stdout)
    check(label + ' exact existing signer', digests == [CERT_SHA])
    expected = {'v1': ('JAR signing', 'false'), 'v2': ('APK Signature Scheme v2', 'true'),
                'v3': ('APK Signature Scheme v3', 'false'), 'v3.1': ('APK Signature Scheme v3.1', 'false'),
                'v4': ('APK Signature Scheme v4', 'false')}
    check(label + ' v2 only', all(f'Verified using {key} scheme ({text}): {value}' in result.stdout
                                for key, (text, value) in expected.items()))


def main():
    p = argparse.ArgumentParser(description=__doc__)
    for arg in ['baseline', 'candidate', 'hbc', 'build-manifest', 'tools', 'output']:
        p.add_argument('--'+arg, type=Path, required=True)
    p.add_argument('--signed', action='store_true')
    args = p.parse_args()
    snapshots = {key: file_hash(getattr(args, key)) for key in ['baseline', 'candidate', 'hbc', 'build_manifest']}
    check('exact baseline603 APK', snapshots['baseline'] == BASE_SHA)
    build = json.loads(args.build_manifest.read_text())
    check('604 build manifest format', build['format'] == 'solaris-v6-604-build-manifest/1')
    check('604 build manifest base', build['baselineApkSha256'] == BASE_SHA)
    check('604 build manifest identity', (build['packageId'], build['versionCode'], build['versionName']) == (PACKAGE, 604, NEW_VERSION))
    check('604 build manifest HBC binding', build['patchedHbcSha256'] == snapshots['hbc']
          and build['patchedHbcBytes'] == args.hbc.stat().st_size)
    check('HBC SHA-1 internal footer', (lambda data: hashlib.sha1(data[:-20]).digest() == data[-20:])(args.hbc.read_bytes()))
    for name, expected in TOOL_SHA.items():
        check('verified tool ' + name, file_hash(args.tools/name) == expected)
    with zipfile.ZipFile(args.baseline) as a, zipfile.ZipFile(args.candidate) as b:
        an, bn = a.namelist(), b.namelist()
        check('602 unique same entries', len(an) == len(set(an)) == len(bn) == len(set(bn)) == 602 and set(an) == set(bn))
        check('ZIP comment unchanged', a.comment == b.comment)
        changed, native = [], []
        with args.candidate.open('rb') as raw:
            for name in an:
                av, bv, ai, bi = a.read(name), b.read(name), a.getinfo(name), b.getinfo(name)
                check('compression unchanged ' + name, ai.compress_type == bi.compress_type)
                if av != bv:
                    changed.append(name)
                if name.startswith('lib/') and name.endswith('.so'):
                    check('native payload exact ' + name, av == bv and bi.compress_type == zipfile.ZIP_STORED)
                    raw.seek(bi.header_offset)
                    header = raw.read(30)
                    check('native ZIP header ' + name, header[:4] == b'PK\x03\x04')
                    name_length, extra_length = struct.unpack_from('<HH', header, 26)
                    offset = bi.header_offset+30+name_length+extra_length
                    check('native16KiB alignment ' + name, offset % 16384 == 0)
                    native.append({'path': name, 'offset': offset, 'sha256': data_hash(bv)})
        check('only declared three payload changes', set(changed) == ALLOWED_CHANGES)
        check('599 untouched payloads', len(bn)-len(changed) == 599)
        check('51 native libraries', len(native) == 51)
        check('baseline HBC exact', data_hash(a.read('assets/index.android.bundle')) == BASE_HBC_SHA)
        check('candidate exact declared HBC', b.read('assets/index.android.bundle') == args.hbc.read_bytes())
        old_cfg, new_cfg = json.loads(a.read('assets/app.config')), json.loads(b.read('assets/app.config'))
        check('baseline config identity', (old_cfg['version'], old_cfg['android']['versionCode'], old_cfg['android']['package']) == (OLD_VERSION, 603, PACKAGE))
        expected = copy.deepcopy(old_cfg)
        expected['version'], expected['android']['versionCode'] = NEW_VERSION, 604
        check('config only version changed', expected == new_cfg)
        manifest = compare_manifest(a.read('AndroidManifest.xml'), b.read('AndroidManifest.xml'))
    signer = args.tools/'lib/apksigner.jar'
    signature_check(run('baselineSignature', ['java', '-jar', signer, 'verify', '--verbose', '--print-certs', args.baseline]), 'baseline')
    for label, apk in [('baseline', args.baseline), ('candidate', args.candidate)]:
        check(label + ' zipalign4 and16K', run(label+'Alignment', [args.tools/'zipalign', '-c', '-P', '16', '4', apk]).returncode == 0)
    sig = run('candidateSignature', ['java', '-jar', signer, 'verify', '--verbose', '--print-certs', args.candidate])
    if args.signed:
        signature_check(sig, 'candidate')
    else:
        check('unsigned has no valid signature', sig.returncode != 0)
    badge = run('candidateBadging', [args.tools/'aapt2', 'dump', 'badging', args.candidate])
    check('aapt2 package604', badge.returncode == 0 and f"name='{PACKAGE}' versionCode='604' versionName='{NEW_VERSION}'" in badge.stdout)
    for key, value in snapshots.items():
        check('stable input '+key, file_hash(getattr(args, key)) == value)
    report = {'reviewer': '/root/604_recording', 'scope': 'independent APK packaging and identity only; functional approval separate',
              'decision': 'approve', 'candidatePath': str(args.candidate), 'candidateBytes': args.candidate.stat().st_size,
              'candidateSha256': snapshots['candidate'], 'baselineApkSha256': snapshots['baseline'],
              'patchedHbcSha256': snapshots['hbc'], 'buildManifestSha256': snapshots['build_manifest'],
              'verifierSha256': file_hash(__file__), 'signedVerified': args.signed, 'checksPassed': len(checks),
              'changedPayloads': changed, 'preservedPayloads': 599, 'nativeLibraries': native,
              'manifest': manifest, 'checks': checks, 'commands': commands}
    args.output.write_text(json.dumps(report, indent=2)+'\n')
    print(json.dumps({k: report[k] for k in ['decision', 'candidateSha256', 'candidateBytes', 'checksPassed', 'signedVerified']}))


if __name__ == '__main__':
    main()
