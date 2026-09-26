<!-- README draft for the Solaris Android repository. Claude Code must reconcile the status statements with the imported 604 evidence and create the linked documents before publishing it as README.md. Documentation targets below are proposed paths, not a claim that those files already exist. -->

# Solaris Android · Pocket LUCA

**Your health passport. Your economic passport. Your path to greater sovereignty.**

Solaris Android is the user-held companion in the Solaris ecosystem: a private health vault with Pocket LUCA, designed to help people bring their records together, understand their own context and choose what to share with trusted practitioners. Its direction is local first, with permissioned peer-to-peer connections and optional services that help people reclaim their health, wealth and sovereignty.

The phone becomes a key to the Solaris Network. The user decides when to unlock their own information, which records a practitioner may receive and how to participate in deeper **Heal, Learn and Earn** journeys. Health information is not the price of admission to a reward program.

> **Current baseline: Android candidate 604, V6.0.4.** This repository starts from a recovered, partially reconstructed application and its verified evidence. Build 604 improves guided chat grounding and interaction behavior while preserving the existing native payloads. It is **not a complete original Android source project or a production-ready release**. P2P practitioner exchange, economic-passport wallets, GPS rewards and the broader sovereignty modules below are the product roadmap unless independently demonstrated in the feature-status evidence.

## Three connected purposes

### Reclaim your health

The health passport is intended to bring health records, documents, personal reflections and approved measurements into a user-controlled vault. Pocket LUCA helps the user work with the information they choose to make available: understand a check-in, reflect on a pattern, prepare questions and choose a manageable next step.

The long-term experience connects that personal context to trusted practitioners through specific, understandable sharing permissions. A practitioner should receive the selected information needed for the agreed purpose, rather than unrestricted access to the entire vault. Practitioners can then help shape a more personalized Heal or Learn journey.

Pocket LUCA is a local assistant, not a clinician. Its answers should identify the information they used and say when it is missing or insufficient. The model must not invent records, imply access it does not have or turn a wellness reflection into a diagnosis.

### Reclaim your wealth

The economic passport is an optional component for receiving, holding and spending value under the user's control. The intended adapter choices are:

| Adapter | Intended role | Current status |
| --- | --- | --- |
| Breez SDK — Spark | Bitcoin, Spark and Lightning payment capabilities | Planned integration; compatibility and recovery require validation |
| Tether WDK | A self-custodial stablecoin wallet on an explicitly selected chain and account model | Planned integration; token, network and fee arrangements remain to be decided |
| GPS | Governed contribution evidence, eligibility and allocation rules, followed by accountable settlement | Product and protocol design; no verified reward engine in 604 |

The Earn direction recognizes two forms of participation: a person's own self-care and learning progress, and useful contributions to the wider network, such as education, onboarding, community work or helping a business adopt suitable infrastructure. Rewards need a defined funding source and published rules. A recorded contribution, an approved allocation and a settled wallet payment are different states.

Participation is optional. The design must not require selling health information, punish illness or imply guaranteed earnings. Wallet access must remain distinct from access to care and from a person's health status.

### Reclaim your sovereignty

The sovereignty component helps users understand practical choices about their digital and physical lives: protecting records, recovering access, using appropriate tools, finding local businesses and contributing to communities they value.

BTC Map is a proposed discovery adapter for places reported to accept Bitcoin. Solaris may later add independently evidenced information about local services, clinics, communities and their infrastructure. These are separate claims: accepting Bitcoin does not prove that a business runs sovereign infrastructure, belongs to Solaris or is clinically trustworthy.

Here, **GPS is Solaris's policy/allocation/settlement/receipt protocol** for evidenced contributions and accountable value distribution. It is separate from phone geolocation. Any location feature needs its own purpose and permission; users should be able to explore by entering a place or region.

## One product within Solaris

| Product | Role and boundary |
| --- | --- |
| **Solaris Android / Pocket LUCA** | User-held vault, local assistance and the planned consent, passport and participation experiences |
| **Solaris web** | Public discovery and coordination, including governed practitioner-facing functions; it is not intended to become a Solaris-operated store of clinical plaintext |
| **Practitioner Clinic OS** | The planned practitioner-controlled endpoint for records explicitly shared by a user and the practitioner's own work |
| **Clinic in a Box / sovereign infrastructure** | A future deployment and support offering that can help clinics or businesses operate suitable local infrastructure |

These products should communicate through documented contracts. Sharing the Solaris name does not give one product automatic access to another product's data. This Android codebase belongs in its own repository, with its own build history, permissions and releases. The web application remains a separate product and repository.

## What 604 establishes

The 604 lineage includes targeted checks and independent reviews for the recovered components and the limited changes made to them. Its practical scope is narrower than the complete product vision:

