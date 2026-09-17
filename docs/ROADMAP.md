# Roadmap

Sequenced, evidence-gated work. **No delivery dates appear here because none have
been established.** This table is a plan, not authority to implement everything
in parallel — each item needs its own bounded task and review.

| ID | Scope and dependencies | Acceptance evidence |
| --- | --- | --- |
| **AND-00** — Verified repository bootstrap | This import task | Private repo, exact source import and projection manifest, useful docs, real scoped CI, reviewed unmerged PR, artifact boundaries, no unsupported claims. **Delivered by this PR.** |
| **AND-00b** — Curate private reference-input artifacts | After AND-00, needs restored reference and a licensing review | Reviewed, non-sensitive input bundles with hashes, sizes, restore paths and license status recorded in `artifacts/manifest.json`. Blocked until the reference is restored. |
| **AND-01** — Baseline quality and security audit | After AND-00 | Prioritized findings tied to exact paths and SHAs; scoped lint, dependency, license and secret reports; clear native source gaps; the smallest next repair named |
| **AND-02** — Reconstruct native build prerequisites | Based on the AND-01 audit | Traceable app/native graph, dependencies and build inputs; signer and vault compatibility preserved; rebuild stages proven without fabricated source |
| **AND-03** — Pocket LUCA reliability and latency | Can run alongside AND-02 within proven source boundaries | Phone cold/warm timings, selected-source answer quality, truthful progress and error states, working cancellation; guided help kept distinct from inference |
| **AND-04** — Pending conversation recovery | Requires a storage/lifecycle contract | Encrypted durable pending-turn states; device and process-death tests; no replay after revocation or owner change; record IDs preserved |
| **AND-05** — Identity, consent and shared contract alignment | Joint work with web / Clinic OS; assumes **no** remote repo write | Explicit identity binding, qualified recipient trust, consent/expiry/revocation, schema versioning, negative test vectors |
| **AND-06** — Own-device encrypted transfer spike | After the relevant identity and recovery gates | One synthetic note between owned devices; restart, replay, conflict and revoke tests; local records still unlock without connectivity |
| **AND-07** — Practitioner private-care inbox | After AND-05 and AND-06, plus a suitable clinic endpoint | Selected synthetic record delivered across networks; recipient-scoped authorization, acknowledgements, authorship and recovery proven |
| **AND-08** — Sovereignty discovery prototype | Optional read-only adapter after contract review | Attributed BTC Map data, cached/online status shown, explicit location choice, separate evidence labels, no invented trust badges |
| **AND-09** — Breez Spark compatibility spike | Requires native/runtime feasibility (AND-02) | Regtest only; lock, recovery, fee and pending-state tests; no real funds, no seed reuse, no effect on vault access |
| **AND-10** — WDK chain/runtime decision and spike | Requires native/runtime feasibility and a selected module | Documented Bare Kit compatibility, chain/token/gas/account model, synthetic or test-network transactions, independent recovery checks |
| **AND-11** — GPS shadow contribution ledger | Requires an accepted shared policy and vectors | Attributable synthetic evidence, one finite allocation per episode, replay-safe outbox design; **zero funds move** |
| **AND-12** — Funded Earn pilot and release evaluation | Wallet, GPS, funding, trust and applicable release prerequisites | Approved funded rules, dispute/anti-abuse/limits, explicit confirmations, idempotent settlement; no health-data sale, no guaranteed earnings |

## The next bounded task

**AND-01, narrowed to a first slice:** classify and triage the imported tree by
scope — current authored source, recovered/decompiled evidence, third-party
inputs, missing inputs — and produce a prioritized findings list tied to exact
paths and hashes, starting from the one finding this import already surfaced
(`AND-IMP-01`, the truncated probe file). No code changes; findings only.

That is smaller than a full audit, needs no missing inputs, and directly feeds
AND-02.

## Open production gates

These remain unresolved regardless of roadmap progress. See
[`handoff/PRODUCTION-GATES.md`](../handoff/PRODUCTION-GATES.md):

- Complete native source build
- Vault and identity compatibility under synthetic round trips
- Background and session behaviour with an explicit pending-turn protocol
- AI reliability and latency on the target device
- Android UI and platform behaviour on real devices
- Security and dependency posture
- Release identity and a deliberate production signing strategy
- Independent release verification

## What this roadmap does not authorize

Guessing missing native implementation, fabricating build scaffolding, upgrading
the 604 QVAC/Bare runtime, installing or signing an APK, moving real funds,
changing keys, or delaying every useful fix until the whole architecture is
finished. Propose the smallest task the evidence actually supports.
