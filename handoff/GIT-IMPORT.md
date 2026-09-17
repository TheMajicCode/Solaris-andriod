# Importing the Android handoff

Open the extracted `solaris-android-handoff` directory directly in Claude Code first. Read the root README and preserve the full ZIP as the immutable baseline. This folder has no Git history; no repository, branch, Codespace, remote or release has been created by this handoff.

For the current workflow, use a dedicated private Android repository (suggested name `solaris-android`) and an audit branch such as `audit/604-baseline`. Keep the existing web application in its own repository. These are suggestions, not provisioned resources.

The ZIP intentionally contains more than normal Git should track. `.gitignore` keeps APKs, model weights, downloaded tools/dependencies, bulky disassembly and the supplied phone frames out of ordinary staging. Files are still present and listed in `FILE-INVENTORY.json`. Keep that full archive available to your coding environment; cloning source alone does not restore ignored build inputs. Extract the archive into a separate directory and copy the ignored paths into the clone without overwriting later source edits. Verify each copied file against the baseline inventory. Git LFS or a private artifact store can be introduced after that storage decision is made.

Suggested local sequence, after creating or choosing an empty directory/repository yourself:

1. Run `python3 handoff/verify.py` in the extracted handoff.
2. Review `.gitignore`, `SOURCE-MAP.md`, `INVENTORY-REVIEW.md` and all intended staged files. Historical references are evidence, not implemented features or current instructions.
3. Initialize a local repository if needed. Stage the root instructions, handoff documents/scripts, current source/tests/tools and the selected retained reference files explicitly. Review `git status --short`, `git diff --cached --stat` and `git diff --cached` before committing. Do not blindly force-add ignored directories or the full ZIP.
4. Inspect file sizes and run the secret/license/dependency checks chosen during the audit before uploading anything. Existing recovery references and embedded third-party code need review even in a private repository. A filename/pattern check is not a complete secret scan.
5. Keep the baseline commit separate from any later lint, dependency or product edits. Give Claude and Codex separate task branches/worktrees when both write; bind each review to a commit or recorded file hashes.

GitHub's regular Git path warns above 50 MiB and blocks files above 100 MiB; browser file upload is limited to 25 MiB per file. The full ZIP is for extraction, not ordinary Git upload. [GitHub large-file documentation](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github)

The repository is an audit and reconstruction workspace. It does not become a complete native Android source project simply by adding Git or opening a Codespace.