| Area | Evidence-backed position |
| --- | --- |
| Guided LUCA interactions | Common supported intents use bounded application logic; applicable personal answers use selected, approved source fields. Missing context should lead to a request for sources. |
| On-device generated chat | Available through the existing local-model path, with quality and latency limitations. A successful greeting is not a benchmark of broad reasoning or clinical reliability. |
| Chat and return behavior | UI and guard changes improve the existing flow. Backgrounding still locks/cancels active work; continuous background inference is not established. |
| Vault and native components | Existing components were preserved in the candidate. Preservation is not a complete audit of their security or recovery behavior. |
| Complete source build | Original native application/build sources remain incomplete. Recovered representations and bytecode evidence are not equivalent to a fully authored, reproducible Gradle project. |
| P2P, own-device synchronization and practitioner trust | Roadmap work; this README makes no claim of a verified end-to-end implementation. |
| Wallets, funded rewards and sovereignty discovery | Roadmap work; no real-money capability is implied by the design documents. |

Package identity: `org.solarishealth.edge.recovery`. The baseline APK's recorded SHA-256 is:

```text
0e9a66da00cbe128851d981a9f9a3d9a1dbfe653f7a4ced93d638bc4d7d31827
```

Use [Feature status](docs/FEATURE-STATUS.md) for claim-by-claim evidence and [Artifacts](docs/ARTIFACTS.md) for the exact reference files, hashes and retrieval instructions.

## Data, consent and keys

Local first means the core should remain useful with user-held data and explicit control over external connections. It does not mean every optional feature works offline or has no infrastructure dependencies. P2P discovery and transport, wallet networks, public maps and optional providers each need a documented dependency and metadata boundary.

The target sharing contract identifies the recipient, records or fields, purpose and applicable duration. Revocation can stop future authorized access; it cannot guarantee deletion of information a recipient has already copied. Receipt and access history must describe what actually happened.

Health-vault recovery, identity credentials, wallet recovery and the Android signing identity are distinct. An identity public key is not a wallet seed. No wallet secret belongs in an AI prompt, health record, GitHub repository or ordinary diagnostic log. Pocket LUCA must not gain spending authority simply because it can help explain a transaction.

Read [Data and consent](docs/DATA-AND-CONSENT.md), [Architecture](docs/ARCHITECTURE.md) and [Security](docs/SECURITY.md) before changing these boundaries.

## Start here as a developer

1. Read [Build and test](docs/BUILD-AND-TEST.md), then the imported baseline's README, source-gap inventory and build reports. Use only the commands supported by the available files.
2. Keep a complete, immutable 604 reference outside the working repository. Run the original full-manifest checks against that reference. Editing the working repository's README or adding documentation naturally changes its contents; do not present it as byte-identical to the original handoff.
3. Preserve the imported source-root paths until a separately reviewed change proves that moving them does not break tooling or evidence links.
4. Open a bounded task branch. Establish the relevant baseline, make the change, run targeted checks and obtain independent review. Record untested boundaries explicitly.

Source and documentation belong in normal Git history. Large APKs, model weights, offline build-input archives and restricted evidence need the artifact strategy in [Artifacts](docs/ARTIFACTS.md). Do not upload the entire handoff ZIP through `git add .`. No patient data, production credentials, signing keys or wallet material may be committed.

Do not infer a working `gradlew`, full native build, Codespaces build environment or passing production audit from this repository's presence. Linting recovered/decompiled evidence as though it were maintained application source can obscure the real work. The audit must distinguish authored code, reconstruction, third-party dependencies, generated evidence and missing inputs.

## Project documentation

- [Product vision](docs/PRODUCT-VISION.md): the Android experience and its place in Solaris.
- [Roadmap](docs/ROADMAP.md): staged work with acceptance evidence, beginning with source/build recovery and audit.
- [Economic passport](docs/ECONOMIC-PASSPORT.md): wallet boundaries, funded incentives and settlement.
- [Sovereignty and GPS](docs/SOVEREIGNTY-AND-GPS.md): contribution rules, discovery and evidence standards.
- [Contributing](docs/CONTRIBUTING.md): branch workflow, independent review and Claude Code/Codex handoffs.

The shared agent instructions belong in `AGENTS.md`; Claude Code's `CLAUDE.md` should import them and point to the current task and evidence. One writer owns a changed path at a time; another agent reviews the result.

## Adapter references

These links describe external capabilities, not completed Solaris integrations: [Breez SDK — Spark](https://sdk-doc-spark.breez.technology/), [WDK React Native quickstart](https://docs.wdk.tether.io/start-building/react-native-quickstart/), [BTC Map API overview](https://gitea.btcmap.org/teambtcmap/btcmap-general/wiki/API-Overview) and [OpenStreetMap attribution](https://www.openstreetmap.org/copyright).

Review actual dependency versions, licenses and service terms before integrating or redistributing components. Existing third-party notices must be preserved. A repository-level license must reflect the actual ownership and licensing review; none is implied by this draft.
