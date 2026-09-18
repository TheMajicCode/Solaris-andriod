# Solaris Android and ecosystem roadmap

Updated 18 September 2026. This is an evidence-gated plan, not authorization to implement or release every phase. No delivery dates are asserted. Current source, reported unpushed work and target architecture are separated in the [engineering report](reports/Solaris-Engineering-Progress-and-Ecosystem-Report-2026-09-18.md).

## Current checkpoint

- Latest verified published task head: `edd43bd7404730480f3c5bd94720a3aef068fdb9`, draft PR #1. Main remains `5cc354c852565479020d4a6c99109fff992c6de4` at the review time.
- Claude reports local `9183802`, seven unpushed commits, 13 checks, 224 assertions and 22 checker controls. These are author-reported until the exact source/reports are obtained and independently reviewed.
- Independent candidate review, remote candidate CI, executable A605 integration and native build remain open. No new APK is established by those assertion counts.
- Public source development and reviewed pushes are now explicitly authorized in the existing repository. Earlier private-visibility and mandatory-private-backup requirements are superseded. Preserve work, review outgoing material and complete independent review; patient data and secrets remain excluded.

## Audit-grounded next sequence

Use the [F01–F12/CI disposition matrix](reports/AUDIT-DISPOSITION-2026-09-18.md) and [bounded execution plan](workflow/NEXT-BOUNDED-EXECUTION.md) as the current task detail. Do not restart the completed import from the old proposal. Review the actual local foundation/candidate, push reviewed public source, then run remote CI. Integrate the routing/answer containment through actual host and UI/storage boundaries while restoring native source in a separate owned workstream.

Cold-path model-preparation instrumentation, positive answer controls, the finite HBC/HTML slot, 16 MiB recovery ceiling, narrow conversational context and shared development signer are explicit constraints. Their tests and production gates remain open; none is waived by public source development.

## Phases

| Phase / existing task alignment | Bounded result | Exit evidence |
| --- | --- | --- |
| **0: Foundation** — AND-00/00b, A604-01 | Preserved source checkpoint in the public development repository, immutable reference, explicit candidate map, required CI that fails closed | Verified checkpoint; publishable outgoing source; final independent review and local checks before push; actual remote CI results after push |
| **1a: Bounded chat** — AND-03, A605-01/02 | EN/ES supported routing and answer-boundary containment | Positive and adversarial actual-host tests; no unsupported content at display/storage/receipt/context boundaries; clinical-copy release review |
| **1b: Native recovery** — AND-02, A604-02 | Evidence-backed source/build graph and real unsigned native app | Exact inputs/locks; clean reproducible build; component compatibility; preserve package, signer lineage, vault, recovery and models |
| **1c: Local quality** — AND-04, A606-01/02/03, REL-01 | Proven recovery/durability, encrypted pending turns and useful local assistance | Synthetic native failure/recovery tests; authorized device cold/warm latency, stop/process-death and accessibility tests; production-signing transition decision |
| **2: Identity and consent** — AND-05/06 | Shared, versioned contracts and one synthetic owned-device transfer | Cross-runtime identity/authority vectors; expiry/revoke/replay/wrong-recipient/correction tests; no forced identity/key reset |
| **3: Private care connection** — AND-07 | Patient-to-clinic selected record and reply; narrow Clinic OS inbox | Verified clinic binding; role-scoped access; patient and clinic restore; discovery receives no clinical plaintext in the tested flow |
| **4a: GPS shadow** — AND-11 | One finite `ValueEpisode`, evidence/attestor policy, deterministic allocations and private receipts | Accepted simulator profile; conservation/cap/rounding/replay/budget/appeal tests; zero financial side effects |
| **4b: Optional passport/discovery adapters** — AND-08/09/10 | Attributed BTC Map discovery; one selected WDK or Breez test adapter | Correct freshness/qualification distinctions; exact runtime/rail test environment; amount/recipient/fee/recovery tests; no seed reuse |
| **5a: RGB lab** — separately scoped RGB task | One supported synthetic asset in a declared test environment | Pinned implementation/schema; test issuer; independent validation, restore and interoperability; no real-money funding needed |
| **5b: Funded pilot** — AND-12 | One capped, separately authorized program | Accepted profile, named funder/operator, dispute process, reviewed rail-specific recovery and reconciled settlement |
| **6: Productization** | Supported Clinic in a Box, more clinics and optional sovereignty/wearable modules | Repeatable operations, backup/update drills, measured benefit, support ownership and sustainable unit costs |

1a and 1b may run in parallel with separate ownership. Phase 4 contract/fixture design can begin early; wallet SDK installation and fund movement do not thereby become authorized. Production-release gates remain independent of source PR acceptance.

## The next bounded action

Preserve and review Claude's actual unpublished checkpoint, then finish the foundation PR. Restore the exact [host/compiler inputs](NATIVE-RECOVERY-INPUTS.md) for candidate integration while native reconstruction continues. Do not restart the import, silently replace missing implementation, or treat source-only tests as an APK release.

For GPS, resolve [draft profile discrepancies](GPS-RGB-CONTRACT-ROADMAP.md) before building executable allocation vectors. Existing historical rates must not become hidden constants. For P2P, begin with a single record owner and explicit receipt, not a shared multi-writer clinical database.

## Dependencies that stay visible

- Qualified review of bilingual escalation wording and the supported patient-facing scope.
- Native vault/recovery/attachment/upgrade evidence, including the preserved recovery-envelope capacity boundary.
- Device-measured usefulness, latency, cancellation and accessibility.
- Dependency and redistribution rights, supply-chain/SBOM evidence and a deliberate production-signing strategy.
- Independent exact-candidate review and final artifact/source correspondence.
- For financial features: selected asset/network, funding, authority, ledger reconciliation, separate recovery and applicable operating review.

The [product map](ECOSYSTEM-AND-PRODUCTS.md) explains which product owns each responsibility. [Research](research/P2P-WALLET-EVIDENCE-2026-09-18.md) describes upstream possibilities; it does not certify integration in Solaris.
