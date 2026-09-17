# Build 604 guided conversation routing

The screenshots show zero selected sources while generated answers invent personal activities and misinterpret the app's wellness check-in. In build 603, every `useAI=true` v3 conversation, including the UI's predefined questions, enters `completeConversationTask`; existing `replyFor('explain')` does not run on that branch. This change adds deterministic guided answers before inference, while preserving open chat.

## Evidence and interfaces

The exact baseline is build 603 host bytecode SHA-256 `b8ac7d1b58d9e8ea6eadd25de516e35842aea14e4b849462664bb3200fedc990`.

- `DailyService.conversationContext` (F14886) validates selected source IDs, local permission, category permission, expiry, source revisions and field budgets through the original compiler (F15365). It returns `{task,sources}`.
- The compiler serializes only the selected approved flat fields as `facts:[{ref,fields}]`. `task.sourceRefs` holds the matching immutable IDs/revisions/hashes; `task.manifest.sources` additionally records category and field names.
- `contextSources` (F14832) exposes check-ins as category `questionnaires` with date and four aspect ratings. It excludes check-in notes. Other questionnaire fields have question/answer/date shape. The old `replyFor('explain')` already displays the four scores as self-reported impressions.
- `contextSources` does not expose action/session history. Therefore the activity-history fast answer directs the user to History; it never invents completed activities, even when unrelated facts are selected.

`fastGuided(task)` is a pure, closure-free helper. It returns `null` for open chat, or `{message,sourceRefs,kind}` for a supported guided request. It reads only the already validated task and never accesses, approves or selects records. The source references are full objects from `task.sourceRefs`, not fabricated citation strings.

Supported requests are exact greetings/capability prompts, the Choose a step shortcut, common check-in questions, personal activity/history questions, and common source-free record/habit/sleep questions. English and Spanish UI locale are supported. Check-in responses use only the most recent **selected** check-in, quote exact nonmissing ratings, and offer a reflection question or small step. All-null ratings stay missing. Check-in recognition additionally requires the real source prefix, questionnaire category, exact date-plus-four-aspects shape, valid rating types/ranges, and a strict YYYY-MM-DD date format before echoing the date.

This is intentionally a bounded route, not a claim to understand every wording or to improve the underlying model's reasoning. Generic source-free open chat still uses the same model and parser.

## Bytecode integration

`build-plans.py` exports `plans(reader, baseline_bytes, output_dir)`. It targets four existing functions without new string or function IDs:

1. **F14890 assertConversationAccess**: after the original v3 context compilation, compute and return the guided candidate. Legacy validation behavior and returns are unchanged. The preflight candidate is not stored or committed.
2. **F6929 bridge**: after the original preflight call at offset 2283, a truthy guided candidate bypasses only the optional QVAC model load. Execution resumes at original offset 2384, retaining inputAllowed, request-generation token and vault checks. UI requests and `useAI` semantics stay unchanged.
3. **F14894 converse**: recompute the guided candidate after fresh original context compilation and installation of the existing `currentSources` closure. On a match, populate the answer and source provenance, retain mode `rules` and zero content events, then continue at original offset 1154. The original epoch, permission, current-source, queue, session and persistence checks remain. Generated model requests retain the complete build 603 path and diagnostics.
4. **F14904 persistence**: the receipt result follows mode `qvac-device` rather than a nonempty answer string, so guided text remains `validated-template`, with model/hash null and zero content events. A targeted test found that the original post-MAC path rechecked epoch/current sources/permission but did not recheck authority epoch. The new path also rechecks authority immediately after the asynchronous MAC before the existing checks. Both generated and guided commits receive this guard.

Helpers are compiled with the pinned Hermes compiler. `prepare-guided.cjs` uses eight-code-unit String.fromCharCode chunks for new constants; this retains the existing string table and keeps the maximum compact frame at 127 registers. The inliner validates all imported string IDs, forbids closures/regexp literals/literal buffers, repairs original implicit-call arguments for enlarged frames, and relocates branch and exception boundaries.

## Validation

`run-tests.py` runs 34 targeted cases against actual packaged Hermes DailyService/compiler/permission/persistence code with synthetic native storage and inference boundaries. It covers unloaded-model guided replies with zero native completion calls, source selection and exact ratings, missing answers, newest-selected behavior, irrelevant and denied sources, permission denial/expiry, source changes during MAC, epoch/authority/permission/session/vault changes during MAC, open-chat generation/negation, build 603 diagnostic behavior, operation idempotency and retaining existing user IDs.

Independent reviewers additionally own adapted build 603 model/parser/race regression tests, adversarial helper tests and bridge bypass verification. Final build evidence must name and hash the final candidate; an earlier helper-only pass does not approve a later artifact.

These tests do not measure Android response times. Guided replies avoid model loading and generation; ordinary free-form inference speed remains device dependent. No vault schema, record IDs, package ID, native library or model file is changed by this component.

## Canonical release result

All 34 targeted actual-Hermes tests passed on canonical release host bytecode SHA-256 `30be9989cc00299836715cc3de5cf3a2a75b00019bdf2f1b91629205f558d8b3`. Exact invocation, test hash, compiled fixture hash and exit status are recorded in `tests-release/provenance.json`; per-case evidence is in `tests-release/result.json`. The source helper, plan generator and preparation script were frozen before this release test.
