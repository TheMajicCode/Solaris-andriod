# Solaris Android controlled reconstruction — scope R0

Date: 2026-09-15. Scope recorded before implementation. Authority: the owner's current explicit reconstruction instruction. No installation, reset, key change, push or deployment.

## Baseline and decision

Use the newest located and freshly hash-verified artifact, `Solaris-V6.0.1-Sanctuary-Recovery.apk`, code 601, SHA-256 `228c3d9f282d716515e3640de2b13478a29e21c607293eaf589741ec6d34f183`. The attached code 600 APK is its forensic ancestor, not the new build base. The installed phone version is not independently observed.

A fresh complete APK-entry comparison establishes that 600→601 changes only AndroidManifest.xml, assets/app.config and assets/index.android.bundle. DEX and native libraries are identical. The older native analysis therefore applies to those exact bytes. No authored source checkout or native lockfile has been recovered. Reconstructed files must never be described as the lost originals.

## Work authorized and feasible now

1. Recover the actual 601 UI and worker into editable files, with byte provenance and reproduction scripts; retain original binary inputs.
2. Recover additional readable native/host representations where tooling permits. Distinguish exact packaged source, disassembly, decompiler output, and newly authored reconstruction. Preserve decompiler errors as unknowns.
3. Establish a compatibility contract from executed code evidence: package/signer, vault and recovery headers/crypto/storage/aliases, record IDs and receipts, model reuse, voice, Health Connect and native bridge surface.
4. Only implement reconstructed components whose behavior can be checked against reference behavior or sufficiently complete control flow. Preserve unknown critical components as unchanged binary references; do not fill them with permissive stubs or invented schemas.
5. Run targeted positive/negative checks and independent review for each implementation cycle. Bind reviews to file digests. Tests of isolated helpers are not proof of integration into the actual Android coordinator.
6. Preserve all editable reconstruction work, tests, recovered source, available build inputs, exact reference artifacts, manifests, limitations and resume instructions in a self-contained checkpoint.

## Compatibility gates

| Boundary | Current evidence / gate |
|---|---|
| Package | Keep `org.solarishealth.edge.recovery`; no replacement package |
| Signer | Preserved official 601 verification records certificate `fac61745dc0903786fb9ede62a962b399f7348f0bb6f899b8332667591033b9c`; later pinned Expo development-fixture provenance supersedes older “signer unavailable” claims. This is a shared development signer, not proof of exclusive production custody. Fresh signing only after compatibility gates pass. |
| Vault/recovery | Unknown portions block a source-based signed candidate; require exact algorithm, parameters, aliases, filenames, payload shapes, and cross-reader synthetic fixtures. Never initialize over an unreadable existing vault. |
| IDs/history | Preserve stored IDs, ordering, revisions, integrity receipts, identity and session semantics; no recreation/import through new-ID allocation |
| Models | Preserve verified Qwen model manifest, owned storage/publication, valid files and partial transfer identity. No downloads or model operations on the owner's device. |
| Lifecycle | Preserve existing transition queue, cancellation and permission boundaries. No worker auto-resume, admission bypass or uncertain inference replay. Reconstructed host logic needs executable interleaving tests before integration. |
| Voice/Health | Preserve separate voice provider flow; preserve permission/read distinction, missing values and provenance. Synthetic tests cannot establish physical provider behavior. |
| Build | Matching build graph/locks and a reviewable native/host compilation path still need reconstruction and verification. A repackaged APK is not a full source build. |

## Excluded from this reconstruction cycle

New identity roots or key derivation, account linking, GPS settlement/allocation rules, RGB, P2P transport activation, a Pear/React Native rewrite, new downloads, UI redesign and dependency upgrades. The dated Identity/GPS plan informs future boundaries but does not prove those features exist or authorize guessing them into this recovery.

## Stop conditions

No signed candidate while any critical source/format/behavior gate is unknown or fails. Continue useful read-only analysis and bounded reconstruction; report the exact missing evidence. No request for the already failed original ZIP and no additional generic permission checkpoint. Hardware acceptance remains unrun under the explicit no-install constraint.
