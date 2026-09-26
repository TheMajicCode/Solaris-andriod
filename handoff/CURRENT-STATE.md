# Current state — 17 September 2026

The latest saved signed candidate is **604**, version `6.0.4-preview.grounded-chat`. The user reports that it looks much better and now requests a complete handoff for Claude Code, Codex, repository setup and a quality/security audit. This handoff changes no application behavior and creates no new APK version.

604 has guided answers for recognized common intents, explicitly selected check-in context, corrected waiting/error settlement, a post-authentication authority recheck, and navigation back to saved chat after unlock. General open chat keeps the same tiny local model and can still be slow, vague or unsupported. Foreground loss still locks/cancels; unfinished drafts are not durably recovered. Full native source recovery and device acceptance remain open.

Start with `FIRST-AUDIT-PROMPT.md`. Verify the saved bytes and supported offline reconstruction, establish scoped lint/static/dependency/license/secret checks, and produce findings before deciding which smallest repair to take next. No existing report certifies production readiness. See `PRODUCTION-GATES.md` for the outstanding evidence.

The root instructions reflect the latest workflow: Claude Code and Codex collaborate on a dedicated Android repository with one writer per path and independent review. Their local memory is not shared project state. Keep the reviewed commit/file hashes, test results, unknowns and next task in versioned handoff notes. No external repository, branch, Codespace, schedule or deployment has been created by this work.

The known signer matches the existing development identity. Raw signing credentials are excluded. Preserve the current package, signer, vault/recovery formats, record IDs and valid models; a production distribution/signing strategy requires explicit work, not an automatic key replacement.
