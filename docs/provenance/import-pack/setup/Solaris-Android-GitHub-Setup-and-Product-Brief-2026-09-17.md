# Solaris Android — GitHub setup and product brief for Claude Code

Prepared for Majd Faiz • 17 September 2026 • Current reference: verified Android build 604

## 1. The decision and the job

Create a **dedicated private Android repository**, preferably `TheMajicCode/solaris-android` after verifying the owner and access. Use the product name **Solaris Android · Pocket LUCA**. Keep the existing Solaris web repository in its current location. Use ordinary short-lived branches inside the Android repository for imports, audits and features.

Android has its own package identity, signer, private vault, native dependencies, model runtime, device tests and release lifecycle. A separate repository gives those responsibilities a clear home. A permanent Android branch in the web repository would make product documentation, issues, dependency history and release ownership harder to understand. Shared identity, consent, GPS and adapter contracts should be explicitly versioned across products; physical repository separation does not itself enforce privacy or protocol compatibility.

**This task establishes the repository, documentation, traceable import, audit workflow and private build-input distribution. It does not implement every feature in the vision.** GitHub hosts source, documentation, issues, CI and curated artifacts. The Android app continues to run on the user's device. This task does not deploy a web backend or turn on GitHub Pages.

The accompanying execution prompt supplies narrowly scoped permission to create this new private repository, push reviewed setup commits, open its bootstrap PR and store reviewed non-sensitive inputs as private repository artifacts. Do not apply that permission to the existing web repository, clinical data, app installation, new signing, keys, payments or deployment. Preserve the old handoff's instructions as provenance and document this new repository-setup authorization in current governance; do not silently rewrite the history of earlier permissions.

### Repository identity

| Field | Requested value |
| --- | --- |
| Suggested owner/repository | `TheMajicCode/solaris-android`; verify ownership/authentication before creating it |
| Visibility | Private initially |
| Product | Solaris Android · Pocket LUCA |
| Default branch | `main` for a new repository |
| Import branch | `bootstrap/android-604` |
| First audit branch | `audit/android-604` |
| About description | `Solaris Android: a private health vault and Pocket LUCA companion, developing toward consented P2P care, health and economic passports, and sovereign participation in the Solaris Network.` |
| Suggested topics | `android`, `solaris`, `local-first`, `on-device-ai`, `health-vault`, `pocket-luca`; use P2P/wallet topics only with the README's planned-status context |
| Homepage | Optional `https://solarishealth.app`; label it as the separate discovery product, not proof of Android availability |
| License | Preserve every existing notice. Record first-party licensing as a decision to resolve; do not silently license third-party/recovered code or declare the whole project open source. |

Keep the repository private while source completeness, licenses and release readiness are assessed. Its README can still be a polished product introduction for invited collaborators. A future public showcase or public-source decision requires a separate content/licensing review and explicit authorization.

## 2. The Solaris vision, seen from the Android app

**Solaris Android is the personal, user-held entry point to the Solaris Network: a health passport with Pocket LUCA, connected through optional adapters to an economic passport and practical sovereignty tools.** Its purpose is to help people reclaim their health, wealth and sovereignty without having to surrender control of their most valuable information.

The app should make a person's records, documents, observations and learning usable across their life. It is the place they unlock their own information, decide what another person may see, prepare for care, understand their next step and carry their history between trusted relationships. “Passport” describes a portable capability and user experience; it is not a claim of government identity, clinical certification or automatic access to every service.

Pocket LUCA makes this information easier to work with. It should help a person ask questions, reflect, prepare a practitioner conversation, understand a selected document and choose a practical next step using explicitly approved context. Its answers should show which information supports them and when information is absent. Local inference is valuable because useful private assistance can remain on the device once the required model is available. It does not make every answer correct or every network-connected feature offline.

### Reclaim your health — the health passport

The intended health passport brings together user-held records and documents, daily check-ins, notes, relevant measurements and practitioner-authored information without erasing their origins. A personal observation, a lab result, a clinician's signed note and a model-generated draft must remain distinguishable.

The key metaphor is concrete: **the user unlocks their vault and authorizes a specific relationship, purpose and set of information**. Connecting to a trusted practitioner should let the user select records or fields, inspect the intended recipient, understand duration and permissions, and confirm the sharing action. The app should show pending, delivered and acknowledged states truthfully. Further access can expire or be revoked; information already copied by a recipient cannot be guaranteed erased remotely.

This relationship can unlock more useful Heal, Learn and Earn journeys: preparing for a consultation, organizing a dental journey, understanding a chosen record, following a practitioner-approved plan, learning a relevant skill or completing a voluntary self-care activity. A clinician owns clinical authorship and judgment; the patient controls their sharing decisions. The design must not imply that an AI recommendation is a medical order or that patient consent edits a clinician's original authorship.

### Reclaim your wealth — the economic passport

