/* U0-05 static source suite.
 *
 * Reads the candidate files as text: reduced-motion and palette rules in the
 * CSS, and whole-tree scans for remote URLs, storage, model sizes and out-of-
 * scope features. SCOPE: source text only; the browser checks are separate.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, relative } from 'node:path';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const read = name => readFileSync(join(ROOT, name), 'utf8');

function files(dir = ROOT) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    if (entry === '.assets') continue; // generated, gitignored artwork
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...files(full));
    else out.push(relative(ROOT, full).split('\\').join('/'));
  }
  return out.sort();
}

// The V6 palette (host 709) as RGB triples.
const PALETTE = new Map([
  ['6,16,23', '#061017'], ['15,36,48', '#0f2430'], ['25,49,59', '#19313b'], ['241,245,237', '#f1f5ed'],
  ['175,194,188', '#afc2bc'], ['109,255,186', '#6dffba'], ['215,172,118', '#d7ac76'],
]);
const hexToRgb = hex => {
  const h = hex.length === 4 ? [...hex.slice(1)].map(c => c + c).join('') : hex.slice(1, 7);
  return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)).join(',');
};

// Built from pieces so the scanner does not match its own source.
const COLON_SLASHES = ':' + '//';
const REMOTE = [
  new RegExp('https?' + COLON_SLASHES, 'i'),
  new RegExp('(?:src|href|action)\\s*=\\s*["\']' + '//', 'i'),
  new RegExp('url\\(\\s*["\']?(?:[a-z]+:)?' + '//', 'i'),
  new RegExp('@' + 'import', 'i'),
  new RegExp('\\b(?:fe' + 'tch|XMLHttp' + 'Request|Web' + 'Socket|Event' + 'Source|send' + 'Beacon)\\s*\\(', ''),
];
const STORAGE = new RegExp('local' + 'Storage|session' + 'Storage|indexed' + 'DB|document\\.' + 'cookie|caches\\.open', '');
const MODEL_SIZE = /\b\d+(?:[.,]\d+)?\s?(?:MB|MiB|GB|GiB)\b/;
const OUT_OF_SCOPE = /nostr|\bbalances?\b|\bearnings?\b|geolocation|getCurrentPosition|telemetry|analytics|sign[- ]?up|provisionChoice|generateKey|createVault|seed phrase|mnemonic/i;
// Code only: comments may name what the code refuses to do.
const stripComments = text => text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/<!--[\s\S]*?-->/g, '').replace(/(^|[\s;{}(),])\/\/.*$/gm, '$1');

export function run(t) {
  const css = read('onboarding.css');

  // --- motion ---------------------------------------------------------------
  const reduce = /@media \(prefers-reduced-motion: reduce\) \{([\s\S]*?)\n\}/.exec(css);
  t.ok('M1 a prefers-reduced-motion: reduce block exists', !!reduce);
  t.ok('M2 reduced motion removes animation', !!reduce && /animation: none !important/.test(reduce[1]));
  t.ok('M3 reduced motion removes transitions', !!reduce && /transition: none !important/.test(reduce[1]));
  t.ok('M4 reduced motion covers every .ob descendant', !!reduce && /\.ob \*/.test(reduce[1]));
  t.ok('M5 no infinite or looping animation', !/infinite|alternate/.test(css));
  const keyframes = [...css.matchAll(/@keyframes\s+([\w-]+)\s*\{([\s\S]*?\})\s*\}/g)];
  t.equal('M6 exactly one keyframes rule', keyframes.length, 1);
  for (const [, name, body] of keyframes) {
    const props = [...body.matchAll(/([a-z-]+)\s*:/g)].map(m => m[1]);
    t.ok(`M7 @keyframes ${name} animates only opacity/transform`, props.length > 0 && props.every(p => p === 'opacity' || p === 'transform'));
  }
  const durations = [...css.matchAll(/animation:\s*[\w-]+\s+([\d.]+)s/g)].map(m => Number(m[1]));
  t.ok('M8 entrance animation is brief (<= 0.3s)', durations.length > 0 && durations.every(d => d <= 0.3));
  t.ok('M9 no WebGL/video/audio/canvas in the candidate UI', !/<(?:video|audio|canvas)\b|webgl|getContext/i.test(read('render.mjs') + read('preview/index.html')));
  t.ok('M10 no timer gates a control in the renderer', !/setTimeout|setInterval|requestAnimationFrame/.test(read('render.mjs')));

  // --- palette and type -------------------------------------------------------
  const hexes = [...new Set([...css.matchAll(/#[0-9a-fA-F]{3,8}\b/g)].map(m => m[0].toLowerCase()))];
  const rgbas = [...new Set([...css.matchAll(/rgba?\(([^)]*)\)/g)].map(m => m[1].split(',').slice(0, 3).map(s => s.trim()).join(',')))];
  t.ok('P1 CSS uses colours', hexes.length > 0);
  for (const h of hexes) t.ok(`P2 hex ${h} is in the V6 palette`, PALETTE.has(hexToRgb(h)));
  for (const c of rgbas) t.ok(`P3 rgba(${c}) is a V6 palette colour`, PALETTE.has(c));
  t.ok('P4 serif titles use Georgia/Times', /font-family: Georgia, "Times New Roman", serif/.test(css));
  t.ok('P5 system sans body with Inter fallback', /system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, sans-serif/.test(css));
  t.ok('P6 no web font is declared', !/@font-face/.test(css));
  t.ok('P7 buttons are at least 48 CSS px both ways', /\.ob-btn \{[^}]*min-width: 48px;[^}]*min-height: 48px;/.test(css));
  t.ok('P8 the text field is at least 48 CSS px tall', /\.ob-field input \{[^}]*min-height: 48px;/.test(css));
  t.ok('P9 no backdrop blur is required', !/backdrop-filter:\s*blur/.test(css));
  t.ok('P10 font sizes scale with text size (rem, not px)', ![...css.matchAll(/font-size:\s*([^;]+);/g)].some(m => /px/.test(m[1])));

  // --- whole-tree scans -------------------------------------------------------
  const all = files();
  t.ok('F1 the scan sees the candidate files', ['route.mjs', 'copy.mjs', 'actions.mjs', 'render.mjs', 'onboarding.css', 'preview/index.html', 'preview/preview.mjs'].every(f => all.includes(f)));
  for (const f of all) {
    const text = read(f);
    for (const [i, pattern] of REMOTE.entries()) t.ok(`F2 ${f} has no remote reference (${i})`, !pattern.test(text));
    if (!f.startsWith('tests/')) {
      const code = stripComments(text);
      t.ok(`F3 ${f} uses no browser storage`, !STORAGE.test(code));
      t.ok(`F4 ${f} states no model size`, !MODEL_SIZE.test(text));
      t.ok(`F5 ${f} has no wallet/key/location/signup/telemetry/provisioning code`, !OUT_OF_SCOPE.test(code));
    }
    t.ok(`F6 ${f} has no data: URL`, !/data:(?:image|font|text)\//.test(text));
  }

  // --- preview isolation ------------------------------------------------------
  const html = read('preview/index.html');
  const csp = (/http-equiv="Content-Security-Policy" content="([^"]*)"/.exec(html) || [])[1] || '';
  t.ok('I1 preview declares a CSP', csp.length > 0);
  for (const directive of ["default-src 'none'", "script-src 'self'", "style-src 'self'", "img-src 'self'", "connect-src 'none'", "font-src 'none'", "form-action 'none'", "base-uri 'none'"]) {
    t.ok(`I2 CSP has ${directive}`, csp.includes(directive));
  }
  t.ok('I3 CSP allows no inline script/style or remote host', !/unsafe-inline|unsafe-eval|https?:|\*/.test(csp));
  t.ok('I4 preview banner states it is synthetic', html.includes('Design preview — synthetic state. No vault, model, records or native bridge.'));
  t.ok('I5 preview has no inline script', !/<script(?![^>]*\bsrc=)[^>]*>/.test(html));
  const preview = read('preview/preview.mjs');
  t.ok('I6 preview log never prints the typed name', /<\$\{String\(p && p\.name \|\| ''\)\.length\} characters>/.test(preview));
  t.ok('I7 preview host never offers provisioning or key creation', !/provision|generate|keypair/i.test(preview.replace(/No vault, model/g, '')));
}
