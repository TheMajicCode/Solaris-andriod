# U0 visual QA: browser preview checks, not TalkBack, not a device, not the APK

These are measurements of the **isolated synthetic preview**
(`candidate/onboarding/preview/`) in headless desktop Chromium. They say nothing
about the Android WebView, TalkBack, device text-size settings, safe areas on
real hardware, the HBC or the APK.

- **Tool:** [`tools/onboarding/visual-qa.mjs`](../../tools/onboarding/visual-qa.mjs)
- **Command:** `node tools/onboarding/visual-qa.mjs --out <scratch-dir>`
- **Exit code of the recorded run:** 0
- **Code measured:** commit `aaee1d9`. The working tree for `candidate/` and
  `tools/` was identical to it (`git diff --quiet HEAD -- candidate tools`).
- **Browser:** the pre-installed Chromium `141.0.7390.37` at
  `/opt/pw-browsers/chromium`, driven by the globally installed Playwright
  1.56.1. `playwright install` was not run, and no package was added to the
  repository.
- **Serving:** `candidate/onboarding` was served from `127.0.0.1` only. Every
  other request is aborted and recorded.
- **Artwork:** the retained artwork was extracted byte-exact by
  [`tools/onboarding/extract-assets.py`](../../tools/onboarding/extract-assets.py)
  (SHA-256 verified) into the gitignored `preview/.assets/`.
- **Screenshots and raw JSON:** written to the session scratch directory
  (`onboarding-shots/`, 344 JPEG files; `visual-qa-results.json`). They are
  **not** in the repository.

## Matrix

- **Scenarios:** 21 synthetic scenarios (every route state and failure; see
  `SCENARIOS` in [`preview.mjs`](../../candidate/onboarding/preview/preview.mjs)).
- **Viewports:** 320×568, 360×640, 390×844 and a short 320×480.
- **Locales:** EN and ES.
- **Text size:** 100% and 200%.
- **Motion:** `prefers-reduced-motion` set to `no-preference` and to `reduce`.

That makes **672 page loads**. There are 8 more keyboard-open runs, for **680
measured runs**, plus 36 contrast runs, 6 motion checks and 4 interaction smoke
checks.

**How 200% text was produced.** The root font size is set to 200% through the
CSSOM. All candidate type is in `rem`, so this equals a 200% default text size,
and the root was verified at 32 px before and after every capture.

The first attempt used CDP `Page.setFontSizes`. It was **rejected** because
Playwright's full-page capture silently reset it to 16 px. The run-1 200%
screenshots were therefore invalid and were deleted. Android WebView
`textZoom` was **not** emulated.

## Results (final run)

| Check | Result |
|---|---|
| Runs with any failed assertion | **0 / 680** |
| Non-local network requests | **0** (none attempted) |
| Console errors or CSP violations | 0 |
| Horizontal overflow (`scrollWidth − innerWidth`, plus any element past the viewport edge) | **0 px** in every run |
| Buttons measured | 2,272. Smallest **99.7 × 48.0** CSS px at 100% and **165.3 × 59.6** at 200%. None below 48 × 48. |
| Every button has a non-empty accessible name | yes (all runs) |
| Every button reachable by scrolling (scrolled into view, inside the viewport, and the top element at its centre) | yes: 0 unreachable |
| State-appropriate controls present (Back / Skip / Done per screen, as in `REQUIRED` / `FORBIDDEN`) | yes: 0 missing, 0 inappropriate |
| `lang` on `<html>` and the screen root matches the locale | yes |
| Preview banner visible and uncovered | yes |
| SOLARIS wordmark on one line | yes |
| Reduced motion, settled page: `document.getAnimations()` | **0** in all 336 `reduce` runs |
| No reduced-motion preference, settled page | ≤ 1 animation (96 of 336 runs still had the entrance in effect when measured), only the `.ob-enter` copy entrance, finite iterations. No control sits inside an animated element. |

**Tallest page per viewport** (page scrolls; nothing clipped):

| Viewport | 100% | 200% |
|---|---|---|
| 320×480 | 1,652 px | 4,962 px |
| 320×568 | 1,671 px | 4,981 px |
| 360×640 | 1,581 px | 4,529 px |
| 390×844 | 1,626 px | 4,396 px |

### Motion after a real screen change

These checks were taken synchronously right after a tap, at 360×640 in EN. A
settled page alone cannot show whether the entrance exists or is suppressed.

| Mode | Transition | Animations | Result |
|---|---|---|---|
| no-preference | chapter 1 → Continue → chapter 2 | 1 (`ob-in`, 240 ms, finite, on the copy); 5 controls enabled at once; none inside it | pass |
| no-preference | chapter 2 → Continue without AI → chapter 3 | 1 (`ob-in`, 240 ms), as above | pass |
| no-preference | welcome → open vision (same screen) | 0; the entrance is not replayed | pass |
| reduce | chapter 1 → chapter 2 | 0; the `.ob-enter` element's computed `animation-name` is `none` | pass |
| reduce | chapter 2 → chapter 3 | 0; `none` | pass |
| reduce | welcome → open vision (same screen) | 0 | pass |

### Keyboard-open approximation

After load, the viewport height was reduced by 300 px (360×640 → 340 px visible)
or by 260 px (320×568 → 308 px visible). Then, on chapter 3, the name field was
focused and "Sam" was typed. This is an approximation of `adjustResize`, not an
on-screen keyboard.

