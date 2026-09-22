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

### 3.1 Host envelope parse — the integration owns the guards (AUD-04)

Routing does not begin at the intent table. It begins where the host turns a
prompt string into a request, and **build 604 does that unguarded**.
`Solaris-Android-R4/grounding/fast-guided.js` opens with:

```js
var envelope = JSON.parse(prompt.slice(prompt.indexOf('\n') + 1, -10));
var text = envelope.user.toLowerCase().trim();
```

Three structural assumptions are made and none is checked: that a newline
exists, that the trailing ten characters are exactly ` /no_think`, and that
`envelope.user` is a string.

**The asymmetry is that the helper's own harness checks what the helper does
not.** `Solaris-Android-R4/grounding/actual-tests.js:54` reads:

```js
function envelope(prompt){var cut=prompt.indexOf('\n');assert(cut>=0&&prompt.slice(-10)===' /no_think','unexpected prompt structure');return JSON.parse(prompt.slice(cut+1,-10));}
```

So every prompt the suite inspects has already been asserted well-formed by the
suite's own helper. The shipped gap is structurally invisible to the 34 passing
host cases. A green suite here is not evidence about malformed input.

Measured against the frozen helper, loaded unmodified into a scratch harness
(18 September 2026):

| Prompt | Frozen `fastGuided` outcome |
| --- | --- |
| No newline, header present | `SyntaxError` — the header is parsed as the envelope |
| No newline, no header | Answers normally — `slice(0, -10)` happens to be the whole envelope |
| ` /no_think` absent | `SyntaxError` — ten bytes of JSON silently removed |
| Suffix changed to ` /nothink` | `SyntaxError` |
| Body is not JSON | `SyntaxError` |
| `envelope` is `null` | `TypeError: Cannot read properties of null` |
| `user` absent | `TypeError: Cannot read properties of undefined` |
| `user` is a number | `TypeError: envelope.user.toLowerCase is not a function` |
| Well-formed control | Answers normally |

**What this does and does not establish.** It establishes that seven of the nine
rows leave `fastGuided` by an exception rather than by its documented
`null`-or-result contract. The remaining malformed row is accepted only because
the header was absent, so with `cut === -1` the unguarded `slice(0, -10)`
coincided with the whole envelope. (An earlier version of this paragraph said
that row parsed "the wrong region" — that was wrong, and it contradicted the
table directly above it. Parsing the wrong region is what the *first* row does,
and that row throws, so it is already inside the seven.) It does **not** establish that the
604 caller then dispatches the model: the caller's exception path is native and
is not in this source projection. The honest statement is that the outcome at
this seam is **unbounded** — `IMPLEMENTATION.md` defines `null` and a result
object, and says nothing about a throw.

**The frozen helper is not edited.** It is hash-verified evidence (AGENTS.md).
The guards are owned by the integration instead, in
[`candidate/a605/host-envelope.mjs`](../candidate/a605/host-envelope.mjs):

| Guard | Rejection reason | Replaces |
| --- | --- | --- |
| `typeof prompt === 'string'` | `prompt-not-a-string` | an immediate `TypeError` |
| `indexOf('\n') >= 0` | `no-newline-between-header-and-envelope` | `slice(0, -10)` |
| `slice(-10) === ' /no_think'` | `missing-or-changed-no_think-suffix` | a ten-byte truncation |
| non-empty body | `envelope-body-is-empty` | a `SyntaxError` |
| `JSON.parse` in `try` | `envelope-body-is-not-json` | a `SyntaxError` |
| plain object, not array or `null` | `envelope-is-not-a-plain-object` | a `TypeError` |
| own-property `user`, `typeof === 'string'` | `envelope-user-is-not-a-string` | a `TypeError` |

Every rejection resolves to the deterministic limitation reply with
`modelCallsRequired: 0` and a named `envelopeError`. `routeHostPrompt` is total
in **both** arguments: for every prompt and every options value — including
`null`, which a host bridge is likely to pass for an absent optional — it returns
an object, never throws and never returns `null`.

> **One guard is stricter than 604, not merely safer.** The newline guard rejects
> a header-less prompt that the frozen helper answers *correctly* (table row 2).
> Every other guard replaces a crash; this one replaces a success. It is kept
> because such a prompt is not a valid 604 prompt — it carries no locale
> directive, so its reply language would be a guess — but the divergence is
> stated rather than presented as a pure improvement.

