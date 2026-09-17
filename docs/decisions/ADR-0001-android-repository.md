# ADR-0001 — Android gets its own repository

**Status:** Accepted · **Date:** 2026-09-17

## Context

Solaris Android has its own package identity, signer, private vault, native
dependencies, model runtime, device tests and release lifecycle. The Solaris web
application is a separate product with a separate release scope. The question was
whether Android should live as a long-lived branch or directory inside the web
repository, or as a dedicated repository.

## Decision

Solaris Android lives in its own dedicated repository. The existing Solaris web
repository stays where it is and is **not modified** from here. Ordinary
short-lived branches inside this repository handle imports, audits and features.

## Consequences

**Positive.** Product documentation, issues, dependency history, CI scope and
release ownership have one clear home. Android's native and device
responsibilities do not distort the web product's history. Permissions and
visibility can be governed independently.

**Negative / to manage.** Shared identity, consent, sharing, evidence and receipt
schemas now span two repositories. Physical repository separation does **not**
itself enforce privacy or protocol compatibility. Those contracts must be
explicitly versioned with test vectors on both sides — see
[`contracts/README.md`](../../contracts/README.md) and `AND-05` in the
[Roadmap](../ROADMAP.md).

Sharing the Solaris name gives no product automatic access to another product's
data.

## Repository identity

| Field | Value |
| --- | --- |
| Product | Solaris Android · Pocket LUCA |
| Visibility | **Public**, at the owner's explicit direction. The setup brief recommended private until source completeness, licensing and release readiness were assessed; that assessment is still outstanding. See [THIRD-PARTY-NOTICES](../THIRD-PARTY-NOTICES.md). |
| License | Not set. Resolved by a separate ownership and licensing review. |
| Source roots | `Solaris-Android-R4/`, `R3/`, `R2/`, `Solaris-Android-Reconstruction/`, `handoff/`, `solaris-603-native-probe/` — preserved at their original relative paths |

The public-source decision was taken by the owner ahead of the content and
licensing review. That review remains outstanding and is tracked in
`AND-01`.
