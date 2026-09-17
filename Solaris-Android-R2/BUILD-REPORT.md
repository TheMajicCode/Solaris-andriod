# Solaris 602 signed candidate — build report

Built on 2026-09-15 from the newest verified retained APK, code 601.

**Outcome:** signed candidate `6.0.2-preview.sanctuary-guards` / code **602**.
It closes two confirmed completion-dispatch admission gaps. The candidate has
not been installed, and no device data, vault keys or model files were accessed
or changed. Nothing was pushed or deployed.

This is an APK-derived binary-preserving increment with complete editable
patch/build/test scripts. It is **not** a complete original-source rebuild or
the full LUCA resume repair.

## Candidate identity

| Field | Verified value |
| --- | --- |
| File | `Solaris-V6.0.2-Sanctuary-Guards-Candidate.apk` |
| Size | 242,580,679 bytes |
| SHA-256 | `01da9f5281f5f92230dcbd64da62484557cc7a0a15e876cc2d99ec7ec3bcd2cd` |
| Package | `org.solarishealth.edge.recovery` |
| Version | `6.0.2-preview.sanctuary-guards` / 602 |
| Signature | APK v2, verified with official Android apksigner |
| Certificate SHA-256 | `fac61745dc0903786fb9ede62a962b399f7348f0bb6f899b8332667591033b9c` |
| Reference APK SHA-256 | `228c3d9f282d716515e3640de2b13478a29e21c607293eaf589741ec6d34f183` |

The signer is the same shared public development identity as code 601. No new
key was generated or substituted. It is separate from the user's vault keys.

## What changed and why

Running the actual original Hermes bytecode reproduced completion dispatch
after an awaited stream stage even when foreground/cancellation state or the
supplied private eligibility predicate had changed.

The public completion generator now invokes its existing operation check just
before dispatch. The private generator re-evaluates its existing predicate and
operation check. Both retain the existing error handling and add no await before
dispatch. A false private predicate follows the existing `CANCELLED/local` path.
The implementation introduces no retry, alternative model, new identity or new
storage format.

The complete patch is editable in `tools/patch-completion-guards.py`, with readable
intent in `src/patches/completion-guards.semantic.js`. Only functions 7314 and
7337 gain guards. All 15,511 other function headers and bodies are unchanged.
The exact patched HBC SHA-256 is:

`fd8b38bcdd42421c18da4a0b69b2d58906ceddd7c4a2044b34faed51490f4653`

## Compatibility and preservation

The signed package contains the same 602 payload entry names as the reference.
Only three payloads differ: the approved Hermes asset, Android manifest version
fields, and matching app.config version fields. The remaining **599 payloads
are byte-identical**, including DEX, resources, native vault/recovery code and
SQLCipher. Original model definitions and the HBC's UI, worker and SDK literal
data are also preserved. All **51 native
libraries** remain unchanged, stored and aligned to 16 KiB.

Package ID, permissions, components, authorities, SDK declarations, backup and
export settings are unchanged. No migration, data reset, ID rewrite, model
redownload, key rotation or replacement of the recovery codec was added.
Existing record and vault identity behavior is preserved by the unchanged
implementation; actual private records were not opened or inspected.

Compatibility approval is limited to these changes and this exact artifact.
It is based on actual-Hermes behavior tests, independent instruction review,
exact payload preservation, manifest comparison and final signature/alignment
verification. It does not claim an on-device upgrade or hardware inference was
tested.

## Targeted tests and independent reviews

- **24 coordinator comparisons and four admission probes** passed on the
  original and modified bytecode in the pinned HBC96 Hermes runtime.
- **17 original-versus-modified completion scenarios** passed: five now deny
  dispatch after revocation/background/cancellation; twelve preserve normal,
  repeated, not-ready, empty-output and SDK-error behavior.
- Successful public/private outputs, public receipts, traces, token handling,
  retained model ID, cancellation cleanup and operation finalization match.
  Private success intentionally evaluates the same predicate once more.
- Writer boundary tests reject unverified input, invalid branch width,
  overwrite attempts and unsupported output paths.
- Independent bytecode and packaging reviews passed before signing. Official
  apksigner and zipalign passed again after signing, followed by independent
  verification of the final signed APK. The final package keeps
  the exact reviewed payloads and existing signer.

The desktop fixtures use synthetic runtime/policy dependencies, a fixed clock
and controlled timers. They do not establish real timer duration, Android
AppState/BareKit event delivery, device-specific inference or actual model
availability. These are recorded limits, not silently replaced with guesses.

Evidence is retained under `evidence/guard-patch/`,
`evidence/apk-packaging/`, and `evidence/SIGNING-GATE-602.json`.

## Editable reconstruction and inputs

`Solaris-602-Editable-Reconstruction.zip` contains the complete previous
reconstruction checkpoint plus this cycle's editable source, patching,
packaging, signing and test code; recovered references; independent reviews;
and build results. `Solaris-602-Build-Inputs.zip` contains the exact baseline
APK, pinned tool archives, required retained tool binaries, parser source,
compiler and previously frozen build inputs. Every archived member is hashed
and checked after packaging; `Solaris-602-SHA256SUMS.txt` covers the deliverables.

These inputs target the documented Linux/Python/Node/Java environment, not a
complete operating-system image. Following the prior signer handoff, raw
keystore bytes and credentials are excluded from downloadable archives. The
same public development fixture remains recoverable through retained pinned
acquisition/verification code, official commit/hash and public certificate.

The editable coordinator reconstruction covers its constructor and 14 methods.
The missing original App.tsx/Gradle/native dependency graph and unresolved
native decompilations remain explicitly unknown. The preserved original APK
and compiled evidence supply the untouched functionality for this build;
they are not mislabeled as recovered editable source.

## Remaining work

Full LUCA SDK lifecycle reconciliation before heartbeat and on cached-worker
reuse remains pending, as does the deferred `step` dispatch race. The new
actual-bytecode test harness and evidence-mapped coordinator provide a concrete
basis for that repair. Its design, including shared transition ownership,
pending-work settlement and compensating suspend, is in
`docs/LIFECYCLE-REPAIR-DESIGN.md`.

Candidate 602 should therefore be understood as the two-guard reconstruction
increment described here, with the original broader lifecycle limitations
still present.
