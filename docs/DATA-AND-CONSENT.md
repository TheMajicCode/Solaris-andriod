# Data and consent

This is the target contract. Only the selected-source and authority behaviour
marked *working* in [Feature status](FEATURE-STATUS.md) exists in 604.

## Selection, not category permission

**Working in 604:** enabling a context category never silently shares its
records. A chat request uses explicitly selected, currently approved supported
fields. A guided answer quotes the latest selected check-in's non-missing ratings
and nothing else; with no selection, LUCA asks the user to choose Sources.

Any future feature that widens context must keep this property: the user selects
records, the system does not infer them.

## The sharing contract — proposed

Every share identifies four things, all visible to the user before confirmation:

| Element | Requirement |
| --- | --- |
| **Recipient** | A specific, inspectable identity. Not a category, not "any practitioner". |
| **Records or fields** | The exact selection. Not "your vault", not a wildcard scope. |
| **Purpose** | Stated in the user's own terms and bound to the grant. |
| **Duration** | An explicit expiry, with the revocation limits below stated plainly. |

### Revocation has a real limit

Revocation stops **future authorized access**. It cannot guarantee deletion of
information a recipient already copied. The UI must say this, in those terms,
before the user shares — not in a buried policy.

### States must be truthful

Pending, delivered, acknowledged, expired, revoked and failed are different
states. Receipt and access history must describe what actually happened, not what
was intended. A failure must not be shown as a success with a retry pending.

## Authorship and attribution

A personal observation, a lab result, a clinician's signed note and a
model-generated draft must remain distinguishable for the life of the record.

- Clinical authorship belongs to the clinician. Patient consent decisions do not
  edit it.
- Model-generated text is labelled as such and never presented as a record, a
  diagnosis or a clinical order.
- Guided answers are labelled guided. **Working in 604.**

## Metadata and offline freshness

Encryption of content does not conceal metadata. Before any adapter ships,
inventory what each dependency can observe: discovery services, relays, RPC
endpoints, payment providers and map tile servers.

Anything served from cache must disclose its cached status and data age. A stale
answer presented as live is a correctness defect, not a UX detail.

## Export

The user must be able to get their own data out in a form they can read and
restore. Export is part of sovereignty, not a compliance afterthought. Export
must not require a wallet, a network connection to unlock local records or a
reward-program enrolment.

## Key separation — a hard rule

| Lifecycle | Never derived from |
| --- | --- |
| Health-vault recovery | Wallet seed, identity npub, APK signer |
| Identity credentials (Subject ID) | Wallet seed, vault encryption key |
| Wallet recovery | npub, clinical record, APK signer, vault encryption key |
| Android signing identity | Any of the above |

An identity public key is not a wallet seed. A health-data grant never implies
spending permission. Pocket LUCA must not gain spending authority because it can
explain a transaction — it proposes, deterministic code and the user authorize.

## What must never be committed, logged or prompted

Patient records, production credentials, signing keys, wallet seeds, recovery
phrases, raw vaults and personal phone evidence stay out of Git, Actions
artifacts, release assets, issue and PR bodies, ordinary diagnostic logs and
model prompts.

Use synthetic data for every test and demo. Private phone evidence from the 604
handoff is deliberately excluded from this repository; its exclusion class is
recorded in the import manifest **without** reproducing sensitive filenames, user
text or health-linked digests.

Health content, private Subject IDs and revealing health-derived hashes must stay
out of public events, payment memos and blockchain metadata.
