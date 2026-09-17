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
python3 tools/repo-check.py          # human-readable
python3 tools/repo-check.py --json   # machine-readable
```

Requires Python 3.9+ and, for the JavaScript parse checks, Node.js. If Node is
absent those checks report `SKIPPED` — which is **not** a pass.

| Check | Scope |
| --- | --- |
| `import-integrity` | Every tracked file under an imported root matches `docs/provenance/REPO-IMPORT-MANIFEST.json` by size and SHA-256, and nothing extra appears there |
| `excluded-path-policy` | Private phone evidence, host disassembly, build inputs, `node_modules` and binary/archive inputs stay untracked |
| `json-parse` | Every tracked `.json` file parses (JSONC permitted for `devcontainer.json`/`tsconfig.json`) |
| `yaml-parse` | Every tracked `.yml`/`.yaml` file parses. Reports `SKIPPED` — not a pass — if PyYAML is absent |
| `python-syntax` | Every tracked `.py` file compiles (syntax only — this is not a linter and not a security check) |
| `javascript-syntax-authored` | Current authored JS in `Solaris-Android-R2/`, `R3/`, `R4/` and `Solaris-Android-Reconstruction/src/reconstructed/` parses with `node --check` |
| `javascript-parse-evidence` | Retained recovered/probe JS parses. Reported as **informational**: a failure here is a finding to triage, never a reason to edit imported bytes |
| `doc-links` | Relative Markdown links in this repository's authored docs resolve |
| `secret-pattern-scan` | Credential-shaped filenames and key-material patterns. A filename/regex sweep is **not** a complete secret audit |

### Result recorded for this import

Run on the bootstrap candidate tree, 17 September 2026, 1,917 tracked files:

```text
PASS  import-integrity            (1,879 manifest entries verified)
PASS  excluded-path-policy
PASS  json-parse                  (481 files)
PASS  yaml-parse                  (3 files)
PASS  python-syntax               (74 files)
PASS  javascript-syntax-authored  (185 files)
INFO  javascript-parse-evidence   (20 files, 1 finding: AND-IMP-01)
PASS  doc-links
PASS  secret-pattern-scan
Overall: PASS
```

`AND-IMP-01`: `solaris-603-native-probe/recommended-request-builder.cjs` is
truncated in the imported evidence. It was preserved unrepaired. See
[`workflow/STATUS.md`](workflow/STATUS.md).

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
