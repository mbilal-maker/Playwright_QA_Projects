# Playwright Best Framework Example

This is a scalable Playwright JavaScript framework example for a Senior SQA role. It uses:

- Page Object Model
- Page Object Manager
- Custom fixtures
- Environment-specific configuration
- External test data
- Reusable helpers
- Chrome execution on your local laptop
- ESLint and Prettier coding standards

## Test Website

Base URL:

```text
https://practice.expandtesting.com
```

Spinner example used:

```text
https://practice.expandtesting.com/dynamic-loading/1
```

## Installation

```bash
npm install
```

## Run Tests on Installed Google Chrome

```bash
npm run test:chrome
```

## Run Headed Mode

```bash
npm run test:headed
```

## Open Playwright UI Mode

```bash
npm run test:ui
```

## View HTML Report

```bash
npm run report
```

---

# Framework Architecture Answers

## 1. How would you design a Playwright automation framework from scratch?

I would design it using a layered architecture:

1. **Tests layer**: Contains only test scenarios and assertions at business-flow level.
2. **Page Object layer**: Contains page locators and page-specific actions.
3. **Fixtures layer**: Provides reusable setup, objects, and dependencies to tests.
4. **Utilities layer**: Contains reusable helpers such as wait handling, assertions, API helpers, date helpers, and data generators.
5. **Configuration layer**: Handles environment-specific URLs, timeouts, browser settings, retries, reports, traces, screenshots, and videos.
6. **Test data layer**: Stores static or reusable data separately from test logic.
7. **Reporting/CI layer**: Generates HTML reports and supports CI execution.

This structure keeps the framework maintainable, reusable, and scalable.

---

## 2. What folders would you include in a scalable framework?

Recommended structure:

```text
playwright-best-framework-example/
│
├── config/
│   └── env.config.js
│
├── data/
│   ├── env/
│   │   ├── qa.json
│   │   └── staging.json
│   └── test-data/
│       └── dynamicLoading.data.json
│
├── fixtures/
│   └── test.fixture.js
│
├── pages/
│   ├── common/
│   │   └── base.page.js
│   ├── dynamic-loading/
│   │   └── dynamicLoading.page.js
│   └── pageObjectManager.js
│
├── tests/
│   └── ui/
│       └── dynamicLoading.spec.js
│
├── utils/
│   ├── assertion.helper.js
│   └── wait.helper.js
│
├── playwright.config.js
├── package.json
├── .env.example
├── .gitignore
├── .eslintrc.json
└── .prettierrc
```

---

## 3. What is the Page Object Model?

Page Object Model is a design pattern where each application page or component has a dedicated class. That class stores locators and page-specific actions.

Example from this framework:

```javascript
class DynamicLoadingPage {
  constructor(page) {
    this.page = page;
    this.startButton = page.getByRole('button', { name: 'Start' });
    this.loadingSpinner = page.locator('#loading');
    this.resultText = page.locator('#finish');
  }
}
```

Benefits:

- Reduces duplicate locators
- Improves maintainability
- Keeps tests readable
- Makes UI changes easier to handle

---

## 4. What logic should not be placed inside a Page Object?

A Page Object should not contain:

- Test assertions for business rules, unless they are simple page-level verification methods
- Test data
- Environment configuration
- API test logic unrelated to the page
- Complex business decisions
- Test orchestration involving multiple unrelated modules
- Hardcoded credentials
- Reporting logic

Page Objects should focus on page locators and page-level actions.

---

## 5. What is a Page Object Manager?

A Page Object Manager is a central class that creates and provides page objects to tests. Instead of creating every page object inside each test file, tests ask the manager for the required page.

Example:

```javascript
const dynamicLoadingPage = poManager.getDynamicLoadingPage();
```

Benefits:

- Avoids repeated page object initialization
- Keeps tests clean
- Centralizes object creation
- Supports large frameworks with many pages

---

## 6. How do you prevent duplicated code across tests?

Use:

- Page Objects for reusable UI actions
- Custom fixtures for reusable setup
- Utility/helper classes for common waits and assertions
- External test data files
- Base page classes for shared page actions
- Config files for common settings

Example:

```javascript
await dynamicLoadingPage.waitForSpinnerDisappear();
```

Instead of repeating spinner wait logic in every test.

---

## 7. How do you manage environment-specific configuration?

Use environment files and read them from the Playwright config.

Example:

```text
data/env/qa.json
data/env/staging.json
```

Run with:

```bash
ENV=qa npm run test:chrome
```

In Windows PowerShell:

```powershell
$env:ENV="qa"; npm run test:chrome
```

The framework reads the selected environment from `config/env.config.js`.

---

## 8. How do you separate test data from test logic?

Keep test data in JSON, CSV, database, API, or fixture files instead of hardcoding it in tests.

Example:

```javascript
const dynamicLoadingData = require('../../data/test-data/dynamicLoading.data.json');
```

Test data file:

```json
{
  "expectedResultText": "Hello World!"
}
```

This improves maintainability and makes tests easier to reuse with multiple data sets.

---

## 9. How do you create reusable fixtures?

Use Playwright `test.extend()` to create custom fixtures.

Example from this framework:

```javascript
const test = base.test.extend({
  poManager: async ({ page }, use) => {
    const poManager = new PageObjectManager(page);
    await use(poManager);
  }
});
```

Now every test can directly use:

```javascript
test('example', async ({ poManager }) => {
  const page = poManager.getDynamicLoadingPage();
});
```

---

## 10. When would you use custom fixtures instead of beforeEach?

Use custom fixtures when setup is reusable, dependency-based, or needed across multiple test files.

Custom fixtures are better for:

- Page Object Manager creation
- Authenticated sessions
- Test users
- API clients
- Database connections
- Reusable module setup
- Multi-role testing

Use `beforeEach` for simple setup that applies only to one test file.

---

## 11. How do you support multiple applications or modules in one framework?

Use modular folder structure and separate page objects by application/module.

Example:

```text
pages/
├── admin-app/
├── customer-app/
├── merchant-app/
└── common/
```

Environment config can hold multiple base URLs:

```json
{
  "customerBaseURL": "https://customer.example.com",
  "adminBaseURL": "https://admin.example.com"
}
```

Tests can then select the correct module through fixtures or page managers.

---

## 12. How do you enforce coding standards in an automation project?

Use:

- ESLint for code quality rules
- Prettier for formatting
- Git hooks for pre-commit checks
- Code reviews
- Naming conventions
- Folder structure guidelines
- Pull request templates
- CI pipeline checks

This framework includes:

```text
.eslintrc.json
.prettierrc
```

Run:

```bash
npm run lint
npm run format
```

---

# Spinner Handling Best Practice

For loading spinners, avoid fixed waits like this:

```javascript
await page.waitForTimeout(5000);
```

Recommended approach:

```javascript
await expect(spinner).toBeHidden();
await expect(resultText).toBeVisible();
```

This waits only as long as needed and makes the test stable.

---

# Interview Style Answer

A scalable Playwright framework should be designed with clear separation of concerns. Tests should contain only business scenarios, Page Objects should contain page locators and page actions, fixtures should provide reusable setup, utilities should handle common reusable logic, and environment/test data should be kept outside the test files. I prefer using custom fixtures and a Page Object Manager to reduce duplicated object creation and keep test files clean. For maintainability, I enforce coding standards using ESLint, Prettier, Git reviews, and CI checks.