The intended economic passport gives the user optional, separately protected financial capabilities: a Bitcoin/Lightning experience through **Breez SDK Spark**, and a stablecoin wallet through a deliberately selected **Tether WDK** chain/account module. Wallet setup should be optional and understandable, with explicit recovery, fees, network status and confirmation.

It connects to the health journey through voluntary, clearly funded programs and to GPS through evidenced contributions to the ecosystem. Examples to evaluate include accessible self-care participation, learning, helping someone onboard, improving a verified merchant/community listing, contributing translation or educational material, and supporting community or clinic infrastructure. These are candidate program categories, not promises of payments or already approved economic policy.

Earning requires a named funder, a finite budget, eligibility rules, contribution verification, a policy version and a settlement process. Distinguish **recorded contribution → verified evidence → eligible allocation → approved payment → pending settlement → settled receipt**, with rejected/disputed/expired states where applicable. A contribution score or receipt is not spendable money. Do not invent reward amounts, guaranteed income, token appreciation, allocation percentages or a universal funding source.

People should retain access to their records and core health tools without creating a wallet, earning a reward, improving a biomarker or publishing personal health data. Programs should account for illness, disability and differing resources. Do not make disclosure of raw records the price of participation or design rewards that encourage unsafe care decisions.

### Reclaim your sovereignty — understanding and participating

The sovereignty component should help a person take practical steps in both digital and physical life: understand custody and recovery, export their data, practice backup and restore, recognize privacy boundaries, discover useful local businesses or communities, and choose where to contribute time, skills or resources.

BTC Map can supply Bitcoin-acceptance discovery. Solaris can later layer separately evidenced information about community services, clinic relationships and independently assessed infrastructure. **“Accepts Bitcoin,” “runs a verified sovereign service,” “belongs to a community,” and “is a qualified trusted practitioner” are different claims.** Each needs its own source, verification criteria, date and status. A merchant listing must not become an automatic sovereignty or medical-trust badge.

Start with user-entered places/regions and optional location access. Useful maps should disclose cached/online status and data age. They must not broadcast a person's health context, private identity graph or clinic relationship in map queries.

### GPS has a specific meaning

In the retained Solaris architecture, **GPS is the policy/allocation/settlement/receipt protocol; it is not phone geolocation**. Use the established name without inventing a new expansion.

Preserve the concepts of a root `ValueEpisode`, versioned policy snapshot, signed or otherwise attributable evidence, a finite allocation manifest and per-output settlement receipts. A signature proves control of a signing key, not automatically the truth of a contribution, professional qualification or unique human identity. Preserve existing policy constraints as evidence and reconcile the accepted profile before monetary implementation; do not hardcode a new split in this setup task.

Begin with synthetic signed evidence and **shadow allocations that move no funds**. Deterministic replay computes state; it must never send payments. A separately authorized durable outbox handles execution, deduplication and reconciliation of uncertain settlements. Retrying must not pay twice. Keep health content, private Subject IDs and revealing health-derived hashes out of public events, payment memos and blockchain metadata.

## 3. Its place among Solaris products

| Product/boundary | Role | What belongs elsewhere |
| --- | --- | --- |
| Solaris Android / Pocket LUCA | Personal vault, selected-context local assistance, user consent, local history, optional identity/sharing/wallet/map adapters | Shared clinic administration and public marketplace hosting |
| Solaris web discovery/coordination | Public practitioner/service discovery and carefully minimized coordination under its separate approved release scope | Patient vault contents, clinical documents, LUCA health prompts or clinical plaintext on Solaris-operated infrastructure |
| Practitioner Clinic OS | Practitioner-controlled desktop/clinic workspace and authorized care inbox, with attributable records, roles, audit and recovery | Automatic access to every patient record or shared unrestricted owner credentials |
| Clinic/business-in-a-box | A later supported deployment/hardware/service package for suitable operators | A required purchase for patients, a condition of listing a practitioner, or something already delivered by 604 |
| Shared protocols | Versioned identity, consent, sharing, evidence and receipt schemas with test vectors | One merged database, common master keys or implicit trust between products |

Practitioners may use the web product for discovery without installing the patient APK. Private care delivery requires an authorized endpoint such as the intended Clinic OS workflow; listing alone does not provision that endpoint. Any browser-based clinical view is a separate key-custody and authorization design to prove.

Treat “no clinical plaintext on Solaris-operated servers” as a target data-flow constraint that must be tested, not as a claim already proven by a README. Inventory what discovery, relays, RPC services, payment providers and map services can observe. Encrypted transport can still expose metadata. Connectivity fallback must not silently weaken confidentiality.

## 4. What 604 actually establishes

The user's positive feedback is useful acceptance context. The handoff's source and test reports remain the technical baseline. Do not turn the full vision above into a list of shipped features.

