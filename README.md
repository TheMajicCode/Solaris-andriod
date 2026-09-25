# Solaris Android · Pocket LUCA

**Your health passport. Your economic passport. Your path to greater sovereignty.**

Solaris Android is the user-held companion in the Solaris ecosystem: a private
health vault with Pocket LUCA, designed to help people bring their records
together, understand their own context and choose what to share with trusted
practitioners. Its direction is local first, with permissioned peer-to-peer
connections and optional services that help people reclaim their health, wealth
and sovereignty.

The phone becomes a key to the Solaris Network. The user decides when to unlock
their own information, which records a practitioner may receive and how to
participate in deeper **Heal, Learn and Earn** journeys. Health information is
not the price of admission to a reward program.

> ### Current status — read this before anything else
>
> **Baseline: Android candidate 604, `6.0.4-preview.grounded-chat`.** This
> repository holds a hash-verified imported **source projection** of a recovered, partially
> reconstructed application and its verified evidence. Build 604 improves guided
> chat grounding and interaction behaviour while preserving the existing native
> payloads.
>
> It is **not** a complete original Android source project, **not** a buildable
> Gradle project and **not** a production-ready release. There is no `gradlew`
> here and none should be invented. P2P practitioner exchange, economic-passport
> wallets, GPS rewards and the sovereignty modules described below are **roadmap
> work**, not shipped features.
>
> No APK was built, signed, installed or deployed to produce this repository.

## Latest engineering status — 25 September 2026 (Sprint-02)

The import branch carries the foundation repairs, the A605 routing and
answer-containment candidate, Sprint-01's host reproduction, and Sprint-02's
audit closure, bounded host donor and welcome/onboarding candidate. PR #1 remains
draft and unmerged. Recheck the actual branch and
[`docs/workflow/STATUS.md`](docs/workflow/STATUS.md) before writing.

**What is established:**

- **The 604 host bundle reproduces byte-identically** (`30be9989…`) from the
  exact 603 host bundle and pinned compiler. The original 34 host cases and 10
  lifecycle cases pass against it in actual Hermes. See
  [host reproduction evidence](docs/HOST-REPRODUCTION-EVIDENCE.md).
- **A bounded A605 host donor fits the frozen host and passes on it.** It covers
  the F04 punctuation and polite-wrapper fix, the F05 check-in fix, and the
  app's quick-action replies. It is built into a candidate host bundle
  (`105ade31…`) that passes the same 34 and 10 cases, plus 29 pre-registered
  donor-proof cases. This is desktop Hermes with synthetic seams, not a phone.
  The first revision of this donor was rejected by independent review, and the
  published claims about it were corrected.
- **A welcome/onboarding refresh exists as a tested candidate and an isolated
  preview.** It lives in `candidate/onboarding/` and implements the
  [contract](docs/reports/WELCOME-AND-ONBOARDING-CONTRACT-2026-09-18.md):
  - EN/ES throughout, including the locked screen;
  - an unknown vault state is never treated as "no vault";
  - returning owners go straight to unlock;
  - no model download or source selection from the introduction;
  - brief motion, off under reduced motion.

  Browser checks cover 320–390 px widths, 200% text and 48 dp targets. It is
  **not integrated**: it measures 36.9× the host's UI slot, so it waits on
  native UI source. See [the trace](docs/onboarding/HOST-TRACE.md) and
  [visual QA](docs/onboarding/VISUAL-QA.md).
- **Every reviewer finding is dispositioned against the reviewer's own words.**
  See [finding dispositions](docs/reports/FINDINGS-DISPOSITION-SPRINT-02.md).
  An external Expo audit is kept separately as EXT-01–30; its source was never
  found, so its source-specific fixes stay unverified
  ([status](docs/EXTERNAL-AUDIT-STATUS.md)).
- **Source checks fail closed, enforced centrally.** Maintained code cannot be
  reclassified out from under its gates, and the documented check tables are
  tied to the registry in CI.

**What is not established, and is not claimed:**

- **No new A605 APK has been built.** `A605` is a workstream name, not version
  code 605. The 603 and 604 APKs exist outside this repository. Packaging would
  need the exact 603 APK and three pinned tools, plus a signing decision; none
  is authorized now.
- **The full candidate router does not fit the host.** Lowered for Hermes it is
  80 functions against a one-function donor contract. Only the bounded donor
  fits. Nothing was weakened to force a fit.
