# Playwright All Common Actions Example

This project contains working Playwright examples for the most common QA automation actions:

- `goto`, `reload`, `goBack`, `goForward`
- `click`, `dblclick`, `hover`, `tap`
- `fill`, `clear`, `focus`, `blur`
- `press`, `pressSequentially`, `keyboard.type`, `keyboard.press`, `keyboard.down`, `keyboard.up`
- `check`, `uncheck`, `setChecked`, `selectOption`
- `setInputFiles`
- `dragTo`
- `mouse.move`, `mouse.click`, `mouse.wheel`
- `waitFor`, `waitForURL`, `waitForResponse`, `waitForLoadState`
- `screenshot`, `locator.screenshot`
- `frameLocator`
- `dialog.accept`
- popup/new tab handling
- `request.get`
- `route` and `route.fulfill`

## Requirements

- Node.js 20 LTS recommended
- Google Chrome installed on your laptop

## Install

```bash
npm install
```

## Run all tests

```bash
npm test
```

## Run one file

```bash
npx playwright test tests/01-saucedemo-basic-actions.spec.js
```

## Run with debug mode

```bash
npm run test:debug
```

## Open HTML report

```bash
npm run report
```

## Browser setting

The project is configured to run on installed Google Chrome:

```js
channel: 'chrome'
```

You can see this in `playwright.config.js`.
