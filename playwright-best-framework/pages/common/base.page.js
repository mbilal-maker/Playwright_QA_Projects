const { expect } = require('@playwright/test');

class BasePage {
  constructor(page) {
    this.page = page;
  }

  async open(path = '/') {
    await this.page.goto(path, {
      waitUntil: 'domcontentloaded',
      timeout: 60_000
    });
  }

  async verifyPageTitleContains(titlePart) {
    await expect(this.page).toHaveTitle(new RegExp(titlePart));
  }
}

module.exports = { BasePage };