- **No native source build.** A host-bundle reproduction is not a native build.
  The authored Gradle/Kotlin/NDK project is still not recovered, and that is the
  largest open item.
- **No Android execution, device, phone latency or model-quality evidence.**
- **Clinical wording is unreviewed.** Escalation copy, 17 known under-referred
  clinical phrasings and crisis phrasings wait on a qualified clinician.

Release remains **NO-GO**.

Start with the [current engineering report](docs/reports/Solaris-Engineering-Progress-and-Ecosystem-Report-2026-09-18.md),
[product map](docs/ECOSYSTEM-AND-PRODUCTS.md), [gated roadmap](docs/ROADMAP.md)
[native recovery inputs](docs/NATIVE-RECOVERY-INPUTS.md) and the
[reconciled input inventory](docs/NATIVE-RECOVERY-INVENTORY.md).

The consolidated [audit dispositions](docs/reports/AUDIT-DISPOSITION-2026-09-18.md)
and [next execution plan](docs/workflow/NEXT-BOUNDED-EXECUTION.md) reconcile all
attached audits with the reported candidate. Continue the existing public source
branch; the older private-gated/archive-only starters are superseded. Source
containment, actual host integration and a native-source build remain distinct
milestones. No new APK or readiness score follows from this documentation update.

## Three connected purposes

### Reclaim your health

The health passport is intended to bring health records, documents, personal
reflections and approved measurements into a user-controlled vault. Pocket LUCA
helps the user work with the information they choose to make available:
understand a check-in, reflect on a pattern, prepare questions and choose a
manageable next step.

The long-term experience connects that personal context to trusted practitioners
through specific, understandable sharing permissions. A practitioner should
receive the selected information needed for the agreed purpose, rather than
unrestricted access to the entire vault.

Pocket LUCA is a local assistant, not a clinician. Its answers should identify
the information they used and say when it is missing or insufficient. The model
must not invent records, imply access it does not have or turn a wellness
reflection into a diagnosis.

### Reclaim your wealth

The economic passport is an optional component for receiving, holding and
spending value under the user's control.

| Adapter | Intended role | Current status |
| --- | --- | --- |
| Breez SDK — Spark | Bitcoin, Spark and Lightning payment capabilities | **Planned.** Compatibility and recovery require validation; no integration exists in 604 |
| Tether WDK | A self-custodial stablecoin wallet on an explicitly selected chain and account model | **Planned.** Token, network and fee arrangements remain to be decided |
| GPS | Governed contribution evidence, eligibility and allocation rules, followed by accountable settlement | **Design only.** No verified reward engine in 604 |

Earning requires a named funder, a finite budget, eligibility rules,
contribution verification, a policy version and a settlement process. A recorded
contribution, an approved allocation and a settled wallet payment are different
states. Participation is optional. The design must not require selling health
information, punish illness or imply guaranteed earnings.

See [Economic passport](docs/ECONOMIC-PASSPORT.md).

### Reclaim your sovereignty

The sovereignty component helps users understand practical choices about their
digital and physical lives: protecting records, recovering access, using
appropriate tools, finding local businesses and contributing to communities they
value.

BTC Map is a **proposed** read-only discovery adapter for places reported to
accept Bitcoin. "Accepts Bitcoin", "runs a verified sovereign service", "belongs
to a community" and "is a qualified trusted practitioner" are different claims,
each needing its own source, criteria, date and status.

Here, **GPS (Global Prosperous Split) is Solaris's policy/allocation/settlement/receipt protocol** for
evidenced contributions and accountable value distribution. It is **not** phone
geolocation. Any location feature needs its own purpose and permission.

See [Sovereignty and GPS](docs/SOVEREIGNTY-AND-GPS.md) and the proposed
[GPS/RGB contract roadmap](docs/GPS-RGB-CONTRACT-ROADMAP.md). GPS starts with
minimal contribution evidence and deterministic shadow allocations. Optional
RGB contracts can enforce selected asset rules; they do not enforce medical
truth, health-data consent or the entire GPS constitution. No policy rate or
financial program is activated by this README.

## One product within Solaris

