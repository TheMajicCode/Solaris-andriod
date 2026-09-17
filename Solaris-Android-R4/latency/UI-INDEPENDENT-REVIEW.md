# Independent UI review — build 604

Decision: APPROVE the exact UI files below within the synthetic execution scope. This review is independent of implementation: reviewer owned only R4/latency, inspected the patch ledger and source, and wrote additional boundary cases. A later UI change requires rerunning the cases and updating these hashes.

- Readable UI SHA256: `1dd45155ee400b7316d32c30856d2b3394680e98af7148bca29e5610879dbab4`
- Compact UI SHA256: `82f96bdb87f16cd40cf84e51987ed4442fe444bd39ec82de29fff75eac334831`
- Tests: `ui-independent.cjs`, reports `UI-INDEPENDENT-READABLE.json` and `UI-INDEPENDENT-COMPACT.json`.
- Result: 15 independent cases pass on each actual UI script.

The test setup reuses the author's synthetic DOM and test-only exposure seam; the cases are newly authored here. The real HTML script executes, while DOM rendering, Android WebView and native bridge replies are synthetic. This is not a visual browser review, phone performance measurement, native model test or final APK review.

Reviewed behavior:

- A second send while pending does not dispatch again or replace the original request. A source choice made after dispatch cannot mutate the sent request's source array.
- Confirmed guided completion preserves a newer edited draft and does not establish proof that the model generated an answer. Guided replies remain labeled predefined.
- Failure retains the editable draft; runtime polling does not silently retry. An unchanged result does not count as a new completed answer.
- After leaving and returning to chat/source picker, settlement clears pending controls and restores Send. The change removes the stale navigation-ticket condition while retaining private-session and current-request guards.
- Private hide still clears the draft, source selections and inference proof. The return marker contains only a public destination/interruption code. Unlock returns to saved chat without replaying the interrupted request. A late reply from the old private session cannot settle a new request.
- Guided mode respects local AI permission being off. No source is automatically selected; English and Spanish zero-source guidance is present.
- A delayed generic progress timer cannot overwrite an intervening permission error. Its cleanup cannot clear that error. Source inspection confirms chat shortcut actions no longer create generic slow-action notices and other notices clear only their own ownership.

Limits retained and correctly communicated: background generation still stops; unsaved drafts are cleared at lock. The UI explicitly says so rather than claiming the interrupted request survived. The model and vault behavior were not loosened. This UI review does not establish the host's guided-native bypass; that requires the separate host bytecode/DailyService review.

No blocking finding remains for these exact UI hashes.
