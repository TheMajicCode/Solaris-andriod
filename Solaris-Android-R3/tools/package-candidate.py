#!/usr/bin/env python3
"""Prepare or verify one hash-pinned Solaris binary-patched candidate. Never signs or installs."""
import argparse
import copy
import hashlib
import json
import re
import struct
import subprocess
import zipfile
from pathlib import Path

BASELINE_APK = '01da9f5281f5f92230dcbd64da62484557cc7a0a15e876cc2d99ec7ec3bcd2cd'
BASELINE_HBC = 'fd8b38bcdd42421c18da4a0b69b2d58906ceddd7c4a2044b34faed51490f4653'
BASELINE_MANIFEST = 'b24ee9859a63c1c27c09fcf7f4d9f96a4bf7e3f1146fb791b6d3bd81399f860f'
CERTIFICATE = 'fac61745dc0903786fb9ede62a962b399f7348f0bb6f899b8332667591033b9c'
PACKAGE = 'org.solarishealth.edge.recovery'
OLD_VERSION, VERSION = '6.0.2-preview.sanctuary-guards', '6.0.3-preview.pocket-chat'
OLD_CODE, CODE = 602, 603
HBC, MANIFEST, CONFIG = 'assets/index.android.bundle', 'AndroidManifest.xml', 'assets/app.config'
CHANGED = {HBC, MANIFEST, CONFIG}
TOOLS = {'zipalign': 'c5f559e946de5a9e7d58792181db20383b228877812136bc469d97ae00a43b0a',
         'aapt2': '1a6a396b9cd071f7040071fdd108718cb98c3c9f4960044f373b288993d19eb7',
         'lib/apksigner.jar': '3716d9311e55d2b0918a2fd9d54ba9e406c5f6abeea700b287f11259bc163dec',
         'lib64/libc++.so': '96a19cd2154a4423a61f8444e5d3148a608fa3033bc1a22285d19855a950d05a'}


def require(condition, message):
    if not condition:
        raise RuntimeError(message)


def sha(data):
    return hashlib.sha256(data).hexdigest()


def file_sha(path):
    with Path(path).open('rb') as stream:
        return hashlib.file_digest(stream, 'sha256').hexdigest()


def write_json(path, value):
    path.write_text(json.dumps(value, indent=2) + '\n')


def read_build_manifest(path, hbc):
    build = json.loads(path.read_text())
    require(build['format'] == 'solaris-v6-603-build-manifest/1', 'BUILD_MANIFEST_FORMAT')
    require(build['baselineApkSha256'] == BASELINE_APK, 'BUILD_MANIFEST_BASELINE')
    require(build['packageId'] == PACKAGE and build['versionCode'] == CODE
            and build['versionName'] == VERSION, 'BUILD_MANIFEST_IDENTITY')
    require(isinstance(build['scope'], str) and build['scope'].strip(), 'BUILD_MANIFEST_SCOPE')
    require(re.fullmatch('[0-9a-f]{64}', build['patchedHbcSha256']) is not None, 'BUILD_MANIFEST_HBC_HASH_FORMAT')
    require(file_sha(hbc) == build['patchedHbcSha256'] and hbc.stat().st_size == build['patchedHbcBytes'],
            'PATCHED_HBC_HASH_OR_SIZE')
    require(build['patchedHbcSha256'] != BASELINE_HBC, 'UNCHANGED_HBC')
    return build


