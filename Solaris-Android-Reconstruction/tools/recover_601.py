#!/usr/bin/env python3
"""Recover exact packaged source; never runs, modifies or signs an APK.

601 retains the 600 HBC96 layout but contains a padded, minified HTML string.
Reuse the previously reviewed parser and range checks; make baseline changes
explicit here instead of weakening its allowlist. Output is APK-derived source,
not recovered original TypeScript/Kotlin or a buildable Android project.
"""
import argparse
import hashlib
import json
from pathlib import Path
import re
import stat
import zipfile
import reference_extract_v6 as reference

APK_SHA256 = '228c3d9f282d716515e3640de2b13478a29e21c607293eaf589741ec6d34f183'
APK_BYTES = 242580679
HBC_SHA256 = 'ac973292961cc7a1505a47a416ecafdff2e1688b7eac31f20571e503d74ec177'

def sha(data):
    return hashlib.sha256(data).hexdigest()

def safe_members(archive):
    names = set()
    for info in archive.infolist():
        p = Path(info.filename)
        if (p.is_absolute() or '..' in p.parts or '\\' in info.filename or
                p.as_posix() != info.filename.rstrip('/') or
                stat.S_ISLNK(info.external_attr >> 16) or info.filename in names):
            raise ValueError('Unsafe or duplicate archive entry')
        names.add(info.filename)

def recover(apk, destination):
    if destination.exists():
        raise ValueError('Output must be a new directory')
    if apk.stat().st_size != APK_BYTES or hashlib.file_digest(apk.open('rb'), 'sha256').hexdigest() != APK_SHA256:
        raise ValueError('Not the verified code601 reference')
    with zipfile.ZipFile(apk) as archive:
        safe_members(archive)
        hbc = archive.read('assets/index.android.bundle')
        if sha(hbc) != HBC_SHA256:
            raise ValueError('Unexpected host bundle')
        header, strings = reference.decode_strings(hbc)
        htmls = [(s, meta) for s, meta in strings if s.startswith('<!doctype html>') and s.rstrip().endswith('</html>')]
        workers = [(s, meta) for s, meta in strings if re.match(r'^\d+\n\{"version":0,"id":', s)]
        if len(htmls) != 1 or len(workers) != 1:
            raise ValueError('Ambiguous HTML/worker source')
        html, html_meta = htmls[0]
        worker, worker_meta = workers[0]
        worker_bytes = worker.encode('utf-8')
        first = worker_bytes.index(b'\n')
        second = worker_bytes.index(b'\n', first + 1)
        data_start = first + int(worker_bytes[:first])
        if data_start != second + 1:
            raise ValueError('Invalid worker header')
        bundle = json.loads(worker_bytes[first+1:second])
        if bundle['version'] != 0:
            raise ValueError('Unsupported worker version')
        data = worker_bytes[data_start:]
        files = []
        names = set()
        for virtual, spec in bundle['files'].items():
            path = Path(virtual)
            name = 'worker-files/' + virtual.lstrip('/')
            start, length = spec['offset'], spec['length']
            if (not virtual.startswith('/') or virtual.startswith('//') or '..' in path.parts or
                    '\\' in virtual or path.as_posix() != virtual or name in names or spec['mode'] not in (420, 493) or
                    type(start) is not int or type(length) is not int or start < 0 or length < 0 or
                    start+length > len(data)):
                raise ValueError('Invalid worker path/range')
            names.add(name)
            files.append((name, data[start:start+length], {'virtualPath':virtual,'dataStart':data_start,**spec}))
        end = 0
        for _, content, spec in sorted(files, key=lambda row:row[2]['offset']):
            if spec['offset'] != end:
                raise ValueError('Noncontiguous worker ranges')
            end += len(content)
        if end != len(data):
            raise ValueError('Unaccounted worker bytes')
        destination.mkdir(parents=True)
        outputs = []
        def write(name, content, provenance):
            path = destination/name
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_bytes(content)
            outputs.append({'path':name,'bytes':len(content),'sha256':sha(content),'provenance':provenance})
        # Preserve the literal string including padding for reversible recovery.
        write('ui/sanctuary.html', html.encode('utf-8'), html_meta)
        write('worker/qvac-worker.bundle', worker_bytes, worker_meta)
        notices = [(s, meta) for s, meta in strings if s.startswith('Solaris V5-A model notice\n')]
        if len(notices) == 1:
            write('model-notice.txt', notices[0][0].encode('utf-8'), notices[0][1])
        for name, content, provenance in files:
            write(name, content, provenance)
        for name in ('assets/index.android.bundle','assets/app.config','classes.dex','AndroidManifest.xml','resources.arsc','META-INF/version-control-info.textproto'):
            write('compiled-reference/'+name, archive.read(name), {'apkEntry':name})
        for i, encoded in enumerate(re.findall(r'data:image/png;base64,([A-Za-z0-9+/=]+)',html)):
            import base64
            content=base64.b64decode(encoded,validate=True)
            if not content.startswith(b'\x89PNG\r\n\x1a\n'):
                raise ValueError('Invalid PNG')
            write(f'ui/assets/embedded-{i+1}.png',content,{'operation':'base64 decode','occurrence':i+1})
        report={'format':'solaris-601-source-recovery/1','apkSha256':APK_SHA256,'hermesSha256':HBC_SHA256,
                'stringCount':len(strings),'functionCount':header['functionCount'],'workerFileCount':len(files),
                'originalNativeProjectRecovered':False,'outputs':outputs}
        (destination/'RECOVERY-MANIFEST.json').write_text(json.dumps(report,indent=2)+'\n')
        return report

if __name__ == '__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('apk',type=Path)
    parser.add_argument('new_destination',type=Path)
    args=parser.parse_args()
    report=recover(args.apk,args.new_destination)
    print(json.dumps({k:v for k,v in report.items() if k!='outputs'},indent=2))
