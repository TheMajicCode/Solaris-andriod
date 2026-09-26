# Solaris GPS and identity — reconciliation of existing planning contracts

Prepared 18 September 2026 from the four named local planning artifacts. This is a read-only document reconciliation. It does not verify deployed software, current upstream SDK compatibility, a ratified constitution, or any transfer of money.

## 1. What GPS already means in the user's work

The July suite explicitly expands the name as **Global Prosperous Split / GPS Protocol**. It is an identity-aware **policy, allocation, settlement and receipt protocol** for recognizing contributions through bounded economic entitlements. It is not satellite positioning. Coarse, consented locality can inform a policy, but continuous tracking and precise coordinates are not required for routine allocation.

The suite calls Solaris the first health-oriented implementation, LUCA its user-aligned coordination layer, and Aura the first proposed operating node. The economic passport is the user's view of authorized payment endpoints, preferences, contributions, allocations and receipts. The Value Atlas is analytics over those records, with privacy thresholds; it is not proof that rewards, health improvements or a public ledger already exist.

The ten canonical domains organize the protocol; they are not ten fixed one-percent wallets:

1. User Sovereignty and Personal Prosperity.
2. Referral and Community Lineage.
3. Sovereign Infrastructure and Node Operators.
4. Open Technology, Protocol and Security Commons.
5. LUCA, Community Intelligence and Knowledge Commons.
6. Regenerative Land, Agriculture, Food, Water and Energy.
7. Social, Environmental and Public-Benefit Causes.
8. Education and Human Development.
9. Regenerative Health Fund.
10. Local Community and Place-Based Public Goods.

## 2. Authority and implementation status

| Source | What it establishes | Authority limit |
|---|---|---|
| `GPS_Protocol_Complete_Combined_v1.0.md`, July 2026 | Fifteen-document design suite; constitution, economic definitions, registry, resolver, recognition, recursion, receipt, treasury, privacy, settlement, accounting, onboarding, dispute and communications policies | Explicit **Working Draft**; constitution says “working draft for pilot ratification.” Normative MUST language is a proposed compatibility rule, not evidence of ratification or implementation |
| Android identity/GPS plan, 12 Sep 2026 | Preservation, proposed shared identity records, bounded LUCA authority, signed GPS shadow demonstration, later synthetic replication and RGB experiment | Proposed sequence based partly on older V5 source descriptions; do not use its historical source/version paths as the 604/605 baseline |
| Web identity/GPS plan, 12 Sep 2026 | Explicit distinction between historical showcase/payment profiles, shared proof contract, evidence and allocation records, shadow-only GPS | Source observations point to a historical web commit. Recheck source before making current-code claims |
| Sovereign architecture/Copilot roadmap, revision 2, 16 Sep 2026 | Product separation: discovery, patient vault, clinic node/staff companion, optional inference and payments; release criteria | Proposed target and dated source assessment, not an implemented private-P2P claim or waiver of existing release gates |

The shared identity appendices in the web and APK plans are text-identical after trimming whitespace; their common SHA-256 is `aed4821303e47972cdff972010c48a70fc3cf43b3717eee4f90cd5405e41ab18`. Both explicitly say their proposed application signing protocol is **not accepted for production** and must be jointly frozen with schemas and conformance vectors before account linking.

Recommended README vocabulary: “GPS design framework,” “proposed contract,” “shadow simulation,” “source-tested candidate,” and “integration not yet verified,” as applicable. Do not call the suite an implemented smart-contract system or claim a finished economic passport.

## 3. Existing invariants to retain in the engineering contract

### Economics and evidence