def version_code_offset(data, strings):
    """Locate the typed Android root versionCode attribute rather than using a pool-dependent offset."""
    offset, resources, found = 8, None, []
    while offset < len(data):
        kind, head, size = struct.unpack_from('<HHI', data, offset)
        require(size >= head >= 8 and offset + size <= len(data), 'AXML_CHUNK_BOUNDS')
        if kind == 0x180:
            require(head == 8 and (size - 8) % 4 == 0 and resources is None, 'AXML_RESOURCE_MAP')
            resources = struct.unpack_from('<' + str((size - 8) // 4) + 'I', data, offset + 8)
        if kind == 0x102:
            require(head == 16 and size >= 36, 'AXML_ELEMENT_HEADER')
            namespace, name, start, stride, count = struct.unpack_from('<IIHHH', data, offset + 16)
            require(name < len(strings), 'AXML_ELEMENT_NAME')
            if strings[name] == 'manifest':
                require(namespace == 0xffffffff and stride == 20, 'AXML_ROOT_LAYOUT')
                require(offset + 16 + start + count * stride <= offset + size, 'AXML_ROOT_ATTRIBUTES_BOUNDS')
                for index in range(count):
                    at = offset + 16 + start + index * stride
                    ns, key, raw, value_size, reserved, value_type, value = struct.unpack_from('<IIIHBBI', data, at)
                    require(key < len(strings), 'AXML_ATTRIBUTE_NAME')
                    if strings[key] == 'versionCode':
                        require(ns < len(strings) and strings[ns] == 'http://schemas.android.com/apk/res/android',
                                'AXML_VERSION_CODE_NAMESPACE')
                        require(resources is not None and key < len(resources) and resources[key] == 0x0101021b,
                                'AXML_VERSION_CODE_RESOURCE')
                        require((raw, value_size, reserved, value_type) == (0xffffffff, 8, 0, 0x10),
                                'AXML_VERSION_CODE_TYPE')
                        found.append(at + 16)
        offset += size
    require(offset == len(data) and len(found) == 1, 'AXML_VERSION_CODE_UNIQUE')
    return found[0]


def pool_strings(data):
    """Read the exact baseline's plain UTF-16, unstyled string pool; reject other layouts."""
    require(struct.unpack_from('<HHI', data, 0) == (3, 8, len(data)), 'AXML_HEADER')
    kind, head, length = struct.unpack_from('<HHI', data, 8)
    require((kind, head) == (1, 28), 'AXML_POOL_HEADER')
    count, styles, flags, start, style_start = struct.unpack_from('<5I', data, 16)
    require((count, styles, flags, start, style_start) == (112, 0, 0, 476, 0), 'AXML_POOL_LAYOUT')
    offsets = list(struct.unpack_from('<112I', data, 36))
    values = []
    for offset in offsets:
        at = 8 + start + offset
        n = struct.unpack_from('<H', data, at)[0]
        require(n < 0x8000 and at + 2 + n * 2 + 2 <= 8 + length, 'AXML_STRING_LENGTH')
        require(data[at + 2 + n * 2: at + 4 + n * 2] == b'\0\0', 'AXML_STRING_TERMINATOR')
        values.append(data[at + 2:at + 2 + n * 2].decode('utf-16-le'))
    return length, start, offsets, values


def patch_manifest(data):
    """Expand only version-name string #35, preserving every index and all XML node bytes except code."""
    require(sha(data) == BASELINE_MANIFEST, 'BASELINE_MANIFEST_HASH')
    length, start, offsets, values = pool_strings(data)
    require(values.count(OLD_VERSION) == 1 and values[35] == OLD_VERSION, 'AXML_VERSION_NAME')
    code_offset = version_code_offset(data, values)
    require(struct.unpack_from('<I', data, code_offset)[0] == OLD_CODE, 'AXML_VERSION_CODE')
    string_start = 8 + start + offsets[35]
    require(string_start == 1452, 'AXML_VERSION_STRING_OFFSET')
    old_string_bytes = 2 + len(OLD_VERSION.encode('utf-16-le')) + 2
    new_string = struct.pack('<H', len(VERSION)) + VERSION.encode('utf-16-le') + b'\0\0'
    string_growth = len(new_string) - old_string_bytes
    pool_growth = (string_growth + 3) & ~3
    pool = bytearray(data[8:8+length])
    local = string_start - 8
    pool[local:local+old_string_bytes] = new_string
    pool.extend(b'\0' * (pool_growth - string_growth))
    struct.pack_into('<I', pool, 4, length + pool_growth)
    for index, offset in enumerate(offsets):
        if offset > offsets[35]:
            struct.pack_into('<I', pool, 28 + index * 4, offset + string_growth)
    result = bytearray(data[:8] + pool + data[8+length:])
    struct.pack_into('<I', result, 4, len(result))
    struct.pack_into('<I', result, code_offset + pool_growth, CODE)
    new_length, new_start, new_offsets, new_values = pool_strings(result)
    expected = values.copy()
    expected[35] = VERSION
    require(new_values == expected, 'AXML_OTHER_STRING_CHANGED')
    require(version_code_offset(result, new_values) == code_offset + pool_growth, 'AXML_NEW_VERSION_CODE_OFFSET')
    original_nodes = bytearray(data[8+length:])
    struct.pack_into('<I', original_nodes, code_offset-(8+length), CODE)
    require(result[8+new_length:] == original_nodes, 'AXML_OTHER_NODE_CHANGED')
    require(new_start == start and new_length == length + pool_growth, 'AXML_NEW_POOL_LAYOUT')
    return bytes(result), {'stringIndex': 35, 'originalStringOffset': string_start,
                          'stringGrowthBytes': string_growth, 'poolGrowthBytes': pool_growth,
                          'originalVersionCodeOffset': code_offset, 'newVersionCodeOffset': code_offset + pool_growth,
                          'allOtherStringsUnchanged': True, 'allOtherXmlNodeBytesUnchanged': True}


def patch_config(data):
    old = json.loads(data)
    require(old['version'] == OLD_VERSION and old['android']['versionCode'] == OLD_CODE
            and old['android']['package'] == PACKAGE, 'CONFIG_IDENTITY')
    v, c = f'"version":"{OLD_VERSION}"'.encode(), f'"versionCode":{OLD_CODE}'.encode()
    require(data.count(v) == 1 and data.count(c) == 1, 'CONFIG_PATTERNS')
    result = data.replace(v, f'"version":"{VERSION}"'.encode()).replace(c, f'"versionCode":{CODE}'.encode())
    expected = copy.deepcopy(old)
    expected['version'], expected['android']['versionCode'] = VERSION, CODE
    require(json.loads(result) == expected, 'CONFIG_OTHER_CHANGE')
    return result


def inventory(path):
    with zipfile.ZipFile(path) as archive:
        names = archive.namelist()
        require(len(names) == len(set(names)), 'DUPLICATE_ZIP_ENTRY')
        result = {}
        for entry in archive.infolist():
            with archive.open(entry) as stream:
                digest = hashlib.file_digest(stream, 'sha256').hexdigest()
            result[entry.filename] = {'bytes': entry.file_size, 'sha256': digest, 'compression': entry.compress_type}
        return result


def native_alignment(path):
    records = []
    with Path(path).open('rb') as stream, zipfile.ZipFile(path) as archive:
        for entry in archive.infolist():
            if not entry.filename.startswith('lib/') or not entry.filename.endswith('.so'):
                continue
            stream.seek(entry.header_offset + 26)
            name_length, extra_length = struct.unpack('<HH', stream.read(4))
            offset = entry.header_offset + 30 + name_length + extra_length
            require(entry.compress_type == zipfile.ZIP_STORED, 'NATIVE_LIBRARY_COMPRESSED')
            require(offset % 16384 == 0, 'NATIVE_LIBRARY_NOT_16K_ALIGNED')
            records.append({'path': entry.filename, 'dataOffset': offset, 'compression': entry.compress_type})
    require(len(records) == 51, 'NATIVE_LIBRARY_COUNT')
    return records


def obsolete_signature(name):
    leaf = name.upper().removeprefix('META-INF/')
    return (name.upper().startswith('META-INF/') and '/' not in leaf and
            (leaf == 'MANIFEST.MF' or leaf.startswith('SIG-') or leaf.endswith(('.SF', '.RSA', '.DSA', '.EC'))))


def run(command, evidence, label):
    result = subprocess.run([str(x) for x in command], capture_output=True, text=True)
    output = result.stdout + result.stderr
    (evidence / f'{label}.txt').write_text(output)
    require(result.returncode == 0, f'{label}: EXIT_{result.returncode}')
    return output


def signature(output):
    require(re.findall(r'Signer #\d+ certificate SHA-256 digest: ([a-fA-F0-9]+)', output) == [CERTIFICATE], 'CERTIFICATE_MISMATCH')
    require('Verified using v2 scheme (APK Signature Scheme v2): true' in output, 'V2_SIGNATURE_NOT_VERIFIED')
    for scheme, description in [('v1', 'JAR signing'), ('v3', 'APK Signature Scheme v3'),
                                ('v3.1', 'APK Signature Scheme v3.1'), ('v4', 'APK Signature Scheme v4')]:
        require(f'Verified using {scheme} scheme ({description}): false' in output, 'SIGNATURE_SCHEME_CHANGED')


def verify_payload(candidate, original_inventory, replacements):
    current = inventory(candidate)
    removed = {name for name in original_inventory if obsolete_signature(name)}
    require(set(current) == set(original_inventory) - removed, 'ZIP_ENTRY_SET_CHANGED')
    changed = []
    for name, metadata in current.items():
        require(metadata['compression'] == original_inventory[name]['compression'], 'COMPRESSION_CHANGED:' + name)
        if name in CHANGED:
            require(metadata['sha256'] == sha(replacements[name]) and metadata['bytes'] == len(replacements[name]), 'REPLACEMENT_MISMATCH:' + name)
        else:
            require(metadata == original_inventory[name], 'UNEXPECTED_PAYLOAD_CHANGE:' + name)
        if metadata != original_inventory[name]:
            changed.append(name)
    require(set(changed) == CHANGED, 'DECLARED_PAYLOAD_CHANGE_SET')
    require(len(current) - len(CHANGED) == 599, 'PRESERVED_PAYLOAD_COUNT')
    return current, sorted(removed)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--baseline', type=Path, required=True)
    parser.add_argument('--patched-hbc', type=Path, required=True)
    parser.add_argument('--build-manifest', type=Path, required=True, help='Hash-sealed input declaration reviewed before signing')
    parser.add_argument('--tools-dir', type=Path, required=True)
    parser.add_argument('--output-dir', type=Path, required=True)
    parser.add_argument('--verify-apk', type=Path, help='Verify existing candidate instead of preparing an unsigned candidate')
    parser.add_argument('--require-signature', action='store_true', help='Only valid with --verify-apk; verifies, never signs')
    args = parser.parse_args()
    require(not args.require_signature or args.verify_apk, 'SIGNATURE_VERIFICATION_REQUIRES_EXISTING_APK')
    require(file_sha(args.baseline) == BASELINE_APK, 'BASELINE_APK_HASH')
    build = read_build_manifest(args.build_manifest, args.patched_hbc)
    build_manifest_sha = file_sha(args.build_manifest)
    for name, expected in TOOLS.items():
        require(file_sha(args.tools_dir / name) == expected, 'TOOL_HASH:' + name)
    args.output_dir.mkdir(parents=True, exist_ok=False)
    evidence = args.output_dir
    zipalign, aapt2, signer = (args.tools_dir / x for x in ['zipalign', 'aapt2', 'lib/apksigner.jar'])
    signature(run(['java', '-jar', signer, 'verify', '--verbose', '--print-certs', args.baseline], evidence, 'baseline-signature'))
    run([zipalign, '-c', '-P', '16', '4', args.baseline], evidence, 'baseline-alignment')
    before = inventory(args.baseline)
    native_before = native_alignment(args.baseline)
    original_tree = run([aapt2, 'dump', 'xmltree', args.baseline, '--file', MANIFEST], evidence, 'baseline-manifest-tree')
    with zipfile.ZipFile(args.baseline) as source:
        require(sha(source.read(HBC)) == BASELINE_HBC, 'BASELINE_HBC_HASH')
        manifest, manifest_detail = patch_manifest(source.read(MANIFEST))
        replacements = {MANIFEST: manifest, CONFIG: patch_config(source.read(CONFIG)), HBC: args.patched_hbc.read_bytes()}
        (evidence / 'AndroidManifest-603.xml').write_bytes(manifest)
        (evidence / 'candidate-app.config').write_bytes(replacements[CONFIG])
        if args.verify_apk:
            candidate = args.verify_apk
        else:
            unsigned = args.output_dir / 'candidate-unsigned.zip'
            with zipfile.ZipFile(unsigned, 'x', allowZip64=False) as destination:
                destination.comment = source.comment
                for entry in source.infolist():
                    if obsolete_signature(entry.filename):
                        continue
                    require(entry.compress_type in (zipfile.ZIP_STORED, zipfile.ZIP_DEFLATED), 'UNSUPPORTED_COMPRESSION')
                    data = replacements.get(entry.filename)
                    if data is None:
                        data = source.read(entry)
                    destination.writestr(copy.copy(entry), data)
            verify_payload(unsigned, before, replacements)
            candidate = args.output_dir / 'candidate-aligned-unsigned.apk'
            run([zipalign, '-P', '16', '4', unsigned, candidate], evidence, 'align-unsigned')
    after, removed = verify_payload(candidate, before, replacements)
    native_after = native_alignment(candidate)
    run([zipalign, '-c', '-P', '16', '4', candidate], evidence, 'candidate-alignment')
    tree = run([aapt2, 'dump', 'xmltree', candidate, '--file', MANIFEST], evidence, 'candidate-manifest-tree')
    expected_tree = original_tree.replace(f'versionCode(0x0101021b)={OLD_CODE}', f'versionCode(0x0101021b)={CODE}')
    expected_tree = expected_tree.replace(f'versionCode(0x0101021b)={OLD_CODE:#x}', f'versionCode(0x0101021b)={CODE:#x}').replace(OLD_VERSION, VERSION)
    require(tree == expected_tree, 'UNEXPECTED_MANIFEST_SEMANTIC_CHANGE')
    badging = run([aapt2, 'dump', 'badging', candidate], evidence, 'candidate-badging')
    require("name='" + PACKAGE + "'" in badging and f"versionCode='{CODE}'" in badging and
            "versionName='" + VERSION + "'" in badging, 'CANDIDATE_PACKAGE_VERSION')
    if args.require_signature:
        signature(run(['java', '-jar', signer, 'verify', '--verbose', '--print-certs', candidate], evidence, 'candidate-signature'))
    require(file_sha(args.baseline) == BASELINE_APK, 'BASELINE_APK_CHANGED')
    require(file_sha(args.patched_hbc) == build['patchedHbcSha256'], 'PATCHED_HBC_CHANGED')
    require(file_sha(args.build_manifest) == build_manifest_sha, 'BUILD_MANIFEST_CHANGED')
    report = {'format': 'solaris-v6-603-unsigned-packaging-or-verification/1',
              'baselineApkSha256': BASELINE_APK, 'candidatePath': str(candidate), 'candidateSha256': file_sha(candidate),
              'candidateBytes': candidate.stat().st_size, 'patchedHbcSha256': build['patchedHbcSha256'], 'buildManifestSha256': build_manifest_sha,
              'packagingScriptSha256': file_sha(Path(__file__)), 'toolSha256': TOOLS,
              'manifestSha256': sha(manifest), 'configSha256': sha(replacements[CONFIG]),
              'packageId': PACKAGE, 'versionCode': CODE, 'versionName': VERSION,
              'changedPayloadEntries': sorted(CHANGED), 'preservedPayloadEntries': len(after)-len(CHANGED),
              'removedObsoleteSignatureEntries': removed, 'nativeLibraryCount': len(native_after),
              'allNativePayloadsUnchanged': True, 'allNativeLibrariesStoredAnd16KiBAligned': True,
              'manifestChange': manifest_detail, 'allOtherManifestSemanticsUnchanged': True,
              'signatureVerified': bool(args.require_signature), 'expectedCertificateSha256': CERTIFICATE,
              'signingPerformedByThisTool': False, 'phoneInstalled': False, 'phoneTested': False,
              'buildKind': 'APK-derived binary patch; not a complete native source rebuild',
              'scope': build['scope']}
    write_json(evidence / 'build-manifest.json', build)
    write_json(evidence / 'baseline-entry-inventory.json', before)
    write_json(evidence / 'candidate-entry-inventory.json', after)
    write_json(evidence / 'baseline-native-alignment.json', native_before)
    write_json(evidence / 'candidate-native-alignment.json', native_after)
    write_json(evidence / 'PACKAGING-RESULT.json', report)
    print(json.dumps(report, indent=2))


if __name__ == '__main__':
    main()
