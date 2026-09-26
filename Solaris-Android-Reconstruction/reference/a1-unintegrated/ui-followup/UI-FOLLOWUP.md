# V6 Health Connect copy follow-up

This isolated follow-up corrects two Health Connect copy claims in both English and Spanish. It preserves the prior repaired HTML and its services; it is not an APK, native integration, or phone test.

## Exact scope

| Location | Previous copy | New copy |
|---|---|---|
| healthConnections | Permission allows reading existing data. It does not start tracking or create readings. | Permission alone does not confirm that readings were returned. Refresh permitted records to check. |
| healthConnections | El permiso permite leer datos existentes. No inicia el seguimiento ni crea lecturas. | El permiso por sí solo no confirma que se hayan recibido lecturas. Actualiza los registros permitidos para comprobarlo. |
| healthSavedReadings | A tracker or another app must first record steps or sleep and share them with Health Connect. | Step or sleep readings must be available in Health Connect for the selected dates. |
| healthSavedReadings | Un dispositivo u otra app debe registrar primero pasos o sueño y compartirlos con Health Connect. | Las lecturas de pasos o sueño deben estar disponibles en Health Connect para las fechas seleccionadas. |

Permission is evidence of access, not proof that a read returned data. Readings must be available for the requested dates; the UI does not assert that an external tracker or another app is mandatory. No Android API, native bridge, data schema, permission, runtime, route, image, or layout behavior changes.

## SHA-256

| File | Previous checkpoint | This follow-up |
|---|---|---|
| `baseline/sanctuary.html` | `d8192125d041ac8521029dc9b348c2760fafce91e5cb9a5e12d7d91ba2897962` | `d8192125d041ac8521029dc9b348c2760fafce91e5cb9a5e12d7d91ba2897962` |
| `candidate/sanctuary.html` | `be5c43771f1e1a1b1c409e5aba24804a746699789591b0185c19f3794ad24693` | `d37c2cca5a60085924bf777e0c0428144f5955799e3d5e1b767e4dce0a7618a9` |
| `scripts/ui-repair-apply.mjs` | `584bc4bd3f2e7e28c817dd79f5b607701faf11d75af6b917e03725fde7e4d2f1` | `25683271c4d72579061e8e87ee42b9e80ca3a7bc90d161dcf1026192e50c67c0` |
| `scripts/ui-repair-test.cjs` | `8d6c481ccb935861a0fa661ba8ea2f7b7e080fa2b993999e76709e80470130bd` | `eac6fbea19688e9461259dd9015e23e4b021c4f2e66acffa4a45028ade2df0d8` |

`baseline/sanctuary.html` remains the exact original APK-recovered HTML. The replay script builds this follow-up from that original baseline, including the previously reviewed repair plus these four literal copy replacements. The existing test assertion was updated for the revised English permission sentence; no test was removed and no additional test suite was introduced.

## Executed checks

Run from this folder:

```sh
node scripts/ui-repair-apply.mjs
node scripts/ui-repair-test.cjs
```

Both commands exited 0. The existing suite passed all **120 host assertions**. A separate scope comparison confirmed that the new candidate differs from the prior repaired candidate only by the four copy replacements above. The hashes of every copied file in the prior checkpoint were rechecked and remain unchanged.

No new browser screenshots were generated for this text-only follow-up. Prior browser captures remain evidence for the prior copy, not captures of this revised text. No physical-device, native inference, Health Connect provider, build, signing, or in-place update tests were run. No APK was changed, built, signed, or installed.

## Files

- `baseline/sanctuary.html`: unchanged original recovered UI.
- `candidate/sanctuary.html`: previously repaired UI plus the copy changes above.
- `scripts/ui-repair-apply.mjs`: full original-baseline replay with the revised strings.
- `scripts/ui-repair-test.cjs`: existing regression suite with its affected assertion updated.
- `evidence/PREVIOUS-HASHES.json`, `CURRENT-HASHES.json`, `HOST-CHECKS.json`: hashes and executed-check record.

The parent reconciliation package will own persistence and packaging. No previous delivered artifact was overwritten.
