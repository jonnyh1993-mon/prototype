# Handoff: Monument Investments & Lombard lending

## Overview

A mobile-first prototype for two new Monument products added to the existing banking app:

1. **Investments** — a guided "Felicia" Q&A flow that matches a customer to one of three hand-picked funds (BlackRock LifePath 2040, L&G Artificial Intelligence ETF, or Partners Group Listed Private Equity), then lets them invest either as a one-off or a monthly direct debit into an ISA or GIA wrapper.
2. **Lombard loan** — a ten-screen journey that lets a customer open a credit line secured against eligible investment holdings at up to 50% LTV, at a rate of BoE + 1.5% (currently 5.25% APR). The SIPP is deliberately excluded from eligible collateral (FCA rules).

The home screen is the hub: bank accounts, investment wrappers (ISA / GIA / Pension / SIPP), an active Lombard loan if one is drawn down, and a "Do more with Monument" block linking out to both flows.

## About the Design Files

The files in this bundle are **design references created as an HTML/JSX prototype**, not production code. The app runs entirely in the browser via `<script type="text/babel">` + React 18 UMD + Babel standalone; state is held in one top-level `<App>` component and persisted to `localStorage`. There's no build step, no routing library, no framework beyond plain React.

The task is to **recreate these designs in Monument's existing codebase** (iOS / Android / whatever production stack is in use) following its established component library, navigation patterns, and design tokens. Use these files as the source of truth for screen layouts, copy, state transitions, and the Monument-Broad / Eina type system.

## Fidelity

**High-fidelity.** All colours, type sizes, spacing, radii, shadows, copy, and interaction states are final and should be reproduced pixel-accurately. Where the prototype uses placeholder illustrations (the editorial SVGs on Felicia and Lombard carousel slides), they're also final — commissioned artwork of the same style can be swapped in 1:1.

A single exception: the 1-year performance percentages on holding rows and the "▲ £x this month" net-worth figure are hard-coded. Wire these to live data.

---

## Screens / Views

Screen labels match the `data-screen-label` attribute on each screen's root element — searchable across the JSX files.

### Home (`01 Home`)

- **Purpose**: Dashboard — bank balance + investments + active loans + entry points to Investments and Borrowing flows.
- **Layout**: Single scrolling column, 375px design width. Greeting + net-worth hero fades in first, then account rows stagger in (60 ms between rows).
- **Sections** (in order):
  1. Greeting + animated net-worth (Monument-Broad 40 px, `▲ £6,719.20 this month` in success green `#1F7A53`)
  2. "Bank" list-group: Easy Access Savings (£82,140 · 3.52% AER), Easy Access Cash ISA (£20,000 · 3.74% AER)
  3. "Investments" list-group: Stocks & Shares ISA, General Investment Account (hidden if no holdings)
  4. "Pension" list-group: Personal Pension (SIPP)
  5. "Borrowing" list-group (conditional — only if a Lombard loan exists)
  6. "Do more with Monument" list-group: Investments (highlighted with `--color-secondary-200` bg), Borrow against your assets
- **Components**: `<button className="listrow">` rows with icon (44×44 PNG), title (Eina Semibold 16), sub (13, `--color-secondary-500`), value (Monument-Broad), chevron-right.

### Investments landing carousel (`02 Investments landing`)

- 4-slide horizontal carousel intro. Each slide has an editorial SVG illustration (cream card background `#F5F1E8` with flat shapes in Monument teal `#003036`/`#00505A`), a Eina Semibold headline, and body copy.
- "Next" button + page dots.

### Investments picker (`02b Picker`)

- Two large option cards: "Help me pick" (opens Felicia flow) and "Browse funds" (opens fund list). Cream backgrounds, rounded 12px corners.

### Felicia intro (`03 Felicia intro`)

- Full-bleed photograph of Felicia (the human fund expert), name + role caption, "Start" primary CTA.

### Questionnaire flow (`04 Purpose` → `11 Values`)

Seven sequential questions, each on its own screen with a top progress bar:

| Screen | Question | Answer type |
|---|---|---|
| 04 Purpose | What is your main reason for investing right now? | Single-select from 5 options |
| 05 Priority | What matters more to you right now? | Single-select (growth / balanced / protection) |
| 06 Horizon | How long are you looking to stay invested? | Single-select (lt1 / 1to3 / 3to5 / 5to10 / gt10) |
| 07 Risk | If markets fell 20% next year, how would you feel? | Single-select (worried / neutral / confident) |
| 08 Exclusions | Do you want to make any exclusions? | Multi-select (fossil / animal / tobacco / gambling / weapons) |
| 09 Amount | How much are you thinking? | Slider, £1,000 – £250,000 with preset chips |
| 11 Values | What matters most to you? | Multi-select up to 3 |

