# Included build and experiment inputs

The full ZIP extracts directly to the paths used by the saved scripts. No second source/input ZIP is required for the scoped 604 bundle reproduction. A fresh Linux x86_64 host with Python 3.11+ and Node.js is required to execute the retained compiler/runtime. Java is needed for separate Java/APK-tool work. The included Codespaces definition is an audit starting point, not a pinned or tested native build image. The ZIP preserves Unix executable flags; use an extractor that preserves them (for example Linux `unzip`). The verifier reports missing required executable permission on POSIX hosts. A Windows byte-integrity check does not establish Linux tool executability.

| Input | Location / identity |
| --- | --- |
| Signed 601 reference | `reconstruction-inputs/baseline/Solaris-V6.0.1-Sanctuary-Recovery.apk` |
| Signed 602 reference | `reconstruction-inputs/baseline-602/Solaris-V6.0.2-Sanctuary-Guards-Candidate.apk` |
| Exact 603 build baseline | `reconstruction-inputs/baseline-603/Solaris-V6.0.3-Pocket-Chat-Candidate.apk` |
| Signed 604 reference | `releases/Solaris-V6.0.4-Grounded-Chat-Candidate.apk` |
| Hermes compiler | `reconstruction-work/r2-tools/react-native-0.81.5/package/sdks/hermesc/linux64-bin/hermesc` |
| Hermes execution harness/libraries | `reconstruction-work/r2-tools/`; the existing runner verifies pinned binary hashes before use |
| Hermes parser source | `reconstruction-work/toolchain/hermes-dec-a0f18f97ab661eb8ed659c8c683a0d21ea619e69/` |
| Babel 7.28.5 fixture compiler | `reconstruction-work/r2-tools/babel-standalone-7.28.5/` |
| UI tooling | `reconstruction-inputs/ui-toolchain/` with retained dependencies and package lock |
| Android/JADX and acquisition inputs | Retained under `reconstruction-inputs/` and `reconstruction-work/`; see the complete file inventory |
| Optional exact-model experiment weight | `solaris-603-native-probe/acquired/Qwen3-0.6B-Q4_0.gguf`, 382,156,480 bytes |

The GGUF SHA-256 is `33bcc57074ec7b6eada5a90651ee546ec0c2b271002c22baf9f1b2dd1e8f75cb`. It was restored from the previously saved model-test archive. The handoff checks do not load it. Existing model-experiment scripts may contain old paths and write into their result directories; inspect and run them in a disposable copy if needed. Repeating Linux experiments does not measure Android performance.

The released HBC SHA-256 is `30be9989cc00299836715cc3de5cf3a2a75b00019bdf2f1b91629205f558d8b3`. `audit.py --reproduce` compares new output to this value and runs the selected existing tests in a private working copy. It preserves all frozen reports and does not execute packaging or signing.

Raw signing keys/passwords are deliberately absent. Existing hash-bound signing scripts, certificate evidence and final signed APKs remain available for review. Do not obtain or create signing material as an audit setup step. Complete native Gradle source/build inputs remain missing; the supplied binary-preserving tooling does not fill that gap.

Imported archive hashes are in `CHECKPOINT-ORIGINS.json`; every included file has its own inventory hash. Old outer ZIPs have been extracted/merged, not nested again. One colliding metadata file was preserved under `original-archive-conflicts/`. Historical manifests retain their original archive names and scopes.
