# Production gates after build 604

Build 604 is a reviewed APK-derived candidate. Its report establishes bounded source, host and packaging checks. It does not establish production readiness. The user's positive phone feedback is valuable acceptance evidence, but it does not close the technical gaps below.

| Gate | Evidence still needed |
| --- | --- |
| Complete native source build | Recover or reconstruct the missing application/native project with traceable behavior, dependency locks and a documented Android/Gradle build. Decompiled classes and preserved DEX/native binaries are reference evidence, not a complete source project. |
| Vault and identity compatibility | Synthetic old-vault/recovery round trips, stable subject/record IDs, attachment/database behavior, native persistence under interruption, and upgrade compatibility. Preserve existing keys and formats while testing. |
| Background and session behavior | Implement and test an explicit encrypted pending-turn protocol if draft recovery is required; validate lock, cancellation, owner changes, revocation and no replay. 604 still cancels unfinished generation and clears unsent drafts on background lock. |
| AI reliability and latency | Measure cold/warm response times on the target phone, cancellation and resource use; test actual user tasks, selected-source grounding and adversarial inputs. Guided routes cover common intents; general model output can still be slow or unsupported. |
| Android UI and platform behavior | On-device/WebView rendering, navigation, voice, permission and lifecycle checks, upgrade installation and representative supported Android versions. Desktop synthetic DOM/host tests do not substitute for them. Installation requires its own authorization. |
| Security and dependency posture | Scoped source/static analysis, dependency and license inventory, secret scan without exposing secrets, reviewed tool provenance, and triage of findings affecting actual shipped code. Scan results alone do not prove safe behavior. |
| Release identity and signing | A deliberate production signing and upgrade/distribution strategy. The preserved certificate matches a development fixture, not a private production signer. Do not silently replace it, generate new keys or assume an existing install will accept a different signer. |
| Independent release verification | Review the exact final source/artifact hashes, verify package/version/signature/payloads/alignment and target-device acceptance, and document remaining risks before a production release decision. |

The first audit should convert these into confirmed blockers, scoped tasks and acceptance evidence. Do not hide missing source or unsupported checks to obtain a green dashboard. Keep runtime bugs, incomplete reconstruction, maintainability findings and release controls distinguishable so each gets the right next action.

Current detailed evidence: [604 build report](../Solaris-Android-R4/docs/Solaris-604-Build-Report.md), [lifecycle assessment](../Solaris-Android-R4/lifecycle/LIFECYCLE-ASSESSMENT.md), [functional review](../Solaris-Android-R4/review-functional/FUNCTIONAL-INDEPENDENT-REVIEW.md), and [final signed review](../Solaris-Android-R4/review-packaging/FINAL-SIGNED-INDEPENDENT-REVIEW.md).
