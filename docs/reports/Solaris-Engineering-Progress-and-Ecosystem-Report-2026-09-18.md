# Solaris engineering progress and ecosystem report

**Assessment date: 18 September 2026. Scope: Android recovery, accessible source/CI, reported unpublished work, and ecosystem engineering direction.**

**Public-repository revision:** The owner has now explicitly authorized continuing in the existing public repository. This supersedes the earlier private-visibility and mandatory-private-backup requirements. The dated inspection and technical findings below are unchanged; this instruction update is not a new source scan, build or CI run.

## Consolidated audit revision

This revision also incorporates the attached 604 audit/evidence and next-build proposal, foundation handoff, and the original 18 September report/prompt. Their original bytes are retained in the handoff, with hashes and archive checks in `INPUT-RECONCILIATION.json`. The attached engineering files were the older private-gated revision; they do not supersede the user's later public authorization or require restarting the source import.

Read the [finding-by-finding disposition](AUDIT-DISPOSITION-2026-09-18.md) and [next bounded execution plan](../workflow/NEXT-BOUNDED-EXECUTION.md). They preserve the complete F01–F12 findings, AND-IMP-01, AND-CI-01, the foundation checker gaps and the reported A605 status. The next deliverable is a reviewed public source/CI checkpoint, followed by verified host containment/integration and native restoration in separately owned workstreams. No fresh source scan, app test, phone benchmark or live repository inspection was performed for this reconciliation.

The attachment verification established 103 manifest-listed audit members, seven foundation checksum files and 59 original engineering-handoff checksum files. The original 287 case executions and 1,675 packaging assertions remain historical results with their original scopes, not new passes. Claude's 13/224/22 results remain author-reported.

## Executive assessment

Solaris is moving toward a sounder engineering foundation, but there is **no independently verified new Android build** from the latest Claude session. The latest reported work improves source classification, CI failure handling, routing and answer containment. It remains local to Claude's workspace, has not completed independent review, and has not been integrated into executable host bytecode or a native Android build.

The practical next milestone is a **preserved, independently reviewed public source checkpoint with working CI**, followed by an executable bounded chat repair and restoration of the native build. A broader feature expansion would currently increase the amount of unverified behavior.

The product direction is coherent: the Android app holds the patient's health passport and local Pocket LUCA; the web helps people discover practitioners; Clinic OS receives selected records under practitioner control; optional economic-passport adapters handle value; GPS determines contribution policy and allocation. RGB is a possible asset-contract adapter within that economic layer. It does not run the whole health system or make clinical claims true.

Production/patient-release decision: **NO-GO remains appropriate**. This is not a new numerical completion score. The previous 45/100 was a provisional planning rubric, not a delivery percentage; local assertion counts do not justify increasing it.

## 1. What is verified, reported and still unavailable

