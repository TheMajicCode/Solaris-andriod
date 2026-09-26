/* Isolated design preview. SYNTHETIC STATE ONLY.
 *
 * No vault, model, records or native bridge exist here. A synthetic host stands
 * in for the retained host's request()/change()/openDiagnostics() so the
 * candidate controller can be exercised in a browser. Every call it receives is
 * listed in the preview panel. Nothing is stored (no localStorage, cookies or
 * IndexedDB) and nothing is fetched except the local files next to this page.
 */
import { createOnboardingController } from '../actions.mjs';
import { renderScreen, esc } from '../render.mjs';

const ASSETS = { emblem: '.assets/emblem.png', forest: '.assets/forest_sanctuary.png' };
const NO_VAULT = { locked: true, hasVault: false };
const LOCKED = { locked: true, hasVault: true };
const unlocked = (extra = {}) => ({ locked: false, hasVault: true, migration: { committed: true }, onboardingComplete: false, ...extra });

// Scripted steps are dispatched by the preview, not by a person, and say so.
export const SCENARIOS = [
  { id: 'opening-pending', label: 'Startup — native state not received yet', view: 'hang' },
  { id: 'opening-timeout', label: 'Startup — no native reply, wait elapsed (scripted)', view: 'hang', openingTimeoutMs: 20 },
  { id: 'opening-error', label: 'Startup — native error on view', view: 'reject:BRIDGE_UNAVAILABLE' },
  { id: 'opening-invalid', label: 'Startup — invalid hasVault ("false" as text)', view: { locked: true, hasVault: 'false' } },
  { id: 'welcome', label: 'No vault — welcome', view: NO_VAULT },
  { id: 'welcome-vision', label: 'No vault — wider Solaris vision open', view: NO_VAULT, script: ['vision'] },
  { id: 'welcome-setup-failed', label: 'No vault — setup could not open (scripted)', view: NO_VAULT, openSetup: 'reject:BRIDGE_SEND_FAILED', script: ['start'] },
  { id: 'welcome-restore-cancelled', label: 'No vault — restore cancelled; native state unchanged (scripted)', view: NO_VAULT, openSetup: 'reject:CANCELLED', script: ['restore'] },
  { id: 'returning', label: 'Existing vault, locked — welcome back', view: LOCKED },
  { id: 'returning-ai-failed', label: 'Existing vault, locked — AI setup could not open (scripted)', view: LOCKED, openDiagnostics: 'reject:BRIDGE_REPLY_TIMEOUT', script: ['lockedAiSetup'] },
  { id: 'migration', label: 'Unlocked — recovery/migration still pending', view: unlocked({ migration: { committed: false } }) },
  { id: 'chapter-1', label: 'Unlocked — chapter 1 of 3', view: unlocked() },
  { id: 'chapter-2', label: 'Unlocked — chapter 2 of 3 (scripted: Continue)', view: unlocked(), script: ['next'] },
  { id: 'chapter-2-ai-unavailable', label: 'Chapter 2 — AI setup unavailable: offline or permission denied (scripted)', view: unlocked(), openDiagnostics: 'reject:LOCAL_PERMISSION_REQUIRED', script: ['next', 'aiSetup'] },
  { id: 'chapter-3', label: 'Chapter 3 of 3 — optional name (scripted)', view: unlocked(), name: 'Alex (synthetic)', script: ['next', 'withoutAI'] },
  { id: 'chapter-3-saving', label: 'Chapter 3 — Done waiting for acknowledgement (scripted)', view: unlocked(), name: 'Alex (synthetic)', change: 'hang', script: ['next', 'withoutAI', 'done'] },
  { id: 'chapter-3-failed', label: 'Chapter 3 — Done failed; stays incomplete (scripted)', view: unlocked(), name: 'Alex (synthetic)', change: 'reject:OPERATION_FAILED', script: ['next', 'withoutAI', 'done'] },
  { id: 'chapter-3-timeout', label: 'Chapter 3 — Done not confirmed in time (scripted, shortened timeout)', view: unlocked(), name: 'Alex (synthetic)', change: 'hang', doneTimeoutMs: 20, script: ['next', 'withoutAI', 'done'] },
  { id: 'chapter-3-locked', label: 'Chapter 3 — vault locks while saving (scripted)', view: unlocked(), name: 'Alex (synthetic)', change: 'hang', script: ['next', 'withoutAI', 'done', '@lock'] },
  { id: 'home-after-done', label: 'Chapter 3 — Done acknowledged, then Home (scripted)', view: unlocked(), name: 'Alex (synthetic)', script: ['next', 'withoutAI', 'doneCheckin'] },
  { id: 'home', label: 'Onboarding complete — existing Home (placeholder)', view: unlocked({ onboardingComplete: true }) },
];

const HOME_COPY = {
  en: { title: 'Existing Home screen', body: 'This preview stops here. In the app, the existing Home renders after the acknowledged completion.', checkin: 'Next: the existing Check-in.', records: 'Next: your existing Records.' },
  es: { title: 'Pantalla de Inicio existente', body: 'Esta vista previa termina aquí. En la aplicación, el Inicio existente aparece después de la confirmación.', checkin: 'Después: el registro diario existente.', records: 'Después: tus registros existentes.' },
};

const params = new URLSearchParams(location.search);
const scenario = SCENARIOS.find(s => s.id === params.get('state')) || SCENARIOS.find(s => s.id === 'welcome');
const locale = params.get('locale') === 'es' ? 'es' : 'en';
const app = document.getElementById('app');
const logList = document.getElementById('pv-log');
const assets = { ...ASSETS };

