#!/usr/bin/env node
/* Browser preview checks for the U0 onboarding candidate.
 *
 * BROWSER PREVIEW CHECKS — NOT TalkBack, NOT a device, NOT the APK.
 *
 * Serves candidate/onboarding from 127.0.0.1 only, opens the synthetic preview
 * in the pre-installed Chromium through the globally installed Playwright (no
 * dependency is added to this repository; `playwright install` is never run)
 * and measures every scenario at several viewports, EN/ES, 100%/200% default
 * text size, with and without reduced motion, plus a keyboard-open
 * approximation. Any request that is not to the local server is aborted and
 * reported. Screenshots and the JSON result go to --out (outside the repo).
 *
 * Usage: node tools/onboarding/visual-qa.mjs --out <dir> [--browser <chromium path>]
 * Fails closed: missing Playwright/Chromium/artwork or any failed check -> exit 1.
 */
import { createServer } from 'node:http';
import { readFileSync, existsSync, mkdirSync, writeFileSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { join, resolve, relative, isAbsolute, extname, normalize, sep } from 'node:path';

const REPO = resolve(fileURLToPath(new URL('../..', import.meta.url)));
const ROOT = join(REPO, 'candidate', 'onboarding');
const TYPES = { '.html': 'text/html; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.png': 'image/png' };

const VIEWPORTS = [
  { name: '320x568', width: 320, height: 568 },
  { name: '360x640', width: 360, height: 640 },
  { name: '390x844', width: 390, height: 844 },
  { name: '320x480-short', width: 320, height: 480 },
];
const KEYBOARD = [
  { name: '360x640-keyboard', width: 360, height: 640, keyboardHeight: 300 },
  { name: '320x568-keyboard', width: 320, height: 568, keyboardHeight: 260 },
];
// Controls the contract requires to be visible (reachable) on each screen.
const REQUIRED = {
  opening: ['language'],
  welcome: ['start', 'restore', 'language', 'vision'],
  returning: ['unlock', 'lockedAiSetup', 'language'],
  migration: ['migrationSetup', 'language'],
  chapter1: ['next', 'skip', 'language'],
  chapter2: ['aiSetup', 'withoutAI', 'back', 'skip', 'language'],
  chapter3: ['done', 'doneCheckin', 'doneRecords', 'back', 'language'],
  home: [],
};
const FORBIDDEN = { chapter1: ['back', 'done'], chapter3: ['skip'], migration: ['skip', 'done', 'back'], returning: ['start', 'restore'] };

function args(argv) {
  const get = flag => { const i = argv.indexOf(flag); return i >= 0 ? argv[i + 1] : undefined; };
  const out = get('--out');
  if (!out) throw Error('usage: node tools/onboarding/visual-qa.mjs --out <dir> [--browser <path>]');
  const outDir = resolve(out);
  const inside = relative(REPO, outDir);
  if (!inside.startsWith('..') && !isAbsolute(inside)) throw Error('--out must be outside the repository');
  return { outDir, browser: get('--browser') || '/opt/pw-browsers/chromium' };
}

function loadPlaywright() {
  const attempts = [];
  const tryRequire = (label, from) => {
    try { return createRequire(from)('playwright'); } catch (e) { attempts.push(`${label}: ${e.code || e.message}`); return null; }
  };
  let pw = tryRequire('local/NODE_PATH', import.meta.url);
  if (!pw) {
    try {
      const globalRoot = execFileSync('npm', ['root', '-g'], { encoding: 'utf8' }).trim();
      pw = tryRequire(`npm root -g (${globalRoot})`, join(globalRoot, 'noop.js'));
    } catch (e) { attempts.push(`npm root -g: ${e.message}`); }
  }
  if (!pw) throw Error(`BLOCKED: Playwright is not importable (${attempts.join('; ')}). No package was installed.`);
  return pw;
}

function serve() {
  const server = createServer((req, res) => {
    const url = new URL(req.url, 'http://127.0.0.1');
    const path = normalize(decodeURIComponent(url.pathname)).replace(/^([/\\])+/, '');
    const file = join(ROOT, path);
    if (!(file === ROOT || file.startsWith(ROOT + sep)) || !existsSync(file) || !statSync(file).isFile() || !TYPES[extname(file)]) {
      res.writeHead(404, { 'content-type': 'text/plain' });
      res.end('not found');
      return;
    }
    res.writeHead(200, { 'content-type': TYPES[extname(file)], 'cache-control': 'no-store' });
    res.end(readFileSync(file));
  });
  return new Promise(ok => server.listen(0, '127.0.0.1', () => ok(server)));
}

async function setText(page) {
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
}
const rootPx = page => page.evaluate(() => parseFloat(getComputedStyle(document.documentElement).fontSize));

const CONTRAST_SCENARIOS = ['opening-error', 'welcome', 'welcome-vision', 'welcome-setup-failed', 'returning', 'migration', 'chapter-1', 'chapter-2', 'chapter-3-failed'];

/** The line boxes of every text node in the candidate UI and the colour it is drawn in;
 * then all candidate text is made transparent (inline !important via the CSSOM, CSP-safe). */
function textBoxes() {
  const out = [];
  const walker = document.createTreeWalker(document.getElementById('app'), NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (!node.nodeValue.trim()) continue;
    const el = node.parentElement;
    const s = getComputedStyle(el);
    if (s.visibility === 'hidden' || s.display === 'none') continue;
    const size = parseFloat(s.fontSize);
    const range = document.createRange();
    range.selectNodeContents(node);
    for (const r of range.getClientRects()) {
      if (r.width < 1 || r.height < 1) continue;
      out.push({ what: `${el.tagName.toLowerCase()}${el.className ? '.' + String(el.className).split(' ').join('.') : ''}`, text: node.nodeValue.trim().slice(0, 32), color: s.color,
        large: size >= 24 || (size >= 18.66 && Number(s.fontWeight) >= 700), logotype: !!el.closest('.ob-word'), disabled: !!el.closest('button:disabled'),
        x: r.left, y: r.top + window.scrollY, w: r.width, h: r.height });
    }
  }
  for (const el of document.querySelectorAll('#app, #app *')) {
    el.style.setProperty('color', 'transparent', 'important');
    el.style.setProperty('text-shadow', 'none', 'important');
  }
  return out;
}

/** Runs in about:blank: worst-pixel WCAG contrast behind each text box. */
async function sampleContrast([png, boxes]) {
  const img = new Image();
  img.src = `data:image/png;base64,${png}`;
  await img.decode();
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(img, 0, 0);
  const lin = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
  const lum = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  return boxes.map(b => {
    const [r, g, bl] = b.color.match(/[\d.]+/g).map(Number);
    const lt = lum(r, g, bl);
    const x = Math.max(0, Math.floor(b.x)), y = Math.max(0, Math.floor(b.y));
    const w = Math.max(1, Math.min(canvas.width - x, Math.floor(b.w))), h = Math.max(1, Math.min(canvas.height - y, Math.floor(b.h)));
    const data = ctx.getImageData(x, y, w, h).data;
    let worst = Infinity;
    for (let i = 0; i < data.length; i += 4) {
      const lb = lum(data[i], data[i + 1], data[i + 2]);
      const ratio = (Math.max(lt, lb) + 0.05) / (Math.min(lt, lb) + 0.05);
      if (ratio < worst) worst = ratio;
    }
    const need = b.large ? 3 : 4.5;
    return { what: b.what, text: b.text, large: b.large, logotype: b.logotype, disabled: b.disabled, worst: +worst.toFixed(2), need, pass: b.logotype || b.disabled || worst >= need };
  });
}

/** Runs inside the page: measures layout, controls and motion. */
function measure([required, forbidden]) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const app = document.getElementById('app');
  const screen = document.body.dataset.screen || '';
  const doc = document.documentElement;
  const overflowPx = Math.max(0, doc.scrollWidth - vw);
  const offenders = [];
  for (const el of document.querySelectorAll('body *')) {
    if (el.classList.contains('ob-forest')) continue;
    const s = getComputedStyle(el);
    if (s.display === 'none' || s.visibility === 'hidden') continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    if (r.right > vw + 0.5 || r.left < -0.5) offenders.push(`${el.tagName.toLowerCase()}.${[...el.classList].join('.')}:${Math.round(r.left)}..${Math.round(r.right)}`);
  }
  const buttons = [...app.querySelectorAll('button')].filter(b => getComputedStyle(b).display !== 'none');
  const sizes = buttons.map(b => { const r = b.getBoundingClientRect(); return { action: b.dataset.do || '', w: +r.width.toFixed(1), h: +r.height.toFixed(1), name: (b.getAttribute('aria-label') || b.textContent || '').trim() }; });
  const unreachable = [];
  for (const b of buttons) {
    b.scrollIntoView({ block: 'center', inline: 'nearest' });
    const r = b.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const inView = r.top >= -0.5 && r.bottom <= vh + 0.5 && r.left >= -0.5 && r.right <= vw + 0.5;
    const hit = document.elementFromPoint(cx, cy);
    if (!inView || !(hit === b || b.contains(hit))) unreachable.push(b.dataset.do || b.textContent.trim());
  }
  window.scrollTo(0, 0);
  const banner = document.querySelector('.pv-banner');
  const br = banner.getBoundingClientRect();
  const bannerHit = document.elementFromPoint(Math.min(vw - 1, br.left + 8), br.top + br.height / 2);
  const bannerVisible = br.height > 0 && br.top >= 0 && (bannerHit === banner || banner.contains(bannerHit));
  const present = new Set(buttons.map(b => b.dataset.do));
  // Words split across two lines (informational; overflow-wrap breaks them instead of overflowing).
  const broken = [];
  const walker = document.createTreeWalker(app, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    for (const match of node.nodeValue.matchAll(/\S+/g)) {
      const range = document.createRange();
      range.setStart(node, match.index);
      range.setEnd(node, match.index + match[0].length);
      const tops = new Set([...range.getClientRects()].filter(r => r.width > 0).map(r => Math.round(r.top)));
      if (tops.size > 1) broken.push(match[0]);
    }
  }
  const word = app.querySelector('.ob-word');
  const wordOneLine = !word || word.getBoundingClientRect().height < 2 * parseFloat(getComputedStyle(word).fontSize);
  const anims = document.getAnimations();
  const animatedTargets = anims.map(a => a.effect && a.effect.target).filter(Boolean);
  const buttonInAnimated = buttons.some(b => animatedTargets.some(t => t.contains(b)));
  return {
    screen,
    lang: doc.lang,
    sectionLang: (app.querySelector('section') || {}).lang || '',
    rootFontPx: parseFloat(getComputedStyle(doc).fontSize),
    overflowPx,
    offenders: offenders.slice(0, 8),
    buttons: sizes,
    minW: sizes.length ? Math.min(...sizes.map(s => s.w)) : null,
    minH: sizes.length ? Math.min(...sizes.map(s => s.h)) : null,
    unnamed: sizes.filter(s => !s.name).map(s => s.action),
    unreachable,
    missing: required.filter(a => !present.has(a)),
    unexpected: forbidden.filter(a => present.has(a)),
    animations: anims.length,
    animationsOnlyEntrance: animatedTargets.every(t => t.classList.contains('ob-enter')),
    animationsFinite: anims.every(a => Number.isFinite(a.effect.getComputedTiming().iterations)),
    buttonInAnimated,
    enterAnimationName: (document.querySelector('.ob-enter') && getComputedStyle(document.querySelector('.ob-enter')).animationName) || null,
    imagesLoaded: [...app.querySelectorAll('img')].every(i => i.complete && i.naturalWidth > 0),
    bannerVisible,
    brokenWords: broken,
    wordOneLine,
    pageHeight: doc.scrollHeight,
  };
}

