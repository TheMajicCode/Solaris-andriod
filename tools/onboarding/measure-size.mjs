#!/usr/bin/env node
/* Size of the U0 onboarding candidate, for comparison with the HBC UI slot.
 *
 * Measures the candidate UI source (route, copy, actions, render + CSS; not the
 * preview, not the tests) raw and "minified". Minified here means token-level
 * whitespace and comment removal with the TypeScript scanner (no identifier
 * mangling, no dead-code removal): a conservative lower bound on effort, not a
 * production bundler. To prove the stripped JS still means the same thing, the
 * candidate is copied to --out, its JS modules are replaced by the stripped
 * versions and the unchanged test suite is run against them.
 *
 * Reports UTF-16 code units (JavaScript string length; 2 bytes each) against
 * the historical budget of 968 characters / 1,936 bytes quoted in the sprint
 * contract. That budget is a historical measurement, not a guarantee.
 *
 * Usage: node tools/onboarding/measure-size.mjs --out <scratch-dir>
 * Needs the globally installed `typescript` package (not added to the repo).
 */
import { readFileSync, writeFileSync, cpSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { spawnSync, execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { join, resolve, relative, isAbsolute, dirname } from 'node:path';

const REPO = resolve(fileURLToPath(new URL('../..', import.meta.url)));
const ROOT = join(REPO, 'candidate', 'onboarding');
const JS = ['route.mjs', 'copy.mjs', 'actions.mjs', 'render.mjs'];
const CSS = ['onboarding.css'];
const BUDGET_CHARS = 968;
const BUDGET_BYTES_UTF16 = 1936;

function loadTypeScript() {
  try { return createRequire(import.meta.url)('typescript'); } catch { /* fall through */ }
  const globalRoot = execFileSync('npm', ['root', '-g'], { encoding: 'utf8' }).trim();
  try { return createRequire(join(globalRoot, 'noop.js'))('typescript'); } catch {
    throw Error('BLOCKED: the typescript package is not importable; nothing was measured');
  }
}

const IDENT = /[A-Za-z0-9_$\u0080-\uffff]/;
const DROP_AFTER = new Set([';', '{', ',', '(', '[', '=>', '=', ':', '?', '&&', '||', '??', '+', '*', '.', '?.', '===', '!==', '<', '>', '<=', '>=']);
const DROP_BEFORE = new Set(['}', ')', ']', '.', ',', ';', ':', '?', '&&', '||', '??', '=>', '?.', '===', '!==']);

function stripJs(ts, text) {
  const k = ts.SyntaxKind;
  const scanner = ts.createScanner(ts.ScriptTarget.Latest, false, ts.LanguageVariant.Standard, text);
  const out = [];
  const templates = []; // brace depth stack: 'b' = ordinary brace, 't' = template substitution
  let prev = null; // previous significant token kind
  let sawNewline = false;
  // After these tokens a slash starts a regular expression.
  const exprEnd = new Set([k.Identifier, k.NumericLiteral, k.StringLiteral, k.CloseParenToken, k.CloseBracketToken,
    k.CloseBraceToken, k.NoSubstitutionTemplateLiteral, k.TemplateTail, k.ThisKeyword, k.TrueKeyword, k.FalseKeyword,
    k.NullKeyword, k.PlusPlusToken, k.MinusMinusToken, k.RegularExpressionLiteral]);
  for (let kind = scanner.scan(); kind !== k.EndOfFileToken; kind = scanner.scan()) {
    if (kind === k.NewLineTrivia) { sawNewline = true; continue; }
    if (kind === k.WhitespaceTrivia || kind === k.SingleLineCommentTrivia || kind === k.MultiLineCommentTrivia || kind === k.ShebangTrivia) continue;
    if ((kind === k.SlashToken || kind === k.SlashEqualsToken) && !exprEnd.has(prev)) kind = scanner.reScanSlashToken();
    if (kind === k.CloseBraceToken && templates.at(-1) === 't') {
      kind = scanner.reScanTemplateToken(false);
      if (kind === k.TemplateTail) templates.pop();
    } else if (kind === k.CloseBraceToken) templates.pop();
    if (kind === k.OpenBraceToken) templates.push('b');
    if (kind === k.TemplateHead) templates.push('t');
    const token = scanner.getTokenText();
    const last = out.length ? out[out.length - 1].trim() : '';
    const needSpace = last && (
      (IDENT.test(last.at(-1)) && IDENT.test(token[0])) ||
      (last.at(-1) === '+' && token[0] === '+') || (last.at(-1) === '-' && token[0] === '-') ||
      (last.at(-1) === '/' && token[0] === '/'));
    // Conservative ASI rule: a line break survives unless the previous token cannot end a
    // statement or the next token cannot start one. It never joins `return`/`throw` to a value.
    const asi = sawNewline && last && !DROP_AFTER.has(last) && !DROP_BEFORE.has(token);
    out.push(asi ? `\n${token}` : needSpace ? ` ${token}` : token);
    prev = kind;
    sawNewline = false;
  }
  return out.join('');
}

function stripCss(text) {
  return text
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{};,>])\s*/g, '$1')
    .replace(/:\s+/g, ':')
    .replace(/;}/g, '}')
    .trim();
}

