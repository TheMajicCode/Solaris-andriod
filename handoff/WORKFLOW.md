# Claude Code, Codex and GitHub workflow

## Working copy

The easiest start is to extract the full ZIP and open the resulting folder in Claude Code. A GitHub repository is not required for the first local audit. For hosted collaboration, use a dedicated private Android repository, for example `solaris-android`; this is a recommended name, not an existing repository. Keep the Solaris web application in its current repository.

Preserve the full archive as the recovery copy. Review the root `.gitignore`, inventories and any generated source-staging list. Track the editable source, targeted tests, scripts, manifests, licenses and useful documentation through an explicit allowlist. Keep ignored reference APKs, model weights, binary tools, dependency trees and bulky evidence available through the retained handoff and checksums. Do not run a blind `git add .` on the full recovery tree.

GitHub browser uploads are limited to 25 MiB per file; ordinary Git warns above 50 MiB and blocks files above 100 MiB. Git LFS or release assets are separate choices for intentionally managed large files. The full handoff ZIP should not be committed as a source file. [GitHub: large-file limits](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github)

After the user creates/imports the repository, use a branch such as `audit/604-baseline` for the initial audit. Inspect staged changes and record the baseline commit before fixes. No repository creation, authentication, commit, push or deployment is performed by these instructions.

## Shared context and review

Root `AGENTS.md` supplies the shared working rules. Codex discovers project instructions from the root toward its current directory. [OpenAI: AGENTS.md](https://developers.openai.com/codex/guides/agents-md)

Root `CLAUDE.md` imports `AGENTS.md`; Claude Code does not automatically read `AGENTS.md` by that name. Use `/context` in Claude Code to confirm its loaded memory files. Claude's auto memory is local to its environment, so committed status and review documents carry shared decisions between machines and agents. [Anthropic: project memory](https://code.claude.com/docs/en/memory)

For each task:

1. Record the problem, exact baseline and bounded files to change.
2. Assign Claude Code or Codex as writer; use the other as independent reviewer.
3. Use separate branches/worktrees when both edit. Keep one writer per path.
4. Run targeted checks against the resulting revision. Review compatibility and behavior, not only style.
5. Record the reviewed commit/file hashes, findings, command results and unresolved limits before integration.

Use a short shared status document with current task, owner, touched paths, baseline/revision, evidence, remaining issues and next action. Historical factory plans do not imply that agents share automatic memory, run unattended or have authorization to change production systems.

## Codespaces

The supplied `.devcontainer/devcontainer.json` names an audit environment and intentionally leaves image selection to GitHub's default Linux image. GitHub documents this default and the conventional root `.devcontainer/devcontainer.json` location. The environment includes common runtimes; verify their actual versions before testing. [GitHub: dev containers](https://docs.github.com/en/codespaces/setting-up-your-project-for-codespaces/adding-a-dev-container-configuration/introduction-to-dev-containers)

This configuration has no install hooks, services, forwarded ports, secrets or automatic model downloads. It is **not a pinned native Android build image, and Codespaces startup has not been tested by this handoff**. The initial audit should establish required host/runtime versions and compare them with the preserved build inputs. A later environment task can pin and test the necessary image and tools without replacing verified compiler inputs silently.

Run the root README commands manually after inspecting their scripts. `--reproduce` writes to `.handoff-output` and does not sign or install. Authentication and CLI installation, if needed in the new environment, are separate user setup actions; no subscription or integration capability is assumed here.
