> **Imported verbatim** from the Sprint-02 handoff (`External-Audit-Disposition.md`, SHA-256 `a3ad023ecfb374b3b2a3217a05dcb76a332df87a7350b27a22fd8d6f4ca4c973`, handoff archive verified against its SHA256SUMS.txt on 2026-09-24). Not authored in this repository. Current attribution and status: [External audit status](../EXTERNAL-AUDIT-STATUS.md).

---

# External mobile audit: disposition and safe engineering actions

Prepared 2026-09-18. This is a review of the user's pasted external assessment and current official documentation, not a rerun of its tests or a security certification. No audited checkout, full compiler diagnostics, lockfile, build artifact, or audit commit was supplied to this reviewer. All reported test results and file claims remain externally reported until tied to an exact tree.

## Establish which product was audited

The report describes an Expo/TypeScript single-screen `App.tsx` application with `src/layer3-clinic/encrypt.ts`, Nostr identity, SQLite CRUD and six tests. The recovered Solaris 603/604 host lane has an existing multi-screen UI, vault/recovery implementation, local-model path and a separately established CI workflow. These descriptions are not interchangeable. Treat the audit as a potentially separate scaffold or branch until repository, full commit, package ID, version metadata and source paths establish otherwise. Do not restart or replace the established Android app with this scaffold, and do not apply its “no CI/no AI/no backup” claims to every Solaris product.

Keep external finding numbers as `EXT-01` through `EXT-30`; these do not rename or imply knowledge of Claude's separate `AUD-01`–`AUD-10` and `NB1`–`NB5` review records. Retrieve those actual records independently when resuming.

## Assessment of headline claims

| External claim | Disposition | Required next evidence |
|---|---|---|
| Six tests pass | Useful, narrow, externally reported evidence | Exact test commands, runtime, lockfile and commit; test source; pass/fail output |
| Good coverage for core logic | Not established by test count | Invariants, successful and adversarial cases, integration boundaries and meaningful coverage or mutation evidence |
| Three layers are correct; hard part is done | Unsupported architectural conclusion | Identity lifecycle, key custody, consent enforcement, recipient authentication, vault recovery and delivery/replay/conflict contracts |
| AES round trip proves working clinic encryption | Only a basic codec path if reproduced | Wrong-key, tamper, nonce, recipient binding, missing/revoked consent and retry behavior, including the actual Android runtime |
| Approximately 12% production-ready | No defined denominator or scoring method; do not reuse | Release gates marked evidenced, failed, blocked or not applicable, with scope and owners |
| 1–2 hours / 2–3 weeks / 6–9 months | Uncalibrated estimates, not commitments | Complete dependency inventory, measured bounded slice, available engineering/review capacity and actual critical path |
| TestFlight milestone | Separate iOS scope | Android plan should use Android internal-testing milestones; no implicit iOS deliverable |

## Disposition of all 30 reported gaps

“Verify” means inspect the audited branch first; it does not dismiss the concern. The classifications are engineering priorities for this project, not universal certification requirements.

