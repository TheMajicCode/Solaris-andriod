# ADR-0003 — Optional adapters stay documented until separately approved

**Status:** Accepted · **Date:** 2026-09-17

## Context

The product vision includes Bitcoin/Lightning payments, a stablecoin wallet, GPS
contribution settlement and map-based discovery. None exists in build 604. The
temptation in a bootstrap task is to create module folders, interface stubs or a
placeholder wallet so the tree "looks finished".

## Decision

Adapter boundaries live in **documentation only** until a bounded implementation
task is separately approved. No empty production modules, no fake Gradle project,
no pretend API server, no placeholder wallet implementation.

## Boundaries to hold when each is eventually built

| Boundary | Required evidence before implementation |
| --- | --- |
| Identity / trust | Preserve the private Subject ID and existing keys. Optional bindings such as an npub stay separate from identity, professional credentials and reward eligibility. |
| Vault / recovery | Existing compatible formats, encryption and key ownership, attachment integrity, restore/version continuity, local access independent of any wallet or provider. |
| Pocket LUCA | Explicit selected context; authority rechecked at side effects; guided versus generated provenance; cancellation and truthful failure states; no root, signing or spending keys in model context. |
| P2P sharing / sync | Recipient verification, scopes, expiry, encryption and key distribution, own-device versus practitioner roles, outbox states, replay and deduplication, future-access revocation, device-loss recovery. |
| Bitcoin (Breez Spark) | Capability discovery, initialization, quote, user confirmation, submission, pending/failure reconciliation, lock, wallet-specific recovery. Regtest first. |
| Stablecoin (Tether WDK) | Selected module; chain, token and account model; exact token metadata; balance, fees and gas; confirmation; idempotent settlement; lock and recovery. |
| GPS / rewards | Evidence provenance, policy version, root episode, finite budget, fraud and dispute rules, shadow allocations, separately authorized settlement. |
| Discovery / maps | Read-only public data first, attribution, freshness and cache disclosure, opt-in location, separate trust evidence. No health payloads in public requests. |

## Non-negotiable separations

Identity control, vault recovery and wallet recovery are distinct lifecycles. Do
not derive wallet secrets from an npub, a clinical record, the APK signer or the
vault encryption key. A health-data grant never implies spending permission. Do
not replicate live wallet signing state with a generic CRDT, or let several
devices act as uncontrolled concurrent wallet writers.

**LUCA can propose an action; deterministic code and the user authorize
consequential execution.**

## Dependency on the native build gap

Breez and WDK both involve native modules. Integrating any new native module
depends on `AND-02` — reconstructing the native build prerequisites — which is
currently blocked on missing source. Do **not** upgrade the 604 QVAC/Bare runtime
to satisfy a quickstart's version table.

## Consequences

The tree contains no adapter code and will not until approved. Documentation
carries the specification, so a future implementation task has something concrete
to be reviewed against rather than starting from a blank page.
