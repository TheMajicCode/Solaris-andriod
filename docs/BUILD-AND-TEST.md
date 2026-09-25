# Build and test

This repository holds a **source projection**, not a buildable Android project.
There is no `gradlew`, no root lockfile and no npm build script, and none may be
invented to make the tree look finished.

Three kinds of check exist and must never be confused.

| Kind | Where it runs | What it proves |
| --- | --- | --- |
| **Source-only repository checks** | Here, in a clone | Imported bytes are intact; tracked text parses; excluded material stayed out |
| **Frozen import-pack verification** | The unchanged extracted transport pack only | The transport projection matched its inventory at extraction time |
| **Reference 604 reproduction** | The restored immutable full reference directory only | The historical 604 build reproduces from its own exact inputs |

## Source-only repository checks — these run here

```sh
python3 -m pip install --require-hashes --no-deps -r tools/requirements.txt
python3 tools/tests/test_repo_check.py          # the checker's own negative controls
python3 tools/tests/test_js_parse_modes.py     # AND-CI-01 controls on the pinned runtime
python3 tools/tests/test_result_aggregation.py # SP-CI-02 result-aggregation invariants
python3 tools/repo-check.py                     # human-readable
python3 tools/repo-check.py --json              # machine-readable on stdout
python3 tools/repo-check.py --report out.json   # write the report, keep the real exit status
```

Requires Python 3.9+, the pinned dependencies above, and Node.js.

### These checks fail closed

A required check that could not do its job **fails**. It never reports a green
skip. Specifically, a check fails when:

- a dependency it needs is unavailable (PyYAML absent, Node absent);
- it examined zero files while its scope says files exist;
- it raised an unexpected exception; or
- it found a defect not registered in `provenance/CANDIDATE-CHANGES.json`.

A genuinely out-of-scope gate — a native Android build, full-reference
reproduction — is reported separately as **BLOCKED**. A blocked gate is never a
pass and is never evidence of an Android build.

| Check | Scope |
| --- | --- |
| `classification-complete` | Every tracked file resolves to one integrity role and one check scope. An unclassified path fails; a new directory never silently inherits informational treatment. |
| `frozen-integrity` | Imported bytes match `provenance/REPO-IMPORT-MANIFEST.json`, or an authorized override in `CANDIDATE-CHANGES.json` whose original and resulting hashes both match. Each imported file's executable flag must match the manifest's. Drift, deletion, a changed mode and reclassification all fail. |
| `candidate-changes-valid` | Every override, declared candidate path and registered inherited defect resolves and still matches its recorded hash. |
| `excluded-path-policy` | Private phone evidence, host disassembly, build inputs, `node_modules`, and binary, archive and model-weight inputs stay untracked. Suffixes are matched case-insensitively. |
| `build-input-exceptions` | Only the five recorded JSON descriptors are re-included under `build-inputs/`, and a binary there would still be ignored. |
| `evidence-not-authored-source` | No tracked path inside an `evidence/` directory resolves to authored-source treatment (AUD-08). |
| `executable-code-scope` | Maintained code keeps its gates (SP2-CHK-01). Retained-evidence is always frozen. Under `candidate/` and `tools/` only that tree's own scope is legal. Every maintained-candidate file is declared in `CANDIDATE-CHANGES.json`. |
| `json-parse` | Every tracked `.json` parses. JSONC is permitted only for `devcontainer.json`/`tsconfig.json`/`jsconfig.json`, and comments are removed by a string-aware scanner that cannot corrupt a URL. |
| `yaml-parse` | Every tracked `.yml`/`.yaml` parses. **Absent PyYAML fails this check.** |
| `python-syntax` | Every tracked `.py` compiles. Syntax only — this is not a lint audit. |
| `javascript-syntax-authored` | Authored and maintained-candidate JavaScript parses, checked under an explicit module/script extension. |
| `javascript-parse-evidence` | Retained-evidence JavaScript parses, except defects registered by exact path and exact hash. An unregistered defect fails. |
| `doc-links` | Relative Markdown links in this repository's authored docs and in `.github/` Markdown resolve, and none escapes the repository. |
| `secret-pattern-scan` | Credential-shaped filenames and key-material patterns. A pattern sweep, **not** a completed secret audit. |
| `candidate-regression-tests` | The maintained-candidate regression suite. `NOT_APPLICABLE` only while no candidate source is classified. |

### Result recorded for this candidate

1,996 tracked files, 15 checks, transcribed from a live run of the
Sprint-02 re-review-fix tree on 2026-09-25. It is not edited by hand. NBR-2 found this
table four rows stale, and the independent review of `b2a6ba8` found it stale
again (S2R-3: 14 rows for 15 checks). Since then `tools/tests/test_repo_check.py`
fails if its check names, their order or the stated check count disagree with
the registry. File counts move with every tracked file, so they are
re-transcribed rather than compared.