Between most questions sits a full-bleed **reassurance interstitial** on the primary dark teal `#003036` with a "Our insight" pill, a serif headline, and supporting copy tailored to the user's specific answer. Copy is keyed by `REASSURANCE_COPY[question][answerId]` in `screens-flow.jsx` — use those strings verbatim.

### Processing (`12 Processing`)

5-second animated "Gathering your options" loader with five pill-shaped labels cycling in.

### Result (`13 Result`)

- Serif headline naming the matched fund.
- Card with fund name, manager, 1y / 5y returns, fee, risk level (1–7 bar), minimum.
- "See detail" button → FundDetail; "Invest" button → Amount confirm.
- "Not what you expected?" secondary link opens a sheet with two alternative matches.

### Fund detail

- Sector / region / asset-class donut charts.
- Top-10 holdings list.
- Fund blurb, fee breakdown, FCA / ISIN facts.

### Amount confirm (`invest-amount`)

- Recap: amount, frequency (one-off / monthly), wrapper (ISA if fund uses an ISA wrapper, GIA for PE).
- "Confirm" primary.

### Confirm (`confirm`)

- Success tick, "Your investment is on its way", "Go home" CTA.

### Holding detail (account detail) — `Account · <title>`

- Secondary-100 page background; balance hero in a secondary-200 card with sub-label, big serif value, ▲ £x this month.
- Monthly direct-debit line if present.
- "Holdings" list on secondary-200 rows: name, ticker, 1y performance (green ▲ or red ▼), value.
- Risk disclosure footer.

### Lombard journey (`L01` – `L10`)

1. **L01 Intro carousel** — 3 editorial slides. "Editorial" variant uses illustrated SVGs; "Type" variant uses full-bleed typographic slides. Both supported; the toggle lives in Tweaks.
2. **L02 Capacity** — "YOU COULD BORROW UP TO £X". Lists eligible assets (ISA + GIA, *not* SIPP). Notes pensions are excluded under FCA rules. Rate shown as `BoE + 1.5%`.
3. **L03 Purpose** — single-select list: Home reno / Property deposit / New car / Investment opportunity / Consolidate debt / Tax bill.
4. **L04 Pledge** — **big credit-line hero** (secondary-200 card, 56 px serif amount, progress bar under). Below it: list of eligible assets as toggle tiles. **All assets default to unselected.** CTA disabled until at least one is pledged.
5. **L05 Eligibility** — risk disclosures (margin call risk, CGT implications, "capital at risk").
6. **L06 Approved** — full-bleed success screen (secondary-200), "Your credit line is open".
7. **L07 Drawdown** — amount slider between £500 and the approved capacity.
8. **L08 Repayment preview** — monthly payment + total interest, vs a 9.9% benchmark unsecured rate. Term slider (months).
9. **L09 Review** — summary of purpose, amount, term, pledged assets, monthly payment.
10. **L10 Success** — "Funds on their way to your Easy Access Savings within 1 working day".

---

## Interactions & Behavior

- **Screen transitions**: push-left / push-right slide (`transform: translateX(...)`). Entry flow and Lombard flow each handle their own transitions in `app.jsx` → `renderPrevScreen`.
- **Staggered reveals on home**: rows fade + translate-y in with `--d` custom-property delay. Plays once per session (gated by `sessionStorage.inv_home_seen`).
- **Persistent state**: `localStorage.inv_proto_v1` keeps route, answers, holdings, loans, and lombard drawdown across reloads. "Reset" in the Profile tab clears it.
- **Keyboard**: arrow keys skip forward/back through `STEP_ORDER` for reviewer convenience. Not needed in production.
- **Reassurance copy** is determined by `(question, answerId)` lookup — single-select uses the `answerId` directly; multi-select uses `_any` or `_none`. Always has a `_default` fallback. See `getReassureCopy()` in `screens-flow.jsx`.
- **Fund matching**: `matchFunds()` in `funds.jsx` ranks funds by archetype match to the user's purpose/horizon/priority answers. Top result shown on `13 Result`; remaining two offered as "alternative matches".
- **Eligible collateral**: bank accounts at 100% + all investment wrappers except the SIPP. Max LTV is 0.5 applied to the pledged subtotal. See `getEligibleAssets()` in `accounts.jsx`.
- **No CSS wrap tricks**: all question / reassurance titles break naturally — no `text-wrap: balance/pretty`, no hard `\n` line breaks.

---

## State Management

All state lives in one top-level `<App>` in `app.jsx`:

```js
route     : { name: string, ...params }          // current screen
answers   : INITIAL_ANSWERS                       // all questionnaire answers
holdings  : [{ fundId, fundName, amount, frequency, placedAt }]
loans     : [{ amount, term, purpose, pledged, placedAt }]
lombard   : { purpose, amount, term, pledged }    // in-flight draft
```

Persisted to `localStorage` on every change. Validated against `VALID_ROUTES` on load.

In a real codebase this should map to whatever state container you use (Redux slice, Zustand store, SwiftUI `@ObservableObject`, etc.). The **logical** split is:

