# Solaris Android · Health Vault & Pocket LUCA

**Your health. Your records. Your choice.**

Solaris is building a personal Health Vault with an optional on-device AI
companion, Pocket LUCA. The goal is to help people bring their health context
together, reflect on the information they choose, and connect with practitioners
through clear, specific permissions.

This repository contains the Android prototype's recovered source, maintained
improvements, tests and engineering evidence. The wider Solaris vision connects
personal health, economic participation and greater sovereignty.

[Product vision](docs/PRODUCT-VISION.md) ·
[Feature status](docs/FEATURE-STATUS.md) ·
[Roadmap](docs/ROADMAP.md) ·
[Engineering status](docs/workflow/STATUS.md)

> **Development preview.** An existing Android 604 prototype is the application
> baseline. Later chat repairs and the refreshed onboarding have separate test
> evidence; they have not been delivered in a new APK. Patient-use and production
> release gates remain open.

## What exists today

| Component | Current state |
| --- | --- |
| **Health Vault · Android 604** | Existing prototype with retained vault, records, check-in and unlock flows. Native components were preserved; their security and recovery are not established by that preservation alone. |
| **Pocket LUCA · Android 604** | Guided replies for recognized questions using selected check-in fields, plus an existing on-device model path. General generated answers can be slow, vague or unsupported. |
| **Bounded chat routing patch · A605 workstream** | A bounded routing repair is proven in a candidate Hermes host bundle with synthetic native/model boundaries: it fits the frozen host's byte budget and passes the original 34 host and 10 lifecycle cases plus 32 targeted proof cases. The full containment router does not fit that budget and is not integrated. No new A605 APK has been built. |
| **Welcome and onboarding candidate** | EN/ES candidate source and browser preview using Solaris's design direction, with 4,220 automated assertions and 34/34 deliberate-defect checks caught. It measures far over the existing host's UI byte budget, so it is **not included** in any APK; integration needs recovered native UI source. |
| **P2P sharing, device sync and Clinic OS** | Planned connections between user-held vaults and practitioner-controlled tools. No verified end-to-end implementation yet. |
| **Economic passport, wallets and GPS rewards** | Planned optional capabilities. No wallet, payment or funded reward capability is claimed for this APK. |

The [feature register](docs/FEATURE-STATUS.md) identifies the evidence and limits
for each capability. Local-first is the architectural direction; it is not a
claim that every proposed feature works offline today.

## Try the Android preview