if (params.get('panel') === 'closed') document.getElementById('pv-panel').open = false;

function log(text) {
  const li = document.createElement('li');
  li.textContent = text;
  logList.append(li);
}

// Personal text never reaches the log: only its length is shown.
function describe(kind, p) {
  if (kind === 'onboarding') return `{name: <${String(p && p.name || '').length} characters>}`;
  return JSON.stringify(p);
}

// The synthetic native state; replies are built from it and it is updated as they are produced.
let nativeState = typeof scenario.view === 'object' ? { ...scenario.view, experience: { locale } } : null;
const rejecters = new Set();

function behave(spec, ok) {
  if (spec === 'hang') return new Promise((resolve, reject) => { rejecters.add(reject); });
  if (typeof spec === 'string' && spec.startsWith('reject:')) return Promise.reject(Error(spec.slice(7)));
  return new Promise(resolve => setTimeout(() => resolve(typeof ok === 'function' ? ok() : ok), 30));
}

let uidCount = 0;
const host = {
  drafts: { name: scenario.name || '' },
  request(method) {
    log(`request('${method}')`);
    if (method === 'view') {
      if (typeof scenario.view === 'string') return behave(scenario.view);
      return Promise.resolve({ ...nativeState });
    }
    if (method === 'openSetup') return behave(scenario.openSetup || 'resolve', { opened: true });
    return Promise.reject(Error('NOT_IN_PREVIEW'));
  },
  change(kind, p) {
    log(`change('${kind}', ${describe(kind, p)})`);
    if (kind === 'onboarding') return behave(scenario.change || 'resolve', () => (nativeState = { ...nativeState, onboardingComplete: true }));
    if (kind === 'experienceLocale') return behave('resolve', () => (nativeState = { ...nativeState, experience: { locale: p.locale } }));
    return Promise.reject(Error('NOT_IN_PREVIEW'));
  },
  openDiagnostics() {
    log('SolarisNativeAI.openDiagnostics({bridgeVersion})');
    return behave(scenario.openDiagnostics || 'resolve', { opened: true });
  },
  uid() { uidCount += 1; return `preview_${uidCount}`; },
  getDrafts() { return host.drafts; },
};

function homePlaceholder(view) {
  const c = HOME_COPY[view.locale];
  const next = view.after ? `<p>${esc(c[view.after])}</p>` : '';
  return `<section class="pv-home" lang="${esc(view.locale)}" aria-labelledby="pv-home-title"><h1 id="pv-home-title">${esc(c.title)}</h1><p>${esc(c.body)}</p>${next}</section>`;
}

let lastView = null;
function paint(view) {
  const animate = !lastView || lastView.key !== view.key; // entrance only when the screen changes
  lastView = view;
  const focused = document.activeElement && app.contains(document.activeElement)
    ? (document.activeElement.id ? `#${document.activeElement.id}` : document.activeElement.dataset.do ? `[data-do="${document.activeElement.dataset.do}"]` : null)
    : null;
  document.documentElement.lang = view.locale;
  app.innerHTML = renderScreen({ ...view, assets, animate }, view.locale) ?? homePlaceholder(view);
  if (focused) app.querySelector(focused)?.focus({ preventScroll: true });
}

const controller = createOnboardingController({
  host,
  deviceLocale: locale,
  onChange: paint,
  doneTimeoutMs: scenario.doneTimeoutMs,
  openingTimeoutMs: scenario.openingTimeoutMs,
});

function simulateLock() {
  log('synthetic lock (host 792: pending requests rejected with VAULT_LOCKED; host 786 clears drafts)');
  host.drafts = {};
  nativeState = { ...(nativeState || {}), locked: true };
  controller.setNativeState({ locked: true });
  for (const reject of rejecters) reject(Error('VAULT_LOCKED'));
  rejecters.clear();
}

app.addEventListener('click', event => {
  const button = event.target.closest('button[data-do]');
  if (!button || button.disabled) return;
  const result = controller.dispatch(button.dataset.do);
  if (result && result.status === 'blocked') log(`refused on this screen: ${button.dataset.do}`);
});
app.addEventListener('input', event => {
  if (event.target.id === 'name') host.drafts.name = event.target.value;
});

const select = document.getElementById('pv-state');
for (const s of SCENARIOS) {
  const option = document.createElement('option');
  option.value = s.id;
  option.textContent = s.label;
  option.selected = s.id === scenario.id;
  select.append(option);
}
select.addEventListener('change', () => {
  params.set('state', select.value);
  location.search = params.toString();
});
document.getElementById('pv-reset').addEventListener('click', () => location.reload());
document.getElementById('pv-lock').addEventListener('click', simulateLock);
document.getElementById('pv-scenario-note').textContent = scenario.script ? `Scripted steps: ${scenario.script.join(' → ')}` : 'No scripted steps.';

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

function probe(key) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => { assets[key] = null; resolve(false); };
    img.src = ASSETS[key];
  });
}

async function run() {
  paint(controller.view());
  controller.start();
  await wait(10);
  for (const step of scenario.script || []) {
    if (step === '@lock') simulateLock(); else controller.dispatch(step);
    await wait(80);
  }
  const found = await Promise.all([probe('emblem'), probe('forest')]);
  if (found.includes(false)) {
    document.getElementById('pv-asset-note').hidden = false;
    paint(controller.view()); // only to drop the missing image; otherwise the entrance is left to finish
  }
  await wait(60);
  document.body.dataset.ready = '1';
  document.body.dataset.screen = lastView ? lastView.key : '';
}

run();
