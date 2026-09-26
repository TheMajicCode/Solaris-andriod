#!/usr/bin/env python3
"""Run independent synthetic PBKDF2/AES-GCM/HMAC conformance checks; offline only."""

import hashlib
import hmac
import json
import platform
import re
import struct
import subprocess
import tempfile
import unicodedata
from pathlib import Path

import cryptography
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
EVIDENCE = HERE / "evidence"
EVIDENCE.mkdir(exist_ok=True)
SOURCE = ROOT / "src/reconstructed/RecoveryEnvelope.java"
HARNESS = HERE / "RecoveryEnvelopeConformance.java"
MAGIC = b"SVCORE1\n"


def digest(data):
    return hashlib.sha256(data).hexdigest()


def derive(password, salt):
    # Independent implementation uses CPython/OpenSSL PBKDF2, not JCA.
    normalized = unicodedata.normalize("NFC", password)
    assert len(normalized) >= 20
    encoded = normalized.encode("utf-8")
    assert len(encoded) <= 1024
    assert len(salt) == 32
    return hashlib.pbkdf2_hmac("sha256", encoded, salt, 600000, dklen=32)


def python_decrypt(envelope, password):
    assert envelope[:8] == MAGIC
    assert 73 <= len(envelope) <= 16777288
    salt = envelope[8:40]
    nonce = envelope[40:52]
    size, = struct.unpack(">I", envelope[52:56])
    assert 1 <= size <= 16777216
    assert len(envelope) == size + 72
    return AESGCM(derive(password, salt)).decrypt(nonce, envelope[56:], envelope[:56])


def run(command, logfile, cwd=ROOT):
    result = subprocess.run(command, cwd=cwd, capture_output=True, text=True)
    # All inputs are public synthetic fixtures; never accept external vault inputs.
    (EVIDENCE / logfile).write_text(result.stdout + result.stderr, encoding="utf-8")
    if result.returncode:
        raise RuntimeError(f"{logfile}: command failed with exit status {result.returncode}")
    return result.stdout + result.stderr


