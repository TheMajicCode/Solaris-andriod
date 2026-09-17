# Checks rerun for this handoff

The recovered source was rebuilt from its new extracted directory. Its HBC SHA-256 matches the JavaScript bundle shipped in signed 604 exactly: `30be9989cc00299836715cc3de5cf3a2a75b00019bdf2f1b91629205f558d8b3`.

`audit.py --reproduce` then passed the existing selected suites in a disposable R4 copy: 63 readable UI, 63 compact UI, 8 helper classification, 34 guided route, 94 open-chat, 15 authority-race and 10 lifecycle checks — **287 total**. The current authored helper/test syntax check also passed. These are desktop tests with synthetic native/DOM boundaries; they do not prove Android performance, storage durability or production readiness.

The independent inventory review checked all 5,166 initial imported files. The two subsequently restored model-input entries are recorded in the updated import manifest. Final packaging verifies that every import remains covered by `FILE-INVENTORY.json`, with matching bytes and hashes. The final ZIP is checked against that inventory before delivery, including executable mode metadata.

Independent handoff review found and reproduced two wrapper portability/reporting issues, which were fixed before packaging. Its report and probe results are retained alongside the inventory review. No application source was changed.

The `validation/` directory preserves new result/provenance JSON and logs. Absolute paths in those historical run records identify where the test ran; use the root-relative README commands in a new environment. Reproducible duplicate working copies and bytecode outputs under `.handoff-output` are not included again; source generators and the identical frozen release bundle are included.

Run environment: Linux x86_64, Python 3.12.14, Node 24.19.0, Java 17.0.20. No Codespace was started, and no APK was signed or installed for this handoff. The production audit, full lint configuration, dependency/license/security findings and missing native source work remain open.