**A public APK download has not yet been published in this repository.** Check
the [Releases page](https://github.com/TheMajicCode/Solaris-andriod/releases)
for publication status. GitHub's source-code ZIP is not an installable app.

The retained application is **6.0.4-preview.grounded-chat, version code 604**,
package `org.solarishealth.edge.recovery`. Its artifact identity is recorded in
[Artifacts](docs/ARTIFACTS.md), including the narrow, dated authorization to
publish that one unchanged historical build as a labeled evaluation prerelease
once the actual binary can be inspected. An eventual download of that unchanged
APK will not contain the later chat routing repair or the onboarding preview.

Evaluation should use synthetic information on a test device. General chat may
invent personal facts or respond inadequately to clinical questions; a
qualified-clinician review of escalation wording is still open. Do not use this
prototype as a medical decision tool or the only copy of important records.
Backgrounding locks the vault and cancels unfinished generation; unsent drafts
are not durably recovered. See [known limits](docs/FEATURE-STATUS.md) and
[production gates](handoff/PRODUCTION-GATES.md).

## Evidence behind the work

- The historical 604 Hermes host bundle has been reproduced byte-for-byte
  (`30be9989…`), and a bounded routing-patch candidate bundle (`d0e36d6e…`) was
  built through the same verified pipeline and proven against the original host
  and lifecycle cases. See [host reproduction evidence](docs/HOST-REPRODUCTION-EVIDENCE.md).
- Source CI validates import integrity, code classification, syntax and
  candidate regressions across 15 checks, with check registration and coverage
  enforced centrally rather than trusted per-check. See
  [build evidence](docs/BUILD-AND-TEST.md) for the current counts.
- Independent AI review drove multiple rounds of correction on this sprint's
  work — see [the finding dispositions](docs/reports/FINDINGS-DISPOSITION-SPRINT-02.md),
  reconciled against each reviewer's own recorded text. Review status is tied
  to exact commits; passing CI does not replace review, and AI review is
  described as AI review, not a second eligible GitHub account's approval.
- An external audit of a different, unattributed codebase is kept separately
  under its own finding IDs, not merged into this repository's own findings.
  See [external audit status](docs/EXTERNAL-AUDIT-STATUS.md).

See [PR #1](https://github.com/TheMajicCode/Solaris-andriod/pull/1) for the
exact reviewed commits, remote CI runs and merge record, and
[engineering status](docs/workflow/STATUS.md) for the current checkpoint. These
CI workflows validate source only; they do not build or sign an Android
application.

## Where Solaris is heading

The product direction is a user-held Health Vault, an optional local companion,
and consented connections to useful services. Solaris web is intended as a
separate product for discovery and service coordination, in a separate
codebase with its own sign-in; this vault is not designed to send records to
it — that separation is architectural intent, not a verified property of the
live web product. Clinic OS is the planned practitioner endpoint; economic and
sovereignty modules are optional future capabilities.

The next Android milestones are to recover the authored native build project,
integrate the reviewed chat and onboarding work, and verify recovery, lifecycle,
accessibility and model behaviour on devices. The existing host's measured UI
byte budget cannot hold the onboarding candidate as written. Those limits are
documented instead of being hidden behind a build-success claim.

[Products and boundaries](docs/ECOSYSTEM-AND-PRODUCTS.md) ·
[Architecture](docs/ARCHITECTURE.md) ·
[Data and consent](docs/DATA-AND-CONSENT.md) ·
[Native recovery inventory](docs/NATIVE-RECOVERY-INVENTORY.md) ·
[Sovereignty and GPS](docs/SOVEREIGNTY-AND-GPS.md)

## Work with the source

This is a recovered source and reconstruction workspace. Original native
application sources are incomplete: there is no complete Gradle project or
working `gradlew` in this repository, and none should be invented.

Read [AGENTS.md](AGENTS.md) and [Build and test](docs/BUILD-AND-TEST.md), then
install the pinned checker dependencies and run the source checks:

```sh
python3 -m pip install --require-hashes --no-deps -r tools/requirements.txt
python3 tools/repo-check.py
```

Every check now fails closed: a missing required dependency, an empty scope, an
unexpected error or an unregistered defect is a failure, never a green skip.
See [Build and test](docs/BUILD-AND-TEST.md) for the full check list, the
current counts and the companion negative-control suites — the counts move
with every change, so they are deliberately not repeated here.

Preserve the imported source-root paths (`Solaris-Android-R4/`, `R3/`, `R2/`,
`Solaris-Android-Reconstruction/`, `handoff/`, `solaris-603-native-probe/`)
until a separately reviewed change proves moving them breaks no tooling or
evidence link. Open a bounded task branch, establish the baseline, make the
change, run targeted checks and obtain independent review. Record untested
boundaries explicitly. See [Contributing](docs/CONTRIBUTING.md).

Source and documentation belong in normal Git history. Large APKs, model weights,
offline build-input archives and restricted evidence follow
[Artifacts](docs/ARTIFACTS.md). No patient data, production credentials, signing
keys or wallet material may be committed.

Do not infer a working `gradlew`, a full native build, a passing production audit
or device/clinical acceptance from this repository's presence, its merged state,
or a green CI run.

[Contributing](docs/CONTRIBUTING.md) ·
[Security](docs/SECURITY.md) ·
[Artifacts](docs/ARTIFACTS.md) ·
[Third-party notices](docs/THIRD-PARTY-NOTICES.md)

The repository is public. A repository-wide open-source license and complete
third-party redistribution clearance have not been established; preserve all
existing notices.
