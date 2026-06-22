const { expect } = require('@playwright/test');

class CartPage {
  constructor(page) {
    this.page = page;
    this.cartItems = page.locator('div li');
  }

  async verifyProductIsDisplayed(productName) {
    await expect(this.cartItems.first()).toBeVisible();
    await expect(
      this.page.locator('h3', { hasText: productName })
    ).toBeVisible();
  }
}

module.exports = { CartPage };
