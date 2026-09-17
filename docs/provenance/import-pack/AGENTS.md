# Solaris Android source-import instructions

Read README.md and IMPORT-PACK-NOTES.md first. This is a selected source projection of the verified 604 handoff. Do not treat missing binary inputs as corruption of this package or run the old full-handoff inventory check against it.

- Preserve imported application bytes during bootstrap; document new README, governance and CI work separately. Keep source roots and baseline provenance.
- This package does not reconstruct the missing native Gradle/app project. Do not create fake build scaffolding or report a historical test result as a newly executed check.
- Protect package org.solarishealth.edge.recovery, existing signer, subject identity, vault/recovery formats, record IDs and valid models. No data reset, key replacement or automatic dependency upgrade.
- Retain selected-source consent, current authority, foreground, lock and cancellation checks. Use synthetic data; keep patient data and signing/wallet secrets out of Git, logs and prompts.
- Read the user's current task for authority. The accompanying execution prompt permits a bounded private repository bootstrap and reviewed branch/PR work. It does not permit installation, new APK signing, payments, public publication, web-repository changes or deployment. Historical no-push statements describe the earlier handoff and do not cancel a later explicit scoped instruction.
- One writer per path. Review exact file hashes or commits independently, and resolve material findings before pushing. Do not merge the bootstrap PR automatically.
- Use verify-import.py only as a frozen import check. Once intentionally editing source/docs, preserve this baseline and add candidate-specific checks instead of silently refreshing it to conceal drift.
- Keep the complete four-part backup separately. Restore exact external tools/model/APK inputs only for a task that needs them, with hashes and license/privacy review. No automatic installation or execution of archived scripts.
- State tests actually run, checks blocked by missing inputs and known source gaps. Do not infer production readiness from lint or a source archive.

Long product/setup guidance is under setup/. Original handoff documents remain reference evidence and may require files intentionally absent from this projection.