| Capability | Evidence/status to document |
| --- | --- |
| Current package and update lineage | `org.solarishealth.edge.recovery`, 604 / `6.0.4-preview.grounded-chat`; matching existing development signer |
| Existing vault, recovery, records and model | Native components preserved in the candidate; formats/identity/model must remain unchanged. Complete native source and storage durability are not established by preservation alone. |
| Guided common questions | Implemented in 604 for recognized greetings, check-in/support intents and related routes; accurately labeled guided |
| Check-in personalization | Uses explicitly selected, currently approved supported fields; category permission alone does not select records |
| General local chat | Existing Qwen3-0.6B Q4 model path retained; output can remain slow, vague or unsupported |
| Waiting/error/authority behavior | Reviewed 604 repairs with targeted desktop tests |
| Leaving the app | Vault locks and unfinished generation cancels; saved chat view returns after unlock; unfinished drafts are not durably recovered |
| Full native Gradle source build | Missing/incomplete; HBC reconstruction is a bounded APK-derived build path |
| Production P2P practitioner sharing or own-device replication | Not established by the 604 handoff; roadmap work requiring contracts and device tests |
| WDK/Breez wallets, funded rewards and GPS settlement | Planned adapter/program work; not established as integrated in 604 |
| Sovereignty map/credential system | Proposed; neither BTC Map data nor a repository label establishes those trust claims |
| Production/patient release readiness | Not established; audit, native reconstruction, operational and device gates remain |

### Reference anchors

| Artifact | SHA-256 |
| --- | --- |
| Reassembled complete handoff ZIP, 1,518,762,347 bytes | `b31177db52d0b041d8dd66ed5e3d3b504ef2448e60b54f8e6a8a436f9a8c0e3d` |
| Signed 604 APK | `0e9a66da00cbe128851d981a9f9a3d9a1dbfe653f7a4ced93d638bc4d7d31827` |
| Released/reproduced 604 HBC | `30be9989cc00299836715cc3de5cf3a2a75b00019bdf2f1b91629205f558d8b3` |
| Existing signing certificate | `fac61745dc0903786fb9ede62a962b399f7348f0bb6f899b8332667591033b9c` |

The earlier handoff reports 5,234 archive members, 5,168 preserved imported entries, exact HBC reproduction, 287 selected regression checks and 40 syntax/config checks. Attribute those results to the dated handoff until rerun. They use desktop/synthetic native or DOM boundaries and are not a full device, dependency or security audit. This document-writing task does not rerun the APK build.

## 5. Restore, classify and preserve before importing

1. Verify that Claude has an actual execution filesystem and authenticated GitHub access. Chat attachments and `sandbox:` links are not automatically files accessible to its terminal. If inputs are missing, identify the exact files needed; complete useful local documentation work without pretending the source import is done.
2. Obtain all four `Solaris-Android-604-Handoff-Part-N-of-4.zip` files and the included `Assemble-Solaris-604-Handoff.py`. Keep the part filenames. Read the script before execution; it uses the standard library, checks each part, and reconstructs the exact full ZIP. The transport guide specifies a supported Linux/NTFS filesystem and at least 8 GB of working space.
3. Verify the full ZIP against the SHA above, extract it into a reference directory **outside the future Git working tree**, and preserve that copy unchanged. Use a variable such as `SOLARIS_604_REFERENCE_DIR`; do not repurpose `HOME` or platform runtime variables.
4. In that original complete reference, read `README.md`, `AGENTS.md`, `handoff/SOURCE-MAP.md`, `handoff/FIRST-AUDIT-PROMPT.md`, `handoff/PRODUCTION-GATES.md`, `handoff/FILE-INVENTORY.json` and the 604 build report. Inspect scripts, then run the documented verification and applicable audit commands there. Record unavailable prerequisites as blocked.
5. Classify every candidate file as maintained first-party source, recovered reference, historical evidence, third-party source, generated/binary input, private evidence, or signing/credential material. Preserve license notices and provenance. Do not mechanically lint-fix pseudocode or decompiled Java as if it were the missing original project.
6. Create a clean working repository projection with an explicit file allowlist. Keep the established relative source roots and required source tools in place. Do not flatten or move R2/R3/R4 during bootstrap.

### The important inventory distinction

The original `handoff/verify.py` validates a **complete frozen handoff**, including its original README, AGENTS, tools, binaries and private evidence. A source-only Git clone lacks deliberately excluded files, and the new repository README/governance will intentionally differ. Running that full inventory check in the modified clone would correctly fail.

Therefore:

- Keep original manifests and instructions as immutable provenance, with their original scope clearly labeled.
- Create `docs/provenance/REPO-IMPORT-MANIFEST.json` for the repository projection: original path/hash, tracked destination, classification, inclusion/exclusion reason, and any deliberately edited documentation.
- Preserve imported application/source bytes during this setup. New README/governance/CI documents are explicit new work, not an excuse to refresh the old baseline hashes.
- Give source-only repository checks their own entry point and CI name. They must not report a missing full reference as a passed full-reference check.
- Run reference-604 reproduction from the restored unchanged reference directory. Label it **reference reproduction**; it does not prove the correctness of future changed repository code.
- Candidate tests for later app edits need a separately reviewed harness that uses that candidate's source with pinned inputs. Add that task to the roadmap rather than silently reusing the old verifier or calling baseline tests a candidate release gate.

