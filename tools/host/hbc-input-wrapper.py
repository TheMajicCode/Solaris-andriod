#!/usr/bin/env python3
"""Bounded HBC-input wrapper for the frozen 604 bundle builder.

CONTRACT AND WHY THIS EXISTS
  Solaris-Android-R4/tools/build-bundle.py requires the full 603 APK. It uses it
  for exactly two things: asserting the APK's own SHA-256, and reading
  assets/index.android.bundle out of the ZIP. When only the extracted bundle is
  available, that CLI cannot be satisfied and must not be edited.

  This wrapper performs the SAME downstream sequence on the same bundle bytes. It
  does not modify, import-patch or weaken the frozen builder.

INPUT PIN SUBSTITUTION — the one deliberate difference
  frozen builder : assert sha256(APK)    == 25d3642a...  then unzip the bundle
  this wrapper   : assert sha256(BUNDLE) == b8ac7d1b...  directly

  The bundle pin is the hash the frozen hbc_patch module already asserts for the
  exact 603 base, so this substitutes one exact pin for another. It does NOT
  relax a check: an APK containing a different bundle would fail here too.

  What it therefore does NOT verify, and the frozen path does: that this bundle
  came from that APK, and the APK's own integrity. A reproduction from this
  wrapper is evidence about the HOST BUNDLE only.

EXPECTED OUTPUT PARITY
  Target candidate604.hbc SHA-256 30be9989cc00299836715cc3de5cf3a2a75b00019bdf2f1b91629205f558d8b3.
  Byte-identical output is the only success condition; anything else is reported
  as a mismatch, never as a reproduction.

CALLABLE BUILD (maintained, Sprint-02)
  The sequence below is now a function, build(), so that
  tools/host/build-donor-candidate.py can run EVERY require() in it against a
  candidate donor or a candidate UI instead of duplicating them. The command
  line passes neither, so the reproduction path is unchanged, and it is
  re-proven to yield 30be9989... after the refactor. A candidate plans module
  or UI never changes what is asserted; it only changes the inputs asserted on.
"""
import hashlib, importlib.util, json, sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from _guard import refuse_git_worktree, verify_frozen  # noqa: E402

# Everything build() executes from the disposable copy (review of b2a6ba8, S2R-8).
FROZEN_PREFIXES = ('Solaris-Android-R4/tools/', 'Solaris-Android-R3/tools/',
                   'Solaris-Android-R4/grounding/', 'Solaris-Android-R4/ui/',
                   # S2R2-2: the APK/bundle decoder build() loads and runs.
                   'Solaris-Android-Reconstruction/reference/601-recovery/v6-apk-recovery/')
IMPORT_DIRS = ('Solaris-Android-R4/tools', 'Solaris-Android-R3/tools')

BASE_BUNDLE_SHA = 'b8ac7d1b58d9e8ea6eadd25de516e35842aea14e4b849462664bb3200fedc990'
TARGET_HBC_SHA = '30be9989cc00299836715cc3de5cf3a2a75b00019bdf2f1b91629205f558d8b3'
UI_RELATIVE = 'Solaris-Android-R4/ui/sanctuary.compact.html'


def module(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m); return m


def frozen_plans(src):
    return module('guided604', src / 'Solaris-Android-R4/grounding/build-plans.py')


