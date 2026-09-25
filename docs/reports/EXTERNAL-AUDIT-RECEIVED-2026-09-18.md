> **Imported verbatim** from the Sprint-02 handoff (`evidence/EXTERNAL-AUDIT-RECEIVED.md`, SHA-256 `27e614775825174a697fe089757eb1e824e6c9a9f827781e66e9fcf350b8da78`, handoff archive verified against its SHA256SUMS.txt on 2026-09-24). Not authored in this repository. Current attribution and status: [External audit status](../EXTERNAL-AUDIT-STATUS.md).

---

# External assessment supplied by the user

Received in the 18 September 2026 conversation. The following preserves the supplied assessment's claims with normalized formatting. No audit author, target repository, commit, lockfile, raw command transcript or independently signed report accompanied it. This is not the separate Claude AUD/NB review. See `External-Audit-Disposition.md` at the handoff root for the engineering response.

## Reported tests and compilation

The external report calls itself “Solaris Mobile — Production Readiness Audit.” It reports all six tests passing with zero failures in 4.4 seconds across clinic payload encryption/decryption, Nostr identity generation round-trip, and Spanish punctuation intake including leading inverted punctuation, “¡Hola!” and “¿Cómo te sientes?”.

It reports nine TypeScript errors in four files:

- `src/layer3-clinic/encrypt.ts`: three Uint8Array/BufferSource errors, attributed by the report to a TS 6.0 breaking change.
- `tests/identity.test.ts`: two missing-Node-types errors.
- `tests/intake-spanish.test.ts`: two missing-Node-types errors.
- `tests/clinic-payload.test.ts`: two missing-Node-types errors.

## Components described as working

| Reported layer | Component | Report's assessment |
| --- | --- | --- |
| Identity | Nostr npub/nsec generation | Clean, tested |
| Identity | expo-secure-store | Working, solid |
| Intake | Spanish punctuation normalizer | Tested, fixed F04 |
| Intake | Welcome/how-feeling/check-in classifier | Working, tested |
| Intake | SQLite schema and CRUD | Working, clean |
| Intake | React Native IntakeForm | Basic but functional |
| Clinic | Payload builder | Tested, consent-typed |
| Clinic | AES-256-GCM | Working at runtime, fixable TS errors |
| Clinic | SQLite outbox | Working, clean |
| App | App.tsx wired to three layers | Working single-screen MVP |
| Tests | Six tests in three suites | Good coverage for core logic |

## The 30 reported missing items

The report groups items 1–10 as critical: (1) TypeScript errors; (2) ESLint/Prettier; (3) navigation; (4) error boundaries; (5) loading states; (6) onboarding; (7) biometric authorization; (8) production signing/keystore; (9) privacy policy/consent screen; (10) export/backup.

It groups items 11–20 as important: (11) Pocket LUCA integration; (12) Nostr relay communication; (13) P2P practitioner delivery; (14) offline sync/conflict resolution; (15) dark mode; (16) accessibility audit; (17) crash reporting; (18) validation on all forms; (19) CI/CD; (20) migration strategy.

It groups items 21–30 as nice-to-have: (21) OTA updates; (22) push notifications; (23) analytics; (24) HIPAA measures, described as required for US health data; (25) internationalization; (26) splash customization; (27) app-store metadata; (28) rate limiting; (29) retention/automatic cleanup; (30) multi-device sync.

## Reported score and estimates — not adopted

The report gives an overall score of approximately 12%, with category scores: core logic 45%, UI/UX 10%, security 25%, testing 20%, infrastructure 5%, compliance 0%, documentation 15%, error handling 5%. It states that the foundation is solid but not ready for patients, and also states: “The hard part is done.” It says the three-layer architecture is correct and remaining work is engineering rather than architectural decisions.

Its estimates are 1–2 hours for type/lint fixes, 2–3 weeks for an internal demo, 6–8 weeks for TestFlight/closed beta, 3–4 months for stores, and 6–9 months for production AI and P2P. No estimation method or dependency analysis was supplied.

Its recommended immediate change is to add `@types/node`, cast `Uint8Array` using `as BufferSource`, then run `tsc --noEmit`.

These are external claims, not verified facts about the recovered APK. The companion disposition retains the useful questions, requires exact source attribution, rejects an unsupported readiness score, and replaces the blanket cast recommendation with a boundary-preserving repair method.
