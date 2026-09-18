# Self-review of candidate 8db241b — NOT an independent review

**This is a self-review. It is weaker evidence than independent review and must
not be presented as independent, nor as a GitHub approval.**

An independent review of `8db241b` was commissioned and **failed to complete**:
the reviewing agent terminated on a session rate limit (HTTP 429, resets
00:10 UTC). Independent review therefore remains **OUTSTANDING** and is a gate
before any push.

| Field | Value |
| --- | --- |
| Reviewed commit | `8db241b` (findings below were then fixed on top) |
| Reviewer | The same agent that wrote the code — a conflict of interest, stated plainly |
| Independent review | **Not obtained.** Agent failed with a rate limit. |
| Date | 2026-09-18 |

## What was adversarially probed

### Risk screen — attempted bypass to a wellness or greeting answer

20 probes mixing clinical content with supported-intent wording.

**Result: 0 misroutes to wellness or greeting.** F05's core property held.

**But 3 real gaps were found.** These reached `null` — "not the supported
surface", which dispatches the model — instead of the bounded out-of-scope reply:

| Input | Why it was missed |
| --- | --- |
| `Hola. Tengo dolor en el pecho.` | The screen had the fixed phrase `dolor de pecho`, not `dolor en el pecho` |
| `¿Qué puedes hacer? Me duele mucho el pecho` | `me duele … el pecho` is not a fixed phrase |
| `Take my meds?` | `meds` was not a marker |

Never being misrouted to wellness is not sufficient: a clinical request must not
fall through to open generation either. Fixed on top of `8db241b` by adding a
pain-word/body-site co-occurrence rule, so ordinary paraphrase is caught without
enumerating every phrasing, plus the missing lexical markers. Registered as
regression rows `M9`–`M13`, with `M14`–`M16` as false-positive controls proving
the new rule does not fire on ordinary wellness language.

### Answer boundary — attempted admission of non-rendered text

| Attempt | Result |
| --- | --- |
| Rendering + appended claim | rejected |
| Unicode lookalike substitution (Cyrillic `у` for `y`) | rejected |
| Prefix instruction injection | rejected |
| Newline-appended medication imperative | rejected |
| Case-changed rendering | rejected |
| Zero-width space inserted | rejected |
| Empty string / stringified null | rejected |
| `__proto__` and `constructor` as field names | rejected — field not approved |
| Revision type coercion (`'3'` vs `3`) | rejected — strict comparison |
| Whitespace-only variant | admitted, **and the canonical rendering is what is emitted**, not the proposed text |

**0 unexpected admissions.** All registered as regression tests.

## What this self-review did NOT establish

- It is **not** independent. The author reviewed their own work.
- It did not review the checker (`tools/solaris_checks/`) adversarially for
  exception swallowing or coverage gaps beyond the 22 negative controls the
  author also wrote.
- It did not independently re-derive the public exposure scan.
- It did not verify the four pinned Action SHAs against upstream a second time.
- It did not test against the actual DailyService, host bytecode, a real model or
  a device. Every scope limit in the contract still applies.

## Required before push

1. ~~Repository visibility verified private~~ — **superseded.** Public
   continuation is authorized; this is no longer a gate.
2. **Independent** review of the then-current full SHA, covering privacy state,
   import preservation, candidate override rules, CI failure semantics,
   maintained-source coverage and documentation claims.
3. Material findings resolved and affected tests rerun.
