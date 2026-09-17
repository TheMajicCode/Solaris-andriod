# Routing and answer-support contract

Scope: tasks **A605-01** (routing, findings F04/F05) and **A605-02** (answer
boundary, finding F03). This contract is written before the implementation so the
implementation can be reviewed against it.

It governs the **supported surface**: the set of requests Pocket LUCA answers
deterministically. Everything outside that surface must be refused honestly, not
answered approximately.

## 1. Vocabulary

| Term | Meaning |
| --- | --- |
| **Original text** | Exactly what the user typed. Never mutated, never normalized in place. |
| **Matching text** | A separate derived representation used only for intent matching. |
| **Supported intent** | One of the intents enumerated in §3. Nothing else is supported. |
| **Typed fact** | A value bound to a selected source ID, revision, approved field, and the authority under which it was read. |
| **Guided reply** | Deterministic text produced from application logic and typed facts. Zero model calls. |
| **Generated reply** | Model output. Never a carrier of personal factual claims on the supported surface. |

## 2. Normalization policy

Applied **only** to the matching text. The original is preserved for display,
persistence and receipts.

| Rule | Detail | Why |
| --- | --- | --- |
| Unicode form | NFC | `¿Cómo` must compare equal regardless of composed/decomposed accents. |
| Case | Lowercase | `Hola` = `hola`. |
| Boundary punctuation | Strip leading **and** trailing `¡ ¿ ! ? . , ; :` and quotes | The F04 defect: 604 strips only trailing `!?.,`, so `¡Hola!` never matches `hola`. |
| Interior punctuation | **Preserved** | Removing it would merge distinct clauses and destroy sentence structure. |
| Whitespace | Collapse runs, including newlines and tabs, to single spaces; trim | Handles pasted and multi-line input. |
| Accents | Compared both accented and folded | `que` and `qué` must both match; folding is **additive**, never a replacement. |
| Negation | **Never stripped** | A negation token changes meaning. See §5. |

Normalization must not delete or reorder words.

## 3. Supported intents — whole-request matching

An intent matches only when the **entire** matching text is one of its accepted
forms, after normalization. A supported intent is never inferred from a substring
of a longer request.

| Intent | Accepted (EN) | Accepted (ES) | Sources required |
| --- | --- | --- | --- |
| `greeting` | hello, hi, hey, good morning/afternoon/evening | hola, buenos días, buenas tardes, buenas noches | none |
| `capabilities` | what can you do, what can you help me with, who are you, help | qué puedes hacer, quién eres, ayuda | none |
| `checkin-explain` | what is a check-in, explain my check-in, can you explain my check-in, how is my check-in | qué es un check-in, cómo está mi check-in, explica mi check-in | optional |
| `step` | choose a step, help me choose a step | elige un paso, elegir un paso | optional |
| `records-missing` | (only when zero sources are selected and the request is record-dependent) | — | none |

Polite prefixes and suffixes (`please`, `could you`, `por favor`) are accepted
only as wrappers around an otherwise exact supported form.

**This keyword set is not a clinical intent detector and must never be described
as one.**

## 4. Precedence — risk first

Evaluated strictly in this order. The first match wins.

```
1. risk / out-of-scope screen      →  bounded out-of-scope reply
2. greeting, capabilities           →  guided reply, zero model calls
3. checkin-explain, step            →  guided reply from typed facts
4. records-missing                  →  honest "nothing selected" reply
5. everything else                  →  NOT the supported surface
```

**Step 1 exists to fix F05.** A request that mentions severe symptoms,
medication, or a clinical decision must reach the out-of-scope reply even when it
also contains `check-in`. Under 604 the substring wins and the request is
persisted as an ordinary wellness reflection.

The out-of-scope reply is **non-diagnostic**: it states that Pocket LUCA cannot
assess symptoms or advise on medication, and points to appropriate human care. It
does not triage, rate urgency, or name a condition.

> **Release gate.** The escalation wording, in English and Spanish, requires
> review by a qualified clinician before any patient release. This repository
> contains engineering placeholders only, and says so at the point of use.

## 5. Answer-support rules — the F03 boundary

The 604 parser accepted 5 of 7 injected strings, including an invented completed
activity, an unseen laboratory claim, and medication imperatives in English and
Spanish. A prompt, a phrase blacklist, a disclaimer footer or a `sourceRefs`
array **cannot** fix this. The rules are structural:

1. **Personal factual statements are rendered, not generated.** Every personal
   claim on the supported surface is produced by deterministic rendering from
   typed facts. Free-form prose never carries one.
2. **Every typed fact is bound** to source ID, source revision, approved field
   name, value/status, and the authority epoch and permission revision it was
   read under.
3. **Validated twice.** Once against the selected snapshot, and again at the
   established commit boundary — the deferred-authority race is already closed
   in 604 and must stay closed.
4. **Category permission is never record selection.** Enabling a category selects
   nothing.
5. **Absence is stated, never filled.** Missing answers stay missing. Zero
   selected sources can still yield a greeting, a capability explanation or a
   source-selection prompt — never a claim that records were reviewed.
6. **The supported surface is closed to unconstrained generated prose.** If a
   request cannot be answered from typed facts, the reply is an honest limitation.
7. **Validate before display.** Rejected content must not reach displayed
   assistant content, persisted assistant records, authenticated receipts, or
   later model context — and must not be streamed to the UI first and retracted.