- Account store (seeded investment wrappers + bank accounts) — backend-owned, read-only
- Invest flow draft (answers + amount) — discardable on exit
- Lombard flow draft (purpose + amount + pledged + term) — discardable on exit
- Committed holdings and loans — backend-owned

---

## Design Tokens

### Colours (from `ds/colors_and_type.css`)

```
--color-primary-900    #00181B
--color-primary-800    #002126
--color-primary-700    #002A30
--color-primary-600    #003036   /* primary brand teal */
--color-primary-500    #00505A
--color-primary-400    #66969C
--color-primary-300    #99B9BD
--color-primary-200    #CCDCDE
--color-primary-100    #E5EEEF

--color-secondary-50   #FEFDFB
--color-secondary-100  #FDFAF5   /* page background (cream) */
--color-secondary-200  #F5F1E8   /* card / hero background (warm paper) */
--color-secondary-300  #EDE8DA
--color-secondary-400  #D8D1C0
--color-secondary-500  #66969C   /* repurposed as muted label colour */

--color-success        #1F7A53
--color-error          #A33636
--color-accent-sand    #A36300
```

### Typography

Two font families — **Monument-Broad** (display serif, for numbers and hero titles) and **Eina** (UI sans, body + labels). Both served from `ds/fonts/`.

- `title1-display`: Monument-Broad 40/44, -1px letter-spacing — hero numbers
- `title2-display`: Monument-Broad 28/32 — screen titles (`.q-title`)
- `title1-meta`: Eina Semibold 32/36, -0.5px — balance readouts
- `body`: Eina Regular 16/24
- `body-sm`: Eina Regular 14/20
- `label`: Eina Semibold 12, 1.2px letter-spacing, uppercase

### Spacing / radius / shadow

- 4 px base unit
- Container padding: 16 px horizontal on lists, 24 px on hero blocks
- Card radius: 12 px (list rows), 16 px (hero cards), 999 px (pills)
- No elevation shadows in this design — separation is colour-driven

---

## Assets

- **Icons** (`assets/icons/`): PNG, 88×88 source, displayed at 44×44. Used on home list-rows for "Investments" and "Borrow against your assets".
- **Monument logo**: `ds/monument-logo-small-black.png`.
- **Felicia**: `assets/felicia-photo.png` — headshot used on `FeliciaIntro` screen. Replace with a real commissioned photo if/when available.
- **Lottie** folder (`assets/lottie/`): present but currently unused — reserved for a possible future animated loader.
- **Fund-detail donut + bar charts** are drawn inline with SVG in `screens-result.jsx`. No external chart lib.
- **Editorial illustrations** (Lombard carousel, Felicia question screens) are inline SVG defined in `screens-lombard.jsx` and `screens-entry.jsx` (`IllusKeepGrowing`, `IllusRateCompare`, `IllusTaxEfficient`, `IllusCommittee`, `IllusInsight`, `IllusGoals`, `IllusPicker`). These are final commissioned artwork; reproduce verbatim or swap for equivalents.

---

## Files

Top-level app files:

- `app.html` — entry HTML. Pins React 18.3.1 + Babel 7.29.0 and loads the `.jsx` files in dependency order.
- `app.jsx` — `<App>` root, routing, state, persistence.
- `shared.jsx` — `StatusBar`, `PhoneFrame`, `TopBar`, `Button`, `ChevR`, `ArrowLeft`, `CloseX`, `TickIcon`, `fmtGBP`, `fmtPct`.
- `accounts.jsx` — single source of truth for bank + investment accounts. `BANK_ACCOUNTS`, `INVESTMENT_WRAPPERS`, `getInvestmentAccounts(holdings)`, `getEligibleAssets(holdings)`, `getTotalAssets(holdings)`.
- `funds.jsx` — the three real funds with top-10 holdings, sector / region / asset breakdowns, fees, returns. Plus `matchFunds(answers)`.
- `screens-entry.jsx` — home, landing carousel, picker, why-invest sheet, account (holding) detail.
- `screens-flow.jsx` — Felicia intro, all 7 questions, reassurance interstitials, processing loader.
- `screens-result.jsx` — result card, fund detail, amount confirm, post-invest confirm.
- `screens-lombard.jsx` — the entire 10-screen Lombard journey + shared constants (`MAX_LTV`, `BOE_RATE`, `LOMBARD_APR`, `LOMBARD_PURPOSES`).
- `styles.css` — main stylesheet.
- `styles-mobile.css` — mobile-viewport overrides.
- `ds/colors_and_type.css` — design tokens (colours + type scale).
- `ds/fonts/` — Monument-Broad and Eina font files.
- `manifest.webmanifest` — PWA manifest (the prototype can be installed to homescreen for demos).

To run locally: open `app.html` in any browser. No install, no build. `Investments Prototype.html` (not shipped in this handoff) is an older single-file variant — ignore it.
