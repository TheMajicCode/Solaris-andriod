/**
 * Editable semantic specification of the R2 guard-only bytecode change.
 * These helpers are documentation/test intent; they are NOT installed as new
 * app functions. tools/patch-completion-guards.py encodes the corresponding
 * existing-method calls inside two original compiled generator functions.
 * No awaited work is inserted and no SDK lifecycle admission is bypassed.
 */

// Original function #7314, immediately AFTER await provisioner.stage('stream')
// resumes normally, immediately BEFORE constructing/calling runtime.completion.
function publicCompletionGuard(service, operation) {
  service.check(operation);
}

// Original function #7337, at the same post-stage/pre-completion boundary.
// authority is the exact existing closure already checked earlier in #7337.
// RuntimeError is the original policy constructor, reached through the original
// false-authority branch. Its code/stage values remain exactly CANCELLED/local.
function privateCompletionGuard(service, operation, authority, RuntimeError) {
  if (!authority()) throw new RuntimeError('CANCELLED', 'local');
  service.check(operation);
}

// Existing completion options, receiver, model paths, cancelAction, cleanup,
// vault authority on result release, records, signing identity and native code
// remain outside this semantic patch. Full lifecycle reconciliation is pending.
