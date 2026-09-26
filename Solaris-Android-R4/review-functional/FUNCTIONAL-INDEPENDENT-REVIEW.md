# Independent functional and bytecode review — build 604

Decision: **APPROVE the exact candidate below for the bounded functional scope described here.** The reviewer did not write production source, patch plans, UI or packaging code. Reviewer changes are confined to `R4/review-functional`. APK packaging/signing and Android acceptance remain separate gates.

- Candidate HBC SHA-256: `30be9989cc00299836715cc3de5cf3a2a75b00019bdf2f1b91629205f558d8b3`
- Candidate length: 30,800,788 bytes.
- Reference 603 HBC SHA-256: `b8ac7d1b58d9e8ea6eadd25de516e35842aea14e4b849462664bb3200fedc990`
- Reviewed helper SHA-256: `100a7ce8045aa1ec64d554715eb0980d7379afb2c78cc6441ae424900a5c0369`
- Reviewed patch-plan SHA-256: `7025545b9117d3cb28d4cda1f8e6ba3762a35f2e460c6508bd956663df04430f`
- Compact UI SHA-256: `82f96bdb87f16cd40cf84e51987ed4442fe444bd39ec82de29fff75eac334831`

A later change to candidate bytes invalidates this exact-artifact approval. Renaming or copying identical bytes does not.

## Independently executed checks

| Check | Result | Evidence |
| --- | --- | --- |
| Actual-Hermes open-chat regression | 94/94 pass | `evidence/daily-tests-candidate02/result.json` and provenance |
| Actual-Hermes guided receipt and deferred-MAC revocation cases | 15/15 pass | `evidence/guided-races-candidate02/result.json` and provenance |
| Adversarial source-helper classification | 8/8 pass | `evidence/helper-adversarial.json`, runnable `helper-adversarial.cjs` |
| Independent binary comparison and instruction validation | Pass | `evidence/candidate02-structure.json`, runnable `inspect-bundle.py` |

The 94-case regression reuses the retained R3 test definitions but changes exact `Hello` requests to an ordinary open-chat request. This is necessary because Hello now intentionally bypasses generation. Parser rejection, finite diagnostics, cancellation, selected-source authorization, source mutation, numeric grounding, recent-context scope, record IDs, operation idempotence and persistence expectations remain exercised in actual APK methods. The new 15-case suite uses deferred promises to pause at native receipt MAC, then revokes each authority boundary before resuming.

Actual APK DailyService/compiler/parser/permission/queue/persist JavaScript runs in matching desktop Hermes with startup suppressed. Native model and vault interfaces are synthetic. These checks neither touch a real vault nor measure phone latency, native persistence or Android lifecycle scheduling.

## Findings resolved

1. Candidate01 could commit after an authority-only change while awaiting receipt MAC. Independent tests reproduced this for both guided and model replies. The final F14904 guard rechecks current authority after MAC and rejects null/changed state before the retained epoch, source, local-grant and session checks. Both reproductions now reject with no saved conversation/receipt.
2. The first helper inferred a check-in from any rating field and echoed an arbitrary date string. Direct adversarial input demonstrated instruction text being copied into the purported date. The final helper requires the actual questionnaire category, source-record ID form, exact date-plus-four-aspect field shape, bounded numeric/null ratings and a strict date string format. Unrelated categories, different source IDs, arbitrary extra text, instruction-bearing dates and missing rating fields fall back to source-selection guidance. This was a defensive classification defect; no current-vault exploit was established.

## Production path review

- F14890 still performs the original migration, input and selected-source permission validation before classifying a task. Legacy return behavior remains unchanged. It does not select additional sources or read extra records.
- F6929 adds one branch after the preflight return. A guided result skips the optional model-preparation block and reaches the original operation-token equality and `inputAllowed` checks. A null result keeps the original model-load path. This statement is based on instruction/control-flow review; any separate bridge fixture is additional evidence, not included in the 109 execution-test count above.
- F14894 classifies the compiled, selected task after creating the original current-source predicate. Guided replies keep mode `rules`, zero content events and original final validation/persistence flow. Generated open chat, output parser, diagnostics and asynchronous cancellation stay intact.
- F14904 now derives `validated-template` versus `validated-generated-response` from actual mode, so a predefined answer never becomes evidence of model inference. Guided receipts have null model/hash, zero content events and preserved source/authority provenance. The added post-MAC authority check also protects the retained model path.
- The original caller frames and implicit-call argument relocation were reviewed. Scratch registers remain outside original frames; the final largest frame is127, within the compact limit. Independent parsing validates every changed function's register operand and relative branch target, plus43 exception handlers.

Exactly four function headers/bodies and UI string12364 differ. All15,509 other function headers/bodies, all other strings and all original bytes outside the four headers, file-length field and fixed UI slot are byte-identical to603. In particular,603 QVAC request construction/output-limit handling,602 dispatch guards, the model worker, native/vault interfaces and host lifecycle functions are unchanged.

## UI and lifecycle scope

The separately authored `latency/UI-INDEPENDENT-REVIEW.md` approves the exact compact UI above with15 new cases per source form. This reviewer also inspected completion attribution, source selection, transient-notice ownership, private-hide clearing and the numeric return-to-chat marker. Selected sources are still explicit; no source/grant is silently added. A guided answer does not establish model proof.

Returning to saved chat is a navigation repair. Backgrounding still cancels generation and locks private state; an unsaved question is cleared and must be sent again after unlock. The public numeric marker contains no private text, source IDs or replay credentials. It may cosmetically return a replacement owner to chat; that does not expose the old owner's records or dispatch an old request. Full durable pending-turn recovery and continued background inference are not implemented.

## Practical limits

The eliminated model work applies to the specifically recognized guided questions. General open chat retains the same tiny model, prompt and token caps, and may remain slow, vague or inaccurate. The routing is not a general truth detector for every personal question. Selected check-in replies quote recorded ratings and ask a bounded reflection question; they do not infer health causes, diagnoses or hidden personal facts. No universal sub-second response claim or phone benchmark is supported.

No remaining blocking functional finding was identified for this exact artifact within these bounds. Release still requires independent APK payload/package/signature verification and a clear report of the untested device behavior.
