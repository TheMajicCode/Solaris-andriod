# Cross-product contracts

An index of what is **accepted** versus **proposed** between Solaris Android and
the other Solaris products. No executable schema in this repository is an agreed
inter-product contract, and none is presented as one.

## Accepted

**None yet.** No cross-product contract has been jointly agreed and versioned.
Anything that behaves like one today is an implicit assumption, which is exactly
what `AND-05` exists to replace.

## Proposed — specification only

| Contract | Between | Status | Specification |
| --- | --- | --- | --- |
| Identity binding | Android ↔ Clinic OS ↔ web | Proposed | [ADR-0003](../docs/decisions/ADR-0003-optional-adapters.md), [Architecture](../docs/ARCHITECTURE.md) |
| Consent / sharing grant (recipient, records, purpose, duration, revocation) | Android ↔ Clinic OS | Proposed | [Data and consent](../docs/DATA-AND-CONSENT.md) |
| Delivery and acknowledgement receipts | Android ↔ Clinic OS | Proposed | [Data and consent](../docs/DATA-AND-CONSENT.md) |
| Contribution evidence and allocation (GPS) | Android ↔ policy authority | Proposed | [Sovereignty and GPS](../docs/SOVEREIGNTY-AND-GPS.md) |
| Settlement receipts | Android ↔ wallet adapters | Proposed | [Economic passport](../docs/ECONOMIC-PASSPORT.md) |
| Discovery read model | Android ↔ BTC Map / web | Proposed | [Sovereignty and GPS](../docs/SOVEREIGNTY-AND-GPS.md) |

## What a contract must carry before it moves out of "proposed"

1. An explicit **version**, and a stated compatibility policy across versions.
2. **Test vectors**, including negative cases — expired grants, revoked access,
   wrong recipient, replayed evidence, malformed payloads.
3. A named **metadata boundary**: what each party and each intermediary can
   observe, encrypted transport included.
4. Agreement recorded on **both** sides, in both repositories.

Physical repository separation does not enforce protocol compatibility. Sharing
the Solaris name gives no product automatic access to another product's data.

## Scope note

This repository does not write to the Solaris web repository. Contract alignment
is joint documentation work (`AND-05` in the [Roadmap](../docs/ROADMAP.md)) and
assumes no remote repository write access.