This preserves auditability while allowing a useful new README and ordinary source-only clones.

## 6. Where GitHub should store each kind of file

| Material | Destination |
| --- | --- |
| Reviewed application/reconstruction source, tests, scripts, contracts and docs | Normal Git history, using an explicit allowlist |
| Useful recovery evidence and decompiled references | Track selected text where size/licensing/privacy permits; retain clear evidence labels and source hashes |
| Toolchains, model weights, reference APKs and large generated bytecode | Curated private release assets or an explicitly selected private artifact store, referenced by immutable hashes and sizes |
| Full original 1.52 GB handoff | Preserve privately outside ordinary Git; do not upload it unchanged as a release asset because it includes private phone evidence |
| Phone screenshots/recordings, patient/owner records, raw vaults, recovery secrets, wallet seeds and signing credentials | Excluded from Git, Actions artifacts, release assets and issue/PR bodies |
| Synthetic test data and redacted/synthetic UI showcase assets | Git or a documented private artifact bundle after provenance/privacy review |

GitHub's browser upload limit is 25 MiB per file; ordinary Git warns over 50 MiB and rejects over 100 MiB. Release assets currently must each be under 2 GiB; access follows repository read permissions. The full handoff fits the release-size limit, but its private evidence makes an unchanged upload inappropriate. Create sanitized, narrowly selected input bundles and verify their contents before upload. [GitHub file limits](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github), [releases](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases).

Use a private archived-input release such as `android-604-reference-inputs-v1`, marked as historical reference inputs rather than a new production app release. Separate the model experiment input from the minimum HBC test/tool input to avoid mandatory large downloads. Check licenses before redistributing third-party tools or weights; if redistribution is not established, retain hashes and authorized acquisition instructions and report the restore path blocked until resolved.

Create `artifacts/manifest.json` with asset name, bytes, SHA-256, origin/provenance, license status, required/optional role, exact restoration path, platform requirements and the release/tag plus exact commit/asset identifiers once they exist. Use SHA-256 as content identity; do not assume a tag or asset URL is immutable. Never commit an expiring signed URL, token or credentials. Artifact restoration is manual and checksum-checked; reject unsafe paths and unexpected files. Do not overwrite newer working source while restoring inputs.

For privacy-excluded paths, record the exclusion class in the import manifest without reproducing sensitive filenames, user text or health-linked digests into new public-facing documentation. Store any indispensable original complete evidence manifest only in its original private reference context; create a sanitized repository projection rather than copying it blindly.

## 7. Required repository structure and documents

The source roots below are the existing handoff layout. Add documentation around them before attempting a structural refactor.

| Path | Required content |
| --- | --- |
| `README.md` | Adapt the companion README draft; product purpose, visible current-status callout, three pillars, ecosystem role, status matrix, source map, honest setup links and limits |
| `AGENTS.md` | Concise shared constraints, task ownership, evidence rules, exact authorized repository actions and protected app boundaries |
| `CLAUDE.md` | Literal `@AGENTS.md` outside code fences, plus brief Claude-specific pointers |
| `docs/PRODUCT-VISION.md` | Sections 2–3 of this brief developed from the APK perspective; user stories and success criteria |
| `docs/FEATURE-STATUS.md` | Working / tested-in-isolation / experimental / planned / blocked; evidence paths and dates for each claim |
| `docs/ARCHITECTURE.md` | Runtime/storage/authority boundaries and cross-product diagram; distinguish actual 604 components from proposed ports |
| `docs/DATA-AND-CONSENT.md` | Selected records, recipient trust, purpose, duration, revocation limits, clinical authorship, metadata, offline freshness and export |
| `docs/ECONOMIC-PASSPORT.md` | Breez/WDK separation, chain decisions, recovery, fees, approvals, contribution/reward states and unimplemented status |
| `docs/SOVEREIGNTY-AND-GPS.md` | GPS meaning and replay rules; BTC Map versus other evidence categories; practical voluntary participation |
| `docs/BUILD-AND-TEST.md` | Source-only checks versus complete-reference reproduction; prerequisites, current commands, expected hashes, output paths and blocked native build |
| `docs/ARTIFACTS.md` | Git/artifact split, privacy exclusions, minimum and optional input bundles, checksum restore and offline use |
| `docs/ROADMAP.md` | Bounded issues with dependencies, acceptance evidence and owners; no invented delivery dates |
| `docs/CONTRIBUTING.md` | One writer per path, branches/worktrees, precise PRs, targeted tests, independent review and no baseline evidence rewrites |
| `docs/SECURITY.md` | Private reporting route actually available to maintainers, key/data handling and known release limits; no invented contact address or guarantees |
| `docs/THIRD-PARTY-NOTICES.md` | Actual dependency/tool/model license/provenance inventory and unresolved items |
| `docs/decisions/ADR-0001-android-repository.md` | Why Android has a separate repo; shared contracts remain versioned |
| `docs/decisions/ADR-0002-source-and-artifacts.md` | Frozen reference versus repository projection; privacy and large-file rules |
| `docs/decisions/ADR-0003-optional-adapters.md` | Proposed adapter boundaries and compatibility questions, not an implemented adapter framework |
| `docs/provenance/` | Sanitized import manifest, dated source map, baseline identifiers and inherited instruction provenance |
| `docs/workflow/STATUS.md`, `TASKS.md`, `HANDOFF.md` | Current task, writer, reviewer, base SHA, paths, evidence, unresolved issues and next action |
| `contracts/README.md` | Index of accepted versus proposed cross-product contracts; no invented executable schemas presented as agreed |
| `artifacts/manifest.json` | Exact curated asset metadata; no private bytes or credentials |
| `.github/workflows/` | Real scoped source CI; separate manual reference validation when inputs and authorization are available |
| `.github/ISSUE_TEMPLATE/`, pull request template | Bug, bounded task and evidence/review templates |
| `.devcontainer/devcontainer.json` | Audit workspace configuration; disclose whether launched and whether image/tool versions are pinned |
| `Solaris-Android-R4/`, `Solaris-Android-R3/`, `Solaris-Android-R2/`, `Solaris-Android-Reconstruction/` | Preserve selected imported source paths and provenance; R4 is the latest 604 change layer |
| `handoff/`, `solaris-603-native-probe/` | Selected safe source and reports from the handoff; distinguish reference-only runners from repository checks |

