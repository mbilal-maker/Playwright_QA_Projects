const { expect } = require('@playwright/test');

class DashboardPage {
  constructor(page) {
    this.page = page;
    this.productCards = page.locator('.card-body');
    this.productNames = page.locator('.card-body b');
    this.cartButton = page.locator("[routerlink*='cart']");
    this.ordersButton = page.locator("button[routerlink*='myorders']");
  }

  async open() {
    await this.page.goto('/client');
    await expect(this.page).toHaveURL(/\/client/);
    await expect(this.productCards.first()).toBeVisible();
  }

  async verifyAuthenticated() {
    await expect(this.page.locator('#userEmail')).toHaveCount(0);
    await expect(this.productCards.first()).toBeVisible();
  }

  async getProductNames() {
    return this.productNames.allTextContents();
  }

  async addProductToCart(productName) {
    const productCard = this.productCards.filter({
      has: this.page.locator('b', { hasText: productName })
    });

    await expect(productCard).toHaveCount(1);
    await productCard.getByRole('button', { name: /add to cart/i }).click();
  }

  async openCart() {
    await this.cartButton.click();
  }

  async openOrders() {
    await this.ordersButton.click();
  }
}

module.exports = { DashboardPage };
