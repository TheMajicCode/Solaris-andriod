# External mobile audit (EXT-01 – EXT-30): attribution and status

Last updated 2026-09-25 (Sprint-02). This page tracks an **external**
assessment that the owner pasted on 18 September 2026. It keeps that
assessment's thirty gaps under their own IDs, `EXT-01`–`EXT-30`. They are
separate from this repository's F, SP, AUD, NB and NBR findings and do not
rename or close any of them.

| Input | Where it lives | SHA-256 of the handoff copy |
|---|---|---|
| The assessment as received (summary of the pasted text) | [`reports/EXTERNAL-AUDIT-RECEIVED-2026-09-18.md`](reports/EXTERNAL-AUDIT-RECEIVED-2026-09-18.md) | `27e614775825174a697fe089757eb1e824e6c9a9f827781e66e9fcf350b8da78` |
| Engineering disposition of all 30 gaps, with official-documentation references | [`reports/EXTERNAL-AUDIT-DISPOSITION-2026-09-18.md`](reports/EXTERNAL-AUDIT-DISPOSITION-2026-09-18.md) | `a3ad023ecfb374b3b2a3217a05dcb76a332df87a7350b27a22fd8d6f4ca4c973` |
| Structured claims (tests, typecheck paths, stack, score) | Sprint-02 handoff `evidence/EXTERNAL-AUDIT-CLAIMS.json`, not imported | `1a399e283e932c66ae710865fd24c4c18c0bf745917669a195d441623945e66f` |

The two imported reports are byte-for-byte copies of the handoff files, apart
from a provenance header at the top.

## What is not adopted

- **The "about 12% production-ready" score.** It has no defined denominator or
  method. This repository reports gates as evidenced, failed, blocked or not
  applicable, never as a percentage.
- **"Three layers are correct; the hard part is done."** Six tests covering
  three suites cannot establish identity lifecycle, key custody, consent
  enforcement, recipient authentication, vault recovery or delivery.
- **The "1–2 hours / 2–3 weeks / 6–9 months" timelines.** These estimates are
  uncalibrated.
- **The TestFlight milestone.** That is iOS; this repository is the Android
  lane.
- **The recommendation to cast `Uint8Array` as `BufferSource`.** No
  `as BufferSource`, `as unknown as`, `any` or `@ts-ignore` is to be used to
  silence crypto typing, and any repair must preserve the view's
  `byteOffset`/`byteLength`. No such repair was made, because the source is
  absent (see below).

## Attribution search (measured 2026-09-24/25)

The audit names an Expo/TypeScript single-screen `App.tsx` app with
`src/layer3-clinic/encrypt.ts` and three test files (`tests/identity.test.ts`,
`tests/intake-spanish.test.ts`, `tests/clinic-payload.test.ts`). It reports nine
type errors across those four paths, and six passing tests.

| Where searched | Result |
|---|---|
| This repository, all tracked files | 0 `.ts`/`.tsx` files. |
| This session's filesystem, excluding system library, browser and `node_modules` trees and `.d.ts` declarations | 0 `.ts`/`.tsx` files. |
| The five handoff/input archives supplied to this workstream | 0 `.ts`/`.tsx` members. |
| Repositories visible to this session's account (37 listed) | `Solaris-mobile-appV1` (private) was the only name-level match inspected. At HEAD `c9cd5096b45064c17f762a6dd40ec0c77fa8f0ff` (2025-12-07) it has 23 files, including an `App.tsx`, but **none** of the four audited paths. It is not the audited tree. The clone was inspected metadata-only and then removed; nothing from it was copied here. |
| `Solaris-mobile-app-v2` | Checked by the Sprint-02 handoff author, who found no match. **Not re-run here.** |

**Result: the audit remains source-unattributed.** Its repository, commit,
lockfile, compiler version and exact diagnostics were never supplied. So:

- **EXT-01** (nine TypeScript errors) and the crypto-typing repair are
  **UNVERIFIED**. There is nothing to reproduce them against.
- The six reported passing tests stay **externally reported**.
- No scaffold code was imported. The recovered Android lane was not restarted
  as an Expo app.

The next dependency is the audited repository URL and full commit SHA, from
whoever ran the audit.

## Status of each gap in the recovered Android lane

The audit describes a different codebase, so "absent in the scaffold" says
nothing about this repository. The table below records what **this** repository
shows for the same concern, and how strong that evidence is:

- **Measured** — run or counted in this repository.
- **Traced** — read in retained source, not executed.
- **Handoff** — reported by the handoff, not re-run.
- **Not assessed** — nobody has looked yet.