| ID | Reported gap | Action and scope |
|---|---|---|
| EXT-01 | Nine TypeScript errors | Reproduce on the identified scaffold with its locked compiler. Repair types without suppressing the contract; see below. |
| EXT-02 | No ESLint / Prettier | Add scoped lint/format checks to maintained source if absent. Do not reformat frozen recovery evidence or vendor trees. Tool choice is not itself a release requirement. |
| EXT-03 | No navigation | Verify scaffold-only claim. Reuse the established Android navigation model; no router rewrite without a reason. |
| EXT-04 | No error boundaries | Check UI failure containment and async/native error paths separately; a React boundary alone does not cover every failure. |
| EXT-05 | No loading states | Implement real operation states, cancellation and useful errors where missing. Loading labels must derive from actual state. |
| EXT-06 | No onboarding | Adopt the new welcome/onboarding contract in the correct Android lane; preserve returning-user unlock and existing data. |
| EXT-07 | No biometric auth | Verify real vault access enforcement. Device credentials can be a valid fallback; biometrics are not the only acceptable unlock method. |
| EXT-08 | No production signing | Separate existing candidate signer compatibility from production key custody. Do not generate or replace the established key to make a demo build pass. |
| EXT-09 | No privacy/consent screen | Add accurate explanations and enforce consent in code. Determine applicable obligations from actual roles, data flows and launch markets. |
| EXT-10 | No export/backup | Verify the existing vault/recovery lineage first. Prove restore and failure behavior before changing format or claiming recoverability. |
| EXT-11 | No Pocket LUCA | May describe scaffold only. Preserve established local-AI work; document bounded guided responses versus model inference distinctly. |
| EXT-12 | No Nostr relay | Key encoding/generation is not relay communication. Deliver as a separate adapter after a transport and metadata contract. |
| EXT-13 | No P2P exchange | An encrypted payload or outbox is not authenticated delivery. Retain as a capability gate, not a UI checkbox. |
| EXT-14 | No offline sync | Local SQLite is not reconciliation. Define IDs, revisions, tombstones, retries, replay and conflict policy before implementation. |
| EXT-15 | No dark mode | Check actual screens; existing Solaris design is dark. Contrast and readability matter; a second color theme is not automatically mandatory. |
| EXT-16 | No accessibility audit | Test text scaling, contrast, focus, labels, touch targets, screen reader and reduced motion on supported paths. |
| EXT-17 | No crash reporting | Require diagnosability; start with minimized local diagnostics and explicit export. Remote telemetry is a product/privacy decision, not a blanket prerequisite. |
| EXT-18 | Incomplete validation | Validate trust boundaries and persisted data without mutating original records to fit an answer. Cover malformed and adversarial input. |
| EXT-19 | No CI/CD | CI already exists in the recovered repository. Verify scaffold scope; integrate needed checks. Automated deployment is separately gated. |
| EXT-20 | No migration strategy | Essential for data compatibility if schema changes occur. Inventory current formats and rehearse forward/failure behavior with synthetic fixtures. |
| EXT-21 | No OTA | Optional delivery architecture with its own trust/update boundary; not a prerequisite for a safe Android release. |
| EXT-22 | No push notifications | Optional; evaluate local reminders first where suitable. Do not introduce a server dependency merely to satisfy the checklist. |
| EXT-23 | No analytics | Optional. Do not add behavioral/health tracking by default. User-owned diagnostics may meet the immediate engineering need. |
| EXT-24 | No HIPAA measures | Applicability and required safeguards need a scoped legal assessment; HIPAA does not apply to all US health data. See legal note below. |
| EXT-25 | No i18n | Verify current EN/ES strings and locale flow; centralize maintained copy, test actual payloads and avoid partial translations. |
| EXT-26 | Default splash | Apply Solaris assets after identifying native splash ownership. A cinematic welcome is separate from a fast startup/splash screen. |
| EXT-27 | No store metadata | Required for the chosen distribution channel at its release phase, not evidence that core logic is broken. |
| EXT-28 | No rate limiting | Apply bounded work/queue/resource limits to actual local and network entry points; no generic server middleware in an offline-only path. |
| EXT-29 | No retention policy | Define user-controlled deletion, recovery and shared-copy limits. Do not auto-delete health records without a reviewed policy. |
| EXT-30 | No multi-device sync | Deferred product capability requiring reconciliation and consent contracts; single-device operation can still be an honest bounded release. |

## Safe TypeScript and crypto repair instructions

