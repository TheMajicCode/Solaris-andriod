# First task in Claude Code or Codex

Open the extracted handoff folder and paste the prompt below. The initial task audits source and reproduction; it does not implement a new app version.

```text
Continue Solaris Android from its build-604 handoff. Read AGENTS.md, README.md,
the handoff inventories and Solaris-Android-R4/docs/Solaris-604-Build-Report.md.
This is the Android project only; do not import Solaris web/backend work.

Perform an audit without modifying application or reconstructed source. You may
write audit reports and generated test output under .handoff-output. Keep the
baseline and all archived evidence unchanged. Do not install an APK, reset data,
change keys, push, deploy, sign a candidate, automatically upgrade dependencies
or rewrite code to silence lint. Use synthetic data, never private vault data.

1. Review and run python3 handoff/verify.py. Establish the exact baseline,
   included inputs and environment. Classify editable source, recovered
   references, third-party code, generated files and genuinely missing source.
2. Review and run python3 handoff/audit.py --syntax, then
   python3 handoff/audit.py --reproduce. Report command, exit status, result and
   limitations. Missing tools/inputs are blocked checks, never passes. Keep
   bytecode reproduction separate from a native Android source build.
3. Determine additional lint, dependency/license and security checks that apply
   to each code category. Record tool versions and scope. Inspect existing
   configuration before running commands; propose missing tooling explicitly.
   Do not mass-format decompiled evidence or automatically fix dependencies.
4. Review identity, vault/recovery compatibility, source-selection consent,
   answer grounding, lock/cancellation and persistence races, and artifact gates.
   Link each finding to exact paths and evidence. Separate confirmed defects,
   hypotheses, missing sources and missing tests.
5. Produce a prioritized audit report and baseline command/result log. Identify
   production blockers and propose one smallest evidence-supported next patch,
   with its compatibility boundaries and targeted verification. Do not declare
   production readiness based only on lint or vulnerability scan results.

The other coding agent will independently review the same recorded revision.
Keep one writer per path. Already-authorized local work does not require repeated
approval; new actions outside this audit's scope require an explicit task.
```
