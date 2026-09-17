# Build 604 latency audit and rejected request experiments

Decision: retain the byte-identical build 603 generation request helper. Prioritize bypassing generation for known guided Solaris tasks, with explicit source selection and clear guided labels. Neither changing the tiny model's prompt nor lowering output caps demonstrated a reliable improvement in useful output. No phone latency improvement is claimed by this Linux experiment.

## Evidence and limits

The user's measured wait of30–80 seconds and recording/screenshot wait 84 seconds are real observations. These materials do not isolate model loading, prompt evaluation, generation, Android scheduling, or the host bridge. The build 603 runtime buffers contentDelta events and returns only a finished validated JSON reply; its UI therefore cannot show the generated answer as it arrives. Publishing unvalidated personal text is not a suitable shortcut.

Recovered host code establishes these boundaries:

- F6929 (pseudocode228430–228600) checks snapshot.loaded and calls prepareForUse only when false. Repeated cold loading for every message is not established.
- F7367 (241030 onward) refreshes provisioning state and loads only when the cached model is available; prepareForUse shares existing prepareWork.
- F7278 (238110 onward) reuses modelId when workerReady is true. A genuinely cold load verifies the pinned model file, starts the worker and loads it. Do not bypass verification to save time.
- The actual model config is CPU, ctx_size 2048, gpu_layers 0, predict 256, temp 0.3, reasoning_budget 0, parallel 1. Build603 request overrides predict to 128 without facts and 256 with facts; maxLength 500/700.
- F7337 returns firstTokenMs and latencyMs measured from immediately before provisioner.stage('stream'), after load. No other host references or UI exposes those values. They could support later profiling, but presently cannot explain the phone's wait.
- F7343 validates cancellation/eligibility during streaming, buffers contentDelta events, waits for final completion and then returns the result. Its first-token budget is30 seconds; full completion budget120 seconds; a reply taking80 seconds can therefore be within policy.

The exact addon typed configuration has no supported thread-count field. No invented thread setting or GPU switch was proposed. Increasing parallel is concurrent-sequence capacity, not a per-response speed setting; it allocates resources and splits context. The exact SDK kvCache-enabled path owns on-disk .bin sessions and persisted state; enabling it would change private storage and lock cleanup requirements. Keep kvCache:false for this cycle.

## Exact native experiment

`LATENCY-MANIFEST.json` pins the unchanged603 helper, exact Qwen3-0.6B-Q4_0 GGUF, Linux native addon, SDK source and runner. Model SHA256: 33bcc57074ec7b6eada5a90651ee546ec0c2b271002c22baf9f1b2dd1e8f75cb. All input data are synthetic/public. `prepare-probe.mjs` and `prepare-caps.mjs` invoke the real helper, validate against SDK 0.18.2 request schema, and translate its responseFormat through the exact SDK conversion. `run-probes.py` and `run-caps.py` invoke the existing bare/native-addon runner against that model. Results include raw logs, load timing, prompt/generated tokens and native EOS information.

Thirty native executions: 11 baseline, 8 stricter-prompt+cap proposals, 11 caps-only proposals. All produced schema-shaped JSON and native EOS; this does not establish conversational quality. Ordinary fixtures: English hello, Spanish hola, current name, short prior-turn name recall, approved synthetic check-in, reflection, small-step prompt and capabilities. Stress fixtures: long story, 20 detailed suggestions, Spanish reflection.

| Fixture | Baseline 603 generated tokens | Stricter brief prompt | Caps-only proposal |
| --- | ---: | ---: | ---: |
| Hello |18|18|18|
| Hola |17|20|17|
| Name |11|11|11|
| Prior-turn recall |13|19|13|
| Approved check-in |48|48|48|
| Small-step prompt |35|44|35|
| Reflection |37|34|37|
| Capabilities |16|16|16|
| Long story |58|not run|58|
|20 suggestions |124|not run|81|
| Spanish reflection |51|not run|51|

The stricter prompt requests one specific helpful sentence of at most 25 words. It increases generated tokens on several ordinary questions and retains weak perspective/capability behavior. Rejected.

The caps-only proposal uses predict 96/160 and maxLength 320/400 while preserving the 603 prompt. All ordinary replies remain byte-identical; there is no demonstrated typical generation saving. The long-list stress reply closes valid JSON but ends mid-thought at the character cap. Baseline already exhibits the same failure at its larger cap. Lowering the cap simply makes that deficiency happen earlier. Rejected.

Linux load times range534–1796 ms in this run, with process startup and shared-host contention; they cannot be transferred to Android, and differences among process runs do not support comparative speed claims. No phone emulator/device was used. These tests provide behavior and output-work evidence, not a phone benchmark.

## Recommended 604 behavior

1. Resolve existing supported guided intents directly from currently selected, approved records using the app's supported deterministic path. A native completion count of zero is a defensible work-elimination claim for these specific tasks.
2. For personal questions with no selected approved sources, ask the user to select sources rather than generating personal facts. This can avoid a long generation wait and fabricated personalization at once.
3. Preserve open chat as an explicitly limited local model path. Keep the existing request helper, model, generation caps, cancellation rules and private-storage behavior.
4. Preserve encrypted records and return to saved chat after unlock; the interrupted draft is cleared by the existing private-hide boundary; do not claim continued background generation unless a real background-service design has been implemented and validated.
5. Measure cold versus warm elapsed time and first-token versus full-generation time on the actual phone in the next acceptance cycle. Optimizing a different stage without that evidence would be guessing.

Native experiments and these recommendations are not an independent review of the completed 604 APK. Final routing/native-bypass tests are recorded separately after the UI/host implementation is ready.