Create no empty production modules, fake Gradle project, pretend API server or placeholder wallet implementation just to make this tree look finished. Put planned interfaces in documentation until a bounded implementation task is approved.

### README and showcase quality

Use the genuine available Solaris logo/colors/assets after checking their source and license. Preserve the familiar darker sanctuary presentation, Pocket LUCA naming and Heal/Learn/Earn language. Use synthetic or redacted demo records if images are included; label mockups and roadmap illustrations. Do not publish the original phone frames. Add no passing badges without real CI, no “production ready,” “fully decentralized,” “zero metadata,” or “clinically validated” claims without the evidence needed for that exact statement.

The README must explain a useful person-centered journey: unlock → choose context → ask/reflect with LUCA → select a trusted relationship → approve a scoped action → see the result/receipt. Wallet and map setup remain optional; do not turn first-run onboarding into mandatory key generation for every planned service.

## 8. The adapter contracts Claude should document

These are architectural design requirements and planned contracts, **not names of existing SDK methods or claims of shipped 604 modules**.

| Boundary | Contract concerns and required later evidence |
| --- | --- |
| Identity/trust | Preserve private Subject ID and existing keys; optional bindings such as npub remain separate from identity, professional credentials and reward eligibility |
| Vault/recovery | Existing compatible formats, encryption/key ownership, attachment integrity, restore/version continuity and local access independent of a wallet/provider |
| Pocket LUCA | Explicit selected context; current authority check at side effects; guided/generated provenance; cancellation and truthful failure states; no root/signing/spending keys in model context |
| P2P sharing/sync | Recipient verification, scopes, expiry, encryption/key distribution, own-device versus practitioner roles, outbox states, replay/deduplication, future-access revocation and device-loss recovery |
| Bitcoin | Breez Spark capability discovery, initialization, quote, user confirmation, submission, pending/failure reconciliation, lock and wallet-specific recovery |
| Stablecoin | Selected WDK module, chain/token/account model, exact token metadata, balance/fees/gas, confirmation, idempotent settlement, lock and recovery |
| GPS/rewards | Evidence provenance, policy version, root episode, finite budget, fraud/dispute rules, shadow allocations and separately authorized settlement |
| Discovery/maps | Read-only public data first, attribution, freshness/cache, opt-in location and separate trust evidence; no health payloads in public requests |

Identity control, vault recovery and wallet recovery must remain separate. Do not derive wallet secrets from an npub, clinical record, APK signer or the existing vault encryption key. Do not replicate live wallet signing state with a generic CRDT or let several devices concurrently act as an uncontrolled wallet writer. A health-data grant never implies spending permission. LUCA can propose an action; deterministic code and the user authorize consequential execution.

### Breez SDK Spark — Bitcoin/Lightning plan

