# Product vision

**Solaris Android is the personal, user-held entry point to the Solaris Network:
a health passport with Pocket LUCA, connected through optional adapters to an
economic passport and practical sovereignty tools.**

This document describes intent. [Feature status](FEATURE-STATUS.md) says what
exists. Where the two differ, feature status wins.

"Passport" describes a portable capability and user experience. It is not a claim
of government identity, clinical certification or automatic access to any
service.

## The journey the product is built around

1. **Unlock** — the user opens their own vault.
2. **Choose context** — the user explicitly selects which records or fields are
   in play. Enabling a category is not selecting records.
3. **Ask or reflect with LUCA** — using only that selected context, with the
   supporting information named and gaps admitted.
4. **Select a trusted relationship** — a specific practitioner, with an
   inspectable identity.
5. **Approve a scoped action** — recipient, records, purpose and duration, all
   confirmed by the user.
6. **See the result and the receipt** — truthful pending, delivered and
   acknowledged states.

Wallet and map setup stay optional. First-run onboarding must not become
mandatory key generation for every planned service.

## Reclaim your health — the health passport

The intended health passport brings together user-held records and documents,
daily check-ins, notes, relevant measurements and practitioner-authored
information **without erasing their origins**. A personal observation, a lab
result, a clinician's signed note and a model-generated draft must remain
distinguishable at all times.

A practitioner relationship can unlock more useful Heal, Learn and Earn
journeys: preparing for a consultation, organizing a dental journey,
understanding a chosen record, following a practitioner-approved plan, learning
a relevant skill or completing a voluntary self-care activity.

A clinician owns clinical authorship and judgment; the patient controls their
sharing decisions. Patient consent does not edit a clinician's original
authorship, and an AI recommendation is never a medical order.

### User stories and success criteria

| Story | Success criterion |
| --- | --- |
| "I want to understand my last check-in." | LUCA quotes the selected check-in's non-missing ratings and offers one focused reflection or small step. Nothing is invented. *(Working in 604.)* |
| "I have not selected anything yet." | LUCA explains what a check-in is and asks the user to choose Sources, rather than guessing. *(Working in 604.)* |
| "I want my dentist to see three documents for this treatment." | The user sees the recipient, the exact records, the purpose and the duration, and confirms. The recipient receives only those records. *(Planned.)* |
| "I changed my mind." | Future authorized access stops. The UI states plainly that already-copied information cannot be remotely guaranteed deleted. *(Planned.)* |
| "I want to leave and come back." | Vault locks, unfinished generation cancels, saved chat returns after unlock with interrupted replies explained. *(Working in 604; unsent drafts are cleared, and durable recovery is planned.)* |

## Reclaim your wealth — the economic passport

Optional, separately protected financial capabilities: a Bitcoin/Lightning
experience through **Breez SDK Spark**, and a stablecoin wallet through a
deliberately selected **Tether WDK** chain and account module. Wallet setup is
optional and must be understandable, with explicit recovery, fees, network status
and confirmation.

The Earn direction recognizes two forms of participation: a person's own
self-care and learning progress, and useful contributions to the wider network —
education, onboarding, community work, translation, or helping a business adopt
suitable infrastructure. These are candidate categories to evaluate, not approved
economic policy.

People must retain access to their records and core health tools **without**
creating a wallet, earning a reward, improving a biomarker or publishing personal
health data. Programs must account for illness, disability and differing
resources. Disclosure of raw records must never be the price of participation,
and rewards must never encourage unsafe care decisions.

Details and state machine: [Economic passport](ECONOMIC-PASSPORT.md).

## Reclaim your sovereignty

Helping a person take practical steps in digital and physical life: understand
custody and recovery, export their data, practice backup and restore, recognize
privacy boundaries, discover useful local businesses or communities, and choose
where to contribute time, skills or resources.

Start with user-entered places and regions, with optional location access. Maps
should disclose cached/online status and data age, and must never broadcast a
person's health context, private identity graph or clinic relationship in map
queries.

Details: [Sovereignty and GPS](SOVEREIGNTY-AND-GPS.md).

## Its place among Solaris products

| Product | Role | What belongs elsewhere |
| --- | --- | --- |
| Solaris Android / Pocket LUCA | Personal vault, selected-context local assistance, user consent, local history, optional identity/sharing/wallet/map adapters | Shared clinic administration and public marketplace hosting |
| Solaris web discovery | Public practitioner/service discovery and minimized coordination | Patient vault contents, clinical documents, LUCA health prompts or clinical plaintext on Solaris-operated infrastructure |
| Practitioner Clinic OS | Practitioner-controlled workspace and authorized care inbox, with attributable records, roles, audit and recovery | Automatic access to every patient record; shared unrestricted owner credentials |
| Clinic/business-in-a-box | A later supported deployment/hardware/service package | A required purchase for patients or a condition of listing a practitioner |
| Shared protocols | Versioned identity, consent, sharing, evidence and receipt schemas with test vectors | One merged database, common master keys, implicit inter-product trust |

Practitioners may use the web product for discovery without installing the
patient APK. Private care delivery requires an authorized endpoint; a listing
alone does not provision one. Any browser-based clinical view is a separate
key-custody and authorization design that must be proven.

## What this vision is not

It is not a feature list, a delivery schedule or evidence of implementation. No
delivery dates are stated anywhere in this repository because none have been
established. See the [Roadmap](ROADMAP.md) for sequenced, evidence-gated work.
