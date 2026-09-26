# R1: isolated recovery envelope reconstruction

Status: **portable component conformance passed; Android/app compatibility unverified**.

This component transcribes the completely readable six methods in code601's
decompiled `L5/b.java` into a standalone Java class. It does not recover the
original editable Android application, import a recovery file into a vault,
parse recovery JSON, create record IDs, access keys, or produce an APK. The
original DEX has not been executed by these tests. This file must not be used as
evidence that a replacement APK can safely update the installed application.

## Evidence and scope

All paths below are relative to the reconstruction project root.

| Evidence | What it establishes |
| --- | --- |
| `reference/native-decompiled/L5/b.java` | Envelope layout; size checks; key derivation; random salt/nonce generation; normalization; strict UTF-8 decoder; receipt HMAC verification. |
| `reference/native-decompiled/dependencies/p027d5/C0681d.java` | `f11148b` is UTF-8 and `f11152f` is US-ASCII. |
| `reference/native-decompiled/dependencies/com/facebook/react/fabric/mounting/mountitems/IntBufferBatchMountItem.java` | `INSTRUCTION_UPDATE_LAYOUT` is 128 (GCM tag bits) and `INSTRUCTION_UPDATE_EVENT_EMITTER` is 256 (derived-key bits). |
| `tests/recovery-codec/evidence/RUN-RESULTS.json` | Actual run result, environment versions, input hashes, export hashes, and limitations. |
| `tests/recovery-codec/evidence/SHA256SUMS.txt` | Hashes of source, test code, native evidence inputs, and saved test outputs. |

No JSON payload schema or Android recovery behavior has been inferred from this
codec. In particular, raw decrypted bytes may be invalid UTF-8; decoding is a
separate method in the evidence and remains separate here.

## Exact format recovered

| Offset | Length | Meaning |
| --- | --- | --- |
| 0 | 8 | US-ASCII `SVCORE1\n` |
| 8 | 32 | PBKDF2 salt |
| 40 | 12 | AES-GCM nonce |
| 52 | 4 | Signed Java big-endian plaintext byte length, required to be positive |
| 56 | Declared plaintext length | AES-GCM ciphertext |
| 56 + plaintext length | 16 | GCM authentication tag |

The complete 56-byte header is authenticated as AAD. Plaintext length is
1–16,777,216 bytes, inclusive. Envelope length is exactly plaintext length + 72,
therefore 73–16,777,288 bytes, inclusive. Key derivation is
`PBKDF2WithHmacSHA256`, 600,000 iterations, 256 bits. Encryption is
`AES/GCM/NoPadding` with a 128-bit tag. New encryption uses `SecureRandom` for
both salt and nonce, as in the recovered code; fixed values exist only in
public synthetic test fixtures, not in the production-facing method signature.

Passphrases are NFC-normalized, then require at least 20 Unicode code points
and at most 1,024 Java UTF-8 bytes. Spaces and NULs are not trimmed. The UTF-8
byte count uses `String.getBytes`, which replaces malformed UTF-16, matching the
recovered method. This is deliberately different from `decodeUtf8`, whose
decoder reports malformed/unmappable bytes. No extra passphrase rule has been
introduced. Android/JCA handling of malformed UTF-16 during PBKDF2 remains a
provider-specific compatibility unknown; the tests cover preservation at the
normalization stage, not Android derivation from malformed strings.

Receipt verification computes HMAC-SHA256 over the body's exact Java UTF-8
encoding, without NFC or other canonicalization. The body may be empty, but is
limited to 65,536 encoded bytes inclusive. Expected MAC must match the whole
lowercase pattern `[a-f0-9]{64}`. Comparison uses `MessageDigest.isEqual`.
Malformed expected strings and oversized bodies return false before key
initialization; a valid-shaped expected MAC with an empty key preserves the
JCA `SecretKeySpec` rejection instead of inventing a new false result.

## Editable source and method correspondence

