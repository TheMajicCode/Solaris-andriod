/* U0-04 renderer suite.
 *
 * Views come from the real controller (not hand-built), so the renderer and the
 * adapter are checked against each other: every rendered control dispatches an
 * action its screen accepts, and every state-appropriate control is present.
 * SCOPE: generated HTML strings. Browser layout, focus order and TalkBack are
 * NOT covered here (see docs/onboarding/VISUAL-QA.md for the browser checks).
 */
import { renderScreen, esc } from '../render.mjs';
import { SCREEN_ACTIONS, DONE_TIMEOUT_MS } from '../actions.mjs';
import { COPY, SAME_IN_BOTH } from '../copy.mjs';
import { setup, STATES, call } from './fakes.mjs';

const ASSETS = { emblem: 'e.png', forest: 'f.png' };
const PRIVATE_NAME = 'Zed Synthetic-Private';

function buttons(html) {
  return [...html.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/g)].map(([, attrs, inner]) => ({
    attrs,
    text: inner.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim(),
    aria: (/aria-label="([^"]*)"/.exec(attrs) || [])[1] || '',
    action: (/data-do="([^"]*)"/.exec(attrs) || [])[1],
    disabled: /\bdisabled\b/.test(attrs),
  }));
}
const textOf = html => html.replace(/<[^>]*>/g, ' ').replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, ' ');
const attrValues = html => [...html.matchAll(/(?:alt|aria-label|placeholder|title)="([^"]*)"/g)].map(m => m[1]);

/** Real controller views for every screen and failure the candidate renders. */
function views(locale) {
  const out = [];
  const add = (label, controller) => out.push([label, { ...controller.view(), assets: ASSETS }]);
  const drafts = () => ({ name: PRIVATE_NAME });
  { const s = setup(null, { deviceLocale: locale }); add('opening-pending', s.controller); }
  { const s = setup(null, { deviceLocale: locale }); s.controller.start(); s.clock.advance(8000); add('opening-timeout', s.controller); }
  { const s = setup(null, { deviceLocale: locale }); s.controller.start(); call(s.host).d.reject(Error('BRIDGE_UNAVAILABLE')); add('opening-error', s.controller); }
  { const s = setup({ locked: true, hasVault: 'false' }, { deviceLocale: locale }); add('opening-invalid', s.controller); }
  { const s = setup(STATES.noVault, { deviceLocale: locale, drafts: drafts() }); add('welcome', s.controller); }
  { const s = setup(STATES.noVault, { deviceLocale: locale }); s.controller.dispatch('vision'); add('welcome-vision', s.controller); }
  { const s = setup(STATES.noVault, { deviceLocale: locale }); s.controller.dispatch('start'); add('welcome-pending', s.controller); }
  { const s = setup(STATES.noVault, { deviceLocale: locale }); s.controller.dispatch('start'); call(s.host).d.reject(Error('BRIDGE_SEND_FAILED')); add('welcome-error', s.controller); }
  { const s = setup({ ...STATES.locked, displayName: PRIVATE_NAME, subjectId: 'subject_synthetic_123' }, { deviceLocale: locale, drafts: drafts() }); add('returning', s.controller); }
  { const s = setup(STATES.locked, { deviceLocale: locale }); s.controller.dispatch('lockedAiSetup'); call(s.host).d.reject(Error('BRIDGE_REPLY_TIMEOUT')); add('returning-ai-error', s.controller); }
  { const s = setup(STATES.incomplete, { locale, step: 3, drafts: drafts() }); s.controller.dispatch('done'); s.controller.setNativeState({ locked: true }); add('returning-locked-during-save', s.controller); }
  { const s = setup(STATES.migrationPending, { locale, drafts: drafts() }); add('migration', s.controller); }
  { const s = setup(STATES.incomplete, { locale }); add('chapter-1', s.controller); }
  { const s = setup(STATES.incomplete, { locale, step: 2 }); add('chapter-2', s.controller); }
  { const s = setup(STATES.incomplete, { locale, step: 2 }); s.controller.dispatch('aiSetup'); add('chapter-2-pending', s.controller); }
  { const s = setup(STATES.incomplete, { locale, step: 2 }); s.controller.dispatch('aiSetup'); call(s.host).d.reject(Error('LOCAL_PERMISSION_REQUIRED')); add('chapter-2-ai-error', s.controller); }
  { const s = setup(STATES.incomplete, { locale, step: 3, drafts: drafts() }); add('chapter-3', s.controller); }
  { const s = setup(STATES.incomplete, { locale, step: 3, drafts: drafts() }); s.controller.dispatch('done'); add('chapter-3-saving', s.controller); }
  { const s = setup(STATES.incomplete, { locale, step: 3, drafts: drafts() }); s.controller.dispatch('done'); call(s.host).d.reject(Error('OPERATION_FAILED')); add('chapter-3-failed', s.controller); }
  { const s = setup(STATES.incomplete, { locale, step: 3, drafts: drafts() }); s.controller.dispatch('done'); s.clock.advance(DONE_TIMEOUT_MS); add('chapter-3-timeout', s.controller); }
  return out;
}

