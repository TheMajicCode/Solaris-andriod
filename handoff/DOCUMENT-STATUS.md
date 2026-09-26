# Current instructions and historical plans

The root `AGENTS.md`, `CLAUDE.md`, README and this handoff reflect the user's latest request: a complete Android handoff for Claude Code and Codex, followed by an audit. They do not authorize a new deployment or activate a background workflow.

`historical-plans/` preserves the useful vision/workflow documents recovered alongside the code:

| Document | How to use it |
| --- | --- |
| `Solaris-AI-Factory-Plan-2026-09-14.md` | Workflow history. Its earlier monorepo/Copilot-primary/Claude-reviewer arrangement and proposed schedules do not override the latest dedicated Android repository and Claude Code/Codex workflow. No schedule is activated. |
| `Solaris-Sovereign-Architecture-and-Copilot-Roadmap-2026-09-16.md` | Architecture direction and separation of mobile/private capabilities from web discovery. A plan is not evidence that those capabilities exist in the APK. |
| `Solaris-APK-Identity-and-GPS-Implementation-Plan.md` | Proposed identity/GPS work. It is not an instruction to introduce migrations, change identity, grant location access or merge speculative code during this audit. |
| `Solaris-Pear-Holesail-Buzz-Adoption-2026-09-15.md` | Proposed optional integration research, not shipped functionality or authority to create P2P services. |

Older recovery and build reports in the source tree retain their original dates and claims. Use the 604 build report to identify the latest accepted candidate, and use current test outputs to establish what was rerun. Earlier passing approvals bind their own exact artifact hashes and cannot approve later changes.

Phone recording frames and derived user evidence are preserved in the private complete handoff. They are not synthetic test fixtures and should not be committed or uploaded into a general repository audit. The supplied `.gitignore` excludes their current directory.
