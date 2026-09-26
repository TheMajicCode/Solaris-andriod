# Solaris ecosystem engineering research — 18 September 2026

Scope: current primary documentation and upstream repositories, read only. These are upstream capabilities and engineering proposals, **not proof they are implemented in Solaris**. No SDK was installed, no funds moved, no app built, and no upstream release was independently audited or device-tested for this report. Links were inspected on 2026-09-18; moving documentation is a research signal, not a dependency lockfile.

## Architectural direction

Keep distinct products connected through small, versioned contracts:

| Product/component | Proposed responsibility | Boundary and evidence requirement |
|---|---|---|
| Solaris Android / Health Passport | User-held health vault, selected-record sharing, on-device Pocket LUCA, optional economic passport UI | Preserve the existing vault/signing/record compatibility while restoring the build. A local-model answer is not evidence of clinical competence. |
| Solaris web / discovery marketplace | Public provider and service discovery; handoff into user-controlled connections | No patient records, private prompts, vault backups or clinical attachments on Solaris-operated discovery servers. Enforce this at API, storage, logging and analytics boundaries. This is the target contract, not a fresh audit of deployed web behavior. |
| Practitioner Clinic OS | Provider-controlled workspace, received consented records, local AI and care workflow | Separate installation and operating responsibility. Verify identity, consent, retention and access on receipt. Patient-side revocation cannot erase information already copied by a recipient. |
| Clinic in a Box | Later packaged hardware, Clinic OS, recovery and private networking | Productize only after software recovery, updates, support and offline operations are reproducible. Hardware is not itself a privacy or clinical assurance. |
| Economic Passport | Optional balances, receive/send and rewards receipts through isolated wallet adapters | Separate wallet secrets from health-vault encryption, Nostr identity and app signing. Every transfer requires an explicit authorization policy and verified recipient/asset/network/fee. |
| GPS / sovereignty journeys | Versioned contribution claims, policy decisions, challenges and optional reward settlement | GPS policy is not automatically a blockchain smart contract. Keep personal health evidence off public ledgers and maps. RGB settlement, if chosen, follows tested client-side state/recovery rules and does not make a real-world claim true. |

The table is a **proposed Solaris product boundary**, grounded in the owner's architecture direction. It does not imply current code implements these products or connections.

## Pear, Bare and mobile: update the older desktop-only assumption

Pear's current official docs describe mobile, desktop and terminal runtimes. Their practical mobile guide embeds a Bare worklet in an existing React Native/Expo app using `react-native-bare-kit`, with IPC between native UI and the P2P core. It does not require replacing the app's native shell. A Bare worklet can use Hyperswarm and Corestore. Treat this as a plausible implementation path **after** Solaris's own native dependency graph and build are restored. [Pear layers](https://docs.pears.com/), [mobile embedding guide](https://docs.pears.com/bare/how-to/run-on-native/embed-bare-in-react-native/).

