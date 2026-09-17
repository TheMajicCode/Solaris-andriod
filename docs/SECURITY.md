# Security

## Reporting

This repository is **private**. Report a suspected vulnerability privately to the
repository owner through the channel you already use with them — do not open a
public issue, and do not include exploit details, credentials or patient data in
an issue or PR body.

No security contact address, response-time commitment or disclosure policy is
invented here. When the owner establishes one, it replaces this paragraph.

## Known limits — state of the audit

There has been **no completed security audit**. What exists is:

- The dated 604 handoff's bounded functional, UI, bridge and packaging checks,
  within their stated boundaries. These are not a security audit.
- This repository's `tools/repo-check.py`, which verifies imported bytes and
  parses tracked text. Its `secret-pattern-scan` is a filename and regex sweep,
  **not** a complete secret audit.

Outstanding from [`handoff/PRODUCTION-GATES.md`](../handoff/PRODUCTION-GATES.md):
scoped source and static analysis, a dependency and license inventory, a proper
secret scan, reviewed tool provenance, and triage of findings that affect actual
shipped code. Scan results alone do not prove safe behaviour.

GitHub code scanning on private repositories has plan and licensing
requirements. Availability must be **verified**, not assumed — nothing here
promises that CodeQL will run. Compatible local or manual scanners and retained
reports can still support the first audit.

## Key and data handling

Four key lifecycles are distinct and must never be derived from one another:
health-vault recovery, identity credentials (Subject ID), wallet recovery, and
the Android signing identity. See [Data and consent](DATA-AND-CONSENT.md).

The preserved 604 certificate (SHA-256
`fac61745dc0903786fb9ede62a962b399f7348f0bb6f899b8332667591033b9c`) matches a
**development fixture, not a private production signer**. Do not silently replace
it, generate new keys, or assume an existing install will accept a different
signer. A production signing and upgrade/distribution strategy is deliberate
work, not an automatic key rotation.

Never commit, log, upload or place in a model prompt: patient records, production
credentials, signing keys, wallet seeds, recovery phrases, raw vaults or personal
phone evidence. Private phone evidence from the 604 handoff is deliberately
excluded from this repository, and its exclusion class is recorded without
reproducing sensitive filenames or health-linked digests.

## CI security posture

- Workflows request `contents: read` only.
- No third-party actions are used. If one is ever added, pin it to a full
  verified commit SHA.
- No secrets are referenced by any workflow in this repository. No signing keys
  in ordinary PR CI.
- Any future artifact-upload job must be separated from untrusted PR execution.

## What a passing check does not mean

A green `tools/repo-check.py` run proves preserved bytes and parseable text. It
does **not** establish application security, licensing clearance, native build
completeness, device behaviour or production readiness. Do not infer safety from
a source archive, a lint result or a green dashboard.
