/* U0 welcome/onboarding — pure renderers. Maintained candidate, NOT integrated.
 *
 * (view, locale) => HTML string, in the host idiom: template strings, `data-do`
 * dispatch (host 773/1367), and esc() on every interpolated value (identical
 * to host 771). No inline style attributes, no remote URL, no storage.
 *
 * Privacy: opening, welcome and returning never read a name, subject ID,
 * record or draft. Only the unlocked chapter-3 field shows the preferred-name
 * draft, and the host clears drafts on lock (host 786).
 *
 * `home` returns null: Home is the existing host screen, not part of this candidate.
 */
import { t, normalizeLocale } from './copy.mjs';
import { CHAPTER_COUNT } from './route.mjs';

export const esc = x => String(x ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function btn(label, action, cls = 'ob-secondary', extra = '') {
  return `<button type="button" class="ob-btn ${cls}" data-do="${esc(action)}"${extra ? ` ${extra}` : ''}>${esc(label)}</button>`;
}

/** A pending control keeps a visible label and becomes unavailable until its operation settles. */
function pendingBtn(label, action, cls, busy, busyLabel) {
  return busy ? btn(busyLabel, action, cls, 'disabled aria-busy="true"') : btn(label, action, cls);
}

function languageButton(locale) {
  return `<button type="button" class="ob-btn ob-lang" data-do="language" lang="${esc(t(locale, 'lang.target'))}">${esc(t(locale, 'lang.button'))}</button>`;
}

function top(view, locale) {
  const emblem = view.assets && view.assets.emblem
    ? `<img class="ob-emblem" src="${esc(view.assets.emblem)}" alt="${esc(t(locale, 'a11y.emblem'))}">`
    : '';
  return `<header class="ob-top"><div class="ob-brand">${emblem}<span class="ob-word" aria-hidden="true">${esc(t(locale, 'brand.word'))}</span></div>${languageButton(locale)}</header>`;
}

export function renderNotice(view, locale) {
  const n = view.notice;
  if (!n) return '';
  const error = n.tone === 'error';
  const retry = n.retry ? btn(t(locale, 'common.retry'), n.retry, 'ob-secondary') : '';
  return `<div class="ob-notice${error ? ' ob-notice-error' : ''}" role="${error ? 'alert' : 'status'}"><p>${esc(t(locale, n.key))}</p>${retry}</div>`;
}

function frame(view, locale, kind, body, front = false) {
  const forest = front && view.assets && view.assets.forest
    ? `<img class="ob-forest" src="${esc(view.assets.forest)}" alt="" aria-hidden="true">`
    : '';
  return `<section class="ob ${front ? 'ob-front' : 'ob-quiet'} ob-${esc(kind)}" lang="${esc(locale)}" aria-labelledby="ob-title" data-screen="${esc(kind)}">${forest}${top(view, locale)}<main class="ob-main">${body}</main></section>`;
}

/** The copy entrance plays when a screen first appears (view.animate !== false), not on every
 * same-screen update; host 1020 likewise stops the page animation for a same-view render. */
const copyClass = view => (view.animate === false ? 'ob-copy' : 'ob-copy ob-enter');

function copyBlock(view, locale, titleKey, bodyKey, extra = '') {
  return `<div class="${copyClass(view)}"><h1 id="ob-title">${esc(t(locale, titleKey))}</h1><p>${esc(t(locale, bodyKey))}</p>${extra}</div>`;
}

export function renderOpening(view, locale) {
  const message = { timeout: 'opening.slow', error: 'opening.error', invalid: 'opening.invalid' }[view.reason] || 'opening.body';
  const alert = view.reason === 'error' || view.reason === 'invalid';
  const retry = view.retry ? pendingBtn(t(locale, 'common.retry'), 'retry', 'ob-primary', view.pending && view.pending.view, t(locale, 'pending.view')) : '';
  return frame(view, locale, 'opening', `<div class="ob-panel"><div class="${copyClass(view)}"><h1 id="ob-title">${esc(t(locale, 'opening.title'))}</h1><p role="${alert ? 'alert' : 'status'}" aria-live="polite">${esc(t(locale, message))}</p></div>${retry ? `<div class="ob-actions">${retry}</div>` : ''}</div>`);
}

export function renderVision(view, locale) {
  const item = (area, status) => `<li><h3>${esc(t(locale, `vision.${area}.title`))} <span class="ob-tag">${esc(t(locale, status))}</span></h3><p>${esc(t(locale, `vision.${area}.body`))}</p></li>`;
  return `<section class="ob-vision" id="ob-vision" aria-labelledby="ob-vision-title"><h2 id="ob-vision-title">${esc(t(locale, 'vision.title'))}</h2><ul>${item('vault', 'vision.thisApp')}${item('web', 'vision.website')}${item('clinic', 'vision.planned')}${item('economy', 'vision.planned')}</ul>${btn(t(locale, 'common.close'), 'visionClose', 'ob-quiet-btn')}</section>`;
}

export function renderWelcome(view, locale) {
  const busy = view.pending && view.pending.setup;
  const pendingLabel = t(locale, 'pending.setup');
  const actions = `<div class="ob-actions">${pendingBtn(t(locale, 'welcome.start'), 'start', 'ob-primary', busy, pendingLabel)}${pendingBtn(t(locale, 'welcome.restore'), 'restore', 'ob-secondary', busy, pendingLabel)}</div>`;
  const note = `<p class="ob-note">${esc(t(locale, 'welcome.setupNote'))} ${esc(t(locale, 'welcome.aiNote'))}</p>`;
  const vision = btn(t(locale, 'welcome.vision'), 'vision', 'ob-quiet-btn', `aria-expanded="${view.vision ? 'true' : 'false'}" aria-controls="ob-vision"`);
  return frame(view, locale, 'welcome', `<div class="ob-panel">${copyBlock(view, locale, 'welcome.title', 'welcome.body')}${renderNotice(view, locale)}${actions}${note}${vision}</div>${view.vision ? renderVision(view, locale) : ''}`, true);
}

export function renderReturning(view, locale) {
  const busy = view.pending && view.pending.setup;
  const aiBusy = view.pending && view.pending.aiSetup;
  const body = `<div class="ob-panel">${copyBlock(view, locale, 'returning.title', 'returning.body')}${renderNotice(view, locale)}<div class="ob-actions">${pendingBtn(t(locale, 'returning.unlock'), 'unlock', 'ob-primary', busy, t(locale, 'pending.setup'))}</div><p class="ob-note">${esc(t(locale, 'returning.recovery'))}</p><div class="ob-actions">${pendingBtn(t(locale, 'returning.aiSetup'), 'lockedAiSetup', 'ob-quiet-btn', aiBusy, t(locale, 'pending.aiSetup'))}</div></div>`;
  return frame(view, locale, 'returning', body, true);
}

export function renderMigration(view, locale) {
  const busy = view.pending && view.pending.setup;
  const body = `<div class="ob-panel"><div class="${copyClass(view)}"><p class="ob-eyebrow">${esc(t(locale, 'migration.eyebrow'))}</p><h1 id="ob-title">${esc(t(locale, 'migration.title'))}</h1><p>${esc(t(locale, 'migration.body'))}</p></div>${renderNotice(view, locale)}<div class="ob-actions">${pendingBtn(t(locale, 'migration.setup'), 'migrationSetup', 'ob-primary', busy, t(locale, 'pending.setup'))}</div></div>`;
  return frame(view, locale, 'migration', body);
}

function progress(locale, step) {
  const label = t(locale, 'a11y.progress', { n: step, total: CHAPTER_COUNT });
  const dots = Array.from({ length: CHAPTER_COUNT }, (_, i) => `<i class="${i < step ? 'on' : ''}"></i>`).join('');
  return `<div class="ob-progress"><span class="ob-dots" aria-hidden="true">${dots}</span><p class="ob-step">${esc(label)}</p></div>`;
}

export function renderChapter(view, locale) {
  const step = view.step;
  const saving = view.pending && view.pending.complete;
  const disabled = saving ? 'disabled' : '';
  const back = btn(t(locale, 'common.back'), 'back', 'ob-quiet-btn', disabled);
  const skip = btn(t(locale, 'common.skip'), 'skip', 'ob-quiet-btn', disabled);
  let content;
  if (step === 1) {
    content = `${copyBlock(view, locale, 'ch1.title', 'ch1.body', `<p class="ob-note">${esc(t(locale, 'ch1.note'))}</p>`)}${renderNotice(view, locale)}<div class="ob-actions">${btn(t(locale, 'common.continue'), 'next', 'ob-primary', disabled)}</div><div class="ob-row">${skip}</div>`;
  } else if (step === 2) {
    const aiBusy = view.pending && view.pending.aiSetup;
    const guided = `<figure class="ob-guided" data-guided="template"><figcaption>${esc(t(locale, 'ch2.greetingLabel'))}</figcaption><blockquote><p>${esc(t(locale, 'ch2.greeting'))}</p></blockquote></figure>`;
    // "Continue without AI" is never disabled by AI setup and needs no network.
    content = `${copyBlock(view, locale, 'ch2.title', 'ch2.body', guided)}${renderNotice(view, locale)}<div class="ob-actions">${pendingBtn(t(locale, 'ch2.setup'), 'aiSetup', 'ob-primary', aiBusy, t(locale, 'pending.aiSetup'))}${btn(t(locale, 'ch2.withoutAI'), 'withoutAI', 'ob-secondary', disabled)}</div><p class="ob-note">${esc(t(locale, 'ch2.note'))}</p><div class="ob-row">${back}${skip}</div>`;
  } else {
    const field = `<label class="ob-field" for="name">${esc(t(locale, 'ch3.nameLabel'))}<input id="name" name="name" maxlength="80" autocomplete="off" value="${esc(view.name)}"></label>`;
    content = `${copyBlock(view, locale, 'ch3.title', 'ch3.body')}${field}${renderNotice(view, locale)}<div class="ob-actions">${pendingBtn(t(locale, 'ch3.done'), 'done', 'ob-primary', saving, t(locale, 'pending.saving'))}${btn(t(locale, 'ch3.doneCheckin'), 'doneCheckin', 'ob-secondary', disabled)}${btn(t(locale, 'ch3.doneRecords'), 'doneRecords', 'ob-secondary', disabled)}</div><div class="ob-row">${back}</div>`;
  }
  return frame(view, locale, `chapter-${step}`, `<div class="ob-panel">${progress(locale, step)}${content}</div>`);
}

/** Render the resolved screen. Returns null for `home` (the existing host Home renders instead). */
export function renderScreen(view, locale = view.locale) {
  const lang = normalizeLocale(locale);
  switch (view.screen) {
    case 'opening': return renderOpening(view, lang);
    case 'welcome': return renderWelcome(view, lang);
    case 'returning': return renderReturning(view, lang);
    case 'migration': return renderMigration(view, lang);
    case 'chapter': return renderChapter(view, lang);
    case 'home': return null;
    default: return renderOpening({ ...view, screen: 'opening', reason: 'invalid', retry: true }, lang);
  }
}
