# R0 independent extraction implementation review

Date: 2026-09-15. Reviewer: independent compatibility-audit agent. Scope: read-only review of `tools/recover_601.py`, its reused `tools/reference_extract_v6.py`, and resulting `src/recovered-601` against the exact selected APK. No recovery/app code was changed. No app execution, signing, installation or key operation was performed.

## Verdict

**PASS for the bounded extraction of the exact pinned code601 APK.** The reviewed output is a faithful, editable extraction of selected packaged sources and compiled references. It is not original TypeScript/Kotlin, a complete native project, or evidence of source-build compatibility.

No release-blocking defect was found for the exact allowlisted input. Both initial nonblocking findings were addressed in the final implementation. Remaining scope limitations are identified below. Any change to a reviewed script, removal/widening of the input hash gate, or newly generated output requires updated review.

## Reviewed immutable identities

| Artifact | SHA-256 |
|---|---|
| `tools/recover_601.py` | `06bb319dca3b10b47ddaeb811e6e07d533a2afd504e44007137613dfec71fae4` |
| `tools/reference_extract_v6.py` | `a51d84ea5908a2c1b8babe41f39aefdfd40d60923783b5e30d6fa413ccd8fa31` |
| Selected APK, 242,580,679 bytes | `228c3d9f282d716515e3640de2b13478a29e21c607293eaf589741ec6d34f183` |
| Exact Hermes bundle | `ac973292961cc7a1505a47a416ecafdff2e1688b7eac31f20571e503d74ec177` |
| Generated `src/recovered-601/RECOVERY-MANIFEST.json` | `79236faf33bc0121db19d4e481032482345a61eef43d793bd0203bfcc9554852` |

The reference parser hash was independently compared with the supplied ancestor's `extract_verified_apk.py`; they are byte-identical. Its obsolete APK allowlist is not invoked by the new recovery entrypoint: `recover_601.py` explicitly pins code601 and calls only the unchanged HBC96 string parser.

## Checks performed and results

I independently read the ZIP entries and generated manifest, compared each output file, and reconstructed the selected HBC string byte ranges directly from manifest provenance. These checks did not invoke either recovery script or trust reported success from the author's tests. Detailed results are in `R0-REVIEW-VERIFICATION.json`: **29 checks passed**.

- APK exact byte length and SHA-256 matched. SHA-256 remained the same after review.
- All six compiled-reference files match their exact APK entries.
- Hermes SHA-256, declared length and SHA-1 footer match.
- HTML and worker raw byte ranges are in bounds; their recorded raw SHA-256 values match; decoding to emitted UTF-8 and encoding back to the original string encoding is byte-exact.
- HTML preserves **2,681 trailing U+0020 spaces** after its closing tag. `rstrip()` is used to recognize the string; it does not alter stored output. This is important because code601 retained a fixed string allocation when replacing the UI.
- All **1,013 worker files** match their exact packaged byte ranges. Sorted ranges cover worker payload exactly once without gaps or overlap. The header/data boundary agrees with the packaged length prefix.
- Actual worker paths are unique after canonical normalization and contain no repeated slash or dot-segment aliases.
- Both PNG outputs match base64-decoded bytes from the exact recovered HTML. The model notice is now emitted, and its source string range/hash/encoding roundtrip independently verifies.
- Every one of the **1,024 emitted files** has correct recorded size and hash; the manifest covers the complete output tree apart from its own entry, with no extra files or symlinks.

These numbers establish extraction integrity only. They do not establish application behavior, native compatibility, inference or upgrade safety.

## Implementation review

### Strict provenance and bounds

The entrypoint rejects a destination that already exists and rejects any APK not matching the exact known byte length and SHA-256. It separately checks the Hermes SHA-256. The reused parser rejects wrong magic/version/length/footer, out-of-bounds storage/overflow entries and nonreversible string decoding. Selected HTML and worker candidates must be unique.

ZIP member scanning rejects absolute paths, traversal components, backslashes, symlink entries and literal duplicate names. The program does not extract every ZIP entry; it reads six named compiled references. Python ZIP reads also verify each read entry's CRC. Worker parsing enforces version 0, exact header boundary, absolute virtual paths with no parent traversal/backslash, expected file modes, integer offsets/lengths (excluding booleans), nonnegative bounded ranges, literal name uniqueness, and contiguous full data coverage.

The new directory is created with the default `exist_ok=False`; creation fails if the output location became occupied after the initial existence check. Writes are confined to the output tree for the actual validated worker paths. APK and reference source files are opened/read only; there are no subprocesses, package installations, import of recovered worker code, application launches or signing operations.

The parser is intentionally tied to HBC96 and a known byte layout. It should not be advertised as a general Hermes parser. Unknown metadata versions must fail rather than be adapted silently.

### Resolved initial finding R0-1: canonical worker-path aliases

The initial implementation checked only literal worker output-name duplicates. Dot segments or repeated separators could then normalize to one filesystem path. The final reviewed implementation now requires `path.as_posix() == virtual` for worker entries, which rejects the identified aliases; it also adds canonical-path checks to ZIP members. All actual worker paths independently verify as canonical and unique. The exact whole-APK/HBC hash gates remain in place.

The implementation is still intentionally an exact-input recovery tool. It should not be advertised as a general archive extractor or used with widened/removed hash gates without further review. In particular, path safety for the exact input is established here, not arbitrary hostile archive concurrency scenarios.

### Resolved initial finding R0-2: model notice omission

The initial extraction omitted a separate decoded model notice. The final reviewed implementation now emits `model-notice.txt` with string-byte provenance. It matches the exact HBC source bytes after reversible encoding conversion. The complete notice retains its model identity/hash/revision and license text.

A pretty-printed Bare header is not emitted separately, but it is preserved verbatim in the exact worker bundle. Original virtual file modes are recorded in provenance but not applied as host executable permission bits. These are scope limits, not evidence loss. The dependency subtree is not a fully resolved npm installation or the missing native source tree.

### Operational limitation

Failure after output creation can leave a partial new output tree without a manifest. Repeating recovery into that same tree is deliberately rejected. Use a fresh directory; do not weaken that safeguard or silently merge partial output into a successful tree. The reviewed final output tree has a complete manifest and all file hashes verify.

## Remaining gates

Root's targeted extraction tests are separate from this review and should cover input hash rejection, occupied destination rejection, malformed/HBC bounds and output verification. Native decompilation/source reconstruction requires its own review and tests. Nothing in R0 authorizes treating an editable decompiler output, an extracted worker dependency tree or an exact old binary as a compatible new signed source candidate.
