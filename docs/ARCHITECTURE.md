# Architecture

This describes the **actual 604 components** and, separately, the **proposed**
boundaries the product is heading toward. Nothing below marked *proposed* exists
in the candidate.

## Actual 604 runtime

| Layer | What exists | Source of truth |
| --- | --- | --- |
| Android package | `org.solarishealth.edge.recovery`, version code 604, signed with the existing development identity | [Feature status](FEATURE-STATUS.md) |
| Native payloads | 599 preserved APK entries including all DEX and 51 native libraries, uncompressed and 16 KiB aligned. **Unchanged by 604.** | [604 build report](../Solaris-Android-R4/docs/Solaris-604-Build-Report.md) |
| Host bundle | Hermes bytecode (HBC) reconstructed from the reviewed source. 604 changed four functions; 15,509 other function bodies/headers were verified unchanged. | Structural host verification |
| UI | A single large readable `sanctuary.html` with embedded assets, plus a reviewed compact derivative fitted into the original fixed UTF-16 UI slot (1,936 bytes spare) | [`handoff/SOURCE-MAP.md`](../handoff/SOURCE-MAP.md) |
| Guided routing | `Solaris-Android-R4/grounding/fast-guided.js` — bounded application logic for recognized intents, bypassing model preparation entirely | 604 build report |
| Local model path | Qwen3-0.6B Q4 through the retained 603 request helper and model worker. Unchanged by 604. | 604 build report |
| Vault / recovery / records | Existing native components, formats, schema and record IDs — **preserved, not re-implemented**. Their internals are not fully recovered source. | [`handoff/PRODUCTION-GATES.md`](../handoff/PRODUCTION-GATES.md) |

### Authority boundaries that exist today

- **Source selection is explicit.** Enabling a context category does not select
  records for a chat request. Guided answers quote only selected, currently
  approved fields.
- **Authority is rechecked at the side effect.** Saving re-verifies current
  authority for both guided and generated replies, closing a reproduced race
  during asynchronous receipt authentication.
- **Foreground loss locks and cancels.** Leaving the app locks the vault and
  cancels unfinished generation. Completed chat remains stored; unsent drafts do
  not survive.
- **Pocket LUCA holds no root, signing or spending authority.** It proposes;
  deterministic code and the user authorize consequential execution.

### What the source does *not* contain

No original native Gradle application project, no original host `App.tsx`, no
complete native dependency lock or build graph, and no complete editable native
library sources. What exists in their place is reference evidence:

| Kind | Path | Treat as |
| --- | --- | --- |
| Decompiled native classes | `Solaris-Android-Reconstruction/reference/native-decompiled/` | Evidence with decompiler limitations. Never mass-format, lint-fix or compile as the missing project. |
| Host disassembly / pseudocode | Excluded from this projection (full backup only) | Diagnostic evidence, not executable authored JavaScript |
| APK-recovered worker and UI | `Solaris-Android-Reconstruction/src/recovered-601/` | Recovered evidence; bundled dependencies are third-party inputs |
| Function disassembly (`.hasm`) | `Solaris-Android-R2/reference/functions/` and peers | Generated reconstruction evidence |

## Proposed boundaries — not implemented

```
┌─────────────────────────── user's device ───────────────────────────┐
│  Vault (records, documents, check-ins, attachments)                 │
│    │                                                                │
│    ├── selection + consent layer  ─── proposed ──┐                  │
│    │                                             │                  │
│  Pocket LUCA (local inference, selected context) │                  │
│    │  no root / signing / spending authority     │                  │
│    │                                             ▼                  │
│  Identity keys ── separate ── Wallet keys ── separate ── APK signer  │
│    (Subject ID)              (proposed)              (existing dev) │
└──────────────────────────────┬──────────────────────────────────────┘
                               │  proposed, permissioned, scoped
              ┌────────────────┴────────────────┐
              ▼                                 ▼
   Practitioner Clinic OS              Solaris web discovery
   (authorized care inbox)             (no clinical plaintext)
```

Each proposed edge needs its own documented contract, test vectors and negative
cases before implementation. See [`contracts/README.md`](../contracts/README.md).

### Key separation is a hard rule

Identity control, vault recovery, wallet recovery and the Android signing
identity are four distinct key lifecycles. Do not derive wallet secrets from an
npub, a clinical record, the APK signer or the vault encryption key. A
health-data grant never implies spending permission. Do not replicate live
wallet signing state with a generic CRDT or let several devices act as
uncontrolled concurrent wallet writers.

### Metadata is not covered by encryption

Encrypted transport still exposes metadata. Any P2P discovery, relay, RPC
service, payment provider or map service must have its observable-metadata
boundary inventoried before use. Connectivity fallback must not silently weaken
confidentiality. "No clinical plaintext on Solaris-operated servers" is a target
data-flow constraint to be **tested**, not a property a README establishes.

## Repository layout

| Path | Contents |
| --- | --- |
| `Solaris-Android-R4/` | Latest 604 change layer: grounding, UI, tools, tests, reviews, lifecycle, latency, docs |
| `Solaris-Android-R3/` | Retained 603 open-chat repair and dependencies used by 604 |
| `Solaris-Android-R2/` | Reconstructed coordinator baseline, 602 guard repair, reference bytecode comparisons |
| `Solaris-Android-Reconstruction/` | Recovery-envelope reconstruction, recovered-601 evidence, native decompilations, build-input descriptors |
| `handoff/` | Retained handoff reference documents (state, gates, source map, workflow, audit prompt) |
| `solaris-603-native-probe/` | Retained desktop native model experiment source and results |
| `docs/` | This repository's own documentation, decisions, provenance and workflow |
| `tools/` | This repository's own checks |
| `contracts/` | Index of accepted versus proposed cross-product contracts |
| `artifacts/` | Curated artifact metadata only — never bytes |

Preserve these source roots. Moving them breaks evidence links and saved tooling
paths, and needs its own reviewed task.
