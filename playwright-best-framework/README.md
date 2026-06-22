# Playwright Best Framework Example - v3

This framework uses a local spinner demo page, so tests do not fail because of external website downtime or changed headings.

## Run

```bash
npm install
npm run test:chrome
```

## Framework Architecture Answers

### How would you design a Playwright automation framework from scratch?
Create separate layers for tests, page objects, fixtures, test data, configuration, and utilities. Tests should describe business scenarios. Page Objects should expose actions and page-level assertions. Fixtures should manage reusable setup. Config files should control environment and browser execution.

### What folders would you include in a scalable framework?
- `tests/` for spec files
- `pages/` for Page Objects
- `fixtures/` for custom Playwright fixtures
- `data/` for environment files and test data
- `config/` for environment loading
- `utils/` for common helpers
- `docs/` for framework documentation
- `apps/` for local demo apps or test fixtures

### What is the Page Object Model?
Page Object Model is a design pattern where each page or component is represented by a class. Locators and page-specific actions are kept inside that class, while tests call readable methods.

### What logic should not be placed inside a Page Object?
Do not place test scenario flow, test data generation, API setup, database logic, cross-page business workflows, or assertions unrelated to the page/component inside a Page Object.

### What is a Page Object Manager?
A Page Object Manager is a factory class that creates and provides Page Object instances from one place. It reduces repeated object creation in tests.

### How do you prevent duplicated code across tests?
Use Page Objects, fixtures, utility helpers, shared test data, reusable assertions, and common setup functions.

### How do you manage environment-specific configuration?
Keep environment files such as `qa.json` and `staging.json`, then load the correct file using an environment variable like `TEST_ENV=qa`.

### How do you separate test data from test logic?
Keep data in JSON files under `data/test-data/`. Tests import the required data and use it without hardcoding values in the test flow.

### How do you create reusable fixtures?
Use `base.test.extend()` from Playwright and expose reusable objects such as `poManager`, authenticated pages, API clients, or test users.

### When would you use custom fixtures instead of beforeEach?
Use custom fixtures when setup is reusable across many test files, when setup has dependencies, or when you want clean test signatures. Use `beforeEach` for simple local setup inside one spec file.

### How do you support multiple applications or modules in one framework?
Create separate folders under `pages/` and `tests/` for each application/module, and manage base URLs through environment configuration.

### How do you enforce coding standards in an automation project?
Use consistent naming, Page Object rules, code review, ESLint/Prettier, pull request checks, CI execution, and framework documentation.
