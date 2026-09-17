#!/usr/bin/env python3
"""Meaningful fail-closed boundary tests for the guarded HBC writer."""
from pathlib import Path
import hashlib
import importlib.util
import json
import subprocess
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[3]
SCRIPT = ROOT / 'Solaris-Android-R2/tools/patch-completion-guards.py'
REFERENCE = ROOT / 'Solaris-Android-Reconstruction/src/recovered-601/compiled-reference/assets/index.android.bundle'
SPEC = importlib.util.spec_from_file_location('guard_writer_under_test', SCRIPT)
writer = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(writer)

class RejectionTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.reference = REFERENCE.read_bytes()
        cls.reference_hash = hashlib.sha256(cls.reference).hexdigest()

    def tearDown(self):
        self.assertEqual(hashlib.sha256(REFERENCE.read_bytes()).hexdigest(), self.reference_hash)

    def test_modified_reference_is_rejected(self):
        invalid = bytearray(self.reference)
        invalid[500_000] ^= 1
        with self.assertRaisesRegex(ValueError, 'not the verified code601 HBC'):
            writer.patch(bytes(invalid))

    def test_truncated_input_is_rejected(self):
        with self.assertRaisesRegex(ValueError, 'not the verified code601 HBC'):
            writer.patch(self.reference[:-1])

    def run_rejection(self, destination, expected_message):
        result = subprocess.run(['python3', str(SCRIPT), str(REFERENCE), str(destination)],
                                capture_output=True, text=True)
        self.assertNotEqual(result.returncode, 0)
        self.assertIn(expected_message, result.stderr)

    def test_existing_output_is_not_overwritten(self):
        with tempfile.TemporaryDirectory() as folder:
            destination = Path(folder) / 'occupied.hbc'
            marker = b'Existing output must survive'
            destination.write_bytes(marker)
            self.run_rejection(destination, 'Output exists')
            self.assertEqual(destination.read_bytes(), marker)
            self.assertFalse(destination.with_suffix('.writer.json').exists())

    def test_apk_output_is_rejected(self):
        with tempfile.TemporaryDirectory() as folder:
            destination = Path(folder) / 'forbidden.apk'
            self.run_rejection(destination, 'Output must be an analysis .hbc')
            self.assertFalse(destination.exists())

    def test_reference_tree_output_is_rejected(self):
        destination = REFERENCE.parent / 'forbidden-test-output.hbc'
        self.assertFalse(destination.exists())
        self.run_rejection(destination, 'Recovered reference subtree is read-only')
        self.assertFalse(destination.exists())

    def test_original_overwrite_is_rejected(self):
        self.run_rejection(REFERENCE, 'Original overwrite forbidden')

if __name__ == '__main__':
    unittest.main(verbosity=2)
