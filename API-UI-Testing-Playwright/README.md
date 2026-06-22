# API + UI Testing with Playwright

This standalone project logs in through the API once at the beginning of a test run, stores the authenticated browser state, and starts every UI test on an authenticated dashboard.

## Execution flow

```text
setup project
  -> POST /api/ecom/auth/login
  -> receive JWT token
  -> place token in localStorage
  -> save playwright/.auth/user.json

chromium project
  -> create a fresh browser context for each test
  -> preload saved authentication state
  -> open /client directly as an authenticated user
```

The user is not logged in through the UI in any dashboard test.

## Project structure

```text
API-UI-Testing-Playwright/
├── pages/
│   ├── cart.page.js
│   ├── dashboard.page.js
│   └── orders.page.js
├── playwright/
│   └── .auth/
├── tests/
│   ├── auth.setup.js
│   ├── dashboard.spec.js
│   └── orders.spec.js
├── utils/
│   └── api-client.js
├── .env.example
├── .gitignore
├── package.json
└── playwright.config.js
```

## Setup

```bash
npm install
npx playwright install chromium
```

Create the environment file.

Windows Command Prompt:

```cmd
copy .env.example .env
```

PowerShell:

```powershell
Copy-Item .env.example .env
```

macOS/Linux:

```bash
cp .env.example .env
```

Update `.env` with a valid test account:

```env
BASE_URL=https://rahulshettyacademy.com
E2E_USER_EMAIL=your-test-user@example.com
E2E_USER_PASSWORD=your-test-password
HEADLESS=false
```

## Run tests

Run all tests:

```bash
npm test
```

Run in headed mode:

```bash
npm run test:headed
```

Run only dashboard examples:

```bash
npm run test:dashboard
```

Run only order examples:

```bash
npm run test:orders
```

## Authentication behavior

`tests/auth.setup.js` executes before the Chromium project because Chromium declares `dependencies: ['setup']` in `playwright.config.js`.

The setup test logs in through the API and writes the resulting browser state to:

```text
playwright/.auth/user.json
```

Every regular test automatically receives that state through:

```javascript
storageState: authFile
```

Each test still receives a fresh browser context, so browser data created during one test does not leak into another test. The original authenticated state is reused as the starting point.

## Security

Never commit these files:

```text
.env
playwright/.auth/user.json
```

Both are excluded through `.gitignore`. The authentication state can contain a reusable access token.
