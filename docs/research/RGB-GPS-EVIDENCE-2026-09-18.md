# RGB and Solaris GPS: engineering research and proposed boundary

Research checked 18 September 2026. This is a design recommendation based on the primary sources linked below, not evidence that Solaris implements these capabilities. The parent review recovered the canonical project expansion **Global Prosperous Split (GPS)**. It is Solaris's contribution and rewards concept; geographical discovery is a separate capability. The external technical sources below do not establish Solaris's policy rates or governance choices.

## Decision

Build GPS first as a versioned, deterministic contribution-policy system with signed evidence and a simulation ledger. Add an optional RGB adapter only after the native vault, identity, consent, recovery and wallet boundaries have executable acceptance evidence. RGB is a promising economic contract substrate; it does not replace health-data consent, establish medical truth or prove real-world contributions by itself.

Preserve the recovered Solaris policy constraints in the parent handoff: one root `ValueEpisode`, and no recursive creation of a new economic base by splitting or transferring an existing allocation. Keep historical demo/pilot coordination profiles distinct. In particular, the sample 4% inside a GPS allocation capped at 10% and the consultation profile with 86% clinic + 4% coordination outside + 10% GPS are different profiles, not interchangeable arithmetic. Do not select or normalize rates in a research update; no referral mechanism is introduced here. These remain project policy decisions requiring the canonical artifact and version to be bound to each simulation.

## What current primary sources establish