def main():
    # A failed rerun must not leave a previous success report as current evidence.
    for name in ("RUN-RESULTS.json", "SHA256SUMS.txt"):
        (EVIDENCE / name).unlink(missing_ok=True)
    checks = []
    input_manifest = []
    output_manifest = []
    vector_specs = [
        ("minimum", "a" * 20, b"\x00", bytes(range(32)), bytes(range(160, 172))),
        ("unicode", "Cafe\u0301-\U0001f331-synthetic-password-\u00e9", "synthetic bytes: espa\u00f1ol \U0001f331\n".encode(), bytes(range(32, 64)), bytes(range(172, 184))),
        ("binary", "binary-synthetic-password-001", b"\xc0\xaf\xed\xa0\x80\xff\x00", bytes(range(64, 96)), bytes(range(184, 196))),
    ]
    with tempfile.TemporaryDirectory(prefix="solaris-recovery-conformance-") as temp:
        tempdir = Path(temp)
        fixtures = tempdir / "fixtures"
        exports = tempdir / "exports"
        classes = tempdir / "classes"
        fixtures.mkdir()
        classes.mkdir()
        for name, password, plain, salt, nonce in vector_specs:
            key = derive(password, salt)
            header = MAGIC + salt + nonce + struct.pack(">I", len(plain))
            envelope = header + AESGCM(key).encrypt(nonce, plain, header)
            for suffix, value in {"pass": password.encode(), "plain": plain, "envelope": envelope, "key": key}.items():
                (fixtures / f"{name}.{suffix}").write_bytes(value)
            input_manifest.append({
                "name": name, "synthetic_passphrase": password,
                "plaintext_hex": plain.hex(), "salt_hex": salt.hex(), "nonce_hex": nonce.hex(),
                "pbkdf2_key_hex": key.hex(), "envelope_hex": envelope.hex(),
                "envelope_sha256": digest(envelope),
            })
        receipt_key = bytes(range(1, 33))
        receipt_bodies = {
            "body": "synthetic receipt caf\u00e9 \U0001f331\n",
            "empty": "", "limit_ascii": "x" * 65536, "over_ascii": "x" * 65537,
            "limit_unicode": "\u00e9" * 32768, "over_unicode": "\u00e9" * 32769,
            "replacement": "?",  # Java's UTF-8 getBytes replacement for an unpaired surrogate.
        }
        (fixtures / "receipt.body").write_text(receipt_bodies["body"], encoding="utf-8")
        properties = ["key=" + receipt_key.hex()]
        receipt_vectors = {}
        for name, body in receipt_bodies.items():
            mac = hmac.new(receipt_key, body.encode(), hashlib.sha256).hexdigest()
            properties.append(name + "=" + mac)
            receipt_vectors[name] = {"utf8_length": len(body.encode()), "hmac_sha256": mac}
        (fixtures / "receipts.properties").write_text("\n".join(properties) + "\n", encoding="ascii")
        run(["java", "--version"], "java-version.txt")
        run(["java", "com.sun.tools.javac.Main", "--release", "17", "-Xlint:all", "-Werror",
             "-d", str(classes), str(SOURCE), str(HARNESS)], "compile-output.txt")
        java_output = run(["java", "-Xmx512m", "-cp", str(classes),
                           "reconstructed.RecoveryEnvelopeConformance", str(fixtures), str(exports)],
                          "java-test-output.txt")
        java_checks = int(re.search(r"JAVA_CHECKS=(\d+)", java_output).group(1))
        for name, password, plain, _, _ in vector_specs:
            envelope = (exports / f"{name}.envelope").read_bytes()
            assert python_decrypt(envelope, password) == plain
            checks.append(f"PASS {name} Java encrypt to Python decrypt exact bytes")
            output_manifest.append({"name": name, "envelope_bytes": len(envelope), "envelope_sha256": digest(envelope)})
            # Retain small randomized exports as concrete evidence; all data is synthetic.
            (EVIDENCE / f"java-{name}.envelope").write_bytes(envelope)
        maximum_envelope = (exports / "maximum.envelope").read_bytes()
        maximum_plain = bytes(range(256)) * 65536
        assert python_decrypt(maximum_envelope, "synthetic-passphrase-20-plus") == maximum_plain
        checks.append("PASS maximum 16777216-byte Java encrypt to Python decrypt exact bytes")
        output_manifest.append({"name": "maximum", "envelope_bytes": len(maximum_envelope),
                                "envelope_sha256": digest(maximum_envelope),
                                "plaintext_sha256": digest(maximum_plain),
                                "retained": False, "reproduce": "Run this script; pattern bytes(range(256)) * 65536"})

    (EVIDENCE / "python-test-output.txt").write_text("\n".join(checks) + f"\nPYTHON_CHECKS={len(checks)}\n", encoding="utf-8")
    (EVIDENCE / "synthetic-vectors.json").write_text(json.dumps({
        "warning": "PUBLIC SYNTHETIC TEST DATA ONLY. Fixed salts/nonces are NOT an encryption API.",
        "envelope_vectors": input_manifest,
        "receipt_key_hex": receipt_key.hex(), "receipt_vectors": receipt_vectors,
    }, indent=2, ensure_ascii=True) + "\n", encoding="utf-8")
    evidence_inputs = [
        SOURCE, HARNESS, Path(__file__).resolve(),
        ROOT / "reference/native-decompiled/L5/b.java",
        ROOT / "reference/native-decompiled/dependencies/p027d5/C0681d.java",
        ROOT / "reference/native-decompiled/dependencies/com/facebook/react/fabric/mounting/mountitems/IntBufferBatchMountItem.java",
    ]
    result = {
        "status": "PASS", "scope": "Isolated JVM envelope conformance with synthetic data; not Android/app compatibility",
        "java_checks": java_checks, "python_checks": len(checks),
        "python_version": platform.python_version(), "cryptography_version": cryptography.__version__,
        "jca_algorithms": ["PBKDF2WithHmacSHA256", "AES/GCM/NoPadding", "HmacSHA256"],
        "python_algorithms": ["hashlib.pbkdf2_hmac(sha256)", "cryptography.AESGCM", "hmac(sha256)"],
        "inputs": [{"path": str(path.relative_to(ROOT)), "sha256": digest(path.read_bytes())} for path in evidence_inputs],
        "java_exports": output_manifest,
        "limitations": [
            "No execution on the Android provider or the original APK; malformed UTF-16 PBKDF2 behavior may be provider dependent.",
            "No real recovery payload, vault data, key material, signing key, app integration or JSON schema used.",
            "Random salt/nonce nonidentity is a smoke check, not a proof of RNG security.",
        ],
    }
    (EVIDENCE / "RUN-RESULTS.json").write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
    files = evidence_inputs + sorted(path for path in EVIDENCE.iterdir() if path.name != "SHA256SUMS.txt" and path.is_file())
    (EVIDENCE / "SHA256SUMS.txt").write_text("".join(
        f"{digest(path.read_bytes())}  {path.relative_to(ROOT)}\n" for path in files), encoding="utf-8")
    print(f"PASS: {java_checks} Java assertions; {len(checks)} independent Python decrypt checks.")
    print("Evidence: tests/recovery-codec/evidence/RUN-RESULTS.json")


if __name__ == "__main__":
    main()