GitHub was inspected read-only at **2026-09-18 00:42 UTC**. The exact repository is [TheMajicCode/Solaris-andriod](https://github.com/TheMajicCode/Solaris-andriod); the spelling is intentional here.

| Item | Evidence status | Finding |
| --- | --- | --- |
| Repository visibility | Verified dated snapshot; authorization updated | Public at inspection. The owner now authorizes public continuation; visibility is no longer a blocker. |
| Default main | Verified | `5cc354c852565479020d4a6c99109fff992c6de4`; its small extensionless README incorrectly calls the workspace private. |
| [PR #1](https://github.com/TheMajicCode/Solaris-andriod/pull/1) | Verified | Open, draft, unmerged; head `edd43bd7404730480f3c5bd94720a3aef068fdb9`. The full source projection and substantial README are on this branch. |
| Latest Claude checkpoint | Author-reported; unavailable here | `9183802`, reportedly seven commits beyond origin. GitHub returned “No commit found” for that SHA. Full final SHA, complete diff and executable tests must be obtained from the originating workspace. |
| Candidate checks | Author-reported | 13 repository checks, 224 candidate assertions, 22 checker controls. They were not rerun against the inaccessible candidate in this review. |
| Independent candidate review | Not obtained | Claude says the assigned reviewer stopped at a session limit. Self-review is useful but does not close this gate. |
| Remote CI | Verified for old head only | Two successful runs exist on `edd43bd`. No later reported local commit is covered. The PR job used synthetic merge `f3d10ade43504292565f5084f81e867de6dfdfe2`. |
| Native build | No new output evidenced | Claude reports only an inventory/build graph. No Gradle/native source build or integrated A605 APK was supplied. |
| Installed app/phone behavior | Not inspected this cycle | No new APK, phone trace, rendered candidate UI, latency benchmark or device recovery test was available. |

A local Git commit preserves history inside that workspace. It is not evidence of a durable off-workspace backup. Preserve the seven commits before relying on that session continuing.

## 2. Fresh targeted scan and reproductions

This is a **targeted incremental engineering review**, not a comprehensive penetration test, dependency/license audit or Android release certification. Retrieved UTF-8 source files were checked against Git blob identities. The evidence kit contains the read-only snapshot, fetch manifest and synthetic probes/results.

| Finding | Fresh evidence | Quality implication / next action |
| --- | --- | --- |
| Required CI can be green without required work | The actual published checker treats missing PyYAML as SKIPPED; a focused synthetic run of that checker still returns PASS/exit 0. [Old job log](https://github.com/TheMajicCode/Solaris-andriod/actions/runs/35281224537/job/105403371842) agrees. | Claude's fail-closed rewrite is directionally correct; inspect and independently rerun it before claiming closure. |
| New maintained code can evade failing syntax checks | A deliberately broken `src/invalid.js` outside the old maintained-source prefixes receives evidence INFO, while the authored check passes in the focused checker probe. | Every maintained source/test path needs explicit classification and failing checks. The candidate's proposed classification manifest must itself resist omission and reclassification. |
| Node syntax-check blind spot reproduced | Under local **Node v24.19.0**, three deliberately malformed ESM snippets returned exit 0 as untyped `.js`; the same snippets returned exit 1 as `.mjs` and `.cjs`. | Independently supports the symptom of AND-CI-01. It does not establish behavior for every Node release, the remote Node 22 job, or prove Claude's fix. Test files in their intended module mode; rejecting valid ESM as CommonJS is not success. |
| Spanish route misses reproduced | Running the exact fetched `fast-guided.js` with valid synthetic tasks returns `welcome` for `Hola` and `Qué puedes hacer?`, but `null` for `¡Hola!` and `¿Qué puedes hacer?`. | F04 remains in the accessible baseline. Candidate normalization needs full admission-path testing. |
| Mixed-request shortcut reproduced | The helper returns `checkin-select` for both “My check-in mentioned I read about chest pain” and a synthetic severe-symptom/check-in request. | F05 remains in the accessible baseline. The new risk screen cannot be accepted merely because a finite keyword set passes. An unmatched clinical request must not become unrestricted generation. |
| Evidence/documentation drift | Main README says private; About text describes sharing/sync without a roadmap qualifier; PR README does not clearly distinguish prior source-pack review from pending exact-commit repository review. | Update truthful status and product claims on the actual reviewed branch; verify the target repository and outgoing publishable content before the authorized public push. |

The nine fresh helper executions **did not** run the full coordinator, native engine, output parser, persistence or Android UI. The earlier 604 audit demonstrated a service-level mixed-request outcome under synthetic seams; that historical result remains separately attributed. No new model-generated hallucination was measured here.

Fresh helper SHA-256: `100a7ce8045aa1ec64d554715eb0980d7379afb2c78cc6441ae424900a5c0369`. Node probe and helper results are under the handoff's `evidence/fresh-checks/` directory. Source/checker inspection does not establish vault security or model quality.

## 3. Assessment of Claude's latest work

The strongest reported improvements are the separate frozen/candidate integrity models, exact expected-defect registration, required-check negative controls, measured baseline/candidate comparisons and the explicit refusal to call source-only changes a shipped repair. Those are the right engineering habits.

Three points still need close review:

1. **Unmatched request behavior is the real boundary.** Claude found Spanish pain phrases and “meds” falling through to `null`, then extended a keyword/co-occurrence rule. That catches those examples; it does not establish a complete clinical classifier. Inspect what every unknown request can reach. Keep the supported surface closed to unverified personal/medical prose rather than depending on an ever-growing symptom dictionary.
2. **Blanket rejection can look deceptively safe.** All seven original parser strings reportedly fail admission. A reviewer must also verify positive controls: harmless zero-source greetings, accurate selected-source facts, missing-value handling and permitted requests still work. Otherwise “all dangerous strings rejected” may merely mean the route rejects everything. Validate source revision, approved fields and authority at display/persistence boundaries, not only in a detached helper.
3. **Tests must cover the integration actually delivered.** The `candidate/` modules may be good components, but no host integration was verified. Test the final admission → route → answer boundary → presentation → authorized commit path once inputs exist. Raw rejected content must never appear transiently or enter saved history, receipts or later context.

The consolidated [matrix](AUDIT-DISPOSITION-2026-09-18.md) also retains cold-model loading limits, the 16 MiB recovery-envelope boundary, restricted conversational memory, finite HTML patch capacity and the shared development signer. F09's old visibility condition is superseded; foundation review/CI acceptance is not.

The current finding dispositions should remain: F03 **reported source-level containment, awaiting independent review/integration**; F04/F05 **reported source changes, awaiting independent review/integration**; F01 native source restoration **open**; F06 recovery/durability validation **open**, with its specific race still a hypothesis. Qualified EN/ES escalation-copy review, development-signing custody, device tests and dependency/license review remain release gates.

**How the Android experience looks:** the previously supplied Sanctuary screens provide a coherent visual direction to retain. This cycle has no newly rendered candidate or device capture, so it cannot confirm a visual improvement. The next UI acceptance should demonstrate readable contrast over the forest/vault treatment, large text and TalkBack, clear selected-source labels, honest guided/generated states, responsive cancellation and intelligible return-after-background behavior. A prettier screen does not resolve a missing answer or an unsafe route. Measure time to useful feedback and final answer separately; no speedup is claimed from source routing alone.

## 4. The product line and how it fits together

These are product responsibilities and target boundaries, not claims that all products are built.

| Product/component | User value | Current maturity and next proof |
| --- | --- | --- |
| **Solaris Android / Health Passport** | Own a recoverable vault; unify selected records/documents; choose what a practitioner receives | Recovered 604 prototype/source projection. Prove native build, recovery, update compatibility and reliable bounded chat. |
| **Pocket LUCA** | Explain selected context, guide reflection and help prepare a next step | A component of Android, with guided logic and a small local model. General intelligence, clinical competence and fast responses are not established by a greeting. |
| **Solaris web / marketplace** | Discover practitioners, services and public information; begin a verified connection | Existing separate web codebase. Discovery-only exclusion of clinical data is the accepted direction, not verified deployed behavior in this review. |
| **Practitioner Clinic OS** | A clinic-controlled private care inbox and scoped staff workspace | Planned software product, not a new general-purpose operating system. First proof: selected synthetic record, acknowledgement/reply, role restrictions and clean restore. |
| **Clinic in a Box** | Supported hardware/software/recovery package for clinics | Later packaging of a proven Clinic OS and operating model; hardware procurement does not solve software recovery. |
| **Economic Passport** | View contributions, allocations, payment endpoints, balances and receipts | Planned optional module. Wallet, health-vault and identity recovery remain distinct. Start with one explicitly selected rail. |
| **GPS — Global Prosperous Split** | Recognize evidenced contribution and route a funded, governed share of eligible value | Working-draft policy system; shadow simulation comes before funded settlement. No guaranteed earning or automatic reward for a better health score. |
| **Sovereignty discovery / Value Atlas** | Find relevant businesses/communities and understand contribution history | Planned optional views. Bitcoin acceptance, professional qualification and verified infrastructure contribution require separate evidence. |

Target flow: public discovery → verified practitioner contact → user-approved selected-record transfer → clinic-controlled inbox → response to the patient's vault. Any economic event is separately authorized and minimally described. There is no automatic health-data route into the public directory, wallet metadata or GPS receipts. Revocation limits future access; it cannot erase a recipient's existing plaintext copy.

The first useful ecosystem demonstration should be one synthetic patient-to-clinic exchange with independent restore on both ends, followed by a shadow contribution receipt. A complete multi-clinic marketplace, general-purpose agent and multi-rail wallet are not prerequisites for that proof.

## 5. GPS policies and RGB: the realistic architecture

GPS already has a substantial working-draft policy suite. Preserve its core intent: ten contribution domains, one root `ValueEpisode`, bounded economic basis, deterministic allocations, private identity continuity, human authority and accountable receipts. The domains are not ten automatically fixed one-percent wallets.

Do not flatten historical profiles into one advertised split. Existing documents distinguish a showcase profile with coordination **inside** the GPS envelope from a consultation profile with **86% clinic + 4% earned coordination + 10% GPS**, with referrals excluded. The suite's standard envelope is at most 10% of explicitly eligible value; profile activation and fee/basis treatment still need agreement. These are historical/draft examples, not rates activated by this report.

The document reconciliation also found a worked example whose displayed rows total **9% while its text says 10%**, plus a mismatch between broad voluntary cascade language and detailed routing limits. Preserve those original documents as evidence, record the discrepancies, and make executable policy vectors pass conservation/cap/rounding checks before accepting any profile. Do not copy illustrative arithmetic into production.

Separate these layers:

- **Governance:** versioned policy, accepted profile, eligible basis, funding, attestors, disputes and limits.
- **Evidence and authority:** signed claims, issuer trust, consent/capabilities and fresh action approval. A signature does not prove the care or contribution happened.
- **Deterministic GPS resolver:** fixed-point/integer calculations over frozen inputs; no AI-invented rates; no network or payment effects inside replicated reducers.
- **Private ledger/outbox:** one stable episode/output identity, reservations, pending entitlements, reconciliation and append-only corrections. An uncertain transfer is investigated before retrying.
- **Settlement adapter:** selected asset/network/rail, isolated keys, fees, finality and recovery.
- **Optional RGB schema/contract:** only the asset transitions demonstrably enforced by the chosen implementation. A policy hash in metadata references policy; it does not execute it.

The new [GPS/RGB contract roadmap](../GPS-RGB-CONTRACT-ROADMAP.md) provides concrete schema responsibilities and acceptance tests. It is a proposed engineering contract, not ratification of the older policy suite.

## 6. Current technology signals and their engineering implications

Primary sources were checked on 18 September 2026. Exact versions below are research observations, not approved dependencies.

| Signal | Realistic use for Solaris |
| --- | --- |
| [Pear now documents React Native/Bare mobile embedding](https://docs.pears.com/bare/how-to/run-on-native/embed-bare-in-react-native/) | The mobile direction is viable to investigate; Pear is not accurately described as desktop-only. Restore the actual Solaris native graph before upgrading its existing Bare/QVAC dependencies. |
| [Autobase supports replicated deterministic views](https://docs.pears.com/p2p/reference/building-blocks/autobase/) | Useful for selected state projections after conflict rules exist. Replayable projection code must not send payments or perform clinical actions. |
| [Current Buzz architecture is relay-centric](https://github.com/block/buzz/blob/main/ARCHITECTURE.md) | Learn scoped agent identity and auditable events. It does not prove a ready P2P clinical platform. The relationship to the inaccessible `buzz.xyz` site was not independently established here. |
| [WDK's mobile stack has explicit native requirements](https://docs.wdk.tether.io/start-building/react-native-quickstart/) | Run a separate compatibility spike. Do not turn a chat repair into an unreviewed React Native/Bare/Expo upgrade. |
| [Breez Spark has React Native support](https://sdk-doc-spark.breez.technology/guide/install_react_native.html) | Plausible Bitcoin adapter; select one owner of the wallet state and test recovery. [Spark's trust model](https://docs.spark.money/learn/trust-model) includes external assumptions; non-custodial does not mean dependency-free. |
| [WDK now lists community RGB modules](https://docs.wdk.tether.io/sdk/community-modules/wdk-wallet-rgb/) and a separate [RGB-Lightning module](https://docs.wdk.tether.io/sdk/community-modules/wdk-rgb-lightning/) | A relevant emerging path, not a turnkey stablecoin choice. Inspected on-chain native artifacts do not list Android; the separate RGB-Lightning module does. Both require version-specific testing and separate state/recovery. |
| [RGB-Tools' Lightning implementation still warns early alpha](https://github.com/RGB-Tools/rgb-lightning-node) | Do not generalize broad RGB mainnet marketing into Android readiness or assume RGB 0.11.1 and RGB-WG 0.12 are compatible. |
| [17 September RGB/QVAC/Tether hackathon announcement](https://rgb.info/rgb-tether-hackathon-agentic-dollars/) | Strong thematic fit for a synthetic research demonstration. It is a collaboration signal, not a patient-release or financial-release gate waiver. |
| [BTC Map's verification workflow](https://gitea.btcmap.org/teambtcmap/btcmap-general/wiki/Verifying-Existing-Merchants) | Use attributed public merchant discovery and freshness dates. It does not certify sovereignty, professional licensing or GPS contribution eligibility. |

Detailed citations and compatibility limits are in [P2P/wallet research](../research/P2P-WALLET-EVIDENCE-2026-09-18.md) and [RGB research](../research/RGB-GPS-EVIDENCE-2026-09-18.md).

## 7. Phases and measurable exits

| Phase | Deliverable | Exit gate |
| --- | --- | --- |
| **0 — Preserve and review** | Preserve the local checkpoint; reconcile full SHA/diff and documentation; finish the public source PR #1 | Independent review of actual final candidate and local checks before the public push; real remote CI afterward; preserved authoritative source history |
| **1 — Build and trust the local product** | Executable bounded chat repair; real native source build; reliable vault/recovery/update | Reproducible unsigned build, host tests, storage/identity compatibility, authorized device quality/latency tests and release-signing decision |
| **2 — Connect with consent** | Versioned shared identity/recipient/consent contracts; synthetic owned-device transfer | Cross-runtime authority/expiry/replay/wrong-recipient tests, explicit copy semantics and patient restore |
| **3 — Useful clinic software** | One clinic private inbox, first patient-to-clinic exchange/reply, roles and audit trail | No clinical data at discovery; patient and clinic restore; tested staff revocation, update/rollback, outage behavior and operational owner |
| **4 — Evidence and economic passport** | GPS shadow episodes/receipts and one isolated test-fund wallet adapter | Ratified simulator profile, deterministic vectors, budget/conservation tests, wallet recovery, no clinical public linkage |
| **5a — Optional RGB lab** | Synthetic service-credit experiment on an explicitly supported test environment | Pinned schema/implementation, test issuer, compatible validation, clean restore and interoperability; no real-money funding required |
| **5b — Optional funded pilot** | One capped, separately approved program | Named funder/operator, attestor/dispute policy, rail-specific recovery/reconciliation, independent security review and relevant operating approvals |
| **6 — Scale the proven system** | More clinics, supported hardware, optional wearables/sovereignty modules | Repeatable deployment/support, recovery drills, measurable usefulness and sustainable costs |

Research and schemas can proceed in parallel. Native/storage gates cannot be bypassed by a larger roadmap. No calendar completion dates are asserted because missing-input and device-testing lead times remain unknown.

## 8. Immediate execution handoff

1. **Preserve the actual current checkpoint first.** Resolve the full SHA behind the reported `9183802`, dirty-state inventory and outgoing commit range in Claude's original workspace. Create a verified local Git bundle/patch and account for uncommitted or untracked work separately. Do not reset or recreate from `edd43bd`. Keep exports outside tracked source until their contents are cleared. Private backup is optional for this source-push sequence; the reviewed public branch can durably preserve cleared source. Describe local-only preservation honestly.
2. **Continue in the existing public repository.** The latest user instruction supersedes prior private-visibility requirements. Update stale operative clauses and close the old hook/visibility conflict once. Review the complete outgoing range and newly reachable history for concrete sensitive or restricted material; exclude affected new additions while continuing publishable source/docs/tests. Public Git, Actions artifacts and Releases are not private storage. Do not silently rewrite history or create a replacement repository.
3. **Obtain independent review of the actual current head.** Self-review and this review of the old published source do not substitute for it. Re-run the candidate and checker tests, including intended ESM/CommonJS modes and positive answer controls.
4. **Restore the minimal executable inputs.** This review recovered the full documented N3/N4 hashes and restoration paths from tracked source; see [Native recovery inputs](../NATIVE-RECOVERY-INPUTS.md). The HBC/compiler pair can support applicable compilation/integration work, but the existing full bundle builder explicitly requires the exact 603 APK as well. Request only missing inputs and verify their bytes; no binary was reacquired in this review. This enables a possible HBC candidate, not a complete native source build.
5. **Apply the prepared documentation changes by context.** The patch is based on `edd43bd`; Claude's newer local docs may differ. Preserve those changes, register new maintained docs in its classification model and obtain final review. Update the public About description after independent review and final wording are verified; no visibility change is needed. Do not merge or release automatically.

The previous visibility conflict is superseded by explicit public-source authorization. No further visibility confirmation or refusal-only commits are needed. Exact-candidate independent review and required local checks still precede the public push; remote CI must run after publication of that reviewed candidate. A specific restricted-content finding should block only the affected publication, not unrelated safe authored work.

## 9. Deliverables and limits of this update

This handoff includes a proposed README/roadmap update, complete audit disposition matrix, bounded execution plan, unchanged attached audit/proposal/reference files, product-boundary and GPS/RGB documents, dated primary-source research, evidence and a consolidated Claude continuation prompt. **No repository write, visibility change, merge, APK build/sign/install, key change or deployment was performed.** The latest user instruction authorizes reviewed public publication of the prepared documentation and bounded source work. This handoff revision itself performs no remote write; Claude must still complete candidate review and record actual push/CI outcomes.

Original 604 audit/proposal remain the baseline assessment, not overwritten. The existing July GPS suite and September identity/architecture plans were read and reconciled; their draft status and unresolved profiles are retained. The full 604 backup remains the source of build inputs. Upstream SDK support, announcements and source-level tests are not substitutes for Solaris execution evidence.
