> **Imported verbatim** from the Sprint-02 handoff (`Welcome-and-Onboarding-Contract.md`, SHA-256 `6f912d47e19a9a3e3637638f6a2c780f30f01fe350cacb467e07bce9c99bcac5`, matching the handoff's own `SHA256SUMS.txt`). Not authored in this repository. The candidate that implements it is `candidate/onboarding/`; how the retained host differs is in [`../onboarding/HOST-TRACE.md`](../onboarding/HOST-TRACE.md), and the slot measurement is in [host evidence](../HOST-REPRODUCTION-EVIDENCE.md#welcomeonboarding-against-the-ui-slot-u1).

---

# Welcome and onboarding contract — Sanctuary refresh

Status: proposed implementation contract and design preview; not integrated into an APK. Baseline: retained R4 UI at Android `5d48426e49a0e6e2d1f4eb7b6cdfa62dbaa657d7`, reconciled with the actual latest local candidate before editing. Web reference: `09d6e6a43e751d31d06080e45364113a69759b1b`. Current native behavior must be confirmed at its real boundary.

## Intent

Give Solaris a calm, cinematic opening that quickly leads to a useful local experience: understand the vault, establish or recover access, choose optional LUCA help, and begin a small daily action. Keep the existing forest path, glass sphere, copper rings and actual emblem. Avoid a mandatory slideshow explaining every future Solaris product.

The app already has a welcome, returning-user unlock and three onboarding chapters. This work refreshes them. It does not create a new navigation architecture, identity system, vault implementation or Expo application.

## Visual contract

| Element | Source-grounded direction |
| --- | --- |
| Emblem | Exact retained `EMBLEM`, supplied as `design/assets/emblem.png`; SHA-256 `1f85d6630a2acd377871288f75031a17aef0ae7d0978b105a935406fa1facec3`. Do not redraw it. |
| Sanctuary | Exact `FOREST_SANCTUARY`, supplied as `design/assets/forest_sanctuary.png`; SHA-256 `e7bd6d01e2278259882250175dc9f453920c595625e45eb40a6acafb19adeef4`. Preserve the asset bytes; composition/cropping belongs in the UI layout. |
| Effective APK palette | Background `#061017`; surfaces `#0f2430` / `#19313b`; text `#f1f5ed`; secondary text `#afc2bc`; mint `#6dffba`; copper/gold `#d7ac76`. These are the later V6 overrides, not the earlier CSS declarations. |
| Type | Existing Georgia/Times serif for focal titles, system sans body with the existing Inter fallback. No network font requirement. |
| Composition | A clear view down the forest path on welcome; small genuine logo/wordmark; one focal sentence; visible primary and recovery actions. Subsequent chapters use quieter local artwork and readable bounded surfaces. |
| Motion | Brief optional opacity/transform transitions, with controls immediately usable. No forced 2.6-second web splash, looping particle system, video, WebGL, audio or inference to render the opening. Reduced-motion path is static. Pause animation while backgrounded. |
| Readability | Keep the forest visible. Use a localized gradient/surface behind copy rather than making the whole scene black. Treat the earlier 15%-tint preference as aesthetic intent, subordinate to measured contrast. No expensive backdrop blur required. |
| Interaction | One dominant action; consistent Back/Skip/Done; minimum 48dp native touch targets; no gesture-only action. Setup progress is steps, not a fictional time or health score. |

The preview is a static design board with illustrative controls. It does not call native methods, collect form values, save a vault or test the model. Copy and controls must still pass the integration gates below.

## State routing: native state is authoritative

| Actual state | Screen and behavior |
| --- | --- |
| Startup state unresolved, missing or invalid | Neutral “Opening Solaris…” with retry/error when appropriate. Missing `hasVault` is not `false`. Do not render personal data or offer destructive initialization based on a timeout. |
| Confirmed no vault | Welcome, then existing native setup with create/restore choices. No key generation from animation, page mount or language change. |
| Existing vault, locked | “Welcome back” and existing unlock/recovery entry. No new-vault tour, forced model download or profile questionnaire. Respect unsuccessful/cancelled device authentication. |
| Unlocked with incomplete migration/recovery verification | Existing mandatory recovery/migration flow. Welcome Skip cannot complete or bypass it. |
| Unlocked, eligible for first-time onboarding | Three refreshed chapters below. Restore any safely persisted progress using existing supported state only. |
| Onboarding complete | Existing Home or the supported resumed route. No onboarding replay after an ordinary update. A tour may be opened voluntarily later if implemented. |
| Lock/background/session loss at any stage | Apply existing privacy/session guards. Do not keep protected content visible to preserve an animation. Resume from authoritative state after reauthorization; do not promise background generation. |

A local boolean or route flag cannot serve as a vault unlock or migration authorization. Preserve permanent subject identity, keys, record IDs and encrypted recovery formats. Reinstallation, biometric changes and device loss are recovery cases, not permission to generate a replacement identity silently.

## Compact screen sequence and copy

There are five user-visible stages for a new user: welcome; the existing native setup boundary; and the existing three in-app chapters. Model preparation is an optional branch that never prevents the permitted local tools from opening. Returning owners bypass the new-user sequence.

| Stage | English | Spanish | Action and limit |
| --- | --- | --- | --- |
| Welcome | **Your health. Your space.** “A place for your records, your reflections and your next small step.” | **Tu salud. Tu espacio.** “Un espacio para tus registros, tus reflexiones y tu próximo pequeño paso.” | “Get started / Comenzar”; “I have a vault to restore / Tengo una bóveda para restaurar”; visible EN/ES. Route into supported native setup. Do not claim a vault has already been created. |
| Native entry | **Make this space yours.** “Set up or restore your vault using the available device and recovery options.” | **Haz tuyo este espacio.** “Configura o restaura tu bóveda con las opciones disponibles del dispositivo y de recuperación.” | Use existing native setup/unlock/recovery screens. Do not simulate them in HTML. If no dedicated restore action exists, open the existing supported setup path and label its choices accurately. |
| Chapter 1 — control | **You choose what LUCA can use.** “Your records are personal. Choose the records LUCA may use, within your permissions. Review the sources chosen for each personal reply.” | **Tú eliges qué puede usar LUCA.** “Tus registros son personales. Elige los registros que puede usar LUCA, según tus permisos. Revisa las fuentes elegidas para cada respuesta personal.” | “Continue / Continuar”; “Skip for now / Omitir por ahora”; Back. Explanation is not a consent grant. Actual selections stay in the existing source/permission controls. This introduction neither adds selections nor silently clears previously authorized choices. Do not invent a per-field picker if only source/category controls exist. |
| Chapter 2 — optional LUCA | **Support, on your phone.** “Pocket LUCA offers brief local help. Personal answers need the records you choose. You can use your daily tools without AI.” | **Apoyo en tu teléfono.** “Pocket LUCA ofrece ayuda breve en tu teléfono. Las respuestas personales necesitan los registros que elijas. Puedes usar tus herramientas diarias sin IA.” | “Set up Pocket LUCA / Configurar Pocket LUCA” opens existing preparation; “Continue without AI / Continuar sin IA” remains clear. Never advertise diagnosis or unrestricted medical intelligence. |
| Chapter 3 — begin | **One small step, at your pace.** “You can explore now and complete your profile later.” | **Un paso pequeño, a tu ritmo.** “Puedes explorar ahora y completar tu perfil más adelante.” | Optional preferred name, “Done / Listo”, Back. Existing acknowledged completion operation, then Home. Optional Check-in or Records entry only after successful completion. |
| Returning user | **Welcome back.** “Unlock your vault to continue.” | **Te damos la bienvenida de nuevo.** “Desbloquea tu bóveda para continuar.” | “Unlock my vault / Desbloquear mi bóveda”; supported recovery help. No personal name or record preview before unlock. |

The welcome and locked screens currently contain hardcoded English. Do not only translate the later tour. Cover visible copy, accessible names, errors, progress, Skip/Done and native handoff messages. Switching EN/ES must not translate or clear patient-entered content. Validate longer Spanish strings.

## Existing operations to reuse, not invent

| Retained state/action | Implementation obligation |
| --- | --- |
| `locked`, native-supplied `hasVault` | Wait for explicit, valid native state. Verify types and unknown/error behavior in the adapter. |
| `firstAI` / `firstNoAI` → `provisionChoice`, then `openSetup` | Trace the actual host dependency before separating the opening from the AI decision. The proposal moves optional AI explanation later; do not auto-enable/download a model from Get started. Reuse an existing legal setup entry and preserve necessary host sequencing. |
| `welcomeAI` | The existing handler calls `provisionChoice`, then `change('onboarding', {name})`, completing onboarding. Do not blindly reuse it for the proposed Chapter 2 setup action. Use only proven legal operations, deliberately preserve/adapt sequencing, and test that optional setup returns to the intended chapter without prematurely completing the tour. |
| `openSetup` | Keep native create/restore/unlock and recovery verification. The preview does not establish a new API or successful authentication. |
| `migration.committed` | Preserve existing recovery verification gate; never set from frontend tour state. |
| `onboardingComplete`, `change('onboarding', {name})` | Write through the existing supported bridge and wait for acknowledged success before Home. Test duplicate taps, timeout and retry. Do not add a new persisted schema casually. |
| `experience.locale` / `experienceLocale` | Trace whether changes are permitted while locked. If not, keep only a non-secret temporary presentation language and persist through the supported path after unlock. No identity/health data in UI-only storage. |
| `provisionChoice` and existing setup progress | Respect Wi-Fi/mobile-data choice; distinguish transfer, file verification, load and actual chat success. Read real sizes/progress from configuration/runtime, never hardcode an old screenshot's numbers. |
| Existing permission and selected-source controls | Download permission, inference permission, selected context and sharing consent are distinct. The welcome must not add source selections, grant blanket access or transmit to practitioners; it also must not discard previously authorized source choices. The retained app can preserve selections or add an approved check-in through other existing paths, so avoid claiming that selection is always manual. |

If an operation is unavailable in the current host, leave the corresponding preview feature explicitly unintegrated. Do not invent native responses or use dummy state as evidence that the APK flow works.

## Model and truthfulness states

Represent setup as separate facts: not requested; downloading; file verified; loading; loaded; test failed; test succeeded. Display a percentage only with trustworthy transferred and total bytes. A saved file or loaded engine is not proof of a completed chat response. Cancellation and retry must preserve an existing valid model.

Differentiate predefined guided support from model-generated replies in setup and chat. A welcome greeting or a template should never be shown as evidence that QVAC generated text. Do not fabricate personalized records or claim none exist merely because none were selected. A concise honest message is: “Choose a record in Sources so I can use it here / Elige un registro en Fuentes para que pueda usarlo aquí.”

No new clinical escalation copy is approved by this design. Retain the reviewed engineering boundary and the separate qualified EN/ES clinical-copy gate. Do not promise a faster phone response from a visual redesign. Measure cold start, time to first useful response, completion, cancellation and return-from-background on an eventual compatible device candidate.

## Solaris beyond the first step

An optional “The wider Solaris vision / La visión de Solaris” panel can explain: this Android vault is the local health-passport product; the web supports discovery and coordination; future practitioner endpoints/Clinic OS support consented exchange; economic-passport wallets and sovereignty/GPS/RGB experiments are separately scoped future integrations.

Use “Planned / En desarrollo” where implementation has not been verified. No wallet setup, fake balance, earnings amount, paid claim, Nostr key rotation, location permission, node purchase or account signup is required to enter the local vault. A directory entry does not prove practitioner trust, and withdrawal of future access cannot recall a copy already disclosed. Do not claim these exchange/revocation features are implemented until tested.

## Targeted acceptance and delivery gates

1. **Routing and preservation:** synthetic cases for unknown/native error, no vault, existing locked/unlocked, migration pending, onboarding partial/completed, restore cancellation and repeated update launch. Existing owners never receive destructive re-creation; opening/language/animation alone creates no keys or records.
2. **Acknowledgment and async work:** completion waits for actual native success; failure/retry is visible and does not falsely mark complete. Test double taps, background/lock during await and restored session authority. Do not expose private content on a locked screen or log it.
3. **Privacy choices:** no automatic model download, context selection, cloud health upload, telemetry or remote font/art request. Permission denied/AI skipped/no network retains supported local tools. No fake successful inference indicator.
4. **Accessibility and layout:** 320px width, short display, keyboard open, 200% text, long EN/ES, safe areas, TalkBack focus/labels, contrast on the actual artwork, 48dp targets and reduced motion. Actions may scroll into reach; do not shrink essential text to fit. Skip/Done are clearly visible and state-appropriate.
5. **Questionnaire continuity:** the preview does not replace saved questionnaires or force them during onboarding. Test navigation to existing questionnaire/check-in and returning without scroll reset, draft loss or mixing the app's different rating scales.
6. **Integration fit:** use maintained candidate source and preserve frozen references. Measure encoded/minified bytes against the actual HBC UI slot; the earlier 1,936-byte spare measurement is a historical limit, not a guarantee for this new UI. No truncation, removed controls, stripped safety/localization or disabled assertions to make it fit.
7. **Independent review and evidence:** record browser/visual checks separately from route tests, retained-host tests, native build and device acceptance. Review the final code and fit decision, then public source CI. If integration is blocked, deliver the preview/contract and exact blocker without claiming the APK changed.

Source citations and raw asset/token identities are retained in `evidence/onboarding/`. No patient data, key material or real account details are used in the preview.