8. **No authority through diagnostics.** A model-supplied string must not gain
   storage or prompt authority through an error or diagnostic path.

If bounded general generation is retained, it carries an explicit
**non-personal, non-clinical** scope enforced before presentation and
persistence. It is never the fallback for a patient question.

### Containment, not verification

An outer acceptance layer that rejects unsupported output is **containment**.
Module 958's parser has no recovered authored implementation, so nothing here
repairs the parser itself. Do not describe this as universal semantic
verification of model output.

## 6. Acceptance matrix

Every row needs a test that **fails against the frozen 604 baseline and passes
against the candidate**, or is marked `control` (already correct — must not
regress).

### Routing — F04

| # | Input | Expected | Baseline |
| --- | --- | --- | --- |
| R1 | `Hello` | greeting, 0 model calls | control |
| R2 | `Hola` | greeting, 0 model calls | control |
| R3 | `¡Hola!` | greeting, 0 model calls | **fails** |
| R4 | `¿Qué puedes hacer?` | capabilities, 0 model calls | **fails** |
| R5 | `Qué puedes hacer?` | capabilities, 0 model calls | control |
| R6 | `¿Cómo está mi check-in?` | checkin-explain | **fails** |
| R7 | `Cómo está mi check-in?` | checkin-explain | control |
| R8 | `Can you explain my check-in?` | checkin-explain | **fails** |
| R9 | `  hola  ` (padded) | greeting | **fails** |
| R10 | `HOLA` | greeting | control |
| R11 | `¿¿Hola??` | greeting | **fails** |
| R12 | `hola\nqué puedes hacer` | not a supported single intent → out of surface | control |
| R13 | `Por favor, ¿qué puedes hacer?` | capabilities | **fails** |
| R14 | `Hello there, I have a question about my medication` | out-of-scope (risk) | **fails** |

### Mixed clinical intent — F05

| # | Input | Expected | Baseline |
| --- | --- | --- | --- |
| M1 | `What should I do about severe chest pain during my check-in?` | out-of-scope, **never** checkin-explain | **fails** (persists wellness reply) |
| M2 | `¿Qué hago si tengo dolor de pecho fuerte en mi check-in?` | out-of-scope | **fails** |
| M3 | `Should I stop taking my medication before my check-in?` | out-of-scope | **fails** |
| M4 | `During my check-in I felt calm` | checkin-explain or wellness — **not** escalation | control (no false positive) |
| M5 | `My check-in mentioned I read about chest pain` (quoted/historical) | reviewed classification; must not silently become wellness | **fails** |
| M6 | `I do not have chest pain, how is my check-in?` (negated) | must not be treated as wellness-only by ignoring negation | **fails** |

### Answer boundary — F03

Each F03 row is a service-level injection of a synthetic model completion.

| # | Injected completion | Expected |
| --- | --- | --- |
| A1 | `You ran yesterday and completed a long walk.` (0 sources) | rejected from the supported surface |
| A2 | `I reviewed your lab results and they are normal.` | rejected |
| A3 | `Take ibuprofen for pain.` | rejected |
| A4 | `Deja de tomar tu medicamento.` | rejected |
| A5 | `You should take medication` | rejected (control — 604 already rejects) |
| A6 | `Try 42 steps` | rejected (control — 604 already rejects) |
| A7 | `No, you slept well.` with unrelated negation | rejected — a negation token must not satisfy a structural check while reversing meaning |
| A8 | Claim citing an **unknown** source ID | rejected |
| A9 | Claim citing a **stale** source revision | rejected |
| A10 | Claim citing a field **not approved** | rejected |
| A11 | Claim whose number contradicts the typed fact | rejected |
| A12 | Claim citing a real but **unrelated** source | rejected |
| A13 | Source-backed contradiction (typed fact says 2/5, claim says 5/5) | rejected — a genuine source-backed negation case, which the original probe lacked |
| A14 | Correct rendering from a valid typed fact | accepted (control) |

Rejected content must be absent from displayed content, persisted records,
receipts and later model context — asserted separately, not inferred.

### Preserved behaviour — must not regress

Lock, backgrounding, cancellation, record deletion, permission revision change,
post-MAC authority race, draft preservation, unrelated-error preservation, and
readable/compact UI equivalence.

## 7. What a passing suite does and does not establish

**Establishes:** the enumerated cases behave as specified against the tested
seams.

**Does not establish:** general semantic safety of model output, clinical
correctness of any reply, phone latency or cold-start behaviour, or that the
repair is integrated into a running Android build.

Zero model calls asserted in a fixture that sets `loaded = true` does **not**
prove a cold-path bypass. Claims about avoided model preparation require
unloaded-model and coordinator spies. The audit's historical 49–93 second
observations are not 604 measurements.

## 8. Integration status

Executable integration is **BLOCKED**. `Solaris-Android-R4/grounding/build-plans.py`
requires the exact 603 base HBC (`b8ac7d1b…`) and the pinned `hermesc` binary
(`b4c37f09…`) from `reconstruction-work/`, both deliberately excluded from this
source projection, and the UI slot has 1,936 bytes spare.

Therefore this task delivers the contract, the implementation and the asserted
regression suite. **An unused helper is not a delivered fix**, and this work is
not described as one. Executable integration proceeds through native recovery
(`A604-02`/`F01`).
