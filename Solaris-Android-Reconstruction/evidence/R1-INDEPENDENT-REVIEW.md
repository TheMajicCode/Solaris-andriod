# R1 independent review — isolated recovery envelope codec

Date: 2026-09-15. Reviewer: independent compatibility-audit agent. Review scope: compare the mechanical Java port to code601 L5.b and resolved dependency constants, inspect both test implementations and recorded results, and verify final file hashes. The reviewer changed no implementation or tests.

## Verdict

**PASS for the isolated, unwired reference codec.** No format, parameter or control-flow mismatch requiring changes was found in the six reviewed methods. This is not Android/app compatibility approval and does not satisfy the gate for a signed candidate. The class remains outside Android wiring and has no vault, Keystore, filesystem, record-migration or identity integration.

## Final reviewed identities

| File | SHA-256 |
|---|---|
| `src/reconstructed/RecoveryEnvelope.java` | `5acb764001ec0f1be2bc9c1221184a14941532bf8c3d9d0928c9a9f3233af253` |
| Java conformance harness | `3608439897eadfaf44311473cb8eb4202a82f2101f618549eec246d368da62a2` |
| Python independent reader/runner | `866f84c0602fdd10657a1c9b1c0b809f5f7eb7a5d9bd47a68434cb7436944eb8` |
| `tests/recovery-codec/evidence/RUN-RESULTS.json` | `73297334ae1adeeb4ad0497fce26fac4b1d6a26ed66ef1afe75d26bff29bc8ad` |
| `docs/RECOVERY-CODEC.md` | `406e512280cc479210604fd9faba71ebd8bdd4114862df76f26992f045eacb10` |
| Decompiled evidence `L5/b.java` | `de02325045b043144146197e4753011954d25472ca58829a7e45abf54f581405` |

Full review identities and scope decision are in `R1-REVIEW-HASHES.json`. A source/test change invalidates this hash-bound review until reassessed.

## Comparison against recovered native evidence

- Decrypt validates minimum/maximum envelope length and magic before reading the length field. It preserves signed big-endian length interpretation, positive/plaintext limit and exact plaintext+72 total length before KDF/authentication. Header AAD, salt/IV slicing, tag size and ciphertext boundary match L5.b.
- Key derivation requires exactly 32 salt bytes; uses NFC-normalized passphrase, 600,000 PBKDF2-HMAC-SHA256 iterations and 256-bit output. The resolved original integer constants confirm 256-bit keys and 128-bit GCM tags. Temporary normalized characters and PBEKeySpec password are cleared in finally blocks, matching the evidence.
- Encrypt preserves plaintext 1..16,777,216 bytes; generates a fresh 32-byte salt and 12-byte nonce using SecureRandom; constructs the exact 56-byte header; authenticates that header; and concatenates ciphertext/tag without adding new fields. The public encryption API cannot accept fixed test salts/nonces.
- Passphrase normalization uses Unicode code points, not UTF-16 units, and applies the 1,024 Java UTF-8 byte cap after NFC. Spaces/NULs are retained. Java getBytes replacement semantics for malformed UTF-16 remain distinct from the strict decoded-byte method. No stronger assumed password policy was inserted.
- Strict UTF-8 decoding remains a separate operation, preserving raw-byte decrypt behavior. Invalid plaintext bytes can decrypt successfully and later fail explicit decoding, as in the original.
- Receipt verification uses exact body bytes, inclusive 65,536-byte cap, lowercase 64-hex expected MAC, HMAC-SHA256 and constant-time comparison primitive. Early false results versus JCA empty-key exceptions preserve the recovered ordering. No JSON normalization/canonicalization was introduced.
- The documented conversion to static methods, checked Java exceptions and JDK null checks is explicit. Kotlin/JDK null exception text and provider-specific exception wording are not claimed identical; no Android bridge depends on this new class.

## Test review and verification

The implementation agent's recorded run passed **112 Java assertions and 4 independent Python decrypt checks**, using OpenJDK 17.0.20, Python 3.12.14 and cryptography 46.0.0. I reviewed the complete Java harness and Python runner, checked the run result and logs, and independently verified **21 current source/evidence hash comparisons** against their manifests. I did not rerun the full suite; the executed-test claim is bound to the implementation agent's retained run evidence.

The tests are meaningful for the component boundary: deterministic Python-produced envelopes and derived keys are read by Java; independently implemented Python PBKDF2/AES-GCM reads Java-generated exports, including the full 16 MiB limit. They cover authenticated salt/nonce/ciphertext/tag/header changes, wrong password, malformed lengths/magic/trailing data, NFC/astral Unicode/codepoint and encoded-byte boundaries, exact receipt HMAC bodies/limits, strict UTF-8 failures and caller-array preservation. Synthetic fixtures are explicitly labeled and separate from the encryption API. The runner removes stale success reports before reruns.

The maximum randomized envelope is hashed but not retained; its exact plaintext pattern and reproduction procedure are documented. Small randomized Java exports and deterministic Python vectors are retained. Tests use only synthetic data and no Android APIs, real vault files or signing material.

## Limitations retained as gates

- The original DEX and Android JCA providers were not executed. Agreement between a Java translation and an independent Python interpretation does not prove complete DEX behavioral equivalence or every Android-provider edge case.
- Malformed UTF-16 passphrases are tested at normalization, not Android PBKDF2 execution. This remains a provider-specific interoperability unknown.
- No recovery JSON schema, duplicate-key parser, owner capsule, receipt/state validator, database transaction, record ID migration or Android restore workflow is implemented here. L5.n$a structured-parser uncertainty remains outside R1.
- No key wrapping, Keystore binding, authentication callbacks, vault storage paths, lifecycle authority, model state or app host is connected. The codec cannot be treated as an Android replacement merely because it compiles on the host.
- Random salt/nonce inequality is only a smoke check. Neither test counts nor that check establish RNG security, production readiness or update safety.

R1 provides a reviewable, tested reconstruction of a specific portable format primitive. The full application's compatibility gate remains closed.

## Final checkpoint assessment spot-check

The reviewer also read `docs/COMPATIBILITY-ASSESSMENT.md` (SHA-256 `cb079798d6f852cdae25e734f7196c76b2ae88f9431d9f6098db9e886bf44a74`). No material overclaim was identified. It distinguishes byte recovery, host/helper tests and isolated codec conformance from Android/app compatibility, retains decompiler/syntax failures and the blocked signing gate, and accurately says no new APK was built or installed. The checkpoint may be packaged as an editable reconstruction artifact; it must not be labeled a verified Android replacement.

The native recovery author preserved the additional L5.n$a fallback and explicitly documented its control-flow uncertainty in the frozen native report (SHA-256 `8903b0f50fc41151736a8aa1d93dfcc9e77de2dfb0a69f4558cc550d1828e24b`). No parser implementation was introduced.