- Standard GPS ecosystem envelope is **at most 10% of explicitly defined eligible value**. Additional voluntary gifts and distinct grant/treasury distributions need explicit separate classification and approval; this is not permission for an implementation to bypass the cap.
- Earned commercial value, statutory obligations, fees, pass-through exclusions and the GPS envelope are separate accounting classes. The user must see the actual basis, policy and distribution.
- Every root economic event has one `ValueEpisode`; tool calls and subagents reference it rather than repeatedly charging the envelope.
- One finite graph is resolved and snapshotted before invoice/commitment. Recursion divides existing entitlements and cannot increase the cap. Detect cycles, duplicate recipients and exact-sum/rounding errors before payment.
- Use integer base units or bounded fixed-point arithmetic, explicit asset/precision, deterministic ordering and rounding; freeze external observations, policy versions and time inputs needed to reproduce the calculation.
- Keep self-report, signed attestation, independently verified contribution, accepted allocation, authorized execution, settlement proof and measured outcome distinct. A valid signature proves authorship/integrity within a trust model; it does not prove a health improvement, unique human, professional credential or honest work.
- AI may recommend, explain and simulate. A deterministic, versioned policy and current authority checks decide allowable side effects. Default delegated spend budget is zero.
- Signed receipt/proof records must distinguish promised entitlement, payment attempt, settled amount, fees, pending amount, refund and correction. Existing receipts with `signatures: []` remain explicitly unsigned.
- Failed settlement preserves a **recipient-owned pending entitlement**. No silent conversion to platform revenue, arbitrary recipient change or intentional float for platform convenience. A pending entitlement is not a token sale or savings product.
- Corrections are append-only and retain prior policy/receipt verifiability; do not rewrite historical economics when a profile changes.

### Identity and privacy

- Private permanent Solaris Subject ID is distinct from controller root, device key, agent identity, npub, wallet address, email and professional/legal identity. Preserve existing subject, vault, record and recovery identifiers.
- A controller or key rotation changes the binding/history, not the permanent subject. Existing independently created accounts cannot be merged by matching email/npub/name or a copied Subject ID.
- Root/device possession, device membership, scoped authorization, current revocation, professional qualification and reward eligibility are separate checks.
- LUCA is a delegated agent, never the identity root. Separate operations such as selected-record reading, drafting, sharing, booking and payment; bind destination, amount/asset, purpose, expiry and revocation where relevant.
- Owner root, health encryption and wallet seeds remain separate. Keys/NWC secrets never enter model context or general memory. A mnemonic does not restore all encrypted health records, current revocations, RGB consignments or live channel state.
- Prove current authority immediately before consequential actions, and distinguish signature-valid, authorized-at-known-checkpoint and currently-authorized. Offline access to already-held records can remain available without pretending to know fresh remote revocations.
- Clinical data and linkable hashes of predictable health values do not belong in public Bitcoin/Nostr/GPS receipts. Public aliases, payment endpoints and legal credentials are not automatically cross-linked.
- The latest target is that Solaris-operated discovery does not receive clinical plaintext during the supported patient-to-clinic workflow. This does not mean shared records never leave a device: practitioners get selected recipient copies, and optional remote inference is a separate disclosed processing path.
- Revoke future authorization and rotate appropriate future encryption epochs; do not promise deletion of information a recipient already copied.

### Replication and settlement

- Replicated log reducers are deterministic and replay-safe; no payments, network effects or clinical actions inside `Autobase.apply` or equivalent projection logic.
- Use a separate durable outbox with stable episode/output identifiers, reservation, transactional deduplication, current permission/policy checks and adapter proof reconciliation. Query uncertain settlement before retry; do not advertise universal atomic multipayment or exactly-once external settlement without demonstrated rail support.
- Live RGB/Lightning wallet state has one active writer and controlled migration. Do not CRDT-merge channel/state directories or confuse health-record backup with financial-state recovery.
- Core health vault access must survive loss/removal of discovery, P2P transport, AI, wallet, Nostr and RGB adapters.

## 4. Unresolved policy differences — do not silently pick a split

