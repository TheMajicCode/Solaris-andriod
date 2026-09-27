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

## Evidence gathered for the 604 evaluation APK (26–27 September 2026)

While verifying `Solaris-V6.0.4-Grounded-Chat-Candidate.apk`
(`org.solarishealth.edge.recovery`, `6.0.4-preview.grounded-chat` / code 604,
SHA-256 `0e9a66da00cbe128851d981a9f9a3d9a1dbfe653f7a4ced93d638bc4d7d31827`) for
the narrow evaluation-prerelease authorization in
[Artifacts](ARTIFACTS.md), the components bundled in that one binary were
checked against their actual licenses, not assumed by name. The full,
component-by-component inventory — every native library, the DEX-embedded
Java/Kotlin components, and the one Mozilla Public License 2.0 (MPL-2.0)
component this table originally omitted — is now the dedicated notices
package that must accompany this APK:
[`docs/604-APK-THIRD-PARTY-NOTICES.md`](604-APK-THIRD-PARTY-NOTICES.md).

**Correction (27 September 2026):** this section previously omitted the
MPL-2.0-licensed Public Suffix List data OkHttp bundles
(`okhttp3/internal/publicsuffix/publicsuffixes.gz`, with its own `NOTICE`
file, both physically present in the APK) and stated an unqualified
redistribution-eligibility conclusion. MPL-2.0 is a file-level, non-viral
copyleft — it does not require relicensing the surrounding application — and
both of its conditions (notice preservation, source availability) are met;
see the dedicated notices package for the full analysis and the
version-pinned upstream source location. The corrected conclusion: **no
reciprocal (GPL/LGPL/AGPL) copyleft was identified that would require
disclosing Solaris's own source; one weak, file-level copyleft component
(MPL-2.0) is present and both of its conditions are met; one component's
upstream dual-license election (RocksDB, GPLv2 or Apache-2.0) could not be
independently confirmed from the compiled binary alone** — see the notices
package for what remains explicitly unresolved. This does **not** constitute
the `AND-01` dependency/license inventory above, which remains **not
produced**, and it does not cover any other build or any source in this
repository.

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
