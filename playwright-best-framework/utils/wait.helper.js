const { expect } = require('@playwright/test');

class WaitHelper {
  static async waitForLoaderToDisappear(loader, timeout = 15000) {
    await expect(loader).toBeHidden({ timeout });
  }

  static async waitForPageReady(page) {
    await page.waitForLoadState('domcontentloaded');
  }
}

module.exports = { WaitHelper };
