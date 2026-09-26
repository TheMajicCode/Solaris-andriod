/* Load the FROZEN build-604 guided helper for baseline comparison.
 *
 * Solaris-Android-R4/grounding/fast-guided.js is frozen imported source. It is
 * read and evaluated here, never modified. Its bytes are hash-verified by
 * tools/repo-check.py's frozen-integrity check.
 *
 * SCOPE LIMIT: this is the HELPER, evaluated in a vm context with a synthetic
 * task envelope. It is not the actual 604 DailyService, not the host bytecode,
 * and not a phone. Results labelled `baseline` here are helper-level only.
 */
import { readFileSync } from 'node:fs';
import { createContext, runInContext } from 'node:vm';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const BASELINE_PATH = 'Solaris-Android-R4/grounding/fast-guided.js';

const context = createContext({});
runInContext(readFileSync(join(REPO, BASELINE_PATH), 'utf8'), context);

/** Build the task envelope shape the frozen helper expects. */
export function baselineTask(user, locale, { facts = [], sources = [], sourceRefs = [] } = {}) {
  return {
    prompt: `You are LUCA AI. Reply in ${locale} warmly.\n`
      + JSON.stringify({ user, facts, allowed: [] }) + ' /no_think',
    manifest: { sources },
    sourceRefs,
  };
}

/** @returns {{message:string,sourceRefs:Array,kind:string}|null} */
export function runBaseline(user, locale, options) {
  return context.fastGuided(baselineTask(user, locale, options));
}
