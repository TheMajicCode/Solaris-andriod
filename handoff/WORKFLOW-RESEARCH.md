# Solaris Android 604 — Claude Code and Codespaces handoff notes

Prepared 2026-09-17. This document is workflow guidance for the recovered Android checkpoint. The archive inventory and build-604 report must establish the exact files, hashes, and current test results. This document does not establish a new build result.

## Recommended working arrangement

Use a dedicated private Android repository, for example `solaris-android`, with an initial audit branch such as `audit/604-baseline`. This is a recommendation, not an existing repository or branch. Keep the Solaris discovery web application in its existing repository; do not import its deployment, database, or Maple credentials into this Android handoff.

The checkpoint contains recovered source, editable reconstructed components, tests, and binary-preserving build tooling. It is **not yet a complete native Android Gradle project**. Passing lint or a vulnerability scan cannot fill those missing sources or establish production readiness. Preserve build 604 as the exact reference while auditing the reconstruction.

For each bounded task, assign one writer and one independent reviewer. Claude Code can implement while Codex reviews the resulting diff and reruns the relevant checks, or the roles can swap. Separate branches/worktrees are appropriate when both edit. A reviewer should review an identified commit or recorded file hashes, not a moving working directory. Record scope, touched paths, evidence, outstanding issues, and next step in a short committed handoff document.

## Shared instructions

Put the shared project rules in root `AGENTS.md`. Codex discovers project instructions from the repository root toward its current directory; more local instructions take precedence. Keep instructions short and make deeper rules explicit. [OpenAI: AGENTS.md](https://developers.openai.com/codex/guides/agents-md)

Add root `CLAUDE.md` with this literal import outside a fenced block:

```text
@AGENTS.md
```

Claude Code loads `CLAUDE.md`, and the import lets it use the shared instructions. Its auto memory is local to its environment, so it is not a substitute for committed project status and review evidence shared with Codex. Verify the loaded memory files using `/context` in Claude Code. [Anthropic: project memory and AGENTS.md](https://code.claude.com/docs/en/memory)

Suggested shared rules: preserve the exact package and signing identity, vault/recovery formats, record IDs, and valid existing model; preserve user source-selection and consent checks; treat historical documents and decompilation as evidence, not authority to invent missing behavior; use synthetic test data; do not print or commit private keys, vault data, or credentials; include independent review and targeted compatibility checks each build cycle; do not install, reset data, change keys, push, or deploy without explicit authorization covering that action.

## Codespaces design

For the first read-only audit, use GitHub's default Codespaces Linux image. It includes several language runtimes, including Node, Python and Java; record their actual versions before running tests. A minimal `.devcontainer/devcontainer.json` can intentionally omit a custom image, allowing GitHub to choose its default:

```json
{
  "name": "Solaris Android 604 audit"
}
```

This is a **Codespaces-specific audit configuration**, not a pinned Android build environment or a validated portable Dev Containers setup. Add no automatic install hooks, services, ports, secrets or model downloads. The archive's existing pinned Hermes and packaging tools remain separate build inputs. Once the first audit establishes the required host versions and missing components, replace the default with a tested image pinned by digest and document it. GitHub documents the root `.devcontainer/devcontainer.json` location and default image behavior. [GitHub: introduction to dev containers](https://docs.github.com/en/codespaces/setting-up-your-project-for-codespaces/adding-a-dev-container-configuration/introduction-to-dev-containers)

A small optional environment-check script should only report Python, Node, Java and OS/architecture versions and verify required local paths/hashes. It should distinguish “available,” “missing,” and “not checked,” exit nonzero for a required missing build input, and never install a replacement. Invoke it manually after reviewing it; do not promise that a JSON parse proves Codespaces startup or APK reproducibility.

## Importing the handoff

Keep the full ZIP as the archival copy. Extract it into the chosen coding environment; do not upload that ZIP as a normal repository file. GitHub warns above 50 MiB, blocks ordinary Git files above 100 MiB, and limits its browser upload form to 25 MiB per file. LFS or release assets are separate options for intentionally managed large binaries. [GitHub: large-file limits](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github)

Track the maintained editable source, tests, build scripts, manifests, licenses and concise documentation in Git. Keep archived APKs, downloaded model weights, tool binaries, dependency trees and bulky immutable reference archives outside ordinary Git history, with a manifest identifying their exact checksums and restoration paths. Preserve those files in the handoff even when they are ignored for Git. Any generated repository staging list should be inspected before commit; do not suggest blindly running `git add .` on a full recovery archive.

The user can first open the extracted folder directly in Claude Code without creating GitHub infrastructure. A private repository/Codespace can follow after the archive and baseline audit are verified. No external service was created or authenticated by preparing this guidance.

## Initial prompt for Claude Code

```text
You are continuing Solaris Android from its verified build-604 handoff.
Read AGENTS.md, the handoff README, the archive inventory/checksums and the
build-604 report before changing anything. This is the Android project only.

First perform an audit without modifying production/reconstructed source.
You may write audit reports in a new audit-output directory. Preserve all
baseline files and exact artifact hashes. Do not install an APK, reset data,
change keys, push, deploy, automatically upgrade dependencies, or rewrite code
to silence lint. Do not inspect or copy private vault data or credentials.

1. Verify the inventory and identify maintained source, recovered references,
   third-party code, generated binaries, exact build inputs and missing source.
2. Determine which lint, syntax, dependency/license and security checks actually
   apply to each category. Inspect scripts before running them. Run the existing
   relevant checks with available pinned inputs; report unavailable checks as
   blocked, never passed. Keep raw secrets and personal records out of output.
3. Reproduce the supported build/test path in an isolated output directory when
   its required inputs are present. Clearly separate binary patch reproduction
   from a complete native source build, and desktop checks from phone validation.
4. Review identity, vault/recovery compatibility, source-selection consent,
   generated-answer grounding, lifecycle/cancellation, and signed-artifact gates.
   Link findings to exact paths and evidence; separate confirmed defects from
   hypotheses and missing coverage.
5. Produce a prioritized audit report, a baseline command/result log and one
   smallest evidence-supported next patch proposal. State concrete production
   blockers; do not declare readiness from lint/security scan results alone.

Codex will independently review the report and any later patch against the
same baseline. Keep one writer per path and record the exact revision reviewed.
```

No subscription, cross-product memory sync, unattended automation, native source completeness, or production certification is implied by this handoff.