The current upstream lifecycle guide explicitly addresses stopping/unreferencing active handles during suspend and re-establishing them on resume. **Inference for Solaris:** adopting Pear/Bare does not solve Android background limits or preserve an unfinished LUCA turn automatically. Persist only the minimal encrypted pending state, distinguish suspension from lock/cancellation, reacquire authority after return and test process death on actual devices. Do not promise continuous background inference merely because the transport is P2P. [Bare suspension guide](https://docs.pears.com/bare/how-to/run-on-native/handle-app-suspension/).

## P2P data layer: useful primitives, application contracts still required

| Primitive | What upstream documents | Solaris-specific work still required |
|---|---|---|
| Hypercore | Verified append-only log, sparse replication, optional block encryption; the inspected reference is documented against v11.35.2 | Decide record ownership, explicit encryption/key lifecycle, recovery and which selected records may replicate. Signed/verified bytes do not prove clinical accuracy. |
| Hyperbee | Key/value views, history, versioned read-only snapshots | Bind any answer or share receipt to immutable record IDs and revisions. Prefix sub-databases are not independently sufficient access control. |
| Hyperswarm | Topic discovery and encrypted connections; default firewall permits peers; leaving a peer does not close an existing socket | Authenticate the intended peer, enforce recipient capability at transfer time and actively terminate revoked sessions. Never use health labels as public discovery topics. |
| Autobase | Deterministic multi-writer views; order can change with new causal information | Define correction/conflict rules; do not silently overwrite disputed clinical records. Never issue payments from a re-playable `apply` reducer. |
| Blind peering | Availability of Hypercores/Autobases when writers are offline | Explicit opt-in replica selection, encrypted storage and recovery tests; ciphertext availability does not imply key recovery or zero metadata leakage. |

Sources: [Hypercore](https://docs.pears.com/p2p/reference/building-blocks/hypercore/), [Hyperbee](https://docs.pears.com/p2p/reference/building-blocks/hyperbee/), [Hyperswarm](https://docs.pears.com/p2p/reference/building-blocks/hyperswarm/), [Autobase](https://docs.pears.com/p2p/reference/building-blocks/autobase/), [blind peering](https://docs.pears.com/p2p/how-to/blind-peering/). The right column is engineering inference, not an upstream claim of health-data governance.

For the first P2P milestone, prefer a **single record owner plus explicit recipient acknowledgement**. Defer a multi-writer shared clinical database until there is a tested need. Exercise offline handoff, duplicate/reordered delivery, modified content, expired/revoked authority, restored device and interrupted receipt. Revocation blocks future authorized access and transfer; it cannot guarantee deletion of a previously disclosed plaintext copy.

Holesail documents encrypted peer-to-peer TCP/UDP tunneling and native/mobile support. This is a candidate private service-access adapter for a clinic-owned machine, not record-level consent, practitioner authentication or conflict resolution. Test reachability across the actual mobile/carrier/NAT matrix; do not turn upstream “no infrastructure” marketing into an availability guarantee. [Holesail overview](https://docs.holesail.io/).

## Buzz: learn from the inspected product, not an assumed healthcare fork

The inspected official `block/buzz` repository has a real desktop release, `desktop-v0.5.23`, and separates shipped desktop/workspace features from unfinished mobile/workflow features. Its architecture is explicitly **relay-centric**: clients use one relay; it describes no peer-to-peer event exchange or gossip. Desktop uses Tauri/React; mobile clients are described as in progress. [Repository](https://github.com/block/buzz), [architecture](https://github.com/block/buzz/blob/main/ARCHITECTURE.md), [desktop release](https://github.com/block/buzz/releases/tag/desktop-v0.5.23).

Adopt as design lessons: scoped human/agent identities, signed events, readable evidence trails and clear “implemented / in progress / vision” documentation. Do not claim Buzz proves local-only inference, medical safety, Solaris source compatibility or peer-to-peer patient sharing. The `buzz.xyz` site could not be retrieved in this research, so its relationship to the current repository/product was not independently established. No recommendation to copy or deploy its clinical data architecture is made.

## Wallet adapters: compatible interfaces do not make identical rails

### WDK stablecoin/mobile path

Current WDK React Native quickstart documents Bare worklets, Android API 29+, React Native 0.81+, Node 22+, and `@tetherto/wdk-react-native-core@1.0.0-beta.18`. Its peer requirements include `react-native-bare-kit >=0.14.5` and a bounded Expo Crypto range; its starter is labelled alpha. **Inference:** do not upgrade Solaris's inherited Bare/Expo/native packages as a side effect of chat repair. First pin an independently tested wallet spike and record the exact compatibility matrix. Choose one initial stablecoin asset/network, explicit gas/fee handling and recovery flow rather than enabling every chain. [WDK React Native quickstart](https://docs.wdk.tether.io/start-building/react-native-quickstart/).

WDK is not only an EVM or stablecoin toolkit: its current module catalog also includes Bitcoin, Spark and separately maintained RGB modules. That is a useful integration signal, not proof all modules have identical runtime coverage, recovery or security review. [WDK overview/catalog](https://docs.wdk.tether.io/).

### Breez Spark Bitcoin path

Breez's Spark SDK has official React Native/Expo integration with native code and requires a custom development build; Expo Go is insufficient. Its current overview documents Bitcoin/Lightning/Spark payments, on-chain interoperability, BTKN tokens and stablecoin-related functionality. An API key is required. Preserve the owner's proposed Breez Bitcoin adapter as a bounded candidate; avoid duplicated wallet implementations simply because WDK also offers a Spark module. [Breez React Native installation](https://sdk-doc-spark.breez.technology/guide/install_react_native.html), [SDK overview](https://sdk-doc-spark.breez.technology/).

Spark describes a transaction-time operator honesty/key-deletion trust assumption. Its limitations also cover operator liveness and a response window for disputed unilateral exits, with watchtower mitigation. Therefore “non-custodial” must not be translated into “no external dependencies or trust.” Require documented operator/service dependencies, fee and failure handling, backup/restore and tested exit behavior before enabling real funds. [Spark trust model](https://docs.spark.money/learn/trust-model), [limitations](https://docs.spark.money/learn/limitations).

### RGB remains a separate capability and recovery domain

Current WDK docs list community UTEXO on-chain RGB and RGB-Lightning modules, explicitly independently maintained and not endorsed by Tether. The on-chain `2.0.3` native artifact list inspected here covers Linux x64/arm64 and macOS arm64, not Android. The separate RGB-Lightning `0.1.0-beta.15` module lists Android Bare artifacts and warns that lifecycle behavior may change. They derive different identities and hold separate RGB databases; a seed is not a substitute for on-chain RGB state backup. No inspected source establishes that a Breez Spark/BTKN balance is an RGB asset or that these rails automatically interoperate. [On-chain RGB module](https://docs.wdk.tether.io/sdk/community-modules/wdk-wallet-rgb/), [RGB-Lightning module](https://docs.wdk.tether.io/sdk/community-modules/wdk-rgb-lightning/).

Recommendation: one stable `WalletAdapter` contract and **separate explicitly named implementations** for selected WDK network, Breez Spark and a later RGB experiment. Capability negotiation must include asset/network, send/receive, restore/export, finality and supported platforms. Use test funds first; no production seed, vault format or signing-key migration belongs in the chat-routing repair.

## BTC Map: a useful public discovery input

BTC Map uses OpenStreetMap merchant data. Its documentation distinguishes read-only REST from read/write RPC and describes periodic re-verification of actual Bitcoin acceptance, including check dates. Start with read-only merchant discovery, attribution, source links and freshness labels. [BTC Map](https://btcmap.org/), [API overview](https://gitea.btcmap.org/teambtcmap/btcmap-general/wiki/API-Overview), [verification workflow](https://gitea.btcmap.org/teambtcmap/btcmap-general/wiki/Verifying-Existing-Merchants).

**Inference:** a Bitcoin-acceptance marker does not establish that a business runs sovereign infrastructure, is a qualified practitioner or earned a GPS reward. Those need separately defined signed attestations and verification policies. Do not upload patient routes, visit histories, exact location trails or health claims to public mapping records. Rewarding a contribution requires anti-duplicate and dispute logic beyond observing a map edit.

## First bounded integration experiments after the Android foundation

1. Restore the reproducible native Android build and prove vault/record compatibility before adding SDKs.
2. Demonstrate a signed, encrypted synthetic record transfer between Android and a clinic-owned desktop, with recipient selection, receipt, cancellation and restored-device tests.
3. Demonstrate public discovery → verified practitioner contact without transferring health data through the web directory.
4. Demonstrate one test-fund receive/send/recovery adapter with health/wallet key separation and explicit user confirmation.
5. Demonstrate GPS contribution receipts and a deterministic, versioned policy evaluator without money; then add settlement only after policy, dispute and recovery tests.

These experiments validate seams between products before adding broad features. No upstream announcement changes the current Solaris release gate or proves device performance.