| ID | Reported gap | Recovered-lane status | Evidence |
|---|---|---|---|
| EXT-01 | Nine TypeScript errors | **UNVERIFIED.** Audited source absent. The recovered lane has no TypeScript source; the original host `App.tsx` is missing (F01). | Measured (0 TS files) |
| EXT-02 | No ESLint / Prettier | Scoped syntax, parse and functional gates run in CI for maintained source (`python-syntax`, `javascript-syntax-authored`, `javascript-parse-evidence`, `candidate-regression-tests`, among 15 checks). No style linter or formatter is configured, and frozen evidence is deliberately not reformatted. | Measured |
| EXT-03 | No navigation | Not applicable to this lane. The retained R4 UI routes between `home`, `health`, `luca`, `communications` and `explore`. | Traced |
| EXT-04 | No error boundaries | **Open.** SP2-HOST-01, found this sprint: a lone UTF-16 surrogate in user text makes the host throw `URIError` before any model call or write. How native code handles that throw is not established. | Measured (desktop host) |
| EXT-05 | No loading states | Not assessed this sprint. | — |
| EXT-06 | No onboarding | R4 already has a welcome, locked screen, onboarding and setup. Sprint-02 adds a maintained candidate **preview** under `candidate/onboarding/`. It is not integrated into the HBC or APK; see [`HOST-REPRODUCTION-EVIDENCE.md`](HOST-REPRODUCTION-EVIDENCE.md). | Traced; preview measured in a browser |
| EXT-07 | No biometric auth | R4 has a lock and unlock path. Device-level enforcement is not verified (no device authorization); related native gaps are F06 and F07. | Traced |
| EXT-08 | No production signing | F02 is open. The development signer is preserved; no signer or key change is authorized. | Handoff (604 audit) |
| EXT-09 | No privacy/consent screen | Selected-source and current-authority enforcement exist in the host (`assertConversationAccess`); see [`DATA-AND-CONSENT.md`](DATA-AND-CONSENT.md). The consent copy was not reviewed this sprint. | Measured (host probes) |
| EXT-10 | No export/backup | Vault and recovery formats exist and are protected. Restore and durability proof on a device is F06. | Traced |
| EXT-11 | No Pocket LUCA | Exists. Guided answers and model inference are kept distinct in [`ROUTING-AND-ANSWER-CONTRACT.md`](ROUTING-AND-ANSWER-CONTRACT.md). | Measured (host) |
| EXT-12 | No Nostr relay | Not implemented in this lane (F12). | Traced |
| EXT-13 | No P2P exchange | Not implemented in this lane (F12). | Traced |
| EXT-14 | No offline sync | Not implemented. Needs IDs, revisions, tombstones and a conflict policy first (F12). | Traced |
| EXT-15 | No dark mode | Not applicable. The UI is dark (`#061017` palette). Contrast is part of F11. | Traced |
| EXT-16 | No accessibility audit | F11 is open. The Sprint-02 preview adds browser checks for 48dp targets, 320px width, 200% text and reduced motion. There is no TalkBack or device run. | Measured (browser preview only) |
| EXT-17 | No crash reporting | Not assessed. Remote telemetry is deliberately not added by default. | — |
| EXT-18 | Incomplete validation | Candidate typed-fact admission and the answer boundary are covered by regression tests. SP2-HOST-01 is an open validation gap at the host byte budget. | Measured |
| EXT-19 | No CI/CD | CI exists: `.github/workflows/source-checks.yml` (source-only, fail-closed). Deployment is deliberately absent. | Measured |
| EXT-20 | No migration strategy | Open. No schema migration is authorized. The format inventory belongs to native recovery. | — |
| EXT-21 | No OTA | Not planned. Optional, with its own trust boundary. | — |
| EXT-22 | No push notifications | Not planned. Optional. | — |
| EXT-23 | No analytics | Deliberately absent. No behavioural or health tracking. | — |
| EXT-24 | No HIPAA measures | Needs a scoped legal assessment, not a code change. HIPAA applicability depends on role. | — |
| EXT-25 | No i18n | EN/ES exists in R4. The Sprint-02 contract states that the retained welcome and locked screens are hardcoded English; the candidate preview covers both languages, including the locked screen. | Traced; preview measured |
| EXT-26 | Default splash | The native splash owner is unknown because native source is missing (F01). | — |
| EXT-27 | No store metadata | Belongs to the release phase. Release is NO-GO. | — |
| EXT-28 | No rate limiting | The host enforces byte budgets on prompt and context (see the routing contract). There is no network entry point in this lane. | Measured (host) |
| EXT-29 | No retention policy | Open policy question. No auto-deletion. | — |
| EXT-30 | No multi-device sync | Deferred (F12). | — |

Nothing on this page authorizes a migration, a signer change, telemetry, a
release, or replacing the recovered Android app with the scaffold.
