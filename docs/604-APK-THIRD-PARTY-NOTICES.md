# Third-party notices — Solaris Android 604 evaluation APK

Applies specifically to `Solaris-V6.0.4-Grounded-Chat-Candidate.apk`,
242,638,023 bytes, SHA-256
`0e9a66da00cbe128851d981a9f9a3d9a1dbfe653f7a4ced93d638bc4d7d31827`,
package `org.solarishealth.edge.recovery`, version
`6.0.4-preview.grounded-chat` / code 604.

**This file is the inventory: which component, which version, which
license, what evidence.** It is not itself the required legal text. The
actual license, copyright and NOTICE texts are in
[`604-APK-THIRD-PARTY-LICENSES.txt`](604-APK-THIRD-PARTY-LICENSES.txt), the
plain-text file that must accompany the APK. **Both files, together with
`SHA256SUMS.txt` and the evaluation notes, must accompany the APK wherever
it is redistributed.** A table of license names
or links, on its own, does not satisfy a component's attribution or
notice-preservation requirement — the actual text does. This file
supersedes the general-purpose license table in
[Third-party notices](THIRD-PARTY-NOTICES.md) for this one artifact; it
does **not** close that document's `AND-01` inventory, which covers the
whole repository and remains open.

This inventory was built from the actual APK — every entry below is either
(a) parsed or extracted directly from the binary, (b) matched against this
repository's own pinned build-input evidence
(`Solaris-Android-Reconstruction/build-inputs/packaged-dependencies.json`,
which records each JS-side package's name, version and the SHA-256 of its
`package.json`), or (c) confirmed against an upstream license file fetched
live and, where the component is version-specific, fetched at the tag
matching the version actually embedded in this binary — never today's list
substituted for the historical one. Every method actually used is named per
row. Every previously-sampled or previously-unresolved claim in an earlier
pass through this evidence has since been individually resolved — see
"Corrections in this pass" below — except the items listed in "Explicitly
unresolved," which remain genuinely open and are named precisely rather
than assumed away.

## Corrections in this pass

An earlier pass through this evidence (recorded in `docs/THIRD-PARTY-NOTICES.md`
and an earlier revision of this file) made claims this pass found were
either incomplete or stale:

1. **"Complete notices package" / "nothing else is required" was
   unsupported.** The earlier version of this file was an inventory only —
   it named licenses but did not contain their actual text, copyright
   notices or NOTICE content, which is what a component's license actually
   requires a redistributor to preserve. `604-APK-THIRD-PARTY-LICENSES.txt`
   now contains that text, fetched directly from each project's own
   upstream repository, preserving upstream wording.
2. **Thirteen `bare-*` family members were "sampled," not individually
   verified.** All 25 Holepunch/Bare-family native components — the eight
   previously fetched plus the thirteen previously sampled, plus `bare-kit`
   itself — have now each been individually fetched at their own exact
   bundled version tag (see the native-library table below and
   `604-APK-THIRD-PARTY-LICENSES.txt` Section 1). None remain "sampled."
3. **RocksDB's dual-license election was called "unresolved."** A missing
   build-time election string in the compiled binary is not proof the
   choice cannot be resolved. A verified build-evidence trail (`rocksdb-native`
   v3.17.4's own `CMakeLists.txt` → `holepunchto/librocksdb` commit `1a00e82`
   → `facebook/rocksdb` tag `v10.5.1`) establishes exactly which upstream
   RocksDB revision is vendored, and that revision's own README explicitly
   permits electing Apache-2.0. This repository elects Apache-2.0 for that
   code; see `604-APK-THIRD-PARTY-LICENSES.txt` Section 7 for the full trail
   and the required materials.
4. **The Public Suffix List byte-for-byte diff "was not performed."** That
   was true when written. It has since been performed, twice — once by an
   independent review agent, once directly in this task — against a fresh
   download of both files at the exact upstream tag the embedded
   `okhttp/4.9.2` version string pins. Both files are byte-identical. See
   `604-APK-THIRD-PARTY-LICENSES.txt` Section 5 for the exact hashes.
