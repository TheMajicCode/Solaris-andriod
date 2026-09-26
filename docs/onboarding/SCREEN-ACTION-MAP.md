# U0 screen and action map

For every screen the candidate renders, this lists each control, the intent it
dispatches, the one host operation that intent may reach, and the trace line
that proves the operation exists. Line numbers refer to
[`Solaris-Android-R4/ui/sanctuary.html`](../../Solaris-Android-R4/ui/sanctuary.html);
see [`HOST-TRACE.md`](HOST-TRACE.md).

- **Source of truth:** `SCREEN_ACTIONS` and `INTENT_OPERATIONS` in
  [`actions.mjs`](../../candidate/onboarding/actions.mjs). The suite
  (`U0-02 S1–S8`) sweeps every action on every screen and fails on any other
  operation.
- **Status:** maintained candidate plus browser preview. **Nothing here is
  integrated** into the host page, the HBC or the APK.

## Routing (native state → screen), `route.mjs`

| Native state | Screen | Host today |
|---|---|---|
| nothing yet / `locked` not boolean / locked with `hasVault` not a boolean / `view` failed / wait elapsed | `opening` (retry = re-read `view`) | returning "Unlock my Vault" (1012) |
| `locked:true, hasVault:false` | `welcome` | welcome (1011) |
| `locked:true, hasVault:true` | `returning` | locked (1012) |
| unlocked, `migration.committed !== true` (including a missing `migration`) | `migration` | 1013 (throws if `migration` is missing) |
| unlocked, committed, `onboardingComplete` false or absent | `chapter` step 1–3 (in memory; relaunch = 1) | onboarding (1014) |
| unlocked, committed, `onboardingComplete === true` | `home` (the existing host Home; the candidate renders nothing) | Home (1016) |
| unlocked, `onboardingComplete` a non-boolean | `opening` (invalid) | treated as complete when truthy (1014) |

## Controls

| Screen | Control (EN / ES) | Intent | Host operation (trace) | Never does |
|---|---|---|---|---|
| every screen except home | Español / English | `language` | Locked or unknown: **none**; the in-memory presentation locale changes. Unlocked (migration, chapters): `change('experienceLocale',{locale})` (1094). | Writing while locked; storage; touching `drafts` or selections. |
| opening | Try again / Intentar de nuevo | `retry` | `request('view')` (1401) | Creating anything; routing to welcome on a timeout. |
| welcome | Get started / Comenzar | `start` | `request('openSetup')` (1376 `setup`) | `provisionChoice` (1375 `firstAI` is **not** reused), a download, key creation, source selection. |
| welcome | I have a vault to restore / Tengo una bóveda para restaurar | `restore` | `request('openSetup')` (1376), the same path the host labels "Restore my vault" (1011). The page states: "Both options open vault setup on this phone." | A restore API (none exists). |
| welcome | The wider Solaris vision / La visión de Solaris (`aria-expanded`) | `vision` | none | Wallet, balance, earnings, Nostr, location, signup. Items are marked **Planned / En desarrollo** or described as "This app" / "Separate website". |
| welcome (vision open) | Close / Cerrar | `visionClose` | none | — |
| returning | Unlock my vault / Desbloquear mi bóveda | `unlock` | `request('openSetup')` (1012/1376) | Welcome, tour, questionnaire, model download. Shows no name or record. |
| returning | Pocket LUCA AI setup / Configuración de Pocket LUCA AI | `lockedAiSetup` | `SolarisNativeAI.openDiagnostics({bridgeVersion:'solaris-qvac-bridge/1'})` (1012/1376 `aiSetup`) | Unlocking, provisioning. |
| migration | Continue Vault setup / Continuar configuración de la bóveda | `migrationSetup` | `request('openSetup')` (1013/1376) | Skip, Done or any onboarding write (refused on this screen). |
| chapter 1 | Continue / Continuar | `next` | none (in-memory step, as 1377) | Adding or clearing source selections. |
| chapter 1 | Skip for now / Omitir por ahora | `skip` | `change('onboarding',{name})` (1100 `onboardSkip`), acknowledged; see Done | — |
| chapter 2 | Set up Pocket LUCA / Configurar Pocket LUCA | `aiSetup` | `SolarisNativeAI.openDiagnostics(…)` (1376 `aiSetup`); stays on chapter 2 | **`change('onboarding')`** (the 1372 `welcomeAI` compound is not reused), `provisionChoice`, any claim that a model is downloaded, loaded or tested. |
| chapter 2 | Continue without AI / Continuar sin IA | `withoutAI` | none (goes to step 3); never disabled; needs no network | Any host call. |
| chapter 2, 3 | Back / Atrás | `back` | none (in-memory step, as 1377) | — |
| chapter 2 | Skip for now / Omitir por ahora | `skip` | as chapter 1 | — |
| chapter 3 | text field "What would you like to be called? (optional)" (`id="name"`) | — | Host input listener `drafts.name` (1360). The candidate only reads `drafts.name`. | Any write before Done. |
| chapter 3 | Done / Listo | `done` | `change('onboarding',{name}, operationId)` (1100/925). Home **only** after the reply confirms `onboardingComplete:true`. | Home before acknowledgement; a second call on a double tap. |
| chapter 3 | Finish and check in / Terminar y registrar mi día | `doneCheckin` | As Done. **After** acknowledged success it exposes `after:'checkin'`, meaning the existing `checkin` action (1373 → `openQuestionnaire('daily-checkin')`, else 1379 `sub='checkin'`). | Opening check-in before success. |
| chapter 3 | Finish and open my records / Terminar y abrir mis registros | `doneRecords` | As Done, then `after:'records'`, meaning the existing `healthTab:records` (1096). | As above. |
| any notice | Try again / Intentar de nuevo | the failed intent | as that intent | — |

