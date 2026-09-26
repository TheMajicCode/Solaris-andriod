# Candidate 603 independent packaging review

Reviewer: `native_chat_repro`, independent of the packaging/signing tool author. No APK was signed, installed, pushed or deployed by this reviewer. Fixture credentials were not read or printed.

**Decision: APPROVE signing of the exact completed unsigned artifact below, within the reviewed packaging scope.**

The previously presented `packaging-candidate-03/candidate-aligned-unsigned.apk` was incomplete when inspected: 145,031,168 bytes, while its accompanying result recorded 242,582,511 bytes. Python rejected it as an invalid ZIP. Root confirmed the incomplete artifact and regenerated to a separate completed release path. The old incomplete artifact is not approved and must not be signed. The completed replacement was independently verified below; no inference is made about the original copy failure cause.

This review supersedes the candidate03 approval. The final candidate06 adds a conversation-only typed OUTPUT_LIMIT rejection and its diagnostic wording; request-helper/native model inputs are unchanged.

## Source reviewed

| File | SHA-256 |
|---|---|
| `tools/package-candidate.py` | `560afea26dfcf6f2691125220ab2593bac4afbdbffeabf9168349a29d1ff97ee` |
| `tools/sign-reviewed-candidate.py` | `58839b723f21b2c8578dd6566907c4e248a887bc118dd65accb1c12a762f0ff6` |
| `docs/PACKAGING-SCOPE.md` | `a464df44bd0500300aec0dac3a7659705204b80d06c53dcb08676b2acefec9d9` |
| `evidence/release-build-manifest.json` | `045dab7fd48ab09c169ed45ce498088fb57de33c40b6a749d4358b1e3cf7a9c3` |

## Source findings

The packager pins the exact signed 602 baseline (`01da9f...3bcd2cd`), original Hermes and manifest hashes, package ID, original version, expected existing certificate, and Android verification-tool hashes. The required build declaration binds the final patched Hermes bytes, size, package/version and declared scope. The declared final Hermes SHA-256 is `b8ac7d1b58d9e8ea6eadd25de516e35842aea14e4b849462664bb3200fedc990`.

Only three payload entries may change: the reviewed Hermes bundle, manifest version metadata, and app configuration version metadata. The packager compares every other payload's full SHA-256, size and compression method; requires 599 preserved entries; rejects duplicate/changed ZIP entry sets; and verifies all 51 native libraries remain uncompressed with 16 KiB APK data alignment. No native, database, vault, model or signing-identity reconstruction is performed by these tools.

The binary XML mutation preserves every string index and all string values except the version name. The typed root Android versionCode is located by element, namespace, resource ID and expected integer type. The output is checked against all other XML node bytes, then independently interpreted with `aapt2`; only version name/code semantic differences are allowed. Configuration JSON must equal the original with only its two version fields changed.

The signing tool requires an explicit execution flag and a hash-bound approval gate. It checks exact baseline, final Hermes, unsigned APK, build declaration, packaging source and signing source hashes. At least two review records must have distinct reviewer identifiers and distinct file paths, approve decisions, and matching nonempty review-file hashes. This binds supplied review evidence; independence and review content remain matters for actual reviewers and root to establish. The signing gate must reference the final actual artifact, not the rejected incomplete file or an earlier structural probe.

The key fixture/configuration are hash-pinned and restricted to owner permissions. The signer reads credentials locally only after pre-sign verification and passes them on standard input; command arguments and saved command logs contain no credential values. It generates no keys. It uses v2 signing only, preserving the baseline's signature scheme. Post-sign packaging verification requires a valid signature from exactly the existing certificate `fac61745dc0903786fb9ede62a962b399f7348f0bb6f899b8332667591033b9c` and rechecks all payload/manifest/alignment boundaries.

No source blocker was found in this narrow packaging/signing workflow. Root must freeze covered inputs before issuing the gate. A changed script, bundle, manifest, unsigned APK or review requires a new gate. This review does not establish Android phone behavior, full app-source reconstruction or clinical factual reliability.

## Independent completed-artifact verification

Verified `evidence/packaging-final06/candidate-aligned-unsigned.apk`: 242,582,583 bytes, SHA-256 `696333f57c630df950bdb369bc9bec339e44ec332ab3f2617d4b8a82896f4292`. Its packaged Hermes SHA-256 is `b8ac7d1b58d9e8ea6eadd25de516e35842aea14e4b849462664bb3200fedc990`.

