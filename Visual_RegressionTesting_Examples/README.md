# SauceDemo Visual Regression — Installed Google Chrome

This project runs Playwright visual regression tests against **https://www.saucedemo.com** using the **Google Chrome browser installed on your Windows laptop**.

## Run it

```powershell
npm install
npm test
```

`npm test` is intentionally safe for a first run:

1. It checks whether all Windows/Chrome baseline images exist.
2. If they are missing, it creates them with `--update-snapshots`.
3. It immediately runs the suite again in normal comparison mode.
4. Future `npm test` runs only compare current screenshots against the saved baselines.

You can also double-click `setup-and-run.cmd`.

## Browser configuration

The project uses:

```javascript
browserName: 'chromium',
channel: 'chrome'
```

There is no Linux browser path and no Playwright-managed Chromium requirement. Google Chrome must already be installed.

## Covered scenarios

- Login page screenshot
- Dashboard/inventory screenshot
- Empty-cart state
- Invalid-login error state
- Desktop and mobile layouts
- Dynamic timestamp masking
- Username masking
- Component-only screenshot
- Animation handling
- Locked-user error state

## Commands

```powershell
npm test                 # Auto-create missing baselines, then compare
npm run test:compare     # Compare only; fails when a baseline is missing
npm run test:update      # Intentionally update approved baselines
npm run test:desktop     # Desktop Chrome project
npm run test:mobile      # Mobile viewport in installed Chrome
npm run test:debug       # Playwright Inspector
npm run test:ui          # Playwright UI mode
npm run report           # Open HTML report
npm run reset            # Delete baselines and reports
```

## Baseline strategy

Do not update baselines merely to make failures pass. For a future visual mismatch:

1. Run `npm run report`.
2. Review expected, actual, and diff images.
3. Fix the application when the change is unintended.
4. Use `npm run test:update` only when the UI change is approved.
5. Review and commit the changed PNG baselines with the related change.

Baselines are stored separately for desktop/mobile projects and for the Windows platform.
