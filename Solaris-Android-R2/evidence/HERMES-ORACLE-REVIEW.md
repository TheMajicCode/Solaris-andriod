# Independent Hermes oracle review

Date: 2026-09-15. Reviewer: independent compatibility-audit agent, with a separate read-only harness reviewer. The historical v2 review is retained below; the final hash-bound addendum records the hardened gate and independent original/patched reruns. No implementation, bytecode or APK was edited by this reviewer.

## Independently reproduced result

The reviewer executed the exact five-argument runner command using the original code601 HBC, test capture prelude, transpiled baseline source and `compare-v2.compiled.js`. Result: **24/24 differential cases and all four original-only witnesses passed**. Process exit was 0, stderr empty, and stdout contained exactly one complete JSON object. The parsed object exactly equals `evidence/hermes-differential-result.json` as it existed for v2. Output SHA-256: `a74762fe91e66734d60e1705ba1c844cec9625af3069c53ff938824ddc61e3fb`.

The reviewer independently required a completed `pass:true` result, expected case/witness counts and every individual pass, rather than accepting shell exit code alone. All command inputs remained unchanged during that rerun. The HBC was independently compared byte for byte with `assets/index.android.bundle` inside the verified code601 APK.

Command executed from the shared workspace:

```sh
reconstruction-work/r2-tools/hermes-runner \
  Solaris-Android-R2/tests/hermes/capture-prelude.js \
  Solaris-Android-Reconstruction/src/recovered-601/compiled-reference/assets/index.android.bundle \
  Solaris-Android-R2/tests/hermes/baseline.compiled.js \
  Solaris-Android-R2/tests/hermes/compare-v2.compiled.js
```

## Reviewed v2 identities

| Input | SHA-256 |
|---|---|
| Editable baseline source | `8962620f87095abcc7b48c9b672e0a47797ed286292f7d19634e61bf60130e30` |
| Original code601 HBC | `ac973292961cc7a1505a47a416ecafdff2e1688b7eac31f20571e503d74ec177` |
| Test capture prelude | `88c7cb3f85637a06435056eaf4a6693dd0aa604a8fa9293fc2b0927dff9d6e46` |
| Baseline Babel input script | `44d96e6a2b8186908b86ea9bb2739d8b293a0d0e739059b19d22dae9f2b49f68` |
| Baseline transpiled JS | `0e6014dfb5a1ba25df8c0fd3dc25d77df5fc22324f215f192f7f4b8cd13e8f4e` |
| v2 comparison source | `3c54a15771dfa88781bb5db079e442927c4bfb90aa6953a073c95ec26e3e1b25` |
| v2 comparison transpiled JS | `01cf7c4ca2dfcf3ee0d84666e73b9a8df93886fedd8992e0eb6f14247cd6e61a` |
| Custom JSI runner | `975e603f58329a5e4b1daba3bf14562c002f38aee22144ea69683883d6640a3c` |

## Isolation and independence

The prelude intercepts Metro `__d` registration and stores the original factory function objects; it intercepts `__r` startup calls without running the application entrypoints. The recorded attempted entrypoints are 191, 3 and 0. The original HBC registers 966 factories. The original test branch instantiates captured factory 591 with a fresh module cache and obtains its own QvacService export. The source branch independently calls `createQvacServiceBaseline(deps)`. No reconstructed method is injected into the original class or prototype.

Each variant gets new synthetic runtime, provisioner, trace, policy and service state. Explicit mocks replace filesystem/device/model/runtime/policy/provisioner modules; helper factories come from captured bytecode. The observed executed factory IDs are 8, 9, 10, 11, 12, 38, 39, 40, 41, 42, 43, 67, 591, 592. These are recorded evidence of the current run, not a guarantee about unrestricted future fixtures.

