# Third-party notices — Solaris Android 604 evaluation APK

Applies specifically to `Solaris-V6.0.4-Grounded-Chat-Candidate.apk`,
242,638,023 bytes, SHA-256
`0e9a66da00cbe128851d981a9f9a3d9a1dbfe653f7a4ced93d638bc4d7d31827`,
package `org.solarishealth.edge.recovery`, version
`6.0.4-preview.grounded-chat` / code 604. This file must accompany the APK
wherever it is redistributed, alongside `SHA256SUMS.txt` and the evaluation
notes. It supersedes the general-purpose license table in
[Third-party notices](THIRD-PARTY-NOTICES.md) for this one artifact; it
does **not** close that document's `AND-01` inventory, which covers the whole
repository and remains open.

This inventory was built from the actual APK — every entry below is either
(a) parsed or extracted directly from the binary, (b) matched against this
repository's own pinned build-input evidence
(`Solaris-Android-Reconstruction/build-inputs/packaged-dependencies.json`,
which records each JS-side package's name, version and the SHA-256 of its
`package.json`), or (c) confirmed against an upstream license file fetched
live and, where the component is version-specific, fetched at the tag
matching the version actually embedded in this binary — never today's list
substituted for the historical one. Every method actually used is named per
row.  Where a claim could not be established this way, it is marked
**unresolved** rather than assumed.

## The corrected omission: Mozilla Public License 2.0 component

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
| Preserve the license notice | Already satisfied — the `NOTICE` file above ships unmodified inside the APK itself. |
| Inform recipients where to obtain the MPL-covered source (§3.2(a)) | This notices package is that notice. Source-availability path below. |