| Product | Role and boundary |
| --- | --- |
| **Solaris Android / Pocket LUCA** (this repository) | User-held vault, local assistance and the planned consent, passport and participation experiences |
| **Solaris web** | Public discovery and coordination, including governed practitioner-facing functions; it is not intended to become a Solaris-operated store of clinical plaintext. **Separate repository — not modified from here.** |
| **Practitioner Clinic OS** | The planned practitioner-controlled endpoint for records explicitly shared by a user |
| **Clinic in a Box / sovereign infrastructure** | A future deployment and support offering |

These products should communicate through documented, versioned contracts.
Sharing the Solaris name does not give one product automatic access to another
product's data. See [Architecture](docs/ARCHITECTURE.md) and
[`contracts/README.md`](contracts/README.md).

## What 604 actually establishes

| Area | Evidence-backed position |
| --- | --- |
| Guided LUCA interactions | Recognized common intents use guided application logic and selected fields. The 604 audit found routing/output-boundary defects; later source repairs are reported, with independent review and executable integration still pending. |
| On-device generated chat | Available through the existing local-model path (Qwen3-0.6B Q4), with real quality and latency limitations. Phone response times for 604 have **not** been measured. |
| Chat and return behaviour | UI and guard repairs improve the existing flow. Backgrounding still locks the vault and cancels unfinished generation; unsent drafts are cleared. Continuous background inference is not established. |
| Vault and native components | Existing components were preserved unchanged in the candidate. Preservation is not an audit of their security or recovery behaviour. |
| Complete source build | Original native application/build sources remain **incomplete**. Recovered representations and bytecode evidence are not an authored, reproducible Gradle project. |
| P2P, own-device sync, practitioner trust | **Roadmap.** No verified end-to-end implementation. |
| Wallets, funded rewards, sovereignty discovery | **Roadmap.** No real-money capability is implied. |
| Production / patient release readiness | **Not established.** Audit, native reconstruction, operational and device gates remain open. |

Package identity: `org.solarishealth.edge.recovery`. The baseline APK's recorded
SHA-256 is:

```text
0e9a66da00cbe128851d981a9f9a3d9a1dbfe653f7a4ced93d638bc4d7d31827
```

Use [Feature status](docs/FEATURE-STATUS.md) for claim-by-claim evidence and
[Artifacts](docs/ARTIFACTS.md) for the exact reference files, hashes and
retrieval instructions. Those results are attributed to the dated 604 handoff
until they are rerun; this repository has not rerun them.

## Data, consent and keys

Local first means the core should remain useful with user-held data and explicit
control over external connections. It does not mean every optional feature works
offline or has no infrastructure dependencies.

The target sharing contract identifies the recipient, records or fields, purpose
and applicable duration. Revocation can stop future authorized access; it cannot
guarantee deletion of information a recipient has already copied.

Health-vault recovery, identity credentials, wallet recovery and the Android
signing identity are **distinct**. An identity public key is not a wallet seed.
No wallet secret belongs in an AI prompt, health record, repository or ordinary
diagnostic log. Pocket LUCA must not gain spending authority simply because it
can help explain a transaction.

Read [Data and consent](docs/DATA-AND-CONSENT.md),
[Architecture](docs/ARCHITECTURE.md) and [Security](docs/SECURITY.md) before
changing these boundaries.

## Start here as a developer

1. Read [Build and test](docs/BUILD-AND-TEST.md), then
   [`handoff/SOURCE-MAP.md`](handoff/SOURCE-MAP.md),
   [`handoff/PRODUCTION-GATES.md`](handoff/PRODUCTION-GATES.md) and the
   [604 build report](Solaris-Android-R4/docs/Solaris-604-Build-Report.md).
2. Run this repository's source-only checks:

   ```sh
   python3 tools/repo-check.py
   ```

   The published checker has known gaps: missing required dependencies and new
   source classifications can still leave it green. Candidate repairs are
   reported but not yet independently verified. See the dated engineering
   report; a source-check pass is not an Android build or release approval.
3. Keep a complete, immutable 604 reference **outside** this working tree and run
   the original full-manifest checks there. This repository's README and docs
   intentionally differ from the handoff; it is not byte-identical to it.
4. Preserve the imported source-root paths (`Solaris-Android-R4/`, `R3/`, `R2/`,
   `Solaris-Android-Reconstruction/`, `handoff/`, `solaris-603-native-probe/`)
   until a separately reviewed change proves moving them breaks no tooling or
   evidence link.
5. Open a bounded task branch, establish the baseline, make the change, run
   targeted checks and obtain independent review. Record untested boundaries
   explicitly. See [Contributing](docs/CONTRIBUTING.md).