| Run | Focused field (top–bottom / visible height) | Result |
|---|---|---|
| 360×640, EN/ES, 100% | 145–195 / 340 | visible; Done reachable; no overflow |
| 360×640, EN/ES, 200% | 133–207 / 340 | visible; Done reachable; no overflow |
| 320×568, EN/ES, 100% | 129–179 / 308 | visible; Done reachable; no overflow |
| 320×568, EN/ES, 200% | 117–191 / 308 | visible; Done reachable; no overflow |

### Contrast on the actual artwork

**Method.** All candidate text was made transparent (inline `!important` through
the CSSOM, CSP-compatible). A lossless full-page PNG was then captured. For
every text **line box**, the worst (lowest) WCAG ratio was computed between the
text colour and **each pixel** behind it. Thresholds are AA: 4.5 for normal
text, 3 for large.

The sample was 36 runs (9 scenarios × 320×568 and 390×844 × EN/ES), covering
616 line boxes. **0 were below AA.**

| Text | Worst ratio |
|---|---|
| primary button label | 15.23 |
| text field label | 14.93 |
| h2 / h3 | 12.93 |
| secondary button | 12.26 |
| h1 | 10.32 |
| quiet (mint) button | 9.08 |
| eyebrow | 7.81 |
| step label | 7.73 |
| body `p` | 7.66 |
| language button (over the forest) | 7.11 |
| status tag | 6.83 |
| guided-example caption | 6.68 |
| `.ob-note` | **6.22** (lowest non-exempt) |
| SOLARIS wordmark (logotype, exempt) | **1.01** |

The SOLARIS wordmark sits directly on the forest with no backing, so bright
pixels behind it fall to 1.01:1. WCAG 1.4.3 exempts logotypes, the word is
`aria-hidden`, and the emblem's `alt` carries the name. It is still a visual
weakness on bright artwork and is recorded here rather than hidden.

### Words broken across lines

This is informational, not a failure. At **100%: 0** runs. At **200%**: 24 of
340 runs, all at 320 px wide.

- **ES:** `Configuración`, `CONFIGURACIÓN`, `configuración`, `Desbloquear`,
  `Desbloquéala`, `Guardando…` (bold button labels and the migration eyebrow).
- **EN:** only `sign-in;`, which breaks at its own hyphen.

Text is never shrunk and never overflows; `overflow-wrap:anywhere` breaks the
word instead. `hyphens:auto` is declared on buttons and headings, but this
headless Linux Chromium did not hyphenate. Android WebView behaviour is
**unverified**.

### Interaction smoke (synthetic host log)

| Check | Observed host calls | Result |
|---|---|---|
| Welcome: switch language while locked | `request('view')` only (no write); `<html lang="es">` | pass |
| Welcome: Get started | `request('view')`, `request('openSetup')`; no `provisionChoice` | pass |
| Chapter 3: Done tapped twice synchronously | one `change('onboarding', {name: <3 characters>})`; the second tap landed on a disabled control; Home placeholder shown | pass |
| Chapter 2: Set up Pocket LUCA | `SolarisNativeAI.openDiagnostics({bridgeVersion})`; still on chapter 2; no onboarding write | pass |

## Defects this QA found and the fixes made (run history)

1. **Run 1** (exit 1): the vision panel overflowed by **28 px (EN) / 13 px
   (ES)** at 320 px with 200% text. The cause was a `nowrap` status tag in an
   implicit grid track plus rem padding. Fixed with `minmax(0,1fr)`, a wrapping
   tag and px container padding.
2. From the run-1 screenshots: the **preview banner was covered** by the
   `position:fixed` forest. The forest is now `absolute` (as host 716), and a
   banner-visibility assertion was added.
3. The run-1 **200% screenshots were invalid** (see the text-size note above).
   The method was changed and a before/after capture assertion was added.
4. From the run-2 screenshots: at 320 px with 200% text the **SOLARIS wordmark
   broke one letter per line** and bold labels split mid-word. The wordmark is
   now unbreakable (the header wraps instead), button side padding is smaller,
   and a wordmark assertion and the broken-word metric were added.
5. **Run 4** (exit 1): the new contrast pass gave false lows (the eyebrow's
   `!important` colour and a nested tag border). The measurement moved to text
   line boxes. The keyboard harness was also corrected after a sequencing error
   of my own.
6. **Run 5** (exit 1): the **status tag measured 4.11–4.31** (the pill's curved
   border under the label). Fixed by a radius no larger than the padding.
   Run 6: exit 0.
7. From the run-6 screenshots: copy was captured **mid-fade**, because every
   state change re-rendered and **replayed the entrance** (also a UX defect).
   The renderer now animates only when the screen changes (`view.animate`, as
   host 1020 does for same-view renders), and screenshots wait for animations
   to finish.
8. That change left the settled-page reduced-motion assertion vacuous, so the
   motion-after-a-real-screen-change check above was added. The preview also
   stopped repainting (and cutting the entrance short) after its artwork
   probe. **The final run on `aaee1d9`** is recorded above: exit 0.

## Not checked here

- TalkBack or any screen reader: focus order, announcements, live-region timing.
- A real device, the Android WebView or `textZoom`, notches or safe-area insets,
  a real soft keyboard, device fonts.
- Right-to-left text, other locales, forced colours or high-contrast modes.
- Contrast on the 320×480 and 360×640 viewports and at 200% text (the contrast
  pass sampled 320×568 and 390×844 at 100%).
- The host page, the HBC or the APK: nothing is integrated.