const utf8 = s => Buffer.byteLength(s, 'utf8');

function main() {
  const i = process.argv.indexOf('--out');
  if (i < 0 || !process.argv[i + 1]) throw Error('usage: node tools/onboarding/measure-size.mjs --out <scratch-dir>');
  const out = resolve(process.argv[i + 1]);
  const inside = relative(REPO, out);
  if (!inside.startsWith('..') && !isAbsolute(inside)) throw Error('--out must be outside the repository');
  // Same rule as tools/host/_guard.py (review of b2a6ba8, S2R-8): no git work tree at all,
  // including sibling clones and .claude/worktrees/, because this tool deletes under --out.
  for (let d = out; ; d = dirname(d)) {
    if (existsSync(join(d, '.git'))) throw Error(`--out is inside a git work tree (${d})`);
    if (dirname(d) === d) break;
  }
  const ts = loadTypeScript();

  const rows = [];
  const stripped = {};
  for (const f of [...JS, ...CSS]) {
    const raw = readFileSync(join(ROOT, f), 'utf8');
    const min = f.endsWith('.css') ? stripCss(raw) : stripJs(ts, raw);
    stripped[f] = min;
    rows.push({ file: f, rawChars: raw.length, rawUtf8: utf8(raw), minChars: min.length, minUtf8: utf8(min), minUtf16Bytes: min.length * 2 });
  }
  const total = rows.reduce((a, r) => ({ rawChars: a.rawChars + r.rawChars, rawUtf8: a.rawUtf8 + r.rawUtf8, minChars: a.minChars + r.minChars, minUtf8: a.minUtf8 + r.minUtf8, minUtf16Bytes: a.minUtf16Bytes + r.minUtf16Bytes }),
    { rawChars: 0, rawUtf8: 0, minChars: 0, minUtf8: 0, minUtf16Bytes: 0 });

  // Semantic check: the unchanged suite against the stripped JS modules.
  const dir = join(out, 'stripped-candidate');
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  cpSync(ROOT, dir, { recursive: true, filter: src => !src.split(/[\\/]/).includes('.assets') });
  for (const f of JS) writeFileSync(join(dir, f), stripped[f]);
  const parse = JS.map(f => ({ f, code: spawnSync(process.execPath, ['--check', join(dir, f)], { encoding: 'utf8' }).status }));
  const tests = spawnSync(process.execPath, [join(dir, 'tests', 'run.mjs')], { cwd: dir, encoding: 'utf8' });
  const summary = (tests.stdout.match(/summary: .*/) || ['no summary'])[0];

  const report = {
    method: 'token-level whitespace/comment removal (TypeScript scanner); no identifier mangling',
    typescript: ts.version,
    files: rows,
    total,
    budget: { chars: BUDGET_CHARS, bytesUtf16: BUDGET_BYTES_UTF16 },
    overBudget: { chars: total.minChars - BUDGET_CHARS, bytesUtf16: total.minUtf16Bytes - BUDGET_BYTES_UTF16, ratio: +(total.minChars / BUDGET_CHARS).toFixed(1) },
    strippedJsParses: parse,
    strippedJsTests: { exit: tests.status, summary },
  };
  writeFileSync(join(out, 'size-report.json'), JSON.stringify(report, null, 1));
  console.log(JSON.stringify(report, null, 1));
  const ok = parse.every(p => p.code === 0) && tests.status === 0;
  if (!ok) console.log('FAIL: the stripped modules do not parse or do not pass the suite; the size figure is not trustworthy');
  process.exit(ok ? 0 : 1);
}

try { main(); } catch (error) { console.log(`FAIL: ${error.message}`); process.exit(1); }
