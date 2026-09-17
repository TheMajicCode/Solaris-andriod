# Exact SDK test fixtures

These files were copied unchanged from the verified V6 APK's previously recovered Bare worker bundle. Its packaged `@qvac/sdk/package.json` declares version 0.18.2, Apache-2.0, and repository `https://github.com/tetherto/qvac`, directory `packages/sdk`. Digests and original recovery paths are recorded in `evidence/SDK-FIXTURES.json` at the checkpoint root. Retain upstream notices if the full published package is restored. The APK recovery did not contain the package's original NOTICE file; no author/copyright line has been invented here.

The Apache 2.0 license text is included from the host's standard license copy. The runtime module and handlers are unchanged; the host harness explicitly substitutes their logging and error-constructor imports and uses synthetic resources. No native engine, full SDK client, mobile transport or model runs in these checks.
