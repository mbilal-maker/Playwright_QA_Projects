# API + UI Testing with Playwright

This project is prepared for **Node.js v22.15.0** and uses the installed **Google Chrome** browser.

## How it works

1. `auth.setup.js` logs in through the API once.
2. It writes the JWT token into `playwright/.auth/user.json` as local storage state.
3. The `google-chrome` project loads that state for every UI test.
4. Tests start directly from the authenticated dashboard without UI login.

## Installation

```powershell
npm ci
```

Use this new extracted folder instead of the older `API-UI-Testing-Playwright` folder. Do not copy its old `node_modules` or `package-lock.json`.

Do not run `npm update`; Playwright is deliberately pinned to version `1.60.0` for Node.js `22.15.0` compatibility.

## Environment file

```powershell
Copy-Item .env.example .env
```

Update `.env` with a valid account:

```env
BASE_URL=https://rahulshettyacademy.com
E2E_USER_EMAIL=your-email
E2E_USER_PASSWORD=your-password
HEADLESS=false
```

## Verify versions and test discovery

```powershell
node -v
npx playwright --version
npm run test:list
```

Expected versions:

```text
Node: v22.15.0
Playwright: Version 1.60.0
```

## Run in installed Google Chrome

```powershell
npm test
```

Other commands:

```powershell
npm run test:dashboard
npm run test:orders
npm run auth
npm run report
```

Google Chrome must already be installed on the laptop. Because the project uses `channel: 'chrome'`, downloading Playwright Chromium is not required.

## Clean reinstall if an older Playwright version is cached

```powershell
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
npm ci
npx playwright --version
```