1. First record the audited repository/full SHA, installed TypeScript, runtime, React Native/Expo versions, package manager, lockfile and effective app/test configurations. Run the project's existing test/typecheck commands unchanged and capture all nine diagnostics. A reported compiler failure is not proof that no APK can be emitted by any toolchain, but release checks must not bypass it.
2. Do not attribute the `Uint8Array` issue solely to TypeScript 6.0. TypeScript 5.7 introduced generic typed arrays that preserve their backing-buffer type, and 5.9 documents the relevant `ArrayBufferLike`/`BufferSource` errors and more precise `Uint8Array<ArrayBuffer>` typing. Diagnose the actual locked versions before changing them. [TypeScript 5.7](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-7.html), [TypeScript 5.9](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-9.html).
3. If tests actually use Node APIs, install a compatible, locked `@types/node` development dependency and explicitly include the needed types in the test configuration. TypeScript 6.0 now defaults `types` to an empty list, so package installation alone may not resolve every error. Keep app and test type environments distinct; adding Node types must not disguise unavailable mobile APIs. [TypeScript 6.0](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html), [TSConfig types](https://www.typescriptlang.org/tsconfig/types.html).
4. Do not apply blanket `as BufferSource`, `as unknown as`, `any`, `@ts-ignore` or weakened compiler settings to silence crypto errors. Establish that the input is backed by an ordinary `ArrayBuffer`, or copy the exact intended bytes into an owned ordinary buffer at the boundary. A backing `.buffer` may contain bytes outside a subarray; preserve the view's byte offset and length. Test sliced views, empty and non-ASCII payloads, and permitted/rejected backing-buffer kinds under the pinned types and real runtime.
5. Preserve the existing cryptographic format, algorithm, key sizes and identity. Verify IV generation/uniqueness policy, authentication-tag rejection, wrong keys and AAD binding to the agreed recipient/envelope metadata. AES-GCM accepts an IV and optional authenticated associated data; a successful round trip alone does not establish the surrounding protocol. [W3C Web Cryptography AES-GCM](https://www.w3.org/TR/webcrypto/#aes-gcm).
6. Run typecheck separately from test execution; some TS execution/transpilation tools do not enforce all types. Add regression tests only for actual repaired boundaries, plus a positive control that valid inputs still work. Have an independent reviewer inspect both the fix and a deliberately broken version proving the gate fails.

## Key storage, biometrics and recovery are separate contracts

Expo SecureStore encrypts local key-value entries, but its presence does not demonstrate encryption of an SQLite database, attachments, outbox or exported files. Android uninstall removes its stored data; biometric-enrollment changes can make authentication-protected entries inaccessible. Its backup exclusion and recovery behavior must therefore be tested, with no real key changes or data reset. [Expo SecureStore](https://docs.expo.dev/versions/latest/sdk/securestore/).

Expo SQLite's SQLCipher option is off by default. This does not prove the scaffold stores plaintext: it may encrypt individual fields. Trace actual reads/writes, database/WAL/journal files, attachments and outbox before making either claim. Do not switch the existing app to SQLCipher or another format as an incidental onboarding fix. [Expo SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/).

An unlock prompt is not cryptographic authorization by itself. The access check must guard key use and every protected operation; background, process death, credential fallback, cancellation and enrollment changes need explicit behavior. Android supports device credentials alongside biometrics subject to API compatibility. [Android biometric authentication](https://developer.android.com/identity/sign-in/biometric-auth).

Existing-install update identity must be preserved. A new signing key cannot simply replace the old one while retaining ordinary update compatibility. Any supported signing lineage/rotation must be separately designed and authorized; none is part of this sprint. [Android app signing](https://developer.android.com/studio/publish/app-signing).

## Legal context, not a compliance certification

The audit's “HIPAA required for US health data” statement is too broad. HHS scopes HIPAA obligations to covered entities and business associates; the app's relationships and activities determine applicability. HHS also points health-app developers to other potentially applicable federal regimes. Local-first storage does not itself establish legal compliance, and lack of HIPAA applicability would not establish absence of other obligations. Assess intended markets, responsible entities, provider relationships, data/metadata flows and product claims with qualified counsel before a patient release. [HHS covered entities and business associates](https://www.hhs.gov/hipaa/for-professionals/covered-entities/index.html), [HHS mobile health-app developer resources](https://www.hhs.gov/hipaa/for-professionals/special-topics/health-apps/index.html).

## Handoff instruction

Include this report as an external-audit disposition, not as a substitute for the actual audit source. First map the scaffold to its repository and SHA. Where the source is unavailable, leave the scaffold fixes unverified and continue the authorized recovered-host repairs, review closure and onboarding contract. No finding here authorizes a data migration, signer change, production release, automatic cloud telemetry, or replacement of the existing Android app.