def build(src, bundle_path, out, plans_loader=frozen_plans, ui_path=None):
    SRC, BUNDLE, OUT = Path(src).resolve(), Path(bundle_path).resolve(), Path(out).resolve()
    refuse_git_worktree(SRC, 'disposable root')
    refuse_git_worktree(OUT.parent, 'output directory')
    verify_frozen(SRC, FROZEN_PREFIXES, IMPORT_DIRS)
    UI = Path(ui_path).resolve() if ui_path else SRC / UI_RELATIVE
    sys.path.insert(0, str(SRC / 'Solaris-Android-R4/tools'))
    sys.path.insert(1, str(SRC / 'Solaris-Android-R3/tools'))
    sys.path.insert(2, str(SRC / 'reconstruction-work/toolchain/hermes-dec-a0f18f97ab661eb8ed659c8c683a0d21ea619e69/src'))
    from hbc_patch import read, require, digest, append_plans

    base = BUNDLE.read_bytes()
    require(digest(base) == BASE_BUNDLE_SHA, 'Wrong 603 host bundle')
    OUT.mkdir(parents=True, exist_ok=False)

    r = read(base, exact_base=True)
    guided = plans_loader(SRC)
    plans = guided.plans(r, base, OUT / 'guided-compiler')
    require({p['function_id'] for p in plans} == {6929, 14890, 14894, 14904}, 'Unexpected functional scope')
    code, report = append_plans(base, plans)

    # --- UI slot replacement, mirroring the frozen builder exactly ---
    decoder = module('decoder', SRC / 'Solaris-Android-Reconstruction/reference/601-recovery/v6-apk-recovery/extract_verified_apk.py')
    header, strings = decoder.decode_strings(code)
    html = UI.read_text()
    old, meta = strings[12364]
    require(old == r.strings[12364], 'Unexpected UI slot')
    require(html.startswith('<!doctype html>') and html.endswith('</html>'), 'HTML boundary')
    encoding = meta['encoding']; raw = html.encode(encoding); spare = meta['rawByteLength'] - len(raw)
    require(encoding == 'utf-16le' and spare >= 0 and spare % 2 == 0, 'UI slot overflow')
    padded = html + ' ' * (spare // 2); raw = padded.encode(encoding)
    start = meta['byteOffset']; end = start + len(raw)
    for i, (_, m) in enumerate(strings):
        require(i == 12364 or m['byteOffset'] >= end or m['byteOffset'] + m['rawByteLength'] <= start, 'UI overlap')
    patched = bytearray(code); patched[start:end] = raw
    patched[-20:] = hashlib.sha1(patched[:-20]).digest(); patched = bytes(patched)
    ah, ast = decoder.decode_strings(patched)
    require(ah == header, 'UI changed headers')
    require(patched[:start] == code[:start] and patched[end:-20] == code[end:-20], 'UI outside mutation')
    expected_meta = dict(meta, rawSha256=digest(raw))
    for i, (b, c) in enumerate(zip(strings, ast)):
        require(c == (padded, expected_meta) if i == 12364 else b == c, 'Other string mutation')
    code = patched

    rr = read(code)
    require(rr.header.functionCount == r.header.functionCount, 'Function count changed')
    changed = {p['function_id'] for p in plans}
    for fid, (h, hh) in enumerate(zip(r.function_headers, rr.function_headers)):
        if fid in changed: continue
        require(bytes(h) == bytes(hh), 'Unexpected function header mutation ' + str(fid))
        require(base[h.offset:h.offset + h.bytecodeSizeInBytes] == code[hh.offset:hh.offset + hh.bytecodeSizeInBytes],
                'Unexpected function body mutation ' + str(fid))

    (OUT / 'candidate604.hbc').write_bytes(code)
    actual = digest(code)
    # NB9: `report` from append_plans was discarded, so the output omitted the
    # frozen builder's own labels. They are report fields, not require()s, so no
    # assertion was lost — but carrying them makes this directly diffable against
    # the historical Solaris-Android-R4/evidence/release/BUNDLE-RESULT.json.
    report.update(
        ui=dict(path=str(UI), sha256=digest(html.encode()), encoding=encoding,
                start=start, end=end, spare_bytes=spare),
        final_hbc_sha256=actual, final_hbc_bytes=len(code),
        changed_function_ids=sorted(changed), changed_string_ids=[12364],
        native_payload_changes=False, inference_request_and_worker_unchanged=True,
        background_lock_and_cancel_unchanged=True,
    )
    result = {
        'scope': 'HBC-input wrapper for the frozen builder; host bundle evidence only, not APK provenance',
        'input_bundle_sha256': digest(base),
        'spare_ui_bytes': spare,
        'changed_function_ids': sorted(changed),
        'final_hbc_bytes': len(code),
        'final_hbc_sha256': actual,
        'target_hbc_sha256': TARGET_HBC_SHA,
        'byte_identical_to_historical_604': actual == TARGET_HBC_SHA,
        'frozen_builder_report': report,
    }
    (OUT / 'WRAPPER-RESULT.json').write_text(json.dumps(result, indent=2) + '\n')
    return result


if __name__ == '__main__':
    print(json.dumps(build(*sys.argv[1:4]), indent=2))