const LOCKED_LIKE = ['opening', 'welcome', 'returning'];

export function run(t) {
  for (const locale of ['en', 'es']) {
    const all = views(locale);
    t.equal(`V0 ${locale} every view resolved in the requested locale`, all.every(([, v]) => v.locale === locale), true);
    for (const [label, view] of all) {
      const id = `${locale}/${label}`;
      const html = renderScreen(view, locale);
      t.ok(`R1 ${id} renders markup`, typeof html === 'string' && html.startsWith('<section'));
      t.ok(`R2 ${id} lang attribute`, html.includes(`lang="${locale}"`));
      t.equal(`R3 ${id} one h1 titled for the region`, (html.match(/<h1 id="ob-title">/g) || []).length, 1);
      const bs = buttons(html);
      t.ok(`R4 ${id} has controls`, bs.length > 0);
      for (const [i, b] of bs.entries()) {
        t.ok(`R5 ${id} button ${i} (${b.action}) visible label`, b.text.length > 0);
        t.ok(`R6 ${id} button ${i} (${b.action}) accessible name`, (b.aria || b.text).length > 0);
        if (b.aria) t.ok(`R7 ${id} button ${i} label-in-name`, b.aria.includes(b.text));
        t.ok(`R8 ${id} button ${i} type=button`, /type="button"/.test(b.attrs));
        t.ok(`R9 ${id} button ${i} dispatches a named action`, typeof b.action === 'string' && b.action.length > 0);
        const accepted = [...(SCREEN_ACTIONS[view.key] || [])];
        t.ok(`R10 ${id} button ${i} (${b.action}) is accepted by the adapter on this screen`, accepted.includes(b.action));
      }
      for (const [n, img] of [...html.matchAll(/<img\b[^>]*>/g)].entries()) {
        t.ok(`R11 ${id} image ${n} has alt`, /\balt="/.test(img[0]));
        if (/ob-emblem/.test(img[0])) t.equal(`R12 ${id} emblem alt`, (/alt="([^"]*)"/.exec(img[0]) || [])[1], esc(COPY[locale]['a11y.emblem']));
        if (/ob-forest/.test(img[0])) t.ok(`R13 ${id} forest is decorative`, /alt=""/.test(img[0]) && /aria-hidden="true"/.test(img[0]));
      }
      t.ok(`R14 ${id} no inline style (strict CSP)`, !/\sstyle="/.test(html));
      t.ok(`R15 ${id} no remote URL`, !/(?:src|href)="(?:[a-z]+:)?\/\//i.test(html));
      // The copy entrance animation never wraps a control.
      for (const part of html.split('ob-enter').slice(1)) t.ok(`R16 ${id} no control inside the animated copy`, !part.slice(0, part.indexOf('</div>')).includes('<button'));

      const rendered = new Set(bs.map(b => b.action));
      if (view.screen === 'chapter') {
        const step = view.step;
        t.equal(`R17 ${id} Back only on chapters 2-3`, rendered.has('back'), step > 1);
        t.equal(`R18 ${id} Skip on chapters 1-2`, rendered.has('skip'), step < 3);
        t.equal(`R19 ${id} Done on chapter 3`, rendered.has('done'), step === 3);
        t.equal(`R20 ${id} language switch visible`, rendered.has('language'), true);
        if (step === 2) t.ok(`R21 ${id} Continue without AI always present and enabled`, bs.some(b => b.action === 'withoutAI' && !b.disabled));
        if (step === 2) t.ok(`R22 ${id} guided greeting marked as template`, /data-guided="template"/.test(html) && html.includes(esc(COPY[locale]['ch2.greetingLabel'])));
        if (step === 3) t.ok(`R23 ${id} name field labelled`, /<label class="ob-field" for="name">/.test(html) && /<input id="name"/.test(html));
        if (step === 3) t.ok(`R24 ${id} unlocked chapter 3 may show the draft`, html.includes(PRIVATE_NAME));
      }
      if (view.screen === 'migration') t.ok(`R25 ${id} migration offers no Skip/Done`, !rendered.has('skip') && !rendered.has('done'));
      if (LOCKED_LIKE.includes(view.screen) || view.screen === 'migration') {
        t.ok(`R26 ${id} no personal name`, !html.includes(PRIVATE_NAME));
        t.ok(`R27 ${id} no subject id`, !html.includes('subject_synthetic_123'));
        t.ok(`R28 ${id} no input fields`, !/<input\b/.test(html));
      }
      if (locale === 'es') {
        const visible = textOf(html) + ' ' + attrValues(html).join(' ');
        for (const [key, enText] of Object.entries(COPY.en)) {
          if (SAME_IN_BOTH.includes(key) || enText === COPY.es[key] || enText.length < 4) continue;
          t.ok(`R29 ${id} no English (${key}) in the Spanish render`, !visible.includes(enText));
        }
      }
      if (view.notice) t.ok(`R30 ${id} notice text rendered`, html.includes(esc(COPY[locale][view.notice.key])));
      if (view.notice && view.notice.tone === 'error') t.ok(`R31 ${id} error notice is an alert`, /class="ob-notice ob-notice-error" role="alert"/.test(html));
    }
  }

  // Pending controls keep a visible label and become unavailable.
  const pending = views('en').find(([l]) => l === 'chapter-3-saving')[1];
  const saving = buttons(renderScreen(pending, 'en'));
  t.ok('P1 saving Done shows a visible pending label', saving.some(b => b.action === 'done' && b.text === COPY.en['pending.saving'] && b.disabled));
  t.ok('P2 every finish control disabled while saving', saving.filter(b => ['done', 'doneCheckin', 'doneRecords', 'back'].includes(b.action)).every(b => b.disabled));
  t.ok('P3 language stays usable while saving', saving.some(b => b.action === 'language' && !b.disabled));

  // A renderer given a private name on a locked screen still never shows it.
  for (const screen of ['opening', 'welcome', 'returning']) {
    const html = renderScreen({ screen, reason: 'pending', retry: false, key: screen, locale: 'en', pending: {}, notice: null, vision: false, name: PRIVATE_NAME, assets: ASSETS }, 'en');
    t.ok(`P4 ${screen} ignores a name even if one is passed`, !html.includes(PRIVATE_NAME));
  }
  t.equal('P5 home is the existing host screen (renderer returns null)', renderScreen({ screen: 'home', locale: 'en' }, 'en'), null);
  t.ok('P6 unknown screen falls back to opening, not welcome', renderScreen({ screen: 'bogus', locale: 'en', pending: {} }, 'en').includes('data-screen="opening"'));
  t.equal('P7 esc matches host 771', esc(`<a href="x" onclick='y'>&</a>`), '&lt;a href=&quot;x&quot; onclick=&#39;y&#39;&gt;&amp;&lt;/a&gt;');
  const hostile = renderScreen({ ...pending, name: '"><img src=x onerror=alert(1)>' }, 'en');
  t.ok('P8 draft value is escaped', !hostile.includes('<img src=x') && hostile.includes('&quot;&gt;&lt;img src=x onerror=alert(1)&gt;'));
  for (const [label, view] of views('en')) {
    t.ok(`A1 ${label} entrance plays on first render`, renderScreen(view, 'en').includes('ob-enter'));
    t.ok(`A2 ${label} same-screen update does not replay the entrance`, !renderScreen({ ...view, animate: false }, 'en').includes('ob-enter'));
  }
  const vision = views('en').find(([l]) => l === 'welcome-vision')[1];
  const visionHtml = renderScreen(vision, 'en');
  t.equal('P9 vision marks two items Planned', (visionHtml.match(/>Planned</g) || []).length, 2);
  t.ok('P10 vision toggle exposes aria-expanded', /data-do="vision" aria-expanded="true" aria-controls="ob-vision"/.test(visionHtml));
}
