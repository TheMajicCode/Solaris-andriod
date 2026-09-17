# HBC96 integration feasibility — R2

## Verified result

A real executable reference for the recovered host is now available. The exact unchanged code 601 Hermes bundle executes in a Linux Hermes VM built from the Hermes source tag selected by the APK's declared React Native version, `0.81.5`. An analysis-only JSI driver evaluates a prelude, the original HBC, and a postlude in one runtime. It captured **966 original Metro module factories**, including QvacService module `591`, while suppressing application startup requests `[191,3,0]`. No Android application was launched and no phone or vault was accessed.

This clears the previous absence of an executable host-bytecode reference. It does **not** by itself establish an Android repair's behavior, provide a bytecode linker, or clear the signed-candidate compatibility gate.

## Pinned acquisition and build

The APK's recovered `worker-files/package.json` declares React Native `0.81.5`; this is an observed packaged declaration, not a recovered application dependency lock. The official npm tarball for that exact version was downloaded and its registry SHA-512 integrity verified. Its Linux `hermesc` reports HBC **96** and successfully compiles a fixture. The supplied Linux executable is compiler-only: `-exec` explicitly fails. The package contains a macOS VM, which is not executable on this Linux host.

The package's `sdks/.hermesversion` pins:

`hermes-2025-07-07-RNv0.81.0-e0fc67142ec0763c6b6153ca2bf96df815539782`

That exact official Hermes source tag was fetched. The archive SHA-256 is `010e9b2f1c0f668947beb7acfc3510a9b07a2832cac54712405be7055314e59e`; the source's own `git-revision` file contains `158fc46cc9be17940595a8b1de97eaaa308b3f32`. These are different provenance fields and have not been conflated.

The source was built unchanged with GCC 13.3.0, CMake 3.31.6, Ninja 1.11.1.4, Release mode, debugger enabled, Intl disabled, and test-suite targets disabled. The host already provided ICU 74.2 runtime libraries; matching Ubuntu `libicu-dev 74.2-1ubuntu3.1` headers were extracted under the tools directory without a system install. CMake and Ninja wheels were verified against PyPI's SHA-256 metadata. This is a **locally built analysis runtime from pinned official source**, not a claim that its build flags equal those used for the APK's Android native engine.

The npm-provided compiler's HBC fixture executed successfully in the new `hvm`, reporting `bytecodeVersion:96` and the expected result. Commands, logs, downloads and executable hashes are under `evidence/integration-feasibility/`; tool archives and binaries are under `reconstruction-work/r2-tools/` for inclusion in the durable inputs.

