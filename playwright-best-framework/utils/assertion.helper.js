const { expect } = require('@playwright/test');

class AssertionHelper {
  static async expectText(locator, expectedText) {
    await expect(locator).toHaveText(expectedText);
  }

  static async expectVisible(locator) {
    await expect(locator).toBeVisible();
  }
}

module.exports = { AssertionHelper };
