const { expect } = require('@playwright/test');

class AssertionHelper {
  static async expectVisible(locator, options) {
    await expect(locator).toBeVisible(options);
  }

  static async expectHidden(locator, options) {
    await expect(locator).toBeHidden(options);
  }

  static async expectText(locator, expectedText, options) {
    await expect(locator).toHaveText(expectedText, options);
  }
}

module.exports = { AssertionHelper };