The custom C++ runner evaluates files in one locally built Hermes VM with its microtask queue enabled and drained after each file. Only `print` is exported by the runner as a host function. It reads the explicitly provided command-line inputs but exposes no Android, filesystem, network, QVAC or Keystore adapter to JavaScript. It does not install or launch the Android app. The reference methods are actual original Hermes function bodies running with synthetic dependencies; this is stronger than comparing two source transcriptions, but it remains a host test.

## Tool and transformation provenance

The reviewer checked current size/SHA-256 against the retained manifest for all eight tool artifacts: React Native tarball, hermesc, hermes, hvm, hbcdump, libhermes, libjsi and the runner. React Native tarball SHA-512 matches the recorded npm integrity, and its Hermes version pin agrees with the retained official-source tag. The runner build command, library linkage and prior microtask/error probes are retained. This review did not independently rebuild the VM or reacquire tools from the network.

The baseline script was independently verified to be exactly the editable source with only its ESM export removed and the documented generated-file header prepended. Babel standalone 7.28.5 implementation hash and baseline input/output provenance match. Babel lowers classes, async generators, parameters, destructuring, spread and optional/nullish syntax for this analysis harness. The `.compiled.js` files are transpiled JavaScript evaluated by Hermes, not replacement APK bytecode. The final comparison-source hash must be refreshed after harness hardening.

## Meaning of the result

The 24 cases compare event order, selected final fields and JSON-normalized returns/errors under the enumerated synthetic schedules. They include startup/cached startup, guards, startup/background ordering, queued lifecycle transitions, thenable/pending settlement, cancellation, cleanup and lifecycle queue replacement. They do not prove equality of every field, object identity, undefined/function value, untested method or possible interleaving. `publishProgress` and `cancelRequest` remain statically reviewed but are not covered by these 24 differential cases. Event arguments are recorded by reference; no concrete masking problem was observed here, but the logs are not immutable snapshots of arbitrary future objects.

Original-only witnesses run methods absent from the partial source. Their concrete v2 results are:

| Witness | Observed original-bytecode result |
|---|---|
| Private initially denied | No completion call; `CANCELLED` at local stage |
| Private eligibility revoked during stream stage | One sentinel completion call with eligibility false, active true |
| Public model not ready | No completion call; `QVAC_NOT_READY` at stream stage |
| Public background flag changes during stream stage | One sentinel completion call with active false |

The positive witnesses throw `SYNTHETIC_DISPATCH_PROBE` immediately at the fake completion boundary. No model request reaches a real worker and no user data is processed. These results demonstrate a missing synchronous recheck after that mocked JavaScript stage boundary. They do not establish an observed Android/vault disclosure, real inference, or the root cause of every reported LUCA failure.

## Findings raised for reusable-gate hardening

1. **Completion must be parsed.** The v2 async catch prints `HARNESS_ERROR` without rethrow, and failed comparisons can print JSON while exiting 0. A durable runner must reject missing/error/multiple output, require the expected complete JSON shape/counts and individual pass flags, and never accept exit 0 by itself. The reviewer used this stricter gate for the independent rerun above.
2. **Witness assertions were too weak.** v2 negative witnesses only require no dispatch, without asserting the expected cancellation/not-ready code; positive witnesses do not assert the recorded false eligibility/public-active flag. The existing concrete output shows the intended values, so it is valid evidence of that run; tighten assertions to prevent future unrelated errors or conditions from false-passing.
3. **Allowlist wording exceeded enforcement.** v2 allows modules 0–100 plus 591/592 instead of the exact observed helpers. The current run loaded only expected helpers, but the comment claiming every unexpected dependency access fails closed is broader than the code. Use an explicit inspected helper allowlist and continue treating mocked missing-member failures as harness risks.

Root acknowledged these findings and is hardening the postlude/wrapper. The final addendum must record the resulting source/output hashes and independent rerun before this report approves the reusable gate.

## Final approval boundary

