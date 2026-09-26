# Sovereignty and GPS

## GPS means the protocol, not the phone sensor

In the retained Solaris architecture, **GPS is the policy / allocation /
settlement / receipt protocol** for evidenced contributions and accountable value
distribution. It is **not** phone geolocation. Use the established name; do not
invent a new expansion for it, and do not let a location permission dialog borrow
the name.

Any location feature is a separate concern with its own purpose and permission.

## Preserved GPS concepts

| Concept | Meaning |
| --- | --- |
| Root `ValueEpisode` | The single root an allocation traces back to |
| Versioned policy snapshot | The exact rules in force when the allocation was computed |
| Attributable evidence | Signed or otherwise attributable contribution evidence |
| Finite allocation manifest | A bounded budget — not an open-ended entitlement |
| Per-output settlement receipt | One receipt per settled output |

**A signature proves control of a signing key.** It does not prove the truth of a
contribution, a professional qualification or unique human identity. Treat those
as four separate claims needing four separate kinds of evidence.

Preserve existing policy constraints as evidence and reconcile the accepted
profile before any monetary implementation. Do not hardcode a new split.

## Start shadow, move no funds

Begin with synthetic signed evidence and **shadow allocations that move no
funds**. Deterministic replay computes state; replay must never send a payment.
Execution, deduplication and reconciliation of uncertain settlements belong to a
separately authorized durable outbox. Retrying must not pay twice.

Keep health content, private Subject IDs and revealing health-derived hashes out
of public events, payment memos and blockchain metadata.

Fraud, dispute, limit and anti-abuse rules are prerequisites for any funded
pilot, not follow-up work. See `AND-11` and `AND-12` in the [Roadmap](ROADMAP.md).

## Discovery — BTC Map as a proposed read-only adapter

BTC Map describes **places reported to accept Bitcoin**. It is not a verified
Solaris clinic registry, a self-hosting registry or a trust badge.

These are four different claims, each needing its own source, verification
criteria, date and status:

| Claim | Evidence needed |
| --- | --- |
| "Accepts Bitcoin" | BTC Map listing plus its own verification date |
| "Runs a verified sovereign service" | Independent infrastructure assessment |
| "Belongs to a community" | That community's own membership evidence |
| "Is a qualified trusted practitioner" | Credential verification, separate from all of the above |

A merchant listing must never become an automatic sovereignty or medical-trust
badge.

### Integration rules

- **Read-only first.** BTC Map's API distinguishes REST read access from RPC
  write operations. Any contribution workflow needs separate explicit user
  approval.
- Preserve verification dates and source attribution. Disclose cached versus
  online status and data age.
- Start with user-entered places and regions; location access stays optional and
  explicit.
- **No health payloads in public map requests**, ever.
- Distinguish three separate licensing questions: BTC Map's software license,
  OpenStreetMap data attribution and ODbL obligations, and map-tile terms. Verify
  the exact chosen component before copying code or shipping a map.

References: [BTC Map](https://btcmap.org/),
[API overview](https://gitea.btcmap.org/teambtcmap/btcmap-general/wiki/API-Overview),
[merchant verification](https://gitea.btcmap.org/teambtcmap/btcmap-general/wiki/Verifying-Existing-Merchants),
[BTC Map license](https://btcmap.org/license),
[OpenStreetMap copyright](https://www.openstreetmap.org/copyright).

## Practical sovereignty in the app

The component should help a person understand custody and recovery, export their
data, practise backup and restore, recognize privacy boundaries, and choose where
to contribute time, skills or resources. Voluntary participation, understandable
consequences and real recovery paths matter more than any badge.