5. **Two additional bundled components were found and were not previously
   listed at all:** BoringSSL and libuv, both statically linked inside
   `libbare-kit.so`, confirmed via that binary's own embedded build-path and
   runtime-message strings. Both are permissively licensed (Apache-2.0 and
   an MIT-equivalent license respectively); see the native-library table.
6. **AndroidX, the Kotlin standard library and Apache Commons Codec's
   licenses were "well-established, not independently re-fetched."** All
   three have now been individually fetched from their own upstream
   repositories; Commons Codec's own NOTICE file is also now included.

## The Mozilla Public License 2.0 component

Two entries physically present in the APK, reproduced directly from the
binary in this task:

- `okhttp3/internal/publicsuffix/NOTICE` (218 bytes), full text as embedded:

  ```
  Note that publicsuffixes.gz is compiled from The Public Suffix List:
  https://publicsuffix.org/list/public_suffix_list.dat

  It is subject to the terms of the Mozilla Public License, v. 2.0:
  https://mozilla.org/MPL/2.0/
  ```

- `okhttp3/internal/publicsuffix/publicsuffixes.gz` (37,730 bytes) — the
  compiled Public Suffix List data OkHttp ships and loads at runtime.

**License:** Mozilla Public License 2.0 (MPL-2.0). MPL-2.0 is a file-level,
non-viral ("weak") copyleft: per Mozilla's own MPL FAQ, "new files containing
no MPL-licensed code are not Modifications, and therefore do not need to be
distributed under the terms of the MPL" — combining an unmodified MPL file
with proprietary or differently-licensed code in the same binary does **not**
require relicensing the surrounding application. It is not GPL, and it does
not by itself prohibit distribution or require relicensing all Solaris code.

**What MPL-2.0 requires for this exact, unmodified file, and how each is
met:**

| Requirement (MPL-2.0 §3) | How it is met here |
| --- | --- |
| Preserve the license notice | Satisfied — the `NOTICE` file above ships unmodified inside the APK itself. |
| Inform recipients where to obtain the MPL-covered source (§3.2(a)) | Satisfied — see the pinned path below. |

**Verifiable source-availability path, pinned to the version actually
bundled:** the embedded binary literally contains the string `okhttp/4.9.2`
(OkHttp's own runtime version identifier), so the applicable upstream tag is
`parent-4.9.2`. Both files are confirmed present at that exact tag:
<https://github.com/square/okhttp/tree/parent-4.9.2/okhttp/src/main/resources/okhttp3/internal/publicsuffix>.
The original list itself is published at
<https://publicsuffix.org/list/public_suffix_list.dat>.

**Byte-for-byte verification: performed, and identical.** Both the APK's
`NOTICE` and `publicsuffixes.gz` were compared, byte-for-byte, against fresh
downloads of both files at the exact `parent-4.9.2` tag:

| File | APK SHA-256 | Upstream SHA-256 | Result |
| --- | --- | --- | --- |
| `NOTICE` | `8a9c58fb…d5e1876a` | `8a9c58fb…d5e1876a` | Identical |
| `publicsuffixes.gz` | `a1ef3d0e…5bdb12fd` | `a1ef3d0e…5bdb12fd` | Identical |

**Conclusion for this component:** eligible to redistribute unmodified,
under the two conditions above, both met and both verified. This does not
require relicensing OkHttp, the surrounding application, or any other
Solaris code.

## Corrected eligibility conclusion

**No reciprocal (GPL/LGPL/AGPL) copyleft applies to this APK's own code once
RocksDB's Apache-2.0 option is elected** (see `604-APK-THIRD-PARTY-LICENSES.txt`
Section 7 for the verified build-evidence trail). **One weak, file-level
copyleft component (MPL-2.0) is present and both its conditions are verified
met.** This is evidence for this one binary's redistribution eligibility; it
does **not** close `AND-01` (the repository's own full dependency/license
inventory with versions), which remains open exactly as
[Third-party notices](THIRD-PARTY-NOTICES.md) states, and it does **not**
extend to the JS-only dependency graph named in "Explicitly unresolved"
below.

## Native libraries (`lib/arm64-v8a/`)

All 51 entries in this directory, as listed by the APK's own central
directory, plus two components discovered statically linked inside one of
them:

