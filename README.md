# Monument Investments Prototype

Self-contained interactive prototype. Open `app.html` in a browser (or serve via any static host).

## Files
- `app.html` — entry point, loads all scripts
- `app.jsx` — root app + router + Tweaks panel
- `screens-entry.jsx` — home, onboarding, investments carousel
- `screens-flow.jsx` — investment flow (amount, funds, review)
- `screens-lombard.jsx` — lending flow (borrow carousel, drawdown)
- `screens-result.jsx` — success screens
- `accounts.jsx`, `funds.jsx`, `shared.jsx` — data + shared components
- `styles.css`, `styles-mobile.css` — styling
- `assets/` — images, icons, brand assets
- `ds/` — design-system reference files

## Stack
React 18 + Babel Standalone, loaded via CDN. No build step required.