Observed v2 parity and witness results are independently confirmed. No general behavior-equivalence, repair, full native integration, signing or installation claim is approved. Any later two-guard candidate requires separate review of the actual changed instructions, normal-path parity, authority-loss behavior and artifact integrity; this oracle baseline review does not pre-approve that patch.


## Final hardened-gate addendum

**Bounded PASS on 2026-09-15.** The reviewer independently reran the final wrapper in both original and `--patched` modes. Each completed with exit 0, no runner stderr, exactly one JSON result, 24/24 differential cases, four/four expected witnesses, 966 captured factories, startup suppression `[191,3,0]` and the exact 14-module execution allowlist. This supersedes the pending-hardening statements above.

The final postlude snapshots event arguments through JSON at emission, permits only the observed helper/factory IDs, checks the negative witness error codes, and checks false eligibility/public-active flags on original positive dispatch witnesses. The mode flag changes only expected witness outcomes: the original bytecode must dispatch at the two demonstrated post-stage sites; the patched bytecode must return `CANCELLED` without dispatch there. The 24 source comparison cases retain the same expected parity in both modes. The strict Python wrapper rejects nonzero runner exit, stderr, missing/extra/non-JSON output, incomplete counts or failed cases. Invoke the recorded normal `python3` command; its assertions are part of the gate and must not be disabled with Python optimization.

The relocated-runner wrapper verifies the exact SHA-256 of the executable and both retained Hermes/JSI libraries before launching. The reviewer ran the new wrapper, including its binary checks; this review still does not claim an independent rebuild of those libraries. The ESM transformation now removes only the one named export before the retained Babel transform; the historical generated header is absent from these fresh temporary build inputs.

Commands independently executed from the workspace:

```sh
python3 Solaris-Android-R2/tools/run-hermes-comparison.py --output /workspace/scratch/7a1f5a13b137/reconstruction-work/r2-final-review-original.json
python3 Solaris-Android-R2/tools/run-hermes-comparison.py --patched --output /workspace/scratch/7a1f5a13b137/reconstruction-work/r2-final-review-patched.json
```

| Final input / output | SHA-256 |
|---|---|
| Baseline source | `8962620f87095abcc7b48c9b672e0a47797ed286292f7d19634e61bf60130e30` |
| Capture prelude | `88c7cb3f85637a06435056eaf4a6693dd0aa604a8fa9293fc2b0927dff9d6e46` |
| Comparison postlude | `f3e370d994b9636b6530fe2cc711cbed413fd54c96cbb48b6cd4f73b607aaa5d` |
| Comparison wrapper | `c0eda706568e7ad785d7054908ffe44da197b59f5408bb52af3fd9fcf570e1f0` |
| Pinned-runner wrapper | `00311e4b810585c9860fb669b76f10ce350e733fcc5e1eaf41a9ab12671fd870` |
| Babel transformation tool | `976bda4cb727be86568370abf4427c8121dd8e0d8e5fb3965b1250b06111034a` |
| Verified tool manifest | `72ca104a34f0ba1b36c402793726d2643f8ba01371958c56798b531aeb1e47e8` |
| Patched analysis HBC | `fd8b38bcdd42421c18da4a0b69b2d58906ceddd7c4a2044b34faed51490f4653` |
| Independent original result | `c01c31262f04445c43626ed5319200bdbd57e420c3e36d974ca3dd58c89ed7b4` |
| Independent patched result | `77ab108f9b0958fe9dfa39bd54843b76cda2c7b508d7181ad329c49d3f4a6767` |

The original and patched result/provenance objects are also copied into `evidence/reviewer-oracle-reruns/` for inclusion with the deliverable. Their build directories retain transpiled inputs and stdout/stderr. These results approve the stated desktop synthetic tests. They do not expand the 14-method reconstruction, cover untested interleavings, prove Android/BareKit lifecycle behavior, exercise real models or authorize signing/installation. The two-guard instruction and behavioral review is recorded separately.