| Check | Result | Files |
| --- | --- | --- |
| `classification-complete` | PASS | 1996/1996 |
| `frozen-integrity` | PASS | 1881/1881 |
| `candidate-changes-valid` | PASS | 32/32 |
| `excluded-path-policy` | PASS | 1996/1996 |
| `build-input-exceptions` | PASS | 5/5 |
| `evidence-not-authored-source` | PASS | 1996/1996 |
| `executable-code-scope` | PASS | 1996/1996 |
| `json-parse` | PASS | 484/484 |
| `yaml-parse` | PASS | 2/2 |
| `python-syntax` | PASS | 87/87 |
| `javascript-syntax-authored` | PASS | 74/74 |
| `javascript-parse-evidence` | PASS | 162/162 |
| `doc-links` | PASS | 57/57 |
| `secret-pattern-scan` | PASS | 1996/1996 |
| `candidate-regression-tests` | PASS | 28/28 |

Overall: **PASS**. Companion suites: **49** checker negative controls and
documentation-drift controls, **11** parse-mode controls, **33** result-aggregation
controls, **5,112** candidate assertions (4,220 of them onboarding) — all passing.

Runtime recorded by the checker for this run: Python
3.11.15, Node v22.22.2. CI pins Python 3.12.14
and Node 22.23.2; a local run may legitimately differ, which is exactly why the
executed versions are recorded rather than assumed (`SP-CI-01`).

### Checks fail closed, and that is enforced centrally

`SP-CI-02` showed a check could report `PASS` or `NOT_APPLICABLE` with a
non-empty scope having inspected nothing. Registration, status and coverage are
now validated in `validate_results`, outside the individual checks, because a
check cannot be trusted to police itself:

- every registered check produces exactly one result — missing, duplicated,
  unregistered and self-renamed results are violations;
- the status must be `PASS`, `FAIL` or `NOT_APPLICABLE`;
- counts must be non-negative integers, and examined may not exceed scope;
- `NOT_APPLICABLE` is legitimate only for a genuinely empty scope, and only for a
  check declared optional;
- `PASS` with a non-empty scope requires inspection, and full coverage where the
  check declares it.

Coverage is declared **per check**, not assumed globally — the checks do not
share a meaning for "examined", so a single count-equality rule across all of
them would be wrong.

`AND-IMP-01` — `solaris-603-native-probe/recommended-request-builder.cjs` is
truncated in the imported evidence. It is registered by exact path and hash in
`provenance/CANDIDATE-CHANGES.json`, so it neither fails the run nor hides any
other defect: a second broken evidence file, or any change to this one, fails.

`AND-CI-01` — `node --check file.js` returns success for a `.js` file containing
ESM syntax even when that file has a real syntax error, because Node's
module-syntax detection stops short of a full module parse. An external probe
reproduced this on Node v24.19.0; `tools/tests/test_js_parse_modes.py`
**reproduces it on this repository's pinned Node v22.22.2** for three malformed
ESM cases, so the claim is measured rather than carried over from another
version.

The checker parses each file under an explicit `.cjs`/`.mjs` extension and fails
only when **both** modes fail. The controls assert both directions: six valid
sources (ESM `export`, ESM `import`, dynamic `import()`, CJS `require`,
`exports.fn`, plain script) must **pass**, and five malformed sources must
**fail**. Rejecting valid ESM because it was parsed as CommonJS would not be a
correct fix, and the positive controls exist to catch exactly that.

## Frozen import-pack verification — does not run here

`docs/provenance/import-pack/verify-import.py` verifies the transport pack
against `IMPORT-INVENTORY.json` **in the pack's own unchanged extracted
directory**. It cannot succeed in this repository, and that is correct
behaviour: this repository deliberately adds a new README, governance, CI and
documentation, and relocates the pack's instruction files under
`docs/provenance/import-pack/`.

Do not "fix" it by editing it, moving files to satisfy it, or refreshing its
inventory. Its bytes are preserved as provenance. `tools/repo-check.py` is this
repository's equivalent entry point.

At extraction time it reported:

```json
{ "scope": "frozen-source-import-only", "files_checked": 1878, "status": "PASS", "failures": [] }
```

## Reference 604 reproduction — blocked here

| Requirement | State |
| --- | --- |
| Four `Solaris-Android-604-Handoff-Part-N-of-4.zip` backups and `Assemble-Solaris-604-Handoff.py` | Not present. Held privately outside this repository. |
| Reassembled full ZIP, 1,518,762,347 bytes, SHA-256 `b31177db52d0b041d8dd66ed5e3d3b504ef2448e60b54f8e6a8a436f9a8c0e3d` | Not present |
| Reference APKs, pinned host compiler/parser, formatter, Android packaging and runtime tools | Excluded from this projection |
| Qwen3-0.6B Q4 phone model and the probe model weight | Excluded binaries |
| Working space (supported Linux/NTFS filesystem, ≥ 8 GB) | Environment-dependent |