| Difference or older wording | Required disposition |
|---|---|
| Ten fixed 1% streams in early research | July suite explicitly supersedes this with ten domains and governed variable weights within the cap |
| Showcase profile: 4% Solaris coordination **inside** 10% GPS | Retain as a named historical profile, not a universal commercial rule |
| Consultation payment pilot: 86% clinic, 4% earned coordination **outside** 10% GPS; referrals excluded | Separate purpose, earned-value classification, activation conditions and policy hash; do not merge with the showcase or choose because the UI wants one number |
| Older “90/10” shorthand | Insufficient to select a profile, eligible basis, fee treatment or beneficiary class; Android plan explicitly forbids permanent hardcoding of either 90/10 or 86/4/10 |
| July whitepaper “first live Alby demonstration” and expansive agents/treasuries | Later plans sequence verified private workflow and **shadow GPS first**, externally handled payment intent next, separately approved live-money pilot later |
| July recursion whitepaper permits stronger voluntary recipient cascade; detailed safety standard sets 20% maximum, default 90% retention/minimum 80%, depth 2 and 32 graph edges | Treat as draft inconsistency requiring profile-level ratification. Do not activate a voluntary override implicitly. If implementing a simulator, make every chosen limit explicit and unambiguously bounded |
| July worked example in Auto-Configuration §9 lists six gross percentages totaling 9% while claiming 10%; the preceding seven category shares imply a missing 1% row | Correct the future executable vector through explicit review; preserve the original historical text. A design example is not a valid reference test vector by itself |
| September 12 web plan describes a web verifier/coordinator | September 16 discovery isolation narrows Solaris-hosted processing. Move private receipt/context verification to owner/clinic nodes unless the exact minimal public-service role is separately demonstrated and approved |
| Proposed identity challenge/signing profile | Freeze once jointly; reconcile historical 120-second contract versus five-minute implementation before changing the TTL. Preserve earlier raw-challenge proof verification separately |
| July receipt uses a bare required `context_hash` | Later plans expressly reject equating predictable health hashes with anonymity. A commitment design needs explicit privacy analysis; omit sensitive context from public receipts rather than assume hashing is sufficient |

## 5. RGB's realistic place

The existing Android and web plans already make a clear decision: **GPS supplies policy and authority; RGB is a later optional asset/rights and settlement adapter**. The full GPS constitution does not execute automatically on Bitcoin or RGB. Bitcoin commitments do not validate medical truth, human uniqueness, consent, professional licensing or contribution fairness.

The bounded experiment proposed in the plans is a **synthetic clinic-service credit** using one supported RGB schema and pinned compatible stack. Its acceptance evidence must include issue, receive, inspect, supported redemption/correction, export, clean restore and independent interoperability. Client-side asset history/consignments must be preserved; seed-only backup is inadequate. Remove the adapter and prove the health vault remains usable.

The shared contract should separate:

| Layer | Responsibility | Evidence |
|---|---|---|
| GPS governance and eligibility | Versioned terms, authorities, policy profile, eligible basis, caps, conflicts, contribution requirements | Explicitly adopted profile and fixtures; no policy chosen silently |
| GPS resolver | Pure deterministic finite allocation | Cross-runtime identical outputs, conservation, cap/rounding/cycle/replay tests |
| Owner/clinic authority | Current consent, capabilities, destination/amount approval, issuer legitimacy | Expiry/revocation/replay/substitution tests |
| Outbox and ledger | Reservation, attempts, uncertain outcomes, pending entitlement, corrections | Crash/retry/reconciliation tests without double spend assumptions |
| Wallet/rail adapter | Supported transfer construction, signing isolation, proof/finality validation and recovery | Exact version/asset/network matrix and independently verified transfers |
| Optional RGB contract/schema | Only the explicit asset state and rights supported by the selected schema | Lab issue/transfer/redeem/restore/interoperate vectors |
| Passport/Value Atlas | Explain actual evidence and status | Intent never rendered as settled; payment never presented as verified health impact |

Current upstream SDK/project maturity must be researched separately; these older plans' links and claimed capabilities are not fresh verification.

## 6. Recommended versioned engineering package

This is a proposed organization, not a claim these schemas exist or are approved. Keep one authoritative shared package, consumed by Android/web/clinic with pinned digest and compatibility version; do not fork slightly different meanings in each repository.

