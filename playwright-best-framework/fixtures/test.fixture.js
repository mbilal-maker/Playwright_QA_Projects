const base = require('@playwright/test');
const { PageObjectManager } = require('../pages/pageObjectManager');

const test = base.test.extend({
  poManager: async ({ page }, use) => {
    await use(new PageObjectManager(page));
  }
});

module.exports = { test, expect: base.expect };
