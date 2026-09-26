# Candidate 602 — completion admission guards

## Exact scope

This candidate is a binary-preserving reconstruction increment from verified
code 601. It closes two reproduced host dispatch gaps. It is not a full native
source rebuild or a completed LUCA lifecycle repair.

| Changed boundary | Evidence | Intended behavior |
| --- | --- | --- |
| Public completion, Hermes function 7314 | Original compiled function dispatches after foreground/cancellation changes during the awaited stream stage | Recheck the existing operation immediately before dispatch |
| Private completion, Hermes function 7337 | Original compiled function dispatches after its supplied eligibility predicate becomes false during that stage | Re-evaluate the existing predicate and operation check immediately before dispatch |

The inserted checks use the existing receiver, operation, predicate and
`CANCELLED` handling. There is no new await between these checks and completion.
No completion is retried. Existing request arguments, private output handling,
public receipts, cancellation and cleanup remain in the original bytecode.

Only these two function headers and the bytecode file length/footer change in
the original HBC span. Relocated bodies and exception tables are appended;
all original body/table/string/literal/debug bytes stay intact. All 15,511
other functions retain their headers and bodies. The legacy sourceHash is
retained as provenance, not represented as a hash of reconstructed source.
The complete new artifact has its own SHA-256.

APK packaging may update only Android manifest versionCode/versionName,
matching app.config version metadata, and the exact verified HBC asset.
Target: version code 602, `6.0.2-preview.sanctuary-guards`.
Package remains `org.solarishealth.edge.recovery`. Signing is conditional on
the independent compatibility gate and exact original certificate match.

## Compatibility evidence required before signing

1. Independent instruction/branch/register/exception review of the exact patch.
2. Actual original and repaired bytecode executed in the matching Hermes VM:
   24 coordinator comparisons, four admission probes and 17 completion cases.
3. Successful public/private streams and repeated calls retain returned data,
   receipts, trace/token behavior, retained model ID, cleanup and finalization.
   Five revoked/background/cancelled scenarios must dispatch zero requests.
4. APK entry comparison permits only the three declared payload changes.
   Native, DEX, vault/recovery implementation, IDs, model definitions, SDK and
   UI must remain byte-identical. Manifest semantics may differ only in version.
5. Original signer match and official APK signature/alignment verification.

## Explicit limits and remaining work

The reference VM uses synthetic dependencies, a deterministic clock and timer
fixtures. These tests do not prove actual Android/BareKit event delivery,
hardware inference, on-device persistence, model availability or elapsed
timeouts. No installation or device data access occurs in this build cycle.

SDK state reconciliation before heartbeat and on cached-worker reuse remains
pending. The deferred `step` callback race also remains. The full lifecycle
repair needs shared transition ownership, settlement tracking and compensating
suspend, as specified in `LIFECYCLE-REPAIR-DESIGN.md`.

The reconstructed editable coordinator covers its constructor and 14 methods;
the remaining compiled app is retained as evidence and as a build input. Missing
original application/Gradle source and unresolved native representations are
still identified in the R0/R1 assessment. The deliverable includes all editable
reconstruction, patch/build/test scripts and their inputs; it does not claim
that the complete original application source has been recovered.