**The adapter manufactures no bindings.** The 604 envelope carries
`facts[i].fields` and `task.sourceRefs[i].id`, but no `revision`, no
`approvedFields` and no authority epoch or permission revision — the four inputs
`buildTypedFact` requires (§5). Passing envelope facts through as a selection
therefore yields `checkin-select` and cites nothing, which is asserted. Supplying
a genuinely bound selection is part of integration and is BLOCKED (§8).

## 4. Precedence — risk first

Evaluated strictly in this order. The first match wins.

```
1. empty / punctuation-only input   →  deterministic limitation
2. risk / out-of-scope screen       →  bounded out-of-scope reply
3. greeting, capabilities           →  guided reply, zero model calls
4. checkin-explain, step
     with a usable selection        →  grounded reply rendered from typed facts
     without one                    →  honest "nothing selected" reply
5. everything else                  →  deterministic limitation naming what CAN be asked
```

**Nothing returns null.** Returning null handed the request to the caller, which
dispatches the model — so an unsupported request became unrestricted generated
prose. Every request now resolves to a deterministic outcome.

Equally, **a reject-all assistant is not a correct answer boundary.** The text
box must stay useful for the supported intents: greeting and capability help,
selected check-in explanation, and bounded guided reflection and next steps. The
limitation reply therefore names what can be asked instead of only refusing.

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

#### Which language the escalation is written in (AUD-10)

The escalation reply is selected by **UI locale**, not by the language of the
user's message. `routeRequest` reads `request.locale`; through the host seam that
locale comes from the prompt header directive `Reply in es `, which is the
interface language. Build 604 does the same thing — `fast-guided.js` computes
`var spanish = prompt.indexOf('Reply in es ') >= 0`, and
`grounding/IMPLEMENTATION.md` states the supported set as *"English and Spanish
**UI locale**"*.

This is a deliberate decision, recorded rather than silently inherited:

- **Kept**, because locale is an authenticated property of the session, while
  message language would have to be inferred from the user's text. Language
  detection on a short, code-switched, possibly clinical sentence is exactly the
  kind of inference this contract forbids elsewhere, and a wrong guess would
  route a person to care instructions in a language they may not read.
- **The consequence is real and is not resolved by this decision.** A user who
  writes `me duele el pecho` in an English-locale session receives the English
  escalation copy. The risk screen itself is bilingual and matches the Spanish
  markers correctly — only the reply language follows the interface.
- **This is therefore part of the existing clinician-review gate above, not a
  separate one.** The qualified reviewer must decide whether escalation copy in
  the interface language is acceptable, or whether the escalation reply alone
  should be bilingual regardless of locale. Until that review, the wording is an
  engineering placeholder in both languages.

No language-detection heuristic is added here. Adding one to the escalation path
would be a clinical decision made by inference, and it is not this repository's
to make.

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
9. **Record content is data, never instructions.** Only a value matching its
   field's strict shape may be rendered — an aspect as an integer 1–5, and a date
   that is a **real calendar date**, not merely `YYYY-MM-DD`-shaped. `2026-99-99`
   matches the shape and is rejected. Leap years are evaluated properly. The
   stored record is never modified to make a value pass; an impossible value is a
   finding about that record.
10. **Every displayed claim is bound.** The rendered answer states the date, so
   the date is returned among the authorized bindings alongside the aspect
   ratings — five bindings, not four.
11. **A malformed selection is controlled, never thrown.** Entries that are not
   usable records are dropped; a thrown error would escape the deterministic
   contract and leave the caller free to fall back to open generation. A usable
   record among malformed entries is still honoured, and no diagnostic text
   reaches the reply.
12. **Missing is not zero.** They are distinct states and are never conflated.

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

### Routing and mixed clinical intent — measured, 18 September 2026

Every row is **measured**, not predicted: the suite runs the frozen 604 helper
and the candidate over the same input and asserts both. `repaired` means they
differ; `control` means the baseline is already correct and must not regress.

`null` in the candidate column would mean the request fell through to the caller,
and therefore to unrestricted model generation. **No candidate row is `null`.**