## Completion, failure and lock behaviour

- **Double tap.** `dispatch()` refuses a second completion request while one is
  in flight (`ignored`); other controls answer `busy`. This matches the host's
  own group guard (942).
- **Failure.** The screen stays on chapter 3. A localized `role="alert"` notice
  with Try again appears, and the draft is kept. A retry is a new operation (as
  the host does after a definite failure, 1283).
- **Timeout** (20 s; the host has none, 778). A "Saving has not been confirmed
  yet" notice appears with retry, and the screen stays incomplete. A retry with
  the same name reuses the same `operationId` (the host precedent 1256–1283). A
  late success still reaches Home; a late failure changes nothing.
- **Reply without `onboardingComplete:true`.** Stays on chapter 3 with the
  "did not confirm" notice.
- **Lock during the await.** A lock push (`{locked:true}`, 792) settles the save
  immediately: the guard is released, the screen becomes `returning` (no name,
  no record) with a non-private "locked before this was confirmed" notice, and
  any later reply is ignored. After re-unlock, native state decides.

## Explicitly NOT integrated

- **Nothing is wired into `sanctuary.html`, `sanctuary.compact.html`, the HBC or
  the APK.** The host still renders 1011–1014.
- **Native setup** (create, restore, unlock, recovery verification). The native
  setup copy ("Make this space yours." / "Haz tuyo este espacio.") is in
  `copy.mjs` as `native.*` handoff strings and is **not rendered** by the
  candidate.
- **Model preparation states** (not requested, downloading, verified, loading,
  loaded, test failed/succeeded). They belong to the existing preparation UI
  (1194–1227); the candidate only opens `openDiagnostics`.
- **Navigating after completion.** `after:'checkin'|'records'` is an intent the
  host would have to dispatch; the candidate does not call host navigation.
- **Persisting the in-memory chapter step.** The host persists none; no new
  schema was added.
- **Questionnaire continuity** (contract gate 5) is not exercised. The
  candidate never opens a questionnaire itself.
- **The size budget.** The candidate is far over the historical HBC slot (see
  the report); integration is blocked on fit.

## Known deviations from the contract (independent re-review, 2026-09-25)

Recorded by the integrator. They are not fixed in this candidate:

- **S2R2-5: an absent `onboardingComplete` resolves to chapter 1.** This matches
  host 1014, but it is a possible tour replay, and the contract says "No
  onboarding replay after an ordinary update". Before integration, decide
  whether an unlocked state that omits the flag should route to the neutral
  `opening` state instead.
- **S2R2-6: chapter 1 has no Back,** although the contract lists "Continue;
  Skip for now; Back" for it. The screen before chapter 1 is the pre-unlock
  welcome, which the flow cannot return to while unlocked. This is intentional,
  but it needs contract-owner sign-off.
- **S2R2-7 (FIXED, merge-polish task, 2026-09-26): the vision panel's web copy**
  asserted the website's sign-in and data flow as present fact. Nothing in this
  repository verifies either statement, so the copy now describes intended
  architecture ("planned as a separate product … with its own sign-in; it is
  not designed to receive your vault records") rather than a checked claim. It
  still stays behind the same EN/ES copy review as the finish-button labels
  (STATUS `U0-03`, `U0-04`) before any release.