| Library file | Component | Version evidence | License | How verified |
| --- | --- | --- | --- | --- |
| `libappmodules.so` | Solaris's own compiled React Native TurboModule/codegen glue | — | **First-party** — not a third-party notice | App's own build output, not an external dependency |
| `libbare-buffer.3.7.1.so` | `bare-buffer` (Holepunch Bare runtime) | 3.7.1 — matches filename and `packaged-dependencies.json` | Apache-2.0 | Upstream `LICENSE` fetched directly at tag `v3.7.1` |
| `libbare-cpu-info.0.1.1.so` | `bare-cpu-info` | 0.1.1 | Apache-2.0 | Upstream `LICENSE` fetched directly at tag `v0.1.1` |
| `libbare-crypto.1.15.3.so` | `bare-crypto` | 1.15.3 | Apache-2.0 | Upstream `LICENSE` fetched directly at tag `v1.15.3` |
| `libbare-dns.2.2.0.so` | `bare-dns` | 2.2.0 | Apache-2.0 | Upstream `LICENSE` fetched directly at tag `v2.2.0` |
| `libbare-fs.4.8.1.so` | `bare-fs` | 4.8.1 | Apache-2.0 | Upstream `LICENSE` fetched directly at tag `v4.8.1` |
| `libbare-gpu-info.0.1.1.so` | `bare-gpu-info` | 0.1.1 | Apache-2.0 | Upstream `LICENSE` fetched directly at tag `v0.1.1` |
| `libbare-hrtime.2.1.2.so` | `bare-hrtime` | 2.1.2 | Apache-2.0 | Upstream `LICENSE` fetched directly at tag `v2.1.2` |
| `libbare-inspect.3.1.10.so` | `bare-inspect` | 3.1.10 | Apache-2.0 | Upstream `LICENSE` fetched directly at tag `v3.1.10` |
| `libbare-kit.so` | `bare-kit` (Bare runtime host) | not filename-versioned; **not established** (see "Explicitly unresolved") | Apache-2.0 | Upstream `LICENSE` fetched directly. **Also confirmed statically linked inside this binary**, via its own embedded build-path/runtime strings: **BoringSSL** (Google, Apache-2.0) and **libuv** (libuv project contributors, MIT-equivalent) — neither previously listed. |
| `libbare-os.3.9.3.so` | `bare-os` | 3.9.3 | Apache-2.0 | Upstream `LICENSE` fetched directly at tag `v3.9.3` |
| `libbare-path.3.1.2.so` | `bare-path` | 3.1.2 | Apache-2.0 | Upstream `LICENSE` fetched directly at tag `v3.1.2` |
| `libbare-performance.2.1.1.so` | `bare-performance` | 2.1.1 | Apache-2.0 | Upstream `LICENSE` fetched directly at tag `v2.1.1` |
| `libbare-pipe.4.3.1.so` | `bare-pipe` | 4.3.1 | Apache-2.0 | Upstream `LICENSE` fetched directly at tag `v4.3.1` |
| `libbare-signals.4.2.0.so` | `bare-signals` | 4.2.0 | Apache-2.0 | Upstream `LICENSE` fetched directly at tag `v4.2.0` |
| `libbare-tcp.2.6.1.so` | `bare-tcp` | 2.6.1 | Apache-2.0 | Upstream `LICENSE` fetched directly at tag `v2.6.1` |
| `libbare-tls.3.1.10.so` | `bare-tls` | 3.1.10 | Apache-2.0 | Upstream `LICENSE` fetched directly at tag `v3.1.10` |
| `libbare-type.1.1.1.so` | `bare-type` | 1.1.1 | Apache-2.0 | Upstream `LICENSE` fetched directly at tag `v1.1.1` |
| `libbare-url.2.5.4.so` | `bare-url` | 2.5.4 | Apache-2.0 | Upstream `LICENSE` fetched directly at tag `v2.5.4` |
| `libbare-zlib.1.4.1.so` | `bare-zlib` | 1.4.1 | Apache-2.0 | Upstream `LICENSE` fetched directly at tag `v1.4.1` |
| `libc++_shared.so` | LLVM libc++ (Android NDK) | NDK clang 19.0.0 / 21.0.0 build strings embedded — well after LLVM's 2019 relicense | **Apache License v2.0 with LLVM Exceptions** — the current, primary LLVM Project license (a legacy "University of Illinois 'BSD-Like' / MIT" dual license applies only to historical libc++ text this LICENSE.TXT explicitly labels superseded, and is not applicable to a build this recent) | Upstream `libcxx/LICENSE.TXT` fetched live in full, including the LLVM Exceptions clause, in `604-APK-THIRD-PARTY-LICENSES.txt` Section 6 |
| `libcrypto.so` | OpenSSL (Google `ndkports` prebuilt) | version not extracted from binary | Apache License 2.0 (OpenSSL ≥3.0) | Embedded `ndkports/openssl` build-path strings; upstream `LICENSE.txt` fetched directly |
| `libexpo-modules-core.so` | Expo modules core | Expo SDK 54.0.0 (`app.config`); module-level version not extracted | MIT | Upstream `expo/expo` `LICENSE` fetched; identity confirmed via embedded `expo.modules.*`/`com.facebook.jni` symbols |
| `libexpo-sqlite.so` | `expo-sqlite` | as above | MIT | as above |
| `libfbjni.so` | Meta `fbjni` | not filename-versioned | Apache-2.0 | Upstream `LICENSE` fetched directly; identity confirmed via embedded `com.facebook.jni` symbols. No NOTICE file exists upstream (checked directly: 404). |
| `libfs-native-extensions.1.5.1.so` | `fs-native-extensions` (Holepunch) | 1.5.1 | Apache-2.0 | Upstream `LICENSE` fetched directly at tag `v1.5.1` |
| `libgifimage.so` | Meta Fresco (`GifImage`) | not filename-versioned | MIT | Upstream `facebook/fresco` `LICENSE` fetched; identity confirmed via embedded `com.facebook.animated.gif` symbols |
| `libhermes.so` | Meta Hermes JS engine | inferred: Expo SDK 54 pairs with React Native 0.81.x, which bundles its matching Hermes release — **not independently extracted from this binary** | MIT | Upstream `facebook/hermes` `LICENSE` fetched |
| `libhermestooling.so` | Hermes tooling | as above | MIT | as above |
| `libimagepipeline.so` | Meta Fresco | not filename-versioned | MIT | Embedded `com.facebook.imagepipeline` symbols |
| `libjsi.so` | Meta Hermes/React Native JSI | as above | MIT | Embedded symbols consistent with Hermes/RN |
| `libnative-filters.so` | Meta Fresco | not filename-versioned | MIT | Embedded `com.facebook.imagepipeline.nativecode` symbols |
| `libnative-imagetranscoder.so` | Meta Fresco | not filename-versioned | MIT | Embedded `com.facebook.imagepipeline.nativecode` symbols |
| `libquickbit-native.2.4.8.so` | `quickbit-native` (Holepunch) | 2.4.8 | Apache-2.0 | Upstream `LICENSE` fetched directly at tag `v2.4.8` |
| `libqvac-ggml-cpu-android_armv8.0_1.so` | `ggml` (ggml-org), wrapped by Tether's QVAC SDK | not filename-versioned; `ggml-org/llama.cpp` GitHub issue/PR URLs and `ggml_*` symbols embedded directly | ggml itself: MIT. QVAC's own wrapper/SDK: Apache-2.0 (copyright "Tether Data, S.A. de C.V.") | Both upstream `LICENSE` files fetched directly; ggml-org identity confirmed via embedded strings |
| `libqvac-ggml-cpu-android_armv8.2_1.so` | same | same | same | same |
| `libqvac-ggml-cpu-android_armv8.2_2.so` | same | same | same | same |
| `libqvac-ggml-cpu-android_armv8.6_1.so` | same | same | same | same |
| `libqvac-ggml-cpu-android_armv9.0_1.so` | same | same | same | same |
| `libqvac-ggml-cpu-android_armv9.2_1.so` | same | same | same | same |
| `libqvac-ggml-cpu-android_armv9.2_2.so` | same | same | same | same |
| `libqvac-ggml-vulkan.so` | same (Vulkan backend) | same | same | same |
| `libqvac__llm-llamacpp.0.45.0.so` | `@qvac/llm-llamacpp` (Tether), wrapping llama.cpp | 0.45.0 — matches filename and `packaged-dependencies.json` | llama.cpp itself: MIT. QVAC wrapper: Apache-2.0 | Both upstream `LICENSE` files fetched directly; llama.cpp identity confirmed via embedded `github.com/ggml-org/llama.cpp` issue/PR URLs |
| `librabin-native.2.0.0.so` | `rabin-native` (Holepunch) | 2.0.0 | Apache-2.0 | Upstream `LICENSE` fetched directly at tag `v2.0.0` |
| `libreact_codegen_safeareacontext.so` | `react-native-safe-area-context` (AppAndFlow/Th3rd Wave) | version not extracted | MIT (copyright "2019 Th3rd Wave") | Upstream `LICENSE` fetched directly |
| `libreactnative.so` | Meta React Native | inferred React Native 0.81.x via Expo SDK 54's documented pairing — **not independently extracted from this binary** | MIT | Upstream `facebook/react-native` `LICENSE` fetched at the inferred tag `v0.81.4` |
| `librocksdb-native.3.17.4.so` | `rocksdb-native` (Holepunch wrapper) vendoring Facebook's RocksDB at upstream tag `v10.5.1` | 3.17.4 (wrapper) | Wrapper: Apache-2.0. **RocksDB itself: Apache-2.0 elected** — RocksDB is dual-licensed (GPLv2 or Apache-2.0, redistributor's choice); a verified build-evidence trail (`rocksdb-native` v3.17.4's `CMakeLists.txt` → `holepunchto/librocksdb@1a00e82` → `facebook/rocksdb@10.5.1`) established the exact vendored revision, and that revision's own README confirms the election is available. Apache-2.0 is elected. | Wrapper `LICENSE` fetched directly. Full trail, RocksDB's own copyright line, and the required Apache-2.0 materials are in `604-APK-THIRD-PARTY-LICENSES.txt` Section 7. |
| `libsimdle-native.1.3.9.so` | `simdle-native` (Holepunch) | 1.3.9 | Apache-2.0 | Upstream `LICENSE` fetched directly at tag `v1.3.9` |
| `libsodium-native.5.1.0.so` | `sodium-native` (Holepunch, wraps libsodium) | 5.1.0 | Wrapper: MIT (copyright "2016 Mathias Buus and Emil Bay"). Underlying libsodium: ISC License (copyright "2013–2026 Frank Denis") | Both upstream `LICENSE` files fetched directly at tag `v5.1.0` (wrapper) |
| `libstatic-webp.so` | Meta Fresco (WebP) | not filename-versioned | MIT | Embedded `com.facebook.animated.webp` symbols |
| `libudx-native.1.21.2.so` | `udx-native` (Holepunch) | 1.21.2 | Apache-2.0 | Upstream `LICENSE` fetched directly at tag `v1.21.2` |

## Java/Kotlin components embedded in `classes.dex` and `META-INF/`

| Component | Version evidence | License | How verified |
| --- | --- | --- | --- |
| AndroidX (`activity` 1.7.0, `annotation-experimental` 1.4.1, `appcompat`/`appcompat-resources` 1.7.0, `asynclayoutinflater` 1.0.0, `autofill` 1.1.0, `coordinatorlayout` 1.0.0, `core`/`core-ktx` 1.13.1, `cursoradapter` 1.0.0, `customview` 1.0.0, `documentfile` 1.1.0, `drawerlayout` 1.0.0, `emoji2`/`emoji2-views-helper` 1.3.0, `fragment` 1.5.4, `interpolator` 1.0.0, `legacy-support-*` 1.0.0, `loader` 1.0.0, `localbroadcastmanager` 1.0.0, `media` 1.0.0, `print` 1.0.0, `profileinstaller` 1.3.1, `savedstate` 1.2.1, `slidingpanelayout` 1.0.0, `startup-runtime` 1.1.1, `swiperefreshlayout` 1.1.0, `tracing`/`tracing-ktx` 1.2.0, `vectordrawable`/`vectordrawable-animated` 1.1.0, `versionedparcelable` 1.1.1, `viewpager` 1.0.0, `webkit` 1.14.0; `arch.core-runtime` and the four `lifecycle-*` artifacts ship a build-task placeholder string instead of a literal version) | Every version above read **directly from its own `META-INF/androidx.*.version` file physically inside the APK** | Apache-2.0 | Version read from the binary itself; upstream `LICENSE.txt` fetched directly |
| Kotlin standard library | not established from binary evidence | Apache-2.0 | Identified via `kotlin/*.kotlin_builtins` resource files present in the APK; upstream `LICENSE.txt` fetched directly |
| `kotlinx-coroutines-core`, `kotlinx-coroutines-android` | 1.7.3 (both, read directly from `META-INF/kotlinx_coroutines_*.version`) | Apache-2.0 | Version read from the binary itself; upstream `LICENSE.txt` fetched directly |
| OkHttp | **4.9.2** — the literal string `okhttp/4.9.2` is embedded in `classes.dex` | Apache-2.0 | Upstream `LICENSE.txt` fetched directly, at the matching `parent-4.9.2` tag for the MPL sub-component above |
| Apache Commons Codec (Beider-Morse phonetic matching rule data, `org/apache/commons/codec/language/bm/*.txt`, 127 files) | **Not established** — no version marker found in the binary | Apache-2.0 | Upstream `LICENSE.txt` and `NOTICE.txt` (Apache Software Foundation) fetched directly; component identity confirmed by the presence of its exact resource file set |

## What must accompany this APK when it is redistributed

1. This file (the inventory).
2. [`604-APK-THIRD-PARTY-LICENSES.txt`](604-APK-THIRD-PARTY-LICENSES.txt)
   (the actual required license, copyright and NOTICE texts — this file
   alone is not sufficient).
3. `SHA256SUMS.txt` (the APK's hash).
4. The evaluation and installation notes.

MPL-2.0's source-availability condition is satisfied by
`604-APK-THIRD-PARTY-LICENSES.txt` naming the pinned upstream location, not
by shipping OkHttp's source alongside the binary.

## Explicitly unresolved — do not read as cleared

- **`bare-kit`'s own precise bundled version** could not be established with
  confidence — embedded strings include a run of version-like numbers that
  reads more like an embedded changelog than a single build marker. Its
  license (Apache-2.0) is version-invariant, so this affects only the
  version citation, not the license conclusion.
- **`libbare-kit.so` is a 63,082,800-byte aggregate binary.** This task
  confirmed two statically-linked components beyond its own JS-level
  package identity (BoringSSL, libuv). A full, exhaustive audit of every
  component that may be statically linked into this one binary was not
  performed; further such components may exist and have not been ruled
  out.
- **Exact per-module versions** for Hermes, React Native,
  `react-native-safe-area-context`, Fresco, `fbjni`, the Kotlin standard
  library, and the individual Expo native modules were not extracted from
  the binary; where a version was used to select an upstream tag (React
  Native, fetched at `v0.81.4`), that version is itself inferred from the
  Expo SDK version recorded in `app.config` (`54.0.0`), not read from this
  binary's own bytes.
- **Exact Apache Commons Codec version** is not established.
- **The full JS-only npm dependency graph** recorded in
  `Solaris-Android-Reconstruction/build-inputs/packaged-dependencies.json`
  (136 entries) includes roughly 85 packages with no corresponding native
  `.so` file in this APK (for example: `hypercore`, `hyperdrive`,
  `hyperswarm`, `hyperbee`, `hyperdht`, `corestore`, `protomux`,
  `noise-handshake`, `streamx`, `tar-stream`, `zod`). These were not
  individually license-checked in this task, and — more importantly —
  their actual presence and reachability inside the compiled Hermes
  bytecode (`assets/index.android.bundle`) was not independently confirmed:
  `packaged-dependencies.json` records what was in the workspace's
  dependency tree when the app was built, which is not the same claim as
  "this exact file's compiled bytecode contains this exact package's
  code." This remains open, unresolved scope, distinct from — and narrower
  than — this repository's still-open `AND-01` dependency/license audit,
  which covers the whole repository, not just this one binary.
- **No byte-for-byte diff** was performed between any native library above
  and its claimed upstream source, except the OkHttp Public Suffix List
  component, where it was performed twice with an identical result both
  times.

None of the above is a reason to withhold this APK; each is named so a
reader relying on this file knows exactly what has and has not been
checked, rather than reading a license table as a completed clearance.
