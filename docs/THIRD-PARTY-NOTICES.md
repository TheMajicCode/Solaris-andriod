# Third-party notices

**This is an inventory of what is known and what is unresolved. It is not a
licensing clearance, and no redistribution right is implied by anything in this
repository.**

The repository is currently **public**, at the owner's explicit direction. That
happened **before** the content and licensing review this document calls for.
Retained recovered and third-party material is therefore published while its
redistribution rights remain unestablished — an open exposure, recorded here
rather than presented as cleared.

## Status: unresolved

| Item | State |
| --- | --- |
| Repository-level license | **Not set.** First-party licensing must be resolved by an actual ownership and licensing review. Do not declare the project open source or silently apply a license to recovered or third-party code. |
| Third-party dependency inventory with versions and licenses | **Not produced.** This is `AND-01` work in the [Roadmap](ROADMAP.md). |
| Redistribution rights for retained recovered material | **Not established.** Retained third-party and recovered material remains subject to its existing notices. |
| Tool and model provenance review | **Not completed.** Descriptors exist (see below); the review does not. |

## Retained provenance descriptors

These files were imported from the handoff and record what the original build
depended on. They are metadata — the tools and dependencies themselves are
deliberately excluded from this repository.

| File | Contents |
| --- | --- |
| [`Solaris-Android-Reconstruction/build-inputs/BUILD-INPUTS.json`](../Solaris-Android-Reconstruction/build-inputs/BUILD-INPUTS.json) | Build-input descriptors |
| [`Solaris-Android-Reconstruction/build-inputs/TOOL-PROVENANCE.json`](../Solaris-Android-Reconstruction/build-inputs/TOOL-PROVENANCE.json) | Tool provenance |
| [`Solaris-Android-Reconstruction/build-inputs/packaged-dependencies.json`](../Solaris-Android-Reconstruction/build-inputs/packaged-dependencies.json) | Packaged dependency list |
| [`Solaris-Android-Reconstruction/build-inputs/ui-toolchain/package.json`](../Solaris-Android-Reconstruction/build-inputs/ui-toolchain/package.json) and [`package-lock.json`](../Solaris-Android-Reconstruction/build-inputs/ui-toolchain/package-lock.json) | UI toolchain dependency pins |

## Deliberately excluded third-party material

`node_modules` bundles retained in the full handoff are **excluded** from this
projection — 2,623 files by the import classification. Exact copies and their
notices remain in the complete private backup. Excluding them here does not
remove any obligation attached to them.

The same applies to reference APKs, native libraries, model weights, the pinned
host compiler/parser, the formatter and Android packaging tools.

## Evidence gathered for the 604 evaluation APK (26 September 2026)

While verifying `Solaris-V6.0.4-Grounded-Chat-Candidate.apk`
(`org.solarishealth.edge.recovery`, `6.0.4-preview.grounded-chat` / code 604,
SHA-256 `0e9a66da00cbe128851d981a9f9a3d9a1dbfe653f7a4ced93d638bc4d7d31827`) for
the narrow evaluation-prerelease authorization in
[Artifacts](ARTIFACTS.md), the components bundled in that one binary were
checked against their actual licenses, not assumed by name:

| Component | Evidence | License |
| --- | --- | --- |
| Tether QVAC on-device AI SDK (`@qvac/sdk`, `libqvac-ggml-*.so`) | Fetched upstream `LICENSE` | Apache License 2.0 |
| Holepunch Bare runtime (`bare-kit`, `libbare-*.so` family) | Fetched upstream `LICENSE` (`bare-kit`) | Apache License 2.0 |
| OpenSSL (`libcrypto.so`) | Embedded `ndkports/openssl` build-path strings | Apache License 2.0 |
| Meta `fbjni` (`libfbjni.so`) | Embedded `com.facebook.jni` symbols | Apache License 2.0 |
| Meta Hermes engine (`libhermes.so`, `libjsi.so`) | Embedded engine strings | MIT |
| AndroidX, Kotlin/kotlinx.coroutines | `META-INF/*.version` descriptors, well-established public license (not independently re-fetched) | Apache License 2.0 |
| Expo modules, Meta Fresco image pipeline | File names, well-established public license (not independently re-fetched) | MIT |

No copyleft (GPL/LGPL/AGPL) component was identified in this binary. This
table is evidence for that one artifact's redistribution eligibility. It does
**not** constitute the `AND-01` dependency/license inventory above, which
remains **not produced**, and it does not cover any other build or any source
in this repository.

## Adapters under consideration

None are integrated. Each carries its own licensing and service-terms review
before any code is copied or any component is shipped:

| Adapter | Licensing questions to resolve |
| --- | --- |
| Breez SDK — Spark | SDK license, binding packages, service terms for mainnet operation |
| Tether WDK | Module license, chain/indexer dependencies, service terms |
| BTC Map | Three separate questions: BTC Map's software license, OpenStreetMap data attribution and ODbL obligations, and map-tile terms |

## Rules

- **Preserve every existing notice.** Do not strip, relicense or rewrite
  attribution in retained material.
- Verify the exact chosen component and version before copying code or shipping
  it.
- If redistribution rights are not established for a tool or weight, retain its
  hash and authorized acquisition instructions and report the restore path
  **blocked**.
- Do not treat "it was in the handoff" as clearance to redistribute.
