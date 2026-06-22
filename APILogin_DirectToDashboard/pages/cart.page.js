const { expect } = require('@playwright/test');

class CartPage {
  constructor(page) {
    this.page = page;
    this.cartRows = page.locator('div.cartSection h3');
  }

  async verifyProductIsDisplayed(productName) {
    await expect(
      this.cartRows.filter({ hasText: productName })
    ).toBeVisible();
  }
}

module.exports = { CartPage };