async function main() {
  const { outDir, browser: browserPath } = args(process.argv.slice(2));
  const shots = join(outDir, 'onboarding-shots');
  mkdirSync(shots, { recursive: true });
  for (const f of ['emblem.png', 'forest_sanctuary.png']) {
    if (!existsSync(join(ROOT, 'preview', '.assets', f))) throw Error(`BLOCKED: ${f} not extracted; run python3 tools/onboarding/extract-assets.py`);
  }
  if (!existsSync(browserPath)) throw Error(`BLOCKED: Chromium not found at ${browserPath}`);
  const { chromium } = loadPlaywright();
  const { SCENARIOS } = await scenarioList();
  const server = await serve();
  const origin = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({ executablePath: browserPath, headless: true });
  const version = browser.version();
  const results = [];
  const failures = [];
  const network = [];

  async function open({ viewport, locale, text, motion, scenario }) {
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, reducedMotion: motion, deviceScaleFactor: 1, locale: locale === 'es' ? 'es-ES' : 'en-US' });
    const page = await context.newPage();
    const external = [];
    const errors = [];
    await page.route('**/*', route => {
      const url = route.request().url();
      if (url.startsWith(`${origin}/`)) return route.continue();
      external.push(url);
      return route.abort();
    });
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', e => errors.push(String(e)));
    await page.goto(`${origin}/preview/index.html?state=${scenario}&locale=${locale}&panel=closed`);
    await page.waitForSelector('body[data-ready="1"]', { timeout: 10000 });
    // 200% text: the root font size doubles through the CSSOM (CSP-compatible). The CSS sizes
    // all type in rem, so this equals a 200% default text size. CDP Page.setFontSizes was tried
    // first and rejected: Playwright's full-page capture silently resets it to 16px.
    const textMethod = text === 200 ? 'CSSOM html font-size 200%' : 'default 16px';
    if (text === 200) await setText(page);
    return { context, page, external, errors, textMethod };
  }

  for (const scenario of SCENARIOS) {
    for (const viewport of VIEWPORTS) {
      for (const locale of ['en', 'es']) {
        for (const text of [100, 200]) {
          for (const motion of ['no-preference', 'reduce']) {
            const { context, page, external, errors, textMethod } = await open({ viewport, locale, text, motion, scenario: scenario.id });
            const key = await page.evaluate(() => document.body.dataset.screen);
            const m = await page.evaluate(measure, [REQUIRED[key] || [], FORBIDDEN[key] || []]);
            const id = `${scenario.id}/${viewport.name}/${locale}/${text}%/${motion}`;
            const problems = [];
            if (m.overflowPx > 0 || m.offenders.length) problems.push(`horizontal overflow ${m.overflowPx}px ${m.offenders.join(' ')}`);
            if (m.minW !== null && (m.minW < 48 || m.minH < 48)) problems.push(`button below 48x48: ${JSON.stringify(m.buttons.filter(b => b.w < 48 || b.h < 48))}`);
            if (m.unnamed.length) problems.push(`buttons without a name: ${m.unnamed}`);
            if (m.unreachable.length) problems.push(`not reachable by scrolling: ${m.unreachable}`);
            if (m.missing.length) problems.push(`required control missing: ${m.missing}`);
            if (m.unexpected.length) problems.push(`control not appropriate here: ${m.unexpected}`);
            if (m.lang !== locale || (m.sectionLang && m.sectionLang !== locale)) problems.push(`lang ${m.lang}/${m.sectionLang}`);
            if (text === 200 && m.rootFontPx !== 32) problems.push(`200% text not applied (root ${m.rootFontPx}px via ${textMethod})`);
            if (motion === 'reduce' && (m.animations !== 0 || (m.enterAnimationName && m.enterAnimationName !== 'none'))) problems.push(`motion under reduce: ${m.animations} animations, ${m.enterAnimationName}`);
            if (motion !== 'reduce' && (!m.animationsOnlyEntrance || !m.animationsFinite)) problems.push('non-entrance or looping animation');
            if (m.buttonInAnimated) problems.push('a control sits inside an animated element');
            if (!m.imagesLoaded) problems.push('an image did not load');
            if (!m.bannerVisible) problems.push('preview banner hidden or covered');
            if (!m.wordOneLine) problems.push('SOLARIS wordmark broken across lines');
            if (external.length) problems.push(`non-local request: ${external}`);
            if (errors.length) problems.push(`console errors: ${errors.join(' | ')}`);
            if (key !== scenario.expect) problems.push(`screen ${key}, expected ${scenario.expect}`);
            network.push(...external);
            if (motion === 'no-preference') {
              await page.evaluate(() => Promise.all(document.getAnimations().map(a => a.finished)));
              await page.screenshot({ path: join(shots, `${scenario.id}__${viewport.name}__${locale}__${text}.jpg`), fullPage: true, type: 'jpeg', quality: 70 });
              const after = await rootPx(page);
              if (after !== m.rootFontPx) problems.push(`text size changed during capture (${m.rootFontPx}px -> ${after}px)`);
            }
            results.push({ id, scenario: scenario.id, viewport: viewport.name, locale, text, motion, textMethod, ...m, problems });
            if (problems.length) failures.push(`${id}: ${problems.join('; ')}`);
            await context.close();
          }
        }
      }
    }
  }

  // Keyboard-open approximation: the visible height shrinks while the name field has focus.
  for (const kb of KEYBOARD) {
    for (const locale of ['en', 'es']) {
      for (const text of [100, 200]) {
        const { context, page, external, errors } = await open({ viewport: kb, locale, text, motion: 'no-preference', scenario: 'chapter-3' });
        await page.setViewportSize({ width: kb.width, height: kb.height - kb.keyboardHeight });
        const rootAfterResize = await rootPx(page);
        // A fresh focus after the resize, as a platform scrolls a newly focused field into view.
        await page.focus('#name');
        await page.keyboard.press('Control+A');
        await page.keyboard.type('Sam');
        const field = await page.evaluate(() => { const r = document.getElementById('name').getBoundingClientRect(); return { top: r.top, bottom: r.bottom, vh: window.innerHeight }; });
        const m = await page.evaluate(measure, [REQUIRED.chapter3, FORBIDDEN.chapter3]);
        const typed = await page.inputValue('#name');
        const id = `keyboard/${kb.name}/${locale}/${text}%`;
        const problems = [];
        if (field.top < 0 || field.bottom > field.vh) problems.push(`focused field not visible (${Math.round(field.top)}..${Math.round(field.bottom)} of ${field.vh})`);
        if (m.overflowPx > 0 || m.offenders.length) problems.push(`horizontal overflow ${m.overflowPx}px`);
        if (typed !== 'Sam') problems.push(`typed value ${typed}`);
        if (m.unreachable.length) problems.push(`not reachable by scrolling: ${m.unreachable}`);
        if (m.missing.length) problems.push(`required control missing: ${m.missing}`);
        if (m.minW < 48 || m.minH < 48) problems.push('button below 48x48');
        if (rootAfterResize !== (text === 200 ? 32 : 16) || m.rootFontPx !== rootAfterResize) problems.push(`text size not held through the resize (${rootAfterResize}px/${m.rootFontPx}px)`);
        if (!m.bannerVisible) problems.push('preview banner hidden or covered');
        if (!m.wordOneLine) problems.push('SOLARIS wordmark broken across lines');
        if (external.length || errors.length) problems.push(`requests/errors: ${external} ${errors}`);
        await page.evaluate(() => document.getElementById('name').scrollIntoView({ block: 'center' }));
        await page.screenshot({ path: join(shots, `keyboard__${kb.name}__${locale}__${text}.jpg`), fullPage: false, type: 'jpeg', quality: 70 });
        results.push({ id, scenario: 'chapter-3', viewport: `${kb.name} (visible ${kb.height - kb.keyboardHeight}px)`, locale, text, motion: 'no-preference', field, ...m, problems });
        if (problems.length) failures.push(`${id}: ${problems.join('; ')}`);
        await context.close();
      }
    }
  }

  // Contrast on the actual artwork: worst background pixel behind each text box.
  const contrast = [];
  for (const scenario of CONTRAST_SCENARIOS) {
    for (const viewport of [VIEWPORTS[0], VIEWPORTS[2]]) {
      for (const locale of ['en', 'es']) {
        const { context, page } = await open({ viewport, locale, text: 100, motion: 'reduce', scenario });
        const boxes = await page.evaluate(textBoxes);
        const png = (await page.screenshot({ fullPage: true, type: 'png' })).toString('base64');
        const blank = await context.newPage();
        const rows = await blank.evaluate(sampleContrast, [png, boxes]);
        const id = `contrast/${scenario}/${viewport.name}/${locale}`;
        const low = rows.filter(r => !r.pass);
        contrast.push({ id, rows });
        if (low.length) failures.push(`${id}: below WCAG AA: ${JSON.stringify(low)}`);
        await context.close();
      }
    }
  }

  // Interaction smoke in the preview (synthetic host log is the observable).
  const smoke = [];
  {
    const { context, page } = await open({ viewport: VIEWPORTS[1], locale: 'en', text: 100, motion: 'reduce', scenario: 'welcome' });
    await page.click('button[data-do="language"]');
    const langAfter = await page.evaluate(() => document.documentElement.lang);
    const logAfterLang = await page.$$eval('#pv-log li', ls => ls.map(l => l.textContent));
    await page.click('button[data-do="start"]');
    await page.waitForTimeout(100);
    const logAfterStart = await page.$$eval('#pv-log li', ls => ls.map(l => l.textContent));
    smoke.push({ check: 'welcome: language switch while locked', lang: langAfter, hostCalls: logAfterLang, pass: langAfter === 'es' && logAfterLang.length === 1 && logAfterLang[0] === "request('view')" });
    smoke.push({ check: 'welcome: Get started', hostCalls: logAfterStart, pass: JSON.stringify(logAfterStart) === JSON.stringify(["request('view')", "request('openSetup')"]) });
    await context.close();
  }
  {
    const { context, page } = await open({ viewport: VIEWPORTS[1], locale: 'en', text: 100, motion: 'reduce', scenario: 'chapter-3' });
    await page.fill('#name', 'Sam');
    // Two synchronous taps: the second lands on whatever control is rendered after the first.
    const secondTapDisabled = await page.evaluate(() => {
      document.querySelector('button[data-do="done"]').click();
      const again = document.querySelector('button[data-do="done"]');
      again.click();
      return again.disabled;
    });
    await page.waitForSelector('#pv-home-title', { timeout: 3000 });
    const log = await page.$$eval('#pv-log li', ls => ls.map(l => l.textContent));
    smoke.push({ check: 'chapter 3: Done tapped twice, then Home', secondTapDisabled, hostCalls: log, pass: secondTapDisabled && log.filter(l => l.startsWith("change('onboarding'")).length === 1 && log.includes("change('onboarding', {name: <3 characters>})") });
    await context.close();
  }
  {
    const { context, page } = await open({ viewport: VIEWPORTS[1], locale: 'en', text: 100, motion: 'reduce', scenario: 'chapter-2' });
    await page.click('button[data-do="aiSetup"]');
    await page.waitForTimeout(100);
    const log = await page.$$eval('#pv-log li', ls => ls.map(l => l.textContent));
    const screen = await page.evaluate(() => document.querySelector('#app section')?.dataset.screen);
    smoke.push({ check: 'chapter 2: Set up Pocket LUCA returns to chapter 2', hostCalls: log, screen, pass: screen === 'chapter-2' && !log.some(l => l.includes('onboarding') || l.includes('provision')) });
    await context.close();
  }
  for (const s of smoke) if (!s.pass) failures.push(`smoke: ${s.check}: ${JSON.stringify(s)}`);

  await browser.close();
  server.close();
  const summary = {
    label: 'browser preview checks — not TalkBack, not a device, not the APK',
    chromium: version,
    browserPath,
    runs: results.length,
    screenshots: results.filter(r => r.motion === 'no-preference').length,
    failures,
    nonLocalRequests: [...new Set(network)],
    minButton: { w: Math.min(...results.map(r => r.minW ?? Infinity)), h: Math.min(...results.map(r => r.minH ?? Infinity)) },
    maxOverflowPx: Math.max(...results.map(r => r.overflowPx)),
    brokenWords: Object.fromEntries(['100', '200'].map(size => {
      const rows = results.filter(r => String(r.text) === size);
      const words = rows.flatMap(r => r.brokenWords);
      return [`${size}%`, { runsWithBreaks: rows.filter(r => r.brokenWords.length).length, runs: rows.length, distinct: [...new Set(words)].sort() }];
    })),
    smoke,
    contrast: {
      method: 'text made transparent via inline !important (CSSOM); lossless full-page PNG; worst background pixel inside each text line box; WCAG AA 4.5 normal / 3 large; logotype and disabled controls exempt',
      runs: contrast.length,
      boxes: contrast.reduce((n, c) => n + c.rows.length, 0),
      belowAA: contrast.flatMap(c => c.rows.filter(r => !r.pass).map(r => ({ id: c.id, ...r }))),
      worstByKind: Object.fromEntries(Object.entries(contrast.flatMap(c => c.rows).reduce((m, r) => { const k = r.logotype ? 'logotype (exempt)' : r.disabled ? 'disabled control (exempt)' : r.what.split('.').slice(0, 3).join('.'); m[k] = Math.min(m[k] ?? Infinity, r.worst); return m; }, {})).sort()),
    },
  };
  writeFileSync(join(outDir, 'visual-qa-results.json'), JSON.stringify({ summary, results }, null, 1));
  console.log(JSON.stringify(summary, null, 1));
  process.exit(failures.length ? 1 : 0);
}

