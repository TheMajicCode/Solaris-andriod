#!/usr/bin/env python3
"""Read-only, exact-candidate recovery. Does not build, install or execute app code.

Hermes v96 string layout follows Meta's BytecodeFileFormat.h and
BytecodeDataProvider.cpp. This intentionally rejects other APKs/bytecode formats.
"""
import argparse
import base64
import hashlib
import json
from pathlib import Path, PurePosixPath
import re
import stat
import struct
import zipfile

APK_SHA = '4ac6a72c864118ec548ee5c05738c814b6e519f82b01a7d358d24952b900c518'
APK_SIZE = 242584391

def sha(b):
    return hashlib.sha256(b).hexdigest()

def require(ok, message):
    if not ok:
        raise ValueError(message)

def decode_strings(b):
    require(len(b) >= 148, 'Truncated Hermes header')
    require(struct.unpack_from('<Q', b)[0] == 0x1F1903C103BC1FC6, 'Wrong Hermes magic')
    require(struct.unpack_from('<I', b, 8)[0] == 96, 'Only Hermes v96 supported')
    names = ('fileLength globalCodeIndex functionCount stringKindCount identifierCount '
             'stringCount overflowStringCount stringStorageSize bigIntCount bigIntStorageSize '
             'regExpCount regExpStorageSize arrayBufferSize objKeyBufferSize objValueBufferSize '
             'segmentID cjsModuleCount functionSourceCount debugInfoOffset').split()
    h = dict(zip(names, struct.unpack_from('<19I', b, 32)))
    require(h['fileLength'] == len(b), 'Hermes size mismatch')
    require(hashlib.sha1(b[:-20]).digest() == b[-20:], 'Hermes footer hash mismatch')
    small = 128 + h['functionCount'] * 16 + h['stringKindCount'] * 4 + h['identifierCount'] * 4
    overflow = small + h['stringCount'] * 4
    storage = overflow + h['overflowStringCount'] * 8
    require(storage + h['stringStorageSize'] <= len(b) - 20, 'Invalid string table bounds')
    strings = []
    for i in range(h['stringCount']):
        value = struct.unpack_from('<I', b, small + 4 * i)[0]
        utf16, off, length = value & 1, (value >> 1) & 0x7fffff, value >> 24
        if length == 255:
            require(off < h['overflowStringCount'], 'Invalid overflow string index')
            off, length = struct.unpack_from('<II', b, overflow + off * 8)
        width = 2 if utf16 else 1
        require(off + length * width <= h['stringStorageSize'], 'Invalid string bounds')
        raw = b[storage + off:storage + off + length * width]
        encoding = 'utf-16le' if utf16 else 'latin-1'
        value = raw.decode(encoding, errors='surrogatepass')
        require(value.encode(encoding, errors='surrogatepass') == raw, 'String roundtrip mismatch')
        strings.append((value, {'stringId': i, 'byteOffset': storage + off,
                               'codeUnits': length, 'encoding': encoding,
                               'rawByteLength': len(raw), 'rawSha256': sha(raw)}))
    return h, strings