| Observation | Evidence and implication |
|---|---|
| There are different RGB development lines. | The [rgb-protocol organization](https://github.com/rgb-protocol) explicitly continues 0.11.1; [RGB-WG's current workspace manifest](https://github.com/RGB-WG/rgb/blob/master/Cargo.toml) declares 0.12.0-rc.3. Treat these as distinct implementation choices requiring compatibility evidence, rather than assuming a numerical upgrade. |
| The wallet library remains pre-stable. | [rgb-lib's manifest](https://github.com/RGB-Tools/rgb-lib/blob/master/Cargo.toml) currently declares 0.3.0-beta.7 with RGB dependencies pinned to 0.11.1-rc.11. These are observed moving-branch versions, not a selected Solaris dependency set or a claim about the latest release tag. |
| Asset state needs careful ownership and recovery. | The [rgb-lib README](https://github.com/RGB-Tools/rgb-lib) warns that its APIs can break and that concurrent instances or sharing its mnemonic with another wallet can lead to asset loss through UTXO/state conflicts. A Solaris adapter must have one owner of wallet operations and an explicit state-backup protocol. P2P file sync is not safe wallet-state replication. |
| RGB Lightning maturity must be checked per implementation. | [rgb.info](https://rgb.info/) advertises 0.11.1 mainnet and live Lightning use. Its linked [RGB Lightning Node implementation](https://github.com/RGB-Tools/rgb-lightning-node) still labels itself early alpha and limits its documented RGB testing to regtest/testnet. This mismatch prevents a blanket production-readiness conclusion. |
| WDK does have RGB community modules. | [WDK's on-chain RGB documentation](https://docs.wdk.tether.io/sdk/community-modules/wdk-wallet-rgb/) describes `@utexo/wdk-wallet-rgb@2.0.3`, marked beta by its maintainer. The documented native artifacts cover Linux x64/arm64 and macOS arm64; Android is not listed. Its seed does not replace backup of local RGB state. |
| A separate WDK RGB Lightning module has mobile artifacts. | [WDK's RGB Lightning documentation](https://docs.wdk.tether.io/sdk/community-modules/wdk-rgb-lightning/) describes `@utexo/wdk-rgb-lightning@0.1.0-beta.15`. The Bare peer's listed artifacts include Android arm/arm64/x64. On-chain and Lightning modules have separate identities and databases. They are community maintained, with no Tether endorsement of security or maintenance; target-host testing remains necessary. |
| Breez Spark is a separate integration choice. | [Breez SDK Spark](https://sdk-doc-spark.breez.technology/) documents Bitcoin/Lightning, Spark and BTKN capabilities. This does not establish RGB support or RGB asset interoperability. [WDK's Spark module](https://docs.wdk.tether.io/sdk/wallet-modules/wallet-spark/) is another Spark integration surface; select an owner and adapter deliberately instead of initializing overlapping wallets. |

Do not use a homepage's broad performance/privacy claims as Solaris acceptance evidence. No wallet SDK was compiled or benchmarked for Solaris in this research.

### A timely signal, with a useful limit

The RGB Protocol Association's [17 September announcement](https://rgb.info/rgb-tether-hackathon-agentic-dollars/) describes an October 17–18 Turin hackathon sponsored by Tether: RGB plus QVAC are required; WDK is optional. That is unusually close to Solaris's local-AI/economic-passport direction. It supports a small research demonstration and possible ecosystem conversations, not an accelerated patient or real-money release. The same announcement says tutorials are scheduled for September 24; they are future inputs as of this review.

## What a contract means in this architecture

[RGB Schema documentation](https://docs.rgb.info/rgb-contract-implementation/schema.md) defines schemas as the structure and transition rules shared by a class of contracts; a contract's genesis instantiates its concrete state. [Client-side validation](https://docs.rgb.info/distributed-computing-concepts/client-side-validation.md) verifies relevant state history, with Bitcoin commitments providing ordering and double-spend protection. Bitcoin does not inspect a patient's health record or certify a contributor's work.

The following are **proposed Solaris interfaces**, not upstream RGB standards or existing implementation claims:

| Contract | Responsibility | Must not imply |
|---|---|---|
| `ConsentGrant` | Recipient/device, purpose, selected records and fields, expiry, grant revision, revocation status and authorizing identity. Enforced at the vault and recipient boundary. | An asset holder automatically has permission to read health data. Revocation erases previously exported copies. |
| `ContributionEvent` | A narrowly defined action, evidence type, subject scoped to the program, event identity, occurrence period and policy version. | A journal entry proves real-world behavior or medical improvement. |
| `Attestation` | Identified issuer asserts a bounded fact with evidence references, expiry/status and a declared trust level. | A valid signature makes the assertion objectively true. |
| `RewardPolicy` | Eligibility, permitted attestors, evidence thresholds, period limits, fixed-point reward units, funding caps, duplicate rules, appeals and effective versions. | A model can invent or silently revise payout rules. |
| `RewardDecision` | Deterministic decision, reason code, policy hash, accepted evidence identifiers and reserved budget. | An accrued reward has already been paid. |
| `SettlementIntent` / `SettlementReceipt` | User- or sponsor-authorized rail, asset/network identifier, amount, recipient, idempotency key and observed settlement state. | A timeout is a failure safe to retry with a new payment. |
| Optional RGB mapping | Pinned schema/contract IDs and the exact issuance/transfer constraints the selected runtime can validate. | Arbitrary GPS rules or health access are automatically executable RGB contracts. |

As a useful standards reference, [W3C Verifiable Credentials 2.0](https://www.w3.org/TR/vc-data-model-2.0/) separates issuer, holder and verifier and explicitly distinguishes verifiable claims from true claims. Borrow that trust separation without claiming standards conformance until the actual credential profile and proofs are implemented. [Bitstring Status List](https://www.w3.org/TR/vc-bitstring-status-list/) is an option for credential suspension/revocation, with an explicit offline freshness policy. It does not revoke settled payments or remote file copies.

## Proposed execution and data boundaries

1. **User chooses an eligible action.** Examples for a simulation: complete a learning module, submit a separately verified merchant-directory correction, help onboard a consenting organization or provide independently measurable network support. Self-reported wellness progress should be labelled as self-report. Avoid rewarding a diagnosis, a higher health score or disclosure of private records.
2. **Device produces a minimal event.** Keep clinical documents in the health vault. Use a scoped program identifier, nonce and minimal evidence receipt; do not send raw medical data to the economic layer. Hashing predictable health values is not anonymization. If commitments are necessary, use a reviewed hiding construction and disclose only what its verifier requires.
3. **An eligible attestor evaluates evidence.** Some actions can be device-local; others need a trusted clinic, community or sponsor. Name the issuer and trust assumption. Bots, collusion, compromised devices and fake accounts remain possible even with valid signatures.
4. **A deterministic evaluator applies a pinned policy.** Same validated inputs and policy produce the same decision. The verifier enforces allowed event types, time windows, evidence freshness, duplicate prevention and budget reservations. Ambiguous or unsupported evidence gets a reasoned rejection or review state.
5. **Settlement uses one selected adapter.** A funded sponsor or user approves a specific amount/recipient/rail. Keep pending, paid, failed, expired and disputed states separate. Persist an intent before network submission and reconcile outcomes after crashes before any retry. LUCA may explain a decision or draft a proposal; it does not possess unrestricted signing authority.
6. **History remains reviewable.** Preserve original event and policy identifiers. Corrections create new linked decisions; policy changes apply prospectively unless a separately approved migration says otherwise. Offline evaluations cannot promise current issuer-revocation knowledge or settlement finality.

Proposed shared encoding must be deterministic. [RFC 8785 JSON Canonicalization](https://www.rfc-editor.org/rfc/rfc8785) is one candidate for JSON commitments; choosing it does not provide a signature scheme. Pin a maintained cryptographic implementation, define domain separation and reject ambiguous or out-of-range values. Use integer smallest units and explicit asset identifiers rather than floating-point money or a ticker alone.

## Where RGB fits, and where it does not

The [implemented schema catalogue](https://docs.rgb.info/rgb-contract-implementation/schema/supported-schemas.md) includes NIA, UDA, CFA, IFA and PFA. NIA supports capped issuance and transfer; PFA adds issuer-authorized transfers; IFA adds inflation rights and other operations. Its optional reject-list URL is not issuer-enforceable: wallets can ignore it. This directly rules out treating that list as guaranteed consent revocation. Asset tickers are not unique, so asset identity requires the contract ID and network.

For a first experiment, prefer a standard supported asset schema with synthetic data and zero-value test funds. Prove issuance, receipt validation, transfer, rejection of an invalid consignment, backup/restore and incompatible-schema handling. Only then assess whether a custom GPS-specific schema is needed. A policy hash in an asset's metadata makes the reference tamper evident; it does **not** execute that policy. A rule belongs in an RGB-enforced claim only after a compiled validator and adversarial tests demonstrate that enforcement.

Cross-rail rewards need explicit adapters and funding. A reward decision referring to RGB cannot by itself pay Bitcoin through Breez Spark, convert an RGB asset into USDT on another chain or guarantee settlement across rails. A swap or bridge is another protocol and trust boundary; do not add one implicitly. An economic passport may present several assets and receipts in one interface without pretending they share balances, state, keys or recovery mechanics.

## Adoption sequence and acceptance evidence

| Stage | Do | Exit evidence |
|---|---|---|
| Adopt now | Document the contracts above, trust boundaries and policy lifecycle; define fake/synthetic fixtures. | Schema versioning, deterministic vectors, duplicate/replay tests, malicious attestor cases, consent/data-minimization review. No wallet dependency needed. |
| Experiment after build recovery | Implement a simulation-only GPS evaluator isolated from medical inference and the vault's keys. | Cross-runtime identical decisions; budget contention and crash tests; explicit pending/rejected/revoked/expired states; no network payment side effects. |
| Optional RGB lab | Select one exact implementation line, lockfile, schema and test network; validate official test flows and Android artifact loading independently. | Reproducible tools, provenance/license review, consignment verification, persistent-state restore, no concurrent wallet writer, target-device failure tests. |
| Bounded funded pilot | One program, one asset/rail, capped funded budget, narrow attestors and explicit approval. | Independent threat-model review, operating owner, dispute/correction procedures, reconciliation and recovery evidence. This is a later separate authorization. |
| Defer | Cross-rail swaps, generalized transferable health reputation, autonomous AI spending, custom RGB VM logic, multi-device wallet-write replication. | These need their own contracts, implementation evidence and independent review; they are not required to repair Pocket LUCA. |

Test cases must include event replay after device reinstall, duplicate evidence across identities, revoked/compromised attestors, clock rollback, policy downgrade, budget exhaustion/races, state restored from stale backups, incorrect asset/network, malformed consignments, mismatched schema versions and a crash after submission but before receipt persistence. The reward ledger and medical vault must remain independently recoverable.

## Claims the README should avoid

- “Bitcoin proves the health outcome” or “AI verifies your contribution”: identity and source evidence need separate verification.
- “All GPS policies run on RGB”: only specific demonstrably compiled and enforced transitions may be described that way.
- “Private by default means anonymous”: peers, indexers, metadata and repeated identifiers can still disclose information.
- “Seed-only recovery is enough for every wallet”: RGB history/state and channel-state recovery have additional requirements.
- “WDK/Breez/RGB are interchangeable”: they expose different assets, runtimes, dependencies and state models.
- “RGB mainnet exists, therefore Solaris RGB is production ready”: no Solaris wallet integration or device evidence was established here.
- “Revoking a reward or asset revokes a health document”: these are different authorities and different data lifecycles.

Recommended README wording: **“GPS is a planned contribution-policy and rewards layer. Initial work will validate signed, minimal evidence and deterministic policies without moving funds. Optional RGB asset contracts and wallet adapters will be evaluated in isolated test environments; they are not implemented or production approved in the current Android build.”**