Official Android/Kotlin and React Native bindings exist; the React Native package contains native code. Verify the app's real integration environment and pin a reviewed compatible version. Start a separate synthetic/regtest spike; Breez's documented regtest environment has no real monetary value and needs no API key. Mainnet initialization has different credential and operational requirements. [Android](https://sdk-doc-spark.breez.technology/guide/install_android_kotlin.html), [React Native](https://sdk-doc-spark.breez.technology/guide/install_react_native.html), [testing](https://sdk-doc-spark.breez.technology/guide/testing.html), [initialization](https://sdk-doc-spark.breez.technology/guide/initializing.html).

Document fee estimates and confirmations rather than promising free payments. Self-custody still has operator/service dependencies. Spark's unilateral exit has data, fee-funding and timelock requirements, so a mnemonic alone must not be advertised as guaranteed instant recovery during every outage. [Fees](https://sdk-doc-spark.breez.technology/guide/end-user_fees.html), [unilateral exit](https://sdk-doc-spark.breez.technology/guide/unilateral_exit.html).

Breez currently also describes stablecoin capabilities. The selected Solaris product split remains Breez for Bitcoin/Lightning and WDK for the stablecoin adapter; overlapping SDK features do not authorize creating duplicate wallet systems. [Breez overview](https://sdk-doc-spark.breez.technology/).

### Tether WDK — stablecoin plan

Choose one chain/token/account model before implementing a wallet. Record chain ID, token contract, decimals, RPC/indexer dependencies, fees and recovery behavior. A stablecoin address is not universally interchangeable across networks. Different ordinary/smart-account modules have different gas, bundler and paymaster requirements. [WDK module selection](https://docs.wdk.tether.io/sdk/wallet-modules/which-wallet-module/), [ERC-4337](https://docs.wdk.tether.io/sdk/wallet-modules/wallet-evm-erc-4337/).

The current React Native quickstart specifies Node 22+, React Native 0.81+, Android API 29+, and a Bare worklet. Its beta.18 core lists Bare Kit >=0.14.5, while the recovered 604 context records Bare Kit 0.14.0. Recheck and freeze current versions in the spike; **do not upgrade the 604 QVAC/Bare runtime as part of repository import**. The full native build gap is a real prerequisite for integrating new native modules. [WDK React Native quickstart](https://docs.wdk.tether.io/start-building/react-native-quickstart/).

The WDK React Native storage helper does not itself provide seed generation, seed encryption or cloud backup. Specify the complete key lifecycle and prove recovery independently before any real-value activation. [WDK secure storage](https://docs.wdk.tether.io/tools/react-native-secure-storage/).

### BTC Map — sovereignty discovery plan

Start with optional read-only discovery and preserve verification dates and source attribution. BTC Map describes Bitcoin-accepting places, not a verified Solaris clinic or self-hosting registry. Its API documentation distinguishes REST read access from RPC write operations; any contribution workflow needs separate user approval. [BTC Map](https://btcmap.org/), [API overview](https://gitea.btcmap.org/teambtcmap/btcmap-general/wiki/API-Overview), [merchant verification](https://gitea.btcmap.org/teambtcmap/btcmap-general/wiki/Verifying-Existing-Merchants).

Distinguish software licensing, underlying OpenStreetMap data attribution/ODbL obligations and map-tile terms. Verify the exact chosen component before copying code or shipping a map. [BTC Map license](https://btcmap.org/license), [OpenStreetMap attribution](https://www.openstreetmap.org/copyright).

## 9. Execute the repository bootstrap

### A. Verify account, target and source

Use the authenticated GitHub tooling available in the environment. Check `gh auth status` or equivalent, identify the acting account and verify access to the intended owner. Do not ask for tokens in chat or assume a paid AI subscription grants GitHub access.

Check whether `TheMajicCode/solaris-android` exists. If it does, inspect its actual default branch, current commits, governance and worktree before proposing integration. Do not overwrite or force-push it. If owner/target ambiguity remains, ask only the necessary account/target question after preparing local files.

### B. Create an empty private repository and working branch

For a verified new target, an illustrative CLI creation command is:

```sh
gh repo create TheMajicCode/solaris-android --private --add-readme --clone --description "Solaris Android: a private health vault and Pocket LUCA companion, developing toward consented P2P care, health and economic passports, and sovereign participation in the Solaris Network."
```

Confirm the current CLI supports the options and the owner is correct before execution. A new empty repository needs a base commit before a PR can target it. This task permits the minimal initialization README commit, followed by the complete import on `bootstrap/android-604`. Record the initialization exception; it is not general permission to write app changes directly to `main`. [GitHub CLI repository creation](https://cli.github.com/manual/gh_repo_create).

Create and validate the actual import, docs, ignore rules and scoped CI in the branch. Stage an explicit allowlist; inspect the complete staged diff and file classifications, not only filename extensions. Run the chosen checks and obtain independent review of the exact staged/committed tree. Fix findings and refresh review after material changes. Only then push the setup branch and open a PR with a clear description and evidence. Leave merging to the owner's existing workflow; do not bypass unavailable checks or use administrator overrides.

### C. Curate artifact assets and settings

Build safe, minimal reference-input bundles from verified original bytes. Review each archive's complete entry list for privacy, secrets, license and restoration safety. Verify hashes again after upload and record exact asset identifiers and content hashes in `artifacts/manifest.json`. Do not upload the original full handoff or the four original transport ZIPs unchanged. Publishing to a private artifact release is authorized only for this reviewed, non-sensitive selection.

Add repository description/topics and issue/PR templates. Configure available branch protections and required real checks. Keep Actions permissions minimal (`contents: read` for ordinary checks), pin third-party Actions to verified full commit SHAs, and separate any artifact-upload job from untrusted PR execution. No signing keys in normal PR CI. [Actions security](https://docs.github.com/en/actions/reference/security/secure-use).

Private-repository branch protections depend on the account plan. A Copilot subscription is not proof of eligibility. A PR author cannot approve their own PR, and Copilot review does not count as a required human approval. Claude and Codex using the same GitHub account cannot manufacture a second eligible approver. Where enforceable review/protection is unavailable, record the gap and the independent written review/owner decision accurately. [Protection availability](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/managing-a-branch-protection-rule), [required reviews](https://docs.github.com/en/pull-requests/how-tos/review-pull-requests/approving-a-pull-request-with-required-reviews).

### D. Establish useful CI and the first audit

| Check | Honest scope |
| --- | --- |
| Source/documentation CI | Validate tracked file policy, documentation links/configs, authored-code syntax, scoped lint and applicable artifact-independent tests |
| Secret/dependency/license audit | Use suitable available tools, freeze versions, classify findings and exposure; unavailable paid features are not passed checks |
| Reference 604 validation | Manually restore the unchanged full reference and run its existing verifier/reproduction harness there; preserve its exact hashes |
| Later candidate validation | Separate reviewed runner against changed implementation, compatibility boundaries and exact candidate artifacts; not supplied by copying the old reference badge |
| Native Android build/device acceptance | Explicitly blocked or not yet established until the missing source/build graph and actual device gates are resolved |

Do not invent `./gradlew assembleRelease`, a root app lockfile, npm scripts or green native-build badges. Do not suppress lint/scan failures or mass-rewrite historical evidence to achieve a clean dashboard. Separate confirmed defects, maintainability findings, dependency exposure, missing source and unrun checks.

Private GitHub code scanning has plan/licensing requirements; verify availability rather than promising CodeQL will run. Compatible local/manual scanners and retained reports can still support the first audit. [Code scanning availability](https://docs.github.com/en/code-security/concepts/code-scanning/code-scanning).

The supplied Codespaces configuration is an audit starting point. Record its actual runtime versions and whether it was really launched. Pin an image only after selecting and testing it; add no automatic model downloads, signing, opaque installation hooks or access to private reference evidence in ordinary CI. A phone-only user needs a real cloud terminal/filesystem for the large archive; the GitHub browser's Add file UI is not the import path for 380 MB parts. [Codespaces environments](https://docs.github.com/en/codespaces/setting-up-your-project-for-codespaces/adding-a-dev-container-configuration/introduction-to-dev-containers).

## 10. Working instructions for Claude, Codex and other agents

Root `AGENTS.md` should state, in concise language:

- This is the Android product; current application baseline and exact source provenance are recorded.
- Protect package/signer/Subject ID/vault/recovery/record/model compatibility. Do not reset data or regenerate keys.
- Keep existing source-selection, authority, lock and cancellation enforcement. LUCA does not hold root or spending authority.
- Work on a named bounded task and branch/worktree; one writer per path. The other agent reviews an exact commit or file-hash set.
- Existing local investigation and reversible setup work should continue without repeated permission requests. This bootstrap has the specific private-repo push/artifact scope above; it does not grant general production actions.
- Preserve the immutable reference and identify projection-specific checks. Do not edit past passing evidence or relabel blocked checks.
- Use synthetic test data. Keep clinical/financial secrets and personal evidence out of Git, prompts, logs and published artifacts.
- Record changes, tests, independent review, remaining limits and next action in the versioned workflow files.

Put the following literal line in root `CLAUDE.md` outside a fenced block:

```text
@AGENTS.md
```

Claude imports that file explicitly; Codex discovers `AGENTS.md` through the directory hierarchy. Keep long vision/history documents linked, rather than injecting every report into every agent session. Local agent memory is not the project ledger. [Claude memory](https://code.claude.com/docs/en/memory), [Codex instructions](https://developers.openai.com/codex/guides/agents-md).

A task record should name its problem, owner/writer, reviewer, base SHA, allowed paths, acceptance evidence, output paths, status and next step. Independent AI review is valuable but must not be misrepresented as an enforced GitHub approval from another eligible account. No unattended schedules are activated by this setup.

## 11. Bounded roadmap to seed as issues

Create issues in the new repository only after their descriptions are prepared and reviewed. They are a sequenced plan, not authority to implement everything in parallel.

| Issue | Scope/dependencies | Acceptance evidence |
| --- | --- | --- |
| AND-00 — Verified repository bootstrap | This task | Private repo, exact source import/projection, useful docs, real CI, reviewed PR, artifact boundaries and no unsupported claims |
| AND-01 — Baseline quality/security audit | After AND-00 | Prioritized findings tied to paths/SHAs; scoped lint/dependency/license/secret reports; clear native source gaps and smallest next repair |
| AND-02 — Reconstruct native build prerequisites | Based on audit | Traceable app/native graph, dependencies and build inputs; preserve signer/vault compatibility; prove rebuild stages without fabricated source |
| AND-03 — Pocket LUCA reliability and latency | Can investigate alongside reconstruction within proven source boundaries | Phone cold/warm timings, selected-source quality, truthful progress/errors, cancellation; distinguish deterministic guided help from inference |
| AND-04 — Pending conversation recovery | Requires storage/lifecycle contract | Encrypted durable pending-turn states, device/process-death tests, no replay after revocation/owner change and preserved record IDs |
| AND-05 — Identity/consent/shared contract alignment | Joint documentation/vectors with the web/Clinic OS workstreams; no remote repo write assumed | Explicit identity binding, qualified recipient trust, consent/expiry/revocation, schema/version and negative vectors |
| AND-06 — Own-device encrypted transfer spike | After relevant identity/recovery gates | One synthetic note between owned devices; restart/replay/conflict/revoke tests and no requirement for connectivity to unlock local records |
| AND-07 — Practitioner private-care inbox | After AND-05/06 and suitable clinic endpoint | Selected synthetic record delivery across networks; recipient/scoped authorization, acknowledgements, authorship and recovery proven |
| AND-08 — Sovereignty discovery prototype | Optional read-only adapter after contract review | Attributed BTC Map data, cached/online status, explicit location choice and separate evidence labels; no invented trusted-service badges |
| AND-09 — Breez Spark compatibility spike | Requires native/runtime feasibility | Regtest only; lock/recovery/fees/pending-state tests; no real funds, seed reuse or effect on vault access |
| AND-10 — WDK chain/runtime decision and spike | Requires native/runtime feasibility and selected module | Document Bare Kit compatibility, chain/token/gas/account model, synthetic/test-network transactions and independent recovery checks |
| AND-11 — GPS shadow contribution ledger | Accepted shared policy/vectors | Attributable synthetic evidence, one finite allocation per episode, replay-safe outbox design; zero funds move |
| AND-12 — Funded Earn pilot and release evaluation | Wallet, GPS, funding, trust and applicable release prerequisites | Approved funded rules, dispute/anti-abuse/limits, explicit confirmations and idempotent settlement; no health-data sale or guaranteed earnings |

Any current working source can support earlier bounded investigation; the table does not justify guessing missing native implementation or delaying every useful fix until the whole architecture is finished. Propose the smallest task the evidence actually supports.

## 12. Definition of done and Claude's final report

Complete the authorized setup without pausing for every reversible local step. Ask only when authentication, target ownership, a material policy conflict or missing source genuinely prevents the specific next action. Prepare all possible local work and name the exact blocker. Do not claim repository creation, upload, CI execution, a Codespace launch or source completeness without observing it.

The finished report must include:

1. Repository URL, actual visibility and default branch; acting account/verified owner without secrets.
2. Bootstrap branch, commit SHA and PR URL; what was pushed and whether it remains unmerged.
3. Source import manifest and the unchanged app-source lineage; an explicit inventory of excluded/private/large inputs.
4. README, product/architecture/status/roadmap and onboarding documentation links, with working/planned distinctions intact.
5. Exact CI/audit commands and results, independent review, plan-dependent checks unavailable, and a clear statement that native production readiness remains unproven.
6. Curated private artifact asset names, hashes, sizes, restoration instructions and license status; no raw full-handoff upload.
7. Branch protection/reviewer settings actually enabled and any enforcement gap.
8. A short, accurate README showcase summary and one best next bounded task.

### Evidence used for this brief

Current content was read from `Solaris-Android-604-Handoff-Guide.md`, `Solaris-604-Handoff-Independent-Review.md`, `Solaris-604-Handoff-Archive-Verification.json`, the current original `Solaris-Sovereign-Architecture-and-Copilot-Roadmap-2026-09-16.md`, and `Solaris-APK-Identity-and-GPS-Implementation-Plan(3).md`. Earlier monorepo/Copilot-primary suggestions are historical; this request establishes a dedicated Android repo with Claude Code and Codex collaboration. The technical primary-source links above were checked for this brief; recheck versions and service entitlements at execution time.

This brief and its README draft describe the intended product and repository task. They are not evidence of a newly created GitHub repository, implemented wallets/P2P/GPS payouts, a new APK, clinical effectiveness or production certification.