Restore that reference into a directory **outside** any Git working tree — use a
variable such as `SOLARIS_604_REFERENCE_DIR`, and never repurpose `HOME` or
platform runtime variables. Run the handoff's own verifier and reproduction
harness there. Label the result **reference reproduction**; it does not prove the
correctness of changed repository code.

## Welcome/onboarding candidate tools — not CI gates

The onboarding suites run in CI as part of `candidate/tests/run-all.mjs`. The
three tools below need locally available packages that are **not** repository
dependencies: the TypeScript scanner for size, and Playwright with the
pre-installed Chromium for browser QA. They fail as BLOCKED when those are
absent. `mutation-check` and `measure-size` delete under `--out`, so they refuse
an output directory inside any git work tree. `visual-qa` writes screenshots to
its `--out` scratch directory. `extract-assets` writes the two preview images into
the git-ignored `candidate/onboarding/preview/.assets/` by default.

```sh
node tools/onboarding/mutation-check.mjs --out <scratch>   # reverts 34 guards; each must fail its named assertion
node tools/onboarding/measure-size.mjs  --out <scratch>    # minified size vs the 968-character UI slot
node tools/onboarding/visual-qa.mjs     --out <scratch>    # headless preview matrix, contrast, motion, screenshots
python3 tools/onboarding/extract-assets.py [--source <frozen sanctuary.html>] [--out <dir>]  # hash-verified preview artwork
```

Browser QA is **not** TalkBack, not a device and not the Android WebView. See
[`onboarding/VISUAL-QA.md`](onboarding/VISUAL-QA.md).

## Blocked gates

`tools/repo-check.py` prints all 8 of these on every run, so they can never be
mistaken for passes. This table is transcribed from `BLOCKED_GATES` in
`tools/solaris_checks/checks.py`, not generated. `tools/tests/test_repo_check.py`
fails if its gate names, their order or the count above disagree with the
checker. If they ever do, the checker is right.

| Gate | Why it cannot run here |
| --- | --- |
| `full-reference-604-reproduction` | Needs the four restored Solaris-Android-604-Handoff-Part-N-of-4.zip backups and the reassembled 1,518,762,347-byte reference. Run it there, never here. |
| `frozen-import-pack-verification` | docs/provenance/import-pack/verify-import.py applies to the unchanged extracted transport pack only. This repository intentionally differs from it; frozen-integrity is its equivalent here. |
| `hbc-reconstruction-and-packaging` | Needs the reference APKs and the pinned host compiler/parser/packaging tools from the build-input archives, which are excluded from this projection. |
| `native-android-gradle-build` | No complete original native application/build project exists. The source itself is missing; do not fabricate scaffolding. |
| `on-device-acceptance-and-latency` | Needs a target phone, an installed build and explicit authorization. No APK is built, signed or installed by this repository. |
| `local-model-inference-checks` | The Qwen3-0.6B Q4 phone model and the probe model weight are excluded binaries. |
| `dependency-cve-and-license-audit` | Needs a complete locked dependency graph, which the missing native build graph does not yet provide. |
| `maintained-source-lint` | No pinned lint toolchain is vendored yet. python-syntax and javascript-syntax-authored are syntax checks, not lint. Configuring a pinned linter is task AND-01. |

## Reproducing retained evidence — always in a disposable copy

Several retained tools write their results **into tracked frozen paths, in
place**, with no output flag:

| Tool | Writes to |
| --- | --- |
| `Solaris-Android-R4/review-functional/helper-adversarial.cjs` | `evidence/helper-adversarial.json` |
| `Solaris-Android-R4/tests/ui/chat-ui.test.cjs`, `Solaris-Android-R3/tests/ui/chat-ui.test.cjs` | `UI-TEST-RESULTS.json`, `UI-COMPACT-TEST-RESULTS.json` |
| `Solaris-Android-R4/latency/prepare-caps.mjs`, `prepare-probe.mjs`, `run-caps.py`, `run-probes.py` | `caps-validation.json`, `helper-validation.json`, `caps-native-summary.json`, `native-summary.json` |
| `Solaris-Android-R2/tools/test-completion-guards.py` | `evidence/guard-patch/BEHAVIORAL-RESULT.json` |
| `Solaris-Android-R4/lifecycle/tests/run.py` | `Solaris-Android-R4/lifecycle/evidence/<label>/` |

Reproducing any of that in the working tree silently mutates frozen bytes and
fails `frozen-integrity` on the next run. **A diff in those files is a
reproduction artifact, never an authorized override** — refreshing a baseline
hash to absorb it is exactly what this repository prohibits.

Run reproductions in a disposable copy of the tree, as Sprint-01's host and
lifecycle suites did. The tools themselves are frozen and are not modified.

## Candidate testing for future changes

Historical 604 test results belong to the 604 handoff. When app source is
actually changed, a **separately reviewed candidate harness** is required: it
must use that candidate's source with pinned inputs and its own acceptance
evidence. Reusing the old verifier or presenting baseline results as a candidate
release gate is prohibited. This is `AND-02`/`AND-01` work in the
[Roadmap](ROADMAP.md).
