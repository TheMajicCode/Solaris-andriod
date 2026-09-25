#!/usr/bin/env node
/* Produce the two full-router scripts that docs/HOST-REPRODUCTION-EVIDENCE.md
 * measures with tools/host/measure-donor-fit.py (independent review of b2a6ba8,
 * S2R-13: the recipe was not committed, so the numbers could not be reproduced
 * exactly).
 *
 *   candidate-as-is.js   the six candidate modules concatenated in dependency
 *                        order, `import` lines dropped and `export` keywords
 *                        removed, plus a fastGuided(task) shim over
 *                        routeHostPrompt(task.prompt).
 *   candidate-lowered.js the same script lowered by the private kit's pinned
 *                        @babel/standalone 7.28.5 with the plugins listed below,
 *                        because Hermes 0.12.0 rejects `class`.
 *
 * It measures nothing and builds nothing that ships. The Babel build is read from
 * the DISPOSABLE copy and must match its pin; the output directory must not be
 * inside a git work tree.
 *
 * Usage: node tools/host/lower-candidate.cjs <disposable-root> <new-output-dir>
 */
'use strict';
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const REPO = path.resolve(__dirname, '..', '..');
const MODULES = ['matching', 'risk-screen', 'supported-surface', 'answer-boundary', 'guided-router', 'host-envelope'];
const BABEL = 'reconstruction-work/r2-tools/babel-standalone-7.28.5/package/babel.js';
const BABEL_SHA256 = 'c86085dcd80a7b2c4098737aae724e42946f897815279b255f9877d6ec1d6cc3';
const PLUGINS = ['transform-classes', 'transform-spread', 'transform-for-of', 'transform-template-literals',
  'transform-block-scoping', 'transform-arrow-functions', 'transform-parameters', 'transform-destructuring',
  'transform-shorthand-properties'];

function sha(data) { return crypto.createHash('sha256').update(data).digest('hex'); }

function insideGitWorkTree(dir) {
  for (let d = path.resolve(dir); ; d = path.dirname(d)) {
    if (fs.existsSync(path.join(d, '.git'))) return d;
    if (path.dirname(d) === d) return null;
  }
}

function main() {
  const [root, out] = process.argv.slice(2);
  if (!root || !out) throw new Error('usage: lower-candidate.cjs <disposable-root> <new-output-dir>');
  const repo = insideGitWorkTree(path.dirname(path.resolve(out)));
  if (repo) throw new Error(`refusing: output directory is inside a git work tree (${repo})`);
  const babelPath = path.join(path.resolve(root), BABEL);
  const babelSource = fs.readFileSync(babelPath);
  if (sha(babelSource) !== BABEL_SHA256) throw new Error('not the pinned @babel/standalone 7.28.5');
  fs.mkdirSync(out, { recursive: false });

  let script = '';
  for (const name of MODULES) {
    const source = fs.readFileSync(path.join(REPO, 'candidate/a605', `${name}.mjs`), 'utf8');
    script += source.split('\n')
      .filter((line) => !/^import .* from /.test(line))
      .map((line) => line.replace(/^export (function|const|class) /, '$1 '))
      .join('\n') + '\n';
  }
  script += 'function fastGuided(task) { return routeHostPrompt(task.prompt); }\n';
  const Babel = require(babelPath);
  const lowered = Babel.transform(script, { sourceType: 'script', plugins: PLUGINS }).code + '\n';

  fs.writeFileSync(path.join(out, 'candidate-as-is.js'), script);
  fs.writeFileSync(path.join(out, 'candidate-lowered.js'), lowered);
  const modules = Object.fromEntries(MODULES.map((name) =>
    [name, sha(fs.readFileSync(path.join(REPO, 'candidate/a605', `${name}.mjs`)))]));
  process.stdout.write(JSON.stringify({
    modules, babelSha256: BABEL_SHA256, plugins: PLUGINS,
    asIsSha256: sha(script), loweredSha256: sha(lowered),
  }, null, 2) + '\n');
}

main();
