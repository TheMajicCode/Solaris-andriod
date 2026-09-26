# Independent DailyService diagnostics and compatibility tests

Status: PASS on the exact retained build-602 Hermes bytecode, the diagnostics-only analysis bytecode, interim integrated candidates, and final integrated candidate-06.

- Baseline SHA-256: `fd8b38bcdd42421c18da4a0b69b2d58906ceddd7c4a2044b34faed51490f4653`.
- Diagnostics analysis SHA-256: `2477ad2cd24c957ccfb3415a5a39d397bf6bc1d9139e0f4d86861fbc89cfc12a`.
- Integrated candidate-03 SHA-256: `7233230f3cd6843345d0e7267469f72c9fe81eb6b5488830339dc4274f82dfd6`.
- Interim candidate-04 SHA-256: `24b82546edbb0e3ff57fbbb855537b058a6461d44c05e8e80c22df5297161da8`.
- Final integrated candidate-06 SHA-256: `b8ac7d1b58d9e8ea6eadd25de516e35842aea14e4b849462664bb3200fedc990`.
- 94 complete cases pass independently in each mode, with no runner stderr. Eleven additional cases encode the proposed recent-context behavior through actual preflight and `converse`; baseline/diagnostics runs correctly expect no new recent context.
- All 966 Metro factories are captured. Original Android entrypoints `[191,3,0]` remain suppressed.

## What executes

The harness executes actual retained Hermes module 939 (`DailyService`) and its original `converse`, `conversationContext`, `contextSources`, `requireState`, `requireSession`, `queue` and `persist` methods. It also executes original module 958 (`compileConversation`, `parseConversation`), module 955 permission logic, module 922 full `validState`, original state creation and supporting pure domain/crypto modules. Source approval, selected record hashes, category/permission revisions and output validation are not mocked.

Explicit synthetic boundaries are the QVAC completion service, in-memory `VaultStore.write`, native vault ID generation/MAC, and an unused session-clock provider that throws on unexpected access. The final UI projection is replaced by a state snapshot; the persistence and parser paths remain original bytecode. Every unexpected module access fails closed against a reviewed finite allowlist. No React Native or Android startup is executed.

## Coverage

| Group | Cases | What is checked |
| --- | ---: | --- |
| Valid greeting | 1 | Actual zero-source prompt, parser and full state validator; one write; user/assistant/receipt IDs, authority and identity unchanged, generated-mode provenance |
| Finite diagnostic codes | 46 | Baseline collapses each unique whitelisted code; candidate preserves only its exact code |
| Raw error sanitization | 6 | Unknown/raw Error detail, suffix/newline detail, non-Error objects and private strings remain generic |
| Cancellation precedence | 3 | Explicit and embedded cancellation indications normalize to `CANCELLED` |
| Actual parser rejection | 9 | Plain text, wrong/extra JSON keys, missing refs, fabricated refs, invented numeric content, unsafe content, lost negation, disallowed action; existing user ID retained and no assistant/write |
| Retry/idempotence/history | 3 | Retry creates no duplicate user; duplicate operation creates no second inference/write; displayed old history is still excluded from prompt |
| Selected/unselected sources | 2 | Approved selected synthetic profile receives its original hash/reference; an unselected profile never enters the actual prompt |
| Before-inference permission gates | 3 | Missing category, unavailable source and denied local grant prevent dispatch |
| Inflight eligibility | 6 | Epoch, authority, local-grant revoke/expiry, context-revision change and vault lock prevent accepted completion/persistence |
| Error/authority precedence | 2 | Epoch or context-revision change takes precedence over an otherwise whitelisted timeout error |
| Inflight source gates | 2 | A changed selected source hash or revoked category prevents persistence |
| Recent-context integration | 11 | Initial old pair excluded; double preflight preserves a newly completed pair; latest pair only; session/authority/revision scope reset; previous/current source-bearing contexts excluded; whole-pair and total-prompt budgets; no relaxation of original number grounding |

Every failure fixture checks no write, no appended conversation message and cleared busy state. Success and retry fixtures validate their resulting state through the original full schema. Generated IDs come from a deterministic synthetic provider so exact prefix/identity preservation can be asserted. State-change fixtures replace state snapshots, matching the app's persistence pattern rather than mutating a shared captured object in place.

## Invocation and evidence

From the parent workspace:

```bash
python3 Solaris-Android-R3/tests/daily-run.py Solaris-Android-R2/evidence/guard-patch/completion-guards.hbc --label baseline
python3 Solaris-Android-R3/tests/daily-run.py Solaris-Android-R3/evidence/integration/diagnostics.hbc --patched --label diagnostics
python3 Solaris-Android-R3/tests/daily-run.py Solaris-Android-R3/evidence/candidate-03/candidate603.hbc --patched --recent --label candidate-03
python3 Solaris-Android-R3/tests/daily-run.py Solaris-Android-R3/evidence/candidate-04/candidate603.hbc --patched --recent --label candidate-04
python3 Solaris-Android-R3/tests/daily-run.py Solaris-Android-R3/evidence/candidate-06/candidate603.hbc --patched --recent --label candidate-06
```

Each evidence directory contains `result.json`, `provenance.json`, and the compiled test input plus stdout/stderr. Provenance includes the exact bundle, input and compiled-fixture hashes and runner command. The runner requires the complete 94-case count and expected entrypoint suppression. Use `--recent` only for an integrated candidate that includes the recent-context helper; this changes expected prompt behavior, not the original consent/parser/storage boundaries.

## Limits

These are desktop Hermes tests with synthetic QVAC responses and synthetic storage/native vault boundaries. They prove the inspected JavaScript/Hermes error, consent, parser and persistence behavior under the explicit fixtures. They do not measure a real model, native structured output, Android worker/final event behavior, GPU/CPU performance, wall-clock timeouts, cryptographic storage, installation, or actual phone chat success. The profile-source fixture is synthetic; no user's records are loaded. The native QVAC service itself is not invoked in this harness.

The success fixture now establishes executable evidence that a valid zero-source greeting response can pass the original parser and persistence checks. It does not establish that the tiny model actually generates that response on the phone.