async function scenarioList() {
  // The preview's scenario ids, with the screen key each must reach.
  const expect = {
    'opening-pending': 'opening', 'opening-timeout': 'opening', 'opening-error': 'opening', 'opening-invalid': 'opening',
    welcome: 'welcome', 'welcome-vision': 'welcome', 'welcome-setup-failed': 'welcome', 'welcome-restore-cancelled': 'welcome',
    returning: 'returning', 'returning-ai-failed': 'returning', migration: 'migration', 'chapter-1': 'chapter1',
    'chapter-2': 'chapter2', 'chapter-2-ai-unavailable': 'chapter2', 'chapter-3': 'chapter3', 'chapter-3-saving': 'chapter3',
    'chapter-3-failed': 'chapter3', 'chapter-3-timeout': 'chapter3', 'chapter-3-locked': 'returning', 'home-after-done': 'home', home: 'home',
  };
  const source = readFileSync(join(ROOT, 'preview', 'preview.mjs'), 'utf8');
  const ids = [...source.matchAll(/\{ id: '([^']+)'/g)].map(m => m[1]);
  const missing = ids.filter(id => !expect[id]);
  if (missing.length) throw Error(`scenario without an expected screen: ${missing}`);
  return { SCENARIOS: ids.map(id => ({ id, expect: expect[id] })) };
}

main().catch(error => { console.log(`FAIL: ${error.message}`); process.exit(1); });