def recover(apk, destination):
    require(not destination.exists(), 'Destination must be new; existing work is never overwritten')
    require(apk.stat().st_size == APK_SIZE, 'Unexpected APK size')
    apk_bytes = apk.read_bytes()
    require(sha(apk_bytes) == APK_SHA, 'Unexpected APK SHA-256')
    import io
    with zipfile.ZipFile(io.BytesIO(apk_bytes)) as z:
        infos = z.infolist()
        require(len({i.filename for i in infos}) == len(infos), 'Duplicate APK archive entries')
        for info in infos:
            p = PurePosixPath(info.filename)
            require(not p.is_absolute() and '..' not in p.parts and '\\' not in info.filename,
                    'Unsafe APK archive path')
            require(not stat.S_ISLNK(info.external_attr >> 16), 'APK symlink rejected')
        names = ['assets/index.android.bundle', 'assets/app.config', 'classes.dex',
                 'AndroidManifest.xml', 'resources.arsc', 'META-INF/version-control-info.textproto']
        packaged = {name: z.read(name) for name in names}
        inventory = [{'path': i.filename, 'bytes': i.file_size,
                      'compressedBytes': i.compress_size, 'crc32': f'{i.CRC:08x}'} for i in infos]
    header, strings = decode_strings(packaged['assets/index.android.bundle'])
    htmls = [(s, m) for s, m in strings if s.startswith('<!doctype html>') and s.endswith('</html>')]
    workers = [(s, m) for s, m in strings if s.startswith('354922\n{"version":0,"id":')]
    require(len(htmls) == len(workers) == 1, 'Expected unique HTML and worker string entries')
    html, html_meta = htmls[0]
    worker, worker_meta = workers[0]
    worker_bytes = worker.encode('utf-8')
    first_newline = worker_bytes.index(b'\n')
    second_newline = worker_bytes.index(b'\n', first_newline + 1)
    data_offset = first_newline + int(worker_bytes[:first_newline])
    require(data_offset == second_newline + 1, 'Bare header/data offset mismatch')
    worker_header = json.loads(worker_bytes[first_newline + 1:second_newline])
    require(worker_header['version'] == 0, 'Unknown Bare bundle version')
    data = worker_bytes[data_offset:]
    worker_files = []
    for virtual, spec in worker_header['files'].items():
        p = PurePosixPath(virtual)
        require(virtual.startswith('/') and not virtual.startswith('//') and '..' not in p.parts
                and '\\' not in virtual, 'Unsafe worker path')
        require(spec['mode'] in (420, 493), 'Unexpected worker file mode')
        start, length = spec['offset'], spec['length']
        require(isinstance(start, int) and isinstance(length, int) and start >= 0 and length >= 0
                and start + length <= len(data), 'Invalid worker file range')
        worker_files.append((virtual, data[start:start + length], spec))
    ordered = sorted(worker_files, key=lambda entry: entry[2]['offset'])
    end = 0
    for virtual, content, spec in ordered:
        require(spec['offset'] == end, 'Unexpected gap or overlap in worker payload')
        end += len(content)
    require(end == len(data), 'Worker payload not fully accounted for')
    runtime_hash = re.search(r'name="solaris-runtime-source-sha256" content="([0-9a-f]{64})"', html)
    require(runtime_hash is not None, 'Missing embedded runtime hash')
    destination.mkdir(parents=True, exist_ok=False)
    outputs = []
    def write(name, content, provenance, mode=None):
        p = destination / name
        p.parent.mkdir(parents=True, exist_ok=True)
        with p.open('xb') as f:
            f.write(content)
        outputs.append({'path': name, 'bytes': len(content), 'sha256': sha(content),
                        'provenance': provenance, 'originalMode': mode})
    for name, content in packaged.items():
        write('packaged/' + name, content, {'apkEntry': name})
    write('decoded/sanctuary-packaged.html', html.encode('utf-8'), html_meta)
    write('decoded/qvac-worker.bundle', worker_bytes, worker_meta)
    write('decoded/bare-header.json', (json.dumps(worker_header, indent=2) + '\n').encode(),
          {'source': 'decoded/qvac-worker.bundle', 'operation': 'JSON parse and pretty print'})
    for virtual, content, spec in worker_files:
        write('worker-files/' + virtual.lstrip('/'), content,
              {'source': 'decoded/qvac-worker.bundle', 'virtualPath': virtual,
               'dataStart': data_offset, **spec}, spec['mode'])
    images = re.findall(r'data:image/png;base64,([A-Za-z0-9+/=]+)', html)
    for i, encoded in enumerate(images):
        content = base64.b64decode(encoded, validate=True)
        require(content.startswith(b'\x89PNG\r\n\x1a\n'), 'Invalid embedded PNG')
        write(f'decoded/assets/embedded-{i + 1}.png', content,
              {'source': 'decoded/sanctuary-packaged.html', 'operation': 'base64 decode',
               'occurrence': i + 1})
    notices = [(s, m) for s, m in strings if s.startswith('Solaris V5-A model notice\n')]
    if len(notices) == 1:
        write('decoded/model-notice.txt', notices[0][0].encode('utf-8'), notices[0][1])
    report = {'format': 'solaris-v6-apk-recovery/1', 'apkSha256': APK_SHA, 'apkBytes': APK_SIZE,
              'hermesVersion': 96, 'hermesHeader': header, 'hermesFooterSha1Verified': True,
              'allStringRangesVerified': len(strings), 'workerFilesRecovered': len(worker_files),
              'workerRangesContiguous': True, 'embeddedRuntimeSourceSha256': runtime_hash.group(1),
              'sourceArchiveRecovered': False, 'fullNativeProjectRecovered': False,
              'originalSourceFilesVersusCompiledArtifacts': 'See per-file provenance; decoded strings and worker files are packaged artifacts, not recovered TypeScript/Kotlin project.',
              'outputs': outputs}
    (destination / 'RECOVERY-MANIFEST.json').write_text(json.dumps(report, indent=2) + '\n')
    (destination / 'APK-ENTRIES.json').write_text(json.dumps(inventory, indent=2) + '\n')
    return report

if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('apk', type=Path)
    ap.add_argument('new_destination', type=Path)
    args = ap.parse_args()
    report = recover(args.apk, args.new_destination)
    print(json.dumps({k: v for k, v in report.items() if k not in ('outputs', 'hermesHeader')}, indent=2))