Source and documentation belong in normal Git history. Large APKs, model weights,
offline build-input archives and restricted evidence follow
[Artifacts](docs/ARTIFACTS.md). No patient data, production credentials, signing
keys or wallet material may be committed.

Do not infer a working `gradlew`, a full native build, a passing production audit
or a launched Codespace from this repository's presence. Linting recovered and
decompiled evidence as though it were maintained application source obscures the
real work.

## Project documentation

- [Engineering progress report](docs/reports/Solaris-Engineering-Progress-and-Ecosystem-Report-2026-09-18.md) — verified source, reported local work and unresolved gates.
- [Products and boundaries](docs/ECOSYSTEM-AND-PRODUCTS.md) — Android, web, Clinic OS and economic modules.
- [GPS/RGB contract roadmap](docs/GPS-RGB-CONTRACT-ROADMAP.md) — policies, deterministic allocation, authority and optional asset contracts.
- [P2P/wallet research](docs/research/P2P-WALLET-EVIDENCE-2026-09-18.md) and [RGB research](docs/research/RGB-GPS-EVIDENCE-2026-09-18.md) — dated primary-source evidence.

- [Product vision](docs/PRODUCT-VISION.md) — the Android experience and its place in Solaris.
- [Feature status](docs/FEATURE-STATUS.md) — working / tested-in-isolation / experimental / planned / blocked, with evidence paths.
- [Architecture](docs/ARCHITECTURE.md) — runtime, storage and authority boundaries.
- [Data and consent](docs/DATA-AND-CONSENT.md) — selection, recipients, purpose, duration, revocation limits.
- [Economic passport](docs/ECONOMIC-PASSPORT.md) — wallet boundaries, funded incentives, settlement.
- [Sovereignty and GPS](docs/SOVEREIGNTY-AND-GPS.md) — contribution rules, discovery, evidence standards.
- [Build and test](docs/BUILD-AND-TEST.md) — what runs here, what is blocked and why.
- [Artifacts](docs/ARTIFACTS.md) — the Git/artifact split and restoration rules.
- [Roadmap](docs/ROADMAP.md) — staged work with acceptance evidence.
- [Contributing](docs/CONTRIBUTING.md) — branch workflow, independent review, handoffs.
- [Security](docs/SECURITY.md) — reporting route, key/data handling, known limits.
- [Third-party notices](docs/THIRD-PARTY-NOTICES.md) — dependency and tool provenance, unresolved items.
- [Decisions](docs/decisions/) — ADR-0001 repository split, ADR-0002 source and artifacts, ADR-0003 optional adapters.
- [Provenance](docs/provenance/) — import manifest, frozen transport pack, source map.
- [Workflow](docs/workflow/STATUS.md) — current task, writer, reviewer, findings, next action.

The shared agent instructions are in [`AGENTS.md`](AGENTS.md); Claude Code's
[`CLAUDE.md`](CLAUDE.md) imports them. One writer owns a changed path at a time;
another agent reviews the result.

## Adapter references

These links describe external capabilities, **not** completed Solaris
integrations: [Breez SDK — Spark](https://sdk-doc-spark.breez.technology/),
[WDK React Native quickstart](https://docs.wdk.tether.io/start-building/react-native-quickstart/),
[BTC Map API overview](https://gitea.btcmap.org/teambtcmap/btcmap-general/wiki/API-Overview)
and [OpenStreetMap attribution](https://www.openstreetmap.org/copyright).

Review actual dependency versions, licenses and service terms before integrating
or redistributing components. Existing third-party notices must be preserved. A
repository-level license must reflect an actual ownership and licensing review;
none is implied here.

> **Public source development — 2026-09-18 revision.** The owner now authorizes
> development and reviewed publication in this existing public repository. This
> supersedes earlier private-repository assumptions in the setup/import documents.
> The health vault, patient records and credentials remain private; public source
> does not authorize publishing them or signing/wallet keys. Review outgoing
> changes and newly reachable history for specific restricted material, preserving
> third-party notices and the [licensing inventory](docs/THIRD-PARTY-NOTICES.md).
> Continue unaffected authored work while resolving concrete findings. No new
> license grant or production-readiness claim is implied by public visibility.
> Historical evidence remains unchanged; comprehensive security and production
> readiness are not established.
