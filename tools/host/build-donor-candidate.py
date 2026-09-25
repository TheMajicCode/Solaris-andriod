#!/usr/bin/env python3
"""Build a CANDIDATE host bundle from a maintained donor, for actual-host tests.

This is the reviewed reproduction path (tools/host/hbc-input-wrapper.py build())
with exactly one input changed: the guided donor source. The frozen plan
builder Solaris-Android-R4/grounding/build-plans.py hardcodes its donor as
`source=HERE/'fast-guided.js'`. It is not edited: its bytes are hash-verified,
that ONE line is substituted in memory (asserted to occur exactly once), and the
result is executed with the frozen file's own path, so every other statement —
the 2-function donor assertion, both inline_donor sites, the bridge and receipt
rewrites — runs unchanged. Every require() in build() then applies unchanged.

The output is a candidate bundle for desktop-Hermes host tests. It is not an
APK, it is not signed, and it must never be installed. Run it in a DISPOSABLE
copy of the repository holding reconstruction-work/; nothing is written to the
tracked tree.

Usage: build-donor-candidate.py --disposable-root <copy> --bundle <603 hbc> --donor <path under root> --out <new-dir>
"""
import argparse, hashlib, importlib.util, json, sys, types
from pathlib import Path

HERE = Path(__file__).resolve().parent
PLANS = 'Solaris-Android-R4/grounding/build-plans.py'
PLANS_SHA256 = '7025545b9117d3cb28d4cda1f8e6ba3762a35f2e460c6508bd956663df04430f'
SOURCE_LINE = "    source=HERE/'fast-guided.js'\n"


def load_wrapper():
    spec = importlib.util.spec_from_file_location('hbc_input_wrapper', HERE / 'hbc-input-wrapper.py')
    m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m); return m


def substituted_plans(donor):
    def loader(src):
        path = src / PLANS
        text = path.read_text(encoding='utf-8')
        if hashlib.sha256(text.encode('utf-8')).hexdigest() != PLANS_SHA256:
            raise SystemExit('frozen build-plans.py changed; refusing to substitute into unknown code')
        if text.count(SOURCE_LINE) != 1:
            raise SystemExit('the donor source line is not present exactly once')
        mod = types.ModuleType('guided_candidate_donor')
        mod.__file__ = str(path)
        mod.DONOR_SOURCE = donor
        exec(compile(text.replace(SOURCE_LINE, '    source=DONOR_SOURCE\n'), str(path), 'exec'), mod.__dict__)
        return mod
    return loader


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument('--disposable-root', type=Path, required=True)
    p.add_argument('--bundle', type=Path, required=True)
    p.add_argument('--donor', type=Path, required=True)
    p.add_argument('--out', type=Path, required=True)
    a = p.parse_args()
    root = a.disposable_root.resolve()
    # build() below refuses any git work tree and verifies the frozen code in
    # the disposable copy before it runs anything (review of b2a6ba8, S2R-8).
    donor = a.donor.resolve()
    if root not in donor.parents:
        sys.exit('the donor must live inside the disposable root (build-plans records it relative to that root)')
    result = load_wrapper().build(root, a.bundle, a.out, plans_loader=substituted_plans(donor))
    result['scope'] = ('CANDIDATE host bundle built from a maintained donor through the reviewed '
                       'reproduction path; desktop-Hermes test input only. Not an APK, not signed, never installed.')
    result['donor'] = {'path': str(donor.relative_to(root)), 'sha256': hashlib.sha256(donor.read_bytes()).hexdigest()}
    result['byte_identical_to_historical_604'] = result['final_hbc_sha256'] == result['target_hbc_sha256']
    (a.out / 'DONOR-CANDIDATE-RESULT.json').write_text(json.dumps(result, indent=2) + '\n')
    print(json.dumps({k: result[k] for k in ('final_hbc_sha256', 'final_hbc_bytes', 'changed_function_ids',
                                             'spare_ui_bytes', 'donor', 'byte_identical_to_historical_604')}, indent=2))


if __name__ == '__main__':
    main()
