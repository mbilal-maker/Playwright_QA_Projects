const base = require('@playwright/test');
const { PageObjectManager } = require('../pages/pageObjectManager');

const test = base.test.extend({
  poManager: async ({ page }, use) => {
    const poManager = new PageObjectManager(page);
    await use(poManager);
  }
});

module.exports = { test, expect: base.expect };
