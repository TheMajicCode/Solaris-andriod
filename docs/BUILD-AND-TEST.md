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
| `frozen-integrity` | Imported bytes match `provenance/REPO-IMPORT-MANIFEST.json`, or an authorized override in `CANDIDATE-CHANGES.json` whose original and resulting hashes both match. Drift, deletion and reclassification all fail. |
| `candidate-changes-valid` | Every override, declared candidate path and registered inherited defect resolves and still matches its recorded hash. |
| `excluded-path-policy` | Private phone evidence, host disassembly, build inputs, `node_modules` and binary/archive inputs stay untracked. |
| `build-input-exceptions` | Only the five recorded JSON descriptors are re-included under `build-inputs/`, and a binary there would still be ignored. |
| `json-parse` | Every tracked `.json` parses. JSONC is permitted only for `devcontainer.json`/`tsconfig.json`/`jsconfig.json`, and comments are removed by a string-aware scanner that cannot corrupt a URL. |
| `yaml-parse` | Every tracked `.yml`/`.yaml` parses. **Absent PyYAML fails this check.** |
| `python-syntax` | Every tracked `.py` compiles. Syntax only — this is not a lint audit. |
| `javascript-syntax-authored` | Authored and maintained-candidate JavaScript parses, checked under an explicit module/script extension. |
| `javascript-parse-evidence` | Retained-evidence JavaScript parses, except defects registered by exact path and exact hash. An unregistered defect fails. |
| `doc-links` | Relative Markdown links in this repository's authored docs resolve. |
| `secret-pattern-scan` | Credential-shaped filenames and key-material patterns. A pattern sweep, **not** a completed secret audit. |
| `candidate-regression-tests` | The maintained-candidate regression suite. `NOT_APPLICABLE` only while no candidate source is classified. |

### Result recorded for this candidate

1,925 tracked files:

| Check | Result | Files |
| --- | --- | --- |
| `classification-complete` | PASS | 1925/1925 |
| `frozen-integrity` | PASS | 1881/1881 |
| `candidate-changes-valid` | PASS | 1/1 |
| `excluded-path-policy` | PASS | 1925/1925 |
| `build-input-exceptions` | PASS | 5/5 |
| `json-parse` | PASS | 483/483 |
| `yaml-parse` | PASS | 2/2 |
| `python-syntax` | PASS | 79/79 |
| `javascript-syntax-authored` | PASS | 64/64 |
| `javascript-parse-evidence` | PASS | 141/141 |
| `doc-links` | PASS | 25/25 |
| `secret-pattern-scan` | PASS | 1925/1925 |
| `candidate-regression-tests` | NOT_APPLICABLE | 0/0 |

Overall: **PASS**. The checker's own negative controls: **22 passed, 0 failed**.

`AND-IMP-01` — `solaris-603-native-probe/recommended-request-builder.cjs` is
truncated in the imported evidence. It is registered by exact path and hash in
`provenance/CANDIDATE-CHANGES.json`, so it neither fails the run nor hides any
other defect: a second broken evidence file, or any change to this one, fails.

`AND-CI-01` — `node --check file.js` returns success for a `.js` file containing
ESM syntax even when that file has a real syntax error, because Node's
module-syntax detection stops short of a full module parse. The earlier checker
inherited that blind spot. The checker now parses each file under an explicit
`.cjs`/`.mjs` extension and fails only when **both** modes fail. A negative
control covers it.

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

## Blocked gates

`tools/repo-check.py` prints these on every run so they can never be mistaken for
passes:

| Gate | Missing input |
| --- | --- |
| `full-reference-604-reproduction` | The four restored backups and the reassembled reference |
| `frozen-import-pack-verification` | Applies to the unchanged extracted pack only |
| `hbc-reconstruction-and-packaging` | Reference APKs and pinned build tools from the build-input archives |
| `native-android-gradle-build` | **The source itself is missing** — not merely an excluded input. Do not fabricate scaffolding. |
| `on-device-acceptance-and-latency` | A target phone, an installed build and explicit authorization |
| `local-model-inference-checks` | The excluded model weights |

## Candidate testing for future changes

Historical 604 test results belong to the 604 handoff. When app source is
actually changed, a **separately reviewed candidate harness** is required: it
must use that candidate's source with pinned inputs and its own acceptance
evidence. Reusing the old verifier or presenting baseline results as a candidate
release gate is prohibited. This is `AND-02`/`AND-01` work in the
[Roadmap](ROADMAP.md).
