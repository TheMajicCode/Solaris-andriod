from pathlib import PurePosixPath

PREFIX = 'solaris-android-handoff/'
TEXT = {'.md','.txt','.json','.js','.cjs','.mjs','.ts','.py','.java','.c','.cpp','.h','.hpp','.html','.css','.xml','.sh','.hasm','.yaml','.yml','.toml','.config','.envelope'}

def classification(name):
    p=PurePosixPath(name)
    if name == 'Solaris-Android-Reconstruction/reference/601-recovery/v6-apk-recovery/extract_verified_apk.py':
        return 'included-required-recovery-tool'
    if name.startswith('Solaris-Android-R4/evidence/phone604/'):
        return 'private-evidence-excluded'
    if 'node_modules' in p.parts:
        return 'third-party-dependency-excluded'
    if name.startswith('Solaris-Android-Reconstruction/src/recovered-601/ui/assets/') and p.suffix == '.png':
        return 'included-original-ui-asset'
    if p.name in {'baseline-strings.json','base-strings.json','strings.json'}:
        return 'generated-full-string-table-excluded'
    if p.suffix.lower() not in TEXT:
        return 'binary-or-asset-excluded'
    if name.startswith(('reconstruction-inputs/','reconstruction-work/','releases/')):
        return 'external-build-input-excluded'
    if name in {'DELIVERY-CONTENTS.json','Solaris-603-EDITABLE-ARCHIVE-MANIFEST.json','Solaris-604-EDITABLE-ARCHIVE-MANIFEST.json','handoff/FILE-INVENTORY.json','handoff/IMPORTED-FILES.json'}:
        return 'full-reference-inventory-excluded'
    if name.startswith(('Solaris-Android-Reconstruction/reference/host-disassembly/','Solaris-Android-Reconstruction/reference/601-recovery/')):
        return 'historical-reference-excluded'
    if name.startswith('solaris-603-native-probe/'):
        if p.parts[1] in {'reference-worker','runtime','acquired','results','native-source'}:
            return 'optional-probe-input-excluded'
        return 'included-probe-source-and-evidence'
    if name.startswith('handoff/'):
        if name.startswith(('handoff/original-archive-conflicts/','handoff/original-delivery-manifests/','handoff/validation/')) or p.name in {'verify.py','audit.py','package.py','INVENTORY-REVIEW.md'}:
            return 'full-reference-runner-or-evidence-excluded'
        return 'included-handoff-reference'
    if name.startswith(('Solaris-Android-R2/','Solaris-Android-R3/','Solaris-Android-R4/','Solaris-Android-Reconstruction/')):
        return 'included-source-and-reference'
    return 'root-reference-excluded'