`src/reconstructed/RecoveryEnvelope.java` uses only standard JCA/JDK APIs.
Its package is `reconstructed`, and its methods are static. This deliberate
isolation prevents it from being mistaken for restored Android wiring or a
drop-in replacement for obfuscated application classes.

| Native method | Portable method |
| --- | --- |
| `L5/b.a` | `decrypt(byte[], char[])` |
| `L5/b.b` | `deriveKey(char[], byte[])` |
| `L5/b.c` | `encrypt(byte[], char[])` |
| `L5/b.d` | `normalizePassphrase(char[])` |
| `L5/b.e` | `decodeUtf8(byte[])` |
| `L5/b.f` | `verifyReceiptMac(String, byte[], String)` |

Application error strings `RECOVERY_INVALID`, `RECOVERY_SIZE`, and
`RECOVERY_PASSPHRASE_LENGTH` and their ordering are preserved. Authentication
and decoding failures propagate from their JCA/charset providers. Java checked
exception declarations are explicit here; the original Kotlin-origin code
does not need identical declarations. Non-null preconditions still reject
null with `NullPointerException`; runtime-generated Kotlin versus JDK null
exception wording is not claimed identical.

The derived key is cleared in `finally` after encryption/decryption. The
normalized character copy and `PBEKeySpec` are cleared after key derivation.
`deriveKey` returns a caller-owned key just as the original does. Callers must
clear returned keys when done. The normalization operation creates Java
`String` objects, as in the evidence; no claim is made that all immutable
password intermediates can be erased.

## Reproduce the targeted tests

From the reconstruction project root, with JDK 17 and Python `cryptography`
available:

```sh
python tests/recovery-codec/run.py
```

The runner compiles with `java com.sun.tools.javac.Main --release 17 -Xlint:all
-Werror`, creates temporary synthetic fixtures, executes the Java harness, and
independently decrypts Java exports in Python. No downloads, Android devices,
application installs, keystores, or real user data are involved. The compile
output file is intentionally empty on success.

Recorded environment: OpenJDK 17.0.20, Python 3.12.14, and `cryptography` 46.0.0.
The run passed **112 Java assertions and 4 independent Python decrypt checks**.
Python uses `hashlib.pbkdf2_hmac`, `cryptography` AESGCM, and `hmac`; Java uses
JCA. The evidence includes three deterministic Python-encrypted inputs and
their expected derived keys, exact synthetic data, full Java/Python test
outputs, and hashes. Java-generated small randomized exports are retained.
The 16 MiB boundary export is checked, hashed, and discarded; the runner
documents and recreates its exact plaintext pattern. Its randomized envelope
hash changes on each successful rerun.

Coverage includes:

- Python encryption → Java decryption and key derivation for minimum size,
  NFC/astral Unicode, and arbitrary non-UTF-8 plaintext bytes.
- Java encryption → Python decryption for the same three cases and the full
  16,777,216-byte maximum.
- Wrong password; changes to salt, nonce, ciphertext, tag, and a size-consistent
  header length; magic corruption; truncation; trailing bytes; big-endian
  interpretation; minimum/maximum size and salt-length rejection.
- Passphrase boundary ordering; NFC reduction; code points versus UTF-16 code
  units; 1,024-byte and multibyte limits; spaces, NULs, and malformed UTF-16
  normalization behavior; unchanged caller arrays.
- Strict UTF-8 invalid sequences, valid Unicode, empty input, and preserved BOM.
- Independent HMAC vectors; exact/changed body and key; malformed/lowercase MAC
  rules; ASCII and multibyte receipt size limits; empty-body behavior;
  malformed UTF-16 replacement; provider empty-key rejection ordering.

The randomized-salt/nonce nonidentity assertion is only a smoke check, not a
cryptographic RNG proof. These tests establish agreement between this Java
translation and an independent Python interpretation of the recovered format.
They do not establish equality to an executed DEX implementation, Android
provider behavior, vault JSON compatibility, safe record merge/migration,
Android Keystore binding, recovery onboarding, signing-key continuity, or
installed-app update compatibility. Those remain separate release gates.
