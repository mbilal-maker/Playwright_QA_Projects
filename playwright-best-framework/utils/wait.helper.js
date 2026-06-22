const { expect } = require('@playwright/test');

class WaitHelper {
  static async waitForLoaderToDisappear(loaderLocator, timeout = 15000) {
    await expect(loaderLocator).toBeHidden({ timeout });
  }
}

module.exports = { WaitHelper };