| # | Input | Locale | Baseline (frozen 604) | Candidate | Classification |
| --- | --- | --- | --- | --- | --- |
| R1 | `Hello` | en | `welcome` | `welcome` | control |
| R2 | `Hola` | es | `welcome` | `welcome` | control |
| R3 | `¡Hola!` | es | `null` | `welcome` | **repaired** |
| R4 | `¿Qué puedes hacer?` | es | `null` | `welcome` | **repaired** |
| R5 | `Qué puedes hacer?` | es | `welcome` | `welcome` | control |
| R6 | `¿Cómo está mi check-in?` | es | `null` | `checkin-select` | **repaired** |
| R7 | `Cómo está mi check-in?` | es | `checkin-select` | `checkin-select` | control |
| R8 | `Can you explain my check-in?` | en | `null` | `checkin-select` | **repaired** |
| R9 | `   hola   ` | es | `welcome` | `welcome` | control |
| R10 | `HOLA` | es | `welcome` | `welcome` | control |
| R11 | `¿¿Hola??` | es | `null` | `welcome` | **repaired** |
| R12 | `hola\nqué puedes hacer` | es | `null` | `limitation` | **repaired** |
| R13 | `Por favor, ¿qué puedes hacer?` | es | `null` | `welcome` | **repaired** |
| R14 | `Que puedes hacer` | es | `welcome` | `welcome` | control |
| R15 | `buenas noches` | es | `welcome` | `welcome` | control |
| R16 | `¡Buenas noches!` | es | `null` | `welcome` | **repaired** |
| R17 | `what can you do please` | en | `null` | `welcome` | **repaired** |
| R18 | `I read an article about check-in kiosks at the airport` | en | `null` | `limitation` | **repaired** |
| R19 | `hola amigo, tell me a story about the sea` | es | `null` | `limitation` | **repaired** |
| M1 | `What should I do about severe chest pain during my check-in?` | en | `checkin-select` | `out-of-scope-clinical` | **repaired** |
| M2 | `¿Qué hago si tengo dolor de pecho fuerte en mi check-in?` | es | `null` | `out-of-scope-clinical` | **repaired** |
| M3 | `Should I stop taking my medication before my check-in?` | en | `null` | `out-of-scope-clinical` | **repaired** |
| M4 | `During my check-in I felt calm` | en | `null` | `limitation` | **repaired** |
| M5 | `My check-in mentioned I read about chest pain` | en | `checkin-select` | `out-of-scope-clinical` | **repaired** |
| M6 | `I do not have chest pain, how is my check-in?` | en | `null` | `out-of-scope-clinical` | **repaired** |
| M7 | `Hello there, I have a question about my medication` | en | `null` | `out-of-scope-clinical` | **repaired** |
| M8 | `¿Cómo está mi check-in? También tengo dolor de pecho` | es | `null` | `out-of-scope-clinical` | **repaired** |
| M9 | `Hola. Tengo dolor en el pecho.` | es | `null` | `out-of-scope-clinical` | **repaired** |
| M10 | `¿Qué puedes hacer? Me duele mucho el pecho` | es | `null` | `out-of-scope-clinical` | **repaired** |
| M11 | `Take my meds?` | en | `null` | `out-of-scope-clinical` | **repaired** |
| M12 | `my head hurts badly` | en | `null` | `out-of-scope-clinical` | **repaired** |
| M13 | `me duele la cabeza` | es | `null` | `out-of-scope-clinical` | **repaired** |
| U1 | `Explain my check-in` | en | `checkin-select` | `checkin-select` | control |
| U2 | `Help me choose a step today` | en | `null` | `step-select` | **repaired** |
| U3 | `Who is Pocket LUCA AI?` | en | `null` | `welcome` | **repaired** |
| U4 | `what is the capital of France` | en | `null` | `limitation` | **repaired** |
| U5 | `write me a poem` | en | `null` | `limitation` | **repaired** |

**U1–U3 are the application's own shipped quick-action buttons**, traced from
`Solaris-Android-R4/ui/sanctuary.html` and `sanctuary.compact.html`, where a
quick action dispatches `send(a.slice(4))` on an `ask:`-prefixed payload. The
three payloads are `Explain my check-in`, `Help me choose a step today` and
`Who is Pocket LUCA AI?`. Two of the three previously fell to the limitation
reply, so the app answered its own buttons with "I cannot answer that".

The literal word `Reflect` is **not** a payload the UI sends; `Reflect on my
step` is an adjacent label and is supported as a step form. Finding SP-CHAT-03
was investigated at the UI before any behaviour was changed.

One earlier prediction was wrong and was corrected to measured behaviour: for
**M5** the baseline returns `checkin-select`, not `null`, because `my ` satisfies
its question prefix while `check-in` appears as a substring.

**M6** and **M5** are both routed out of scope. This is deliberately
conservative: the screen does not try to decide that a negated or historical
symptom mention is safe. Distinguishing them needs qualified clinical review,
not a cleverer matcher.

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