Primary references: [React Native 0.81 bundled Hermes documentation](https://reactnative.dev/docs/0.81/hermes), [exact React Native npm release](https://registry.npmjs.org/react-native/0.81.5), [pinned Hermes source](https://github.com/facebook/hermes/tree/hermes-2025-07-07-RNv0.81.0-e0fc67142ec0763c6b6153ca2bf96df815539782). React Native documents pairing its bundled Hermes version with its React Native release; the actual compiler/VM claims above are also backed by local execution evidence.

## Executable reference route

Run from the workspace root:

```bash
reconstruction-work/r2-tools/hermes-runner \
  Solaris-Android-R2/evidence/integration-feasibility/capture-prelude.js \
  Solaris-Android-Reconstruction/src/recovered-601/compiled-reference/assets/index.android.bundle \
  Solaris-Android-R2/evidence/integration-feasibility/capture-probe.js
```

The runner uses public `facebook::hermes::makeHermesRuntime` and JSI `evaluateJavaScript`, provides `print`, explicitly enables the official `MicrotaskQueue` runtime option, and drains microtasks after each input. Exceptions yield nonzero exits. It adds no Android APIs, filesystem APIs or network APIs to JavaScript. It has no real timer implementation; lifecycle fixtures must explicitly supply deterministic timers and report asynchronous failures. Its embedded dynamic library paths point at the recorded local build. Use the hash-checking `run-hermes-reference.py --tools <relocated-tool-root> <inputs...>` wrapper after relocation; it sets `LD_LIBRARY_PATH` to the retained Hermes/JSI libraries. `relocation-probe.json` verifies this route. `rebuild-runtime.py --tools <extracted-tool-root>` provides a relocatable rebuild command sequence for the documented Linux x86-64 ICU74 environment.

The analysis prelude captures module factories using `__d` and suppresses `__r` startup. Original functions, closure environments, register conventions, exceptions and generator semantics then execute in Hermes rather than a hand-written interpreter. QvacService's exact module dependency vector is:

`[38,67,8,9,592,593,599,602,603,604,912,913,914,916,716,918]`

A controlled dependency mock can instantiate module 591 while retaining its compiled class and Babel helper factories. This isolates the real host coordinator from Android interfaces for differential tests. It does not reproduce Android AppState/Bare native event ordering, actual model inference, OS process death or hardware behavior. The root reconstruction tests are responsible for documenting their mocks and comparing observed behavior.

## Why compiling a replacement is not yet integration

| Route | Verified capability | Remaining condition |
|---|---|---|
| Compile reconstructed coordinator with pinned `hermesc` | HBC96 compilation and VM execution work | Reconstructed coordinator needs targeted tests and review; standalone HBC does not replace one function in the original host |
| Execute original coordinator in analysis VM | Original bundle registers 966 factories and exposes module 591 unchanged | Supply and audit bounded mocks; compare baseline behavior and repair behavior |
| Use `-base-bytecode` as a linker | **Rejected by direct fixture test** | It seeds string storage; it does not include the old functions. The resulting fixture prints `undefined` for a function defined only in the base bundle |
| General compiled-module import | Synthetic module/nested-closure graft demonstrated; not used for the application repair | General closure environment and table relocation still require scope-specific proof |
| Append two existing completion-guard bodies | Implemented and structurally verified on a separate HBC analysis copy; official VM parses/registers it | Root independent behavior tests and final artifact compatibility gate remain required |
| Rebuild Android native code from reconstructed source | Not ready | Missing native graph, plugin/wrapper/NDK pins and unresolved native source representations still block a trustworthy full source build |
| Preserve original native and vault binaries and replace a narrowly tested asset | Packaging is feasible in principle and historical code601 evidence exists | Must independently verify the new artifact's exact payload differences, signer/package/manifest compatibility, ZIP/native alignment and changed behavior; it does not recover the complete original editable native source |

The official compiler implementation (`lib/BCGen/HBC/HBC.cpp`, string accumulator and `baseBCProvider` use) agrees with the direct `base-bytecode-probe.json`: base bytecode is used for string-table reuse. Treating that option as a whole-host merge would silently discard existing functionality.

No ready-made, approved existing assembler/linker was found among the initially available pinned tools. `hermes-dec` provides parsing/disassembly/decompilation representations, not a demonstrated HBC96 round-trip writer. The official compiler can emit new bundles but does not expose a verified partial-module replacement command. A new linker/graft is therefore implementation requiring its own scope, independent review and artifact tests; matching the version number alone is insufficient.

## Native build graph and candidate gate

A missing native build graph blocks a full Android source rebuild. It is **not inherently required** to retain the exact original DEX, native libraries, manifest identity, SQLCipher implementation and model-download code in a binary-preserving candidate. Such a candidate can give stronger byte-preservation evidence for the unchanged critical components than recompiling guessed native sources.

However, preservation of native bytes does not prove compatibility of modified JavaScript. Host changes can still alter lifecycle, vault calls, recovery payloads, identifiers, session authority or model admission. A binary-preserving candidate is eligible only after the actual integrated artifact passes the compatibility checks for the changed boundary and untouched critical code is proven identical. A standalone source helper, successful compiler run, or unchanged signer is insufficient.

No APK was patched, assembled, signed or installed by this feasibility work. No vault/key/model file was read or changed. The new analysis tools are separate from application dependencies. The signed-candidate gate remains with the root compatibility assessment and cannot be inferred from this toolchain success.

## Retained evidence

- `compiler-acquisition.json`, `react-native-0.81.5-metadata.json`: exact npm source and integrity.
- `hermes-source-acquisition.json`, `vm-build-prerequisites.json`, `icu-acquisition.json`: pinned tool inputs.
- `vm-configure-command.json`, `vm-build-command.json`, `jsi-build-command.json` and corresponding logs: reproducible commands and results.
- `compiler-probe.json`, `official-vm-probe.json`: actual compilation and runtime compatibility probes.
- `hermes-runner.cpp`, `runner-build.json`: complete editable reference driver and build command.
- `capture-prelude.js`, `capture-probe.js`, `original-hbc-capture-result.json`: unchanged-host factory capture proof.
- `base-probe.js`, `delta-probe.js`, `base-bytecode-probe.json`: demonstrated linker limitation.
- `verified-tool-binaries.json`: SHA-256 and size of every new compiler/VM/runner binary.

## Source fixture compilation added in R2

The native Hermes parser rejects JavaScript class syntax in the reconstructed source. Exact `@babel/standalone 7.28.5` was acquired from official npm and registry SHA-512 integrity verified, with tar SHA-256 `ab51d15b14f07b90a5814ab0060344b2a0ced71c34ec3c0fedda610d47066ed8`. The editable `transpile-hermes-fixture.cjs` applies explicit class, async-to-generator, parameter/destructuring, object-rest/spread, optional-chaining and nullish-coalescing transforms with no loose assumptions or preset target guessing. It refuses to overwrite existing output and records its exact options, input/output hashes and source map. The resulting baseline source fixture compiled using the pinned HBC96 compiler and was accepted by the official-source VM. That acceptance is a syntax/engine probe, not a baseline parity test; the actual parity scenarios remain separately reported. `babel-acquisition.json`, `babel-hermes-probe.json` and generated provenance retain this evidence.

`runner-error-probe.json` verifies that an explicit thrown JavaScript error exits the JSI runner with status 2. Promise rejections must still be surfaced explicitly by asynchronous test fixtures.

The archive and binary lists for durable packaging are `retained-tool-archives.json` and `verified-tool-binaries.json`. Preserve the directory structure below the tools root for the portable runner. Generated build objects and duplicated extracted archives need not be retained when the original tool archives, executable outputs, complete driver source and build commands are all saved.

## Bounded guard-only integration implemented after feasibility review

The root selected a smaller repair that needs no new strings, functions, native code or general module linker: re-check authority immediately before the existing public/private completion dispatch after their awaited provisioner stage. The current implementation is `tools/patch-completion-guards.py`, with complete editable semantic intent in `src/patches/completion-guards.semantic.js`. It only accepts the pinned original code601 HBC hash and writes a separate `.hbc` analysis output.

Replacement bodies for original functions 7314 and 7337 are appended after the original debug section and before a new footer, along with relocated exception tables. The old body bytes remain in place. Within the original byte span, only file length and the two compact 16-byte function headers change. Original function IDs, all other bodies/headers, strings, literals, models, UI/worker source literals and debug bytes are preserved. Relative branch and generator-resume targets and the two exception tables are remapped; no new await is inserted. SourceHash remains the inherited historical field, not a claimed hash of the new source.

The produced analysis HBC is `evidence/guard-patch/completion-guards-analysis.hbc`, SHA-256 `fd8b38bcdd42421c18da4a0b69b2d58906ceddd7c4a2044b34faed51490f4653`. Its structural report is adjacent. Official `hbcdump` parsed both replacements, and the official-source VM captured the same 966 module factories, module591 dependency vector and suppressed startup sequence. Six negative tests verify rejection of altered/truncated inputs, original overwrite, occupied output, output into the recovered reference tree and an APK extension. These are structural/tool boundary results, not release approval.

Independent register/continuation review is in `evidence/guard-patch/INDEPENDENT-INSERTION-REVIEW.md`. The nested synthetic feasibility checks additionally demonstrate general donor-function import and the narrower after-debug body append with a retained exception path in the official VM (`evidence/integration-feasibility/linker-probe/`). Those fixtures do not substitute for the root's tests on the actual changed functions.

This repair closes only the demonstrated post-stage dispatch guard gaps. It does not claim that LUCA's SDK resume/reconciliation problem is solved. The root compatibility assessment owns the signed-candidate decision after independent review and targeted actual-bytecode tests. No APK has been created or signed by this subtask.