1. `contract-status` registry: draft/accepted/deprecated, owner, effective date, source policy, version and migration rules.
2. `identity` records: `IdentityContinuity`, `DeviceAttestation`, `DeviceAuthorization`, `IdentityBindingIntent`, `CapabilityGrant`, `ActionApproval`, issuer-scoped credentials and `RecoveryManifest`.
3. `gps` records: `ContributionEvidence`, `ValueEpisode`, `PolicySnapshot`, `AllocationManifest`, `OutboxAction`, per-output `SettlementReceipt` and append-only correction/dispute records. These names require final joint schema review.
4. `policy-profiles`: separately named showcase and consultation pilot snapshots; explicit disabled/shadow/live mode, economic basis, authorities, caps, beneficiary classification, fees/failure policy and activation decision. No funds in the initial fixtures.
5. Pure resolver/reference verifier and positive/negative conformance vectors. Require strict parsing, duplicate-key rejection, exact canonical bytes, algorithm/domain/encoding labels, bounded sizes and cross-runtime verification using established cryptographic libraries.
6. Adapter contracts for signing, encrypted record access, transport, settlement and optional asset rights; platform implementations retain keys/storage/UI rather than move secrets into a universal module.

Minimum vectors: same input same bytes; one root episode despite child calls; zero/negative/overflow/unknown-asset cases; cap/rounding/conservation; duplicated identity/claim; cycle/depth/edge limits; conflicting profiles; policy change after snapshot; expired/revoked/unauthorized endpoint; fees exceeding entitlement; uncertain settlement then retry; failed outputs remain recipient-owned; append-only refund; actor versus issuer versus beneficiary; stale authority; no public clinical linkage; wallet unavailable but vault works.

## 7. Scope sequence consistent with latest project direction

1. Complete the now-authorized public source/CI workflow and exact-commit independent review, keeping patient data and restricted originals private; integrate bounded LUCA truthfulness/routing only when actual host artifacts permit. Restore native source/build and verify vault/recovery compatibility separately.
2. Establish shared identity, current capability and truthful evidence contracts with synthetic cross-runtime vectors; preserve existing identities and adapters.
3. Prove one encrypted patient-to-clinic share and reply, role-scoped clinic access, independent patient/clinic restore and discovery exclusion. Start one supported clinic software installation; “Clinic OS” is software, not a new general-purpose operating system.
4. Add GPS shadow episodes and private receipts with explicit profile, zero funds and no public health linkage. Economic passport initially displays verifiable history rather than promises earnings.
5. Introduce a narrowly scoped external payment adapter and explicitly approved live-money pilot after relevant recovery, authority, rail and operating gates. No new general token or automated financial agent is implied.
6. Run the removable RGB service-credit lab and other wallet/sovereignty modules only after their prerequisites. Broader hardware bundles, wearables and multi-clinic expansion follow measured product reliability.

Parallel research/schema work is possible throughout; installing dependencies, changing wallet keys, activating financial flows or claiming patient release are separate actions with separate acceptance evidence.

## 8. Source provenance and precise locations

| Local source | Bytes | SHA-256 | Relevant sections |
|---|---:|---|---|
| `GPS_Protocol_Complete_Combined_v1.0.md` | 216,611 | `a419a6f55a5d4e84f9fb2be37453a84e196f48492b607fabb6d796f5af0b3a2d` | Whitepaper lines 70–163, 227–445; constitution 830–951; registry 1131–1178; resolver 1304–1408; recognition 1473–1553; routing 1642–1728; receipts 1801–1918; privacy 2141–2228 |
| `Solaris-APK-Identity-and-GPS-Implementation-Plan(3).md` | 51,859 | `87b87d584b527fcc06e475c8adc60144cd63a2015b60ea103f8e17041a167856` | Architecture §§2–3; A4–A6; shared identity contract lines 268–325 |
| `Solaris-Web-Identity-and-GPS-Implementation-Plan(1).md` | 47,298 | `7842714fa5334a5231cfe4fb3fe0a968943b8e72494ff60e7387b743a2ffd37e` | §7 W-GPS1 lines 130–142; implementation sequence; shared contract lines 232 onward |
| `Solaris-Sovereign-Architecture-and-Copilot-Roadmap-2026-09-16.md` | 69,703 | `111514b9866c6b0860959c088068005a0a9325f6faeeb7a19bc63b33af592a41` | §§1–3 target/boundary; §5 payments; §6 roadmap and release profiles; SOV-11; migration §§7–9 |

The named originals were retrieved privately and read for this reconciliation; they are not reproduced in this repository update. No source or original document was edited; no remote system was changed.
