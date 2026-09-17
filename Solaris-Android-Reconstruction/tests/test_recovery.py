"""R0 source recovery checks; no Android runtime, network, vault or APK mutation."""
import hashlib
import io
import json
from pathlib import Path
import stat
import struct
import sys
import tempfile
import unittest
import zipfile

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT/'tools'))
import recover_601 as recovery

class RecoveryTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.source = ROOT/'src/recovered-601'
        cls.manifest = json.loads((cls.source/'RECOVERY-MANIFEST.json').read_text())
        cls.bundle = (cls.source/'compiled-reference/assets/index.android.bundle').read_bytes()
        cls.header, cls.strings = recovery.reference.decode_strings(cls.bundle)

    def test_every_recovered_file_is_manifested_and_byte_exact(self):
        rows = self.manifest['outputs']
        expected = {row['path'] for row in rows}
        self.assertEqual(len(rows), len(expected))
        actual = {str(p.relative_to(self.source)) for p in self.source.rglob('*') if p.is_file()}
        self.assertEqual(actual, expected | {'RECOVERY-MANIFEST.json'})
        for row in rows:
            with self.subTest(path=row['path']):
                data = (self.source/row['path']).read_bytes()
                self.assertEqual(len(data), row['bytes'])
                self.assertEqual(hashlib.sha256(data).hexdigest(), row['sha256'])

    def test_literal_ui_retains_hbc_padding_and_roundtrips(self):
        text, meta = next((s,m) for s,m in self.strings if s.startswith('<!doctype html>'))
        actual = (self.source/'ui/sanctuary.html').read_text()
        self.assertEqual(actual,text)
        self.assertEqual(len(text)-len(text.rstrip()),2681)
        raw = self.bundle[meta['byteOffset']:meta['byteOffset']+meta['rawByteLength']]
        self.assertEqual(actual.encode(meta['encoding']), raw)

    def test_worker_files_have_exact_contiguous_provenance(self):
        worker = (self.source/'worker/qvac-worker.bundle').read_bytes()
        rows = sorted((r for r in self.manifest['outputs'] if r['path'].startswith('worker-files/')),
                      key=lambda r:r['provenance']['offset'])
        self.assertEqual(len(rows),1013)
        end=0
        for row in rows:
            meta=row['provenance']
            self.assertEqual(meta['offset'],end)
            start=meta['dataStart']+end
            self.assertEqual((self.source/row['path']).read_bytes(),worker[start:start+meta['length']])
            end+=meta['length']
        self.assertEqual(rows[0]['provenance']['dataStart']+end,len(worker))

    def test_model_notice_preserved(self):
        value=next(s for s,_ in self.strings if s.startswith('Solaris V5-A model notice\n'))
        self.assertEqual((self.source/'model-notice.txt').read_text(),value)

    def test_hbc_tamper_rejected(self):
        damaged=bytearray(self.bundle);damaged[-100]^=1
        with self.assertRaisesRegex(ValueError,'footer hash'):recovery.reference.decode_strings(damaged)

    def test_unsupported_hbc_rejected(self):
        damaged=bytearray(self.bundle);struct.pack_into('<I',damaged,8,95)
        with self.assertRaisesRegex(ValueError,'Only Hermes'):recovery.reference.decode_strings(damaged)

    def test_existing_output_is_never_overwritten(self):
        with tempfile.TemporaryDirectory() as tmp:
            destination=Path(tmp);marker=destination/'sentinel';marker.write_text('retained')
            with self.assertRaisesRegex(ValueError,'new directory'):recovery.recover(Path('absent.apk'),destination)
            self.assertEqual(marker.read_text(),'retained')

    def test_wrong_baseline_rejected_without_output(self):
        with tempfile.TemporaryDirectory() as tmp:
            p=Path(tmp);apk=p/'wrong.apk';apk.write_bytes(b'not an apk');out=p/'output'
            with self.assertRaisesRegex(ValueError,'verified code601'):recovery.recover(apk,out)
            self.assertFalse(out.exists())

    def check_rejected_member(self,name,mode=stat.S_IFREG|0o644):
        data=io.BytesIO()
        with zipfile.ZipFile(data,'w') as z:
            info=zipfile.ZipInfo(name);info.external_attr=mode<<16;z.writestr(info,b'payload')
        data.seek(0)
        with zipfile.ZipFile(data) as z:
            with self.assertRaisesRegex(ValueError,'Unsafe'):recovery.safe_members(z)

    def test_traversal_absolute_and_alias_entries_rejected(self):
        for name in ['../escape','/absolute','a/../b','a\\b','a/./b','a//b']:
            with self.subTest(name=name):self.check_rejected_member(name)

    def test_symlink_rejected(self):self.check_rejected_member('link',stat.S_IFLNK|0o777)

    def test_duplicate_entries_rejected(self):
        data=io.BytesIO()
        import warnings
        with warnings.catch_warnings():
            warnings.simplefilter('ignore',UserWarning)
            with zipfile.ZipFile(data,'w') as z:z.writestr('same',b'a');z.writestr('same',b'b')
        data.seek(0)
        with zipfile.ZipFile(data) as z:
            with self.assertRaisesRegex(ValueError,'duplicate'):recovery.safe_members(z)

if __name__=='__main__':unittest.main(verbosity=2)