A separately authored verifier, `solaris-603-native-probe/independent_packaging_verify.py`, passed 723 checks. It independently reads every ZIP payload and compression method, parses manifest string-pool and root attributes, compares every other AXML node byte, checks native data offsets directly, and invokes the pinned Android tools. It established:

- 602 unique entries, exactly three permitted changed payloads, 599 byte-identical payloads.
- All 51 native libraries byte-identical, uncompressed and aligned at 16 KiB APK data offsets; `zipalign -c -P 16 4` also passed.
- Package `org.solarishealth.edge.recovery` retained, versionCode 603 and versionName `6.0.3-preview.pocket-chat`. Every other configuration JSON field and manifest semantic node is preserved.
- The signed baseline verifies with the existing certificate. The candidate currently has no accepted signature, as expected for the reviewed unsigned input.
- Candidate SHA-256 was unchanged across the entire verification.

Verifier source SHA-256: `1a4627f7ec890998a236afd11028e370e152786431a3f99876f48c7c47a1e171`.
Result `solaris-603-native-probe/packaging-independent-candidate06-unsigned.json` SHA-256: `f98f43fb79c5c044dbb3aeb438f5da64ee36a5d056bf33e8322dccdbffc4a653`.

This approval applies only to these exact unsigned APK, Hermes, declaration and packaging/signing sources. A final signed artifact must independently verify with the original certificate and preserved payload/alignment boundaries. This reviewer has not signed it. A changed artifact requires fresh review.

## Integrated QvacService request and stream review

I read `tests/qvac-run.py` and `tests/qvac-postlude.js`, checked the recorded source/compiled fixture hashes, and independently reran the provenance command from `evidence/qvac-final-candidate06` against the exact final Hermes bundle above. All 24 cases passed, with 966 captured modules and Android entry points suppressed as intended. The rerun is saved at `solaris-603-native-probe/qvac-independent-candidate06.json`, SHA-256 `6c6ba4775fd26b75fcf1f8224dc5fbb2cb57f23dbc639f15c7d7c416559c64d7`.

The actual patched QvacService request matched editable helper `src/conversation-request.js` SHA-256 `33f7e34b75c5e0b15bc7af32df1b2084c483792549be2295f73e7b8e32af6042` for zero-source, Spanish, factual, allowed-action and recent-pair envelopes produced by the original compiler. This is the same helper independently exercised through the recovered SDK schema translation and the exact pinned public model in the separate native probe. That native probe completed five requested cases on Linux, including greetings, current-message and previous-pair name recall, and a synthetic check-in. Its scope and quality limitations remain documented in `solaris-603-native-probe/REPORT.md`.

The integrated suite confirms that `thinkingDelta` events do not enter private content or public onToken/output; successful final settlement need not carry an explicit stopReason; private completion cleans current operation/timers; and the nonconversation task retains its original generic JSON request. The five reproduced 602 admission cases still prevent SDK dispatch after eligibility revocation, foreground loss or cancellation. Initially denied, not-ready, empty, malformed and repeated-operation boundaries also passed. Public setup greeting retains its original request and public content stream.

These 24 cases use synthetic SDK/model, timers and provisioner boundaries. Their factual-request fixture returns a synthetic greeting without refs, so that particular suite proves request construction and stream behavior, not factual-validator acceptance. They do not prove Android transport, phone timeout recovery, background scheduling or model quality. The separate Linux model cases do not close those Android gaps.

The recovered SDK maps budget/context exhaustion to explicit `stopReason: "length"` and includes that in its final aggregate; it does not classify length itself as error/cancelled. Ordinary EOS can omit stopReason. Candidate06 now rejects an explicit length stop on the conversation branch with the existing typed RuntimeError code OUTPUT_LIMIT, after the original post-await eligibility check and before successful result acceptance. I reviewed the guard insertion in `tools/build-chat-bundle.py` (SHA-256 `60c6e3792188d8690a17b622a27c4ea86a15331662ea44326e133c9784ba5962`) and independently reran the five added actual-bytecode cases. Parseable conversation JSON with an explicit length stop is rejected and inference marked failed; the unrelated local-task length behavior is retained; and revocation, foreground loss and cancellation each take priority. The original missing-stopReason success cases still pass. Test source SHA-256 is `46d5916a7df7b1353772d188e2ac18d6b16d84b095eead7713f082ac7ef26bce`.

The five native helper cases completed EOS below their budgets. Model factual accuracy, prompt-injection resistance and long-chat capability remain limited and are not approved by this packaging review. The new UI wording is separately reviewed by the UI reviewer; this review does not replace that decision.