**Verifiable source-availability path, pinned to the version actually
bundled:** the embedded binary literally contains the string `okhttp/4.9.2`
(OkHttp's own runtime version identifier), so the applicable upstream tag is
`parent-4.9.2`. Both files are confirmed present at that exact tag:
<https://github.com/square/okhttp/tree/parent-4.9.2/okhttp/src/main/resources/okhttp3/internal/publicsuffix>.
The original list itself is published at
<https://publicsuffix.org/list/public_suffix_list.dat>. Byte-for-byte diffing
the embedded `publicsuffixes.gz` against that exact historical release
artifact was **not** performed in this task; presence of both files at the
matching version tag is the verification performed here — this is recorded
as an open item below, not claimed as a byte-for-byte match.

**Conclusion for this component:** eligible to redistribute unmodified,
under the two conditions above, both currently met. This does not require
relicensing OkHttp, the surrounding application, or any other Solaris code.

## Corrected framing of the broader eligibility conclusion

The evidence gathered earlier in this task's history (`docs/THIRD-PARTY-NOTICES.md`)
stated "no copyleft (GPL/LGPL/AGPL) component was identified" and an
unqualified redistribution-eligibility conclusion. That omitted the MPL-2.0
component above (a real, if narrow, gap) and did not flag one component whose
own upstream license election could not be confirmed from the compiled
binary (RocksDB, below). The corrected statement: **no reciprocal
(GPL/LGPL/AGPL) copyleft was identified that would require source disclosure
of Solaris's own code; one weak, file-level copyleft component (MPL-2.0) is
present and its two conditions are met; one component's upstream dual-license
election (RocksDB) could not be independently confirmed from the binary
alone.**

## Native libraries (`lib/arm64-v8a/`)

All 51 entries in this directory, as listed by the APK's own central
directory:

| Library file | Component | Version evidence | License | How verified |
| --- | --- | --- | --- | --- |
| `libappmodules.so` | Solaris's own compiled React Native TurboModule/codegen glue | — | **First-party** — not a third-party notice | App's own build output, not an external dependency |
| `libbare-buffer.3.7.1.so` | `bare-buffer` (Holepunch Bare runtime) | 3.7.1 — matches filename and `packaged-dependencies.json` | Apache-2.0 | Sampled (see note below) |
| `libbare-cpu-info.0.1.1.so` | `bare-cpu-info` | 0.1.1 | Apache-2.0 | Sampled |
| `libbare-crypto.1.15.3.so` | `bare-crypto` | 1.15.3 | Apache-2.0 | Upstream `LICENSE` fetched directly |
| `libbare-dns.2.2.0.so` | `bare-dns` | 2.2.0 | Apache-2.0 | Sampled |
| `libbare-fs.4.8.1.so` | `bare-fs` | 4.8.1 | Apache-2.0 | Upstream `LICENSE` fetched directly |
| `libbare-gpu-info.0.1.1.so` | `bare-gpu-info` | 0.1.1 | Apache-2.0 | Sampled |
| `libbare-hrtime.2.1.2.so` | `bare-hrtime` | 2.1.2 | Apache-2.0 | Sampled |
| `libbare-inspect.3.1.10.so` | `bare-inspect` | 3.1.10 | Apache-2.0 | Sampled |
| `libbare-kit.so` | `bare-kit` (Bare runtime host) | not filename-versioned | Apache-2.0 | Upstream `LICENSE` fetched directly |
| `libbare-os.3.9.3.so` | `bare-os` | 3.9.3 | Apache-2.0 | Sampled |
| `libbare-path.3.1.2.so` | `bare-path` | 3.1.2 | Apache-2.0 | Sampled |
| `libbare-performance.2.1.1.so` | `bare-performance` | 2.1.1 | Apache-2.0 | Sampled |
| `libbare-pipe.4.3.1.so` | `bare-pipe` | 4.3.1 | Apache-2.0 | Sampled |
| `libbare-signals.4.2.0.so` | `bare-signals` | 4.2.0 | Apache-2.0 | Sampled |
| `libbare-tcp.2.6.1.so` | `bare-tcp` | 2.6.1 | Apache-2.0 | Sampled |
| `libbare-tls.3.1.10.so` | `bare-tls` | 3.1.10 | Apache-2.0 | Sampled |
| `libbare-type.1.1.1.so` | `bare-type` | 1.1.1 | Apache-2.0 | Sampled |
| `libbare-url.2.5.4.so` | `bare-url` | 2.5.4 | Apache-2.0 | Sampled |
| `libbare-zlib.1.4.1.so` | `bare-zlib` | 1.4.1 | Apache-2.0 | Sampled |
| `libc++_shared.so` | LLVM libc++ (Android NDK) | NDK clang 19.0.0 / 21.0.0 build strings embedded — well after LLVM's 2019 relicense | **Apache License v2.0 with LLVM Exceptions** — the current, primary LLVM Project license (a legacy "University of Illinois 'BSD-Like' / MIT" dual license applies only to the historical libc++ text this LICENSE.TXT explicitly labels superseded, and is not the applicable license for a build this recent) | Upstream `libcxx/LICENSE.TXT` fetched live; its own text distinguishes the current primary license from the "Legacy LLVM License" section |
| `libcrypto.so` | OpenSSL (Google `ndkports` prebuilt) | version not extracted from binary | Apache License 2.0 (OpenSSL ≥3.0) | Embedded `ndkports/openssl` build-path strings |
| `libexpo-modules-core.so` | Expo modules core | Expo SDK 54.0.0 (`app.config`); module-level version not extracted | MIT | Upstream `expo/expo` `LICENSE` fetched; identity confirmed via embedded `expo.modules.*`/`com.facebook.jni` symbols |
| `libexpo-sqlite.so` | `expo-sqlite` | as above | MIT | as above |
| `libfbjni.so` | Meta `fbjni` | not filename-versioned | Apache-2.0 | Upstream `LICENSE` fetched directly; identity confirmed via embedded `com.facebook.jni` symbols |
| `libfs-native-extensions.1.5.1.so` | `fs-native-extensions` (Holepunch) | 1.5.1 | Apache-2.0 | Upstream `LICENSE` fetched directly |
| `libgifimage.so` | Meta Fresco (`GifImage`) | not filename-versioned | MIT | Upstream `facebook/fresco` `LICENSE` fetched; identity confirmed via embedded `com.facebook.animated.gif` symbols |
| `libhermes.so` | Meta Hermes JS engine | inferred: Expo SDK 54 pairs with React Native 0.81.x, which bundles its matching Hermes release — **not independently extracted from this binary** | MIT | Upstream `facebook/hermes` `LICENSE` fetched |
| `libhermestooling.so` | Hermes tooling | as above | MIT | as above |
| `libimagepipeline.so` | Meta Fresco | not filename-versioned | MIT | Embedded `com.facebook.imagepipeline` symbols |
| `libjsi.so` | Meta Hermes/React Native JSI | as above | MIT | Embedded symbols consistent with Hermes/RN |
| `libnative-filters.so` | Meta Fresco | not filename-versioned | MIT | Embedded `com.facebook.imagepipeline.nativecode` symbols |
| `libnative-imagetranscoder.so` | Meta Fresco | not filename-versioned | MIT | Embedded `com.facebook.imagepipeline.nativecode` symbols |
| `libquickbit-native.2.4.8.so` | `quickbit-native` (Holepunch) | 2.4.8 | Apache-2.0 | Upstream `LICENSE` fetched directly |
| `libqvac-ggml-cpu-android_armv8.0_1.so` | `ggml` (ggml-org), wrapped by Tether's QVAC SDK | not filename-versioned; `ggml-org/llama.cpp` GitHub issue/PR URLs and `ggml_*` symbols embedded directly | ggml itself: MIT. QVAC's own wrapper/SDK: Apache-2.0 | Both upstream `LICENSE` files fetched directly; ggml-org identity confirmed via embedded strings |
| `libqvac-ggml-cpu-android_armv8.2_1.so` | same | same | same | same |
| `libqvac-ggml-cpu-android_armv8.2_2.so` | same | same | same | same |
| `libqvac-ggml-cpu-android_armv8.6_1.so` | same | same | same | same |
| `libqvac-ggml-cpu-android_armv9.0_1.so` | same | same | same | same |
| `libqvac-ggml-cpu-android_armv9.2_1.so` | same | same | same | same |
| `libqvac-ggml-cpu-android_armv9.2_2.so` | same | same | same | same |
| `libqvac-ggml-vulkan.so` | same (Vulkan backend) | same | same | same |
| `libqvac__llm-llamacpp.0.45.0.so` | `@qvac/llm-llamacpp` (Tether), wrapping llama.cpp | 0.45.0 — matches filename and `packaged-dependencies.json` | llama.cpp itself: MIT. QVAC wrapper: Apache-2.0 | Both upstream `LICENSE` files fetched directly; llama.cpp identity confirmed via embedded `github.com/ggml-org/llama.cpp` issue/PR URLs |
| `librabin-native.2.0.0.so` | `rabin-native` (Holepunch) | 2.0.0 | Apache-2.0 | Upstream `LICENSE` fetched directly |
| `libreact_codegen_safeareacontext.so` | `react-native-safe-area-context` (AppAndFlow/Th3rdWave) | version not extracted | MIT | Upstream `LICENSE` fetched directly |
| `libreactnative.so` | Meta React Native | inferred React Native 0.81.x via Expo SDK 54's documented pairing — **not independently extracted from this binary** | MIT | Upstream `facebook/react-native` `LICENSE` fetched |
| `librocksdb-native.3.17.4.so` | `rocksdb-native` (Holepunch wrapper around Facebook's RocksDB) | 3.17.4 | Wrapper: Apache-2.0. Underlying RocksDB is **dual-licensed** (GPLv2 *or* Apache-2.0, redistributor's choice, per `facebook/rocksdb`'s `COPYING` and `LICENSE.Apache`) | Wrapper `LICENSE` fetched directly. **Unresolved**: the compiled binary carries no embedded license banner, so which RocksDB option was elected at build time could not be confirmed from the binary alone. Based on the wrapper's own declared Apache-2.0 license and no GPL notice file bundled anywhere in the APK, Apache-2.0 is the applicable election — but this is inference, not a confirmed fact from the artifact itself |
| `libsimdle-native.1.3.9.so` | `simdle-native` (Holepunch) | 1.3.9 | Apache-2.0 | Upstream `LICENSE` fetched directly |
| `libsodium-native.5.1.0.so` | `sodium-native` (Holepunch, wraps libsodium) | 5.1.0 | Wrapper: MIT. Underlying libsodium: ISC License | Both upstream `LICENSE` files fetched directly |
| `libstatic-webp.so` | Meta Fresco (WebP) | not filename-versioned | MIT | Embedded `com.facebook.animated.webp` symbols |
| `libudx-native.1.21.2.so` | `udx-native` (Holepunch) | 1.21.2 | Apache-2.0 | Upstream `LICENSE` fetched directly |

**Sampling note.** Eight Holepunch "Bare"-family packages were individually
fetched and confirmed Apache-2.0: `bare-kit`, `bare-fs`, `bare-crypto`,
`quickbit-native`, `fs-native-extensions`, `udx-native`, `rabin-native`,
`simdle-native`. The other thirteen `bare-*` members above are marked
"Sampled" — their license is inferred from this 8-for-8 consistent result
within the same organization/monorepo family, not from an individual fetch
of each one's own `LICENSE` file.

## Java/Kotlin components embedded in `classes.dex` and `META-INF/`

| Component | Version evidence | License | How verified |
| --- | --- | --- | --- |
| AndroidX (`activity` 1.7.0, `annotation-experimental` 1.4.1, `appcompat`/`appcompat-resources` 1.7.0, `asynclayoutinflater` 1.0.0, `autofill` 1.1.0, `coordinatorlayout` 1.0.0, `core`/`core-ktx` 1.13.1, `cursoradapter` 1.0.0, `customview` 1.0.0, `documentfile` 1.1.0, `drawerlayout` 1.0.0, `emoji2`/`emoji2-views-helper` 1.3.0, `fragment` 1.5.4, `interpolator` 1.0.0, `legacy-support-*` 1.0.0, `loader` 1.0.0, `localbroadcastmanager` 1.0.0, `media` 1.0.0, `print` 1.0.0, `profileinstaller` 1.3.1, `savedstate` 1.2.1, `slidingpanelayout` 1.0.0, `startup-runtime` 1.1.1, `swiperefreshlayout` 1.1.0, `tracing`/`tracing-ktx` 1.2.0, `vectordrawable`/`vectordrawable-animated` 1.1.0, `versionedparcelable` 1.1.1, `viewpager` 1.0.0, `webkit` 1.14.0; `arch.core-runtime` and the four `lifecycle-*` artifacts ship a build-task placeholder string instead of a literal version) | Every version above read **directly from its own `META-INF/androidx.*.version` file physically inside the APK** | Apache-2.0 | Read from the binary itself |
| `kotlinx-coroutines-core`, `kotlinx-coroutines-android` | 1.7.3 (both, read directly from `META-INF/kotlinx_coroutines_*.version`) | Apache-2.0 | Read from the binary itself |
| OkHttp | **4.9.2** — the literal string `okhttp/4.9.2` is embedded in `classes.dex` | Apache-2.0 | Upstream `LICENSE.txt` fetched directly, at the matching `parent-4.9.2` tag for the MPL sub-component above |
| Apache Commons Codec (Beider-Morse phonetic matching rule data, `org/apache/commons/codec/language/bm/*.txt`, 127 files) | **Not established** — no version marker found in the binary | Apache-2.0 | Upstream `LICENSE.txt` fetched directly; component identity confirmed by the presence of its exact resource file set |

## What must accompany this APK when it is redistributed

1. This file (or an equivalent notices package covering the same components).
2. `SHA256SUMS.txt` (the APK's hash).
3. The evaluation and installation notes.
4. Nothing else is required to be bundled with the APK itself — MPL-2.0's
   source-availability condition is satisfied by this document naming the
   pinned upstream location, not by shipping OkHttp's source alongside the
   binary.

## Explicitly unresolved — do not read as cleared

- **RocksDB's elected sub-license** (GPLv2 vs Apache-2.0) is not confirmable
  from the compiled `librocksdb-native.3.17.4.so` alone; see the table above.
- **Exact per-module versions** for Hermes, React Native,
  `react-native-safe-area-context`, Fresco, `fbjni`, and the individual Expo
  native modules were not extracted from the binary; where a version is
  stated it is inferred from the Expo SDK version recorded in `app.config`
  (`54.0.0`) and Expo's own published SDK-to-React-Native pairing, not from
  binary evidence.
- **Exact Apache Commons Codec version** is not established.
- **Thirteen `bare-*` family members'** license is inferred by consistent
  sampling of eight sibling packages in the same project, not individually
  re-fetched.
- **Byte-for-byte diff** of the embedded `publicsuffixes.gz` against the
  exact historical `parent-4.9.2` release artifact was not performed;
  presence of both files at the matching tag was the check performed.
- **The full JS-only npm dependency graph** recorded in
  `Solaris-Android-Reconstruction/build-inputs/packaged-dependencies.json`
  (136 entries) has not had its licenses individually checked component by
  component in this task, beyond the natively-compiled members already
  covered in the native-library table above. That remains part of this
  repository's broader, still-open `AND-01` dependency/license audit.

None of the above is a reason to withhold this APK; each is named so a
reader relying on this file knows exactly what has and has not been checked,
rather than reading a general license table as a completed clearance.
